'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { DeliveryLocation, Language, Currency, MeasurementUnit } from '@prisma/client'
import type { CustomerProfile, MeasurementProfile, Location, Currency as OrderCurrency } from '@/data/adminOrdersData'
import type { AdminCustomer } from '@/data/adminCustomersData'

function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch {
        // Ignore outside Next.js request context
    }
}

export interface DbCustomerItem extends CustomerProfile {
    firstName: string
    lastName: string
    hasSavedMeasurements: boolean
    createdAt: string
    updatedAt: string
    measurementDate?: string
}

/**
 * Server Action: Fetch all customers from PostgreSQL via Prisma
 * Strictly returns only database-persisted customers with their latest measurements.
 */
export async function getAllCustomersAdminAction(): Promise<{
    success: boolean
    customers: DbCustomerItem[]
    error?: string
}> {
    try {
        const dbCustomers = await prisma.customer.findMany({
            include: {
                measurements: true,
                _count: {
                    select: { orders: true, referralsSent: true, reviews: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        const mapped: DbCustomerItem[] = dbCustomers.map((c) => {
            const hasMeas = !!c.measurements
            const meas = c.measurements

            const unit: 'cm' | 'inches' = meas?.unit === MeasurementUnit.INCHES ? 'inches' : 'cm'
            const savedMeasurements: MeasurementProfile = {
                chest: meas?.chest ?? (unit === 'cm' ? 102 : 40),
                shoulder: meas?.shoulder ?? (unit === 'cm' ? 45 : 18),
                sleeve: meas?.sleeveLength ?? (unit === 'cm' ? 62 : 25),
                waist: meas?.waist ?? (unit === 'cm' ? 84 : 34),
                hips: meas?.hips ?? (unit === 'cm' ? 100 : 40),
                inseam: meas?.inseam ?? (unit === 'cm' ? 80 : 32),
                neck: meas?.neck ?? (unit === 'cm' ? 40 : 16),
                length: meas?.length ?? (unit === 'cm' ? 105 : 42),
                unit: unit,
                fitNotes: meas?.fitNotes || '',
                measuredAt: meas?.measuredAt ? meas.measuredAt.toISOString() : undefined,
                updatedAt: meas?.updatedAt ? meas.updatedAt.toISOString() : undefined,
            }

            const fullName = `${c.firstName} ${c.lastName}`.trim()
            const location: Location = c.deliveryLocation === DeliveryLocation.ITALY ? 'Italy' : 'Nigeria'
            const currency: OrderCurrency = c.preferredCurrency === Currency.EUR ? 'EUR' : 'NGN'
            const language: 'English' | 'Italian' = c.preferredLang === Language.IT ? 'Italian' : 'English'

            return {
                id: c.id,
                name: fullName,
                firstName: c.firstName,
                lastName: c.lastName,
                phone: c.phone,
                whatsapp: c.whatsapp || c.phone,
                email: c.email || '',
                location,
                address: c.deliveryAddress || '',
                language,
                currency,
                savedMeasurements,
                hasSavedMeasurements: hasMeas,
                measurementDate: meas?.updatedAt?.toISOString() || meas?.measuredAt?.toISOString(),
                totalOrders: c._count?.orders ?? 0,
                createdAt: c.createdAt.toISOString(),
                updatedAt: c.updatedAt.toISOString(),
            }
        })

        return { success: true, customers: mapped }
    } catch (err: any) {
        console.error('Error fetching customers from database:', err)
        return { success: false, customers: [], error: err.message || 'Failed to fetch customers from database' }
    }
}

/**
 * Server Action: Update or insert customer measurements in the database.
 */
export async function updateCustomerMeasurementAction(
    customerId: string,
    measurements: {
        unit: 'cm' | 'inches'
        chest: number
        shoulder: number
        sleeve: number
        waist: number
        hips: number
        inseam: number
        neck: number
        length: number
        bicep?: number
        wrist?: number
        trouserLength?: number
        thigh?: number
        fitNotes?: string
    }
): Promise<{ success: boolean; updatedAt?: string; error?: string }> {
    try {
        if (!customerId) {
            return { success: false, error: 'Customer ID is required' }
        }

        const unitEnum = measurements.unit === 'inches' ? MeasurementUnit.INCHES : MeasurementUnit.CM
        const now = new Date()

        const saved = await prisma.measurement.upsert({
            where: { customerId },
            update: {
                unit: unitEnum,
                chest: Number(measurements.chest) || null,
                shoulder: Number(measurements.shoulder) || null,
                sleeveLength: Number(measurements.sleeve) || null,
                waist: Number(measurements.waist) || null,
                hips: Number(measurements.hips) || null,
                inseam: Number(measurements.inseam) || null,
                neck: Number(measurements.neck) || null,
                length: Number(measurements.length) || null,
                bicep: measurements.bicep != null ? Number(measurements.bicep) : undefined,
                wrist: measurements.wrist != null ? Number(measurements.wrist) : undefined,
                trouserLength: measurements.trouserLength != null ? Number(measurements.trouserLength) : undefined,
                thigh: measurements.thigh != null ? Number(measurements.thigh) : undefined,
                fitNotes: measurements.fitNotes || '',
                measuredAt: now,
                updatedAt: now,
            },
            create: {
                customerId,
                unit: unitEnum,
                chest: Number(measurements.chest) || null,
                shoulder: Number(measurements.shoulder) || null,
                sleeveLength: Number(measurements.sleeve) || null,
                waist: Number(measurements.waist) || null,
                hips: Number(measurements.hips) || null,
                inseam: Number(measurements.inseam) || null,
                neck: Number(measurements.neck) || null,
                length: Number(measurements.length) || null,
                bicep: measurements.bicep != null ? Number(measurements.bicep) : null,
                wrist: measurements.wrist != null ? Number(measurements.wrist) : null,
                trouserLength: measurements.trouserLength != null ? Number(measurements.trouserLength) : null,
                thigh: measurements.thigh != null ? Number(measurements.thigh) : null,
                fitNotes: measurements.fitNotes || '',
                measuredAt: now,
            },
        })

        safeRevalidatePath('/admin/orders/new')
        safeRevalidatePath('/admin/orders')
        safeRevalidatePath('/admin/customers')
        safeRevalidatePath(`/admin/customers/${customerId}`)

        return { success: true, updatedAt: saved.updatedAt.toISOString() }
    } catch (err: any) {
        console.error('Error updating customer measurements:', err)
        return { success: false, error: err.message || 'Failed to save measurements to database' }
    }
}

export interface CreateCustomerPayload {
    name: string
    phone: string
    whatsapp?: string
    email?: string
    location: 'Italy' | 'Nigeria'
    address: string
    language?: 'English' | 'Italian'
    currency?: 'EUR' | 'NGN'
    measurements?: {
        unit: 'cm' | 'inches'
        chest: number
        shoulder: number
        sleeve: number
        waist: number
        hips: number
        inseam: number
        neck: number
        length: number
        fitNotes?: string
    }
}

/**
 * Server Action: Create a new customer in the database.
 */
export async function createCustomerAction(payload: CreateCustomerPayload): Promise<{
    success: boolean
    customer?: DbCustomerItem
    error?: string
}> {
    try {
        if (!payload.name?.trim()) {
            return { success: false, error: 'Customer name is required' }
        }
        if (!payload.phone?.trim()) {
            return { success: false, error: 'Phone number is required' }
        }

        const nameParts = payload.name.trim().split(' ')
        const firstName = nameParts[0] || 'Patron'
        const lastName = nameParts.slice(1).join(' ') || ''

        const deliveryLocation = payload.location === 'Italy' ? DeliveryLocation.ITALY : DeliveryLocation.NIGERIA
        const preferredLang = payload.language === 'Italian' ? Language.IT : Language.EN
        const preferredCurrency = payload.currency === 'EUR' ? Currency.EUR : Currency.NGN

        const created = await prisma.customer.create({
            data: {
                firstName,
                lastName,
                phone: payload.phone.trim(),
                whatsapp: payload.whatsapp?.trim() || payload.phone.trim(),
                email: payload.email?.trim() || null,
                deliveryLocation,
                deliveryAddress: payload.address || '',
                preferredLang,
                preferredCurrency,
                ...(payload.measurements
                    ? {
                          measurements: {
                              create: {
                                  unit: payload.measurements.unit === 'inches' ? MeasurementUnit.INCHES : MeasurementUnit.CM,
                                  chest: Number(payload.measurements.chest) || null,
                                  shoulder: Number(payload.measurements.shoulder) || null,
                                  sleeveLength: Number(payload.measurements.sleeve) || null,
                                  waist: Number(payload.measurements.waist) || null,
                                  hips: Number(payload.measurements.hips) || null,
                                  inseam: Number(payload.measurements.inseam) || null,
                                  neck: Number(payload.measurements.neck) || null,
                                  length: Number(payload.measurements.length) || null,
                                  fitNotes: payload.measurements.fitNotes || '',
                              },
                          },
                      }
                    : {}),
            },
            include: {
                measurements: true,
            },
        })

        const unit: 'cm' | 'inches' = created.measurements?.unit === MeasurementUnit.INCHES ? 'inches' : 'cm'
        const savedMeasurements: MeasurementProfile = {
            chest: created.measurements?.chest ?? (unit === 'cm' ? 102 : 40),
            shoulder: created.measurements?.shoulder ?? (unit === 'cm' ? 45 : 18),
            sleeve: created.measurements?.sleeveLength ?? (unit === 'cm' ? 62 : 25),
            waist: created.measurements?.waist ?? (unit === 'cm' ? 84 : 34),
            hips: created.measurements?.hips ?? (unit === 'cm' ? 100 : 40),
            inseam: created.measurements?.inseam ?? (unit === 'cm' ? 80 : 32),
            neck: created.measurements?.neck ?? (unit === 'cm' ? 40 : 16),
            length: created.measurements?.length ?? (unit === 'cm' ? 105 : 42),
            unit: unit,
            fitNotes: created.measurements?.fitNotes || '',
            measuredAt: created.measurements?.measuredAt ? created.measurements.measuredAt.toISOString() : undefined,
            updatedAt: created.measurements?.updatedAt ? created.measurements.updatedAt.toISOString() : undefined,
        }

        safeRevalidatePath('/admin/orders/new')
        safeRevalidatePath('/admin/customers')

        return {
            success: true,
            customer: {
                id: created.id,
                name: `${created.firstName} ${created.lastName}`.trim(),
                firstName: created.firstName,
                lastName: created.lastName,
                phone: created.phone,
                whatsapp: created.whatsapp || created.phone,
                email: created.email || '',
                location: payload.location,
                address: created.deliveryAddress || '',
                language: payload.language || 'English',
                currency: payload.currency || 'EUR',
                savedMeasurements,
                hasSavedMeasurements: !!created.measurements,
                measurementDate: created.measurements?.updatedAt?.toISOString() || created.measurements?.measuredAt?.toISOString(),
                totalOrders: 0,
                createdAt: created.createdAt.toISOString(),
                updatedAt: created.updatedAt.toISOString(),
            },
        }
    } catch (err: any) {
        console.error('Error creating customer:', err)
        if (err?.code === 'P2002') {
            const target = err.meta?.target
            if (Array.isArray(target) && target.includes('phone')) {
                return { success: false, error: 'A customer with this phone number is already registered.' }
            }
            if (Array.isArray(target) && target.includes('email')) {
                return { success: false, error: 'A customer with this email address is already registered.' }
            }
            return { success: false, error: 'A customer with this phone number or email already exists.' }
        }
        return { success: false, error: err.message || 'Failed to create customer' }
    }
}

const adminCustomerInclude = {
    measurements: true,
    orders: {
        select: {
            id: true,
            orderNumber: true,
            totalAmount: true,
            currency: true,
            status: true,
            createdAt: true,
            design: {
                select: {
                    nameEN: true,
                    photos: {
                        take: 1,
                        select: { url: true },
                    },
                },
            },
        },
        orderBy: { createdAt: 'desc' as const },
    },
    reviews: {
        include: {
            design: {
                select: {
                    nameEN: true,
                },
            },
        },
        orderBy: { createdAt: 'desc' as const },
    },
    referralsSent: true,
    subscriberProfile: true,
    subscriptionTier: true,
}

const AVATAR_PALETTE = ['#C4975A', '#2D4A3E', '#8B2635', '#4A3B32', '#1B3B6F', '#7D4F27', '#3D348B', '#B45309']

function formatPrismaCustomerToAdminCustomer(c: any, index: number = 0): AdminCustomer {
    const meas = c.measurements
    const measUnit = meas?.unit === MeasurementUnit.INCHES ? 'inches' : 'cm'
    const toCm = (val?: number | null, fallback = 100) => {
        if (val == null) return fallback
        return measUnit === 'inches' ? Math.round(val * 2.54) : Math.round(val)
    }

    const fullName = `${c.firstName} ${c.lastName}`.trim()
    const location: Location = c.deliveryLocation === DeliveryLocation.ITALY ? 'Italy' : 'Nigeria'
    const currency: OrderCurrency = c.preferredCurrency === Currency.EUR ? 'EUR' : 'NGN'
    const language: 'EN' | 'IT' = c.preferredLang === Language.IT ? 'IT' : 'EN'

    let totalSpentNGN = 0
    let totalSpentEUR = 0
    c.orders?.forEach((o: any) => {
        if (o.currency === Currency.NGN) totalSpentNGN += o.totalAmount
        else if (o.currency === Currency.EUR) totalSpentEUR += o.totalAmount
    })

    const latestOrder = c.orders?.[0]
    const lastOrderDate = latestOrder
        ? latestOrder.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        : 'No orders'

    const avgRating = (c.reviews?.length ?? 0) > 0
        ? c.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / c.reviews.length
        : 5.0

    const ordersHistory = (c.orders || []).map((o: any) => ({
        orderId: o.id,
        orderNumber: o.orderNumber,
        garmentName: o.design?.nameEN || 'Bespoke Order',
        date: o.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        amountNGN: o.currency === Currency.NGN ? o.totalAmount : o.totalAmount * 1750,
        amountEUR: o.currency === Currency.EUR ? o.totalAmount : Math.round(o.totalAmount / 1750),
        status: o.status,
        thumbnail: o.design?.photos?.[0]?.url || '/images/design-agbada.jpg',
    }))

    const reviews = (c.reviews || []).map((r: any) => ({
        id: r.id,
        designName: r.design?.nameEN || 'Custom Garment',
        rating: r.rating,
        comment: r.comment || '',
        date: r.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: r.status as 'APPROVED' | 'PENDING' | 'REJECTED',
    }))

    const referrals = (c.referralsSent || []).map((ref: any) => ({
        refCode: ref.token,
        totalReferred: 1,
        convertedCount: ref.convertedOrderId ? 1 : 0,
        rewardsEarned: [],
    }))

    // Determine deterministic avatar color based on ID characters
    let colorIdx = index
    if (c.id && typeof c.id === 'string') {
        const charSum = c.id.split('').reduce((sum: number, ch: string) => sum + ch.charCodeAt(0), 0)
        colorIdx = charSum % AVATAR_PALETTE.length
    }

    // Parse admin notes
    let parsedNotes: Array<{ id: string; author: string; text: string; timestamp: string }> = []
    if (c.adminNotes) {
        const blocks = c.adminNotes.split('\n\n').filter(Boolean)
        parsedNotes = blocks.map((block: string, i: number) => {
            const match = block.match(/^\[(.*?)\]\s*([\s\S]*)$/)
            if (match) {
                return {
                    id: `note-${c.id}-${i}`,
                    author: 'Samuelson (Admin)',
                    timestamp: match[1],
                    text: match[2],
                }
            }
            return {
                id: `note-${c.id}-${i}`,
                author: 'Samuelson (Admin)',
                timestamp: c.updatedAt?.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) || 'Recent',
                text: block,
            }
        })
    }

    return {
        id: c.id,
        name: fullName,
        avatarColor: AVATAR_PALETTE[colorIdx],
        email: c.email || '',
        phone: c.phone,
        whatsapp: c.whatsapp || c.phone,
        location,
        address: c.deliveryAddress || '',
        language,
        currency,
        dateJoined: c.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        measurements: {
            chest: toCm(meas?.chest, 102),
            shoulder: toCm(meas?.shoulder, 45),
            sleeve: toCm(meas?.sleeveLength, 62),
            waist: toCm(meas?.waist, 84),
            hips: toCm(meas?.hips, 100),
            inseam: toCm(meas?.inseam, 80),
            neck: toCm(meas?.neck, 40),
            length: toCm(meas?.length, 105),
            bicep: meas?.bicep != null ? toCm(meas.bicep, 36) : undefined,
            wrist: meas?.wrist != null ? toCm(meas.wrist, 18) : undefined,
            trouserLength: meas?.trouserLength != null ? toCm(meas.trouserLength, 104) : undefined,
            thigh: meas?.thigh != null ? toCm(meas.thigh, 60) : undefined,
            fitNotes: meas?.fitNotes || '',
            lastUpdated: meas?.updatedAt
                ? meas.updatedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : meas?.measuredAt
                ? meas.measuredAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Never',
        },
        summary: {
            totalOrders: c.orders?.length || 0,
            totalSpentNGN,
            totalSpentEUR,
            lastOrderDate,
            referralCount: c.referralsSent?.length || 0,
            averageRating: Math.round(avgRating * 10) / 10,
        },
        ordersHistory,
        reviews,
        referrals,
        emailMarketing: {
            isSubscribed: c.subscriberProfile?.status === 'ACTIVE',
            source: c.subscriberProfile?.source || 'WhatsApp Consultation',
            language,
        },
        subscription: {
            status: 'INACTIVE',
            tier: (c.subscriptionTier?.tierLevel as any) || 'NONE',
            note: '',
        },
        adminNotes: parsedNotes,
    }
}

/**
 * Server Action: Fetch all customers formatted as AdminCustomer for the main Admin Customers directory.
 * Strictly loads from the database and returns only database-saved customers.
 */
export async function getAllAdminCustomersAction(): Promise<{
    success: boolean
    customers: AdminCustomer[]
    error?: string
}> {
    try {
        const dbCustomers = await prisma.customer.findMany({
            include: adminCustomerInclude,
            orderBy: { createdAt: 'desc' },
        })

        const mapped: AdminCustomer[] = dbCustomers.map((c, index) =>
            formatPrismaCustomerToAdminCustomer(c, index)
        )

        return { success: true, customers: mapped }
    } catch (err: any) {
        console.error('Error fetching admin customers from database:', err)
        return { success: false, customers: [], error: err.message || 'Failed to fetch admin customers' }
    }
}

/**
 * Server Action: Fetch a single customer by ID or name fallback.
 */
export async function getCustomerByIdAdminAction(idOrName: string): Promise<{
    success: boolean
    customer?: AdminCustomer
    error?: string
}> {
    try {
        if (!idOrName) {
            return { success: false, error: 'Customer identifier is required' }
        }

        let dbCustomer = await prisma.customer.findUnique({
            where: { id: idOrName },
            include: adminCustomerInclude,
        })

        if (!dbCustomer) {
            const trimmed = idOrName.trim()
            dbCustomer = await prisma.customer.findFirst({
                where: {
                    OR: [
                        { email: { equals: trimmed, mode: 'insensitive' } },
                        { phone: trimmed },
                        {
                            AND: [
                                { firstName: { contains: trimmed.split(' ')[0], mode: 'insensitive' } },
                                { lastName: { contains: trimmed.split(' ').slice(1).join(' ') || '', mode: 'insensitive' } },
                            ],
                        },
                    ],
                },
                include: adminCustomerInclude,
            })
        }

        if (!dbCustomer) {
            return { success: false, error: 'Customer not found in database' }
        }

        const customer = formatPrismaCustomerToAdminCustomer(dbCustomer, 0)
        return { success: true, customer }
    } catch (err: any) {
        console.error('Error fetching customer by id:', err)
        return { success: false, error: err.message || 'Failed to fetch customer' }
    }
}

export interface UpdateCustomerPersonalPayload {
    name: string
    email?: string
    phone: string
    whatsapp?: string
    location: 'Italy' | 'Nigeria'
    address?: string
    language?: 'EN' | 'IT'
    currency?: 'EUR' | 'NGN'
}

/**
 * Server Action: Update customer personal and contact details in PostgreSQL.
 */
export async function updateCustomerPersonalAction(
    customerId: string,
    data: UpdateCustomerPersonalPayload
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!customerId) return { success: false, error: 'Customer ID is required' }

        const nameParts = data.name.trim().split(' ')
        const firstName = nameParts[0] || 'Patron'
        const lastName = nameParts.slice(1).join(' ') || ''

        const deliveryLocation = data.location === 'Italy' ? DeliveryLocation.ITALY : DeliveryLocation.NIGERIA
        const preferredLang = data.language === 'IT' ? Language.IT : Language.EN
        const preferredCurrency = data.currency === 'EUR' ? Currency.EUR : Currency.NGN

        const cleanPhone = data.phone.trim()
        const existingPhone = await prisma.customer.findFirst({
            where: {
                phone: cleanPhone,
                id: { not: customerId },
            },
        })
        if (existingPhone) {
            return {
                success: false,
                error: `Phone number is already associated with customer "${existingPhone.firstName} ${existingPhone.lastName}".`,
            }
        }

        if (data.email?.trim()) {
            const cleanEmail = data.email.trim()
            const existingEmail = await prisma.customer.findFirst({
                where: {
                    email: { equals: cleanEmail, mode: 'insensitive' },
                    id: { not: customerId },
                },
            })
            if (existingEmail) {
                return {
                    success: false,
                    error: `Email address is already associated with customer "${existingEmail.firstName} ${existingEmail.lastName}".`,
                }
            }
        }

        await prisma.customer.update({
            where: { id: customerId },
            data: {
                firstName,
                lastName,
                phone: cleanPhone,
                whatsapp: data.whatsapp?.trim() || cleanPhone,
                email: data.email?.trim() || null,
                deliveryLocation,
                deliveryAddress: data.address?.trim() || '',
                preferredLang,
                preferredCurrency,
            },
        })

        safeRevalidatePath('/admin/customers')
        safeRevalidatePath(`/admin/customers/${customerId}`)
        safeRevalidatePath(`/admin/customers/${customerId}/edit`)
        safeRevalidatePath('/admin/orders')
        safeRevalidatePath('/admin/orders/new')

        return { success: true }
    } catch (err: any) {
        console.error('Error updating customer personal details:', err)
        return { success: false, error: err.message || 'Failed to update personal details' }
    }
}

/**
 * Server Action: Append an internal admin observation/note to the customer's dossier.
 */
export async function addCustomerAdminNoteAction(
    customerId: string,
    noteText: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!customerId || !noteText.trim()) {
            return { success: false, error: 'Customer ID and note text are required' }
        }

        const existing = await prisma.customer.findUnique({
            where: { id: customerId },
            select: { adminNotes: true },
        })

        const dateStr = new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
        const newEntry = `[${dateStr}] ${noteText.trim()}`
        const updatedNotes = existing?.adminNotes ? `${newEntry}\n\n${existing.adminNotes}` : newEntry

        await prisma.customer.update({
            where: { id: customerId },
            data: { adminNotes: updatedNotes },
        })

        safeRevalidatePath(`/admin/customers/${customerId}`)
        safeRevalidatePath(`/admin/customers/${customerId}/edit`)

        return { success: true }
    } catch (err: any) {
        console.error('Error adding customer admin note:', err)
        return { success: false, error: err.message || 'Failed to add admin note' }
    }
}

