'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    DateRangeKey,
    ORDER_FUNNEL_STAGES,
    PRODUCTION_BENCHMARKS,
    getOrdersTrend,
    exportAnalyticsCSV,
} from '@/data/adminAnalyticsData'

export default function OrderAnalyticsPage() {
    const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
    const [ordersFilter, setOrdersFilter] = useState<'all' | 'new' | 'completed'>('all')
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const ordersTrend = useMemo(() => {
        return getOrdersTrend(dateRange)
    }, [dateRange])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleExport = () => {
        const rows = ORDER_FUNNEL_STAGES.map((s) => ({
            Stage: s.label,
            ActiveCount: s.count,
            StageLossRate: `${s.dropoffRate}%`,
            AverageDaysInStage: `${s.avgDays} days`,
        }))
        exportAnalyticsCSV('order_funnel_and_production_analytics', rows)
        showToast('Exported Order Analytics CSV')
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

            {/* HEADER */}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8C827A', marginBottom: '8px' }}>
                        <Link href="/admin/analytics" style={{ color: '#8C827A', textDecoration: 'none' }}>
                            Analytics
                        </Link>
                        <span>/</span>
                        <span style={{ color: '#C4975A' }}>Orders</span>
                    </div>

                    <h1
                        style={{
                            fontFamily: 'serif',
                            fontSize: '28px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        Order Pipeline & Production Analytics
                    </h1>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                        Turnaround times, bottleneck identification, stage conversion funnels, and workshop velocity.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                }}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>

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

            {/* KPI STRIP (6 CARDS) */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                }}
            >
                {[
                    { label: 'Total Orders Placed', value: '120', sub: 'In selected period', color: '#1C0F07' },
                    { label: 'Orders Delivered', value: '92', sub: 'Successfully received', color: '#4A7C59' },
                    { label: 'Active In Production', value: '26', sub: 'Currently in workshop', color: '#2C618C' },
                    { label: 'On-Time Delivery Rate', value: '96.4%', sub: 'Target benchmark: 95%', color: '#4A7C59' },
                    { label: 'Avg. Turnaround Time', value: '14.2 Days', sub: 'Order to European door', color: '#C4975A' },
                    { label: 'Common Active Stage', value: 'In Production', sub: 'Aba master tailors', color: '#8C827A' },
                ].map((kpi, i) => (
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
                            {kpi.label}
                        </span>
                        <div
                            style={{
                                fontFamily: 'serif',
                                fontSize: '24px',
                                fontWeight: 600,
                                color: kpi.color,
                                marginBottom: '4px',
                            }}
                        >
                            {kpi.value}
                        </div>
                        <span style={{ fontSize: '11px', color: '#8C827A' }}>{kpi.sub}</span>
                    </div>
                ))}
            </div>

            {/* 7-STAGE ORDER CONVERSION FUNNEL */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    padding: '24px',
                    marginBottom: '28px',
                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                }}
            >
                <div style={{ marginBottom: '20px' }}>
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        7-Stage Order Pipeline Progression Funnel
                    </h2>
                    <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                        Volume progression from initial commission enquiry down to final delivery, with bottleneck drop-off rates
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {ORDER_FUNNEL_STAGES.map((st, i) => {
                        const widthPct = Math.max(20, Math.round((st.count / 120) * 100))
                        return (
                            <div key={i}>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '13px',
                                        marginBottom: '6px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <strong style={{ color: '#1C0F07' }}>{st.label}</strong>
                                        <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                            (Avg {st.avgDays} days)
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        {st.dropoffRate > 0 && (
                                            <span style={{ fontSize: '11px', color: '#C72B2B', fontWeight: 600 }}>
                                                Drop-off: -{st.dropoffRate}%
                                            </span>
                                        )}
                                        <strong style={{ color: '#1C0F07' }}>{st.count} orders</strong>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        height: '14px',
                                        backgroundColor: '#FAF7F2',
                                        borderRadius: '7px',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: `${widthPct}%`,
                                            height: '100%',
                                            backgroundColor:
                                                i === 0
                                                    ? '#C4975A'
                                                    : i === 1
                                                    ? '#A06B28'
                                                    : i === 2
                                                    ? '#2C618C'
                                                    : i === 3
                                                    ? '#3A7DAD'
                                                    : i === 4
                                                    ? '#4A7C59'
                                                    : i === 5
                                                    ? '#5E9B6F'
                                                    : '#78B88C',
                                            borderRadius: '7px',
                                            transition: 'width 0.4s ease',
                                        }}
                                    />
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* TWO COLUMN GRID: PRODUCTION BENCHMARKS & DEPOSIT CONVERSION */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                    gap: '24px',
                    marginBottom: '28px',
                }}
            >
                {/* 1. PRODUCTION STAGE BENCHMARKS */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div style={{ marginBottom: '18px' }}>
                        <h2
                            style={{
                                fontFamily: 'serif',
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: '0 0 4px',
                            }}
                        >
                            Production Velocity & SLA Benchmarks
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                            Actual turnaround days compared against atelier SLA targets
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {PRODUCTION_BENCHMARKS.map((item, idx) => (
                            <div
                                key={idx}
                                style={{
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    backgroundColor: item.isDelayed ? 'rgba(199, 43, 43, 0.04)' : '#FAF7F2',
                                    border: `1px solid ${item.isDelayed ? 'rgba(199, 43, 43, 0.2)' : '#E8E2D9'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div>
                                    <strong style={{ fontSize: '13px', color: '#1C0F07', display: 'block' }}>
                                        {item.stageName}
                                    </strong>
                                    <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                        Target: {item.targetDays} days
                                    </span>
                                </div>

                                <div style={{ textAlign: 'right' }}>
                                    <span
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 700,
                                            color: item.isDelayed ? '#C72B2B' : '#4A7C59',
                                        }}
                                    >
                                        {item.actualDays} Days
                                    </span>
                                    <span
                                        style={{
                                            display: 'block',
                                            fontSize: '10px',
                                            fontWeight: 600,
                                            color: item.isDelayed ? '#C72B2B' : '#4A7C59',
                                        }}
                                    >
                                        {item.isDelayed ? 'Over Target (+0.2d)' : 'On Schedule'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. DEPOSIT PAYMENT TURNAROUND & ABANDONMENT */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div style={{ marginBottom: '18px' }}>
                        <h2
                            style={{
                                fontFamily: 'serif',
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: '0 0 4px',
                            }}
                        >
                            50% Deposit Settlement Speed
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                            How rapidly patrons settle the required upfront 50% bespoke commitment
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {[
                            { label: 'Paid within 24 Hours', percentage: 68, color: '#4A7C59' },
                            { label: 'Paid within 48 Hours', percentage: 18, color: '#C4975A' },
                            { label: 'Paid within 72 Hours', percentage: 8, color: '#3A7DAD' },
                            { label: 'Over 72 Hours', percentage: 4, color: '#8C827A' },
                            { label: 'Abandoned (Unpaid Deposit)', percentage: 2, color: '#C72B2B' },
                        ].map((tier, idx) => (
                            <div key={idx}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 500, color: '#1C0F07' }}>{tier.label}</span>
                                    <strong style={{ color: tier.color }}>{tier.percentage}%</strong>
                                </div>
                                <div style={{ height: '7px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: `${tier.percentage}%`,
                                            height: '100%',
                                            backgroundColor: tier.color,
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>

                    <div
                        style={{
                            marginTop: '22px',
                            padding: '14px',
                            borderRadius: '10px',
                            backgroundColor: '#FAF5EE',
                            border: '1px solid #E8DED1',
                            fontSize: '12px',
                            color: '#4A3D36',
                            lineHeight: 1.5,
                        }}
                    >
                        <strong>Automated Recovery:</strong> Patrons who have not settled deposits within 48h automatically receive a WhatsApp reminder linking directly to Paystack/Stripe checkout.
                    </div>
                </div>
            </div>

            {/* TWO COLUMN GRID: CATEGORY BREAKDOWN & OVERDUE TREND */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '24px',
                }}
            >
                {/* Orders by Garment Category */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 16px',
                        }}
                    >
                        Orders by Garment Category
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { category: 'Native Wear (Agbada & Senator)', count: 70, pct: 58, color: '#C4975A' },
                            { category: 'English Suits (Blazers & Trousers)', count: 28, pct: 23, color: '#2C618C' },
                            { category: 'Casual (Safari Shirts & Kaftans)', count: 18, pct: 15, color: '#4A7C59' },
                            { category: "Children's Ceremonial Sets", count: 4, pct: 4, color: '#8C827A' },
                        ].map((cat, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                    <span style={{ fontWeight: 500, color: '#1C0F07' }}>{cat.category}</span>
                                    <span style={{ color: '#8C827A' }}>
                                        {cat.count} orders ({cat.pct}%)
                                    </span>
                                </div>
                                <div style={{ height: '7px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div
                                        style={{
                                            width: `${cat.pct}%`,
                                            height: '100%',
                                            backgroundColor: cat.color,
                                            borderRadius: '4px',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Overdue Orders Trend */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        Overdue Commissions Trend
                    </h2>
                    <p style={{ fontSize: '12px', color: '#8C827A', margin: '0 0 16px' }}>
                        Overdue rates remain under 3.5%, primarily triggered by fabric import transit delays
                    </p>

                    <div
                        style={{
                            height: '140px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            gap: '12px',
                            borderBottom: '1px solid #E8E2D9',
                            padding: '0 8px',
                        }}
                    >
                        {[
                            { month: 'Apr', count: 1 },
                            { month: 'May', count: 2 },
                            { month: 'Jun', count: 1 },
                            { month: 'Jul', count: 0 },
                            { month: 'Aug', count: 2 },
                            { month: 'Sep', count: 1 },
                        ].map((pt, i) => (
                            <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                                <span style={{ fontSize: '11px', fontWeight: 600, color: '#C72B2B', display: 'block', marginBottom: '4px' }}>
                                    {pt.count}
                                </span>
                                <div
                                    style={{
                                        height: `${Math.max(10, pt.count * 40)}px`,
                                        backgroundColor: pt.count > 0 ? '#C72B2B' : '#E8E2D9',
                                        borderRadius: '4px 4px 0 0',
                                    }}
                                />
                                <span style={{ fontSize: '10px', color: '#8C827A', display: 'block', marginTop: '6px' }}>
                                    {pt.month}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
