export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced' | 'cleaned'
export type SubscriberLanguage = 'EN' | 'IT'
export type SubscriberLocation = 'Italy' | 'Nigeria' | 'Other'
export type SignupSource = 'homepage' | 'order_confirmation' | 'blog' | 'manual' | 'referral'

export interface MarketingSubscriber {
    id: string
    name: string
    email: string
    language: SubscriberLanguage
    location: SubscriberLocation
    signupSource: SignupSource
    dateSubscribed: string
    status: SubscriberStatus
    lastOpenedEmailDate?: string
    linkedCustomerId?: string
    openRate: number
}

export type ConditionField =
    | 'language'
    | 'location'
    | 'signup_source'
    | 'order_count'
    | 'last_order_date'
    | 'status'
    | 'referral_count'
    | 'date_joined'

export type ConditionOperator = 'is' | 'is_not' | 'greater_than' | 'less_than' | 'contains'

export interface MarketingSegmentCondition {
    id: string
    field: ConditionField
    operator: ConditionOperator
    value: string
}

export interface MarketingSegment {
    id: string
    name: string
    description: string
    subscriberCount: number
    lastUsedDate?: string
    isPrebuilt: boolean
    logic: 'AND' | 'OR'
    conditions: MarketingSegmentCondition[]
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sent'
export type CampaignAudienceType = 'all' | 'en_only' | 'it_only' | 'segment'

export interface ClickMapLink {
    url: string
    label: string
    clicks: number
    uniqueClicks: number
    ctr: number
    topPercent: number
}

export interface MarketingCampaign {
    id: string
    name: string
    status: CampaignStatus
    subjectEN: string
    subjectIT: string
    previewTextEN: string
    previewTextIT: string
    fromName: string
    replyTo: string
    audienceType: CampaignAudienceType
    targetSegmentId?: string
    targetSegmentName?: string
    excludedSegmentId?: string
    excludedSegmentName?: string
    recipientCount: number
    sendDate?: string
    sendTime?: string
    scheduledDate?: string
    scheduledTime?: string
    timezone: string
    contentEN: {
        title: string
        subtitle: string
        body: string
        featuredImage?: string
        ctaText?: string
        ctaUrl?: string
    }
    contentIT: {
        title: string
        subtitle: string
        body: string
        featuredImage?: string
        ctaText?: string
        ctaUrl?: string
    }
    stats?: {
        delivered: number
        opened: number
        uniqueOpens: number
        openRate: number
        clicked: number
        uniqueClicks: number
        clickRate: number
        unsubscribes: number
        hardBounces: number
        softBounces: number
        hourlyOpens48h: Array<{ hour: number; label: string; count: number }>
        clickMapLinks: ClickMapLink[]
        deviceSplit: { mobile: number; desktop: number }
        locationSplit: { italy: number; nigeria: number; other: number }
        languageSplit: { en: number; it: number }
        unsubscribedList: Array<{ name: string; email: string; reason?: string }>
        bouncedList: Array<{ email: string; type: 'Hard Bounce' | 'Soft Bounce'; reason: string }>
    }
    lastSaved?: string
}

export interface TransactionalEmailType {
    id: string
    name: string
    description: string
    isActive: boolean
}

export interface MarketingSettings {
    platform: 'mailchimp' | 'brevo'
    isConnected: boolean
    apiKey: string
    listId: string
    fromName: string
    fromEmail: string
    replyToEmail: string
    footer: {
        businessName: string
        addressItaly: string
        addressNigeria: string
        socialInstagram: string
        socialFacebook: string
        socialWhatsApp: string
        unsubscribeText: string
    }
    brand: {
        logoUrl: string
        accentColor: string
        fontFamily: string
    }
    transactional: {
        provider: 'resend' | 'brevo'
        apiKey: string
        fromName: string
        fromEmail: string
        emailTypes: TransactionalEmailType[]
    }
    notifications: {
        notifyOnNewSubscriber: boolean
        notifyOnCampaignSent: boolean
        notifyOnHighBounceRate: boolean
        bounceThresholdPercent: number
    }
    compliance: {
        gdprConsentMode: boolean
        consentStatement: string
        dataRetentionMonths: number
    }
}

// STORAGE KEYS
const STORAGE_KEY_SUBSCRIBERS = 'cs_marketing_subscribers_v2'
const STORAGE_KEY_SEGMENTS = 'cs_marketing_segments_v2'
const STORAGE_KEY_CAMPAIGNS = 'cs_marketing_campaigns_v2'
const STORAGE_KEY_SETTINGS = 'cs_marketing_settings_v2'

// SEED SUBSCRIBERS
export const INITIAL_SUBSCRIBERS: MarketingSubscriber[] = []

// SEED SEGMENTS
export const INITIAL_SEGMENTS: MarketingSegment[] = []

// SEED CAMPAIGNS
export const INITIAL_CAMPAIGNS: MarketingCampaign[] = []

// INITIAL SETTINGS
export const INITIAL_MARKETING_SETTINGS: MarketingSettings = {
    platform: 'mailchimp',
    isConnected: true,
    apiKey: 'cs_live_mc_9847192847291847291038572910',
    listId: 'mc_aud_7749102',
    fromName: 'Samuelson at CaptainStitches',
    fromEmail: 'samuelson@captainstitches.com',
    replyToEmail: 'orders@captainstitches.com',
    footer: {
        businessName: 'CaptainStitches Sartoria & Atelier',
        addressItaly: 'Via Roma 42, 37121 Verona (VR), Italy',
        addressNigeria: '18 Faulkner Road, Aba, Abia State / Victoria Island, Lagos, Nigeria',
        socialInstagram: 'https://instagram.com/captainstitches',
        socialFacebook: 'https://facebook.com/captainstitches',
        socialWhatsApp: 'https://wa.me/393471234567',
        unsubscribeText: 'You received this email because you commissioned a garment or subscribed at captainstitches.com.',
    },
    brand: {
        logoUrl: '/logo.png',
        accentColor: '#C4975A',
        fontFamily: 'serif',
    },
    transactional: {
        provider: 'resend',
        apiKey: 're_live_99482710492817492810',
        fromName: 'CaptainStitches Atelier Notifications',
        fromEmail: 'notifications@captainstitches.com',
        emailTypes: [
            { id: 'tx-1', name: 'Order Confirmation', description: 'Triggered when 50% deposit is paid', isActive: true },
            { id: 'tx-2', name: 'Order Status Update', description: 'Triggered upon stage progression', isActive: true },
            { id: 'tx-3', name: 'Inspection Ready Notification', description: 'Sends high-res photos for approval', isActive: true },
            { id: 'tx-4', name: 'Delivery Confirmation', description: 'Sent with tracking URL upon dispatch', isActive: true },
            { id: 'tx-5', name: 'Review Request', description: 'Automated 5 days post-delivery', isActive: true },
            { id: 'tx-6', name: 'Referral Reward Credited', description: 'Sent when referred friend places order', isActive: true },
            { id: 'tx-7', name: 'Referral Expiry Warning', description: 'Warning 14 days before credit lapse', isActive: true },
            { id: 'tx-8', name: 'Balance Payment Request', description: 'Sent after inspection approval', isActive: true },
            { id: 'tx-9', name: 'Welcome Email', description: 'Sent to first-time bespoke clients', isActive: true },
        ],
    },
    notifications: {
        notifyOnNewSubscriber: true,
        notifyOnCampaignSent: true,
        notifyOnHighBounceRate: true,
        bounceThresholdPercent: 5.0,
    },
    compliance: {
        gdprConsentMode: true,
        consentStatement:
            'By subscribing, you agree to receive editorial newsletters, bespoke previews, and seasonal invitations from CaptainStitches. You may withdraw consent at any time via the one-click unsubscribe link.',
        dataRetentionMonths: 12,
    },
}

// ==========================================
// STORAGE & CRUD HELPERS
// ==========================================

export function getAllSubscribers(): MarketingSubscriber[] {
    if (typeof window === 'undefined') return INITIAL_SUBSCRIBERS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(INITIAL_SUBSCRIBERS))
            return INITIAL_SUBSCRIBERS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_SUBSCRIBERS
    }
}