/**
 * Server Action: Permanently delete a customer and clean up cascade dependencies.
 */
export async function deleteCustomerAdminAction(
    customerId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!customerId) return { success: false, error: 'Customer ID is required' }

        const orderCount = await prisma.order.count({ where: { customerId } })
        if (orderCount > 0) {
            return {
                success: false,
                error: 'Cannot delete customer with past or active order records. Financial records must be preserved.',
            }
        }

        await prisma.$transaction(
            async (tx) => {
                // Delete reviews
                await tx.review.deleteMany({ where: { customerId } })
                // Delete referrals
                await tx.referral.deleteMany({
                    where: { OR: [{ referrerId: customerId }, { referredCustomerId: customerId }] },
                })
                // Delete subscriber profile
                await tx.subscriber.deleteMany({ where: { customerId } })
                // Delete measurements
                await tx.measurement.deleteMany({ where: { customerId } })
                // Delete customer
                await tx.customer.delete({ where: { id: customerId } })
            },
            { timeout: 15000, maxWait: 10000 }
        )

        safeRevalidatePath('/admin/customers')
        safeRevalidatePath('/admin/orders')

        return { success: true }
    } catch (err: any) {
        console.error('Error deleting customer:', err)
        return { success: false, error: err.message || 'Failed to delete customer' }
    }
}

