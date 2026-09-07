'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
    CatalogueDesign,
    DesignReviewItem,
    getAllDesigns,
    saveDesign,
} from '@/data/adminCatalogueData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconStar = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#D1D5DB'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
)

export default function DesignReviewsPage() {
    const params = useParams()
    const router = useRouter()
    const designId = params?.id as string

    const [design, setDesign] = useState<CatalogueDesign | null>(null)
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL')
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Load design
    useEffect(() => {
        const all = getAllDesigns()
        const found = all.find((d) => d.id === designId || d.slug === designId)
        if (found) {
            setDesign(found)
        }
    }, [designId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // Filter reviews (Hook called at top level before early returns)
    const filteredReviews = useMemo(() => {
        if (!design) return []
        return design.reviews.filter((r) => {
            if (statusFilter !== 'ALL' && r.status !== statusFilter) return false
            return true
        })
    }, [design, statusFilter])

    // Rating distribution
    const starCounts = useMemo(() => {
        if (!design) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, total: 0 }
        const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0, total: design.reviews.length }
        design.reviews.forEach((r) => {
            const stars = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
            counts[stars] = (counts[stars] || 0) + 1
        })
        return counts
    }, [design])

    if (!design) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>Design not found</h2>
                <Link
                    href="/admin/catalogue"
                    style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        padding: '0.625rem 1.25rem',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textDecoration: 'none',
                    }}
                >
                    Back to Catalogue
                </Link>
            </div>
        )
    }

    // Status change handler
    const handleUpdateReviewStatus = (reviewId: string, newStatus: 'APPROVED' | 'REJECTED') => {
        const updatedReviews: DesignReviewItem[] = design.reviews.map((r) =>
            r.id === reviewId ? { ...r, status: newStatus } : r
        )
        const updatedDesign: CatalogueDesign = {
            ...design,
            reviews: updatedReviews,
        }
        saveDesign(updatedDesign)
        setDesign(updatedDesign)
        showToast(`Review marked as ${newStatus}`)
    }

    const coverPhoto = design.photos.find((p) => p.isCover)?.url || design.photos[0]?.url || '/images/design-agbada.jpg'

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
            {/* Toast */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        backgroundColor: '#1C0F07',
                        color: '#FFFFFF',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* ─── Back Nav & Header Bar ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Link
                    href={`/admin/catalogue/${design.id}`}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: '#8A7A6E',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        width: 'fit-content',
                    }}
                >
                    <IconArrowLeft />
                    <span>Back to Design Editor: {design.contentEN.name}</span>
                </Link>

                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.25rem',
                    }}
                >
                    {/* Left: Cover thumbnail & Title */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{ width: '60px', height: '70px', borderRadius: '8px', overflow: 'hidden', position: 'relative', backgroundColor: '#F3EFE9', flexShrink: 0 }}>
                            <Image src={coverPhoto} alt={design.contentEN.name} fill style={{ objectFit: 'cover' }} />
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                                    Reviews for {design.contentEN.name}
                                </h1>
                                <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.2rem 0.55rem', borderRadius: '6px', backgroundColor: '#FDF3E7', color: '#C4975A' }}>
                                    {design.categoryLabel}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.825rem', color: '#8A7A6E', marginTop: '0.25rem' }}>
                                Moderation queue for this specific bespoke piece • {design.reviews.length} reviews logged
                            </div>
                        </div>
                    </div>

                    {/* Right: Link to full moderation queue */}
                    <Link
                        href="/admin/reviews"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #E0D7CB',
                            padding: '0.6rem 1rem',
                            borderRadius: '8px',
                            color: '#1C0F07',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        <span>Full Reviews Queue →</span>
                    </Link>
                </div>
            </div>

            {/* ─── Star Rating Breakdown Card ───────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 180px) minmax(0, 1fr)',
                    gap: '2rem',
                    alignItems: 'center',
                }}
            >
                {/* Average Score */}
                <div style={{ textAlign: 'center', borderRight: '1px solid #F3EFE9', paddingRight: '1.5rem' }}>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: '#1C0F07', lineHeight: 1 }}>
                        {design.stats.averageRating}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '3px', margin: '0.5rem 0' }}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <IconStar key={s} filled={s <= Math.round(design.stats.averageRating)} />
                        ))}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                        Based on {design.reviews.length} ratings
                    </div>
                </div>

                {/* Progress Bars for 5 to 1 star */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {[5, 4, 3, 2, 1].map((stars) => {
                        const count = (starCounts as any)[stars] || 0
                        const pct = starCounts.total > 0 ? (count / starCounts.total) * 100 : 0

                        return (
                            <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8rem' }}>
                                <span style={{ width: '45px', color: '#6E5D4F', fontWeight: 600 }}>
                                    {stars} ★
                                </span>
                                <div style={{ flex: 1, height: '8px', backgroundColor: '#F3EFE9', borderRadius: '9999px', overflow: 'hidden' }}>
                                    <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#C4975A', borderRadius: '9999px' }} />
                                </div>
                                <span style={{ width: '25px', textAlign: 'right', color: '#8A7A6E', fontWeight: 700 }}>
                                    {count}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* ─── Reviews Filter Tabs ──────────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    padding: '0.75rem 1rem',
                    border: '1px solid #EDE8E1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((st) => (
                        <button
                            key={st}
                            type="button"
                            onClick={() => setStatusFilter(st)}
                            style={{
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                fontWeight: statusFilter === st ? 700 : 500,
                                backgroundColor: statusFilter === st ? '#FDF3E7' : 'transparent',
                                color: statusFilter === st ? '#C4975A' : '#6E5D4F',
                            }}
                        >
                            {st === 'ALL' ? 'All Reviews' : st.charAt(0) + st.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                    Showing {filteredReviews.length} of {design.reviews.length} reviews
                </div>
            </div>

            {/* ─── Reviews List ─────────────────────────────────────────────────────── */}
            {filteredReviews.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredReviews.map((review) => {
                        const isApproved = review.status === 'APPROVED'
                        const isRejected = review.status === 'REJECTED'

                        return (
                            <div
                                key={review.id}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '14px',
                                    padding: '1.25rem 1.5rem',
                                    border: '1px solid #EDE8E1',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1C0F07' }}>
                                            {review.customerName}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.15rem' }}>
                                            Submitted on {review.date}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        {/* Status Badge */}
                                        <span
                                            style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                padding: '0.2rem 0.55rem',
                                                borderRadius: '6px',
                                                backgroundColor: isApproved ? '#DCFCE7' : isRejected ? '#FEE2E2' : '#FEF3CD',
                                                color: isApproved ? '#166534' : isRejected ? '#DC2626' : '#92600A',
                                            }}
                                        >
                                            {review.status}
                                        </span>

                                        {/* Stars */}
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <IconStar key={s} filled={s <= review.rating} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Comment */}
                                <p style={{ fontSize: '0.875rem', color: '#3A2B20', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>
                                    &ldquo;{review.comment}&rdquo;
                                </p>

                                {/* Action Buttons (Approve / Reject) */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid #F3EFE9' }}>
                                    <button
                                        type="button"
                                        disabled={isRejected}
                                        onClick={() => handleUpdateReviewStatus(review.id, 'REJECTED')}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            backgroundColor: '#FFF5F5',
                                            border: '1px solid #FCA5A5',
                                            color: '#DC2626',
                                            padding: '0.4rem 0.75rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: isRejected ? 'not-allowed' : 'pointer',
                                            opacity: isRejected ? 0.6 : 1,
                                        }}
                                    >
                                        <IconX />
                                        <span>Reject</span>
                                    </button>

                                    <button
                                        type="button"
                                        disabled={isApproved}
                                        onClick={() => handleUpdateReviewStatus(review.id, 'APPROVED')}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            backgroundColor: isApproved ? '#DCFCE7' : '#166534',
                                            border: 'none',
                                            color: isApproved ? '#166534' : '#FFFFFF',
                                            padding: '0.4rem 0.95rem',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: isApproved ? 'default' : 'pointer',
                                        }}
                                    >
                                        <IconCheck />
                                        <span>{isApproved ? 'Approved' : 'Approve Review'}</span>
                                    </button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        color: '#8A7A6E',
                        border: '1px solid #EDE8E1',
                    }}
                >
                    No reviews in this status for {design.contentEN.name}.
                </div>
            )}
        </div>
    )
}
