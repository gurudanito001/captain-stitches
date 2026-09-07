'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
    MarketingCampaign,
    getCampaignById,
    duplicateCampaign,
    deleteSubscribers,
} from '@/data/adminMarketingData'

export default function CampaignReportPage() {
    const params = useParams()
    const router = useRouter()
    const campaignId = params.id as string

    const [campaign, setCampaign] = useState<MarketingCampaign | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeLangTab, setActiveLangTab] = useState<'EN' | 'IT'>('EN')
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!campaignId) return
        const found = getCampaignById(campaignId)
        if (found) {
            setCampaign(found)
        }
        setIsLoading(false)
    }, [campaignId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleDuplicate = () => {
        if (!campaign) return
        const cloned = duplicateCampaign(campaign.id)
        if (cloned) {
            showToast('Campaign cloned as fresh draft')
            router.push(`/admin/marketing/campaigns/${cloned.id}/edit`)
        }
    }

    const handleCleanBounce = (email: string) => {
        // Mock cleanup
        showToast(`Permanently scrubbed ${email} from active list`)
    }

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
                    Gathering dispatch telemetry...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!campaign) {
        return (
            <div
                style={{
                    maxWidth: '520px',
                    margin: '60px auto',
                    padding: '40px 24px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ fontFamily: 'serif', fontSize: '20px', color: '#1C0F07', marginBottom: '8px' }}>
                    Campaign Telemetry Not Found
                </h2>
                <p style={{ fontSize: '13px', color: '#8C827A', marginBottom: '20px' }}>
                    Could not retrieve telemetry for ID: {campaignId}
                </p>
                <Link
                    href="/admin/marketing/campaigns"
                    style={{
                        padding: '9px 18px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        borderRadius: '6px',
                        fontSize: '13px',
                        textDecoration: 'none',
                    }}
                >
                    Return to Campaigns
                </Link>
            </div>
        )
    }

    // Default mock stats if draft was opened
    const stats = campaign.stats || {
        delivered: campaign.recipientCount,
        opened: Math.round(campaign.recipientCount * 0.58),
        uniqueOpens: Math.round(campaign.recipientCount * 0.52),
        openRate: 58.2,
        clicked: Math.round(campaign.recipientCount * 0.24),
        uniqueClicks: Math.round(campaign.recipientCount * 0.21),
        clickRate: 24.1,
        unsubscribes: 1,
        hardBounces: 1,
        softBounces: 0,
        hourlyOpens48h: [
            { hour: 1, label: 'Hour 1', count: 24 },
            { hour: 2, label: 'Hour 2', count: 38 },
            { hour: 3, label: 'Hour 3', count: 18 },
            { hour: 6, label: 'Hour 6', count: 12 },
            { hour: 12, label: 'Hour 12', count: 9 },
            { hour: 24, label: '+24h', count: 6 },
        ],
        clickMapLinks: [
            {
                url: 'https://captainstitches.com/catalogue',
                label: 'Explore Capsule Collection Button',
                clicks: 28,
                uniqueClicks: 26,
                ctr: 17.8,
                topPercent: 55,
            },
            {
                url: 'https://captainstitches.com/blog/linen-tailoring-guide',
                label: 'Linen Sartorial Care Guide',
                clicks: 12,
                uniqueClicks: 10,
                ctr: 6.8,
                topPercent: 42,
            },
        ],
        deviceSplit: { mobile: 70, desktop: 30 },
        locationSplit: { italy: 52, nigeria: 40, other: 8 },
        languageSplit: { en: 48, it: 52 },
        unsubscribedList: [
            { name: 'Gianluca Conti', email: 'gianluca.conti@torino-textile.it', reason: 'Too many updates' },
        ],
        bouncedList: [
            { email: 'tunde.adeleke@invalid-domain-bounce.ng', type: 'Hard Bounce', reason: '550 Host unreachable' },
        ],
    }

    const currentContent = activeLangTab === 'EN' ? campaign.contentEN : campaign.contentIT
    const currentSubject = activeLangTab === 'EN' ? campaign.subjectEN : campaign.subjectIT

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
            <div style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8C827A', marginBottom: '8px' }}>
                    <Link href="/admin/marketing" style={{ color: '#8C827A', textDecoration: 'none' }}>
                        Marketing
                    </Link>
                    <span>/</span>
                    <Link href="/admin/marketing/campaigns" style={{ color: '#8C827A', textDecoration: 'none' }}>
                        Campaigns
                    </Link>
                    <span>/</span>
                    <span style={{ color: '#C4975A' }}>Report</span>
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
                                    fontSize: '28px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: 0,
                                }}
                            >
                                {campaign.name}
                            </h1>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    padding: '3px 8px',
                                    borderRadius: '12px',
                                    backgroundColor: 'rgba(74, 124, 89, 0.12)',
                                    color: '#3B6E48',
                                }}
                            >
                                {campaign.status}
                            </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                            Sent: {campaign.sendDate || 'Sep 01, 2026'} at {campaign.sendTime || '10:30 AM CET'} • Audience:{' '}
                            <strong>{campaign.targetSegmentName || 'All Active Subscribers'}</strong> ({campaign.recipientCount} recipients)
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={handleDuplicate}
                            style={{
                                padding: '9px 18px',
                                borderRadius: '8px',
                                border: '1px solid #C4975A',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Duplicate Campaign ⎘
                        </button>
                    </div>
                </div>
            </div>

            {/* PERFORMANCE STATS STRIP (6 CARDS) */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '16px',
                    marginBottom: '28px',
                }}
            >
                {[
                    { label: 'Recipients', value: campaign.recipientCount, sub: 'Total dispatches', color: '#1C0F07' },
                    { label: 'Delivered', value: stats.delivered, sub: '98.6% deliverability', color: '#4A7C59' },
                    {
                        label: 'Open Rate',
                        value: `${stats.openRate}%`,
                        sub: `${stats.uniqueOpens} unique opens`,
                        color: '#4A7C59',
                    },
                    {
                        label: 'Click Rate',
                        value: `${stats.clickRate}%`,
                        sub: `${stats.uniqueClicks} unique clicks`,
                        color: '#3A7DAD',
                    },
                    {
                        label: 'Unsubscribed',
                        value: stats.unsubscribes,
                        sub: `${((stats.unsubscribes / (stats.delivered || 1)) * 100).toFixed(1)}% churn`,
                        color: '#8C827A',
                    },
                    {
                        label: 'Bounces',
                        value: stats.hardBounces + stats.softBounces,
                        sub: `${stats.hardBounces} hard / ${stats.softBounces} soft`,
                        color: '#C72B2B',
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

            {/* TWO COLUMN GRID: OPEN RATE OVER TIME & CLICK MAP OVERLAY */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)',
                    gap: '24px',
                    marginBottom: '28px',
                }}
            >
                {/* 1. OPEN RATE OVER TIME (FIRST 48 HOURS) */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: 0,
                                }}
                            >
                                Cumulative Opens (First 48 Hours)
                            </h2>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '3px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: 'rgba(74, 124, 89, 0.12)',
                                    color: '#3B6E48',
                                }}
                            >
                                Peak: Hours 1–2
                            </span>
                        </div>
                        <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                            53% of all opens occurred within 120 minutes of morning European dispatch
                        </p>
                    </div>

                    {/* Visual 48h bars */}
                    <div
                        style={{
                            height: '180px',
                            display: 'flex',
                            alignItems: 'flex-end',
                            justifyContent: 'space-between',
                            gap: '12px',
                            padding: '20px 10px 0',
                            borderBottom: '1px solid #E8E2D9',
                        }}
                    >
                        {stats.hourlyOpens48h.map((pt, i) => {
                            const maxVal = Math.max(...stats.hourlyOpens48h.map((p) => p.count)) || 1
                            const heightPct = Math.max(12, Math.round((pt.count / maxVal) * 100))
                            return (
                                <div
                                    key={i}
                                    style={{
                                        flex: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        height: '100%',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <span style={{ fontSize: '10px', fontWeight: 600, color: '#1C0F07', marginBottom: '4px' }}>
                                        {pt.count}
                                    </span>
                                    <div
                                        style={{
                                            width: '100%',
                                            maxWidth: '44px',
                                            height: `${heightPct}%`,
                                            backgroundColor: i === 1 ? '#C4975A' : '#E8E2D9',
                                            borderRadius: '4px 4px 0 0',
                                        }}
                                    />
                                    <span style={{ fontSize: '10px', color: '#8C827A', marginTop: '6px' }}>{pt.label}</span>
                                </div>
                            )
                        })}
                    </div>

                    {/* TOP CLICKED LINKS RANKED TABLE */}
                    <div style={{ marginTop: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#1C0F07', margin: '0 0 12px' }}>
                            Top Clicked Links Breakdown
                        </h3>

                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E8E2D9', textAlign: 'left', color: '#8C827A' }}>
                                    <th style={{ padding: '8px 4px' }}>Link Target</th>
                                    <th style={{ padding: '8px 4px', textAlign: 'right' }}>Total Clicks</th>
                                    <th style={{ padding: '8px 4px', textAlign: 'right' }}>Unique</th>
                                    <th style={{ padding: '8px 4px', textAlign: 'right' }}>CTR %</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.clickMapLinks.map((link, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #F5F1EB' }}>
                                        <td style={{ padding: '10px 4px' }}>
                                            <strong style={{ display: 'block', color: '#1C0F07' }}>{link.label}</strong>
                                            <span style={{ color: '#8C827A', fontSize: '11px', fontFamily: 'monospace' }}>
                                                {link.url}
                                            </span>
                                        </td>
                                        <td style={{ padding: '10px 4px', textAlign: 'right', fontWeight: 600, color: '#1C0F07' }}>
                                            {link.clicks}
                                        </td>
                                        <td style={{ padding: '10px 4px', textAlign: 'right', color: '#4A3D36' }}>
                                            {link.uniqueClicks}
                                        </td>
                                        <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                                            <span
                                                style={{
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: 'rgba(58, 125, 173, 0.12)',
                                                    color: '#2C618C',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                {link.ctr}%
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 2. VISUAL EMAIL CLICK MAP OVERLAY */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
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
                                Visual Email Click Map
                            </h2>
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: '4px 0 0' }}>
                                Interaction hotspots overlaid onto the sent newsletter
                            </p>
                        </div>

                        {/* Language switcher */}
                        <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                                type="button"
                                onClick={() => setActiveLangTab('EN')}
                                style={{
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    backgroundColor: activeLangTab === 'EN' ? '#1C0F07' : '#FAF7F2',
                                    color: activeLangTab === 'EN' ? '#FAF7F2' : '#8C827A',
                                    cursor: 'pointer',
                                }}
                            >
                                EN
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveLangTab('IT')}
                                style={{
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    backgroundColor: activeLangTab === 'IT' ? '#1C0F07' : '#FAF7F2',
                                    color: activeLangTab === 'IT' ? '#FAF7F2' : '#8C827A',
                                    cursor: 'pointer',
                                }}
                            >
                                IT
                            </button>
                        </div>
                    </div>

                    {/* Email Mockup with Hotspot Pills */}
                    <div
                        style={{
                            flex: 1,
                            borderRadius: '12px',
                            border: '1px solid #E8E2D9',
                            overflow: 'hidden',
                            position: 'relative',
                            backgroundColor: '#FAF7F2',
                        }}
                    >
                        <div style={{ backgroundColor: '#1C0F07', padding: '12px 16px', color: '#FAF7F2' }}>
                            <span style={{ fontFamily: 'serif', fontSize: '14px', fontWeight: 700 }}>
                                CaptainStitches
                            </span>
                        </div>

                        <div style={{ padding: '20px', backgroundColor: '#FFFFFF', position: 'relative' }}>
                            {currentContent.featuredImage && (
                                <div
                                    style={{
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        position: 'relative',
                                        borderRadius: '6px',
                                        overflow: 'hidden',
                                        marginBottom: '14px',
                                    }}
                                >
                                    <Image
                                        src={currentContent.featuredImage}
                                        alt={currentContent.title}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            )}

                            <h3 style={{ fontFamily: 'serif', fontSize: '16px', color: '#1C0F07', margin: '0 0 6px' }}>
                                {currentContent.title}
                            </h3>
                            <p style={{ fontSize: '12px', lineHeight: 1.6, color: '#4A3D36', margin: '0 0 18px' }}>
                                {currentContent.body.slice(0, 180)}...
                            </p>

                            {/* Hotspot 1: Catalogue button */}
                            <div style={{ position: 'relative', textAlign: 'center', margin: '20px 0' }}>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '9px 20px',
                                        backgroundColor: '#C4975A',
                                        color: '#1C0F07',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 700,
                                    }}
                                >
                                    {currentContent.ctaText || 'Explore Collection →'}
                                </span>

                                {/* Floating Hotspot Badge */}
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: '-12px',
                                        right: '25%',
                                        backgroundColor: '#1C0F07',
                                        color: '#FAF7F2',
                                        padding: '2px 8px',
                                        borderRadius: '10px',
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        border: '1px solid #C4975A',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                                    }}
                                >
                                    28 clicks (17.8% CTR)
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AUDIENCE BREAKDOWN & SUBSCRIBER ACTIVITY */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                    gap: '24px',
                }}
            >
                {/* Audience Demographics */}
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
                        Audience Demographic Split
                    </h2>

                    {/* Language Split */}
                    <div style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 600, color: '#1C0F07' }}>Language Opens</span>
                            <span style={{ color: '#8C827A' }}>
                                EN {stats.languageSplit.en}% • IT {stats.languageSplit.it}%
                            </span>
                        </div>
                        <div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${stats.languageSplit.en}%`, backgroundColor: '#C4975A' }} />
                            <div style={{ width: `${stats.languageSplit.it}%`, backgroundColor: '#1C0F07' }} />
                        </div>
                    </div>

                    {/* Location Split */}
                    <div style={{ marginBottom: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 600, color: '#1C0F07' }}>Location Breakdown</span>
                            <span style={{ color: '#8C827A' }}>
                                Italy {stats.locationSplit.italy}% • Nigeria {stats.locationSplit.nigeria}%
                            </span>
                        </div>
                        <div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${stats.locationSplit.italy}%`, backgroundColor: '#4A7C59' }} />
                            <div style={{ width: `${stats.locationSplit.nigeria}%`, backgroundColor: '#3A7DAD' }} />
                            <div style={{ width: `${stats.locationSplit.other}%`, backgroundColor: '#8C827A' }} />
                        </div>
                    </div>

                    {/* Device Split */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 600, color: '#1C0F07' }}>Device Client</span>
                            <span style={{ color: '#8C827A' }}>
                                Mobile {stats.deviceSplit.mobile}% • Desktop {stats.deviceSplit.desktop}%
                            </span>
                        </div>
                        <div style={{ height: '8px', display: 'flex', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${stats.deviceSplit.mobile}%`, backgroundColor: '#C4975A' }} />
                            <div style={{ width: `${stats.deviceSplit.desktop}%`, backgroundColor: '#DCD5CB' }} />
                        </div>
                    </div>
                </div>

                {/* Churn & Bounce Management */}
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
                        Subscriber Churn & Bounce Management
                    </h2>

                    {/* Bounces */}
                    <div style={{ marginBottom: '18px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#C72B2B', display: 'block', marginBottom: '8px' }}>
                            Permanent Hard Bounces ({stats.bouncedList.length})
                        </span>
                        {stats.bouncedList.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {stats.bouncedList.map((b, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: '#FAF7F2',
                                            border: '1px solid #E8E2D9',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            fontSize: '12px',
                                        }}
                                    >
                                        <div>
                                            <span style={{ fontFamily: 'monospace', color: '#1C0F07' }}>{b.email}</span>
                                            <span style={{ color: '#8C827A', display: 'block', fontSize: '11px' }}>
                                                {b.reason}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleCleanBounce(b.email)}
                                            style={{
                                                padding: '4px 8px',
                                                borderRadius: '4px',
                                                border: '1px solid rgba(199, 43, 43, 0.2)',
                                                backgroundColor: '#FFFFFF',
                                                color: '#C72B2B',
                                                fontSize: '11px',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Scrub Address
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>Zero bounces recorded.</p>
                        )}
                    </div>

                    {/* Unsubscribes */}
                    <div>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#8C827A', display: 'block', marginBottom: '8px' }}>
                            Unsubscribed From This Dispatch ({stats.unsubscribedList.length})
                        </span>
                        {stats.unsubscribedList.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {stats.unsubscribedList.map((u, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            backgroundColor: '#FAF7F2',
                                            border: '1px solid #E8E2D9',
                                            fontSize: '12px',
                                        }}
                                    >
                                        <strong style={{ color: '#1C0F07' }}>{u.name}</strong> ({u.email})
                                        {u.reason && (
                                            <span style={{ color: '#8C827A', display: 'block', fontSize: '11px' }}>
                                                Reason: "{u.reason}"
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>No patrons unsubscribed.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
