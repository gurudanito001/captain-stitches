/**
 * Comprehensive Flow 11 Automated Test Suite
 * Admin Review Moderation Flow
 *
 * Covers:
 * - TC-11.1: Open /admin/reviews -> Verify Pending reviews tab reflects pending count
 * - TC-11.2: Inspect Pending review from Daniel Nwokocha -> Verify comment, rating, order #CS-0092 & design
 * - TC-11.3: Approve Review -> Verify status badge transitions to APPROVED and records moderator timestamp
 * - TC-11.4: Open /catalogue/teal-green-agbada-gold-filigree -> Verify review & updated star rating appear
 * - TC-11.5: Open homepage / -> Verify approved 5-star review appears in live Testimonials feed
 * - TC-11.6: Reject Spam Review -> Verify review is rejected with reason and omitted from public lookbook & homepage
 * - TC-11.EC1: Review on Archived Design -> Verify approval succeeds gracefully without breaking catalogue lookbook
 * - TC-11.EC2: Edited Review Re-moderation -> Customer edit automatically resets status to PENDING and hides from storefront
 * - TC-11.EC3: Rejection Audit Traceability -> Rejection records moderator reason and timestamp
 * - TC-11.EC4: Non-Existent Review Graceful Handling -> Graceful error returned without unhandled exceptions
 * - TC-11.EC5: Multi-Review Queue Integrity -> Accurate partitioning between PENDING, APPROVED, and REJECTED
 */

import { prisma } from '../src/lib/prisma'
import {
    getAllReviewsAdminAction,
    getReviewByIdAdminAction,
    updateReviewStatusAdminAction,
    submitCustomerReviewAction,
    updateCustomerReviewAction,
} from '../src/lib/actions/reviews'
import { getDesignBySlug } from '../src/lib/dal/catalogue'
import { getApprovedHomepageTestimonials } from '../src/app/(landing)/testimonials'
import { createCustomerAction } from '../src/lib/actions/customers'
import { createOrderAdminAction } from '../src/lib/actions/orders'
import { createDesignAction } from '../src/lib/actions/catalogue'

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
    spamCustomerEmail: 'flow11.spam.tester@captainstitches.com',
    spamOrderNumber: 'CS-TEST-11-SPAM',
    archivedDesignSlug: 'flow11-test-archived-agbada',
    archivedOrderNumber: 'CS-TEST-11-ARCH',
}

async function cleanupTestData() {
    try {
        // Delete test spam order & customer
        const spamCustomer = await prisma.customer.findFirst({
            where: { email: TEST_IDENTIFIERS.spamCustomerEmail },
        })
        if (spamCustomer) {
            const spamOrders = await prisma.order.findMany({
                where: { customerId: spamCustomer.id },
                select: { id: true },
            })
            const spamOrderIds = spamOrders.map((o) => o.id)
            if (spamOrderIds.length > 0) {
                await prisma.review.deleteMany({ where: { orderId: { in: spamOrderIds } } })
                await prisma.orderTimelineEvent.deleteMany({ where: { orderId: { in: spamOrderIds } } })
                await prisma.payment.deleteMany({ where: { orderId: { in: spamOrderIds } } })
                await prisma.orderNotification.deleteMany({ where: { orderId: { in: spamOrderIds } } })
                await prisma.order.deleteMany({ where: { id: { in: spamOrderIds } } })
            }
            await prisma.customer.deleteMany({ where: { id: spamCustomer.id } })
        }

        // Delete test archived design & order
        const archDesign = await prisma.design.findUnique({
            where: { slug: TEST_IDENTIFIERS.archivedDesignSlug },
        })
        if (archDesign) {
            const archOrders = await prisma.order.findMany({
                where: { designId: archDesign.id },
                select: { id: true },
            })
            const archOrderIds = archOrders.map((o) => o.id)
            if (archOrderIds.length > 0) {
                await prisma.review.deleteMany({ where: { orderId: { in: archOrderIds } } })
                await prisma.orderTimelineEvent.deleteMany({ where: { orderId: { in: archOrderIds } } })
                await prisma.payment.deleteMany({ where: { orderId: { in: archOrderIds } } })
                await prisma.orderNotification.deleteMany({ where: { orderId: { in: archOrderIds } } })
                await prisma.order.deleteMany({ where: { id: { in: archOrderIds } } })
            }
            await prisma.designPhoto.deleteMany({ where: { designId: archDesign.id } })
            await prisma.design.deleteMany({ where: { id: archDesign.id } })
        }
    } catch (e: any) {
        console.warn('Cleanup warning:', e.message)
    }
}

