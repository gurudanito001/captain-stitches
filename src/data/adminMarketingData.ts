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
export const INITIAL_SUBSCRIBERS: MarketingSubscriber[] = [
    {
        id: 'sub-adewale-01',
        name: 'Adewale Okafor',
        email: 'adewale.okafor@diaspora.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'order_confirmation',
        dateSubscribed: '2026-03-15',
        status: 'active',
        openRate: 85,
        lastOpenedEmailDate: '2026-06-01',
    },
    {
        id: 'sub-chidi-02',
        name: 'Chidi Okonkwo',
        email: 'chidi.okonkwo@atelier.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'homepage',
        dateSubscribed: '2026-04-10',
        status: 'active',
        openRate: 70,
        lastOpenedEmailDate: '2026-05-28',
    },
    {
        id: 'sub-daniel-01',
        name: 'Daniel Nwokocha',
        email: 'gurudanito001@gmail.com',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'referral',
        dateSubscribed: '2026-02-20',
        status: 'active',
        openRate: 90,
        lastOpenedEmailDate: '2026-06-04',
    },
    {
        id: 'sub-emeka-01',
        name: 'Emeka Eze',
        email: 'emeka.eze@diaspora.ng',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'homepage',
        dateSubscribed: '2026-04-22',
        status: 'active',
        openRate: 65,
        lastOpenedEmailDate: '2026-05-30',
    },
    {
        id: 'sub-luca-01',
        name: 'Luca Rossi',
        email: 'luca.rossi@milano.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'referral',
        dateSubscribed: '2026-05-01',
        status: 'active',
        openRate: 60,
        lastOpenedEmailDate: '2026-05-25',
    },
    {
        id: 'sub-matteo-01',
        name: 'Matteo Ferrari',
        email: 'matteo.ferrari@roma.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'blog',
        dateSubscribed: '2026-05-12',
        status: 'active',
        openRate: 75,
        lastOpenedEmailDate: '2026-06-02',
    },
    {
        id: 'sub-chidinma-01',
        name: 'Chidinma Okeke',
        email: 'chidinma.okeke@client.com',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'order_confirmation',
        dateSubscribed: '2026-03-01',
        status: 'active',
        openRate: 50,
        lastOpenedEmailDate: '2026-05-18',
    },
    {
        id: 'sub-samuel-01',
        name: 'Samuel Anaele',
        email: 'samuel.anaele@atelier.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'homepage',
        dateSubscribed: '2026-01-15',
        status: 'active',
        openRate: 80,
        lastOpenedEmailDate: '2026-06-03',
    },
    {
        id: 'sub-unsub-01',
        name: 'Unsubscribed Patron',
        email: 'unsubscribed.user@example.com',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'homepage',
        dateSubscribed: '2026-02-10',
        status: 'unsubscribed',
        openRate: 15,
        lastOpenedEmailDate: '2026-03-01',
    },
    {
        id: 'sub-bounce-01',
        name: 'Bounced User',
        email: 'bounced.tester@domain.invalid',
        language: 'IT',
        location: 'Other',
        signupSource: 'manual',
        dateSubscribed: '2026-04-05',
        status: 'bounced',
        openRate: 0,
    },
]

// SEED SEGMENTS
export const INITIAL_SEGMENTS: MarketingSegment[] = [
    {
        id: 'seg-italy-diaspora',
        name: 'Italy & European Diaspora',
        description: 'Patrons residing in Italy, Switzerland, and the European diaspora.',
        subscriberCount: 5,
        lastUsedDate: '2026-06-01',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [{ id: 'cond-1', field: 'location', operator: 'is', value: 'Italy' }],
    },
    {
        id: 'seg-nigerian-patrons',
        name: 'Nigerian Patrons',
        description: 'Bespoke clients located across Lagos, Abuja, and Aba craftsmanship centers.',
        subscriberCount: 3,
        lastUsedDate: '2026-05-20',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [{ id: 'cond-2', field: 'location', operator: 'is', value: 'Nigeria' }],
    },
    {
        id: 'seg-vip-circle',
        name: 'VIP Ambassador Circle',
        description: 'High-value clients who have made multiple orders or referred friends.',
        subscriberCount: 4,
        lastUsedDate: '2026-05-15',
        isPrebuilt: true,
        logic: 'OR',
        conditions: [{ id: 'cond-3', field: 'order_count', operator: 'greater_than', value: '1' }],
    },
    {
        id: 'seg-new-leads',
        name: 'New Newsletter Leads',
        description: 'Recent subscribers captured from the website looking to make their first commission.',
        subscriberCount: 4,
        lastUsedDate: '2026-06-02',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [{ id: 'cond-4', field: 'signup_source', operator: 'is', value: 'homepage' }],
    },
]

