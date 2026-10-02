export type DateRangeKey = '7d' | '30d' | '3m' | '6m' | '12m' | 'custom'

export interface OverviewMetrics {
    totalOrders: number
    ordersDelta: number
    totalRevenueNGN: number
    totalRevenueEUR: number
    revenueDelta: number
    newCustomers: number
    customersDelta: number
    averageOrderValueNGN: number
    averageOrderValueEUR: number
    aovDelta: number
    referralConversionRate: number
    referralDelta: number
    emailSubscriberGrowth: number
    subscriberDelta: number
}

export interface RevenuePoint {
    date: string
    collectedNGN: number
    collectedEUR: number
    outstandingNGN: number
    outstandingEUR: number
    expectedNGN: number
    expectedEUR: number
}

export interface OrderTrendPoint {
    date: string
    italyCount: number
    nigeriaCount: number
    totalCount: number
}

export interface FunnelStage {
    stage: string
    label: string
    count: number
    dropoffRate: number
    avgDays: number
}

export interface ProductionStageMetric {
    stageKey: string
    stageName: string
    actualDays: number
    targetDays: number
    isDelayed: boolean
}

export interface CohortRow {
    month: string
    initialSize: number
    m1: number
    m2: number
    m3: number
    m4: number
    m5: number
    m6: number
}

export interface CatalogueDesignPerformance {
    id: string
    name: string
    category: string
    ordersCount: number
    revenueNGN: number
    revenueEUR: number
    avgRating: number
    reviewsCount: number
    isDormant90d: boolean
    isTopPerformer: boolean
    thumbnail: string
}

export interface ReferrerPerformance {
    name: string
    customerId: string
    linksGenerated: number
    linkVisits: number
    conversions: number
    conversionRate: number
    revenueEUR: number
    revenueNGN: number
}

export interface AnalyticsSettings {
    googleAnalytics: {
        isConnected: boolean
        measurementId: string
        refreshFrequency: string
        lastSync: string
    }
    googleSearchConsole: {
        isConnected: boolean
        propertyUrl: string
        lastSync: string
    }
    dataRetentionMonths: number
    anonymiseCustomerData: boolean
    reporting: {
        weeklySummary: boolean
        monthlySummary: boolean
        recipientEmail: string
    }
}

// Fixed atelier exchange rate for currency conversions (₦1,750 = €1)
export const EUR_TO_NGN_RATE = 1750

// STORAGE KEY
const STORAGE_KEY_ANALYTICS_SETTINGS = 'cs_analytics_settings_v2'

export const INITIAL_ANALYTICS_SETTINGS: AnalyticsSettings = {
    googleAnalytics: {
        isConnected: true,
        measurementId: 'G-CS994827104',
        refreshFrequency: 'Every 24 hours',
        lastSync: 'Sep 07, 2026 · 04:00 AM',
    },
    googleSearchConsole: {
        isConnected: true,
        propertyUrl: 'https://captainstitches.com',
        lastSync: 'Sep 07, 2026 · 05:30 AM',
    },
    dataRetentionMonths: 24,
    anonymiseCustomerData: false,
    reporting: {
        weeklySummary: true,
        monthlySummary: true,
        recipientEmail: 'samuelson@captainstitches.com',
    },
}

// ==========================================
// SEED ANALYTICS COMPUTATIONS
// ==========================================

export function getOverviewMetrics(range: DateRangeKey = '30d', compare: boolean = true): OverviewMetrics {
    return {
        totalOrders: 0,
        ordersDelta: 0,
        totalRevenueNGN: 0,
        totalRevenueEUR: 0,
        revenueDelta: 0,
        newCustomers: 0,
        customersDelta: 0,
        averageOrderValueNGN: 0,
        averageOrderValueEUR: 0,
        aovDelta: 0,
        referralConversionRate: 0,
        referralDelta: 0,
        emailSubscriberGrowth: 0,
        subscriberDelta: 0,
    }
}

