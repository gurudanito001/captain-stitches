'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import {
    OrderStatus as PrismaOrderStatus,
    DeliveryLocation as PrismaDeliveryLocation,
    Currency as PrismaCurrency,
    PaymentGateway as PrismaPaymentGateway,
    ReferralRewardType as PrismaRewardType,
    ReferralRewardStatus as PrismaRewardStatus,
    MeasurementUnit as PrismaMeasurementUnit,
    UserRole as PrismaUserRole,
} from '@prisma/client'
import { generateUniqueToken } from '@/lib/actions/referrals'
import {
    sendOrderConfirmationEmails,
    sendOrderStatusMilestoneEmail,
} from '@/lib/services/email'
import type {
    AdminOrder,
    OrderStatus,
    Location,
    Currency,
    CustomerProfile,
    MeasurementProfile,
} from '@/data/adminOrdersData'

function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch {
        // Ignore outside Next.js request context
    }
}

export interface CreateOrderActionInput {
    orderNumber?: string
    customerId: string
    designId?: string
    tailorAssigned?: string
    status?: OrderStatus
    deliveryLocation: Location
    deliveryAddress: string
    occasion?: string
    deadline?: string
    estimatedDeliveryDate?: string
    measurements: MeasurementProfile
    customDesign?: {
        name?: string
        image?: string
        fabric?: string
        colour?: string
        specialInstructions?: string
    }
    catalogueDesign?: {
        id: string
        name: string
        category: string
        image: string
        fabric?: string
        colour?: string
        specialInstructions?: string
    }
    currency: Currency
    totalAmount: number
    depositAmount: number
    depositPaid?: boolean
    paymentGateway?: string
    additionalNotes?: string
}

