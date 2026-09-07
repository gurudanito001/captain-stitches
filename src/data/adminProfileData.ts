'use client'

export interface AdminProfile {
    id: string
    firstName: string
    lastName: string
    displayName: string
    email: string
    phone: string
    whatsApp: string
    sameAsPhone: boolean
    preferredLanguage: 'en' | 'it'
    role: string
    avatarInitials: string
    avatarColor: string
    lastUpdated: string
}

export interface ActiveSession {
    id: string
    deviceName: string
    browser: string
    os: string
    location: string
    ipAddress: string
    lastActive: string
    isCurrent: boolean
}

export type NotificationChannelPreference = 'whatsapp' | 'email' | 'both' | 'none'

export interface NotificationTypeRule {
    id: string
    label: string
    description: string
    channel: NotificationChannelPreference
    overdueDaysNotice?: number
}

export interface PersonalNotificationPreferences {
    whatsappGloballyEnabled: boolean
    emailGloballyEnabled: boolean
    rules: NotificationTypeRule[]
    quietHours: {
        enabled: boolean
        startTime: string
        endTime: string
        timezone: string
    }
    digest: {
        enabled: boolean
        frequency: 'daily' | 'weekly'
        time: string
        dayOfWeek?: string
    }
}

export interface LoginSecurityState {
    lastLoginTimestamp: string
    lastLoginDevice: string
    lastLoginIp: string
    lastLoginLocation: string
    activeSessions: ActiveSession[]
    pendingEmailChange?: string
}

const STORAGE_KEY_PROFILE = 'cs_admin_profile_v1'
const STORAGE_KEY_NOTIFS = 'cs_admin_profile_notifs_v1'
const STORAGE_KEY_SESSIONS = 'cs_admin_profile_sessions_v1'
const STORAGE_KEY_AUTH = 'cs_admin_auth_v1'

export const INITIAL_ADMIN_PROFILE: AdminProfile = {
    id: 'usr-samuelson',
    firstName: 'Samuelson',
    lastName: 'Anaele',
    displayName: 'Samuelson Anaele',
    email: 'samuelson@captainstitches.com',
    phone: '+39 345 678 9012',
    whatsApp: '+39 345 678 9012',
    sameAsPhone: true,
    preferredLanguage: 'en',
    role: 'Owner · Admin',
    avatarInitials: 'SA',
    avatarColor: '#C4975A',
    lastUpdated: 'Today at 20:15 CET',
}

export const INITIAL_ACTIVE_SESSIONS: ActiveSession[] = [
    {
        id: 'sess-current',
        deviceName: 'MacBook Pro 16"',
        browser: 'Chrome 128',
        os: 'macOS Sonoma',
        location: 'Verona, Italy',
        ipAddress: '93.38.12.84',
        lastActive: 'Active now (Current Session)',
        isCurrent: true,
    },
    {
        id: 'sess-ipad',
        deviceName: 'iPad Pro 12.9"',
        browser: 'Safari 17.5',
        os: 'iPadOS',
        location: 'Milan Showroom, Italy',
        ipAddress: '93.38.12.90',
        lastActive: 'Yesterday at 16:40 CET',
        isCurrent: false,
    },
    {
        id: 'sess-iphone',
        deviceName: 'iPhone 15 Pro',
        browser: 'Mobile Safari',
        os: 'iOS 17.5',
        location: 'Lagos Workshop, Nigeria',
        ipAddress: '102.89.43.12',
        lastActive: 'Sep 04, 2026 at 11:22 WAT',
        isCurrent: false,
    },
]

export const INITIAL_NOTIFICATION_PREFERENCES: PersonalNotificationPreferences = {
    whatsappGloballyEnabled: true,
    emailGloballyEnabled: true,
    rules: [
        {
            id: 'new_order',
            label: 'New order placed',
            description: 'Immediate alert when a client commits to a bespoke commission',
            channel: 'both',
        },
        {
            id: 'deposit_received',
            label: 'Deposit received (70%)',
            description: 'Notification when initial bank transfer or card deposit clears',
            channel: 'both',
        },
        {
            id: 'balance_received',
            label: 'Balance received (30%)',
            description: 'Confirmation that client finalized balance payment',
            channel: 'both',
        },
        {
            id: 'payment_failed',
            label: 'Payment failed or abandoned',
            description: 'Warning when a checkout session fails on Paystack or Stripe',
            channel: 'both',
        },
        {
            id: 'order_overdue',
            label: 'Order overdue notice',
            description: 'Escalation alert when garment exceeds SLA turnaround deadline',
            channel: 'both',
            overdueDaysNotice: 2,
        },
        {
            id: 'inspection_ready',
            label: 'Tailor marks order ready for inspection',
            description: 'Direct prompt for Samuelson to review pre-shipment garment video',
            channel: 'whatsapp',
        },
        {
            id: 'review_submitted',
            label: 'New review submitted',
            description: 'Feedback notification pending studio moderation',
            channel: 'email',
        },
        {
            id: 'referral_converted',
            label: 'Referral converts to paid order',
            description: 'When an invited client pays and ambassador earns a voucher',
            channel: 'both',
        },
        {
            id: 'subscriber_joined',
            label: 'New subscriber joined',
            description: 'Marketing journal subscriber acquisition updates',
            channel: 'email',
        },
        {
            id: 'campaign_sent',
            label: 'Campaign successfully sent',
            description: 'Dispatch report after newsletter broadcast completes',
            channel: 'email',
        },
        {
            id: 'storage_warning',
            label: 'Low storage warning (Cloudinary/S3)',
            description: 'Alert when media CDN reaches over 80% capacity',
            channel: 'email',
        },
    ],
    quietHours: {
        enabled: true,
        startTime: '23:00',
        endTime: '07:00',
        timezone: 'Europe/Rome (CET - Verona)',
    },
    digest: {
        enabled: false,
        frequency: 'daily',
        time: '08:30',
        dayOfWeek: 'Monday',
    },
}

