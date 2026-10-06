/**
 * Comprehensive Flow 12 Automated Test Suite
 * Admin Referral Management & Rewards Flow
 *
 * Covers:
 * - TC-12.1: 7-KPI Performance Dashboard (/admin/referrals) statistics computation and retrieval
 * - TC-12.2: Top Referrers Leaderboard ranking (Daniel Nwokocha #1 @ 67%, Chidi Okonkwo #2 @ 50%)
 * - TC-12.3: Token Tracking & Discovery (/admin/referrals/list -> DANIEL-00S linked to Order #CS-0003)
 * - TC-12.4: Mark Reward as Redeemed workflow with required applied order #CS-2026-0009
 * - TC-12.5: Programme Status Control (Pause ⏸ ↔ Activate ▶ toggling)
 * - TC-12.EC1: Redemption Without Order Number Rejection (strict validation)
 * - TC-12.EC2: Discretionary VIP Ambassador Perk Issuance (manual reward grant)
 * - TC-12.EC3: Token Copy Action & Deep Link Schema Resolution (https://captainstitches.com/ref/...)
 * - TC-12.EC4: Referral List Filtering & Multi-attribute Search Mechanics
 * - TC-12.EC5: Multi-event Activity Feed Audit Log Integrity
 * - TC-12.EC6: Database State Persistence & Prisma Schema Synchronization
 */

import { prisma } from '../src/lib/prisma'
import {
    getAllReferralsAdminAction,
    redeemReferralRewardAdminAction,
    toggleProgrammeStatusAdminAction,
    issueManualRewardAdminAction,
} from '../src/lib/actions/referrals'
import {
    getAllReferrals,
    getReferralStats,
    getTopReferrers,
    getProgrammeConfig,
    toggleProgrammeStatus,
    markRewardRedeemed,
    issueRewardManually,
    INITIAL_REFERRALS,
    INITIAL_ACTIVITY_FEED,
    ReferralItem,
} from '../src/data/adminReferralsData'
import { DeliveryLocation, ReferralRewardType, ReferralRewardStatus } from '@prisma/client'

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
    referrerEmail: 'flow12.ambassador.tester@captainstitches.com',
    referrerPhone: '+393450001212',
    testToken: 'TEST-FLOW12-TOKEN',
    appliedOrderNumber: 'CS-2026-0009',
}

async function cleanupTestData() {
    try {
        const testReferrals = await prisma.referral.findMany({
            where: {
                OR: [
                    { token: { startsWith: 'TEST-FLOW12' } },
                    { token: { startsWith: 'AMB-TEST' } },
                ],
            },
            select: { id: true, referrerId: true },
        })

        if (testReferrals.length > 0) {
            await prisma.referral.deleteMany({
                where: { id: { in: testReferrals.map((r) => r.id) } },
            })
        }

        const testCustomers = await prisma.customer.findMany({
            where: {
                OR: [
                    { email: TEST_IDENTIFIERS.referrerEmail },
                    { phone: TEST_IDENTIFIERS.referrerPhone },
                ],
            },
            select: { id: true },
        })

        if (testCustomers.length > 0) {
            await prisma.customer.deleteMany({
                where: { id: { in: testCustomers.map((c) => c.id) } },
            })
        }
    } catch (e) {
        console.warn('Cleanup warning (non-fatal):', e)
    }
}

