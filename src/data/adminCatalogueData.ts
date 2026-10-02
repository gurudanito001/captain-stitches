export type CatalogueCategory = 'native-wear' | 'english-suit' | 'casual' | 'children'

export interface DesignPhoto {
    id: string
    url: string
    isCover: boolean
    caption?: string
}

export interface DesignReviewItem {
    id: string
    customerName: string
    rating: number
    comment: string
    date: string
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
    photos?: string[]
}

export interface CatalogueDesign {
    id: string
    slug: string
    sortOrder: number
    category: CatalogueCategory
    categoryLabel: string
    isVisible: boolean
    isFeatured: boolean
    turnaroundDays: number
    pricing: {
        priceNGN: number
        priceEUR: number
        pricingNote?: string
    }
    photos: DesignPhoto[]
    fabrics: string[]
    colours: Array<{ name: string; hex?: string }>
    contentEN: {
        name: string
        description: string
        tags: string[]
    }
    contentIT: {
        name: string
        description: string
        tags: string[]
    }
    seo: {
        metaTitleEN: string
        metaDescriptionEN: string
        metaTitleIT: string
        metaDescriptionIT: string
    }
    stats: {
        totalOrders: number
        averageRating: number
        reviewCount: number
        dateCreated: string
        lastUpdated: string
        popularFabrics: string[]
        popularColours: string[]
    }
    reviews: DesignReviewItem[]
}

export const CATEGORY_OPTIONS: { key: CatalogueCategory; label: string }[] = [
    { key: 'native-wear', label: 'Native Wear' },
    { key: 'english-suit', label: 'Fabric Accessories' },
    { key: 'casual', label: 'Casual Wear' },
    { key: 'children', label: "Children's" },
]

export const INITIAL_CATALOGUE_DESIGNS: CatalogueDesign[] = []

const CATALOGUE_STORAGE_KEY = 'cs_admin_catalogue_store_v2'

export function getAllDesigns(): CatalogueDesign[] {
    if (typeof window === 'undefined') return INITIAL_CATALOGUE_DESIGNS
    try {
        const stored = localStorage.getItem(CATALOGUE_STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(CATALOGUE_STORAGE_KEY, JSON.stringify(INITIAL_CATALOGUE_DESIGNS))
            return INITIAL_CATALOGUE_DESIGNS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_CATALOGUE_DESIGNS
    }
}

export function saveAllDesigns(designs: CatalogueDesign[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(CATALOGUE_STORAGE_KEY, JSON.stringify(designs))
    } catch (e) {
        console.error('Failed to persist catalogue store', e)
    }
}

export function getDesignById(idOrSlug: string): CatalogueDesign | undefined {
    const list = getAllDesigns()
    return list.find((d) => d.id === idOrSlug || d.slug === idOrSlug)
}

export function saveDesign(updatedDesign: CatalogueDesign): void {
    const list = getAllDesigns()
    const idx = list.findIndex((d) => d.id === updatedDesign.id)
    if (idx !== -1) {
        list[idx] = updatedDesign
    } else {
        list.unshift(updatedDesign)
    }
    saveAllDesigns(list)
}

export function deleteDesign(id: string): void {
    const list = getAllDesigns()
    const filtered = list.filter((d) => d.id !== id)
    saveAllDesigns(filtered)
}

export function duplicateDesign(id: string): CatalogueDesign | undefined {
    const original = getDesignById(id)
    if (!original) return undefined
    const newId = `des-${Date.now()}`
    const duplicated: CatalogueDesign = {
        ...original,
        id: newId,
        slug: `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        contentEN: {
            ...original.contentEN,
            name: `${original.contentEN.name} (Copy)`,
        },
        contentIT: {
            ...original.contentIT,
            name: `${original.contentIT.name} (Copia)`,
        },
        isVisible: false,
        isFeatured: false,
        stats: {
            totalOrders: 0,
            averageRating: 0,
            reviewCount: 0,
            dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            popularFabrics: [],
            popularColours: [],
        },
        reviews: [],
    }
    saveDesign(duplicated)
    return duplicated
}