export async function createOrderAdminAction(input: CreateOrderActionInput): Promise<{
    success: boolean
    order?: AdminOrder
    error?: string
}> {
    try {
        // Validation: Deposit cannot exceed total amount
        if (input.depositAmount > input.totalAmount) {
            return {
                success: false,
                error: 'Deposit amount cannot exceed total commission price.',
            }
        }

        // Validation: Deadline date cannot be in the past
        if (input.deadline) {
            const deadlineDate = new Date(input.deadline)
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            if (deadlineDate < today) {
                return {
                    success: false,
                    error: 'Production deadline date cannot be in the past.',
                }
            }
        }

        // Find existing customer
        const customer = await prisma.customer.findUnique({
            where: { id: input.customerId },
        })

        if (!customer) {
            return { success: false, error: 'Customer not found in database' }
        }

        // Generate unique order number if not supplied
        let orderNum = input.orderNumber
        if (!orderNum) {
            const count = await prisma.order.count()
            const year = new Date().getFullYear()
            orderNum = `CS-${year}-${String(count + 1).padStart(4, '0')}`
        }

        const isCatalogue = !!input.catalogueDesign && input.catalogueDesign.id !== 'custom-design'
        const prismaLocation = input.deliveryLocation === 'Italy' ? PrismaDeliveryLocation.ITALY : PrismaDeliveryLocation.NIGERIA
        const prismaCurrency = input.currency === 'EUR' ? PrismaCurrency.EUR : PrismaCurrency.NGN
        const prismaStatus = input.depositPaid ? PrismaOrderStatus.CONFIRMED : PrismaOrderStatus.NEW

        const created = await prisma.order.create({
            data: {
                orderNumber: orderNum,
                customerId: input.customerId,
                designId: isCatalogue ? input.catalogueDesign!.id : null,
                status: prismaStatus,
                deliveryLocation: prismaLocation,
                deliveryAddress: input.deliveryAddress || 'Studio Pickup',
                occasion: input.occasion || null,
                deadline: input.deadline ? new Date(input.deadline) : null,
                estimatedDelivery: input.estimatedDeliveryDate ? new Date(input.estimatedDeliveryDate) : null,
                measurementSnapshot: input.measurements as any,
                customDesignUrl: !isCatalogue ? input.customDesign?.image : null,
                customDesignNotes: !isCatalogue ? (input.customDesign?.specialInstructions || input.customDesign?.name) : null,
                fabricChoice: isCatalogue ? input.catalogueDesign?.fabric : input.customDesign?.fabric,
                colourChoice: isCatalogue ? input.catalogueDesign?.colour : input.customDesign?.colour,
                additionalNotes: input.additionalNotes || null,
                currency: prismaCurrency,
                totalAmount: input.totalAmount,
                depositAmount: input.depositAmount,
                balanceAmount: Math.max(0, input.totalAmount - input.depositAmount),
                depositPaid: !!input.depositPaid,
                balancePaid: false,
                timeline: {
                    create: {
                        toStatus: prismaStatus,
                        actorName: 'Samuelson Anaele',
                        notes: `Order commissioned via admin dashboard for ${customer.firstName} ${customer.lastName}.`,
                    },
                },
            },
            include: {
                customer: true,
                design: true,
                tailor: true,
                timeline: true,
            },
        })

        // Map back to AdminOrder interface
        const mappedOrder: AdminOrder = {
            id: created.id,
            orderNumber: created.orderNumber,
            createdAt: created.createdAt.toISOString(),
            status: created.status as OrderStatus,
            isOverdue: false,
            tailorAssigned: input.tailorAssigned || 'Samuelson (Master Tailor)',
            customer: {
                id: customer.id,
                name: `${customer.firstName} ${customer.lastName}`.trim(),
                email: customer.email || '',
                phone: customer.phone,
                whatsapp: customer.whatsapp || customer.phone,
                location: customer.deliveryLocation === PrismaDeliveryLocation.ITALY ? 'Italy' : 'Nigeria',
                address: customer.deliveryAddress || 'Studio Pickup',
                language: customer.preferredLang === 'IT' ? 'Italian' : 'English',
                currency: customer.preferredCurrency === PrismaCurrency.EUR ? 'EUR' : 'NGN',
                savedMeasurements: input.measurements,
                totalOrders: 1,
            },
            design: {
                id: created.designId || 'custom-design',
                name: created.design?.nameEN || input.customDesign?.name || 'Custom Bespoke Creation',
                category: created.design?.category || 'Bespoke Custom',
                image: created.customDesignUrl || '/images/design-agbada.jpg',
                isCustom: !created.designId,
                fabric: created.fabricChoice || undefined,
                colour: created.colourChoice || undefined,
                specialInstructions: created.customDesignNotes || undefined,
            },
            measurements: input.measurements,
            details: {
                occasion: created.occasion || 'General Bespoke',
                deadline: created.deadline ? created.deadline.toISOString().slice(0, 10) : 'Standard Turnaround',
                deliveryLocation: input.deliveryLocation,
                fullAddress: created.deliveryAddress,
                currency: input.currency,
                estimatedDeliveryDate: created.estimatedDelivery ? created.estimatedDelivery.toISOString().slice(0, 10) : 'Within 14 business days',
                additionalNotes: created.additionalNotes || undefined,
            },
            payment: {
                totalNGN: input.currency === 'NGN' ? input.totalAmount : input.totalAmount * 1750,
                totalEUR: input.currency === 'EUR' ? input.totalAmount : Math.round(input.totalAmount / 1750),
                depositAmount: created.depositAmount,
                depositStatus: created.depositPaid ? 'PAID' : 'UNPAID',
                depositPaidDate: created.depositPaid ? new Date().toISOString() : undefined,
                balanceAmount: created.balanceAmount,
                balanceStatus: created.balancePaid ? 'PAID' : 'UNPAID',
                gateway: (input.paymentGateway as any) || 'Manual Bank Transfer',
                referenceNumber: `ORD-${created.orderNumber}`,
                balancePaymentLink: `https://captainstitches.com/pay/bal-${created.id}`,
            },
            inspection: {
                photos: created.inspectionMediaUrls,
                videoUrl: created.inspectionVideoUrl || undefined,
                notes: created.inspectionNotes || '',
                isApproved: !!created.inspectionApprovedAt,
            },
            adminNotes: [
                {
                    id: `note-${Date.now()}`,
                    author: 'Samuelson Anaele',
                    text: `Initial commission order recorded for ${customer.firstName} ${customer.lastName}.`,
                    timestamp: new Date().toISOString(),
                },
            ],
            notifications: [
                {
                    id: `notif-${Date.now()}`,
                    event: 'Order Created',
                    channel: 'WhatsApp',
                    timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    details: `Bespoke commission logged for ${customer.firstName} ${customer.lastName}.`,
                },
            ],
        }

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/orders')

        // Dispatch order confirmation emails to customer and admin
        sendOrderConfirmationEmails({
            id: created.id,
            orderNumber: created.orderNumber,
            customerName: `${customer.firstName} ${customer.lastName}`.trim(),
            customerEmail: customer.email || undefined,
            customerPhone: customer.phone,
            deliveryAddress: created.deliveryAddress,
            deliveryLocation: input.deliveryLocation,
            designName: input.catalogueDesign?.name || input.customDesign?.name || 'Bespoke Attire',
            fabric: input.catalogueDesign?.fabric || input.customDesign?.fabric || 'Imperial Cashmere',
            colour: input.catalogueDesign?.colour || input.customDesign?.colour || 'Selected Tone',
            sizingMode: 'Bespoke',
            currency: input.currency,
            totalAmount: input.totalAmount,
            depositAmount: input.depositAmount,
            balanceAmount: Math.max(0, input.totalAmount - input.depositAmount),
            deadline: input.deadline,
            occasion: input.occasion,
        }).catch((err) => console.warn('[Admin Order Email] Non-blocking dispatch error:', err))

        return { success: true, order: mappedOrder }
    } catch (error: any) {
        console.error('Failed to create order in database:', error)
        if (error?.code === 'P2002') {
            return { success: false, error: 'An order with this order number already exists.' }
        }
        return { success: false, error: error.message || 'Database error creating order' }
    }
}

