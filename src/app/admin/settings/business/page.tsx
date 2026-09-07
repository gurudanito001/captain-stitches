'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    getAdminSettings,
    saveAdminSettings,
    MasterAdminSettings,
    INITIAL_ADMIN_SETTINGS,
} from '@/data/adminSettingsData'
import {
    FiArrowLeft,
    FiSave,
    FiCheckCircle,
    FiMapPin,
    FiClock,
    FiBriefcase,
    FiMessageSquare,
} from '@/components/admin/SettingsIcons'

export default function BusinessSettingsPage() {
    const [settings, setSettings] = useState<MasterAdminSettings>(INITIAL_ADMIN_SETTINGS)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [logoPreview, setLogoPreview] = useState<string>(INITIAL_ADMIN_SETTINGS.business.brand.logoUrl)

    useEffect(() => {
        const loaded = getAdminSettings()
        setSettings(loaded)
        setLogoPreview(loaded.business.brand.logoUrl)
    }, [])

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        saveAdminSettings(settings)
        setToastMessage('Business & atelier defaults saved successfully!')
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setLogoPreview(url)
            setSettings({
                ...settings,
                business: {
                    ...settings.business,
                    brand: { ...settings.business.brand, logoUrl: url },
                },
            })
        }
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
            {/* Top Navigation & Breadcrumb */}
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                        <Link
                            href="/admin/settings"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                color: '#7C6F65',
                                textDecoration: 'none',
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #EDE8E1',
                            }}
                        >
                            <FiArrowLeft size={14} /> Back to Settings
                        </Link>
                        <span style={{ fontSize: '13px', color: '#B3A89D' }}>/</span>
                        <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Business</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Business & Atelier Configuration
                    </h1>
                    <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                        Brand identity, operating atelier addresses, production turnaround standards, and communication channels.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {toastMessage && (
                        <span
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#2E7D32',
                                backgroundColor: '#E8F5E9',
                                padding: '6px 12px',
                                borderRadius: '6px',
                                border: '1px solid #C8E6C9',
                            }}
                        >
                            <FiCheckCircle size={14} /> {toastMessage}
                        </span>
                    )}

                    <button
                        type="button"
                        onClick={handleSave}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 20px',
                            backgroundColor: '#1C0F07',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#FAF7F2',
                            cursor: 'pointer',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                    >
                        <FiSave size={14} color="#C4975A" /> Save Business Details
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* 1. Brand Details */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4975A' }}>
                            <FiBriefcase size={18} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Brand Identity & Social Handles
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Used across transactional customer emails, official receipts, and lookbooks.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Business Name
                            </label>
                            <input
                                type="text"
                                value={settings.business.brand.businessName}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            brand: { ...settings.business.brand, businessName: e.target.value },
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    color: '#1C0F07',
                                    backgroundColor: '#FAF7F2',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Brand Accent Colour
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="color"
                                    value={settings.business.brand.brandColor}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            business: {
                                                ...settings.business,
                                                brand: { ...settings.business.brand, brandColor: e.target.value },
                                            },
                                        })
                                    }
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        cursor: 'pointer',
                                        padding: '2px',
                                        backgroundColor: '#FFFFFF',
                                    }}
                                />
                                <input
                                    type="text"
                                    value={settings.business.brand.brandColor}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            business: {
                                                ...settings.business,
                                                brand: { ...settings.business.brand, brandColor: e.target.value },
                                            },
                                        })
                                    }
                                    style={{
                                        flex: 1,
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        fontSize: '13px',
                                        color: '#1C0F07',
                                        backgroundColor: '#FAF7F2',
                                        fontFamily: 'monospace',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Brand Tagline & Motto
                            </label>
                            <input
                                type="text"
                                value={settings.business.brand.tagline}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            brand: { ...settings.business.brand, tagline: e.target.value },
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    color: '#1C0F07',
                                    backgroundColor: '#FAF7F2',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Official Atelier Email (From Address)
                            </label>
                            <input
                                type="email"
                                value={settings.business.brand.businessEmail}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            brand: { ...settings.business.brand, businessEmail: e.target.value },
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    color: '#1C0F07',
                                    backgroundColor: '#FAF7F2',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                WhatsApp Consultation Number
                            </label>
                            <input
                                type="text"
                                value={settings.business.brand.whatsappNumber}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            brand: { ...settings.business.brand, whatsappNumber: e.target.value },
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    color: '#1C0F07',
                                    backgroundColor: '#FAF7F2',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Instagram Handle
                            </label>
                            <input
                                type="text"
                                value={settings.business.brand.instagramHandle}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            brand: { ...settings.business.brand, instagramHandle: e.target.value },
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    color: '#1C0F07',
                                    backgroundColor: '#FAF7F2',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Facebook Page URL
                            </label>
                            <input
                                type="text"
                                value={settings.business.brand.facebookUrl}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            brand: { ...settings.business.brand, facebookUrl: e.target.value },
                                        },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    fontSize: '13px',
                                    color: '#1C0F07',
                                    backgroundColor: '#FAF7F2',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* Logo Upload Card */}
                        <div style={{ gridColumn: '1 / -1', marginTop: '6px' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '8px' }}>
                                Atelier Insignia / Brand Logo
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div
                                    style={{
                                        width: '64px',
                                        height: '64px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        backgroundColor: '#1C0F07',
                                        border: '1px solid #EDE8E1',
                                        flexShrink: 0,
                                    }}
                                >
                                    <Image
                                        src={logoPreview}
                                        alt="Logo preview"
                                        fill
                                        sizes="64px"
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                        id="logo-upload"
                                        style={{ display: 'none' }}
                                    />
                                    <label
                                        htmlFor="logo-upload"
                                        style={{
                                            display: 'inline-flex',
                                            padding: '8px 14px',
                                            backgroundColor: '#FAF7F2',
                                            border: '1px solid #EDE8E1',
                                            borderRadius: '6px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            cursor: 'pointer',
                                            marginRight: '8px',
                                        }}
                                    >
                                        Upload New Logo
                                    </label>
                                    <span style={{ fontSize: '12px', color: '#8C7B6B' }}>
                                        Recommended: PNG or SVG with transparent background (min 400x400px).
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. Operating Locations */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0' }}>
                            <FiMapPin size={18} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Operating Ateliers & Production Locations
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Active locations appear on your public About page, Contact directory, and email footers.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '20px' }}>
                        {/* Verona Atelier */}
                        <div
                            style={{
                                padding: '20px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #EDE8E1',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '18px' }}>🇮🇹</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C0F07' }}>
                                        Verona Atelier (Italy)
                                    </span>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.business.locations.verona.isActive}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                business: {
                                                    ...settings.business,
                                                    locations: {
                                                        ...settings.business.locations,
                                                        verona: { ...settings.business.locations.verona, isActive: e.target.checked },
                                                    },
                                                },
                                            })
                                        }
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                    {settings.business.locations.verona.isActive ? 'Active Atelier' : 'Inactive'}
                                </label>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7C6F65', marginBottom: '4px' }}>Street Address</label>
                                    <input
                                        type="text"
                                        value={settings.business.locations.verona.address}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                business: {
                                                    ...settings.business,
                                                    locations: {
                                                        ...settings.business.locations,
                                                        verona: { ...settings.business.locations.verona, address: e.target.value },
                                                    },
                                                },
                                            })
                                        }
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7C6F65', marginBottom: '4px' }}>City</label>
                                        <input
                                            type="text"
                                            value={settings.business.locations.verona.city}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    business: {
                                                        ...settings.business,
                                                        locations: {
                                                            ...settings.business.locations,
                                                            verona: { ...settings.business.locations.verona, city: e.target.value },
                                                        },
                                                    },
                                                })
                                            }
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7C6F65', marginBottom: '4px' }}>Postal Code</label>
                                        <input
                                            type="text"
                                            value={settings.business.locations.verona.postcodeOrState}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    business: {
                                                        ...settings.business,
                                                        locations: {
                                                            ...settings.business.locations,
                                                            verona: { ...settings.business.locations.verona, postcodeOrState: e.target.value },
                                                        },
                                                    },
                                                })
                                            }
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Lagos / Aba Atelier */}
                        <div
                            style={{
                                padding: '20px',
                                borderRadius: '10px',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #EDE8E1',
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '18px' }}>🇳🇬</span>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1C0F07' }}>
                                        Lagos & Aba Workshop (Nigeria)
                                    </span>
                                </div>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                                    <input
                                        type="checkbox"
                                        checked={settings.business.locations.lagos.isActive}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                business: {
                                                    ...settings.business,
                                                    locations: {
                                                        ...settings.business.locations,
                                                        lagos: { ...settings.business.locations.lagos, isActive: e.target.checked },
                                                    },
                                                },
                                            })
                                        }
                                        style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                                    />
                                    {settings.business.locations.lagos.isActive ? 'Active Workshop' : 'Inactive'}
                                </label>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7C6F65', marginBottom: '4px' }}>Street Address</label>
                                    <input
                                        type="text"
                                        value={settings.business.locations.lagos.address}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                business: {
                                                    ...settings.business,
                                                    locations: {
                                                        ...settings.business.locations,
                                                        lagos: { ...settings.business.locations.lagos, address: e.target.value },
                                                    },
                                                },
                                            })
                                        }
                                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7C6F65', marginBottom: '4px' }}>City / Hub</label>
                                        <input
                                            type="text"
                                            value={settings.business.locations.lagos.city}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    business: {
                                                        ...settings.business,
                                                        locations: {
                                                            ...settings.business.locations,
                                                            lagos: { ...settings.business.locations.lagos, city: e.target.value },
                                                        },
                                                    },
                                                })
                                            }
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 600, color: '#7C6F65', marginBottom: '4px' }}>State</label>
                                        <input
                                            type="text"
                                            value={settings.business.locations.lagos.postcodeOrState}
                                            onChange={(e) =>
                                                setSettings({
                                                    ...settings,
                                                    business: {
                                                        ...settings.business,
                                                        locations: {
                                                            ...settings.business.locations,
                                                            lagos: { ...settings.business.locations.lagos, postcodeOrState: e.target.value },
                                                        },
                                                    },
                                                })
                                            }
                                            style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '12px', backgroundColor: '#FFFFFF', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. Production Turnaround Defaults */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2E7D32' }}>
                            <FiClock size={18} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Production Turnaround & Buffer Margins
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Pre-fills the turnaround timeframe when creating designs or commissions (editable per order).
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '18px' }}>
                        {[
                            { key: 'nativeWear', label: 'Native Wear (Agbada & Senators)', default: 14 },
                            { key: 'englishSuits', label: 'English Bespoke Suits & Blazers', default: 21 },
                            { key: 'casualWear', label: 'Casual Shirts & Safari Sets', default: 10 },
                            { key: 'childrenClothing', label: "Children's Ceremonial Wear", default: 7 },
                        ].map((item) => (
                            <div key={item.key} style={{ padding: '14px', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    {item.label}
                                </label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <input
                                        type="number"
                                        min={1}
                                        max={60}
                                        value={(settings.business.production.turnaroundDays as any)[item.key]}
                                        onChange={(e) =>
                                            setSettings({
                                                ...settings,
                                                business: {
                                                    ...settings.business,
                                                    production: {
                                                        ...settings.business.production,
                                                        turnaroundDays: {
                                                            ...settings.business.production.turnaroundDays,
                                                            [item.key]: parseInt(e.target.value) || 1,
                                                        },
                                                    },
                                                },
                                            })
                                        }
                                        style={{ width: '70px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', fontWeight: 700, backgroundColor: '#FFFFFF' }}
                                    />
                                    <span style={{ fontSize: '12px', color: '#7C6F65' }}>Days</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ padding: '14px', backgroundColor: '#FDF6ED', borderRadius: '8px', border: '1px solid #F5D38A', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#8A5D18' }}>
                                Safety Buffer Margin
                            </div>
                            <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                Extra buffer added automatically to client delivery dates to prevent logistics stress.
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <input
                                type="number"
                                min={0}
                                max={10}
                                value={settings.business.production.bufferDays}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            production: {
                                                ...settings.business.production,
                                                bufferDays: parseInt(e.target.value) || 0,
                                            },
                                        },
                                    })
                                }
                                style={{ width: '70px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', fontWeight: 700, backgroundColor: '#FFFFFF' }}
                            />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#8A5D18' }}>Buffer Days</span>
                        </div>
                    </div>
                </div>

                {/* 4. Customer Contact Experience */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4975A' }}>
                            <FiMessageSquare size={18} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Customer-Facing Contact Experience
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Availability promises and pre-filled inquiry text for the floating WhatsApp button.
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Response Time Guarantee
                            </label>
                            <input
                                type="text"
                                value={settings.business.contact.responseTimePromise}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            contact: { ...settings.business.contact, responseTimePromise: e.target.value },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                WhatsApp Consultation Hours
                            </label>
                            <input
                                type="text"
                                value={settings.business.contact.whatsappHours}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            contact: { ...settings.business.contact, whatsappHours: e.target.value },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                            />
                        </div>

                        <div style={{ gridColumn: '1 / -1' }}>
                            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                Pre-filled WhatsApp Customer Message
                            </label>
                            <textarea
                                rows={2}
                                value={settings.business.contact.prefilledMessage}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        business: {
                                            ...settings.business,
                                            contact: { ...settings.business.contact, prefilledMessage: e.target.value },
                                        },
                                    })
                                }
                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', fontFamily: 'inherit', boxSizing: 'border-box' }}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
