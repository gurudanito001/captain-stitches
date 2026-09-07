'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    ReferralItem,
    ReferralRewardType,
    ReferralProgrammeConfig,
    getAllReferrals,
    getProgrammeConfig,
    saveProgrammeConfig,
    markRewardRedeemed,
    issueRewardManually,
} from '@/data/adminReferralsData'

export default function AdminReferralRewardsPage() {
    const [referrals, setReferrals] = useState<ReferralItem[]>([])
    const [config, setConfig] = useState<ReferralProgrammeConfig>(getProgrammeConfig())
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Manual reward issuance form
    const [manualForm, setManualForm] = useState<{
        customerId: string
        customerName: string
        rewardType: ReferralRewardType
        rewardValue: string
        reason: string
    }>({
        customerId: 'cust-1',
        customerName: 'Adewale Okafor',
        rewardType: 'discount',
        rewardValue: '15% Off Next Commission',
        reason: '',
    })

    // Mark redeemed modal
    const [redeemModal, setRedeemModal] = useState<{
        isOpen: boolean
        referralId: string
        target: 'referrer' | 'referred'
        customerName: string
        rewardValue: string
        orderAppliedNumber: string
    }>({
        isOpen: false,
        referralId: '',
        target: 'referrer',
        customerName: '',
        rewardValue: '',
        orderAppliedNumber: '',
    })

    useEffect(() => {
        setReferrals(getAllReferrals())
        setConfig(getProgrammeConfig())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const handleSaveConfig = (e: React.FormEvent) => {
        e.preventDefault()
        saveProgrammeConfig(config)
        showToast('Referral programme configuration saved successfully!')
    }

    // Pending Rewards: all rewards with status 'credited'
    const pendingRewards = useMemo(() => {
        const list: Array<{
            referralId: string
            target: 'referrer' | 'referred'
            customerName: string
            customerId: string
            rewardType: string
            rewardValue: string
            dateCredited: string
            daysSinceCredited: number
            triggerOrder?: string
            triggerOrderId?: string
        }> = []

        referrals.forEach((r) => {
            if (r.referrerReward.status === 'credited') {
                list.push({
                    referralId: r.id,
                    target: 'referrer',
                    customerName: r.referrer.name,
                    customerId: r.referrer.id,
                    rewardType: r.referrerReward.typeLabel,
                    rewardValue: r.referrerReward.value,
                    dateCredited: r.referrerReward.dateCredited || 'Recent',
                    daysSinceCredited: r.referrerReward.daysSinceCredited || 5,
                    triggerOrder: r.linkedOrder?.orderNumber,
                    triggerOrderId: r.linkedOrder?.id,
                })
            }
            if (r.referredCustomerReward.status === 'credited') {
                list.push({
                    referralId: r.id,
                    target: 'referred',
                    customerName: r.referredCustomer.name,
                    customerId: r.referredCustomer.id,
                    rewardType: r.referredCustomerReward.typeLabel,
                    rewardValue: r.referredCustomerReward.value,
                    dateCredited: r.referredCustomerReward.dateCredited || 'Recent',
                    daysSinceCredited: r.referredCustomerReward.daysSinceCredited || 3,
                    triggerOrder: r.linkedOrder?.orderNumber,
                    triggerOrderId: r.linkedOrder?.id,
                })
            }
        })
        return list
    }, [referrals])

    // Redeemed Rewards History
    const redeemedRewards = useMemo(() => {
        const list: Array<{
            customerName: string
            rewardType: string
            rewardValue: string
            dateCredited: string
            dateRedeemed: string
            orderApplied: string
        }> = []

        referrals.forEach((r) => {
            if (r.referrerReward.status === 'redeemed') {
                list.push({
                    customerName: r.referrer.name,
                    rewardType: r.referrerReward.typeLabel,
                    rewardValue: r.referrerReward.value,
                    dateCredited: r.referrerReward.dateCredited || 'May 06, 2026',
                    dateRedeemed: r.referrerReward.dateRedeemed || 'May 28, 2026',
                    orderApplied: r.referrerReward.orderAppliedNumber || 'CS-2026-010',
                })
            }
            if (r.referredCustomerReward.status === 'redeemed') {
                list.push({
                    customerName: r.referredCustomer.name,
                    rewardType: r.referredCustomerReward.typeLabel,
                    rewardValue: r.referredCustomerReward.value,
                    dateCredited: r.referredCustomerReward.dateCredited || 'May 05, 2026',
                    dateRedeemed: r.referredCustomerReward.dateRedeemed || 'May 05, 2026',
                    orderApplied: r.referredCustomerReward.orderAppliedNumber || 'CS-2026-002',
                })
            }
        })
        return list
    }, [referrals])

    const handleConfirmRedeem = () => {
        if (!redeemModal.orderAppliedNumber.trim()) {
            alert('Please specify the order number where this reward was applied.')
            return
        }
        const updated = markRewardRedeemed(
            redeemModal.referralId,
            redeemModal.target,
            redeemModal.orderAppliedNumber.trim()
        )
        setReferrals(updated)
        setRedeemModal({
            isOpen: false,
            referralId: '',
            target: 'referrer',
            customerName: '',
            rewardValue: '',
            orderAppliedNumber: '',
        })
        showToast('Reward marked as Redeemed.')
    }

    const handleManualSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!manualForm.reason.trim()) {
            alert('Please provide a reason for issuing this reward.')
            return
        }

        const updated = issueRewardManually(
            manualForm.customerId,
            manualForm.customerName,
            manualForm.rewardType,
            manualForm.rewardValue,
            manualForm.reason.trim()
        )
        setReferrals(updated)
        setManualForm((prev) => ({ ...prev, reason: '' }))
        showToast(`Manual reward granted to ${manualForm.customerName}!`)
    }

    const handleExportCSV = () => {
        const headers = ['Customer Name', 'Reward Type', 'Reward Value', 'Date Credited', 'Date Redeemed', 'Order Applied']
        const rows = redeemedRewards.map((r) => [
            `"${r.customerName}"`,
            `"${r.rewardType}"`,
            `"${r.rewardValue}"`,
            `"${r.dateCredited}"`,
            `"${r.dateRedeemed}"`,
            `"${r.orderApplied}"`,
        ])
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', 'captainstitches_redeemed_rewards.csv')
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        showToast('Redeemed rewards archive downloaded (.csv)')
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
                        Reward Management & Obligations
                    </h1>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9375rem', color: '#6B7280' }}>
                        Configure default kickback benefits, manage pending redemptions, and issue manual VIP perks.
                    </p>
                </div>

                <Link
                    href="/admin/referrals/settings"
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
                    ⚙ Programme Rules & Expiry →
                </Link>
            </div>

            {/* 1. Programme Configuration Card */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '16px',
                    padding: '28px 32px',
                    marginBottom: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
            >
                <div style={{ marginBottom: '22px' }}>
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Automatic Kickback Programme Configuration
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                        Define what rewards are credited automatically when a referred patron places their qualifying order.
                    </p>
                </div>

                <form onSubmit={handleSaveConfig}>
                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                            gap: '28px',
                            marginBottom: '24px',
                        }}
                    >
                        {/* Referrer Reward Configuration */}
                        <div
                            style={{
                                background: '#FAF7F2',
                                border: '1px solid #EDE8E1',
                                borderRadius: '12px',
                                padding: '20px 22px',
                            }}
                        >
                            <h3 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                                Advocate / Referrer Reward
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                        Reward Type
                                    </label>
                                    <select
                                        value={config.referrerReward.type}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                referrerReward: {
                                                    ...prev.referrerReward,
                                                    type: e.target.value as ReferralRewardType,
                                                },
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            padding: '0 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            background: '#FFFFFF',
                                            outline: 'none',
                                        }}
                                    >
                                        <option value="discount">Percentage Discount (e.g. 10%)</option>
                                        <option value="free_item">Free Accessory / Item</option>
                                        <option value="priority_slot">Priority Production Slot (Express)</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                        Reward Value Description
                                    </label>
                                    <input
                                        type="text"
                                        value={config.referrerReward.value}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                referrerReward: {
                                                    ...prev.referrerReward,
                                                    value: e.target.value,
                                                },
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            padding: '0 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            background: '#FFFFFF',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                            Min Order (₦ NGN)
                                        </label>
                                        <input
                                            type="number"
                                            value={config.referrerReward.minOrderValueNGN}
                                            onChange={(e) =>
                                                setConfig((prev) => ({
                                                    ...prev,
                                                    referrerReward: {
                                                        ...prev.referrerReward,
                                                        minOrderValueNGN: parseInt(e.target.value, 10) || 0,
                                                    },
                                                }))
                                            }
                                            style={{
                                                width: '100%',
                                                height: '38px',
                                                padding: '0 10px',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '0.8125rem',
                                                background: '#FFFFFF',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                            Min Order (€ EUR)
                                        </label>
                                        <input
                                            type="number"
                                            value={config.referrerReward.minOrderValueEUR}
                                            onChange={(e) =>
                                                setConfig((prev) => ({
                                                    ...prev,
                                                    referrerReward: {
                                                        ...prev.referrerReward,
                                                        minOrderValueEUR: parseInt(e.target.value, 10) || 0,
                                                    },
                                                }))
                                            }
                                            style={{
                                                width: '100%',
                                                height: '38px',
                                                padding: '0 10px',
                                                border: '1px solid #D1D5DB',
                                                borderRadius: '6px',
                                                fontSize: '0.8125rem',
                                                background: '#FFFFFF',
                                                outline: 'none',
                                                boxSizing: 'border-box',
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Referred Customer Reward Configuration */}
                        <div
                            style={{
                                background: '#FAF7F2',
                                border: '1px solid #EDE8E1',
                                borderRadius: '12px',
                                padding: '20px 22px',
                            }}
                        >
                            <h3 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                                New Patron (Referred Friend) Welcome Benefit
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                        Reward Type
                                    </label>
                                    <select
                                        value={config.referredCustomerReward.type}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                referredCustomerReward: {
                                                    ...prev.referredCustomerReward,
                                                    type: e.target.value as ReferralRewardType,
                                                },
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            padding: '0 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            background: '#FFFFFF',
                                            outline: 'none',
                                        }}
                                    >
                                        <option value="discount">Welcome Credit / Discount</option>
                                        <option value="free_item">Complimentary Accessory</option>
                                        <option value="priority_slot">Priority Production Slot</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                        Welcome Value Description
                                    </label>
                                    <input
                                        type="text"
                                        value={config.referredCustomerReward.value}
                                        onChange={(e) =>
                                            setConfig((prev) => ({
                                                ...prev,
                                                referredCustomerReward: {
                                                    ...prev.referredCustomerReward,
                                                    value: e.target.value,
                                                },
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            padding: '0 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            background: '#FFFFFF',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>

                                <div style={{ paddingTop: '8px' }}>
                                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.45 }}>
                                        Applied automatically at checkout or deducted by Samuelson when confirming the bespoke quotation.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #EDE8E1', paddingTop: '18px' }}>
                        <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280' }}>
                            <strong>Note:</strong> Configuration adjustments will apply to new referrals generated henceforth. Previously credited rewards remain unaltered.
                        </p>
                        <button
                            type="submit"
                            style={{
                                background: '#1C0F07',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 22px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Save Programme Configuration
                        </button>
                    </div>
                </form>
            </div>

            {/* 2. Pending Rewards Table */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    marginBottom: '32px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Outstanding Credited Rewards
                            </h2>
                            <span
                                style={{
                                    background: '#FEF3C7',
                                    color: '#B45309',
                                    padding: '2px 8px',
                                    borderRadius: '9999px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                }}
                            >
                                {pendingRewards.length} Unredeemed
                            </span>
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                            All rewards with status "Credited" awaiting application to an upcoming bespoke commission.
                        </p>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Customer
                                </th>
                                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Benefit Type
                                </th>
                                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Reward Value
                                </th>
                                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Date Credited
                                </th>
                                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Trigger Order
                                </th>
                                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Age
                                </th>
                                <th style={{ padding: '12px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingRewards.length === 0 ? (
                                <tr>
                                    <td colSpan={7} style={{ padding: '30px', textAlign: 'center', color: '#6B7280' }}>
                                        No outstanding unredeemed rewards in the atelier ledger.
                                    </td>
                                </tr>
                            ) : (
                                pendingRewards.map((item, idx) => {
                                    const isStale = item.daysSinceCredited > 30

                                    return (
                                        <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            <td style={{ padding: '14px' }}>
                                                <Link
                                                    href={`/admin/customers/${item.customerId}`}
                                                    style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', textDecoration: 'none' }}
                                                >
                                                    {item.customerName}
                                                </Link>
                                            </td>
                                            <td style={{ padding: '14px', fontSize: '0.8125rem', color: '#4B5563' }}>
                                                {item.rewardType}
                                            </td>
                                            <td style={{ padding: '14px', fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07' }}>
                                                {item.rewardValue}
                                            </td>
                                            <td style={{ padding: '14px', fontSize: '0.8125rem', color: '#6B7280' }}>
                                                {item.dateCredited}
                                            </td>
                                            <td style={{ padding: '14px' }}>
                                                {item.triggerOrder ? (
                                                    <Link
                                                        href={`/admin/orders/${item.triggerOrderId || 'ord-1'}`}
                                                        style={{ fontSize: '0.8125rem', color: '#C4975A', fontWeight: 600, textDecoration: 'none' }}
                                                    >
                                                        {item.triggerOrder} ↗
                                                    </Link>
                                                ) : (
                                                    <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>Direct Grant</span>
                                                )}
                                            </td>
                                            <td style={{ padding: '14px' }}>
                                                <span
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        background: isStale ? '#FEE2E2' : '#F3F4F6',
                                                        color: isStale ? '#B91C1C' : '#4B5563',
                                                    }}
                                                >
                                                    {item.daysSinceCredited} days {isStale && '⚠️ (>30d)'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '14px', textAlign: 'right' }}>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRedeemModal({
                                                            isOpen: true,
                                                            referralId: item.referralId,
                                                            target: item.target,
                                                            customerName: item.customerName,
                                                            rewardValue: item.rewardValue,
                                                            orderAppliedNumber: '',
                                                        })
                                                    }
                                                    style={{
                                                        background: '#15803D',
                                                        color: '#FFFFFF',
                                                        border: 'none',
                                                        borderRadius: '6px',
                                                        padding: '6px 14px',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    Mark as Redeemed
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 3. Redeemed Rewards History & Manual Issuance Split */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
                    gap: '28px',
                    alignItems: 'start',
                }}
            >
                {/* Redeemed History */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '16px',
                        padding: '24px 28px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                        <div>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Redeemed Rewards Archive
                            </h2>
                            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                                Historical log of rewards already fulfilled and deducted from orders.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleExportCSV}
                            style={{
                                background: '#FAF7F2',
                                color: '#1C0F07',
                                border: '1px solid #EDE8E1',
                                borderRadius: '8px',
                                padding: '6px 14px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            📥 Export CSV
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Patron
                                    </th>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Benefit
                                    </th>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Redeemed On
                                    </th>
                                    <th style={{ padding: '10px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Applied Order
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {redeemedRewards.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                        <td style={{ padding: '12px', fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07' }}>
                                            {item.customerName}
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '0.8125rem', color: '#4B5563' }}>
                                            {item.rewardValue}
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '0.8125rem', color: '#6B7280' }}>
                                            {item.dateRedeemed}
                                        </td>
                                        <td style={{ padding: '12px', fontSize: '0.8125rem', fontWeight: 600, color: '#C4975A' }}>
                                            {item.orderApplied}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Manual Issuance Form Card */}
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '16px',
                        padding: '24px 28px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 6px' }}>
                        Issue Bespoke Discretionary Reward
                    </h2>
                    <p style={{ margin: '0 0 20px', fontSize: '0.8125rem', color: '#6B7280' }}>
                        Award perks for offline ambassador referrals, fitting goodwill, or VIP campaigns.
                    </p>

                    <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Select Customer
                            </label>
                            <select
                                value={manualForm.customerId}
                                onChange={(e) => {
                                    const cId = e.target.value
                                    const cName =
                                        cId === 'cust-1'
                                            ? 'Adewale Okafor'
                                            : cId === 'cust-2'
                                              ? 'Chidi Okeke'
                                              : cId === 'cust-3'
                                                ? 'Kunle Adeleke'
                                                : 'Chioma Eze'
                                    setManualForm((prev) => ({
                                        ...prev,
                                        customerId: cId,
                                        customerName: cName,
                                    }))
                                }}
                                style={{
                                    width: '100%',
                                    height: '38px',
                                    padding: '0 10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }}
                            >
                                <option value="cust-1">Adewale Okafor (Milano, Italy)</option>
                                <option value="cust-2">Chidi Okeke (Rome, Italy)</option>
                                <option value="cust-3">Kunle Adeleke (Turin, Italy)</option>
                                <option value="cust-4">Chioma Eze (Lagos, Nigeria)</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Reward Category
                            </label>
                            <select
                                value={manualForm.rewardType}
                                onChange={(e) =>
                                    setManualForm((prev) => ({
                                        ...prev,
                                        rewardType: e.target.value as ReferralRewardType,
                                    }))
                                }
                                style={{
                                    width: '100%',
                                    height: '38px',
                                    padding: '0 10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                }}
                            >
                                <option value="discount">Percentage / Cash Voucher</option>
                                <option value="free_item">Free Accessory / Garment</option>
                                <option value="priority_slot">Priority Production Slot</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Value / Title
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. €25 Off Next Order"
                                value={manualForm.rewardValue}
                                onChange={(e) =>
                                    setManualForm((prev) => ({ ...prev, rewardValue: e.target.value }))
                                }
                                style={{
                                    width: '100%',
                                    height: '38px',
                                    padding: '0 10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Reason & Atelier Record
                            </label>
                            <textarea
                                rows={3}
                                placeholder="State context (e.g. Referred 2 Milan clients directly via phone)..."
                                value={manualForm.reason}
                                onChange={(e) =>
                                    setManualForm((prev) => ({ ...prev, reason: e.target.value }))
                                }
                                style={{
                                    width: '100%',
                                    padding: '8px 10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            style={{
                                background: '#C4975A',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                marginTop: '6px',
                            }}
                        >
                            Award Discretionary Reward
                        </button>
                    </form>
                </div>
            </div>

            {/* Mark Reward Redeemed Modal */}
            {redeemModal.isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '480px',
                            padding: '28px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>
                            Mark Reward as Redeemed
                        </h3>
                        <p style={{ margin: '0 0 18px', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.5 }}>
                            Applying <strong>{redeemModal.rewardValue}</strong> for <strong>{redeemModal.customerName}</strong>.
                            Enter the order number this reward was applied toward.
                        </p>

                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Order Number
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. CS-2026-025"
                            value={redeemModal.orderAppliedNumber}
                            onChange={(e) =>
                                setRedeemModal((prev) => ({ ...prev, orderAppliedNumber: e.target.value }))
                            }
                            style={{
                                width: '100%',
                                height: '42px',
                                padding: '0 14px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                boxSizing: 'border-box',
                                marginBottom: '24px',
                                outline: 'none',
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setRedeemModal((prev) => ({ ...prev, isOpen: false }))}
                                style={{
                                    background: '#F3F4F6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 18px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#4B5563',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmRedeem}
                                style={{
                                    background: '#15803D',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                Confirm Redemption
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