export async function getAllOrdersAdminAction(): Promise<{
    success: boolean
    orders: AdminOrder[]
    error?: string
}> {
    try {
        const dbOrders = await prisma.order.findMany({
            include: {
                customer: true,
                design: {
                    include: { photos: true },
                },
                tailor: true,
                timeline: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        const mapped: AdminOrder[] = dbOrders.map((o) => {
            const customer = o.customer
            const primaryPhoto = o.design?.photos?.find((p) => p.isPrimary)?.url || o.design?.photos?.[0]?.url || o.customDesignUrl || '/images/design-agbada.jpg'

            return {
                id: o.id,
                orderNumber: o.orderNumber,
                createdAt: o.createdAt.toISOString(),
                status: o.status as OrderStatus,
                isOverdue: o.deadline ? new Date() > o.deadline && o.status !== PrismaOrderStatus.DELIVERED : false,
                tailorAssigned: o.tailor ? (o.tailor.displayName || `${o.tailor.firstName} ${o.tailor.lastName}`) : 'Samuelson (Master Tailor)',
                customer: {
                    id: customer.id,
                    name: `${customer.firstName} ${customer.lastName}`.trim(),
                    email: customer.email || '',
                    phone: customer.phone,
                    whatsapp: customer.whatsapp || customer.phone,
                    location: customer.deliveryLocation === PrismaDeliveryLocation.ITALY ? 'Italy' : 'Nigeria',
                    address: customer.deliveryAddress || 'Studio Pickup',
                    language: customer.preferredLang === 'IT' ? 'Italian' : 'English',
                    currency: customer.preferredCurrency === PrismaCurrency.EUR ? 'EUR' : 'NGN',
                    savedMeasurements: (o.measurementSnapshot as any) || {
                        chest: 102,
                        shoulder: 45,
                        sleeve: 62,
                        waist: 84,
                        hips: 100,
                        inseam: 80,
                        neck: 40,
                        length: 105,
                        unit: 'cm',
                    },
                    totalOrders: 1,
                },
                design: {
                    id: o.designId || 'custom-design',
                    name: o.design?.nameEN || o.customDesignNotes || 'Custom Bespoke Creation',
                    category: o.design?.category || 'Bespoke Custom',
                    image: primaryPhoto,
                    isCustom: !o.designId,
                    fabric: o.fabricChoice || undefined,
                    colour: o.colourChoice || undefined,
                    specialInstructions: o.customDesignNotes || undefined,
                },
                measurements: (o.measurementSnapshot as any) || {
                    chest: 102,
                    shoulder: 45,
                    sleeve: 62,
                    waist: 84,
                    hips: 100,
                    inseam: 80,
                    neck: 40,
                    length: 105,
                    unit: 'cm',
                },
                details: {
                    occasion: o.occasion || 'Bespoke Fitting',
                    deadline: o.deadline ? o.deadline.toISOString().slice(0, 10) : 'Standard Turnaround',
                    deliveryLocation: o.deliveryLocation === PrismaDeliveryLocation.ITALY ? 'Italy' : 'Nigeria',
                    fullAddress: o.deliveryAddress,
                    currency: o.currency === PrismaCurrency.EUR ? 'EUR' : 'NGN',
                    estimatedDeliveryDate: o.estimatedDelivery ? o.estimatedDelivery.toISOString().slice(0, 10) : 'Within 14 business days',
                    additionalNotes: o.additionalNotes || undefined,
                },
                payment: {
                    totalNGN: o.currency === PrismaCurrency.NGN ? o.totalAmount : o.totalAmount * 1750,
                    totalEUR: o.currency === PrismaCurrency.EUR ? o.totalAmount : Math.round(o.totalAmount / 1750),
                    depositAmount: o.depositAmount,
                    depositStatus: o.depositPaid ? 'PAID' : 'UNPAID',
                    depositPaidDate: o.depositPaid ? o.createdAt.toISOString() : undefined,
                    balanceAmount: o.balanceAmount,
                    balanceStatus: o.balancePaid ? 'PAID' : 'UNPAID',
                    gateway: 'Manual Bank Transfer',
                    referenceNumber: `ORD-${o.orderNumber}`,
                    balancePaymentLink: o.balancePaymentLink || `https://captainstitches.com/pay/bal-${o.id}`,
                },
                inspection: {
                    photos: o.inspectionMediaUrls,
                    videoUrl: o.inspectionVideoUrl || undefined,
                    notes: o.inspectionNotes || '',
                    isApproved: !!o.inspectionApprovedAt,
                },
                adminNotes: [
                    {
                        id: `note-${o.id}`,
                        author: 'Samuelson Anaele',
                        text: `Commission order ${o.orderNumber} placed.`,
                        timestamp: o.createdAt.toISOString(),
                    },
                ],
                notifications: [],
            }
        })

        return { success: true, orders: mapped }
    } catch (error: any) {
        console.error('Failed to load orders from database:', error)
        return { success: false, orders: [], error: error.message }
    }
}

export interface UpdateOrderStatusOptions {
    notes?: string
    tailorAssigned?: string
    inspectionNotes?: string
    inspectionMediaUrls?: string[]
    inspectionVideoUrl?: string
    courierName?: string
    trackingNumber?: string
    trackingUrl?: string
    confirmUnpaidDispatch?: boolean
}

export async function updateOrderStatusAdminAction(
    orderId: string,
    newStatus: OrderStatus,
    notesOrOptions?: string | UpdateOrderStatusOptions
): Promise<{ success: boolean; error?: string; warning?: string }> {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                customer: true,
                design: true,
            },
        })

        if (!order) {
            return { success: false, error: 'Order not found' }
        }

        const options: UpdateOrderStatusOptions =
            typeof notesOrOptions === 'object' && notesOrOptions !== null
                ? notesOrOptions
                : { notes: typeof notesOrOptions === 'string' ? notesOrOptions : undefined }

        const notes = options.notes

        // 1. Mandatory Quality Gate Check for DISPATCHED
        if (newStatus === 'DISPATCHED') {
            if (order.status !== 'APPROVED' && !order.inspectionApprovedAt) {
                return {
                    success: false,
                    error: 'Order cannot be dispatched without Master Tailor inspection approval.',
                }
            }
        }

        const prismaStatus = newStatus as PrismaOrderStatus
        const updateData: any = {
            status: prismaStatus,
            updatedAt: new Date(),
        }

        // 2. Stage-specific field transitions
        if (options.tailorAssigned) {
            const tailorUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { displayName: { contains: options.tailorAssigned.split(' ')[0], mode: 'insensitive' } },
                        { firstName: { contains: options.tailorAssigned.split(' ')[0], mode: 'insensitive' } },
                        { lastName: { contains: options.tailorAssigned.split(' ')[0], mode: 'insensitive' } },
                    ],
                },
            })
            if (tailorUser) {
                updateData.tailorId = tailorUser.id
            }
        }

        if (newStatus === 'APPROVED') {
            updateData.inspectionApprovedAt = new Date()
            if (options.inspectionNotes || notes) {
                updateData.inspectionNotes = options.inspectionNotes || notes
            }
            const adminUser = await prisma.user.findFirst({
                where: {
                    OR: [
                        { role: PrismaUserRole.ADMIN },
                        { role: PrismaUserRole.SUPER_ADMIN },
                        { email: { contains: 'samuelson', mode: 'insensitive' } },
                    ],
                },
            })
            if (adminUser) {
                updateData.inspectionApprovedById = adminUser.id
            }
        } else if (newStatus === 'DISPATCHED') {
            updateData.dispatchedAt = new Date()
            if (options.courierName) {
                updateData.courierName = options.courierName
            } else if (!order) {
                updateData.courierName = 'DHL Express'
            }
            if (options.trackingNumber) {
                updateData.trackingNumber = options.trackingNumber
                updateData.trackingUrl =
                    options.trackingUrl ||
                    `https://www.dhl.com/en/express/tracking.html?AWB=${encodeURIComponent(options.trackingNumber)}`
            }
        } else if (newStatus === 'DELIVERED') {
            updateData.deliveredAt = new Date()
        }

        if (options.inspectionMediaUrls && options.inspectionMediaUrls.length > 0) {
            updateData.inspectionMediaUrls = options.inspectionMediaUrls
        }
        if (options.inspectionVideoUrl) {
            updateData.inspectionVideoUrl = options.inspectionVideoUrl
        }

        let defaultNote = `Order advanced to ${newStatus}`
        if (order.status === 'INSPECTION' && newStatus === 'IN_PRODUCTION') {
            defaultNote = notes ? `Alteration requested: ${notes}` : 'Alterations requested by Master Tailor Samuelson'
        } else if (newStatus === 'IN_PRODUCTION') {
            defaultNote = options.tailorAssigned
                ? `Assigned to ${options.tailorAssigned} & fabric cutting active.`
                : 'Fabric cut & tailoring active in workshop.'
        } else if (newStatus === 'APPROVED') {
            defaultNote = notes ? `Approved by Master Tailor Samuelson: ${notes}` : 'Craftsmanship & fit signed off by Master Tailor Samuelson'
        } else if (newStatus === 'DISPATCHED') {
            defaultNote = options.trackingNumber
                ? `Dispatched via ${options.courierName || 'DHL Express'}. Tracking: ${options.trackingNumber}`
                : `Dispatched to client via ${options.courierName || 'DHL Express'}`
        } else if (newStatus === 'DELIVERED') {
            defaultNote = 'Delivered to client. Review and ambassador referral unlocked.'
        }

        await prisma.order.update({
            where: { id: orderId },
            data: {
                ...updateData,
                timeline: {
                    create: {
                        fromStatus: order.status,
                        toStatus: prismaStatus,
                        actorName: 'Samuelson Anaele',
                        notes: notes || defaultNote,
                    },
                },
            },
        })

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/orders')
        safeRevalidatePath(`/admin/orders/${orderId}`)
        safeRevalidatePath('/track')

        // Dispatch milestone update email to patron
        if (order.customer) {
            sendOrderStatusMilestoneEmail(
                {
                    id: order.id,
                    orderNumber: order.orderNumber,
                    customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
                    customerEmail: order.customer.email || undefined,
                    customerPhone: order.customer.phone,
                    deliveryAddress: order.deliveryAddress,
                    deliveryLocation: order.deliveryLocation,
                    designName: order.design?.nameEN || 'Bespoke Attire',
                    fabric: order.fabricChoice || 'Atelier Fabric',
                    colour: order.colourChoice || 'Selected Tone',
                    sizingMode: 'Bespoke',
                    currency: order.currency,
                    totalAmount: order.totalAmount,
                    depositAmount: order.depositAmount,
                    balanceAmount: order.balanceAmount,
                    courierName: options.courierName || order.courierName || undefined,
                    trackingNumber: options.trackingNumber || order.trackingNumber || undefined,
                },
                newStatus,
                notes || defaultNote
            ).catch((err) => console.warn('[Milestone Email] Non-blocking dispatch error:', err))
        }

        let warning: string | undefined
        if (newStatus === 'DISPATCHED' && !order.balancePaid && order.balanceAmount > 0) {
            const sym = order.currency === PrismaCurrency.EUR ? '€' : '₦'
            warning = `This order has an outstanding balance of ${sym}${order.balanceAmount.toLocaleString()}. Dispatched before balance settlement.`
        }

        return { success: true, warning }
    } catch (error: any) {
        console.error('Failed to update order status in database:', error)
        return { success: false, error: error.message }
    }
}