/**
 * Server Action: Toggle email subscription status for a customer.
 */
export async function toggleCustomerEmailSubAction(
    customerId: string,
    isSubscribed: boolean
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!customerId) return { success: false, error: 'Customer ID is required' }

        const cust = await prisma.customer.findUnique({
            where: { id: customerId },
        })

        if (!cust) return { success: false, error: 'Customer not found' }

        const email = cust.email || `${cust.phone}@customer.captainstitches.com`
        const status = isSubscribed ? 'ACTIVE' : 'UNSUBSCRIBED'

        await prisma.subscriber.upsert({
            where: { email },
            update: {
                status,
                customerId: cust.id,
                unsubscribedAt: isSubscribed ? null : new Date(),
            },
            create: {
                email,
                name: `${cust.firstName} ${cust.lastName}`.trim(),
                customerId: cust.id,
                source: 'admin-toggle',
                language: cust.preferredLang,
                status,
            },
        })

        safeRevalidatePath(`/admin/customers/${customerId}`)
        return { success: true }
    } catch (err: any) {
        console.error('Error toggling email subscription:', err)
        return { success: false, error: err.message || 'Failed to toggle email subscription' }
    }
}

/**
 * Server Action: Merge a duplicate customer into a primary customer.
 */
export async function mergeCustomerAdminAction(
    sourceCustomerId: string,
    targetCustomerId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        if (!sourceCustomerId || !targetCustomerId || sourceCustomerId === targetCustomerId) {
            return { success: false, error: 'Invalid source or target customer ID' }
        }

        await prisma.$transaction(async (tx) => {
            // Transfer orders
            await tx.order.updateMany({
                where: { customerId: sourceCustomerId },
                data: { customerId: targetCustomerId },
            })
            // Transfer reviews
            await tx.review.updateMany({
                where: { customerId: sourceCustomerId },
                data: { customerId: targetCustomerId },
            })
            // Append notes
            const src = await tx.customer.findUnique({
                where: { id: sourceCustomerId },
                select: { firstName: true, lastName: true, phone: true, adminNotes: true },
            })
            const target = await tx.customer.findUnique({
                where: { id: targetCustomerId },
                select: { adminNotes: true },
            })
            if (src) {
                const mergeNote = `[Merged from ${src.firstName} ${src.lastName} (${src.phone})] ${src.adminNotes || ''}`
                const combinedNotes = target?.adminNotes ? `${target.adminNotes}\n\n${mergeNote}` : mergeNote
                await tx.customer.update({
                    where: { id: targetCustomerId },
                    data: { adminNotes: combinedNotes },
                })
            }
            // Delete source customer measurements & subscriber
            await tx.measurement.deleteMany({ where: { customerId: sourceCustomerId } })
            await tx.subscriber.deleteMany({ where: { customerId: sourceCustomerId } })
            await tx.customer.delete({ where: { id: sourceCustomerId } })
        })

        safeRevalidatePath('/admin/customers')
        safeRevalidatePath(`/admin/customers/${targetCustomerId}`)
        return { success: true }
    } catch (err: any) {
        console.error('Error merging customers:', err)
        return { success: false, error: err.message || 'Failed to merge customers' }
    }
}
