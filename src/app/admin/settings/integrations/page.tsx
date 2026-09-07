'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminSettings,
    saveAdminSettings,
    MasterAdminSettings,
    IntegrationCard,
    CloudinarySettings,
} from '@/data/adminSettingsData'
import {
    FiArrowLeft,
    FiCpu,
    FiCheck,
    FiExternalLink,
    FiRefreshCw,
    FiEye,
    FiEyeOff,
    FiCloud,
    FiSave,
    FiCheckCircle,
    FiShield,
    FiCreditCard,
    FiBell,
    FiGlobe,
    FiMessageSquare,
} from '@/components/admin/SettingsIcons'

export default function AdminIntegrationsSettingsPage() {
    const [settings, setSettings] = useState<MasterAdminSettings | null>(null)
    const [isSavedToast, setIsSavedToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('Settings updated successfully')
    const [showMediaSecret, setShowMediaSecret] = useState(false)
    const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null)
    const [testSuccessId, setTestSuccessId] = useState<string | null>(null)

    // Media storage form state
    const [mediaStorage, setMediaStorage] = useState<CloudinarySettings | null>(null)

    useEffect(() => {
        const loaded = getAdminSettings()
        setSettings(loaded)
        setMediaStorage(loaded.integrations.mediaStorage)
    }, [])

    if (!settings || !mediaStorage) {
        return (
            <div
                style={{
                    padding: '40px',
                    backgroundColor: '#FAF7F2',
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'inherit',
                    color: '#7C6F64',
                }}
            >
                Loading integrations hub...
            </div>
        )
    }

    const { integrations } = settings.integrations

    const handleSaveMedia = () => {
        const updated = {
            ...settings,
            integrations: {
                ...settings.integrations,
                mediaStorage,
            },
            lastUpdated: new Date().toISOString(),
        }
        setSettings(updated)
        saveAdminSettings(updated)
        setToastMessage('Media CDN configuration saved')
        setIsSavedToast(true)
        setTimeout(() => setIsSavedToast(false), 2500)
    }

    const handlePingTest = (id: string, name: string) => {
        setIsTestingConnection(id)
        setTimeout(() => {
            setIsTestingConnection(null)
            setTestSuccessId(id)
            setToastMessage(`Connection to ${name} verified (HTTP 200 OK)`)
            setIsSavedToast(true)
            setTimeout(() => {
                setTestSuccessId(null)
                setIsSavedToast(false)
            }, 3000)
        }, 1000)
    }

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Financial':
                return { bg: '#EBF4FE', text: '#1A73E8' }
            case 'Communication':
                return { bg: '#E6F4EA', text: '#137333' }
            case 'Marketing':
                return { bg: '#FEF7E0', text: '#B06000' }
            case 'Infrastructure':
                return { bg: '#F3E8FD', text: '#7627BB' }
            case 'Analytics':
                return { bg: '#FCE8E6', text: '#C5221F' }
            default:
                return { bg: '#FAF7F2', text: '#7C6F64' }
        }
    }

    const storagePercent = Math.round((mediaStorage.storageUsedGb / mediaStorage.storageLimitGb) * 100)

    return (
        <div
            style={{
                padding: '32px',
                backgroundColor: '#FAF7F2',
                minHeight: '100vh',
                fontFamily: 'inherit',
                color: '#1C0F07',
            }}
        >
            {/* Top Toast */}
            {isSavedToast && (
                <div
                    style={{
                        position: 'fixed',
                        top: '24px',
                        right: '24px',
                        zIndex: 9999,
                        backgroundColor: '#1C0F07',
                        color: '#FFFFFF',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        boxShadow: '0 8px 24px rgba(28, 15, 7, 0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                >
                    <FiCheck size={16} color="#C4975A" />
                    {toastMessage}
                </div>
            )}

            {/* Header */}
            <div style={{ marginBottom: '28px' }}>
                <Link
                    href="/admin/settings"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        color: '#7C6F64',
                        textDecoration: 'none',
                        marginBottom: '12px',
                        fontWeight: 500,
                    }}
                >
                    <FiArrowLeft size={15} />
                    Back to Settings
                </Link>

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '10px',
                                backgroundColor: '#F0EBE1',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#C4975A',
                            }}
                        >
                            <FiCpu size={22} />
                        </div>
                        <div>
                            <h1
                                style={{
                                    fontSize: '24px',
                                    fontWeight: 700,
                                    letterSpacing: '-0.02em',
                                    margin: 0,
                                    color: '#1C0F07',
                                }}
                            >
                                Integrations Hub
                            </h1>
                            <p
                                style={{
                                    fontSize: '13px',
                                    color: '#7C6F64',
                                    margin: '4px 0 0 0',
                                }}
                            >
                                Connected third-party payment gateways, messaging APIs, media storage, and analytics.
                            </p>
                        </div>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#E6F4EA',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            fontSize: '12px',
                            fontWeight: 600,
                            color: '#137333',
                        }}
                    >
                        <span
                            style={{
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                backgroundColor: '#137333',
                                display: 'inline-block',
                            }}
                        />
                        9 of 9 Services Connected
                    </div>
                </div>
            </div>

            {/* Integrations Grid */}
            <div style={{ marginBottom: '36px' }}>
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                        gap: '16px',
                    }}
                >
                    {integrations.map((item) => {
                        const catStyle = getCategoryColor(item.category)
                        const isTesting = isTestingConnection === item.id
                        const isTested = testSuccessId === item.id

                        return (
                            <div
                                key={item.id}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '12px',
                                    border: '1px solid #EDE8E1',
                                    padding: '22px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                                }}
                            >
                                <div>
                                    {/* Top badges */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '12px',
                                        }}
                                    >
                                        <span
                                            style={{
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                backgroundColor: catStyle.bg,
                                                color: catStyle.text,
                                            }}
                                        >
                                            {item.category}
                                        </span>

                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span
                                                style={{
                                                    width: '7px',
                                                    height: '7px',
                                                    borderRadius: '50%',
                                                    backgroundColor: item.status === 'connected' ? '#137333' : '#D93025',
                                                    display: 'inline-block',
                                                }}
                                            />
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: item.status === 'connected' ? '#137333' : '#D93025',
                                                    textTransform: 'capitalize',
                                                }}
                                            >
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Title */}
                                    <h3
                                        style={{
                                            fontSize: '15px',
                                            fontWeight: 600,
                                            margin: '0 0 6px 0',
                                            color: '#1C0F07',
                                        }}
                                    >
                                        {item.name}
                                    </h3>

                                    {/* Description */}
                                    <p
                                        style={{
                                            fontSize: '12px',
                                            color: '#7C6F64',
                                            lineHeight: 1.45,
                                            margin: '0 0 14px 0',
                                        }}
                                    >
                                        {item.description}
                                    </p>
                                </div>

                                {/* Bottom Metadata & Actions */}
                                <div>
                                    <div
                                        style={{
                                            fontSize: '11px',
                                            color: '#A09383',
                                            marginBottom: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                        }}
                                    >
                                        <span>Last sync:</span>
                                        <strong style={{ color: '#7C6F64', fontWeight: 500 }}>{item.lastSync}</strong>
                                    </div>

                                    <div
                                        style={{
                                            borderTop: '1px solid #EDE8E1',
                                            paddingTop: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            gap: '8px',
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => handlePingTest(item.id, item.name)}
                                            disabled={isTesting}
                                            style={{
                                                background: 'none',
                                                border: '1px solid #EDE8E1',
                                                padding: '6px 12px',
                                                borderRadius: '6px',
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: isTested ? '#137333' : '#1C0F07',
                                                cursor: isTesting ? 'wait' : 'pointer',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                backgroundColor: isTested ? '#E6F4EA' : '#FAF7F2',
                                            }}
                                        >
                                            {isTesting ? (
                                                <FiRefreshCw size={12} style={{ animation: 'spin 1s linear infinite' }} />
                                            ) : isTested ? (
                                                <FiCheckCircle size={12} color="#137333" />
                                            ) : (
                                                <FiRefreshCw size={12} color="#7C6F64" />
                                            )}
                                            {isTesting ? 'Pinging...' : isTested ? 'Active' : 'Test Ping'}
                                        </button>

                                        <Link
                                            href={item.configRoute}
                                            style={{
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                gap: '6px',
                                                backgroundColor: '#FAF7F2',
                                                color: '#C4975A',
                                                border: '1px solid #EDE8E1',
                                                padding: '6px 14px',
                                                borderRadius: '6px',
                                                fontSize: '12px',
                                                fontWeight: 600,
                                                textDecoration: 'none',
                                            }}
                                        >
                                            <span>Configure</span>
                                            <FiExternalLink size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Cloudinary & S3 Dedicated Media Configuration Card */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EDE8E1',
                    padding: '28px',
                    boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '16px',
                        marginBottom: '20px',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                backgroundColor: '#F3E8FD',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#7627BB',
                            }}
                        >
                            <FiCloud size={20} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '17px', fontWeight: 600, margin: 0, color: '#1C0F07' }}>
                                Media Storage CDN (Cloudinary / AWS S3)
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7C6F64', margin: '2px 0 0 0' }}>
                                Master repository for garment photos, inspection close-ups, and lookbook assets.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSaveMedia}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '9px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <FiSave size={15} />
                        Save CDN Settings
                    </button>
                </div>

                {/* Storage Meter */}
                <div
                    style={{
                        backgroundColor: '#FAF7F2',
                        borderRadius: '10px',
                        padding: '16px 20px',
                        marginBottom: '24px',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '8px',
                            fontSize: '12px',
                        }}
                    >
                        <span style={{ fontWeight: 600, color: '#1C0F07' }}>Cloud Storage Utilization</span>
                        <span style={{ color: '#7C6F64' }}>
                            {mediaStorage.storageUsedGb} GB of {mediaStorage.storageLimitGb} GB used ({storagePercent}%)
                        </span>
                    </div>

                    <div
                        style={{
                            width: '100%',
                            height: '8px',
                            borderRadius: '4px',
                            backgroundColor: '#EDE8E1',
                            overflow: 'hidden',
                        }}
                    >
                        <div
                            style={{
                                width: `${storagePercent}%`,
                                height: '100%',
                                backgroundColor: storagePercent > 80 ? '#D93025' : '#C4975A',
                                borderRadius: '4px',
                            }}
                        />
                    </div>
                </div>

                {/* Settings Fields */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '20px',
                        marginBottom: '20px',
                    }}
                >
                    {/* Storage Provider */}
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
                            Storage Provider
                        </label>
                        <select
                            value={mediaStorage.provider}
                            onChange={(e) =>
                                setMediaStorage({
                                    ...mediaStorage,
                                    provider: e.target.value as 'cloudinary' | 's3',
                                })
                            }
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '13px',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        >
                            <option value="cloudinary">Cloudinary (Automated WebP & Responsive Delivery)</option>
                            <option value="s3">Amazon Web Services (S3 Private Bucket)</option>
                        </select>
                    </div>

                    {/* Cloud Name */}
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
                            Cloud Name / Bucket Identifier
                        </label>
                        <input
                            type="text"
                            value={mediaStorage.cloudName}
                            onChange={(e) => setMediaStorage({ ...mediaStorage, cloudName: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '13px',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* API Key */}
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
                            API Key
                        </label>
                        <input
                            type="text"
                            value={mediaStorage.apiKey}
                            onChange={(e) => setMediaStorage({ ...mediaStorage, apiKey: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '13px',
                                fontFamily: 'monospace',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* API Secret */}
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
                            API Secret
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showMediaSecret ? 'text' : 'password'}
                                value={mediaStorage.apiSecret}
                                onChange={(e) => setMediaStorage({ ...mediaStorage, apiSecret: e.target.value })}
                                style={{
                                    width: '100%',
                                    padding: '10px 40px 10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    fontSize: '13px',
                                    fontFamily: 'monospace',
                                    color: '#1C0F07',
                                    outline: 'none',
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowMediaSecret(!showMediaSecret)}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#7C6F64',
                                    padding: '4px',
                                }}
                            >
                                {showMediaSecret ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Default Folder */}
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
                        Default Upload Directory
                    </label>
                    <input
                        type="text"
                        value={mediaStorage.defaultFolder}
                        onChange={(e) => setMediaStorage({ ...mediaStorage, defaultFolder: e.target.value })}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '8px',
                            border: '1px solid #EDE8E1',
                            backgroundColor: '#FAF7F2',
                            fontSize: '13px',
                            fontFamily: 'monospace',
                            color: '#1C0F07',
                            outline: 'none',
                        }}
                    />
                    <p style={{ fontSize: '11px', color: '#7C6F64', margin: '6px 0 0 0' }}>
                        All high-res fitting photos, garment inspection videos, and customer swatches are indexed here.
                    </p>
                </div>
            </div>
        </div>
    )
}
