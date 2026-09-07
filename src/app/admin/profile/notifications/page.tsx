'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getPersonalNotificationPreferences,
    savePersonalNotificationPreferences,
    PersonalNotificationPreferences,
    NotificationChannelPreference,
} from '@/data/adminProfileData'
import {
    FiArrowLeft,
    FiBell,
    FiCheck,
    FiSave,
    FiAlertTriangle,
    FiClock,
    FiMessageSquare,
    FiSend,
} from '@/components/admin/SettingsIcons'

export default function AdminNotificationPreferencesPage() {
    const [prefs, setPrefs] = useState<PersonalNotificationPreferences | null>(null)
    const [isSavedToast, setIsSavedToast] = useState(false)

    useEffect(() => {
        setPrefs(getPersonalNotificationPreferences())
    }, [])

    if (!prefs) {
        return (
            <div
                style={{
                    padding: '40px',
                    backgroundColor: '#FAF7F2',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'inherit',
                    color: '#7C6F64',
                }}
            >
                Loading notification preferences...
            </div>
        )
    }

    const handleSave = (updated: PersonalNotificationPreferences) => {
        setPrefs(updated)
        savePersonalNotificationPreferences(updated)
        setIsSavedToast(true)
        setTimeout(() => setIsSavedToast(false), 2500)
    }

    const handleRuleChannelChange = (ruleId: string, channel: NotificationChannelPreference) => {
        const updatedRules = prefs.rules.map((r) => (r.id === ruleId ? { ...r, channel } : r))
        handleSave({ ...prefs, rules: updatedRules })
    }

    const handleOverdueDaysChange = (ruleId: string, days: number) => {
        const updatedRules = prefs.rules.map((r) => (r.id === ruleId ? { ...r, overdueDaysNotice: days } : r))
        handleSave({ ...prefs, rules: updatedRules })
    }

    return (
        <div
            style={{
                padding: '32px',
                backgroundColor: '#FAF7F2',
                minHeight: '100vh',
                fontFamily: 'inherit',
                color: '#1C0F07',
            }}
        >
            {/* Top Toast */}
            {isSavedToast && (
                <div
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        zIndex: 9999,
                        backgroundColor: '#1C0F07',
                        color: '#FFFFFF',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(28, 15, 7, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                >
                    <FiCheck size={16} color="#C4975A" />
                    Notification preferences saved successfully
                </div>
            )}

            {/* Header Bar */}
            <div style={{ marginBottom: '28px' }}>
                <Link
                    href="/admin/profile"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#7C6F64',
                        textDecoration: 'none',
                        marginBottom: '12px',
                        fontWeight: 500,
                    }}
                >
                    <FiArrowLeft size={15} />
                    Back to My Profile
                </Link>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                backgroundColor: '#F0EBE1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#C4975A',
                            }}
                        >
                            <FiBell size={22} />
                        </div>
                        <div>
                            <h1
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    margin: 0,
                                    color: '#1C0F07',
                                }}
                            >
                                Personal Notification Preferences
                            </h1>
                            <p
                                style={{
                                    fontSize: '13px',
                                    color: '#7C6F64',
                                    margin: '4px 0 0 0',
                                }}
                            >
                                Configure how and when you receive executive alerts across WhatsApp and Email.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => handleSave(prefs)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '10px 22px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        <FiSave size={15} />
                        Save Preferences
                    </button>
                </div>
            </div>

            {/* 1. Master Channels Card */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EDE8E1',
                    padding: '24px',
                    marginBottom: '28px',
                    boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                }}
            >
                <h2 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px 0', color: '#1C0F07' }}>
                    Global Alert Channels
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '20px',
                    }}
                >
                    {/* WhatsApp Channel */}
                    <div
                        style={{
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #EDE8E1',
                            borderRadius: '10px',
                            padding: '18px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '18px' }}>💬</span>
                                <strong style={{ fontSize: '14px', color: '#1C0F07' }}>WhatsApp Notifications</strong>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.whatsappGloballyEnabled}
                                onChange={(e) =>
                                    handleSave({ ...prefs, whatsappGloballyEnabled: e.target.checked })
                                }
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                        </div>
                        <p style={{ fontSize: '12px', color: '#7C6F64', margin: 0, lineHeight: 1.45 }}>
                            Dispatches high-priority order commitments and inspection notifications directly to your phone.
                        </p>

                        {!prefs.whatsappGloballyEnabled && (
                            <div
                                style={{
                                    marginTop: '12px',
                                    padding: '10px',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: '6px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    fontSize: '11px',
                                    color: '#92400E',
                                }}
                            >
                                <FiAlertTriangle size={14} style={{ flexShrink: 0 }} />
                                <span>Warning: You will miss instant real-time inspection requests while WhatsApp is disabled.</span>
                            </div>
                        )}
                    </div>

                    {/* Email Channel */}
                    <div
                        style={{
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #EDE8E1',
                            borderRadius: '10px',
                            padding: '18px',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '8px',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '18px' }}>✉️</span>
                                <strong style={{ fontSize: '14px', color: '#1C0F07' }}>Email Notifications</strong>
                            </div>
                            <input
                                type="checkbox"
                                checked={prefs.emailGloballyEnabled}
                                onChange={(e) =>
                                    handleSave({ ...prefs, emailGloballyEnabled: e.target.checked })
                                }
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                        </div>
                        <p style={{ fontSize: '12px', color: '#7C6F64', margin: 0, lineHeight: 1.45 }}>
                            Delivers receipts, daily summaries, marketing milestone alerts, and customer review notifications.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Notification Types Matrix */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EDE8E1',
                    padding: '24px',
                    marginBottom: '28px',
                    boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                }}
            >
                <div style={{ marginBottom: '18px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1C0F07' }}>
                        Atelier Event Routing Rules
                    </h2>
                    <p style={{ fontSize: '13px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                        Customize your preferred destination channel for each individual event.
                    </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {prefs.rules.map((rule) => (
                        <div
                            key={rule.id}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '14px 18px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                flexWrap: 'wrap',
                                gap: '14px',
                            }}
                        >
                            <div style={{ maxWidth: '480px' }}>
                                <div style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>
                                    {rule.label}
                                </div>
                                <div style={{ fontSize: '11px', color: '#7C6F64', marginTop: '2px' }}>
                                    {rule.description}
                                </div>

                                {rule.id === 'order_overdue' && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                                        <span style={{ fontSize: '11px', color: '#1C0F07' }}>Notify me</span>
                                        <input
                                            type="number"
                                            min="1"
                                            max="14"
                                            value={rule.overdueDaysNotice || 2}
                                            onChange={(e) =>
                                                handleOverdueDaysChange(rule.id, parseInt(e.target.value) || 1)
                                            }
                                            style={{
                                                width: '50px',
                                                padding: '3px 6px',
                                                fontSize: '11px',
                                                borderRadius: '4px',
                                                border: '1px solid #D1C9BE',
                                                backgroundColor: '#FFFFFF',
                                            }}
                                        />
                                        <span style={{ fontSize: '11px', color: '#1C0F07' }}>days after SLA deadline</span>
                                    </div>
                                )}
                            </div>

                            {/* Channel Options */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                {(['both', 'whatsapp', 'email', 'none'] as NotificationChannelPreference[]).map(
                                    (ch) => {
                                        const isSelected = rule.channel === ch
                                        return (
                                            <button
                                                key={ch}
                                                type="button"
                                                onClick={() => handleRuleChannelChange(rule.id, ch)}
                                                style={{
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    textTransform: 'capitalize',
                                                    cursor: 'pointer',
                                                    border: isSelected ? '1px solid #C4975A' : '1px solid #EDE8E1',
                                                    backgroundColor: isSelected ? '#FDF3E7' : '#FFFFFF',
                                                    color: isSelected ? '#C4975A' : '#7C6F64',
                                                }}
                                            >
                                                {ch}
                                            </button>
                                        )
                                    }
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Quiet Hours & Digest Cards */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                }}
            >
                {/* Quiet Hours */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                        }}
                    >
                        <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#1C0F07' }}>
                            🌙 Quiet Hours Schedule
                        </h3>
                        <input
                            type="checkbox"
                            checked={prefs.quietHours.enabled}
                            onChange={(e) =>
                                handleSave({
                                    ...prefs,
                                    quietHours: { ...prefs.quietHours, enabled: e.target.checked },
                                })
                            }
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                    </div>

                    <p style={{ fontSize: '12px', color: '#7C6F64', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                        During quiet hours, WhatsApp notifications are held and delivered as a consolidated morning summary. Urgent emails send normally.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#1C0F07', marginBottom: '4px' }}>
                                Start Time
                            </label>
                            <input
                                type="time"
                                value={prefs.quietHours.startTime}
                                onChange={(e) =>
                                    handleSave({
                                        ...prefs,
                                        quietHours: { ...prefs.quietHours, startTime: e.target.value },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '12px',
                                    outline: 'none',
                                }}
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#1C0F07', marginBottom: '4px' }}>
                                End Time
                            </label>
                            <input
                                type="time"
                                value={prefs.quietHours.endTime}
                                onChange={(e) =>
                                    handleSave({
                                        ...prefs,
                                        quietHours: { ...prefs.quietHours, endTime: e.target.value },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '12px',
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#1C0F07', marginBottom: '4px' }}>
                            Timezone
                        </label>
                        <select
                            value={prefs.quietHours.timezone}
                            onChange={(e) =>
                                handleSave({
                                    ...prefs,
                                    quietHours: { ...prefs.quietHours, timezone: e.target.value },
                                })
                            }
                            style={{
                                width: '100%',
                                padding: '8px 10px',
                                borderRadius: '6px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '12px',
                                outline: 'none',
                            }}
                        >
                            <option value="Europe/Rome (CET - Verona)">Europe/Rome (CET - Verona)</option>
                            <option value="Africa/Lagos (WAT - Lagos)">Africa/Lagos (WAT - Lagos)</option>
                            <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                        </select>
                    </div>
                </div>

                {/* Executive Digest */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '12px',
                        }}
                    >
                        <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0, color: '#1C0F07' }}>
                            📰 Executive Summary Digest
                        </h3>
                        <input
                            type="checkbox"
                            checked={prefs.digest.enabled}
                            onChange={(e) =>
                                handleSave({
                                    ...prefs,
                                    digest: { ...prefs.digest, enabled: e.target.checked },
                                })
                            }
                            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                        />
                    </div>

                    <p style={{ fontSize: '12px', color: '#7C6F64', margin: '0 0 16px 0', lineHeight: 1.45 }}>
                        Consolidate individual alerts into a high-level summary briefing including orders placed, revenue collected, overdue suits, and new subscribers.
                    </p>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#1C0F07', marginBottom: '4px' }}>
                                Frequency
                            </label>
                            <select
                                value={prefs.digest.frequency}
                                onChange={(e) =>
                                    handleSave({
                                        ...prefs,
                                        digest: { ...prefs.digest, frequency: e.target.value as 'daily' | 'weekly' },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '12px',
                                    outline: 'none',
                                }}
                            >
                                <option value="daily">Daily Morning Digest</option>
                                <option value="weekly">Weekly Monday Review</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#1C0F07', marginBottom: '4px' }}>
                                Delivery Time
                            </label>
                            <input
                                type="time"
                                value={prefs.digest.time}
                                onChange={(e) =>
                                    handleSave({
                                        ...prefs,
                                        digest: { ...prefs.digest, time: e.target.value },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '12px',
                                    outline: 'none',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
