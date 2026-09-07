import { Location, Currency } from './adminOrdersData'

export interface CustomerMeasurementsCm {
    chest: number
    shoulder: number
    sleeve: number
    waist: number
    hips: number
    inseam: number
    neck: number
    length: number
    fitNotes?: string
    lastUpdated: string
}

export interface CustomerReview {
    id: string
    designName: string
    rating: number
    comment: string
    date: string
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
}

export interface CustomerReferralReward {
    id: string
    type: string
    value: string
    status: 'PENDING' | 'CREDITED' | 'REDEEMED'
    orderApplied?: string
    date: string
}

export interface CustomerReferralRecord {
    refCode: string
    totalReferred: number
    convertedCount: number
    rewardsEarned: CustomerReferralReward[]
}

export interface CustomerEmailMarketing {
    isSubscribed: boolean
    source: string
    language: 'EN' | 'IT'
    lastOpenedEmail?: string
}

export interface CustomerSubscription {
    status: 'INACTIVE'
    tier: 'NONE' | 'STANDARD' | 'PRIORITY' | 'VIP'
    note: string
}

export interface CustomerOrderHistoryItem {
    orderId: string
    orderNumber: string
    garmentName: string
    date: string
    amountNGN: number
    amountEUR: number
    status: string
    thumbnail: string
}

export interface AdminCustomer {
    id: string
    name: string
    avatarColor: string
    email: string
    phone: string
    whatsapp: string
    location: Location
    address: string
    language: 'EN' | 'IT'
    currency: Currency
    dateJoined: string
    measurements: CustomerMeasurementsCm
    summary: {
        totalOrders: number
        totalSpentNGN: number
        totalSpentEUR: number
        lastOrderDate: string
        referralCount: number
        averageRating: number
    }
    ordersHistory: CustomerOrderHistoryItem[]
    reviews: CustomerReview[]
    referrals: CustomerReferralRecord[]
    emailMarketing: CustomerEmailMarketing
    subscription: CustomerSubscription
    adminNotes: Array<{
        id: string
        author: string
        text: string
        timestamp: string
    }>
}

