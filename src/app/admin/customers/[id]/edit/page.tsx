'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    AdminCustomer,
    CustomerMeasurementsCm,
    getAllCustomers,
    saveCustomer,
} from '@/data/adminCustomersData'
import { Location, Currency } from '@/data/adminOrdersData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconLock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0, color: '#8A7A6E' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

export default function EditCustomerPage() {
    const params = useParams()
    const router = useRouter()
    const customerId = params?.id as string

    const [customer, setCustomer] = useState<AdminCustomer | null>(null)

    // Form fields
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [language, setLanguage] = useState<'EN' | 'IT'>('EN')
    const [currency, setCurrency] = useState<Currency>('EUR')
    const [location, setLocation] = useState<Location>('Italy')
    const [address, setAddress] = useState('')

    // Measurements in cm
    const [measurements, setMeasurements] = useState<CustomerMeasurementsCm>({
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

    // Admin note append
    const [adminNoteAppend, setAdminNoteAppend] = useState('')

    useEffect(() => {
        const all = getAllCustomers()
        const found = all.find((c) => c.id === customerId || c.name.toLowerCase() === customerId.toLowerCase())
        if (found) {
            setCustomer(found)
            setName(found.name)
            setEmail(found.email)
            setPhone(found.phone)
            setWhatsapp(found.whatsapp)
            setLanguage(found.language)
            setCurrency(found.currency)
            setLocation(found.location)
            setAddress(found.address)
            setMeasurements({ ...found.measurements })
        }
    }, [customerId])

    if (!customer) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>Customer not found</h2>
                <Link
                    href="/admin/customers"
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
                    Back to Customers
                </Link>
            </div>
        )
    }

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        const now = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

        const updatedNotes = [...customer.adminNotes]
        if (adminNoteAppend.trim()) {
            updatedNotes.unshift({
                id: `cn-${Date.now()}`,
                author: 'Samuelson (Admin)',
                text: adminNoteAppend.trim(),
                timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            })
        }

        const updated: AdminCustomer = {
            ...customer,
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            whatsapp: whatsapp.trim(),
            language: language,
            currency: currency,
            location: location,
            address: address.trim(),
            measurements: {
                ...measurements,
                lastUpdated: now,
            },
            adminNotes: updatedNotes,
        }

        saveCustomer(updated)
        router.push(`/admin/customers/${customer.id}`)
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '980px', margin: '0 auto' }}>
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                    href={`/admin/customers/${customer.id}`}
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
                    <span>Back to {customer.name}&apos;s Profile</span>
                </Link>

                <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                    Client ID: <strong style={{ color: '#1C0F07' }}>{customer.id}</strong>
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0F07', margin: 0, letterSpacing: '-0.02em' }}>
                    Edit Customer: {customer.name}
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                    Update contact details, permanent measurements in cm, and internal dossier notes.
                </p>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* ─── Card 1: Read-Only Historical Summary ───────────────────────────── */}
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
                            Historical Account Records
                        </h2>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#8A7A6E' }}>
                            <IconLock />
                            <span>System records (read-only here)</span>
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
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Total Orders</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.2rem' }}>
                                {customer.summary.totalOrders} bespoke garments
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Total Spent</div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.2rem' }}>
                                {customer.currency === 'EUR' ? `€${customer.summary.totalSpentEUR}` : `₦${customer.summary.totalSpentNGN.toLocaleString()}`}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Referral Code</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C4975A', marginTop: '0.2rem' }}>
                                {customer.referrals[0]?.refCode || '—'}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: '#8A7A6E', fontWeight: 700 }}>Member Since</div>
                            <div style={{ fontSize: '0.85rem', color: '#6E5D4F', marginTop: '0.2rem' }}>
                                {customer.dateJoined}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ─── Card 2: Contact & Delivery Details ─────────────────────────────── */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                    }}
                >
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Personal & Contact Details
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                WhatsApp Number *
                            </label>
                            <input
                                type="tel"
                                required
                                value={whatsapp}
                                onChange={(e) => setWhatsapp(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Location & Currency
                            </label>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <select
                                    value={location}
                                    onChange={(e) => {
                                        const loc = e.target.value as Location
                                        setLocation(loc)
                                        setCurrency(loc === 'Italy' ? 'EUR' : 'NGN')
                                    }}
                                    style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                >
                                    <option value="Italy">🇮🇹 Italy (€ EUR)</option>
                                    <option value="Nigeria">🇳🇬 Nigeria (₦ NGN)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Preferred Language
                            </label>
                            <select
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as any)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            >
                                <option value="EN">English (EN)</option>
                                <option value="IT">Italian (IT)</option>
                            </select>
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Default Delivery Address
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ─── Card 3: Master Measurements (Centimetres) ──────────────────────── */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.25rem',
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Master Measurements (Centimetres)
                        </h2>
                        <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                            Saved profile measurements automatically pre-fill when commissioning new orders.
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
                        {[
                            { key: 'chest', label: 'Chest (cm)' },
                            { key: 'shoulder', label: 'Shoulder (cm)' },
                            { key: 'sleeve', label: 'Sleeve Length (cm)' },
                            { key: 'waist', label: 'Waist (cm)' },
                            { key: 'hips', label: 'Hips (cm)' },
                            { key: 'inseam', label: 'Inseam (cm)' },
                            { key: 'neck', label: 'Neck (cm)' },
                            { key: 'length', label: 'Garment Length (cm)' },
                        ].map((field) => (
                            <div key={field.key} style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', border: '1px solid #EAE3D9' }}>
                                <label style={{ display: 'block', fontSize: '0.725rem', fontWeight: 700, color: '#6E5D4F', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                    {field.label}
                                </label>
                                <input
                                    type="number"
                                    step="0.5"
                                    value={measurements[field.key as keyof CustomerMeasurementsCm] as number}
                                    onChange={(e) =>
                                        setMeasurements({
                                            ...measurements,
                                            [field.key]: parseFloat(e.target.value) || 0,
                                        })
                                    }
                                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #E0D7CB', fontSize: '1rem', fontWeight: 800, color: '#1C0F07' }}
                                />
                            </div>
                        ))}
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Fit Preferences & Tailoring Notes
                        </label>
                        <input
                            type="text"
                            value={measurements.fitNotes || ''}
                            onChange={(e) => setMeasurements({ ...measurements, fitNotes: e.target.value })}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>

                {/* ─── Card 4: Append Internal Admin Note ──────────────────────────────── */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem',
                    }}
                >
                    <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Append Internal Admin Note (Optional)
                    </h2>
                    <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0 }}>
                        Add context explaining what was changed or updated in this edit session.
                    </p>
                    <textarea
                        rows={2}
                        placeholder="e.g. Updated chest measurement following fitting call on WhatsApp..."
                        value={adminNoteAppend}
                        onChange={(e) => setAdminNoteAppend(e.target.value)}
                        style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', backgroundColor: '#FAF7F2', fontSize: '0.85rem' }}
                    />
                </div>

                {/* ─── Action Buttons ───────────────────────────────────────────────────── */}
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
                        href={`/admin/customers/${customer.id}`}
                        style={{
                            padding: '0.65rem 1.25rem',
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
        </div>
    )
}