export function saveAllSubscribers(subs: MarketingSubscriber[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(subs))
    } catch (e) {
        console.error('Failed to save subscribers to localStorage', e)
    }
}

export function saveSubscriber(sub: MarketingSubscriber): MarketingSubscriber[] {
    const list = getAllSubscribers()
    const index = list.findIndex((s) => s.id === sub.id)
    let updated: MarketingSubscriber[]
    if (index >= 0) {
        updated = [...list]
        updated[index] = sub
    } else {
        updated = [sub, ...list]
    }
    saveAllSubscribers(updated)
    return updated
}

export function deleteSubscribers(ids: string[]): MarketingSubscriber[] {
    const list = getAllSubscribers()
    const idSet = new Set(ids)
    const updated = list.filter((s) => !idSet.has(s.id))
    saveAllSubscribers(updated)
    return updated
}

export function bulkUpdateSubscriberStatus(ids: string[], newStatus: SubscriberStatus): MarketingSubscriber[] {
    const list = getAllSubscribers()
    const idSet = new Set(ids)
    const updated = list.map((s) => (idSet.has(s.id) ? { ...s, status: newStatus } : s))
    saveAllSubscribers(updated)
    return updated
}

// SEGMENTS CRUD
export function getAllSegments(): MarketingSegment[] {
    if (typeof window === 'undefined') return INITIAL_SEGMENTS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SEGMENTS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(INITIAL_SEGMENTS))
            return INITIAL_SEGMENTS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_SEGMENTS
    }
}

export function saveAllSegments(segments: MarketingSegment[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(segments))
    } catch (e) {
        console.error('Failed to save segments to localStorage', e)
    }
}

