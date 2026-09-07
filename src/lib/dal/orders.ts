import 'server-only'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { OrderStatus } from '@prisma/client'

export interface OrderFilterOptions {
    status?: OrderStatus
    search?: string
    customerId?: string
    tailorId?: string
    limit?: number
    offset?: number
}

/**
 * Fetch all bespoke orders with customer and tailor relations.
 */
export const getOrders = cache(async (options: OrderFilterOptions = {}) => {
    const { status, search, customerId, tailorId, limit = 50, offset = 0 } = options

    const where: any = {}
    if (status) {
        where.status = status
    }
    if (customerId) {
        where.customerId = customerId
    }
    if (tailorId) {
        where.tailorId = tailorId
    }
    if (search) {
        where.OR = [
            { orderNumber: { contains: search } },
            { customer: { firstName: { contains: search } } },
            { customer: { lastName: { contains: search } } },
            { customer: { email: { contains: search } } },
        ]
    }

    const [orders, total] = await Promise.all([
        prisma.order.findMany({
            where,
            include: {
                customer: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true,
                        deliveryLocation: true,
                    },
                },
                tailor: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        displayName: true,
                        role: true,
                    },
                },
                design: true,
                timeline: {
                    orderBy: { createdAt: 'desc' },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
        }),
        prisma.order.count({ where }),
    ])

    return { orders, total }
})

/**
 * Fetch a single bespoke order by ID or order number.
 */
export const getOrderById = cache(async (idOrOrderNumber: string) => {
    return prisma.order.findFirst({
        where: {
            OR: [{ id: idOrOrderNumber }, { orderNumber: idOrOrderNumber }],
        },
        include: {
            customer: {
                include: {
                    measurements: true,
                },
            },
            tailor: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    displayName: true,
                    role: true,
                    phone: true,
                },
            },
            design: {
                include: {
                    photos: true,
                },
            },
            payments: {
                orderBy: { createdAt: 'desc' },
            },
            timeline: {
                orderBy: { createdAt: 'asc' },
            },
        },
    })
})

/**
 * Update an order's production status and create an audit timeline event.
 */
export async function updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    notes?: string,
    actorName: string = 'Samuelson Anaele',
    actorId?: string
) {
    return prisma.$transaction(async (tx) => {
        const current = await tx.order.findUnique({
            where: { id: orderId },
            select: { status: true },
        })

        const order = await tx.order.update({
            where: { id: orderId },
            data: {
                status: newStatus,
                updatedAt: new Date(),
            },
        })

        await tx.orderTimelineEvent.create({
            data: {
                orderId,
                fromStatus: current?.status,
                toStatus: newStatus,
                actorName,
                actorId,
                notes,
            },
        })

        return order
    })
}

/**
 * Assign a workshop tailor to an order.
 */
export async function assignTailorToOrder(
    orderId: string,
    tailorId: string,
    tailorName: string,
    actorName: string = 'Studio Director'
) {
    return prisma.$transaction(async (tx) => {
        const order = await tx.order.update({
            where: { id: orderId },
            data: { tailorId },
        })

        await tx.orderTimelineEvent.create({
            data: {
                orderId,
                toStatus: order.status,
                actorName,
                notes: `Assigned to artisan tailor ${tailorName}.`,
            },
        })

        return order
    })
}
