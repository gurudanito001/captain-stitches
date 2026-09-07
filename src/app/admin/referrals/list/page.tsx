'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    ReferralItem,
    ReferralRewardType,
    RewardStatus,
    getAllReferrals,
    markRewardRedeemed,
    issueRewardManually,
} from '@/data/adminReferralsData'

type FilterRewardStatus = 'all' | 'pending' | 'credited' | 'redeemed'
type FilterRewardType = 'all' | 'discount' | 'free_item' | 'priority_slot'

export default function AdminReferralsListPage() {
    const [referrals, setReferrals] = useState<ReferralItem[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<FilterRewardStatus>('all')
    const [typeFilter, setTypeFilter] = useState<FilterRewardType>('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [dateRangeFilter, setDateRangeFilter] = useState('all')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 25

    // Modal state for Mark Redeemed
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
        customerId: 'cust-1',
        customerName: 'Adewale Okafor',
        rewardType: 'discount',
        rewardValue: '€20 / ₦20,000 Voucher',
        reason: '',
    })

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [copiedToken, setCopiedToken] = useState<string | null>(null)

    useEffect(() => {
        setReferrals(getAllReferrals())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const handleCopyToken = (token: string) => {
        navigator.clipboard.writeText(token)
        setCopiedToken(token)
        showToast(`Copied token "${token}" to clipboard!`)
        setTimeout(() => setCopiedToken(null), 2000)
    }

    // Filtered Referrals
    const filteredReferrals = useMemo(() => {
        return referrals.filter((item) => {
            // Search
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase()
                const matchReferrer = item.referrer.name.toLowerCase().includes(q)
                const matchReferred = item.referredCustomer.name.toLowerCase().includes(q)
                const matchToken = item.token.toLowerCase().includes(q)
                const matchOrder = item.linkedOrder?.orderNumber.toLowerCase().includes(q) || false
                if (!matchReferrer && !matchReferred && !matchToken && !matchOrder) return false
            }

            // Reward Status (matches if either referrer or referred reward matches)
            if (statusFilter !== 'all') {
                const referrerMatch = item.referrerReward.status === statusFilter
                const referredMatch = item.referredCustomerReward.status === statusFilter
                if (!referrerMatch && !referredMatch) return false
            }

            // Reward Type
            if (typeFilter !== 'all') {
                const referrerTypeMatch = item.referrerReward.type === typeFilter
                const referredTypeMatch = item.referredCustomerReward.type === typeFilter
                if (!referrerTypeMatch && !referredTypeMatch) return false
            }

            // Location
            if (locationFilter !== 'all') {
                if (item.referrer.location !== locationFilter && item.referredCustomer.location !== locationFilter) {
                    return false
                }
            }

            // Date Range
            if (dateRangeFilter === '7days') {
                if (!item.dateCreated.includes('Jun')) return false
            } else if (dateRangeFilter === '30days') {
                if (!item.dateCreated.includes('Jun') && !item.dateCreated.includes('May')) return false
            }

            return true
        })
    }, [referrals, searchQuery, statusFilter, typeFilter, locationFilter, dateRangeFilter])

    // Pagination slice
    const totalPages = Math.ceil(filteredReferrals.length / pageSize) || 1
    const paginatedReferrals = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredReferrals.slice(start, start + pageSize)
    }, [filteredReferrals, currentPage, pageSize])

    // Handle Redeem Confirm
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
        showToast('Reward marked as Redeemed and linked to order.')
    }

    // Handle Manual Issuance Confirm
    const handleConfirmManualIssue = () => {
        if (!manualModal.reason.trim()) {
            alert('Please provide a reason or internal atelier note for this manual reward.')
            return
        }

        const updated = issueRewardManually(
            manualModal.customerId,
            manualModal.customerName,
            manualModal.rewardType,
            manualModal.rewardValue,
            manualModal.reason.trim()
        )
        setReferrals(updated)
        setManualModal({
            isOpen: false,
            customerId: 'cust-1',
            customerName: 'Adewale Okafor',
            rewardType: 'discount',
            rewardValue: '€20 Voucher',
            reason: '',
        })
        showToast('Custom reward issued and recorded.')
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

            {/* Breadcrumb & Navigation */}
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
                    marginBottom: '28px',
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
                        All Referral Records
                    </h1>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9375rem', color: '#6B7280' }}>
                        Search and audit every individual referral relationship, commission link, and reward status.
                    </p>
                </div>

                {/* Top Action */}
                <button
                    type="button"
                    onClick={() => setManualModal((prev) => ({ ...prev, isOpen: true }))}
                    style={{
                        background: '#1C0F07',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '10px 18px',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                    }}
                >
                    + Issue Reward Manually
                </button>
            </div>

            {/* Filter Bar */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '14px',
                    padding: '18px 22px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '14px',
                }}
            >
                {/* Search Box */}
                <div style={{ flex: '1 1 240px', position: 'relative' }}>
                    <span
                        style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#9CA3AF',
                            fontSize: '0.875rem',
                        }}
                    >
                        🔍
                    </span>
                    <input
                        type="text"
                        placeholder="Search referrer, friend, token, order..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            height: '40px',
                            padding: '0 14px 0 36px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            outline: 'none',
                            boxSizing: 'border-box',
                        }}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'none',
                                border: 'none',
                                color: '#9CA3AF',
                                cursor: 'pointer',
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Reward Status Filter */}
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as FilterRewardStatus)}
                    style={{
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid #EDE8E1',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        color: '#1C0F07',
                        background: '#FAF7F2',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    <option value="all">All Reward Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="credited">Credited (Unused)</option>
                    <option value="redeemed">Redeemed</option>
                </select>

                {/* Reward Type Filter */}
                <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as FilterRewardType)}
                    style={{
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid #EDE8E1',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        color: '#1C0F07',
                        background: '#FAF7F2',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    <option value="all">All Reward Types</option>
                    <option value="discount">Discount / Credit</option>
                    <option value="free_item">Free Item / Accessory</option>
                    <option value="priority_slot">Priority Tailoring Slot</option>
                </select>

                {/* Location Filter */}
                <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    style={{
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid #EDE8E1',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        color: '#1C0F07',
                        background: '#FAF7F2',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    <option value="all">All Locations</option>
                    <option value="Italy">🇮🇹 Italy</option>
                    <option value="Nigeria">🇳🇬 Nigeria</option>
                </select>

                {/* Date Range Filter */}
                <select
                    value={dateRangeFilter}
                    onChange={(e) => setDateRangeFilter(e.target.value)}
                    style={{
                        height: '40px',
                        padding: '0 12px',
                        border: '1px solid #EDE8E1',
                        borderRadius: '8px',
                        fontSize: '0.8125rem',
                        color: '#1C0F07',
                        background: '#FAF7F2',
                        cursor: 'pointer',
                        outline: 'none',
                    }}
                >
                    <option value="all">All Dates</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                </select>
            </div>

            {/* Referrals Table Card */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    marginBottom: '24px',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Referrer
                                </th>
                                <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Referred Friend
                                </th>
                                <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Token
                                </th>
                                <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    First Visited
                                </th>
                                <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Linked Order
                                </th>
                                <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Status
                                </th>
                                <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Referrer Reward
                                </th>
                                <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                    Referred Reward
                                </th>
                                <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReferrals.length === 0 ? (
                                <tr>
                                    <td colSpan={9} style={{ padding: '40px', textAlign: 'center', color: '#6B7280' }}>
                                        No referral records match your current filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedReferrals.map((item) => {
                                    const isPaid = item.conversionStatus === 'paid'
                                    const isOrdered = item.conversionStatus === 'ordered'

                                    return (
                                        <tr
                                            key={item.id}
                                            style={{
                                                borderBottom: '1px solid #F3F4F6',
                                                transition: 'background 0.15s ease',
                                            }}
                                        >
                                            {/* Referrer */}
                                            <td style={{ padding: '16px 18px' }}>
                                                <Link
                                                    href={`/admin/customers/${item.referrer.id}`}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            background: item.referrer.avatarColor,
                                                            color: '#FFFFFF',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {item.referrer.initials}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07' }}>
                                                            {item.referrer.name}
                                                        </p>
                                                        <span style={{ fontSize: '0.6875rem', color: '#6B7280' }}>
                                                            {item.referrer.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* Referred Customer */}
                                            <td style={{ padding: '16px 18px' }}>
                                                <Link
                                                    href={`/admin/customers/${item.referredCustomer.id}`}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}
                                                >
                                                    <div
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            background: item.referredCustomer.avatarColor,
                                                            color: '#FFFFFF',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 700,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {item.referredCustomer.initials}
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07' }}>
                                                            {item.referredCustomer.name}
                                                        </p>
                                                        <span style={{ fontSize: '0.6875rem', color: '#6B7280' }}>
                                                            {item.referredCustomer.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            </td>

                                            {/* Token & Copy */}
                                            <td style={{ padding: '16px 14px' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#1C0F07', fontWeight: 700, background: '#FAF7F2', padding: '3px 6px', borderRadius: '4px' }}>
                                                        {item.token}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleCopyToken(item.token)}
                                                        title="Copy referral token"
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '0.75rem',
                                                            color: copiedToken === item.token ? '#15803D' : '#9CA3AF',
                                                            padding: '2px',
                                                        }}
                                                    >
                                                        {copiedToken === item.token ? '✓' : '📋'}
                                                    </button>
                                                </div>
                                            </td>

                                            {/* First Visited */}
                                            <td style={{ padding: '16px 14px', fontSize: '0.8125rem', color: '#6B7280' }}>
                                                {item.dateVisited}
                                            </td>

                                            {/* Linked Order */}
                                            <td style={{ padding: '16px 14px' }}>
                                                {item.linkedOrder ? (
                                                    <Link
                                                        href={`/admin/orders/${item.linkedOrder.id}`}
                                                        style={{
                                                            fontSize: '0.8125rem',
                                                            fontWeight: 600,
                                                            color: '#C4975A',
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        {item.linkedOrder.orderNumber} ↗
                                                    </Link>
                                                ) : (
                                                    <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                                                        Not placed
                                                    </span>
                                                )}
                                            </td>

                                            {/* Conversion Status */}
                                            <td style={{ padding: '16px 14px' }}>
                                                {isPaid ? (
                                                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        Paid Order
                                                    </span>
                                                ) : isOrdered ? (
                                                    <span style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        Deposit Pending
                                                    </span>
                                                ) : (
                                                    <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        Link Visited
                                                    </span>
                                                )}
                                            </td>

                                            {/* Referrer Reward */}
                                            <td style={{ padding: '16px 14px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1C0F07' }}>
                                                        {item.referrerReward.value}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: '0.6875rem',
                                                            fontWeight: 700,
                                                            color:
                                                                item.referrerReward.status === 'redeemed'
                                                                    ? '#6B7280'
                                                                    : item.referrerReward.status === 'credited'
                                                                      ? '#15803D'
                                                                      : '#D97706',
                                                        }}
                                                    >
                                                        {item.referrerReward.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Referred Reward */}
                                            <td style={{ padding: '16px 14px' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#1C0F07' }}>
                                                        {item.referredCustomerReward.value}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: '0.6875rem',
                                                            fontWeight: 700,
                                                            color:
                                                                item.referredCustomerReward.status === 'redeemed'
                                                                    ? '#6B7280'
                                                                    : item.referredCustomerReward.status === 'credited'
                                                                      ? '#15803D'
                                                                      : '#D97706',
                                                        }}
                                                    >
                                                        {item.referredCustomerReward.status.toUpperCase()}
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '16px 18px', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                    {item.referrerReward.status === 'credited' && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setRedeemModal({
                                                                    isOpen: true,
                                                                    referralId: item.id,
                                                                    target: 'referrer',
                                                                    customerName: item.referrer.name,
                                                                    rewardValue: item.referrerReward.value,
                                                                    orderAppliedNumber: '',
                                                                })
                                                            }
                                                            style={{
                                                                background: '#15803D',
                                                                color: '#FFFFFF',
                                                                border: 'none',
                                                                borderRadius: '6px',
                                                                padding: '6px 10px',
                                                                fontSize: '0.6875rem',
                                                                fontWeight: 600,
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            Redeem
                                                        </button>
                                                    )}

                                                    <Link
                                                        href={`/admin/referrals/${item.id}`}
                                                        style={{
                                                            background: '#FAF7F2',
                                                            color: '#1C0F07',
                                                            border: '1px solid #EDE8E1',
                                                            borderRadius: '6px',
                                                            padding: '6px 10px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        Inspect →
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <div
                    style={{
                        padding: '16px 20px',
                        background: '#FAF7F2',
                        borderTop: '1px solid #EDE8E1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                        Showing {paginatedReferrals.length} of {filteredReferrals.length} records (Page {currentPage} of {totalPages})
                    </span>

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #EDE8E1',
                                borderRadius: '6px',
                                padding: '6px 14px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: currentPage <= 1 ? '#D1D5DB' : '#1C0F07',
                                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            ← Previous
                        </button>
                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            style={{
                                background: '#FFFFFF',
                                border: '1px solid #EDE8E1',
                                borderRadius: '6px',
                                padding: '6px 14px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: currentPage >= totalPages ? '#D1D5DB' : '#1C0F07',
                                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Next →
                        </button>
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
                            Please enter the order number this reward was applied toward.
                        </p>

                        <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
                            Order Number (e.g. CS-2026-020)
                        </label>
                        <input
                            type="text"
                            placeholder="CS-2026-..."
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
                            maxWidth: '520px',
                            padding: '28px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 8px', fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>
                            Issue Bespoke Referral Reward
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#6B7280' }}>
                            Award an ambassador kickback or goodwill credit directly to any customer record.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Target Patron
                                </label>
                                <select
                                    value={manualModal.customerId}
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
                                        setManualModal((prev) => ({
                                            ...prev,
                                            customerId: cId,
                                            customerName: cName,
                                        }))
                                    }}
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
                                    <option value="priority_slot">Priority Tailoring Express Slot</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Reward Value Description
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. 15% Off or Free Silk Pocket Square"
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
                                    Internal Atelier Reason
                                </label>
                                <textarea
                                    rows={3}
                                    placeholder="e.g. Goodwill credit for 3 offline referrals brought to Milan showroom..."
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
