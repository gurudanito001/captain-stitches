'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    MarketingSubscriber,
    SubscriberLanguage,
    SubscriberLocation,
    saveSubscriber,
} from '@/data/adminMarketingData'
import { getAllCustomers, AdminCustomer } from '@/data/adminCustomersData'

export default function AddSubscriberManuallyPage() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [language, setLanguage] = useState<SubscriberLanguage>('EN')
    const [location, setLocation] = useState<SubscriberLocation>('Italy')
    const [signupSource, setSignupSource] = useState('Manual — admin')
    const [hasConsent, setHasConsent] = useState(false)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('')

    const [customers, setCustomers] = useState<AdminCustomer[]>([])
    const [customerSearch, setCustomerSearch] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    useEffect(() => {
        setCustomers(getAllCustomers())
    }, [])

    const filteredCustomers = useMemo(() => {
        if (!customerSearch.trim()) return customers.slice(0, 5)
        const q = customerSearch.toLowerCase()
        return customers.filter(
            (c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q)
        )
    }, [customers, customerSearch])

    const handleSelectCustomer = (c: AdminCustomer) => {
        setSelectedCustomerId(c.id)
        if (!name.trim()) setName(c.name)
        if (!email.trim()) setEmail(c.email)
        if (c.language === 'IT') setLanguage('IT')
        if (c.location === 'Italy') setLocation('Italy')
        else if (c.location === 'Nigeria') setLocation('Nigeria')
        setCustomerSearch('')
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        if (!name.trim()) {
            setErrorMessage('Please enter the patron’s full name.')
            return
        }

        if (!email.trim() || !email.includes('@')) {
            setErrorMessage('Please enter a valid email address.')
            return
        }

        if (!hasConsent) {
            setErrorMessage('You must verify that this client gave explicit verbal or written marketing consent.')
            return
        }

        setIsSaving(true)

        const now = new Date()
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

        const newSubscriber: MarketingSubscriber = {
            id: `sub-${Date.now()}`,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            language,
            location,
            signupSource: 'manual',
            dateSubscribed: dateStr,
            status: 'active',
            linkedCustomerId: selectedCustomerId || undefined,
            openRate: 50,
        }

        saveSubscriber(newSubscriber)

        setTimeout(() => {
            setIsSaving(false)
            router.push('/admin/marketing/subscribers')
        }, 350)
    }

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '0 0 80px' }}>
            {/* BREADCRUMB */}
            <div style={{ marginBottom: '24px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#8C827A',
                        marginBottom: '8px',
                    }}
                >
                    <Link href="/admin/marketing" style={{ color: '#8C827A', textDecoration: 'none' }}>
                        Marketing
                    </Link>
                    <span>/</span>
                    <Link href="/admin/marketing/subscribers" style={{ color: '#8C827A', textDecoration: 'none' }}>
                        Subscribers
                    </Link>
                    <span>/</span>
                    <span style={{ color: '#C4975A' }}>Add Manually</span>
                </div>

                <h1
                    style={{
                        fontFamily: 'serif',
                        fontSize: '28px',
                        fontWeight: 600,
                        color: '#1C0F07',
                        margin: '0 0 6px',
                    }}
                >
                    Add Subscriber Manually
                </h1>
                <p style={{ fontSize: '14px', color: '#8C827A', margin: 0 }}>
                    Register a client who requested email updates during a WhatsApp consultation, phone order, or studio visit.
                </p>
            </div>

            {/* ERROR ALERT */}
            {errorMessage && (
                <div
                    style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(199, 43, 43, 0.08)',
                        border: '1px solid rgba(199, 43, 43, 0.3)',
                        color: '#C72B2B',
                        fontSize: '13px',
                        marginBottom: '24px',
                    }}
                >
                    {errorMessage}
                </div>
            )}

            {/* FORM CONTAINER */}
            <form
                onSubmit={handleSubmit}
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    padding: '32px',
                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '24px',
                }}
            >
                {/* 1. LINK TO EXISTING CUSTOMER (TYPEAHEAD) */}
                <div
                    style={{
                        padding: '18px',
                        backgroundColor: '#FAF7F2',
                        borderRadius: '12px',
                        border: '1px solid #E8E2D9',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <strong style={{ fontSize: '13px', color: '#1C0F07' }}>
                            Link to Existing Customer Record (Optional)
                        </strong>
                        {selectedCustomerId && (
                            <button
                                type="button"
                                onClick={() => setSelectedCustomerId('')}
                                style={{
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    fontSize: '11px',
                                    color: '#C72B2B',
                                    cursor: 'pointer',
                                    textDecoration: 'underline',
                                }}
                            >
                                Unlink Customer
                            </button>
                        )}
                    </div>
                    <p style={{ fontSize: '12px', color: '#8C827A', margin: '0 0 12px', lineHeight: 1.5 }}>
                        Search your client dossier to auto-fill details and link this subscriber directly to their bespoke history.
                    </p>

                    {selectedCustomerId ? (
                        <div
                            style={{
                                padding: '10px 14px',
                                backgroundColor: '#FFFFFF',
                                borderRadius: '8px',
                                border: '1px solid #C4975A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}
                        >
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                Linked to Customer ID: {selectedCustomerId}
                            </span>
                            <span style={{ fontSize: '11px', color: '#4A7C59', fontWeight: 600 }}>✓ Attached</span>
                        </div>
                    ) : (
                        <div>
                            <input
                                type="text"
                                value={customerSearch}
                                onChange={(e) => setCustomerSearch(e.target.value)}
                                placeholder="Search customer by name, email, or phone number..."
                                style={{
                                    width: '100%',
                                    padding: '9px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '13px',
                                    backgroundColor: '#FFFFFF',
                                    boxSizing: 'border-box',
                                }}
                            />

                            {customerSearch && filteredCustomers.length > 0 && (
                                <div
                                    style={{
                                        marginTop: '8px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '6px',
                                        border: '1px solid #E8E2D9',
                                        maxHeight: '160px',
                                        overflowY: 'auto',
                                    }}
                                >
                                    {filteredCustomers.map((c) => (
                                        <div
                                            key={c.id}
                                            onClick={() => handleSelectCustomer(c)}
                                            style={{
                                                padding: '8px 12px',
                                                borderBottom: '1px solid #F5F1EB',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontSize: '12px',
                                            }}
                                        >
                                            <strong>{c.name}</strong>
                                            <span style={{ color: '#8C827A' }}>
                                                {c.email} • {c.location}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* 2. SUBSCRIBER DETAILS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '6px',
                            }}
                        >
                            Full Name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Alessandro Moretti"
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '6px',
                            }}
                        >
                            Email Address *
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="e.g. alessandro@verona.it"
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                fontSize: '14px',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '18px' }}>
                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '6px',
                            }}
                        >
                            Language Preference
                        </label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value as any)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                fontSize: '13px',
                                backgroundColor: '#FAF7F2',
                            }}
                        >
                            <option value="EN">🇬🇧 English (EN)</option>
                            <option value="IT">🇮🇹 Italian (IT)</option>
                        </select>
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '6px',
                            }}
                        >
                            Location
                        </label>
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value as any)}
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                fontSize: '13px',
                                backgroundColor: '#FAF7F2',
                            }}
                        >
                            <option value="Italy">🇮🇹 Italy</option>
                            <option value="Nigeria">🇳🇬 Nigeria</option>
                            <option value="Other">🌍 International / Other</option>
                        </select>
                    </div>

                    <div>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '6px',
                            }}
                        >
                            Signup Source
                        </label>
                        <input
                            type="text"
                            value={signupSource}
                            readOnly
                            style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                fontSize: '13px',
                                backgroundColor: '#F5F1EB',
                                color: '#8C827A',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>
                </div>

                {/* 3. CONSENT VERIFICATION (GDPR MANDATORY) */}
                <div
                    style={{
                        padding: '16px 18px',
                        backgroundColor: hasConsent ? 'rgba(74, 124, 89, 0.08)' : '#FAF7F2',
                        borderRadius: '10px',
                        border: `1px solid ${hasConsent ? 'rgba(74, 124, 89, 0.3)' : '#E8E2D9'}`,
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <input
                        type="checkbox"
                        id="consent-check"
                        checked={hasConsent}
                        onChange={(e) => setHasConsent(e.target.checked)}
                        style={{
                            marginTop: '3px',
                            width: '18px',
                            height: '18px',
                            accentColor: '#C4975A',
                            cursor: 'pointer',
                        }}
                    />
                    <label htmlFor="consent-check" style={{ fontSize: '13px', color: '#1C0F07', lineHeight: 1.5, cursor: 'pointer' }}>
                        <strong>Consent Confirmation:</strong> I confirm that this client has given explicit verbal or
                        written permission (e.g. during WhatsApp fitting consultation, atelier studio appointment, or phone
                        call) to receive marketing dispatches and bespoke lookbooks from CaptainStitches.
                    </label>
                </div>

                {/* SUBMIT BUTTONS */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '14px',
                        paddingTop: '16px',
                        borderTop: '1px solid #E8E2D9',
                    }}
                >
                    <Link
                        href="/admin/marketing/subscribers"
                        style={{
                            padding: '10px 18px',
                            borderRadius: '8px',
                            border: '1px solid #E8E2D9',
                            backgroundColor: '#FFFFFF',
                            color: '#1C0F07',
                            fontSize: '13px',
                            textDecoration: 'none',
                        }}
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={isSaving}
                        style={{
                            padding: '10px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#C4975A',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        {isSaving ? 'Registering & Syncing...' : 'Add Subscriber to Atelier List'}
                    </button>
                </div>
            </form>
        </div>
    )
}