export async function uploadOrderInspectionMediaAction(
    orderId: string,
    photos: string[],
    videoUrl?: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { customer: true, design: true },
        })

        if (!order) {
            return { success: false, error: 'Order not found' }
        }

        const existing = order.inspectionMediaUrls || []
        const merged = Array.from(new Set([...existing, ...photos]))

        const isAdvanceToInspection =
            order.status === PrismaOrderStatus.IN_PRODUCTION || order.status === PrismaOrderStatus.CONFIRMED

        await prisma.order.update({
            where: { id: orderId },
            data: {
                inspectionMediaUrls: merged,
                ...(videoUrl ? { inspectionVideoUrl: videoUrl } : {}),
                ...(isAdvanceToInspection ? { status: PrismaOrderStatus.INSPECTION } : {}),
                timeline: isAdvanceToInspection
                    ? {
                          create: {
                              fromStatus: order.status,
                              toStatus: PrismaOrderStatus.INSPECTION,
                              actorName: 'Workshop Tailor',
                              notes: `Uploaded ${photos.length} inspection media item(s). Ready for Samuelson sign-off.`,
                          },
                      }
                    : undefined,
            },
        })

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/orders')
        safeRevalidatePath(`/admin/orders/${orderId}`)
        safeRevalidatePath('/track')

        if (isAdvanceToInspection && order.customer) {
            sendOrderStatusMilestoneEmail(
                {
                    id: order.id,
                    orderNumber: order.orderNumber,
                    customerName: `${order.customer.firstName} ${order.customer.lastName}`.trim(),
                    customerEmail: order.customer.email || undefined,
                    customerPhone: order.customer.phone,
                    deliveryAddress: order.deliveryAddress,
                    deliveryLocation: order.deliveryLocation,
                    designName: order.design?.nameEN || 'Bespoke Attire',
                    fabric: order.fabricChoice || 'Atelier Fabric',
                    colour: order.colourChoice || 'Selected Tone',
                    sizingMode: 'Bespoke',
                    currency: order.currency,
                    totalAmount: order.totalAmount,
                    depositAmount: order.depositAmount,
                    balanceAmount: order.balanceAmount,
                    inspectionMediaUrls: merged,
                },
                'INSPECTION',
                `Artisan uploaded ${photos.length} inspection photo(s).`
            ).catch((err) => console.warn('[Inspection Email] Non-blocking dispatch error:', err))
        }

        return { success: true }
    } catch (error: any) {
        console.error('Failed to upload inspection media:', error)
        return { success: false, error: error.message }
    }
}

