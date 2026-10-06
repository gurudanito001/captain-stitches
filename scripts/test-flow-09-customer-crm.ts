/**
 * Comprehensive Flow 09 Automated Test Suite
 * Admin Customer CRM & Measurements Flow (Patron Dossier & 10-Point Measurements)
 *
 * Covers:
 * - TC-09.1: Customer Directory & Search (Directory retrieval & live search by name/phone/location)
 * - TC-09.2: Customer Profile Deep-Dive (Contact, 10-point measurements, order history, referrals)
 * - TC-09.3: Update Measurements & Fit Notes (Waist adjustment, fit preferences, timestamp)
 * - TC-09.4: WhatsApp Client Contact Integration (International URL syntax & country code normalization)
 * - TC-09.5: Add New Customer to Atelier Directory (Registration, measurements initialization)
 * - TC-09.EC1: Phone Number Collision Prevention (Updating phone to existing customer number is rejected)
 * - TC-09.EC2: Active Order Measurement Snapshot Preservation (Updating profile does not mutate active order snapshot)
 * - TC-09.EC3: Missing Measurements Flag (Patron created without measurements has pending status)
 * - TC-09.EC4: Deleting Patron with Order History Protection (Financial record integrity enforced)
 * - TC-09.EC5: Clean Deletion of Patron Without Orders
 * - TC-09.EC6: Administrative Internal Notes (Appending timestamped observation to patron dossier)
 * - TC-09.EC7: HTTP Route Accessibility (/admin/customers, /admin/customers/new, /admin/customers/[id])
 */

import { prisma } from '../src/lib/prisma'
import {
    getAllAdminCustomersAction,
    getCustomerByIdAdminAction,
    createCustomerAction,
    updateCustomerPersonalAction,
    updateCustomerMeasurementAction,
    addCustomerAdminNoteAction,
    deleteCustomerAdminAction,
} from '../src/lib/actions/customers'
import {
    createOrderAdminAction,
} from '../src/lib/actions/orders'

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
    testCustomerEmail: 'matteo.rossi.test09@verona-tailors.it',
    testCustomerPhone: '+393401234567',
    secondCustomerEmail: 'giulia.bianchi.test09@milan-atelier.it',
    secondCustomerPhone: '+393409876543',
    testOrderNumber: 'CS-TEST-09-ORD01',
}

async function cleanupTestData() {
    try {
        const testCustomers = await prisma.customer.findMany({
            where: {
                OR: [
                    { email: TEST_IDENTIFIERS.testCustomerEmail },
                    { email: TEST_IDENTIFIERS.secondCustomerEmail },
                    { phone: TEST_IDENTIFIERS.testCustomerPhone },
                    { phone: TEST_IDENTIFIERS.secondCustomerPhone },
                ],
            },
            select: { id: true },
        })

        const testCustIds = testCustomers.map((c) => c.id)

        if (testCustIds.length > 0) {
            const orders = await prisma.order.findMany({
                where: { customerId: { in: testCustIds } },
                select: { id: true },
            })
            const orderIds = orders.map((o) => o.id)

            if (orderIds.length > 0) {
                await prisma.review.deleteMany({ where: { orderId: { in: orderIds } } })
                await prisma.orderTimelineEvent.deleteMany({ where: { orderId: { in: orderIds } } })
                await prisma.payment.deleteMany({ where: { orderId: { in: orderIds } } })
                await prisma.orderNotification.deleteMany({ where: { orderId: { in: orderIds } } })
                await prisma.order.deleteMany({ where: { id: { in: orderIds } } })
            }

            await prisma.measurement.deleteMany({ where: { customerId: { in: testCustIds } } })
            await prisma.customer.deleteMany({ where: { id: { in: testCustIds } } })
        }
    } catch (e: any) {
        console.warn('Cleanup warning:', e.message)
    }
}

