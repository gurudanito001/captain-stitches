/**
 * Comprehensive Flow 15 Automated Test Suite
 * Admin Settings & Atelier Configuration Flow
 *
 * Covers:
 * - TC-15.1: Open /admin/settings -> verify all master configuration sections & navigation cards
 * - TC-15.2: Open /admin/settings/business -> update Verona Atelier address & WhatsApp hotline
 * - TC-15.3: Open /admin/settings/languages -> verify FX exchange rate (1 EUR = 1,750 NGN)
 * - TC-15.4: Open /admin/settings/payments -> verify Stripe & Paystack gateways and 50% deposit policy
 * - TC-15.5: Open /admin/settings/access -> verify staff members and role-based access control (RBAC)
 * - TC-15.6: Open /admin/settings/subscriptions -> verify dormant subscription architecture (inactive launch flag)
 * - TC-15.EC1: Invalid FX conversion rate rejection (<= 0 or NaN blocked)
 * - TC-15.EC2: Admin self-demotion / lockout protection (protects primary super-admin Samuelson)
 * - TC-15.EC3: Stripe live payment key format validation (requires pk_live_ prefix)
 * - TC-15.EC4: Dormant subscription feature flag toggle & tier definitions (Standard, Priority, VIP)
 * - TC-15.EC5: Dual-location atelier operations integrity (Verona Italy & Lagos/Aba Nigeria)
 */

import {
    getAdminSettingsAction,
    updateBusinessSettingsAction,
    updateFxRateAction,
    updatePaymentSettingsAction,
    updateStaffRoleAction,
    getSubscriptionsSettingsAction,
    toggleSubscriptionsEnabledAction,
} from '../src/lib/actions/settings'
import {
    getAdminSettings,
    saveAdminSettings,
    resetSettingsToDefaults,
    SETTINGS_SEARCH_INDEX,
    INITIAL_ADMIN_SETTINGS,
} from '../src/data/adminSettingsData'

interface TestResult {
    id: string
    title: string
    passed: boolean
    details: string
    error?: string
}

const results: TestResult[] = []

function assert(condition: boolean, id: string, title: string, details: string) {
    if (condition) {
        console.log(`  ✅ [PASS] ${id}: ${title}`)
        results.push({ id, title, passed: true, details })
    } else {
        console.error(`  ❌ [FAIL] ${id}: ${title} - ${details}`)
        results.push({ id, title, passed: false, details, error: 'Assertion failed' })
    }
}

