export type ReferralRewardType = 'discount' | 'free_item' | 'priority_slot'
export type RewardStatus = 'pending' | 'credited' | 'redeemed' | 'expired'
export type ConversionStatus = 'visited' | 'ordered' | 'paid'

export interface ReferralCustomerRef {
    id: string
    name: string
    avatarColor: string
    initials: string
    location: 'Italy' | 'Nigeria'
    email: string
    phone: string
    totalSent: number
    totalConverted: number
}

export interface ReferralRewardInfo {
    id: string
    type: ReferralRewardType
    typeLabel: string
    value: string
    status: RewardStatus
    dateCredited?: string
    dateRedeemed?: string
    orderAppliedNumber?: string
    daysSinceCredited?: number
}

export interface ReferralTimelineItem {
    id: string
    event: string
    date: string
    time: string
    description: string
    actor?: string
}

export interface ReferralItem {
    id: string
    token: string
    url: string
    referrer: ReferralCustomerRef
    referredCustomer: ReferralCustomerRef
    dateCreated: string
    dateVisited: string
    dateOrderPlaced?: string
    dateOrderPaid?: string
    conversionStatus: ConversionStatus
    linkedOrder?: {
        id: string
        orderNumber: string
        garmentName: string
        amountNGN: number
        amountEUR: number
        datePlaced: string
        paymentStatus: 'PAID' | 'UNPAID' | 'DEPOSIT_PAID'
    }
    referrerReward: ReferralRewardInfo
    referredCustomerReward: ReferralRewardInfo
    timeline: ReferralTimelineItem[]
}

export interface ReferralProgrammeConfig {
    isEnabled: boolean
    referrerReward: {
        type: ReferralRewardType
        value: string
        minOrderValueNGN: number
        minOrderValueEUR: number
    }
    referredCustomerReward: {
        type: ReferralRewardType
        value: string
    }
    rules: {
        linkGenerationEvent: 'first_deposit_paid' | 'all_registered'
        rewardTriggerEvent: 'deposit_paid' | 'full_balance_paid'
        cooldownDays: number
        expiryDays: number // 0 for never
    }
    notifications: {
        notifyAdminOnConversion: boolean
        notifyCustomerOnVisit: boolean
        notifyCustomerOnRewardCredited: boolean
        notifyCustomerBeforeExpiry: boolean
        expiryWarningDays: number
    }
}

export interface ReferralActivityEvent {
    id: string
    type: 'link_visited' | 'order_placed' | 'reward_triggered' | 'reward_redeemed'
    timestamp: string
    title: string
    description: string
    referrerName: string
    referrerId: string
    referredName?: string
    referredId?: string
    orderNumber?: string
    orderId?: string
    rewardSummary?: string
}

export const INITIAL_PROGRAMME_CONFIG: ReferralProgrammeConfig = {
    isEnabled: true,
    referrerReward: {
        type: 'discount',
        value: '10% Discount Code',
        minOrderValueNGN: 60000,
        minOrderValueEUR: 100,
    },
    referredCustomerReward: {
        type: 'discount',
        value: '€10 / ₦10,000 Welcome Credit',
    },
    rules: {
        linkGenerationEvent: 'first_deposit_paid',
        rewardTriggerEvent: 'deposit_paid',
        cooldownDays: 30,
        expiryDays: 90,
    },
    notifications: {
        notifyAdminOnConversion: true,
        notifyCustomerOnVisit: true,
        notifyCustomerOnRewardCredited: true,
        notifyCustomerBeforeExpiry: true,
        expiryWarningDays: 7,
    },
}

