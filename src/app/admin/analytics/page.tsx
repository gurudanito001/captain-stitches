'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    DateRangeKey,
    getOverviewMetrics,
    getRevenueTrend,
    getOrdersTrend,
    exportAnalyticsCSV,
} from '@/data/adminAnalyticsData'

export default function AnalyticsOverviewPage() {
    const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
    const [comparePrevious, setComparePrevious] = useState(true)
    const [revenueMode, setRevenueMode] = useState<'collected' | 'outstanding' | 'expected'>('collected')
    const [hoveredPoint, setHoveredPoint] = useState<any | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const metrics = useMemo(() => {
        return getOverviewMetrics(dateRange, comparePrevious)
    }, [dateRange, comparePrevious])

    const revenueData = useMemo(() => {
        return getRevenueTrend(dateRange)
    }, [dateRange])

    const ordersData = useMemo(() => {
        return getOrdersTrend(dateRange)
    }, [dateRange])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleExport = () => {
        const rows = [
            { Metric: 'Total Orders', Value: metrics.totalOrders, DeltaVsPrior: `+${metrics.ordersDelta}%` },
            { Metric: 'Revenue Collected (EUR)', Value: `€${metrics.totalRevenueEUR.toLocaleString()}`, DeltaVsPrior: `+${metrics.revenueDelta}%` },
            { Metric: 'Revenue Collected (NGN)', Value: `₦${metrics.totalRevenueNGN.toLocaleString()}`, DeltaVsPrior: `+${metrics.revenueDelta}%` },
            { Metric: 'New Customers', Value: metrics.newCustomers, DeltaVsPrior: `+${metrics.customersDelta}%` },
            { Metric: 'Average Order Value (EUR)', Value: `€${metrics.averageOrderValueEUR}`, DeltaVsPrior: `+${metrics.aovDelta}%` },
            { Metric: 'Referral Conversion Rate', Value: `${metrics.referralConversionRate}%`, DeltaVsPrior: `+${metrics.referralDelta}%` },
            { Metric: 'Email Subscriber Growth', Value: `+${metrics.emailSubscriberGrowth}`, DeltaVsPrior: `+${metrics.subscriberDelta}%` },
        ]
        exportAnalyticsCSV('analytics_overview_summary', rows)
        showToast('Exported Analytics Overview CSV')
    }

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 0 80px' }}>
            {/* Toast */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '28px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 500,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                        border: '1px solid #C4975A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* HEADER BAR */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontFamily: 'serif',
                            fontSize: '28px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        Atelier Business Analytics
                    </h1>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                        Holistic cross-channel performance intelligence across commissions, revenue, client retention, and marketing.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Date range dropdown */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E8E2D9',
                            borderRadius: '8px',
                            padding: '3px',
                        }}
                    >
                        {(
                            [
                                { key: '7d', label: '7D' },
                                { key: '30d', label: '30D' },
                                { key: '3m', label: '3M' },
                                { key: '6m', label: '6M' },
                                { key: '12m', label: '12M' },
                            ] as const
                        ).map((r) => (
                            <button
                                key={r.key}
                                type="button"
                                onClick={() => setDateRange(r.key)}
                                style={{
                                    padding: '5px 12px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: dateRange === r.key ? '#1C0F07' : 'transparent',
                                    color: dateRange === r.key ? '#FAF7F2' : '#8C827A',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

                    {/* Compare toggle */}
                    <label
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            cursor: 'pointer',
                            padding: '8px 12px',
                            borderRadius: '8px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E8E2D9',
                        }}
                    >
                        <input
                            type="checkbox"
                            checked={comparePrevious}
                            onChange={(e) => setComparePrevious(e.target.checked)}
                            style={{ accentColor: '#C4975A' }}
                        />
                        Compare to Prior Period
                    </label>

                    {/* Export button */}
                    <button
                        type="button"
                        onClick={handleExport}
                        style={{
                            padding: '9px 16px',
                            borderRadius: '8px',
                            border: '1px solid #E8E2D9',
                            backgroundColor: '#FFFFFF',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Export CSV ⇱
                    </button>
                </div>
            </div>

            {/* TOP LEVEL 6-KPI STRIP WITH COMPARISON DELTAS */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                }}
            >
                {[
                    {
                        label: 'Total Orders',
                        value: metrics.totalOrders,
                        delta: metrics.ordersDelta,
                        sub: 'Completed & in-flight',
                    },
                    {
                        label: 'Revenue Collected',
                        value: `€${metrics.totalRevenueEUR.toLocaleString()}`,
                        subVal: `₦${metrics.totalRevenueNGN.toLocaleString()}`,
                        delta: metrics.revenueDelta,
                        sub: 'Cleared funds',
                    },
                    {
                        label: 'New Customers',
                        value: metrics.newCustomers,
                        delta: metrics.customersDelta,
                        sub: 'First-time patrons',
                    },
                    {
                        label: 'Avg. Order Value',
                        value: `€${metrics.averageOrderValueEUR}`,
                        subVal: `₦${metrics.averageOrderValueNGN.toLocaleString()}`,
                        delta: metrics.aovDelta,
                        sub: 'Per bespoke piece',
                    },
                    {
                        label: 'Referral Conv. Rate',
                        value: `${metrics.referralConversionRate}%`,
                        delta: metrics.referralDelta,
                        sub: 'Referred link purchases',
                    },
                    {
                        label: 'Subscriber Growth',
                        value: `+${metrics.emailSubscriberGrowth}`,
                        delta: metrics.subscriberDelta,
                        sub: 'Net active intake',
                    },
                ].map((kpi, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '14px',
                            border: '1px solid #E8E2D9',
                            padding: '18px 20px',
                            boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                            <span
                                style={{
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: '#8C827A',
                                    fontWeight: 600,
                                }}
                            >
                                {kpi.label}
                            </span>
                            {comparePrevious && (
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        color: kpi.delta >= 0 ? '#4A7C59' : '#C72B2B',
                                    }}
                                >
                                    {kpi.delta >= 0 ? `↑ +${kpi.delta}%` : `↓ ${kpi.delta}%`}
                                </span>
                            )}
                        </div>
                        <div
                            style={{
                                fontFamily: 'serif',
                                fontSize: '24px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '2px',
                            }}
                        >
                            {kpi.value}
                        </div>
                        {kpi.subVal && (
                            <span style={{ fontSize: '11px', color: '#C4975A', fontWeight: 600, display: 'block', marginBottom: '2px' }}>
                                {kpi.subVal}
                            </span>
                        )}
                        <span style={{ fontSize: '11px', color: '#8C827A' }}>{kpi.sub}</span>
                    </div>
                ))}
            </div>

            {/* TWO COLUMN CHARTS: REVENUE OVER TIME & ORDERS OVER TIME */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                    gap: '24px',
                    marginBottom: '28px',
                }}
            >
                {/* 1. REVENUE OVER TIME CHART */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: 0,
                                }}
                            >
                                Revenue Trend & Projections
                            </h2>
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                                Financial collections over the active reporting window
                            </p>
                        </div>

                        {/* Revenue view toggle */}
                        <div
                            style={{
                                display: 'flex',
                                backgroundColor: '#FAF7F2',
                                borderRadius: '8px',
                                padding: '3px',
                                border: '1px solid #E8E2D9',
                            }}
                        >
                            {(
                                [
                                    { key: 'collected', label: 'Collected' },
                                    { key: 'outstanding', label: 'Outstanding' },
                                    { key: 'expected', label: 'Expected (All)' },
                                ] as const
                            ).map((m) => (
                                <button
                                    key={m.key}
                                    type="button"
                                    onClick={() => setRevenueMode(m.key)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: revenueMode === m.key ? '#1C0F07' : 'transparent',
                                        color: revenueMode === m.key ? '#FAF7F2' : '#8C827A',
                                    }}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Chart visual representation */}
                    <div
                        style={{
                            height: '210px',
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            position: 'relative',
                        }}
                    >
                        {hoveredPoint && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                    backgroundColor: '#1C0F07',
                                    color: '#FAF7F2',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    border: '1px solid #C4975A',
                                }}
                            >
                                {hoveredPoint.date}:{' '}
                                <strong>
                                    €
                                    {(revenueMode === 'collected'
                                        ? hoveredPoint.collectedEUR
                                        : revenueMode === 'outstanding'
                                        ? hoveredPoint.outstandingEUR
                                        : hoveredPoint.expectedEUR
                                    ).toLocaleString()}{' '}
                                    (₦
                                    {(revenueMode === 'collected'
                                        ? hoveredPoint.collectedNGN
                                        : revenueMode === 'outstanding'
                                        ? hoveredPoint.outstandingNGN
                                        : hoveredPoint.expectedNGN
                                    ).toLocaleString()}
                                    )
                                </strong>
                            </div>
                        )}

                        <div
                            style={{
                                height: '160px',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                gap: '14px',
                                borderBottom: '1px solid #E8E2D9',
                                padding: '0 8px',
                            }}
                        >
                            {revenueData.map((pt, i) => {
                                const val =
                                    revenueMode === 'collected'
                                        ? pt.collectedEUR
                                        : revenueMode === 'outstanding'
                                        ? pt.outstandingEUR
                                        : pt.expectedEUR
                                const maxVal = Math.max(...revenueData.map((d) => d.expectedEUR)) || 1
                                const heightPct = Math.max(14, Math.round((val / maxVal) * 100))

                                return (
                                    <div
                                        key={i}
                                        onMouseEnter={() => setHoveredPoint(pt)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                        style={{
                                            flex: 1,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                maxWidth: '44px',
                                                height: `${heightPct}%`,
                                                backgroundColor:
                                                    revenueMode === 'outstanding'
                                                        ? '#C72B2B'
                                                        : revenueMode === 'expected'
                                                        ? '#C4975A'
                                                        : '#4A7C59',
                                                borderRadius: '6px 6px 0 0',
                                                transition: 'all 0.2s ease',
                                            }}
                                        />
                                    </div>
                                )
                            })}
                        </div>

                        {/* X-axis labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 8px 0', fontSize: '11px', color: '#8C827A' }}>
                            {revenueData.map((pt, i) => (
                                <span key={i}>{pt.date}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. ORDERS OVER TIME CHART (STACKED ITALY / NIGERIA) */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
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
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: 0,
                                }}
                            >
                                Orders by Regional Destination
                            </h2>
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                                Stacked breakdown between European and Nigerian clients
                            </p>
                        </div>

                        {/* Legend */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#2C618C', fontWeight: 600 }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#2C618C' }} />
                                Italy
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#4A7C59', fontWeight: 600 }}>
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4A7C59' }} />
                                Nigeria
                            </span>
                        </div>
                    </div>

                    {/* Stacked Bars */}
                    <div
                        style={{
                            height: '210px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}
                    >
                        <div
                            style={{
                                height: '160px',
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                gap: '14px',
                                borderBottom: '1px solid #E8E2D9',
                                padding: '0 8px',
                            }}
                        >
                            {ordersData.map((pt, i) => {
                                const maxOrders = Math.max(...ordersData.map((d) => d.totalCount)) || 1
                                const italyHeightPct = Math.round((pt.italyCount / maxOrders) * 100)
                                const nigeriaHeightPct = Math.round((pt.nigeriaCount / maxOrders) * 100)

                                return (
                                    <div
                                        key={i}
                                        title={`${pt.date}: ${pt.italyCount} Italy / ${pt.nigeriaCount} Nigeria (${pt.totalCount} total)`}
                                        style={{
                                            flex: 1,
                                            height: '100%',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                maxWidth: '44px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                borderRadius: '6px 6px 0 0',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {/* Italy on top */}
                                            <div
                                                style={{
                                                    height: `${italyHeightPct}%`,
                                                    minHeight: '4px',
                                                    backgroundColor: '#2C618C',
                                                }}
                                            />
                                            {/* Nigeria on bottom */}
                                            <div
                                                style={{
                                                    height: `${nigeriaHeightPct}%`,
                                                    minHeight: '4px',
                                                    backgroundColor: '#4A7C59',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* X-axis */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 8px 0', fontSize: '11px', color: '#8C827A' }}>
                            {ordersData.map((pt, i) => (
                                <span key={i}>{pt.date}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4 QUICK STAT CARDS */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                }}
            >
                {[
                    {
                        category: 'Top Performing Design',
                        title: 'The Grand Agbada (3-Piece)',
                        metric: '42 commissions this period',
                        sub: '€10,800 / ₦18.9M generated',
                        link: '/admin/analytics/catalogue',
                    },
                    {
                        category: 'Top Ambassador',
                        title: 'Dr. Chinedu Okafor',
                        metric: '8 paid order conversions',
                        sub: '€3,200 attributed revenue',
                        link: '/admin/analytics/referrals',
                    },
                    {
                        category: 'Top Editorial Manuscript',
                        title: 'The Art of the Agbada',
                        metric: '1,420 unique readers',
                        sub: '28 orders in attribution path',
                        link: '/admin/analytics/marketing',
                    },
                    {
                        category: 'Leading Category',
                        title: 'Native Ceremonial Wear',
                        metric: '58% of total volume',
                        sub: 'Highest average order value',
                        link: '/admin/analytics/orders',
                    },
                ].map((stat, i) => (
                    <div
                        key={i}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '14px',
                            border: '1px solid #E8E2D9',
                            padding: '18px 20px',
                            boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em',
                                color: '#8C827A',
                                fontWeight: 600,
                                display: 'block',
                                marginBottom: '6px',
                            }}
                        >
                            {stat.category}
                        </span>
                        <h3
                            style={{
                                fontFamily: 'serif',
                                fontSize: '16px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: '0 0 6px',
                            }}
                        >
                            {stat.title}
                        </h3>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#C4975A', marginBottom: '2px' }}>
                            {stat.metric}
                        </div>
                        <span style={{ fontSize: '11px', color: '#8C827A', display: 'block' }}>{stat.sub}</span>
                    </div>
                ))}
            </div>

            {/* 6 SUB-ANALYTICS NAVIGATION TILES */}
            <div>
                <div style={{ marginBottom: '18px' }}>
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '20px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        Domain Analytics Suites
                    </h2>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                        Deep-dive telemetry and granular reports for specific operational areas.
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '18px',
                    }}
                >
                    {[
                        {
                            title: 'Order Analytics',
                            href: '/admin/analytics/orders',
                            kpi: '96.4% On-Time Delivery',
                            desc: 'Production bottlenecks, stage drop-offs, and 7-stage order funnel.',
                        },
                        {
                            title: 'Revenue Analytics',
                            href: '/admin/analytics/revenue',
                            kpi: '€10,514 Collected / ₦18.4M',
                            desc: 'Currency splits, gateway comparison (Stripe/Paystack), and outstanding balances.',
                        },
                        {
                            title: 'Customer Analytics',
                            href: '/admin/analytics/customers',
                            kpi: '44% Repeat Order Rate',
                            desc: 'Lifetime value (LTV), acquisition channels, and 6-month retention cohort matrix.',
                        },
                        {
                            title: 'Catalogue Analytics',
                            href: '/admin/analytics/catalogue',
                            kpi: 'Top: Grand Agbada (42)',
                            desc: 'Design volume rankings, fabric/colour popularity, and dormant items.',
                        },
                        {
                            title: 'Referral Analytics',
                            href: '/admin/analytics/referrals',
                            kpi: '34.2% Referral Conversion',
                            desc: 'Ambassador performance, reward type efficacy, and revenue attribution.',
                        },
                        {
                            title: 'Blog & Marketing Analytics',
                            href: '/admin/analytics/marketing',
                            kpi: '58.2% Email Open Rate',
                            desc: 'Journal readership, Google Search rankings, and newsletter campaign analysis.',
                        },
                    ].map((tile, i) => (
                        <Link
                            key={i}
                            href={tile.href}
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '14px',
                                border: '1px solid #E8E2D9',
                                padding: '22px',
                                textDecoration: 'none',
                                boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                transition: 'transform 0.15s ease, border-color 0.15s ease',
                            }}
                        >
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <h3
                                        style={{
                                            fontFamily: 'serif',
                                            fontSize: '17px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            margin: 0,
                                        }}
                                    >
                                        {tile.title}
                                    </h3>
                                    <span style={{ fontSize: '15px', color: '#C4975A' }}>→</span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#8C827A', lineHeight: 1.5, margin: '0 0 14px' }}>
                                    {tile.desc}
                                </p>
                            </div>
                            <div
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    color: '#C4975A',
                                }}
                            >
                                {tile.kpi}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
