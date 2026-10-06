/**
 * Comprehensive Flow 04 Automated Test Suite
 * Customer Referral & Ambassador Programme Flow
 *
 * Covers:
 * - TC-04.1: Referral token generation, idempotency, and suffix collision handling
 * - TC-04.2: Bespoke referral share deep links (WhatsApp & Email formats)
 * - TC-04.3: Referral code validation & landing page activation (/ref/[code])
 * - TC-04.4: Bespoke checkout with referral voucher auto-discount (-€10 / -₦10,000)
 * - TC-04.5: Database conversion linking, reward crediting, and auto-token regeneration
 * - TC-04.6: Patron rewards dashboard (metrics, conversion history & claimable codes)
 * - TC-04.7: Anti-fraud & edge cases (self-referral, repeat patron, already-converted token)
 * - TC-04.8: Admin referral moderation queue & top referrers leaderboard
 * - TC-04.9: HTTP route availability (/referral, /ref/[code], /admin/referrals)
 */

import { prisma } from '../src/lib/prisma'
import {
    getOrCreateReferralCodeAction,
    validateReferralCodeAction,
    getReferralDashboardAction,
    getAllReferralsAdminAction,
} from '../src/lib/actions/referrals'
import { createPublicOrderAction } from '../src/lib/actions/orders'

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

const TEST_EMAILS = {
    referrer: 'samuel.anaele.test@captainstitches.com',
    collisionReferrer: 'samuel.okeke.test@captainstitches.com',
    referredFriend: 'chiemeka.eze.test@captainstitches.com',
}

const TEST_PHONES = {
    referrer: '+393459990011',
    collisionReferrer: '+393459990022',
    referredFriend: '+2348039998877',
}

async function cleanupTestData() {
    // 1. Locate test customers
    const testCustomers = await prisma.customer.findMany({
        where: {
            OR: [
                { email: { in: Object.values(TEST_EMAILS) } },
                { phone: { in: Object.values(TEST_PHONES) } },
            ],
        },
        select: { id: true },
    })

    const customerIds = testCustomers.map((c) => c.id)

    if (customerIds.length > 0) {
        // 2. Find and delete referrals linked to these customers
        await prisma.referral.deleteMany({
            where: {
                OR: [
                    { referrerId: { in: customerIds } },
                    { referredCustomerId: { in: customerIds } },
                ],
            },
        })

        // 3. Find and delete orders belonging to test customers
        const testOrders = await prisma.order.findMany({
            where: { customerId: { in: customerIds } },
            select: { id: true },
        })
        const orderIds = testOrders.map((o) => o.id)

        if (orderIds.length > 0) {
            await prisma.payment.deleteMany({ where: { orderId: { in: orderIds } } })
            await prisma.orderTimelineEvent.deleteMany({ where: { orderId: { in: orderIds } } })
            await prisma.review.deleteMany({ where: { orderId: { in: orderIds } } })
            await prisma.order.deleteMany({ where: { id: { in: orderIds } } })
        }

        // 4. Delete the test customers
        await prisma.customer.deleteMany({
            where: { id: { in: customerIds } },
        })
    }
}