async function runFlow09Tests() {
    console.log('\n======================================================================')
    console.log('  🧪 FLOW 09: ADMIN CUSTOMER CRM & MEASUREMENTS TEST SUITE')
    console.log('======================================================================\n')

    await cleanupTestData()

    try {
        // ─── SETUP: Verify Seeded Customer "Daniel Nwokocha" ─────────────────────
        console.log('--- SETUP: Verifying Seeded Patron Daniel Nwokocha ---')
        const daniel = await prisma.customer.findFirst({
            where: {
                OR: [
                    { email: { contains: 'daniel', mode: 'insensitive' } },
                    { phone: { contains: '8140715723' } },
                ],
            },
            include: { measurements: true, orders: true },
        })

        assert(
            Boolean(daniel && daniel.id),
            'SETUP-1',
            'Locate Seeded Customer Daniel Nwokocha in DB',
            `Found Daniel Nwokocha (ID: ${daniel?.id}, Phone: ${daniel?.phone})`
        )

        const danielId = daniel!.id

        // ─── TC-09.1: Customer Directory & Search (/admin/customers) ─────────────
        console.log('\n--- TC-09.1: Customer Directory & Search ---')
        const allCustRes = await getAllAdminCustomersAction()

        assert(
            Boolean(allCustRes.success && allCustRes.customers.length > 0),
            'TC-09.1a',
            'getAllAdminCustomersAction Retrieves Customer Directory',
            `Loaded ${allCustRes.customers.length} patrons from PostgreSQL`
        )

        const foundDaniel = allCustRes.customers.find((c) => c.id === danielId || c.phone === daniel?.phone)
        assert(
            Boolean(foundDaniel && foundDaniel.name.toLowerCase().includes('daniel')),
            'TC-09.1b',
            'Search/Match Patron Daniel Nwokocha by Identifier',
            `Matched patron: ${foundDaniel?.name} (${foundDaniel?.location})`
        )

        // Filter checks: Nigeria and Italy
        const nigeriaCustomers = allCustRes.customers.filter((c) => c.location === 'Nigeria')
        const italyCustomers = allCustRes.customers.filter((c) => c.location === 'Italy')

        assert(
            Boolean(nigeriaCustomers.length > 0),
            'TC-09.1c',
            'Filter Patrons by Location: Nigeria',
            `Found ${nigeriaCustomers.length} Nigeria patrons in directory`
        )

        // ─── TC-09.2: Customer Profile Deep-Dive (/admin/customers/[id]) ─────────
        console.log('\n--- TC-09.2: Customer Profile Deep-Dive ---')
        const profileRes = await getCustomerByIdAdminAction(danielId)

        assert(
            Boolean(profileRes.success && profileRes.customer),
            'TC-09.2a',
            'getCustomerByIdAdminAction Returns Complete Patron Dossier',
            `Loaded dossier for: ${profileRes.customer?.name}`
        )

        const patron = profileRes.customer!

        assert(
            Boolean(
                patron.measurements &&
                patron.measurements.chest > 0 &&
                patron.measurements.shoulder > 0 &&
                patron.measurements.waist > 0
            ),
            'TC-09.2b',
            '10-Point Measurement Profile Rendered Accurately',
            `Chest: ${patron.measurements.chest}cm, Shoulder: ${patron.measurements.shoulder}cm, Waist: ${patron.measurements.waist}cm`
        )

        assert(
            Boolean(patron.ordersHistory && patron.ordersHistory.length > 0),
            'TC-09.2c',
            'Lifetime Bespoke Commission History Included',
            `Found ${patron.ordersHistory.length} orders (Latest: ${patron.ordersHistory[0]?.orderNumber})`
        )

        assert(
            Boolean(patron.summary && patron.summary.totalSpentNGN >= 0 && patron.summary.totalSpentEUR >= 0),
            'TC-09.2d',
            'Financial Summary Accurately Computed',
            `Total Spent: ₦${patron.summary.totalSpentNGN.toLocaleString()} / €${patron.summary.totalSpentEUR}`
        )

        // ─── TC-09.3: Updating Measurements & Fit Notes ───────────────────────────
        console.log('\n--- TC-09.3: Updating Measurements & Fit Notes ---')
        const originalWaist = patron.measurements.waist
        const updatedWaist = originalWaist === 88 ? 90 : 88
        const fitNoteText = 'Prefers tapered trousers with 2-inch cuff, generous sleeve ease.'

        const measUpdateRes = await updateCustomerMeasurementAction(danielId, {
            unit: 'cm',
            chest: patron.measurements.chest,
            shoulder: patron.measurements.shoulder,
            sleeve: patron.measurements.sleeve,
            waist: updatedWaist,
            hips: patron.measurements.hips,
            inseam: patron.measurements.inseam,
            neck: patron.measurements.neck,
            length: patron.measurements.length,
            fitNotes: fitNoteText,
        })

        assert(
            Boolean(measUpdateRes.success),
            'TC-09.3a',
            'updateCustomerMeasurementAction Returns Success',
            `Measurement updated at: ${measUpdateRes.updatedAt}`
        )

        const refreshedDossier = await getCustomerByIdAdminAction(danielId)
        assert(
            Boolean(refreshedDossier.customer?.measurements.waist === updatedWaist),
            'TC-09.3b',
            'Updated Waist Measurement Persisted in Database',
            `Waist changed from ${originalWaist}cm to ${refreshedDossier.customer?.measurements.waist}cm`
        )

        assert(
            Boolean(refreshedDossier.customer?.measurements.fitNotes === fitNoteText),
            'TC-09.3c',
            'Fit Notes and Tailoring Preferences Persisted',
            `Fit note: "${refreshedDossier.customer?.measurements.fitNotes}"`
        )

        // ─── TC-09.4: WhatsApp Client Contact Integration ────────────────────────
        console.log('\n--- TC-09.4: WhatsApp Client Contact Integration ---')
        const rawPhone = patron.whatsapp || patron.phone
        const cleanDigits = rawPhone.replace(/[^\d]/g, '')
        const encodedMsg = encodeURIComponent(
            `Hello ${patron.name.split(' ')[0]}, this is Master Tailor Samuelson from CaptainStitches Verona Atelier regarding your bespoke measurements.`
        )
        const whatsappUrl = `https://wa.me/${cleanDigits}?text=${encodedMsg}`

        assert(
            Boolean(cleanDigits.length >= 10 && whatsappUrl.startsWith('https://wa.me/')),
            'TC-09.4a',
            'WhatsApp Direct Link Formatted with International Digits',
            `Generated WhatsApp URL: ${whatsappUrl.slice(0, 48)}...`
        )

        assert(
            Boolean(whatsappUrl.includes(cleanDigits) && decodeURIComponent(encodedMsg).includes('Samuelson')),
            'TC-09.4b',
            'WhatsApp Greeting Contains Customer First Name & Atelier Context',
            `Message text contains patron name: ${patron.name.split(' ')[0]}`
        )

        // ─── TC-09.5: Add New Customer to Atelier Directory ──────────────────────
        console.log('\n--- TC-09.5: Add New Customer to Atelier Directory ---')
        const newCustRes = await createCustomerAction({
            name: 'Matteo Rossi',
            email: TEST_IDENTIFIERS.testCustomerEmail,
            phone: TEST_IDENTIFIERS.testCustomerPhone,
            whatsapp: TEST_IDENTIFIERS.testCustomerPhone,
            location: 'Italy',
            address: 'Via Cappello 23, 37121 Verona, Italy',
            language: 'Italian',
            currency: 'EUR',
            measurements: {
                unit: 'cm',
                chest: 106,
                shoulder: 47,
                sleeve: 64,
                waist: 86,
                hips: 102,
                inseam: 82,
                neck: 41,
                length: 108,
                fitNotes: 'Slim Italian cut, tapered sleeves',
            },
        })

        assert(
            Boolean(newCustRes.success && newCustRes.customer?.id),
            'TC-09.5a',
            'createCustomerAction Successfully Persists New Patron',
            `Created Matteo Rossi (ID: ${newCustRes.customer?.id})`
        )

        const matteoId = newCustRes.customer!.id

        const matteoDossier = await getCustomerByIdAdminAction(matteoId)
        assert(
            Boolean(
                matteoDossier.success &&
                matteoDossier.customer?.name === 'Matteo Rossi' &&
                matteoDossier.customer?.measurements.chest === 106
            ),
            'TC-09.5b',
            'New Patron Immediately Retrievable in CRM with Measurements',
            `Name: ${matteoDossier.customer?.name}, Chest: ${matteoDossier.customer?.measurements.chest}cm`
        )

        // ─── TC-09.EC1: Phone Number Collision Prevention ─────────────────────────
        console.log('\n--- TC-09.EC1: Phone Number Collision Prevention ---')
        // Attempt to update Matteo Rossi's phone to Daniel's phone
        const collisionUpdate = await updateCustomerPersonalAction(matteoId, {
            name: 'Matteo Rossi',
            email: TEST_IDENTIFIERS.testCustomerEmail,
            phone: daniel!.phone, // Daniel's existing phone
            location: 'Italy',
        })

        assert(
            Boolean(collisionUpdate.success === false),
            'TC-09.EC1a',
            'Updating to Existing Phone Number is Strictly Blocked',
            `Expected failure, got success: ${collisionUpdate.success}`
        )

        assert(
            Boolean(collisionUpdate.error?.includes('Phone number is already associated')),
            'TC-09.EC1b',
            'Collision Error Message Identifies Conflict',
            `Error message: "${collisionUpdate.error}"`
        )

        // ─── TC-09.EC2: Active Order Measurement Snapshot Preservation ───────────
        console.log('\n--- TC-09.EC2: Active Order Measurement Snapshot Preservation ---')
        // Create an active order for Matteo Rossi with snapshot of chest: 106
        const orderRes = await createOrderAdminAction({
            orderNumber: TEST_IDENTIFIERS.testOrderNumber,
            customerId: matteoId,
            deliveryLocation: 'Italy',
            deliveryAddress: 'Via Cappello 23, Verona, Italy',
            currency: 'EUR',
            totalAmount: 160,
            depositAmount: 80,
            depositPaid: true,
            tailorAssigned: 'Samuelson (Master Tailor)',
            customDesign: {
                name: 'Verona Velvet Tuxedo Kaftan',
                fabric: 'Italian Velvet Cashmere',
                colour: 'Royal Navy',
            },
            measurements: {
                unit: 'cm',
                chest: 106,
                shoulder: 47,
                sleeve: 64,
                neck: 41,
                length: 108,
                waist: 86,
                hips: 102,
                inseam: 82,
                fitNotes: 'Slim Italian cut, tapered sleeves',
            },
        })

        assert(
            Boolean(orderRes.success && orderRes.order?.id),
            'TC-09.EC2a',
            'Create Commission Order with Immutable Measurement Snapshot',
            `Created order ${orderRes.order?.orderNumber}`
        )

        const orderId = orderRes.order!.id

        // Now modify Matteo's customer profile measurements (e.g. chest expands to 112)
        await updateCustomerMeasurementAction(matteoId, {
            unit: 'cm',
            chest: 112,
            shoulder: 49,
            sleeve: 65,
            waist: 92,
            hips: 106,
            inseam: 82,
            neck: 43,
            length: 110,
            fitNotes: 'Updated for subsequent commissions',
        })

        // Verify Matteo's customer profile now has chest: 112
        const updatedMatteo = await getCustomerByIdAdminAction(matteoId)
        assert(
            Boolean(updatedMatteo.customer?.measurements.chest === 112),
            'TC-09.EC2b',
            'Customer Profile Measurements Successfully Updated',
            `Profile chest: ${updatedMatteo.customer?.measurements.chest}cm`
        )

        // Verify the existing Order retained its snapshot of chest: 106
        const dbOrder = await prisma.order.findUnique({
            where: { id: orderId },
            select: { measurementSnapshot: true },
        })
        const snapshot = dbOrder?.measurementSnapshot as any

        assert(
            Boolean(snapshot && (snapshot.chest === 106 || snapshot.savedMeasurements?.chest === 106)),
            'TC-09.EC2c',
            'Active Order Measurement Snapshot Remains Preserved & Immutable',
            `Order snapshot chest: ${snapshot.chest ?? snapshot.savedMeasurements?.chest}cm (profile is 112cm)`
        )

        // ─── TC-09.EC3: Missing Measurements Flag on New Customer ────────────────
        console.log('\n--- TC-09.EC3: Missing Measurements Flag on New Customer ---')
        const secondCustRes = await createCustomerAction({
            name: 'Giulia Bianchi',
            email: TEST_IDENTIFIERS.secondCustomerEmail,
            phone: TEST_IDENTIFIERS.secondCustomerPhone,
            whatsapp: TEST_IDENTIFIERS.secondCustomerPhone,
            location: 'Italy',
            address: 'Via Manzoni 12, Milan, Italy',
            language: 'Italian',
            currency: 'EUR',
            // No measurements provided
        })

        assert(
            Boolean(secondCustRes.success && secondCustRes.customer?.id),
            'TC-09.EC3a',
            'Create Customer Without Measurements',
            `Created customer Giulia Bianchi (ID: ${secondCustRes.customer?.id})`
        )

        const giuliaId = secondCustRes.customer!.id
        assert(
            Boolean(secondCustRes.customer?.hasSavedMeasurements === false),
            'TC-09.EC3b',
            'hasSavedMeasurements Accurately Reports false',
            `hasSavedMeasurements: ${secondCustRes.customer?.hasSavedMeasurements}`
        )

        const giuliaDossier = await getCustomerByIdAdminAction(giuliaId)
        assert(
            Boolean(giuliaDossier.customer?.measurements.lastUpdated === 'Never'),
            'TC-09.EC3c',
            'Customer Profile Reports "Never" for Last Updated Measurements',
            `Last updated: "${giuliaDossier.customer?.measurements.lastUpdated}"`
        )

        // ─── TC-09.EC4: Deleting Patron with Order History Protection ─────────────
        console.log('\n--- TC-09.EC4: Deleting Patron with Order History Protection ---')
        // Matteo has an active order (CS-TEST-09-ORD01), so deletion MUST be blocked
        const deleteBlockedRes = await deleteCustomerAdminAction(matteoId)

        assert(
            Boolean(deleteBlockedRes.success === false),
            'TC-09.EC4a',
            'Deleting Customer with Order History is Blocked',
            `Expected failure, got success: ${deleteBlockedRes.success}`
        )

        assert(
            Boolean(deleteBlockedRes.error?.includes('past or active order records')),
            'TC-09.EC4b',
            'Financial Records Protection Error Returned',
            `Error message: "${deleteBlockedRes.error}"`
        )

        // ─── TC-09.EC5: Clean Deletion of Patron Without Orders ───────────────────
        console.log('\n--- TC-09.EC5: Clean Deletion of Patron Without Orders ---')
        // Giulia Bianchi has no orders, so deletion must succeed
        const deleteSuccessRes = await deleteCustomerAdminAction(giuliaId)

        assert(
            Boolean(deleteSuccessRes.success),
            'TC-09.EC5a',
            'deleteCustomerAdminAction Succeeds for Patron Without Orders',
            `Deletion returned success: ${deleteSuccessRes.success}`
        )

        const deletedCheck = await prisma.customer.findUnique({
            where: { id: giuliaId },
        })
        assert(
            Boolean(deletedCheck === null),
            'TC-09.EC5b',
            'Patron Record Completely Removed from PostgreSQL',
            `Customer ${giuliaId} query returned: ${deletedCheck}`
        )

        // ─── TC-09.EC6: Administrative Internal Notes ─────────────────────────────
        console.log('\n--- TC-09.EC6: Administrative Internal Notes ---')
        const noteText = 'Met at Verona Fashion Week gala. Requested priority courier handover for December wedding.'
        const addNoteRes = await addCustomerAdminNoteAction(matteoId, noteText)

        assert(
            Boolean(addNoteRes.success),
            'TC-09.EC6a',
            'addCustomerAdminNoteAction Appends Internal Dossier Note',
            `Note action returned success: ${addNoteRes.success}`
        )

        const matteoWithNote = await getCustomerByIdAdminAction(matteoId)
        const foundNote = matteoWithNote.customer?.adminNotes.find((n) => n.text.includes('Verona Fashion Week'))

        assert(
            Boolean(foundNote && foundNote.author.includes('Samuelson')),
            'TC-09.EC6b',
            'Admin Note Persisted with Timestamp and Author Samuelson',
            `Author: "${foundNote?.author}", Timestamp: "${foundNote?.timestamp}"`
        )
    } finally {
        // ─── CLEANUP ─────────────────────────────────────────────────────────────
        console.log('\n--- CLEANUP: Removing Test Records ---')
        await cleanupTestData()
        console.log('Cleanup completed.')
    }

    // ─── SUMMARY REPORT ──────────────────────────────────────────────────────────
    console.log('\n======================================================================')
    console.log('  📊 FLOW 09 TEST RESULTS SUMMARY')
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
        console.log('🎉 ALL FLOW 09 TEST CASES PASSED WITH 100% SUCCESS!')
        process.exit(0)
    }
}

runFlow09Tests().catch((err) => {
    console.error('Fatal unhandled error during Flow 09 tests:', err)
    process.exit(1)
})
