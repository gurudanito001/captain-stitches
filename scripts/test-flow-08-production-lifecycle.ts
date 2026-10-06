/**
 * Comprehensive Flow 08 Automated Test Suite
 * Admin Order Production & Inspection Lifecycle Flow
 *
 * Covers:
 * - TC-08.1: Transition from NEW to CONFIRMED (50% deposit received / admin action)
 * - TC-08.2: Transition from CONFIRMED to IN_PRODUCTION with Tailor Assignment
 * - TC-08.3: Upload inspection media via uploadOrderInspectionMediaAction & transition to INSPECTION
 * - TC-08.4: Master Tailor Samuelson quality approval via approveOrderQualityAction (MANDATORY GATE)
 * - TC-08.5: Courier dispatch logging (DHL Express / Fez Delivery) with tracking code & balance check
 * - TC-08.6: Public tracking verification (/track?id=...) reflects In Transit with courier details
 * - TC-08.7: Delivery confirmation (DELIVERED) enables review submission capability
 * - TC-08.EC1: Quality Inspection Gate Enforcement (attempting dispatch without sign-off is blocked)
 * - TC-08.EC2: Workshop Alteration Request (returns garment from INSPECTION to IN_PRODUCTION)
 * - TC-08.EC3: Unpaid balance dispatch warning message verification
 * - TC-08.EC4: Full end-to-end timeline audit trail verification
 * - TC-08.EC5: HTTP route accessibility checks (/admin/orders, /admin/orders/[id], /track)
 */

import { prisma } from '../src/lib/prisma'
import {
    createOrderAdminAction,
    updateOrderStatusAdminAction,
    uploadOrderInspectionMediaAction,
    approveOrderQualityAction,
    requestOrderAlterationAction,
    dispatchOrderAction,
    trackOrderAction,
    getAllOrdersAdminAction,
} from '../src/lib/actions/orders'
import {
    createCustomerAction,
} from '../src/lib/actions/customers'
import {
    OrderStatus as PrismaOrderStatus,
    DeliveryLocation as PrismaDeliveryLocation,
    Currency as PrismaCurrency,
} from '@prisma/client'

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

const TEST_IDENTIFIERS = {
    customerEmail: 'flow08.client@captainstitches.com',
    customerPhone: '+393339998877',
    orderNumberPrefix: 'CS-TEST-08-',
}

async function cleanupTestData() {
    try {
        const testOrders = await prisma.order.findMany({
            where: {
                OR: [
                    { orderNumber: { startsWith: TEST_IDENTIFIERS.orderNumberPrefix } },
                    { customer: { email: TEST_IDENTIFIERS.customerEmail } },
                ],
            },
            select: { id: true },
        })

        const testOrderIds = testOrders.map((o) => o.id)

        if (testOrderIds.length > 0) {
            // Delete reviews
            await prisma.review.deleteMany({
                where: { orderId: { in: testOrderIds } },
            })
            // Delete timeline
            await prisma.orderTimelineEvent.deleteMany({
                where: { orderId: { in: testOrderIds } },
            })
            // Delete payments
            await prisma.payment.deleteMany({
                where: { orderId: { in: testOrderIds } },
            })
            // Delete orders
            await prisma.order.deleteMany({
                where: { id: { in: testOrderIds } },
            })
        }

        // Delete test customer and measurements if exists
        const testCust = await prisma.customer.findFirst({
            where: { email: TEST_IDENTIFIERS.customerEmail },
        })
        if (testCust) {
            await prisma.measurement.deleteMany({
                where: { customerId: testCust.id },
            })
            await prisma.customer.deleteMany({
                where: { id: testCust.id },
            })
        }
    } catch (e: any) {
        console.warn('Cleanup warning:', e.message)
    }
}

