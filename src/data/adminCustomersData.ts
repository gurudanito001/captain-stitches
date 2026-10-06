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
    bicep?: number
    wrist?: number
    trouserLength?: number
    thigh?: number
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

export const INITIAL_ADMIN_CUSTOMERS: AdminCustomer[] = []

const CUSTOMERS_STORAGE_KEY = 'cs_admin_customers_store_v2'

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