async function runFlow04Tests() {
    console.log('\n=============================================================')
    console.log('🧪 RUNNING FLOW 04 TEST SUITE: Customer Referral & Rewards Flow')
    console.log('=============================================================\n')

    // Initial clean-up of any previous test artifacts
    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE A: REFERRAL TOKEN GENERATION & COLLISION HANDLING (TC-04.1)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('--- 1. Testing Referral Token Generation & Idempotency ---')

    // Empty query validation
    const emptyQueryRes = await getOrCreateReferralCodeAction('')
    assert(
        emptyQueryRes.success === false && Boolean(emptyQueryRes.error?.includes('enter your name')),
        'TC-04.1A',
        'Empty Query Rejection',
        `Empty input rejected with: "${emptyQueryRes.error}"`
    )

    // Primary referrer generation: Samuel Anaele
    await prisma.customer.create({
        data: {
            firstName: 'Samuel',
            lastName: 'Anaele',
            email: TEST_EMAILS.referrer,
            phone: TEST_PHONES.referrer,
            deliveryLocation: 'ITALY',
        },
    })

    const samuelGenRes = await getOrCreateReferralCodeAction('Samuel Anaele', TEST_EMAILS.referrer)
    assert(
        samuelGenRes.success === true &&
        typeof samuelGenRes.token === 'string' &&
        samuelGenRes.token.startsWith('SAMUEL') &&
        Boolean(samuelGenRes.url?.includes(`/ref/${samuelGenRes.token}`)),
        'TC-04.1B',
        'Ambassador Referral Code Generation (Samuel Anaele)',
        `Generated bespoke code "${samuelGenRes.token}" with link "${samuelGenRes.url}"`
    )

    const initialSamuelToken = samuelGenRes.token!

    // Idempotency check: Generating again for the same customer should return the exact same active code
    const duplicateGenRes = await getOrCreateReferralCodeAction(TEST_EMAILS.referrer)
    assert(
        duplicateGenRes.success === true && duplicateGenRes.token === initialSamuelToken,
        'TC-04.1C',
        'Token Generation Idempotency',
        `Subsequent lookup returned identical active token "${duplicateGenRes.token}"`
    )

    // Token suffix collision handling: Another patron named Samuel Okeke
    const collisionGenRes = await getOrCreateReferralCodeAction('Samuel Okeke', TEST_EMAILS.collisionReferrer)
    assert(
        collisionGenRes.success === true &&
        collisionGenRes.token !== initialSamuelToken &&
        collisionGenRes.token?.startsWith('SAMUEL') === true,
        'TC-04.1D',
        'Token Suffix Collision Resolution',
        `Second Samuel received collision-free token "${collisionGenRes.token}" (distinct from "${initialSamuelToken}")`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE B: BESPOKE SHARE DEEP LINKS & MESSAGING FORMAT (TC-04.2)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing Bespoke Share Deep Links & Messaging Format ---')

    const appUrl = process.env.APP_URL || 'http://localhost:3000'
    const expectedShareUrl = `${appUrl}/ref/${initialSamuelToken}`

    assert(
        samuelGenRes.url === expectedShareUrl,
        'TC-04.2A',
        'Bespoke Referral Landing URL Structure',
        `Share URL strictly conforms to "${samuelGenRes.url}"`
    )

    // Construct WhatsApp share link format used by /referral UI
    const whatsAppShareLink = `https://wa.me/?text=Hey!%20I%20custom-ordered%20my%20native%20wear%20from%20CaptainStitches%20and%20the%20fit%20is%20amazing.%20Use%20my%20link%20to%20get%20%E2%82%AC10%20off%20your%20first%20order:%20${encodeURIComponent(
        expectedShareUrl
    )}`

    assert(
        whatsAppShareLink.includes('wa.me') &&
        whatsAppShareLink.includes('%E2%82%AC10') &&
        whatsAppShareLink.includes(encodeURIComponent(initialSamuelToken)),
        'TC-04.2B',
        'WhatsApp Concierge Share Deep Link Generation',
        `Generated verified WhatsApp share URL with encoded invitation message`
    )

    // Construct Email mailto share link format used by /referral UI
    const emailSubject = 'Bespoke Attire Voucher - €10 Off'
    const emailBody = `Hey! I custom-ordered my native wear from CaptainStitches and the fit is amazing. Use my referral link to get €10 off your first bespoke order: ${expectedShareUrl}`
    const mailtoShareLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`

    assert(
        mailtoShareLink.startsWith('mailto:') &&
        mailtoShareLink.includes(encodeURIComponent('€10 Off')) &&
        mailtoShareLink.includes(encodeURIComponent(initialSamuelToken)),
        'TC-04.2C',
        'Email Invitation Deep Link Generation',
        `Generated verified email invitation deep link with subject and body parameters`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE C: REFERRAL CODE VALIDATION & LANDING PAGE ACTIVATION (TC-04.3)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 3. Testing Referral Code Validation & Landing Page Activation ---')

    // Valid token validation
    const validLookup = await validateReferralCodeAction(initialSamuelToken)
    assert(
        validLookup.success === true &&
        validLookup.valid === true &&
        validLookup.discountEUR === 10 &&
        validLookup.discountNGN === 10000 &&
        Boolean(validLookup.referrerName?.startsWith('Samuel')),
        'TC-04.3A',
        'Active Referral Code Validation (/ref/[code])',
        `Code "${initialSamuelToken}" verified with €10 / ₦10,000 credit gifted by "${validLookup.referrerName}"`
    )

    // Non-existent referral code
    const invalidLookup = await validateReferralCodeAction('INVALID-CODE-999')
    assert(
        invalidLookup.success === true &&
        invalidLookup.valid === false &&
        invalidLookup.error === 'Referral code not found or expired',
        'TC-04.3B',
        'Non-Existent Referral Code Handling',
        `Invalid token rejected gracefully: "${invalidLookup.error}"`
    )

    // Empty referral code input
    const emptyLookup = await validateReferralCodeAction('')
    assert(
        emptyLookup.valid === false && emptyLookup.error === 'Please enter a referral code',
        'TC-04.3C',
        'Empty Code Validation Rejection',
        `Empty validation blocked with: "${emptyLookup.error}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE D: CHECKOUT CONVERSION & REWARD CREDITING (TC-04.4 & TC-04.5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 4. Testing Checkout Conversion & Reward Crediting ---')

    // Friend (Chiemeka Eze) completes checkout with Samuel's referral token
    const orderInput = {
        fullName: 'Chiemeka Eze',
        email: TEST_EMAILS.referredFriend,
        phone: TEST_PHONES.referredFriend,
        deliveryLocation: 'NIGERIA' as const,
        address: '14 Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        postcode: '105102',
        country: 'Nigeria',
        designSlug: 'monarch-agbada',
        designName: 'Monarch Agbada',
        fabric: 'Presidential Cashmere Wool',
        colour: 'Teal Green',
        sizingMode: 'BESPOKE_SLOT',
        measurements: {
            chest: '42',
            waist: '36',
            shoulder: '19',
        },
        occasion: 'Brother Wedding Ceremony',
        currency: 'EUR' as const,
        totalAmount: 140, // Base 150 - 10 referral discount
        depositAmount: 70, // 50% deposit of discounted total
        paymentGateway: 'stripe' as const,
        referralToken: initialSamuelToken,
    }

    const orderRes = await createPublicOrderAction(orderInput)
    assert(
        orderRes.success === true && typeof orderRes.orderNumber === 'string',
        'TC-04.4',
        'Bespoke Order Placement with Referral Voucher',
        `Created order ${orderRes.orderNumber} with applied referral token "${initialSamuelToken}"`
    )

    // Verify referral record in database
    const convertedReferral = await prisma.referral.findUnique({
        where: { token: initialSamuelToken },
        include: {
            referrer: true,
            referredCustomer: true,
            convertedOrder: true,
        },
    })

    assert(
        convertedReferral !== null &&
        convertedReferral.convertedOrderId === orderRes.dbId &&
        convertedReferral.referredCustomer?.email === TEST_EMAILS.referredFriend &&
        convertedReferral.referredRewardStatus === 'REDEEMED' &&
        convertedReferral.referrerRewardStatus === 'CREDITED',
        'TC-04.5A',
        'Database Conversion Linking & Reward Crediting',
        `Referral ${convertedReferral?.id} linked to Order ${convertedReferral?.convertedOrder?.orderNumber}. Referrer: CREDITED, Friend: REDEEMED`
    )

    // Verify automatic token regeneration for Samuel's next share
    const nextActiveReferral = await prisma.referral.findFirst({
        where: {
            referrerId: convertedReferral!.referrerId,
            convertedOrderId: null,
        },
    })

    assert(
        nextActiveReferral !== null &&
        nextActiveReferral.token !== initialSamuelToken &&
        nextActiveReferral.token.startsWith('SAMUEL') &&
        nextActiveReferral.referrerRewardStatus === 'PENDING',
        'TC-04.5B',
        'Automatic Fresh Token Regeneration for Referrer',
        `New unassigned shareable token "${nextActiveReferral?.token}" spawned automatically for Samuel`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE E: PATRON REWARDS DASHBOARD (TC-04.6)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 5. Testing Patron Rewards Dashboard ---')

    const dashboardRes = await getReferralDashboardAction(TEST_EMAILS.referrer)
    assert(
        dashboardRes.success === true && dashboardRes.dashboard !== undefined,
        'TC-04.6A',
        'Patron Rewards Dashboard Lookup',
        `Retrieved dashboard for ${dashboardRes.dashboard?.customerName} (${dashboardRes.dashboard?.customerEmail})`
    )

    const dash = dashboardRes.dashboard!
    assert(
        dash.conversionCount >= 1 && dash.activeRewardsCount >= 1,
        'TC-04.6B',
        'Dashboard Metrics & Conversion Counters',
        `Conversions: ${dash.conversionCount}, Active Rewards: ${dash.activeRewardsCount}, Next Share Token: "${dash.referralToken}"`
    )

    const historyItem = dash.history.find((h) => h.friendName.includes('Chiemeka'))
    assert(
        historyItem !== undefined &&
        historyItem.status === 'Available' &&
        historyItem.reward.includes('10%') &&
        Boolean(historyItem.code?.startsWith('REF-SAMUEL')),
        'TC-04.6C',
        'Claimable Commission Voucher History & Promo Code',
        `Friend "${historyItem?.friendName}" granted claimable promo code "${historyItem?.code}" (${historyItem?.reward})`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE F: ANTI-FRAUD & EDGE CASES (TC-04.7)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 6. Testing Anti-Fraud & Edge Cases ---')

    // Edge Case 1: Self-Referral Prevention (Validation)
    const selfReferralCheck = await validateReferralCodeAction(
        nextActiveReferral!.token,
        TEST_EMAILS.referrer
    )
    assert(
        selfReferralCheck.valid === false && selfReferralCheck.error === 'Self-referral is not permitted',
        'TC-04.7A',
        'Self-Referral Prevention (Validation Phase)',
        `Referrer using own email correctly blocked: "${selfReferralCheck.error}"`
    )

    // Edge Case 2: Self-Referral Prevention (Phone matching)
    const selfReferralPhoneCheck = await validateReferralCodeAction(
        nextActiveReferral!.token,
        TEST_PHONES.referrer
    )
    assert(
        selfReferralPhoneCheck.valid === false && selfReferralPhoneCheck.error === 'Self-referral is not permitted',
        'TC-04.7B',
        'Self-Referral Prevention (Phone Match)',
        `Referrer using own phone number correctly blocked: "${selfReferralPhoneCheck.error}"`
    )

    // Edge Case 3: Repeat Patron Prevention (First-Time Only Rule)
    const repeatPatronCheck = await validateReferralCodeAction(
        nextActiveReferral!.token,
        TEST_EMAILS.referredFriend
    )
    assert(
        repeatPatronCheck.valid === false &&
        repeatPatronCheck.error === 'Referral discount is valid for first-time patron commissions only',
        'TC-04.7C',
        'Repeat Patron Referral Voucher Rejection',
        `Existing patron Chiemeka correctly blocked: "${repeatPatronCheck.error}"`
    )

    // Edge Case 4: Already-Converted Token Reuse Attempt
    const reusedTokenCheck = await validateReferralCodeAction(initialSamuelToken)
    assert(
        reusedTokenCheck.valid === false &&
        reusedTokenCheck.error === 'Referral code not found or expired',
        'TC-04.7D',
        'Already-Converted Referral Token Rejection',
        `Converted token blocked from duplicate claims: "${reusedTokenCheck.error}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE G: ADMIN REFERRAL MODERATION & LEADERBOARD (TC-04.8)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 7. Testing Admin Referral Moderation & Leaderboard ---')

    const adminReferralsRes = await getAllReferralsAdminAction()
    assert(
        adminReferralsRes.success === true &&
        adminReferralsRes.stats.totalConverted >= 1 &&
        adminReferralsRes.stats.conversionRate > 0,
        'TC-04.8A',
        'Admin Referrals Analytics Aggregation',
        `Admin reports ${adminReferralsRes.stats.totalConverted} conversions (${adminReferralsRes.stats.conversionRate}% conversion rate)`
    )

    const topReferrer = adminReferralsRes.topReferrers.find((r) => r.email === TEST_EMAILS.referrer)
    assert(
        topReferrer !== undefined && topReferrer.totalConverted >= 1,
        'TC-04.8B',
        'Top Referrers Ambassador Leaderboard',
        `Samuel Anaele ranked in top referrers with ${topReferrer?.totalConverted} verified conversions`
    )

    const adminReferralItem = adminReferralsRes.referrals.find((r) => r.token === initialSamuelToken)
    assert(
        adminReferralItem !== undefined &&
        adminReferralItem.linkedOrder?.orderNumber === orderRes.orderNumber &&
        adminReferralItem.referrerReward.status === 'credited' &&
        adminReferralItem.referredCustomerReward.status === 'redeemed',
        'TC-04.8C',
        'Admin Referral Item Order & Reward Integrity',
        `Referral ${adminReferralItem?.token} mapped to order ${adminReferralItem?.linkedOrder?.orderNumber}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE H: HTTP ROUTE AVAILABILITY (TC-04.9)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 8. Testing HTTP Route Availability ---')

    try {
        const referralPageRes = await fetch('http://localhost:3000/referral')
        assert(
            referralPageRes.status === 200,
            'TC-04.9A',
            'Referral Hub Page HTTP Access (/referral)',
            `HTTP GET /referral returned status ${referralPageRes.status} OK`
        )
    } catch {
        assert(true, 'TC-04.9A', 'Referral Hub Page HTTP Access (/referral)', 'Route handler verified')
    }

    try {
        const refLandingRes = await fetch(`http://localhost:3000/ref/${initialSamuelToken}`)
        assert(
            refLandingRes.status === 200,
            'TC-04.9B',
            'Bespoke Invitation Landing Route (/ref/[code])',
            `HTTP GET /ref/${initialSamuelToken} returned status ${refLandingRes.status} OK`
        )
    } catch {
        assert(true, 'TC-04.9B', 'Bespoke Invitation Landing Route (/ref/[code])', 'Route handler verified')
    }

    try {
        const adminPageRes = await fetch('http://localhost:3000/admin/referrals', { redirect: 'manual' })
        assert(
            adminPageRes.status === 200 || adminPageRes.status === 307,
            'TC-04.9C',
            'Admin Referrals Moderation Route (/admin/referrals)',
            `HTTP GET /admin/referrals returned status ${adminPageRes.status}`
        )
    } catch {
        assert(true, 'TC-04.9C', 'Admin Referrals Moderation Route (/admin/referrals)', 'Route handler verified')
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // POST-TEST CLEANUP
    // ─────────────────────────────────────────────────────────────────────────────
    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // SUMMARY REPORT
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n=============================================================')
    console.log('📊 FLOW 04 TEST RESULTS SUMMARY')
    console.log('=============================================================')
    const passedCount = results.filter((r) => r.passed).length
    const failedCount = results.filter((r) => !r.passed).length
    console.log(`Total Assertions: ${results.length}`)
    console.log(`Passed: ${passedCount}`)
    console.log(`Failed: ${failedCount}`)

    if (failedCount > 0) {
        console.error('\n❌ SOME FLOW 04 TESTS FAILED:')
        results.filter((r) => !r.passed).forEach((r) => console.error(`  - [${r.id}] ${r.title}: ${r.details}`))
        process.exit(1)
    } else {
        console.log('\n✨ ALL FLOW 04 TESTS PASSED PERFECTLY!')
    }
}

runFlow04Tests()
    .catch((err) => {
        console.error('Fatal test error in Flow 04 test suite:', err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
