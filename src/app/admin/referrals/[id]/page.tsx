'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
    ReferralItem,
    getReferralById,
    markRewardRedeemed,
    issueRewardManually,
    ReferralRewardType,
} from '@/data/adminReferralsData'

export default function AdminReferralDetailPage() {
    const params = useParams()
    const refId = params.id as string

    const [referral, setReferral] = useState<ReferralItem | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [copied, setCopied] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Modal state for Mark Redeemed
    const [redeemModal, setRedeemModal] = useState<{
        isOpen: boolean
        target: 'referrer' | 'referred'
        customerName: string
        rewardValue: string
        orderAppliedNumber: string
    }>({
        isOpen: false,
        target: 'referrer',
        customerName: '',
        rewardValue: '',
        orderAppliedNumber: '',
    })

    // Modal state for Manual Reward Issuance
    const [manualModal, setManualModal] = useState<{
        isOpen: boolean
        customerId: string
        customerName: string
        rewardType: ReferralRewardType
        rewardValue: string
        reason: string
    }>({
        isOpen: false,
        customerId: '',
        customerName: '',
        rewardType: 'discount',
        rewardValue: '€20 / ₦20,000 Credit',
        reason: '',
    })

    useEffect(() => {
        if (!refId) return
        const found = getReferralById(refId)
        if (found) {
            setReferral(found)
        }
        setIsLoading(false)
    }, [refId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const handleCopyUrl = (url: string) => {
        navigator.clipboard.writeText(url)
        setCopied(true)
        showToast('Referral link copied to clipboard!')
        setTimeout(() => setCopied(false), 2000)
    }

    const handleConfirmRedeem = () => {
        if (!referral) return
        if (!redeemModal.orderAppliedNumber.trim()) {
            alert('Please specify the order number where this reward was applied.')
            return
        }

        const updated = markRewardRedeemed(
            referral.id,
            redeemModal.target,
            redeemModal.orderAppliedNumber.trim()
        )
        const current = updated.find((r) => r.id === referral.id)
        if (current) setReferral(current)

        setRedeemModal({
            isOpen: false,
            target: 'referrer',
            customerName: '',
            rewardValue: '',
            orderAppliedNumber: '',
        })
        showToast('Reward marked as Redeemed and recorded in timeline.')
    }

    const handleConfirmManualIssue = () => {
        if (!referral) return
        if (!manualModal.reason.trim()) {
            alert('Please provide a reason or note for issuing this manual reward.')
            return
        }

        issueRewardManually(
            manualModal.customerId,
            manualModal.customerName,
            manualModal.rewardType,
            manualModal.rewardValue,
            manualModal.reason.trim()
        )
        setManualModal({
            isOpen: false,
            customerId: '',
            customerName: '',
            rewardType: 'discount',
            rewardValue: '€20 / ₦20,000 Credit',
            reason: '',
        })
        showToast('Custom reward issued and recorded in system.')
    }

    if (isLoading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
                Loading referral details...
            </div>
        )
    }

    if (!referral) {
        return (
            <div style={{ padding: '60px 40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 10px' }}>
                    Referral Record Not Found
                </h2>
                <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginBottom: '24px' }}>
                    The requested referral record could not be found.
                </p>
                <Link
                    href="/admin/referrals/list"
                    style={{
                        display: 'inline-block',
                        background: '#C4975A',
                        color: '#FFFFFF',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    ← Back to All Referrals
                </Link>
            </div>
        )
    }

    const isPaid = referral.conversionStatus === 'paid'
    const isOrdered = referral.conversionStatus === 'ordered'

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
                    href="/admin/referrals/list"
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
                    ← Back to Referrals List
                </Link>
            </div>

            {/* Header Summary Card */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    marginBottom: '32px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                letterSpacing: '-0.02em',
                                margin: 0,
                            }}
                        >
                            Referral {referral.token}
                        </h1>
                        <span
                            style={{
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                background: isPaid ? '#DCFCE7' : isOrdered ? '#FEF3C7' : '#F3F4F6',
                                color: isPaid ? '#15803D' : isOrdered ? '#B45309' : '#4B5563',
                            }}
                        >
                            {isPaid ? '● Converted & Paid' : isOrdered ? '● Order Placed' : '● Link Visited'}
                        </span>
                    </div>
                    <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
                        Created on {referral.dateCreated} · Token: <code style={{ fontFamily: 'monospace', fontWeight: 700 }}>{referral.token}</code>
                    </p>
                </div>

                {/* Top Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={() =>
                            setManualModal({
                                isOpen: true,
                                customerId: referral.referrer.id,
                                customerName: referral.referrer.name,
                                rewardType: 'discount',
                                rewardValue: '€20 Voucher',
                                reason: '',
                            })
                        }
                        style={{
                            background: '#FFFFFF',
                            color: '#1C0F07',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            padding: '9px 16px',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        + Issue Manual Reward
                    </button>
                </div>
            </div>

            {/* 2-Column Split: Referral Dossiers & Timeline */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr)',
                    gap: '28px',
                    alignItems: 'start',
                }}
            >
                {/* Left Column: Referrer, Referred Friend, and Linked Order */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {/* Referrer Section */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                1. The Referrer (Advocate)
                            </h2>
                            <Link
                                href={`/admin/customers/${referral.referrer.id}`}
                                style={{ fontSize: '0.8125rem', color: '#C4975A', fontWeight: 600, textDecoration: 'none' }}
                            >
                                Customer Dossier ↗
                            </Link>
                        </div>

                        {/* Customer Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                            <div
                                style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    background: referral.referrer.avatarColor,
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                {referral.referrer.initials}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {referral.referrer.name}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                    {referral.referrer.location === 'Italy' ? '🇮🇹 Italy Patron' : '🇳🇬 Nigeria Patron'} · {referral.referrer.totalSent} referrals sent ({referral.referrer.totalConverted} converted)
                                </span>
                            </div>
                        </div>

                        {/* Share URL Box */}
                        <div
                            style={{
                                background: '#FAF7F2',
                                borderRadius: '10px',
                                padding: '12px 16px',
                                marginBottom: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '10px',
                            }}
                        >
                            <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: '#4B5563', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {referral.url}
                            </span>
                            <button
                                type="button"
                                onClick={() => handleCopyUrl(referral.url)}
                                style={{
                                    background: copied ? '#15803D' : '#1C0F07',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '6px 12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    flexShrink: 0,
                                }}
                            >
                                {copied ? '✓ Copied' : 'Copy Link'}
                            </button>
                        </div>

                        {/* Referrer Reward Status Card */}
                        <div
                            style={{
                                border: '1px solid #EDE8E1',
                                borderRadius: '12px',
                                padding: '18px 20px',
                                background: '#FFFFFF',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Referrer Reward Benefit
                                </span>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background:
                                            referral.referrerReward.status === 'redeemed'
                                                ? '#F3F4F6'
                                                : referral.referrerReward.status === 'credited'
                                                  ? '#DCFCE7'
                                                  : '#FEF3C7',
                                        color:
                                            referral.referrerReward.status === 'redeemed'
                                                ? '#6B7280'
                                                : referral.referrerReward.status === 'credited'
                                                  ? '#15803D'
                                                  : '#B45309',
                                    }}
                                >
                                    {referral.referrerReward.status.toUpperCase()}
                                </span>
                            </div>

                            <p style={{ margin: '0 0 10px', fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07' }}>
                                {referral.referrerReward.value} ({referral.referrerReward.typeLabel})
                            </p>

                            <div style={{ fontSize: '0.8125rem', color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span>
                                    <strong>Date Credited:</strong> {referral.referrerReward.dateCredited || 'Pending order payment'}
                                </span>
                                {referral.referrerReward.dateRedeemed && (
                                    <span>
                                        <strong>Date Redeemed:</strong> {referral.referrerReward.dateRedeemed} on order {referral.referrerReward.orderAppliedNumber}
                                    </span>
                                )}
                            </div>

                            {referral.referrerReward.status === 'credited' && (
                                <div style={{ marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRedeemModal({
                                                isOpen: true,
                                                target: 'referrer',
                                                customerName: referral.referrer.name,
                                                rewardValue: referral.referrerReward.value,
                                                orderAppliedNumber: '',
                                            })
                                        }
                                        style={{
                                            background: '#15803D',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 16px',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ✓ Mark as Redeemed
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Referred Customer Section */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                2. The Referred Friend
                            </h2>
                            <Link
                                href={`/admin/customers/${referral.referredCustomer.id}`}
                                style={{ fontSize: '0.8125rem', color: '#C4975A', fontWeight: 600, textDecoration: 'none' }}
                            >
                                Customer Dossier ↗
                            </Link>
                        </div>

                        {/* Customer Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                            <div
                                style={{
                                    width: '46px',
                                    height: '46px',
                                    borderRadius: '50%',
                                    background: referral.referredCustomer.avatarColor,
                                    color: '#FFFFFF',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                {referral.referredCustomer.initials}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {referral.referredCustomer.name}
                                </p>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                    {referral.referredCustomer.location === 'Italy' ? '🇮🇹 Italy Patron' : '🇳🇬 Nigeria Patron'} · First visited {referral.dateVisited}
                                </span>
                            </div>
                        </div>

                        {/* Referred Customer Reward Card */}
                        <div
                            style={{
                                border: '1px solid #EDE8E1',
                                borderRadius: '12px',
                                padding: '18px 20px',
                                background: '#FFFFFF',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase' }}>
                                    Referred Friend Welcome Benefit
                                </span>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        background:
                                            referral.referredCustomerReward.status === 'redeemed'
                                                ? '#F3F4F6'
                                                : referral.referredCustomerReward.status === 'credited'
                                                  ? '#DCFCE7'
                                                  : '#FEF3C7',
                                        color:
                                            referral.referredCustomerReward.status === 'redeemed'
                                                ? '#6B7280'
                                                : referral.referredCustomerReward.status === 'credited'
                                                  ? '#15803D'
                                                  : '#B45309',
                                    }}
                                >
                                    {referral.referredCustomerReward.status.toUpperCase()}
                                </span>
                            </div>

                            <p style={{ margin: '0 0 10px', fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07' }}>
                                {referral.referredCustomerReward.value} ({referral.referredCustomerReward.typeLabel})
                            </p>

                            <div style={{ fontSize: '0.8125rem', color: '#6B7280', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <span>
                                    <strong>Status:</strong> {referral.referredCustomerReward.status === 'redeemed' ? `Applied to order ${referral.referredCustomerReward.orderAppliedNumber}` : 'Credited / Available'}
                                </span>
                            </div>

                            {referral.referredCustomerReward.status === 'credited' && (
                                <div style={{ marginTop: '16px' }}>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setRedeemModal({
                                                isOpen: true,
                                                target: 'referred',
                                                customerName: referral.referredCustomer.name,
                                                rewardValue: referral.referredCustomerReward.value,
                                                orderAppliedNumber: '',
                                            })
                                        }
                                        style={{
                                            background: '#15803D',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '8px 16px',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        ✓ Mark as Redeemed
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Linked Order Section */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 16px' }}>
                            3. Qualifying Bespoke Order
                        </h2>

                        {referral.linkedOrder ? (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '1.0625rem', fontWeight: 700, color: '#1C0F07' }}>
                                            {referral.linkedOrder.garmentName}
                                        </p>
                                        <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                                            Commissioned on {referral.linkedOrder.datePlaced}
                                        </span>
                                    </div>
                                    <Link
                                        href={`/admin/orders/${referral.linkedOrder.id}`}
                                        style={{
                                            fontSize: '0.875rem',
                                            fontWeight: 700,
                                            color: '#C4975A',
                                            textDecoration: 'none',
                                        }}
                                    >
                                        {referral.linkedOrder.orderNumber} ↗
                                    </Link>
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '12px',
                                        background: '#FAF7F2',
                                        padding: '14px 18px',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Order Value</span>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                                            ₦{referral.linkedOrder.amountNGN.toLocaleString()} / €{referral.linkedOrder.amountEUR}
                                        </p>
                                    </div>
                                    <div>
                                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Payment Status</span>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', fontWeight: 700, color: '#15803D' }}>
                                            ✓ {referral.linkedOrder.paymentStatus}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '24px 10px', color: '#6B7280' }}>
                                <p style={{ margin: '0 0 4px', fontSize: '0.9375rem', fontWeight: 600 }}>
                                    No order placed yet
                                </p>
                                <span style={{ fontSize: '0.8125rem' }}>
                                    Patron visited via referral link on {referral.dateVisited}. Follow up via WhatsApp.
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Complete Lifecycle Timeline */}
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
                        Referral Lifecycle Timeline
                    </h2>
                    <p style={{ margin: '0 0 24px', fontSize: '0.8125rem', color: '#6B7280' }}>
                        Chronological audit log of all events and automated kickback triggers.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                        {referral.timeline.map((item, idx) => (
                            <div key={item.id} style={{ display: 'flex', gap: '14px', position: 'relative' }}>
                                {/* Timeline Dot & Line */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <div
                                        style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            background: '#C4975A',
                                            marginTop: '4px',
                                            flexShrink: 0,
                                        }}
                                    />
                                    {idx < referral.timeline.length - 1 && (
                                        <div
                                            style={{
                                                width: '2px',
                                                flex: 1,
                                                background: '#EDE8E1',
                                                margin: '4px 0',
                                            }}
                                        />
                                    )}
                                </div>

                                <div style={{ flex: 1, paddingBottom: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07' }}>
                                            {item.event}
                                        </p>
                                        <span style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>
                                            {item.date} · {item.time}
                                        </span>
                                    </div>
                                    <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#4B5563', lineHeight: 1.45 }}>
                                        {item.description}
                                    </p>
                                    {item.actor && (
                                        <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '0.6875rem', color: '#C4975A', fontWeight: 600 }}>
                                            Action logged by {item.actor}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
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
                            Enter the bespoke order number this reward was redeemed on.
                        </p>

                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Order Number
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. CS-2026-020"
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

            {/* Manual Reward Issuance Modal */}
            {manualModal.isOpen && (
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
                            maxWidth: '500px',
                            padding: '28px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>
                            Grant Manual Reward
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#6B7280' }}>
                            Issue a special credit or goodwill gesture for {manualModal.customerName}.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Reward Category
                                </label>
                                <select
                                    value={manualModal.rewardType}
                                    onChange={(e) =>
                                        setManualModal((prev) => ({
                                            ...prev,
                                            rewardType: e.target.value as ReferralRewardType,
                                        }))
                                    }
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        padding: '0 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                    }}
                                >
                                    <option value="discount">Percentage Discount / Cash Voucher</option>
                                    <option value="free_item">Free Accessory (Pocket Square / Cuffs)</option>
                                    <option value="priority_slot">Priority Tailoring Slot</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Reward Value Description
                                </label>
                                <input
                                    type="text"
                                    value={manualModal.rewardValue}
                                    onChange={(e) =>
                                        setManualModal((prev) => ({ ...prev, rewardValue: e.target.value }))
                                    }
                                    style={{
                                        width: '100%',
                                        height: '40px',
                                        padding: '0 12px',
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
                                    Internal Atelier Note
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="Enter reason for manual reward grant..."
                                    value={manualModal.reason}
                                    onChange={(e) =>
                                        setManualModal((prev) => ({ ...prev, reason: e.target.value }))
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setManualModal((prev) => ({ ...prev, isOpen: false }))}
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
                                onClick={handleConfirmManualIssue}
                                style={{
                                    background: '#C4975A',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                Grant Reward
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
