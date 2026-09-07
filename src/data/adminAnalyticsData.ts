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
const STORAGE_KEY_ANALYTICS_SETTINGS = 'cs_analytics_settings_v1'

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
    const scale = range === '7d' ? 0.3 : range === '30d' ? 1.0 : range === '3m' ? 2.6 : range === '6m' ? 4.8 : 8.5

    return {
        totalOrders: Math.round(28 * scale),
        ordersDelta: 14.3,
        totalRevenueNGN: Math.round(18400000 * scale),
        totalRevenueEUR: Math.round(10514 * scale),
        revenueDelta: 18.2,
        newCustomers: Math.round(16 * scale),
        customersDelta: 9.8,
        averageOrderValueNGN: 657140,
        averageOrderValueEUR: 375,
        aovDelta: 4.1,
        referralConversionRate: 34.2,
        referralDelta: 5.6,
        emailSubscriberGrowth: Math.round(42 * scale),
        subscriberDelta: 12.0,
    }
}

export function getRevenueTrend(range: DateRangeKey = '30d'): RevenuePoint[] {
    if (range === '7d') {
        return [
            { date: 'Mon', collectedNGN: 2100000, collectedEUR: 1200, outstandingNGN: 1050000, outstandingEUR: 600, expectedNGN: 3150000, expectedEUR: 1800 },
            { date: 'Tue', collectedNGN: 3500000, collectedEUR: 2000, outstandingNGN: 1750000, outstandingEUR: 1000, expectedNGN: 5250000, expectedEUR: 3000 },
            { date: 'Wed', collectedNGN: 1750000, collectedEUR: 1000, outstandingNGN: 875000, outstandingEUR: 500, expectedNGN: 2625000, expectedEUR: 1500 },
            { date: 'Thu', collectedNGN: 4200000, collectedEUR: 2400, outstandingNGN: 2100000, outstandingEUR: 1200, expectedNGN: 6300000, expectedEUR: 3600 },
            { date: 'Fri', collectedNGN: 5250000, collectedEUR: 3000, outstandingNGN: 2625000, outstandingEUR: 1500, expectedNGN: 7875000, expectedEUR: 4500 },
            { date: 'Sat', collectedNGN: 3150000, collectedEUR: 1800, outstandingNGN: 1575000, outstandingEUR: 900, expectedNGN: 4725000, expectedEUR: 2700 },
            { date: 'Sun', collectedNGN: 1400000, collectedEUR: 800, outstandingNGN: 700000, outstandingEUR: 400, expectedNGN: 2100000, expectedEUR: 1200 },
        ]
    }
    return [
        { date: 'Apr', collectedNGN: 12250000, collectedEUR: 7000, outstandingNGN: 3500000, outstandingEUR: 2000, expectedNGN: 15750000, expectedEUR: 9000 },
        { date: 'May', collectedNGN: 15750000, collectedEUR: 9000, outstandingNGN: 4375000, outstandingEUR: 2500, expectedNGN: 20125000, expectedEUR: 11500 },
        { date: 'Jun', collectedNGN: 19250000, collectedEUR: 11000, outstandingNGN: 5250000, outstandingEUR: 3000, expectedNGN: 24500000, expectedEUR: 14000 },
        { date: 'Jul', collectedNGN: 16625000, collectedEUR: 9500, outstandingNGN: 3850000, outstandingEUR: 2200, expectedNGN: 20475000, expectedEUR: 11700 },
        { date: 'Aug', collectedNGN: 22750000, collectedEUR: 13000, outstandingNGN: 6125000, outstandingEUR: 3500, expectedNGN: 28875000, expectedEUR: 16500 },
        { date: 'Sep', collectedNGN: 26250000, collectedEUR: 15000, outstandingNGN: 7000000, outstandingEUR: 4000, expectedNGN: 33250000, expectedEUR: 19000 },
    ]
}

