export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ReviewCustomerInfo {
    id: string
    name: string
    initials: string
    avatarColor: string
    location: string
    email: string
    phone: string
    totalOrders: number
    previousReviewsCount: number
    previousAverageRating: number
}

export interface ReviewDesignInfo {
    id: string
    slug: string
    name: string
    category: string
    categoryLabel: string
    thumbnail: string
    priceNGN: number
    priceEUR: number
    currentAverageRating?: number
    totalApprovedReviews?: number
}

export interface ReviewOrderInfo {
    id: string
    orderNumber: string
    orderDate: string
    fabric: string
    colour: string
    tailorName: string
    deliveryDate: string
    garmentName?: string
    specificationsSummary?: string
    inspectionPhoto?: string
}

export interface ReviewModerationInfo {
    moderatorName?: string
    moderatedAt?: string
    rejectionReason?: string
    internalReason?: string
    moderatorNote?: string
    isFlagged: boolean
    flagNote?: string
}

export interface AdminReviewItem {
    id: string
    code: string // Public review ref code
    status: ReviewStatus
    rating: number // 1 to 5
    comment: string
    photos: string[]
    dateSubmitted: string
    timeSubmitted: string
    customer: ReviewCustomerInfo
    design: ReviewDesignInfo
    order: ReviewOrderInfo
    moderation: ReviewModerationInfo
}

export const INITIAL_ADMIN_REVIEWS: AdminReviewItem[] = []

const STORAGE_KEY = 'cs_admin_reviews_v2'

export function getAllReviews(): AdminReviewItem[] {
    if (typeof window === 'undefined') return INITIAL_ADMIN_REVIEWS
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_REVIEWS))
            return INITIAL_ADMIN_REVIEWS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ADMIN_REVIEWS
    }
}

export function saveAllReviews(reviews: AdminReviewItem[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews))
    } catch (e) {
        console.error('Failed to save reviews to localStorage', e)
    }
}

export function getReviewById(id: string): AdminReviewItem | undefined {
    const reviews = getAllReviews()
    return reviews.find((r) => r.id === id)
}

export function updateReviewStatus(
    id: string,
    status: ReviewStatus,
    reason?: string,
    internalNote?: string
): AdminReviewItem[] {
    const reviews = getAllReviews()
    const now = new Date()
    const formattedDate = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    const updated = reviews.map((r) => {
        if (r.id !== id) return r
        return {
            ...r,
            status,
            moderation: {
                ...r.moderation,
                moderatorName: 'Samuelson',
                moderatedAt: formattedDate,
                rejectionReason: status === 'REJECTED' ? reason || r.moderation.rejectionReason : undefined,
                internalReason: reason || r.moderation.internalReason,
                moderatorNote: internalNote !== undefined ? internalNote : r.moderation.moderatorNote,
                isFlagged: status === 'APPROVED' || status === 'REJECTED' ? false : r.moderation.isFlagged,
            },
        }
    })

    saveAllReviews(updated)
    return updated
}

export function flagReview(id: string, flagNote: string): AdminReviewItem[] {
    const reviews = getAllReviews()
    const updated = reviews.map((r) => {
        if (r.id !== id) return r
        return {
            ...r,
            moderation: {
                ...r.moderation,
                isFlagged: true,
                flagNote,
            },
        }
    })
    saveAllReviews(updated)
    return updated
}

export function unflagReview(id: string): AdminReviewItem[] {
    const reviews = getAllReviews()
    const updated = reviews.map((r) => {
        if (r.id !== id) return r
        return {
            ...r,
            moderation: {
                ...r.moderation,
                isFlagged: false,
                flagNote: undefined,
            },
        }
    })
    saveAllReviews(updated)
    return updated
}

export function bulkUpdateReviewStatus(
    ids: string[],
    status: ReviewStatus,
    reason?: string
): AdminReviewItem[] {
    const reviews = getAllReviews()
    const now = new Date()
    const formattedDate = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    const updated = reviews.map((r) => {
        if (!ids.includes(r.id)) return r
        return {
            ...r,
            status,
            moderation: {
                ...r.moderation,
                moderatorName: 'Samuelson',
                moderatedAt: formattedDate,
                rejectionReason: status === 'REJECTED' ? reason || 'Bulk moderation decision' : undefined,
                internalReason: reason || r.moderation.internalReason,
                isFlagged: false,
            },
        }
    })

    saveAllReviews(updated)
    return updated
}

export function updateModeratorNote(id: string, note: string): AdminReviewItem[] {
    const reviews = getAllReviews()
    const updated = reviews.map((r) => {
        if (r.id !== id) return r
        return {
            ...r,
            moderation: {
                ...r.moderation,
                moderatorNote: note,
            },
        }
    })
    saveAllReviews(updated)
    return updated
}
