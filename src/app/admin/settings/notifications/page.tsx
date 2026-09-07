'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminSettings,
    saveAdminSettings,
    MasterAdminSettings,
    NotificationTemplate,
    INITIAL_ADMIN_SETTINGS,
} from '@/data/adminSettingsData'
import {
    FiArrowLeft,
    FiSave,
    FiCheckCircle,
    FiBell,
    FiMessageSquare,
    FiEye,
    FiSend,
    FiRefreshCw,
    FiX,
    FiUsers,
} from '@/components/admin/SettingsIcons'

export default function NotificationSettingsPage() {
    const [settings, setSettings] = useState<MasterAdminSettings>(INITIAL_ADMIN_SETTINGS)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [activeTemplateTab, setActiveTemplateTab] = useState<'EN' | 'IT'>('EN')
    const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tmpl-1')
    const [previewModalTemplate, setPreviewModalTemplate] = useState<NotificationTemplate | null>(null)
    const [isTestingWhatsApp, setIsTestingWhatsApp] = useState(false)
    const [testWhatsAppSent, setTestWhatsAppSent] = useState(false)

    useEffect(() => {
        const loaded = getAdminSettings()
        setSettings(loaded)
    }, [])

    const handleSave = (e?: React.FormEvent) => {
        if (e) e.preventDefault()
        saveAdminSettings(settings)
        setToastMessage('Notification settings & message templates saved!')
        setTimeout(() => setToastMessage(null), 3000)
    }

    const currentTemplate =
        settings.notifications.templates.find((t) => t.id === selectedTemplateId) ||
        settings.notifications.templates[0]

    const handleTemplateTextChange = (text: string) => {
        const updatedTemplates = settings.notifications.templates.map((tmpl) => {
            if (tmpl.id === selectedTemplateId) {
                return activeTemplateTab === 'EN'
                    ? { ...tmpl, enText: text }
                    : { ...tmpl, itText: text }
            }
            return tmpl
        })
        setSettings({
            ...settings,
            notifications: {
                ...settings.notifications,
                templates: updatedTemplates,
            },
        })
    }

    const insertPlaceholder = (placeholder: string) => {
        const text = activeTemplateTab === 'EN' ? currentTemplate.enText : currentTemplate.itText
        handleTemplateTextChange(text + ' ' + placeholder)
    }

    const resetCurrentTemplate = () => {
        const defaultTmpl = INITIAL_ADMIN_SETTINGS.notifications.templates.find((t) => t.id === selectedTemplateId)
        if (defaultTmpl) {
            const updated = settings.notifications.templates.map((t) => (t.id === selectedTemplateId ? defaultTmpl : t))
            setSettings({
                ...settings,
                notifications: { ...settings.notifications, templates: updated },
            })
            setToastMessage('Template reset to atelier default.')
            setTimeout(() => setToastMessage(null), 3000)
        }
    }

    const handleTestWhatsApp = () => {
        setIsTestingWhatsApp(true)
        setTestWhatsAppSent(false)
        setTimeout(() => {
            setIsTestingWhatsApp(false)
            setTestWhatsAppSent(true)
            setTimeout(() => setTestWhatsAppSent(false), 4000)
        }, 1200)
    }

    const renderSamplePreview = (tmpl: NotificationTemplate, lang: 'EN' | 'IT') => {
        const raw = lang === 'EN' ? tmpl.enText : tmpl.itText
        return raw
            .replace('{customer_name}', 'Leonardo Ricci')
            .replace('{order_number}', 'CS-0092')
            .replace('{garment_type}', 'The Grand Agbada (3-Piece)')
            .replace('{deadline}', 'Sep 24, 2026')
            .replace('{tracking_link}', 'https://captainstitches.com/track/CS-0092')
            .replace('{payment_link}', 'https://captainstitches.com/pay/CS-0092')
            .replace('{referral_link}', 'https://captainstitches.com/ref/CS-LEO')
            .replace('{reward_type}', '€25 Tailoring Credit')
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
            {/* Header & Breadcrumb */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <Link
                            href="/admin/settings"
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
                            <FiArrowLeft size={14} /> Back to Settings
                        </Link>
                        <span style={{ fontSize: '13px', color: '#B3A89D' }}>/</span>
                        <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Notifications</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Notifications & Bilingual Message Templates
                    </h1>
                    <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                        Configure alerts for Samuelson, tailors, and clients across WhatsApp and email in English and Italian.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {toastMessage && (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#2E7D32',
                                backgroundColor: '#E8F5E9',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #C8E6C9',
                            }}
                        >
                            <FiCheckCircle size={14} /> {toastMessage}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={() => handleSave()}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            backgroundColor: '#1C0F07',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#FAF7F2',
                            cursor: 'pointer',
                        }}
                    >
                        <FiSave size={14} color="#C4975A" /> Save Notification Settings
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Section 1: WhatsApp Gateway Quota Status */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>
                                <FiMessageSquare size={20} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                        WhatsApp Business API (Twilio Gateway)
                                    </h2>
                                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                                        {settings.notifications.whatsappApi.status}
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                    Automated dispatch engine for order confirmations, inspection photos, and delivery notices.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div>
                                <div style={{ fontSize: '11px', color: '#7C6F65', marginBottom: '4px' }}>
                                    Daily Message Tier Usage: <b>{settings.notifications.whatsappApi.usedToday}</b> / {settings.notifications.whatsappApi.dailyLimit}
                                </div>
                                <div style={{ width: '160px', height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                    <div style={{ width: `${(settings.notifications.whatsappApi.usedToday / settings.notifications.whatsappApi.dailyLimit) * 100}%`, height: '100%', backgroundColor: '#2E7D32' }}></div>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleTestWhatsApp}
                                disabled={isTestingWhatsApp}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 14px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #EDE8E1',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    cursor: 'pointer',
                                }}
                            >
                                <FiSend size={12} />
                                {isTestingWhatsApp ? 'Sending...' : 'Test WhatsApp Ping'}
                            </button>
                        </div>
                    </div>
                    {testWhatsAppSent && (
                        <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: '#E8F5E9', borderRadius: '6px', color: '#2E7D32', fontSize: '12px', fontWeight: 600 }}>
                            ✓ Test WhatsApp message dispatched to Samuelson&apos;s phone (+39 347 123 4567)!
                        </div>
                    )}
                </div>

                {/* Section 2: Bilingual Notification Template Editor */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Bilingual Message Template Editor
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Craft automated messages sent across WhatsApp and Email in English and Italian.
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={resetCurrentTemplate}
                                style={{
                                    padding: '6px 12px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #EDE8E1',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#7C6F65',
                                    cursor: 'pointer',
                                }}
                            >
                                Reset Template
                            </button>
                            <button
                                type="button"
                                onClick={() => setPreviewModalTemplate(currentTemplate)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '6px 14px',
                                    backgroundColor: '#FDF6ED',
                                    border: '1px solid #F5D38A',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#8A5D18',
                                    cursor: 'pointer',
                                }}
                            >
                                <FiEye size={14} /> Preview Live Data
                            </button>
                        </div>
                    </div>

                    {/* Template Selector & Language Tabs */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <label style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                                Select Template:
                            </label>
                            <select
                                value={selectedTemplateId}
                                onChange={(e) => setSelectedTemplateId(e.target.value)}
                                style={{
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    backgroundColor: '#FAF7F2',
                                    color: '#1C0F07',
                                    cursor: 'pointer',
                                }}
                            >
                                {settings.notifications.templates.map((tmpl) => (
                                    <option key={tmpl.id} value={tmpl.id}>
                                        {tmpl.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Language Switcher */}
                        <div style={{ display: 'inline-flex', padding: '3px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                            <button
                                type="button"
                                onClick={() => setActiveTemplateTab('EN')}
                                style={{
                                    padding: '6px 14px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: activeTemplateTab === 'EN' ? '#1C0F07' : 'transparent',
                                    color: activeTemplateTab === 'EN' ? '#FAF7F2' : '#7C6F65',
                                }}
                            >
                                🇬🇧 English (EN)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTemplateTab('IT')}
                                style={{
                                    padding: '6px 14px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    borderRadius: '6px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    backgroundColor: activeTemplateTab === 'IT' ? '#1C0F07' : 'transparent',
                                    color: activeTemplateTab === 'IT' ? '#FAF7F2' : '#7C6F65',
                                }}
                            >
                                🇮🇹 Italian (IT)
                            </button>
                        </div>
                    </div>

                    {/* Placeholder Chips */}
                    <div style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#7C6F65', marginRight: '8px' }}>
                            Insert dynamic placeholder:
                        </span>
                        <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '6px' }}>
                            {currentTemplate.placeholders.map((ph) => (
                                <button
                                    key={ph}
                                    type="button"
                                    onClick={() => insertPlaceholder(ph)}
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: '#FAF7F2',
                                        border: '1px solid #EDE8E1',
                                        color: '#C4975A',
                                        cursor: 'pointer',
                                    }}
                                >
                                    + {ph}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Template Textarea */}
                    <textarea
                        rows={4}
                        value={activeTemplateTab === 'EN' ? currentTemplate.enText : currentTemplate.itText}
                        onChange={(e) => handleTemplateTextChange(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '12px 14px',
                            borderRadius: '8px',
                            border: '1px solid #EDE8E1',
                            fontSize: '13px',
                            lineHeight: '1.5',
                            backgroundColor: '#FAF7F2',
                            color: '#1C0F07',
                            fontFamily: 'inherit',
                            boxSizing: 'border-box',
                        }}
                    />
                </div>

                {/* Section 3: Samuelson's Notifications */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Samuelson&apos;s Atelier Alerts (Director Notifications)
                        </h2>
                        <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                            Select whether you receive high-priority alerts via WhatsApp, Email, or both.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                            { key: 'newOrder', label: 'New bespoke order placed' },
                            { key: 'depositReceived', label: '50% deposit received & confirmed' },
                            { key: 'orderOverdue', label: 'Order overdue past scheduled delivery date', hasThreshold: true },
                            { key: 'tailorInspectionReady', label: 'Tailor flags piece ready for inspection' },
                            { key: 'newReview', label: 'New patron lookbook review submitted' },
                            { key: 'referralConverts', label: 'Advocate referral converts to paid commission' },
                            { key: 'balanceReceived', label: 'Final balance payment completed' },
                            { key: 'paymentFailed', label: 'Gateway transaction failed' },
                        ].map((alert) => {
                            const config = (settings.notifications.samuelson as any)[alert.key]
                            return (
                                <div
                                    key={alert.key}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '12px 16px',
                                        backgroundColor: '#FAF7F2',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        flexWrap: 'wrap',
                                        gap: '12px',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                            {alert.label}
                                        </span>
                                        {alert.hasThreshold && (
                                            <span style={{ marginLeft: '10px', fontSize: '11px', color: '#7C6F65' }}>
                                                (Alert threshold: <b>{config.thresholdDays || 1} day</b> overdue)
                                            </span>
                                        )}
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={config.whatsapp}
                                                onChange={(e) =>
                                                    setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            samuelson: {
                                                                ...settings.notifications.samuelson,
                                                                [alert.key]: { ...config, whatsapp: e.target.checked },
                                                            },
                                                        },
                                                    })
                                                }
                                                style={{ width: '14px', height: '14px' }}
                                            />
                                            WhatsApp
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={config.email}
                                                onChange={(e) =>
                                                    setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            samuelson: {
                                                                ...settings.notifications.samuelson,
                                                                [alert.key]: { ...config, email: e.target.checked },
                                                            },
                                                        },
                                                    })
                                                }
                                                style={{ width: '14px', height: '14px' }}
                                            />
                                            Email
                                        </label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Section 4: Customer Lifecycle Alerts */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Customer Lifecycle Notifications
                        </h2>
                        <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                            Automated updates sent to patrons during bespoke tailoring and international dispatch.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '12px' }}>
                        {[
                            { key: 'orderConfirmation', title: 'Order Confirmed (Deposit Paid)' },
                            { key: 'statusInProduction', title: 'Crafting Begun (In Production)' },
                            { key: 'statusInspection', title: 'Inspection Photo Approval Request' },
                            { key: 'statusDispatched', title: 'DHL Express Dispatch with Air Tracking' },
                            { key: 'statusDelivered', title: 'Safe Delivery Handover Confirmation' },
                            { key: 'balanceRequest', title: 'Final 50% Balance Settlement Request' },
                            { key: 'reviewRequest', title: 'Post-Delivery Review Invitation (2-day delay)' },
                            { key: 'referralRewardCredited', title: 'Advocate Referral Reward Credited' },
                        ].map((item) => {
                            const config = (settings.notifications.customer as any)[item.key] || { whatsapp: true, email: true }
                            return (
                                <div
                                    key={item.key}
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
                                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                                        {item.title}
                                    </span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={config.whatsapp}
                                                onChange={(e) =>
                                                    setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            customer: {
                                                                ...settings.notifications.customer,
                                                                [item.key]: { ...config, whatsapp: e.target.checked },
                                                            },
                                                        },
                                                    })
                                                }
                                                style={{ width: '13px', height: '13px' }}
                                            />
                                            WA
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', cursor: 'pointer' }}>
                                            <input
                                                type="checkbox"
                                                checked={config.email}
                                                onChange={(e) =>
                                                    setSettings({
                                                        ...settings,
                                                        notifications: {
                                                            ...settings.notifications,
                                                            customer: {
                                                                ...settings.notifications.customer,
                                                                [item.key]: { ...config, email: e.target.checked },
                                                            },
                                                        },
                                                    })
                                                }
                                                style={{ width: '13px', height: '13px' }}
                                            />
                                            Email
                                        </label>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {previewModalTemplate && (
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
                            maxWidth: '540px',
                            width: '100%',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Live Template Preview: {previewModalTemplate.title}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setPreviewModalTemplate(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C6F65' }}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase', marginBottom: '6px' }}>
                                🇬🇧 English Message (Rendered with sample commission CS-0092)
                            </div>
                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1', fontSize: '13px', color: '#1C0F07', lineHeight: '1.5' }}>
                                {renderSamplePreview(previewModalTemplate, 'EN')}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '11px', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase', marginBottom: '6px' }}>
                                🇮🇹 Italian Message (Rendered with sample commission CS-0092)
                            </div>
                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1', fontSize: '13px', color: '#1C0F07', lineHeight: '1.5' }}>
                                {renderSamplePreview(previewModalTemplate, 'IT')}
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setPreviewModalTemplate(null)}
                                style={{
                                    padding: '8px 18px',
                                    backgroundColor: '#1C0F07',
                                    color: '#FAF7F2',
                                    borderRadius: '6px',
                                    border: 'none',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