export const INITIAL_REFERRALS: ReferralItem[] = [
    {
        id: 'ref-daniel-00s',
        token: 'DANIEL-00S',
        url: 'https://captainstitches.com/ref/DANIEL-00S',
        referrer: {
            id: 'cust-daniel-01',
            name: 'Daniel Nwokocha',
            avatarColor: '#C4975A',
            initials: 'DN',
            location: 'Nigeria',
            email: 'gurudanito001@gmail.com',
            phone: '+2348140715723',
            totalSent: 3,
            totalConverted: 2,
        },
        referredCustomer: {
            id: 'cust-emeka-01',
            name: 'Emeka Eze',
            avatarColor: '#10B981',
            initials: 'EE',
            location: 'Nigeria',
            email: 'emeka.eze@diaspora.ng',
            phone: '+2348039998877',
            totalSent: 0,
            totalConverted: 1,
        },
        dateCreated: '2026-09-10',
        dateVisited: '2026-09-10',
        dateOrderPlaced: '2026-09-12',
        dateOrderPaid: '2026-09-12',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-cs-0003',
            orderNumber: 'CS-0003',
            garmentName: 'Teal Green Agbada with Gold Filigree',
            amountNGN: 220000,
            amountEUR: 140,
            datePlaced: '2026-09-12',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-daniel-001',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '10% Off',
            status: 'credited',
            dateCredited: '2026-09-12',
        },
        referredCustomerReward: {
            id: 'rew-emeka-001',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'redeemed',
            dateCredited: '2026-09-10',
            dateRedeemed: '2026-09-12',
            orderAppliedNumber: 'CS-0003',
        },
        timeline: [
            {
                id: 'evt-d1',
                event: 'Token Generated',
                date: '2026-09-10',
                time: '11:20',
                description: 'Token DANIEL-00S generated for Daniel Nwokocha.',
                actor: 'System',
            },
            {
                id: 'evt-d2',
                event: 'Friend Landed on /ref/DANIEL-00S',
                date: '2026-09-10',
                time: '14:05',
                description: 'Emeka Eze opened the invite link in Lagos.',
                actor: 'Emeka Eze',
            },
            {
                id: 'evt-d3',
                event: 'Order CS-0003 Placed & Paid',
                date: '2026-09-12',
                time: '16:40',
                description: 'Bespoke commission CS-0003 confirmed. 10% voucher credited to Daniel.',
                actor: 'Emeka Eze',
            },
        ],
    },
    {
        id: 'ref-daniel-01b',
        token: 'DANIEL-01B',
        url: 'https://captainstitches.com/ref/DANIEL-01B',
        referrer: {
            id: 'cust-daniel-01',
            name: 'Daniel Nwokocha',
            avatarColor: '#C4975A',
            initials: 'DN',
            location: 'Nigeria',
            email: 'gurudanito001@gmail.com',
            phone: '+2348140715723',
            totalSent: 3,
            totalConverted: 2,
        },
        referredCustomer: {
            id: 'cust-chidinma-02',
            name: 'Chidinma Okeke',
            avatarColor: '#10B981',
            initials: 'CO',
            location: 'Nigeria',
            email: 'chidinma.okeke@client.com',
            phone: '+2348022334455',
            totalSent: 0,
            totalConverted: 1,
        },
        dateCreated: '2026-08-15',
        dateVisited: '2026-08-16',
        dateOrderPlaced: '2026-08-18',
        dateOrderPaid: '2026-08-18',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-cs-0012',
            orderNumber: 'CS-0012',
            garmentName: 'Imperial Cashmere Senator',
            amountNGN: 180000,
            amountEUR: 120,
            datePlaced: '2026-08-18',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-daniel-002',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '10% Off',
            status: 'redeemed',
            dateCredited: '2026-08-18',
            dateRedeemed: '2026-08-25',
            orderAppliedNumber: 'CS-0092',
        },
        referredCustomerReward: {
            id: 'rew-chidinma-002',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'redeemed',
            dateCredited: '2026-08-16',
            dateRedeemed: '2026-08-18',
            orderAppliedNumber: 'CS-0012',
        },
        timeline: [
            {
                id: 'evt-d1b-1',
                event: 'Token Generated',
                date: '2026-08-15',
                time: '09:00',
                description: 'Token DANIEL-01B generated.',
                actor: 'System',
            },
            {
                id: 'evt-d1b-2',
                event: 'Converted to Commission',
                date: '2026-08-18',
                time: '15:10',
                description: 'Order CS-0012 placed by Chidinma Okeke.',
                actor: 'Chidinma Okeke',
            },
        ],
    },
    {
        id: 'ref-daniel-02c',
        token: 'DANIEL-02C',
        url: 'https://captainstitches.com/ref/DANIEL-02C',
        referrer: {
            id: 'cust-daniel-01',
            name: 'Daniel Nwokocha',
            avatarColor: '#C4975A',
            initials: 'DN',
            location: 'Nigeria',
            email: 'gurudanito001@gmail.com',
            phone: '+2348140715723',
            totalSent: 3,
            totalConverted: 2,
        },
        referredCustomer: {
            id: 'pending-friend-01',
            name: 'Pending Patron',
            avatarColor: '#6B7280',
            initials: '??',
            location: 'Nigeria',
            email: '',
            phone: '',
            totalSent: 0,
            totalConverted: 0,
        },
        dateCreated: '2026-09-28',
        dateVisited: '2026-09-29',
        conversionStatus: 'visited',
        referrerReward: {
            id: 'rew-daniel-003',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '10% Off',
            status: 'pending',
        },
        referredCustomerReward: {
            id: 'rew-pending-003',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'pending',
        },
        timeline: [
            {
                id: 'evt-d2c-1',
                event: 'Token Generated & Visited',
                date: '2026-09-28',
                time: '18:30',
                description: 'Token DANIEL-02C visited via WhatsApp link.',
                actor: 'System',
            },
        ],
    },
    {
        id: 'ref-chidi-001',
        token: 'CHIDI-001',
        url: 'https://captainstitches.com/ref/CHIDI-001',
        referrer: {
            id: 'cust-chidi-02',
            name: 'Chidi Okonkwo',
            avatarColor: '#10B981',
            initials: 'CO',
            location: 'Italy',
            email: 'chidi.okonkwo@atelier.it',
            phone: '+39 345 111 2233',
            totalSent: 4,
            totalConverted: 2,
        },
        referredCustomer: {
            id: 'cust-luca-01',
            name: 'Luca Rossi',
            avatarColor: '#3B82F6',
            initials: 'LR',
            location: 'Italy',
            email: 'luca.rossi@milano.it',
            phone: '+39 349 555 6677',
            totalSent: 0,
            totalConverted: 1,
        },
        dateCreated: '2026-09-01',
        dateVisited: '2026-09-02',
        dateOrderPlaced: '2026-09-04',
        dateOrderPaid: '2026-09-04',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-cs-0021',
            orderNumber: 'CS-0021',
            garmentName: 'Venetian Double Breasted Blazer',
            amountNGN: 240000,
            amountEUR: 160,
            datePlaced: '2026-09-04',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-chidi-001',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '10% Off',
            status: 'credited',
            dateCredited: '2026-09-04',
        },
        referredCustomerReward: {
            id: 'rew-luca-001',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'redeemed',
            dateCredited: '2026-09-02',
            dateRedeemed: '2026-09-04',
            orderAppliedNumber: 'CS-0021',
        },
        timeline: [],
    },
    {
        id: 'ref-chidi-002',
        token: 'CHIDI-002',
        url: 'https://captainstitches.com/ref/CHIDI-002',
        referrer: {
            id: 'cust-chidi-02',
            name: 'Chidi Okonkwo',
            avatarColor: '#10B981',
            initials: 'CO',
            location: 'Italy',
            email: 'chidi.okonkwo@atelier.it',
            phone: '+39 345 111 2233',
            totalSent: 4,
            totalConverted: 2,
        },
        referredCustomer: {
            id: 'cust-matteo-02',
            name: 'Matteo Ferrari',
            avatarColor: '#8B5CF6',
            initials: 'MF',
            location: 'Italy',
            email: 'matteo.ferrari@roma.it',
            phone: '+39 347 888 9900',
            totalSent: 0,
            totalConverted: 1,
        },
        dateCreated: '2026-09-05',
        dateVisited: '2026-09-06',
        dateOrderPlaced: '2026-09-08',
        dateOrderPaid: '2026-09-08',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-cs-0028',
            orderNumber: 'CS-0028',
            garmentName: 'Super 150s Bespoke Trousers',
            amountNGN: 150000,
            amountEUR: 100,
            datePlaced: '2026-09-08',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-chidi-002',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '10% Off',
            status: 'redeemed',
            dateCredited: '2026-09-08',
            dateRedeemed: '2026-09-14',
            orderAppliedNumber: 'CS-0040',
        },
        referredCustomerReward: {
            id: 'rew-matteo-002',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'redeemed',
            dateCredited: '2026-09-06',
            dateRedeemed: '2026-09-08',
            orderAppliedNumber: 'CS-0028',
        },
        timeline: [],
    },
    {
        id: 'ref-chidi-003',
        token: 'CHIDI-003',
        url: 'https://captainstitches.com/ref/CHIDI-003',
        referrer: {
            id: 'cust-chidi-02',
            name: 'Chidi Okonkwo',
            avatarColor: '#10B981',
            initials: 'CO',
            location: 'Italy',
            email: 'chidi.okonkwo@atelier.it',
            phone: '+39 345 111 2233',
            totalSent: 4,
            totalConverted: 2,
        },
        referredCustomer: {
            id: 'pending-friend-02',
            name: 'Alessandro Bianchi',
            avatarColor: '#6B7280',
            initials: 'AB',
            location: 'Italy',
            email: '',
            phone: '',
            totalSent: 0,
            totalConverted: 0,
        },
        dateCreated: '2026-09-15',
        dateVisited: '2026-09-16',
        conversionStatus: 'visited',
        referrerReward: {
            id: 'rew-chidi-003',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '10% Off',
            status: 'pending',
        },
        referredCustomerReward: {
            id: 'rew-alex-003',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'pending',
        },
        timeline: [],
    },
    {
        id: 'ref-adewale-001',
        token: 'ADEWALE-01',
        url: 'https://captainstitches.com/ref/ADEWALE-01',
        referrer: {
            id: 'cust-adewale-03',
            name: 'Adewale Okafor',
            avatarColor: '#D97706',
            initials: 'AO',
            location: 'Italy',
            email: 'adewale.okafor@verona.it',
            phone: '+39 348 222 3344',
            totalSent: 2,
            totalConverted: 1,
        },
        referredCustomer: {
            id: 'cust-tariq-03',
            name: 'Tariq Mansour',
            avatarColor: '#059669',
            initials: 'TM',
            location: 'Italy',
            email: 'tariq.mansour@diaspora.eu',
            phone: '+39 340 777 8899',
            totalSent: 0,
            totalConverted: 1,
        },
        dateCreated: '2026-09-18',
        dateVisited: '2026-09-18',
        dateOrderPlaced: '2026-09-20',
        dateOrderPaid: '2026-09-20',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-cs-0035',
            orderNumber: 'CS-0035',
            garmentName: 'Gold Embroidered Velvet Cap',
            amountNGN: 60000,
            amountEUR: 45,
            datePlaced: '2026-09-20',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-adewale-001',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '10% Off',
            status: 'credited',
            dateCredited: '2026-09-20',
        },
        referredCustomerReward: {
            id: 'rew-tariq-001',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'redeemed',
            dateCredited: '2026-09-18',
            dateRedeemed: '2026-09-20',
            orderAppliedNumber: 'CS-0035',
        },
        timeline: [],
    },
]

