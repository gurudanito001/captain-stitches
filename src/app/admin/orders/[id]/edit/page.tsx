'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    AdminOrder,
    MeasurementProfile,
    Location,
    getAllOrders,
    updateOrder,
} from '@/data/adminOrdersData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0, color: '#8A7A6E' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
)

const IconAlertTriangle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0, color: '#D97706' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

export default function EditOrderPage() {
    const params = useParams()
    const router = useRouter()
    const orderId = params?.id as string

    const [order, setOrder] = useState<AdminOrder | null>(null)
    const [showConfirmModal, setShowConfirmModal] = useState(false)

    // Form fields
    const [designName, setDesignName] = useState('')
    const [fabric, setFabric] = useState('')
    const [colour, setColour] = useState('')
    const [specialInstructions, setSpecialInstructions] = useState('')
    const [occasion, setOccasion] = useState('')
    const [deadline, setDeadline] = useState('')
    const [deliveryLocation, setDeliveryLocation] = useState<Location>('Italy')
    const [fullAddress, setFullAddress] = useState('')
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('')
    const [adminNoteAppend, setAdminNoteAppend] = useState('')

    // Measurements
    const [measurements, setMeasurements] = useState<MeasurementProfile>({
        chest: 0,
        shoulder: 0,
        sleeve: 0,
        waist: 0,
        hips: 0,
        inseam: 0,
        neck: 0,
        length: 0,
        unit: 'inches',
        fitNotes: '',
    })

    useEffect(() => {
        const all = getAllOrders()
        const found = all.find((o) => o.id === orderId || o.orderNumber.toLowerCase() === orderId.toLowerCase())
        if (found) {
            setOrder(found)
            setDesignName(found.design.name)
            setFabric(found.design.fabric)
            setColour(found.design.colour)
            setSpecialInstructions(found.design.specialInstructions || '')
            setOccasion(found.details.occasion)
            setDeadline(found.details.deadline)
            setDeliveryLocation(found.details.deliveryLocation)
            setFullAddress(found.details.fullAddress)
            setEstimatedDeliveryDate(found.details.estimatedDeliveryDate)
            setMeasurements({ ...found.measurements })
        }
    }, [orderId])

    if (!order) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>Order not found</h2>
                <Link
                    href="/admin/orders"
                    style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textDecoration: 'none',
                    }}
                >
                    Back to Orders
                </Link>
            </div>
        )
    }

    const isInProductionOrBeyond = [
        'IN_PRODUCTION',
        'INSPECTION',
        'APPROVED',
        'DISPATCHED',
        'DELIVERED',
    ].includes(order.status)

    const handleSaveClick = (e: React.FormEvent) => {
        e.preventDefault()
        if (isInProductionOrBeyond) {
            setShowConfirmModal(true)
        } else {
            performUpdate()
        }
    }

    const performUpdate = () => {
        if (!order) return

        const updatedNotes = [...order.adminNotes]
        if (adminNoteAppend.trim()) {
            updatedNotes.unshift({
                id: `an-${Date.now()}`,
                author: 'Samuelson (Admin)',
                text: adminNoteAppend.trim(),
                timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            })
        } else {
            updatedNotes.unshift({
                id: `an-${Date.now()}`,
                author: 'System',
                text: `Order specifications modified by Samuelson.`,
                timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            })
        }

        const updated: AdminOrder = {
            ...order,
            design: {
                ...order.design,
                name: designName,
                fabric: fabric,
                colour: colour,
                specialInstructions: specialInstructions,
            },
            details: {
                ...order.details,
                occasion: occasion,
                deadline: deadline,
                deliveryLocation: deliveryLocation,
                fullAddress: fullAddress,
                estimatedDeliveryDate: estimatedDeliveryDate,
            },
            measurements: measurements,
            adminNotes: updatedNotes,
        }

        updateOrder(updated)
        setShowConfirmModal(false)
        router.push(`/admin/orders/${order.id}`)
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                    href={`/admin/orders/${order.id}`}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: '#8A7A6E',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    <IconArrowLeft />
                    <span>Back to Order {order.orderNumber}</span>
                </Link>

                <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                    Status: <strong style={{ color: '#1C0F07' }}>{order.status}</strong>
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                    Edit Order {order.orderNumber}
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                    Correct specifications, fabrics, delivery details, and order-specific measurements.
                </p>
            </div>

            {/* In-Production Warning Banner */}
            {isInProductionOrBeyond && (
                <div
                    style={{
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FCD34D',
                        borderRadius: '12px',
                        padding: '1rem 1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    <IconAlertTriangle />
                    <div style={{ fontSize: '0.825rem', color: '#92400E', lineHeight: 1.4 }}>
                        <strong>Production Notice:</strong> This order is currently in <strong>{order.status}</strong> stage.
                        Modifying pattern specifications, measurements, or fabrics while workshop tailoring is active will require confirmation upon saving.
                    </div>
                </div>
            )}

            <form onSubmit={handleSaveClick} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* ─── Card 1: Locked System Fields ─────────────────────────────────────── */}
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
                            Locked Historical Records
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#8A7A6E' }}>
                            <IconLock />
                            <span>Read-only system audit fields</span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1rem',
                            backgroundColor: '#FAF7F2',
                            padding: '1rem',
                            borderRadius: '10px',
                            border: '1px solid #EAE3D9',
                        }}
                    >
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Order ID</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>{order.orderNumber}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Customer Name</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>{order.customer.name}</div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Total Value & Gateway</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>
                                {order.details.currency === 'EUR' ? `€${order.payment.totalEUR}` : `₦${order.payment.totalNGN.toLocaleString()}`} ({order.payment.gateway})
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Payment Reference</div>
                            <div style={{ fontSize: '0.8rem', color: '#6E5D4F', marginTop: '0.2rem', fontFamily: 'monospace' }}>{order.payment.referenceNumber}</div>
                        </div>
                    </div>
                </div>

                {/* ─── Card 2: Editable Garment Specifications ─────────────────────────── */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1.25rem' }}>
                        Garment & Design Options
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Design / Garment Name
                            </label>
                            <input
                                type="text"
                                value={designName}
                                onChange={(e) => setDesignName(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Selected Fabric
                            </label>
                            <input
                                type="text"
                                value={fabric}
                                onChange={(e) => setFabric(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Colour Choice
                            </label>
                            <input
                                type="text"
                                value={colour}
                                onChange={(e) => setColour(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Occasion
                            </label>
                            <input
                                type="text"
                                value={occasion}
                                onChange={(e) => setOccasion(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Tailoring Notes & Special Instructions
                            </label>
                            <textarea
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                rows={2}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ─── Card 3: Editable Delivery & Timeline ───────────────────────────── */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1.25rem' }}>
                        Timeline & Delivery Address
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Customer Deadline
                            </label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={(e) => setDeadline(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Estimated Atelier Delivery Date
                            </label>
                            <input
                                type="date"
                                value={estimatedDeliveryDate}
                                onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Delivery Destination
                            </label>
                            <select
                                value={deliveryLocation}
                                onChange={(e) => setDeliveryLocation(e.target.value as Location)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            >
                                <option value="Italy">🇮🇹 Italy</option>
                                <option value="Nigeria">🇳🇬 Nigeria</option>
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Append Internal Admin Note
                            </label>
                            <input
                                type="text"
                                placeholder="Explain why edits were made..."
                                value={adminNoteAppend}
                                onChange={(e) => setAdminNoteAppend(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Full Delivery Address
                            </label>
                            <input
                                type="text"
                                value={fullAddress}
                                onChange={(e) => setFullAddress(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ─── Card 4: Measurements with Scoped Warning ───────────────────────── */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Order-Specific Measurements
                        </h2>
                        {/* Notice Alert */}
                        <div
                            style={{
                                backgroundColor: '#FFFDF9',
                                border: '1px solid #EAD8C3',
                                borderRadius: '8px',
                                padding: '0.75rem 1rem',
                                marginTop: '0.75rem',
                                fontSize: '0.8rem',
                                color: '#92600A',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                            }}
                        >
                            <IconAlertTriangle />
                            <span>
                                <strong>Safety Warning:</strong> Edits made to measurements here apply <em>strictly to this order ({order.orderNumber})</em>. They will <strong>not</strong> overwrite {order.customer.name}&apos;s saved master customer profile.
                            </span>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(4, 1fr)',
                            gap: '1rem',
                        }}
                    >
                        {[
                            { key: 'chest', label: 'Chest' },
                            { key: 'shoulder', label: 'Shoulder' },
                            { key: 'sleeve', label: 'Sleeve' },
                            { key: 'waist', label: 'Waist' },
                            { key: 'hips', label: 'Hips' },
                            { key: 'inseam', label: 'Inseam' },
                            { key: 'neck', label: 'Neck' },
                            { key: 'length', label: 'Length' },
                        ].map((field) => (
                            <div key={field.key} style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #EAE3D9' }}>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                    {field.label} ({measurements.unit})
                                </label>
                                <input
                                    type="number"
                                    step="0.25"
                                    value={measurements[field.key as keyof MeasurementProfile] as number}
                                    onChange={(e) =>
                                        setMeasurements({
                                            ...measurements,
                                            [field.key]: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '0.55rem',
                                        borderRadius: '8px',
                                        border: '1px solid #E0D7CB',
                                        fontSize: '1rem',
                                        fontWeight: 800,
                                        color: '#1C0F07',
                                    }}
                                />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Customer Fit Preference Notes
                        </label>
                        <input
                            type="text"
                            value={measurements.fitNotes || ''}
                            onChange={(e) => setMeasurements({ ...measurements, fitNotes: e.target.value })}
                            style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>

                {/* ─── Save & Cancel Actions Bar ───────────────────────────────────────── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        marginTop: '0.5rem',
                    }}
                >
                    <Link
                        href={`/admin/orders/${order.id}`}
                        style={{
                            padding: '0.625rem 1.25rem',
                            borderRadius: '8px',
                            border: '1px solid #E0D7CB',
                            backgroundColor: '#FAF7F2',
                            color: '#6E5D4F',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.65rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                        }}
                    >
                        <IconCheck />
                        <span>Save Changes</span>
                    </button>
                </div>
            </form>

            {/* ─── Confirmation Modal (If in production or beyond) ────────────────── */}
            {showConfirmModal && (
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
                            padding: '2rem',
                            maxWidth: '480px',
                            width: '100%',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.25rem',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconAlertTriangle />
                            </div>
                            <div>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                                    Confirm Workshop Modifications
                                </h3>
                                <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 600, marginTop: '0.15rem' }}>
                                    Order is currently in &quot;{order.status}&quot; stage
                                </div>
                            </div>
                        </div>

                        <p style={{ fontSize: '0.85rem', color: '#6E5D4F', lineHeight: 1.5, margin: 0 }}>
                            Cutting, sewing, or inspection has already commenced for <strong>{order.customer.name}&apos;s</strong> {order.design.name}. Updating measurements or fabric specifications now will notify the assigned tailor (<strong>{order.tailorAssigned}</strong>) to halt current bench assembly.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={() => setShowConfirmModal(false)}
                                style={{
                                    padding: '0.55rem 1.15rem',
                                    borderRadius: '8px',
                                    border: '1px solid #E0D7CB',
                                    backgroundColor: '#FAF7F2',
                                    color: '#6E5D4F',
                                    fontSize: '0.825rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Never Mind
                            </button>
                            <button
                                type="button"
                                onClick={performUpdate}
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
                                Yes, Apply Modifications
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
