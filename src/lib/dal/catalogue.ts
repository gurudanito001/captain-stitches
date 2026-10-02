import 'server-only'
import { cache } from 'react'
import { prisma } from '@/lib/prisma'
import { DesignCategory, ReviewStatus } from '@prisma/client'
import type { CatalogueDesign, CatalogueCategory } from '@/data/adminCatalogueData'
import { parseColour } from '@/lib/utils/colours'

// ─── CATEGORY MAPPINGS ────────────────────────────────────────────────────────

export function toPrismaCategory(cat: CatalogueCategory | string): DesignCategory {
    switch (cat) {
        case 'native-wear':
        case 'NATIVE_WEAR':
            return DesignCategory.NATIVE_WEAR
        case 'english-suit':
        case 'ENGLISH_SUIT':
            return DesignCategory.ENGLISH_SUIT
        case 'casual':
        case 'CASUAL':
            return DesignCategory.CASUAL
        case 'children':
        case 'childrens':
        case 'CHILDRENS':
            return DesignCategory.CHILDRENS
        default:
            return DesignCategory.NATIVE_WEAR
    }
}

export function fromPrismaCategory(cat: DesignCategory): CatalogueCategory {
    switch (cat) {
        case DesignCategory.NATIVE_WEAR:
            return 'native-wear'
        case DesignCategory.ENGLISH_SUIT:
            return 'english-suit'
        case DesignCategory.CASUAL:
            return 'casual'
        case DesignCategory.CHILDRENS:
            return 'children'
        default:
            return 'native-wear'
    }
}

export function getCategoryLabel(cat: DesignCategory | CatalogueCategory): string {
    const norm = typeof cat === 'string' && cat in DesignCategory ? fromPrismaCategory(cat as DesignCategory) : cat
    switch (norm) {
        case 'native-wear':
            return 'Native Wear'
        case 'english-suit':
            return 'Fabric Accessories'
        case 'casual':
            return 'Casual Wear'
        case 'children':
            return 'Children’s Bespoke'
        default:
            return 'Bespoke Couture'
    }
}

// ─── DATA MODEL MAPPER ────────────────────────────────────────────────────────

/**
 * Maps a Prisma Design relational record to the frontend CatalogueDesign interface.
 */