export function getOrdersTrend(range: DateRangeKey = '30d'): OrderTrendPoint[] {
    if (range === '7d') {
        return [
            { date: 'Mon', italyCount: 3, nigeriaCount: 2, totalCount: 5 },
            { date: 'Tue', italyCount: 4, nigeriaCount: 3, totalCount: 7 },
            { date: 'Wed', italyCount: 2, nigeriaCount: 2, totalCount: 4 },
            { date: 'Thu', italyCount: 5, nigeriaCount: 4, totalCount: 9 },
            { date: 'Fri', italyCount: 6, nigeriaCount: 5, totalCount: 11 },
            { date: 'Sat', italyCount: 4, nigeriaCount: 3, totalCount: 7 },
            { date: 'Sun', italyCount: 2, nigeriaCount: 1, totalCount: 3 },
        ]
    }
    return [
        { date: 'Apr', italyCount: 12, nigeriaCount: 10, totalCount: 22 },
        { date: 'May', italyCount: 15, nigeriaCount: 13, totalCount: 28 },
        { date: 'Jun', italyCount: 18, nigeriaCount: 14, totalCount: 32 },
        { date: 'Jul', italyCount: 16, nigeriaCount: 12, totalCount: 28 },
        { date: 'Aug', italyCount: 22, nigeriaCount: 16, totalCount: 38 },
        { date: 'Sep', italyCount: 25, nigeriaCount: 18, totalCount: 43 },
    ]
}

export const ORDER_FUNNEL_STAGES: FunnelStage[] = [
    { stage: 'NEW', label: '1. New Enquiries', count: 120, dropoffRate: 0, avgDays: 1.2 },
    { stage: 'CONFIRMED', label: '2. Deposit Confirmed', count: 102, dropoffRate: 15.0, avgDays: 1.8 },
    { stage: 'IN_PRODUCTION', label: '3. In Production', count: 98, dropoffRate: 3.9, avgDays: 6.5 },
    { stage: 'INSPECTION', label: '4. Atelier Inspection', count: 95, dropoffRate: 3.1, avgDays: 1.4 },
    { stage: 'APPROVED', label: '5. Client Approved', count: 94, dropoffRate: 1.1, avgDays: 0.9 },
    { stage: 'DISPATCHED', label: '6. Dispatched Air Courier', count: 94, dropoffRate: 0, avgDays: 3.2 },
    { stage: 'DELIVERED', label: '7. Safely Delivered', count: 92, dropoffRate: 2.1, avgDays: 1.0 },
]

export const PRODUCTION_BENCHMARKS: ProductionStageMetric[] = [
    { stageKey: 'new_to_confirmed', stageName: 'Deposit Turnaround (New → Confirmed)', actualDays: 1.8, targetDays: 2.0, isDelayed: false },
    { stageKey: 'confirmed_to_prod', stageName: 'Workshop Queue (Confirmed → In Production)', actualDays: 1.5, targetDays: 1.0, isDelayed: true },
    { stageKey: 'prod_to_inspect', stageName: 'Tailor Assembly (In Production → Inspection)', actualDays: 6.2, targetDays: 6.0, isDelayed: false },
    { stageKey: 'inspect_to_approved', stageName: 'Photo Approval (Inspection → Approved)', actualDays: 1.2, targetDays: 1.0, isDelayed: true },
    { stageKey: 'approved_to_dispatch', stageName: 'Dispatch Packaging (Approved → Dispatched)', actualDays: 0.8, targetDays: 1.0, isDelayed: false },
    { stageKey: 'dispatch_to_delivered', stageName: 'Air Freight Transit (Dispatched → Delivered)', actualDays: 3.6, targetDays: 4.0, isDelayed: false },
]

export const RETENTION_COHORTS: CohortRow[] = [
    { month: 'Apr 2026', initialSize: 22, m1: 27, m2: 36, m3: 45, m4: 50, m5: 54, m6: 59 },
    { month: 'May 2026', initialSize: 28, m1: 25, m2: 32, m3: 42, m4: 46, m5: 50, m6: 0 },
    { month: 'Jun 2026', initialSize: 32, m1: 28, m2: 37, m3: 44, m4: 50, m5: 0, m6: 0 },
    { month: 'Jul 2026', initialSize: 28, m1: 29, m2: 35, m3: 43, m4: 0, m5: 0, m6: 0 },
    { month: 'Aug 2026', initialSize: 38, m1: 31, m2: 39, m3: 0, m4: 0, m5: 0, m6: 0 },
    { month: 'Sep 2026', initialSize: 43, m1: 33, m2: 0, m3: 0, m4: 0, m5: 0, m6: 0 },
]

