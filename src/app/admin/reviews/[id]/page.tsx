'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    AdminReviewItem,
    getReviewById,
    updateReviewStatus,
    flagReview,
    unflagReview,
    updateModeratorNote,
} from '@/data/adminReviewsData'

export default function AdminReviewDetailPage() {
    const params = useParams()
    const router = useRouter()
    const reviewId = params.id as string

    const [review, setReview] = useState<AdminReviewItem | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Modals
    const [activeLightboxImage, setActiveLightboxImage] = useState<string | null>(null)
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const [rejectionReason, setRejectionReason] = useState('')
    const [isFlagModalOpen, setIsFlagModalOpen] = useState(false)
    const [flagNote, setFlagNote] = useState('')

    // Inline note editing
    const [internalNote, setInternalNote] = useState('')
    const [isSavingNote, setIsSavingNote] = useState(false)

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!reviewId) return
        const found = getReviewById(reviewId)
        if (found) {
            setReview(found)
            setInternalNote(found.moderation.moderatorNote || '')
            setFlagNote(found.moderation.flagNote || '')
            setRejectionReason(found.moderation.rejectionReason || '')
        }
        setIsLoading(false)
    }, [reviewId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const handleApprove = () => {
        if (!review) return
        const updatedList = updateReviewStatus(review.id, 'APPROVED')
        const current = updatedList.find((r) => r.id === review.id)
        if (current) setReview(current)
        showToast('Review approved & published to public storefront!')
    }

    const handleConfirmReject = () => {
        if (!review) return
        if (!rejectionReason.trim()) {
            alert('Please specify a rejection reason.')
            return
        }
        const updatedList = updateReviewStatus(review.id, 'REJECTED', rejectionReason.trim())
        const current = updatedList.find((r) => r.id === review.id)
        if (current) setReview(current)
        setIsRejectModalOpen(false)
        showToast('Review marked as Rejected.')
    }

    const handleConfirmFlag = () => {
        if (!review) return
        if (flagNote.trim()) {
            const updatedList = flagReview(review.id, flagNote.trim())
            const current = updatedList.find((r) => r.id === review.id)
            if (current) setReview(current)
            showToast('Review flagged for follow-up.')
        } else {
            const updatedList = unflagReview(review.id)
            const current = updatedList.find((r) => r.id === review.id)
            if (current) setReview(current)
            showToast('Flag removed.')
        }
        setIsFlagModalOpen(false)
    }

    const handleSaveNote = () => {
        if (!review) return
        setIsSavingNote(true)
        const updatedList = updateModeratorNote(review.id, internalNote.trim())
        const current = updatedList.find((r) => r.id === review.id)
        if (current) setReview(current)
        setIsSavingNote(false)
        showToast('Internal moderator note updated.')
    }

    if (isLoading) {
        return (
            <div style={{ padding: '60px', textAlign: 'center', color: '#6B7280' }}>
                Loading review details...
            </div>
        )
    }

    if (!review) {
        return (
            <div style={{ padding: '60px 40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1C0F07', margin: '0 0 10px' }}>
                    Review Not Found
                </h2>
                <p style={{ color: '#6B7280', fontSize: '0.9375rem', marginBottom: '24px' }}>
                    The requested review ID could not be found in the atelier records.
                </p>
                <Link
                    href="/admin/reviews"
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
                    ← Back to Reviews Queue
                </Link>
            </div>
        )
    }

    const isPending = review.status === 'PENDING'
    const isApproved = review.status === 'APPROVED'
    const isRejected = review.status === 'REJECTED'
    const isFlagged = review.moderation.isFlagged

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

            {/* Back Navigation & Breadcrumb */}
            <div style={{ marginBottom: '20px' }}>
                <Link
                    href="/admin/reviews"
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
                    ← Back to Reviews Queue
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
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <h1
                                style={{
                                    fontSize: '1.75rem',
                                    fontWeight: 700,
                                    color: '#1C0F07',
                                    letterSpacing: '-0.02em',
                                    margin: 0,
                                }}
                            >
                                Review {review.code}
                            </h1>
                            {/* Status Badge */}
                            {isPending && (
                                <span
                                    style={{
                                        background: '#FEF3C7',
                                        color: '#B45309',
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    ● Pending Moderation
                                </span>
                            )}
                            {isApproved && (
                                <span
                                    style={{
                                        background: '#DCFCE7',
                                        color: '#15803D',
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    ✓ Approved & Live
                                </span>
                            )}
                            {isRejected && (
                                <span
                                    style={{
                                        background: '#FEE2E2',
                                        color: '#B91C1C',
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    ✕ Rejected
                                </span>
                            )}
                            {isFlagged && (
                                <span
                                    style={{
                                        background: '#F3E8FF',
                                        color: '#7E22CE',
                                        padding: '4px 12px',
                                        borderRadius: '9999px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 700,
                                    }}
                                >
                                    🚩 Flagged for Review
                                </span>
                            )}
                        </div>
                        <p style={{ margin: '4px 0 0', fontSize: '0.875rem', color: '#6B7280' }}>
                            Submitted on {review.dateSubmitted} at {review.timeSubmitted} by {review.customer.name}
                        </p>
                    </div>
                </div>

                {/* Header Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {review.status !== 'APPROVED' && (
                        <button
                            type="button"
                            onClick={handleApprove}
                            style={{
                                background: '#15803D',
                                color: '#FFFFFF',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '10px 20px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 4px rgba(21, 128, 61, 0.2)',
                            }}
                        >
                            ✓ Approve Review
                        </button>
                    )}

                    {review.status !== 'REJECTED' && (
                        <button
                            type="button"
                            onClick={() => setIsRejectModalOpen(true)}
                            style={{
                                background: '#FFFFFF',
                                color: '#B91C1C',
                                border: '1px solid #FCA5A5',
                                borderRadius: '8px',
                                padding: '10px 18px',
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            ✕ Reject Review
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => setIsFlagModalOpen(true)}
                        style={{
                            background: '#FFFFFF',
                            color: isFlagged ? '#7E22CE' : '#4B5563',
                            border: isFlagged ? '1px solid #C084FC' : '1px solid #D1D5DB',
                            borderRadius: '8px',
                            padding: '10px 16px',
                            fontSize: '0.875rem',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        {isFlagged ? '🚩 Edit Flag' : '⚐ Flag for Review'}
                    </button>
                </div>
            </div>

            {/* 2-Column Main Layout */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 1fr)',
                    gap: '28px',
                    alignItems: 'start',
                }}
            >
                {/* Left Column: Full Review Content, Photos, Moderation Dossier */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {/* Primary Review Content Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '30px 32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '1.125rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                margin: '0 0 16px',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Customer Feedback & Rating
                        </h2>

                        {/* Large Star Rating Strip */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                padding: '16px 20px',
                                background: '#FAF7F2',
                                borderRadius: '12px',
                                marginBottom: '24px',
                            }}
                        >
                            <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#1C0F07', lineHeight: 1 }}>
                                {review.rating}.0
                            </div>
                            <div>
                                <div style={{ color: '#C4975A', fontSize: '1.25rem', letterSpacing: '2px' }}>
                                    {'★'.repeat(review.rating)}
                                    {'☆'.repeat(5 - review.rating)}
                                </div>
                                <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 500 }}>
                                    Verified Client Review ({review.rating} of 5 Stars)
                                </span>
                            </div>
                        </div>

                        {/* Full Written Comment */}
                        <div style={{ marginBottom: '28px' }}>
                            <p style={{ margin: '0 0 8px', fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Written Testimonial
                            </p>
                            <div
                                style={{
                                    borderLeft: '4px solid #C4975A',
                                    paddingLeft: '18px',
                                    paddingTop: '4px',
                                    paddingBottom: '4px',
                                }}
                            >
                                <p
                                    style={{
                                        margin: 0,
                                        fontSize: '1.125rem',
                                        lineHeight: 1.7,
                                        color: '#1F2937',
                                        fontStyle: 'italic',
                                        fontFamily: 'serif',
                                    }}
                                >
                                    “{review.comment}”
                                </p>
                            </div>
                        </div>

                        {/* Uploaded Customer Photos */}
                        <div>
                            <p style={{ margin: '0 0 12px', fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Client Photos Uploaded ({review.photos.length})
                            </p>

                            {review.photos.length === 0 ? (
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#9CA3AF', fontStyle: 'italic' }}>
                                    No photos submitted with this review.
                                </p>
                            ) : (
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                        gap: '14px',
                                    }}
                                >
                                    {review.photos.map((photoUrl, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setActiveLightboxImage(photoUrl)}
                                            style={{
                                                position: 'relative',
                                                height: '200px',
                                                borderRadius: '10px',
                                                overflow: 'hidden',
                                                border: '1px solid #EDE8E1',
                                                cursor: 'pointer',
                                                background: '#000',
                                            }}
                                        >
                                            <img
                                                src={photoUrl}
                                                alt={`Customer photo ${idx + 1}`}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover',
                                                    transition: 'transform 0.2s ease',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    bottom: '8px',
                                                    right: '8px',
                                                    background: 'rgba(0,0,0,0.65)',
                                                    color: '#FFFFFF',
                                                    fontSize: '0.75rem',
                                                    padding: '3px 8px',
                                                    borderRadius: '4px',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                🔍 Click to enlarge
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Moderation Section */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '28px 32px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h2
                            style={{
                                fontSize: '1.125rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                margin: '0 0 16px',
                                letterSpacing: '-0.01em',
                            }}
                        >
                            Internal Moderation Dossier
                        </h2>

                        {/* Moderation History Box */}
                        <div
                            style={{
                                background: '#FAF7F2',
                                borderRadius: '10px',
                                padding: '16px 20px',
                                marginBottom: '22px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: '20px',
                            }}
                        >
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                                    Moderator Assigned
                                </span>
                                <p style={{ margin: '2px 0 0', fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {review.moderation.moderatorName || 'Pending Assignment'}
                                </p>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                                    Decision Timestamp
                                </span>
                                <p style={{ margin: '2px 0 0', fontSize: '0.875rem', fontWeight: 600, color: '#4B5563' }}>
                                    {review.moderation.moderatedAt || 'Awaiting Action'}
                                </p>
                            </div>

                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                                    Public Visibility
                                </span>
                                <p style={{ margin: '2px 0 0', fontSize: '0.875rem', fontWeight: 700, color: isApproved ? '#15803D' : '#9CA3AF' }}>
                                    {isApproved ? 'Live on Storefront' : 'Hidden from Public'}
                                </p>
                            </div>
                        </div>

                        {/* Rejection reason display if present */}
                        {review.moderation.rejectionReason && (
                            <div
                                style={{
                                    background: '#FEF2F2',
                                    border: '1px solid #FECACA',
                                    borderRadius: '10px',
                                    padding: '16px 18px',
                                    marginBottom: '20px',
                                }}
                            >
                                <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', fontWeight: 700, color: '#991B1B' }}>
                                    Rejection Reason Recorded:
                                </p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#7F1D1D' }}>
                                    {review.moderation.rejectionReason}
                                </p>
                            </div>
                        )}

                        {/* Flag note display if present */}
                        {review.moderation.flagNote && (
                            <div
                                style={{
                                    background: '#FAF5FF',
                                    border: '1px solid #E9D5FF',
                                    borderRadius: '10px',
                                    padding: '16px 18px',
                                    marginBottom: '20px',
                                }}
                            >
                                <p style={{ margin: '0 0 4px', fontSize: '0.8125rem', fontWeight: 700, color: '#6B21A8' }}>
                                    🚩 Attention Flag Note:
                                </p>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#581C87' }}>
                                    {review.moderation.flagNote}
                                </p>
                            </div>
                        )}

                        {/* Internal Admin Notes Input */}
                        <div>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    color: '#374151',
                                    marginBottom: '8px',
                                }}
                            >
                                Private Atelier Notes (Only visible to admin team)
                            </label>
                            <textarea
                                rows={3}
                                value={internalNote}
                                onChange={(e) => setInternalNote(e.target.value)}
                                placeholder="Add notes regarding customer sentiment, bespoke fit adjustments, or follow-up calls..."
                                style={{
                                    width: '100%',
                                    padding: '12px 14px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    color: '#1C0F07',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    marginBottom: '12px',
                                }}
                            />
                            <button
                                type="button"
                                onClick={handleSaveNote}
                                disabled={isSavingNote}
                                style={{
                                    background: '#1C0F07',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '8px 18px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {isSavingNote ? 'Saving...' : 'Save Private Note'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Customer Dossier, Order Comparison, Design Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                    {/* Customer Section */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 26px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '18px',
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                Patron Profile
                            </h3>
                            <Link
                                href={`/admin/customers/${review.customer.id}`}
                                style={{
                                    fontSize: '0.8125rem',
                                    color: '#C4975A',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                View Dossier ↗
                            </Link>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                            <div
                                style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '50%',
                                    background: review.customer.avatarColor || '#C4975A',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1rem',
                                    fontWeight: 700,
                                    flexShrink: 0,
                                }}
                            >
                                {review.customer.initials}
                            </div>
                            <div>
                                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {review.customer.name}
                                </p>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        marginTop: '4px',
                                        fontSize: '0.75rem',
                                        padding: '2px 8px',
                                        borderRadius: '9999px',
                                        background: '#F3F4F6',
                                        color: '#4B5563',
                                        fontWeight: 600,
                                    }}
                                >
                                    {review.customer.location === 'Italy' ? '🇮🇹 Italy Patron' : '🇳🇬 Nigeria Patron'}
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                borderTop: '1px solid #EDE8E1',
                                paddingTop: '14px',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                            }}
                        >
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Total Orders</span>
                                <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {review.customer.totalOrders} bespoke
                                </p>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Past Rating Avg</span>
                                <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', fontWeight: 700, color: '#C4975A' }}>
                                    {review.customer.previousAverageRating > 0
                                        ? `${review.customer.previousAverageRating} ★ (${review.customer.previousReviewsCount})`
                                        : 'First Review'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Order & QC Inspection Comparison Section */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 26px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                Order & Delivery Verification
                            </h3>
                            <Link
                                href={`/admin/orders/${review.order.id}`}
                                style={{
                                    fontSize: '0.8125rem',
                                    color: '#C4975A',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                {review.order.orderNumber} ↗
                            </Link>
                        </div>

                        <div style={{ marginBottom: '14px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                                Garment Commissioned
                            </span>
                            <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', fontWeight: 600, color: '#1C0F07' }}>
                                {review.order.garmentName}
                            </p>
                        </div>

                        <div style={{ marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', fontWeight: 600 }}>
                                Delivery Confirmed
                            </span>
                            <p style={{ margin: '2px 0 0', fontSize: '0.875rem', color: '#15803D', fontWeight: 600 }}>
                                ✓ Delivered on {review.order.deliveryDate}
                            </p>
                        </div>

                        {review.order.specificationsSummary && (
                            <p style={{ margin: '0 0 16px', fontSize: '0.8125rem', color: '#6B7280', lineHeight: 1.5 }}>
                                <strong>Specs:</strong> {review.order.specificationsSummary}
                            </p>
                        )}

                        {/* QC Inspection Stage Photo */}
                        {review.order.inspectionPhoto && (
                            <div style={{ borderTop: '1px solid #EDE8E1', paddingTop: '16px' }}>
                                <p style={{ margin: '0 0 8px', fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase' }}>
                                    QC Inspection Record (Finished Outfit Before Dispatch)
                                </p>
                                <div
                                    onClick={() => setActiveLightboxImage(review.order.inspectionPhoto!)}
                                    style={{
                                        position: 'relative',
                                        height: '160px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        border: '1px solid #EDE8E1',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <img
                                        src={review.order.inspectionPhoto}
                                        alt="QC Inspection photo"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '8px',
                                            right: '8px',
                                            background: 'rgba(0,0,0,0.65)',
                                            color: '#FFFFFF',
                                            fontSize: '0.75rem',
                                            padding: '2px 8px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        Compare Delivery 🔍
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Design Section */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 26px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                            }}
                        >
                            <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                Design Context
                            </h3>
                            <Link
                                href={`/admin/catalogue/${review.design.id}`}
                                style={{
                                    fontSize: '0.8125rem',
                                    color: '#C4975A',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Edit Design ↗
                            </Link>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                            <img
                                src={review.design.thumbnail}
                                alt={review.design.name}
                                style={{
                                    width: '56px',
                                    height: '56px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    border: '1px solid #EDE8E1',
                                    flexShrink: 0,
                                }}
                            />
                            <div>
                                <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {review.design.name}
                                </p>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        color: '#6B7280',
                                        background: '#F3F4F6',
                                        padding: '2px 6px',
                                        borderRadius: '4px',
                                        display: 'inline-block',
                                        marginTop: '4px',
                                    }}
                                >
                                    {review.design.categoryLabel}
                                </span>
                            </div>
                        </div>

                        <div
                            style={{
                                borderTop: '1px solid #EDE8E1',
                                paddingTop: '14px',
                                display: 'grid',
                                gridTemplateColumns: '1fr 1fr',
                                gap: '12px',
                                marginBottom: '16px',
                            }}
                        >
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Design Rating</span>
                                <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {review.design.currentAverageRating} ★
                                </p>
                            </div>
                            <div>
                                <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>Approved Reviews</span>
                                <p style={{ margin: '2px 0 0', fontSize: '0.9375rem', fontWeight: 700, color: '#15803D' }}>
                                    {review.design.totalApprovedReviews} published
                                </p>
                            </div>
                        </div>

                        <Link
                            href={`/admin/catalogue/${review.design.id}/reviews`}
                            style={{
                                display: 'block',
                                textAlign: 'center',
                                padding: '10px',
                                borderRadius: '8px',
                                background: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                                border: '1px solid #EDE8E1',
                            }}
                        >
                            All Reviews for this Garment →
                        </Link>
                    </div>
                </div>
            </div>

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

            {/* Reject Modal */}
            {isRejectModalOpen && (
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
                            Reject Review
                        </h3>
                        <p style={{ margin: '0 0 18px', fontSize: '0.875rem', color: '#6B7280' }}>
                            Please state the internal reason for rejecting this customer review. This will be preserved in the audit log.
                        </p>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '14px' }}>
                            {[
                                'Spam / Advertising',
                                'Profanity / Inappropriate language',
                                'Unverified patron / False claim',
                                'Sizing dispute undergoing alteration',
                            ].map((preset) => (
                                <button
                                    key={preset}
                                    type="button"
                                    onClick={() => setRejectionReason(preset)}
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
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
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
                                onClick={() => setIsRejectModalOpen(false)}
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
                                onClick={handleConfirmReject}
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
            {isFlagModalOpen && (
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
                            Flag for Personal Attention
                        </h3>
                        <p style={{ margin: '0 0 18px', fontSize: '0.875rem', color: '#6B7280' }}>
                            Record instructions or questions for Samuelson regarding this review. Clear the text to unflag.
                        </p>

                        <textarea
                            rows={3}
                            placeholder="Enter follow-up instructions..."
                            value={flagNote}
                            onChange={(e) => setFlagNote(e.target.value)}
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
                                onClick={() => setIsFlagModalOpen(false)}
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
                                Save Flag Note
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