export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = [
    {
        id: 'cust-1',
        name: 'Adewale Okafor',
        avatarColor: '#C4975A',
        email: 'adewale.okafor@gmail.com',
        phone: '+39 347 123 4567',
        whatsapp: '+39 347 123 4567',
        location: 'Italy',
        address: 'Via Dante 14, 20121 Milano, Italy',
        language: 'EN',
        currency: 'EUR',
        dateJoined: 'Oct 14, 2025',
        measurements: {
            chest: 107, // ~42"
            shoulder: 47,
            sleeve: 65,
            waist: 89,
            hips: 104,
            inseam: 81,
            neck: 42,
            length: 112,
            fitNotes: 'Prefers slightly tapered sleeves and comfort fit around chest for Agbada.',
            lastUpdated: 'May 28, 2026',
        },
        summary: {
            totalOrders: 4,
            totalSpentNGN: 480000,
            totalSpentEUR: 272,
            lastOrderDate: 'May 28, 2026',
            referralCount: 6,
            averageRating: 5.0,
        },
        ordersHistory: [
            {
                orderId: '1',
                orderNumber: 'CS-0091',
                garmentName: 'Grand Agbada',
                date: 'May 28, 2026',
                amountNGN: 120000,
                amountEUR: 68,
                status: 'INSPECTION',
                thumbnail: '/images/design-agbada.jpg',
            },
            {
                orderId: 'h-1',
                orderNumber: 'CS-0072',
                garmentName: 'Classic Senator',
                date: 'Feb 10, 2026',
                amountNGN: 85000,
                amountEUR: 47,
                status: 'DELIVERED',
                thumbnail: '/images/design-senator.jpg',
            },
            {
                orderId: 'h-2',
                orderNumber: 'CS-0058',
                garmentName: 'Italian 3-Piece Suit',
                date: 'Dec 02, 2025',
                amountNGN: 160000,
                amountEUR: 90,
                status: 'DELIVERED',
                thumbnail: '/images/design-suit.jpg',
            },
            {
                orderId: 'h-3',
                orderNumber: 'CS-0044',
                garmentName: 'Kaftan Royale',
                date: 'Oct 16, 2025',
                amountNGN: 75000,
                amountEUR: 42,
                status: 'DELIVERED',
                thumbnail: '/images/design-kaftan.jpg',
            },
        ],
        reviews: [
            {
                id: 'rev-1',
                designName: 'Italian 3-Piece Suit',
                rating: 5,
                comment: 'The fit is sublime. Received so many compliments at the Milan trade banquet. Samuelson is a true artist.',
                date: 'Dec 18, 2025',
                status: 'APPROVED',
            },
            {
                id: 'rev-2',
                designName: 'Classic Senator',
                rating: 5,
                comment: 'The fabric breathes well and the neck collar is razor sharp.',
                date: 'Feb 24, 2026',
                status: 'APPROVED',
            },
        ],
        referrals: [
            {
                refCode: 'CS-ADEWALE40',
                totalReferred: 6,
                convertedCount: 4,
                rewardsEarned: [
                    { id: 'r-1', type: '15% Off Next Commission', value: '€25 Voucher', status: 'REDEEMED', orderApplied: 'CS-0072', date: 'Feb 05, 2026' },
                    { id: 'r-2', type: 'Free Matching Silk Pocket Square', value: 'Accessory', status: 'REDEEMED', orderApplied: 'CS-0091', date: 'May 28, 2026' },
                    { id: 'r-3', type: '10% Referral Kickback', value: '€20 Credit', status: 'CREDITED', date: 'May 10, 2026' },
                ],
            },
        ],
        emailMarketing: {
            isSubscribed: true,
            source: 'Website Order Checkout',
            language: 'EN',
            lastOpenedEmail: 'Summer Milan Lookbook — Opened Jun 1, 2026',
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'Subscription infrastructure dormant until public rollout.',
        },
        adminNotes: [
            { id: 'cn-1', author: 'Samuelson', text: 'Prefers communicating exclusively on WhatsApp. Milan resident who often orders ahead of gala events.', timestamp: 'May 28, 2026 · 11:40 AM' },
            { id: 'cn-2', author: 'Samuelson', text: 'Top ambassador in Northern Italy. Always credit referral perks generously.', timestamp: 'Feb 10, 2026 · 03:20 PM' },
        ],
    },
    {
        id: 'cust-2',
        name: 'Chidi Ikenna',
        avatarColor: '#166534',
        email: 'chidi.ikenna@venturepartners.ng',
        phone: '+234 803 555 7890',
        whatsapp: '+234 803 555 7890',
        location: 'Nigeria',
        address: 'Plot 12B Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
        language: 'EN',
        currency: 'NGN',
        dateJoined: 'Nov 20, 2025',
        measurements: {
            chest: 102,
            shoulder: 44.5,
            sleeve: 62,
            waist: 84,
            hips: 99,
            inseam: 79,
            neck: 39.5,
            length: 104,
            fitNotes: 'Slim fit Italian cut, high armhole, slight break on trousers.',
            lastUpdated: 'May 20, 2026',
        },
        summary: {
            totalOrders: 2,
            totalSpentNGN: 245000,
            totalSpentEUR: 137,
            lastOrderDate: 'May 20, 2026',
            referralCount: 2,
            averageRating: 4.8,
        },
        ordersHistory: [
            {
                orderId: '2',
                orderNumber: 'CS-0090',
                garmentName: 'Italian 3-Piece Suit',
                date: 'May 20, 2026',
                amountNGN: 160000,
                amountEUR: 90,
                status: 'IN_PRODUCTION',
                thumbnail: '/images/design-suit.jpg',
            },
            {
                orderId: 'h-4',
                orderNumber: 'CS-0065',
                garmentName: 'Classic Senator',
                date: 'Jan 14, 2026',
                amountNGN: 85000,
                amountEUR: 47,
                status: 'DELIVERED',
                thumbnail: '/images/design-senator.jpg',
            },
        ],
        reviews: [
            {
                id: 'rev-3',
                designName: 'Classic Senator',
                rating: 5,
                comment: 'The stitching is impeccable. Exactly what I needed for executive board presentations.',
                date: 'Jan 28, 2026',
                status: 'APPROVED',
            },
        ],
        referrals: [
            {
                refCode: 'CS-CHIDI22',
                totalReferred: 2,
                convertedCount: 1,
                rewardsEarned: [
                    { id: 'r-4', type: '₦15,000 Next Order Discount', value: '₦15,000', status: 'CREDITED', date: 'Feb 15, 2026' },
                ],
            },
        ],
        emailMarketing: {
            isSubscribed: true,
            source: 'Corporate Referral',
            language: 'EN',
            lastOpenedEmail: 'Executive Bespoke Guide — Opened Apr 12, 2026',
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'Candidate for VIP Corporate Membership upon subscription feature activation.',
        },
        adminNotes: [
            { id: 'cn-3', author: 'Samuelson', text: 'High-profile venture capitalist in Lagos. Orders require strict adherence to board meeting dates.', timestamp: 'May 20, 2026 · 09:00 AM' },
        ],
    },
    {
        id: 'cust-3',
        name: 'Ngozi Nwosu',
        avatarColor: '#7A4F2E',
        email: 'ngozi.nwosu@studiolegale.it',
        phone: '+39 338 889 0123',
        whatsapp: '+39 338 889 0123',
        location: 'Italy',
        address: 'Corso Buenos Aires 45, 20124 Milano, Italy',
        language: 'IT',
        currency: 'EUR',
        dateJoined: 'Jan 05, 2026',
        measurements: {
            chest: 96.5,
            shoulder: 42,
            sleeve: 60,
            waist: 79,
            hips: 96.5,
            inseam: 76,
            neck: 38,
            length: 99,
            fitNotes: 'Clean, minimalist lines, mandarin collar.',
            lastUpdated: 'Jun 01, 2026',
        },
        summary: {
            totalOrders: 3,
            totalSpentNGN: 270000,
            totalSpentEUR: 152,
            lastOrderDate: 'Jun 01, 2026',
            referralCount: 3,
            averageRating: 5.0,
        },
        ordersHistory: [
            {
                orderId: '3',
                orderNumber: 'CS-0089',
                garmentName: 'Kaftan Royale',
                date: 'Jun 01, 2026',
                amountNGN: 75000,
                amountEUR: 42,
                status: 'CONFIRMED',
                thumbnail: '/images/design-kaftan.jpg',
            },
            {
                orderId: 'h-5',
                orderNumber: 'CS-0078',
                garmentName: 'Grand Agbada',
                date: 'Mar 15, 2026',
                amountNGN: 120000,
                amountEUR: 68,
                status: 'DELIVERED',
                thumbnail: '/images/design-agbada.jpg',
            },
            {
                orderId: 'h-6',
                orderNumber: 'CS-0069',
                garmentName: 'Classic Senator',
                date: 'Feb 02, 2026',
                amountNGN: 85000,
                amountEUR: 47,
                status: 'DELIVERED',
                thumbnail: '/images/design-senator.jpg',
            },
        ],
        reviews: [
            {
                id: 'rev-4',
                designName: 'Grand Agbada',
                rating: 5,
                comment: 'Autentica eleganza sartoriale. Tessuto e ricamo di primissima qualità.',
                date: 'Apr 02, 2026',
                status: 'APPROVED',
            },
        ],
        referrals: [
            {
                refCode: 'CS-NGOZI88',
                totalReferred: 3,
                convertedCount: 2,
                rewardsEarned: [
                    { id: 'r-5', type: '10% Privilege Discount', value: '€15 Credit', status: 'REDEEMED', orderApplied: 'CS-0089', date: 'Jun 01, 2026' },
                ],
            },
        ],
        emailMarketing: {
            isSubscribed: true,
            source: 'Milan Fashion Week Lead',
            language: 'IT',
            lastOpenedEmail: 'Collezione Primavera/Estate — Opened May 24, 2026',
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'Prefers Italian communications for newsletters.',
        },
        adminNotes: [
            { id: 'cn-4', author: 'Samuelson', text: 'Fluent in Italian and English. Prefers WhatsApp voice notes in Italian.', timestamp: 'Jun 01, 2026 · 03:15 PM' },
        ],
    },
    {
        id: 'cust-4',
        name: 'Emeka Balogun',
        avatarColor: '#1D4ED8',
        email: 'e.balogun@firstbank.ng',
        phone: '+234 812 443 2199',
        whatsapp: '+234 812 443 2199',
        location: 'Nigeria',
        address: '15 Glover Road, Ikoyi, Lagos, Nigeria',
        language: 'EN',
        currency: 'NGN',
        dateJoined: 'Aug 12, 2025',
        measurements: {
            chest: 112,
            shoulder: 49.5,
            sleeve: 66,
            waist: 94,
            hips: 109,
            inseam: 84,
            neck: 44.5,
            length: 109,
            fitNotes: 'Relaxed fit Senator cut with concealed placket.',
            lastUpdated: 'May 15, 2026',
        },
        summary: {
            totalOrders: 5,
            totalSpentNGN: 510000,
            totalSpentEUR: 288,
            lastOrderDate: 'May 15, 2026',
            referralCount: 8,
            averageRating: 4.9,
        },
        ordersHistory: [
            {
                orderId: '4',
                orderNumber: 'CS-0088',
                garmentName: 'Classic Senator',
                date: 'May 15, 2026',
                amountNGN: 85000,
                amountEUR: 47,
                status: 'DISPATCHED',
                thumbnail: '/images/design-senator.jpg',
            },
            {
                orderId: 'h-7',
                orderNumber: 'CS-0062',
                garmentName: 'Grand Agbada',
                date: 'Dec 18, 2025',
                amountNGN: 120000,
                amountEUR: 68,
                status: 'DELIVERED',
                thumbnail: '/images/design-agbada.jpg',
            },
        ],
        reviews: [
            {
                id: 'rev-5',
                designName: 'Grand Agbada',
                rating: 5,
                comment: 'Wore it for my daughter’s wedding. The presence and fit commanded the entire room.',
                date: 'Jan 05, 2026',
                status: 'APPROVED',
            },
        ],
        referrals: [
            {
                refCode: 'CS-EMEKA50',
                totalReferred: 8,
                convertedCount: 6,
                rewardsEarned: [
                    { id: 'r-6', type: 'VIP Complimentary Agbada Cap', value: 'Accessory', status: 'REDEEMED', orderApplied: 'CS-0088', date: 'May 15, 2026' },
                    { id: 'r-7', type: '₦30,000 Master Tailor Credit', value: '₦30,000', status: 'CREDITED', date: 'Apr 02, 2026' },
                ],
            },
        ],
        emailMarketing: {
            isSubscribed: true,
            source: 'Direct WhatsApp Referral',
            language: 'EN',
            lastOpenedEmail: 'Exclusive Fabric Swatch Drop — Opened May 02, 2026',
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'Premier tier client. Deliveries must be sent with sealed security tags to Ikoyi.',
        },
        adminNotes: [
            { id: 'cn-5', author: 'Samuelson', text: 'Executive bank director. Always orders with express dispatch to Ikoyi residence.', timestamp: 'May 15, 2026 · 12:20 PM' },
        ],
    },
    {
        id: 'cust-5',
        name: 'Fatima Kamara',
        avatarColor: '#92600A',
        email: 'fatima.kamara@artelier.eu',
        phone: '+39 320 994 5612',
        whatsapp: '+39 320 994 5612',
        location: 'Italy',
        address: 'Via dei Condotti 88, 00187 Roma, Italy',
        language: 'IT',
        currency: 'EUR',
        dateJoined: 'Jun 03, 2026',
        measurements: {
            chest: 91.5,
            shoulder: 39.5,
            sleeve: 58.5,
            waist: 71,
            hips: 94,
            inseam: 75,
            neck: 37,
            length: 107,
            fitNotes: 'Graceful drape with high embroidery finish.',
            lastUpdated: 'Jun 03, 2026',
        },
        summary: {
            totalOrders: 1,
            totalSpentNGN: 120000,
            totalSpentEUR: 68,
            lastOrderDate: 'Jun 03, 2026',
            referralCount: 0,
            averageRating: 0,
        },
        ordersHistory: [
            {
                orderId: '5',
                orderNumber: 'CS-0087',
                garmentName: 'Grand Agbada',
                date: 'Jun 03, 2026',
                amountNGN: 120000,
                amountEUR: 68,
                status: 'NEW',
                thumbnail: '/images/design-agbada.jpg',
            },
        ],
        reviews: [],
        referrals: [
            {
                refCode: 'CS-FATIMA10',
                totalReferred: 0,
                convertedCount: 0,
                rewardsEarned: [],
            },
        ],
        emailMarketing: {
            isSubscribed: true,
            source: 'Rome Embassy WhatsApp Inquiry',
            language: 'IT',
            lastOpenedEmail: undefined,
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'New client in Rome diplomatic circuit.',
        },
        adminNotes: [
            { id: 'cn-6', author: 'Samuelson', text: 'Created order manually from WhatsApp chat. Awaiting deposit confirmation.', timestamp: 'Jun 03, 2026 · 04:55 PM' },
        ],
    },
    {
        id: 'cust-6',
        name: 'Tunde Adeyemi',
        avatarColor: '#5C3820',
        email: 'tunde.adeyemi@bocconi.it',
        phone: '+39 333 412 8871',
        whatsapp: '+39 333 412 8871',
        location: 'Italy',
        address: 'Via Guglielmo Marconi 12, 10125 Torino, Italy',
        language: 'EN',
        currency: 'EUR',
        dateJoined: 'Nov 12, 2025',
        measurements: {
            chest: 104,
            shoulder: 45.5,
            sleeve: 63.5,
            waist: 86.5,
            hips: 101.5,
            inseam: 81,
            neck: 40.5,
            length: 107,
            fitNotes: 'Classic 3-piece tailored fit with silk inner lining.',
            lastUpdated: 'May 18, 2026',
        },
        summary: {
            totalOrders: 3,
            totalSpentNGN: 395000,
            totalSpentEUR: 222,
            lastOrderDate: 'May 18, 2026',
            referralCount: 4,
            averageRating: 5.0,
        },
        ordersHistory: [
            {
                orderId: '6',
                orderNumber: 'CS-0086',
                garmentName: 'Italian 3-Piece Suit',
                date: 'May 18, 2026',
                amountNGN: 160000,
                amountEUR: 90,
                status: 'APPROVED',
                thumbnail: '/images/design-suit.jpg',
            },
        ],
        reviews: [
            {
                id: 'rev-6',
                designName: 'Italian 3-Piece Suit',
                rating: 5,
                comment: 'The shoulders sit so naturally. Italian tailoring mastery combined with Nigerian soul.',
                date: 'Jun 02, 2026',
                status: 'APPROVED',
            },
        ],
        referrals: [
            {
                refCode: 'CS-TUNDE44',
                totalReferred: 4,
                convertedCount: 3,
                rewardsEarned: [
                    { id: 'r-8', type: 'Priority Atelier Queue Pass', value: 'Express Turnaround', status: 'REDEEMED', orderApplied: 'CS-0086', date: 'May 18, 2026' },
                ],
            },
        ],
        emailMarketing: {
            isSubscribed: true,
            source: 'University Alumni Network',
            language: 'EN',
            lastOpenedEmail: 'Academic Convocation Lookbook — Opened May 10, 2026',
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'Torino university professor.',
        },
        adminNotes: [
            { id: 'cn-7', author: 'Samuelson', text: 'Prefers deliveries during afternoon hours at his Torino apartment.', timestamp: 'May 18, 2026 · 11:20 AM' },
        ],
    },
    {
        id: 'cust-7',
        name: 'Gianluigi Rossi',
        avatarColor: '#B45309',
        email: 'gianluigi.rossi@milanodesign.it',
        phone: '+39 349 771 2309',
        whatsapp: '+39 349 771 2309',
        location: 'Italy',
        address: 'Via Solferino 19, 20121 Milano, Italy',
        language: 'IT',
        currency: 'EUR',
        dateJoined: 'Dec 01, 2025',
        measurements: {
            chest: 109,
            shoulder: 48,
            sleeve: 65,
            waist: 91.5,
            hips: 107,
            inseam: 82.5,
            neck: 43,
            length: 109,
            fitNotes: 'Double-breasted peak lapel with horn buttons.',
            lastUpdated: 'May 02, 2026',
        },
        summary: {
            totalOrders: 2,
            totalSpentNGN: 355000,
            totalSpentEUR: 200,
            lastOrderDate: 'May 02, 2026',
            referralCount: 5,
            averageRating: 5.0,
        },
        ordersHistory: [
            {
                orderId: '7',
                orderNumber: 'CS-0085',
                garmentName: 'Double-Breasted Executive Suit',
                date: 'May 02, 2026',
                amountNGN: 195000,
                amountEUR: 110,
                status: 'DELIVERED',
                thumbnail: '/images/design-suit.jpg',
            },
        ],
        reviews: [
            {
                id: 'rev-7',
                designName: 'Double-Breasted Executive Suit',
                rating: 5,
                comment: 'Taglio magistrale. Il tessuto Vitale Barberis Canonico lavorato con precisione assoluta.',
                date: 'May 22, 2026',
                status: 'APPROVED',
            },
        ],
        referrals: [
            {
                refCode: 'CS-ROSSI99',
                totalReferred: 5,
                convertedCount: 3,
                rewardsEarned: [
                    { id: 'r-9', type: '€30 Milan Atelier Gift Card', value: '€30 Credit', status: 'CREDITED', date: 'May 20, 2026' },
                ],
            },
        ],
        emailMarketing: {
            isSubscribed: false,
            source: 'Brera Design District Exhibition',
            language: 'IT',
            lastOpenedEmail: undefined,
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'Unsubscribed from promotional emails, but responsive on WhatsApp.',
        },
        adminNotes: [
            { id: 'cn-8', author: 'Samuelson', text: 'Architect in Brera, Milan. Highly particular about drape and stitch count per inch.', timestamp: 'May 02, 2026 · 10:00 AM' },
        ],
    },
    {
        id: 'cust-8',
        name: 'Olumide Davies',
        avatarColor: '#4338CA',
        email: 'olumide.davies@outlook.com',
        phone: '+234 802 881 9922',
        whatsapp: '+234 802 881 9922',
        location: 'Nigeria',
        address: '42 Isaac John Street, GRA Ikeja, Lagos, Nigeria',
        language: 'EN',
        currency: 'NGN',
        dateJoined: 'May 29, 2026',
        measurements: {
            chest: 104,
            shoulder: 46,
            sleeve: 63,
            waist: 88,
            hips: 102,
            inseam: 80,
            neck: 41,
            length: 106,
            fitNotes: 'Awaiting first bespoke consultation.',
            lastUpdated: 'May 29, 2026',
        },
        summary: {
            totalOrders: 0, // Never ordered prospect
            totalSpentNGN: 0,
            totalSpentEUR: 0,
            lastOrderDate: '—',
            referralCount: 0,
            averageRating: 0,
        },
        ordersHistory: [],
        reviews: [],
        referrals: [
            {
                refCode: 'CS-DAVIES12',
                totalReferred: 0,
                convertedCount: 0,
                rewardsEarned: [],
            },
        ],
        emailMarketing: {
            isSubscribed: true,
            source: 'Website Newsletter Popup',
            language: 'EN',
            lastOpenedEmail: 'Welcome to CaptainStitches — Opened May 29, 2026',
        },
        subscription: {
            status: 'INACTIVE',
            tier: 'NONE',
            note: 'Prospective client inquiring about wedding season Agbada.',
        },
        adminNotes: [
            { id: 'cn-9', author: 'Samuelson', text: 'Contacted atelier on WhatsApp asking for catalogue prices for December wedding.', timestamp: 'May 29, 2026 · 02:40 PM' },
        ],
    },
]

