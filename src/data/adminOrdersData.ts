export type OrderStatus =
    | 'NEW'
    | 'CONFIRMED'
    | 'IN_PRODUCTION'
    | 'INSPECTION'
    | 'APPROVED'
    | 'DISPATCHED'
    | 'DELIVERED'

export type Location = 'Italy' | 'Nigeria'
export type Currency = 'NGN' | 'EUR'

export interface MeasurementProfile {
    chest: number
    shoulder: number
    sleeve: number
    waist: number
    hips: number
    inseam: number
    neck: number
    length: number
    fitNotes?: string
    unit: 'inches' | 'cm'
    measuredAt?: string
    updatedAt?: string
}

export interface CustomerProfile {
    id: string
    name: string
    phone: string
    whatsapp: string
    email: string
    location: Location
    address: string
    language: 'English' | 'Italian'
    currency: Currency
    savedMeasurements: MeasurementProfile
    totalOrders: number
}

export interface Tailor {
    id: string
    name: string
    role: string
    location: string
    activeOrdersCount: number
}

export interface AdminOrder {
    id: string
    orderNumber: string
    createdAt: string
    status: OrderStatus
    isOverdue: boolean
    tailorAssigned: string
    customer: CustomerProfile
    design: {
        id: string
        name: string
        category: string
        image: string
        isCustom: boolean
        fabric?: string
        colour?: string
        specialInstructions?: string
    }
    measurements: MeasurementProfile
    details: {
        occasion: string
        deadline: string
        deliveryLocation: Location
        fullAddress: string
        currency: Currency
        estimatedDeliveryDate: string
        additionalNotes?: string
    }
    payment: {
        totalNGN: number
        totalEUR: number
        depositAmount: number
        depositStatus: 'PAID' | 'UNPAID'
        depositPaidDate?: string
        balanceAmount: number
        balanceStatus: 'PAID' | 'UNPAID'
        balancePaidDate?: string
        gateway: 'Paystack' | 'Stripe' | 'Manual Bank Transfer' | 'Cash'
        referenceNumber: string
        balancePaymentLink: string
    }
    inspection: {
        photos: string[]
        videoUrl?: string
        notes: string
        approvedBy?: string
        approvedAt?: string
        isApproved: boolean
    }
    adminNotes: Array<{
        id: string
        author: string
        text: string
        timestamp: string
    }>
    notifications: Array<{
        id: string
        event: string
        channel: 'WhatsApp' | 'Email'
        timestamp: string
        details?: string
    }>
}

export const TAILORS_ROSTER: Tailor[] = [
    { id: 't-1', name: 'Samuelson (Master Tailor)', role: 'Creative Director & Lead Cutter', location: 'Lagos & Milan', activeOrdersCount: 0 },
    { id: 't-2', name: 'Babatunde Bello', role: 'Head Native Wear Artisan', location: 'Lagos Atelier', activeOrdersCount: 0 },
    { id: 't-3', name: 'Ibrahim Musa', role: 'Bespoke Suit Specialist', location: 'Lagos Atelier', activeOrdersCount: 0 },
    { id: 't-4', name: 'Kolapo Adeleke', role: 'Agbada & Embroidery Master', location: 'Lagos Atelier', activeOrdersCount: 0 },
    { id: 't-5', name: 'Chioma Okafor', role: 'Finishing & Quality Assurance', location: 'Lagos Atelier', activeOrdersCount: 0 },
]

export const CUSTOMERS_DIRECTORY: CustomerProfile[] = []

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = []

export const STAGES_PIPELINE: { key: OrderStatus; label: string; description: string; badgeColor: string; badgeBg: string }[] = [
    { key: 'NEW', label: 'New', description: 'Placed, awaiting deposit', badgeColor: '#92600A', badgeBg: '#FEF3CD' },
    { key: 'CONFIRMED', label: 'Confirmed', description: '50% deposit received', badgeColor: '#C4975A', badgeBg: '#FDF3E7' },
    { key: 'IN_PRODUCTION', label: 'In Production', description: 'Tailor actively crafting', badgeColor: '#7A4F2E', badgeBg: '#F5ECD9' },
    { key: 'INSPECTION', label: 'Inspection', description: 'Media uploaded, QC review', badgeColor: '#5C3820', badgeBg: '#E2C99E' },
    { key: 'APPROVED', label: 'Approved', description: 'Samuelson signed off', badgeColor: '#166534', badgeBg: '#DCFCE7' },
    { key: 'DISPATCHED', label: 'Dispatched', description: 'Shipped via courier', badgeColor: '#1D4ED8', badgeBg: '#DBEAFE' },
    { key: 'DELIVERED', label: 'Delivered', description: 'Customer confirmed receipt', badgeColor: '#4B5563', badgeBg: '#F3F4F6' },
]

const STORAGE_KEY = 'cs_admin_orders_store_v2'

export function getAllOrders(): AdminOrder[] {
    if (typeof window === 'undefined') return INITIAL_ADMIN_ORDERS
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_ORDERS))
            return INITIAL_ADMIN_ORDERS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ADMIN_ORDERS
    }
}

export function saveAllOrders(orders: AdminOrder[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch (e) {
        console.error('Failed to persist orders', e)
    }
}

export function getOrderById(id: string): AdminOrder | undefined {
    const orders = getAllOrders()
    return orders.find((o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase())
}

export function updateOrder(updatedOrder: AdminOrder): void {
    const orders = getAllOrders()
    const index = orders.findIndex((o) => o.id === updatedOrder.id)
    if (index !== -1) {
        orders[index] = updatedOrder
    } else {
        orders.unshift(updatedOrder)
    }
    saveAllOrders(orders)
}

export function updateOrderStatus(id: string, newStatus: OrderStatus): AdminOrder | undefined {
    const orders = getAllOrders()
    const target = orders.find((o) => o.id === id)
    if (target) {
        target.status = newStatus
        target.notifications.unshift({
            id: `notif-${Date.now()}`,
            event: `Status changed to ${newStatus}`,
            channel: 'WhatsApp',
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            details: `Order moved to stage ${newStatus} in admin operations.`,
        })
        saveAllOrders(orders)
    }
    return target
}

export function assignOrderTailor(id: string, tailorName: string): AdminOrder | undefined {
    const orders = getAllOrders()
    const target = orders.find((o) => o.id === id)
    if (target) {
        target.tailorAssigned = tailorName
        target.adminNotes.unshift({
            id: `an-${Date.now()}`,
            author: 'Samuelson',
            text: `Assigned tailor to ${tailorName}.`,
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        })
        saveAllOrders(orders)
    }
    return target
}
