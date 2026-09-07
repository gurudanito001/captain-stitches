'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    AdminCustomer,
    getAllCustomers,
} from '@/data/adminCustomersData'
import { Location } from '@/data/adminOrdersData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: '#8A7A6E', flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
)

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)

const IconDownload = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
)

const IconWhatsApp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
)

const IconChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#8A7A6E', flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
)

const IconUserCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0, color: '#166534' }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="8.5" cy="7" r="4" /><polyline points="17 11 19 13 23 9" /></svg>
)

export default function AdminCustomersPage() {
    const router = useRouter()
    const [customers, setCustomers] = useState<AdminCustomer[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [locationFilter, setLocationFilter] = useState<'All' | Location>('All')
    const [orderCountFilter, setOrderCountFilter] = useState<'All' | 'ordered' | 'never'>('All')
    const [languageFilter, setLanguageFilter] = useState<'All' | 'EN' | 'IT'>('All')
    const [subscriptionFilter, setSubscriptionFilter] = useState<'All' | 'subscribed' | 'unsubscribed'>('All')
    const [sortBy, setSortBy] = useState<'recent_order' | 'total_orders' | 'date_joined' | 'referral_count'>('recent_order')

    // Load customers
    useEffect(() => {
        setCustomers(getAllCustomers())
    }, [])

    // Filter & Sort
    const filteredCustomers = useMemo(() => {
        let result = customers.filter((c) => {
            // Search by name, email, or phone
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim()
                const matchesName = c.name.toLowerCase().includes(q)
                const matchesEmail = c.email.toLowerCase().includes(q)
                const matchesPhone = c.phone.includes(q) || c.whatsapp.includes(q)
                if (!matchesName && !matchesEmail && !matchesPhone) return false
            }
            // Location
            if (locationFilter !== 'All' && c.location !== locationFilter) {
                return false
            }
            // Order count
            if (orderCountFilter === 'ordered' && c.summary.totalOrders === 0) return false
            if (orderCountFilter === 'never' && c.summary.totalOrders > 0) return false
            // Language
            if (languageFilter !== 'All' && c.language !== languageFilter) return false
            // Subscription / Email marketing
            if (subscriptionFilter === 'subscribed' && !c.emailMarketing.isSubscribed) return false
            if (subscriptionFilter === 'unsubscribed' && c.emailMarketing.isSubscribed) return false

            return true
        })

        // Sorting
        result.sort((a, b) => {
            if (sortBy === 'total_orders') {
                return b.summary.totalOrders - a.summary.totalOrders
            }
            if (sortBy === 'referral_count') {
                return b.summary.referralCount - a.summary.referralCount
            }
            if (sortBy === 'date_joined') {
                return new Date(b.dateJoined).getTime() - new Date(a.dateJoined).getTime()
            }
            // Default: most recent order
            return b.summary.lastOrderDate.localeCompare(a.summary.lastOrderDate)
        })

        return result
    }, [customers, searchQuery, locationFilter, orderCountFilter, languageFilter, subscriptionFilter, sortBy])

    // Export CSV handler
    const handleExportCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'WhatsApp', 'Location', 'Language', 'Total Orders', 'Total Spent NGN', 'Total Spent EUR', 'Last Order Date', 'Referrals', 'Email Subscribed']
        const rows = filteredCustomers.map((c) => [
            `"${c.name}"`,
            `"${c.email}"`,
            `"${c.phone}"`,
            `"${c.whatsapp}"`,
            `"${c.location}"`,
            `"${c.language}"`,
            c.summary.totalOrders,
            c.summary.totalSpentNGN,
            c.summary.totalSpentEUR,
            `"${c.summary.lastOrderDate}"`,
            c.summary.referralCount,
            c.emailMarketing.isSubscribed ? 'Yes' : 'No',
        ])
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `captain_stitches_customers_${new Date().toISOString().slice(0, 10)}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const resetFilters = () => {
        setSearchQuery('')
        setLocationFilter('All')
        setOrderCountFilter('All')
        setLanguageFilter('All')
        setSubscriptionFilter('All')
        setSortBy('recent_order')
    }

    // Direct WhatsApp link
    const handleWhatsAppDirect = (e: React.MouseEvent, customer: AdminCustomer) => {
        e.stopPropagation()
        const cleanPhone = customer.whatsapp.replace(/[^0-9]/g, '')
        const greeting = encodeURIComponent(
            `Hello ${customer.name}, this is Samuelson from CaptainStitches. Hope you are well! Reaching out regarding your bespoke commissions.`
        )
        window.open(`https://wa.me/${cleanPhone}?text=${greeting}`, '_blank')
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
            {/* ─── Header Bar ────────────────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h1
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                letterSpacing: '-0.02em',
                                margin: 0,
                            }}
                        >
                            Customer Directory
                        </h1>
                        <span
                            style={{
                                backgroundColor: '#FDF3E7',
                                color: '#C4975A',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '9999px',
                                border: '1px solid #EAD8C3',
                            }}
                        >
                            {customers.length} total clients
                        </span>
                    </div>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#8A7A6E',
                            margin: 0,
                            marginTop: '0.25rem',
                        }}
                    >
                        Searchable directory of bespoke patrons, saved measurements, referral partners, and WhatsApp prospects.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Export CSV button */}
                    <button
                        type="button"
                        onClick={handleExportCSV}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E4DDD3',
                            color: '#6E5D4F',
                            fontSize: '0.8125rem',
                            fontWeight: 600,
                            padding: '0.6rem 1rem',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                        }}
                    >
                        <IconDownload />
                        <span>Export CSV</span>
                    </button>

                    {/* Add Customer Button */}
                    <Link
                        href="/admin/customers/new"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            padding: '0.625rem 1.125rem',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                        }}
                    >
                        <IconPlus />
                        <span>Add Customer</span>
                    </Link>
                </div>
            </div>

            {/* ─── Search & Filters Bar ──────────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                {/* Search Input Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #E5DFD7',
                            borderRadius: '10px',
                            padding: '0.6rem 0.95rem',
                            flex: '1 1 320px',
                        }}
                    >
                        <IconSearch />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone (+39 / +234)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                fontSize: '0.85rem',
                                color: '#1C0F07',
                                width: '100%',
                            }}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                style={{ border: 'none', background: 'transparent', color: '#A8998C', cursor: 'pointer', fontSize: '0.85rem' }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Sort Selector */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Sort by:
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.8rem',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '8px',
                                outline: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            <option value="recent_order">Most Recent Order</option>
                            <option value="total_orders">Total Orders (Highest)</option>
                            <option value="referral_count">Top Referrers</option>
                            <option value="date_joined">Date Joined</option>
                        </select>
                    </div>
                </div>

                {/* Filter Controls Row */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #F3EFE9',
                    }}
                >
                    {/* Location Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Location:
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {(['All', 'Italy', 'Nigeria'] as const).map((loc) => (
                                <button
                                    key={loc}
                                    type="button"
                                    onClick={() => setLocationFilter(loc)}
                                    style={{
                                        border: '1px solid',
                                        borderColor: locationFilter === loc ? '#C4975A' : '#E8E2D9',
                                        backgroundColor: locationFilter === loc ? '#FDF3E7' : '#FFFFFF',
                                        color: locationFilter === loc ? '#C4975A' : '#6E5D4F',
                                        fontSize: '0.78rem',
                                        fontWeight: locationFilter === loc ? 700 : 500,
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '7px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {loc === 'Italy' ? '🇮🇹 Italy' : loc === 'Nigeria' ? '🇳🇬 Nigeria' : 'All'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Order Count Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Orders:
                        </span>
                        <select
                            value={orderCountFilter}
                            onChange={(e) => setOrderCountFilter(e.target.value as any)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '7px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="All">All Patrons</option>
                            <option value="ordered">Has Ordered (&gt; 0)</option>
                            <option value="never">Never Ordered (0)</option>
                        </select>
                    </div>

                    {/* Language Preference */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Language:
                        </span>
                        <select
                            value={languageFilter}
                            onChange={(e) => setLanguageFilter(e.target.value as any)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '7px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="All">All (EN / IT)</option>
                            <option value="EN">English (EN)</option>
                            <option value="IT">Italian (IT)</option>
                        </select>
                    </div>

                    {/* Subscription / Marketing Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Email Sub:
                        </span>
                        <select
                            value={subscriptionFilter}
                            onChange={(e) => setSubscriptionFilter(e.target.value as any)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '7px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="All">All Subscribers</option>
                            <option value="subscribed">Subscribed</option>
                            <option value="unsubscribed">Unsubscribed</option>
                        </select>
                    </div>

                    {/* Reset Button */}
                    {(searchQuery || locationFilter !== 'All' || orderCountFilter !== 'All' || languageFilter !== 'All' || subscriptionFilter !== 'All' || sortBy !== 'recent_order') && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#DC2626',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                marginLeft: 'auto',
                            }}
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Customer Table ────────────────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    overflowX: 'auto',
                }}
            >
                {filteredCustomers.length > 0 ? (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D9' }}>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone / WhatsApp</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Orders</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Order</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Referrals</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email Sub</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tier</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((c) => {
                                const initials = c.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join('')
                                    .toUpperCase()

                                return (
                                    <tr
                                        key={c.id}
                                        onClick={() => router.push(`/admin/customers/${c.id}`)}
                                        style={{
                                            borderBottom: '1px solid #F3EFE9',
                                            cursor: 'pointer',
                                            transition: 'background-color 0.12s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#FAF7F2'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent'
                                        }}
                                    >
                                        {/* Avatar & Name */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                <div
                                                    style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '9999px',
                                                        backgroundColor: c.avatarColor,
                                                        color: '#FFFFFF',
                                                        fontSize: '0.8rem',
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
                                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1C0F07' }}>
                                                        {c.name}
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#8A7A6E' }}>
                                                        {c.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', color: '#3A2B20' }}>
                                            <span
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.3rem',
                                                    backgroundColor: '#FAF7F2',
                                                    padding: '0.2rem 0.5rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid #EDE8E1',
                                                    fontWeight: 600,
                                                }}
                                            >
                                                {c.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                            </span>
                                        </td>

                                        {/* Phone */}
                                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', color: '#6E5D4F' }}>
                                            <div>{c.whatsapp}</div>
                                            <div style={{ fontSize: '0.7rem', color: '#A8998C' }}>Language: {c.language}</div>
                                        </td>

                                        {/* Orders Placed */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span
                                                style={{
                                                    fontSize: '0.825rem',
                                                    fontWeight: 800,
                                                    color: c.summary.totalOrders > 0 ? '#1C0F07' : '#8A7A6E',
                                                    backgroundColor: c.summary.totalOrders > 0 ? '#FDF3E7' : '#F3EFE9',
                                                    padding: '0.2rem 0.55rem',
                                                    borderRadius: '6px',
                                                }}
                                            >
                                                {c.summary.totalOrders} {c.summary.totalOrders === 1 ? 'order' : 'orders'}
                                            </span>
                                        </td>

                                        {/* Last Order Date */}
                                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.825rem', color: '#6E5D4F' }}>
                                            {c.summary.lastOrderDate}
                                        </td>

                                        {/* Referrals */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span
                                                style={{
                                                    fontSize: '0.8rem',
                                                    fontWeight: 700,
                                                    color: c.summary.referralCount > 0 ? '#C4975A' : '#8A7A6E',
                                                }}
                                            >
                                                {c.summary.referralCount} referred
                                            </span>
                                        </td>

                                        {/* Email Subscription Status */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span
                                                style={{
                                                    fontSize: '0.7rem',
                                                    fontWeight: 700,
                                                    padding: '0.15rem 0.45rem',
                                                    borderRadius: '4px',
                                                    backgroundColor: c.emailMarketing.isSubscribed ? '#DCFCE7' : '#F3F4F6',
                                                    color: c.emailMarketing.isSubscribed ? '#166534' : '#6B7280',
                                                    border: c.emailMarketing.isSubscribed ? '1px solid #BBF7D0' : '1px solid #E5E7EB',
                                                }}
                                            >
                                                {c.emailMarketing.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                                            </span>
                                        </td>

                                        {/* Subscription Tier (Dormant -> shows dash) */}
                                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#A8998C', textAlign: 'center' }}>
                                            —
                                        </td>

                                        {/* Actions */}
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {/* One-click WhatsApp button */}
                                                <button
                                                    type="button"
                                                    title={`Chat with ${c.name} on WhatsApp`}
                                                    onClick={(e) => handleWhatsAppDirect(e, c)}
                                                    style={{
                                                        border: 'none',
                                                        backgroundColor: '#25D366',
                                                        color: '#FFFFFF',
                                                        borderRadius: '6px',
                                                        width: '28px',
                                                        height: '28px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        cursor: 'pointer',
                                                        boxShadow: '0 1px 3px rgba(37,211,102,0.3)',
                                                    }}
                                                >
                                                    <IconWhatsApp />
                                                </button>

                                                {/* Open profile link */}
                                                <Link
                                                    href={`/admin/customers/${c.id}`}
                                                    onClick={(e) => e.stopPropagation()}
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '0.25rem',
                                                        fontSize: '0.78rem',
                                                        fontWeight: 600,
                                                        color: '#C4975A',
                                                        textDecoration: 'none',
                                                        backgroundColor: '#FDF3E7',
                                                        padding: '0.3rem 0.6rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #EAD8C3',
                                                    }}
                                                >
                                                    <span>View</span>
                                                    <IconChevronRight />
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                ) : (
                    /* ─── Empty State ──────────────────────────────────────────────────────── */
                    <div
                        style={{
                            padding: '4rem 2rem',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '1rem',
                        }}
                    >
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '9999px',
                                backgroundColor: '#F3EFE9',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#8A7A6E',
                            }}
                        >
                            <IconSearch />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                No customers matched your search
                            </h3>
                            <p style={{ fontSize: '0.85rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                Check your spelling or try adjusting your filter criteria.
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={resetFilters}
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
                                Clear All Filters
                            </button>
                            <Link
                                href="/admin/customers/new"
                                style={{
                                    padding: '0.55rem 1.15rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#C4975A',
                                    color: '#FFFFFF',
                                    fontSize: '0.825rem',
                                    fontWeight: 700,
                                    textDecoration: 'none',
                                }}
                            >
                                + Add Customer Manually
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
