'use client'

import React, { useState, useMemo, useEffect } from 'react'
import Link from 'next/link'
import {
    AdminReviewItem,
    ReviewStatus,
    getAllReviews,
    updateReviewStatus,
    flagReview,
    unflagReview,
    bulkUpdateReviewStatus,
    updateModeratorNote,
} from '@/data/adminReviewsData'

type FilterTab = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
type SortOption = 'newest' | 'oldest' | 'highest_rating' | 'lowest_rating'
type DateRangeOption = 'all' | '7days' | '30days' | '90days'

export default function AdminReviewsQueuePage() {
    const [reviews, setReviews] = useState<AdminReviewItem[]>([])
    const [activeTab, setActiveTab] = useState<FilterTab>('ALL')
    const [searchQuery, setSearchQuery] = useState('')
    const [designFilter, setDesignFilter] = useState('all')
    const [ratingFilter, setRatingFilter] = useState('all')
    const [locationFilter, setLocationFilter] = useState('all')
    const [dateRangeFilter, setDateRangeFilter] = useState<DateRangeOption>('all')
    const [sortBy, setSortBy] = useState<SortOption>('newest')

    // Selection for bulk actions
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Lightbox Modal State
    const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null)

    // Rejection Modal State
    const [rejectionModal, setRejectionModal] = useState<{
        isOpen: boolean
        reviewId?: string // undefined for bulk
        reason: string
    }>({ isOpen: false, reason: '' })

    // Flag Modal State
    const [flagModal, setFlagModal] = useState<{
        isOpen: boolean
        reviewId: string
        note: string
    }>({ isOpen: false, reviewId: '', note: '' })

    // Moderator Note Inline Editing
    const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
    const [tempNoteText, setTempNoteText] = useState('')

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        setReviews(getAllReviews())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    // Counts for tabs and stats
    const stats = useMemo(() => {
        const total = reviews.length
        const pending = reviews.filter((r) => r.status === 'PENDING').length
        const approved = reviews.filter((r) => r.status === 'APPROVED').length
        const rejected = reviews.filter((r) => r.status === 'REJECTED').length

        const approvedReviews = reviews.filter((r) => r.status === 'APPROVED')
        const avgRating =
            approvedReviews.length > 0
                ? (
                      approvedReviews.reduce((sum, r) => sum + r.rating, 0) /
                      approvedReviews.length
                  ).toFixed(1)
                : '5.0'

        return { total, pending, approved, rejected, avgRating }
    }, [reviews])

    // Unique designs for filter dropdown
    const availableDesigns = useMemo(() => {
        const map = new Map<string, string>()
        reviews.forEach((r) => {
            if (!map.has(r.design.id)) {
                map.set(r.design.id, r.design.name)
            }
        })
        return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
    }, [reviews])

    // Filtered and Sorted Reviews
    const filteredReviews = useMemo(() => {
        return reviews
            .filter((r) => {
                // Tab Filter
                if (activeTab === 'PENDING' && r.status !== 'PENDING') return false
                if (activeTab === 'APPROVED' && r.status !== 'APPROVED') return false
                if (activeTab === 'REJECTED' && r.status !== 'REJECTED') return false

                // Search query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase()
                    const matchName = r.customer.name.toLowerCase().includes(q)
                    const matchDesign = r.design.name.toLowerCase().includes(q)
                    const matchComment = r.comment.toLowerCase().includes(q)
                    const matchOrder = r.order.orderNumber.toLowerCase().includes(q)
                    const matchCode = r.code.toLowerCase().includes(q)
                    if (!matchName && !matchDesign && !matchComment && !matchOrder && !matchCode) {
                        return false
                    }
                }

                // Design Filter
                if (designFilter !== 'all' && r.design.id !== designFilter) return false

                // Star Rating Filter
                if (ratingFilter !== 'all' && r.rating !== parseInt(ratingFilter, 10)) return false

                // Location Filter
                if (locationFilter !== 'all' && r.customer.location !== locationFilter) return false

                // Date Range Filter (simplified simulation against 2026 dates)
                if (dateRangeFilter === '7days') {
                    if (!r.dateSubmitted.includes('Jun')) return false
                } else if (dateRangeFilter === '30days') {
                    if (!r.dateSubmitted.includes('Jun') && !r.dateSubmitted.includes('May')) return false
                }

                return true
            })
            .sort((a, b) => {
                if (sortBy === 'newest') {
                    return new Date(b.dateSubmitted).getTime() - new Date(a.dateSubmitted).getTime()
                }
                if (sortBy === 'oldest') {
                    return new Date(a.dateSubmitted).getTime() - new Date(b.dateSubmitted).getTime()
                }
                if (sortBy === 'highest_rating') {
                    return b.rating - a.rating
                }
                if (sortBy === 'lowest_rating') {
                    return a.rating - b.rating
                }
                return 0
            })
    }, [
        reviews,
        activeTab,
        searchQuery,
        designFilter,
        ratingFilter,
        locationFilter,
        dateRangeFilter,
        sortBy,
    ])

    // Multi-select handlers
    const allFilteredIds = useMemo(() => filteredReviews.map((r) => r.id), [filteredReviews])
    const isAllSelected =
        allFilteredIds.length > 0 && allFilteredIds.every((id) => selectedIds.includes(id))

    const handleToggleSelectAll = () => {
        if (isAllSelected) {
            setSelectedIds([])
        } else {
            setSelectedIds(allFilteredIds)
        }
    }

    const handleToggleSelect = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    // Actions
    const handleApproveSingle = (id: string) => {
        const updated = updateReviewStatus(id, 'APPROVED')
        setReviews(updated)
        showToast('Review approved & published to storefront!')
    }

    const handleOpenRejectModal = (id?: string) => {
        setRejectionModal({
            isOpen: true,
            reviewId: id,
            reason: '',
        })
    }

    const handleConfirmRejection = () => {
        if (!rejectionModal.reason.trim()) {
            alert('Please specify an internal reason for rejecting this review.')
            return
        }

        if (rejectionModal.reviewId) {
            // Single reject
            const updated = updateReviewStatus(
                rejectionModal.reviewId,
                'REJECTED',
                rejectionModal.reason
            )
            setReviews(updated)
            showToast('Review marked as Rejected.')
        } else {
            // Bulk reject
            const updated = bulkUpdateReviewStatus(
                selectedIds,
                'REJECTED',
                rejectionModal.reason
            )
            setReviews(updated)
            setSelectedIds([])
            showToast(`${selectedIds.length} reviews rejected.`)
        }

        setRejectionModal({ isOpen: false, reason: '' })
    }

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return
        const count = selectedIds.length
        const updated = bulkUpdateReviewStatus(selectedIds, 'APPROVED')
        setReviews(updated)
        setSelectedIds([])
        showToast(`Successfully approved and published ${count} reviews!`)
    }

    const handleOpenFlagModal = (review: AdminReviewItem) => {
        setFlagModal({
            isOpen: true,
            reviewId: review.id,
            note: review.moderation.flagNote || '',
        })
    }

    const handleConfirmFlag = () => {
        if (flagModal.note.trim()) {
            const updated = flagReview(flagModal.reviewId, flagModal.note.trim())
            setReviews(updated)
            showToast('Review flagged for follow-up.')
        } else {
            const updated = unflagReview(flagModal.reviewId)
            setReviews(updated)
            showToast('Flag removed.')
        }
        setFlagModal({ isOpen: false, reviewId: '', note: '' })
    }

    const handleSaveInlineNote = (id: string) => {
        const updated = updateModeratorNote(id, tempNoteText)
        setReviews(updated)
        setEditingNoteId(null)
        showToast('Internal note saved.')
    }

    return (
        <div style={{ padding: '36px 40px 80px', minHeight: '100vh', background: '#FAF7F2' }}>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <h1
                            style={{
                                fontSize: '1.875rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                letterSpacing: '-0.02em',
                                margin: 0,
                            }}
                        >
                            Customer Reviews Queue
                        </h1>
                        {stats.pending > 0 && (
                            <span
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '5px 12px',
                                    borderRadius: '9999px',
                                    background: '#FEF3C7',
                                    color: '#B45309',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                }}
                            >
                                <span
                                    style={{
                                        width: '7px',
                                        height: '7px',
                                        borderRadius: '50%',
                                        background: '#D97706',
                                    }}
                                />
                                {stats.pending} Needs Action
                            </span>
                        )}
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9375rem', color: '#6B7280' }}>
                        Moderate, verify, and approve customer reviews before they appear on the public atelier showcase.
                    </p>
                </div>
            </div>

            {/* KPI Stats Strip */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '18px',
                    marginBottom: '32px',
                }}
            >
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '20px 22px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Total Reviews
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1C0F07' }}>
                            {stats.total}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>all time</span>
                    </div>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '20px 22px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Approved & Live
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#15803D' }}>
                            {stats.approved}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: '#15803D', fontWeight: 600 }}>
                            {Math.round((stats.approved / (stats.total || 1)) * 100)}% published
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '20px 22px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Pending Moderation
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#D97706' }}>
                            {stats.pending}
                        </span>
                        <span style={{ fontSize: '0.8125rem', color: '#B45309', fontWeight: 600 }}>
                            awaiting review
                        </span>
                    </div>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '20px 22px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Average Client Rating
                    </p>
                    <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.875rem', fontWeight: 700, color: '#1C0F07' }}>
                            {stats.avgRating}
                        </span>
                        <div style={{ display: 'flex', color: '#C4975A', fontSize: '1.125rem' }}>
                            ★★★★★
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Tabs & Search / Filter Controls */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '14px',
                    padding: '20px 24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
                }}
            >
                {/* Tabs */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        borderBottom: '1px solid #EDE8E1',
                        paddingBottom: '16px',
                        marginBottom: '20px',
                        overflowX: 'auto',
                    }}
                >
                    {(
                        [
                            { key: 'ALL', label: 'All Reviews', count: stats.total },
                            { key: 'PENDING', label: 'Pending', count: stats.pending },
                            { key: 'APPROVED', label: 'Approved', count: stats.approved },
                            { key: 'REJECTED', label: 'Rejected', count: stats.rejected },
                        ] as const
                    ).map((tab) => {
                        const active = activeTab === tab.key
                        return (
                            <button
                                key={tab.key}
                                type="button"
                                onClick={() => setActiveTab(tab.key)}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    fontWeight: active ? 700 : 500,
                                    color: active ? '#FFFFFF' : '#4B5563',
                                    background: active ? '#1C0F07' : 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.15s ease',
                                }}
                            >
                                {tab.label}
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '2px 8px',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        background: active ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                                        color: active ? '#FFFFFF' : '#6B7280',
                                    }}
                                >
                                    {tab.count}
                                </span>
                            </button>
                        )
                    })}
                </div>

                {/* Filter Controls Row */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '14px',
                    }}
                >
                    {/* Search Input */}
                    <div style={{ flex: '1 1 260px', position: 'relative' }}>
                        <span
                            style={{
                                position: 'absolute',
                                left: '14px',
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
                            placeholder="Search by customer, garment, order number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                height: '42px',
                                padding: '0 14px 0 38px',
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
                                    right: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#9CA3AF',
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Design Filter */}
                    <select
                        value={designFilter}
                        onChange={(e) => setDesignFilter(e.target.value)}
                        style={{
                            height: '42px',
                            padding: '0 14px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="all">All Designs</option>
                        {availableDesigns.map((d) => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>

                    {/* Star Rating Filter */}
                    <select
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(e.target.value)}
                        style={{
                            height: '42px',
                            padding: '0 14px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars (★★★★★)</option>
                        <option value="4">4 Stars (★★★★)</option>
                        <option value="3">3 Stars (★★★)</option>
                        <option value="2">2 Stars (★★)</option>
                        <option value="1">1 Star (★)</option>
                    </select>

                    {/* Location Filter */}
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        style={{
                            height: '42px',
                            padding: '0 14px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
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
                        onChange={(e) => setDateRangeFilter(e.target.value as DateRangeOption)}
                        style={{
                            height: '42px',
                            padding: '0 14px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="all">All Dates</option>
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="90days">Last 90 Days</option>
                    </select>

                    {/* Sort Selector */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        style={{
                            height: '42px',
                            padding: '0 14px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="newest">Sort: Newest First</option>
                        <option value="oldest">Sort: Oldest First</option>
                        <option value="highest_rating">Sort: Highest Rating</option>
                        <option value="lowest_rating">Sort: Lowest Rating</option>
                    </select>
                </div>
            </div>

            {/* Bulk Actions Bar (Shown when 1 or more reviews selected) */}
            {selectedIds.length > 0 && (
                <div
                    style={{
                        background: '#1C0F07',
                        color: '#FAF7F2',
                        borderRadius: '12px',
                        padding: '14px 22px',
                        marginBottom: '24px',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span
                            style={{
                                background: '#C4975A',
                                color: '#FFFFFF',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                            }}
                        >
                            {selectedIds.length} Selected
                        </span>
                        <span style={{ fontSize: '0.875rem', color: '#D1D5DB' }}>
                            Choose a batch moderation action:
                        </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <button
                            type="button"
                            onClick={handleBulkApprove}
                            style={{
                                background: '#15803D',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            ✓ Bulk Approve
                        </button>
                        <button
                            type="button"
                            onClick={() => handleOpenRejectModal(undefined)}
                            style={{
                                background: '#B91C1C',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            ✕ Bulk Reject
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedIds([])}
                            style={{
                                background: 'transparent',
                                color: '#9CA3AF',
                                border: '1px solid #4B5563',
                                borderRadius: '8px',
                                padding: '8px 14px',
                                fontSize: '0.875rem',
                                cursor: 'pointer',
                            }}
                        >
                            Deselect All
                        </button>
                    </div>
                </div>
            )}

            {/* Select All Toggle Header */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 4px 14px',
                }}
            >
                <label
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '0.875rem',
                        color: '#4B5563',
                        cursor: 'pointer',
                        userSelect: 'none',
                    }}
                >
                    <input
                        type="checkbox"
                        checked={isAllSelected}
                        onChange={handleToggleSelectAll}
                        style={{ width: '16px', height: '16px', accentColor: '#C4975A', cursor: 'pointer' }}
                    />
                    <span>Select all ({filteredReviews.length} matching reviews)</span>
                </label>

                <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>
                    Showing {filteredReviews.length} of {reviews.length} total reviews
                </span>
            </div>

            {/* Reviews Cards List */}
            {filteredReviews.length === 0 ? (
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px dashed #D1D5DB',
                        borderRadius: '16px',
                        padding: '60px 20px',
                        textAlign: 'center',
                    }}
                >
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1C0F07', margin: '0 0 8px' }}>
                        No reviews found
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 20px' }}>
                        Try adjusting your filters or clearing search criteria.
                    </p>
                    <button
                        type="button"
                        onClick={() => {
                            setActiveTab('ALL')
                            setSearchQuery('')
                            setDesignFilter('all')
                            setRatingFilter('all')
                            setLocationFilter('all')
                            setDateRangeFilter('all')
                        }}
                        style={{
                            background: '#C4975A',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 20px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Reset All Filters
                    </button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    {filteredReviews.map((review) => {
                        const isSelected = selectedIds.includes(review.id)
                        const isPending = review.status === 'PENDING'
                        const isApproved = review.status === 'APPROVED'
                        const isRejected = review.status === 'REJECTED'
                        const isFlagged = review.moderation.isFlagged

                        return (
                            <div
                                key={review.id}
                                style={{
                                    background: '#FFFFFF',
                                    border: isSelected
                                        ? '1.5px solid #C4975A'
                                        : isFlagged
                                          ? '1.5px solid #C084FC'
                                          : '1px solid #EDE8E1',
                                    borderRadius: '16px',
                                    padding: '24px 26px',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '18px',
                                    transition: 'border-color 0.15s ease',
                                }}
                            >
                                {/* Top Row: Customer info, badges, and code */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '14px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                        {/* Multi-select Checkbox */}
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() => handleToggleSelect(review.id)}
                                            style={{
                                                width: '18px',
                                                height: '18px',
                                                accentColor: '#C4975A',
                                                cursor: 'pointer',
                                            }}
                                        />

                                        {/* Avatar */}
                                        <div
                                            style={{
                                                width: '42px',
                                                height: '42px',
                                                borderRadius: '50%',
                                                background: review.customer.avatarColor || '#C4975A',
                                                color: '#FFFFFF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.875rem',
                                                fontWeight: 700,
                                                letterSpacing: '0.04em',
                                                flexShrink: 0,
                                            }}
                                        >
                                            {review.customer.initials}
                                        </div>

                                        {/* Customer Details */}
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <Link
                                                    href={`/admin/customers/${review.customer.id}`}
                                                    style={{
                                                        fontSize: '1rem',
                                                        fontWeight: 700,
                                                        color: '#1C0F07',
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    {review.customer.name}
                                                </Link>
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '0.75rem',
                                                        padding: '2px 8px',
                                                        borderRadius: '9999px',
                                                        background: '#F3F4F6',
                                                        color: '#4B5563',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {review.customer.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                                </span>
                                            </div>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: '#6B7280' }}>
                                                {review.customer.totalOrders} bespoke order{review.customer.totalOrders === 1 ? '' : 's'} placed
                                            </p>
                                        </div>
                                    </div>

                                    {/* Badges & Date */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        {/* Flagged Pill */}
                                        {isFlagged && (
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '5px',
                                                    background: '#F3E8FF',
                                                    color: '#7E22CE',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                🚩 Needs Attention
                                            </span>
                                        )}

                                        {/* Status Badge */}
                                        {isPending && (
                                            <span
                                                style={{
                                                    background: '#FEF3C7',
                                                    color: '#B45309',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Pending
                                            </span>
                                        )}
                                        {isApproved && (
                                            <span
                                                style={{
                                                    background: '#DCFCE7',
                                                    color: '#15803D',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Approved
                                            </span>
                                        )}
                                        {isRejected && (
                                            <span
                                                style={{
                                                    background: '#FEE2E2',
                                                    color: '#B91C1C',
                                                    padding: '4px 10px',
                                                    borderRadius: '6px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                }}
                                            >
                                                Rejected
                                            </span>
                                        )}

                                        <span style={{ fontSize: '0.8125rem', color: '#9CA3AF' }}>
                                            {review.dateSubmitted} · {review.timeSubmitted}
                                        </span>
                                    </div>
                                </div>

                                {/* Middle Row: Design Link, Order Link, and Visual Stars */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '10px 14px',
                                        background: '#FAF7F2',
                                        borderRadius: '8px',
                                    }}
                                >
                                    {/* Star Rating */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <div style={{ color: '#C4975A', fontSize: '1rem', letterSpacing: '1px' }}>
                                            {'★'.repeat(review.rating)}
                                            {'☆'.repeat(5 - review.rating)}
                                        </div>
                                        <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1C0F07' }}>
                                            {review.rating}.0
                                        </span>
                                    </div>

                                    <span style={{ color: '#D1D5DB' }}>|</span>

                                    {/* Linked Design */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Design:</span>
                                        <Link
                                            href={`/admin/catalogue/${review.design.id}`}
                                            style={{
                                                fontSize: '0.8125rem',
                                                fontWeight: 600,
                                                color: '#1C0F07',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {review.design.name}
                                        </Link>
                                        <span
                                            style={{
                                                fontSize: '0.6875rem',
                                                padding: '2px 6px',
                                                borderRadius: '4px',
                                                background: '#E5E7EB',
                                                color: '#374151',
                                            }}
                                        >
                                            {review.design.categoryLabel}
                                        </span>
                                    </div>

                                    <span style={{ color: '#D1D5DB' }}>|</span>

                                    {/* Linked Order */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '0.8125rem', color: '#6B7280' }}>Order:</span>
                                        <Link
                                            href={`/admin/orders/${review.order.id}`}
                                            style={{
                                                fontSize: '0.8125rem',
                                                fontWeight: 600,
                                                color: '#C4975A',
                                                textDecoration: 'none',
                                            }}
                                        >
                                            {review.order.orderNumber} ↗
                                        </Link>
                                    </div>

                                    <span style={{ color: '#D1D5DB' }}>|</span>

                                    {/* Reference Code */}
                                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF', fontFamily: 'monospace' }}>
                                        {review.code}
                                    </span>
                                </div>

                                {/* Full Written Comment */}
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '0.9375rem',
                                        lineHeight: 1.6,
                                        color: '#1F2937',
                                        fontStyle: 'normal',
                                    }}
                                >
                                    “{review.comment}”
                                </p>

                                {/* Customer Photos Row */}
                                {review.photos.length > 0 && (
                                    <div>
                                        <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                                            Client Outfit Photos ({review.photos.length})
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                            {review.photos.map((photoUrl, pIdx) => (
                                                <button
                                                    key={pIdx}
                                                    type="button"
                                                    onClick={() => setActiveLightboxImage(photoUrl)}
                                                    style={{
                                                        width: '74px',
                                                        height: '74px',
                                                        borderRadius: '8px',
                                                        border: '1px solid #EDE8E1',
                                                        padding: 0,
                                                        background: 'none',
                                                        overflow: 'hidden',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    <img
                                                        src={photoUrl}
                                                        alt={`Customer upload ${pIdx + 1}`}
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Rejection Note (If Rejected) */}
                                {review.moderation.rejectionReason && (
                                    <div
                                        style={{
                                            background: '#FEF2F2',
                                            border: '1px solid #FECACA',
                                            borderRadius: '8px',
                                            padding: '10px 14px',
                                            fontSize: '0.8125rem',
                                            color: '#991B1B',
                                        }}
                                    >
                                        <strong>Rejection Reason:</strong> {review.moderation.rejectionReason}
                                    </div>
                                )}

                                {/* Flag Note (If Flagged) */}
                                {review.moderation.flagNote && (
                                    <div
                                        style={{
                                            background: '#FAF5FF',
                                            border: '1px solid #E9D5FF',
                                            borderRadius: '8px',
                                            padding: '10px 14px',
                                            fontSize: '0.8125rem',
                                            color: '#6B21A8',
                                        }}
                                    >
                                        <strong>Flag Note:</strong> {review.moderation.flagNote}
                                    </div>
                                )}

                                {/* Internal Moderator Note Section */}
                                <div
                                    style={{
                                        borderTop: '1px solid #F3F4F6',
                                        paddingTop: '14px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '6px',
                                    }}
                                >
                                    {editingNoteId === review.id ? (
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <input
                                                type="text"
                                                value={tempNoteText}
                                                onChange={(e) => setTempNoteText(e.target.value)}
                                                placeholder="Add internal moderator note (only visible to admin)..."
                                                style={{
                                                    flex: 1,
                                                    height: '36px',
                                                    padding: '0 12px',
                                                    border: '1px solid #C4975A',
                                                    borderRadius: '6px',
                                                    fontSize: '0.8125rem',
                                                    outline: 'none',
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleSaveInlineNote(review.id)}
                                                style={{
                                                    background: '#1C0F07',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '0 14px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Save Note
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setEditingNoteId(null)}
                                                style={{
                                                    background: '#E5E7EB',
                                                    color: '#374151',
                                                    border: 'none',
                                                    borderRadius: '6px',
                                                    padding: '0 10px',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                fontSize: '0.75rem',
                                                color: '#6B7280',
                                            }}
                                        >
                                            <span>
                                                <strong>Internal Note:</strong>{' '}
                                                {review.moderation.moderatorNote || 'No private note yet.'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingNoteId(review.id)
                                                    setTempNoteText(review.moderation.moderatorNote || '')
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#C4975A',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    padding: 0,
                                                }}
                                            >
                                                {review.moderation.moderatorNote ? 'Edit Note' : '+ Add Note'}
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Bottom Action Buttons */}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        gap: '12px',
                                        borderTop: '1px solid #EDE8E1',
                                        paddingTop: '16px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {/* Approve Button */}
                                        {review.status !== 'APPROVED' && (
                                            <button
                                                type="button"
                                                onClick={() => handleApproveSingle(review.id)}
                                                style={{
                                                    background: '#15803D',
                                                    color: '#FFFFFF',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    padding: '8px 18px',
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                }}
                                            >
                                                ✓ Approve Review
                                            </button>
                                        )}

                                        {/* Reject Button */}
                                        {review.status !== 'REJECTED' && (
                                            <button
                                                type="button"
                                                onClick={() => handleOpenRejectModal(review.id)}
                                                style={{
                                                    background: '#FFFFFF',
                                                    color: '#B91C1C',
                                                    border: '1px solid #FCA5A5',
                                                    borderRadius: '8px',
                                                    padding: '8px 16px',
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 600,
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                ✕ Reject
                                            </button>
                                        )}

                                        {/* Flag for follow-up */}
                                        <button
                                            type="button"
                                            onClick={() => handleOpenFlagModal(review)}
                                            style={{
                                                background: '#FFFFFF',
                                                color: isFlagged ? '#7E22CE' : '#4B5563',
                                                border: isFlagged ? '1px solid #C084FC' : '1px solid #D1D5DB',
                                                borderRadius: '8px',
                                                padding: '8px 14px',
                                                fontSize: '0.8125rem',
                                                fontWeight: 500,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {isFlagged ? '🚩 Flagged' : '⚐ Flag'}
                                        </button>
                                    </div>

                                    {/* Full Detail Link */}
                                    <Link
                                        href={`/admin/reviews/${review.id}`}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            fontSize: '0.8125rem',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            textDecoration: 'none',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            background: '#FAF7F2',
                                        }}
                                    >
                                        Inspect Detail →
                                    </Link>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Photo Lightbox Modal */}
            {activeLightboxImage && (
                <div
                    onClick={() => setActiveLightboxImage(null)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.85)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '30px',
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'relative',
                            maxWidth: '900px',
                            maxHeight: '90vh',
                            background: '#000',
                            borderRadius: '12px',
                            overflow: 'hidden',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setActiveLightboxImage(null)}
                            style={{
                                position: 'absolute',
                                top: '16px',
                                right: '16px',
                                background: 'rgba(0,0,0,0.6)',
                                color: '#FFF',
                                border: 'none',
                                borderRadius: '50%',
                                width: '36px',
                                height: '36px',
                                fontSize: '1.125rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            ✕
                        </button>
                        <img
                            src={activeLightboxImage}
                            alt="Full size client upload"
                            style={{ maxWidth: '100%', maxHeight: '85vh', display: 'block', objectFit: 'contain' }}
                        />
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {rejectionModal.isOpen && (
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
                            {rejectionModal.reviewId ? 'Reject Review' : `Reject ${selectedIds.length} Reviews`}
                        </h3>
                        <p style={{ margin: '0 0 18px', fontSize: '0.875rem', color: '#6B7280' }}>
                            Please provide an internal reason for rejecting this review. This reason is saved privately in the admin record.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                            {[
                                'Spam / Advertising',
                                'Profanity / Inappropriate content',
                                'Wrong garment / Unverified client',
                                'Fitting dispute in resolution via WhatsApp',
                            ].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setRejectionModal((prev) => ({ ...prev, reason: preset }))}
                                    style={{
                                        background: '#F3F4F6',
                                        border: '1px solid #E5E7EB',
                                        borderRadius: '6px',
                                        padding: '4px 10px',
                                        fontSize: '0.75rem',
                                        color: '#374151',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {preset}
                                </button>
                            ))}
                        </div>

                        <textarea
                            rows={3}
                            placeholder="Enter rejection reason..."
                            value={rejectionModal.reason}
                            onChange={(e) =>
                                setRejectionModal((prev) => ({ ...prev, reason: e.target.value }))
                            }
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                boxSizing: 'border-box',
                                marginBottom: '20px',
                                outline: 'none',
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setRejectionModal({ isOpen: false, reason: '' })}
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
                                onClick={handleConfirmRejection}
                                style={{
                                    background: '#B91C1C',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Flag Modal */}
            {flagModal.isOpen && (
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
                            Flag Review for Follow-Up
                        </h3>
                        <p style={{ margin: '0 0 18px', fontSize: '0.875rem', color: '#6B7280' }}>
                            Mark this review for personal atelier review (e.g. consult tailor Kolapo before publishing). Leave empty to remove flag.
                        </p>

                        <textarea
                            rows={3}
                            placeholder="Enter flag instructions or notes for Samuelson..."
                            value={flagModal.note}
                            onChange={(e) => setFlagModal((prev) => ({ ...prev, note: e.target.value }))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                boxSizing: 'border-box',
                                marginBottom: '20px',
                                outline: 'none',
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setFlagModal({ isOpen: false, reviewId: '', note: '' })}
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
                                onClick={handleConfirmFlag}
                                style={{
                                    background: '#7E22CE',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                Save Flag
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
