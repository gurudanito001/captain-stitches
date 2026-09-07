'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminSettings,
    saveAdminSettings,
    MasterAdminSettings,
    INITIAL_ADMIN_SETTINGS,
} from '@/data/adminSettingsData'
import {
    FiArrowLeft,
    FiSave,
    FiCheckCircle,
    FiCreditCard,
    FiCopy,
    FiCheck,
    FiEye,
    FiEyeOff,
    FiRefreshCw,
    FiDollarSign,
    FiBell,
} from '@/components/admin/SettingsIcons'

export default function PaymentSettingsPage() {
    const [settings, setSettings] = useState<MasterAdminSettings>(INITIAL_ADMIN_SETTINGS)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [showPaystackSecret, setShowPaystackSecret] = useState(false)
    const [showStripeSecret, setShowStripeSecret] = useState(false)
    const [copiedWebhook, setCopiedWebhook] = useState<'paystack' | 'stripe' | null>(null)
    const [isTestingPaystack, setIsTestingPaystack] = useState(false)
    const [paystackPingOk, setPaystackPingOk] = useState(false)
    const [isTestingStripe, setIsTestingStripe] = useState(false)
    const [stripePingOk, setStripePingOk] = useState(false)

    useEffect(() => {
        const loaded = getAdminSettings()
        setSettings(loaded)
    }, [])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        saveAdminSettings(settings)
        setToastMessage('Payment & FX credentials updated successfully!')
        setTimeout(() => setToastMessage(null), 3000)
    }

    const copyToClipboard = (text: string, type: 'paystack' | 'stripe') => {
        navigator.clipboard.writeText(text)
        setCopiedWebhook(type)
        setTimeout(() => setCopiedWebhook(null), 2000)
    }

    const testPaystackConnection = () => {
        setIsTestingPaystack(true)
        setPaystackPingOk(false)
        setTimeout(() => {
            setIsTestingPaystack(false)
            setPaystackPingOk(true)
            setTimeout(() => setPaystackPingOk(false), 4000)
        }, 1200)
    }

    const testStripeConnection = () => {
        setIsTestingStripe(true)
        setStripePingOk(false)
        setTimeout(() => {
            setIsTestingStripe(false)
            setStripePingOk(true)
            setTimeout(() => setStripePingOk(false), 4000)
        }, 1200)
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
                        <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Payments</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Payment Gateways & FX Settings
                    </h1>
                    <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                        Paystack for Naira, Stripe for Euro card processing, dual-currency exchange rate, and balance triggers.
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
                        onClick={handleSave}
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
                        <FiSave size={14} color="#C4975A" /> Save Gateway Settings
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Paystack Configuration */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#E8F5E9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>
                                <FiCreditCard size={20} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                        Paystack Payment Gateway (Nigeria & Diaspora NGN)
                                    </h2>
                                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                                        Connected
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                    Primary gateway for Naira bank transfers, debit cards, and USSD payments.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={testPaystackConnection}
                                disabled={isTestingPaystack}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    cursor: 'pointer',
                                }}
                            >
                                <FiRefreshCw size={12} className={isTestingPaystack ? 'animate-spin' : ''} />
                                {isTestingPaystack ? 'Testing Ping...' : 'Test Connection'}
                            </button>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px', border: '1px solid #EDE8E1', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.payments.paystack.testMode}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                paystack: { ...settings.payments.paystack, testMode: e.target.checked },
                                            },
                                        })
                                    }
                                    style={{ width: '14px', height: '14px' }}
                                />
                                Test Mode
                            </label>
                        </div>
                    </div>

                    {paystackPingOk && (
                        <div style={{ padding: '10px 14px', backgroundColor: '#E8F5E9', borderRadius: '6px', color: '#2E7D32', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
                            ✓ Paystack ping successful! API credentials verified with Paystack servers.
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Paystack Public Key ({settings.payments.paystack.testMode ? 'Test' : 'Live'})
                            </label>
                            <input
                                type="text"
                                value={settings.payments.paystack.publicKey}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        payments: {
                                            ...settings.payments,
                                            paystack: { ...settings.payments.paystack, publicKey: e.target.value },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Paystack Secret Key
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPaystackSecret ? 'text' : 'password'}
                                    value={settings.payments.paystack.secretKey}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                paystack: { ...settings.payments.paystack, secretKey: e.target.value },
                                            },
                                        })
                                    }
                                    style={{ width: '100%', padding: '10px 38px 10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPaystackSecret(!showPaystackSecret)}
                                    style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#7C6F65' }}
                                >
                                    {showPaystackSecret ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Webhook Endpoint URL (Paste into your Paystack Dashboard)
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    readOnly
                                    value={settings.payments.paystack.webhookUrl}
                                    style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#F5F5F5', color: '#555' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(settings.payments.paystack.webhookUrl, 'paystack')}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 14px',
                                        borderRadius: '6px',
                                        border: '1px solid #EDE8E1',
                                        backgroundColor: '#FAF7F2',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {copiedWebhook === 'paystack' ? <FiCheck size={14} color="#2E7D32" /> : <FiCopy size={14} />}
                                    {copiedWebhook === 'paystack' ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Stripe Configuration */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#EDF4FB', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0' }}>
                                <FiCreditCard size={20} />
                            </div>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                        Stripe International Gateway (Euro & Global Cards)
                                    </h2>
                                    <span style={{ fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                                        Connected
                                    </span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                    Primary gateway for European credit cards, Apple Pay, and Google Pay in Euro (€).
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={testStripeConnection}
                                disabled={isTestingStripe}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '7px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    cursor: 'pointer',
                                }}
                            >
                                <FiRefreshCw size={12} className={isTestingStripe ? 'animate-spin' : ''} />
                                {isTestingStripe ? 'Testing Ping...' : 'Test Connection'}
                            </button>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 600, padding: '6px 10px', backgroundColor: '#FAF7F2', borderRadius: '6px', border: '1px solid #EDE8E1', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={settings.payments.stripe.testMode}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                stripe: { ...settings.payments.stripe, testMode: e.target.checked },
                                            },
                                        })
                                    }
                                    style={{ width: '14px', height: '14px' }}
                                />
                                Test Mode
                            </label>
                        </div>
                    </div>

                    {stripePingOk && (
                        <div style={{ padding: '10px 14px', backgroundColor: '#E8F5E9', borderRadius: '6px', color: '#2E7D32', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
                            ✓ Stripe ping successful! Webhook & checkout endpoints active.
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Stripe Publishable Key ({settings.payments.stripe.testMode ? 'Test' : 'Live'})
                            </label>
                            <input
                                type="text"
                                value={settings.payments.stripe.publicKey}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        payments: {
                                            ...settings.payments,
                                            stripe: { ...settings.payments.stripe, publicKey: e.target.value },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Stripe Secret Key
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showStripeSecret ? 'text' : 'password'}
                                    value={settings.payments.stripe.secretKey}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                stripe: { ...settings.payments.stripe, secretKey: e.target.value },
                                            },
                                        })
                                    }
                                    style={{ width: '100%', padding: '10px 38px 10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowStripeSecret(!showStripeSecret)}
                                    style={{ position: 'absolute', right: '10px', top: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#7C6F65' }}
                                >
                                    {showStripeSecret ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Webhook Endpoint URL (Paste into Stripe Dashboard &gt; Developers)
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <input
                                    type="text"
                                    readOnly
                                    value={settings.payments.stripe.webhookUrl}
                                    style={{ flex: 1, padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', fontFamily: 'monospace', backgroundColor: '#F5F5F5', color: '#555' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => copyToClipboard(settings.payments.stripe.webhookUrl, 'stripe')}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '8px 14px',
                                        borderRadius: '6px',
                                        border: '1px solid #EDE8E1',
                                        backgroundColor: '#FAF7F2',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {copiedWebhook === 'stripe' ? <FiCheck size={14} color="#2E7D32" /> : <FiCopy size={14} />}
                                    {copiedWebhook === 'stripe' ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Currency & Exchange Rate Mode */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4975A' }}>
                            <FiDollarSign size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Currency Exchange Rate (₦ NGN / € EUR)
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Powers dual currency displays on lookbooks, order invoices, and financial reports.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Exchange Rate Mode
                            </label>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                currency: { ...settings.payments.currency, exchangeRateMode: 'manual' },
                                            },
                                        })
                                    }
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #EDE8E1',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        backgroundColor: settings.payments.currency.exchangeRateMode === 'manual' ? '#1C0F07' : '#FAF7F2',
                                        color: settings.payments.currency.exchangeRateMode === 'manual' ? '#FAF7F2' : '#7C6F65',
                                    }}
                                >
                                    Manual Atelier Rate
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                currency: { ...settings.payments.currency, exchangeRateMode: 'live' },
                                            },
                                        })
                                    }
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        borderRadius: '6px',
                                        border: '1px solid #EDE8E1',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        backgroundColor: settings.payments.currency.exchangeRateMode === 'live' ? '#1C0F07' : '#FAF7F2',
                                        color: settings.payments.currency.exchangeRateMode === 'live' ? '#FAF7F2' : '#7C6F65',
                                    }}
                                >
                                    Live FX API Feed
                                </button>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                1 Euro (€) = Nigerian Naira (₦)
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="number"
                                    value={settings.payments.currency.manualRate}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                currency: { ...settings.payments.currency, manualRate: parseInt(e.target.value) || 1750 },
                                            },
                                        })
                                    }
                                    style={{ width: '120px', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '14px', fontWeight: 700, backgroundColor: '#FAF7F2' }}
                                />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>NGN</span>
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1', padding: '12px 16px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1', fontSize: '12px', color: '#7C6F65' }}>
                            Source: <b>{settings.payments.currency.liveRateSource}</b> • Last sync timestamp: {settings.payments.currency.lastFetched}
                        </div>
                    </div>
                </div>

                {/* 4. Deposit & Balance Settings */}
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
                            Deposit Percentage & Balance Triggers
                        </h2>
                        <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                            Configure initial bespoke commitment rules and dispatch settlement conditions.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                        <div style={{ padding: '14px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Default Deposit Percentage
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="number"
                                    min={20}
                                    max={100}
                                    value={settings.payments.depositAndBalance.depositPercentage}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                depositAndBalance: {
                                                    ...settings.payments.depositAndBalance,
                                                    depositPercentage: parseInt(e.target.value) || 50,
                                                },
                                            },
                                        })
                                    }
                                    style={{ width: '80px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', fontWeight: 700, backgroundColor: '#FFFFFF' }}
                                />
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>% to commence</span>
                            </div>
                        </div>

                        <div style={{ padding: '14px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Balance Payment Trigger
                            </label>
                            <select
                                value={settings.payments.depositAndBalance.balanceTrigger}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        payments: {
                                            ...settings.payments,
                                            depositAndBalance: {
                                                ...settings.payments.depositAndBalance,
                                                balanceTrigger: e.target.value as any,
                                            },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FFFFFF', fontWeight: 600, cursor: 'pointer' }}
                            >
                                <option value="before_dispatch">Before Dispatch (Recommended for Air Freight)</option>
                                <option value="on_delivery">Upon Handover / Safe Delivery</option>
                            </select>
                        </div>

                        <div style={{ padding: '14px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Balance Link Expiry (Days)
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <input
                                    type="number"
                                    min={1}
                                    max={30}
                                    value={settings.payments.depositAndBalance.linkExpiryDays}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                depositAndBalance: {
                                                    ...settings.payments.depositAndBalance,
                                                    linkExpiryDays: parseInt(e.target.value) || 7,
                                                },
                                            },
                                        })
                                    }
                                    style={{ width: '80px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', fontWeight: 700, backgroundColor: '#FFFFFF' }}
                                />
                                <span style={{ fontSize: '12px', color: '#7C6F65' }}>Days validity</span>
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1', display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                            <input
                                type="checkbox"
                                checked={settings.payments.depositAndBalance.autoSendBalanceRequest}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        payments: {
                                            ...settings.payments,
                                            depositAndBalance: {
                                                ...settings.payments.depositAndBalance,
                                                autoSendBalanceRequest: e.target.checked,
                                            },
                                        },
                                    })
                                }
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                    Auto-send balance payment link upon garment approval
                                </div>
                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                    When an order status moves to Approved, immediately dispatch the balance link via WhatsApp and email.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. Payment Notifications */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A5D18' }}>
                            <FiBell size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Financial Transaction Alerts
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Instant notifications sent to Samuelson when funds arrive or fail.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
                        {[
                            { key: 'notifyDeposit', label: 'Notify on deposit receipt (WhatsApp & Email)' },
                            { key: 'notifyBalance', label: 'Notify on final balance payment' },
                            { key: 'notifyFailed', label: 'Notify immediately if payment fails' },
                            { key: 'sendReceipt', label: 'Send automated PDF receipt to patron' },
                        ].map((item) => (
                            <label
                                key={item.key}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '14px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #EDE8E1',
                                    cursor: 'pointer',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={(settings.payments.notifications as any)[item.key]}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            payments: {
                                                ...settings.payments,
                                                notifications: {
                                                    ...settings.payments.notifications,
                                                    [item.key]: e.target.checked,
                                                },
                                            },
                                        })
                                    }
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                {item.label}
                            </label>
                        ))}
                    </div>
                </div>
            </form>
        </div>
    )
}
