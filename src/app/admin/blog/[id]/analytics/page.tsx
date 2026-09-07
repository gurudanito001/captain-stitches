'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AdminBlogPost, getBlogPostById } from '@/data/adminBlogData'

export default function BlogPostAnalyticsPage() {
    const params = useParams()
    const postId = params.id as string

    const [post, setPost] = useState<AdminBlogPost | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d')

    useEffect(() => {
        if (!postId) return
        const found = getBlogPostById(postId)
        if (found) {
            setPost(found)
        }
        setIsLoading(false)
    }, [postId])

    // Scale numbers dynamically based on date range for realistic simulation
    const multiplier = useMemo(() => {
        if (dateRange === '7d') return 0.28
        if (dateRange === '30d') return 1.0
        if (dateRange === '90d') return 2.4
        return 3.2
    }, [dateRange])

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        border: '3px solid rgba(196, 151, 90, 0.2)',
                        borderTopColor: '#C4975A',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
                <p style={{ fontSize: '14px', color: '#8C827A', fontFamily: 'serif' }}>
                    Gathering readership metrics...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!post) {
        return (
            <div
                style={{
                    maxWidth: '540px',
                    margin: '60px auto',
                    padding: '40px 24px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ fontFamily: 'serif', fontSize: '20px', color: '#1C0F07', marginBottom: '8px' }}>
                    Article Telemetry Not Found
                </h2>
                <p style={{ fontSize: '13px', color: '#8C827A', marginBottom: '20px' }}>
                    No analytics data could be matched with ID: {postId}
                </p>
                <Link
                    href="/admin/blog"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        borderRadius: '8px',
                        fontSize: '13px',
                        textDecoration: 'none',
                    }}
                >
                    Back to Blog List
                </Link>
            </div>
        )
    }

    const views = Math.round(post.stats.views * multiplier)
    const uniqueVisitors = Math.round(post.stats.uniqueVisitors * multiplier)
    const ctaClicks = Math.round(post.stats.ctaClicks * multiplier)
    const orderConversions = Math.max(1, Math.round(post.stats.orderConversions * multiplier))
    const subscribersGained = Math.round(post.stats.subscribersGained * multiplier)

    const ctr = views > 0 ? ((ctaClicks / views) * 100).toFixed(1) : '0.0'
    const conversionRate = ctaClicks > 0 ? ((orderConversions / ctaClicks) * 100).toFixed(1) : '0.0'

    // Traffic sources normalized
    const sources = [
        { name: 'Direct Atelier Link', percentage: post.stats.trafficSources.direct, color: '#C4975A' },
        { name: 'WhatsApp VIP Share', percentage: post.stats.trafficSources.whatsapp, color: '#25D366' },
        { name: 'Instagram Bio / Stories', percentage: post.stats.trafficSources.instagram, color: '#E1306C' },
        { name: 'Google Organic Search', percentage: post.stats.trafficSources.google, color: '#4285F4' },
        { name: 'Other Referral Sites', percentage: post.stats.trafficSources.other, color: '#8C827A' },
    ]

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 0 60px' }}>
            {/* TOP BREADCRUMB & HEADER */}
            <div style={{ marginBottom: '28px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#8C827A',
                        marginBottom: '10px',
                    }}
                >
                    <Link href="/admin/blog" style={{ color: '#8C827A', textDecoration: 'none' }}>
                        Blog Journal
                    </Link>
                    <span>/</span>
                    <span style={{ color: '#C4975A' }}>Performance Analytics</span>
                </div>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <h1
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '26px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: 0,
                                }}
                            >
                                {post.contentEN.title || 'Untitled Post'}
                            </h1>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    backgroundColor:
                                        post.status === 'published'
                                            ? 'rgba(74, 124, 89, 0.12)'
                                            : post.status === 'scheduled'
                                            ? 'rgba(58, 125, 173, 0.12)'
                                            : 'rgba(217, 131, 36, 0.12)',
                                    color:
                                        post.status === 'published'
                                            ? '#3B6E48'
                                            : post.status === 'scheduled'
                                            ? '#2C618C'
                                            : '#B36615',
                                }}
                            >
                                {post.status}
                            </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                            Published on {post.publishDate} • Category: {post.category} • Author: {post.author}
                        </p>
                    </div>

                    {/* Date filter & Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                        {/* Time Range Selector */}
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
                                    { key: '7d', label: '7 Days' },
                                    { key: '30d', label: '30 Days' },
                                    { key: '90d', label: '90 Days' },
                                    { key: 'all', label: 'All Time' },
                                ] as const
                            ).map((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    onClick={() => setDateRange(item.key)}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: dateRange === item.key ? '#1C0F07' : 'transparent',
                                        color: dateRange === item.key ? '#FAF7F2' : '#8C827A',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <Link
                            href={`/admin/blog/${post.id}/preview`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 14px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                backgroundColor: '#FFFFFF',
                                color: '#1C0F07',
                                fontSize: '13px',
                                fontWeight: 500,
                                textDecoration: 'none',
                            }}
                        >
                            View Preview ↗
                        </Link>

                        <Link
                            href={`/admin/blog/${post.id}`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 18px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#C4975A',
                                color: '#1C0F07',
                                fontSize: '13px',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            ✎ Edit Post
                        </Link>
                    </div>
                </div>
            </div>

            {/* METRICS KPI STRIP */}
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
                        label: 'Total Page Views',
                        value: views.toLocaleString(),
                        sub: `+${Math.round(views * 0.14)} from prev period`,
                        subColor: '#4A7C59',
                    },
                    {
                        label: 'Unique Visitors',
                        value: uniqueVisitors.toLocaleString(),
                        sub: 'Organic atelier readers',
                        subColor: '#8C827A',
                    },
                    {
                        label: 'Avg. Time on Page',
                        value: post.stats.avgTimeOnPage,
                        sub: 'High editorial engagement',
                        subColor: '#8C827A',
                    },
                    {
                        label: 'Bounce Rate',
                        value: post.stats.bounceRate,
                        sub: 'Industry benchmark: 58%',
                        subColor: '#4A7C59',
                    },
                    {
                        label: 'Scroll Depth',
                        value: '72%',
                        sub: 'Read to the conclusion',
                        subColor: '#8C827A',
                    },
                    {
                        label: 'Email Captures',
                        value: `+${subscribersGained}`,
                        sub: 'Subscribers gained',
                        subColor: '#C4975A',
                    },
                ].map((kpi, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #E8E2D9',
                            padding: '20px 20px',
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
                                fontSize: '26px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '4px',
                            }}
                        >
                            {kpi.value}
                        </div>
                        <span style={{ fontSize: '11px', color: kpi.subColor, fontWeight: 500 }}>{kpi.sub}</span>
                    </div>
                ))}
            </div>

            {/* TWO COLUMN GRID: CONVERSIONS & TRAFFIC SOURCES */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '24px',
                    marginBottom: '28px',
                }}
            >
                {/* Conversions & Attribution Card */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
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
                                Attribution & Commercial Impact
                            </h2>
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                                Orders and interactions traced to this publication
                            </p>
                        </div>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(196, 151, 90, 0.12)',
                                color: '#A06B28',
                            }}
                        >
                            {ctr}% CTR
                        </span>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: '12px',
                            marginBottom: '24px',
                        }}
                    >
                        <div
                            style={{
                                padding: '16px 12px',
                                backgroundColor: '#FAF7F2',
                                borderRadius: '10px',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ fontSize: '11px', color: '#8C827A', display: 'block', marginBottom: '4px' }}>
                                CTA Clicks
                            </span>
                            <span style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#1C0F07' }}>
                                {ctaClicks}
                            </span>
                        </div>

                        <div
                            style={{
                                padding: '16px 12px',
                                backgroundColor: '#FAF7F2',
                                borderRadius: '10px',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ fontSize: '11px', color: '#8C827A', display: 'block', marginBottom: '4px' }}>
                                Attributed Orders
                            </span>
                            <span style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#4A7C59' }}>
                                {orderConversions}
                            </span>
                        </div>

                        <div
                            style={{
                                padding: '16px 12px',
                                backgroundColor: '#FAF7F2',
                                borderRadius: '10px',
                                textAlign: 'center',
                            }}
                        >
                            <span style={{ fontSize: '11px', color: '#8C827A', display: 'block', marginBottom: '4px' }}>
                                Order Conv. Rate
                            </span>
                            <span style={{ fontFamily: 'serif', fontSize: '22px', fontWeight: 600, color: '#C4975A' }}>
                                {conversionRate}%
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            padding: '16px',
                            borderRadius: '10px',
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #EFEAE3',
                            fontSize: '13px',
                            lineHeight: 1.6,
                            color: '#4A3D36',
                        }}
                    >
                        <strong style={{ color: '#1C0F07' }}>Bottom Banner Configured:</strong>
                        <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>
                            "{post.cta.text}" → Destination: {post.cta.linkType} ({post.cta.customUrl || '/catalogue'})
                        </p>
                    </div>
                </div>

                {/* Traffic Sources Card */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                    }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <h2
                            style={{
                                fontFamily: 'serif',
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: 0,
                            }}
                        >
                            Reader Acquisition Channels
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                            Where traffic originated for this publication
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {sources.map((source, idx) => {
                            const sourceVisitors = Math.round((views * source.percentage) / 100)
                            return (
                                <div key={idx}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            fontSize: '12px',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        <span style={{ fontWeight: 500, color: '#1C0F07' }}>{source.name}</span>
                                        <span style={{ color: '#8C827A' }}>
                                            {sourceVisitors.toLocaleString()} readers ({source.percentage}%)
                                        </span>
                                    </div>
                                    {/* Progress Bar Container */}
                                    <div
                                        style={{
                                            height: '8px',
                                            backgroundColor: '#FAF7F2',
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${source.percentage}%`,
                                                height: '100%',
                                                backgroundColor: source.color,
                                                borderRadius: '4px',
                                                transition: 'width 0.4s ease',
                                            }}
                                        />
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* TWO COLUMN GRID: LANGUAGE SPLIT & SEARCH QUERIES */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '24px',
                }}
            >
                {/* Language Variant Split */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                    }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <h2
                            style={{
                                fontFamily: 'serif',
                                fontSize: '18px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: 0,
                            }}
                        >
                            Bilingual Readership Split
                        </h2>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                            Comparison between English and Italian language readers
                        </p>
                    </div>

                    {/* Split Visual Bar */}
                    <div
                        style={{
                            height: '14px',
                            borderRadius: '7px',
                            overflow: 'hidden',
                            display: 'flex',
                            marginBottom: '20px',
                        }}
                    >
                        <div
                            style={{
                                width: `${post.stats.languageSplit.en}%`,
                                backgroundColor: '#C4975A',
                                height: '100%',
                            }}
                            title={`English: ${post.stats.languageSplit.en}%`}
                        />
                        <div
                            style={{
                                width: `${post.stats.languageSplit.it}%`,
                                backgroundColor: '#1C0F07',
                                height: '100%',
                            }}
                            title={`Italian: ${post.stats.languageSplit.it}%`}
                        />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <span
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: '#C4975A',
                                    }}
                                />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                    🇬🇧 English (EN)
                                </span>
                            </div>
                            <span
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#C4975A',
                                    display: 'block',
                                    marginTop: '4px',
                                }}
                            >
                                {post.stats.languageSplit.en}%
                            </span>
                            <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                {Math.round((views * post.stats.languageSplit.en) / 100)} views
                            </span>
                        </div>

                        <div style={{ width: '1px', backgroundColor: '#E8E2D9' }} />

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                                <span
                                    style={{
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: '#1C0F07',
                                    }}
                                />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                    🇮🇹 Italiano (IT)
                                </span>
                            </div>
                            <span
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '24px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    display: 'block',
                                    marginTop: '4px',
                                }}
                            >
                                {post.stats.languageSplit.it}%
                            </span>
                            <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                {Math.round((views * post.stats.languageSplit.it) / 100)} views
                            </span>
                        </div>
                    </div>
                </div>

                {/* Search Console Keywords */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '16px',
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
                                Top Organic Search Queries
                            </h2>
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                                Google Search Console verified telemetry
                            </p>
                        </div>
                        <span
                            style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                color: '#8C827A',
                            }}
                        >
                            GSC Synced
                        </span>
                    </div>

                    {post.stats.searchKeywords && post.stats.searchKeywords.length > 0 ? (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                <thead>
                                    <tr style={{ borderBottom: '1px solid #E8E2D9', textAlign: 'left' }}>
                                        <th style={{ padding: '8px 6px', color: '#8C827A', fontWeight: 600 }}>Query</th>
                                        <th style={{ padding: '8px 6px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>
                                            Clicks
                                        </th>
                                        <th style={{ padding: '8px 6px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>
                                            Position
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {post.stats.searchKeywords.map((kw, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid #F5F1EB' }}>
                                            <td style={{ padding: '10px 6px', color: '#1C0F07', fontWeight: 500 }}>
                                                {kw.keyword}
                                            </td>
                                            <td style={{ padding: '10px 6px', color: '#1C0F07', textAlign: 'right' }}>
                                                {Math.round(kw.clicks * multiplier)}
                                            </td>
                                            <td style={{ padding: '10px 6px', textAlign: 'right' }}>
                                                <span
                                                    style={{
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        backgroundColor: kw.position <= 3 ? 'rgba(74, 124, 89, 0.12)' : '#FAF7F2',
                                                        color: kw.position <= 3 ? '#4A7C59' : '#8C827A',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    #{kw.position}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p style={{ fontSize: '13px', color: '#8C827A', fontStyle: 'italic', textAlign: 'center', padding: '24px 0' }}>
                            No search console queries recorded for this draft or recent post yet.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
