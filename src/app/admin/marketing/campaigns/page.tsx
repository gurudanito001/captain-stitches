'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    MarketingCampaign,
    getAllCampaigns,
    deleteCampaign,
    duplicateCampaign,
} from '@/data/adminMarketingData'

export default function AllCampaignsPage() {
    const router = useRouter()
    const [campaigns, setCampaigns] = useState<MarketingCampaign[]>([])
    const [statusTab, setStatusTab] = useState<'all' | 'sent' | 'scheduled' | 'draft'>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        setCampaigns(getAllCampaigns())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const counts = useMemo(() => {
        return {
            all: campaigns.length,
            sent: campaigns.filter((c) => c.status === 'sent').length,
            scheduled: campaigns.filter((c) => c.status === 'scheduled').length,
            draft: campaigns.filter((c) => c.status === 'draft').length,
        }
    }, [campaigns])

    const filteredCampaigns = useMemo(() => {
        return campaigns.filter((c) => {
            if (statusTab !== 'all' && c.status !== statusTab) return false
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchName = c.name.toLowerCase().includes(q)
                const matchSubjEN = c.subjectEN.toLowerCase().includes(q)
                const matchSubjIT = c.subjectIT.toLowerCase().includes(q)
                if (!matchName && !matchSubjEN && !matchSubjIT) return false
            }
            return true
        })
    }, [campaigns, statusTab, searchQuery])

    const handleDuplicate = (id: string) => {
        const cloned = duplicateCampaign(id)
        if (cloned) {
            setCampaigns(getAllCampaigns())
            showToast('Campaign cloned as draft')
            router.push(`/admin/marketing/campaigns/${cloned.id}/edit`)
        }
    }

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this campaign?')) return
        const updated = deleteCampaign(id)
        setCampaigns(updated)
        showToast('Campaign deleted')
    }

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 0 80px' }}>
            {/* Toast Notification */}
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
                        <Link href="/admin/marketing" style={{ color: '#8C827A', textDecoration: 'none' }}>
                            Marketing
                        </Link>
                        <span>/</span>
                        <span style={{ color: '#C4975A' }}>Campaigns</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h1
                            style={{
                                fontFamily: 'serif',
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: 0,
                            }}
                        >
                            Email Broadcasts & Campaigns
                        </h1>
                        <span
                            style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#C4975A',
                            }}
                        >
                            {campaigns.length} Total
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: '4px 0 0' }}>
                        Complete history of dispatched newsletters, scheduled seasonal drops, and draft compositions.
                    </p>
                </div>

                <Link
                    href="/admin/marketing/campaigns/new"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 22px',
                        borderRadius: '8px',
                        backgroundColor: '#C4975A',
                        color: '#1C0F07',
                        fontSize: '13px',
                        fontWeight: 600,
                        textDecoration: 'none',
                        boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                    }}
                >
                    + Write New Campaign
                </Link>
            </div>

            {/* FILTER TABS & SEARCH BAR */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    padding: '16px 20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                {/* Tabs */}
                <div style={{ display: 'flex', gap: '6px' }}>
                    {(
                        [
                            { key: 'all', label: 'All Campaigns', count: counts.all },
                            { key: 'sent', label: 'Sent', count: counts.sent },
                            { key: 'scheduled', label: 'Scheduled', count: counts.scheduled },
                            { key: 'draft', label: 'Drafts', count: counts.draft },
                        ] as const
                    ).map((tab) => (
                        <button
                            key={tab.key}
                            type="button"
                            onClick={() => setStatusTab(tab.key)}
                            style={{
                                padding: '7px 14px',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: statusTab === tab.key ? '#1C0F07' : '#FAF7F2',
                                color: statusTab === tab.key ? '#FAF7F2' : '#8C827A',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <span>{tab.label}</span>
                            <span
                                style={{
                                    padding: '1px 6px',
                                    borderRadius: '10px',
                                    fontSize: '10px',
                                    backgroundColor: statusTab === tab.key ? '#331C10' : '#E8E2D9',
                                    color: statusTab === tab.key ? '#FAF7F2' : '#4A3D36',
                                }}
                            >
                                {tab.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Search input */}
                <div style={{ position: 'relative', minWidth: '280px' }}>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or subject line..."
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 34px',
                            borderRadius: '8px',
                            border: '1px solid #E8E2D9',
                            fontSize: '12px',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                    <span
                        style={{
                            position: 'absolute',
                            left: '10px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#8C827A',
                            fontSize: '13px',
                        }}
                    >
                        🔍
                    </span>
                </div>
            </div>

            {/* CAMPAIGNS TABLE */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: '#FAF7F2',
                                    borderBottom: '1px solid #E8E2D9',
                                    textAlign: 'left',
                                }}
                            >
                                <th style={{ padding: '14px 18px', color: '#8C827A', fontWeight: 600 }}>Campaign</th>
                                <th style={{ padding: '14px 14px', color: '#8C827A', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '14px 14px', color: '#8C827A', fontWeight: 600 }}>Audience</th>
                                <th style={{ padding: '14px 14px', color: '#8C827A', fontWeight: 600 }}>Timing</th>
                                <th style={{ padding: '14px 14px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>
                                    Open Rate
                                </th>
                                <th style={{ padding: '14px 14px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>
                                    Click Rate
                                </th>
                                <th style={{ padding: '14px 18px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCampaigns.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '48px 16px', textAlign: 'center', color: '#8C827A' }}>
                                        No campaigns found in this view.
                                    </td>
                                </tr>
                            ) : (
                                filteredCampaigns.map((camp) => (
                                    <tr key={camp.id} style={{ borderBottom: '1px solid #F5F1EB' }}>
                                        {/* Campaign & Subject */}
                                        <td style={{ padding: '16px 18px' }}>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                                <strong style={{ color: '#1C0F07', fontSize: '14px' }}>
                                                    {camp.name}
                                                </strong>
                                                <span style={{ fontSize: '12px', color: '#4A3D36' }}>
                                                    🇬🇧 {camp.subjectEN}
                                                </span>
                                                {camp.subjectIT && (
                                                    <span style={{ fontSize: '11px', color: '#8C827A', fontStyle: 'italic' }}>
                                                        🇮🇹 {camp.subjectIT}
                                                    </span>
                                                )}
                                            </div>
                                        </td>

                                        {/* Status */}
                                        <td style={{ padding: '14px 14px' }}>
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 700,
                                                    textTransform: 'uppercase',
                                                    padding: '3px 8px',
                                                    borderRadius: '12px',
                                                    backgroundColor:
                                                        camp.status === 'sent'
                                                            ? 'rgba(74, 124, 89, 0.12)'
                                                            : camp.status === 'scheduled'
                                                            ? 'rgba(58, 125, 173, 0.12)'
                                                            : 'rgba(217, 131, 36, 0.12)',
                                                    color:
                                                        camp.status === 'sent'
                                                            ? '#3B6E48'
                                                            : camp.status === 'scheduled'
                                                            ? '#2C618C'
                                                            : '#B36615',
                                                }}
                                            >
                                                {camp.status}
                                            </span>
                                        </td>

                                        {/* Audience */}
                                        <td style={{ padding: '14px 14px' }}>
                                            <span style={{ fontWeight: 600, color: '#1C0F07', display: 'block' }}>
                                                {camp.targetSegmentName || 'All Active Subscribers'}
                                            </span>
                                            <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                                {camp.recipientCount} recipients
                                            </span>
                                        </td>

                                        {/* Timing */}
                                        <td style={{ padding: '14px 14px', fontSize: '12px', color: '#4A3D36' }}>
                                            {camp.status === 'sent'
                                                ? camp.sendDate
                                                : camp.status === 'scheduled'
                                                ? `Scheduled: ${camp.scheduledDate} · ${camp.scheduledTime}`
                                                : `Draft (Saved ${camp.lastSaved || 'recently'})`}
                                        </td>

                                        {/* Open Rate */}
                                        <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                                            {camp.stats ? (
                                                <span style={{ fontWeight: 600, color: '#4A7C59' }}>
                                                    {camp.stats.openRate}%
                                                </span>
                                            ) : (
                                                <span style={{ color: '#8C827A' }}>—</span>
                                            )}
                                        </td>

                                        {/* Click Rate */}
                                        <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                                            {camp.stats ? (
                                                <span style={{ fontWeight: 600, color: '#3A7DAD' }}>
                                                    {camp.stats.clickRate}%
                                                </span>
                                            ) : (
                                                <span style={{ color: '#8C827A' }}>—</span>
                                            )}
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                {camp.status === 'sent' ? (
                                                    <Link
                                                        href={`/admin/marketing/campaigns/${camp.id}`}
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#1C0F07',
                                                            color: '#FAF7F2',
                                                            fontSize: '11px',
                                                            fontWeight: 500,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        Report ↗
                                                    </Link>
                                                ) : (
                                                    <Link
                                                        href={`/admin/marketing/campaigns/${camp.id}/edit`}
                                                        style={{
                                                            padding: '4px 10px',
                                                            borderRadius: '4px',
                                                            backgroundColor: '#C4975A',
                                                            color: '#1C0F07',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        Edit ✎
                                                    </Link>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => handleDuplicate(camp.id)}
                                                    title="Duplicate"
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #E8E2D9',
                                                        backgroundColor: '#FFFFFF',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Clone
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(camp.id)}
                                                    title="Delete"
                                                    style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '4px',
                                                        border: '1px solid rgba(199, 43, 43, 0.2)',
                                                        backgroundColor: '#FFFFFF',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                        color: '#C72B2B',
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
