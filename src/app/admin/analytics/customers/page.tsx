'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    RETENTION_COHORTS,
    exportAnalyticsCSV,
    EUR_TO_NGN_RATE,
    DateRangeKey,
} from '@/data/adminAnalyticsData'
import { getAllCustomers, AdminCustomer } from '@/data/adminCustomersData'
import {
    FiUsers,
    FiTrendingUp,
    FiRepeat,
    FiAward,
    FiAlertCircle,
    FiDownload,
    FiArrowUpRight,
    FiArrowDownRight,
    FiArrowLeft,
    FiSend,
    FiExternalLink,
    FiUserCheck,
    FiPieChart,
} from '@/components/admin/AnalyticsIcons'

export default function CustomerAnalyticsPage() {
    const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
    const [customers, setCustomers] = useState<AdminCustomer[]>([])
    const [currency, setCurrency] = useState<'EUR' | 'NGN'>('EUR')

    useEffect(() => {
        const list = getAllCustomers()
        setCustomers(list)
    }, [])

    // Top 10 customers by spend
    const sortedCustomers = [...customers].sort((a, b) => b.summary.totalSpentEUR - a.summary.totalSpentEUR).slice(0, 10)

    // Inactive customers (>90 days without an order)
    const inactiveCustomers = customers.filter((c) => {
        if (!c.summary.lastOrderDate) return false
        const lastOrderTime = new Date(c.summary.lastOrderDate).getTime()
        const diffDays = (Date.now() - lastOrderTime) / (1000 * 60 * 60 * 24)
        return diffDays >= 90
    })

    const handleExport = () => {
        const rows = sortedCustomers.map((c, index) => ({
            Rank: index + 1,
            Name: c.name,
            Email: c.email,
            Location: c.location,
            TotalOrders: c.summary.totalOrders,
            TotalSpendEUR: `€${c.summary.totalSpentEUR.toLocaleString()}`,
            TotalSpendNGN: `₦${c.summary.totalSpentNGN.toLocaleString()}`,
            LastOrder: c.summary.lastOrderDate || 'None',
            Referrals: c.summary.referralCount,
        }))
        exportAnalyticsCSV('Customer_Analytics_Report', rows)
    }

    // Cohort background helper
    const getCohortBg = (pct: number) => {
        if (pct === 0) return '#FAF7F2'
        if (pct >= 50) return 'rgba(46, 125, 50, 0.22)'
        if (pct >= 40) return 'rgba(46, 125, 50, 0.16)'
        if (pct >= 30) return 'rgba(46, 125, 50, 0.11)'
        return 'rgba(46, 125, 50, 0.06)'
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
                            <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Customers</span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Customer Analytics & Retention
                        </h1>
                        <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                            Cohort retention rates, patron lifetime value, and acquisition intelligence.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Currency Toggle */}
                        <div
                            style={{
                                display: 'inline-flex',
                                padding: '3px',
                                backgroundColor: '#EDE8E1',
                                borderRadius: '8px',
                            }}
                        >
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

                        {/* Date Range Selector */}
                        <div
                            style={{
                                display: 'inline-flex',
                                padding: '3px',
                                backgroundColor: '#EDE8E1',
                                borderRadius: '8px',
                            }}
                        >
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

                {/* KPI Strip */}
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
                            label: 'Total Customer Base',
                            value: '148',
                            delta: '+12.4%',
                            isPositive: true,
                            sub: 'All time verified patrons',
                            icon: <FiUsers size={18} color="#C4975A" />,
                        },
                        {
                            label: 'New Patrons in Period',
                            value: '24',
                            delta: '+18.2%',
                            isPositive: true,
                            sub: 'First order placed',
                            icon: <FiUserCheck size={18} color="#2E7D32" />,
                        },
                        {
                            label: 'Repeat Patron Rate',
                            value: '64.2%',
                            delta: '+5.4%',
                            isPositive: true,
                            sub: '2+ bespoke commissions',
                            icon: <FiRepeat size={18} color="#1565C0" />,
                        },
                        {
                            label: 'Average Patron LTV',
                            value: currency === 'EUR' ? '€1,057' : '₦1,850,000',
                            delta: '+8.2%',
                            isPositive: true,
                            sub: 'Lifetime bespoke spend',
                            icon: <FiAward size={18} color="#C4975A" />,
                        },
                        {
                            label: 'Churn / Inactivity Rate',
                            value: '11.4%',
                            delta: '-2.1%',
                            isPositive: true,
                            sub: 'No order in 6+ months',
                            icon: <FiAlertCircle size={18} color="#7C6F65" />,
                        },
                        {
                            label: 'Top Acquisition Channel',
                            value: 'Referrals (38%)',
                            delta: '+6.5%',
                            isPositive: true,
                            sub: 'Word-of-mouth & links',
                            icon: <FiPieChart size={18} color="#C4975A" />,
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
                                <div style={{ fontSize: '24px', fontWeight: 700, color: '#1C0F07', marginBottom: '4px' }}>
                                    {kpi.value}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '2px',
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: kpi.isPositive ? '#2E7D32' : '#C62828',
                                        }}
                                    >
                                        {kpi.isPositive ? <FiArrowUpRight size={12} /> : <FiArrowDownRight size={12} />}
                                        {kpi.delta}
                                    </span>
                                    <span style={{ fontSize: '11px', color: '#B3A89D' }}>vs prev</span>
                                </div>
                                <div style={{ fontSize: '11px', color: '#7C6F65', marginTop: '4px' }}>
                                    {kpi.sub}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section 1: Customer Acquisition & Channel Breakdown */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    {/* Stacked Bars: New vs Returning Customers */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Patron Acquisition & Repeat Orders
                                </h2>
                                <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                    Monthly new vs. returning bespoke clients
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1C0F07' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#C4975A' }}></span>
                                    Returning
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#1C0F07' }}>
                                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#1C0F07' }}></span>
                                    New Patrons
                                </span>
                            </div>
                        </div>

                        {/* Visual Chart */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {[
                                { month: 'Apr', newC: 8, retC: 14, total: 22 },
                                { month: 'May', newC: 11, retC: 17, total: 28 },
                                { month: 'Jun', newC: 12, retC: 20, total: 32 },
                                { month: 'Jul', newC: 10, retC: 18, total: 28 },
                                { month: 'Aug', newC: 15, retC: 23, total: 38 },
                                { month: 'Sep', newC: 16, retC: 27, total: 43 },
                            ].map((bar) => {
                                const newPct = (bar.newC / 50) * 100
                                const retPct = (bar.retC / 50) * 100
                                return (
                                    <div key={bar.month} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ width: '36px', fontSize: '12px', fontWeight: 600, color: '#7C6F65' }}>
                                            {bar.month}
                                        </span>
                                        <div
                                            style={{
                                                flex: 1,
                                                height: '24px',
                                                backgroundColor: '#FAF7F2',
                                                borderRadius: '6px',
                                                display: 'flex',
                                                overflow: 'hidden',
                                                position: 'relative',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: `${retPct}%`,
                                                    backgroundColor: '#C4975A',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#FFFFFF',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                }}
                                                title={`Returning: ${bar.retC}`}
                                            >
                                                {bar.retC}
                                            </div>
                                            <div
                                                style={{
                                                    width: `${newPct}%`,
                                                    backgroundColor: '#1C0F07',
                                                    height: '100%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#FFFFFF',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                }}
                                                title={`New: ${bar.newC}`}
                                            >
                                                {bar.newC}
                                            </div>
                                        </div>
                                        <span style={{ width: '40px', fontSize: '12px', fontWeight: 700, color: '#1C0F07', textAlign: 'right' }}>
                                            {bar.total}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Acquisition Channels Breakdown */}
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
                                Acquisition Channels
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Primary origin point of client introductions
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { name: 'Client Referrals (Word of Mouth)', percentage: 38.5, count: 57, color: '#C4975A' },
                                { name: 'Editorial Journal & Organic SEO', percentage: 26.2, count: 39, color: '#1C0F07' },
                                { name: 'Direct Diaspora Outreach (Italy & UK)', percentage: 18.4, count: 27, color: '#2E7D32' },
                                { name: 'Instagram & Sartorial Showcases', percentage: 11.6, count: 17, color: '#D48A37' },
                                { name: 'Private Trunk Shows & Bespoke Fittings', percentage: 5.3, count: 8, color: '#1565C0' },
                            ].map((ch, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: ch.color }}></span>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                                {ch.name}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#7C6F65' }}>{ch.count} patrons</span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>{ch.percentage}%</span>
                                        </div>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${ch.percentage}%`,
                                                height: '100%',
                                                backgroundColor: ch.color,
                                                borderRadius: '4px',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 2: Patron Spend Tiers & Order Frequency */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    {/* Patron Spend Tiers */}
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
                                Patron Spend Tiers
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Value distribution across the customer directory
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                {
                                    tier: 'VIP Connoisseurs',
                                    threshold: currency === 'EUR' ? '> €1,150' : '> ₦2,000,000',
                                    count: 28,
                                    pct: '18.9%',
                                    revenueShare: '48.2%',
                                    badgeBg: '#FDF6ED',
                                    badgeColor: '#C4975A',
                                },
                                {
                                    tier: 'Regular Bespoke Patrons',
                                    threshold: currency === 'EUR' ? '€300 – €1,150' : '₦500k – ₦2.0M',
                                    count: 67,
                                    pct: '45.3%',
                                    revenueShare: '39.6%',
                                    badgeBg: '#F0F4EC',
                                    badgeColor: '#2E7D32',
                                },
                                {
                                    tier: 'First-Time Clients',
                                    threshold: currency === 'EUR' ? '< €300' : '< ₦500,000',
                                    count: 42,
                                    pct: '28.4%',
                                    revenueShare: '12.2%',
                                    badgeBg: '#EDF4FB',
                                    badgeColor: '#1565C0',
                                },
                                {
                                    tier: 'Registered Prospects',
                                    threshold: '0 orders (Enquired)',
                                    count: 11,
                                    pct: '7.4%',
                                    revenueShare: '0.0%',
                                    badgeBg: '#F5F5F5',
                                    badgeColor: '#7C6F65',
                                },
                            ].map((tier, idx) => (
                                <div
                                    key={idx}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '10px',
                                        backgroundColor: '#FAF7F2',
                                        border: '1px solid #EDE8E1',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                color: tier.badgeColor,
                                                backgroundColor: tier.badgeBg,
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            {tier.tier}
                                        </span>
                                        <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>
                                            {tier.count}
                                        </span>
                                    </div>
                                    <div style={{ fontSize: '11px', color: '#7C6F65', marginBottom: '8px' }}>
                                        Spend: {tier.threshold}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#1C0F07' }}>
                                        <span>Patron Base: <b>{tier.pct}</b></span>
                                        <span>Revenue Share: <b>{tier.revenueShare}</b></span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Order Frequency Distribution */}
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
                                Order Frequency Distribution
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Volume of repeat commissions per individual patron
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { range: '1 Commission (Single Order)', percentage: 35.8, count: 53, color: '#7C6F65' },
                                { range: '2–3 Commissions', percentage: 41.2, count: 61, color: '#C4975A' },
                                { range: '4–6 Commissions', percentage: 16.2, count: 24, color: '#2E7D32' },
                                { range: '7+ Commissions (Wardrobe Patrons)', percentage: 6.8, count: 10, color: '#1C0F07' },
                            ].map((freq, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                            {freq.range}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#7C6F65' }}>{freq.count} patrons</span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>{freq.percentage}%</span>
                                        </div>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${freq.percentage}%`,
                                                height: '100%',
                                                backgroundColor: freq.color,
                                                borderRadius: '4px',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 3: Cohort Retention Heatmap Matrix */}
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
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                6-Month Retention Cohort Analysis
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                                Percentage of patrons in each acquisition cohort placing subsequent bespoke orders over time.
                            </p>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#7C6F65' }}>
                            <span>Retention intensity:</span>
                            <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: 'rgba(46, 125, 50, 0.06)', borderRadius: '2px' }}></span>
                            <span>&lt;30%</span>
                            <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: 'rgba(46, 125, 50, 0.16)', borderRadius: '2px' }}></span>
                            <span>30–45%</span>
                            <span style={{ display: 'inline-block', width: '14px', height: '14px', backgroundColor: 'rgba(46, 125, 50, 0.25)', borderRadius: '2px' }}></span>
                            <span>50%+</span>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#1C0F07' }}>Cohort Month</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>New Patrons</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Month 0</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Month 1</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Month 2</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Month 3</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Month 4</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Month 5</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Month 6</th>
                            </tr>
                        </thead>
                        <tbody>
                            {RETENTION_COHORTS.map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #EDE8E1' }}>
                                    <td style={{ padding: '14px 16px', textAlign: 'left', fontWeight: 600, color: '#1C0F07' }}>
                                        {row.month}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#7C6F65' }}>
                                        {row.initialSize}
                                    </td>
                                    <td style={{ padding: '14px 16px', backgroundColor: 'rgba(46, 125, 50, 0.25)', fontWeight: 700, color: '#1B5E20' }}>
                                        100%
                                    </td>
                                    <td style={{ padding: '14px 16px', backgroundColor: getCohortBg(row.m1), fontWeight: 600, color: '#1B5E20' }}>
                                        {row.m1 > 0 ? `${row.m1}%` : '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px', backgroundColor: getCohortBg(row.m2), fontWeight: 600, color: '#1B5E20' }}>
                                        {row.m2 > 0 ? `${row.m2}%` : '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px', backgroundColor: getCohortBg(row.m3), fontWeight: 600, color: '#1B5E20' }}>
                                        {row.m3 > 0 ? `${row.m3}%` : '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px', backgroundColor: getCohortBg(row.m4), fontWeight: 600, color: '#1B5E20' }}>
                                        {row.m4 > 0 ? `${row.m4}%` : '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px', backgroundColor: getCohortBg(row.m5), fontWeight: 600, color: '#1B5E20' }}>
                                        {row.m5 > 0 ? `${row.m5}%` : '—'}
                                    </td>
                                    <td style={{ padding: '14px 16px', backgroundColor: getCohortBg(row.m6), fontWeight: 600, color: '#1B5E20' }}>
                                        {row.m6 > 0 ? `${row.m6}%` : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Section 4: Top 10 Patrons by Lifetime Spend */}
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
                                Top 10 Patrons by Lifetime Spend
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                                Most loyal and high-value atelier clients
                            </p>
                        </div>
                        <Link
                            href="/admin/customers"
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
                            View All Patrons <FiArrowUpRight size={14} />
                        </Link>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#7C6F65' }}>Rank</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Patron</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Location</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Commissions</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Lifetime Spend</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Last Order</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Referrals</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1C0F07' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedCustomers.map((cust, idx) => (
                                <tr key={cust.id} style={{ borderBottom: '1px solid #EDE8E1' }}>
                                    <td style={{ padding: '14px 16px', fontWeight: 700, color: idx < 3 ? '#C4975A' : '#7C6F65' }}>
                                        #{idx + 1}
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
                                                {cust.name.split(' ').map((n) => n[0]).join('')}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1C0F07' }}>{cust.name}</div>
                                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>{cust.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '12px' }}>
                                        {cust.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C0F07' }}>
                                        {cust.summary.totalOrders} orders
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ fontWeight: 700, color: '#1C0F07' }}>
                                            {currency === 'EUR' ? `€${cust.summary.totalSpentEUR.toLocaleString()}` : `₦${cust.summary.totalSpentNGN.toLocaleString()}`}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                            {currency === 'EUR' ? `₦${cust.summary.totalSpentNGN.toLocaleString()}` : `€${cust.summary.totalSpentEUR.toLocaleString()}`}
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#7C6F65' }}>
                                        {cust.summary.lastOrderDate || 'None'}
                                    </td>
                                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#C4975A' }}>
                                        {cust.summary.referralCount} introduced
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                        <Link
                                            href={`/admin/customers/${cust.id}`}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '4px',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                backgroundColor: '#FAF7F2',
                                                border: '1px solid #EDE8E1',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                color: '#1C0F07',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            Profile <FiExternalLink size={12} />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Section 5: Inactive Patrons Cohort (90+ Days Dormant) */}
                <div
                    style={{
                        backgroundColor: '#FFF8F6',
                        borderRadius: '12px',
                        border: '1px solid #FFCDD2',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FFEBEE',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#C62828',
                                }}
                            >
                                <FiAlertCircle size={20} />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#B71C1C', margin: 0 }}>
                                    Inactive Patrons Cohort ({inactiveCustomers.length} Dormant 90+ Days)
                                </h3>
                                <p style={{ fontSize: '13px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                    Clients who appreciated past bespoke garments but haven&apos;t commissioned within the last quarter.
                                </p>
                            </div>
                        </div>

                        <Link
                            href="/admin/marketing/campaigns/new?segment=dormant_90d"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '10px 18px',
                                backgroundColor: '#C62828',
                                color: '#FFFFFF',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            <FiSend size={14} /> Send Re-Engagement Campaign
                        </Link>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                        {inactiveCustomers.slice(0, 4).map((c) => (
                            <div
                                key={c.id}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '8px',
                                    border: '1px solid #FFCDD2',
                                    padding: '12px 16px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>{c.name}</div>
                                    <div style={{ fontSize: '11px', color: '#7C6F65' }}>Last order: {c.summary.lastOrderDate}</div>
                                </div>
                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#C4975A' }}>
                                    €{c.summary.totalSpentEUR.toLocaleString()} LTV
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    )
}
