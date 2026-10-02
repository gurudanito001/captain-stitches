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

export const INITIAL_REFERRALS: ReferralItem[] = []

export const INITIAL_ACTIVITY_FEED: ReferralActivityEvent[] = []

const STORAGE_KEY_REFERRALS = 'cs_admin_referrals_v2'
const STORAGE_KEY_CONFIG = 'cs_admin_referrals_config_v2'

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

    const list = Array.from(map.values()).sort((a, b) => b.converted - a.converted)
    return list
}
