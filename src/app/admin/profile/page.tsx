'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminProfile,
    saveAdminProfile,
    getActiveSessions,
    terminateSession,
    terminateAllOtherSessions,
    AdminProfile,
    ActiveSession,
} from '@/data/adminProfileData'
import {
    FiArrowLeft,
    FiCheck,
    FiSave,
    FiShield,
    FiLock,
    FiKey,
    FiTrash2,
    FiX,
    FiEye,
    FiClock,
    FiGlobe,
} from '@/components/admin/SettingsIcons'

export default function AdminProfilePage() {
    const [profile, setProfile] = useState<AdminProfile | null>(null)
    const [initialProfile, setInitialProfile] = useState<AdminProfile | null>(null)
    const [activeSessions, setActiveSessions] = useState<ActiveSession[]>([])
    const [isSavedToast, setIsSavedToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('Profile updated successfully')

    // Change Email Modal State
    const [isChangeEmailOpen, setIsChangeEmailOpen] = useState(false)
    const [newEmailInput, setNewEmailInput] = useState('')
    const [emailChangeSuccess, setEmailChangeSuccess] = useState(false)

    useEffect(() => {
        const p = getAdminProfile()
        setProfile(p)
        setInitialProfile(JSON.parse(JSON.stringify(p)))
        setActiveSessions(getActiveSessions())
    }, [])

    if (!profile || !initialProfile) {
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
                Loading profile...
            </div>
        )
    }

    const isDirty = JSON.stringify(profile) !== JSON.stringify(initialProfile)

    const handleSave = () => {
        const now = new Date()
        const timestamp = `Today at ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} CET`
        const updated = {
            ...profile,
            lastUpdated: timestamp,
        }
        setProfile(updated)
        setInitialProfile(JSON.parse(JSON.stringify(updated)))
        saveAdminProfile(updated)
        setToastMessage('Personal details saved successfully')
        setIsSavedToast(true)
        setTimeout(() => setIsSavedToast(false), 2500)
    }

    const handlePhoneChange = (val: string) => {
        if (profile.sameAsPhone) {
            setProfile({ ...profile, phone: val, whatsApp: val })
        } else {
            setProfile({ ...profile, phone: val })
        }
    }

    const handleSameAsPhoneToggle = (checked: boolean) => {
        if (checked) {
            setProfile({ ...profile, sameAsPhone: true, whatsApp: profile.phone })
        } else {
            setProfile({ ...profile, sameAsPhone: false })
        }
    }

    const handleTerminateSession = (id: string) => {
        const updated = terminateSession(id)
        setActiveSessions(updated)
        setToastMessage('Device session terminated')
        setIsSavedToast(true)
        setTimeout(() => setIsSavedToast(false), 2500)
    }

    const handleTerminateAllOther = () => {
        const updated = terminateAllOtherSessions()
        setActiveSessions(updated)
        setToastMessage('All other device sessions logged out')
        setIsSavedToast(true)
        setTimeout(() => setIsSavedToast(false), 2500)
    }

    const handleSendEmailVerification = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newEmailInput.includes('@')) return
        setEmailChangeSuccess(true)
        setTimeout(() => {
            setEmailChangeSuccess(false)
            setIsChangeEmailOpen(false)
            setNewEmailInput('')
            setToastMessage(`Confirmation sent to ${newEmailInput}`)
            setIsSavedToast(true)
            setTimeout(() => setIsSavedToast(false), 3000)
        }, 1800)
    }

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

            {/* Header Bar */}
            <div style={{ marginBottom: '28px' }}>
                <Link
                    href="/admin"
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
                    Back to Studio Dashboard
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
                            My Profile
                        </h1>
                        <p
                            style={{
                                fontSize: '13px',
                                color: '#7C6F64',
                                margin: '4px 0 0 0',
                            }}
                        >
                            Personal account preferences, contact information, and active security sessions.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                color: '#7C6F64',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #EDE8E1',
                                padding: '6px 12px',
                                borderRadius: '6px',
                            }}
                        >
                            <FiClock size={13} color="#C4975A" />
                            <span>Last updated: {profile.lastUpdated}</span>
                        </div>

                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={!isDirty}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: isDirty ? '#C4975A' : '#E5DDD1',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: isDirty ? 'pointer' : 'not-allowed',
                                boxShadow: isDirty ? '0 2px 6px rgba(196, 151, 90, 0.25)' : 'none',
                                transition: 'all 0.2s',
                            }}
                        >
                            <FiSave size={15} />
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '24px',
                    marginBottom: '32px',
                }}
            >
                {/* 1. Avatar Card */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '28px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '90px',
                            height: '90px',
                            borderRadius: '50%',
                            backgroundColor: profile.avatarColor || '#C4975A',
                            color: '#FFFFFF',
                            fontSize: '32px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginBottom: '16px',
                            boxShadow: '0 4px 14px rgba(196, 151, 90, 0.28)',
                        }}
                    >
                        {profile.avatarInitials}
                    </div>

                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#1C0F07' }}>
                        {profile.displayName || `${profile.firstName} ${profile.lastName}`}
                    </h2>

                    <div style={{ marginBottom: '16px' }}>
                        <span
                            style={{
                                display: 'inline-block',
                                fontSize: '11px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em',
                                backgroundColor: '#FDF3E7',
                                color: '#C4975A',
                                padding: '4px 10px',
                                borderRadius: '12px',
                            }}
                        >
                            {profile.role} (Read-only)
                        </span>
                    </div>

                    <p style={{ fontSize: '12px', color: '#7C6F64', margin: '0 0 20px 0', maxWidth: '280px' }}>
                        Primary administrative director with superuser authority over atelier commissions and financial gateways.
                    </p>

                    <button
                        type="button"
                        disabled
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #EDE8E1',
                            backgroundColor: '#FAF7F2',
                            color: '#A09383',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'not-allowed',
                        }}
                    >
                        Change Photo (Coming Soon)
                    </button>
                </div>

                {/* Quick Navigation Cards */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                    }}
                >
                    <div>
                        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 6px 0', color: '#1C0F07' }}>
                            Account Shortcuts
                        </h3>
                        <p style={{ fontSize: '12px', color: '#7C6F64', margin: '0 0 16px 0' }}>
                            Direct access to password credentials and personal notifications.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Link
                                href="/admin/profile/password"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #EDE8E1',
                                    textDecoration: 'none',
                                    color: '#1C0F07',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FiLock size={16} color="#C4975A" />
                                    <span>Change Password</span>
                                </div>
                                <span style={{ color: '#C4975A', fontSize: '12px' }}>Update →</span>
                            </Link>

                            <Link
                                href="/admin/profile/notifications"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '12px 14px',
                                    borderRadius: '8px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #EDE8E1',
                                    textDecoration: 'none',
                                    color: '#1C0F07',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <FiGlobe size={16} color="#C4975A" />
                                    <span>Notification Preferences</span>
                                </div>
                                <span style={{ color: '#C4975A', fontSize: '12px' }}>Configure →</span>
                            </Link>
                        </div>
                    </div>

                    <div
                        style={{
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid #EDE8E1',
                            fontSize: '11px',
                            color: '#7C6F64',
                        }}
                    >
                        🔒 Protected by CaptainStitches biometric session encryption.
                    </div>
                </div>
            </div>

            {/* 2. Personal Details Form Card */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EDE8E1',
                    padding: '28px',
                    marginBottom: '28px',
                    boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                }}
            >
                <div style={{ marginBottom: '20px' }}>
                    <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1C0F07' }}>
                        Personal & Contact Details
                    </h2>
                    <p style={{ fontSize: '13px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                        Configure the name and contact details used for concierge client messaging and authored editorial posts.
                    </p>
                </div>

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '20px',
                    }}
                >
                    {/* First Name */}
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
                            First Name
                        </label>
                        <input
                            type="text"
                            value={profile.firstName}
                            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
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

                    {/* Last Name */}
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
                            Last Name
                        </label>
                        <input
                            type="text"
                            value={profile.lastName}
                            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
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

                    {/* Display Name */}
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
                            Display Name (Sidebar & Blog Author)
                        </label>
                        <input
                            type="text"
                            value={profile.displayName}
                            onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
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
                        <p style={{ fontSize: '11px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                            Appears in the bottom sidebar chip and under journal articles.
                        </p>
                    </div>

                    {/* Email (Read-only shortcut) */}
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
                            Login Email Address
                        </label>
                        <input
                            type="email"
                            value={profile.email}
                            disabled
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#F5F2EC',
                                fontSize: '13px',
                                color: '#7C6F64',
                                outline: 'none',
                                cursor: 'not-allowed',
                            }}
                        />
                        <p style={{ fontSize: '11px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                            To modify your login email, use the security card below.
                        </p>
                    </div>

                    {/* Phone Number */}
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
                            Primary Phone Number
                        </label>
                        <input
                            type="text"
                            value={profile.phone}
                            onChange={(e) => handlePhoneChange(e.target.value)}
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

                    {/* WhatsApp Number */}
                    <div>
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                marginBottom: '6px',
                            }}
                        >
                            <label
                                style={{
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: 0,
                                }}
                            >
                                WhatsApp Number
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#7C6F64', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={profile.sameAsPhone}
                                    onChange={(e) => handleSameAsPhoneToggle(e.target.checked)}
                                    style={{ cursor: 'pointer' }}
                                />
                                <span>Same as phone</span>
                            </label>
                        </div>
                        <input
                            type="text"
                            value={profile.whatsApp}
                            disabled={profile.sameAsPhone}
                            onChange={(e) => setProfile({ ...profile, whatsApp: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: profile.sameAsPhone ? '#F5F2EC' : '#FAF7F2',
                                fontSize: '13px',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Preferred Language */}
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
                            Preferred Admin Language
                        </label>
                        <select
                            value={profile.preferredLanguage}
                            onChange={(e) =>
                                setProfile({ ...profile, preferredLanguage: e.target.value as 'en' | 'it' })
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
                            <option value="en">English (UK & International)</option>
                            <option value="it">Italiano (Verona Atelier)</option>
                        </select>
                        <p style={{ fontSize: '11px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                            Localizes admin headings and date timestamps.
                        </p>
                    </div>
                </div>
            </div>

            {/* 3. Login & Security Card */}
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
                        marginBottom: '24px',
                    }}
                >
                    <div>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1C0F07' }}>
                            Login & Active Security Sessions
                        </h2>
                        <p style={{ fontSize: '13px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                            Manage administrative credentials, review recent login activity, and revoke active sessions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleTerminateAllOther}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #EDE8E1',
                            backgroundColor: '#FAF7F2',
                            color: '#D93025',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        <FiTrash2 size={13} />
                        Log out all other devices
                    </button>
                </div>

                {/* Email Change Strip */}
                <div
                    style={{
                        backgroundColor: '#FAF7F2',
                        borderRadius: '10px',
                        padding: '16px 20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                        gap: '12px',
                        marginBottom: '24px',
                    }}
                >
                    <div>
                        <div style={{ fontSize: '11px', color: '#7C6F64', fontWeight: 600, textTransform: 'uppercase' }}>
                            Current Authorized Login Email
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1C0F07', marginTop: '2px' }}>
                            {profile.email}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsChangeEmailOpen(true)}
                        style={{
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #C4975A',
                            backgroundColor: '#FFFFFF',
                            color: '#C4975A',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Change Email Address
                    </button>
                </div>

                {/* Active Sessions List */}
                <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 14px 0', color: '#1C0F07' }}>
                        Currently Logged In Devices ({activeSessions.length})
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {activeSessions.map((sess) => (
                            <div
                                key={sess.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '14px 18px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: sess.isCurrent ? '#FDFBF7' : '#FFFFFF',
                                    flexWrap: 'wrap',
                                    gap: '12px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                    <div
                                        style={{
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '8px',
                                            backgroundColor: sess.isCurrent ? '#F0EBE1' : '#F5F5F5',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: sess.isCurrent ? '#C4975A' : '#7C6F64',
                                        }}
                                    >
                                        💻
                                    </div>

                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>
                                                {sess.deviceName}
                                            </span>
                                            {sess.isCurrent && (
                                                <span
                                                    style={{
                                                        fontSize: '10px',
                                                        fontWeight: 700,
                                                        textTransform: 'uppercase',
                                                        backgroundColor: '#E6F4EA',
                                                        color: '#137333',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                    }}
                                                >
                                                    Current Device
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#7C6F64', marginTop: '2px' }}>
                                            {sess.browser} on {sess.os} · {sess.location} ({sess.ipAddress})
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#A09383', marginTop: '1px' }}>
                                            {sess.lastActive}
                                        </div>
                                    </div>
                                </div>

                                {!sess.isCurrent && (
                                    <button
                                        type="button"
                                        onClick={() => handleTerminateSession(sess.id)}
                                        style={{
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            color: '#D93025',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Log out this device
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Change Email Modal */}
            {isChangeEmailOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
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
                            maxWidth: '460px',
                            width: '100%',
                            padding: '28px',
                            boxShadow: '0 20px 40px rgba(28, 15, 7, 0.15)',
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
                            <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#1C0F07' }}>
                                Change Login Email
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsChangeEmailOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C6F64' }}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        {emailChangeSuccess ? (
                            <div style={{ textAlign: 'center', padding: '16px 0' }}>
                                <div
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        borderRadius: '50%',
                                        backgroundColor: '#E6F4EA',
                                        color: '#137333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 12px auto',
                                    }}
                                >
                                    <FiCheck size={24} />
                                </div>
                                <h4 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px 0', color: '#1C0F07' }}>
                                    Verification Link Dispatched
                                </h4>
                                <p style={{ fontSize: '12px', color: '#7C6F64', margin: 0 }}>
                                    We sent a verification link to <strong>{newEmailInput}</strong>. Click the confirmation link in that email to finalize the email address update.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSendEmailVerification}>
                                <p style={{ fontSize: '13px', color: '#7C6F64', lineHeight: 1.45, margin: '0 0 16px 0' }}>
                                    Enter your new email address. For security, a confirmation link will be sent to the new address before your login credentials take effect.
                                </p>

                                <div style={{ marginBottom: '20px' }}>
                                    <label
                                        style={{
                                            display: 'block',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            color: '#1C0F07',
                                            marginBottom: '6px',
                                        }}
                                    >
                                        New Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        placeholder="samuelson.new@captainstitches.com"
                                        value={newEmailInput}
                                        onChange={(e) => setNewEmailInput(e.target.value)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FAF7F2',
                                            fontSize: '13px',
                                            outline: 'none',
                                        }}
                                    />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setIsChangeEmailOpen(false)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '6px',
                                            border: '1px solid #EDE8E1',
                                            backgroundColor: '#FFFFFF',
                                            fontSize: '12px',
                                            fontWeight: 500,
                                            color: '#7C6F64',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '8px 18px',
                                            borderRadius: '6px',
                                            border: 'none',
                                            backgroundColor: '#C4975A',
                                            color: '#FFFFFF',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Send Confirmation Link
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