export const INITIAL_ACTIVITY_FEED: ReferralActivityEvent[] = [
    {
        id: 'act-1',
        type: 'reward_triggered',
        timestamp: '2 hours ago',
        title: '10% Discount Credited',
        description: 'Daniel Nwokocha earned 10% voucher for commission CS-0003 placed by Emeka Eze.',
        referrerName: 'Daniel Nwokocha',
        referrerId: 'cust-daniel-01',
        referredName: 'Emeka Eze',
        referredId: 'cust-emeka-01',
        orderNumber: 'CS-0003',
        rewardSummary: '10% Off Next Order',
    },
    {
        id: 'act-2',
        type: 'order_placed',
        timestamp: '1 day ago',
        title: 'Commission Converted',
        description: 'Order CS-0028 placed by Matteo Ferrari using token CHIDI-002.',
        referrerName: 'Chidi Okonkwo',
        referrerId: 'cust-chidi-02',
        referredName: 'Matteo Ferrari',
        orderNumber: 'CS-0028',
    },
    {
        id: 'act-3',
        type: 'link_visited',
        timestamp: '3 days ago',
        title: 'Referral Link Visited',
        description: 'Token DANIEL-02C was visited from WhatsApp in Lekki, Lagos.',
        referrerName: 'Daniel Nwokocha',
        referrerId: 'cust-daniel-01',
    },
]

