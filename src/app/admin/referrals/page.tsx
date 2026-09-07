'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    ReferralItem,
    ReferralProgrammeConfig,
    getAllReferrals,
    getProgrammeConfig,
    toggleProgrammeStatus,
    getReferralStats,
    getTopReferrers,
    INITIAL_ACTIVITY_FEED,
    ReferralActivityEvent,
} from '@/data/adminReferralsData'

type ChartMetric = 'conversions' | 'visits' | 'rewards'
type ChartRange = '30days' | '3months' | '6months' | 'all'

export default function AdminReferralsOverviewPage() {
    const [referrals, setReferrals] = useState<ReferralItem[]>([])
    const [config, setConfig] = useState<ReferralProgrammeConfig>(getProgrammeConfig())
    const [chartMetric, setChartMetric] = useState<ChartMetric>('conversions')
    const [chartRange, setChartRange] = useState<ChartRange>('6months')
    const [activityFeed, setActivityFeed] = useState<ReferralActivityEvent[]>(INITIAL_ACTIVITY_FEED)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        setReferrals(getAllReferrals())
        setConfig(getProgrammeConfig())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const handleToggleStatus = () => {
        const isNowEnabled = toggleProgrammeStatus()
        setConfig((prev) => ({ ...prev, isEnabled: isNowEnabled }))
        showToast(
            isNowEnabled
                ? 'Referral Programme has been Activated.'
                : 'Referral Programme has been Paused. Existing links will not credit new rewards.'
        )
    }

    const stats = useMemo(() => getReferralStats(referrals), [referrals])
    const topReferrers = useMemo(() => getTopReferrers(referrals), [referrals])

    // Mock interactive chart bars based on metric and range
    const chartData = useMemo(() => {
        if (chartMetric === 'conversions') {
            return [
                { month: 'Jan', value: 2, label: '2 orders' },
                { month: 'Feb', value: 3, label: '3 orders' },
                { month: 'Mar', value: 5, label: '5 orders' },
                { month: 'Apr', value: 7, label: '7 orders' },
                { month: 'May', value: 9, label: '9 orders' },
                { month: 'Jun', value: 6, label: '6 orders (active)' },
            ]
        } else if (chartMetric === 'visits') {
            return [
                { month: 'Jan', value: 8, label: '8 visits' },
                { month: 'Feb', value: 14, label: '14 visits' },
                { month: 'Mar', value: 21, label: '21 visits' },
                { month: 'Apr', value: 28, label: '28 visits' },
                { month: 'May', value: 36, label: '36 visits' },
                { month: 'Jun', value: 24, label: '24 visits' },
            ]
        } else {
            return [
                { month: 'Jan', value: 3, label: '3 rewards' },
                { month: 'Feb', value: 4, label: '4 rewards' },
                { month: 'Mar', value: 6, label: '6 rewards' },
                { month: 'Apr', value: 9, label: '9 rewards' },
                { month: 'May', value: 12, label: '12 rewards' },
                { month: 'Jun', value: 8, label: '8 rewards' },
            ]
        }
    }, [chartMetric])

    const maxChartValue = Math.max(...chartData.map((d) => d.value), 10)

    return (
        <div style={{ padding: '36px 40px 100px', minHeight: '100vh', background: '#FAF7F2' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '32px',
                        background: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '14px 22px',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                        zIndex: 9999,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    {toastMessage}
                </div>
            )}

            {/* Header Bar */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    marginBottom: '32px',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <h1
                            style={{
                                fontSize: '1.875rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                letterSpacing: '-0.02em',
                                margin: 0,
                            }}
                        >
                            Referral Programme
                        </h1>
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                background: config.isEnabled ? '#DCFCE7' : '#FEE2E2',
                                color: config.isEnabled ? '#15803D' : '#B91C1C',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                            }}
                        >
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: config.isEnabled ? '#15803D' : '#B91C1C',
                                }}
                            />
                            {config.isEnabled ? 'Programme Active' : 'Programme Paused'}
                        </span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9375rem', color: '#6B7280' }}>
                        Track client ambassadorship, conversion kickbacks, and reward redemptions across Italy and Nigeria.
                    </p>
                </div>

                {/* Header Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    {/* Programme Status Toggle Button */}
                    <button
                        type="button"
                        onClick={handleToggleStatus}
                        style={{
                            background: config.isEnabled ? '#FFFFFF' : '#15803D',
                            color: config.isEnabled ? '#B91C1C' : '#FFFFFF',
                            border: config.isEnabled ? '1px solid #FCA5A5' : 'none',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        {config.isEnabled ? '⏸ Pause Programme' : '▶ Activate Programme'}
                    </button>

                    <Link
                        href="/admin/referrals/rewards"
                        style={{
                            background: '#FFFFFF',
                            color: '#1C0F07',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        🎁 Rewards Config
                    </Link>

                    <Link
                        href="/admin/referrals/settings"
                        style={{
                            background: '#FFFFFF',
                            color: '#1C0F07',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        ⚙ Programme Rules
                    </Link>

                    <Link
                        href="/admin/referrals/list"
                        style={{
                            background: '#C4975A',
                            color: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 2px 5px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        View All Referrals →
                    </Link>
                </div>
            </div>

            {/* 7-KPI Stats Strip */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                }}
            >
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Links Generated
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#1C0F07' }}>
                        {stats.totalLinks}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>all time</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Link Visits
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#1C0F07' }}>
                        {stats.totalVisited}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>unique patrons</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Converted Orders
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#15803D' }}>
                        {stats.converted}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>paid bespoke commissions</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Conversion Rate
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#C4975A' }}>
                        {stats.conversionRate}%
                    </p>
                    <div
                        style={{
                            width: '100%',
                            height: '4px',
                            background: '#F3F4F6',
                            borderRadius: '9999px',
                            marginTop: '8px',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${stats.conversionRate}%`,
                                height: '100%',
                                background: '#C4975A',
                            }}
                        />
                    </div>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Rewards Issued
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#1C0F07' }}>
                        {stats.totalRewardsIssued}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>total kickbacks</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Rewards Redeemed
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#1C0F07' }}>
                        {stats.totalRewardsRedeemed}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>applied to orders</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Pending Redemption
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#D97706' }}>
                        {stats.pendingRedemption}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>active credits</span>
                </div>
            </div>

            {/* Performance Chart Section */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    marginBottom: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        marginBottom: '28px',
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Monthly Performance Dynamics
                        </h2>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                            Visual breakdown of incoming visits, paid orders, and reward triggers.
                        </p>
                    </div>

                    {/* Metric & Time Range Selectors */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                        {/* Metric Toggle */}
                        <div
                            style={{
                                display: 'inline-flex',
                                background: '#FAF7F2',
                                padding: '3px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                            }}
                        >
                            {(
                                [
                                    { key: 'conversions', label: 'Conversions' },
                                    { key: 'visits', label: 'Link Visits' },
                                    { key: 'rewards', label: 'Rewards Issued' },
                                ] as const
                            ).map((m) => (
                                <button
                                    key={m.key}
                                    type="button"
                                    onClick={() => setChartMetric(m.key)}
                                    style={{
                                        border: 'none',
                                        background: chartMetric === m.key ? '#1C0F07' : 'transparent',
                                        color: chartMetric === m.key ? '#FFFFFF' : '#4B5563',
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        fontWeight: chartMetric === m.key ? 700 : 500,
                                        cursor: 'pointer',
                                    }}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>

                        {/* Range Selector */}
                        <select
                            value={chartRange}
                            onChange={(e) => setChartRange(e.target.value as ChartRange)}
                            style={{
                                height: '34px',
                                padding: '0 12px',
                                border: '1px solid #EDE8E1',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                color: '#1C0F07',
                                background: '#FAF7F2',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="30days">Last 30 Days</option>
                            <option value="3months">Last 3 Months</option>
                            <option value="6months">Last 6 Months</option>
                            <option value="all">All Time</option>
                        </select>
                    </div>
                </div>

                {/* CSS Bar Chart */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        height: '180px',
                        paddingTop: '20px',
                        borderBottom: '1px solid #EDE8E1',
                        gap: '16px',
                    }}
                >
                    {chartData.map((bar, idx) => {
                        const heightPct = Math.round((bar.value / maxChartValue) * 100)
                        return (
                            <div
                                key={idx}
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    height: '100%',
                                    justifyContent: 'flex-end',
                                }}
                            >
                                <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#C4975A', marginBottom: '6px' }}>
                                    {bar.value}
                                </span>
                                <div
                                    style={{
                                        width: '100%',
                                        maxWidth: '48px',
                                        height: `${heightPct}%`,
                                        background: chartMetric === 'conversions' ? '#C4975A' : chartMetric === 'visits' ? '#1C0F07' : '#15803D',
                                        borderRadius: '6px 6px 0 0',
                                        transition: 'height 0.3s ease',
                                    }}
                                />
                                <span style={{ marginTop: '10px', fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>
                                    {bar.month}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* 2-Column Split: Top Referrers Leaderboard & Recent Activity Feed */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
                    gap: '28px',
                    alignItems: 'start',
                }}
            >
                {/* Top Referrers Leaderboard */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '16px',
                        padding: '24px 28px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                        }}
                    >
                        <div>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Top Brand Ambassadors
                            </h2>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                                Patrons driving the most bespoke clientele to CaptainStitches.
                            </p>
                        </div>
                        <Link
                            href="/admin/referrals/list"
                            style={{
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: '#C4975A',
                                textDecoration: 'none',
                            }}
                        >
                            All Referrals →
                        </Link>
                    </div>

                    {/* Table */}
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #EDE8E1' }}>
                                    <th style={{ padding: '10px 8px', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Rank
                                    </th>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Patron
                                    </th>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center' }}>
                                        Sent
                                    </th>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'center' }}>
                                        Converted
                                    </th>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>
                                        Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {topReferrers.map((item, idx) => {
                                    const rate = item.sent > 0 ? Math.round((item.converted / item.sent) * 100) : 0
                                    const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`

                                    return (
                                        <tr
                                            key={item.customer.id}
                                            style={{
                                                borderBottom: '1px solid #F3F4F6',
                                                transition: 'background 0.15s ease',
                                            }}
                                        >
                                            <td style={{ padding: '14px 8px', fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07' }}>
                                                {medal}
                                            </td>
                                            <td style={{ padding: '14px 12px' }}>
                                                <Link
                                                    href={`/admin/customers/${item.customer.id}`}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '10px',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '34px',
                                                            height: '34px',
                                                            borderRadius: '50%',
                                                            background: item.customer.avatarColor,
                                                            color: '#FFFFFF',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {item.customer.initials}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07' }}>
                                                            {item.customer.name}
                                                        </p>
                                                        <span style={{ fontSize: '0.6875rem', color: '#6B7280' }}>
                                                            {item.customer.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </td>
                                            <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.875rem', color: '#4B5563', fontWeight: 500 }}>
                                                {item.sent}
                                            </td>
                                            <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.875rem', fontWeight: 700, color: '#15803D' }}>
                                                {item.converted}
                                            </td>
                                            <td style={{ padding: '14px 12px', textAlign: 'right', fontSize: '0.875rem', fontWeight: 600, color: '#C4975A' }}>
                                                {rate}%
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div style={{ marginTop: '18px', textAlign: 'center' }}>
                        <Link
                            href="/admin/referrals/list"
                            style={{
                                display: 'inline-block',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                color: '#1C0F07',
                                textDecoration: 'none',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                background: '#FAF7F2',
                            }}
                        >
                            View All Referrers & Token Records →
                        </Link>
                    </div>
                </div>

                {/* Recent Activity Feed */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '16px',
                        padding: '24px 28px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 4px' }}>
                        Recent Referral Activity
                    </h2>
                    <p style={{ margin: '0 0 20px', fontSize: '0.8125rem', color: '#6B7280' }}>
                        Live stream of visits, conversions, and reward milestones.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {activityFeed.map((act) => {
                            const isReward = act.type === 'reward_triggered'
                            const isRedeemed = act.type === 'reward_redeemed'
                            const isOrder = act.type === 'order_placed'
                            const isVisit = act.type === 'link_visited'

                            const badgeColor = isReward ? '#15803D' : isRedeemed ? '#7E22CE' : isOrder ? '#C4975A' : '#4B5563'
                            const badgeBg = isReward ? '#DCFCE7' : isRedeemed ? '#F3E8FF' : isOrder ? '#FEF3C7' : '#F3F4F6'
                            const icon = isReward ? '🎁' : isRedeemed ? '✓' : isOrder ? '🛍' : '🔗'

                            return (
                                <div
                                    key={act.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        paddingBottom: '14px',
                                        borderBottom: '1px solid #F3F4F6',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            background: badgeBg,
                                            color: badgeColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '0.875rem',
                                            flexShrink: 0,
                                        }}
                                    >
                                        {icon}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07' }}>
                                                {act.title}
                                            </p>
                                            <span style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>
                                                {act.timestamp}
                                            </span>
                                        </div>
                                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.45 }}>
                                            {act.description}
                                        </p>
                                        {act.orderNumber && (
                                            <Link
                                                href={`/admin/orders/${act.orderId || 'ord-1'}`}
                                                style={{
                                                    display: 'inline-block',
                                                    marginTop: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    color: '#C4975A',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                View Order {act.orderNumber} ↗
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