export async function approveOrderQualityAction(
    orderId: string,
    notes?: string
): Promise<{ success: boolean; error?: string }> {
    return updateOrderStatusAdminAction(orderId, 'APPROVED', {
        notes: notes || 'Master Tailor Samuelson approved garment quality and fit.',
        inspectionNotes: notes,
    })
}

export async function requestOrderAlterationAction(
    orderId: string,
    alterationNotes: string
): Promise<{ success: boolean; error?: string }> {
    return updateOrderStatusAdminAction(orderId, 'IN_PRODUCTION', {
        notes: alterationNotes || 'Alterations requested by Master Tailor Samuelson',
    })
}

export async function dispatchOrderAction(
    orderId: string,
    payload: {
        courierName?: string
        trackingNumber: string
        trackingUrl?: string
        confirmUnpaidDispatch?: boolean
    }
): Promise<{ success: boolean; error?: string; warning?: string }> {
    return updateOrderStatusAdminAction(orderId, 'DISPATCHED', {
        courierName: payload.courierName || 'DHL Express',
        trackingNumber: payload.trackingNumber,
        trackingUrl: payload.trackingUrl,
        confirmUnpaidDispatch: payload.confirmUnpaidDispatch,
    })
}

export interface TrackedOrder {
    id: string
    orderNumber?: string
    dbId: string
    customer: string
    customerName?: string
    customerFullName: string
    customerEmail?: string
    phone: string
    design: string
    fabric: string
    color: string
    estimatedDelivery: string
    occasion: string
    status: 'New' | 'Confirmed' | 'In production' | 'Inspection' | 'Approved' | 'Dispatched' | 'Delivered'
    deliveryLocation: 'Italy' | 'Nigeria'
    deliveryAddress: string
    totalEUR: number
    totalNGN: number
    depositAmount: number
    depositPaid: boolean
    balanceAmount: number
    balancePaid: boolean
    balancePaymentLink?: string
    courierName?: string
    trackingNumber?: string
    trackingUrl?: string
    primaryImage?: string
    inspectionMedia?: {
        photos: string[]
        videoUrl?: string
        notes?: string
    }
    timeline: Array<{
        status: string
        date: string
        notes?: string
        actor?: string
    }>
    review?: {
        id: string
        rating: number
        comment?: string
        photos?: string[]
        status: string
        createdAt: string
    }
}

/**
 * Public Server Action to track an order by order number, ID, customer phone, or customer email.
 */