const STORAGE_KEY_REFERRALS = 'cs_admin_referrals_v2'
const STORAGE_KEY_CONFIG = 'cs_admin_referrals_config_v2'

let inMemoryReferrals: ReferralItem[] = [...INITIAL_REFERRALS]
let inMemoryConfig: ReferralProgrammeConfig = { ...INITIAL_PROGRAMME_CONFIG }

export function getAllReferrals(): ReferralItem[] {
    if (typeof window === 'undefined') return inMemoryReferrals
    try {
        const stored = localStorage.getItem(STORAGE_KEY_REFERRALS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(INITIAL_REFERRALS))
            return INITIAL_REFERRALS
        }
        const parsed = JSON.parse(stored)
        if (!Array.isArray(parsed) || parsed.length === 0 || !parsed.some((r: any) => r.token === 'DANIEL-00S')) {
            localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(INITIAL_REFERRALS))
            return INITIAL_REFERRALS
        }
        return parsed
    } catch {
        return inMemoryReferrals
    }
}

export function saveAllReferrals(items: ReferralItem[]): void {
    inMemoryReferrals = [...items]
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(items))
    } catch (e) {
        console.error('Failed to save referrals to localStorage', e)
    }
}

export function getReferralById(id: string): ReferralItem | undefined {
    const referrals = getAllReferrals()
    return referrals.find((r) => r.id === id)
}