const CUSTOMERS_STORAGE_KEY = 'cs_admin_customers_store_v1'

export function getAllCustomers(): AdminCustomer[] {
    if (typeof window === 'undefined') return INITIAL_ADMIN_CUSTOMERS
    try {
        const stored = localStorage.getItem(CUSTOMERS_STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_CUSTOMERS))
            return INITIAL_ADMIN_CUSTOMERS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ADMIN_CUSTOMERS
    }
}

export function saveAllCustomers(customers: AdminCustomer[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers))
    } catch (e) {
        console.error('Failed to persist customers store', e)
    }
}

export function getCustomerById(id: string): AdminCustomer | undefined {
    const list = getAllCustomers()
    return list.find((c) => c.id === id || c.name.toLowerCase() === id.toLowerCase())
}

export function saveCustomer(updatedCustomer: AdminCustomer): void {
    const list = getAllCustomers()
    const idx = list.findIndex((c) => c.id === updatedCustomer.id)
    if (idx !== -1) {
        list[idx] = updatedCustomer
    } else {
        list.unshift(updatedCustomer)
    }
    saveAllCustomers(list)
}

export function deleteCustomer(id: string): void {
    const list = getAllCustomers()
    const filtered = list.filter((c) => c.id !== id)
    saveAllCustomers(filtered)
}
