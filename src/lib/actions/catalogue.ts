'use server'

import { revalidatePath } from 'next/cache'
import {
    createDesignInDb,
    updateDesignInDb,
    deleteDesignInDb,
    toggleDesignVisibilityInDb,
    toggleDesignFeaturedInDb,
    reorderDesignsInDb,
    getAllDesignsAdmin,
    getDesignById,
    getPublishedDesigns,
    fromPrismaCategory,
    getCategoryLabel,
    toPrismaCategory,
    mapPrismaDesignToCatalogueDesign,
    CreateDesignInput,
} from '@/lib/dal/catalogue'
import type { CatalogueCategory, CatalogueDesign } from '@/data/adminCatalogueData'
import { parseColour } from '@/lib/utils/colours'

export interface CreateDesignActionPayload {
    slug?: string
    sku?: string
    category: CatalogueCategory
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
 * Server Action: Create a new design in the database.
 */
export async function createDesignAction(payload: CreateDesignActionPayload) {
    try {
        if (!payload.nameEN || !payload.nameEN.trim()) {
            return { success: false, error: 'English design title is required.' }
        }
        if (!payload.priceNGN || payload.priceNGN <= 0) {
            return { success: false, error: 'A valid NGN price is required.' }
        }
        if (!payload.priceEUR || payload.priceEUR <= 0) {
            return { success: false, error: 'A valid EUR price is required.' }
        }

        const input: CreateDesignInput = {
            slug: payload.slug?.trim() || undefined,
            sku: payload.sku?.trim() || undefined,
            category: toPrismaCategory(payload.category),
            turnaroundDays: payload.turnaroundDays || 14,
            priceNGN: Number(payload.priceNGN),
            priceEUR: Number(payload.priceEUR),
            pricingNote: payload.pricingNote?.trim() || undefined,
            nameEN: payload.nameEN.trim(),
            descriptionEN: payload.descriptionEN?.trim() || '',
            fabricOptionsEN: payload.fabricOptionsEN || [],
            colourOptionsEN: payload.colourOptionsEN || [],
            metaTitleEN: payload.metaTitleEN?.trim() || undefined,
            metaDescEN: payload.metaDescEN?.trim() || undefined,
            nameIT: payload.nameIT?.trim() || payload.nameEN.trim(),
            descriptionIT: payload.descriptionIT?.trim() || payload.descriptionEN?.trim() || '',
            fabricOptionsIT: payload.fabricOptionsIT || payload.fabricOptionsEN || [],
            colourOptionsIT: payload.colourOptionsIT || payload.colourOptionsEN || [],
            metaTitleIT: payload.metaTitleIT?.trim() || undefined,
            metaDescIT: payload.metaDescIT?.trim() || undefined,
            isVisible: payload.isVisible ?? true,
            isFeatured: payload.isFeatured ?? false,
            sortOrder: payload.sortOrder,
            photos: payload.photos || [],
        }

        const created = await createDesignInDb(input)

        // Revalidate storefront and admin paths
        revalidatePath('/catalogue')
        revalidatePath('/admin/catalogue')
        revalidatePath('/')

        return {
            success: true,
            designId: created.id,
            slug: created.slug,
        }
    } catch (err: any) {
        console.error('Error creating design:', err)
        return {
            success: false,
            error: err.message || 'Failed to create design in database.',
        }
    }
}

/**
 * Server Action: Update an existing design.
 */
export async function updateDesignAction(id: string, payload: Partial<CreateDesignActionPayload>) {
    try {
        const updateData: Partial<CreateDesignInput> = {
            ...payload,
            category: payload.category ? toPrismaCategory(payload.category) : undefined,
            priceNGN: payload.priceNGN !== undefined ? Number(payload.priceNGN) : undefined,
            priceEUR: payload.priceEUR !== undefined ? Number(payload.priceEUR) : undefined,
            pricingNote: payload.pricingNote !== undefined ? (payload.pricingNote?.trim() || '') : undefined,
        }

        const updated = await updateDesignInDb(id, updateData)

        revalidatePath('/catalogue')
        revalidatePath(`/catalogue/${updated.slug}`)
        revalidatePath('/admin/catalogue')
        revalidatePath(`/admin/catalogue/${id}`)
        revalidatePath('/')

        return {
            success: true,
            designId: updated.id,
            slug: updated.slug,
        }
    } catch (err: any) {
        console.error('Error updating design:', err)
        return {
            success: false,
            error: err.message || 'Failed to update design in database.',
        }
    }
}

/**
 * Server Action: Delete a design.
 */
export async function deleteDesignAction(id: string) {
    try {
        await deleteDesignInDb(id)

        revalidatePath('/catalogue')
        revalidatePath('/admin/catalogue')
        revalidatePath('/')

        return { success: true }
    } catch (err: any) {
        console.error('Error deleting design:', err)
        return {
            success: false,
            error: err.message || 'Failed to delete design from database.',
        }
    }
}

/**
 * Server Action: Toggle design visibility.
 */
export async function toggleDesignVisibilityAction(id: string, isVisible: boolean) {
    try {
        const updated = await toggleDesignVisibilityInDb(id, isVisible)

        revalidatePath('/catalogue')
        revalidatePath('/admin/catalogue')
        revalidatePath('/')

        return { success: true, isVisible: updated.isVisible }
    } catch (err: any) {
        console.error('Error toggling visibility:', err)
        return {
            success: false,
            error: err.message || 'Failed to toggle visibility.',
        }
    }
}

/**
 * Server Action: Toggle design featured status.
 */
export async function toggleDesignFeaturedAction(id: string, isFeatured: boolean) {
    try {
        const updated = await toggleDesignFeaturedInDb(id, isFeatured)

        revalidatePath('/catalogue')
        revalidatePath('/admin/catalogue')
        revalidatePath('/')

        return { success: true, isFeatured: updated.isFeatured }
    } catch (err: any) {
        console.error('Error toggling featured status:', err)
        return {
            success: false,
            error: err.message || 'Failed to toggle featured status.',
        }
    }
}

/**
 * Server Action: Reorder catalogue designs.
 */
export async function reorderDesignsAction(orderedIds: string[]) {
    try {
        await reorderDesignsInDb(orderedIds)

        revalidatePath('/catalogue')
        revalidatePath('/admin/catalogue')
        revalidatePath('/')

        return { success: true }
    } catch (err: any) {
        console.error('Error reordering designs:', err)
        return {
            success: false,
            error: err.message || 'Failed to update design order.',
        }
    }
}

/**
 * Server Action: Fetch all admin catalogue designs mapped to CatalogueDesign.
 */
export async function getAllDesignsAdminAction(): Promise<{ success: boolean; designs?: CatalogueDesign[]; error?: string }> {
    try {
        const records = await getAllDesignsAdmin()
        const mapped = records.map(mapPrismaDesignToCatalogueDesign)
        return { success: true, designs: mapped }
    } catch (err: any) {
        console.error('Error fetching admin designs:', err)
        return { success: false, error: err.message || 'Failed to load designs from database.' }
    }
}

/**
 * Server Action: Fetch a single design by ID for admin editor.
 */
export async function getDesignByIdAction(id: string): Promise<{ success: boolean; design?: CatalogueDesign; error?: string }> {
    try {
        const record = await getDesignById(id)
        if (!record) {
            return { success: false, error: 'Design not found in database.' }
        }
        return { success: true, design: mapPrismaDesignToCatalogueDesign(record) }
    } catch (err: any) {
        console.error('Error fetching design by ID:', err)
        return { success: false, error: err.message || 'Failed to load design.' }
    }
}

export interface PublicDesignItem {
    id: string
    name: string
    category: string
    categoryLabel: string
    priceNGN: number
    priceEUR: number
    turnaround: string
    turnaroundDays: number
    image: string
    slug: string
    fabrics: string[]
    colors: string[]
    colorOptions?: Array<{ name: string; hex: string }>
}

/**
 * Server Action: Fetch active published designs for public client views (e.g. Order Form).
 */
export async function getPublishedDesignsAction(): Promise<{ success: boolean; designs?: PublicDesignItem[]; error?: string }> {
    try {
        const records = await getPublishedDesigns()
        const designs: PublicDesignItem[] = records.map((d: any) => {
            const coverPhoto = d.photos.find((p: any) => p.isPrimary)?.url || d.photos[0]?.url || '/images/design-agbada.jpg'
            const fabrics = d.fabricOptionsEN?.length ? d.fabricOptionsEN : ['Presidential Cashmere', 'Premium Heavy Cotton']
            const rawColors = d.colourOptionsEN?.length ? d.colourOptionsEN : ['Midnight Black|#1C1C1C', 'Royal Ivory|#FAF5EA']
            const colorOptions = rawColors.map((r: string) => parseColour(r))
            const colors = colorOptions.map((c: any) => c.name)
            return {
                id: d.id,
                name: d.nameEN,
                category: fromPrismaCategory(d.category),
                categoryLabel: getCategoryLabel(d.category),
                priceNGN: d.priceNGN,
                priceEUR: d.priceEUR,
                turnaround: `${d.turnaroundDays ?? 14} days`,
                turnaroundDays: d.turnaroundDays ?? 14,
                image: coverPhoto,
                slug: d.slug,
                fabrics,
                colors,
                colorOptions,
            }
        })
        return { success: true, designs }
    } catch (err: any) {
        console.error('Error fetching published designs:', err)
        return { success: false, error: err.message || 'Failed to load designs from database.' }
    }
}