export function getProgrammeConfig(): ReferralProgrammeConfig {
    if (typeof window === 'undefined') return inMemoryConfig
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CONFIG)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(inMemoryConfig))
            return inMemoryConfig
        }
        return JSON.parse(stored)
    } catch {
        return inMemoryConfig
    }
}

export function saveProgrammeConfig(config: ReferralProgrammeConfig): void {
    inMemoryConfig = { ...config }
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config))
    } catch (e) {
        console.error('Failed to save programme config', e)
    }
}

export function toggleProgrammeStatus(): boolean {
    const config = getProgrammeConfig()
    const updated = { ...config, isEnabled: !config.isEnabled }
    saveProgrammeConfig(updated)
    return updated.isEnabled
}

export function markRewardRedeemed(
    referralId: string,
    target: 'referrer' | 'referred',
    orderAppliedNumber: string
): ReferralItem[] {
    const referrals = getAllReferrals()
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const updated = referrals.map((item) => {
        if (item.id !== referralId) return item
        const newTimeline = [...item.timeline]
        if (target === 'referrer') {
            newTimeline.push({
                id: `t-${Date.now()}`,
                event: 'Referrer Reward Redeemed',
                date: dateStr,
                time: timeStr,
                description: `Reward redeemed and applied to order ${orderAppliedNumber}.`,
                actor: 'Samuelson',
            })
            return {
                ...item,
                referrerReward: {
                    ...item.referrerReward,
                    status: 'redeemed' as RewardStatus,
                    dateRedeemed: dateStr,
                    orderAppliedNumber,
                },
                timeline: newTimeline,
            }
        } else {
            newTimeline.push({
                id: `t-${Date.now()}`,
                event: 'Referred Customer Reward Redeemed',
                date: dateStr,
                time: timeStr,
                description: `Welcome credit applied to order ${orderAppliedNumber}.`,
                actor: 'Samuelson',
            })
            return {
                ...item,
                referredCustomerReward: {
                    ...item.referredCustomerReward,
                    status: 'redeemed' as RewardStatus,
                    dateRedeemed: dateStr,
                    orderAppliedNumber,
                },
                timeline: newTimeline,
            }
        }
    })

    saveAllReferrals(updated)
    return updated
}