export function getRevenueTrend(range: DateRangeKey = '30d'): RevenuePoint[] {
    if (range === '7d') {
        return [
            { date: 'Mon', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
            { date: 'Tue', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
            { date: 'Wed', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
            { date: 'Thu', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
            { date: 'Fri', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
            { date: 'Sat', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
            { date: 'Sun', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
        ]
    }
    return [
        { date: 'Jan', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
        { date: 'Feb', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
        { date: 'Mar', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
        { date: 'Apr', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
        { date: 'May', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
        { date: 'Jun', collectedNGN: 0, collectedEUR: 0, outstandingNGN: 0, outstandingEUR: 0, expectedNGN: 0, expectedEUR: 0 },
    ]
}

export function getOrdersTrend(range: DateRangeKey = '30d'): OrderTrendPoint[] {
    if (range === '7d') {
        return [
            { date: 'Mon', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
            { date: 'Tue', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
            { date: 'Wed', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
            { date: 'Thu', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
            { date: 'Fri', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
            { date: 'Sat', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
            { date: 'Sun', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
        ]
    }
    return [
        { date: 'Jan', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
        { date: 'Feb', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
        { date: 'Mar', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
        { date: 'Apr', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
        { date: 'May', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
        { date: 'Jun', italyCount: 0, nigeriaCount: 0, totalCount: 0 },
    ]
}

export const ORDER_FUNNEL_STAGES: FunnelStage[] = [
    { stage: 'NEW', label: '1. New Enquiries', count: 0, dropoffRate: 0, avgDays: 0 },
    { stage: 'CONFIRMED', label: '2. Deposit Confirmed', count: 0, dropoffRate: 0, avgDays: 0 },
    { stage: 'IN_PRODUCTION', label: '3. In Production', count: 0, dropoffRate: 0, avgDays: 0 },
    { stage: 'INSPECTION', label: '4. Atelier Inspection', count: 0, dropoffRate: 0, avgDays: 0 },
    { stage: 'APPROVED', label: '5. Client Approved', count: 0, dropoffRate: 0, avgDays: 0 },
    { stage: 'DISPATCHED', label: '6. Dispatched Air Courier', count: 0, dropoffRate: 0, avgDays: 0 },
    { stage: 'DELIVERED', label: '7. Safely Delivered', count: 0, dropoffRate: 0, avgDays: 0 },
]

export const PRODUCTION_BENCHMARKS: ProductionStageMetric[] = [
    { stageKey: 'new_to_confirmed', stageName: 'Deposit Turnaround (New → Confirmed)', actualDays: 0, targetDays: 2.0, isDelayed: false },
    { stageKey: 'confirmed_to_prod', stageName: 'Workshop Queue (Confirmed → In Production)', actualDays: 0, targetDays: 1.0, isDelayed: false },
    { stageKey: 'prod_to_inspect', stageName: 'Tailor Assembly (In Production → Inspection)', actualDays: 0, targetDays: 6.0, isDelayed: false },
    { stageKey: 'inspect_to_approved', stageName: 'Photo Approval (Inspection → Approved)', actualDays: 0, targetDays: 1.0, isDelayed: false },
    { stageKey: 'approved_to_dispatch', stageName: 'Dispatch Packaging (Approved → Dispatched)', actualDays: 0, targetDays: 1.0, isDelayed: false },
    { stageKey: 'dispatch_to_delivered', stageName: 'Air Freight Transit (Dispatched → Delivered)', actualDays: 0, targetDays: 4.0, isDelayed: false },
]

export const RETENTION_COHORTS: CohortRow[] = []

export const CATALOGUE_PERFORMANCE_ITEMS: CatalogueDesignPerformance[] = []

export const TOP_REFERRERS_LIST: ReferrerPerformance[] = []

export const OUTSTANDING_BALANCES_LIST: any[] = []

// ==========================================
// SETTINGS PERSISTENCE
// ==========================================

export function getAnalyticsSettings(): AnalyticsSettings {
    if (typeof window === 'undefined') return INITIAL_ANALYTICS_SETTINGS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_ANALYTICS_SETTINGS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_ANALYTICS_SETTINGS, JSON.stringify(INITIAL_ANALYTICS_SETTINGS))
            return INITIAL_ANALYTICS_SETTINGS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ANALYTICS_SETTINGS
    }
}

export function saveAnalyticsSettings(settings: AnalyticsSettings): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_ANALYTICS_SETTINGS, JSON.stringify(settings))
    } catch (e) {
        console.error('Failed to save analytics settings', e)
    }
}

export function exportAnalyticsCSV(reportTitle: string, rows: Array<Record<string, any>>): void {
    if (!rows.length) return
    const keys = Object.keys(rows[0])
    const csvContent =
        'data:text/csv;charset=utf-8,' +
        [
            keys.join(','),
            ...rows.map((row) =>
                keys.map((k) => (typeof row[k] === 'string' ? `"${row[k]}"` : row[k])).join(',')
            ),
        ].join('\n')

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `${reportTitle.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
