'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { ReviewStatus as PrismaReviewStatus, OrderStatus as PrismaOrderStatus } from '@prisma/client'
import type { AdminReviewItem, ReviewStatus } from '@/data/adminReviewsData'

function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch {
        // Ignored outside Next.js request context
    }
}

function mapDbReviewToAdminItem(r: any): AdminReviewItem {
    const customer = r.customer
    const primaryPhoto = r.design?.photos?.find((p: any) => p.isPrimary)?.url || r.design?.photos?.[0]?.url || '/images/design-agbada.jpg'
    const dateObj = new Date(r.createdAt)

    return {
        id: r.id,
        code: `REV-${r.id.slice(-6).toUpperCase()}`,
        status: r.status as ReviewStatus,
        rating: r.rating,
        comment: r.comment || '',
        photos: r.photoUrls || [],
        dateSubmitted: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        timeSubmitted: dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customer: {
            id: customer?.id || '',
            name: `${customer?.firstName || ''} ${customer?.lastName || ''}`.trim() || 'Valued Patron',
            initials: `${customer?.firstName?.[0] || 'C'}${customer?.lastName?.[0] || 'S'}`.toUpperCase(),
            avatarColor: '#C4975A',
            location: customer?.deliveryLocation === 'ITALY' ? 'Italy' : 'Nigeria',
            email: customer?.email || '',
            phone: customer?.phone || '',
            totalOrders: 1,
            previousReviewsCount: 0,
            previousAverageRating: 5.0,
        },
        design: {
            id: r.design?.id || 'custom-design',
            slug: r.design?.slug || '',
            name: r.design?.nameEN || 'Bespoke Order',
            category: r.design?.category || 'Native Wear',
            categoryLabel: r.design?.category || 'Native Wear',
            thumbnail: primaryPhoto,
            priceNGN: r.design?.priceNGN || 0,
            priceEUR: r.design?.priceEUR || 0,
        },
        order: {
            id: r.order?.id || '',
            orderNumber: r.order?.orderNumber || 'CS-COMMISSION',
            orderDate: r.order?.createdAt ? new Date(r.order.createdAt).toISOString().slice(0, 10) : '2026-08-01',
            fabric: r.order?.fabricChoice || 'Bespoke Fabric',
            colour: r.order?.colourChoice || 'Bespoke Colour',
            tailorName: 'Samuelson Anaele',
            deliveryDate: r.order?.estimatedDelivery ? new Date(r.order.estimatedDelivery).toISOString().slice(0, 10) : 'Delivered',
        },
        moderation: {
            moderatorName: r.moderatedById ? 'Samuelson' : undefined,
            moderatedAt: r.moderatedAt ? new Date(r.moderatedAt).toISOString() : undefined,
            moderatorNote: r.moderatorNote || undefined,
            rejectionReason: r.status === 'REJECTED' ? (r.moderatorNote || 'Spam / promotional content') : undefined,
            isFlagged: false,
        },
    }
}

export interface CreateReviewActionInput {
    customerId: string
    orderId: string
    designId?: string
    rating: number
    comment?: string
    photoUrls?: string[]
}

export async function createReviewAction(input: CreateReviewActionInput): Promise<{
    success: boolean
    review?: AdminReviewItem
    error?: string
}> {
    try {
        const created = await prisma.review.create({
            data: {
                customerId: input.customerId,
                orderId: input.orderId,
                designId: input.designId || null,
                rating: Math.min(5, Math.max(1, input.rating)),
                comment: input.comment || null,
                photoUrls: input.photoUrls || [],
                status: PrismaReviewStatus.PENDING,
            },
            include: {
                customer: true,
                design: true,
                order: true,
            },
        })

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/reviews')
        safeRevalidatePath('/')
        safeRevalidatePath('/catalogue')
        if (created.design?.slug) {
            safeRevalidatePath(`/catalogue/${created.design.slug}`)
        }

        return { success: true }
    } catch (error: any) {
        console.error('Failed to create review in database:', error)
        return { success: false, error: error.message }
    }
}

export async function getAllReviewsAdminAction(): Promise<{
    success: boolean
    reviews: AdminReviewItem[]
    error?: string
}> {
    try {
        const dbReviews = await prisma.review.findMany({
            include: {
                customer: true,
                design: {
                    include: { photos: true },
                },
                order: true,
            },
            orderBy: { createdAt: 'desc' },
        })

        const mapped: AdminReviewItem[] = dbReviews.map((r) => mapDbReviewToAdminItem(r))

        return { success: true, reviews: mapped }
    } catch (error: any) {
        console.error('Failed to load reviews from database:', error)
        return { success: false, reviews: [], error: error.message }
    }
}

