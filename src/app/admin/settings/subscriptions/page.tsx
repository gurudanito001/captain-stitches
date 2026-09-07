'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminSettings,
    saveAdminSettings,
    MasterAdminSettings,
    SubscriptionTier,
} from '@/data/adminSettingsData'
import {
    FiArrowLeft,
    FiRepeat,
    FiCheck,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiAlertTriangle,
    FiSave,
    FiX,
    FiShield,
    FiHelpCircle,
    FiKey,
} from '@/components/admin/SettingsIcons'

export default function AdminSubscriptionsSettingsPage() {
    const [settings, setSettings] = useState<MasterAdminSettings | null>(null)
    const [isSavedToast, setIsSavedToast] = useState(false)
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false)
    const [pendingToggleState, setPendingToggleState] = useState<boolean | null>(null)

    // Modal state for Edit/Create Tier
    const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null)
    const [isNewTier, setIsNewTier] = useState(false)
    const [newFeatureText, setNewFeatureText] = useState('')

    useEffect(() => {
        setSettings(getAdminSettings())
    }, [])

    if (!settings) {
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
                Loading subscription settings...
            </div>
        )
    }

    const sub = settings.subscriptions

    const handleSave = (updatedSub: typeof sub) => {
        const updated = {
            ...settings,
            subscriptions: updatedSub,
            lastUpdated: new Date().toISOString(),
        }
        setSettings(updated)
        saveAdminSettings(updated)
        setIsSavedToast(true)
        setTimeout(() => setIsSavedToast(false), 2500)
    }

    const handleConfirmToggleFeature = () => {
        if (pendingToggleState === null) return
        const updated = {
            ...sub,
            enabled: pendingToggleState,
        }
        handleSave(updated)
        setIsToggleModalOpen(false)
        setPendingToggleState(null)
    }

    const openEditTier = (tier: SubscriptionTier) => {
        setEditingTier(JSON.parse(JSON.stringify(tier)))
        setIsNewTier(false)
        setNewFeatureText('')
    }

    const openCreateTier = () => {
        const newTier: SubscriptionTier = {
            id: `tier-${Date.now()}`,
            nameEN: 'New Bespoke Wardrobe Tier',
            nameIT: 'Nuovo Livello Guardaroba Su Misura',
            priceNGN: 200000,
            priceEUR: 115,
            billingInterval: 'monthly',
            features: ['1 Handcrafted tailored piece per cycle', 'Complimentary luxury fabric dispatch'],
            activeSubscribers: 0,
            isVisible: true,
            paystackPlanId: 'PLN_new_wardrobe_tier',
            stripePriceId: 'price_new_wardrobe_tier',
        }
        setEditingTier(newTier)
        setIsNewTier(true)
        setNewFeatureText('')
    }

    const handleSaveTierModal = () => {
        if (!editingTier) return
        let updatedTiers = [...sub.tiers]
        if (isNewTier) {
            updatedTiers.push(editingTier)
        } else {
            updatedTiers = updatedTiers.map((t) => (t.id === editingTier.id ? editingTier : t))
        }
        handleSave({ ...sub, tiers: updatedTiers })
        setEditingTier(null)
    }

    const handleDeleteTier = (tierId: string) => {
        if (confirm('Are you sure you want to remove this tier? All pricing and gateway IDs will be deleted.')) {
            const updatedTiers = sub.tiers.filter((t) => t.id !== tierId)
            handleSave({ ...sub, tiers: updatedTiers })
        }
    }

    const handleAddFeatureToModal = () => {
        if (!editingTier || !newFeatureText.trim()) return
        setEditingTier({
            ...editingTier,
            features: [...editingTier.features, newFeatureText.trim()],
        })
        setNewFeatureText('')
    }

    const handleRemoveFeatureFromModal = (index: number) => {
        if (!editingTier) return
        const updatedFeatures = editingTier.features.filter((_, i) => i !== index)
        setEditingTier({
            ...editingTier,
            features: updatedFeatures,
        })
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
                    Subscription settings saved successfully
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <Link
                    href="/admin/settings"
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
                    Back to Settings
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
                            <FiRepeat size={22} />
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
                                Subscription Settings
                            </h1>
                            <p
                                style={{
                                    fontSize: '13px',
                                    color: '#7C6F64',
                                    margin: '4px 0 0 0',
                                }}
                            >
                                Recurring bespoke wardrobe club tiers, Paystack & Stripe plan IDs, and lifecycle rules.
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={openCreateTier}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        <FiPlus size={16} />
                        Create New Tier
                    </button>
                </div>
            </div>

            {/* Master Feature Flag Card */}
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
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div style={{ maxWidth: '650px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#1C0F07' }}>
                                Bespoke Wardrobe Club (Recurring Subscriptions)
                            </h2>
                            <span
                                style={{
                                    display: 'inline-block',
                                    padding: '3px 10px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    backgroundColor: sub.enabled ? '#E6F4EA' : '#FEF3C7',
                                    color: sub.enabled ? '#137333' : '#92400E',
                                }}
                            >
                                {sub.enabled ? 'Active on Storefront' : 'Dormant / Off at Launch'}
                            </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0, lineHeight: 1.5 }}>
                            Controls whether recurring membership tiers appear in the public navigation and checkout.
                            When disabled, tier configurations, pricing, and gateway mappings remain fully preserved
                            for Samuelson to activate on command.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 500, color: sub.enabled ? '#1C0F07' : '#7C6F64' }}>
                            {sub.enabled ? 'Enabled' : 'Disabled'}
                        </span>
                        <button
                            type="button"
                            onClick={() => {
                                setPendingToggleState(!sub.enabled)
                                setIsToggleModalOpen(true)
                            }}
                            style={{
                                width: '50px',
                                height: '28px',
                                borderRadius: '14px',
                                backgroundColor: sub.enabled ? '#C4975A' : '#D1C9BE',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'background-color 0.2s',
                                padding: 0,
                            }}
                        >
                            <div
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '50%',
                                    backgroundColor: '#FFFFFF',
                                    position: 'absolute',
                                    top: '3px',
                                    left: sub.enabled ? '25px' : '3px',
                                    transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                }}
                            />
                        </button>
                    </div>
                </div>

                {!sub.enabled && (
                    <div
                        style={{
                            marginTop: '20px',
                            backgroundColor: '#FAF7F2',
                            border: '1px dashed #D1C9BE',
                            borderRadius: '8px',
                            padding: '14px 18px',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '12px',
                        }}
                    >
                        <FiAlertTriangle size={18} color="#C4975A" style={{ flexShrink: 0, marginTop: '2px' }} />
                        <div style={{ fontSize: '12px', color: '#7C6F64', lineHeight: 1.5 }}>
                            <strong style={{ color: '#1C0F07' }}>Notice for Samuelson:</strong> The wardrobe club is
                            safely dormant. Clients ordering custom suits and traditional garments continue through the
                            standard 70/30 bespoke deposit workflow. Enable this toggle when launching the private VIP
                            curation club.
                        </div>
                    </div>
                )}
            </div>

            {/* Tiers Grid */}
            <div style={{ marginBottom: '36px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '16px',
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1C0F07' }}>
                            Membership Tiers ({sub.tiers.length})
                        </h2>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                            Configured sartorial tiers with bilingual titles and payment gateway price bindings.
                        </p>
                    </div>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                        gap: '20px',
                    }}
                >
                    {sub.tiers.map((tier) => (
                        <div
                            key={tier.id}
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #EDE8E1',
                                padding: '24px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                position: 'relative',
                                boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                            }}
                        >
                            <div>
                                {/* Tier Status Badges */}
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
                                            padding: '4px 8px',
                                            borderRadius: '6px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            backgroundColor: tier.isVisible ? '#F0EBE1' : '#F5F5F5',
                                            color: tier.isVisible ? '#C4975A' : '#7C6F64',
                                        }}
                                    >
                                        {tier.isVisible ? 'Visible in Club' : 'Hidden / Invite Only'}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#7C6F64', fontWeight: 500 }}>
                                        {tier.activeSubscribers} Active Members
                                    </span>
                                </div>

                                {/* Tier Names */}
                                <h3
                                    style={{
                                        fontSize: '17px',
                                        fontWeight: 700,
                                        margin: '0 0 2px 0',
                                        color: '#1C0F07',
                                    }}
                                >
                                    {tier.nameEN}
                                </h3>
                                <p
                                    style={{
                                        fontSize: '12px',
                                        color: '#7C6F64',
                                        fontStyle: 'italic',
                                        margin: '0 0 16px 0',
                                    }}
                                >
                                    {tier.nameIT}
                                </p>

                                {/* Pricing Banner */}
                                <div
                                    style={{
                                        backgroundColor: '#FAF7F2',
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        marginBottom: '16px',
                                        display: 'flex',
                                        alignItems: 'baseline',
                                        justifyContent: 'space-between',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '20px', fontWeight: 700, color: '#1C0F07' }}>
                                            ₦{tier.priceNGN.toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '12px', color: '#7C6F64', marginLeft: '6px' }}>
                                            / €{tier.priceEUR}
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            color: '#C4975A',
                                            letterSpacing: '0.04em',
                                        }}
                                    >
                                        {tier.billingInterval}
                                    </span>
                                </div>

                                {/* Gateway IDs */}
                                <div
                                    style={{
                                        fontSize: '11px',
                                        color: '#7C6F64',
                                        backgroundColor: '#FAF7F2',
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        marginBottom: '18px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        fontFamily: 'monospace',
                                    }}
                                >
                                    <div>
                                        <span style={{ color: '#1C0F07', fontWeight: 600 }}>Paystack: </span>
                                        {tier.paystackPlanId || 'Not mapped'}
                                    </div>
                                    <div>
                                        <span style={{ color: '#1C0F07', fontWeight: 600 }}>Stripe: </span>
                                        {tier.stripePriceId || 'Not mapped'}
                                    </div>
                                </div>

                                {/* Features List */}
                                <div style={{ marginBottom: '20px' }}>
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            fontWeight: 700,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                            color: '#7C6F64',
                                            marginBottom: '10px',
                                        }}
                                    >
                                        Club Privileges:
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {tier.features.map((feat, idx) => (
                                            <div
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'flex-start',
                                                    gap: '8px',
                                                    fontSize: '12px',
                                                    color: '#1C0F07',
                                                    lineHeight: 1.4,
                                                }}
                                            >
                                                <FiCheck
                                                    size={14}
                                                    color="#C4975A"
                                                    style={{ flexShrink: 0, marginTop: '2px' }}
                                                />
                                                <span>{feat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div
                                style={{
                                    borderTop: '1px solid #EDE8E1',
                                    paddingTop: '16px',
                                    marginTop: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={() => openEditTier(tier)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        backgroundColor: '#FAF7F2',
                                        color: '#1C0F07',
                                        border: '1px solid #EDE8E1',
                                        padding: '7px 14px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <FiEdit2 size={13} color="#C4975A" />
                                    Edit Tier
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleDeleteTier(tier.id)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        backgroundColor: 'transparent',
                                        color: '#D93025',
                                        border: 'none',
                                        padding: '7px 10px',
                                        borderRadius: '6px',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                    }}
                                    title="Delete Tier"
                                >
                                    <FiTrash2 size={13} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Subscription Defaults Card */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EDE8E1',
                    padding: '24px',
                    boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                }}
            >
                <h2 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px 0', color: '#1C0F07' }}>
                    Subscription Rules & Client Lifecycle
                </h2>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px',
                    }}
                >
                    {/* Default Tier */}
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
                            Featured Tier on Storefront
                        </label>
                        <select
                            value={sub.defaults.defaultTierId}
                            onChange={(e) =>
                                handleSave({
                                    ...sub,
                                    defaults: { ...sub.defaults, defaultTierId: e.target.value },
                                })
                            }
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '13px',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        >
                            {sub.tiers.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.nameEN} (₦{t.priceNGN.toLocaleString()} / €{t.priceEUR})
                                </option>
                            ))}
                        </select>
                        <p style={{ fontSize: '11px', color: '#7C6F64', margin: '6px 0 0 0' }}>
                            Highlighted with gold ribbon when wardrobe membership is presented.
                        </p>
                    </div>

                    {/* Trial Period */}
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
                            Free Trial Days
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="30"
                            value={sub.defaults.trialDays}
                            onChange={(e) =>
                                handleSave({
                                    ...sub,
                                    defaults: { ...sub.defaults, trialDays: parseInt(e.target.value) || 0 },
                                })
                            }
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '13px',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        />
                        <p style={{ fontSize: '11px', color: '#7C6F64', margin: '6px 0 0 0' }}>
                            Set to 0 days for bespoke handcrafting (materials allocated upfront).
                        </p>
                    </div>

                    {/* Cancellation Policy */}
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
                            Cancellation Term
                        </label>
                        <select
                            value={sub.defaults.cancellationPolicy}
                            onChange={(e) =>
                                handleSave({
                                    ...sub,
                                    defaults: {
                                        ...sub.defaults,
                                        cancellationPolicy: e.target.value as 'end_of_period' | 'immediate',
                                    },
                                })
                            }
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '13px',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        >
                            <option value="end_of_period">Cancel at end of current billing cycle (Honors scheduled pieces)</option>
                            <option value="immediate">Immediate termination without further production</option>
                        </select>
                        <p style={{ fontSize: '11px', color: '#7C6F64', margin: '6px 0 0 0' }}>
                            Preserves artisan cloth allocation and completes active garments in progress.
                        </p>
                    </div>
                </div>
            </div>

            {/* Toggle Confirmation Modal */}
            {isToggleModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            maxWidth: '480px',
                            width: '100%',
                            padding: '28px',
                            boxShadow: '0 20px 40px rgba(28, 15, 7, 0.15)',
                        }}
                    >
                        <div
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                backgroundColor: pendingToggleState ? '#E6F4EA' : '#FEF3C7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: pendingToggleState ? '#137333' : '#92400E',
                                marginBottom: '16px',
                            }}
                        >
                            <FiRepeat size={22} />
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#1C0F07' }}>
                            {pendingToggleState
                                ? 'Activate Bespoke Wardrobe Club?'
                                : 'Deactivate Wardrobe Club on Storefront?'}
                        </h3>

                        <p style={{ fontSize: '13px', color: '#7C6F64', lineHeight: 1.5, margin: '0 0 24px 0' }}>
                            {pendingToggleState
                                ? 'Enabling this will display the recurring wardrobe membership club on the public storefront navigation and allow clients to enroll via Paystack and Stripe recurring billing.'
                                : 'Disabling this will hide the wardrobe club from the public navigation. Existing memberships (if any) will remain untouched.'}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsToggleModalOpen(false)
                                    setPendingToggleState(null)
                                }}
                                style={{
                                    padding: '9px 18px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#7C6F64',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmToggleFeature}
                                style={{
                                    padding: '9px 18px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: pendingToggleState ? '#137333' : '#C4975A',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                {pendingToggleState ? 'Yes, Activate Club' : 'Yes, Put into Dormant State'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit / Create Tier Modal */}
            {editingTier && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            maxWidth: '620px',
                            width: '100%',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            padding: '28px',
                            boxShadow: '0 20px 40px rgba(28, 15, 7, 0.15)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '20px',
                            }}
                        >
                            <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1C0F07' }}>
                                {isNewTier ? 'Create New Wardrobe Tier' : `Edit Tier: ${editingTier.nameEN}`}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingTier(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#7C6F64',
                                    padding: '4px',
                                }}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Names */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                                        Tier Title (English)
                                    </label>
                                    <input
                                        type="text"
                                        value={editingTier.nameEN}
                                        onChange={(e) => setEditingTier({ ...editingTier, nameEN: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            color: '#1C0F07',
                                            outline: 'none',
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
                                        Tier Title (Italian)
                                    </label>
                                    <input
                                        type="text"
                                        value={editingTier.nameIT}
                                        onChange={(e) => setEditingTier({ ...editingTier, nameIT: e.target.value })}
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            color: '#1C0F07',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Prices and Interval */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
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
                                        Price (NGN ₦)
                                    </label>
                                    <input
                                        type="number"
                                        value={editingTier.priceNGN}
                                        onChange={(e) =>
                                            setEditingTier({
                                                ...editingTier,
                                                priceNGN: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            color: '#1C0F07',
                                            outline: 'none',
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
                                        Price (EUR €)
                                    </label>
                                    <input
                                        type="number"
                                        value={editingTier.priceEUR}
                                        onChange={(e) =>
                                            setEditingTier({
                                                ...editingTier,
                                                priceEUR: parseInt(e.target.value) || 0,
                                            })
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            color: '#1C0F07',
                                            outline: 'none',
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
                                        Cadence
                                    </label>
                                    <select
                                        value={editingTier.billingInterval}
                                        onChange={(e) =>
                                            setEditingTier({
                                                ...editingTier,
                                                billingInterval: e.target.value as any,
                                            })
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            color: '#1C0F07',
                                            outline: 'none',
                                        }}
                                    >
                                        <option value="monthly">Monthly</option>
                                        <option value="quarterly">Quarterly</option>
                                        <option value="biannual">Biannual</option>
                                        <option value="annual">Annual</option>
                                    </select>
                                </div>
                            </div>

                            {/* Gateway Plan IDs */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                                        Paystack Plan ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="PLN_xxxxxxxxx"
                                        value={editingTier.paystackPlanId}
                                        onChange={(e) =>
                                            setEditingTier({ ...editingTier, paystackPlanId: e.target.value })
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            fontFamily: 'monospace',
                                            color: '#1C0F07',
                                            outline: 'none',
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
                                        Stripe Price ID
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="price_xxxxxxxxx"
                                        value={editingTier.stripePriceId}
                                        onChange={(e) =>
                                            setEditingTier({ ...editingTier, stripePriceId: e.target.value })
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '9px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            fontFamily: 'monospace',
                                            color: '#1C0F07',
                                            outline: 'none',
                                        }}
                                    />
                                </div>
                            </div>

                            {/* Visibility switch */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    id="tierVisible"
                                    checked={editingTier.isVisible}
                                    onChange={(e) =>
                                        setEditingTier({ ...editingTier, isVisible: e.target.checked })
                                    }
                                    style={{ cursor: 'pointer' }}
                                />
                                <label
                                    htmlFor="tierVisible"
                                    style={{ fontSize: '13px', color: '#1C0F07', cursor: 'pointer' }}
                                >
                                    Make tier visible to storefront customers when club is active
                                </label>
                            </div>

                            {/* Features list editor */}
                            <div>
                                <label
                                    style={{
                                        display: 'block',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        color: '#1C0F07',
                                        marginBottom: '6px',
                                    }}
                                >
                                    Club Privileges & Features
                                </label>
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                        marginBottom: '10px',
                                    }}
                                >
                                    {editingTier.features.map((f, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                backgroundColor: '#FAF7F2',
                                                padding: '6px 10px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                            }}
                                        >
                                            <span style={{ color: '#1C0F07' }}>• {f}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeatureFromModal(idx)}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    cursor: 'pointer',
                                                    color: '#D93025',
                                                    padding: '2px',
                                                }}
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="Add a sartorial privilege (e.g. 1 suit per quarter)..."
                                        value={newFeatureText}
                                        onChange={(e) => setNewFeatureText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddFeatureToModal()
                                            }
                                        }}
                                        style={{
                                            flex: 1,
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '12px',
                                            outline: 'none',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddFeatureToModal}
                                        style={{
                                            padding: '8px 14px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            backgroundColor: '#C4975A',
                                            color: '#FFFFFF',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                gap: '12px',
                                marginTop: '24px',
                                paddingTop: '16px',
                                borderTop: '1px solid #EDE8E1',
                            }}
                        >
                            <button
                                type="button"
                                onClick={() => setEditingTier(null)}
                                style={{
                                    padding: '9px 18px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#7C6F64',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveTierModal}
                                style={{
                                    padding: '9px 18px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#C4975A',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                <FiSave size={14} />
                                {isNewTier ? 'Create Tier' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
