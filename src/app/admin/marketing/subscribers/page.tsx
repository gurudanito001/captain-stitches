'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    MarketingSubscriber,
    SubscriberStatus,
    SubscriberLanguage,
    SubscriberLocation,
    getAllSubscribers,
    saveAllSubscribers,
    deleteSubscribers,
    bulkUpdateSubscriberStatus,
    getAllSegments,
    MarketingSegment,
} from '@/data/adminMarketingData'

export default function SubscriberListPage() {
    const [subscribers, setSubscribers] = useState<MarketingSubscriber[]>([])
    const [segments, setSegments] = useState<MarketingSegment[]>([])

    // Search & Filter state
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [langFilter, setLangFilter] = useState<string>('all')
    const [sourceFilter, setSourceFilter] = useState<string>('all')
    const [locationFilter, setLocationFilter] = useState<string>('all')
    const [sortBy, setSortBy] = useState<'date_desc' | 'date_asc' | 'name_asc' | 'engagement'>('date_desc')

    // Selection & Bulk Actions
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isAddToSegmentModalOpen, setIsAddToSegmentModalOpen] = useState(false)
    const [isImportModalOpen, setIsImportModalOpen] = useState(false)
    const [importCsvText, setImportCsvText] = useState('')

    // Pagination
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // Toast
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        setSubscribers(getAllSubscribers())
        setSegments(getAllSegments())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // Filter & Sort Logic
    const filteredSubscribers = useMemo(() => {
        return subscribers
            .filter((sub) => {
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase()
                    const matchName = sub.name.toLowerCase().includes(query)
                    const matchEmail = sub.email.toLowerCase().includes(query)
                    if (!matchName && !matchEmail) return false
                }
                if (statusFilter !== 'all' && sub.status !== statusFilter) return false
                if (langFilter !== 'all' && sub.language !== langFilter) return false
                if (sourceFilter !== 'all' && sub.signupSource !== sourceFilter) return false
                if (locationFilter !== 'all' && sub.location !== locationFilter) return false
                return true
            })
            .sort((a, b) => {
                if (sortBy === 'name_asc') return a.name.localeCompare(b.name)
                if (sortBy === 'engagement') return b.openRate - a.openRate
                if (sortBy === 'date_asc') return new Date(a.dateSubscribed).getTime() - new Date(b.dateSubscribed).getTime()
                return new Date(b.dateSubscribed).getTime() - new Date(a.dateSubscribed).getTime()
            })
    }, [subscribers, searchQuery, statusFilter, langFilter, sourceFilter, locationFilter, sortBy])

    // Paginated subset
    const totalPages = Math.max(1, Math.ceil(filteredSubscribers.length / pageSize))
    const paginatedSubscribers = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return filteredSubscribers.slice(start, start + pageSize)
    }, [filteredSubscribers, currentPage, pageSize])

    // Checkbox toggles
    const handleToggleAll = () => {
        if (selectedIds.length === paginatedSubscribers.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(paginatedSubscribers.map((s) => s.id))
        }
    }

    const handleToggleRow = (id: string) => {
        setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]))
    }

    // Single row actions
    const handleUnsubscribeSingle = (id: string) => {
        const updated = bulkUpdateSubscriberStatus([id], 'unsubscribed')
        setSubscribers(updated)
        showToast('Subscriber marked as unsubscribed')
    }

    const handleDeleteSingle = (id: string) => {
        if (!confirm('Are you sure you want to permanently delete this subscriber?')) return
        const updated = deleteSubscribers([id])
        setSubscribers(updated)
        setSelectedIds((prev) => prev.filter((i) => i !== id))
        showToast('Subscriber deleted from atelier records')
    }

    // Bulk actions
    const handleBulkUnsubscribe = () => {
        const updated = bulkUpdateSubscriberStatus(selectedIds, 'unsubscribed')
        setSubscribers(updated)
        setSelectedIds([])
        showToast(`Marked ${selectedIds.length} subscribers as unsubscribed`)
    }

    const handleBulkDelete = () => {
        if (!confirm(`Are you sure you want to permanently delete ${selectedIds.length} selected subscribers?`)) return
        const updated = deleteSubscribers(selectedIds)
        setSubscribers(updated)
        setSelectedIds([])
        showToast(`Deleted ${selectedIds.length} subscribers`)
    }

    const handleExportCSV = (listToExport = filteredSubscribers) => {
        const headers = ['Name', 'Email', 'Language', 'Location', 'Source', 'Date Subscribed', 'Status', 'Open Rate']
        const rows = listToExport.map((s) => [
            `"${s.name}"`,
            `"${s.email}"`,
            s.language,
            s.location,
            s.signupSource,
            `"${s.dateSubscribed}"`,
            s.status,
            `${s.openRate}%`,
        ])

        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `captainstitches_subscribers_${Date.now()}.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        showToast('Subscriber CSV export initiated')
    }

    // CSV Import Mock Handler
    const handleImportSubmit = () => {
        if (!importCsvText.trim()) return
        const lines = importCsvText.trim().split('\n')
        const newSubs: MarketingSubscriber[] = []

        lines.forEach((line, idx) => {
            const parts = line.split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''))
            if (parts.length >= 2 && parts[1].includes('@')) {
                newSubs.push({
                    id: `sub-imp-${Date.now()}-${idx}`,
                    name: parts[0] || 'Imported Patron',
                    email: parts[1],
                    language: (parts[2] as any) === 'IT' ? 'IT' : 'EN',
                    location: (parts[3] as any) === 'Nigeria' ? 'Nigeria' : 'Italy',
                    signupSource: 'manual',
                    dateSubscribed: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                    status: 'active',
                    openRate: 50,
                })
            }
        })

        if (newSubs.length > 0) {
            const combined = [...newSubs, ...subscribers]
            saveAllSubscribers(combined)
            setSubscribers(combined)
            setIsImportModalOpen(false)
            setImportCsvText('')
            showToast(`Successfully imported ${newSubs.length} new subscribers!`)
        } else {
            alert('Could not parse any valid name, email rows. Format: Name, Email, Language (EN/IT), Location (Italy/Nigeria)')
        }
    }

    return (
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 0 80px' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '28px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 500,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
                        border: '1px solid #C4975A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* HEADER BAR */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '24px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                        <h1
                            style={{
                                fontFamily: 'serif',
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: 0,
                            }}
                        >
                            Subscriber Directory
                        </h1>
                        <span
                            style={{
                                padding: '4px 10px',
                                borderRadius: '12px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E8E2D9',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#C4975A',
                            }}
                        >
                            {filteredSubscribers.length} Patrons
                        </span>
                    </div>
                    <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                        Searchable directory of all newsletter and bespoke update recipients.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        type="button"
                        onClick={() => setIsImportModalOpen(true)}
                        style={{
                            padding: '9px 14px',
                            borderRadius: '8px',
                            border: '1px solid #E8E2D9',
                            backgroundColor: '#FFFFFF',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Import CSV ⇲
                    </button>

                    <button
                        type="button"
                        onClick={() => handleExportCSV()}
                        style={{
                            padding: '9px 14px',
                            borderRadius: '8px',
                            border: '1px solid #E8E2D9',
                            backgroundColor: '#FFFFFF',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 500,
                            cursor: 'pointer',
                        }}
                    >
                        Export List CSV ⇱
                    </button>

                    <Link
                        href="/admin/marketing/subscribers/new"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '9px 18px',
                            borderRadius: '8px',
                            backgroundColor: '#C4975A',
                            color: '#1C0F07',
                            fontSize: '13px',
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        + Add Subscriber Manually
                    </Link>
                </div>
            </div>

            {/* SEARCH & FILTERS BAR */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    padding: '18px 20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                }}
            >
                {/* Search Row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search subscribers by patron name or email address..."
                            style={{
                                width: '100%',
                                padding: '10px 14px 10px 38px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                fontSize: '13px',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                        <span
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#8C827A',
                                fontSize: '14px',
                            }}
                        >
                            🔍
                        </span>
                    </div>

                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            style={{
                                padding: '9px 14px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                backgroundColor: '#FAF7F2',
                                fontSize: '12px',
                                color: '#8C827A',
                                cursor: 'pointer',
                            }}
                        >
                            Clear Search
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    {/* Status filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #E8E2D9',
                            fontSize: '12px',
                            backgroundColor: '#FAF7F2',
                            color: '#1C0F07',
                        }}
                    >
                        <option value="all">Status: All Statuses</option>
                        <option value="active">Active Only</option>
                        <option value="unsubscribed">Unsubscribed</option>
                        <option value="bounced">Bounced</option>
                        <option value="cleaned">Cleaned</option>
                    </select>

                    {/* Language filter */}
                    <select
                        value={langFilter}
                        onChange={(e) => setLangFilter(e.target.value)}
                        style={{
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #E8E2D9',
                            fontSize: '12px',
                            backgroundColor: '#FAF7F2',
                            color: '#1C0F07',
                        }}
                    >
                        <option value="all">Language: All (EN & IT)</option>
                        <option value="EN">🇬🇧 English (EN)</option>
                        <option value="IT">🇮🇹 Italian (IT)</option>
                    </select>

                    {/* Source filter */}
                    <select
                        value={sourceFilter}
                        onChange={(e) => setSourceFilter(e.target.value)}
                        style={{
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #E8E2D9',
                            fontSize: '12px',
                            backgroundColor: '#FAF7F2',
                            color: '#1C0F07',
                        }}
                    >
                        <option value="all">Source: All Sources</option>
                        <option value="homepage">Homepage Capture</option>
                        <option value="order_confirmation">Order Confirmation</option>
                        <option value="blog">Editorial Blog</option>
                        <option value="referral">Ambassador Referral</option>
                        <option value="manual">Manual Admin Entry</option>
                    </select>

                    {/* Location filter */}
                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        style={{
                            padding: '7px 10px',
                            borderRadius: '6px',
                            border: '1px solid #E8E2D9',
                            fontSize: '12px',
                            backgroundColor: '#FAF7F2',
                            color: '#1C0F07',
                        }}
                    >
                        <option value="all">Location: All Locations</option>
                        <option value="Italy">🇮🇹 Italy</option>
                        <option value="Nigeria">🇳🇬 Nigeria</option>
                        <option value="Other">🌍 International / Other</option>
                    </select>

                    {/* Sort by */}
                    <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '11px', color: '#8C827A', fontWeight: 600 }}>Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                padding: '7px 10px',
                                borderRadius: '6px',
                                border: '1px solid #E8E2D9',
                                fontSize: '12px',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                            }}
                        >
                            <option value="date_desc">Joined (Newest First)</option>
                            <option value="date_asc">Joined (Oldest First)</option>
                            <option value="name_asc">Name (A–Z)</option>
                            <option value="engagement">Most Engaged (Open Rate)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* SUBSCRIBERS DATA TABLE */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    marginBottom: '20px',
                }}
            >
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                        <thead>
                            <tr
                                style={{
                                    backgroundColor: '#FAF7F2',
                                    borderBottom: '1px solid #E8E2D9',
                                    textAlign: 'left',
                                }}
                            >
                                <th style={{ padding: '12px 16px', width: '40px' }}>
                                    <input
                                        type="checkbox"
                                        checked={
                                            paginatedSubscribers.length > 0 &&
                                            selectedIds.length === paginatedSubscribers.length
                                        }
                                        onChange={handleToggleAll}
                                        style={{ width: '15px', height: '15px', accentColor: '#C4975A' }}
                                    />
                                </th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Patron</th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Lang</th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Location</th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Source</th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Joined</th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Status</th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Last Opened</th>
                                <th style={{ padding: '12px 12px', color: '#8C827A', fontWeight: 600 }}>Engagement</th>
                                <th style={{ padding: '12px 16px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedSubscribers.length === 0 ? (
                                <tr>
                                    <td colSpan={10} style={{ padding: '48px 16px', textAlign: 'center', color: '#8C827A' }}>
                                        No subscribers match your search query or filters.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSubscribers.map((sub) => {
                                    const isSelected = selectedIds.includes(sub.id)
                                    return (
                                        <tr
                                            key={sub.id}
                                            style={{
                                                borderBottom: '1px solid #F5F1EB',
                                                backgroundColor: isSelected ? '#FAF5EE' : 'transparent',
                                                transition: 'background-color 0.15s ease',
                                            }}
                                        >
                                            <td style={{ padding: '12px 16px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={isSelected}
                                                    onChange={() => handleToggleRow(sub.id)}
                                                    style={{ width: '15px', height: '15px', accentColor: '#C4975A' }}
                                                />
                                            </td>

                                            {/* Patron details */}
                                            <td style={{ padding: '12px 12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div
                                                        style={{
                                                            width: '32px',
                                                            height: '32px',
                                                            borderRadius: '50%',
                                                            backgroundColor: '#1C0F07',
                                                            color: '#FAF7F2',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '11px',
                                                            fontWeight: 600,
                                                            flexShrink: 0,
                                                        }}
                                                    >
                                                        {sub.name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .slice(0, 2)
                                                            .join('')}
                                                    </div>
                                                    <div>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <strong style={{ color: '#1C0F07' }}>{sub.name}</strong>
                                                            {sub.linkedCustomerId && (
                                                                <Link
                                                                    href={`/admin/customers/${sub.linkedCustomerId}`}
                                                                    title="Linked Customer Profile"
                                                                    style={{
                                                                        fontSize: '10px',
                                                                        padding: '1px 5px',
                                                                        borderRadius: '4px',
                                                                        backgroundColor: 'rgba(196, 151, 90, 0.15)',
                                                                        color: '#8A5D24',
                                                                        textDecoration: 'none',
                                                                        fontWeight: 700,
                                                                    }}
                                                                >
                                                                    Client ↗
                                                                </Link>
                                                            )}
                                                        </div>
                                                        <span style={{ fontSize: '12px', color: '#8C827A' }}>
                                                            {sub.email}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Language */}
                                            <td style={{ padding: '12px 12px' }}>
                                                <span
                                                    style={{
                                                        padding: '3px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        backgroundColor: sub.language === 'IT' ? '#FAF5EE' : '#F0F4F8',
                                                        color: sub.language === 'IT' ? '#8A5D24' : '#2C5282',
                                                        border: `1px solid ${sub.language === 'IT' ? '#E8DED1' : '#D2E3F3'}`,
                                                    }}
                                                >
                                                    {sub.language === 'IT' ? '🇮🇹 IT' : '🇬🇧 EN'}
                                                </span>
                                            </td>

                                            {/* Location */}
                                            <td style={{ padding: '12px 12px', color: '#4A3D36' }}>
                                                {sub.location === 'Italy'
                                                    ? '🇮🇹 Italy'
                                                    : sub.location === 'Nigeria'
                                                    ? '🇳🇬 Nigeria'
                                                    : '🌍 Other'}
                                            </td>

                                            {/* Source */}
                                            <td style={{ padding: '12px 12px' }}>
                                                <span
                                                    style={{
                                                        fontSize: '11px',
                                                        padding: '2px 8px',
                                                        borderRadius: '10px',
                                                        backgroundColor: '#FAF7F2',
                                                        border: '1px solid #E8E2D9',
                                                        color: '#8C827A',
                                                    }}
                                                >
                                                    {sub.signupSource.replace('_', ' ')}
                                                </span>
                                            </td>

                                            {/* Date subscribed */}
                                            <td style={{ padding: '12px 12px', color: '#8C827A', fontSize: '12px' }}>
                                                {sub.dateSubscribed}
                                            </td>

                                            {/* Status */}
                                            <td style={{ padding: '12px 12px' }}>
                                                <span
                                                    style={{
                                                        padding: '3px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        textTransform: 'capitalize',
                                                        backgroundColor:
                                                            sub.status === 'active'
                                                                ? 'rgba(74, 124, 89, 0.12)'
                                                                : sub.status === 'unsubscribed'
                                                                ? '#FAF7F2'
                                                                : 'rgba(199, 43, 43, 0.12)',
                                                        color:
                                                            sub.status === 'active'
                                                                ? '#3B6E48'
                                                                : sub.status === 'unsubscribed'
                                                                ? '#8C827A'
                                                                : '#C72B2B',
                                                    }}
                                                >
                                                    {sub.status}
                                                </span>
                                            </td>

                                            {/* Last opened email */}
                                            <td style={{ padding: '12px 12px', color: '#8C827A', fontSize: '12px' }}>
                                                {sub.lastOpenedEmailDate || '—'}
                                            </td>

                                            {/* Open rate / engagement */}
                                            <td style={{ padding: '12px 12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <span style={{ fontWeight: 600, color: '#1C0F07', fontSize: '12px' }}>
                                                        {sub.openRate}%
                                                    </span>
                                                    <div
                                                        style={{
                                                            width: '36px',
                                                            height: '4px',
                                                            backgroundColor: '#FAF7F2',
                                                            borderRadius: '2px',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: `${sub.openRate}%`,
                                                                height: '100%',
                                                                backgroundColor: sub.openRate > 70 ? '#4A7C59' : '#C4975A',
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '6px' }}>
                                                    {sub.status === 'active' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleUnsubscribeSingle(sub.id)}
                                                            title="Unsubscribe"
                                                            style={{
                                                                padding: '4px 8px',
                                                                borderRadius: '4px',
                                                                border: '1px solid #E8E2D9',
                                                                backgroundColor: '#FFFFFF',
                                                                fontSize: '11px',
                                                                cursor: 'pointer',
                                                                color: '#8C827A',
                                                            }}
                                                        >
                                                            Unsub
                                                        </button>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={() => handleDeleteSingle(sub.id)}
                                                        title="Delete from list"
                                                        style={{
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            border: '1px solid rgba(199, 43, 43, 0.2)',
                                                            backgroundColor: '#FFFFFF',
                                                            fontSize: '11px',
                                                            cursor: 'pointer',
                                                            color: '#C72B2B',
                                                        }}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION STRIP */}
                <div
                    style={{
                        padding: '14px 20px',
                        borderTop: '1px solid #E8E2D9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: '#FAF7F2',
                        fontSize: '12px',
                    }}
                >
                    <span style={{ color: '#8C827A' }}>
                        Showing {filteredSubscribers.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
                        {Math.min(currentPage * pageSize, filteredSubscribers.length)} of {filteredSubscribers.length}{' '}
                        subscribers
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                            type="button"
                            disabled={currentPage <= 1}
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                border: '1px solid #E8E2D9',
                                backgroundColor: currentPage <= 1 ? '#F5F1EB' : '#FFFFFF',
                                color: currentPage <= 1 ? '#A89E96' : '#1C0F07',
                                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            disabled={currentPage >= totalPages}
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            style={{
                                padding: '5px 12px',
                                borderRadius: '6px',
                                border: '1px solid #E8E2D9',
                                backgroundColor: currentPage >= totalPages ? '#F5F1EB' : '#FFFFFF',
                                color: currentPage >= totalPages ? '#A89E96' : '#1C0F07',
                                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* STICKY FLOATING BULK ACTIONS BAR */}
            {selectedIds.length > 0 && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '24px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '12px 24px',
                        borderRadius: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                        border: '1px solid #C4975A',
                        zIndex: 900,
                    }}
                >
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                        {selectedIds.length} patrons selected
                    </span>

                    <div style={{ width: '1px', height: '18px', backgroundColor: '#4D3629' }} />

                    <button
                        type="button"
                        onClick={handleBulkUnsubscribe}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #664B3A',
                            color: '#E8E2D9',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        Unsubscribe Selected
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            const subset = subscribers.filter((s) => selectedIds.includes(s.id))
                            handleExportCSV(subset)
                        }}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1px solid #664B3A',
                            color: '#E8E2D9',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            cursor: 'pointer',
                        }}
                    >
                        Export Selected CSV
                    </button>

                    <button
                        type="button"
                        onClick={handleBulkDelete}
                        style={{
                            backgroundColor: '#C72B2B',
                            border: 'none',
                            color: '#FAF7F2',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Delete Selected
                    </button>

                    <button
                        type="button"
                        onClick={() => setSelectedIds([])}
                        style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#A8998C',
                            fontSize: '13px',
                            cursor: 'pointer',
                            marginLeft: '6px',
                        }}
                    >
                        ✕ Cancel
                    </button>
                </div>
            )}

            {/* MODAL: IMPORT CSV */}
            {isImportModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.7)',
                        backdropFilter: 'blur(3px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            maxWidth: '520px',
                            width: '100%',
                            padding: '24px',
                            border: '1px solid #E8E2D9',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h3 style={{ fontFamily: 'serif', fontSize: '20px', color: '#1C0F07', margin: '0 0 6px' }}>
                            Import Subscribers via CSV
                        </h3>
                        <p style={{ fontSize: '13px', color: '#8C827A', margin: '0 0 16px', lineHeight: 1.5 }}>
                            Paste CSV rows formatted as: <code>Name, Email, Language (EN/IT), Location (Italy/Nigeria)</code>.
                        </p>

                        <textarea
                            rows={6}
                            value={importCsvText}
                            onChange={(e) => setImportCsvText(e.target.value)}
                            placeholder={`"Lorenzo Ferrari", lorenzo.ferrari@milan.it, IT, Italy\n"Kelechi Iheanacho", kelechi@lagos.ng, EN, Nigeria`}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #E8E2D9',
                                fontSize: '12px',
                                fontFamily: 'monospace',
                                boxSizing: 'border-box',
                                marginBottom: '18px',
                            }}
                        />

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsImportModalOpen(false)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #E8E2D9',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleImportSubmit}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#C4975A',
                                    color: '#1C0F07',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Process & Import
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