async function runTestSuite() {
    console.log('════════════════════════════════════════════════════════════════')
    console.log('🧪 RUNNING FLOW 12: ADMIN REFERRAL MANAGEMENT & REWARDS FLOW')
    console.log('════════════════════════════════════════════════════════════════\n')

    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 1: 7-KPI PERFORMANCE DASHBOARD (TC-12.1)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('--- 1. Testing 7-KPI Performance Dashboard Metrics ---')

    const adminReferralsRes = await getAllReferralsAdminAction()
    assert(
        adminReferralsRes.success === true && Array.isArray(adminReferralsRes.referrals),
        'TC-12.1A',
        'Admin Referrals Action Success',
        `Retrieved ${adminReferralsRes.referrals.length} referrals successfully.`
    )

    const stats = getReferralStats(adminReferralsRes.referrals)

    assert(
        stats.totalLinks > 0,
        'TC-12.1B',
        'KPI 1: Links Generated',
        `Active referral tokens generated: ${stats.totalLinks}`
    )

    assert(
        stats.totalVisited > 0,
        'TC-12.1C',
        'KPI 2: Link Visits',
        `Unique link visits logged: ${stats.totalVisited}`
    )

    assert(
        stats.converted > 0,
        'TC-12.1D',
        'KPI 3: Converted Orders',
        `Paid bespoke commissions attributed: ${stats.converted}`
    )

    const convRateNum = parseFloat(stats.conversionRate)
    assert(
        !isNaN(convRateNum) && convRateNum > 0 && convRateNum <= 100,
        'TC-12.1E',
        'KPI 4: Conversion Rate Percentage',
        `Calculated conversion rate: ${stats.conversionRate}%`
    )

    assert(
        stats.totalRewardsIssued > 0,
        'TC-12.1F',
        'KPI 5: Rewards Issued',
        `Total kickback vouchers credited: ${stats.totalRewardsIssued}`
    )

    assert(
        stats.totalRewardsRedeemed >= 0,
        'TC-12.1G',
        'KPI 6: Rewards Redeemed',
        `Total vouchers applied to commissions: ${stats.totalRewardsRedeemed}`
    )

    assert(
        stats.pendingRedemption >= 0,
        'TC-12.1H',
        'KPI 7: Pending Redemption',
        `Active unclaimed patron credits: ${stats.pendingRedemption}`
    )

    // Mathematical consistency check
    assert(
        stats.totalRewardsIssued === stats.totalRewardsRedeemed + stats.pendingRedemption,
        'TC-12.1I',
        'KPI Fiscal Coherence',
        `Issued (${stats.totalRewardsIssued}) equals Redeemed (${stats.totalRewardsRedeemed}) + Pending (${stats.pendingRedemption})`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 2: TOP REFERRERS LEADERBOARD (TC-12.2)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 2. Testing Top Referrers Leaderboard Ranking ---')

    const topAmbassadors = getTopReferrers(adminReferralsRes.referrals)
    assert(
        topAmbassadors.length >= 2,
        'TC-12.2A',
        'Leaderboard Ambassador Count',
        `Found ${topAmbassadors.length} ranked ambassadors.`
    )

    // Rank 1: Daniel Nwokocha
    const rank1 = topAmbassadors[0]
    assert(
        rank1.customer.name.toLowerCase().includes('daniel nwokocha') &&
        rank1.sent === 3 &&
        rank1.converted === 2,
        'TC-12.2B',
        'Rank 1 Ambassador: Daniel Nwokocha',
        `Rank 1 is ${rank1.customer.name} (Sent: ${rank1.sent}, Converted: ${rank1.converted})`
    )

    const rank1Rate = Math.round((rank1.converted / rank1.sent) * 100)
    assert(
        rank1Rate === 67,
        'TC-12.2C',
        'Rank 1 Conversion Rate (67%)',
        `Daniel Nwokocha conversion rate is ${rank1Rate}% (expected 67%)`
    )

    // Rank 2: Chidi Okonkwo
    const rank2 = topAmbassadors[1]
    assert(
        rank2.customer.name.toLowerCase().includes('chidi okonkwo') &&
        rank2.sent === 4 &&
        rank2.converted === 2,
        'TC-12.2D',
        'Rank 2 Ambassador: Chidi Okonkwo',
        `Rank 2 is ${rank2.customer.name} (Sent: ${rank2.sent}, Converted: ${rank2.converted})`
    )

    const rank2Rate = Math.round((rank2.converted / rank2.sent) * 100)
    assert(
        rank2Rate === 50,
        'TC-12.2E',
        'Rank 2 Conversion Rate (50%)',
        `Chidi Okonkwo conversion rate is ${rank2Rate}% (expected 50%)`
    )

    // Server action leaderboard alignment
    assert(
        adminReferralsRes.topReferrers.length >= 2 &&
        adminReferralsRes.topReferrers[0].name.toLowerCase().includes('daniel nwokocha'),
        'TC-12.2F',
        'Server Action Leaderboard Match',
        `Server action top referrer is "${adminReferralsRes.topReferrers[0]?.name}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 3: TOKEN TRACKING & DISCOVERY (TC-12.3)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 3. Testing Token Tracking & Linked Order CS-0003 ---')

    const danielTokenItem = adminReferralsRes.referrals.find((r) => r.token === 'DANIEL-00S')
    assert(
        Boolean(danielTokenItem),
        'TC-12.3A',
        'Token DANIEL-00S Discovery',
        `Found referral row with token "DANIEL-00S"`
    )

    assert(
        danielTokenItem?.referrer.name.toLowerCase().includes('daniel nwokocha') === true,
        'TC-12.3B',
        'Referrer Patron Association',
        `Referrer identified as ${danielTokenItem?.referrer.name}`
    )

    assert(
        danielTokenItem?.referredCustomer.name.toLowerCase().includes('emeka eze') === true,
        'TC-12.3C',
        'Referred Friend Association',
        `Referred client identified as ${danielTokenItem?.referredCustomer.name}`
    )

    assert(
        danielTokenItem?.conversionStatus === 'paid',
        'TC-12.3D',
        'Token Conversion Status',
        `Token status is "${danielTokenItem?.conversionStatus}"`
    )

    assert(
        danielTokenItem?.linkedOrder?.orderNumber === 'CS-0003',
        'TC-12.3E',
        'Linked Bespoke Order #CS-0003',
        `Linked commission order is #${danielTokenItem?.linkedOrder?.orderNumber} (${danielTokenItem?.linkedOrder?.garmentName})`
    )

    assert(
        danielTokenItem?.referrerReward.status === 'credited' &&
        danielTokenItem?.referrerReward.value.includes('10%'),
        'TC-12.3F',
        'Referrer Reward Voucher Status',
        `Referrer reward is ${danielTokenItem?.referrerReward.status} (${danielTokenItem?.referrerReward.value})`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 4: MARK REWARD AS REDEEMED WORKFLOW (TC-12.4)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 4. Testing Mark Reward as Redeemed with Order #CS-2026-0009 ---')

    // Test with local state manager
    const localRedeemedList = markRewardRedeemed(
        'ref-daniel-00s',
        'referrer',
        TEST_IDENTIFIERS.appliedOrderNumber
    )
    const updatedLocalDaniel = localRedeemedList.find((r) => r.id === 'ref-daniel-00s')

    assert(
        updatedLocalDaniel?.referrerReward.status === 'redeemed',
        'TC-12.4A',
        'Voucher Status Changed to REDEEMED',
        `Referrer reward status is now "${updatedLocalDaniel?.referrerReward.status}"`
    )

    assert(
        updatedLocalDaniel?.referrerReward.orderAppliedNumber === TEST_IDENTIFIERS.appliedOrderNumber,
        'TC-12.4B',
        'Applied Order Linked to Voucher',
        `Order number ${updatedLocalDaniel?.referrerReward.orderAppliedNumber} linked to voucher`
    )

    const redemptionTimelineEvent = updatedLocalDaniel?.timeline.find((t) =>
        t.description.includes(TEST_IDENTIFIERS.appliedOrderNumber)
    )
    assert(
        Boolean(redemptionTimelineEvent),
        'TC-12.4C',
        'Redemption Audit Timeline Appended',
        `Timeline logged: "${redemptionTimelineEvent?.description}" by ${redemptionTimelineEvent?.actor}`
    )

    // Test with Server Action
    const serverRedeemRes = await redeemReferralRewardAdminAction(
        'ref-daniel-00s',
        'referrer',
        TEST_IDENTIFIERS.appliedOrderNumber
    )
    assert(
        serverRedeemRes.success === true &&
        serverRedeemRes.orderAppliedNumber === TEST_IDENTIFIERS.appliedOrderNumber,
        'TC-12.4D',
        'Server Action Redemption Confirmation',
        `Server action returned success with applied order "${serverRedeemRes.orderAppliedNumber}"`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 5: PROGRAMME STATUS CONTROL (TC-12.5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 5. Testing Programme Status Toggling (Pause ↔ Activate) ---')

    const initialConfig = getProgrammeConfig()
    const initialEnabled = initialConfig.isEnabled

    // 1. Pause programme
    const pausedState = toggleProgrammeStatus()
    assert(
        pausedState === !initialEnabled,
        'TC-12.5A',
        'Local Programme Pause',
        `Programme status toggled from ${initialEnabled} to ${pausedState}`
    )

    const serverPauseRes = await toggleProgrammeStatusAdminAction(false)
    assert(
        serverPauseRes.success === true && serverPauseRes.isEnabled === false,
        'TC-12.5B',
        'Server Action Programme Paused',
        `Server action set isEnabled to false (Programme Paused)`
    )

    // 2. Re-activate programme
    const reactivatedState = toggleProgrammeStatus()
    assert(
        reactivatedState === initialEnabled,
        'TC-12.5C',
        'Local Programme Activation',
        `Programme status toggled back to ${reactivatedState}`
    )

    const serverActivateRes = await toggleProgrammeStatusAdminAction(true)
    assert(
        serverActivateRes.success === true && serverActivateRes.isEnabled === true,
        'TC-12.5D',
        'Server Action Programme Activated',
        `Server action set isEnabled to true (Programme Active)`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 6: EDGE CASES (TC-12.EC1 - TC-12.EC5)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 6. Testing Edge Cases & Strict Validation ---')

    // Edge Case 1: Redemption without order number rejection
    const invalidRedeemNoOrder = await redeemReferralRewardAdminAction(
        'ref-daniel-00s',
        'referrer',
        ''
    )
    assert(
        invalidRedeemNoOrder.success === false &&
        invalidRedeemNoOrder.error === 'Please specify the order number where this reward was applied.',
        'TC-12.EC1A',
        'Empty Order Number Rejection',
        `Empty order number rejected with: "${invalidRedeemNoOrder.error}"`
    )

    const invalidRedeemWhitespace = await redeemReferralRewardAdminAction(
        'ref-daniel-00s',
        'referrer',
        '   '
    )
    assert(
        invalidRedeemWhitespace.success === false &&
        Boolean(invalidRedeemWhitespace.error?.includes('specify the order number')),
        'TC-12.EC1B',
        'Whitespace Order Number Rejection',
        `Whitespace order number rejected with expected alert.`
    )

    // Edge Case 2: Discretionary VIP Perk issuance
    const manualIssueEmptyReason = await issueManualRewardAdminAction({
        customerId: 'cust-vip-1',
        customerName: 'Adewale Okafor',
        rewardType: 'priority_slot',
        rewardValue: 'VIP Priority Production',
        reason: '   ',
    })
    assert(
        manualIssueEmptyReason.success === false &&
        Boolean(manualIssueEmptyReason.error?.includes('reason or internal note')),
        'TC-12.EC2A',
        'Empty Reason Rejection for Manual Reward',
        `Empty reason rejected with: "${manualIssueEmptyReason.error}"`
    )

    const manualIssueSuccess = await issueManualRewardAdminAction({
        customerId: 'cust-vip-1',
        customerName: 'Adewale Okafor',
        rewardType: 'priority_slot',
        rewardValue: 'VIP Priority Production Slot',
        reason: 'Top diaspora promoter for Italian weddings',
    })
    assert(
        manualIssueSuccess.success === true &&
        Boolean(manualIssueSuccess.referral?.token.startsWith('AMB-ADE')) &&
        manualIssueSuccess.referral?.referrerReward.type === 'priority_slot',
        'TC-12.EC2B',
        'VIP Ambassador Perk Grant (Adewale Okafor)',
        `Issued VIP perk with token "${manualIssueSuccess.referral?.token}" and label "${manualIssueSuccess.referral?.referrerReward.typeLabel}"`
    )

    const localManualList = issueRewardManually(
        'cust-vip-1',
        'Adewale Okafor',
        'free_item',
        'Handmade Velvet Fila Cap',
        'Celebrity wedding promoter'
    )
    const grantedLocal = localManualList.find((r) => r.referrer.name === 'Adewale Okafor')
    assert(
        Boolean(grantedLocal) && grantedLocal?.referrerReward.value === 'Handmade Velvet Fila Cap',
        'TC-12.EC2C',
        'Local VIP Perk Recording',
        `Recorded manual gift: "${grantedLocal?.referrerReward.value}"`
    )

    // Edge Case 3: Token copying and deep link structure
    const copyUrl = `https://captainstitches.com/ref/${danielTokenItem?.token}`
    assert(
        copyUrl === 'https://captainstitches.com/ref/DANIEL-00S' &&
        /^[A-Z0-9-]+$/.test(danielTokenItem!.token),
        'TC-12.EC3',
        'Deep Link URL & Token Schema Integrity',
        `Copy link resolved to valid URL: "${copyUrl}"`
    )

    // Edge Case 4: Search & Multi-filter Mechanics
    const searchFilterByToken = adminReferralsRes.referrals.filter((r) =>
        r.token.toLowerCase().includes('daniel-00s')
    )
    assert(
        searchFilterByToken.length === 1 && searchFilterByToken[0].token === 'DANIEL-00S',
        'TC-12.EC4A',
        'Filter by Exact Token',
        `Search for "daniel-00s" isolated 1 record.`
    )

    const searchFilterByOrder = adminReferralsRes.referrals.filter((r) =>
        r.linkedOrder?.orderNumber.toLowerCase().includes('cs-0003')
    )
    assert(
        searchFilterByOrder.length === 1 && searchFilterByOrder[0].linkedOrder?.orderNumber === 'CS-0003',
        'TC-12.EC4B',
        'Filter by Linked Order Number',
        `Search for "cs-0003" matched order CS-0003.`
    )

    const filterByRedeemed = adminReferralsRes.referrals.filter(
        (r) => r.referrerReward.status === 'redeemed' || r.referredCustomerReward.status === 'redeemed'
    )
    assert(
        filterByRedeemed.length >= 2,
        'TC-12.EC4C',
        'Filter by Redeemed Reward Status',
        `Found ${filterByRedeemed.length} redeemed kickbacks.`
    )

    const filterByItaly = adminReferralsRes.referrals.filter(
        (r) => r.referrer.location === 'Italy' || r.referredCustomer.location === 'Italy'
    )
    assert(
        filterByItaly.length >= 2,
        'TC-12.EC4D',
        'Filter by Italian Diaspora Location',
        `Found ${filterByItaly.length} Italy-based referral commissions.`
    )

    // Edge Case 5: Activity Feed Integrity
    assert(
        Array.isArray(INITIAL_ACTIVITY_FEED) && INITIAL_ACTIVITY_FEED.length >= 3,
        'TC-12.EC5A',
        'Activity Feed Log Availability',
        `Activity feed contains ${INITIAL_ACTIVITY_FEED.length} timestamped events.`
    )

    const visitEvent = INITIAL_ACTIVITY_FEED.find((e) => e.type === 'link_visited')
    const orderEvent = INITIAL_ACTIVITY_FEED.find((e) => e.type === 'order_placed')
    assert(
        Boolean(visitEvent) && Boolean(orderEvent) && Boolean(visitEvent?.referrerName),
        'TC-12.EC5B',
        'Activity Feed Multi-event Diversity',
        `Feed captures visits ("${visitEvent?.title}") and orders ("${orderEvent?.title}")`
    )

    // ─────────────────────────────────────────────────────────────────────────────
    // TEST SUITE 7: DATABASE PERSISTENCE & PRISMA SYNCHRONIZATION (TC-12.EC6)
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n--- 7. Testing Database State Persistence & Prisma Schema Sync ---')

    // Create a live test customer and referral in PostgreSQL
    const liveCustomer = await prisma.customer.create({
        data: {
            firstName: 'Flow12',
            lastName: 'Tester',
            email: TEST_IDENTIFIERS.referrerEmail,
            phone: TEST_IDENTIFIERS.referrerPhone,
            deliveryLocation: DeliveryLocation.ITALY,
        },
    })

    const liveReferral = await prisma.referral.create({
        data: {
            referrerId: liveCustomer.id,
            token: TEST_IDENTIFIERS.testToken,
            referrerRewardType: ReferralRewardType.DISCOUNT_PERCENT,
            referrerRewardValue: 20,
            referrerRewardStatus: ReferralRewardStatus.CREDITED,
        },
    })

    assert(
        Boolean(liveReferral.id) && liveReferral.referrerRewardStatus === ReferralRewardStatus.CREDITED,
        'TC-12.EC6A',
        'Prisma Live Referral Record Insertion',
        `Created referral ID: ${liveReferral.id} with token ${liveReferral.token}`
    )

    // Redeem through action against live DB record
    const dbRedeemRes = await redeemReferralRewardAdminAction(
        liveReferral.id,
        'referrer',
        TEST_IDENTIFIERS.appliedOrderNumber
    )
    assert(
        dbRedeemRes.success === true,
        'TC-12.EC6B',
        'Database Reward Redemption Action',
        `Redeemed reward on database record ${liveReferral.id}`
    )

    const reloadedReferral = await prisma.referral.findUnique({
        where: { id: liveReferral.id },
    })

    assert(
        reloadedReferral?.referrerRewardStatus === ReferralRewardStatus.REDEEMED &&
        Boolean(reloadedReferral?.referrerRedeemedAt),
        'TC-12.EC6C',
        'Database State Verification: Status REDEEMED',
        `Database record updated: status=${reloadedReferral?.referrerRewardStatus}, redeemedAt=${reloadedReferral?.referrerRedeemedAt?.toISOString()}`
    )

    // Final Cleanup
    await cleanupTestData()

    // ─────────────────────────────────────────────────────────────────────────────
    // SUMMARY REPORT
    // ─────────────────────────────────────────────────────────────────────────────
    console.log('\n════════════════════════════════════════════════════════════════')
    console.log('📊 FLOW 12 TEST SUITE SUMMARY REPORT')
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
        console.log('🎉 ALL FLOW 12 TEST ASSERTIONS PASSED WITH 100% SUCCESS!')
        process.exit(0)
    }
}

runTestSuite().catch((err) => {
    console.error('Fatal error running Flow 12 tests:', err)
    process.exit(1)
})
