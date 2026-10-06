'use server'

import { revalidatePath } from 'next/cache'
import {
    MasterAdminSettings,
    BusinessSettingsState,
    PaymentSettingsState,
    SubscriptionSettingsState,
    getAdminSettings,
    saveAdminSettings,
} from '@/data/adminSettingsData'

function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch {
        // Ignored in non-request contexts
    }
}

/**
 * Get all Master Admin Settings.
 */
export async function getAdminSettingsAction(): Promise<{
    success: boolean
    settings: MasterAdminSettings
    error?: string
}> {
    try {
        const settings = getAdminSettings()
        return { success: true, settings }
    } catch (err: any) {
        return { success: false, settings: getAdminSettings(), error: err.message }
    }
}

/**
 * Update Business Profile & Dual-Location Workshop Settings.
 */
export async function updateBusinessSettingsAction(
    updates: Partial<BusinessSettingsState>
): Promise<{
    success: boolean
    business?: BusinessSettingsState
    error?: string
}> {
    try {
        const current = getAdminSettings()
        const updatedBusiness: BusinessSettingsState = {
            ...current.business,
            ...updates,
            brand: {
                ...current.business.brand,
                ...(updates.brand || {}),
            },
            locations: {
                ...current.business.locations,
                ...(updates.locations || {}),
            },
        }

        const newMaster: MasterAdminSettings = {
            ...current,
            business: updatedBusiness,
        }

        saveAdminSettings(newMaster)

        safeRevalidatePath('/admin/settings')
        safeRevalidatePath('/admin/settings/business')
        safeRevalidatePath('/')

        return { success: true, business: updatedBusiness }
    } catch (err: any) {
        return { success: false, error: err.message }
    }
}

/**
 * Update FX Exchange Rate (EUR ↔ NGN).
 * Edge Case: Rejects non-positive exchange rate with strict error message.
 */
export async function updateFxRateAction(rate: number): Promise<{
    success: boolean
    rate?: number
    error?: string
}> {
    try {
        if (!rate || isNaN(rate) || rate <= 0) {
            return {
                success: false,
                error: 'Exchange rate must be a positive number greater than zero.',
            }
        }

        const current = getAdminSettings()
        const updatedPayments: PaymentSettingsState = {
            ...current.payments,
            currency: {
                ...current.payments.currency,
                manualRate: rate,
                lastUpdated: new Date().toISOString(),
            },
        }

        const newMaster: MasterAdminSettings = {
            ...current,
            payments: updatedPayments,
        }

        saveAdminSettings(newMaster)

        safeRevalidatePath('/admin/settings')
        safeRevalidatePath('/admin/settings/languages')
        safeRevalidatePath('/admin/settings/payments')

        return { success: true, rate }
    } catch (err: any) {
        return { success: false, error: err.message }
    }
}

/**
 * Update Payment Gateways & Deposit Settings.
 * Edge Case: Validates Stripe live key prefix.
 */
export async function updatePaymentSettingsAction(
    updates: Partial<PaymentSettingsState>
): Promise<{
    success: boolean
    payments?: PaymentSettingsState
    error?: string
}> {
    try {
        // Validate Stripe API key format if updating Stripe in live mode
        if (updates.stripe) {
            const isLive = updates.stripe.testMode === false
            const key = updates.stripe.publicKey?.trim()
            if (isLive && key && !key.startsWith('pk_live_')) {
                return {
                    success: false,
                    error: 'Invalid Stripe API key format.',
                }
            }
        }

        const current = getAdminSettings()
        const updatedPayments: PaymentSettingsState = {
            ...current.payments,
            ...updates,
            paystack: {
                ...current.payments.paystack,
                ...(updates.paystack || {}),
            },
            stripe: {
                ...current.payments.stripe,
                ...(updates.stripe || {}),
            },
        }

        const newMaster: MasterAdminSettings = {
            ...current,
            payments: updatedPayments,
        }

        saveAdminSettings(newMaster)

        safeRevalidatePath('/admin/settings')
        safeRevalidatePath('/admin/settings/payments')

        return { success: true, payments: updatedPayments }
    } catch (err: any) {
        return { success: false, error: err.message }
    }
}

/**
 * Update Staff Role (RBAC).
 * Edge Case: Prevents demotion or lockout of primary super administrator account.
 */
export async function updateStaffRoleAction(
    userId: string,
    targetRole: 'Admin' | 'Tailor'
): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const current = getAdminSettings()
        const targetUser = current.access.users.find((u) => u.id === userId)

        if (!targetUser) {
            return { success: false, error: 'Staff user not found.' }
        }

        // Edge case: Protect primary super admin Samuelson from demotion
        const isPrimarySuperAdmin =
            targetUser.email === 'samuelson@captainstitches.com' || targetUser.id === 'usr-1'

        if (isPrimarySuperAdmin && targetRole === 'Tailor') {
            return {
                success: false,
                error: 'Cannot demote the primary Super Administrator account.',
            }
        }

        const updatedUsers = current.access.users.map((u) =>
            u.id === userId ? { ...u, role: targetRole } : u
        )

        const newMaster: MasterAdminSettings = {
            ...current,
            access: {
                ...current.access,
                users: updatedUsers,
            },
        }

        saveAdminSettings(newMaster)

        safeRevalidatePath('/admin/settings')
        safeRevalidatePath('/admin/settings/access')

        return { success: true }
    } catch (err: any) {
        return { success: false, error: err.message }
    }
}

/**
 * Get Dormant Subscriptions Settings.
 */
export async function getSubscriptionsSettingsAction(): Promise<{
    success: boolean
    subscriptions: SubscriptionSettingsState
    error?: string
}> {
    try {
        const settings = getAdminSettings()
        return { success: true, subscriptions: settings.subscriptions }
    } catch (err: any) {
        return {
            success: false,
            subscriptions: getAdminSettings().subscriptions,
            error: err.message,
        }
    }
}

/**
 * Toggle Subscriptions Feature Flag.
 */
export async function toggleSubscriptionsEnabledAction(
    enabled: boolean
): Promise<{
    success: boolean
    enabled: boolean
    error?: string
}> {
    try {
        const current = getAdminSettings()
        const newMaster: MasterAdminSettings = {
            ...current,
            subscriptions: {
                ...current.subscriptions,
                enabled,
            },
        }

        saveAdminSettings(newMaster)

        safeRevalidatePath('/admin/settings')
        safeRevalidatePath('/admin/settings/subscriptions')
        safeRevalidatePath('/subscribe')

        return { success: true, enabled }
    } catch (err: any) {
        return { success: false, enabled: false, error: err.message }
    }
}
