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
        id: 'ref-001',
        token: 'CS-ADEWALE40',
        url: 'https://captainstitches.com/referral?ref=CS-ADEWALE40',
        referrer: {
            id: 'cust-1',
            name: 'Adewale Okafor',
            avatarColor: '#C4975A',
            initials: 'AO',
            location: 'Italy',
            email: 'adewale.okafor@gmail.com',
            phone: '+39 347 123 4567',
            totalSent: 6,
            totalConverted: 4,
        },
        referredCustomer: {
            id: 'cust-2',
            name: 'Chidi Okeke',
            avatarColor: '#2B4C7E',
            initials: 'CO',
            location: 'Italy',
            email: 'chidi.okeke@studioarch.it',
            phone: '+39 333 987 6543',
            totalSent: 3,
            totalConverted: 2,
        },
        dateCreated: 'May 01, 2026',
        dateVisited: 'May 02, 2026',
        dateOrderPlaced: 'May 05, 2026',
        dateOrderPaid: 'May 06, 2026',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-2',
            orderNumber: 'CS-2026-002',
            garmentName: 'Bespoke Senator Suit with Geometric Collar',
            amountNGN: 240000,
            amountEUR: 320,
            datePlaced: 'May 05, 2026',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-101',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '€32 Credit',
            status: 'credited',
            dateCredited: 'May 06, 2026',
            daysSinceCredited: 32,
        },
        referredCustomerReward: {
            id: 'rew-102',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 Off First Order',
            status: 'redeemed',
            dateCredited: 'May 05, 2026',
            dateRedeemed: 'May 05, 2026',
            orderAppliedNumber: 'CS-2026-002',
        },
        timeline: [
            { id: 't-1', event: 'Link Created', date: 'May 01, 2026', time: '10:00', description: 'Referral link generated automatically for Adewale Okafor.' },
            { id: 't-2', event: 'Link Visited', date: 'May 02, 2026', time: '14:23', description: 'Chidi Okeke landed on CaptainStitches via referral token CS-ADEWALE40.' },
            { id: 't-3', event: 'Account Registered', date: 'May 03, 2026', time: '09:12', description: 'Chidi Okeke created an atelier profile.' },
            { id: 't-4', event: 'Order Placed', date: 'May 05, 2026', time: '16:40', description: 'Order CS-2026-002 commissioned for The Royal Senator.' },
            { id: 't-5', event: 'Deposit Paid & Reward Triggered', date: 'May 06, 2026', time: '11:15', description: '50% deposit received. Referrer reward of €32 credited to Adewale Okafor.' },
        ],
    },
    {
        id: 'ref-002',
        token: 'CS-ADEWALE40',
        url: 'https://captainstitches.com/referral?ref=CS-ADEWALE40',
        referrer: {
            id: 'cust-1',
            name: 'Adewale Okafor',
            avatarColor: '#C4975A',
            initials: 'AO',
            location: 'Italy',
            email: 'adewale.okafor@gmail.com',
            phone: '+39 347 123 4567',
            totalSent: 6,
            totalConverted: 4,
        },
        referredCustomer: {
            id: 'cust-3',
            name: 'Kunle Adeleke',
            avatarColor: '#1E3A8A',
            initials: 'KA',
            location: 'Italy',
            email: 'kunle.adeleke@luxuryconsulting.com',
            phone: '+39 349 555 0192',
            totalSent: 5,
            totalConverted: 3,
        },
        dateCreated: 'May 08, 2026',
        dateVisited: 'May 09, 2026',
        dateOrderPlaced: 'May 11, 2026',
        dateOrderPaid: 'May 12, 2026',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-3',
            orderNumber: 'CS-2026-003',
            garmentName: 'The Royal Senator in Silk Wool',
            amountNGN: 350000,
            amountEUR: 450,
            datePlaced: 'May 11, 2026',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-103',
            type: 'free_item',
            typeLabel: 'Free Item',
            value: 'Matching Silk Pocket Square',
            status: 'redeemed',
            dateCredited: 'May 12, 2026',
            dateRedeemed: 'May 28, 2026',
            orderAppliedNumber: 'CS-2026-010',
        },
        referredCustomerReward: {
            id: 'rew-104',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 Off',
            status: 'redeemed',
            dateCredited: 'May 11, 2026',
            dateRedeemed: 'May 11, 2026',
            orderAppliedNumber: 'CS-2026-003',
        },
        timeline: [
            { id: 't-1', event: 'Link Visited', date: 'May 09, 2026', time: '11:10', description: 'Kunle Adeleke visited via CS-ADEWALE40 link.' },
            { id: 't-2', event: 'Order Placed', date: 'May 11, 2026', time: '17:05', description: 'Commissioned Royal Senator in Silk Wool.' },
            { id: 't-3', event: 'Payment Confirmed', date: 'May 12, 2026', time: '09:20', description: 'Payment cleared. Free silk pocket square reward credited to Adewale.' },
            { id: 't-4', event: 'Reward Redeemed', date: 'May 28, 2026', time: '15:30', description: 'Pocket square reward applied to order CS-2026-010.' },
        ],
    },
    {
        id: 'ref-003',
        token: 'CS-CHIOMA88',
        url: 'https://captainstitches.com/referral?ref=CS-CHIOMA88',
        referrer: {
            id: 'cust-4',
            name: 'Chioma Eze',
            avatarColor: '#059669',
            initials: 'CE',
            location: 'Nigeria',
            email: 'chioma.eze@heritagelegal.ng',
            phone: '+234 802 345 6789',
            totalSent: 8,
            totalConverted: 5,
        },
        referredCustomer: {
            id: 'cust-6',
            name: 'Ngozi Okonjo',
            avatarColor: '#9333EA',
            initials: 'NO',
            location: 'Nigeria',
            email: 'ngozi.okonjo@capitaltrade.com',
            phone: '+234 809 111 2233',
            totalSent: 2,
            totalConverted: 1,
        },
        dateCreated: 'May 12, 2026',
        dateVisited: 'May 14, 2026',
        dateOrderPlaced: 'May 18, 2026',
        dateOrderPaid: 'May 19, 2026',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-12',
            orderNumber: 'CS-2026-012',
            garmentName: 'Grand Agbada in Royal Ivory',
            amountNGN: 480000,
            amountEUR: 580,
            datePlaced: 'May 18, 2026',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-105',
            type: 'priority_slot',
            typeLabel: 'Priority Slot',
            value: 'Priority Tailoring Slot (3-Day Express)',
            status: 'credited',
            dateCredited: 'May 19, 2026',
            daysSinceCredited: 19,
        },
        referredCustomerReward: {
            id: 'rew-106',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '₦10,000 Off',
            status: 'redeemed',
            dateCredited: 'May 18, 2026',
            dateRedeemed: 'May 18, 2026',
            orderAppliedNumber: 'CS-2026-012',
        },
        timeline: [
            { id: 't-1', event: 'Link Visited', date: 'May 14, 2026', time: '13:00', description: 'Ngozi Okonjo clicked WhatsApp referral link.' },
            { id: 't-2', event: 'Order Placed', date: 'May 18, 2026', time: '11:45', description: 'Order CS-2026-012 placed.' },
            { id: 't-3', event: 'Deposit Paid', date: 'May 19, 2026', time: '10:00', description: 'Priority rush slot reward credited to Chioma Eze.' },
        ],
    },
    {
        id: 'ref-004',
        token: 'CS-CHIDI22',
        url: 'https://captainstitches.com/referral?ref=CS-CHIDI22',
        referrer: {
            id: 'cust-2',
            name: 'Chidi Okeke',
            avatarColor: '#2B4C7E',
            initials: 'CO',
            location: 'Italy',
            email: 'chidi.okeke@studioarch.it',
            phone: '+39 333 987 6543',
            totalSent: 3,
            totalConverted: 2,
        },
        referredCustomer: {
            id: 'cust-7',
            name: 'Matteo Rossi',
            avatarColor: '#EA580C',
            initials: 'MR',
            location: 'Italy',
            email: 'matteo.rossi@designmilano.it',
            phone: '+39 331 456 7890',
            totalSent: 0,
            totalConverted: 0,
        },
        dateCreated: 'May 20, 2026',
        dateVisited: 'May 21, 2026',
        dateOrderPlaced: 'May 25, 2026',
        conversionStatus: 'ordered',
        linkedOrder: {
            id: 'ord-15',
            orderNumber: 'CS-2026-015',
            garmentName: 'The Riviera Linen Suit in Sand Dune',
            amountNGN: 290000,
            amountEUR: 380,
            datePlaced: 'May 25, 2026',
            paymentStatus: 'DEPOSIT_PAID',
        },
        referrerReward: {
            id: 'rew-107',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '€38 Credit',
            status: 'pending',
        },
        referredCustomerReward: {
            id: 'rew-108',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 Off',
            status: 'credited',
            dateCredited: 'May 25, 2026',
            daysSinceCredited: 13,
        },
        timeline: [
            { id: 't-1', event: 'Link Visited', date: 'May 21, 2026', time: '18:40', description: 'Matteo Rossi opened referral invite.' },
            { id: 't-2', event: 'Order Placed', date: 'May 25, 2026', time: '14:15', description: 'Linen suit commissioned. Awaiting balance payment confirmation for referrer reward credit.' },
        ],
    },
    {
        id: 'ref-005',
        token: 'CS-CHIOMA88',
        url: 'https://captainstitches.com/referral?ref=CS-CHIOMA88',
        referrer: {
            id: 'cust-4',
            name: 'Chioma Eze',
            avatarColor: '#059669',
            initials: 'CE',
            location: 'Nigeria',
            email: 'chioma.eze@heritagelegal.ng',
            phone: '+234 802 345 6789',
            totalSent: 8,
            totalConverted: 5,
        },
        referredCustomer: {
            id: 'cust-8',
            name: 'Femi Otedola Jr.',
            avatarColor: '#4F46E5',
            initials: 'FO',
            location: 'Nigeria',
            email: 'femi.jr@zenithgroup.ng',
            phone: '+234 803 999 8888',
            totalSent: 0,
            totalConverted: 0,
        },
        dateCreated: 'May 28, 2026',
        dateVisited: 'May 29, 2026',
        conversionStatus: 'visited',
        referrerReward: {
            id: 'rew-109',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: 'Pending Conversion',
            status: 'pending',
        },
        referredCustomerReward: {
            id: 'rew-110',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '₦10,000 Off Available',
            status: 'pending',
        },
        timeline: [
            { id: 't-1', event: 'Link Visited', date: 'May 29, 2026', time: '10:14', description: 'Femi Otedola Jr. viewed catalogue via Chioma’s link. No bespoke order placed yet.' },
        ],
    },
    {
        id: 'ref-006',
        token: 'CS-KUNLE15',
        url: 'https://captainstitches.com/referral?ref=CS-KUNLE15',
        referrer: {
            id: 'cust-3',
            name: 'Kunle Adeleke',
            avatarColor: '#1E3A8A',
            initials: 'KA',
            location: 'Italy',
            email: 'kunle.adeleke@luxuryconsulting.com',
            phone: '+39 349 555 0192',
            totalSent: 5,
            totalConverted: 3,
        },
        referredCustomer: {
            id: 'cust-9',
            name: 'Gianluca Bianchi',
            avatarColor: '#10B981',
            initials: 'GB',
            location: 'Italy',
            email: 'gianluca.bianchi@roma-arch.it',
            phone: '+39 348 222 3344',
            totalSent: 0,
            totalConverted: 0,
        },
        dateCreated: 'Jun 01, 2026',
        dateVisited: 'Jun 01, 2026',
        dateOrderPlaced: 'Jun 02, 2026',
        dateOrderPaid: 'Jun 03, 2026',
        conversionStatus: 'paid',
        linkedOrder: {
            id: 'ord-18',
            orderNumber: 'CS-2026-018',
            garmentName: 'Double-Breasted Cashmere Blazer',
            amountNGN: 380000,
            amountEUR: 480,
            datePlaced: 'Jun 02, 2026',
            paymentStatus: 'PAID',
        },
        referrerReward: {
            id: 'rew-111',
            type: 'discount',
            typeLabel: '10% Discount Code',
            value: '€48 Credit',
            status: 'credited',
            dateCredited: 'Jun 03, 2026',
            daysSinceCredited: 4,
        },
        referredCustomerReward: {
            id: 'rew-112',
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 Off',
            status: 'redeemed',
            dateCredited: 'Jun 02, 2026',
            dateRedeemed: 'Jun 02, 2026',
            orderAppliedNumber: 'CS-2026-018',
        },
        timeline: [
            { id: 't-1', event: 'Link Visited', date: 'Jun 01, 2026', time: '09:30', description: 'Gianluca visited via CS-KUNLE15.' },
            { id: 't-2', event: 'Order Placed', date: 'Jun 02, 2026', time: '15:10', description: 'Order CS-2026-018 commissioned.' },
            { id: 't-3', event: 'Payment Cleared', date: 'Jun 03, 2026', time: '11:45', description: '€48 credit issued to Kunle Adeleke.' },
        ],
    },
]