export function saveSegment(segment: MarketingSegment): MarketingSegment[] {
    const list = getAllSegments()
    const index = list.findIndex((s) => s.id === segment.id)
    let updated: MarketingSegment[]
    if (index >= 0) {
        updated = [...list]
        updated[index] = segment
    } else {
        updated = [...list, segment]
    }
    saveAllSegments(updated)
    return updated
}

export function deleteSegment(id: string): MarketingSegment[] {
    const list = getAllSegments()
    const updated = list.filter((s) => s.id !== id)
    saveAllSegments(updated)
    return updated
}

// CAMPAIGNS CRUD
export function getAllCampaigns(): MarketingCampaign[] {
    if (typeof window === 'undefined') return INITIAL_CAMPAIGNS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CAMPAIGNS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS))
            return INITIAL_CAMPAIGNS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_CAMPAIGNS
    }
}

export function saveAllCampaigns(campaigns: MarketingCampaign[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns))
    } catch (e) {
        console.error('Failed to save campaigns to localStorage', e)
    }
}

export function getCampaignById(id: string): MarketingCampaign | undefined {
    const list = getAllCampaigns()
    return list.find((c) => c.id === id)
}

export function saveCampaign(campaign: MarketingCampaign): MarketingCampaign[] {
    const list = getAllCampaigns()
    const now = new Date()
    const timeStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    const withTimestamp = {
        ...campaign,
        lastSaved: timeStr,
    }

    const index = list.findIndex((c) => c.id === campaign.id)
    let updated: MarketingCampaign[]
    if (index >= 0) {
        updated = [...list]
        updated[index] = withTimestamp
    } else {
        updated = [withTimestamp, ...list]
    }
    saveAllCampaigns(updated)
    return updated
}

export function deleteCampaign(id: string): MarketingCampaign[] {
    const list = getAllCampaigns()
    const updated = list.filter((c) => c.id !== id)
    saveAllCampaigns(updated)
    return updated
}

export function duplicateCampaign(id: string): MarketingCampaign | null {
    const list = getAllCampaigns()
    const target = list.find((c) => c.id === id)
    if (!target) return null

    const newId = `camp-${Date.now()}`
    const duplicated: MarketingCampaign = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        status: 'draft',
        sendDate: undefined,
        sendTime: undefined,
        scheduledDate: undefined,
        scheduledTime: undefined,
        stats: undefined,
        lastSaved: 'Just duplicated',
    }

    const updated = [duplicated, ...list]
    saveAllCampaigns(updated)
    return duplicated
}

// SETTINGS
export function getMarketingSettings(): MarketingSettings {
    if (typeof window === 'undefined') return INITIAL_MARKETING_SETTINGS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_MARKETING_SETTINGS))
            return INITIAL_MARKETING_SETTINGS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_MARKETING_SETTINGS
    }
}

export function saveMarketingSettings(settings: MarketingSettings): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    } catch (e) {
        console.error('Failed to save marketing settings to localStorage', e)
    }
}

// OVERVIEW STATS HELPER
export function getMarketingOverviewStats(subscribers = getAllSubscribers(), campaigns = getAllCampaigns()) {
    const activeSubscribers = subscribers.filter((s) => s.status === 'active').length
    const unsubscribedCount = subscribers.filter((s) => s.status === 'unsubscribed').length
    const bouncedCount = subscribers.filter((s) => s.status === 'bounced').length

    const newThisMonth = activeSubscribers
    const unsubscribesThisMonth = unsubscribedCount
    const netGrowth = newThisMonth - unsubscribesThisMonth

    // Campaign averages
    const sentCampaigns = campaigns.filter((c) => c.status === 'sent' && c.stats)
    let totalOpenRate = 0
    let totalClickRate = 0
    let bestCampaign = { name: 'None', subject: 'None', openRate: 0 }

    if (sentCampaigns.length > 0) {
        sentCampaigns.forEach((c) => {
            if (c.stats) {
                totalOpenRate += c.stats.openRate
                totalClickRate += c.stats.clickRate
                if (c.stats.openRate > bestCampaign.openRate) {
                    bestCampaign = {
                        name: c.name,
                        subject: c.subjectEN,
                        openRate: c.stats.openRate,
                    }
                }
            }
        })
        totalOpenRate = parseFloat((totalOpenRate / sentCampaigns.length).toFixed(1))
        totalClickRate = parseFloat((totalClickRate / sentCampaigns.length).toFixed(1))
    }

    // Sources breakdown
    const sourceCounts: Record<SignupSource, number> = {
        homepage: 0,
        order_confirmation: 0,
        blog: 0,
        manual: 0,
        referral: 0,
    }

    subscribers.forEach((s) => {
        if (sourceCounts[s.signupSource] !== undefined) {
            sourceCounts[s.signupSource]++
        }
    })

    return {
        activeSubscribers,
        unsubscribedCount,
        bouncedCount,
        newThisMonth,
        unsubscribesThisMonth,
        netGrowth,
        avgOpenRate: totalOpenRate,
        avgClickRate: totalClickRate,
        bestCampaign,
        sourceCounts,
    }
}