export const CATALOGUE_PERFORMANCE_ITEMS: CatalogueDesignPerformance[] = [
    {
        id: 'des-1',
        name: 'The Grand Agbada (3-Piece)',
        category: 'Native Wear',
        ordersCount: 42,
        revenueNGN: 18900000,
        revenueEUR: 10800,
        avgRating: 4.9,
        reviewsCount: 18,
        isDormant90d: false,
        isTopPerformer: true,
        thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'des-2',
        name: 'Classic Senator Two-Piece',
        category: 'Native Wear',
        ordersCount: 36,
        revenueNGN: 12600000,
        revenueEUR: 7200,
        avgRating: 4.8,
        reviewsCount: 14,
        isDormant90d: false,
        isTopPerformer: false,
        thumbnail: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'des-3',
        name: 'Double-Breasted Cashmere Blazer',
        category: 'English Suits',
        ordersCount: 28,
        revenueNGN: 15400000,
        revenueEUR: 8800,
        avgRating: 5.0,
        reviewsCount: 12,
        isDormant90d: false,
        isTopPerformer: false,
        thumbnail: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'des-4',
        name: 'Mediterranean Safari Linen Shirt',
        category: 'Casual',
        ordersCount: 22,
        revenueNGN: 6600000,
        revenueEUR: 3770,
        avgRating: 4.7,
        reviewsCount: 9,
        isDormant90d: false,
        isTopPerformer: false,
        thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'des-5',
        name: 'Heirloom Velvet Kaftan',
        category: 'Native Wear',
        ordersCount: 18,
        revenueNGN: 9450000,
        revenueEUR: 5400,
        avgRating: 4.9,
        reviewsCount: 8,
        isDormant90d: false,
        isTopPerformer: false,
        thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=600',
    },
    {
        id: 'des-6',
        name: 'Junior Prince Ceremonial Set',
        category: "Children's",
        ordersCount: 2,
        revenueNGN: 700000,
        revenueEUR: 400,
        avgRating: 4.5,
        reviewsCount: 1,
        isDormant90d: true,
        isTopPerformer: false,
        thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=600',
    },
]

export const TOP_REFERRERS_LIST: ReferrerPerformance[] = [
    { name: 'Dr. Chinedu Okafor', customerId: 'cust-2', linksGenerated: 12, linkVisits: 84, conversions: 8, conversionRate: 9.5, revenueEUR: 3200, revenueNGN: 5600000 },
    { name: 'Marco Rossi', customerId: 'cust-1', linksGenerated: 9, linkVisits: 56, conversions: 6, conversionRate: 10.7, revenueEUR: 2750, revenueNGN: 4812500 },
    { name: 'Amina Bello', customerId: 'cust-4', linksGenerated: 8, linkVisits: 42, conversions: 5, conversionRate: 11.9, revenueEUR: 2100, revenueNGN: 3675000 },
    { name: 'Sofia Esposito', customerId: 'cust-6', linksGenerated: 5, linkVisits: 31, conversions: 3, conversionRate: 9.7, revenueEUR: 1350, revenueNGN: 2362500 },
    { name: 'Emeka Nwosu', customerId: 'cust-5', linksGenerated: 4, linkVisits: 24, conversions: 2, conversionRate: 8.3, revenueEUR: 900, revenueNGN: 1575000 },
]

export const OUTSTANDING_BALANCES_LIST = [
    { orderId: 'ord-101', orderNumber: 'CS-0092', customerName: 'Leonardo Ricci', amountEUR: 450, depositEUR: 225, balanceEUR: 225, amountNGN: 787500, depositNGN: 393750, balanceNGN: 393750, daysDelivered: 4, link: 'https://captainstitches.com/order/pay/ord-101' },
    { orderId: 'ord-102', orderNumber: 'CS-0089', customerName: 'David Sterling', amountEUR: 800, depositEUR: 400, balanceEUR: 400, amountNGN: 1400000, depositNGN: 700000, balanceNGN: 700000, daysDelivered: 8, link: 'https://captainstitches.com/order/pay/ord-102' },
    { orderId: 'ord-103', orderNumber: 'CS-0084', customerName: 'Matteo Bianchi', amountEUR: 350, depositEUR: 175, balanceEUR: 175, amountNGN: 612500, depositNGN: 306250, balanceNGN: 306250, daysDelivered: 12, link: 'https://captainstitches.com/order/pay/ord-103' },
    { orderId: 'ord-104', orderNumber: 'CS-0078', customerName: 'Tunde Adeyemi', amountEUR: 550, depositEUR: 275, balanceEUR: 275, amountNGN: 962500, depositNGN: 481250, balanceNGN: 481250, daysDelivered: 18, link: 'https://captainstitches.com/order/pay/ord-104' },
]

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
