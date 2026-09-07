import 'server-only'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { DeliveryLocation, MeasurementUnit } from '@prisma/client'

export interface CustomerFilterOptions {
    deliveryLocation?: DeliveryLocation
    search?: string
    limit?: number
    offset?: number
}

/**
 * Fetch all customers with their measurements and order counts.
 */
export const getCustomers = cache(async (options: CustomerFilterOptions = {}) => {
    const { deliveryLocation, search, limit = 50, offset = 0 } = options

    const where: any = {}
    if (deliveryLocation) {
        where.deliveryLocation = deliveryLocation
    }
    if (search) {
        where.OR = [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
            { phone: { contains: search } },
        ]
    }

    const [customers, total] = await Promise.all([
        prisma.customer.findMany({
            where,
            include: {
                measurements: true,
                _count: {
                    select: { orders: true, referralsSent: true, reviews: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        }),
        prisma.customer.count({ where }),
    ])

    return { customers, total }
})

/**
 * Fetch complete customer dossier by ID.
 */
export const getCustomerById = cache(async (id: string) => {
    return prisma.customer.findUnique({
        where: { id },
        include: {
            measurements: true,
            orders: {
                orderBy: { createdAt: 'desc' },
                include: { design: true },
            },
            reviews: {
                orderBy: { createdAt: 'desc' },
            },
            referralsSent: true,
        },
    })
})

/**
 * Update or create customer measurement profile.
 */
export async function upsertCustomerMeasurements(
    customerId: string,
    measurements: {
        unit?: MeasurementUnit
        chest?: number
        shoulder?: number
        sleeveLength?: number
        waist?: number
        hips?: number
        inseam?: number
        neck?: number
        length?: number
        trouserLength?: number
        thigh?: number
        fitNotes?: string
    }
) {
    return prisma.measurement.upsert({
        where: { customerId },
        update: {
            ...measurements,
            updatedAt: new Date(),
        },
        create: {
            customerId,
            ...measurements,
        },
    })
}