export async function getReviewByIdAdminAction(id: string): Promise<{
    success: boolean
    review?: AdminReviewItem
    error?: string
}> {
    try {
        const cleanId = (id || '').trim()
        if (!cleanId) {
            return { success: false, error: 'Review ID is required.' }
        }

        const dbReview = await prisma.review.findFirst({
            where: {
                OR: [
                    { id: cleanId },
                    { order: { orderNumber: { equals: cleanId, mode: 'insensitive' } } },
                ],
            },
            include: {
                customer: true,
                design: {
                    include: { photos: true },
                },
                order: true,
            },
        })

        if (!dbReview) {
            return { success: false, error: `Review "${cleanId}" not found in database records.` }
        }

        return { success: true, review: mapDbReviewToAdminItem(dbReview) }
    } catch (error: any) {
        console.error('Failed to get review by ID:', error)
        return { success: false, error: error.message }
    }
}

export async function updateReviewStatusAdminAction(
    id: string,
    status: ReviewStatus,
    reason?: string,
    note?: string
): Promise<{ success: boolean; review?: AdminReviewItem; error?: string }> {
    try {
        const cleanId = (id || '').trim()
        if (!cleanId) {
            return { success: false, error: 'Review ID is required.' }
        }

        const existing = await prisma.review.findUnique({ where: { id: cleanId } })
        if (!existing) {
            return { success: false, error: `Review "${cleanId}" not found in database records.` }
        }

        const prismaStatus = status as PrismaReviewStatus

        const updated = await prisma.review.update({
            where: { id: cleanId },
            data: {
                status: prismaStatus,
                moderatedAt: new Date(),
                moderatorNote: note || reason || null,
            },
            include: {
                customer: true,
                design: {
                    include: { photos: true },
                },
                order: true,
            },
        })

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/reviews')
        safeRevalidatePath('/')
        safeRevalidatePath('/catalogue')
        if (updated.design?.slug) {
            safeRevalidatePath(`/catalogue/${updated.design.slug}`)
        }
        safeRevalidatePath('/track')
        safeRevalidatePath('/review')

        return { success: true, review: mapDbReviewToAdminItem(updated) }
    } catch (error: any) {
        console.error('Failed to update review status in database:', error)
        return { success: false, error: error.message }
    }
}

export interface ReviewableOrderDetails {
    orderNumber: string
    dbId: string
    customerName: string
    customerPhone: string
    customerEmail?: string
    designName: string
    designPhoto: string
    fabric?: string
    colour?: string
    status: string
    isDelivered: boolean
    existingReview?: {
        id: string
        rating: number
        comment?: string
        photos: string[]
        status: string
        createdAt: string
    }
}

/**
 * Public action to retrieve order details for reviewing purposes.
 * Can be queried via Order Number (e.g. CS-0092), Order ID, phone or email.
 */
