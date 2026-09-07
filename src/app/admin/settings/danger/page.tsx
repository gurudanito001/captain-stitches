'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminSettings,
    saveAdminSettings,
    MasterAdminSettings,
    downloadPlatformExportArchive,
} from '@/data/adminSettingsData'
import {
    FiArrowLeft,
    FiAlertTriangle,
    FiDownload,
    FiTrash2,
    FiShield,
    FiLock,
    FiRefreshCw,
    FiCheck,
    FiX,
    FiClock,
} from '@/components/admin/SettingsIcons'

type DangerActionType = 'test_orders' | 'catalogue' | 'subscribers' | 'factory_reset' | null

export default function AdminDangerZoneSettingsPage() {
    const [settings, setSettings] = useState<MasterAdminSettings | null>(null)
    const [activeModal, setActiveModal] = useState<DangerActionType>(null)
    const [confirmInputText, setConfirmInputText] = useState('')
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [isExporting, setIsExporting] = useState(false)

    useEffect(() => {
        setSettings(getAdminSettings())
    }, [])

    if (!settings) {
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
                Loading danger zone...
            </div>
        )
    }

    const { danger } = settings

    const triggerToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handleExportBackup = () => {
        setIsExporting(true)
        downloadPlatformExportArchive()
        const now = new Date()
        const timestampStr = `${now.toLocaleString('default', { month: 'short' })} ${now.getDate()}, ${now.getFullYear()} · ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} CET`

        const updated = {
            ...settings,
            danger: {
                ...danger,
                lastBackupTimestamp: timestampStr,
            },
            lastUpdated: new Date().toISOString(),
        }
        setSettings(updated)
        saveAdminSettings(updated)
        setIsExporting(false)
        triggerToast('Platform backup archive generated and downloaded')
    }

    const openConfirmModal = (type: DangerActionType) => {
        setActiveModal(type)
        setConfirmInputText('')
    }

    const handleExecuteDangerAction = () => {
        if (!activeModal) return

        if (activeModal === 'test_orders') {
            triggerToast('Test orders purged. Live production orders preserved.')
        } else if (activeModal === 'catalogue') {
            triggerToast('Catalogue designs reset to factory master collection.')
        } else if (activeModal === 'subscribers') {
            triggerToast('Inactive and unsubscribed marketing contacts purged.')
        } else if (activeModal === 'factory_reset') {
            const updated = {
                ...settings,
                danger: {
                    ...danger,
                    factoryResetPending: true,
                },
                lastUpdated: new Date().toISOString(),
            }
            setSettings(updated)
            saveAdminSettings(updated)
            triggerToast('Studio wipe initiated. 24-hour lockout timer active.')
        }

        setActiveModal(null)
        setConfirmInputText('')
    }

    const getModalDetails = () => {
        switch (activeModal) {
            case 'test_orders':
                return {
                    title: 'Purge All Staging Test Orders',
                    phrase: 'DELETE TEST ORDERS',
                    description:
                        'This will permanently delete all mock orders generated during platform setup. Active customer bespoke orders in production will NOT be affected.',
                    btnLabel: 'Purge Test Orders',
                }
            case 'catalogue':
                return {
                    title: 'Reset Catalogue to Defaults',
                    phrase: 'RESET CATALOGUE',
                    description:
                        'This will restore the lookbook catalogue to the original 24 atelier designs and remove any custom draft items.',
                    btnLabel: 'Reset Catalogue',
                }
            case 'subscribers':
                return {
                    title: 'Purge Inactive Subscribers',
                    phrase: 'DELETE SUBSCRIBERS',
                    description:
                        'This will permanently remove unsubscribed and inactive email contacts who have not engaged in over 90 days.',
                    btnLabel: 'Delete Inactive Contacts',
                }
            case 'factory_reset':
                return {
                    title: 'Studio Factory Reset (Nuclear Action)',
                    phrase: 'CAPTAINSTITCHES',
                    description:
                        'WARNING: This will initiate a total atelier reset. All custom configurations, notifications, and temporary data will be wiped. A 24-hour safety delay will lock this action before finalization.',
                    btnLabel: 'Initiate 24h Factory Wipe',
                }
            default:
                return { title: '', phrase: '', description: '', btnLabel: '' }
        }
    }

    const modalDetails = getModalDetails()
    const isPhraseValid = confirmInputText.trim() === modalDetails.phrase

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
            {toastMessage && (
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

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div
                        style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '10px',
                            backgroundColor: '#FCE8E6',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#D93025',
                        }}
                    >
                        <FiAlertTriangle size={22} />
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
                            Danger Zone
                        </h1>
                        <p
                            style={{
                                fontSize: '13px',
                                color: '#7C6F64',
                                margin: '4px 0 0 0',
                            }}
                        >
                            High-consequence data purges, complete studio backups, and factory reset safeguards.
                        </p>
                    </div>
                </div>
            </div>

            {/* Prominent Warning Banner */}
            <div
                style={{
                    backgroundColor: '#FFF8F6',
                    border: '1px solid #FAD2CF',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    marginBottom: '28px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#FCE8E6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#D93025',
                        flexShrink: 0,
                        marginTop: '2px',
                    }}
                >
                    <FiShield size={20} />
                </div>
                <div>
                    <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#D93025', margin: '0 0 6px 0' }}>
                        Irreversible Studio Operations
                    </h2>
                    <p style={{ fontSize: '13px', color: '#5F2120', lineHeight: 1.5, margin: 0 }}>
                        Actions executed in this section can permanently remove production records, orders, and
                        configurations. All destructive operations require exact confirmation phrases to ensure
                        they cannot be triggered by accident. Always export a platform backup prior to major maintenance.
                    </p>
                </div>
            </div>

            {/* Danger Actions List */}
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    marginBottom: '36px',
                }}
            >
                {/* 1. Export Platform Backup (Safe, positive action) */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div style={{ maxWidth: '640px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0, color: '#1C0F07' }}>
                                Consolidated Platform Backup
                            </h3>
                            <span
                                style={{
                                    backgroundColor: '#E6F4EA',
                                    color: '#137333',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    padding: '2px 8px',
                                    borderRadius: '10px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                }}
                            >
                                Recommended
                            </span>
                        </div>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: '0 0 8px 0', lineHeight: 1.45 }}>
                            Downloads a complete snapshot of all customers, measurements, bespoke orders, catalogue
                            designs, and settings as a consolidated JSON archive.
                        </p>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '11px',
                                color: '#A09383',
                            }}
                        >
                            <FiClock size={12} />
                            <span>Last backup created: </span>
                            <strong style={{ color: '#1C0F07' }}>{danger.lastBackupTimestamp}</strong>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleExportBackup}
                        disabled={isExporting}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#1C0F07',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '11px 20px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <FiDownload size={15} color="#C4975A" />
                        {isExporting ? 'Generating Archive...' : 'Download Full Backup'}
                    </button>
                </div>

                {/* 2. Clear Test Orders */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div style={{ maxWidth: '640px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px 0', color: '#1C0F07' }}>
                            Purge Staging & Test Orders
                        </h3>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0, lineHeight: 1.45 }}>
                            Deletes development mock transactions, test receipts, and sample production stages. Real
                            customer measurement records and active production orders will remain untouched.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => openConfirmModal('test_orders')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#FAF7F2',
                            color: '#D93025',
                            border: '1px solid #FAD2CF',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <FiTrash2 size={14} />
                        Clear Test Orders
                    </button>
                </div>

                {/* 3. Reset Catalogue */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div style={{ maxWidth: '640px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px 0', color: '#1C0F07' }}>
                            Reset Catalogue to Atelier Baseline
                        </h3>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0, lineHeight: 1.45 }}>
                            Reverts the bespoke catalogue to the official 24 foundation pieces (bespoke suits, tuxedos,
                            senator sets, and kaftans), clearing any custom test drafts.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => openConfirmModal('catalogue')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#FAF7F2',
                            color: '#D93025',
                            border: '1px solid #FAD2CF',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <FiRefreshCw size={14} />
                        Reset Catalogue
                    </button>
                </div>

                {/* 4. Delete Inactive Subscribers */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div style={{ maxWidth: '640px' }}>
                        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 6px 0', color: '#1C0F07' }}>
                            Purge Inactive Email Subscribers
                        </h3>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0, lineHeight: 1.45 }}>
                            Cleans the Brevo and Resend marketing audience by removing bounced or unsubscribed
                            addresses over 90 days old to protect sender reputation and deliverability.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => openConfirmModal('subscribers')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#FAF7F2',
                            color: '#D93025',
                            border: '1px solid #FAD2CF',
                            padding: '10px 18px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <FiTrash2 size={14} />
                        Purge Inactive List
                    </button>
                </div>

                {/* 5. Nuclear Option: Factory Reset */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '2px solid #D93025',
                        padding: '28px',
                        boxShadow: '0 4px 20px rgba(217, 48, 37, 0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '20px',
                    }}
                >
                    <div style={{ maxWidth: '640px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <FiLock size={16} color="#D93025" />
                            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#D93025' }}>
                                Studio Factory Reset (Nuclear Wipe)
                            </h3>
                        </div>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0, lineHeight: 1.5 }}>
                            Reverts the entire platform back to day-zero state. All credentials, staff roles,
                            custom notification templates, and business parameters will be deleted. Protected by a
                            24-hour lock.
                        </p>
                        {danger.factoryResetPending && (
                            <div
                                style={{
                                    marginTop: '12px',
                                    display: 'inline-block',
                                    padding: '6px 12px',
                                    backgroundColor: '#FCE8E6',
                                    color: '#D93025',
                                    fontSize: '12px',
                                    fontWeight: 700,
                                    borderRadius: '6px',
                                }}
                            >
                                Safety Lock Active: Factory reset scheduled in 23h 58m.
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={() => openConfirmModal('factory_reset')}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            backgroundColor: '#D93025',
                            color: '#FFFFFF',
                            border: 'none',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(217, 48, 37, 0.25)',
                        }}
                    >
                        <FiAlertTriangle size={16} />
                        Initiate Studio Wipe
                    </button>
                </div>
            </div>

            {/* Safety Confirmation Modal */}
            {activeModal && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.55)',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            maxWidth: '500px',
                            width: '100%',
                            padding: '28px',
                            boxShadow: '0 20px 50px rgba(28, 15, 7, 0.25)',
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '16px',
                            }}
                        >
                            <div
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FCE8E6',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#D93025',
                                }}
                            >
                                <FiAlertTriangle size={20} />
                            </div>

                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: '#7C6F64',
                                    padding: '4px',
                                }}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#1C0F07' }}>
                            {modalDetails.title}
                        </h3>

                        <p style={{ fontSize: '13px', color: '#7C6F64', lineHeight: 1.5, margin: '0 0 20px 0' }}>
                            {modalDetails.description}
                        </p>

                        <div
                            style={{
                                backgroundColor: '#FAF7F2',
                                padding: '14px',
                                borderRadius: '8px',
                                border: '1px dashed #D1C9BE',
                                marginBottom: '20px',
                            }}
                        >
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    marginBottom: '6px',
                                }}
                            >
                                Type <strong style={{ color: '#D93025' }}>{modalDetails.phrase}</strong> to confirm:
                            </label>
                            <input
                                type="text"
                                value={confirmInputText}
                                onChange={(e) => setConfirmInputText(e.target.value)}
                                placeholder={modalDetails.phrase}
                                style={{
                                    width: '100%',
                                    padding: '10px 12px',
                                    borderRadius: '6px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    fontFamily: 'monospace',
                                    fontWeight: 700,
                                    color: '#1C0F07',
                                    outline: 'none',
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => setActiveModal(null)}
                                style={{
                                    padding: '9px 18px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#7C6F64',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={handleExecuteDangerAction}
                                disabled={!isPhraseValid}
                                style={{
                                    padding: '9px 20px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: isPhraseValid ? '#D93025' : '#E5C9C7',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: isPhraseValid ? 'pointer' : 'not-allowed',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: isPhraseValid ? '0 2px 8px rgba(217, 48, 37, 0.25)' : 'none',
                                }}
                            >
                                <FiTrash2 size={14} />
                                {modalDetails.btnLabel}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
