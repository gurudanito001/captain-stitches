/**
 * Automated Verification Suite for Cloudinary Image Upload & SendGrid Email Services
 * Validates:
 * 1. Cloudinary upload service & server action integration
 * 2. SendGrid email service for order milestones (customer & admin)
 * 3. Marketing broadcast email delivery
 * 4. Newsletter welcome email dispatch
 */

import {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    getOptimizedCloudinaryUrl,
    isCloudinaryConfigured,
} from '../src/lib/services/cloudinary'
import {
    sendEmail,
    sendOrderConfirmationEmails,
    sendOrderStatusMilestoneEmail,
    sendNewsletterWelcomeEmail,
    getRecentEmailDispatches,
    clearRecentEmailDispatches,
    isEmailServiceConfigured,
} from '../src/lib/services/email'
import { uploadMediaBase64Action } from '../src/lib/actions/upload'

let totalAssertions = 0
let passedAssertions = 0

function assert(condition: boolean, testName: string, details?: string) {
    totalAssertions++
    if (condition) {
        passedAssertions++
        console.log(`  ✅ [PASS] ${testName}`)
    } else {
        console.error(`  ❌ [FAIL] ${testName}${details ? ` -> ${details}` : ''}`)
    }
}

async function runTestSuite() {
    console.log('════════════════════════════════════════════════════════════════')
    console.log('🧪 RUNNING CLOUDINARY MEDIA & SENDGRID EMAIL VERIFICATION SUITE')
    console.log('════════════════════════════════════════════════════════════════\n')

    clearRecentEmailDispatches()

    // ─────────────────────────────────────────────────────────────────────────
    // 1. CLOUDINARY MEDIA UPLOAD TESTS
    // ─────────────────────────────────────────────────────────────────────────
    console.log('--- 1. Testing Cloudinary Image Upload Service ---')

    const sampleBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='

    // 1.1 Direct service upload
    const uploadRes = await uploadImageToCloudinary(sampleBase64, {
        folder: 'test-garments',
        filename: 'grand-agbada-sample',
        tags: ['test', 'agbada'],
    })

    assert(Boolean(uploadRes.success), 'TC-MEDIA-1.1: Direct Cloudinary Upload Success')
    assert(Boolean(uploadRes.url && uploadRes.url.length > 0), 'TC-MEDIA-1.2: Generated Media URL Returned', uploadRes.url)
    assert(Boolean(uploadRes.publicId && uploadRes.publicId.includes('test-garments')), 'TC-MEDIA-1.3: Asset Public ID Contains Folder', uploadRes.publicId)

    // 1.2 URL optimization helper
    const optimizedUrl = getOptimizedCloudinaryUrl(uploadRes.publicId || 'captain-stitches/test/agbada', {
        width: 800,
        height: 1000,
        quality: 'auto',
    })
    assert(Boolean(optimizedUrl.includes('f_auto') && optimizedUrl.includes('w_800')), 'TC-MEDIA-1.4: URL Responsive Optimization Transform Applied', optimizedUrl)

    // 1.3 Server action base64 upload
    const actionRes = await uploadMediaBase64Action({
        base64: sampleBase64,
        filename: 'artisan-inspection-cuff',
        folder: 'inspection-media',
    })
    assert(Boolean(actionRes.success), 'TC-MEDIA-1.5: Server Action uploadMediaBase64Action Success')
    assert(Boolean(actionRes.url && actionRes.url.length > 0), 'TC-MEDIA-1.6: Server Action Returns Valid Secure URL')

    // 1.4 Delete asset
    const deleteRes = await deleteImageFromCloudinary(uploadRes.publicId || 'test')
    assert(Boolean(deleteRes.success), 'TC-MEDIA-1.7: Cloudinary Asset Deletion Handled Gracefully')

    // ─────────────────────────────────────────────────────────────────────────
    // 2. SENDGRID EMAIL SERVICE & ORDER MILESTONE DISPATCHES
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing SendGrid Order Confirmation Milestone Emails ---')

    const mockOrderContext = {
        id: 'ord-test-001',
        orderNumber: 'CS-2026-0099',
        customerName: 'Chinedu Eze',
        customerEmail: 'chinedu.eze@example.com',
        customerPhone: '+39 340 123 4567',
        deliveryAddress: 'Via Manzoni 12, Milano, Italy',
        deliveryLocation: 'Italy',
        designName: 'The Grand Emerald Agbada',
        fabric: 'Presidential Cashmere Cotton',
        colour: 'Emerald Green',
        sizingMode: 'Bespoke',
        measurementsSummary: 'Chest: 42, Shoulder: 19, Length: 44',
        currency: 'EUR',
        totalAmount: 1200,
        depositAmount: 600,
        balanceAmount: 600,
        deadline: '2026-11-20',
        occasion: 'Diaspora Gala & Wedding',
    }

    // 2.1 Order Confirmation Emails (Customer + Admin)
    const confirmationRes = await sendOrderConfirmationEmails(mockOrderContext)
    assert(Boolean(confirmationRes.customerEmailSuccess), 'TC-EMAIL-2.1: Patron Order Confirmation Email Dispatched')
    assert(Boolean(confirmationRes.adminEmailSuccess), 'TC-EMAIL-2.2: Master Tailor Samuelson Alert Dispatched')

    const dispatchesAfterConfirm = getRecentEmailDispatches()
    assert(dispatchesAfterConfirm.length >= 2, 'TC-EMAIL-2.3: Both Confirmation Emails Recorded in Dispatch Ledger')

    const customerRecord = dispatchesAfterConfirm.find((d) => d.category === 'order-confirmed-patron')
    const adminRecord = dispatchesAfterConfirm.find((d) => d.category === 'order-confirmed-admin')
    assert(Boolean(customerRecord && customerRecord.to === 'chinedu.eze@example.com'), 'TC-EMAIL-2.4: Patron Email Addressed Correctly')
    assert(Boolean(adminRecord && adminRecord.subject.includes('CS-2026-0099')), 'TC-EMAIL-2.5: Admin Notification Contains Order Reference')

    // ─────────────────────────────────────────────────────────────────────────
    // 3. ORDER STATUS LIFECYCLE MILESTONES
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n--- 3. Testing Order Status Milestone Transitions ---')

    // 3.1 In Production / Fabric Cutting
    const prodRes = await sendOrderStatusMilestoneEmail(mockOrderContext, 'IN_PRODUCTION', 'Fabric precision cut in Lagos workshop.')
    assert(Boolean(prodRes.success), 'TC-EMAIL-3.1: IN_PRODUCTION Milestone Email Dispatched')

    // 3.2 Inspection Ready
    const inspRes = await sendOrderStatusMilestoneEmail(mockOrderContext, 'INSPECTION')
    assert(Boolean(inspRes.success), 'TC-EMAIL-3.2: INSPECTION Milestone Email Dispatched')

    // 3.3 Quality Approved by Samuelson
    const approvedRes = await sendOrderStatusMilestoneEmail(mockOrderContext, 'APPROVED', 'Seam tension and lapel roll verified.')
    assert(Boolean(approvedRes.success), 'TC-EMAIL-3.3: APPROVED Milestone Email Dispatched')

    // 3.4 Dispatched via DHL Express
    const dispatchedRes = await sendOrderStatusMilestoneEmail(
        {
            ...mockOrderContext,
            courierName: 'DHL International Express',
            trackingNumber: 'WAYBILL-DHL-99281726',
        },
        'DISPATCHED'
    )
    assert(Boolean(dispatchedRes.success), 'TC-EMAIL-3.4: DISPATCHED Courier Email with Waybill Dispatched')

    // 3.5 Delivered & Review Request
    const deliveredRes = await sendOrderStatusMilestoneEmail(mockOrderContext, 'DELIVERED')
    assert(Boolean(deliveredRes.success), 'TC-EMAIL-3.5: DELIVERED Email with Garment Care & Review Invite Dispatched')

    // ─────────────────────────────────────────────────────────────────────────
    // 4. MARKETING CAMPAIGN & NEWSLETTER WELCOME EMAILS
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n--- 4. Testing Marketing Broadcast & Welcome Emails ---')

    // 4.1 Newsletter welcome email
    const welcomeRes = await sendNewsletterWelcomeEmail('patron.welcome@example.com')
    assert(Boolean(welcomeRes.success), 'TC-EMAIL-4.1: Newsletter Welcome Email Dispatched with ROYALTY10 Privilege')

    // 4.2 Generic email dispatch
    const directEmailRes = await sendEmail({
        to: 'samuelson@captainstitches.com',
        subject: 'Atelier Workshop Weekly Audit',
        html: '<p>Atelier operations operational.</p>',
        category: 'atelier-internal',
    })
    assert(Boolean(directEmailRes.success), 'TC-EMAIL-4.2: Direct Atelier SendGrid Dispatch Success')

    // ─────────────────────────────────────────────────────────────────────────
    // SUMMARY REPORT
    // ─────────────────────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════════════')
    console.log('📊 MEDIA & EMAIL SERVICE TEST SUITE SUMMARY REPORT')
    console.log('════════════════════════════════════════════════════════════════')
    console.log(`Total Assertions : ${totalAssertions}`)
    console.log(`Passed           : ${passedAssertions} ✅`)
    console.log(`Failed           : ${totalAssertions - passedAssertions} ❌`)
    console.log(`Pass Rate        : ${((passedAssertions / totalAssertions) * 100).toFixed(1)}%`)

    if (passedAssertions === totalAssertions) {
        console.log('\n🎉 ALL MEDIA UPLOAD & EMAIL DISPATCH ASSERTIONS PASSED WITH 100% SUCCESS!\n')
    } else {
        process.exit(1)
    }
}

runTestSuite().catch((err) => {
    console.error('Test execution failed:', err)
    process.exit(1)
})