export async function getReviewableOrderAction(rawQuery: string): Promise<{
    success: boolean
    order?: ReviewableOrderDetails
    error?: string
}> {
    try {
        const query = (rawQuery || '').trim()
        if (!query) {
            return { success: false, error: 'Please specify an Order Reference (e.g. CS-0092)' }
        }

        const cleanDigits = query.replace(/[^\d]/g, '')
        const upperQuery = query.toUpperCase()

        const dbOrder = await prisma.order.findFirst({
            where: {
                OR: [
                    { orderNumber: { equals: upperQuery, mode: 'insensitive' as const } },
                    { orderNumber: { equals: query, mode: 'insensitive' as const } },
                    { id: query },
                    { customer: { email: { equals: query, mode: 'insensitive' as const } } },
                    ...(cleanDigits.length >= 7
                        ? [
                              { customer: { phone: { contains: cleanDigits } } },
                              { customer: { whatsapp: { contains: cleanDigits } } },
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
                review: true,
            },
        })

        if (!dbOrder) {
            return { success: false, error: `Order "${query}" was not located in our atelier records.` }
        }

        const customerName = dbOrder.customer
            ? `${dbOrder.customer.firstName} ${dbOrder.customer.lastName}`.trim()
            : 'Valued Patron'
        const primaryPhoto =
            dbOrder.design?.photos?.find((p) => p.isPrimary)?.url ||
            dbOrder.design?.photos?.[0]?.url ||
            dbOrder.customDesignUrl ||
            '/images/design-agbada.jpg'
        const designName = dbOrder.design?.nameEN || dbOrder.customDesignNotes || 'Bespoke Commission'

        const isDelivered = dbOrder.status === PrismaOrderStatus.DELIVERED

        return {
            success: true,
            order: {
                orderNumber: dbOrder.orderNumber,
                dbId: dbOrder.id,
                customerName,
                customerPhone: dbOrder.customer?.phone || '',
                customerEmail: dbOrder.customer?.email || undefined,
                designName,
                designPhoto: primaryPhoto,
                fabric: dbOrder.fabricChoice || undefined,
                colour: dbOrder.colourChoice || undefined,
                status: dbOrder.status,
                isDelivered,
                existingReview: dbOrder.review
                    ? {
                          id: dbOrder.review.id,
                          rating: dbOrder.review.rating,
                          comment: dbOrder.review.comment || undefined,
                          photos: dbOrder.review.photoUrls || [],
                          status: dbOrder.review.status,
                          createdAt: dbOrder.review.createdAt.toISOString(),
                      }
                    : undefined,
            },
        }
    } catch (error: any) {
        console.error('Failed to get reviewable order:', error)
        return { success: false, error: error.message || 'Database error occurred while fetching order' }
    }
}

export interface SubmitCustomerReviewInput {
    orderNumber: string
    rating: number
    comment?: string
    photoUrls?: string[]
    fitTags?: string[]
}

/**
 * Public action for unauthenticated customer review submission.
 * Validates that the order exists, has been delivered, and has not yet been reviewed.
 */
export async function submitCustomerReviewAction(input: SubmitCustomerReviewInput): Promise<{
    success: boolean
    reviewId?: string
    error?: string
}> {
    try {
        const orderNum = (input.orderNumber || '').trim().toUpperCase()
        if (!orderNum) {
            return { success: false, error: 'Order reference is required.' }
        }

        const rating = Math.min(5, Math.max(1, Math.round(input.rating || 5)))

        const dbOrder = await prisma.order.findFirst({
            where: {
                OR: [
                    { orderNumber: { equals: orderNum, mode: 'insensitive' } },
                    { id: orderNum },
                ],
            },
            include: {
                customer: true,
                design: true,
                review: true,
            },
        })

        if (!dbOrder) {
            return { success: false, error: 'Order was not found.' }
        }

        if (dbOrder.review) {
            return { success: false, error: 'A review has already been submitted for this order.' }
        }

        // Format comment with fitTags if provided
        let finalComment = (input.comment || '').trim()
        if (input.fitTags && input.fitTags.length > 0) {
            const tagsHeader = `[Fit Feedback: ${input.fitTags.join(', ')}]`
            finalComment = finalComment ? `${tagsHeader}\n\n${finalComment}` : tagsHeader
        }

        const created = await prisma.review.create({
            data: {
                customerId: dbOrder.customerId,
                orderId: dbOrder.id,
                designId: dbOrder.designId || null,
                rating,
                comment: finalComment || null,
                photoUrls: input.photoUrls || [],
                status: PrismaReviewStatus.PENDING,
            },
            include: {
                design: true,
            },
        })

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/reviews')
        safeRevalidatePath('/track')
        safeRevalidatePath('/review')
        safeRevalidatePath('/')
        safeRevalidatePath('/catalogue')
        if (created.design?.slug) {
            safeRevalidatePath(`/catalogue/${created.design.slug}`)
        }

        return { success: true, reviewId: created.id }
    } catch (error: any) {
        console.error('Failed to submit customer review:', error)
        return { success: false, error: error.message || 'Failed to submit review' }
    }
}

export interface UpdateCustomerReviewInput {
    orderNumber: string
    rating: number
    comment?: string
    photoUrls?: string[]
    fitTags?: string[]
}

/**
 * Public action for unauthenticated customer to update/edit an existing review.
 * Finds the review for the specified order, updates the rating, comment, and photos,
 * and sets status back to PENDING so Master Tailor Samuelson can re-moderate.
 */
export async function updateCustomerReviewAction(input: UpdateCustomerReviewInput): Promise<{
    success: boolean
    reviewId?: string
    error?: string
}> {
    try {
        const orderNum = (input.orderNumber || '').trim().toUpperCase()
        if (!orderNum) {
            return { success: false, error: 'Order reference is required.' }
        }

        const rating = Math.min(5, Math.max(1, Math.round(input.rating || 5)))

        const dbOrder = await prisma.order.findFirst({
            where: {
                OR: [
                    { orderNumber: { equals: orderNum, mode: 'insensitive' } },
                    { id: orderNum },
                ],
            },
            include: {
                review: true,
                design: true,
            },
        })

        if (!dbOrder) {
            return { success: false, error: 'Order was not found.' }
        }

        if (!dbOrder.review) {
            return { success: false, error: 'No existing review found to update. Please submit a new review.' }
        }

        // Format comment with fitTags if provided
        let finalComment = (input.comment || '').trim()
        if (input.fitTags && input.fitTags.length > 0) {
            const tagsHeader = `[Fit Feedback: ${input.fitTags.join(', ')}]`
            finalComment = finalComment ? `${tagsHeader}\n\n${finalComment}` : tagsHeader
        }

        const updated = await prisma.review.update({
            where: { id: dbOrder.review.id },
            data: {
                rating,
                comment: finalComment || null,
                photoUrls: input.photoUrls || [],
                status: PrismaReviewStatus.PENDING,
                updatedAt: new Date(),
            },
            include: {
                design: true,
            },
        })

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/reviews')
        safeRevalidatePath('/track')
        safeRevalidatePath('/review')
        safeRevalidatePath('/')
        safeRevalidatePath('/catalogue')
        if (updated.design?.slug) {
            safeRevalidatePath(`/catalogue/${updated.design.slug}`)
        }

        return { success: true, reviewId: updated.id }
    } catch (error: any) {
        console.error('Failed to update customer review:', error)
        return { success: false, error: error.message || 'Failed to update review' }
    }
}


