'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminSettings,
    searchSettingsIndex,
    SearchResultItem,
    MasterAdminSettings,
    INITIAL_ADMIN_SETTINGS,
} from '@/data/adminSettingsData'
import {
    FiBriefcase,
    FiCreditCard,
    FiBell,
    FiGlobe,
    FiUsers,
    FiRepeat,
    FiCpu,
    FiAlertTriangle,
    FiSearch,
    FiChevronRight,
    FiClock,
    FiArrowLeft,
    FiSettings,
} from '@/components/admin/SettingsIcons'

export default function SettingsOverviewPage() {
    const [settings, setSettings] = useState<MasterAdminSettings>(INITIAL_ADMIN_SETTINGS)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([])

    useEffect(() => {
        const loaded = getAdminSettings()
        setSettings(loaded)
    }, [])

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value
        setSearchQuery(query)
        if (query.trim()) {
            setSearchResults(searchSettingsIndex(query))
        } else {
            setSearchResults([])
        }
    }

    const categories = [
        {
            title: 'Business Settings',
            route: '/admin/settings/business',
            description: 'Brand identity, atelier locations in Italy & Nigeria, production turnaround times & contact defaults.',
            icon: <FiBriefcase size={22} color="#C4975A" />,
            badge: 'Essential',
            badgeBg: '#FDF6ED',
            badgeColor: '#C4975A',
        },
        {
            title: 'Payment & FX Settings',
            route: '/admin/settings/payments',
            description: 'Paystack & Stripe API keys, dual-currency ₦/€ conversion engine, deposit thresholds & balance triggers.',
            icon: <FiCreditCard size={22} color="#2E7D32" />,
            badge: 'Live Gateways',
            badgeBg: '#E8F5E9',
            badgeColor: '#2E7D32',
        },
        {
            title: 'Notification Settings',
            route: '/admin/settings/notifications',
            description: 'Automated WhatsApp & email triggers for Samuelson, tailors & patrons, plus bilingual message templates.',
            icon: <FiBell size={22} color="#1565C0" />,
            badge: 'Bilingual EN/IT',
            badgeBg: '#EDF4FB',
            badgeColor: '#1565C0',
        },
        {
            title: 'Language & Currency',
            route: '/admin/settings/languages',
            description: 'Active languages (EN & IT), translation completeness dashboard, currency formatting & auto geo-detection.',
            icon: <FiGlobe size={22} color="#7C6F65" />,
            badge: '88% Translated',
            badgeBg: '#F5F5F5',
            badgeColor: '#7C6F65',
        },
        {
            title: 'Access Control & Staff',
            route: '/admin/settings/access',
            description: 'Admin and tailor user accounts, role permission matrix, session security & login history audits.',
            icon: <FiUsers size={22} color="#1C0F07" />,
            badge: '4 Staff Members',
            badgeBg: '#FAF7F2',
            badgeColor: '#1C0F07',
        },
        {
            title: 'Subscription Settings',
            route: '/admin/settings/subscriptions',
            description: 'Recurring bespoke wardrobe tiers (Standard, Priority, VIP), pricing, feature flag & plan configuration.',
            icon: <FiRepeat size={22} color="#8A5D18" />,
            badge: 'Dormant (Launch)',
            badgeBg: '#FDF6ED',
            badgeColor: '#8A5D18',
        },
        {
            title: 'Integrations Hub',
            route: '/admin/settings/integrations',
            description: 'Central status dashboard for third-party platforms (Paystack, Stripe, Resend, Cloudinary CDN, GA4, GSC).',
            icon: <FiCpu size={22} color="#5B3926" />,
            badge: '9 Services Connected',
            badgeBg: '#F0F4EC',
            badgeColor: '#2E7D32',
        },
        {
            title: 'Danger Zone',
            route: '/admin/settings/danger',
            description: 'Irreversible operations: clear test orders, reset catalogue, export platform backup ZIP, or factory reset.',
            icon: <FiAlertTriangle size={22} color="#C62828" />,
            badge: 'High Consequence',
            badgeBg: '#FFEBEE',
            badgeColor: '#C62828',
        },
    ]

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
            {/* Header Bar with Last Updated */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '28px',
                    flexWrap: 'wrap',
                    gap: '16px',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <span style={{ fontSize: '13px', color: '#7C6F65' }}>Admin</span>
                        <span style={{ fontSize: '13px', color: '#B3A89D' }}>/</span>
                        <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Settings</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Studio Settings & Configuration
                    </h1>
                    <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                        Manage foundational atelier defaults, payment credentials, notifications, and integrations.
                    </p>
                </div>

                {/* Last Updated Timestamp Badge */}
                <div
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 14px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '8px',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                >
                    <FiClock size={15} color="#C4975A" />
                    <div>
                        <div style={{ fontSize: '10px', color: '#8C7B6B', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                            Last Modified
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                            {settings.lastUpdated}
                        </div>
                    </div>
                </div>
            </div>

            {/* Global Settings Search Bar */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EDE8E1',
                    padding: '16px 20px',
                    marginBottom: '32px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    position: 'relative',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <FiSearch size={20} color="#8C7B6B" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search any setting or keyword (e.g. 'WhatsApp', 'deposit', 'Stripe', 'Italian', 'tailor', 'catalogue', 'webhook')..."
                        style={{
                            width: '100%',
                            border: 'none',
                            outline: 'none',
                            fontSize: '14px',
                            color: '#1C0F07',
                            backgroundColor: 'transparent',
                            fontFamily: 'inherit',
                        }}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => {
                                setSearchQuery('')
                                setSearchResults([])
                            }}
                            style={{
                                border: 'none',
                                background: '#FAF7F2',
                                borderRadius: '4px',
                                padding: '4px 8px',
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#7C6F65',
                                cursor: 'pointer',
                            }}
                        >
                            Clear
                        </button>
                    )}
                </div>

                {/* Instant Search Results Dropdown */}
                {searchQuery.trim() && (
                    <div
                        style={{
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid #EDE8E1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                        }}
                    >
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#7C6F65' }}>
                            Found {searchResults.length} matching {searchResults.length === 1 ? 'setting' : 'settings'}:
                        </div>
                        {searchResults.length === 0 ? (
                            <div style={{ padding: '12px', fontSize: '13px', color: '#8C7B6B', textAlign: 'center' }}>
                                No settings matched &ldquo;{searchQuery}&rdquo;. Try keywords like &ldquo;deposit&rdquo;, &ldquo;location&rdquo;, or &ldquo;email&rdquo;.
                            </div>
                        ) : (
                            searchResults.map((item, idx) => (
                                <Link
                                    key={idx}
                                    href={item.route}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        backgroundColor: '#FAF7F2',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        textDecoration: 'none',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>
                                                {item.title}
                                            </span>
                                            <span
                                                style={{
                                                    fontSize: '10px',
                                                    fontWeight: 600,
                                                    padding: '2px 6px',
                                                    borderRadius: '4px',
                                                    backgroundColor: '#FFFFFF',
                                                    color: '#C4975A',
                                                    border: '1px solid #EDE8E1',
                                                    textTransform: 'uppercase',
                                                }}
                                            >
                                                {item.section}
                                            </span>
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#7C6F65' }}>
                                            {item.description}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 600, color: '#C4975A' }}>
                                        Jump to setting <FiChevronRight size={14} />
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* 8 Category Tiles Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                    gap: '20px',
                }}
            >
                {categories.map((cat, i) => (
                    <Link
                        key={i}
                        href={cat.route}
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                            textDecoration: 'none',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            transition: 'transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease',
                            cursor: 'pointer',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div
                                    style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '10px',
                                        backgroundColor: '#FAF7F2',
                                        border: '1px solid #EDE8E1',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    {cat.icon}
                                </div>
                                <span
                                    style={{
                                        fontSize: '11px',
                                        fontWeight: 700,
                                        padding: '4px 8px',
                                        borderRadius: '6px',
                                        backgroundColor: cat.badgeBg,
                                        color: cat.badgeColor,
                                    }}
                                >
                                    {cat.badge}
                                </span>
                            </div>

                            <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1C0F07', margin: '0 0 6px 0' }}>
                                {cat.title}
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7C6F65', lineHeight: '1.45', margin: 0 }}>
                                {cat.description}
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                                paddingTop: '16px',
                                borderTop: '1px solid #FAF7F2',
                            }}
                        >
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                                Manage section
                            </span>
                            <div
                                style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '50%',
                                    backgroundColor: '#FAF7F2',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#C4975A',
                                }}
                            >
                                <FiChevronRight size={16} />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
