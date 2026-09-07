'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    ReferralProgrammeConfig,
    getProgrammeConfig,
    saveProgrammeConfig,
} from '@/data/adminReferralsData'

export default function AdminReferralSettingsPage() {
    const [config, setConfig] = useState<ReferralProgrammeConfig>(getProgrammeConfig())
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        setConfig(getProgrammeConfig())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        saveProgrammeConfig(config)
        showToast('Referral programme rules and notification preferences saved!')
    }

    return (
        <div style={{ padding: '36px 40px 100px', minHeight: '100vh', background: '#FAF7F2' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '32px',
                        background: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '14px 22px',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                        zIndex: 9999,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    {toastMessage}
                </div>
            )}

            {/* Breadcrumb */}
            <div style={{ marginBottom: '20px' }}>
                <Link
                    href="/admin/referrals"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: '#6B7280',
                        textDecoration: 'none',
                    }}
                >
                    ← Back to Referrals Overview
                </Link>
            </div>

            {/* Header Bar */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    marginBottom: '32px',
                }}
            >
                <div>
                    <h1
                        style={{
                            fontSize: '1.875rem',
                            fontWeight: 700,
                            color: '#1C0F07',
                            letterSpacing: '-0.02em',
                            margin: 0,
                        }}
                    >
                        Referral Programme Settings & Policy
                    </h1>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9375rem', color: '#6B7280' }}>
                        Configure system triggers, token issuance rules, cooldown buffers, and automated messaging alerts.
                    </p>
                </div>

                <Link
                    href="/admin/referrals/rewards"
                    style={{
                        background: '#FFFFFF',
                        color: '#1C0F07',
                        border: '1px solid #EDE8E1',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    🎁 Rewards Values & Redemptions →
                </Link>
            </div>

            {/* Main Settings Form Card */}
            <form onSubmit={handleSave}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '900px' }}>
                    {/* 1. Programme Status Toggle */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                            <div>
                                <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 4px' }}>
                                    Master Programme Status
                                </h2>
                                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.45 }}>
                                    Enable or pause the entire referral programme atelier-wide. When paused, existing links still open the website but no new referral credits will trigger.
                                </p>
                            </div>

                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={config.isEnabled}
                                    onChange={(e) => setConfig((prev) => ({ ...prev, isEnabled: e.target.checked }))}
                                    style={{ width: '20px', height: '20px', accentColor: '#15803D', cursor: 'pointer' }}
                                />
                                <span style={{ fontSize: '0.9375rem', fontWeight: 700, color: config.isEnabled ? '#15803D' : '#B91C1C' }}>
                                    {config.isEnabled ? 'Active (Enabled)' : 'Paused (Disabled)'}
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* 2. Link Generation Policy */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 6px' }}>
                            Link Generation Policy
                        </h2>
                        <p style={{ margin: '0 0 18px', fontSize: '0.8125rem', color: '#6B7280' }}>
                            Select when a patron receives their unique personalized referral token and shareable URL.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: config.rules.linkGenerationEvent === 'first_deposit_paid' ? '1.5px solid #C4975A' : '1px solid #EDE8E1',
                                    background: config.rules.linkGenerationEvent === 'first_deposit_paid' ? '#FAF7F2' : '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="radio"
                                    name="linkGen"
                                    checked={config.rules.linkGenerationEvent === 'first_deposit_paid'}
                                    onChange={() =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            rules: { ...prev.rules, linkGenerationEvent: 'first_deposit_paid' },
                                        }))
                                    }
                                    style={{ marginTop: '2px', accentColor: '#C4975A' }}
                                />
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07' }}>
                                        After First Confirmed Order (Deposit Paid) — Recommended
                                    </p>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                                        Patrons only receive an ambassador link after committing to their first bespoke outfit. Preserves exclusivity.
                                    </p>
                                </div>
                            </label>

                            <label
                                style={{
                                    display: 'flex',
                                    alignItems: 'flex-start',
                                    gap: '12px',
                                    padding: '14px 16px',
                                    borderRadius: '10px',
                                    border: config.rules.linkGenerationEvent === 'all_registered' ? '1.5px solid #C4975A' : '1px solid #EDE8E1',
                                    background: config.rules.linkGenerationEvent === 'all_registered' ? '#FAF7F2' : '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                <input
                                    type="radio"
                                    name="linkGen"
                                    checked={config.rules.linkGenerationEvent === 'all_registered'}
                                    onChange={() =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            rules: { ...prev.rules, linkGenerationEvent: 'all_registered' },
                                        }))
                                    }
                                    style={{ marginTop: '2px', accentColor: '#C4975A' }}
                                />
                                <div>
                                    <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07' }}>
                                        All Registered Patrons Immediately (Open Campaign Mode)
                                    </p>
                                    <p style={{ margin: '2px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                                        Generates a referral link for every user upon creating an account, even before their first commission.
                                    </p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* 3. Reward Trigger & Cooldown Rules */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 6px' }}>
                            Reward Qualification & Cooldown Rules
                        </h2>
                        <p style={{ margin: '0 0 20px', fontSize: '0.8125rem', color: '#6B7280' }}>
                            Determine the exact financial event that triggers credit issuance.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '18px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Reward Trigger Milestone
                                </label>
                                <select
                                    value={config.rules.rewardTriggerEvent}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            rules: {
                                                ...prev.rules,
                                                rewardTriggerEvent: e.target.value as 'deposit_paid' | 'full_balance_paid',
                                            },
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        background: '#FAF7F2',
                                        outline: 'none',
                                    }}
                                >
                                    <option value="deposit_paid">50% Initial Deposit Paid (Default)</option>
                                    <option value="full_balance_paid">100% Full Balance Paid Upon Dispatch</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Cooldown Buffer Period (Days)
                                </label>
                                <input
                                    type="number"
                                    value={config.rules.cooldownDays}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            rules: {
                                                ...prev.rules,
                                                cooldownDays: parseInt(e.target.value, 10) || 0,
                                            },
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 14px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        background: '#FAF7F2',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px', display: 'block' }}>
                                    Minimum days between a customer claiming multiple referral rewards.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 4. Expiry Policy */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 6px' }}>
                            Credit Validity & Expiration Policy
                        </h2>
                        <p style={{ margin: '0 0 16px', fontSize: '0.8125rem', color: '#6B7280' }}>
                            Define how long a credited reward remains eligible for redemption on bespoke commissions.
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                            <div style={{ flex: '0 0 180px' }}>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                                    Validity Period (Days)
                                </label>
                                <input
                                    type="number"
                                    value={config.rules.expiryDays}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            rules: {
                                                ...prev.rules,
                                                expiryDays: parseInt(e.target.value, 10) || 0,
                                            },
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        height: '42px',
                                        padding: '0 14px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        background: '#FAF7F2',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div style={{ flex: 1, paddingTop: '22px' }}>
                                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>
                                    {config.rules.expiryDays > 0
                                        ? `Rewards expire ${config.rules.expiryDays} days after credit. An automated WhatsApp reminder is sent 7 days prior.`
                                        : 'Set to 0 to disable expiration (credits remain valid perpetually).'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 5. Automated Notification Channels */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.0625rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 6px' }}>
                            WhatsApp & Email Notification Channels
                        </h2>
                        <p style={{ margin: '0 0 18px', fontSize: '0.8125rem', color: '#6B7280' }}>
                            Configure alerts dispatched to Samuelson and patrons along the referral journey.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={config.notifications.notifyAdminOnConversion}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            notifications: {
                                                ...prev.notifications,
                                                notifyAdminOnConversion: e.target.checked,
                                            },
                                        }))
                                    }
                                    style={{ width: '18px', height: '18px', accentColor: '#C4975A' }}
                                />
                                <span style={{ fontSize: '0.875rem', color: '#1C0F07', fontWeight: 500 }}>
                                    Notify Samuelson (WhatsApp + Email) when a referral converts to a confirmed paid order
                                </span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={config.notifications.notifyCustomerOnVisit}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            notifications: {
                                                ...prev.notifications,
                                                notifyCustomerOnVisit: e.target.checked,
                                            },
                                        }))
                                    }
                                    style={{ width: '18px', height: '18px', accentColor: '#C4975A' }}
                                />
                                <span style={{ fontSize: '0.875rem', color: '#1C0F07', fontWeight: 500 }}>
                                    Notify advocate when their personalized link is visited (heads up alert)
                                </span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={config.notifications.notifyCustomerOnRewardCredited}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            notifications: {
                                                ...prev.notifications,
                                                notifyCustomerOnRewardCredited: e.target.checked,
                                            },
                                        }))
                                    }
                                    style={{ width: '18px', height: '18px', accentColor: '#C4975A' }}
                                />
                                <span style={{ fontSize: '0.875rem', color: '#1C0F07', fontWeight: 500 }}>
                                    Notify advocate and friend with congratulatory voucher code when reward triggers
                                </span>
                            </label>

                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={config.notifications.notifyCustomerBeforeExpiry}
                                    onChange={(e) =>
                                        setConfig((prev) => ({
                                            ...prev,
                                            notifications: {
                                                ...prev.notifications,
                                                notifyCustomerBeforeExpiry: e.target.checked,
                                            },
                                        }))
                                    }
                                    style={{ width: '18px', height: '18px', accentColor: '#C4975A' }}
                                />
                                <span style={{ fontSize: '0.875rem', color: '#1C0F07', fontWeight: 500 }}>
                                    Send expiry warning alert 7 days prior to voucher expiration
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                        <button
                            type="submit"
                            style={{
                                background: '#1C0F07',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '12px 28px',
                                fontSize: '0.9375rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                            }}
                        >
                            Save Settings & Policies
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
