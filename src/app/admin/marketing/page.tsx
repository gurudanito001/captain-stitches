'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    getAllSubscribers,
    getAllCampaigns,
    getMarketingSettings,
    getMarketingOverviewStats,
    MarketingCampaign,
} from '@/data/adminMarketingData'

export default function MarketingOverviewPage() {
    const [subscribers, setSubscribers] = useState<any[]>([])
    const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([])
    const [settings, setSettings] = useState(getMarketingSettings())
    const [growthRange, setGrowthRange] = useState<'30d' | '3m' | '6m' | 'all'>('30d')
    const [hoveredPoint, setHoveredPoint] = useState<{ date: string; count: number } | null>(null)

    useEffect(() => {
        setSubscribers(getAllSubscribers())
        setCampaigns(getAllCampaigns())
        setSettings(getMarketingSettings())
    }, [])

    const stats = useMemo(() => {
        return getMarketingOverviewStats(subscribers, campaigns)
    }, [subscribers, campaigns])

    // Sent campaigns sorted newest first
    const recentSentCampaigns = useMemo(() => {
        return campaigns
            .filter((c) => c.status === 'sent')
            .slice(0, 3)
    }, [campaigns])

    // Chart dataset based on growthRange
    const chartData = useMemo(() => {
        if (growthRange === '30d') {
            return [
                { date: 'Aug 08', count: 136 },
                { date: 'Aug 14', count: 139 },
                { date: 'Aug 20', count: 141 },
                { date: 'Aug 26', count: 144 },
                { date: 'Sep 01', count: 146 },
                { date: 'Sep 07', count: 148 },
            ]
        }
        if (growthRange === '3m') {
            return [
                { date: 'Jun', count: 118 },
                { date: 'Jul', count: 130 },
                { date: 'Aug', count: 144 },
                { date: 'Sep', count: 148 },
            ]
        }
        if (growthRange === '6m') {
            return [
                { date: 'Apr', count: 95 },
                { date: 'May', count: 108 },
                { date: 'Jun', count: 118 },
                { date: 'Jul', count: 130 },
                { date: 'Aug', count: 144 },
                { date: 'Sep', count: 148 },
            ]
        }
        return [
            { date: '2025 Q3', count: 32 },
            { date: '2025 Q4', count: 68 },
            { date: '2026 Q1', count: 102 },
            { date: '2026 Q2', count: 124 },
            { date: '2026 Q3', count: 148 },
        ]
    }, [growthRange])

    const totalSources = Object.values(stats.sourceCounts).reduce((a, b) => a + b, 0) || 1

    const sourceDisplay = [
        { label: 'Homepage Capture Form', count: stats.sourceCounts.homepage, color: '#C4975A' },
        { label: 'Bespoke Order Confirmation', count: stats.sourceCounts.order_confirmation, color: '#4A7C59' },
        { label: 'Editorial Journal / Blog Post', count: stats.sourceCounts.blog, color: '#3A7DAD' },
        { label: 'WhatsApp Referral / Ambassador', count: stats.sourceCounts.referral, color: '#25D366' },
        { label: 'Manual Atelier Import', count: stats.sourceCounts.manual, color: '#8C827A' },
    ]

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 0 80px' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <h1
                            style={{
                                fontFamily: 'serif',
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: 0,
                            }}
                        >
                            Email Marketing Overview
                        </h1>

                        {/* Connected platform badge */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '14px',
                                backgroundColor: settings.isConnected ? 'rgba(74, 124, 89, 0.12)' : 'rgba(199, 43, 43, 0.12)',
                                border: `1px solid ${settings.isConnected ? 'rgba(74, 124, 89, 0.3)' : 'rgba(199, 43, 43, 0.3)'}`,
                            }}
                        >
                            <span
                                style={{
                                    width: '7px',
                                    height: '7px',
                                    borderRadius: '50%',
                                    backgroundColor: settings.isConnected ? '#4A7C59' : '#C72B2B',
                                }}
                            />
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    color: settings.isConnected ? '#3B6E48' : '#A82020',
                                    letterSpacing: '0.04em',
                                }}
                            >
                                Connected to {settings.platform === 'mailchimp' ? 'Mailchimp' : 'Brevo'}
                            </span>
                        </div>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                        Atelier broadcast telemetry, subscriber growth, and campaign dispatch controls.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link
                        href="/admin/marketing/settings"
                        style={{
                            padding: '9px 16px',
                            borderRadius: '8px',
                            border: '1px solid #E8E2D9',
                            backgroundColor: '#FFFFFF',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 500,
                            textDecoration: 'none',
                        }}
                    >
                        ⚙ Settings
                    </Link>

                    <Link
                        href="/admin/marketing/campaigns/new"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 20px',
                            borderRadius: '8px',
                            backgroundColor: '#C4975A',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        + Send Campaign
                    </Link>
                </div>
            </div>

            {/* 7-STAT STATS STRIP */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '14px',
                    marginBottom: '28px',
                }}
            >
                {[
                    { label: 'Active Subscribers', value: stats.activeSubscribers, sub: 'Verified in database', color: '#1C0F07' },
                    { label: 'New This Month', value: `+${stats.newThisMonth}`, sub: 'Sep 2026 intake', color: '#4A7C59' },
                    { label: 'Unsubscribes', value: stats.unsubscribesThisMonth, sub: '0.7% churn rate', color: '#8C827A' },
                    { label: 'Net Monthly Growth', value: `+${stats.netGrowth}`, sub: 'Net new patrons', color: '#C4975A' },
                    { label: 'Avg. Open Rate', value: `${stats.avgOpenRate}%`, sub: 'Benchmark: 38%', color: '#4A7C59' },
                    { label: 'Avg. Click Rate', value: `${stats.avgClickRate}%`, sub: 'Benchmark: 8.5%', color: '#3A7DAD' },
                    {
                        label: 'Top Performing',
                        value: `${stats.bestCampaign.openRate}%`,
                        sub: stats.bestCampaign.name,
                        color: '#C4975A',
                    },
                ].map((item, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #E8E2D9',
                            padding: '16px',
                            boxShadow: '0 2px 6px rgba(28, 15, 7, 0.02)',
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
                            {item.label}
                        </span>
                        <div
                            style={{
                                fontFamily: 'serif',
                                fontSize: '24px',
                                fontWeight: 600,
                                color: item.color,
                                marginBottom: '4px',
                            }}
                        >
                            {item.value}
                        </div>
                        <span
                            style={{
                                fontSize: '11px',
                                color: '#8C827A',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                display: 'block',
                            }}
                        >
                            {item.sub}
                        </span>
                    </div>
                ))}
            </div>

            {/* TWO COLUMN SECTION: GROWTH CHART & SIGNUP SOURCES */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)',
                    gap: '24px',
                    marginBottom: '28px',
                }}
            >
                {/* 1. SUBSCRIBER GROWTH CHART */}
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
                                    margin: '0 0 4px',
                                }}
                            >
                                Subscriber Growth Trajectory
                            </h2>
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                                Cumulative active mailing list members over selected intervals
                            </p>
                        </div>

                        {/* Range Toggle */}
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
                                    { key: '30d', label: '30 Days' },
                                    { key: '3m', label: '3 Months' },
                                    { key: '6m', label: '6 Months' },
                                    { key: 'all', label: 'All Time' },
                                ] as const
                            ).map((r) => (
                                <button
                                    key={r.key}
                                    type="button"
                                    onClick={() => setGrowthRange(r.key)}
                                    style={{
                                        padding: '4px 10px',
                                        borderRadius: '6px',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: growthRange === r.key ? '#1C0F07' : 'transparent',
                                        color: growthRange === r.key ? '#FAF7F2' : '#8C827A',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* SVG Chart Visualization */}
                    <div
                        style={{
                            height: '220px',
                            width: '100%',
                            position: 'relative',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                            paddingTop: '20px',
                        }}
                    >
                        {/* Interactive hover indicator */}
                        {hoveredPoint && (
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    backgroundColor: '#1C0F07',
                                    color: '#FAF7F2',
                                    padding: '6px 12px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    border: '1px solid #C4975A',
                                }}
                            >
                                {hoveredPoint.date}: <strong>{hoveredPoint.count} subscribers</strong>
                            </div>
                        )}

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'flex-end',
                                justifyContent: 'space-between',
                                height: '160px',
                                padding: '0 10px',
                                borderBottom: '1px solid #E8E2D9',
                                gap: '14px',
                            }}
                        >
                            {chartData.map((pt, i) => {
                                const min = Math.min(...chartData.map((d) => d.count)) * 0.9
                                const max = Math.max(...chartData.map((d) => d.count)) * 1.05
                                const heightPercent = Math.max(15, Math.round(((pt.count - min) / (max - min)) * 100))

                                return (
                                    <div
                                        key={i}
                                        onMouseEnter={() => setHoveredPoint(pt)}
                                        onMouseLeave={() => setHoveredPoint(null)}
                                        style={{
                                            flex: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            height: '100%',
                                            justifyContent: 'flex-end',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: '100%',
                                                maxWidth: '48px',
                                                height: `${heightPercent}%`,
                                                backgroundColor:
                                                    hoveredPoint?.date === pt.date ? '#C4975A' : 'rgba(196, 151, 90, 0.4)',
                                                borderRadius: '6px 6px 0 0',
                                                transition: 'all 0.2s ease',
                                                position: 'relative',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '-18px',
                                                    left: '50%',
                                                    transform: 'translateX(-50%)',
                                                    fontSize: '10px',
                                                    fontWeight: 600,
                                                    color: '#1C0F07',
                                                }}
                                            >
                                                {pt.count}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* X-axis labels */}
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '8px 10px 0',
                                fontSize: '11px',
                                color: '#8C827A',
                            }}
                        >
                            {chartData.map((pt, i) => (
                                <span key={i}>{pt.date}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 2. SIGNUP SOURCES BREAKDOWN */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
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
                            Signup Acquisition Sources
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                            Where patrons originally subscribed to the atelier list
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {sourceDisplay.map((src, i) => {
                            const pct = Math.round((src.count / totalSources) * 100)
                            return (
                                <div key={i}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        <span style={{ fontWeight: 500, color: '#1C0F07' }}>{src.label}</span>
                                        <span style={{ color: '#8C827A' }}>
                                            {src.count} patrons ({pct}%)
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            height: '7px',
                                            backgroundColor: '#FAF7F2',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${pct}%`,
                                                height: '100%',
                                                backgroundColor: src.color,
                                                borderRadius: '4px',
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* TWO COLUMN: RECENT CAMPAIGNS & QUICK ACTIONS */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)',
                    gap: '24px',
                }}
            >
                {/* RECENT CAMPAIGNS LIST */}
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
                            marginBottom: '18px',
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
                                Recent Dispatched Campaigns
                            </h2>
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                                Performance metrics from recent broadcasts
                            </p>
                        </div>

                        <Link
                            href="/admin/marketing/campaigns"
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#C4975A',
                                textDecoration: 'none',
                            }}
                        >
                            View All ({campaigns.length}) →
                        </Link>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {recentSentCampaigns.map((camp) => (
                            <div
                                key={camp.id}
                                style={{
                                    padding: '16px',
                                    borderRadius: '12px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #E8E2D9',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}
                            >
                                <div style={{ flex: 1, minWidth: '220px' }}>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: '#8C827A',
                                            display: 'block',
                                            marginBottom: '2px',
                                        }}
                                    >
                                        {camp.sendDate} • {camp.recipientCount} Recipients
                                    </span>
                                    <h3
                                        style={{
                                            fontSize: '14px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            margin: '0 0 4px',
                                        }}
                                    >
                                        {camp.subjectEN}
                                    </h3>
                                    <span style={{ fontSize: '12px', color: '#8C827A', fontStyle: 'italic' }}>
                                        IT: "{camp.subjectIT}"
                                    </span>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '10px', color: '#8C827A', display: 'block' }}>
                                            Open Rate
                                        </span>
                                        <strong style={{ fontSize: '15px', color: '#4A7C59' }}>
                                            {camp.stats?.openRate}%
                                        </strong>
                                    </div>

                                    <div style={{ textAlign: 'center' }}>
                                        <span style={{ fontSize: '10px', color: '#8C827A', display: 'block' }}>
                                            Click Rate
                                        </span>
                                        <strong style={{ fontSize: '15px', color: '#3A7DAD' }}>
                                            {camp.stats?.clickRate}%
                                        </strong>
                                    </div>

                                    <Link
                                        href={`/admin/marketing/campaigns/${camp.id}`}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: '#1C0F07',
                                            color: '#FAF7F2',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Report ↗
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* QUICK ACTIONS PANEL */}
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
                            Marketing Quick Actions
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                            Shortcuts to key atelier marketing tasks
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link
                            href="/admin/marketing/campaigns/new"
                            style={{
                                padding: '14px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <strong style={{ fontSize: '13px', color: '#1C0F07', display: 'block' }}>
                                    Compose New Broadcast
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Launch bilingual campaign with live inbox simulation
                                </span>
                            </div>
                            <span style={{ fontSize: '14px', color: '#C4975A' }}>→</span>
                        </Link>

                        <Link
                            href="/admin/marketing/subscribers"
                            style={{
                                padding: '14px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <strong style={{ fontSize: '13px', color: '#1C0F07', display: 'block' }}>
                                    View Subscriber Directory
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Manage {stats.activeSubscribers} patrons, export CSV, and inspect customer links
                                </span>
                            </div>
                            <span style={{ fontSize: '14px', color: '#C4975A' }}>→</span>
                        </Link>

                        <Link
                            href="/admin/marketing/subscribers/new"
                            style={{
                                padding: '14px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <strong style={{ fontSize: '13px', color: '#1C0F07', display: 'block' }}>
                                    Add Subscriber Manually
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Add WhatsApp client with verbal consent confirmation
                                </span>
                            </div>
                            <span style={{ fontSize: '14px', color: '#C4975A' }}>→</span>
                        </Link>

                        <Link
                            href="/admin/marketing/segments"
                            style={{
                                padding: '14px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div>
                                <strong style={{ fontSize: '13px', color: '#1C0F07', display: 'block' }}>
                                    Manage Audience Segments
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Pre-built segments and dynamic condition builder
                                </span>
                            </div>
                            <span style={{ fontSize: '14px', color: '#C4975A' }}>→</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
