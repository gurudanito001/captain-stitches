'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
    DateRangeKey,
    EUR_TO_NGN_RATE,
    getRevenueTrend,
    OUTSTANDING_BALANCES_LIST,
    exportAnalyticsCSV,
} from '@/data/adminAnalyticsData'

export default function RevenueAnalyticsPage() {
    const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
    const [currency, setCurrency] = useState<'EUR' | 'NGN'>('EUR')
    const [granularity, setGranularity] = useState<'monthly' | 'weekly'>('monthly')
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    const revenueTrend = useMemo(() => {
        return getRevenueTrend(dateRange)
    }, [dateRange])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const fmt = (eur: number, ngn: number) => {
        if (currency === 'EUR') return `€${eur.toLocaleString()}`
        return `₦${ngn.toLocaleString()}`
    }

    const handleCopyLink = (link: string, orderNumber: string) => {
        navigator.clipboard.writeText(link)
        showToast(`Balance payment link for ${orderNumber} copied to clipboard!`)
    }

    const handleExportCSV = () => {
        const rows = OUTSTANDING_BALANCES_LIST.map((b) => ({
            OrderNumber: b.orderNumber,
            Customer: b.customerName,
            TotalAmountEUR: `€${b.amountEUR}`,
            TotalAmountNGN: `₦${b.amountNGN.toLocaleString()}`,
            BalanceDueEUR: `€${b.balanceEUR}`,
            BalanceDueNGN: `₦${b.balanceNGN.toLocaleString()}`,
            DaysSinceDelivered: b.daysDelivered,
            PaymentLink: b.link,
        }))
        exportAnalyticsCSV('revenue_and_outstanding_balances', rows)
        showToast('Exported Financial Analytics CSV')
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
                        <span style={{ color: '#C4975A' }}>Revenue</span>
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
                        Financial & Revenue Analytics
                    </h1>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                        Collected funds, outstanding post-delivery balances, gateway processing, and regional cashflow.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    {/* Currency Toggle */}
                    <div
                        style={{
                            display: 'flex',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '3px',
                            border: '1px solid #E8E2D9',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setCurrency('EUR')}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: currency === 'EUR' ? '#1C0F07' : 'transparent',
                                color: currency === 'EUR' ? '#FAF7F2' : '#8C827A',
                            }}
                        >
                            € EUR
                        </button>
                        <button
                            type="button"
                            onClick={() => setCurrency('NGN')}
                            style={{
                                padding: '6px 14px',
                                borderRadius: '6px',
                                fontSize: '12px',
                                fontWeight: 700,
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: currency === 'NGN' ? '#1C0F07' : 'transparent',
                                color: currency === 'NGN' ? '#FAF7F2' : '#8C827A',
                            }}
                        >
                            ₦ NGN
                        </button>
                    </div>

                    {/* Date range dropdown */}
                    <div
                        style={{
                            display: 'flex',
                            backgroundColor: '#FFFFFF',
                            borderRadius: '8px',
                            padding: '3px',
                            border: '1px solid #E8E2D9',
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
                        onClick={handleExportCSV}
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

            {/* FINANCIAL KPI STRIP (8 METRICS) */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr)))',
                    gap: '14px',
                    marginBottom: '28px',
                }}
            >
                {[
                    { label: 'Revenue Collected', value: fmt(15000, 26250000), sub: 'Cleared in accounts', color: '#4A7C59' },
                    { label: 'Outstanding Balance', value: fmt(4000, 7000000), sub: 'Awaiting post-delivery', color: '#C72B2B' },
                    { label: 'Total Expected', value: fmt(19000, 33250000), sub: 'Full pipeline value', color: '#1C0F07' },
                    { label: 'Collection Rate', value: '78.9%', sub: 'Target: >75%', color: '#4A7C59' },
                    { label: 'Average Order Value', value: fmt(375, 657140), sub: 'Dual currency rate', color: '#C4975A' },
                    { label: 'Highest Commission', value: fmt(1200, 2100000), sub: 'Grand Ceremonial Agbada', color: '#1C0F07' },
                    { label: '50% Deposits Total', value: fmt(9500, 16625000), sub: 'Upfront commitments', color: '#3A7DAD' },
                    { label: '50% Balances Total', value: fmt(5500, 9625000), sub: 'Delivered collections', color: '#4A7C59' },
                ].map((kpi, i) => (
                    <div
                        key={i}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '14px',
                            border: '1px solid #E8E2D9',
                            padding: '16px 18px',
                            boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                        }}
                    >
                        <span
                            style={{
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
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
                                fontSize: '20px',
                                fontWeight: 600,
                                color: kpi.color,
                                marginBottom: '2px',
                            }}
                        >
                            {kpi.value}
                        </div>
                        <span style={{ fontSize: '11px', color: '#8C827A' }}>{kpi.sub}</span>
                    </div>
                ))}
            </div>

            {/* REVENUE OVER TIME CHART */}
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
                                margin: '0 0 4px',
                            }}
                        >
                            Collected vs. Outstanding Revenue Over Time
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                            Green bars depict cleared funds; red bars show pending post-delivery client balances
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#4A7C59', fontWeight: 600 }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#4A7C59' }} />
                            Collected Funds
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C72B2B', fontWeight: 600 }}>
                            <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: '#C72B2B' }} />
                            Outstanding Balances
                        </span>
                    </div>
                </div>

                {/* Visual Chart */}
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
                            gap: '16px',
                            borderBottom: '1px solid #E8E2D9',
                            padding: '0 10px',
                        }}
                    >
                        {revenueTrend.map((pt, i) => {
                            const maxVal = Math.max(...revenueTrend.map((d) => d.expectedEUR)) || 1
                            const colHeightPct = Math.round((pt.collectedEUR / maxVal) * 100)
                            const outHeightPct = Math.round((pt.outstandingEUR / maxVal) * 100)

                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <div style={{ width: '100%', maxWidth: '48px', display: 'flex', gap: '4px', alignItems: 'flex-end' }}>
                                        {/* Collected */}
                                        <div
                                            title={`Collected: ${fmt(pt.collectedEUR, pt.collectedNGN)}`}
                                            style={{
                                                flex: 1,
                                                height: `${colHeightPct}%`,
                                                backgroundColor: '#4A7C59',
                                                borderRadius: '4px 4px 0 0',
                                            }}
                                        />
                                        {/* Outstanding */}
                                        <div
                                            title={`Outstanding: ${fmt(pt.outstandingEUR, pt.outstandingNGN)}`}
                                            style={{
                                                flex: 1,
                                                height: `${outHeightPct}%`,
                                                backgroundColor: '#C72B2B',
                                                borderRadius: '4px 4px 0 0',
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px 0', fontSize: '11px', color: '#8C827A' }}>
                        {revenueTrend.map((pt, i) => (
                            <span key={i}>{pt.date}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* TWO COLUMN: PAYMENT GATEWAYS & CATEGORY REVENUE */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                    gap: '24px',
                    marginBottom: '28px',
                }}
            >
                {/* 1. PAYMENT GATEWAY SPLIT (PAYSTACK VS STRIPE) */}
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
                            Payment Gateway Processing
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                            Breakdown between domestic Nigerian checkout and international European card processing
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div
                            style={{
                                padding: '16px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <strong style={{ fontSize: '14px', color: '#1C0F07', display: 'block' }}>
                                    Paystack (Nigeria Naira & Direct Debit)
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Avg fee: 1.5% • T+1 Payout velocity
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07' }}>
                                    {fmt(6800, 11900000)}
                                </span>
                                <span style={{ fontSize: '11px', color: '#4A7C59', display: 'block' }}>45% of total</span>
                            </div>
                        </div>

                        <div
                            style={{
                                padding: '16px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <strong style={{ fontSize: '14px', color: '#1C0F07', display: 'block' }}>
                                    Stripe (European Cards, Apple Pay, SEPA)
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Avg fee: 2.1% • T+2 Payout velocity
                                </span>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07' }}>
                                    {fmt(8200, 14350000)}
                                </span>
                                <span style={{ fontSize: '11px', color: '#2C618C', display: 'block' }}>55% of total</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. REVENUE BY GARMENT CATEGORY */}
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
                            Revenue by Garment Category
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                            Highest commercial value contributors
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {[
                            { name: 'Native Wear (Agbada & Senator)', eur: 8800, ngn: 15400000, pct: 58, aov: 420 },
                            { name: 'English Suits (Cashmere & Wool)', eur: 4200, ngn: 7350000, pct: 28, aov: 550 },
                            { name: 'Casual (Safari Shirts & Kaftans)', eur: 1600, ngn: 2800000, pct: 11, aov: 190 },
                            { name: "Children's Ceremonial", eur: 400, ngn: 700000, pct: 3, aov: 130 },
                        ].map((cat, i) => (
                            <div key={i}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                    <span style={{ fontWeight: 500, color: '#1C0F07' }}>{cat.name}</span>
                                    <strong>{fmt(cat.eur, cat.ngn)}</strong>
                                </div>
                                <div style={{ height: '6px', backgroundColor: '#FAF7F2', borderRadius: '3px', overflow: 'hidden', marginBottom: '4px' }}>
                                    <div style={{ width: `${cat.pct}%`, height: '100%', backgroundColor: '#C4975A' }} />
                                </div>
                                <span style={{ fontSize: '10px', color: '#8C827A' }}>
                                    Average Order Value: {fmt(cat.aov, cat.aov * EUR_TO_NGN_RATE)}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* OUTSTANDING BALANCES ACTION TABLE */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                }}
            >
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #E8E2D9' }}>
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '18px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        Outstanding Post-Delivery Balances Action List
                    </h2>
                    <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                        Orders delivered to client awaiting final 50% balance settlement
                    </p>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #E8E2D9', textAlign: 'left' }}>
                                <th style={{ padding: '12px 18px', color: '#8C827A', fontWeight: 600 }}>Order</th>
                                <th style={{ padding: '12px 14px', color: '#8C827A', fontWeight: 600 }}>Client</th>
                                <th style={{ padding: '12px 14px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>Total</th>
                                <th style={{ padding: '12px 14px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>Deposit Paid</th>
                                <th style={{ padding: '12px 14px', color: '#C72B2B', fontWeight: 600, textAlign: 'right' }}>Balance Due</th>
                                <th style={{ padding: '12px 14px', color: '#8C827A', fontWeight: 600 }}>Delivered</th>
                                <th style={{ padding: '12px 18px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {OUTSTANDING_BALANCES_LIST.map((b) => (
                                <tr key={b.orderId} style={{ borderBottom: '1px solid #F5F1EB' }}>
                                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#1C0F07' }}>
                                        {b.orderNumber}
                                    </td>
                                    <td style={{ padding: '14px 14px', color: '#4A3D36' }}>{b.customerName}</td>
                                    <td style={{ padding: '14px 14px', textAlign: 'right', color: '#1C0F07' }}>
                                        {fmt(b.amountEUR, b.amountNGN)}
                                    </td>
                                    <td style={{ padding: '14px 14px', textAlign: 'right', color: '#4A7C59' }}>
                                        {fmt(b.depositEUR, b.depositNGN)}
                                    </td>
                                    <td style={{ padding: '14px 14px', textAlign: 'right', fontWeight: 700, color: '#C72B2B' }}>
                                        {fmt(b.balanceEUR, b.balanceNGN)}
                                    </td>
                                    <td style={{ padding: '14px 14px', color: '#8C827A', fontSize: '12px' }}>
                                        {b.daysDelivered} days ago
                                    </td>
                                    <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                        <button
                                            type="button"
                                            onClick={() => handleCopyLink(b.link, b.orderNumber)}
                                            style={{
                                                padding: '5px 12px',
                                                borderRadius: '6px',
                                                border: '1px solid #C4975A',
                                                backgroundColor: '#FAF5EE',
                                                color: '#1C0F07',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Copy Link ⎘
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
