'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    exportAnalyticsCSV,
    DateRangeKey,
} from '@/data/adminAnalyticsData'
import {
    FiBookOpen,
    FiMail,
    FiEye,
    FiUsers,
    FiClock,
    FiTrendingUp,
    FiDownload,
    FiArrowLeft,
    FiExternalLink,
    FiSearch,
    FiTarget,
    FiCheckCircle,
    FiCalendar,
    FiDollarSign,
} from '@/components/admin/AnalyticsIcons'

export default function BlogMarketingAnalyticsPage() {
    const [viewMode, setViewMode] = useState<'blog' | 'email'>('blog')
    const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
    const [currency, setCurrency] = useState<'EUR' | 'NGN'>('EUR')

    const blogPosts = [
        {
            id: 'post-1',
            title: 'The Art of the Grand Agbada: Heritage Tailoring Meets Modern Elegance',
            category: 'Heritage & Craft',
            views: 6420,
            readers: 4190,
            readTime: '4m 48s',
            subscribersGained: 34,
            language: 'Both (EN & IT)',
            date: 'Aug 14, 2026',
        },
        {
            id: 'post-2',
            title: 'Naples to Lagos: The Transcontinental Journey of Super 150s Wool',
            category: 'Materials & Fabric',
            views: 4890,
            readers: 3120,
            readTime: '3m 52s',
            subscribersGained: 26,
            language: 'Both (EN & IT)',
            date: 'Aug 28, 2026',
        },
        {
            id: 'post-3',
            title: 'Mastering the Senator Cut: Formal Minimalist Sartorial Codes',
            category: 'Style Guides',
            views: 4120,
            readers: 2680,
            readTime: '3m 15s',
            subscribersGained: 18,
            language: 'EN Only',
            date: 'Sep 02, 2026',
        },
        {
            id: 'post-4',
            title: 'Lino Mediterraneo: Come Indossare la Sartoria Tradizionale in Estate',
            category: 'Italian Editorial',
            views: 2990,
            readers: 1300,
            readTime: '4m 10s',
            subscribersGained: 8,
            language: 'IT Only',
            date: 'Sep 05, 2026',
        },
    ]

    const emailCampaigns = [
        {
            id: 'camp-1',
            title: 'The Autumn Bespoke Suiting Capsule: Reserve Your Fitting',
            date: 'Sep 03, 2026',
            recipients: 398,
            openRate: 48.2,
            clickRate: 9.6,
            unsubRate: 0.2,
            revenueEUR: 4200,
            revenueNGN: 7350000,
        },
        {
            id: 'camp-2',
            title: 'Exclusive Preview: Heirloom Agbada Hand-Embroidery Works',
            date: 'Aug 20, 2026',
            recipients: 374,
            openRate: 51.4,
            clickRate: 11.2,
            unsubRate: 0.1,
            revenueEUR: 3150,
            revenueNGN: 5512500,
        },
        {
            id: 'camp-3',
            title: 'Samuelson in Milan: Private Fitting Appointments Available',
            date: 'Aug 05, 2026',
            recipients: 182,
            openRate: 58.7,
            clickRate: 14.8,
            unsubRate: 0.0,
            revenueEUR: 1550,
            revenueNGN: 2712500,
        },
    ]

    const handleExport = () => {
        if (viewMode === 'blog') {
            const rows = blogPosts.map((p, idx) => ({
                Rank: idx + 1,
                Title: p.title,
                Category: p.category,
                Views: p.views,
                Readers: p.readers,
                ReadTime: p.readTime,
                SubscribersGained: p.subscribersGained,
                Language: p.language,
            }))
            exportAnalyticsCSV('Blog_Readership_Report', rows)
        } else {
            const rows = emailCampaigns.map((c) => ({
                Subject: c.title,
                Date: c.date,
                Recipients: c.recipients,
                OpenRate: `${c.openRate}%`,
                ClickRate: `${c.clickRate}%`,
                RevenueEUR: `€${c.revenueEUR.toLocaleString()}`,
                RevenueNGN: `₦${c.revenueNGN.toLocaleString()}`,
            }))
            exportAnalyticsCSV('Marketing_Campaigns_Report', rows)
        }
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
                {/* Top Nav & View Switcher */}
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
                            <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Editorial & Marketing</span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Editorial Journal & Marketing Intelligence
                        </h1>
                        <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                            Readership behavior, Search Console keywords, and email campaign conversion metrics.
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

                        {/* View Switcher */}
                        <div style={{ display: 'inline-flex', padding: '3px', backgroundColor: '#EDE8E1', borderRadius: '8px' }}>
                            <button
                                type="button"
                                onClick={() => setViewMode('blog')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 16px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: viewMode === 'blog' ? '#1C0F07' : 'transparent',
                                    color: viewMode === 'blog' ? '#FAF7F2' : '#7C6F65',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <FiBookOpen size={14} /> Blog Analytics
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('email')}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 16px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: viewMode === 'email' ? '#1C0F07' : 'transparent',
                                    color: viewMode === 'email' ? '#FAF7F2' : '#7C6F65',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                <FiMail size={14} /> Email Campaigns
                            </button>
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

                {/* VIEW A: BLOG ANALYTICS */}
                {viewMode === 'blog' && (
                    <>
                        {/* Blog KPIs Strip */}
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
                                    label: 'Total Journal Views',
                                    value: '18,420',
                                    sub: '+24.6% readership surge',
                                    icon: <FiEye size={18} color="#C4975A" />,
                                },
                                {
                                    label: 'Unique Readers',
                                    value: '11,290',
                                    sub: 'Global diaspora & connoisseurs',
                                    icon: <FiUsers size={18} color="#1565C0" />,
                                },
                                {
                                    label: 'Average Reading Time',
                                    value: '4m 12s',
                                    sub: 'High engagement depth',
                                    icon: <FiClock size={18} color="#2E7D32" />,
                                },
                                {
                                    label: 'Newsletter Signups',
                                    value: '86 Subscribers',
                                    sub: 'Directly from in-post capture',
                                    icon: <FiTrendingUp size={18} color="#C4975A" />,
                                },
                                {
                                    label: 'Top Viewed Article',
                                    value: 'Grand Agbada Heritage',
                                    sub: '6,420 views (35% total)',
                                    icon: <FiBookOpen size={18} color="#8A5D18" />,
                                },
                                {
                                    label: 'Organic Search Clicks',
                                    value: '4,810 Clicks',
                                    sub: 'Google Search Console verified',
                                    icon: <FiSearch size={18} color="#2E7D32" />,
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
                                        <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C0F07', marginBottom: '4px' }}>
                                            {kpi.value}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#7C6F65' }}>
                                            {kpi.sub}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Blog Post Performance Table */}
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
                                        Editorial Post Performance
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                                        Individual article readership metrics and reader acquisition attribution.
                                    </p>
                                </div>
                                <Link
                                    href="/admin/blog"
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
                                    Manage Journal Posts <FiExternalLink size={14} />
                                </Link>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#7C6F65' }}>Rank</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Article Title</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Category</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Total Views</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Unique Readers</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Avg. Read Time</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Subscribers Gained</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1C0F07' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {blogPosts.map((post, idx) => (
                                        <tr key={post.id} style={{ borderBottom: '1px solid #EDE8E1' }}>
                                            <td style={{ padding: '14px 16px', fontWeight: 700, color: idx === 0 ? '#C4975A' : '#7C6F65' }}>
                                                {idx === 0 ? '🏆 #1' : `#${idx + 1}`}
                                            </td>
                                            <td style={{ padding: '14px 16px', maxWidth: '300px' }}>
                                                <div style={{ fontWeight: 600, color: '#1C0F07', marginBottom: '2px' }}>
                                                    {post.title}
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                                    {post.language} • {post.date}
                                                </div>
                                            </td>
                                            <td style={{ padding: '14px 16px' }}>
                                                <span
                                                    style={{
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        color: '#1C0F07',
                                                        backgroundColor: '#FAF7F2',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #EDE8E1',
                                                    }}
                                                >
                                                    {post.category}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C0F07' }}>
                                                {post.views.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#7C6F65' }}>
                                                {post.readers.toLocaleString()}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C0F07' }}>
                                                {post.readTime}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2E7D32' }}>
                                                +{post.subscribersGained}
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                <Link
                                                    href={`/admin/blog/preview/${post.id}`}
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
                                                    Preview <FiExternalLink size={12} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Search Console & Traffic Source Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
                            {/* Search Queries (GSC) */}
                            <div
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    border: '1px solid #EDE8E1',
                                    padding: '24px',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                    <div>
                                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                            Top Organic Search Queries
                                        </h2>
                                        <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                            Keywords indexed via Google Search Console
                                        </p>
                                    </div>
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
                                        GSC Connected
                                    </span>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { query: 'bespoke agbada in europe', clicks: 1240, impressions: 8400, ctr: '14.7%', pos: 1.8 },
                                        { query: 'italian wool african native wear', clicks: 980, impressions: 6200, ctr: '15.8%', pos: 2.1 },
                                        { query: 'custom senator suit milan', clicks: 760, impressions: 5100, ctr: '14.9%', pos: 2.4 },
                                        { query: 'nigerian diaspora tailoring italy', clicks: 580, impressions: 3900, ctr: '14.8%', pos: 1.6 },
                                    ].map((q, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '12px 14px',
                                                borderRadius: '8px',
                                                backgroundColor: '#FAF7F2',
                                                border: '1px solid #EDE8E1',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                                    &ldquo;{q.query}&rdquo;
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                                    {q.impressions.toLocaleString()} impressions • Rank #{q.pos}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>
                                                    {q.clicks} clicks
                                                </div>
                                                <div style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>
                                                    {q.ctr} CTR
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Language Split & Traffic Channels */}
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
                                        Readership Language & Channels
                                    </h2>
                                    <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                        Bilingual distribution across editorial articles
                                    </p>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                                        <span style={{ fontWeight: 600, color: '#1C0F07' }}>🇬🇧 English (68.4%)</span>
                                        <span style={{ fontWeight: 600, color: '#C4975A' }}>🇮🇹 Italian (31.6%)</span>
                                    </div>
                                    <div style={{ height: '14px', borderRadius: '7px', overflow: 'hidden', display: 'flex' }}>
                                        <div style={{ width: '68.4%', backgroundColor: '#1C0F07' }}></div>
                                        <div style={{ width: '31.6%', backgroundColor: '#C4975A' }}></div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {[
                                        { name: 'Organic Google Search', share: 52.4, color: '#2E7D32' },
                                        { name: 'Email Newsletter Inclusions', share: 22.8, color: '#C4975A' },
                                        { name: 'Direct Links & WhatsApp Shares', share: 15.6, color: '#1C0F07' },
                                        { name: 'Instagram Bio & Stories', share: 9.2, color: '#8A5D18' },
                                    ].map((src, i) => (
                                        <div key={i}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                                                <span style={{ color: '#1C0F07', fontWeight: 500 }}>{src.name}</span>
                                                <span style={{ fontWeight: 700, color: '#1C0F07' }}>{src.share}%</span>
                                            </div>
                                            <div style={{ height: '6px', backgroundColor: '#FAF7F2', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{ width: `${src.share}%`, height: '100%', backgroundColor: src.color }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* VIEW B: EMAIL MARKETING ANALYTICS */}
                {viewMode === 'email' && (
                    <>
                        {/* Email KPIs Strip */}
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
                                    label: 'Active List Size',
                                    value: '412 Patrons',
                                    sub: 'Zero cold list, 100% verified',
                                    icon: <FiUsers size={18} color="#C4975A" />,
                                },
                                {
                                    label: 'Net List Growth',
                                    value: '+42 Patrons',
                                    sub: '46 new vs 4 unsubs',
                                    icon: <FiTrendingUp size={18} color="#2E7D32" />,
                                },
                                {
                                    label: 'Average Open Rate',
                                    value: '48.6%',
                                    sub: 'Industry benchmark: 21.0%',
                                    icon: <FiCheckCircle size={18} color="#2E7D32" />,
                                },
                                {
                                    label: 'Average Click Rate (CTR)',
                                    value: '10.8%',
                                    sub: 'Industry benchmark: 2.6%',
                                    icon: <FiTarget size={18} color="#C4975A" />,
                                },
                                {
                                    label: 'Attributed Campaign Revenue',
                                    value: currency === 'EUR' ? '€8,900' : '₦15,575,000',
                                    sub: 'From 3 capsule broadcasts',
                                    icon: <FiDollarSign size={18} color="#1C0F07" />,
                                },
                                {
                                    label: 'Campaigns Sent in Period',
                                    value: '3 Broadcasts',
                                    sub: '100% inbox delivery rate',
                                    icon: <FiMail size={18} color="#8A5D18" />,
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

                        {/* Campaign Performance Table */}
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
                                        Dispatched Campaign Telemetry
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                                        Direct commercial return and open behavior per campaign.
                                    </p>
                                </div>
                                <Link
                                    href="/admin/marketing/campaigns/new"
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
                                    Compose New Broadcast <FiExternalLink size={14} />
                                </Link>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Subject Line</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Sent Date</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Recipients</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Open Rate</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Click Rate</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Unsubscribe</th>
                                        <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Revenue Attributed</th>
                                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1C0F07' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {emailCampaigns.map((camp) => (
                                        <tr key={camp.id} style={{ borderBottom: '1px solid #EDE8E1' }}>
                                            <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1C0F07', maxWidth: '280px' }}>
                                                {camp.title}
                                            </td>
                                            <td style={{ padding: '14px 16px', fontSize: '12px', color: '#7C6F65' }}>
                                                {camp.date}
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#1C0F07' }}>
                                                {camp.recipients} patrons
                                            </td>
                                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#2E7D32' }}>
                                                {camp.openRate}%
                                            </td>
                                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#C4975A' }}>
                                                {camp.clickRate}%
                                            </td>
                                            <td style={{ padding: '14px 16px', color: '#7C6F65' }}>
                                                {camp.unsubRate}%
                                            </td>
                                            <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C0F07' }}>
                                                {currency === 'EUR' ? `€${camp.revenueEUR.toLocaleString()}` : `₦${camp.revenueNGN.toLocaleString()}`}
                                            </td>
                                            <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                                <Link
                                                    href={`/admin/marketing/campaigns/${camp.id}`}
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
                                                    Report <FiExternalLink size={12} />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Best Send Times & Open Curves */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
                            {/* Best Send Day & Hour Analysis */}
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
                                        Optimal Send Days & Hours
                                    </h2>
                                    <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                        Highest engagement windows for diaspora and European patrons
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                    {[
                                        { day: 'Thursday Evening (19:00–21:00 CET)', openRate: '54.2%', clickRate: '12.4%', note: 'Highest suit commission engagement' },
                                        { day: 'Sunday Afternoon (16:00–18:00 CET)', openRate: '51.8%', clickRate: '11.0%', note: 'Leisure reading & wedding planning' },
                                        { day: 'Tuesday Morning (09:00–11:00 CET)', openRate: '46.5%', clickRate: '9.2%', note: 'Executive wardrobe planning' },
                                        { day: 'Friday Evening (18:00–20:00 CET)', openRate: '38.1%', clickRate: '6.5%', note: 'Lower attention due to weekend plans' },
                                    ].map((slot, i) => (
                                        <div
                                            key={i}
                                            style={{
                                                padding: '14px',
                                                borderRadius: '8px',
                                                backgroundColor: '#FAF7F2',
                                                border: '1px solid #EDE8E1',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <div>
                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>{slot.day}</div>
                                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>{slot.note}</div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#2E7D32' }}>{slot.openRate} Opens</div>
                                                <div style={{ fontSize: '11px', color: '#C4975A', fontWeight: 600 }}>{slot.clickRate} Clicks</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Benchmark Comparison Card */}
                            <div
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    border: '1px solid #EDE8E1',
                                    padding: '24px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <div>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: '0 0 8px 0' }}>
                                        Luxury Tailoring Benchmark
                                    </h2>
                                    <p style={{ fontSize: '13px', color: '#7C6F65', margin: '0 0 20px 0' }}>
                                        CaptainStitches patron engagement vs. global luxury fashion standards.
                                    </p>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                                <span style={{ fontWeight: 600, color: '#1C0F07' }}>Open Rate</span>
                                                <span style={{ fontWeight: 700, color: '#2E7D32' }}>48.6% (vs 21.0% Industry Avg)</span>
                                            </div>
                                            <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: '48.6%', height: '100%', backgroundColor: '#2E7D32' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                                <span style={{ fontWeight: 600, color: '#1C0F07' }}>Click Rate (CTR)</span>
                                                <span style={{ fontWeight: 700, color: '#C4975A' }}>10.8% (vs 2.6% Industry Avg)</span>
                                            </div>
                                            <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: '10.8%', height: '100%', backgroundColor: '#C4975A' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                                                <span style={{ fontWeight: 600, color: '#1C0F07' }}>Unsubscribe Rate</span>
                                                <span style={{ fontWeight: 700, color: '#1C0F07' }}>0.1% (vs 0.4% Industry Avg)</span>
                                            </div>
                                            <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div style={{ width: '0.1%', height: '100%', backgroundColor: '#1C0F07' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        marginTop: '20px',
                                        padding: '14px',
                                        backgroundColor: '#FDF6ED',
                                        borderRadius: '8px',
                                        border: '1px solid #F5D38A',
                                        fontSize: '12px',
                                        color: '#8A5D18',
                                    }}
                                >
                                    💡 <b>Atelier Insight:</b> Highly personalized story-driven capsules sent to verified patrons generate 2.3x higher engagement than generic seasonal sales blasts.
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
    )
}
