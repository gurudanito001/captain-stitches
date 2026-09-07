'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    TOP_REFERRERS_LIST,
    ReferrerPerformance,
    exportAnalyticsCSV,
    DateRangeKey,
} from '@/data/adminAnalyticsData'
import {
    FiShare2,
    FiUsers,
    FiCheckCircle,
    FiAward,
    FiDownload,
    FiArrowLeft,
    FiTrendingUp,
    FiGift,
    FiDollarSign,
    FiMail,
    FiExternalLink,
    FiPercent,
} from '@/components/admin/AnalyticsIcons'

export default function ReferralAnalyticsPage() {
    const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
    const [currency, setCurrency] = useState<'EUR' | 'NGN'>('EUR')
    const [isProgramActive, setIsProgramActive] = useState<boolean>(true)
    const [thankYouModalPatron, setThankYouModalPatron] = useState<ReferrerPerformance | null>(null)

    const handleExport = () => {
        const rows = TOP_REFERRERS_LIST.map((ref, idx) => ({
            Rank: idx + 1,
            Name: ref.name,
            CustomerId: ref.customerId,
            LinksShared: ref.linksGenerated,
            Visits: ref.linkVisits,
            Conversions: ref.conversions,
            ConversionRate: `${ref.conversionRate}%`,
            RevenueEUR: `€${ref.revenueEUR.toLocaleString()}`,
            RevenueNGN: `₦${ref.revenueNGN.toLocaleString()}`,
        }))
        exportAnalyticsCSV('Referral_Intelligence_Report', rows)
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
                {/* Top Nav & Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <Link
                                href="/admin/analytics"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '13px',
                                    color: '#7C6F65',
                                    textDecoration: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #EDE8E1',
                                }}
                            >
                                <FiArrowLeft size={14} /> Back to Overview
                            </Link>
                            <span style={{ fontSize: '13px', color: '#B3A89D' }}>/</span>
                            <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Referrals</span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Referral & Word-of-Mouth Analytics
                        </h1>
                        <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                            Advocate tracking, conversion funnels, reward redemption, and revenue attribution.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Currency Toggle */}
                        <div style={{ display: 'inline-flex', padding: '3px', backgroundColor: '#EDE8E1', borderRadius: '8px' }}>
                            {(['EUR', 'NGN'] as const).map((curr) => (
                                <button
                                    key={curr}
                                    type="button"
                                    onClick={() => setCurrency(curr)}
                                    style={{
                                        padding: '6px 14px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: currency === curr ? '#FFFFFF' : 'transparent',
                                        color: currency === curr ? '#1C0F07' : '#7C6F65',
                                        boxShadow: currency === curr ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {curr === 'EUR' ? '€ EUR' : '₦ NGN'}
                                </button>
                            ))}
                        </div>

                        {/* Programme Status Switch */}
                        <button
                            type="button"
                            onClick={() => setIsProgramActive(!isProgramActive)}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                backgroundColor: isProgramActive ? '#E8F5E9' : '#FFEBEE',
                                color: isProgramActive ? '#2E7D32' : '#C62828',
                                border: isProgramActive ? '1px solid #C8E6C9' : '1px solid #FFCDD2',
                            }}
                        >
                            <span
                                style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    backgroundColor: isProgramActive ? '#2E7D32' : '#C62828',
                                }}
                            ></span>
                            Programme: {isProgramActive ? 'Active' : 'Paused'}
                        </button>

                        {/* Date Range Selector */}
                        <div style={{ display: 'inline-flex', padding: '3px', backgroundColor: '#EDE8E1', borderRadius: '8px' }}>
                            {(['7d', '30d', '3m', '6m', '12m'] as const).map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => setDateRange(range)}
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: dateRange === range ? '#1C0F07' : 'transparent',
                                        color: dateRange === range ? '#FAF7F2' : '#7C6F65',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {range.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleExport}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '9px 16px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #EDE8E1',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                cursor: 'pointer',
                            }}
                        >
                            <FiDownload size={14} color="#C4975A" /> Export Report
                        </button>
                    </div>
                </div>

                {/* Top-Level Referral KPIs */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    {[
                        {
                            label: 'Active Referral Links',
                            value: '84 Links',
                            sub: 'Across 62 patrons',
                            icon: <FiShare2 size={18} color="#C4975A" />,
                        },
                        {
                            label: 'Link Visits & Clicks',
                            value: '648 Clicks',
                            sub: '+19.4% this period',
                            icon: <FiUsers size={18} color="#1565C0" />,
                        },
                        {
                            label: 'Paid Order Conversions',
                            value: '22 Commissions',
                            sub: 'Completed deposits',
                            icon: <FiCheckCircle size={18} color="#2E7D32" />,
                        },
                        {
                            label: 'Referral Conversion Rate',
                            value: '34.2%',
                            sub: 'Signups to order conversion',
                            icon: <FiPercent size={18} color="#2E7D32" />,
                        },
                        {
                            label: 'Attributed Revenue',
                            value: currency === 'EUR' ? '€14,800' : '₦25,900,000',
                            sub: '34.2% of all revenue',
                            icon: <FiDollarSign size={18} color="#C4975A" />,
                        },
                        {
                            label: 'Total Rewards Issued',
                            value: currency === 'EUR' ? '€2,450' : '₦4,287,500',
                            sub: '18 redeemed (86%)',
                            icon: <FiGift size={18} color="#8A5D18" />,
                        },
                    ].map((kpi, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #EDE8E1',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#7C6F65', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {kpi.label}
                                </span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {kpi.icon}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '22px', fontWeight: 700, color: '#1C0F07', marginBottom: '4px' }}>
                                    {kpi.value}
                                </div>
                                <div style={{ fontSize: '12px', color: '#7C6F65' }}>
                                    {kpi.sub}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section 1: 5-Stage Referral Conversion Funnel */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        marginBottom: '32px',
                    }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            5-Stage Referral Conversion Funnel
                        </h2>
                        <p style={{ fontSize: '13px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                            Tracking candidate progression from initial link share to confirmed bespoke deposit.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        {[
                            { stage: '1. Links Shared', count: 84, pct: '100%', drop: '0%', color: '#1C0F07' },
                            { stage: '2. Link Visits', count: 648, pct: '771% reach', drop: '+671%', color: '#C4975A' },
                            { stage: '3. Enquiries / Registered', count: 182, pct: '28.1% of clicks', drop: '-71.9%', color: '#8A5D18' },
                            { stage: '4. Orders Placed', count: 31, pct: '17.0% of enquiries', drop: '-83.0%', color: '#1565C0' },
                            { stage: '5. Deposits Confirmed', count: 22, pct: '71.0% closing', drop: '-29.0%', color: '#2E7D32' },
                        ].map((funnel, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: '#FAF7F2',
                                    borderRadius: '10px',
                                    border: '1px solid #EDE8E1',
                                    padding: '16px',
                                }}
                            >
                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#7C6F65', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    {funnel.stage}
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: funnel.color, marginBottom: '6px' }}>
                                    {funnel.count}
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                                    {funnel.pct}
                                </div>
                                <div style={{ fontSize: '11px', color: '#7C6F65', marginTop: '2px' }}>
                                    Drop-off / Multiplier: {funnel.drop}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Section 2: Top Referrers Leaderboard */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        marginBottom: '32px',
                        overflowX: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Top Atelier Advocates Leaderboard
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                                Patrons generating the highest volume of qualified introductions and bespoke revenue.
                            </p>
                        </div>
                        <Link
                            href="/admin/referrals"
                            style={{
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#C4975A',
                                textDecoration: 'none',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            Manage Referral Programme <FiArrowLeft style={{ transform: 'rotate(180deg)' }} size={14} />
                        </Link>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#7C6F65' }}>Rank</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Advocate Patron</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Links Shared</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Clicks</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Conversions</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Conversion Rate</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Attributed Revenue</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1C0F07' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {TOP_REFERRERS_LIST.map((ref, idx) => (
                                <tr key={ref.customerId} style={{ borderBottom: '1px solid #EDE8E1' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: idx === 0 ? '#C4975A' : '#7C6F65' }}>
                                        {idx === 0 ? '🏆 #1' : `#${idx + 1}`}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    backgroundColor: '#1C0F07',
                                                    color: '#FAF7F2',
                                                    fontSize: '12px',
                                                    fontWeight: 700,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {ref.name.split(' ').map((n) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1C0F07' }}>{ref.name}</div>
                                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>ID: {ref.customerId}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#1C0F07', fontWeight: 600 }}>
                                        {ref.linksGenerated} links
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#7C6F65' }}>
                                        {ref.linkVisits} visits
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2E7D32' }}>
                                        {ref.conversions} orders
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C0F07' }}>
                                        {ref.conversionRate}%
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ fontWeight: 700, color: '#1C0F07' }}>
                                            {currency === 'EUR' ? `€${ref.revenueEUR.toLocaleString()}` : `₦${ref.revenueNGN.toLocaleString()}`}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                            {currency === 'EUR' ? `₦${ref.revenueNGN.toLocaleString()}` : `€${ref.revenueEUR.toLocaleString()}`}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setThankYouModalPatron(ref)}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '6px 10px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#FDF6ED',
                                                    border: '1px solid #F5D38A',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#8A5D18',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                <FiMail size={12} /> Thank
                                            </button>
                                            <Link
                                                href={`/admin/customers/${ref.customerId}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '6px 10px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#FAF7F2',
                                                    border: '1px solid #EDE8E1',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#1C0F07',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                <FiExternalLink size={12} />
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Section 3: Reward Types Performance & Revenue Attribution */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
                    {/* Reward Types Performance */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Reward Incentive Efficacy
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Conversion impact of different reward structures
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                {
                                    incentive: 'Cash Credit (€25 / ₦40,000 on next order)',
                                    conversions: '14 orders',
                                    share: 63.6,
                                    color: '#C4975A',
                                    status: 'Most Popular',
                                },
                                {
                                    incentive: 'Complimentary Silk Pocket Square',
                                    conversions: '5 orders',
                                    share: 22.7,
                                    color: '#1C0F07',
                                    status: 'High Engagement',
                                },
                                {
                                    incentive: '10% Off Companion Fabric Choice',
                                    conversions: '3 orders',
                                    share: 13.7,
                                    color: '#2E7D32',
                                    status: 'Moderate',
                                },
                            ].map((reward, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <div>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                                {reward.incentive}
                                            </span>
                                            <span
                                                style={{
                                                    marginLeft: '8px',
                                                    fontSize: '10px',
                                                    fontWeight: 700,
                                                    color: '#C4975A',
                                                    backgroundColor: '#FAF7F2',
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    border: '1px solid #EDE8E1',
                                                }}
                                            >
                                                {reward.status}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C0F07' }}>
                                            {reward.conversions} ({reward.share}%)
                                        </span>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${reward.share}%`,
                                                height: '100%',
                                                backgroundColor: reward.color,
                                                borderRadius: '4px',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Revenue Attribution Comparison */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Revenue Attribution Breakdown
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Referral programme vs. organic & direct revenue split
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                            <div style={{ flex: 1, height: '36px', borderRadius: '8px', overflow: 'hidden', display: 'flex' }}>
                                <div
                                    style={{
                                        width: '34.2%',
                                        backgroundColor: '#C4975A',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FFFFFF',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                    }}
                                >
                                    Referrals 34.2%
                                </div>
                                <div
                                    style={{
                                        width: '65.8%',
                                        backgroundColor: '#1C0F07',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#FFFFFF',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                    }}
                                >
                                    Organic & Direct 65.8%
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div style={{ padding: '16px', backgroundColor: '#FDF6ED', borderRadius: '8px', border: '1px solid #F5D38A' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#8A5D18', marginBottom: '4px' }}>
                                    Referral Driven Revenue
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C0F07' }}>
                                    {currency === 'EUR' ? '€14,800' : '₦25,900,000'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#7C6F65', marginTop: '4px' }}>
                                    ROI: 6.04x on reward cost
                                </div>
                            </div>

                            <div style={{ padding: '16px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ fontSize: '12px', fontWeight: 600, color: '#7C6F65', marginBottom: '4px' }}>
                                    Organic & Direct Revenue
                                </div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C0F07' }}>
                                    {currency === 'EUR' ? '€28,450' : '₦49,787,500'}
                                </div>
                                <div style={{ fontSize: '11px', color: '#7C6F65', marginTop: '4px' }}>
                                    From search, journal & returning clients
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thank You Note Modal */}
                {thankYouModalPatron && (
                    <div
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(28, 15, 7, 0.45)',
                            backdropFilter: 'blur(3px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 100,
                            padding: '16px',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #EDE8E1',
                                padding: '24px',
                                maxWidth: '480px',
                                width: '100%',
                            }}
                        >
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1C0F07', margin: '0 0 8px 0' }}>
                                Send Atelier Gratitude Note
                            </h3>
                            <p style={{ fontSize: '13px', color: '#7C6F65', margin: '0 0 16px 0' }}>
                                Personal note to <b>{thankYouModalPatron.name}</b> for {thankYouModalPatron.conversions} confirmed bespoke commissions.
                            </p>
                            <textarea
                                defaultValue={`Dear ${thankYouModalPatron.name},\n\nWe wanted to extend our deepest personal gratitude for introducing bespoke clients to the CaptainStitches atelier. Your appreciation for our craft means the world to our master tailors.\n\nWarm regards,\nSamuelson`}
                                rows={5}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    color: '#1C0F07',
                                    fontFamily: 'inherit',
                                    marginBottom: '16px',
                                    boxSizing: 'border-box',
                                }}
                            />
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => setThankYouModalPatron(null)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#FAF7F2',
                                        border: '1px solid #EDE8E1',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#7C6F65',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        alert(`Gratitude note dispatched to ${thankYouModalPatron.name}!`)
                                        setThankYouModalPatron(null)
                                    }}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#1C0F07',
                                        border: 'none',
                                        borderRadius: '6px',
                                        fontSize: '13px',
                                        fontWeight: 600,
                                        color: '#FAF7F2',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Send Note
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
    )
}
