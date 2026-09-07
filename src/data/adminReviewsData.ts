export type ReviewStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface ReviewCustomerInfo {
    id: string
    name: string
    initials: string
    avatarColor: string
    location: 'Italy' | 'Nigeria'
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
    currentAverageRating: number
    totalApprovedReviews: number
}

export interface ReviewOrderInfo {
    id: string
    orderNumber: string
    garmentName: string
    deliveryDate: string
    inspectionPhoto?: string
    specificationsSummary?: string
}

export interface ReviewModerationInfo {
    isFlagged: boolean
    flagNote?: string
    internalReason?: string
    moderatorNote?: string
    moderatorName?: string
    moderatedAt?: string
    rejectionReason?: string
}

export interface AdminReviewItem {
    id: string
    code: string // e.g., 'REV-2026-081'
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

export const INITIAL_ADMIN_REVIEWS: AdminReviewItem[] = [
    {
        id: 'rev-001',
        code: 'REV-2026-081',
        status: 'PENDING',
        rating: 5,
        comment:
            'The embroidery work on this Agbada is breathtaking! I wore it to the Nigerian-Italian cultural gala in Rome and everyone stopped to ask where I had it made. The fabric weight is rich and falls elegantly.',
        photos: [
            'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        ],
        dateSubmitted: 'Jun 3, 2026',
        timeSubmitted: '15:20',
        customer: {
            id: 'cust-1',
            name: 'Adewale Okafor',
            initials: 'AO',
            avatarColor: '#C4975A',
            location: 'Italy',
            email: 'adewale.okafor@gmail.com',
            phone: '+39 347 123 4567',
            totalOrders: 4,
            previousReviewsCount: 3,
            previousAverageRating: 5.0,
        },
        design: {
            id: 'des-1',
            slug: 'grand-agbada',
            name: 'The Grand Agbada',
            category: 'native-wear',
            categoryLabel: 'Native Wear',
            thumbnail: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 4.9,
            totalApprovedReviews: 38,
        },
        order: {
            id: 'ord-1',
            orderNumber: 'CS-2026-001',
            garmentName: 'Imperial 3-Piece Grand Agbada',
            deliveryDate: 'May 30, 2026',
            inspectionPhoto: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80',
            specificationsSummary: 'Imperial Royal Guinea Brocade, Obsidian Black & Gold filigree stitching, chest 106cm.',
        },
        moderation: {
            isFlagged: false,
            moderatorNote: 'High-value customer review with excellent gala photos. Ready for storefront showcase.',
        },
    },
    {
        id: 'rev-002',
        code: 'REV-2026-082',
        status: 'PENDING',
        rating: 4,
        comment:
            'Fantastic tailoring on the Royal Senator. The chest and shoulders fit like a second skin. The only small note is the sleeves were about 1cm longer than expected, but easily adjusted. Will definitely order again.',
        photos: [
            'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
        ],
        dateSubmitted: 'Jun 2, 2026',
        timeSubmitted: '11:45',
        customer: {
            id: 'cust-2',
            name: 'Chidi Okeke',
            initials: 'CO',
            avatarColor: '#2B4C7E',
            location: 'Italy',
            email: 'chidi.okeke@studioarch.it',
            phone: '+39 333 987 6543',
            totalOrders: 3,
            previousReviewsCount: 2,
            previousAverageRating: 4.5,
        },
        design: {
            id: 'des-2',
            slug: 'royal-senator',
            name: 'The Royal Senator',
            category: 'native-wear',
            categoryLabel: 'Native Wear',
            thumbnail: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 4.8,
            totalApprovedReviews: 29,
        },
        order: {
            id: 'ord-2',
            orderNumber: 'CS-2026-002',
            garmentName: 'Bespoke Senator Suit with Geometric Collar',
            deliveryDate: 'May 28, 2026',
            inspectionPhoto: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1000&q=80',
            specificationsSummary: 'Super 140s Wool, Midnight Navy with subtle tonal piping.',
        },
        moderation: {
            isFlagged: false,
            moderatorNote: 'Constructive review. Flagged to master tailor Kolapo to note for future orders.',
        },
    },
    {
        id: 'rev-003',
        code: 'REV-2026-083',
        status: 'PENDING',
        rating: 2,
        comment:
            'The fabric is beautiful but the trousers are far too tight around the thighs. I can barely sit down in them comfortably. Samuelson please call me urgently to resolve this before my sister’s wedding next Saturday.',
        photos: [],
        dateSubmitted: 'Jun 1, 2026',
        timeSubmitted: '19:10',
        customer: {
            id: 'cust-5',
            name: 'Tunde Bakare',
            initials: 'TB',
            avatarColor: '#B45309',
            location: 'Nigeria',
            email: 'tunde.bakare@lagoscap.ng',
            phone: '+234 803 765 4321',
            totalOrders: 1,
            previousReviewsCount: 0,
            previousAverageRating: 0,
        },
        design: {
            id: 'des-3',
            slug: 'riviera-linen-suit',
            name: 'The Riviera Linen Suit',
            category: 'english-suit',
            categoryLabel: 'English Suits',
            thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 4.7,
            totalApprovedReviews: 22,
        },
        order: {
            id: 'ord-5',
            orderNumber: 'CS-2026-005',
            garmentName: 'Double-Breasted Pure Italian Linen Suit',
            deliveryDate: 'May 26, 2026',
            inspectionPhoto: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80',
            specificationsSummary: 'Pure Italian Linen, Sand Dune Beige, slim-fit silhouette.',
        },
        moderation: {
            isFlagged: true,
            flagNote: 'Customer needs immediate fitting adjustment. WhatsApp message initiated by Samuelson before approving.',
        },
    },
    {
        id: 'rev-004',
        code: 'REV-2026-074',
        status: 'APPROVED',
        rating: 5,
        comment:
            'Unbelievable craftsmanship. As someone who buys bespoke suits in Naples, CaptainStitches matches that standard effortlessly while infusing our African identity. The Milan delivery took only 6 days after inspection.',
        photos: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        ],
        dateSubmitted: 'May 20, 2026',
        timeSubmitted: '10:05',
        customer: {
            id: 'cust-3',
            name: 'Kunle Adeleke',
            initials: 'KA',
            avatarColor: '#1E3A8A',
            location: 'Italy',
            email: 'kunle.adeleke@luxuryconsulting.com',
            phone: '+39 349 555 0192',
            totalOrders: 5,
            previousReviewsCount: 4,
            previousAverageRating: 4.9,
        },
        design: {
            id: 'des-1',
            slug: 'grand-agbada',
            name: 'The Grand Agbada',
            category: 'native-wear',
            categoryLabel: 'Native Wear',
            thumbnail: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 4.9,
            totalApprovedReviews: 38,
        },
        order: {
            id: 'ord-3',
            orderNumber: 'CS-2026-003',
            garmentName: 'The Royal Senator in Silk Wool',
            deliveryDate: 'May 16, 2026',
            inspectionPhoto: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
            specificationsSummary: 'Silk-Wool blend, Royal Ivory, handcrafted buttons.',
        },
        moderation: {
            isFlagged: false,
            moderatorName: 'Samuelson',
            moderatedAt: 'May 20, 2026 · 14:10',
            internalReason: 'Exceptional feedback from VIP customer. Eligible for storefront testimonials.',
        },
    },
    {
        id: 'rev-005',
        code: 'REV-2026-071',
        status: 'APPROVED',
        rating: 5,
        comment:
            'Ordered matching Safari jackets for myself and my son for his 5th birthday celebration. The attention to detail on the junior size was astonishing. Samuelson sent us video of the embroidery before dispatch.',
        photos: [
            'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=1000&q=80',
        ],
        dateSubmitted: 'May 15, 2026',
        timeSubmitted: '16:42',
        customer: {
            id: 'cust-4',
            name: 'Chioma Eze',
            initials: 'CE',
            avatarColor: '#059669',
            location: 'Nigeria',
            email: 'chioma.eze@heritagelegal.ng',
            phone: '+234 802 345 6789',
            totalOrders: 2,
            previousReviewsCount: 1,
            previousAverageRating: 5.0,
        },
        design: {
            id: 'des-4',
            slug: 'contemporary-safari',
            name: 'The Contemporary Safari',
            category: 'casual',
            categoryLabel: 'Casual Wear',
            thumbnail: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 4.8,
            totalApprovedReviews: 18,
        },
        order: {
            id: 'ord-4',
            orderNumber: 'CS-2026-004',
            garmentName: 'Contemporary Safari Overshirt & Shorts Duo',
            deliveryDate: 'May 12, 2026',
            inspectionPhoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1000&q=80',
            specificationsSummary: 'Heavyweight Italian Cotton Twill, Olive Drab & Horn buttons.',
        },
        moderation: {
            isFlagged: false,
            moderatorName: 'Samuelson',
            moderatedAt: 'May 16, 2026 · 09:30',
            internalReason: 'Approved for storefront. Father & son imagery verified with customer permission.',
        },
    },
    {
        id: 'rev-006',
        code: 'REV-2026-068',
        status: 'REJECTED',
        rating: 1,
        comment:
            'DO NOT BUY THIS SCAM! WhatsApp crypto investment bot: send 1 BTC to receive 3 BTC back in 24 hours. Contact @crypto_fast on Telegram now for free VIP trading signals!!!',
        photos: [],
        dateSubmitted: 'May 8, 2026',
        timeSubmitted: '03:15',
        customer: {
            id: 'cust-anon-1',
            name: 'Anonymous Bot',
            initials: 'AB',
            avatarColor: '#6B7280',
            location: 'Nigeria',
            email: 'spammer8831@mailinator.com',
            phone: '+234 800 000 0000',
            totalOrders: 0,
            previousReviewsCount: 0,
            previousAverageRating: 0,
        },
        design: {
            id: 'des-2',
            slug: 'royal-senator',
            name: 'The Royal Senator',
            category: 'native-wear',
            categoryLabel: 'Native Wear',
            thumbnail: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 4.8,
            totalApprovedReviews: 29,
        },
        order: {
            id: 'ord-anon',
            orderNumber: 'CS-UNKNOWN',
            garmentName: 'Unverified Order',
            deliveryDate: 'N/A',
        },
        moderation: {
            isFlagged: false,
            moderatorName: 'Samuelson',
            moderatedAt: 'May 8, 2026 · 08:00',
            rejectionReason: 'Spam promotion and fraudulent cryptocurrency solicitations. Banned submitter.',
            internalReason: 'Automated spam submission caught by moderation filter.',
        },
    },
    {
        id: 'rev-007',
        code: 'REV-2026-065',
        status: 'APPROVED',
        rating: 5,
        comment:
            'A true work of art. The Italian double-faced cashmere jacket fits like a glove. Wearing this in Turin during late autumn had everyone turning heads. Worth every Euro.',
        photos: [
            'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80',
        ],
        dateSubmitted: 'Apr 29, 2026',
        timeSubmitted: '18:50',
        customer: {
            id: 'cust-1',
            name: 'Adewale Okafor',
            initials: 'AO',
            avatarColor: '#C4975A',
            location: 'Italy',
            email: 'adewale.okafor@gmail.com',
            phone: '+39 347 123 4567',
            totalOrders: 4,
            previousReviewsCount: 3,
            previousAverageRating: 5.0,
        },
        design: {
            id: 'des-5',
            slug: 'cashmere-evening-kaftan',
            name: 'Cashmere Evening Kaftan',
            category: 'native-wear',
            categoryLabel: 'Native Wear',
            thumbnail: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 5.0,
            totalApprovedReviews: 14,
        },
        order: {
            id: 'ord-10',
            orderNumber: 'CS-2026-010',
            garmentName: 'Cashmere Evening Kaftan in Charcoal',
            deliveryDate: 'Apr 24, 2026',
            inspectionPhoto: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80',
            specificationsSummary: 'Double-Faced Cashmere, Charcoal Grey, hand-tucked cuffs.',
        },
        moderation: {
            isFlagged: false,
            moderatorName: 'Samuelson',
            moderatedAt: 'Apr 30, 2026 · 11:20',
            internalReason: 'Stunning review from Adewale.',
        },
    },
    {
        id: 'rev-008',
        code: 'REV-2026-061',
        status: 'PENDING',
        rating: 5,
        comment:
            'Ordered for my brother’s introduction ceremony in Abuja. The packaging and presentation box alone felt like opening a piece from Savile Row. The embroidery precision is unmatched.',
        photos: [],
        dateSubmitted: 'Apr 22, 2026',
        timeSubmitted: '13:08',
        customer: {
            id: 'cust-6',
            name: 'Ngozi Okonjo',
            initials: 'NO',
            avatarColor: '#9333EA',
            location: 'Nigeria',
            email: 'ngozi.okonjo@capitaltrade.com',
            phone: '+234 809 111 2233',
            totalOrders: 2,
            previousReviewsCount: 1,
            previousAverageRating: 5.0,
        },
        design: {
            id: 'des-1',
            slug: 'grand-agbada',
            name: 'The Grand Agbada',
            category: 'native-wear',
            categoryLabel: 'Native Wear',
            thumbnail: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80',
            currentAverageRating: 4.9,
            totalApprovedReviews: 38,
        },
        order: {
            id: 'ord-12',
            orderNumber: 'CS-2026-012',
            garmentName: 'Grand Agbada in Royal Ivory',
            deliveryDate: 'Apr 18, 2026',
            inspectionPhoto: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1000&q=80',
            specificationsSummary: 'Swiss Voile Damask, Royal Ivory with Gold filigree, chest 102cm.',
        },
        moderation: {
            isFlagged: false,
            moderatorNote: 'Pending final review before publishing.',
        },
    },
]

const STORAGE_KEY = 'cs_admin_reviews_v1'

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