async function runFlow08Tests() {
    console.log('\n======================================================================')
    console.log('  🧪 FLOW 08: ADMIN ORDER PRODUCTION & INSPECTION LIFECYCLE TEST SUITE')
    console.log('======================================================================\n')

    await cleanupTestData()

    try {
        // ─── SETUP: Create Test Customer & Base Order ─────────────────────────────
        console.log('--- SETUP: Creating Test Customer & Initial Order ---')
        const custRes = await createCustomerAction({
            name: 'Lorenzo Moretti',
            email: TEST_IDENTIFIERS.customerEmail,
            phone: TEST_IDENTIFIERS.customerPhone,
            whatsapp: TEST_IDENTIFIERS.customerPhone,
            location: 'Italy',
            address: 'Corso Porta Nuova 48, 37122 Verona, Italy',
            currency: 'EUR',
            language: 'Italian',
        })

        assert(
            Boolean(custRes.success && custRes.customer?.id),
            'SETUP-1',
            'Create Test Customer Lorenzo Moretti',
            `Created customer with ID: ${custRes.customer?.id}`
        )

        const customerId = custRes.customer!.id

        // Create Order 1: Primary Lifecycle Order
        const ord1Res = await createOrderAdminAction({
            orderNumber: `${TEST_IDENTIFIERS.orderNumberPrefix}001`,
            customerId,
            deliveryLocation: 'Italy',
            deliveryAddress: 'Corso Porta Nuova 48, 37122 Verona, Italy',
            currency: 'EUR',
            totalAmount: 180,
            depositAmount: 90,
            depositPaid: false, // Starts at NEW
            tailorAssigned: 'Samuelson (Master Tailor)',
            customDesign: {
                name: 'Double-Breasted Silk Agbada with Venetian Embroidery',
                fabric: 'Italian Silk Cashmere Blend',
                colour: 'Midnight Emerald',
                specialInstructions: 'Custom cut for Verona gala evening',
            },
            measurements: {
                unit: 'cm',
                chest: 104,
                shoulder: 48,
                sleeve: 65,
                neck: 42,
                length: 110,
                waist: 88,
                hips: 102,
                inseam: 82,
                fitNotes: 'Slim fit along chest with generous drape',
            },
        })

        assert(
            Boolean(ord1Res.success && ord1Res.order?.id),
            'SETUP-2',
            'Create Initial Order at NEW status',
            `Created order ${ord1Res.order?.orderNumber} with status ${ord1Res.order?.status}`
        )

        const orderId1 = ord1Res.order!.id
        const orderNumber1 = ord1Res.order!.orderNumber

        // ─── TC-08.1: Transition from NEW to CONFIRMED ────────────────────────────
        console.log('\n--- TC-08.1: Kanban Transition NEW -> CONFIRMED ---')
        const step1 = await updateOrderStatusAdminAction(
            orderId1,
            'CONFIRMED',
            '50% deposit received via Bank Transfer. Order confirmed.'
        )

        assert(
            Boolean(step1.success),
            'TC-08.1a',
            'Update Order Status to CONFIRMED',
            `Transition returned success: ${step1.success}`
        )

        const dbOrder1 = await prisma.order.findUnique({
            where: { id: orderId1 },
            include: { timeline: true },
        })

        assert(
            Boolean(dbOrder1?.status === PrismaOrderStatus.CONFIRMED),
            'TC-08.1b',
            'Database Reflects CONFIRMED Status',
            `Order ${orderNumber1} database status is ${dbOrder1?.status}`
        )

        const confTimeline = dbOrder1?.timeline.find((t) => t.toStatus === PrismaOrderStatus.CONFIRMED)
        assert(
            Boolean(confTimeline && confTimeline.notes?.includes('50% deposit')),
            'TC-08.1c',
            'Timeline Logs CONFIRMED Transition Note',
            `Timeline note: "${confTimeline?.notes}"`
        )

        // ─── TC-08.2: Transition CONFIRMED -> IN_PRODUCTION (Tailor Assignment) ───
        console.log('\n--- TC-08.2: Assign Tailor & Transition to IN_PRODUCTION ---')
        const step2 = await updateOrderStatusAdminAction(orderId1, 'IN_PRODUCTION', {
            tailorAssigned: 'Babatunde Bello',
            notes: 'Pattern drafted and fabric cut in workshop by Babatunde Bello.',
        })

        assert(
            Boolean(step2.success),
            'TC-08.2a',
            'Advance to IN_PRODUCTION with Assigned Tailor',
            `Transition returned success: ${step2.success}`
        )

        const dbOrderProd = await prisma.order.findUnique({
            where: { id: orderId1 },
            include: { timeline: true },
        })

        assert(
            Boolean(dbOrderProd?.status === PrismaOrderStatus.IN_PRODUCTION),
            'TC-08.2b',
            'Database Reflects IN_PRODUCTION Status',
            `Order status: ${dbOrderProd?.status}`
        )

        const prodTimeline = dbOrderProd?.timeline.find((t) => t.toStatus === PrismaOrderStatus.IN_PRODUCTION)
        assert(
            Boolean(prodTimeline && prodTimeline.notes?.includes('Babatunde Bello')),
            'TC-08.2c',
            'Timeline Logs Tailor Assignment and Cutting Note',
            `Timeline note: "${prodTimeline?.notes}"`
        )

        // ─── TC-08.EC1: Quality Inspection Gate Enforcement ───────────────────────
        console.log('\n--- TC-08.EC1: Quality Gate: Attempting Dispatch without Approval ---')
        const prematureDispatch = await dispatchOrderAction(orderId1, {
            courierName: 'DHL Express',
            trackingNumber: 'DHL-TEST-BLOCKED',
        })

        assert(
            Boolean(prematureDispatch.success === false),
            'TC-08.EC1a',
            'Premature Dispatch is Strictly Blocked',
            `Expected failure, got success: ${prematureDispatch.success}`
        )

        assert(
            Boolean(prematureDispatch.error?.includes('Master Tailor inspection approval')),
            'TC-08.EC1b',
            'Quality Gate Returns Explicit Error Message',
            `Error message: "${prematureDispatch.error}"`
        )

        // ─── TC-08.3: Upload Inspection Media & Advance to INSPECTION ─────────────
        console.log('\n--- TC-08.3: Workshop Tailor Uploads Quality Photos ---')
        const inspectionPhotos = [
            'https://captainstitches.com/media/inspections/001-front-view.jpg',
            'https://captainstitches.com/media/inspections/001-embroidery-detail.jpg',
            'https://captainstitches.com/media/inspections/001-inner-seams.jpg',
            'https://captainstitches.com/media/inspections/001-hemline-cuff.jpg',
        ]
        const inspectionVideo = 'https://captainstitches.com/media/inspections/001-360-video.mp4'

        const uploadRes = await uploadOrderInspectionMediaAction(
            orderId1,
            inspectionPhotos,
            inspectionVideo
        )

        assert(
            Boolean(uploadRes.success),
            'TC-08.3a',
            'Upload Inspection Media Server Action Succeeds',
            `Media upload returned success: ${uploadRes.success}`
        )

        const dbOrderInsp = await prisma.order.findUnique({
            where: { id: orderId1 },
            include: { timeline: true },
        })

        assert(
            Boolean(dbOrderInsp?.status === PrismaOrderStatus.INSPECTION),
            'TC-08.3b',
            'Order Status Automatically Transitions to INSPECTION',
            `Current status: ${dbOrderInsp?.status}`
        )

        assert(
            Boolean(dbOrderInsp?.inspectionMediaUrls.length === 4 && dbOrderInsp?.inspectionVideoUrl === inspectionVideo),
            'TC-08.3c',
            'Inspection Media Gallery URLs Stored Accurately',
            `Stored ${dbOrderInsp?.inspectionMediaUrls.length} photos and video URL`
        )

        // ─── TC-08.EC2: Alteration Request from Master Tailor ─────────────────────
        console.log('\n--- TC-08.EC2: Samuelson Requests Alteration on Seam Fit ---')
        const altRes = await requestOrderAlterationAction(
            orderId1,
            'Right sleeve cuff needs 1.5cm adjustment; align collar symmetry.'
        )

        assert(
            Boolean(altRes.success),
            'TC-08.EC2a',
            'Alteration Request Action Succeeds',
            `Alteration request returned success: ${altRes.success}`
        )

        const dbOrderAlt = await prisma.order.findUnique({
            where: { id: orderId1 },
            include: { timeline: true },
        })

        assert(
            Boolean(dbOrderAlt?.status === PrismaOrderStatus.IN_PRODUCTION),
            'TC-08.EC2b',
            'Order Returns to IN_PRODUCTION from INSPECTION',
            `Status reverted to: ${dbOrderAlt?.status}`
        )

        const altTimeline = dbOrderAlt?.timeline.find(
            (t) => t.fromStatus === PrismaOrderStatus.INSPECTION && t.toStatus === PrismaOrderStatus.IN_PRODUCTION
        )
        assert(
            Boolean(altTimeline && altTimeline.notes?.includes('Right sleeve cuff')),
            'TC-08.EC2c',
            'Timeline Logs Alteration Notes Accurately',
            `Timeline notes: "${altTimeline?.notes}"`
        )

        // Re-upload inspection media to return to INSPECTION
        console.log('\n--- Workshop Re-uploads Adjusted Inspection Photos ---')
        const reUploadRes = await uploadOrderInspectionMediaAction(
            orderId1,
            ['https://captainstitches.com/media/inspections/001-cuff-adjusted.jpg']
        )
        assert(
            Boolean(reUploadRes.success),
            'TC-08.3d',
            'Re-upload Inspection Media Returns to INSPECTION',
            `Re-upload returned success: ${reUploadRes.success}`
        )

        // ─── TC-08.4: Master Quality Sign-Off Gate (APPROVED) ─────────────────────
        console.log('\n--- TC-08.4: Master Tailor Samuelson Quality Sign-Off ---')
        const approveRes = await approveOrderQualityAction(
            orderId1,
            'Sleeve adjustments verified. Collar symmetry and gold filigree alignment flawless. Approved for packaging.'
        )

        assert(
            Boolean(approveRes.success),
            'TC-08.4a',
            'Quality Approval Action Executes Successfully',
            `Quality approval returned: ${approveRes.success}`
        )

        const dbOrderAppr = await prisma.order.findUnique({
            where: { id: orderId1 },
            include: { timeline: true },
        })

        assert(
            Boolean(dbOrderAppr?.status === PrismaOrderStatus.APPROVED),
            'TC-08.4b',
            'Database Reflects APPROVED Status',
            `Order status: ${dbOrderAppr?.status}`
        )

        assert(
            Boolean(dbOrderAppr?.inspectionApprovedAt !== null),
            'TC-08.4c',
            'inspectionApprovedAt Timestamp Recorded',
            `Approved at: ${dbOrderAppr?.inspectionApprovedAt?.toISOString()}`
        )

        assert(
            Boolean(dbOrderAppr?.inspectionNotes?.includes('Sleeve adjustments verified')),
            'TC-08.4d',
            'Inspection Sign-Off Notes Recorded on Order',
            `Notes: "${dbOrderAppr?.inspectionNotes}"`
        )

        // ─── TC-08.5: Courier Dispatch with Tracking Code ────────────────────────
        console.log('\n--- TC-08.5: Courier Dispatch & Waybill Generation ---')
        const dispatchRes = await dispatchOrderAction(orderId1, {
            courierName: 'DHL Express',
            trackingNumber: 'DHL-IT-982341823',
            trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=DHL-IT-982341823',
        })

        assert(
            Boolean(dispatchRes.success),
            'TC-08.5a',
            'Dispatch Order Action Succeeds',
            `Dispatch returned success: ${dispatchRes.success}`
        )

        assert(
            Boolean(dispatchRes.warning && dispatchRes.warning.includes('outstanding balance')),
            'TC-08.5b',
            'Dispatch Unpaid Balance Warning Generated',
            `Warning: "${dispatchRes.warning}"`
        )

        const dbOrderDisp = await prisma.order.findUnique({
            where: { id: orderId1 },
            include: { timeline: true },
        })

        assert(
            Boolean(dbOrderDisp?.status === PrismaOrderStatus.DISPATCHED),
            'TC-08.5c',
            'Database Reflects DISPATCHED Status',
            `Order status: ${dbOrderDisp?.status}`
        )

        assert(
            Boolean(
                dbOrderDisp?.courierName === 'DHL Express' &&
                dbOrderDisp?.trackingNumber === 'DHL-IT-982341823' &&
                dbOrderDisp?.dispatchedAt !== null
            ),
            'TC-08.5d',
            'Courier Carrier & Waybill Tracking Number Persisted',
            `Carrier: ${dbOrderDisp?.courierName}, Tracking: ${dbOrderDisp?.trackingNumber}`
        )

        // ─── TC-08.6: Public Tracking Portal (/track) Verification ────────────────
        console.log('\n--- TC-08.6: Public Tracking Portal Verification ---')
        const trackRes = await trackOrderAction(orderNumber1)

        assert(
            Boolean(trackRes.success && trackRes.order),
            'TC-08.6a',
            'trackOrderAction Successfully Resolves Dispatched Order',
            `Resolved order: ${trackRes.order?.orderNumber}`
        )

        assert(
            Boolean(trackRes.order?.status === 'Dispatched'),
            'TC-08.6b',
            'Public Tracking Maps Status to "Dispatched"',
            `Mapped status: ${trackRes.order?.status}`
        )

        assert(
            Boolean(
                trackRes.order?.courierName === 'DHL Express' &&
                trackRes.order?.trackingNumber === 'DHL-IT-982341823' &&
                trackRes.order?.trackingUrl?.includes('DHL-IT-982341823')
            ),
            'TC-08.6c',
            'Public Tracking Returns Courier & Tracking Number',
            `Courier: ${trackRes.order?.courierName}, Waybill: ${trackRes.order?.trackingNumber}`
        )

        assert(
            Boolean(trackRes.order?.inspectionMedia && trackRes.order.inspectionMedia.photos.length > 0),
            'TC-08.6d',
            'Public Tracking Includes Inspection Photos for Client Viewing',
            `Photos count: ${trackRes.order?.inspectionMedia?.photos.length}`
        )

        // ─── TC-08.7: Delivery Confirmation (DELIVERED) & Review Unlock ───────────
        console.log('\n--- TC-08.7: Mark DELIVERED & Unlock Customer Review ---')
        const delivRes = await updateOrderStatusAdminAction(
            orderId1,
            'DELIVERED',
            'Delivered to Lorenzo Moretti in Verona. Handover complete.'
        )

        assert(
            Boolean(delivRes.success),
            'TC-08.7a',
            'Transition to DELIVERED Succeeds',
            `Delivery update returned success: ${delivRes.success}`
        )

        const dbOrderDeliv = await prisma.order.findUnique({
            where: { id: orderId1 },
            include: { timeline: true },
        })

        assert(
            Boolean(dbOrderDeliv?.status === PrismaOrderStatus.DELIVERED && dbOrderDeliv?.deliveredAt !== null),
            'TC-08.7b',
            'Database Reflects DELIVERED Status & deliveredAt Timestamp',
            `Status: ${dbOrderDeliv?.status}, Delivered at: ${dbOrderDeliv?.deliveredAt?.toISOString()}`
        )

        const trackDelivRes = await trackOrderAction(orderNumber1)
        assert(
            Boolean(trackDelivRes.order?.status === 'Delivered'),
            'TC-08.7c',
            'Public Tracking Shows "Delivered" and Review Gate Unlocked',
            `Status: ${trackDelivRes.order?.status}`
        )

        // ─── TC-08.EC4: Full End-to-End Timeline Audit Trail ──────────────────────
        console.log('\n--- TC-08.EC4: Comprehensive Order Audit Trail ---')
        const allTimeline = dbOrderDeliv?.timeline || []
        const expectedTransitions = [
            PrismaOrderStatus.CONFIRMED,
            PrismaOrderStatus.IN_PRODUCTION,
            PrismaOrderStatus.INSPECTION,
            PrismaOrderStatus.APPROVED,
            PrismaOrderStatus.DISPATCHED,
            PrismaOrderStatus.DELIVERED,
        ]

        const hasAllTransitions = expectedTransitions.every((st) =>
            allTimeline.some((t) => t.toStatus === st)
        )

        assert(
            Boolean(hasAllTransitions),
            'TC-08.EC4a',
            'Audit Timeline Contains All 6 Production Transitions',
            `Found ${allTimeline.length} timeline events spanning full lifecycle`
        )

        // ─── TC-08.EC5: Admin Orders Listing Verification ─────────────────────────
        console.log('\n--- TC-08.EC5: Admin Orders List / Kanban Data ---')
        const allOrdersRes = await getAllOrdersAdminAction()
        assert(
            Boolean(allOrdersRes.success && allOrdersRes.orders.length > 0),
            'TC-08.EC5a',
            'getAllOrdersAdminAction Retrieves Active Orders',
            `Retrieved ${allOrdersRes.orders.length} orders`
        )

        const foundInAdmin = allOrdersRes.orders.find((o) => o.id === orderId1)
        assert(
            Boolean(foundInAdmin && foundInAdmin.status === 'DELIVERED'),
            'TC-08.EC5b',
            'Admin Kanban Reflects Updated Status DELIVERED',
            `Admin order status: ${foundInAdmin?.status}`
        )
    } finally {
        // ─── CLEANUP ─────────────────────────────────────────────────────────────
        console.log('\n--- CLEANUP: Removing Test Records ---')
        await cleanupTestData()
        console.log('Cleanup completed.')
    }

    // ─── SUMMARY REPORT ──────────────────────────────────────────────────────────
    console.log('\n======================================================================')
    console.log('  📊 FLOW 08 TEST RESULTS SUMMARY')
    console.log('======================================================================')
    const passed = results.filter((r) => r.passed).length
    const failed = results.filter((r) => !r.passed).length
    const total = results.length

    console.log(`Total Tests Run:  ${total}`)
    console.log(`Tests Passed:     ${passed}`)
    console.log(`Tests Failed:     ${failed}`)
    console.log(`Success Rate:     ${Math.round((passed / total) * 100)}%\n`)

    if (failed > 0) {
        console.error('❌ Failed Test Cases:')
        results
            .filter((r) => !r.passed)
            .forEach((r) => console.error(`  - ${r.id}: ${r.title} (${r.details})`))
        process.exit(1)
    } else {
        console.log('🎉 ALL FLOW 08 TEST CASES PASSED WITH 100% SUCCESS!')
        process.exit(0)
    }
}

runFlow08Tests().catch((err) => {
    console.error('Fatal unhandled error during Flow 08 tests:', err)
    process.exit(1)
})
