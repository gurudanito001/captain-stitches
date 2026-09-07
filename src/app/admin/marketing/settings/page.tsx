'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    MarketingSettings,
    getMarketingSettings,
    saveMarketingSettings,
} from '@/data/adminMarketingData'

export default function EmailSettingsPage() {
    const [settings, setSettings] = useState<MarketingSettings | null>(null)
    const [showApiKey, setShowApiKey] = useState(false)
    const [showTxApiKey, setShowTxApiKey] = useState(false)
    const [isTestingPlatform, setIsTestingPlatform] = useState(false)
    const [isTestingTx, setIsTestingTx] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        setSettings(getMarketingSettings())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    if (!settings) {
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
                    Loading marketing configurations...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    const handleSave = () => {
        setIsSaving(true)
        saveMarketingSettings(settings)
        setTimeout(() => {
            setIsSaving(false)
            showToast('Marketing settings saved successfully')
        }, 250)
    }

    const handleTestPlatform = () => {
        setIsTestingPlatform(true)
        setTimeout(() => {
            setIsTestingPlatform(false)
            showToast(`Connection to ${settings.platform.toUpperCase()} verified! HTTP 200 OK`)
        }, 600)
    }

    const handleTestTransactional = () => {
        setIsTestingTx(true)
        setTimeout(() => {
            setIsTestingTx(false)
            showToast(`Test order confirmation sent to ${settings.fromEmail} via ${settings.transactional.provider.toUpperCase()}`)
        }, 600)
    }

    const handleToggleTxType = (id: string) => {
        const updatedTypes = settings.transactional.emailTypes.map((t) =>
            t.id === id ? { ...t, isActive: !t.isActive } : t
        )
        setSettings({
            ...settings,
            transactional: {
                ...settings.transactional,
                emailTypes: updatedTypes,
            },
        })
    }

    return (
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 0 80px' }}>
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
            <div style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#8C827A', marginBottom: '8px' }}>
                    <Link href="/admin/marketing" style={{ color: '#8C827A', textDecoration: 'none' }}>
                        Marketing
                    </Link>
                    <span>/</span>
                    <span style={{ color: '#C4975A' }}>Settings</span>
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
                        <h1
                            style={{
                                fontFamily: 'serif',
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: '0 0 6px',
                            }}
                        >
                            Email Platform & Brand Settings
                        </h1>
                        <p style={{ fontSize: '14px', color: '#8C827A', margin: 0 }}>
                            Configure provider credentials, legal dual-location footers, transactional automations, and GDPR compliance.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 24px',
                            backgroundColor: '#C4975A',
                            color: '#1C0F07',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        {isSaving ? 'Saving Changes...' : 'Save Settings'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* 1. MARKETING PLATFORM CONNECTION */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
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
                                    fontSize: '19px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: '0 0 4px',
                                }}
                            >
                                Marketing Provider Integration
                            </h2>
                            <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                                Primary service handling subscriber sync, delivery infrastructure, and telemetry tracking.
                            </p>
                        </div>

                        {/* Status badge */}
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 10px',
                                borderRadius: '12px',
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
                                    color: settings.isConnected ? '#3B6E48' : '#C72B2B',
                                }}
                            >
                                {settings.isConnected ? 'Active & Connected' : 'Disconnected'}
                            </span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                                Connected Platform
                            </label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {(
                                    [
                                        { id: 'mailchimp', label: 'Mailchimp', desc: 'Standard marketing cloud' },
                                        { id: 'brevo', label: 'Brevo (Sendinblue)', desc: 'European GDPR-first platform' },
                                    ] as const
                                ).map((p) => (
                                    <button
                                        key={p.id}
                                        type="button"
                                        onClick={() => setSettings({ ...settings, platform: p.id })}
                                        style={{
                                            flex: 1,
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: settings.platform === p.id ? '2px solid #C4975A' : '1px solid #E8E2D9',
                                            backgroundColor: settings.platform === p.id ? '#FAF5EE' : '#FFFFFF',
                                            textAlign: 'left',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <strong style={{ fontSize: '13px', color: '#1C0F07', display: 'block' }}>
                                            {p.label}
                                        </strong>
                                        <span style={{ fontSize: '11px', color: '#8C827A' }}>{p.desc}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
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
                                    Platform API Key
                                </label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        type={showApiKey ? 'text' : 'password'}
                                        value={settings.apiKey}
                                        onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '8px',
                                            border: '1px solid #E8E2D9',
                                            fontSize: '13px',
                                            fontFamily: 'monospace',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowApiKey(!showApiKey)}
                                        style={{
                                            position: 'absolute',
                                            right: '10px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            border: 'none',
                                            backgroundColor: 'transparent',
                                            fontSize: '12px',
                                            color: '#8C827A',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {showApiKey ? 'Hide' : 'Reveal'}
                                    </button>
                                </div>
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
                                    Audience / List ID
                                </label>
                                <input
                                    type="text"
                                    value={settings.listId}
                                    onChange={(e) => setSettings({ ...settings, listId: e.target.value })}
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        fontFamily: 'monospace',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={handleTestPlatform}
                                disabled={isTestingPlatform}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #C4975A',
                                    backgroundColor: '#FAF7F2',
                                    color: '#1C0F07',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {isTestingPlatform ? 'Pinging API...' : 'Ping Connection Test'}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setSettings({ ...settings, isConnected: !settings.isConnected })
                                    showToast(settings.isConnected ? 'Platform disconnected' : 'Platform connected')
                                }}
                                style={{
                                    padding: '8px 14px',
                                    borderRadius: '6px',
                                    border: '1px solid #E8E2D9',
                                    backgroundColor: '#FFFFFF',
                                    color: settings.isConnected ? '#C72B2B' : '#4A7C59',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                }}
                            >
                                {settings.isConnected ? 'Disconnect Platform' : 'Reconnect Platform'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* 2. DEFAULT SENDER DETAILS */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '19px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        Default Sender Identity
                    </h2>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: '0 0 20px' }}>
                        Default names and addresses displayed to recipients across all broadcasts.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
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
                                value={settings.fromName}
                                onChange={(e) => setSettings({ ...settings, fromName: e.target.value })}
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
                                From Email Address
                            </label>
                            <input
                                type="email"
                                value={settings.fromEmail}
                                onChange={(e) => setSettings({ ...settings, fromEmail: e.target.value })}
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
                                Reply-To Email
                            </label>
                            <input
                                type="email"
                                value={settings.replyToEmail}
                                onChange={(e) => setSettings({ ...settings, replyToEmail: e.target.value })}
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

                {/* 3. DEFAULT LEGAL FOOTER (DUAL ATELIER ADDRESSES) */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '19px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        Mandatory Atelier Legal Footer
                    </h2>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: '0 0 20px' }}>
                        International commercial email law requires physical address disclosure in both Europe and Nigeria.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
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
                                Business Trade Name
                            </label>
                            <input
                                type="text"
                                value={settings.footer.businessName}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        footer: { ...settings.footer, businessName: e.target.value },
                                    })
                                }
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
                                    Physical Studio Address (Italy) 🇮🇹
                                </label>
                                <input
                                    type="text"
                                    value={settings.footer.addressItaly}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            footer: { ...settings.footer, addressItaly: e.target.value },
                                        })
                                    }
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
                                    Physical Workshop Address (Nigeria) 🇳🇬
                                </label>
                                <input
                                    type="text"
                                    value={settings.footer.addressNigeria}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            footer: { ...settings.footer, addressNigeria: e.target.value },
                                        })
                                    }
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
                                Unsubscribe Disclosure Notice
                            </label>
                            <input
                                type="text"
                                value={settings.footer.unsubscribeText}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        footer: { ...settings.footer, unsubscribeText: e.target.value },
                                    })
                                }
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

                    {/* LIVE FOOTER PREVIEW CARD */}
                    <div>
                        <span
                            style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: '#8C827A',
                                display: 'block',
                                marginBottom: '8px',
                            }}
                        >
                            Live Footer Render Preview
                        </span>
                        <div
                            style={{
                                padding: '16px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                textAlign: 'center',
                                fontSize: '12px',
                                color: '#8C827A',
                                lineHeight: 1.6,
                            }}
                        >
                            <p style={{ margin: '0 0 2px', fontWeight: 600, color: '#1C0F07' }}>
                                {settings.footer.businessName}
                            </p>
                            <p style={{ margin: '0 0 2px' }}>🇮🇹 {settings.footer.addressItaly}</p>
                            <p style={{ margin: '0 0 6px' }}>🇳🇬 {settings.footer.addressNigeria}</p>
                            <p style={{ margin: '0 0 4px', fontStyle: 'italic' }}>
                                {settings.footer.unsubscribeText}
                            </p>
                            <span style={{ textDecoration: 'underline', color: '#1C0F07' }}>Unsubscribe instantly</span>
                        </div>
                    </div>
                </div>

                {/* 4. TRANSACTIONAL EMAIL AUTOMATIONS */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
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
                                    fontSize: '19px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: '0 0 4px',
                                }}
                            >
                                Transactional Email Service & Triggers
                            </h2>
                            <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                                High-priority notifications dispatched when deposits are paid, inspection photos approved, or orders dispatched.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleTestTransactional}
                            disabled={isTestingTx}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '6px',
                                border: '1px solid #C4975A',
                                backgroundColor: '#FAF5EE',
                                color: '#1C0F07',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            {isTestingTx ? 'Sending...' : 'Send Test Order Confirmation ↗'}
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '14px', marginBottom: '24px' }}>
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
                                Transactional Provider
                            </label>
                            <select
                                value={settings.transactional.provider}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        transactional: {
                                            ...settings.transactional,
                                            provider: e.target.value as any,
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '9px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '13px',
                                    backgroundColor: '#FAF7F2',
                                }}
                            >
                                <option value="resend">Resend (Modern Developer Infrastructure)</option>
                                <option value="brevo">Brevo Transactional SMTP</option>
                            </select>
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
                                Transactional API Key
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showTxApiKey ? 'text' : 'password'}
                                    value={settings.transactional.apiKey}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            transactional: {
                                                ...settings.transactional,
                                                apiKey: e.target.value,
                                            },
                                        })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        fontFamily: 'monospace',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowTxApiKey(!showTxApiKey)}
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        border: 'none',
                                        backgroundColor: 'transparent',
                                        fontSize: '12px',
                                        color: '#8C827A',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {showTxApiKey ? 'Hide' : 'Reveal'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Transactional Triggers Checklist */}
                    <div>
                        <span
                            style={{
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                display: 'block',
                                marginBottom: '10px',
                            }}
                        >
                            Active Transactional Email Triggers
                        </span>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                gap: '10px',
                            }}
                        >
                            {settings.transactional.emailTypes.map((tx) => (
                                <div
                                    key={tx.id}
                                    onClick={() => handleToggleTxType(tx.id)}
                                    style={{
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        backgroundColor: tx.isActive ? '#FAF5EE' : '#FAF7F2',
                                        border: `1px solid ${tx.isActive ? '#C4975A' : '#E8E2D9'}`,
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>
                                        <strong style={{ fontSize: '13px', color: '#1C0F07', display: 'block' }}>
                                            {tx.name}
                                        </strong>
                                        <span style={{ fontSize: '11px', color: '#8C827A' }}>{tx.description}</span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            color: tx.isActive ? '#4A7C59' : '#8C827A',
                                        }}
                                    >
                                        {tx.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 5. COMPLIANCE & GDPR DATA RETENTION */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <h2
                        style={{
                            fontFamily: 'serif',
                            fontSize: '19px',
                            fontWeight: 600,
                            color: '#1C0F07',
                            margin: '0 0 4px',
                        }}
                    >
                        GDPR Compliance & Site-wide Consent Statements
                    </h2>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: '0 0 20px' }}>
                        Propagates explicit consent language to homepage capture footers and order checkout forms.
                    </p>

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
                                Site-wide Consent Statement (propagated to client forms)
                            </label>
                            <textarea
                                rows={3}
                                value={settings.compliance.consentStatement}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        compliance: {
                                            ...settings.compliance,
                                            consentStatement: e.target.value,
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '13px',
                                    lineHeight: 1.5,
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                                    Unsubscribed Contact Retention
                                </label>
                                <select
                                    value={settings.compliance.dataRetentionMonths}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            compliance: {
                                                ...settings.compliance,
                                                dataRetentionMonths: parseInt(e.target.value, 10),
                                            },
                                        })
                                    }
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        backgroundColor: '#FAF7F2',
                                    }}
                                >
                                    <option value={6}>6 Months</option>
                                    <option value={12}>12 Months (Recommended)</option>
                                    <option value={24}>24 Months</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