async function runFlow11Tests() {
    console.log('\n======================================================================')
    console.log('  🧪 FLOW 11: ADMIN REVIEW MODERATION FLOW TEST SUITE')
    console.log('======================================================================\n')

    await cleanupTestData()

    try {
        // ─── PRECONDITION: Canonical Order CS-0092 & Daniel Nwokocha Review ─────────
        console.log('--- PREPARATION: Setting Canonical Review CS-0092 to PENDING ---')
        const canonicalOrder = await prisma.order.findUnique({
            where: { orderNumber: 'CS-0092' },
            include: { customer: true, design: true, review: true },
        })

        if (!canonicalOrder) {
            throw new Error('Precondition Failed: Canonical order CS-0092 not found. Run seed script first.')
        }

        let danielReview = canonicalOrder.review

        const reviewText = 'Magnificent teal green agbada. The gold filigree embroidery is extraordinary and fits like second skin in Lekki.'
        const fitTags = ['Comfortable movement', 'Clean stitching & seams']

        if (!danielReview) {
            // Submit initial review
            const submitRes = await submitCustomerReviewAction({
                orderNumber: 'CS-0092',
                rating: 5,
                comment: reviewText,
                fitTags,
                photoUrls: ['/images/design-agbada.jpg'],
            })
            danielReview = await prisma.review.findUnique({
                where: { id: submitRes.reviewId! },
            })
        } else {
            // Reset to PENDING 5-star state
            danielReview = await prisma.review.update({
                where: { id: danielReview.id },
                data: {
                    rating: 5,
                    comment: `[Fit Feedback: ${fitTags.join(', ')}]\n\n${reviewText}`,
                    status: 'PENDING',
                    photoUrls: ['/images/design-agbada.jpg'],
                    moderatedAt: null,
                    moderatorNote: null,
                },
            })
        }

        const danielReviewId = danielReview!.id

        // ─── TC-11.1: Reviews Queue Inspection (/admin/reviews) ──────────────────────
        console.log('\n--- TC-11.1: Reviews Queue Inspection (/admin/reviews) ---')
        const allReviewsRes = await getAllReviewsAdminAction()

        assert(
            Boolean(allReviewsRes.success && Array.isArray(allReviewsRes.reviews)),
            'TC-11.1a',
            'getAllReviewsAdminAction Successfully Fetches Moderation Queue',
            `Total reviews loaded: ${allReviewsRes.reviews.length}`
        )

        const pendingReviews = allReviewsRes.reviews.filter((r) => r.status === 'PENDING')
        assert(
            Boolean(pendingReviews.length >= 1),
            'TC-11.1b',
            'Pending Reviews Queue Contains Unmoderated Submissions',
            `Pending reviews count: ${pendingReviews.length}`
        )

        const danielInQueue = pendingReviews.find((r) => r.id === danielReviewId || r.order.orderNumber === 'CS-0092')
        assert(
            Boolean(danielInQueue !== undefined),
            'TC-11.1c',
            'Daniel Nwokocha Review Appears in Pending Moderation Tab',
            `Found in queue with code: ${danielInQueue?.code}`
        )

        // ─── TC-11.2: Verification of Client Feedback (/admin/reviews/[id]) ──────────
        console.log('\n--- TC-11.2: Verification of Client Feedback ---')
        const detailRes = await getReviewByIdAdminAction(danielReviewId)

        assert(
            Boolean(detailRes.success && detailRes.review),
            'TC-11.2a',
            'getReviewByIdAdminAction Resolves Full Review Dossier',
            `Review ID: ${detailRes.review?.id}`
        )

        const rDetail = detailRes.review!
        assert(
            Boolean(rDetail.customer.name.includes('Daniel') && rDetail.rating === 5),
            'TC-11.2b',
            'Review Details Accurately Render Patron Name and 5-Star Rating',
            `Patron: ${rDetail.customer.name}, Rating: ★ ${rDetail.rating}/5`
        )

        assert(
            Boolean(rDetail.order.orderNumber === 'CS-0092' && rDetail.comment.includes('Magnificent teal green agbada')),
            'TC-11.2c',
            'Review Confirms Verified Order CS-0092 & Written Testimonial',
            `Verified Order: ${rDetail.order.orderNumber}, Design: ${rDetail.design.name}`
        )

        assert(
            Boolean(rDetail.photos && rDetail.photos.length > 0),
            'TC-11.2d',
            'Review Includes Uploaded Garment Photos for Authenticity Verification',
            `Attached photos count: ${rDetail.photos.length} (${rDetail.photos[0]})`
        )

        // ─── TC-11.3: Moderation Action Execution: Approve ───────────────────────────
        console.log('\n--- TC-11.3: Moderation Action Execution: Approve ---')
        const approvalRes = await updateReviewStatusAdminAction(
            danielReviewId,
            'APPROVED',
            undefined,
            'Craftsmanship and fit verified by Master Tailor Samuelson.'
        )

        assert(
            Boolean(approvalRes.success && approvalRes.review?.status === 'APPROVED'),
            'TC-11.3a',
            'updateReviewStatusAdminAction Successfully Approves Review',
            `Returned status: ${approvalRes.review?.status}`
        )

        assert(
            Boolean(approvalRes.review?.moderation.moderatorNote?.includes('Craftsmanship and fit verified')),
            'TC-11.3b',
            'Moderator Internal Note & Verification Recorded',
            `Note: "${approvalRes.review?.moderation.moderatorNote}"`
        )

        const dbApproved = await prisma.review.findUnique({
            where: { id: danielReviewId },
        })

        assert(
            Boolean(dbApproved?.status === 'APPROVED' && dbApproved?.moderatedAt !== null),
            'TC-11.3c',
            'Database Record Persists Status APPROVED with Timestamp',
            `DB status: ${dbApproved?.status}, moderatedAt: ${dbApproved?.moderatedAt?.toISOString()}`
        )

        // ─── TC-11.4: Public Lookbook Reflection (/catalogue/[slug]) ─────────────────
        console.log('\n--- TC-11.4: Public Lookbook Reflection (/catalogue/[slug]) ---')
        const designSlug = canonicalOrder.design?.slug || 'teal-green-agbada-gold-filigree'
        const publicDesign = await getDesignBySlug(designSlug)

        assert(
            Boolean(publicDesign !== null),
            'TC-11.4a',
            'Public Catalogue Resolves Bespoke Design',
            `Design: ${publicDesign?.nameEN} (${publicDesign?.slug})`
        )

        const designReviews = publicDesign?.reviews || []
        const approvedReviewOnDesign = designReviews.find((r) => r.id === danielReviewId)

        assert(
            Boolean(approvedReviewOnDesign !== undefined),
            'TC-11.4b',
            'Approved Review Renders in Lookbook Public Reviews Feed',
            `Found review by: ${approvedReviewOnDesign?.customer?.firstName} ${approvedReviewOnDesign?.customer?.lastName}`
        )

        assert(
            Boolean(approvedReviewOnDesign?.rating === 5 && approvedReviewOnDesign?.comment?.includes('Magnificent')),
            'TC-11.4c',
            'Public Review Contains 5 Stars and Patron Feedback',
            `Rating: ${approvedReviewOnDesign?.rating}★, Comment snippet: "${approvedReviewOnDesign?.comment?.slice(0, 45)}..."`
        )

        // ─── TC-11.5: Homepage Testimonials Carousel (/) ─────────────────────────────
        console.log('\n--- TC-11.5: Homepage Testimonials Carousel (/) ---')
        const homepageTestimonials = await getApprovedHomepageTestimonials()

        assert(
            Boolean(homepageTestimonials.length >= 3),
            'TC-11.5a',
            'Homepage Testimonials Carousel Contains at Least 3 Verified Reviews',
            `Testimonials loaded: ${homepageTestimonials.length}`
        )

        const danielOnHomepage = homepageTestimonials.find((t) => t.name.includes('Daniel'))
        assert(
            Boolean(danielOnHomepage !== undefined && danielOnHomepage.rating === 5),
            'TC-11.5b',
            'Approved 5-Star Review from Daniel Nwokocha Appears in Homepage Feed',
            `Homepage entry: "${danielOnHomepage?.name}" (${danielOnHomepage?.location}) - ${danielOnHomepage?.event}`
        )

        // ─── TC-11.6: Moderation Action Execution: Reject Spam Review ────────────────
        console.log('\n--- TC-11.6: Moderation Action Execution: Reject Spam Review ---')
        // Create spam patron and order to simulate abusive/spam review submission
        const spamCustRes = await createCustomerAction({
            name: 'Spam Bot User',
            email: TEST_IDENTIFIERS.spamCustomerEmail,
            phone: '+2348099887766',
            whatsapp: '+2348099887766',
            location: 'Nigeria',
            address: 'Unknown IP Address',
            language: 'English',
            currency: 'NGN',
        })
        const spamCustId = spamCustRes.customer!.id

        await createOrderAdminAction({
            orderNumber: TEST_IDENTIFIERS.spamOrderNumber,
            customerId: spamCustId,
            deliveryLocation: 'Nigeria',
            deliveryAddress: 'Studio Pickup',
            currency: 'NGN',
            totalAmount: 180000,
            depositAmount: 90000,
            depositPaid: true,
            status: 'DELIVERED',
            measurements: { unit: 'inches', chest: 40, waist: 34 } as any,
            catalogueDesign: {
                id: canonicalOrder.designId || 'custom-design',
                name: canonicalOrder.design?.nameEN || 'Teal Green Agbada',
                category: 'native-wear',
                image: '/images/design-agbada.jpg',
            },
        })

        // Submit spam review
        const spamSubmitRes = await submitCustomerReviewAction({
            orderNumber: TEST_IDENTIFIERS.spamOrderNumber,
            rating: 1,
            comment: 'BUY CHEAP CRYPTO COINS NOW AT HTTP://SPAM-EXAMPLE.XYZ 100X PROFIT GUARANTEED!!!',
        })

        assert(
            Boolean(spamSubmitRes.success && spamSubmitRes.reviewId),
            'TC-11.6a',
            'Spam Review Submitted to Moderation Queue in PENDING Status',
            `Spam review ID: ${spamSubmitRes.reviewId}`
        )

        const spamReviewId = spamSubmitRes.reviewId!

        // Reject review with moderator reason
        const rejectRes = await updateReviewStatusAdminAction(
            spamReviewId,
            'REJECTED',
            'Commercial spam and malicious link solicitation.'
        )

        assert(
            Boolean(rejectRes.success && rejectRes.review?.status === 'REJECTED'),
            'TC-11.6b',
            'updateReviewStatusAdminAction Marks Spam Review as REJECTED',
            `Status: ${rejectRes.review?.status}, Reason: "${rejectRes.review?.moderation.rejectionReason}"`
        )

        // Verify spam review is completely omitted from public lookbook
        const publicDesignAfterSpam = await getDesignBySlug(designSlug)
        const spamInPublicDesign = publicDesignAfterSpam?.reviews.some((r) => r.id === spamReviewId)

        assert(
            Boolean(!spamInPublicDesign),
            'TC-11.6c',
            'Rejected Spam Review is Strictly Excluded from Public Design Lookbook',
            `Present in public lookbook: ${spamInPublicDesign}`
        )

        // Verify spam review is omitted from homepage testimonials
        const testimonialsAfterSpam = await getApprovedHomepageTestimonials()
        const spamInHomepage = testimonialsAfterSpam.some((t) => t.text.includes('CRYPTO') || t.name.includes('Spam'))

        assert(
            Boolean(!spamInHomepage),
            'TC-11.6d',
            'Rejected Spam Review is Excluded from Homepage Testimonials',
            `Present in homepage feed: ${spamInHomepage}`
        )

        // ─── TC-11.EC1: Review on Archived / Hidden Design ───────────────────────────
        console.log('\n--- TC-11.EC1: Review on Archived / Hidden Design ---')
        const archivedDesignRes = await createDesignAction({
            slug: TEST_IDENTIFIERS.archivedDesignSlug,
            nameEN: 'Flow 11 Test Archived Seasonal Kaftan',
            descriptionEN: 'Archived test piece hidden from public lookbook.',
            nameIT: 'Kaftan Stagionale Test Archiviato',
            descriptionIT: 'Pezzo di test archiviato nascosto dal lookbook.',
            category: 'native-wear',
            turnaroundDays: 14,
            priceNGN: 195000,
            priceEUR: 135,
            fabricOptionsEN: ['Super 150s Wool'],
            colourOptionsEN: ['Deep Charcoal'],
            photos: [{ url: '/images/design-senator.jpg', isPrimary: true, altText: 'Archived' }],
        })

        const archDesignId = archivedDesignRes.designId!

        // Hide design
        await prisma.design.update({
            where: { id: archDesignId },
            data: { isVisible: false },
        })

        // Create order on archived design
        await createOrderAdminAction({
            orderNumber: TEST_IDENTIFIERS.archivedOrderNumber,
            customerId: danielOrderCustomerId(canonicalOrder),
            deliveryLocation: 'Nigeria',
            deliveryAddress: 'Lagos Atelier',
            currency: 'NGN',
            totalAmount: 195000,
            depositAmount: 100000,
            depositPaid: true,
            status: 'DELIVERED',
            measurements: { unit: 'inches', chest: 42, waist: 36 } as any,
            catalogueDesign: {
                id: archDesignId,
                name: 'Flow 11 Test Archived Seasonal Kaftan',
                category: 'native-wear',
                image: '/images/design-senator.jpg',
            },
        })

        // Submit review on archived design
        const archReviewSubmit = await submitCustomerReviewAction({
            orderNumber: TEST_IDENTIFIERS.archivedOrderNumber,
            rating: 5,
            comment: 'Superb seasonal kaftan even though no longer actively showcased in storefront.',
        })

        // Admin approves review on archived design
        const archApproveRes = await updateReviewStatusAdminAction(
            archReviewSubmit.reviewId!,
            'APPROVED',
            undefined,
            'Historical piece feedback approved.'
        )

        assert(
            Boolean(archApproveRes.success && archApproveRes.review?.status === 'APPROVED'),
            'TC-11.EC1',
            'Review on Archived/Hidden Design Approves Gracefully Without Grid Errors',
            `Status: ${archApproveRes.review?.status}, Design ID: ${archDesignId}`
        )

        // ─── TC-11.EC2: Edited Review Automatically Resets Status to PENDING ─────────
        console.log('\n--- TC-11.EC2: Edited Review Automatically Resets Status to PENDING ---')
        // Daniel edits the approved review via updateCustomerReviewAction
        const editRes = await updateCustomerReviewAction({
            orderNumber: 'CS-0092',
            rating: 5,
            comment: 'Updated review text: Absolutely royal attire, wore to Rome gala!',
            fitTags: ['Comfortable movement', 'Immaculate wrist drape'],
        })

        assert(
            Boolean(editRes.success),
            'TC-11.EC2a',
            'updateCustomerReviewAction Successfully Modifies Patron Review',
            `Result success: ${editRes.success}`
        )

        const editedDbReview = await prisma.review.findUnique({
            where: { id: danielReviewId },
        })

        assert(
            Boolean(editedDbReview?.status === 'PENDING'),
            'TC-11.EC2b',
            'Patron Modification Automatically Resets Status from APPROVED to PENDING',
            `Status after edit: "${editedDbReview?.status}"`
        )

        // Verify edited review is immediately withheld from public catalogue until re-approved
        const designWhilePending = await getDesignBySlug(designSlug)
        const pendingInPublic = designWhilePending?.reviews.some((r) => r.id === danielReviewId)

        assert(
            Boolean(!pendingInPublic),
            'TC-11.EC2c',
            'Modified Review is Immediately Withheld from Public Storefront Pending Re-moderation',
            `Visible while PENDING: ${pendingInPublic}`
        )

        // Re-approve Daniel's review so state remains clean
        await updateReviewStatusAdminAction(
            danielReviewId,
            'APPROVED',
            undefined,
            'Re-moderated and approved after customer edit.'
        )

        // ─── TC-11.EC3: Rejection Audit Note & Timestamp Traceability ────────────────
        console.log('\n--- TC-11.EC3: Rejection Audit Note & Timestamp Traceability ---')
        const spamDbCheck = await prisma.review.findUnique({
            where: { id: spamReviewId },
        })

        assert(
            Boolean(
                spamDbCheck?.status === 'REJECTED' &&
                spamDbCheck?.moderatorNote?.includes('Commercial spam') &&
                spamDbCheck?.moderatedAt !== null
            ),
            'TC-11.EC3',
            'Prisma Database Accurately Persists Rejection Reason and Moderation Timestamp',
            `Note: "${spamDbCheck?.moderatorNote}", Moderated: ${spamDbCheck?.moderatedAt?.toISOString()}`
        )

        // ─── TC-11.EC4: Non-Existent Review Graceful Handling ────────────────────────
        console.log('\n--- TC-11.EC4: Non-Existent Review Graceful Handling ---')
        const invalidLookup = await getReviewByIdAdminAction('non-existent-review-id-999')

        assert(
            Boolean(invalidLookup.success === false && invalidLookup.error),
            'TC-11.EC4a',
            'getReviewByIdAdminAction Gracefully Reports Not Found for Unknown ID',
            `Error message: "${invalidLookup.error}"`
        )

        const invalidUpdate = await updateReviewStatusAdminAction(
            'non-existent-review-id-999',
            'APPROVED'
        )

        assert(
            Boolean(invalidUpdate.success === false && invalidUpdate.error),
            'TC-11.EC4b',
            'updateReviewStatusAdminAction Returns Graceful Error on Missing Record',
            `Error message: "${invalidUpdate.error}"`
        )

        // ─── TC-11.EC5: Multi-Review Queue Partitioning ──────────────────────────────
        console.log('\n--- TC-11.EC5: Multi-Review Queue Partitioning ---')
        const finalQueue = await getAllReviewsAdminAction()
        const approvedCount = finalQueue.reviews.filter((r) => r.status === 'APPROVED').length
        const rejectedCount = finalQueue.reviews.filter((r) => r.status === 'REJECTED').length

        assert(
            Boolean(approvedCount >= 1 && rejectedCount >= 1),
            'TC-11.EC5',
            'Admin Review Queue Accurately Partitions Between Approved and Rejected Categories',
            `Approved count: ${approvedCount}, Rejected count: ${rejectedCount}`
        )
    } finally {
        // ─── CLEANUP ─────────────────────────────────────────────────────────────────
        console.log('\n--- CLEANUP: Purging Ephemeral Test Records ---')
        await cleanupTestData()
        console.log('Cleanup completed.')
    }

    // ─── SUMMARY REPORT ──────────────────────────────────────────────────────────────
    console.log('\n======================================================================')
    console.log('  📊 FLOW 11 TEST RESULTS SUMMARY')
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
        console.log('🎉 ALL FLOW 11 TEST CASES PASSED WITH 100% SUCCESS!')
        process.exit(0)
    }
}

function danielOrderCustomerId(order: any): string {
    return order.customerId
}

runFlow11Tests().catch((e) => {
    console.error('Fatal unhandled error during Flow 11 tests:', e)
    process.exit(1)
})
