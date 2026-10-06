/**
 * Comprehensive Flow 01 Automated Test Suite
 * Customer Bespoke Order Placement Flow
 *
 * Covers:
 * - TC-01.1: Catalogue pre-fill, bespoke 8-point measurement inputs, customer creation
 * - TC-01.2: Referral code validation, edge cases (invalid code, self-referral, repeat patron), conversion linkage & token respawn
 * - TC-01.3: Decimal measurement precision & unit mapping (Inches / CM)
 * - TC-01.4: Standard European sizing mode (Size, Height, Build)
 * - TC-01.5: Custom reference design commission with notes
 * - TC-01.6: Dual-currency calculation (EUR / Stripe vs NGN / Paystack)
 * - TC-01.7: Order confirmation & live order tracking lookup
 * - TC-01.8: Relational integrity across orders, customers, measurements, referrals, and timeline events
 */

import { prisma } from '../src/lib/prisma'
import { createPublicOrderAction } from '../src/lib/actions/orders'
import {
    validateReferralCodeAction,
    getOrCreateReferralCodeAction,
} from '../src/lib/actions/referrals'
import { trackOrderAction } from '../src/lib/actions/orders'

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

async function runFlow01Tests() {
    console.log('\n=============================================================')
    console.log('🧪 RUNNING FLOW 01 TEST SUITE: Customer Bespoke Order Placement')
    console.log('=============================================================\n')

    // Clean up test data from any previous test runs
    await prisma.payment.deleteMany()
    await prisma.orderTimelineEvent.deleteMany()
    await prisma.referral.deleteMany()
    await prisma.order.deleteMany()
    await prisma.measurement.deleteMany()
    await prisma.customer.deleteMany({
        where: {
            email: { in: ['daniel.tester@captainstitches.com', 'chidi.okonkwo@verona.it', 'amara.diallo@paris.fr', 'kalu.nwosu@lagos.ng'] },
        },
    })

    // Verify catalogue designs are present
    const monarchDesign = await prisma.design.findFirst({
        where: { slug: 'monarch-agbada' },
    })

    assert(
        !!monarchDesign,
        'PRE-01',
        'Catalogue Design Availability',
        `Monarch Agbada exists in DB with slug "${monarchDesign?.slug}", EUR €${monarchDesign?.priceEUR}, NGN ₦${monarchDesign?.priceNGN}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE A: REFERRAL CODE EDGE CASES & VALIDATION
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 1. Testing Referral Validation & Edge Cases ---')

    // Create primary referrer patron: Daniel Tester
    const referrerCustomer = await prisma.customer.create({
        data: {
            firstName: 'Daniel',
            lastName: 'Tester',
            email: 'daniel.tester@captainstitches.com',
            phone: '+393450001122',
            deliveryAddress: 'Corso Porta Nuova 10, Verona, Italy',
            deliveryLocation: 'ITALY',
        },
    })

    // Generate referral code for Daniel
    const referralInit = await getOrCreateReferralCodeAction('daniel.tester@captainstitches.com')
    assert(
        referralInit.success && !!referralInit.token,
        'TC-01.2A',
        'Referral Token Generation',
        `Generated referral token: "${referralInit.token}" for referrer ${referrerCustomer.firstName}`
    )
    const danielToken = referralInit.token!

    // Edge Case 1: Invalid / Expired referral voucher
    const invalidCheck = await validateReferralCodeAction('FAKE999')
    assert(
        invalidCheck.valid === false && invalidCheck.error === 'Referral code not found or expired',
        'EC-01.1',
        'Edge Case: Invalid Referral Voucher',
        `"FAKE999" correctly rejected with message: "${invalidCheck.error}"`
    )

    // Edge Case 2: Self-Referral Attempt (Daniel attempting to use his own code)
    const selfReferralCheck = await validateReferralCodeAction(danielToken, 'daniel.tester@captainstitches.com')
    assert(
        selfReferralCheck.valid === false && selfReferralCheck.error === 'Self-referral is not permitted',
        'EC-01.2',
        'Edge Case: Self-Referral Prevention',
        `Daniel self-referral correctly rejected with: "${selfReferralCheck.error}"`
    )

    // Phone-based self-referral check
    const selfReferralByPhone = await validateReferralCodeAction(danielToken, '+39 345 000 1122')
    assert(
        selfReferralByPhone.valid === false && selfReferralByPhone.error === 'Self-referral is not permitted',
        'EC-01.2B',
        'Edge Case: Self-Referral by Phone',
        `Phone variant (+39 345 000 1122) correctly identified self-referral`
    )

    // Valid Referral Voucher for New Patron (Chidi)
    const validPatronCheck = await validateReferralCodeAction(danielToken, 'chidi.okonkwo@verona.it')
    assert(
        validPatronCheck.valid === true && validPatronCheck.discountEUR === 10,
        'TC-01.2B',
        'Valid Referral Application for First-Time Patron',
        `Voucher verified: €${validPatronCheck.discountEUR} / ₦${validPatronCheck.discountNGN} discount gifted by ${validPatronCheck.referrerName}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE B: HAPPY PATH BESPOKE ORDER WITH REFERRAL DISCOUNT (EUR / STRIPE)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing Bespoke Order Placement with Referral (EUR / Stripe) ---')

    const bespokeOrderInput = {
        fullName: 'Chidi Okonkwo',
        email: 'chidi.okonkwo@verona.it',
        phone: '+39 340 123 4567',
        address: 'Via Mazzini 14',
        city: 'Verona',
        postcode: '37121',
        country: 'Italy',
        designSlug: 'monarch-agbada',
        designName: 'Monarch Agbada',
        fabric: 'Presidential Cashmere',
        colour: 'Midnight Black',
        sizingMode: 'bespoke',
        measurements: {
            unit: 'cm',
            neck: '42.5',
            shoulder: '48.0',
            chest: '104.5',
            sleeve: '65.0',
            shirtLength: '95.0',
            waist: '88.0',
            hip: '102.0',
            trouserLength: '105.0',
        },
        occasion: 'Cultural Gala in Venice',
        deadline: '2026-10-30',
        specialNotes: 'Extra ease around biceps for gala banquet movement.',
        currency: 'EUR' as const,
        totalAmount: 140, // €150 - €10 referral discount
        depositAmount: 70, // 50% deposit
        paymentGateway: 'stripe' as const,
        referralToken: danielToken,
    }

    const order1Result = await createPublicOrderAction(bespokeOrderInput)
    assert(
        order1Result.success && !!order1Result.orderNumber,
        'TC-01.1',
        'Bespoke Order Creation via Stripe (EUR)',
        `Order successfully created: Order Number "${order1Result.orderNumber}"`
    )

    // Verify Database Persistence for Order 1
    const order1Db = await prisma.order.findUnique({
        where: { orderNumber: order1Result.orderNumber! },
        include: {
            customer: true,
            design: true,
            timeline: true,
        },
    })

    assert(
        order1Db !== null && order1Db.status === 'CONFIRMED' && order1Db.totalAmount === 140 && order1Db.depositAmount === 70,
        'TC-01.1B',
        'Order Database Record & Financials',
        `Persisted Order ID: ${order1Db?.id}, Status: ${order1Db?.status}, Total: €${order1Db?.totalAmount}, Deposit: €${order1Db?.depositAmount}, Currency: ${order1Db?.currency}`
    )

    // Verify Customer Record
    assert(
        order1Db?.customer.phone === '+393401234567' && order1Db?.customer.deliveryLocation === 'ITALY',
        'TC-01.1C',
        'Customer Record Upsert & Location Mapping',
        `Customer ${order1Db?.customer.firstName} ${order1Db?.customer.lastName} saved with deliveryLocation: ${order1Db?.customer.deliveryLocation}`
    )

    // Verify Measurements Table
    const measurementsDb = await prisma.measurement.findUnique({
        where: { customerId: order1Db!.customerId },
    })

    assert(
        measurementsDb !== null && measurementsDb.chest === 104.5 && measurementsDb.neck === 42.5 && measurementsDb.unit === 'CM',
        'TC-01.3',
        'Decimals in Bespoke Measurements Table',
        `Measurements table saved: Chest: ${measurementsDb?.chest}cm, Neck: ${measurementsDb?.neck}cm, Unit: ${measurementsDb?.unit}`
    )

    // Verify Referral Conversion & Fresh Token Spawning
    const convertedReferral = await prisma.referral.findFirst({
        where: { token: danielToken },
    })

    assert(
        convertedReferral !== null &&
        convertedReferral.referredRewardStatus === 'REDEEMED' &&
        convertedReferral.referrerRewardStatus === 'CREDITED' &&
        convertedReferral.convertedOrderId === order1Db?.id,
        'TC-01.2C',
        'Referral Conversion Linkage & Credit',
        `Referral ${danielToken} redeemed for order ${order1Db?.orderNumber}, referrer rewarded with status: ${convertedReferral?.referrerRewardStatus}`
    )

    // Verify fresh referral token spawned for Daniel
    const freshTokenRecord = await prisma.referral.findFirst({
        where: {
            referrerId: referrerCustomer.id,
            convertedOrderId: null,
        },
    })

    assert(
        freshTokenRecord !== null && freshTokenRecord.token !== danielToken,
        'TC-01.2D',
        'Fresh Referral Token Auto-Spawn for Next Share',
        `New unassigned share token spawned: "${freshTokenRecord?.token}" (Previous was: "${danielToken}")`
    )

    // Edge Case 3: Repeat Patron Referral Attempt (Chidi is now a returning customer)
    const repeatCustomerCheck = await validateReferralCodeAction(freshTokenRecord?.token || 'DANIEL10', 'chidi.okonkwo@verona.it')
    assert(
        repeatCustomerCheck.valid === false && repeatCustomerCheck.error === 'Referral discount is valid for first-time patron commissions only',
        'EC-01.3',
        'Edge Case: Repeat Patron Referral Rejection',
        `Returning patron Chidi correctly blocked with: "${repeatCustomerCheck.error}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE C: STANDARD EUROPEAN SIZING (TC-01.4)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 3. Testing Standard Sizing Mode Order ---')

    const standardSizeOrderInput = {
        fullName: 'Amara Diallo',
        email: 'amara.diallo@paris.fr',
        phone: '+33 612 345 678',
        address: '12 Rue de Rivoli',
        city: 'Paris',
        postcode: '75001',
        country: 'France',
        designSlug: 'emerald-kaftan',
        designName: 'Emerald Danshiki Kaftan',
        fabric: 'Italian Linen',
        colour: 'Emerald Green',
        sizingMode: 'standard',
        standardSize: 'L (42)',
        heightRange: '175–180 cm (5\'9" – 5\'11")',
        bodyBuild: 'Athletic',
        occasion: 'Wedding Guest',
        deadline: '2026-11-15',
        currency: 'EUR' as const,
        totalAmount: 110,
        depositAmount: 55,
        paymentGateway: 'stripe' as const,
    }

    const order2Result = await createPublicOrderAction(standardSizeOrderInput)
    assert(
        order2Result.success && !!order2Result.orderNumber,
        'TC-01.4',
        'Standard Sizing Order Placement',
        `Created standard size order: ${order2Result.orderNumber}`
    )

    const order2Db = await prisma.order.findUnique({
        where: { orderNumber: order2Result.orderNumber! },
    })

    const snapshot = order2Db?.measurementSnapshot as any
    assert(
        snapshot?.standardSize === 'L (42)',
        'TC-01.4B',
        'Standard Sizing Snapshot Persistence',
        `Snapshot saved: Size "${snapshot?.standardSize}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE D: CUSTOM DESIGN UPLOAD / REFERENCE MODE (TC-01.5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 4. Testing Custom Attire Upload Mode ---')

    const customUploadOrderInput = {
        fullName: 'Kalu Nwosu',
        email: 'kalu.nwosu@lagos.ng',
        phone: '+234 802 345 6789',
        address: '15 Admiralty Way, Lekki Phase 1',
        city: 'Lagos',
        postcode: '105102',
        country: 'Nigeria',
        designSlug: 'custom-ref',
        designName: 'Custom African Reference Design',
        fabric: 'Super 150s Wool',
        colour: 'Royal Navy Blue',
        sizingMode: 'standard',
        standardSize: 'XL (44)',
        occasion: 'Traditional Chieftaincy Installation',
        deadline: '2026-12-01',
        specialNotes: 'Custom double-breasted native tunic with gold metallic embroidery based on Pinterest reference.',
        currency: 'NGN' as const,
        totalAmount: 130000,
        depositAmount: 65000,
        paymentGateway: 'paystack' as const,
    }

    const order3Result = await createPublicOrderAction(customUploadOrderInput)
    assert(
        order3Result.success && !!order3Result.orderNumber,
        'TC-01.5',
        'Custom Attire Reference Order Placement',
        `Created custom attire order: ${order3Result.orderNumber}`
    )

    const order3Db = await prisma.order.findUnique({
        where: { orderNumber: order3Result.orderNumber! },
        include: { customer: true },
    })

    assert(
        order3Db?.currency === 'NGN' && order3Db.customer.deliveryLocation === 'NIGERIA' && order3Db.totalAmount === 130000,
        'TC-01.6',
        'Paystack Gateway Dual-Currency NGN Handling',
        `Nigeria order currency: NGN, Location: ${order3Db?.customer.deliveryLocation}, Total: ₦${order3Db?.totalAmount.toLocaleString('en-NG')}, Deposit: ₦${order3Db?.depositAmount.toLocaleString('en-NG')}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE E: TRACKING LOOKUP / CONFIRMATION INTEGRITY (TC-01.7)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 5. Testing Order Tracking Lookup ---')

    // Lookup by order number
    const trackByNumber = await trackOrderAction(order1Result.orderNumber!)
    assert(
        trackByNumber.success && trackByNumber.order?.orderNumber === order1Result.orderNumber,
        'TC-01.7A',
        'Track Order by Unique Order Code',
        `Successfully located ${trackByNumber.order?.orderNumber} for patron ${trackByNumber.order?.customerName}`
    )

    // Lookup by phone number
    const trackByPhone = await trackOrderAction('+39 340 123 4567')
    assert(
        trackByPhone.success && trackByPhone.order?.orderNumber === order1Result.orderNumber,
        'TC-01.7B',
        'Track Order by Patron Phone Number',
        `Successfully located order using phone format "+39 340 123 4567"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE F: RELATIONAL INTEGRITY ACROSS ALL ENTITIES (TC-01.8)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 6. Testing Relational Integrity Across Entities ---')

    const totalOrders = await prisma.order.count()
    const totalCustomers = await prisma.customer.count()
    const totalMeasurements = await prisma.measurement.count()
    const totalReferrals = await prisma.referral.count()
    const totalTimelineEvents = await prisma.orderTimelineEvent.count()

    assert(
        totalOrders >= 3 && totalCustomers >= 3 && totalMeasurements >= 1 && totalReferrals >= 2 && totalTimelineEvents >= 6,
        'TC-01.8',
        'Database Relational State Verification',
        `Counts verified -> Orders: ${totalOrders}, Customers: ${totalCustomers}, Measurements: ${totalMeasurements}, Referrals: ${totalReferrals}, Timeline Events: ${totalTimelineEvents}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // SUMMARY REPORT
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n=============================================================')
    console.log('📊 FLOW 01 TEST RESULTS SUMMARY')
    console.log('=============================================================')
    const passedCount = results.filter(r => r.passed).length
    const failedCount = results.filter(r => !r.passed).length
    console.log(`Total Assertions: ${results.length}`)
    console.log(`Passed: ${passedCount}`)
    console.log(`Failed: ${failedCount}`)

    if (failedCount > 0) {
        console.error('\n❌ SOME FLOW 01 TESTS FAILED:')
        results.filter(r => !r.passed).forEach(r => console.error(`  - [${r.id}] ${r.title}: ${r.details}`))
        process.exit(1)
    } else {
        console.log('\n✨ ALL FLOW 01 TESTS PASSED PERFECTLY!')
    }
}

runFlow01Tests()
    .catch((err) => {
        console.error('Fatal test error:', err)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