// SEED CAMPAIGNS
export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
    {
        id: 'camp-autumn-winter-drop',
        name: 'Autumn / Winter Bespoke Fabric Drop',
        status: 'sent',
        subjectEN: '✦ New Season Presidential Cashmere Arrived in Verona',
        subjectIT: '✦ Nuova Collezione Cashmere Presidenziale Arrivata a Verona',
        previewTextEN: 'Exclusive early-access bespoke tailoring slots for December events.',
        previewTextIT: 'Accesso esclusivo alle prenotazioni su misura per gli eventi invernali.',
        fromName: 'Samuelson at CaptainStitches',
        replyTo: 'samuelson@captainstitches.com',
        audienceType: 'segment',
        targetSegmentId: 'seg-italy-diaspora',
        targetSegmentName: 'Italy & European Diaspora',
        recipientCount: 450,
        sendDate: '2026-06-01',
        sendTime: '11:00',
        timezone: 'Europe/Rome',
        contentEN: {
            title: 'Presidential Cashmere & Royal Agbada Collection',
            subtitle: 'Direct from our workshop to Verona atelier',
            body: 'Dear Patron,\n\nWe have just received a curated consignment of high-twist Italian wool and hand-spun African cashmere.\n\nEnjoy an exclusive 10% loyalty discount with code PRESIDENTIAL10 on your next bespoke booking.',
            ctaText: 'Book Your Workshop Slot →',
            ctaUrl: '/order',
        },
        contentIT: {
            title: 'Collezione Cashmere Presidenziale e Agbada Reale',
            subtitle: 'Dal nostro laboratorio di confezione all’atelier di Verona',
            body: 'Gentile Cliente,\n\nÈ arrivata la nuova fornitura di lane e sete africane di altissima gamma.\n\nUtilizza il codice PRESIDENTIAL10 per il 10% di sconto sulla tua prossima commissione.',
            ctaText: 'Prenota il Tuo Capo Sartoriale →',
            ctaUrl: '/order',
        },
        stats: {
            delivered: 450,
            opened: 236,
            uniqueOpens: 215,
            openRate: 52.4,
            clicked: 82,
            uniqueClicks: 71,
            clickRate: 18.2,
            unsubscribes: 1,
            hardBounces: 2,
            softBounces: 1,
            hourlyOpens48h: [
                { hour: 0, label: '11:00', count: 45 },
                { hour: 1, label: '12:00', count: 62 },
                { hour: 2, label: '13:00', count: 38 },
                { hour: 3, label: '14:00', count: 25 },
            ],
            clickMapLinks: [
                { url: '/order', label: 'Book Your Workshop Slot', clicks: 58, uniqueClicks: 51, ctr: 12.8, topPercent: 70 },
                { url: '/catalogue', label: 'Browse Lookbook', clicks: 24, uniqueClicks: 20, ctr: 5.4, topPercent: 30 },
            ],
            deviceSplit: { mobile: 72, desktop: 28 },
            locationSplit: { italy: 380, nigeria: 55, other: 15 },
            languageSplit: { en: 60, it: 40 },
            unsubscribedList: [{ name: 'Test Unsub', email: 'unsub.tester@example.com', reason: 'Too many emails' }],
            bouncedList: [{ email: 'bounced.patron@invalid.it', type: 'Hard Bounce', reason: 'Domain does not exist' }],
        },
        lastSaved: '2026-06-01 · 11:00',
    },
]

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

let inMemorySubscribers: MarketingSubscriber[] = [...INITIAL_SUBSCRIBERS]
let inMemorySegments: MarketingSegment[] = [...INITIAL_SEGMENTS]
let inMemoryCampaigns: MarketingCampaign[] = [...INITIAL_CAMPAIGNS]
let inMemorySettings: MarketingSettings = { ...INITIAL_MARKETING_SETTINGS }

export function getAllSubscribers(): MarketingSubscriber[] {
    if (typeof window === 'undefined') return inMemorySubscribers
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(INITIAL_SUBSCRIBERS))
            return INITIAL_SUBSCRIBERS
        }
        const parsed = JSON.parse(stored)
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(INITIAL_SUBSCRIBERS))
            return INITIAL_SUBSCRIBERS
        }
        return parsed
    } catch {
        return inMemorySubscribers
    }
}

export function saveAllSubscribers(subs: MarketingSubscriber[]): void {
    inMemorySubscribers = [...subs]
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
    if (typeof window === 'undefined') return inMemorySegments
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SEGMENTS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(INITIAL_SEGMENTS))
            return INITIAL_SEGMENTS
        }
        const parsed = JSON.parse(stored)
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(INITIAL_SEGMENTS))
            return INITIAL_SEGMENTS
        }
        return parsed
    } catch {
        return inMemorySegments
    }
}

export function saveAllSegments(segments: MarketingSegment[]): void {
    inMemorySegments = [...segments]
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
    if (typeof window === 'undefined') return inMemoryCampaigns
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CAMPAIGNS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS))
            return INITIAL_CAMPAIGNS
        }
        const parsed = JSON.parse(stored)
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS))
            return INITIAL_CAMPAIGNS
        }
        return parsed
    } catch {
        return inMemoryCampaigns
    }
}

export function saveAllCampaigns(campaigns: MarketingCampaign[]): void {
    inMemoryCampaigns = [...campaigns]
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
    if (typeof window === 'undefined') return inMemorySettings
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(inMemorySettings))
            return inMemorySettings
        }
        return JSON.parse(stored)
    } catch {
        return inMemorySettings
    }
}

export function saveMarketingSettings(settings: MarketingSettings): void {
    inMemorySettings = { ...settings }
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
