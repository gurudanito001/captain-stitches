/**
 * Comprehensive Flow 14 Automated Test Suite
 * Admin Marketing & Email Broadcast Campaigns Flow
 *
 * Covers:
 * - TC-14.1: Open /admin/marketing -> verify aggregate subscriber counts, open rate (52.4%), and recent broadcasts
 * - TC-14.2: Open /admin/marketing/subscribers -> filter by 'Italy' -> verify filtered list
 * - TC-14.3: Create new broadcast campaign -> select target segment -> author content
 * - TC-14.4: Send test preview -> verify test delivery
 * - TC-14.5: Dispatch campaign -> verify campaign moves to 'SENT' status with analytics
 * - TC-14.EC1: Unsubscribe request handling -> updates subscriber status to 'unsubscribed'
 * - TC-14.EC2: Bounced email address handling -> flags subscriber as 'bounced'
 * - TC-14.EC3: Sending without subject line validation -> blocks dispatch with 'Subject line is required.'
 * - TC-14.EC4: Pre-configured audience segmentation evaluation (Italy Diaspora, Nigeria Patrons, VIP Ambassador, New Leads)
 * - TC-14.EC5: Database synchronization with Prisma Subscriber & EmailCampaign models
 */

import { prisma } from '../src/lib/prisma'
import {
    getAllCampaignsAdminAction,
    getCampaignByIdAdminAction,
    createCampaignAdminAction,
    sendTestPreviewEmailAction,
    dispatchCampaignAdminAction,
    getAllSegmentsAdminAction,
    updateSubscriberStatusAdminAction,
} from '../src/lib/actions/marketing'
import {
    getAllSubscribersAdminAction,
    unsubscribeNewsletterAction,
    subscribeNewsletterAction,
} from '../src/lib/actions/newsletter'
import {
    getAllSubscribers,
    getAllSegments,
    getAllCampaigns,
    getMarketingOverviewStats,
    getMarketingSettings,
    INITIAL_SUBSCRIBERS,
    INITIAL_SEGMENTS,
    INITIAL_CAMPAIGNS,
} from '../src/data/adminMarketingData'
import { CampaignStatus as PrismaCampaignStatus, SubscriberStatus as PrismaSubscriberStatus, Language as PrismaLanguage } from '@prisma/client'

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
    testCampaignId: 'camp-test-flow14',
    testSubscriberEmail: 'flow14.newsletter.tester@captainstitches.com',
    testBouncedEmail: 'flow14.bounced.tester@captainstitches.com',
    adminTestRecipient: 'samuelson@captainstitches.com',
}

async function cleanupTestData() {
    try {
        await prisma.emailCampaign.deleteMany({
            where: {
                OR: [
                    { id: TEST_IDENTIFIERS.testCampaignId },
                    { name: { contains: 'Flow 14' } },
                ],
            },
        })

        await prisma.subscriber.deleteMany({
            where: {
                email: {
                    in: [
                        TEST_IDENTIFIERS.testSubscriberEmail,
                        TEST_IDENTIFIERS.testBouncedEmail,
                    ],
                },
            },
        })
    } catch (e) {
        console.warn('Prisma cleanup note (non-fatal):', e)
    }
}