export function mapPrismaDesignToCatalogueDesign(d: any): CatalogueDesign {
    const photos = (d.photos || []).map((p: any) => ({
        id: p.id,
        url: p.url,
        isCover: Boolean(p.isPrimary),
        caption: p.altText || undefined,
    }))

    // Ensure at least one photo is marked cover if photos exist
    if (photos.length > 0 && !photos.some((p: any) => p.isCover)) {
        photos[0].isCover = true
    }

    const reviews = (d.reviews || []).map((r: any) => ({
        id: r.id,
        customerName: r.customer ? `${r.customer.firstName} ${r.customer.lastName?.[0] || ''}.`.trim() : 'Verified Patron',
        rating: r.rating || 5,
        comment: r.comment || '',
        date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '2026-08-01',
        status: (r.status as 'APPROVED' | 'PENDING' | 'REJECTED') || 'APPROVED',
        photos: r.photos || [],
    }))

    const avgRating = reviews.length > 0
        ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0

    // Colours formatting with rich hex support
    const colours = (d.colourOptionsEN || []).map((raw: string) => parseColour(raw))

    return {
        id: d.id,
        slug: d.slug,
        sortOrder: d.sortOrder ?? 0,
        category: fromPrismaCategory(d.category),
        categoryLabel: getCategoryLabel(d.category),
        isVisible: Boolean(d.isVisible),
        isFeatured: Boolean(d.isFeatured),
        turnaroundDays: d.turnaroundDays ?? 14,
        pricing: {
            priceNGN: d.priceNGN,
            priceEUR: d.priceEUR,
            pricingNote: d.pricingNote || undefined,
        },
        photos,
        fabrics: d.fabricOptionsEN || [],
        colours,
        contentEN: {
            name: d.nameEN,
            description: d.descriptionEN,
            tags: d.fabricOptionsEN || [],
        },
        contentIT: {
            name: d.nameIT || d.nameEN,
            description: d.descriptionIT || d.descriptionEN,
            tags: d.fabricOptionsIT || d.fabricOptionsEN || [],
        },
        seo: {
            metaTitleEN: d.metaTitleEN || `${d.nameEN} — Bespoke Fashion | CaptainStitches`,
            metaDescriptionEN: d.metaDescEN || d.descriptionEN?.slice(0, 155) || '',
            metaTitleIT: d.metaTitleIT || `${d.nameIT || d.nameEN} — Sartoria su Misura | CaptainStitches`,
            metaDescriptionIT: d.metaDescIT || d.descriptionIT?.slice(0, 155) || '',
        },
        stats: {
            totalOrders: d._count?.orders ?? 0,
            averageRating: avgRating,
            reviewCount: d._count?.reviews ?? reviews.length,
            dateCreated: d.createdAt ? new Date(d.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 1, 2026',
            lastUpdated: d.updatedAt ? new Date(d.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Jan 1, 2026',
            popularFabrics: (d.fabricOptionsEN || []).slice(0, 2),
            popularColours: (d.colourOptionsEN || []).slice(0, 2),
        },
        reviews,
    }
}

// ─── QUERY FUNCTIONS ──────────────────────────────────────────────────────────

/**
 * Fetch visible catalogue designs for storefront lookbook.
 */
export const getPublishedDesigns = cache(async (category?: DesignCategory) => {
    const where: any = { isVisible: true }
    if (category) {
        where.category = category
    }

    return prisma.design.findMany({
        where,
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
            reviews: {
                where: { status: ReviewStatus.APPROVED },
                orderBy: { createdAt: 'desc' },
            },
            _count: {
                select: { orders: true, reviews: true },
            },
        },
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
})

/**
 * Fetch featured designs for homepage (up to `limit`).
 * Prioritizes isFeatured: true, then sortOrder: asc, createdAt: desc.
 */
export const getFeaturedDesigns = cache(async (limit = 4) => {
    return prisma.design.findMany({
        where: { isVisible: true },
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
            reviews: {
                where: { status: ReviewStatus.APPROVED },
                orderBy: { createdAt: 'desc' },
            },
            _count: {
                select: { orders: true, reviews: true },
            },
        },
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        take: limit,
    })
})

/**
 * Fetch a single design by URL slug or ID.
 */
export const getDesignBySlug = cache(async (slug: string) => {
    return prisma.design.findFirst({
        where: {
            OR: [
                { slug },
                { id: slug },
            ],
        },
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
            reviews: {
                where: { status: ReviewStatus.APPROVED },
                include: { customer: true },
                orderBy: { createdAt: 'desc' },
            },
            _count: {
                select: { orders: true, reviews: true },
            },
        },
    })
})

/**
 * Fetch a single design by ID or slug.
 */
export const getDesignById = cache(async (id: string) => {
    return prisma.design.findFirst({
        where: {
            OR: [
                { id },
                { slug: id },
            ],
        },
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
            reviews: {
                where: { status: ReviewStatus.APPROVED },
                include: { customer: true },
                orderBy: { createdAt: 'desc' },
            },
            _count: {
                select: { orders: true, reviews: true },
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
            reviews: {
                where: { status: ReviewStatus.APPROVED },
            },
            _count: {
                select: { orders: true, reviews: true },
            },
        },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
})

// ─── MUTATION FUNCTIONS ───────────────────────────────────────────────────────

export interface CreateDesignInput {
    slug?: string
    sku?: string
    category: DesignCategory
    turnaroundDays: number
    priceNGN: number
    priceEUR: number
    pricingNote?: string
    nameEN: string
    descriptionEN: string
    fabricOptionsEN: string[]
    colourOptionsEN: string[]
    metaTitleEN?: string
    metaDescEN?: string
    nameIT?: string
    descriptionIT?: string
    fabricOptionsIT?: string[]
    colourOptionsIT?: string[]
    metaTitleIT?: string
    metaDescIT?: string
    isVisible?: boolean
    isFeatured?: boolean
    sortOrder?: number
    photos: Array<{
        url: string
        altText?: string
        sortOrder?: number
        isPrimary?: boolean
    }>
}

/**
 * Create a new Design and associated DesignPhotos in a transaction.
 */
export async function createDesignInDb(data: CreateDesignInput) {
    // Generate unique slug
    let baseSlug = (data.slug?.trim() || data.nameEN.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    if (!baseSlug) baseSlug = `design-${Date.now()}`

    let uniqueSlug = baseSlug
    let counter = 1
    while (await prisma.design.findUnique({ where: { slug: uniqueSlug } })) {
        uniqueSlug = `${baseSlug}-${counter}`
        counter++
    }

    // Determine max sortOrder if not provided
    const maxSort = await prisma.design.aggregate({
        _max: { sortOrder: true },
    })
    const sortOrder = data.sortOrder ?? ((maxSort._max.sortOrder ?? 0) + 1)

    // Ensure photo list has at least one item
    const photoList = data.photos && data.photos.length > 0
        ? data.photos
        : [{ url: '/images/design-agbada.jpg', altText: data.nameEN, sortOrder: 0, isPrimary: true }]

    return prisma.design.create({
        data: {
            slug: uniqueSlug,
            sku: data.sku || null,
            category: data.category,
            turnaroundDays: data.turnaroundDays,
            priceNGN: data.priceNGN,
            priceEUR: data.priceEUR,
            pricingNote: data.pricingNote?.trim() || null,
            nameEN: data.nameEN.trim(),
            descriptionEN: data.descriptionEN.trim(),
            fabricOptionsEN: data.fabricOptionsEN,
            colourOptionsEN: data.colourOptionsEN,
            metaTitleEN: data.metaTitleEN || null,
            metaDescEN: data.metaDescEN || null,
            nameIT: data.nameIT?.trim() || data.nameEN.trim(),
            descriptionIT: data.descriptionIT?.trim() || data.descriptionEN.trim(),
            fabricOptionsIT: data.fabricOptionsIT || data.fabricOptionsEN,
            colourOptionsIT: data.colourOptionsIT || data.colourOptionsEN,
            metaTitleIT: data.metaTitleIT || null,
            metaDescIT: data.metaDescIT || null,
            isVisible: data.isVisible ?? true,
            isFeatured: data.isFeatured ?? false,
            sortOrder,
            photos: {
                create: photoList.map((p, idx) => ({
                    url: p.url.trim(),
                    altText: p.altText?.trim() || data.nameEN,
                    sortOrder: p.sortOrder ?? idx,
                    isPrimary: p.isPrimary ?? (idx === 0),
                })),
            },
        },
        include: {
            photos: { orderBy: { sortOrder: 'asc' } },
        },
    })
}

async function resolveDesignId(idOrSlug: string): Promise<string> {
    const existing = await prisma.design.findFirst({
        where: { OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
        select: { id: true },
    })
    return existing ? existing.id : idOrSlug
}

/**
 * Update an existing design and replace photos if provided.
 */
export async function updateDesignInDb(id: string, data: Partial<CreateDesignInput>) {
    const realId = await resolveDesignId(id)
    const updateData: any = { ...data }
    delete updateData.photos
    if (data.pricingNote !== undefined) {
        updateData.pricingNote = data.pricingNote?.trim() || null
    }

    if (data.photos) {
        return prisma.$transaction(async (tx) => {
            await tx.designPhoto.deleteMany({ where: { designId: realId } })
            return tx.design.update({
                where: { id: realId },
                data: {
                    ...updateData,
                    photos: {
                        create: data.photos!.map((p, idx) => ({
                            url: p.url.trim(),
                            altText: p.altText?.trim() || updateData.nameEN || 'Design photo',
                            sortOrder: p.sortOrder ?? idx,
                            isPrimary: p.isPrimary ?? (idx === 0),
                        })),
                    },
                },
                include: { photos: { orderBy: { sortOrder: 'asc' } } },
            })
        })
    }

    return prisma.design.update({
        where: { id: realId },
        data: updateData,
        include: { photos: { orderBy: { sortOrder: 'asc' } } },
    })
}

/**
 * Delete a design by ID or slug.
 */
export async function deleteDesignInDb(id: string) {
    const realId = await resolveDesignId(id)
    return prisma.design.delete({
        where: { id: realId },
    })
}

/**
 * Toggle visibility of a design.
 */
export async function toggleDesignVisibilityInDb(id: string, isVisible: boolean) {
    const realId = await resolveDesignId(id)
    return prisma.design.update({
        where: { id: realId },
        data: { isVisible },
    })
}

/**
 * Toggle featured status of a design.
 */
export async function toggleDesignFeaturedInDb(id: string, isFeatured: boolean) {
    const realId = await resolveDesignId(id)
    return prisma.design.update({
        where: { id: realId },
        data: { isFeatured },
    })
}

/**
 * Batch reorder designs.
 */
export async function reorderDesignsInDb(orderedIds: string[]) {
    return prisma.$transaction(
        orderedIds.map((id, index) =>
            prisma.design.update({
                where: { id },
                data: { sortOrder: index + 1 },
            })
        )
    )
}

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