export const INITIAL_ACTIVITY_FEED: ReferralActivityEvent[] = [
    {
        id: 'act-1',
        type: 'reward_triggered',
        timestamp: 'Jun 03, 2026 · 11:45 AM',
        title: '€48 Reward Credited',
        description: 'Gianluca Bianchi paid for order CS-2026-018. Referrer reward issued to Kunle Adeleke.',
        referrerName: 'Kunle Adeleke',
        referrerId: 'cust-3',
        referredName: 'Gianluca Bianchi',
        referredId: 'cust-9',
        orderNumber: 'CS-2026-018',
        orderId: 'ord-18',
        rewardSummary: '€48 Credit (10% kickback)',
    },
    {
        id: 'act-2',
        type: 'order_placed',
        timestamp: 'Jun 02, 2026 · 03:10 PM',
        title: 'Referred Order Commissioned',
        description: 'Gianluca Bianchi placed an order for Double-Breasted Cashmere Blazer via CS-KUNLE15.',
        referrerName: 'Kunle Adeleke',
        referrerId: 'cust-3',
        referredName: 'Gianluca Bianchi',
        referredId: 'cust-9',
        orderNumber: 'CS-2026-018',
        orderId: 'ord-18',
    },
    {
        id: 'act-3',
        type: 'link_visited',
        timestamp: 'Jun 01, 2026 · 09:30 AM',
        title: 'Referral Link Visited',
        description: 'Gianluca Bianchi landed on the atelier catalogue via referral code CS-KUNLE15.',
        referrerName: 'Kunle Adeleke',
        referrerId: 'cust-3',
    },
    {
        id: 'act-4',
        type: 'reward_redeemed',
        timestamp: 'May 28, 2026 · 03:30 PM',
        title: 'Reward Redeemed on Order',
        description: 'Adewale Okafor redeemed Free Silk Pocket Square on bespoke order CS-2026-010.',
        referrerName: 'Adewale Okafor',
        referrerId: 'cust-1',
        orderNumber: 'CS-2026-010',
        orderId: 'ord-10',
        rewardSummary: 'Free Silk Pocket Square',
    },
    {
        id: 'act-5',
        type: 'reward_triggered',
        timestamp: 'May 19, 2026 · 10:00 AM',
        title: 'Priority Slot Credited',
        description: 'Ngozi Okonjo deposit cleared for CS-2026-012. Chioma Eze awarded 3-Day Express Slot.',
        referrerName: 'Chioma Eze',
        referrerId: 'cust-4',
        referredName: 'Ngozi Okonjo',
        referredId: 'cust-6',
        orderNumber: 'CS-2026-012',
        orderId: 'ord-12',
        rewardSummary: '3-Day Express Priority Tailoring Slot',
    },
]

const STORAGE_KEY_REFERRALS = 'cs_admin_referrals_v1'
const STORAGE_KEY_CONFIG = 'cs_admin_referrals_config_v1'

export function getAllReferrals(): ReferralItem[] {
    if (typeof window === 'undefined') return INITIAL_REFERRALS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_REFERRALS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_REFERRALS, JSON.stringify(INITIAL_REFERRALS))
            return INITIAL_REFERRALS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_REFERRALS
    }
}

export function saveAllReferrals(items: ReferralItem[]): void {
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
    if (typeof window === 'undefined') return INITIAL_PROGRAMME_CONFIG
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CONFIG)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(INITIAL_PROGRAMME_CONFIG))
            return INITIAL_PROGRAMME_CONFIG
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_PROGRAMME_CONFIG
    }
}

export function saveProgrammeConfig(config: ReferralProgrammeConfig): void {
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
    const totalLinks = 28 // Realistic baseline
    const totalVisited = 42
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
            totalRewardValue: '€80 / ₦40,000',
        }
        if (r.conversionStatus === 'paid') {
            existing.converted += 1
        }
        map.set(id, existing)
    })

    const list = Array.from(map.values()).sort((a, b) => b.converted - a.converted)
    return list
}
