import 'server-only'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { DesignCategory, ReviewStatus } from '@prisma/client'

/**
 * Fetch visible catalogue designs for storefront or admin lookbook.
 */
export const getPublishedDesigns = cache(async (category?: DesignCategory) => {
    const where: any = { isVisible: true }
    if (category) {
        where.category = category
    }

    return prisma.design.findMany({
        where,
        include: { photos: { orderBy: { sortOrder: 'asc' } } },
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
})

/**
 * Fetch a single design by URL slug.
 */
export const getDesignBySlug = cache(async (slug: string) => {
    return prisma.design.findUnique({
        where: { slug },
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
            reviews: {
                where: { status: ReviewStatus.APPROVED },
                orderBy: { createdAt: 'desc' },
            },
        },
    })
})

/**
 * Fetch all designs for atelier admin with sales and review counts.
 */
export const getAllDesignsAdmin = cache(async () => {
    return prisma.design.findMany({
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
            _count: {
                select: { orders: true, reviews: true },
            },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
})

/**
 * Update dual-currency pricing for an atelier design.
 */
export async function updateDesignPricing(id: string, priceEUR: number, priceNGN: number) {
    return prisma.design.update({
        where: { id },
        data: {
            priceEUR,
            priceNGN,
        },
    })
}