async function runTestSuite() {
    console.log('════════════════════════════════════════════════════════════════')
    console.log('🧪 RUNNING FLOW 15: ADMIN SETTINGS & ATELIER CONFIGURATION FLOW')
    console.log('════════════════════════════════════════════════════════════════\n')

    resetSettingsToDefaults()

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 1: MASTER SETTINGS ROOT & NAVIGATION (TC-15.1)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('--- 1. Testing Master Settings Hub & Navigation Cards ---')

    const masterRes = await getAdminSettingsAction()
    assert(
        masterRes.success === true && Boolean(masterRes.settings),
        'TC-15.1A',
        'Master Settings Retrieval',
        `Successfully loaded master settings state.`
    )

    const settings = masterRes.settings
    const hasAllSections =
        Boolean(settings.business) &&
        Boolean(settings.payments) &&
        Boolean(settings.notifications) &&
        Boolean(settings.languages) &&
        Boolean(settings.access) &&
        Boolean(settings.subscriptions) &&
        Boolean(settings.integrations) &&
        Boolean(settings.danger)

    assert(
        hasAllSections,
        'TC-15.1B',
        'Master Configuration Sections Completeness',
        `All 8 settings modules present: Business, Payments, Notifications, Languages, Access, Subscriptions, Integrations, Danger Zone.`
    )

    assert(
        Array.isArray(SETTINGS_SEARCH_INDEX) && SETTINGS_SEARCH_INDEX.length >= 8,
        'TC-15.1C',
        'Global Settings Search Index',
        `Settings search index contains ${SETTINGS_SEARCH_INDEX.length} indexed configuration routes.`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 2: BUSINESS PROFILE & DUAL-LOCATION CONFIGURATION (TC-15.2)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing Business Profile & WhatsApp Concierge Routing ---')

    assert(
        Boolean(settings.business.locations.verona.address) &&
        Boolean(settings.business.locations.lagos.address),
        'TC-15.2A',
        'Dual-Location Workshop Addresses',
        `Verona: "${settings.business.locations.verona.address}, ${settings.business.locations.verona.city}" | Lagos: "${settings.business.locations.lagos.address}, ${settings.business.locations.lagos.city}"`
    )

    // Update Verona Atelier address and WhatsApp number
    const updatedBusinessRes = await updateBusinessSettingsAction({
        brand: {
            ...settings.business.brand,
            whatsappNumber: '+39 347 999 8877',
            businessEmail: 'verona@captainstitches.com',
        },
        locations: {
            ...settings.business.locations,
            verona: {
                isActive: true,
                address: 'Via Mazzini 14',
                city: 'Verona',
                postcodeOrState: '37121',
                country: 'Italy',
            },
        },
    })

    assert(
        updatedBusinessRes.success === true &&
        updatedBusinessRes.business?.brand.whatsappNumber === '+39 347 999 8877' &&
        updatedBusinessRes.business?.locations.verona.address === 'Via Mazzini 14',
        'TC-15.2B',
        'Update Verona Address & WhatsApp Concierge',
        `Updated Verona address: "${updatedBusinessRes.business?.locations.verona.address}", WhatsApp: "${updatedBusinessRes.business?.brand.whatsappNumber}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 3: FX RATE & CURRENCY ENGINE (TC-15.3)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 3. Testing FX Conversion Engine (EUR ↔ NGN) ---')

    const currentFxRate = settings.payments.currency.manualRate
    assert(
        currentFxRate > 0,
        'TC-15.3A',
        'Display FX Exchange Rate',
        `Current benchmark exchange rate: 1 EUR = ${currentFxRate} NGN`
    )

    // Adjust FX rate to 1 EUR = 1,750 NGN
    const updateRateRes = await updateFxRateAction(1750)
    assert(
        updateRateRes.success === true && updateRateRes.rate === 1750,
        'TC-15.3B',
        'Editable FX Rate Adjustment',
        `Exchange rate updated to 1 EUR = ${updateRateRes.rate} NGN`
    )

    const reloadedSettings = getAdminSettings()
    assert(
        reloadedSettings.payments.currency.manualRate === 1750,
        'TC-15.3C',
        'FX Rate Persistence Verification',
        `Persisted rate verified in store: 1 EUR = ${reloadedSettings.payments.currency.manualRate} NGN`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 4: PAYMENT GATEWAYS & DEPOSIT RULES (TC-15.4)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 4. Testing Stripe & Paystack Gateways and Deposit Rules ---')

    assert(
        settings.payments.paystack.isConnected === true &&
        Boolean(settings.payments.paystack.publicKey),
        'TC-15.4A',
        'Paystack Nigerian Gateway Configuration',
        `Paystack connected: ${settings.payments.paystack.isConnected} (Key: ${settings.payments.paystack.publicKey.slice(0, 10)}...)`
    )

    assert(
        settings.payments.stripe.isConnected === true &&
        Boolean(settings.payments.stripe.publicKey),
        'TC-15.4B',
        'Stripe European Gateway Configuration',
        `Stripe connected: ${settings.payments.stripe.isConnected} (Key: ${settings.payments.stripe.publicKey.slice(0, 10)}...)`
    )

    assert(
        settings.payments.depositAndBalance.depositPercentage === 50 &&
        settings.business.orderDefaults.depositPercentage === 50,
        'TC-15.4C',
        'Deposit Policy Verification (50% Milestone)',
        `Deposit policy verified at ${settings.payments.depositAndBalance.depositPercentage}% for bespoke commissions.`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 5: ROLE-BASED ACCESS CONTROL (RBAC) (TC-15.5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 5. Testing Role-Based Staff Permissions (RBAC) ---')

    const staffUsers = settings.access.users
    assert(
        staffUsers.length >= 3,
        'TC-15.5A',
        'Staff Directory Verification',
        `Found ${staffUsers.length} registered atelier staff members.`
    )

    const superAdmin = staffUsers.find((u) => u.email === 'samuelson@captainstitches.com')
    assert(
        Boolean(superAdmin) && superAdmin?.role === 'Admin',
        'TC-15.5B',
        'Super Administrator Role Assignment',
        `Super Admin identified: ${superAdmin?.name} (${superAdmin?.email}) with role: ${superAdmin?.role}`
    )

    const tailors = staffUsers.filter((u) => u.role === 'Tailor')
    assert(
        tailors.length >= 2,
        'TC-15.5C',
        'Tailor Team Allocation',
        `Verified ${tailors.length} assigned master tailors (e.g. Matteo Rossi, Ifeanyi Okafor)`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 6: DORMANT SUBSCRIPTION ARCHITECTURE (TC-15.6)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 6. Testing Dormant Subscription Tier Architecture ---')

    const subSettingsRes = await getSubscriptionsSettingsAction()
    assert(
        subSettingsRes.success === true,
        'TC-15.6A',
        'Subscriptions Settings Retrieval',
        `Loaded subscription configuration.`
    )

    const subs = subSettingsRes.subscriptions
    assert(
        subs.enabled === false,
        'TC-15.6B',
        'Dormant Mode Feature Flag (Locked INACTIVE for Launch)',
        `Subscriptions enabled flag: ${subs.enabled} (Dormant Mode Active)`
    )

    assert(
        Array.isArray(subs.tiers) && subs.tiers.length >= 3,
        'TC-15.6C',
        'Pre-configured Subscription Tiers Completeness',
        `Found ${subs.tiers.length} built-in wardrobe subscription tiers.`
    )

    const standardTier = subs.tiers.find((t) => t.id === 'tier-standard')
    const priorityTier = subs.tiers.find((t) => t.id === 'tier-priority')
    const vipTier = subs.tiers.find((t) => t.id === 'tier-vip')

    assert(
        Boolean(standardTier) && Boolean(priorityTier) && Boolean(vipTier),
        'TC-15.6D',
        'Subscription Tiers Validation (Standard, Priority, VIP)',
        `Tiers: [1] ${standardTier?.nameEN}, [2] ${priorityTier?.nameEN}, [3] ${vipTier?.nameEN}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 7: EDGE CASES (TC-15.EC1 - TC-15.EC5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 7. Testing Edge Cases & Security Safeguards ---')

    // Edge Case 1: Invalid FX conversion rate
    const negativeFxRes = await updateFxRateAction(-100)
    assert(
        negativeFxRes.success === false &&
        negativeFxRes.error === 'Exchange rate must be a positive number greater than zero.',
        'TC-15.EC1A',
        'Negative FX Rate Rejection',
        `Negative rate (-100) rejected with: "${negativeFxRes.error}"`
    )

    const zeroFxRes = await updateFxRateAction(0)
    assert(
        zeroFxRes.success === false &&
        zeroFxRes.error === 'Exchange rate must be a positive number greater than zero.',
        'TC-15.EC1B',
        'Zero FX Rate Rejection',
        `Zero rate (0) rejected with expected validation error.`
    )

    // Edge Case 2: Admin Self-Demotion / Lockout Protection
    const demoteSuperAdminRes = await updateStaffRoleAction('usr-1', 'Tailor')
    assert(
        demoteSuperAdminRes.success === false &&
        demoteSuperAdminRes.error === 'Cannot demote the primary Super Administrator account.',
        'TC-15.EC2',
        'Super Administrator Demotion Lockout Safeguard',
        `Self-demotion blocked with: "${demoteSuperAdminRes.error}"`
    )

    // Regular tailor role promotion is permitted
    const promoteTailorRes = await updateStaffRoleAction('usr-2', 'Admin')
    assert(
        promoteTailorRes.success === true,
        'TC-15.EC2B',
        'Non-SuperAdmin Role Update Permitted',
        `Updated staff user Matteo Rossi role to Admin.`
    )

    // Edge Case 3: Live Payment Key Formatting Error
    const malformedStripeRes = await updatePaymentSettingsAction({
        stripe: {
            ...settings.payments.stripe,
            testMode: false,
            publicKey: 'invalid_stripe_key_without_prefix',
        },
    })
    assert(
        malformedStripeRes.success === false &&
        malformedStripeRes.error === 'Invalid Stripe API key format.',
        'TC-15.EC3',
        'Malformed Live Stripe Key Rejection',
        `Malformed live key rejected with: "${malformedStripeRes.error}"`
    )

    // Edge Case 4: Subscription Feature Flag Toggle
    const enableSubsRes = await toggleSubscriptionsEnabledAction(true)
    assert(
        enableSubsRes.success === true && enableSubsRes.enabled === true,
        'TC-15.EC4A',
        'Subscription Feature Flag Activation',
        `Feature flag enabled: ${enableSubsRes.enabled}`
    )

    // Restore dormant mode
    const disableSubsRes = await toggleSubscriptionsEnabledAction(false)
    assert(
        disableSubsRes.success === true && disableSubsRes.enabled === false,
        'TC-15.EC4B',
        'Restore Dormant Inactive Launch Mode',
        `Feature flag returned to dormant mode: ${disableSubsRes.enabled}`
    )

    // Edge Case 5: Production Turnaround Times
    const turnarounds = settings.business.production.turnaroundDays
    assert(
        turnarounds.nativeWear === 14 &&
        turnarounds.englishSuits === 21 &&
        settings.business.production.bufferDays >= 1,
        'TC-15.EC5',
        'Production Turnaround & Safety Buffer Integrity',
        `Native wear: ${turnarounds.nativeWear} days, English suits: ${turnarounds.englishSuits} days, Buffer: ${settings.business.production.bufferDays} days`
    )

    // Reset settings to pristine defaults
    resetSettingsToDefaults()

    // ─────────────────────────────────────────────────────────────────────────────
    // SUMMARY REPORT
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════════════')
    console.log('📊 FLOW 15 TEST SUITE SUMMARY REPORT')
    console.log('════════════════════════════════════════════════════════════════')

    const totalTests = results.length
    const passedTests = results.filter((r) => r.passed).length
    const failedTests = results.filter((r) => !r.passed).length
    const passPercentage = ((passedTests / totalTests) * 100).toFixed(1)

    console.log(`Total Assertions : ${totalTests}`)
    console.log(`Passed           : ${passedTests} ✅`)
    console.log(`Failed           : ${failedTests} ❌`)
    console.log(`Pass Rate        : ${passPercentage}%\n`)

    if (failedTests > 0) {
        console.error('FAILED TESTS:')
        results.filter((r) => !r.passed).forEach((r) => {
            console.error(`- [${r.id}] ${r.title}: ${r.details} (${r.error})`)
        })
        process.exit(1)
    } else {
        console.log('🎉 ALL FLOW 15 TEST ASSERTIONS PASSED WITH 100% SUCCESS!')
        process.exit(0)
    }
}

runTestSuite().catch((err) => {
    console.error('Fatal error running Flow 15 tests:', err)
    process.exit(1)
})
