'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
    AdminOrder,
    OrderStatus,
    STAGES_PIPELINE,
    TAILORS_ROSTER,
    getAllOrders,
    updateOrder,
} from '@/data/adminOrdersData'
import {
    updateOrderStatusAdminAction,
    getAllOrdersAdminAction,
    uploadOrderInspectionMediaAction,
} from '@/lib/actions/orders'
import { uploadMediaAction } from '@/lib/actions/upload'
import { parseColour } from '@/lib/utils/colours'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconWhatsApp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
)

const IconMoreVertical = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
)

const IconUploadCloud = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', flexShrink: 0, color: '#C4975A' }}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
)

const IconShieldCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" /></svg>
)

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0, color: '#8A7A6E' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
)

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = params?.id as string

    const [order, setOrder] = useState<AdminOrder | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [copiedLink, setCopiedLink] = useState(false)
    const [newAdminNote, setNewAdminNote] = useState('')
    const [isEditingEstDelivery, setIsEditingEstDelivery] = useState(false)
    const [estimatedDelivery, setEstimatedDelivery] = useState('')
    const [inspectionNotes, setInspectionNotes] = useState('')
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [courierName, setCourierName] = useState('DHL Express')
    const [trackingNumber, setTrackingNumber] = useState('')
    const [isAlterationModalOpen, setIsAlterationModalOpen] = useState(false)
    const [alterationNotes, setAlterationNotes] = useState('')
    const [isUploadingMedia, setIsUploadingMedia] = useState(false)

    // Load order
    useEffect(() => {
        const load = async () => {
            const all = getAllOrders()
            let found = all.find((o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase())
            if (!found) {
                const res = await getAllOrdersAdminAction().catch(() => null)
                if (res && res.success && res.orders) {
                    found = res.orders.find((o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase())
                }
            }
            if (found) {
                setOrder(found)
                setEstimatedDelivery(found.details.estimatedDeliveryDate)
                setInspectionNotes(found.inspection.notes)
            }
        }
        load()
    }, [orderId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    if (!order) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>Order not found</h2>
                <p style={{ color: '#8A7A6E', marginTop: '0.5rem' }}>The requested order could not be located in the system.</p>
                <Link
                    href="/admin/orders"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginTop: '1.5rem',
                        padding: '0.625rem 1.25rem',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    Back to Orders Board
                </Link>
            </div>
        )
    }

    // Status change
    const handleStatusChange = (newStatus: OrderStatus) => {
        if (!order) return

        // Quality gate check for DISPATCHED
        if (newStatus === 'DISPATCHED' && order.status !== 'APPROVED' && !order.inspection.isApproved) {
            showToast('⚠️ Order cannot be dispatched without Master Tailor inspection approval.')
            return
        }

        const updated: AdminOrder = {
            ...order,
            status: newStatus,
            notifications: [
                {
                    id: `notif-${Date.now()}`,
                    event: `Stage updated to ${newStatus}`,
                    channel: 'WhatsApp',
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    details: `Operations lead manually changed stage to ${newStatus}.`,
                },
                ...order.notifications,
            ],
        }
        updateOrder(updated)
        setOrder(updated)
        showToast(`Order status moved to ${newStatus}`)
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('admin-counts-update'))
        }
        updateOrderStatusAdminAction(order.id, newStatus).catch(() => {})
    }

    // Tailor change
    const handleTailorChange = (tailorName: string) => {
        if (!order) return
        const updated: AdminOrder = {
            ...order,
            tailorAssigned: tailorName,
            adminNotes: [
                {
                    id: `an-${Date.now()}`,
                    author: 'Samuelson',
                    text: `Reassigned order to ${tailorName}.`,
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                },
                ...order.adminNotes,
            ],
        }
        updateOrder(updated)
        setOrder(updated)
        showToast(`Tailor assigned to ${tailorName}`)
    }

    // Estimated Delivery Save
    const handleSaveEstimatedDelivery = () => {
        if (!order) return
        const updated: AdminOrder = {
            ...order,
            details: {
                ...order.details,
                estimatedDeliveryDate: estimatedDelivery,
            },
        }
        updateOrder(updated)
        setOrder(updated)
        setIsEditingEstDelivery(false)
        showToast('Estimated delivery date updated')
    }

    // Copy Payment Link
    const handleCopyPaymentLink = () => {
        navigator.clipboard.writeText(order.payment.balancePaymentLink)
        setCopiedLink(true)
        showToast('Payment link copied to clipboard!')
        setTimeout(() => setCopiedLink(false), 2500)
    }

    // Send payment link on WhatsApp
    const handleWhatsAppPaymentLink = () => {
        const cleanPhone = order.customer.whatsapp.replace(/[^0-9]/g, '')
        const text = encodeURIComponent(
            `Hello ${order.customer.name}, here is your CaptainStitches balance payment link for order ${order.orderNumber}: ${order.payment.balancePaymentLink}. Thank you!`
        )
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank')
    }

    // WhatsApp customer general chat
    const handleWhatsAppChat = () => {
        const cleanPhone = order.customer.whatsapp.replace(/[^0-9]/g, '')
        const text = encodeURIComponent(
            `Hello ${order.customer.name}, this is Samuelson from CaptainStitches regarding your bespoke order ${order.orderNumber} (${order.design.name}).`
        )
        window.open(`https://wa.me/${cleanPhone}?text=${text}`, '_blank')
    }

    // Add Admin Note
    const handleAddAdminNote = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newAdminNote.trim()) return
        const updated: AdminOrder = {
            ...order,
            adminNotes: [
                {
                    id: `an-${Date.now()}`,
                    author: 'Samuelson (Admin)',
                    text: newAdminNote.trim(),
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                },
                ...order.adminNotes,
            ],
        }
        updateOrder(updated)
        setOrder(updated)
        setNewAdminNote('')
        showToast('Admin note saved')
    }

    // Approve Inspection Gate
    const handleApproveInspection = () => {
        if (order.inspection.photos.length === 0 && !order.inspection.videoUrl) {
            showToast('Cannot approve: upload inspection photos/video first.')
            return
        }
        const updated: AdminOrder = {
            ...order,
            status: 'APPROVED',
            inspection: {
                ...order.inspection,
                notes: inspectionNotes,
                isApproved: true,
                approvedBy: 'Samuelson (Lead Admin)',
                approvedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            },
            notifications: [
                {
                    id: `notif-${Date.now()}`,
                    event: 'Quality Approval Signed Off',
                    channel: 'WhatsApp',
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    details: 'Samuelson verified garment craftsmanship. Approved for dispatch.',
                },
                ...order.notifications,
            ],
        }
        updateOrder(updated)
        setOrder(updated)
        showToast('Order inspected and signed off! Moved to Approved stage.')
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('admin-counts-update'))
        }
        updateOrderStatusAdminAction(order.id, 'APPROVED', { inspectionNotes }).catch(() => {})
    }

    // Request Alteration (Returns to IN_PRODUCTION)
    const handleConfirmAlteration = () => {
        if (!order) return
        const note = alterationNotes.trim() || 'Alterations requested by Master Tailor Samuelson'
        const updated: AdminOrder = {
            ...order,
            status: 'IN_PRODUCTION',
            inspection: {
                ...order.inspection,
                isApproved: false,
                notes: note,
            },
            notifications: [
                {
                    id: `notif-${Date.now()}`,
                    event: 'Alterations Requested',
                    channel: 'WhatsApp',
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    details: note,
                },
                ...order.notifications,
            ],
        }
        updateOrder(updated)
        setOrder(updated)
        setIsAlterationModalOpen(false)
        setAlterationNotes('')
        showToast('Alterations requested. Order returned to In Production.')
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('admin-counts-update'))
        }
        updateOrderStatusAdminAction(order.id, 'IN_PRODUCTION', { notes: note }).catch(() => {})
    }

    // Dispatch Order with Courier Tracking
    const handleDispatchOrder = async (carrier: string, tracking: string) => {
        if (!order) return
        if (order.status !== 'APPROVED' && !order.inspection.isApproved) {
            showToast('⚠️ Order cannot be dispatched without Master Tailor inspection approval.')
            return
        }

        const updated: AdminOrder = {
            ...order,
            status: 'DISPATCHED',
            notifications: [
                {
                    id: `notif-${Date.now()}`,
                    event: 'Order Dispatched',
                    channel: 'WhatsApp',
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    details: `Package shipped via ${carrier}. Tracking: ${tracking}`,
                },
                ...order.notifications,
            ],
        }
        updateOrder(updated)
        setOrder(updated)
        showToast(`Dispatched via ${carrier}! Tracking: ${tracking}`)
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('admin-counts-update'))
        }

        await updateOrderStatusAdminAction(order.id, 'DISPATCHED', {
            courierName: carrier,
            trackingNumber: tracking,
            confirmUnpaidDispatch: true,
        }).catch(console.error)
    }

    // Upload artisan inspection media directly to Cloudinary
    const handleUploadInspectionMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        setIsUploadingMedia(true)

        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await uploadMediaAction(formData, 'inspection-media')

            if (res.success && res.url) {
                const photoToAdd = res.url
                const updated: AdminOrder = {
                    ...order,
                    inspection: {
                        ...order.inspection,
                        photos: [...order.inspection.photos, photoToAdd],
                    },
                }
                updateOrder(updated)
                setOrder(updated)
                showToast(res.isSimulated ? 'Artisan photo uploaded (Cloudinary simulated)' : 'Artisan photo uploaded to Cloudinary')
                if (typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('admin-counts-update'))
                }
                uploadOrderInspectionMediaAction(order.id, [photoToAdd]).catch(() => {})
            } else {
                showToast(res.error || 'Failed to upload photo')
            }
        } catch {
            showToast('Failed to upload image')
        } finally {
            setIsUploadingMedia(false)
            e.target.value = ''
        }
    }

    // Add sample inspection photo
    const handleAddMockPhoto = () => {
        const photoToAdd = '/images/design-agbada.jpg'
        const updated: AdminOrder = {
            ...order,
            inspection: {
                ...order.inspection,
                photos: [...order.inspection.photos, photoToAdd],
            },
        }
        updateOrder(updated)
        setOrder(updated)
        showToast('Artisan photo uploaded')
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('admin-counts-update'))
        }
        uploadOrderInspectionMediaAction(order.id, [photoToAdd]).catch(() => {})
    }

    const currentStageMeta = STAGES_PIPELINE.find((s) => s.key === order.status) || STAGES_PIPELINE[0]
    const hasMedia = order.inspection.photos.length > 0 || !!order.inspection.videoUrl

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
            {/* Toast Notification */}
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
                    href="/admin/orders"
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
                    <span>Back to Orders Board</span>
                </Link>

                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.25rem 1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.25rem',
                    }}
                >
                    {/* Left: Order ID, Status, Created Date */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                                    {order.orderNumber}
                                </h1>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '9999px',
                                        backgroundColor: currentStageMeta.badgeBg,
                                        color: currentStageMeta.badgeColor,
                                        border: `1px solid ${currentStageMeta.badgeColor}33`,
                                    }}
                                >
                                    {currentStageMeta.label}
                                </span>
                                {order.isOverdue && (
                                    <span
                                        style={{
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            padding: '0.25rem 0.65rem',
                                            borderRadius: '9999px',
                                            backgroundColor: '#FEE2E2',
                                            color: '#DC2626',
                                            border: '1px solid #FCA5A5',
                                        }}
                                    >
                                        Overdue
                                    </span>
                                )}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#8A7A6E', marginTop: '0.25rem' }}>
                                Created on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {/* Status Change Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                                Stage:
                            </span>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                                style={{
                                    border: '1px solid #E0D7CB',
                                    backgroundColor: '#FAF7F2',
                                    color: '#1C0F07',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                {STAGES_PIPELINE.map((s) => (
                                    <option key={s.key} value={s.key}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tailor Assignment Input */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                                Tailor:
                            </span>
                            <input
                                type="text"
                                value={order.tailorAssigned}
                                onChange={(e) => handleTailorChange(e.target.value)}
                                placeholder="Assign tailor..."
                                style={{
                                    border: '1px solid #E0D7CB',
                                    backgroundColor: '#FAF7F2',
                                    color: '#1C0F07',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    padding: '0.45rem 0.65rem',
                                    borderRadius: '8px',
                                    outline: 'none',
                                    width: '160px',
                                }}
                            />
                        </div>

                        {/* One-Tap WhatsApp Button */}
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
                                padding: '0.55rem 0.95rem',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 2px 5px rgba(37,211,102,0.25)',
                            }}
                        >
                            <IconWhatsApp />
                            <span>WhatsApp Customer</span>
                        </button>

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
                                        width: '170px',
                                        zIndex: 30,
                                        padding: '0.4rem 0',
                                    }}
                                >
                                    <Link
                                        href={`/admin/orders/${order.id}/edit`}
                                        style={{
                                            display: 'block',
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.8125rem',
                                            color: '#1C0F07',
                                            textDecoration: 'none',
                                            fontWeight: 500,
                                        }}
                                    >
                                        Edit Order Details
                                    </Link>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                            handleStatusChange('DELIVERED')
                                        }}
                                        style={{
                                            width: '100%',
                                            textAlign: 'left',
                                            background: 'none',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            fontSize: '0.8125rem',
                                            color: '#6E5D4F',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Mark as Delivered
                                    </button>
                                    <div style={{ height: '1px', backgroundColor: '#F3EFE9', margin: '0.3rem 0' }} />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                            if (confirm('Are you sure you want to cancel this order?')) {
                                                showToast('Order cancelled')
                                            }
                                        }}
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
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Two-Column Layout ──────────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
                    gap: '1.5rem',
                    alignItems: 'start',
                }}
            >
                {/* ─── Left Column: Details, Measurements, Inspection ─────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* 1. Order Design & Details Section */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1.25rem' }}>
                            Garment & Specifications
                        </h2>

                        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                            {/* Photo Thumbnail */}
                            <div
                                style={{
                                    width: '120px',
                                    height: '140px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    backgroundColor: '#F3EFE9',
                                    flexShrink: 0,
                                }}
                            >
                                <Image
                                    src={order.design.image || '/images/design-agbada.jpg'}
                                    alt={order.design.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                                {order.design.isCustom && (
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '6px',
                                            left: '6px',
                                            backgroundColor: '#1C0F07',
                                            color: '#C4975A',
                                            fontSize: '0.65rem',
                                            fontWeight: 800,
                                            padding: '0.2rem 0.4rem',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        CUSTOM
                                    </div>
                                )}
                            </div>

                            {/* Details Grid */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                <div>
                                    <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C0F07' }}>
                                        {order.design.name}
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                                        Category: {order.design.category}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                        gap: '0.75rem',
                                        backgroundColor: '#FAF7F2',
                                        padding: '0.85rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #EAE3D9',
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Fabric</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3A2B20', marginTop: '0.15rem' }}>{order.design.fabric}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Colour Choice</div>
                                        {(() => {
                                            const parsed = parseColour(order.design.colour || 'Bespoke')
                                            return (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                                                    <span
                                                        style={{
                                                            width: '12px',
                                                            height: '12px',
                                                            borderRadius: '9999px',
                                                            backgroundColor: parsed.hex,
                                                            display: 'inline-block',
                                                            border: '1px solid rgba(0,0,0,0.2)',
                                                        }}
                                                    />
                                                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3A2B20' }}>
                                                        {parsed.name}
                                                    </span>
                                                    <span style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#8A7A6E', backgroundColor: '#FAF7F2', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #EAE3D9' }}>
                                                        {parsed.hex}
                                                    </span>
                                                </div>
                                            )
                                        })()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Occasion</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#3A2B20', marginTop: '0.15rem' }}>{order.details.occasion}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Customer Deadline</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: order.isOverdue ? '#DC2626' : '#1C0F07', marginTop: '0.15rem' }}>
                                            {order.details.deadline}
                                        </div>
                                    </div>
                                </div>

                                {/* Estimated Delivery Date (Editable inline by Samuelson) */}
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 1rem',
                                        backgroundColor: '#FFFDF9',
                                        border: '1px solid #EAD8C3',
                                        borderRadius: '10px',
                                    }}
                                >
                                    <div>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E' }}>Estimated Delivery: </span>
                                        {isEditingEstDelivery ? (
                                            <input
                                                type="date"
                                                value={estimatedDelivery}
                                                onChange={(e) => setEstimatedDelivery(e.target.value)}
                                                style={{
                                                    marginLeft: '0.5rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid #C4975A',
                                                    fontSize: '0.82rem',
                                                    color: '#2B2B2B',
                                                    backgroundColor: '#FAF7F2',
                                                }}
                                            />
                                        ) : (
                                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C4975A', marginLeft: '0.4rem' }}>
                                                {order.details.estimatedDeliveryDate || 'Not set'}
                                            </span>
                                        )}
                                    </div>

                                    {isEditingEstDelivery ? (
                                        <button
                                            type="button"
                                            onClick={handleSaveEstimatedDelivery}
                                            style={{
                                                backgroundColor: '#C4975A',
                                                color: '#FFFFFF',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '0.35rem 0.75rem',
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Save
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingEstDelivery(true)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#C4975A',
                                                fontSize: '0.78rem',
                                                fontWeight: 700,
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            Edit Date
                                        </button>
                                    )}
                                </div>

                                {order.design.specialInstructions && (
                                    <div style={{ fontSize: '0.8rem', color: '#6E5D4F', lineHeight: 1.4, backgroundColor: '#FAF7F2', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                                        <strong style={{ color: '#1C0F07' }}>Tailoring Notes: </strong>
                                        {order.design.specialInstructions}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 2. Measurements Snapshot (Locked Table) */}
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
                            <div>
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Measurements Snapshot
                                </h2>
                                <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                    Recorded at time of order commission. Unit: {order.measurements.unit}.
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#8A7A6E', backgroundColor: '#F3EFE9', padding: '0.3rem 0.65rem', borderRadius: '6px' }}>
                                <IconLock />
                                <span>Locked (Edit in profile)</span>
                            </div>
                        </div>

                        {/* Measurement Grid/Table */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '0.75rem',
                                marginBottom: '1rem',
                            }}
                        >
                            {[
                                { label: 'Chest', val: order.measurements.chest },
                                { label: 'Shoulder', val: order.measurements.shoulder },
                                { label: 'Sleeve', val: order.measurements.sleeve },
                                { label: 'Waist', val: order.measurements.waist },
                                { label: 'Hips', val: order.measurements.hips },
                                { label: 'Inseam', val: order.measurements.inseam },
                                { label: 'Neck', val: order.measurements.neck },
                                { label: 'Length', val: order.measurements.length },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        backgroundColor: '#FAF7F2',
                                        borderRadius: '8px',
                                        padding: '0.65rem 0.85rem',
                                        border: '1px solid #EAE3D9',
                                        textAlign: 'center',
                                    }}
                                >
                                    <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 600, textTransform: 'uppercase' }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.2rem' }}>
                                        {item.val}&quot;
                                    </div>
                                </div>
                            ))}
                        </div>

                        {order.measurements.fitNotes && (
                            <div
                                style={{
                                    backgroundColor: '#FFFDF9',
                                    border: '1px solid #EAD8C3',
                                    borderRadius: '8px',
                                    padding: '0.75rem 1rem',
                                    fontSize: '0.8rem',
                                    color: '#6E5D4F',
                                }}
                            >
                                <strong style={{ color: '#C4975A' }}>Customer Fit Preferences: </strong>
                                {order.measurements.fitNotes}
                            </div>
                        )}
                    </div>

                    {/* 3. Inspection Section (Quality Sign-Off Approval Gate) */}
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
                                    Inspection & Quality Sign-Off
                                </h2>
                                <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                    Rigid gate: Order cannot move to Dispatched without Samuelson&apos;s verified media approval.
                                </p>
                            </div>

                            {order.inspection.isApproved ? (
                                <span
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.35rem',
                                        backgroundColor: '#DCFCE7',
                                        color: '#166534',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '9999px',
                                        border: '1px solid #86EFAC',
                                    }}
                                >
                                    <IconCheck />
                                    <span>Approved by {order.inspection.approvedBy}</span>
                                </span>
                            ) : (
                                <span
                                    style={{
                                        backgroundColor: '#FEF3CD',
                                        color: '#92600A',
                                        fontSize: '0.78rem',
                                        fontWeight: 700,
                                        padding: '0.35rem 0.75rem',
                                        borderRadius: '9999px',
                                        border: '1px solid #FDE047',
                                    }}
                                >
                                    Pending Inspection Sign-Off
                                </span>
                            )}
                        </div>

                        {/* Media Grid */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.65rem', textTransform: 'uppercase' }}>
                                Tailor Media Submissions ({order.inspection.photos.length} photos{order.inspection.videoUrl ? ', 1 video' : ''})
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                {order.inspection.photos.map((src, idx) => (
                                    <div
                                        key={idx}
                                        style={{
                                            width: '100px',
                                            height: '100px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            position: 'relative',
                                            border: '1px solid #EAE3D9',
                                        }}
                                    >
                                        <Image src={src} alt="Inspection Photo" fill style={{ objectFit: 'cover' }} />
                                    </div>
                                ))}

                                {order.inspection.videoUrl && (
                                    <div
                                        style={{
                                            width: '160px',
                                            height: '100px',
                                            borderRadius: '10px',
                                            overflow: 'hidden',
                                            backgroundColor: '#1C0F07',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: '#FFFFFF',
                                            fontSize: '0.75rem',
                                            flexDirection: 'column',
                                            gap: '0.25rem',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => window.open(order.inspection.videoUrl, '_blank')}
                                    >
                                        <span style={{ fontSize: '1.25rem' }}>▶</span>
                                        <span>Inspection Video</span>
                                    </div>
                                )}

                                {/* Functional Cloudinary Upload Button */}
                                <label
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        borderRadius: '10px',
                                        border: '2px dashed #D5CCA8',
                                        backgroundColor: '#FAF7F2',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.35rem',
                                        cursor: isUploadingMedia ? 'wait' : 'pointer',
                                        fontSize: '0.725rem',
                                        color: '#8A7A6E',
                                        fontWeight: 600,
                                        position: 'relative',
                                        overflow: 'hidden',
                                    }}
                                >
                                    <input
                                        type="file"
                                        accept="image/*,video/*"
                                        disabled={isUploadingMedia}
                                        onChange={handleUploadInspectionMedia}
                                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                    />
                                    {isUploadingMedia ? (
                                        <>
                                            <span style={{ width: '16px', height: '16px', border: '2px solid #C4975A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                            <span style={{ fontSize: '0.65rem', color: '#C4975A' }}>Uploading...</span>
                                        </>
                                    ) : (
                                        <>
                                            <IconUploadCloud />
                                            <span>+ Upload Media</span>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>

                        {/* Internal Quality Comments Field */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                                Samuelson&apos;s Quality Inspection Notes
                            </label>
                            <textarea
                                value={inspectionNotes}
                                onChange={(e) => setInspectionNotes(e.target.value)}
                                placeholder="Add observations on stitching tension, lapel roll, hem alignment..."
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E0D7CB',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '0.85rem',
                                    color: '#1C0F07',
                                    outline: 'none',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        {/* Approval Gate Action */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FAF7F2',
                                padding: '1rem',
                                borderRadius: '10px',
                                border: '1px solid #EAE3D9',
                            }}
                        >
                            <div style={{ fontSize: '0.8rem', color: '#6E5D4F' }}>
                                {!hasMedia ? (
                                    <span style={{ color: '#DC2626', fontWeight: 600 }}>
                                        ⚠️ Gate locked: Upload at least 1 photo or video to enable sign-off.
                                    </span>
                                ) : order.inspection.isApproved ? (
                                    <span style={{ color: '#166534', fontWeight: 600 }}>
                                        ✓ Signed off on {order.inspection.approvedAt}
                                    </span>
                                ) : (
                                    <span>Media uploaded. Ready for Samuelson&apos;s official sign-off.</span>
                                )}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    disabled={!hasMedia || order.inspection.isApproved}
                                    onClick={handleApproveInspection}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.45rem',
                                        backgroundColor: hasMedia && !order.inspection.isApproved ? '#166534' : '#E0D7CB',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '0.625rem 1.25rem',
                                        fontSize: '0.825rem',
                                        fontWeight: 700,
                                        cursor: hasMedia && !order.inspection.isApproved ? 'pointer' : 'not-allowed',
                                        boxShadow: hasMedia && !order.inspection.isApproved ? '0 2px 6px rgba(22,101,52,0.25)' : 'none',
                                    }}
                                >
                                    <IconShieldCheck />
                                    <span>{order.inspection.isApproved ? 'Approved & Signed Off' : '✦ Approve Quality & Sign Off'}</span>
                                </button>

                                {order.status === 'INSPECTION' && (
                                    <button
                                        type="button"
                                        onClick={() => setIsAlterationModalOpen(true)}
                                        style={{
                                            padding: '0.625rem 1rem',
                                            borderRadius: '8px',
                                            border: '1px solid #DC2626',
                                            backgroundColor: '#FEF2F2',
                                            color: '#DC2626',
                                            fontSize: '0.825rem',
                                            fontWeight: 700,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Request Alteration
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 4. Courier Shipping & Dispatch Card (TC-08.5) */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.1rem' }}>📦</span>
                                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                                    Courier Logistics & Dispatch
                                </h3>
                            </div>
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.2rem 0.6rem',
                                    borderRadius: '6px',
                                    backgroundColor: order.status === 'DISPATCHED' || order.status === 'DELIVERED' ? '#DCFCE7' : '#F3EFE9',
                                    color: order.status === 'DISPATCHED' || order.status === 'DELIVERED' ? '#166534' : '#8A7A6E',
                                }}
                            >
                                {order.status === 'DISPATCHED' ? 'In Transit' : order.status === 'DELIVERED' ? 'Delivered' : 'Pending Dispatch'}
                            </span>
                        </div>

                        {/* Balance due warning banner */}
                        {order.payment.balanceStatus !== 'PAID' && order.payment.balanceAmount > 0 && (
                            <div
                                style={{
                                    backgroundColor: '#FFFBEB',
                                    border: '1px solid #FDE68A',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '8px',
                                    fontSize: '0.8rem',
                                    color: '#92400E',
                                }}
                            >
                                ⚠️ Outstanding balance: <strong>{order.details.currency === 'EUR' ? `€${order.payment.balanceAmount}` : `₦${order.payment.balanceAmount.toLocaleString()}`}</strong>
                            </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Courier Carrier *
                                </label>
                                <select
                                    value={courierName}
                                    onChange={(e) => setCourierName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #E0D7CB',
                                        fontSize: '0.85rem',
                                        backgroundColor: '#FAF7F2',
                                    }}
                                >
                                    <option value="DHL Express">DHL Express (Global / Italy)</option>
                                    <option value="Fez Delivery">Fez Delivery (Nigeria Domestic)</option>
                                    <option value="GIG Logistics">GIG Logistics (Nigeria Regional)</option>
                                    <option value="Verona Atelier Concierge">Verona Atelier Direct Handover</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Courier Tracking Code *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. DHL-IT-982341823"
                                    value={trackingNumber}
                                    onChange={(e) => setTrackingNumber(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.6rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #E0D7CB',
                                        fontSize: '0.85rem',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            {order.status === 'APPROVED' && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!trackingNumber.trim()) {
                                            showToast('Please enter a valid tracking number to dispatch.')
                                            return
                                        }
                                        handleDispatchOrder(courierName, trackingNumber.trim())
                                    }}
                                    style={{
                                        padding: '0.625rem 1.25rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#1E40AF',
                                        color: '#FFFFFF',
                                        fontSize: '0.825rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 6px rgba(30,64,175,0.25)',
                                    }}
                                >
                                    🚀 Dispatch Order & Log Courier
                                </button>
                            )}

                            {order.status === 'DISPATCHED' && (
                                <button
                                    type="button"
                                    onClick={() => handleStatusChange('DELIVERED')}
                                    style={{
                                        padding: '0.625rem 1.25rem',
                                        borderRadius: '8px',
                                        border: 'none',
                                        backgroundColor: '#166534',
                                        color: '#FFFFFF',
                                        fontSize: '0.825rem',
                                        fontWeight: 700,
                                        cursor: 'pointer',
                                    }}
                                >
                                    ✓ Confirm Delivery Arrival (Delivered)
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* ─── Right Column: Customer, Payment, Notes, Log ────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* 1. Customer Section */}
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
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Customer Profile
                            </h2>
                            <Link
                                href="/admin/customers"
                                style={{
                                    fontSize: '0.78rem',
                                    color: '#C4975A',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                View Full Profile →
                            </Link>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                    {order.customer.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#8A7A6E', marginTop: '0.15rem' }}>
                                    {order.customer.totalOrders} total orders with CaptainStitches
                                </div>
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#F3EFE9' }} />

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.825rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#8A7A6E' }}>Phone / WhatsApp:</span>
                                    <span style={{ fontWeight: 600, color: '#1C0F07' }}>{order.customer.whatsapp}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#8A7A6E' }}>Email:</span>
                                    <span style={{ fontWeight: 600, color: '#1C0F07' }}>{order.customer.email}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#8A7A6E' }}>Preferred Language:</span>
                                    <span style={{ fontWeight: 600, color: '#1C0F07' }}>{order.customer.language}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span style={{ color: '#8A7A6E' }}>Currency:</span>
                                    <span style={{ fontWeight: 600, color: '#1C0F07' }}>{order.customer.currency}</span>
                                </div>
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#F3EFE9' }} />

                            <div>
                                <div style={{ fontSize: '0.725rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700, marginBottom: '0.25rem' }}>
                                    Delivery Address ({order.details.deliveryLocation === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'})
                                </div>
                                <div style={{ fontSize: '0.825rem', color: '#3A2B20', lineHeight: 1.4, backgroundColor: '#FAF7F2', padding: '0.65rem 0.85rem', borderRadius: '8px' }}>
                                    {order.details.fullAddress}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Payment Section */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1.25rem' }}>
                            Payment & Balance
                        </h2>

                        {/* Amount Overview Box */}
                        <div
                            style={{
                                backgroundColor: '#FAF7F2',
                                borderRadius: '12px',
                                padding: '1rem',
                                border: '1px solid #EAE3D9',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '0.75rem',
                                marginBottom: '1.25rem',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>Total Order Value:</span>
                                <div style={{ textAlign: 'right' }}>
                                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C0F07' }}>
                                        ₦{order.payment.totalNGN.toLocaleString()}
                                    </span>
                                    <span style={{ fontSize: '0.8rem', color: '#8A7A6E', marginLeft: '0.4rem' }}>
                                        (€{order.payment.totalEUR})
                                    </span>
                                </div>
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#EAE3D9' }} />

                            {/* 50% Deposit Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
                                <div>
                                    <span style={{ color: '#3A2B20', fontWeight: 600 }}>50% Initial Deposit:</span>
                                    {order.payment.depositPaidDate && (
                                        <div style={{ fontSize: '0.7rem', color: '#8A7A6E' }}>Paid on {order.payment.depositPaidDate}</div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, color: '#1C0F07' }}>
                                        {order.details.currency === 'EUR' ? `€${order.payment.depositAmount}` : `₦${order.payment.depositAmount.toLocaleString()}`}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '4px',
                                            backgroundColor: order.payment.depositStatus === 'PAID' ? '#DCFCE7' : '#FEE2E2',
                                            color: order.payment.depositStatus === 'PAID' ? '#166534' : '#DC2626',
                                        }}
                                    >
                                        {order.payment.depositStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Remaining Balance Row */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.825rem' }}>
                                <div>
                                    <span style={{ color: '#3A2B20', fontWeight: 600 }}>50% Remaining Balance:</span>
                                    {order.payment.balancePaidDate && (
                                        <div style={{ fontSize: '0.7rem', color: '#8A7A6E' }}>Paid on {order.payment.balancePaidDate}</div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontWeight: 700, color: '#1C0F07' }}>
                                        {order.details.currency === 'EUR' ? `€${order.payment.balanceAmount}` : `₦${order.payment.balanceAmount.toLocaleString()}`}
                                    </span>
                                    <span
                                        style={{
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            padding: '0.15rem 0.45rem',
                                            borderRadius: '4px',
                                            backgroundColor: order.payment.balanceStatus === 'PAID' ? '#DCFCE7' : '#FEF3CD',
                                            color: order.payment.balanceStatus === 'PAID' ? '#166534' : '#92600A',
                                        }}
                                    >
                                        {order.payment.balanceStatus}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Gateway Details */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.78rem', color: '#8A7A6E', marginBottom: '1.25rem' }}>
                            <div>
                                Gateway: <strong style={{ color: '#1C0F07' }}>{order.payment.gateway}</strong>
                            </div>
                            <div>
                                Reference: <code style={{ backgroundColor: '#FAF7F2', padding: '0.15rem 0.35rem', borderRadius: '4px', color: '#6E5D4F' }}>{order.payment.referenceNumber}</code>
                            </div>
                        </div>

                        {/* Balance Payment Link Generator Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            <button
                                type="button"
                                onClick={handleCopyPaymentLink}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.45rem',
                                    width: '100%',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #E0D7CB',
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    cursor: 'pointer',
                                }}
                            >
                                <IconCopy />
                                <span>{copiedLink ? 'Copied to Clipboard!' : 'Copy Balance Payment Link'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleWhatsAppPaymentLink}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.45rem',
                                    width: '100%',
                                    backgroundColor: '#FDF3E7',
                                    border: '1px solid #EAD8C3',
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    color: '#C4975A',
                                    cursor: 'pointer',
                                }}
                            >
                                <IconWhatsApp />
                                <span>Send Payment Link via WhatsApp</span>
                            </button>
                        </div>
                    </div>

                    {/* 3. Internal Admin Notes */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '0.5rem' }}>
                            Internal Admin Notes
                        </h2>
                        <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginBottom: '1rem' }}>
                            Private internal log. Never visible to the customer.
                        </p>

                        {/* Existing Notes Thread */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', maxHeight: '200px', overflowY: 'auto' }}>
                            {order.adminNotes.map((note) => (
                                <div
                                    key={note.id}
                                    style={{
                                        backgroundColor: '#FAF7F2',
                                        borderRadius: '8px',
                                        padding: '0.75rem',
                                        border: '1px solid #EAE3D9',
                                        fontSize: '0.8rem',
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#8A7A6E', fontSize: '0.7rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        <span style={{ color: '#C4975A' }}>{note.author}</span>
                                        <span>{note.timestamp}</span>
                                    </div>
                                    <div style={{ color: '#3A2B20', lineHeight: 1.35 }}>{note.text}</div>
                                </div>
                            ))}
                        </div>

                        {/* Add Note Input */}
                        <form onSubmit={handleAddAdminNote} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={newAdminNote}
                                onChange={(e) => setNewAdminNote(e.target.value)}
                                placeholder="Type an internal note..."
                                style={{
                                    flex: 1,
                                    padding: '0.5rem 0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E0D7CB',
                                    backgroundColor: '#FAF7F2',
                                    color: '#2B2B2B',
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

                    {/* 4. Chronological Notification Log */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1rem' }}>
                            Notification Timeline
                        </h2>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', position: 'relative' }}>
                            {order.notifications.map((notif, index) => (
                                <div key={notif.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                                    <div
                                        style={{
                                            width: '8px',
                                            height: '8px',
                                            borderRadius: '9999px',
                                            backgroundColor: notif.channel === 'WhatsApp' ? '#25D366' : '#C4975A',
                                            marginTop: '0.35rem',
                                            flexShrink: 0,
                                        }}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                        <div style={{ fontSize: '0.825rem', fontWeight: 700, color: '#1C0F07' }}>
                                            {notif.event}
                                            <span style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 500, marginLeft: '0.4rem' }}>
                                                via {notif.channel}
                                            </span>
                                        </div>
                                        {notif.details && (
                                            <div style={{ fontSize: '0.75rem', color: '#6E5D4F' }}>
                                                {notif.details}
                                            </div>
                                        )}
                                        <div style={{ fontSize: '0.7rem', color: '#A8998C' }}>
                                            {notif.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Alteration Request Modal (Edge Case 2) ───────────────────────── */}
            {isAlterationModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            border: '1px solid #EDE8E1',
                            padding: '1.75rem',
                            maxWidth: '480px',
                            width: '100%',
                            boxShadow: '0 12px 32px rgba(0,0,0,0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                        }}
                    >
                        <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#DC2626', textTransform: 'uppercase' }}>
                                Quality Gate • Alteration Request
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C0F07', margin: '0.25rem 0 0' }}>
                                Request Workshop Alteration
                            </h3>
                            <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: '0.35rem 0 0' }}>
                                Garment will be sent back to <strong>In Production</strong> stage for tailor adjustments.
                            </p>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.4rem' }}>
                                Alteration Instructions / Fit Notes *
                            </label>
                            <textarea
                                value={alterationNotes}
                                onChange={(e) => setAlterationNotes(e.target.value)}
                                placeholder="e.g. Shorten sleeves by 1.5cm, align collar embroidery"
                                rows={3}
                                style={{
                                    width: '100%',
                                    padding: '0.65rem 0.85rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E0D7CB',
                                    fontSize: '0.85rem',
                                    color: '#1C0F07',
                                    backgroundColor: '#FAF7F2',
                                    outline: 'none',
                                    resize: 'vertical',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setIsAlterationModalOpen(false)}
                                style={{
                                    padding: '0.55rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E0D7CB',
                                    backgroundColor: '#FAF7F2',
                                    color: '#6E5D4F',
                                    fontSize: '0.825rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmAlteration}
                                style={{
                                    padding: '0.55rem 1.25rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: '#DC2626',
                                    color: '#FFFFFF',
                                    fontSize: '0.825rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Submit Alteration Request
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
