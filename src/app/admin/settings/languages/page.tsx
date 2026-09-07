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
    FiGlobe,
    FiDollarSign,
    FiAlertTriangle,
    FiExternalLink,
} from '@/components/admin/SettingsIcons'

export default function LanguageCurrencySettingsPage() {
    const [settings, setSettings] = useState<MasterAdminSettings>(INITIAL_ADMIN_SETTINGS)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        const loaded = getAdminSettings()
        setSettings(loaded)
    }, [])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        saveAdminSettings(settings)
        setToastMessage('Language & currency configurations updated!')
        setTimeout(() => setToastMessage(null), 3000)
    }

    const { languages, translationCompleteness, currencies, displayFormat } = settings.languages

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
                        <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Languages & Currency</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Languages & Currency Formatting
                    </h1>
                    <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                        Manage active languages (English & Italian), translation health meters, and currency formatting.
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
                        <FiSave size={14} color="#C4975A" /> Save Language & FX
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Active Languages & Detection */}
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
                            <FiGlobe size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Active Languages on Public Storefront
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Controls bilingual switching between the international and Italian diaspora markets.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        {/* English */}
                        <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#FAF7F2', border: '1px solid #EDE8E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '24px' }}>🇬🇧</span>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C0F07' }}>English (EN)</div>
                                    <div style={{ fontSize: '11px', color: '#7C6F65' }}>Primary international language (Always active)</div>
                                </div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', backgroundColor: '#E8F5E9', color: '#2E7D32' }}>
                                Default / Locked
                            </span>
                        </div>

                        {/* Italian */}
                        <div style={{ padding: '16px', borderRadius: '10px', backgroundColor: '#FAF7F2', border: '1px solid #EDE8E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <span style={{ fontSize: '24px' }}>🇮🇹</span>
                                <div>
                                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C0F07' }}>Italian (IT)</div>
                                    <div style={{ fontSize: '11px', color: '#7C6F65' }}>Verona atelier & European clientele</div>
                                </div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                <input
                                    type="checkbox"
                                    checked={languages.italianActive}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            languages: {
                                                ...settings.languages,
                                                languages: { ...languages, italianActive: e.target.checked },
                                            },
                                        })
                                    }
                                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                />
                                {languages.italianActive ? 'Active' : 'Disabled'}
                            </label>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', paddingTop: '16px', borderTop: '1px solid #FAF7F2' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Default Storefront Language
                            </label>
                            <select
                                value={languages.defaultLanguage}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        languages: {
                                            ...settings.languages,
                                            languages: { ...languages, defaultLanguage: e.target.value as any },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                            >
                                <option value="EN">English (EN)</option>
                                <option value="IT">Italian (IT)</option>
                            </select>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                            <input
                                type="checkbox"
                                checked={languages.autoDetectBrowserLanguage}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        languages: {
                                            ...settings.languages,
                                            languages: { ...languages, autoDetectBrowserLanguage: e.target.checked },
                                        },
                                    })
                                }
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                            />
                            <div>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                    Automatic Browser Language Detection
                                </div>
                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                    If visitor has Italian browser locale, automatically render site in Italian.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Translation Completeness Dashboard */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Italian Translation Completeness
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Monitor content translation health across designs, blog journal articles, and client messages.
                            </p>
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 700, color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '4px 12px', borderRadius: '6px' }}>
                            {translationCompleteness.overallPercentage}% Complete
                        </span>
                    </div>

                    {translationCompleteness.overallPercentage < 50 && languages.italianActive && (
                        <div style={{ padding: '12px 16px', backgroundColor: '#FFF3E0', borderRadius: '8px', border: '1px solid #FFE082', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <FiAlertTriangle size={18} color="#E65100" />
                            <span style={{ fontSize: '12px', color: '#E65100', fontWeight: 600 }}>
                                Italian is active on your public site but translation coverage is under 50%. Complete remaining translations below.
                            </span>
                        </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                        {[
                            {
                                label: 'Lookbook Designs',
                                completed: translationCompleteness.catalogue.translated,
                                total: translationCompleteness.catalogue.total,
                                pct: Math.round((translationCompleteness.catalogue.translated / translationCompleteness.catalogue.total) * 100),
                                link: '/admin/catalogue',
                                linkText: 'Catalogue',
                            },
                            {
                                label: 'Editorial Blog Posts',
                                completed: translationCompleteness.blog.translated,
                                total: translationCompleteness.blog.total,
                                pct: Math.round((translationCompleteness.blog.translated / translationCompleteness.blog.total) * 100),
                                link: '/admin/blog',
                                linkText: 'Blog Journal',
                            },
                            {
                                label: 'Notification Templates',
                                completed: translationCompleteness.emailTemplates.translated,
                                total: translationCompleteness.emailTemplates.total,
                                pct: Math.round((translationCompleteness.emailTemplates.translated / translationCompleteness.emailTemplates.total) * 100),
                                link: '/admin/settings/notifications',
                                linkText: 'Notifications',
                            },
                        ].map((item, idx) => (
                            <div key={idx} style={{ padding: '16px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>
                                        {item.label}
                                    </span>
                                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#1C0F07' }}>
                                        {item.completed} / {item.total} ({item.pct}%)
                                    </span>
                                </div>
                                <div style={{ height: '8px', backgroundColor: '#FFFFFF', borderRadius: '4px', overflow: 'hidden', marginBottom: '10px' }}>
                                    <div style={{ width: `${item.pct}%`, height: '100%', backgroundColor: '#C4975A' }}></div>
                                </div>
                                <Link
                                    href={item.link}
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#C4975A',
                                        textDecoration: 'none',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                    }}
                                >
                                    Complete in {item.linkText} <FiExternalLink size={12} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Active Currencies & Formatting */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>
                            <FiDollarSign size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Active Currencies & Number Formatting
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Choose active currencies and formatting conventions (symbol position and decimal places).
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                        <div style={{ padding: '16px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C0F07' }}>₦ Nigerian Naira (NGN)</div>
                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>Base African diaspora currency</div>
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#2E7D32', backgroundColor: '#E8F5E9', padding: '4px 8px', borderRadius: '4px' }}>
                                Always Active
                            </span>
                        </div>

                        <div style={{ padding: '16px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C0F07' }}>€ Euro (EUR)</div>
                                <div style={{ fontSize: '11px', color: '#7C6F65' }}>Verona atelier & European clients</div>
                            </div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                <input
                                    type="checkbox"
                                    checked={currencies.eurActive}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            languages: {
                                                ...settings.languages,
                                                currencies: { ...currencies, eurActive: e.target.checked },
                                            },
                                        })
                                    }
                                    style={{ width: '16px', height: '16px' }}
                                />
                                {currencies.eurActive ? 'Active' : 'Disabled'}
                            </label>
                        </div>
                    </div>

                    {/* Display Formatting Controls */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Currency Symbol Position
                            </label>
                            <select
                                value={displayFormat.symbolPosition}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        languages: {
                                            ...settings.languages,
                                            displayFormat: { ...displayFormat, symbolPosition: e.target.value as any },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                            >
                                <option value="before">Before Amount (e.g. €1,200 / ₦1,750,000)</option>
                                <option value="after">After Amount (e.g. 1,200 € / 1,750,000 ₦)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Decimal Places
                            </label>
                            <select
                                value={displayFormat.decimalPlaces}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        languages: {
                                            ...settings.languages,
                                            displayFormat: { ...displayFormat, decimalPlaces: parseInt(e.target.value) as any },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                            >
                                <option value={0}>0 Decimals (Clean: €1,200)</option>
                                <option value={2}>2 Decimals (Standard: €1,200.00)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Thousands Separator
                            </label>
                            <select
                                value={displayFormat.thousandsSeparator}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        languages: {
                                            ...settings.languages,
                                            displayFormat: { ...displayFormat, thousandsSeparator: e.target.value as any },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                            >
                                <option value="comma">Comma (1,000,000)</option>
                                <option value="period">Period (1.000.000)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