export function issueRewardManually(
    customerId: string,
    customerName: string,
    rewardType: ReferralRewardType,
    rewardValue: string,
    reason: string
): ReferralItem[] {
    const referrals = getAllReferrals()
    const now = new Date()
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newItem: ReferralItem = {
        id: `ref-manual-${Date.now().toString().slice(-4)}`,
        token: `MANUAL-${customerName.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
        url: 'https://captainstitches.com/referral',
        referrer: {
            id: customerId,
            name: customerName,
            avatarColor: '#C4975A',
            initials: customerName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            location: 'Italy',
            email: `${customerName.toLowerCase().replace(/\s+/g, '.')}@client.com`,
            phone: '+39 300 000 0000',
            totalSent: 1,
            totalConverted: 1,
        },
        referredCustomer: {
            id: 'cust-atelier-direct',
            name: 'Atelier Goodwill / Discretionary',
            avatarColor: '#4B5563',
            initials: 'AG',
            location: 'Italy',
            email: 'admin@captainstitches.com',
            phone: 'N/A',
            totalSent: 0,
            totalConverted: 0,
        },
        dateCreated: dateStr,
        dateVisited: dateStr,
        dateOrderPlaced: dateStr,
        dateOrderPaid: dateStr,
        conversionStatus: 'paid',
        referrerReward: {
            id: `rew-${Date.now()}`,
            type: rewardType,
            typeLabel: rewardType === 'discount' ? 'Discount Code' : rewardType === 'free_item' ? 'Free Gift' : 'Priority Slot',
            value: rewardValue,
            status: 'credited',
            dateCredited: dateStr,
            daysSinceCredited: 0,
        },
        referredCustomerReward: {
            id: `rew-ref-${Date.now()}`,
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: 'N/A (Direct Grant)',
            status: 'redeemed',
            dateCredited: dateStr,
            dateRedeemed: dateStr,
        },
        timeline: [
            {
                id: `t-manual-${Date.now()}`,
                event: 'Manual Reward Granted',
                date: dateStr,
                time: timeStr,
                description: `Reward issued directly by Samuelson: ${reason}`,
                actor: 'Samuelson',
            },
        ],
    }

    const updated = [newItem, ...referrals]
    saveAllReferrals(updated)
    return updated
}

export function getReferralStats(referrals = getAllReferrals()) {
    const totalLinks = referrals.length
    const totalVisited = referrals.filter((r) => r.dateVisited).length
    const converted = referrals.filter((r) => r.conversionStatus === 'paid').length
    const conversionRate = totalVisited > 0 ? ((converted / totalVisited) * 100).toFixed(1) : '0'

    let totalRewardsIssued = 0
    let totalRewardsRedeemed = 0
    let pendingRedemption = 0

    referrals.forEach((r) => {
        if (r.referrerReward.status === 'credited' || r.referrerReward.status === 'redeemed') {
            totalRewardsIssued += 1
        }
        if (r.referrerReward.status === 'redeemed') {
            totalRewardsRedeemed += 1
        }
        if (r.referrerReward.status === 'credited') {
            pendingRedemption += 1
        }

        if (r.referredCustomerReward.status === 'credited' || r.referredCustomerReward.status === 'redeemed') {
            totalRewardsIssued += 1
        }
        if (r.referredCustomerReward.status === 'redeemed') {
            totalRewardsRedeemed += 1
        }
        if (r.referredCustomerReward.status === 'credited') {
            pendingRedemption += 1
        }
    })

    return {
        totalLinks,
        totalVisited,
        converted,
        conversionRate,
        totalRewardsIssued,
        totalRewardsRedeemed,
        pendingRedemption,
    }
}

export function getTopReferrers(referrals = getAllReferrals()) {
    const map = new Map<
        string,
        {
            customer: ReferralCustomerRef
            sent: number
            converted: number
            totalRewardValue: string
        }
    >()

    referrals.forEach((r) => {
        const id = r.referrer.id
        const existing = map.get(id) || {
            customer: r.referrer,
            sent: r.referrer.totalSent || 0,
            converted: 0,
            totalRewardValue: '€0 / ₦0',
        }
        if (r.conversionStatus === 'paid') {
            existing.converted += 1
        }
        map.set(id, existing)
    })

    const list = Array.from(map.values()).sort((a, b) => {
        if (b.converted !== a.converted) return b.converted - a.converted
        const rateA = a.sent > 0 ? a.converted / a.sent : 0
        const rateB = b.sent > 0 ? b.converted / b.sent : 0
        if (rateB !== rateA) return rateB - rateA
        return b.sent - a.sent
    })
    return list
}