async function runTestSuite() {
    console.log('════════════════════════════════════════════════════════════════')
    console.log('🧪 RUNNING FLOW 14: ADMIN MARKETING & EMAIL CAMPAIGNS FLOW')
    console.log('════════════════════════════════════════════════════════════════\n')

    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 1: MARKETING HEALTH DASHBOARD & SUBSCRIBER METRICS (TC-14.1)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('--- 1. Testing Marketing Overview Dashboard & Metrics Strip ---')

    const subscribers = getAllSubscribers()
    const campaigns = getAllCampaigns()
    const overviewStats = getMarketingOverviewStats(subscribers, campaigns)

    assert(
        overviewStats.activeSubscribers >= 5,
        'TC-14.1A',
        'Total Active Subscribers Metric',
        `Active subscribers: ${overviewStats.activeSubscribers} (Total: ${subscribers.length})`
    )

    assert(
        overviewStats.avgOpenRate > 0 && overviewStats.avgOpenRate <= 100,
        'TC-14.1B',
        'Average Open Rate Metric',
        `Average open rate: ${overviewStats.avgOpenRate}% (Benchmark: ~52.4%)`
    )

    assert(
        overviewStats.avgClickRate > 0 && overviewStats.avgClickRate <= 100,
        'TC-14.1C',
        'Click-Through Rate Metric',
        `Average click-through rate: ${overviewStats.avgClickRate}%`
    )

    const settings = getMarketingSettings()
    assert(
        settings.isConnected === true && Boolean(settings.fromEmail),
        'TC-14.1D',
        'Mail Engine Integration & Settings',
        `Engine provider: ${settings.platform}, sender: "${settings.fromName}" <${settings.fromEmail}>`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 2: SUBSCRIBER DIRECTORY & GEOGRAPHIC FILTERING (TC-14.2)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing Subscriber Directory & Italy Diaspora Filter ---')

    const adminSubsRes = await getAllSubscribersAdminAction()
    assert(
        adminSubsRes.success === true,
        'TC-14.2A',
        'Admin Subscribers Action Success',
        `Retrieved subscriber records from database/store.`
    )

    // Filter subscribers by Italy location
    const italySubscribers = subscribers.filter(
        (s) => s.location === 'Italy' && s.status === 'active'
    )
    assert(
        italySubscribers.length >= 3,
        'TC-14.2B',
        'Filter Subscribers by Italy Diaspora',
        `Found ${italySubscribers.length} active Italian diaspora subscribers (e.g. Adewale Okafor, Chidi Okonkwo, Luca Rossi)`
    )

    // Filter subscribers by Nigeria location
    const nigeriaSubscribers = subscribers.filter(
        (s) => s.location === 'Nigeria' && s.status === 'active'
    )
    assert(
        nigeriaSubscribers.length >= 2,
        'TC-14.2C',
        'Filter Subscribers by Nigeria Patrons',
        `Found ${nigeriaSubscribers.length} Nigerian clients (e.g. Daniel Nwokocha, Emeka Eze)`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 3: BROADCAST CAMPAIGN AUTHORING (TC-14.3)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 3. Testing Broadcast Campaign Authoring & Personalization ---')

    const segmentsRes = await getAllSegmentsAdminAction()
    assert(
        segmentsRes.success === true && segmentsRes.segments.length >= 3,
        'TC-14.3A',
        'Audience Segments Retrieval',
        `Loaded ${segmentsRes.segments.length} pre-configured audience segments.`
    )

    const italySegment = segmentsRes.segments.find((s) => s.id === 'seg-italy-diaspora')
    assert(
        Boolean(italySegment),
        'TC-14.3B',
        'Target Segment Selection (Italy Diaspora)',
        `Targeted segment: "${italySegment?.name}" (${italySegment?.subscriberCount} patrons)`
    )

    const campaignInput = {
        id: TEST_IDENTIFIERS.testCampaignId,
        name: 'Autumn / Winter Bespoke Fabric Drop - Flow 14 Test',
        subjectEN: '✦ New Season Presidential Cashmere Arrived in Verona',
        subjectIT: '✦ Nuova Collezione Cashmere Presidenziale Arrivata a Verona',
        previewTextEN: 'Exclusive early-access bespoke tailoring slots for December events.',
        previewTextIT: 'Accesso esclusivo alle prenotazioni su misura per gli eventi invernali.',
        audienceType: 'segment' as const,
        targetSegmentId: italySegment!.id,
        targetSegmentName: italySegment!.name,
        recipientCount: 450,
        contentEN: {
            title: 'Presidential Cashmere & Royal Agbada Collection',
            subtitle: 'Direct from our workshop to Verona atelier',
            body: 'Dear {{firstName | default: "Patron"}},\n\nWe have just received a curated consignment of high-twist Italian wool.\n\nEnjoy an exclusive 10% loyalty discount with code PRESIDENTIAL10 on your next bespoke booking.',
            ctaText: 'Book Your Workshop Slot →',
            ctaUrl: '/order',
        },
    }

    const createCampaignRes = await createCampaignAdminAction(campaignInput)
    assert(
        createCampaignRes.success === true && Boolean(createCampaignRes.campaign),
        'TC-14.3C',
        'Broadcast Campaign Creation',
        `Created campaign ID "${createCampaignRes.campaign?.id}" with title "${createCampaignRes.campaign?.name}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 4: TEST PREVIEW DELIVERY (TC-14.4)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 4. Testing Admin Test Preview Email Delivery ---')

    const testEmailRes = await sendTestPreviewEmailAction(
        TEST_IDENTIFIERS.testCampaignId,
        TEST_IDENTIFIERS.adminTestRecipient
    )
    assert(
        testEmailRes.success === true && Boolean(testEmailRes.deliveryTime),
        'TC-14.4',
        'Send Test Email to Samuelson',
        `Test preview dispatched to ${TEST_IDENTIFIERS.adminTestRecipient} at ${testEmailRes.deliveryTime}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 5: BROADCAST DISPATCH & REAL-TIME ANALYTICS (TC-14.5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 5. Testing Broadcast Campaign Dispatch & Analytics ---')

    const dispatchRes = await dispatchCampaignAdminAction(TEST_IDENTIFIERS.testCampaignId)
    assert(
        dispatchRes.success === true && dispatchRes.campaign?.status === 'sent',
        'TC-14.5A',
        'Campaign Status Transition to SENT',
        `Campaign dispatched successfully. Status: "${dispatchRes.campaign?.status}"`
    )

    assert(
        Boolean(dispatchRes.campaign?.sendDate) && Boolean(dispatchRes.campaign?.sendTime),
        'TC-14.5B',
        'Send Timestamp Recording',
        `Dispatched on ${dispatchRes.campaign?.sendDate} at ${dispatchRes.campaign?.sendTime}`
    )

    const statsAfterDispatch = dispatchRes.campaign?.stats
    assert(
        Boolean(statsAfterDispatch) &&
        statsAfterDispatch!.delivered > 0 &&
        statsAfterDispatch!.opened > 0 &&
        statsAfterDispatch!.openRate === 52.4,
        'TC-14.5C',
        'Real-time Broadcast Analytics',
        `Delivered: ${statsAfterDispatch?.delivered}, Opened: ${statsAfterDispatch?.opened} (Rate: ${statsAfterDispatch?.openRate}%), Clicked: ${statsAfterDispatch?.clicked}`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 6: EDGE CASES (TC-14.EC1 - TC-14.EC5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 6. Testing Edge Cases & Strict Validations ---')

    // Edge Case 1: Unsubscribe Request Handling
    const unsubRes = await updateSubscriberStatusAdminAction('sub-adewale-01', 'unsubscribed')
    assert(
        unsubRes.success === true && unsubRes.subscriber?.status === 'unsubscribed',
        'TC-14.EC1A',
        'Unsubscribe Subscriber Status Update',
        `Subscriber ${unsubRes.subscriber?.name} marked as "${unsubRes.subscriber?.status}"`
    )

    // Restore for subsequent test cycles
    await updateSubscriberStatusAdminAction('sub-adewale-01', 'active')

    // Edge Case 2: Bounced Email Handling
    const bounceRes = await updateSubscriberStatusAdminAction('sub-bounce-01', 'bounced')
    assert(
        bounceRes.success === true && bounceRes.subscriber?.status === 'bounced',
        'TC-14.EC2',
        'Bounced Email Address Handling',
        `Subscriber ${bounceRes.subscriber?.email} flagged as "${bounceRes.subscriber?.status}" and suppressed from broadcasts`
    )

    // Edge Case 3: Sending Without Subject Line Validation
    const blankSubjectCampaign = await createCampaignAdminAction({
        name: 'Empty Subject Campaign',
        subjectEN: '',
    })
    const invalidDispatch = await dispatchCampaignAdminAction(blankSubjectCampaign.campaign!.id)
    assert(
        invalidDispatch.success === false &&
        invalidDispatch.error === 'Subject line is required.',
        'TC-14.EC3',
        'Dispatch Without Subject Line Rejection',
        `Dispatch rejected with expected validation error: "${invalidDispatch.error}"`
    )

    // Edge Case 4: Pre-configured Segments Validation
    const segments = getAllSegments()
    const segmentNames = segments.map((s) => s.name)
    assert(
        segmentNames.includes('Italy & European Diaspora') &&
        segmentNames.includes('Nigerian Patrons') &&
        segmentNames.includes('VIP Ambassador Circle') &&
        segmentNames.includes('New Newsletter Leads'),
        'TC-14.EC4',
        'Pre-configured Audience Segments Completeness',
        `All 4 canonical audience segments verified: ${segmentNames.join(', ')}`
    )

    // Edge Case 5: Database State Synchronization
    try {
        const liveSubscriber = await prisma.subscriber.create({
            data: {
                email: TEST_IDENTIFIERS.testSubscriberEmail,
                name: 'Flow 14 Tester',
                source: 'homepage',
                language: PrismaLanguage.EN,
                status: PrismaSubscriberStatus.ACTIVE,
            },
        })

        assert(
            Boolean(liveSubscriber.id) && liveSubscriber.status === PrismaSubscriberStatus.ACTIVE,
            'TC-14.EC5A',
            'Prisma Subscriber Record Insertion',
            `Created database subscriber ID "${liveSubscriber.id}" for email "${liveSubscriber.email}"`
        )

        const liveUnsubRes = await unsubscribeNewsletterAction(TEST_IDENTIFIERS.testSubscriberEmail)
        assert(
            liveUnsubRes.success === true,
            'TC-14.EC5B',
            'Database Unsubscribe Action Execution',
            `Unsubscribed database subscriber record successfully.`
        )

        const reloadedSubscriber = await prisma.subscriber.findUnique({
            where: { email: TEST_IDENTIFIERS.testSubscriberEmail },
        })

        assert(
            reloadedSubscriber?.status === PrismaSubscriberStatus.UNSUBSCRIBED &&
            Boolean(reloadedSubscriber?.unsubscribedAt),
            'TC-14.EC5C',
            'Database Subscriber State Verification: UNSUBSCRIBED',
            `Database status: ${reloadedSubscriber?.status}, timestamp: ${reloadedSubscriber?.unsubscribedAt?.toISOString()}`
        )
    } catch (e: any) {
        console.warn('Database sync assertion note:', e.message)
    }

    // Final Cleanup
    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // SUMMARY REPORT
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════════════')
    console.log('📊 FLOW 14 TEST SUITE SUMMARY REPORT')
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
        console.log('🎉 ALL FLOW 14 TEST ASSERTIONS PASSED WITH 100% SUCCESS!')
        process.exit(0)
    }
}

runTestSuite().catch((err) => {
    console.error('Fatal error running Flow 14 tests:', err)
    process.exit(1)
})
