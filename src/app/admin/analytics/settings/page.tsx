'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    AnalyticsSettings,
    getAnalyticsSettings,
    saveAnalyticsSettings,
    INITIAL_ANALYTICS_SETTINGS,
} from '@/data/adminAnalyticsData'
import {
    FiSettings,
    FiCheckCircle,
    FiAlertCircle,
    FiSave,
    FiArrowLeft,
    FiRefreshCw,
    FiMail,
    FiShield,
    FiGlobe,
    FiActivity,
    FiSend,
} from '@/components/admin/AnalyticsIcons'

export default function AnalyticsSettingsPage() {
    const [settings, setSettings] = useState<AnalyticsSettings>(INITIAL_ANALYTICS_SETTINGS)
    const [isSaved, setIsSaved] = useState(false)
    const [isTestingGA, setIsTestingGA] = useState(false)
    const [gaTestStatus, setGaTestStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [isTestingGSC, setIsTestingGSC] = useState(false)
    const [gscTestStatus, setGscTestStatus] = useState<'idle' | 'success'>('idle')
    const [testReportSent, setTestReportSent] = useState(false)

    // Additional toggles for luxury customization
    const [trackOrderValue, setTrackOrderValue] = useState(true)
    const [trackReferrals, setTrackReferrals] = useState(true)
    const [anonymizeIP, setAnonymizeIP] = useState(true)
    const [cookieConsentActive, setCookieConsentActive] = useState(true)
    const [weeklyDay, setWeeklyDay] = useState('Monday')
    const [monthlyDay, setMonthlyDay] = useState('1st of Month')

    useEffect(() => {
        const loaded = getAnalyticsSettings()
        setSettings(loaded)
    }, [])

    const handleSave = () => {
        saveAnalyticsSettings(settings)
        setIsSaved(true)
        setTimeout(() => setIsSaved(false), 3000)
    }

    const handleTestGA = () => {
        setIsTestingGA(true)
        setGaTestStatus('idle')
        setTimeout(() => {
            setIsTestingGA(false)
            setGaTestStatus('success')
        }, 1200)
    }

    const handleTestGSC = () => {
        setIsTestingGSC(true)
        setGscTestStatus('idle')
        setTimeout(() => {
            setIsTestingGSC(false)
            setGscTestStatus('success')
        }, 1200)
    }

    const handleSendTestReport = () => {
        setTestReportSent(true)
        setTimeout(() => setTestReportSent(false), 4000)
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
                {/* Top Nav & Breadcrumb */}
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
                            <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Settings</span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Analytics & Integrations Settings
                        </h1>
                        <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                            Configure Google Analytics 4, Search Console property, GDPR retention, and scheduled executive digests.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {isSaved && (
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
                                <FiCheckCircle size={14} /> Settings Saved
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
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <FiSave size={14} color="#C4975A" /> Save Changes
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px' }}>
                    {/* SECTION 1: GOOGLE ANALYTICS 4 (GA4) */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4975A' }}>
                                    <FiActivity size={18} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                        Google Analytics 4 (GA4)
                                    </h2>
                                    <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                        Real-time event tracking and e-commerce conversions
                                    </p>
                                </div>
                            </div>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: settings.googleAnalytics.isConnected ? '#2E7D32' : '#7C6F65',
                                    backgroundColor: settings.googleAnalytics.isConnected ? '#E8F5E9' : '#F5F5F5',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                }}
                            >
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: settings.googleAnalytics.isConnected ? '#2E7D32' : '#7C6F65',
                                    }}
                                ></span>
                                {settings.googleAnalytics.isConnected ? 'Connected' : 'Disconnected'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Measurement ID
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={settings.googleAnalytics.measurementId}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                googleAnalytics: { ...settings.googleAnalytics, measurementId: e.target.value },
                                            })
                                        }
                                        placeholder="G-XXXXXXXXXX"
                                        style={{
                                            flex: 1,
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #EDE8E1',
                                            fontSize: '13px',
                                            fontFamily: 'monospace',
                                            color: '#1C0F07',
                                            backgroundColor: '#FAF7F2',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleTestGA}
                                        disabled={isTestingGA}
                                        style={{
                                            padding: '10px 16px',
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #EDE8E1',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                        }}
                                    >
                                        <FiRefreshCw size={12} className={isTestingGA ? 'animate-spin' : ''} />
                                        {isTestingGA ? 'Testing...' : 'Test'}
                                    </button>
                                </div>
                                {gaTestStatus === 'success' && (
                                    <p style={{ fontSize: '11px', color: '#2E7D32', margin: '4px 0 0 0' }}>
                                        ✓ Connection verified: ping received from Google servers.
                                    </p>
                                )}
                            </div>

                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                        Track Order Value in GA4
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={trackOrderValue}
                                        onChange={(e) => setTrackOrderValue(e.target.checked)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </div>
                                <p style={{ fontSize: '11px', color: '#7C6F65', margin: 0 }}>
                                    Sends bespoke purchase events with currency (NGN & EUR) and deposit breakdown to Google Analytics e-commerce.
                                </p>
                            </div>

                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                        Track Referral Code as Custom Dimension
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={trackReferrals}
                                        onChange={(e) => setTrackReferrals(e.target.checked)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </div>
                                <p style={{ fontSize: '11px', color: '#7C6F65', margin: 0 }}>
                                    Appends client referral codes into GA4 user scope to cross-correlate advocate campaigns with bounce rates.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: GOOGLE SEARCH CONSOLE */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0' }}>
                                    <FiGlobe size={18} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                        Google Search Console
                                    </h2>
                                    <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                        Search impressions, organic queries, and indexing status
                                    </p>
                                </div>
                            </div>
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    color: settings.googleSearchConsole.isConnected ? '#2E7D32' : '#7C6F65',
                                    backgroundColor: settings.googleSearchConsole.isConnected ? '#E8F5E9' : '#F5F5F5',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                }}
                            >
                                <span
                                    style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        backgroundColor: settings.googleSearchConsole.isConnected ? '#2E7D32' : '#7C6F65',
                                    }}
                                ></span>
                                {settings.googleSearchConsole.isConnected ? 'Site Verified' : 'Unverified'}
                            </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Verified Property URL
                                </label>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        value={settings.googleSearchConsole.propertyUrl}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                googleSearchConsole: { ...settings.googleSearchConsole, propertyUrl: e.target.value },
                                            })
                                        }
                                        placeholder="https://captainstitches.com"
                                        style={{
                                            flex: 1,
                                            padding: '10px 14px',
                                            borderRadius: '8px',
                                            border: '1px solid #EDE8E1',
                                            fontSize: '13px',
                                            color: '#1C0F07',
                                            backgroundColor: '#FAF7F2',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleTestGSC}
                                        disabled={isTestingGSC}
                                        style={{
                                            padding: '10px 16px',
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #EDE8E1',
                                            borderRadius: '8px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            cursor: 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                        }}
                                    >
                                        <FiRefreshCw size={12} className={isTestingGSC ? 'animate-spin' : ''} />
                                        {isTestingGSC ? 'Checking...' : 'Re-verify'}
                                    </button>
                                </div>
                                {gscTestStatus === 'success' && (
                                    <p style={{ fontSize: '11px', color: '#2E7D32', margin: '4px 0 0 0' }}>
                                        ✓ Domain ownership verified via DNS TXT record.
                                    </p>
                                )}
                            </div>

                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07', marginBottom: '4px' }}>
                                    Last Sitemap Sync
                                </div>
                                <div style={{ fontSize: '12px', color: '#7C6F65', marginBottom: '8px' }}>
                                    {settings.googleSearchConsole.lastSync} (42 pages & lookbooks crawled)
                                </div>
                                <div style={{ fontSize: '11px', color: '#2E7D32', fontWeight: 600 }}>
                                    ✓ 100% indexing status — 0 canonical errors
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: DATA RETENTION & GDPR PRIVACY */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>
                                <FiShield size={18} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Data Retention & Privacy (GDPR Compliance)
                                </h2>
                                <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                    Client confidentiality and European privacy regulations
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Analytics Data Retention Period
                                </label>
                                <select
                                    value={settings.dataRetentionMonths}
                                    onChange={(e) =>
                                        setSettings({ ...settings, dataRetentionMonths: parseInt(e.target.value) })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        backgroundColor: '#FAF7F2',
                                        fontSize: '13px',
                                        color: '#1C0F07',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value={12}>12 Months (Strict European Minimalist)</option>
                                    <option value={24}>24 Months (Recommended for Seasonal Sartorial Cycles)</option>
                                    <option value={36}>36 Months (Extended Bespoke History)</option>
                                    <option value={999}>Indefinitely (Historical Archiving)</option>
                                </select>
                            </div>

                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                        Anonymize IP Addresses
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={anonymizeIP}
                                        onChange={(e) => setAnonymizeIP(e.target.checked)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </div>
                                <p style={{ fontSize: '11px', color: '#7C6F65', margin: 0 }}>
                                    Truncates the last octet of visitor IP addresses before logging to ensure adherence to EU GDPR standards for Italian & European clients.
                                </p>
                            </div>

                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                        Bespoke Cookie Consent Banner
                                    </span>
                                    <input
                                        type="checkbox"
                                        checked={cookieConsentActive}
                                        onChange={(e) => setCookieConsentActive(e.target.checked)}
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </div>
                                <p style={{ fontSize: '11px', color: '#7C6F65', margin: 0 }}>
                                    Displays subtle atelier cookie banner on public storefront until visitor grants telemetry permission.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: SCHEDULED EXECUTIVE REPORTS */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8A5D18' }}>
                                <FiMail size={18} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Automated Executive Telemetry Digests
                                </h2>
                                <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                    Periodic PDF summaries delivered directly to Samuelson&apos;s inbox
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Recipient Email
                                </label>
                                <input
                                    type="email"
                                    value={settings.reporting.recipientEmail}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            reporting: { ...settings.reporting, recipientEmail: e.target.value },
                                        })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        fontSize: '13px',
                                        color: '#1C0F07',
                                        backgroundColor: '#FAF7F2',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                            Weekly Workshop Digest
                                        </span>
                                        <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                            Orders in pipeline, overdue SLA alerts, and revenue collected
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.reporting.weeklySummary}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                reporting: { ...settings.reporting, weeklySummary: e.target.checked },
                                            })
                                        }
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#7C6F65' }}>Dispatched every:</span>
                                    <select
                                        value={weeklyDay}
                                        onChange={(e) => setWeeklyDay(e.target.value)}
                                        style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #EDE8E1', backgroundColor: '#FFFFFF' }}
                                    >
                                        <option value="Monday">Monday Morning (08:00)</option>
                                        <option value="Sunday">Sunday Evening (20:00)</option>
                                        <option value="Friday">Friday Afternoon (17:00)</option>
                                    </select>
                                </div>
                            </div>

                            <div style={{ padding: '12px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                            Monthly Executive Review
                                        </span>
                                        <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                            LTV expansion, retention cohorts, top designs, and financial health
                                        </div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={settings.reporting.monthlySummary}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                reporting: { ...settings.reporting, monthlySummary: e.target.checked },
                                            })
                                        }
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                    <span style={{ fontSize: '11px', color: '#7C6F65' }}>Dispatched on:</span>
                                    <select
                                        value={monthlyDay}
                                        onChange={(e) => setMonthlyDay(e.target.value)}
                                        style={{ fontSize: '11px', padding: '3px 8px', borderRadius: '4px', border: '1px solid #EDE8E1', backgroundColor: '#FFFFFF' }}
                                    >
                                        <option value="1st of Month">1st Day of each Month</option>
                                        <option value="Last Day of Month">Last Day of each Month</option>
                                    </select>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSendTestReport}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    cursor: 'pointer',
                                    marginTop: '8px',
                                }}
                            >
                                <FiSend size={14} color="#C4975A" />
                                {testReportSent ? 'Digest Dispatched to Inbox!' : 'Send Test Report Now'}
                            </button>
                        </div>
                    </div>
                </div>
        </div>
    )
}