export async function trackOrderAction(rawQuery: string): Promise<{
    success: boolean
    order?: TrackedOrder
    error?: string
}> {
    try {
        const query = (rawQuery || '').trim()
        if (!query) {
            return { success: false, error: 'Please enter an Order ID or phone number' }
        }

        const cleanDigits = query.replace(/[^\d]/g, '')
        const strippedZero = cleanDigits.replace(/^0+/, '')
        const last7 = cleanDigits.length >= 7 ? cleanDigits.slice(-7) : cleanDigits
        const upperQuery = query.toUpperCase()

        const dbOrder = await prisma.order.findFirst({
            where: {
                OR: [
                    { orderNumber: { equals: upperQuery, mode: 'insensitive' as const } },
                    { orderNumber: { equals: query, mode: 'insensitive' as const } },
                    { orderNumber: { contains: query, mode: 'insensitive' as const } },
                    { id: query },
                    { customer: { email: { equals: query, mode: 'insensitive' as const } } },
                    ...(cleanDigits.length >= 7
                        ? [
                              { customer: { phone: { contains: cleanDigits } } },
                              { customer: { whatsapp: { contains: cleanDigits } } },
                              ...(strippedZero.length >= 7
                                  ? [
                                        { customer: { phone: { contains: strippedZero } } },
                                        { customer: { whatsapp: { contains: strippedZero } } },
                                    ]
                                  : []),
                              { customer: { phone: { contains: last7 } } },
                              { customer: { whatsapp: { contains: last7 } } },
                          ]
                        : []),
                ],
            },
            orderBy: { createdAt: 'desc' },
            include: {
                customer: true,
                design: {
                    include: {
                        photos: {
                            orderBy: { sortOrder: 'asc' },
                        },
                    },
                },
                tailor: true,
                timeline: {
                    orderBy: { createdAt: 'asc' },
                },
                payments: {
                    orderBy: { createdAt: 'desc' },
                },
                review: true,
            },
        })

        if (!dbOrder) {
            return { success: false, error: 'Order not found' }
        }

        const statusMap: Record<PrismaOrderStatus, TrackedOrder['status']> = {
            NEW: 'New',
            CONFIRMED: 'Confirmed',
            IN_PRODUCTION: 'In production',
            INSPECTION: 'Inspection',
            APPROVED: 'Approved',
            DISPATCHED: 'Dispatched',
            DELIVERED: 'Delivered',
        }

        const designName = dbOrder.customDesignNotes || dbOrder.design?.nameEN || 'Bespoke Creation'
        const primaryPhoto =
            dbOrder.design?.photos?.find((p) => p.isPrimary)?.url ||
            dbOrder.design?.photos?.[0]?.url ||
            dbOrder.customDesignUrl ||
            '/images/design-agbada.jpg'
        const allPhotos =
            dbOrder.inspectionMediaUrls && dbOrder.inspectionMediaUrls.length > 0
                ? dbOrder.inspectionMediaUrls
                : dbOrder.design?.photos?.map((p) => p.url) || [primaryPhoto]

        const customerName = dbOrder.customer
            ? `${dbOrder.customer.firstName} ${dbOrder.customer.lastName ? dbOrder.customer.lastName[0] + '.' : ''}`
            : 'Bespoke Client'
        const customerFullName = dbOrder.customer
            ? `${dbOrder.customer.firstName} ${dbOrder.customer.lastName}`.trim()
            : 'Bespoke Client'

        const priceEUR =
            dbOrder.design?.priceEUR ||
            (dbOrder.currency === PrismaCurrency.EUR ? dbOrder.totalAmount : Math.round(dbOrder.totalAmount / 1750))
        const priceNGN =
            dbOrder.design?.priceNGN ||
            (dbOrder.currency === PrismaCurrency.NGN && dbOrder.totalAmount > 1000
                ? dbOrder.totalAmount
                : Math.round(dbOrder.totalAmount * 1750))

        const trackedOrder: TrackedOrder = {
            id: dbOrder.orderNumber,
            orderNumber: dbOrder.orderNumber,
            dbId: dbOrder.id,
            customer: customerName,
            customerName,
            customerFullName,
            customerEmail: dbOrder.customer?.email || undefined,
            phone: dbOrder.customer?.phone || '',
            design: designName,
            fabric: dbOrder.fabricChoice || 'Selected Bespoke Fabric',
            color: dbOrder.colourChoice || 'Selected Atelier Color',
            estimatedDelivery: dbOrder.estimatedDelivery
                ? dbOrder.estimatedDelivery.toISOString().split('T')[0]
                : dbOrder.deadline
                  ? dbOrder.deadline.toISOString().split('T')[0]
                  : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            occasion: dbOrder.occasion || 'Bespoke Fitting',
            status: statusMap[dbOrder.status] || 'New',
            deliveryLocation: dbOrder.deliveryLocation === PrismaDeliveryLocation.ITALY ? 'Italy' : 'Nigeria',
            deliveryAddress: dbOrder.deliveryAddress || 'Studio Pickup',
            totalEUR: priceEUR,
            totalNGN: priceNGN,
            depositAmount: dbOrder.depositAmount,
            depositPaid: dbOrder.depositPaid,
            balanceAmount: dbOrder.balanceAmount,
            balancePaid: dbOrder.balancePaid,
            balancePaymentLink: dbOrder.balancePaymentLink || undefined,
            courierName: dbOrder.courierName || undefined,
            trackingNumber: dbOrder.trackingNumber || undefined,
            trackingUrl: dbOrder.trackingUrl || undefined,
            primaryImage: primaryPhoto,
            inspectionMedia:
                allPhotos.length > 0 || dbOrder.inspectionVideoUrl
                    ? {
                          photos: allPhotos,
                          videoUrl: dbOrder.inspectionVideoUrl || undefined,
                          notes: dbOrder.inspectionNotes || undefined,
                      }
                    : undefined,
            timeline: dbOrder.timeline.map((evt) => ({
                status: statusMap[evt.toStatus] || evt.toStatus,
                date: evt.createdAt.toISOString(),
                notes: evt.notes || undefined,
                actor: evt.actorName || undefined,
            })),
            review: dbOrder.review
                ? {
                      id: dbOrder.review.id,
                      rating: dbOrder.review.rating,
                      comment: dbOrder.review.comment || undefined,
                      photos: dbOrder.review.photoUrls || [],
                      status: dbOrder.review.status,
                      createdAt: dbOrder.review.createdAt.toISOString(),
                  }
                : undefined,
        }

        return { success: true, order: trackedOrder }
    } catch (error: any) {
        console.error('Error tracking order:', error)
        return { success: false, error: error.message || 'Database error occurred while fetching order' }
    }
}