// PROFILE HELPERS

export function getAdminProfile(): AdminProfile {
    if (typeof window === 'undefined') return INITIAL_ADMIN_PROFILE
    try {
        const stored = localStorage.getItem(STORAGE_KEY_PROFILE)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(INITIAL_ADMIN_PROFILE))
            return INITIAL_ADMIN_PROFILE
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ADMIN_PROFILE
    }
}

export function saveAdminProfile(profile: AdminProfile): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile))
    } catch (e) {
        console.error('Failed to save admin profile:', e)
    }
}

// SESSIONS HELPERS

export function getActiveSessions(): ActiveSession[] {
    if (typeof window === 'undefined') return INITIAL_ACTIVE_SESSIONS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SESSIONS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(INITIAL_ACTIVE_SESSIONS))
            return INITIAL_ACTIVE_SESSIONS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ACTIVE_SESSIONS
    }
}

export function terminateSession(sessionId: string): ActiveSession[] {
    const currentSessions = getActiveSessions()
    const updated = currentSessions.filter((s) => s.id !== sessionId || s.isCurrent)
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated))
    }
    return updated
}

export function terminateAllOtherSessions(): ActiveSession[] {
    const currentSessions = getActiveSessions()
    const updated = currentSessions.filter((s) => s.isCurrent)
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_SESSIONS, JSON.stringify(updated))
    }
    return updated
}

// NOTIFICATION PREFERENCES HELPERS

export function getPersonalNotificationPreferences(): PersonalNotificationPreferences {
    if (typeof window === 'undefined') return INITIAL_NOTIFICATION_PREFERENCES
    try {
        const stored = localStorage.getItem(STORAGE_KEY_NOTIFS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(INITIAL_NOTIFICATION_PREFERENCES))
            return INITIAL_NOTIFICATION_PREFERENCES
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_NOTIFICATION_PREFERENCES
    }
}

export function savePersonalNotificationPreferences(prefs: PersonalNotificationPreferences): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_NOTIFS, JSON.stringify(prefs))
    } catch (e) {
        console.error('Failed to save personal notification preferences:', e)
    }
}

// AUTHENTICATION HELPERS

export interface AuthSession {
    isAuthenticated: boolean
    email: string
    token: string
    expiresAt: number
}

export function getAuthSession(): AuthSession {
    if (typeof window === 'undefined') {
        return { isAuthenticated: true, email: 'samuelson@captainstitches.com', token: 'demo-token', expiresAt: Date.now() + 86400000 }
    }
    try {
        const stored = localStorage.getItem(STORAGE_KEY_AUTH)
        if (!stored) {
            const initial = { isAuthenticated: true, email: 'samuelson@captainstitches.com', token: 'demo-token', expiresAt: Date.now() + 86400000 }
            localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(initial))
            return initial
        }
        return JSON.parse(stored)
    } catch {
        return { isAuthenticated: true, email: 'samuelson@captainstitches.com', token: 'demo-token', expiresAt: Date.now() + 86400000 }
    }
}

export function logoutAdmin(): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(
            STORAGE_KEY_AUTH,
            JSON.stringify({ isAuthenticated: false, email: 'samuelson@captainstitches.com', token: '', expiresAt: 0 })
        )
    } catch (e) {
        console.error('Failed to logout:', e)
    }
}

export function loginAdmin(email: string, rememberMe: boolean): AuthSession {
    const session: AuthSession = {
        isAuthenticated: true,
        email,
        token: `token_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        expiresAt: Date.now() + (rememberMe ? 30 * 86400000 : 86400000),
    }
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(session))
    }
    return session
}
