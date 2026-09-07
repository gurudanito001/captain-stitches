'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
    AdminCustomer,
    CustomerMeasurementsCm,
    getAllCustomers,
    saveCustomer,
    deleteCustomer,
} from '@/data/adminCustomersData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconWhatsApp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
)

const IconEdit = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
)

const IconMoreVertical = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
)

const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

const IconStar = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#D1D5DB'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
)

const IconChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#8A7A6E', flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
)

export default function CustomerProfilePage() {
    const params = useParams()
    const router = useRouter()
    const customerId = params?.id as string

    const [customer, setCustomer] = useState<AdminCustomer | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [copiedRef, setCopiedRef] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Inline edit for personal details
    const [isEditingPersonal, setIsEditingPersonal] = useState(false)
    const [personalForm, setPersonalForm] = useState({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        language: 'EN' as 'EN' | 'IT',
        currency: 'EUR' as 'EUR' | 'NGN',
        location: 'Italy' as 'Italy' | 'Nigeria',
        address: '',
    })

    // Inline edit for measurements
    const [isEditingMeasurements, setIsEditingMeasurements] = useState(false)
    const [measurementsForm, setMeasurementsForm] = useState<CustomerMeasurementsCm>({
        chest: 0,
        shoulder: 0,
        sleeve: 0,
        waist: 0,
        hips: 0,
        inseam: 0,
        neck: 0,
        length: 0,
        fitNotes: '',
        lastUpdated: '',
    })

    // Order history filters
    const [orderStatusFilter, setOrderStatusFilter] = useState('ALL')
    const [orderYearFilter, setOrderYearFilter] = useState('ALL')

    // Admin note form
    const [newAdminNote, setNewAdminNote] = useState('')

    // Manual reward modal
    const [showRewardModal, setShowRewardModal] = useState(false)
    const [rewardType, setRewardType] = useState('10% VIP Discount')
    const [rewardValue, setRewardValue] = useState('€20 Voucher')

    // Merge modal
    const [showMergeModal, setShowMergeModal] = useState(false)
    const [mergeTargetId, setMergeTargetId] = useState('')

    // Load customer
    useEffect(() => {
        const all = getAllCustomers()
        const found = all.find((c) => c.id === customerId || c.name.toLowerCase() === customerId.toLowerCase())
        if (found) {
            setCustomer(found)
            setPersonalForm({
                name: found.name,
                email: found.email,
                phone: found.phone,
                whatsapp: found.whatsapp,
                language: found.language,
                currency: found.currency,
                location: found.location,
                address: found.address,
            })
            setMeasurementsForm({ ...found.measurements })
        }
    }, [customerId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // Filtered order history
    const filteredOrders = useMemo(() => {
        if (!customer) return []
        return customer.ordersHistory.filter((o) => {
            if (orderStatusFilter !== 'ALL' && o.status !== orderStatusFilter) return false
            if (orderYearFilter !== 'ALL' && !o.date.includes(orderYearFilter)) return false
            return true
        })
    }, [customer, orderStatusFilter, orderYearFilter])

    if (!customer) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>Customer not found</h2>
                <Link
                    href="/admin/customers"
                    style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        padding: '0.625rem 1.25rem',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    Back to Customer Directory
                </Link>
            </div>
        )
    }

    // Direct WhatsApp Chat
    const handleWhatsAppChat = () => {
        const cleanPhone = customer.whatsapp.replace(/[^0-9]/g, '')
        const greeting = encodeURIComponent(
            `Hello ${customer.name}, this is Samuelson from CaptainStitches. Reaching out regarding your bespoke commissions.`
        )
        window.open(`https://wa.me/${cleanPhone}?text=${greeting}`, '_blank')
    }

    // Copy referral link
    const handleCopyReferral = () => {
        const link = `https://captainstitches.com/ref/${customer.referrals[0]?.refCode || 'CAPTAIN'}`
        navigator.clipboard.writeText(link)
        setCopiedRef(true)
        showToast('Referral link copied!')
        setTimeout(() => setCopiedRef(false), 2500)
    }

    // Save personal details
    const handleSavePersonal = (e: React.FormEvent) => {
        e.preventDefault()
        const updated: AdminCustomer = {
            ...customer,
            ...personalForm,
        }
        saveCustomer(updated)
        setCustomer(updated)
        setIsEditingPersonal(false)
        showToast('Personal details updated')
    }

    // Save measurements
    const handleSaveMeasurements = (e: React.FormEvent) => {
        e.preventDefault()
        const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        const updated: AdminCustomer = {
            ...customer,
            measurements: {
                ...measurementsForm,
                lastUpdated: now,
            },
        }
        saveCustomer(updated)
        setCustomer(updated)
        setIsEditingMeasurements(false)
        showToast('Measurements saved and will auto-fill future orders')
    }

    // Add Admin Note
    const handleAddAdminNote = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAdminNote.trim()) return
        const updated: AdminCustomer = {
            ...customer,
            adminNotes: [
                {
                    id: `cn-${Date.now()}`,
                    author: 'Samuelson (Admin)',
                    text: newAdminNote.trim(),
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                },
                ...customer.adminNotes,
            ],
        }
        saveCustomer(updated)
        setCustomer(updated)
        setNewAdminNote('')
        showToast('Admin note appended')
    }

    // Toggle email subscription
    const handleToggleEmailSub = () => {
        const updated: AdminCustomer = {
            ...customer,
            emailMarketing: {
                ...customer.emailMarketing,
                isSubscribed: !customer.emailMarketing.isSubscribed,
            },
        }
        saveCustomer(updated)
        setCustomer(updated)
        showToast(`Email status updated to ${updated.emailMarketing.isSubscribed ? 'Subscribed' : 'Unsubscribed'}`)
    }

    // Issue manual reward
    const handleIssueReward = (e: React.FormEvent) => {
        e.preventDefault()
        const newReward = {
            id: `r-${Date.now()}`,
            type: rewardType,
            value: rewardValue,
            status: 'CREDITED' as const,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }
        const updatedReferrals = customer.referrals[0]
            ? {
                  ...customer.referrals[0],
                  rewardsEarned: [newReward, ...customer.referrals[0].rewardsEarned],
              }
            : {
                  refCode: `CS-${customer.name.split(' ')[0].toUpperCase()}88`,
                  totalReferred: 0,
                  convertedCount: 0,
                  rewardsEarned: [newReward],
              }

        const updated: AdminCustomer = {
            ...customer,
            referrals: [updatedReferrals],
        }
        saveCustomer(updated)
        setCustomer(updated)
        setShowRewardModal(false)
        showToast(`Reward issued: ${rewardType} (${rewardValue})`)
    }

    // Delete customer handler
    const handleDeleteCustomer = () => {
        setIsMenuOpen(false)
        if (confirm(`Are you sure you want to permanently delete ${customer.name}? This cannot be undone.`)) {
            deleteCustomer(customer.id)
            router.push('/admin/customers')
        }
    }


    const initials = customer.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
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
                    href="/admin/customers"
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
                    <span>Back to Customer Directory</span>
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
                    {/* Left: Avatar, Name, Location Badge, Date Joined */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '9999px',
                                backgroundColor: customer.avatarColor,
                                color: '#FFFFFF',
                                fontSize: '1.25rem',
                                fontWeight: 800,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                            }}
                        >
                            {initials}
                        </div>

                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0F07', margin: 0, letterSpacing: '-0.02em' }}>
                                    {customer.name}
                                </h1>
                                <span
                                    style={{
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '6px',
                                        backgroundColor: '#FDF3E7',
                                        color: '#C4975A',
                                        border: '1px solid #EAD8C3',
                                    }}
                                >
                                    {customer.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.825rem', color: '#8A7A6E', marginTop: '0.25rem' }}>
                                Member since {customer.dateJoined} • Preferred currency: {customer.currency} • Language: {customer.language}
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* One-Tap WhatsApp */}
                        <button
                            type="button"
                            onClick={handleWhatsAppChat}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                backgroundColor: '#25D366',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0.625rem 1.125rem',
                                borderRadius: '9px',
                                fontSize: '0.825rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(37,211,102,0.25)',
                            }}
                        >
                            <IconWhatsApp />
                            <span>WhatsApp Chat</span>
                        </button>

                        {/* Edit Button */}
                        <Link
                            href={`/admin/customers/${customer.id}/edit`}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E4DDD3',
                                color: '#1C0F07',
                                padding: '0.625rem 1rem',
                                borderRadius: '9px',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            <IconEdit />
                            <span>Edit</span>
                        </Link>

                        {/* Three-Dot Menu */}
                        <div style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                style={{
                                    border: '1px solid #E4DDD3',
                                    backgroundColor: '#FAF7F2',
                                    color: '#6E5D4F',
                                    borderRadius: '8px',
                                    padding: '0.55rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <IconMoreVertical />
                            </button>

                            {isMenuOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '110%',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #EDE8E1',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                                        width: '180px',
                                        zIndex: 30,
                                        padding: '0.4rem 0',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                            setShowMergeModal(true)
                                        }}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            background: 'none',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.8125rem',
                                            color: '#1C0F07',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Merge Record...
                                    </button>
                                    <div style={{ height: '1px', backgroundColor: '#F3EFE9', margin: '0.3rem 0' }} />
                                    <button
                                        type="button"
                                        onClick={handleDeleteCustomer}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            background: 'none',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.8125rem',
                                            color: '#DC2626',
                                            cursor: 'pointer',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Delete Customer
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Summary Strip (5 KPIs) ────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '1rem',
                }}
            >
                {[
                    { label: 'Total Orders', val: customer.summary.totalOrders, sub: 'All-time bespoke' },
                    {
                        label: 'Total Spent',
                        val: customer.currency === 'EUR' ? `€${customer.summary.totalSpentEUR}` : `₦${customer.summary.totalSpentNGN.toLocaleString()}`,
                        sub: customer.currency === 'EUR' ? `~₦${customer.summary.totalSpentNGN.toLocaleString()}` : `~€${customer.summary.totalSpentEUR}`,
                    },
                    { label: 'Last Order', val: customer.summary.lastOrderDate, sub: 'Atelier activity' },
                    { label: 'Referrals Converted', val: `${customer.referrals[0]?.convertedCount || 0} / ${customer.summary.referralCount}`, sub: 'Invited friends' },
                    {
                        label: 'Review Rating',
                        val: customer.summary.averageRating > 0 ? `${customer.summary.averageRating} ★` : '—',
                        sub: customer.reviews.length > 0 ? `${customer.reviews.length} feedback given` : 'No reviews yet',
                    },
                ].map((kpi, idx) => (
                    <div
                        key={idx}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '14px',
                            padding: '1.25rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                            {kpi.label}
                        </div>
                        <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.35rem' }}>
                            {kpi.val}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#A8998C', marginTop: '0.2rem' }}>
                            {kpi.sub}
                        </div>
                    </div>
                ))}
            </div>

            {/* ─── Main Two-Column Layout ────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
                    gap: '1.5rem',
                    alignItems: 'start',
                }}
            >
                {/* ── LEFT COLUMN: Personal Details, Measurements, Orders History ────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* 1. Personal Details Section */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Personal & Delivery Details
                            </h2>
                            <button
                                type="button"
                                onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#C4975A',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                            >
                                {isEditingPersonal ? 'Cancel Edit' : 'Edit Inline'}
                            </button>
                        </div>

                        {!isEditingPersonal ? (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', fontSize: '0.825rem' }}>
                                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Full Name</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>{customer.name}</div>
                                </div>
                                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Email Address</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>{customer.email || '—'}</div>
                                </div>
                                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Phone Number</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>{customer.phone}</div>
                                </div>
                                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>WhatsApp Number</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#166534', marginTop: '0.2rem' }}>{customer.whatsapp}</div>
                                </div>
                                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Language & Currency</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>
                                        {customer.language === 'IT' ? 'Italian (IT)' : 'English (EN)'} • {customer.currency}
                                    </div>
                                </div>
                                <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Location</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>
                                        {customer.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2', backgroundColor: '#FAF7F2', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Default Delivery Address</div>
                                    <div style={{ fontSize: '0.9rem', color: '#3A2B20', marginTop: '0.2rem' }}>{customer.address}</div>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSavePersonal} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Full Name</label>
                                    <input
                                        type="text"
                                        value={personalForm.name}
                                        onChange={(e) => setPersonalForm({ ...personalForm, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        value={personalForm.email}
                                        onChange={(e) => setPersonalForm({ ...personalForm, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Phone</label>
                                    <input
                                        type="text"
                                        value={personalForm.phone}
                                        onChange={(e) => setPersonalForm({ ...personalForm, phone: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>WhatsApp</label>
                                    <input
                                        type="text"
                                        value={personalForm.whatsapp}
                                        onChange={(e) => setPersonalForm({ ...personalForm, whatsapp: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Delivery Address</label>
                                    <input
                                        type="text"
                                        value={personalForm.address}
                                        onChange={(e) => setPersonalForm({ ...personalForm, address: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingPersonal(false)}
                                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E0D7CB', backgroundColor: '#FAF7F2', fontSize: '0.8rem' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#C4975A', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem' }}
                                    >
                                        Save Details
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>

                    {/* 2. Measurements Section (In Centimetres) */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Saved Measurements (Centimetres)
                                </h2>
                                <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                    Last updated on {customer.measurements.lastUpdated}. Auto-fills for every new bespoke order.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditingMeasurements(!isEditingMeasurements)}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#C4975A',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                            >
                                {isEditingMeasurements ? 'Cancel' : 'Edit Measurements'}
                            </button>
                        </div>

                        <form onSubmit={handleSaveMeasurements}>
                            {/* 8 Measurements Grid in cm */}
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(4, 1fr)',
                                    gap: '0.85rem',
                                    marginBottom: '1rem',
                                }}
                            >
                                {[
                                    { key: 'chest', label: 'Chest' },
                                    { key: 'shoulder', label: 'Shoulder' },
                                    { key: 'sleeve', label: 'Sleeve Length' },
                                    { key: 'waist', label: 'Waist' },
                                    { key: 'hips', label: 'Hips' },
                                    { key: 'inseam', label: 'Inseam' },
                                    { key: 'neck', label: 'Neck' },
                                    { key: 'length', label: 'Garment Length' },
                                ].map((item) => (
                                    <div
                                        key={item.key}
                                        style={{
                                            backgroundColor: '#FAF7F2',
                                            borderRadius: '10px',
                                            padding: '0.75rem',
                                            border: '1px solid #EAE3D9',
                                            textAlign: 'center',
                                        }}
                                    >
                                        <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 600, textTransform: 'uppercase' }}>
                                            {item.label} (cm)
                                        </div>
                                        {isEditingMeasurements ? (
                                            <input
                                                type="number"
                                                step="0.5"
                                                value={measurementsForm[item.key as keyof CustomerMeasurementsCm] as number}
                                                onChange={(e) =>
                                                    setMeasurementsForm({
                                                        ...measurementsForm,
                                                        [item.key]: parseFloat(e.target.value) || 0,
                                                    })
                                                }
                                                style={{
                                                    width: '100%',
                                                    padding: '0.35rem',
                                                    textAlign: 'center',
                                                    borderRadius: '6px',
                                                    border: '1px solid #C4975A',
                                                    fontSize: '1rem',
                                                    fontWeight: 800,
                                                    color: '#1C0F07',
                                                    marginTop: '0.2rem',
                                                }}
                                            />
                                        ) : (
                                            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.2rem' }}>
                                                {customer.measurements[item.key as keyof CustomerMeasurementsCm]}
                                                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#8A7A6E', marginLeft: '0.15rem' }}>cm</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Fit Notes */}
                            <div style={{ marginBottom: '1rem' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                    Patron Fit Preferences & Tailoring Notes
                                </label>
                                {isEditingMeasurements ? (
                                    <input
                                        type="text"
                                        value={measurementsForm.fitNotes || ''}
                                        onChange={(e) => setMeasurementsForm({ ...measurementsForm, fitNotes: e.target.value })}
                                        style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                ) : (
                                    <div style={{ backgroundColor: '#FFFDF9', border: '1px solid #EAD8C3', borderRadius: '8px', padding: '0.75rem 1rem', fontSize: '0.825rem', color: '#6E5D4F' }}>
                                        <strong style={{ color: '#C4975A' }}>Fit Notes: </strong>
                                        {customer.measurements.fitNotes || 'Standard fit preferences.'}
                                    </div>
                                )}
                            </div>

                            {isEditingMeasurements && (
                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingMeasurements(false)}
                                        style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E0D7CB', backgroundColor: '#FAF7F2', fontSize: '0.8rem' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#166534', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem' }}
                                    >
                                        Save Measurements (cm)
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* 3. Order History Section */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Order History ({customer.ordersHistory.length})
                                </h2>
                                <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                    Chronological timeline of all atelier garments crafted for {customer.name}.
                                </p>
                            </div>

                            {/* Shortcut: Create new order for this customer */}
                            <Link
                                href={`/admin/orders/new`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.4rem',
                                    backgroundColor: '#C4975A',
                                    color: '#FFFFFF',
                                    padding: '0.5rem 0.95rem',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                    boxShadow: '0 2px 5px rgba(196,151,90,0.25)',
                                }}
                            >
                                <span>+ New Order for {customer.name.split(' ')[0]}</span>
                            </Link>
                        </div>

                        {/* Order History Table */}
                        {customer.ordersHistory.length > 0 ? (
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D9' }}>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase' }}>Garment</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase' }}>Order ID</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase' }}>Date</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase' }}>Amount</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase' }}>Status</th>
                                        <th style={{ padding: '0.75rem 1rem', fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOrders.map((o) => (
                                        <tr key={o.orderId} style={{ borderBottom: '1px solid #F3EFE9' }}>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                    <div style={{ width: '36px', height: '42px', position: 'relative', borderRadius: '6px', overflow: 'hidden', backgroundColor: '#F3EFE9' }}>
                                                        <Image src={o.thumbnail} alt={o.garmentName} fill style={{ objectFit: 'cover' }} />
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C0F07' }}>
                                                        {o.garmentName}
                                                    </div>
                                                </div>
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#C4975A' }}>
                                                {o.orderNumber}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem', color: '#6E5D4F' }}>
                                                {o.date}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem', fontSize: '0.825rem', fontWeight: 700, color: '#1C0F07' }}>
                                                {customer.currency === 'EUR' ? `€${o.amountEUR}` : `₦${o.amountNGN.toLocaleString()}`}
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <span
                                                    style={{
                                                        fontSize: '0.7rem',
                                                        fontWeight: 700,
                                                        padding: '0.15rem 0.5rem',
                                                        borderRadius: '9999px',
                                                        backgroundColor: o.status === 'DELIVERED' ? '#DCFCE7' : '#FDF3E7',
                                                        color: o.status === 'DELIVERED' ? '#166534' : '#C4975A',
                                                    }}
                                                >
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td style={{ padding: '0.85rem 1rem' }}>
                                                <Link
                                                    href={`/admin/orders/${o.orderId}`}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        fontSize: '0.75rem',
                                                        color: '#C4975A',
                                                        fontWeight: 700,
                                                        textDecoration: 'none',
                                                    }}
                                                >
                                                    <span>View</span>
                                                    <IconChevronRight />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#8A7A6E', fontSize: '0.85rem', backgroundColor: '#FAF7F2', borderRadius: '10px' }}>
                                No orders logged yet for this client.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Reviews, Referrals, Marketing, Subscription, Notes ─ */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* 1. Reviews Submitted */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Reviews Submitted ({customer.reviews.length})
                            </h2>
                            <Link href="/admin/reviews" style={{ fontSize: '0.75rem', color: '#C4975A', fontWeight: 700, textDecoration: 'none' }}>
                                Moderation Queue →
                            </Link>
                        </div>

                        {customer.reviews.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                {customer.reviews.map((r) => (
                                    <div
                                        key={r.id}
                                        style={{
                                            backgroundColor: '#FAF7F2',
                                            borderRadius: '10px',
                                            padding: '0.85rem',
                                            border: '1px solid #EAE3D9',
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#1C0F07' }}>
                                                {r.designName}
                                            </span>
                                            <div style={{ display: 'flex', gap: '2px' }}>
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <IconStar key={s} filled={s <= r.rating} />
                                                ))}
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#3A2B20', lineHeight: 1.35, margin: 0, fontStyle: 'italic' }}>
                                            &ldquo;{r.comment}&rdquo;
                                        </p>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.7rem', color: '#8A7A6E' }}>
                                            <span>{r.date}</span>
                                            <span style={{ fontWeight: 700, color: r.status === 'APPROVED' ? '#166534' : '#D97706' }}>
                                                {r.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ fontSize: '0.8rem', color: '#8A7A6E', fontStyle: 'italic', padding: '1rem 0' }}>
                                No reviews submitted yet.
                            </div>
                        )}
                    </div>

                    {/* 2. Referrals & Rewards Tracker */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Referral Ambassador Tracker
                            </h2>
                            <button
                                type="button"
                                onClick={() => setShowRewardModal(true)}
                                style={{
                                    border: 'none',
                                    backgroundColor: '#FDF3E7',
                                    color: '#C4975A',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.3rem 0.65rem',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                }}
                            >
                                + Issue Reward
                            </button>
                        </div>

                        {/* Referral Link Box */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #EAE3D9',
                                borderRadius: '8px',
                                padding: '0.6rem 0.85rem',
                                marginBottom: '1rem',
                            }}
                        >
                            <code style={{ fontSize: '0.75rem', color: '#1C0F07', fontWeight: 600 }}>
                                ref/{customer.referrals[0]?.refCode || 'CAPTAIN'}
                            </code>
                            <button
                                type="button"
                                onClick={handleCopyReferral}
                                style={{
                                    border: 'none',
                                    background: 'transparent',
                                    color: '#C4975A',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.25rem',
                                    cursor: 'pointer',
                                }}
                            >
                                <IconCopy />
                                <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                            </button>
                        </div>

                        {/* Referral Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                            <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 600, textTransform: 'uppercase' }}>Invited Friends</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.15rem' }}>
                                    {customer.referrals[0]?.totalReferred || 0}
                                </div>
                            </div>
                            <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 600, textTransform: 'uppercase' }}>Paid Conversions</div>
                                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#166534', marginTop: '0.15rem' }}>
                                    {customer.referrals[0]?.convertedCount || 0}
                                </div>
                            </div>
                        </div>

                        {/* Rewards Earned List */}
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                                Rewards History ({customer.referrals[0]?.rewardsEarned.length || 0})
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {customer.referrals[0]?.rewardsEarned.map((rew) => (
                                    <div
                                        key={rew.id}
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: '#FAF7F2',
                                            padding: '0.65rem 0.85rem',
                                            borderRadius: '8px',
                                            fontSize: '0.78rem',
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#1C0F07' }}>{rew.type}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#8A7A6E' }}>
                                                {rew.value} • {rew.date}
                                                {rew.orderApplied && ` • Applied to ${rew.orderApplied}`}
                                            </div>
                                        </div>
                                        <span
                                            style={{
                                                fontSize: '0.675rem',
                                                fontWeight: 700,
                                                padding: '0.15rem 0.45rem',
                                                borderRadius: '4px',
                                                backgroundColor: rew.status === 'REDEEMED' ? '#F3F4F6' : '#DCFCE7',
                                                color: rew.status === 'REDEEMED' ? '#6B7280' : '#166534',
                                            }}
                                        >
                                            {rew.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 3. Email & Marketing Section */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1rem' }}>
                            Email Marketing & Newsletter
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#8A7A6E' }}>Subscription Status:</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span
                                        style={{
                                            fontWeight: 700,
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '4px',
                                            backgroundColor: customer.emailMarketing.isSubscribed ? '#DCFCE7' : '#F3F4F6',
                                            color: customer.emailMarketing.isSubscribed ? '#166534' : '#6B7280',
                                        }}
                                    >
                                        {customer.emailMarketing.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={handleToggleEmailSub}
                                        style={{
                                            border: 'none',
                                            background: 'transparent',
                                            color: '#C4975A',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                            textDecoration: 'underline',
                                        }}
                                    >
                                        {customer.emailMarketing.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
                                    </button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#8A7A6E' }}>Signup Source:</span>
                                <span style={{ fontWeight: 600, color: '#1C0F07' }}>{customer.emailMarketing.source}</span>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#8A7A6E' }}>Email Language:</span>
                                <span style={{ fontWeight: 600, color: '#1C0F07' }}>
                                    {customer.emailMarketing.language === 'IT' ? 'Italiano (IT)' : 'English (EN)'}
                                </span>
                            </div>

                            {customer.emailMarketing.lastOpenedEmail && (
                                <div style={{ backgroundColor: '#FAF7F2', padding: '0.65rem 0.85rem', borderRadius: '8px', fontSize: '0.75rem', color: '#6E5D4F' }}>
                                    <strong style={{ color: '#1C0F07' }}>Recent Activity: </strong>
                                    {customer.emailMarketing.lastOpenedEmail}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 4. Dormant Subscription Section (Feature Flagged) */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                            opacity: 0.9,
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Subscription Membership
                            </h2>
                            <span
                                style={{
                                    fontSize: '0.675rem',
                                    fontWeight: 800,
                                    backgroundColor: '#F3EFE9',
                                    color: '#8A7A6E',
                                    padding: '0.2rem 0.5rem',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase',
                                }}
                            >
                                Coming Soon
                            </span>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#8A7A6E', margin: 0, marginBottom: '1rem', lineHeight: 1.4 }}>
                            Tiered wardrobe memberships are dormant at launch. This section becomes active when the recurring subscription feature flag is enabled.
                        </p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', opacity: 0.5 }}>
                            {['Standard', 'Priority', 'VIP Bespoke'].map((tier) => (
                                <div
                                    key={tier}
                                    style={{
                                        border: '1px dashed #D1D5DB',
                                        borderRadius: '8px',
                                        padding: '0.65rem 0.35rem',
                                        textAlign: 'center',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#6B7280',
                                        backgroundColor: '#F9FAFB',
                                    }}
                                >
                                    {tier}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 5. Internal Admin Notes */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '0.5rem' }}>
                            Internal Admin Notes
                        </h2>
                        <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginBottom: '1rem' }}>
                            Private client dossier notes. Never visible to the customer.
                        </p>

                        {/* Existing notes thread */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', maxHeight: '180px', overflowY: 'auto' }}>
                            {customer.adminNotes.map((n) => (
                                <div
                                    key={n.id}
                                    style={{
                                        backgroundColor: '#FAF7F2',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        border: '1px solid #EAE3D9',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8A7A6E', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        <span style={{ color: '#C4975A' }}>{n.author}</span>
                                        <span>{n.timestamp}</span>
                                    </div>
                                    <div style={{ color: '#3A2B20', lineHeight: 1.35 }}>{n.text}</div>
                                </div>
                            ))}
                        </div>

                        {/* Add note input */}
                        <form onSubmit={handleAddAdminNote} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                placeholder="Add an internal observation..."
                                value={newAdminNote}
                                onChange={(e) => setNewAdminNote(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E0D7CB',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '0.825rem',
                                    outline: 'none',
                                }}
                            />
                            <button
                                type="submit"
                                style={{
                                    backgroundColor: '#C4975A',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.5rem 0.85rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Add
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {/* ─── Manual Reward Modal ──────────────────────────────────────────────── */}
            {showRewardModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.75rem',
                            maxWidth: '440px',
                            width: '100%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                            Issue Manual Reward to {customer.name}
                        </h3>
                        <p style={{ fontSize: '0.825rem', color: '#6E5D4F', margin: 0 }}>
                            Manually credit an ambassador voucher or bespoke perk.
                        </p>

                        <form onSubmit={handleIssueReward} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Reward Title / Perk</label>
                                <input
                                    type="text"
                                    value={rewardType}
                                    onChange={(e) => setRewardType(e.target.value)}
                                    placeholder="e.g. 15% VIP Next Commission"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Credit Value</label>
                                <input
                                    type="text"
                                    value={rewardValue}
                                    onChange={(e) => setRewardValue(e.target.value)}
                                    placeholder="e.g. €25 Voucher or ₦20,000 Credit"
                                    style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowRewardModal(false)}
                                    style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E0D7CB', backgroundColor: '#FAF7F2', fontSize: '0.8rem' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '0.5rem 1.25rem', borderRadius: '8px', border: 'none', backgroundColor: '#C4975A', color: '#FFFFFF', fontWeight: 700, fontSize: '0.8rem' }}
                                >
                                    Issue Reward
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ─── Merge Duplicate Records Modal ────────────────────────────────────── */}
            {showMergeModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.75rem',
                            maxWidth: '440px',
                            width: '100%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                            Merge Duplicate Profile
                        </h3>
                        <p style={{ fontSize: '0.825rem', color: '#6E5D4F', margin: 0 }}>
                            Select another customer record to merge into {customer.name}. All past orders and notes will be unified.
                        </p>

                        <select
                            value={mergeTargetId}
                            onChange={(e) => setMergeTargetId(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        >
                            <option value="">Select client to merge...</option>
                            {getAllCustomers()
                                .filter((c) => c.id !== customer.id)
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.name} ({c.whatsapp} • {c.location})
                                    </option>
                                ))}
                        </select>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowMergeModal(false)}
                                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #E0D7CB', backgroundColor: '#FAF7F2', fontSize: '0.8rem' }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                disabled={!mergeTargetId}
                                onClick={() => {
                                    setShowMergeModal(false)
                                    showToast('Client records successfully merged')
                                }}
                                style={{
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: mergeTargetId ? '#C4975A' : '#E0D7CB',
                                    color: '#FFFFFF',
                                    fontWeight: 700,
                                    fontSize: '0.8rem',
                                    cursor: mergeTargetId ? 'pointer' : 'not-allowed',
                                }}
                            >
                                Confirm Merge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
