'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    MarketingCampaign,
    MarketingSegment,
    getAllSegments,
    getAllSubscribers,
    saveCampaign,
    getMarketingSettings,
} from '@/data/adminMarketingData'

interface AdminCampaignComposerProps {
    initialCampaign: MarketingCampaign
    isNew?: boolean
}

export function AdminCampaignComposer({ initialCampaign, isNew = false }: AdminCampaignComposerProps) {
    const router = useRouter()
    const [campaign, setCampaign] = useState<MarketingCampaign>(initialCampaign)
    const [activeLang, setActiveLang] = useState<'EN' | 'IT'>('EN')
    const [segments, setSegments] = useState<MarketingSegment[]>([])
    const [allSubscribers, setAllSubscribers] = useState<any[]>([])
    const [settings, setSettings] = useState(getMarketingSettings())

    // Toast state
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSavedTime, setLastSavedTime] = useState(initialCampaign.lastSaved || 'Not saved yet')

    // Modals
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false)
    const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop')
    const [previewLang, setPreviewLang] = useState<'EN' | 'IT'>('EN')

    const [isTestEmailModalOpen, setIsTestEmailModalOpen] = useState(false)
    const [testEmailAddress, setTestEmailAddress] = useState('samuelson@captainstitches.com')

    const [isSendModalOpen, setIsSendModalOpen] = useState(false)
    const [sendMode, setSendMode] = useState<'now' | 'schedule'>('now')
    const [scheduleDate, setScheduleDate] = useState(
        campaign.scheduledDate || new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0]
    )
    const [scheduleTime, setScheduleTime] = useState(campaign.scheduledTime || '10:00')

    const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        setSegments(getAllSegments())
        setAllSubscribers(getAllSubscribers())
        setSettings(getMarketingSettings())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    // Dynamic Recipient Count Calculation
    const calculatedRecipientCount = useMemo(() => {
        const active = allSubscribers.filter((s) => s.status === 'active')
        if (campaign.audienceType === 'en_only') {
            return active.filter((s) => s.language === 'EN').length
        }
        if (campaign.audienceType === 'it_only') {
            return active.filter((s) => s.language === 'IT').length
        }
        if (campaign.audienceType === 'segment' && campaign.targetSegmentId) {
            const seg = segments.find((s) => s.id === campaign.targetSegmentId)
            return seg ? seg.subscriberCount : active.length
        }
        return active.length
    }, [allSubscribers, campaign.audienceType, campaign.targetSegmentId, segments])

    const handleSaveDraft = () => {
        setIsSaving(true)
        const updated: MarketingCampaign = {
            ...campaign,
            recipientCount: calculatedRecipientCount,
        }
        saveCampaign(updated)
        setCampaign(updated)
        setTimeout(() => {
            setIsSaving(false)
            setLastSavedTime('Just now')
            showToast('Campaign draft saved successfully')
            if (isNew) {
                router.replace(`/admin/marketing/campaigns/${updated.id}/edit`)
            }
        }, 250)
    }

    const handleSendNow = () => {
        const now = new Date()
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

        const updated: MarketingCampaign = {
            ...campaign,
            status: 'sent',
            sendDate: dateStr,
            sendTime: `${timeStr} CET`,
            recipientCount: calculatedRecipientCount,
            stats: {
                delivered: calculatedRecipientCount,
                opened: 0,
                uniqueOpens: 0,
                openRate: 0,
                clicked: 0,
                uniqueClicks: 0,
                clickRate: 0,
                unsubscribes: 0,
                hardBounces: 0,
                softBounces: 0,
                hourlyOpens48h: [{ hour: 1, label: 'Now', count: 0 }],
                clickMapLinks: [],
                deviceSplit: { mobile: 50, desktop: 50 },
                locationSplit: { italy: 50, nigeria: 50, other: 0 },
                languageSplit: { en: 50, it: 50 },
                unsubscribedList: [],
                bouncedList: [],
            },
        }

        saveCampaign(updated)
        setCampaign(updated)
        setIsSendModalOpen(false)
        showToast(`Campaign broadcast initiated to ${calculatedRecipientCount} patrons!`)
        setTimeout(() => {
            router.push(`/admin/marketing/campaigns/${updated.id}`)
        }, 800)
    }

    const handleScheduleSend = () => {
        const updated: MarketingCampaign = {
            ...campaign,
            status: 'scheduled',
            scheduledDate: scheduleDate,
            scheduledTime: scheduleTime,
            recipientCount: calculatedRecipientCount,
        }

        saveCampaign(updated)
        setCampaign(updated)
        setIsSendModalOpen(false)
        showToast(`Campaign scheduled for ${scheduleDate} at ${scheduleTime} CET`)
        setTimeout(() => {
            router.push('/admin/marketing/campaigns')
        }, 800)
    }

    const handleSendTestPing = () => {
        if (!testEmailAddress.trim()) return
        setIsTestEmailModalOpen(false)
        showToast(`Test dispatch transmitted to ${testEmailAddress} via ${settings.platform.toUpperCase()}`)
    }

    // Formatting insertion helper
    const insertFormatting = (prefix: string, suffix: string = '') => {
        const textarea = bodyTextareaRef.current
        if (!textarea) return

        const activeContent = activeLang === 'EN' ? campaign.contentEN : campaign.contentIT
        const text = activeContent.body
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = text.substring(start, end)
        const replacement = `${prefix}${selected || 'text'}${suffix}`

        const newText = text.substring(0, start) + replacement + text.substring(end)
        const updatedContent = { ...activeContent, body: newText }

        if (activeLang === 'EN') {
            setCampaign({ ...campaign, contentEN: updatedContent })
        } else {
            setCampaign({ ...campaign, contentIT: updatedContent })
        }

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4))
        }, 50)
    }

    const insertBlock = (blockType: string) => {
        const activeContent = activeLang === 'EN' ? campaign.contentEN : campaign.contentIT
        let blockText = ''
        if (blockType === 'intro') {
            blockText = `\n\n## Refined Bespoke Update\n\nDear Patron,\n\nWe are pleased to introduce our newest sartorial creation from Aba to your door in Europe.`
        } else if (blockType === 'product') {
            blockText = `\n\n### The Royal Silk Kaftan\nHand-loomed native silk Damask with hand-embroidered geometric neckband.\n- Sourced from traditional Aba master weavers\n- Finished with natural Italian horn buttons\n- Delivery within 7 to 10 days`
        } else if (blockType === 'divider') {
            blockText = `\n\n---\n\n`
        } else if (blockType === 'quote') {
            blockText = `\n\n> "Bespoke tailoring is not merely clothing; it is the physical architecture of confidence and lineage."\n`
        }

        const newBody = `${activeContent.body}${blockText}`
        const updatedContent = { ...activeContent, body: newBody }
        if (activeLang === 'EN') {
            setCampaign({ ...campaign, contentEN: updatedContent })
        } else {
            setCampaign({ ...campaign, contentIT: updatedContent })
        }
        showToast(`Inserted ${blockType} block`)
    }

    const currentContent = activeLang === 'EN' ? campaign.contentEN : campaign.contentIT
    const currentSubject = activeLang === 'EN' ? campaign.subjectEN : campaign.subjectIT
    const currentPreviewText = activeLang === 'EN' ? campaign.previewTextEN : campaign.previewTextIT

    return (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 0 80px' }}>
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

            {/* TOP STICKY BAR */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 40,
                    backgroundColor: '#FAF7F2',
                    padding: '14px 0 18px',
                    borderBottom: '1px solid #E8E2D9',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Link
                        href="/admin/marketing/campaigns"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            color: '#8C827A',
                            fontSize: '13px',
                            textDecoration: 'none',
                            fontWeight: 500,
                        }}
                    >
                        ← Campaigns
                    </Link>

                    <div style={{ width: '1px', height: '18px', backgroundColor: '#E8E2D9' }} />

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                backgroundColor:
                                    campaign.status === 'sent'
                                        ? 'rgba(74, 124, 89, 0.12)'
                                        : campaign.status === 'scheduled'
                                        ? 'rgba(58, 125, 173, 0.12)'
                                        : 'rgba(217, 131, 36, 0.12)',
                                color:
                                    campaign.status === 'sent'
                                        ? '#3B6E48'
                                        : campaign.status === 'scheduled'
                                        ? '#2C618C'
                                        : '#B36615',
                            }}
                        >
                            {campaign.status.toUpperCase()}
                        </span>
                        <span style={{ fontSize: '12px', color: '#8C827A' }}>Saved: {lastSavedTime}</span>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={() => setIsPreviewModalOpen(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
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
                        Preview & Test ↗
                    </button>

                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
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
                        {isSaving ? 'Saving...' : 'Save Draft'}
                    </button>

                    <button
                        type="button"
                        onClick={() => setIsSendModalOpen(true)}
                        style={{
                            padding: '9px 22px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#C4975A',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        Send or Schedule →
                    </button>
                </div>
            </div>

            {/* TWO COLUMN WORKSPACE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1.2fr)', gap: '28px' }}>
                {/* LEFT COLUMN: EDITORIAL FORM */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* SECTION 1: CAMPAIGN ENVELOPE */}
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
                            1. Campaign Envelope & Sender Details
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Internal Campaign Name * (For admin records)
                                </label>
                                <input
                                    type="text"
                                    value={campaign.name}
                                    onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                                    placeholder="e.g. September Mediterranean Linen Drop"
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        From Name
                                    </label>
                                    <input
                                        type="text"
                                        value={campaign.fromName}
                                        onChange={(e) => setCampaign({ ...campaign, fromName: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #E8E2D9',
                                            fontSize: '13px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        Reply-To Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={campaign.replyTo}
                                        onChange={(e) => setCampaign({ ...campaign, replyTo: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #E8E2D9',
                                            fontSize: '13px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: AUDIENCE SELECTION */}
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
                                marginBottom: '16px',
                            }}
                        >
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '18px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: 0,
                                }}
                            >
                                2. Audience Targeting
                            </h2>
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
                                {calculatedRecipientCount} Recipients Selected
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Target Audience Segment
                                </label>
                                <select
                                    value={campaign.audienceType}
                                    onChange={(e) => {
                                        const val = e.target.value as any
                                        setCampaign({
                                            ...campaign,
                                            audienceType: val,
                                            targetSegmentId: val === 'segment' ? segments[0]?.id : undefined,
                                        })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        backgroundColor: '#FAF7F2',
                                    }}
                                >
                                    <option value="all">All Active Subscribers ({allSubscribers.filter((s) => s.status === 'active').length})</option>
                                    <option value="en_only">English Language Only 🇬🇧</option>
                                    <option value="it_only">Italian Language Only 🇮🇹</option>
                                    <option value="segment">Custom Saved Segment...</option>
                                </select>
                            </div>

                            {campaign.audienceType === 'segment' && (
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        Choose Segment
                                    </label>
                                    <select
                                        value={campaign.targetSegmentId}
                                        onChange={(e) => {
                                            const seg = segments.find((s) => s.id === e.target.value)
                                            setCampaign({
                                                ...campaign,
                                                targetSegmentId: e.target.value,
                                                targetSegmentName: seg?.name,
                                            })
                                        }}
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #E8E2D9',
                                            fontSize: '13px',
                                            backgroundColor: '#FAF7F2',
                                        }}
                                    >
                                        {segments.map((seg) => (
                                            <option key={seg.id} value={seg.id}>
                                                {seg.name} ({seg.subscriberCount} patrons)
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Exclude Segment (Optional)
                                </label>
                                <select
                                    value={campaign.excludedSegmentId || ''}
                                    onChange={(e) => {
                                        const seg = segments.find((s) => s.id === e.target.value)
                                        setCampaign({
                                            ...campaign,
                                            excludedSegmentId: e.target.value || undefined,
                                            excludedSegmentName: seg?.name,
                                        })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        backgroundColor: '#FAF7F2',
                                    }}
                                >
                                    <option value="">None (Send to all in target)</option>
                                    {segments.map((seg) => (
                                        <option key={seg.id} value={seg.id}>
                                            Exclude: {seg.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: BILINGUAL CONTENT EDITOR */}
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
                                    3. Bilingual Email Content
                                </h2>
                                <p style={{ fontSize: '12px', color: '#8C827A', margin: 0 }}>
                                    Compose content for English and Italian audiences with automatic dispatch routing.
                                </p>
                            </div>

                            {/* Language Switcher Tabs */}
                            <div
                                style={{
                                    display: 'flex',
                                    backgroundColor: '#FAF7F2',
                                    borderRadius: '8px',
                                    padding: '3px',
                                    border: '1px solid #E8E2D9',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setActiveLang('EN')}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        border: 'none',
                                        backgroundColor: activeLang === 'EN' ? '#1C0F07' : 'transparent',
                                        color: activeLang === 'EN' ? '#FAF7F2' : '#8C827A',
                                    }}
                                >
                                    🇬🇧 English Version
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveLang('IT')}
                                    style={{
                                        padding: '6px 14px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        border: 'none',
                                        backgroundColor: activeLang === 'IT' ? '#1C0F07' : 'transparent',
                                        color: activeLang === 'IT' ? '#FAF7F2' : '#8C827A',
                                    }}
                                >
                                    🇮🇹 Italian Version
                                </button>
                            </div>
                        </div>

                        {/* Subject & Preview Text */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '22px' }}>
                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    <span>Subject Line ({activeLang}) *</span>
                                    <span style={{ color: currentSubject.length > 60 ? '#C72B2B' : '#8C827A' }}>
                                        {currentSubject.length} / 60 characters
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={currentSubject}
                                    onChange={(e) => {
                                        if (activeLang === 'EN') setCampaign({ ...campaign, subjectEN: e.target.value })
                                        else setCampaign({ ...campaign, subjectIT: e.target.value })
                                    }}
                                    placeholder={
                                        activeLang === 'EN'
                                            ? 'e.g. Announcing the Mediterranean Summer Linen Capsule ☀️'
                                            : 'e.g. Presentazione della Capsule Estiva in Lino Mediterraneo ☀️'
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '14px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div>
                                <div
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    <span>Inbox Preview Text ({activeLang})</span>
                                    <span style={{ color: currentPreviewText.length > 90 ? '#C72B2B' : '#8C827A' }}>
                                        {currentPreviewText.length} / 90 characters
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={currentPreviewText}
                                    onChange={(e) => {
                                        if (activeLang === 'EN') setCampaign({ ...campaign, previewTextEN: e.target.value })
                                        else setCampaign({ ...campaign, previewTextIT: e.target.value })
                                    }}
                                    placeholder="Snippet displayed alongside the subject line in Apple Mail / Gmail..."
                                    style={{
                                        width: '100%',
                                        padding: '9px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Title & Subtitle */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '18px' }}>
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Email Headline ({activeLang})
                                </label>
                                <input
                                    type="text"
                                    value={currentContent.title}
                                    onChange={(e) => {
                                        const updated = { ...currentContent, title: e.target.value }
                                        if (activeLang === 'EN') setCampaign({ ...campaign, contentEN: updated })
                                        else setCampaign({ ...campaign, contentIT: updated })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Email Subtitle ({activeLang})
                                </label>
                                <input
                                    type="text"
                                    value={currentContent.subtitle}
                                    onChange={(e) => {
                                        const updated = { ...currentContent, subtitle: e.target.value }
                                        if (activeLang === 'EN') setCampaign({ ...campaign, contentEN: updated })
                                        else setCampaign({ ...campaign, contentIT: updated })
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Featured Image Input */}
                        <div style={{ marginBottom: '18px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    marginBottom: '6px',
                                }}
                            >
                                Featured Header Image URL (1200 × 675px)
                            </label>
                            <input
                                type="text"
                                value={currentContent.featuredImage || ''}
                                onChange={(e) => {
                                    const updated = { ...currentContent, featuredImage: e.target.value }
                                    if (activeLang === 'EN') setCampaign({ ...campaign, contentEN: updated })
                                    else setCampaign({ ...campaign, contentIT: updated })
                                }}
                                placeholder="https://images.unsplash.com/..."
                                style={{
                                    width: '100%',
                                    padding: '9px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* RICH TEXT FORMATTING TOOLBAR */}
                        <div
                            style={{
                                border: '1px solid #E8E2D9',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                marginBottom: '20px',
                            }}
                        >
                            <div
                                style={{
                                    backgroundColor: '#FAF7F2',
                                    borderBottom: '1px solid #E8E2D9',
                                    padding: '8px 12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                }}
                            >
                                {[
                                    { label: 'B', title: 'Bold', action: () => insertFormatting('**', '**') },
                                    { label: 'I', title: 'Italic', action: () => insertFormatting('*', '*') },
                                    { label: 'H2', title: 'Heading 2', action: () => insertFormatting('\n## ', '\n') },
                                    { label: 'H3', title: 'Heading 3', action: () => insertFormatting('\n### ', '\n') },
                                    { label: '• List', title: 'Bullet List', action: () => insertFormatting('\n- ', '') },
                                    { label: '1. List', title: 'Numbered List', action: () => insertFormatting('\n1. ', '') },
                                    { label: '“ Quote', title: 'Blockquote', action: () => insertFormatting('\n> ', '\n') },
                                    { label: 'Link', title: 'Hyperlink', action: () => insertFormatting('[', '](https://)') },
                                ].map((btn, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        title={btn.title}
                                        onClick={btn.action}
                                        style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            border: '1px solid #DCD5CB',
                                            backgroundColor: '#FFFFFF',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            color: '#1C0F07',
                                        }}
                                    >
                                        {btn.label}
                                    </button>
                                ))}

                                <div style={{ width: '1px', height: '16px', backgroundColor: '#DCD5CB', margin: '0 4px' }} />

                                {/* Pre-built block helpers */}
                                <span style={{ fontSize: '11px', color: '#8C827A', fontWeight: 600 }}>Insert Block:</span>
                                <button
                                    type="button"
                                    onClick={() => insertBlock('intro')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid #C4975A',
                                        backgroundColor: '#FAF5EE',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#9C6F32',
                                        cursor: 'pointer',
                                    }}
                                >
                                    + Intro Block
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertBlock('product')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid #C4975A',
                                        backgroundColor: '#FAF5EE',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#9C6F32',
                                        cursor: 'pointer',
                                    }}
                                >
                                    + Garment Showcase
                                </button>
                                <button
                                    type="button"
                                    onClick={() => insertBlock('quote')}
                                    style={{
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        border: '1px solid #C4975A',
                                        backgroundColor: '#FAF5EE',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#9C6F32',
                                        cursor: 'pointer',
                                    }}
                                >
                                    + Master Quote
                                </button>
                            </div>

                            <textarea
                                ref={bodyTextareaRef}
                                rows={12}
                                value={currentContent.body}
                                onChange={(e) => {
                                    const updated = { ...currentContent, body: e.target.value }
                                    if (activeLang === 'EN') setCampaign({ ...campaign, contentEN: updated })
                                    else setCampaign({ ...campaign, contentIT: updated })
                                }}
                                placeholder="Compose your email narrative here..."
                                style={{
                                    width: '100%',
                                    padding: '16px',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* CTA BUTTON CONFIGURATION */}
                        <div
                            style={{
                                padding: '18px',
                                backgroundColor: '#FAF7F2',
                                borderRadius: '12px',
                                border: '1px solid #E8E2D9',
                            }}
                        >
                            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07', margin: '0 0 12px' }}>
                                Primary Call-To-Action (CTA) Button
                            </h3>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: '#8C827A',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        Button Label ({activeLang})
                                    </label>
                                    <input
                                        type="text"
                                        value={currentContent.ctaText || ''}
                                        onChange={(e) => {
                                            const updated = { ...currentContent, ctaText: e.target.value }
                                            if (activeLang === 'EN') setCampaign({ ...campaign, contentEN: updated })
                                            else setCampaign({ ...campaign, contentIT: updated })
                                        }}
                                        placeholder="e.g. Explore Capsule Collection →"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #E8E2D9',
                                            fontSize: '13px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            color: '#8C827A',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        Button Destination Link
                                    </label>
                                    <input
                                        type="text"
                                        value={currentContent.ctaUrl || ''}
                                        onChange={(e) => {
                                            const updated = { ...currentContent, ctaUrl: e.target.value }
                                            if (activeLang === 'EN') setCampaign({ ...campaign, contentEN: updated })
                                            else setCampaign({ ...campaign, contentIT: updated })
                                        }}
                                        placeholder="https://captainstitches.com/catalogue"
                                        style={{
                                            width: '100%',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #E8E2D9',
                                            fontSize: '13px',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: LIVE INBOX & EMAIL RENDERING */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #E8E2D9',
                            padding: '20px',
                            boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '14px',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    letterSpacing: '0.08em',
                                    textTransform: 'uppercase',
                                    color: '#8C827A',
                                }}
                            >
                                Live Inbox Simulation ({activeLang})
                            </span>
                            <span style={{ fontSize: '11px', color: '#4A7C59', fontWeight: 600 }}>● Connected</span>
                        </div>

                        {/* Simulated Inbox Row */}
                        <div
                            style={{
                                padding: '14px',
                                backgroundColor: '#FAF7F2',
                                borderRadius: '10px',
                                border: '1px solid #E8E2D9',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                                <strong style={{ color: '#1C0F07' }}>{campaign.fromName || 'CaptainStitches'}</strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>10:30 AM</span>
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                {currentSubject || '(Empty Subject Line)'}
                            </div>
                            <div
                                style={{
                                    fontSize: '12px',
                                    color: '#8C827A',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {currentPreviewText || currentContent.title || 'Preview text appears here in client inbox...'}
                            </div>
                        </div>
                    </div>

                    {/* LIVE RENDERED EMAIL BODY CONTAINER */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #E8E2D9',
                            overflow: 'hidden',
                            boxShadow: '0 4px 16px rgba(28, 15, 7, 0.04)',
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: '#1C0F07',
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span style={{ fontFamily: 'serif', fontSize: '16px', fontWeight: 700, color: '#FAF7F2' }}>
                                CaptainStitches
                            </span>
                            <span style={{ fontSize: '10px', color: '#C4975A', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                                Bespoke Sartoria
                            </span>
                        </div>

                        {/* Email Content Body */}
                        <div style={{ padding: '24px 20px', backgroundColor: '#FFFFFF' }}>
                            {currentContent.featuredImage && (
                                <div
                                    style={{
                                        width: '100%',
                                        aspectRatio: '16/9',
                                        position: 'relative',
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        marginBottom: '20px',
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

                            <h1
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '20px',
                                    color: '#1C0F07',
                                    fontWeight: 600,
                                    margin: '0 0 6px',
                                }}
                            >
                                {currentContent.title || 'Headline'}
                            </h1>

                            {currentContent.subtitle && (
                                <p
                                    style={{
                                        fontSize: '13px',
                                        color: '#C4975A',
                                        fontWeight: 600,
                                        margin: '0 0 16px',
                                    }}
                                >
                                    {currentContent.subtitle}
                                </p>
                            )}

                            <div
                                style={{
                                    fontSize: '13px',
                                    lineHeight: 1.7,
                                    color: '#4A3D36',
                                    whiteSpace: 'pre-line',
                                    marginBottom: '24px',
                                }}
                            >
                                {currentContent.body || '(Email narrative copy will render here as you type...)'}
                            </div>

                            {/* Button CTA */}
                            {currentContent.ctaText && (
                                <div style={{ textAlign: 'center', margin: '24px 0' }}>
                                    <span
                                        style={{
                                            display: 'inline-block',
                                            padding: '11px 26px',
                                            backgroundColor: '#C4975A',
                                            color: '#1C0F07',
                                            borderRadius: '6px',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.3)',
                                        }}
                                    >
                                        {currentContent.ctaText}
                                    </span>
                                </div>
                            )}

                            {/* LEGAL MANDATORY FOOTER */}
                            <div
                                style={{
                                    marginTop: '32px',
                                    paddingTop: '20px',
                                    borderTop: '1px solid #E8E2D9',
                                    fontSize: '11px',
                                    color: '#8C827A',
                                    lineHeight: 1.6,
                                    textAlign: 'center',
                                }}
                            >
                                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#1C0F07' }}>
                                    {settings.footer.businessName}
                                </p>
                                <p style={{ margin: '0 0 2px' }}>🇮🇹 {settings.footer.addressItaly}</p>
                                <p style={{ margin: '0 0 8px' }}>🇳🇬 {settings.footer.addressNigeria}</p>
                                <p style={{ margin: '0 0 4px', fontStyle: 'italic' }}>
                                    {settings.footer.unsubscribeText}
                                </p>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: '6px' }}>
                                    <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Unsubscribe</span>
                                    <span>•</span>
                                    <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>
                                        Manage Preferences
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL 1: PREVIEW & TEST MODAL */}
            {isPreviewModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.7)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            maxWidth: previewViewport === 'desktop' ? '820px' : '420px',
                            width: '100%',
                            maxHeight: '90vh',
                            display: 'flex',
                            flexDirection: 'column',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                            transition: 'max-width 0.3s ease',
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                padding: '16px 20px',
                                borderBottom: '1px solid #E8E2D9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FAF7F2',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                    Campaign Preview
                                </span>
                                {/* Language toggle */}
                                <div style={{ display: 'flex', gap: '4px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewLang('EN')}
                                        style={{
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            backgroundColor: previewLang === 'EN' ? '#1C0F07' : '#E8E2D9',
                                            color: previewLang === 'EN' ? '#FAF7F2' : '#8C827A',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        EN
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewLang('IT')}
                                        style={{
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            border: 'none',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            backgroundColor: previewLang === 'IT' ? '#1C0F07' : '#E8E2D9',
                                            color: previewLang === 'IT' ? '#FAF7F2' : '#8C827A',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        IT
                                    </button>
                                </div>
                            </div>

                            {/* Viewport switch & Close */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewViewport('desktop')}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #DCD5CB',
                                            backgroundColor: previewViewport === 'desktop' ? '#1C0F07' : '#FFFFFF',
                                            color: previewViewport === 'desktop' ? '#FAF7F2' : '#8C827A',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Desktop
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPreviewViewport('mobile')}
                                        style={{
                                            padding: '4px 10px',
                                            borderRadius: '4px',
                                            border: '1px solid #DCD5CB',
                                            backgroundColor: previewViewport === 'mobile' ? '#1C0F07' : '#FFFFFF',
                                            color: previewViewport === 'mobile' ? '#FAF7F2' : '#8C827A',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Mobile
                                    </button>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsPreviewModalOpen(false)
                                        setIsTestEmailModalOpen(true)
                                    }}
                                    style={{
                                        padding: '5px 12px',
                                        borderRadius: '4px',
                                        border: '1px solid #C4975A',
                                        backgroundColor: '#FAF5EE',
                                        color: '#1C0F07',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Send Test Email ↗
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setIsPreviewModalOpen(false)}
                                    style={{
                                        border: 'none',
                                        background: 'transparent',
                                        fontSize: '18px',
                                        cursor: 'pointer',
                                        color: '#8C827A',
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Modal Body Preview */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
                            <div
                                style={{
                                    border: '1px solid #E8E2D9',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    backgroundColor: '#FFFFFF',
                                }}
                            >
                                <div style={{ backgroundColor: '#1C0F07', padding: '16px 20px', color: '#FAF7F2' }}>
                                    <span style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 700 }}>
                                        CaptainStitches
                                    </span>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    {previewLang === 'EN' ? (
                                        <>
                                            <h2 style={{ fontFamily: 'serif', fontSize: '22px', color: '#1C0F07' }}>
                                                {campaign.contentEN.title}
                                            </h2>
                                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#4A3D36' }}>
                                                {campaign.contentEN.body}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <h2 style={{ fontFamily: 'serif', fontSize: '22px', color: '#1C0F07' }}>
                                                {campaign.contentIT.title}
                                            </h2>
                                            <p style={{ fontSize: '14px', lineHeight: 1.7, color: '#4A3D36' }}>
                                                {campaign.contentIT.body}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: SEND TEST EMAIL MODAL */}
            {isTestEmailModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.7)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            maxWidth: '440px',
                            width: '100%',
                            padding: '24px',
                            border: '1px solid #E8E2D9',
                        }}
                    >
                        <h3 style={{ fontFamily: 'serif', fontSize: '18px', color: '#1C0F07', margin: '0 0 8px' }}>
                            Send Test Email
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8C827A', margin: '0 0 18px', lineHeight: 1.5 }}>
                            Transmit an immediate proof to verify typography, imagery, and mobile rendering in Apple
                            Mail and Gmail.
                        </p>

                        <div style={{ marginBottom: '20px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    marginBottom: '6px',
                                }}
                            >
                                Destination Email Address
                            </label>
                            <input
                                type="email"
                                value={testEmailAddress}
                                onChange={(e) => setTestEmailAddress(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsTestEmailModalOpen(false)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #E8E2D9',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSendTestPing}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#C4975A',
                                    color: '#1C0F07',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Dispatch Test Proof
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 3: SEND OR SCHEDULE MODAL */}
            {isSendModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.7)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            maxWidth: '480px',
                            width: '100%',
                            padding: '28px',
                            border: '1px solid #E8E2D9',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h3 style={{ fontFamily: 'serif', fontSize: '20px', color: '#1C0F07', margin: '0 0 6px' }}>
                            Send or Schedule Campaign
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8C827A', margin: '0 0 20px' }}>
                            Selected Audience: <strong>{campaign.targetSegmentName || 'All Active Patrons'}</strong> (
                            {calculatedRecipientCount} recipients)
                        </p>

                        <div style={{ display: 'flex', gap: '10px', marginBottom: '22px' }}>
                            <button
                                type="button"
                                onClick={() => setSendMode('now')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: sendMode === 'now' ? '2px solid #C4975A' : '1px solid #E8E2D9',
                                    backgroundColor: sendMode === 'now' ? '#FAF5EE' : '#FFFFFF',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <strong style={{ display: 'block', fontSize: '13px', color: '#1C0F07' }}>
                                    Send Immediately
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>Broadcast to patrons right now</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setSendMode('schedule')}
                                style={{
                                    flex: 1,
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: sendMode === 'schedule' ? '2px solid #C4975A' : '1px solid #E8E2D9',
                                    backgroundColor: sendMode === 'schedule' ? '#FAF5EE' : '#FFFFFF',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                }}
                            >
                                <strong style={{ display: 'block', fontSize: '13px', color: '#1C0F07' }}>
                                    Schedule For Later
                                </strong>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>Automated drop coordination</span>
                            </button>
                        </div>

                        {sendMode === 'schedule' && (
                            <div
                                style={{
                                    padding: '16px',
                                    backgroundColor: '#FAF7F2',
                                    borderRadius: '10px',
                                    border: '1px solid #E8E2D9',
                                    marginBottom: '22px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '12px',
                                }}
                            >
                                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: '#1C0F07',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={scheduleDate}
                                            onChange={(e) => setScheduleDate(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                border: '1px solid #E8E2D9',
                                                fontSize: '12px',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            style={{
                                                display: 'block',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: '#1C0F07',
                                                marginBottom: '4px',
                                            }}
                                        >
                                            Time (CET)
                                        </label>
                                        <input
                                            type="time"
                                            value={scheduleTime}
                                            onChange={(e) => setScheduleTime(e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '8px',
                                                borderRadius: '6px',
                                                border: '1px solid #E8E2D9',
                                                fontSize: '12px',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                </div>
                                <span style={{ fontSize: '11px', color: '#8C827A' }}>
                                    Timezone: Europe/Rome (Central European Time)
                                </span>
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsSendModalOpen(false)}
                                style={{
                                    padding: '9px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #E8E2D9',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={sendMode === 'now' ? handleSendNow : handleScheduleSend}
                                style={{
                                    padding: '9px 22px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#C4975A',
                                    color: '#1C0F07',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                {sendMode === 'now' ? `Send to ${calculatedRecipientCount} Patrons Now` : 'Schedule Dispatch'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
