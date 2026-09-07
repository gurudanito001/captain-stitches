'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    AdminCustomer,
    CustomerMeasurementsCm,
    saveCustomer,
} from '@/data/adminCustomersData'
import { Location, Currency } from '@/data/adminOrdersData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)

export default function CreateCustomerPage() {
    const router = useRouter()

    // ─── Personal Details Form ────────────────────────────────────────────────
    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')
    const [whatsapp, setWhatsapp] = useState('')
    const [sameAsPhone, setSameAsPhone] = useState(true)
    const [email, setEmail] = useState('')
    const [language, setLanguage] = useState<'EN' | 'IT'>('EN')
    const [currency, setCurrency] = useState<Currency>('EUR')
    const [location, setLocation] = useState<Location>('Italy')
    const [address, setAddress] = useState('')

    // ─── Measurements Form (Optional) ─────────────────────────────────────────
    const [showMeasurements, setShowMeasurements] = useState(false)
    const [measurements, setMeasurements] = useState<CustomerMeasurementsCm>({
        chest: 104,
        shoulder: 46,
        sleeve: 63,
        waist: 86,
        hips: 102,
        inseam: 80,
        neck: 41,
        length: 106,
        fitNotes: '',
        lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    })

    // ─── Admin Notes Form (Optional) ──────────────────────────────────────────
    const [initialNote, setInitialNote] = useState('')

    // Handle "Same as phone" change
    const handlePhoneChange = (val: string) => {
        setPhone(val)
        if (sameAsPhone) {
            setWhatsapp(val)
        }
    }

    const handleSameAsPhoneToggle = (checked: boolean) => {
        setSameAsPhone(checked)
        if (checked) {
            setWhatsapp(phone)
        }
    }

    // Submit helper
    const submitCustomer = (andCreateOrder: boolean) => {
        if (!name.trim() || !phone.trim()) {
            alert('Please enter customer name and phone number.')
            return
        }

        const newId = `cust-${Date.now()}`
        const palette = ['#C4975A', '#166534', '#1D4ED8', '#92600A', '#7A4F2E', '#4338CA', '#B45309']
        const randomColor = palette[Math.floor(Math.random() * palette.length)]
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

        const newCustomer: AdminCustomer = {
            id: newId,
            name: name.trim(),
            avatarColor: randomColor,
            email: email.trim(),
            phone: phone.trim(),
            whatsapp: (sameAsPhone ? phone : whatsapp).trim(),
            location: location,
            address: address.trim(),
            language: language,
            currency: currency,
            dateJoined: today,
            measurements: {
                ...measurements,
                lastUpdated: today,
            },
            summary: {
                totalOrders: 0,
                totalSpentNGN: 0,
                totalSpentEUR: 0,
                lastOrderDate: '—',
                referralCount: 0,
                averageRating: 0,
            },
            ordersHistory: [],
            reviews: [],
            referrals: [
                {
                    refCode: `CS-${name.split(' ')[0].toUpperCase()}${Math.floor(10 + Math.random() * 90)}`,
                    totalReferred: 0,
                    convertedCount: 0,
                    rewardsEarned: [],
                },
            ],
            emailMarketing: {
                isSubscribed: !!email.trim(),
                source: 'Manual Atelier WhatsApp Onboarding',
                language: language,
                lastOpenedEmail: undefined,
            },
            subscription: {
                status: 'INACTIVE',
                tier: 'NONE',
                note: 'Manual prospect entry.',
            },
            adminNotes: initialNote.trim()
                ? [
                      {
                          id: `cn-${Date.now()}`,
                          author: 'Samuelson (Admin)',
                          text: initialNote.trim(),
                          timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                      },
                  ]
                : [],
        }

        saveCustomer(newCustomer)

        if (andCreateOrder) {
            router.push(`/admin/orders/new`)
        } else {
            router.push(`/admin/customers/${newId}`)
        }
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '980px', margin: '0 auto' }}>
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                    }}
                >
                    <IconArrowLeft />
                    <span>Back to Customer Directory</span>
                </Link>

                <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                    Direct Client Onboarding
                </div>
            </div>

            {/* Title */}
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0F07', margin: 0, letterSpacing: '-0.02em' }}>
                    Create New Customer
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                    Register a client who consulted Samuelson directly on WhatsApp or in person at the atelier.
                </p>
            </div>

            {/* ─── Card 1: Personal Details ─────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                }}
            >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                    1. Personal & Contact Information
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Full Name *
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Babatunde Lawal"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Phone Number *
                        </label>
                        <input
                            type="tel"
                            required
                            placeholder="e.g. +39 347 000 0000 or +234 803 000 0000"
                            value={phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F' }}>
                                WhatsApp Number *
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#8A7A6E', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={sameAsPhone}
                                    onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                                    style={{ accentColor: '#C4975A' }}
                                />
                                <span>Same as phone</span>
                            </label>
                        </div>
                        <input
                            type="tel"
                            required
                            disabled={sameAsPhone}
                            placeholder="WhatsApp mobile number"
                            value={sameAsPhone ? phone : whatsapp}
                            onChange={(e) => setWhatsapp(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.65rem',
                                borderRadius: '8px',
                                border: '1px solid #E0D7CB',
                                fontSize: '0.85rem',
                                backgroundColor: sameAsPhone ? '#FAF7F2' : '#FFFFFF',
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Email Address (Optional)
                        </label>
                        <input
                            type="email"
                            placeholder="client@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Location & Default Currency
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <select
                                value={location}
                                onChange={(e) => {
                                    const loc = e.target.value as Location
                                    setLocation(loc)
                                    setCurrency(loc === 'Italy' ? 'EUR' : 'NGN')
                                }}
                                style={{ flex: 1, padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
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
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
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
                            placeholder="Street, apartment/suite, city, postal code, country"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>
            </div>

            {/* ─── Card 2: Optional Initial Measurements ───────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.25rem',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            2. Measurements in Centimetres (Optional at creation)
                        </h2>
                        <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                            Can be entered now or recorded later on the customer profile.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setShowMeasurements(!showMeasurements)}
                        style={{
                            border: '1px solid #E0D7CB',
                            backgroundColor: '#FAF7F2',
                            color: '#6E5D4F',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            padding: '0.45rem 0.85rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                        }}
                    >
                        {showMeasurements ? 'Hide Form' : '+ Add Measurements Now'}
                    </button>
                </div>

                {showMeasurements && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '0.5rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem' }}>
                            {[
                                { key: 'chest', label: 'Chest (cm)' },
                                { key: 'shoulder', label: 'Shoulder (cm)' },
                                { key: 'sleeve', label: 'Sleeve (cm)' },
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
                                Fit Preferences & Tailoring Observations
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Needs relaxed chest fit, sloped shoulders, slight break on trousers..."
                                value={measurements.fitNotes}
                                onChange={(e) => setMeasurements({ ...measurements, fitNotes: e.target.value })}
                                style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* ─── Card 3: Optional Admin Context Note ──────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.75rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                    3. Internal Atelier Notes (Optional)
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#8A7A6E', margin: 0 }}>
                    Record any initial context from your WhatsApp conversation (e.g. how they found us, upcoming weddings).
                </p>

                <textarea
                    rows={3}
                    placeholder="Type internal notes here..."
                    value={initialNote}
                    onChange={(e) => setInitialNote(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', backgroundColor: '#FAF7F2', fontSize: '0.85rem', resize: 'vertical' }}
                />
            </div>

            {/* ─── Action Buttons ───────────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    gap: '1rem',
                    paddingTop: '0.5rem',
                }}
            >
                <Link
                    href="/admin/customers"
                    style={{
                        padding: '0.65rem 1.25rem',
                        borderRadius: '9px',
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
                    type="button"
                    onClick={() => submitCustomer(false)}
                    style={{
                        padding: '0.65rem 1.35rem',
                        borderRadius: '9px',
                        border: '1px solid #C4975A',
                        backgroundColor: '#FDF3E7',
                        color: '#C4975A',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                    }}
                >
                    Create Customer
                </button>

                <button
                    type="button"
                    onClick={() => submitCustomer(true)}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.65rem 1.5rem',
                        borderRadius: '9px',
                        border: 'none',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                    }}
                >
                    <IconPlus />
                    <span>Create & Start Bespoke Order →</span>
                </button>
            </div>
        </div>
    )
}