export interface CreatePublicOrderInput {
    fullName: string
    email?: string
    phone: string
    address: string
    city: string
    postcode: string
    country: string
    designSlug: string
    designName: string
    fabric: string
    colour: string
    sizingMode: string
    measurements?: Record<string, string>
    standardSize?: string
    heightRange?: string
    bodyBuild?: string
    occasion?: string
    deadline?: string
    specialNotes?: string
    currency: 'EUR' | 'NGN'
    totalAmount: number
    depositAmount: number
    paymentGateway: 'stripe' | 'paystack'
    referralToken?: string
    customImageUrl?: string
}

/**
 * Public action: Creates a customer order from the checkout flow (/order)
 * and attributes referral conversions if a referralToken is provided.
 */
export async function createPublicOrderAction(input: CreatePublicOrderInput): Promise<{
    success: boolean
    orderNumber?: string
    dbId?: string
    error?: string
}> {
    try {
        if (!input.fullName.trim() || !input.phone.trim()) {
            return { success: false, error: 'Customer name and phone number are required' }
        }

        const cleanPhone = input.phone.replace(/[^\d+]/g, '')
        const cleanDigits = input.phone.replace(/[^\d]/g, '')

        // 1. Locate or create customer in PostgreSQL
        let customer = await prisma.customer.findFirst({
            where: {
                OR: [
                    { phone: cleanPhone },
                    ...(cleanDigits.length >= 7 ? [{ phone: { contains: cleanDigits } }] : []),
                    ...(input.email ? [{ email: { equals: input.email.trim(), mode: 'insensitive' as const } }] : []),
                ],
            },
        })

        const isItaly = !input.country.toLowerCase().includes('nigeria')
        const deliveryLocation = isItaly ? PrismaDeliveryLocation.ITALY : PrismaDeliveryLocation.NIGERIA
        const fullAddress = `${input.address}, ${input.city} ${input.postcode}, ${input.country}`

        if (!customer) {
            const parts = input.fullName.trim().split(' ')
            const firstName = parts[0] || 'Patron'
            const lastName = parts.slice(1).join(' ') || ''

            customer = await prisma.customer.create({
                data: {
                    firstName,
                    lastName,
                    phone: cleanPhone || input.phone,
                    email: input.email?.trim() || null,
                    deliveryAddress: fullAddress,
                    deliveryLocation,
                    preferredCurrency: input.currency === 'EUR' ? PrismaCurrency.EUR : PrismaCurrency.NGN,
                },
            })
        }

        // 2. Generate unique orderNumber: e.g. CS-2026-XXXX or CS-XXXX
        const count = await prisma.order.count()
        const orderNumber = `CS-${String(count + 1).padStart(4, '0')}`

        // 3. Find design by slug if exists
        const design = await prisma.design.findFirst({
            where: { slug: input.designSlug },
        })

        const prismaCurrency = input.currency === 'EUR' ? PrismaCurrency.EUR : PrismaCurrency.NGN
        const depositAmount = input.depositAmount || Math.round(input.totalAmount / 2)
        const balanceAmount = Math.max(0, input.totalAmount - depositAmount)

        // 4. Create the order
        const createdOrder = await prisma.order.create({
            data: {
                orderNumber,
                customerId: customer.id,
                designId: design ? design.id : null,
                status: PrismaOrderStatus.CONFIRMED,
                deliveryLocation,
                deliveryAddress: fullAddress,
                occasion: input.occasion || 'Bespoke Fitting',
                deadline: input.deadline ? new Date(input.deadline) : null,
                estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
                measurementSnapshot: (input.measurements || { standardSize: input.standardSize }) as any,
                fabricChoice: input.fabric,
                colourChoice: input.colour,
                additionalNotes: input.specialNotes || null,
                inspectionMediaUrls: input.customImageUrl ? [input.customImageUrl] : [],
                currency: prismaCurrency,
                totalAmount: input.totalAmount,
                depositAmount,
                balanceAmount,
                depositPaid: true, // Deposit authorized at checkout
                balancePaid: false,
                timeline: {
                    create: [
                        {
                            toStatus: PrismaOrderStatus.NEW,
                            actorName: 'Client Portal',
                            notes: `Commission initialized online by ${input.fullName}.`,
                        },
                        {
                            toStatus: PrismaOrderStatus.CONFIRMED,
                            actorName: input.paymentGateway === 'stripe' ? 'Stripe Gateway' : 'Paystack Gateway',
                            notes: `50% deposit confirmed via ${input.paymentGateway.toUpperCase()}. Measurements sent to Verona master cutter.`,
                        },
                    ],
                },
            },
        })

        // 4b. If bespoke measurements provided, persist to customer measurements record
        if (input.sizingMode === 'bespoke' && input.measurements) {
            const parseMeasure = (val?: string) => {
                if (!val) return null
                const n = parseFloat(val)
                return isNaN(n) ? null : n
            }
            const unit = input.measurements.unit?.toLowerCase() === 'cm' ? PrismaMeasurementUnit.CM : PrismaMeasurementUnit.INCHES

            await prisma.measurement.upsert({
                where: { customerId: customer.id },
                create: {
                    customerId: customer.id,
                    unit,
                    neck: parseMeasure(input.measurements.neck),
                    shoulder: parseMeasure(input.measurements.shoulder),
                    chest: parseMeasure(input.measurements.chest),
                    sleeveLength: parseMeasure(input.measurements.sleeve),
                    length: parseMeasure(input.measurements.shirtLength),
                    waist: parseMeasure(input.measurements.waist),
                    hips: parseMeasure(input.measurements.hip),
                    trouserLength: parseMeasure(input.measurements.trouserLength),
                    fitNotes: input.specialNotes || 'Captured from online bespoke checkout',
                },
                update: {
                    unit,
                    neck: parseMeasure(input.measurements.neck),
                    shoulder: parseMeasure(input.measurements.shoulder),
                    chest: parseMeasure(input.measurements.chest),
                    sleeveLength: parseMeasure(input.measurements.sleeve),
                    length: parseMeasure(input.measurements.shirtLength),
                    waist: parseMeasure(input.measurements.waist),
                    hips: parseMeasure(input.measurements.hip),
                    trouserLength: parseMeasure(input.measurements.trouserLength),
                    fitNotes: input.specialNotes || 'Updated from online bespoke checkout',
                },
            })
        }

        // 5. Handle referral conversion if referral token was applied
        if (input.referralToken) {
            const tokenClean = input.referralToken.trim().toUpperCase()
            const referralRecord = await prisma.referral.findFirst({
                where: {
                    token: { equals: tokenClean, mode: 'insensitive' as const },
                    convertedOrderId: null,
                },
                include: {
                    referrer: true,
                },
            })

            if (referralRecord) {
                const isSelf = referralRecord.referrerId === customer.id
                // Flow 01 Rule: Referral discount is for first-time patron commissions only
                const priorOrdersCount = await prisma.order.count({
                    where: {
                        customerId: customer.id,
                        id: { not: createdOrder.id },
                    },
                })

                if (!isSelf && priorOrdersCount === 0) {
                    // Link conversion
                    await prisma.referral.update({
                        where: { id: referralRecord.id },
                        data: {
                            referredCustomerId: customer.id,
                            convertedOrderId: createdOrder.id,
                            referredRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                            referredRewardValue: 10,
                            referredRewardStatus: PrismaRewardStatus.REDEEMED,
                            referredRedeemedAt: new Date(),
                            referrerRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                            referrerRewardValue: 10,
                            referrerRewardStatus: PrismaRewardStatus.CREDITED,
                        },
                    })

                    // Flow 01 Rule: Spawns fresh unassigned referral token for the referrer's next share
                    const nextToken = await generateUniqueToken(referralRecord.referrer.firstName, referralRecord.referrerId)
                    await prisma.referral.create({
                        data: {
                            referrerId: referralRecord.referrerId,
                            token: nextToken,
                            referrerRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                            referrerRewardValue: 10,
                            referrerRewardStatus: PrismaRewardStatus.PENDING,
                        },
                    })
                }
            }
        }

        try {
            revalidatePath('/admin')
            revalidatePath('/admin/orders')
            revalidatePath('/admin/referrals')
            revalidatePath('/track')
        } catch {
            // Ignored outside Next.js request context
        }

        // Send order confirmation emails to customer and admin
        sendOrderConfirmationEmails({
            id: createdOrder.id,
            orderNumber: createdOrder.orderNumber,
            customerName: input.fullName,
            customerEmail: input.email || undefined,
            customerPhone: input.phone,
            deliveryAddress: fullAddress,
            deliveryLocation: deliveryLocation,
            designName: input.designName,
            fabric: input.fabric,
            colour: input.colour,
            sizingMode: input.sizingMode,
            measurementsSummary:
                input.sizingMode === 'bespoke' && input.measurements
                    ? Object.entries(input.measurements)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(', ')
                    : `Standard Size: ${input.standardSize || 'Custom'}`,
            currency: input.currency,
            totalAmount: input.totalAmount,
            depositAmount,
            balanceAmount,
            deadline: input.deadline,
            occasion: input.occasion,
        }).catch((err) => console.warn('[Public Order Email] Dispatch error:', err))

        return {
            success: true,
            orderNumber: createdOrder.orderNumber,
            dbId: createdOrder.id,
        }
    } catch (err: any) {
        console.error('Failed to create public order:', err)
        return { success: false, error: err.message || 'Failed to initialize bespoke commission' }
    }
}

