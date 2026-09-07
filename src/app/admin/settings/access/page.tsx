'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
    getAdminSettings,
    saveAdminSettings,
    MasterAdminSettings,
    AdminUser,
    INITIAL_ADMIN_SETTINGS,
} from '@/data/adminSettingsData'
import {
    FiArrowLeft,
    FiSave,
    FiCheckCircle,
    FiUsers,
    FiShield,
    FiLock,
    FiPlus,
    FiEdit2,
    FiTrash2,
    FiX,
    FiAlertTriangle,
} from '@/components/admin/SettingsIcons'

export default function AccessControlPage() {
    const [settings, setSettings] = useState<MasterAdminSettings>(INITIAL_ADMIN_SETTINGS)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState<AdminUser | null>(null)

    // Form states for Invite Modal
    const [newUserName, setNewUserName] = useState('')
    const [newUserEmail, setNewUserEmail] = useState('')
    const [newUserRole, setNewUserRole] = useState<'Admin' | 'Tailor'>('Tailor')

    useEffect(() => {
        const loaded = getAdminSettings()
        setSettings(loaded)
    }, [])

    const handleSave = (newSettings: MasterAdminSettings, msg: string) => {
        setSettings(newSettings)
        saveAdminSettings(newSettings)
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const toggleUserStatus = (userId: string) => {
        const updatedUsers = settings.access.users.map((u) => {
            if (u.id === userId) {
                const nextStatus = u.status === 'Active' ? 'Inactive' : 'Active'
                return { ...u, status: nextStatus as any }
            }
            return u
        })
        const next = { ...settings, access: { ...settings.access, users: updatedUsers } }
        handleSave(next, 'User status updated.')
    }

    const handleInviteSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newUserName.trim() || !newUserEmail.trim()) return

        const initials = newUserName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)

        const newUser: AdminUser = {
            id: `usr-${Date.now()}`,
            name: newUserName,
            email: newUserEmail,
            role: newUserRole,
            status: 'Active',
            lastLogin: 'Invitation pending (48h)',
            avatarInitials: initials,
            avatarColor: newUserRole === 'Admin' ? '#C4975A' : '#1C0F07',
            assignedOrdersCount: 0,
        }

        const next = {
            ...settings,
            access: { ...settings.access, users: [...settings.access.users, newUser] },
        }
        handleSave(next, `Invitation email dispatched to ${newUserEmail}!`)
        setIsInviteModalOpen(false)
        setNewUserName('')
        setNewUserEmail('')
    }

    const handleEditUserSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingUser) return

        const updatedUsers = settings.access.users.map((u) =>
            u.id === editingUser.id ? editingUser : u
        )
        const next = {
            ...settings,
            access: { ...settings.access, users: updatedUsers },
        }
        handleSave(next, `Account for ${editingUser.name} updated.`)
        setEditingUser(null)
    }

    const handleDeleteUser = (userId: string) => {
        if (confirm('Are you sure you want to permanently revoke and delete this account?')) {
            const updatedUsers = settings.access.users.filter((u) => u.id !== userId)
            const next = {
                ...settings,
                access: { ...settings.access, users: updatedUsers },
            }
            handleSave(next, 'Staff account permanently removed.')
            setEditingUser(null)
        }
    }

    const handleForceLogoutAll = () => {
        if (confirm('Force all active sessions across all devices to log out immediately?')) {
            setToastMessage('All active admin & tailor sessions terminated.')
            setTimeout(() => setToastMessage(null), 4000)
        }
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
            {/* Header & Breadcrumb */}
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
                        <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Access Control</span>
                    </div>
                    <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                        Staff Access Control & User Roles
                    </h1>
                    <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                        Manage studio administrator privileges, tailor accounts, permissions, and security audit logs.
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
                        onClick={() => setIsInviteModalOpen(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 18px',
                            backgroundColor: '#1C0F07',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            color: '#FAF7F2',
                            cursor: 'pointer',
                        }}
                    >
                        <FiPlus size={16} color="#C4975A" /> Invite New Staff
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Section 1: Staff User Accounts Table */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        overflowX: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Authorized Atelier Users ({settings.access.users.length})
                        </h2>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Staff Member</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Email Address</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Role</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Status</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Last Login</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1C0F07' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {settings.access.users.map((user) => (
                                <tr key={user.id} style={{ borderBottom: '1px solid #EDE8E1' }}>
                                    <td style={{ padding: '14px 16px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div
                                                style={{
                                                    width: '34px',
                                                    height: '34px',
                                                    borderRadius: '8px',
                                                    backgroundColor: user.avatarColor,
                                                    color: '#FFFFFF',
                                                    fontWeight: 700,
                                                    fontSize: '12px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                }}
                                            >
                                                {user.avatarInitials}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#1C0F07' }}>{user.name}</div>
                                                {user.assignedOrdersCount !== undefined && (
                                                    <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                                        {user.assignedOrdersCount} active commissions
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{ padding: '14px 16px', color: '#7C6F65' }}>
                                        {user.email}
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: 700,
                                                padding: '3px 8px',
                                                borderRadius: '6px',
                                                backgroundColor: user.role === 'Admin' ? '#FDF6ED' : '#F5F5F5',
                                                color: user.role === 'Admin' ? '#C4975A' : '#1C0F07',
                                            }}
                                        >
                                            {user.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px' }}>
                                        <span
                                            style={{
                                                fontSize: '11px',
                                                fontWeight: 600,
                                                color: user.status === 'Active' ? '#2E7D32' : '#C62828',
                                            }}
                                        >
                                            ● {user.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#7C6F65' }}>
                                        {user.lastLogin}
                                    </td>
                                    <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setEditingUser(user)}
                                                style={{
                                                    padding: '6px 10px',
                                                    borderRadius: '6px',
                                                    border: '1px solid #EDE8E1',
                                                    backgroundColor: '#FAF7F2',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#1C0F07',
                                                    cursor: 'pointer',
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                }}
                                            >
                                                <FiEdit2 size={12} /> Edit
                                            </button>
                                            {user.id !== 'usr-1' && (
                                                <button
                                                    type="button"
                                                    onClick={() => toggleUserStatus(user.id)}
                                                    style={{
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #EDE8E1',
                                                        backgroundColor: user.status === 'Active' ? '#FFF8F6' : '#E8F5E9',
                                                        fontSize: '12px',
                                                        fontWeight: 600,
                                                        color: user.status === 'Active' ? '#C62828' : '#2E7D32',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {user.status === 'Active' ? 'Deactivate' : 'Reactivate'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Section 2: Role Permissions Reference Matrix */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        overflowX: 'auto',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1565C0' }}>
                            <FiShield size={18} />
                        </div>
                        <div>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Role Permissions Reference Matrix
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Tailors are strictly restricted to assigned commissions and inspection media to safeguard financial confidentiality.
                            </p>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#1C0F07' }}>Studio Module</th>
                                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#C4975A' }}>Admin Role (Samuelson)</th>
                                <th style={{ padding: '10px 16px', fontWeight: 700, color: '#7C6F65' }}>Tailor Staff Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { module: 'Orders & Production Board', admin: 'Full Access (All pipeline orders)', tailor: 'Assigned orders only + Inspection media upload' },
                                { module: 'Customer Profiles & Contacts', admin: 'Full Access (Measurements, CRM, LTV)', tailor: 'Restricted (Only order measurements)' },
                                { module: 'Catalogue & Silhouette Pricing', admin: 'Full Access (Add/Edit designs & prices)', tailor: 'No Access' },
                                { module: 'Patron Lookbook Reviews', admin: 'Full Access (Moderation & approval)', tailor: 'No Access' },
                                { module: 'Referral Programme', admin: 'Full Access (Advocates & payouts)', tailor: 'No Access' },
                                { module: 'Editorial Journal (Blog)', admin: 'Full Access (Draft & publish articles)', tailor: 'No Access' },
                                { module: 'Email Marketing & Broadcasts', admin: 'Full Access (Campaign composer)', tailor: 'No Access' },
                                { module: 'Analytics & Revenue Intel', admin: 'Full Access (All financial metrics)', tailor: 'No Access' },
                                { module: 'Settings & API Credentials', admin: 'Full Access (Gateways & danger zone)', tailor: 'No Access' },
                            ].map((row, idx) => (
                                <tr key={idx} style={{ borderBottom: '1px solid #EDE8E1' }}>
                                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1C0F07' }}>{row.module}</td>
                                    <td style={{ padding: '12px 16px', color: '#2E7D32', fontWeight: 600 }}>✓ {row.admin}</td>
                                    <td style={{ padding: '12px 16px', color: row.tailor === 'No Access' ? '#C62828' : '#1C0F07' }}>
                                        {row.tailor === 'No Access' ? '✕ ' : '● '}
                                        {row.tailor}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Section 3: Session Security & Login History */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))', gap: '24px' }}>
                    {/* Session Settings */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}
                    >
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                                <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C4975A' }}>
                                    <FiLock size={18} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                        Session Expiration & Security
                                    </h2>
                                    <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                        Configure automatic logout thresholds to protect confidential measurements.
                                    </p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                        Inactivity Session Timeout
                                    </label>
                                    <select
                                        value={settings.access.session.timeoutMinutes}
                                        onChange={(e) => {
                                            const next = {
                                                ...settings,
                                                access: {
                                                    ...settings.access,
                                                    session: { ...settings.access.session, timeoutMinutes: parseInt(e.target.value) },
                                                },
                                            }
                                            handleSave(next, 'Session timeout updated.')
                                        }}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                                    >
                                        <option value={15}>15 minutes (High Security)</option>
                                        <option value={30}>30 minutes</option>
                                        <option value={60}>60 minutes (Atelier Default)</option>
                                        <option value={120}>120 minutes (Extended)</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                        Remember Me Login Duration
                                    </label>
                                    <select
                                        value={settings.access.session.rememberMeDays}
                                        onChange={(e) => {
                                            const next = {
                                                ...settings,
                                                access: {
                                                    ...settings.access,
                                                    session: { ...settings.access.session, rememberMeDays: parseInt(e.target.value) },
                                                },
                                            }
                                            handleSave(next, 'Remember me duration updated.')
                                        }}
                                        style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                                    >
                                        <option value={7}>7 Days</option>
                                        <option value={14}>14 Days</option>
                                        <option value={30}>30 Days (Recommended)</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #EDE8E1' }}>
                            <button
                                type="button"
                                onClick={handleForceLogoutAll}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '8px',
                                    border: '1px solid #FFCDD2',
                                    backgroundColor: '#FFF8F6',
                                    color: '#C62828',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                Force All Active Sessions to Log Out
                            </button>
                        </div>
                    </div>

                    {/* Login Audit Trail */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ marginBottom: '16px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Audit Login History (Recent Events)
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Logs devices, IP addresses, and flags potential security anomalies.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {settings.access.loginHistory.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        padding: '12px 14px',
                                        borderRadius: '8px',
                                        backgroundColor: item.isUnusual ? '#FFF8F6' : '#FAF7F2',
                                        border: item.isUnusual ? '1px solid #FFCDD2' : '1px solid #EDE8E1',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                    }}
                                >
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>
                                                {item.userName}
                                            </span>
                                            {item.isUnusual && (
                                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#C62828', backgroundColor: '#FFEBEE', padding: '2px 6px', borderRadius: '4px' }}>
                                                    New Location
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                            {item.device} • IP: {item.ipAddress}
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#1C0F07' }}>
                                            {item.location}
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#8C7B6B' }}>
                                            {item.timestamp}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Invite New User Modal */}
            {isInviteModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                            maxWidth: '460px',
                            width: '100%',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Invite New Staff Member
                            </h3>
                            <button
                                type="button"
                                onClick={() => setIsInviteModalOpen(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C6F65' }}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleInviteSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Chukwudi Eze"
                                    value={newUserName}
                                    onChange={(e) => setNewUserName(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    placeholder="e.g. chukwudi.tailor@captainstitches.com"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Role Privileges
                                </label>
                                <select
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as any)}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                                >
                                    <option value="Tailor">Tailor (Restricted: Assigned orders & inspection only)</option>
                                    <option value="Admin">Admin (Full Access: Financials, settings & lookbooks)</option>
                                </select>
                            </div>

                            <div style={{ padding: '10px 12px', backgroundColor: '#FAF7F2', borderRadius: '6px', fontSize: '11px', color: '#7C6F65' }}>
                                ℹ️ An invitation link will be dispatched via email allowing the user to create their password. Links expire in 48 hours.
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsInviteModalOpen(false)}
                                    style={{ padding: '8px 16px', borderRadius: '6px', border: '1px solid #EDE8E1', backgroundColor: '#FAF7F2', fontSize: '12px', fontWeight: 600, color: '#7C6F65', cursor: 'pointer' }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#1C0F07', fontSize: '12px', fontWeight: 600, color: '#FAF7F2', cursor: 'pointer' }}
                                >
                                    Dispatch Invitation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {editingUser && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.45)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 100,
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                            maxWidth: '460px',
                            width: '100%',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Edit User: {editingUser.name}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setEditingUser(null)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7C6F65' }}
                            >
                                <FiX size={18} />
                            </button>
                        </div>

                        <form onSubmit={handleEditUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    value={editingUser.name}
                                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={editingUser.email}
                                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', boxSizing: 'border-box' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#1C0F07', marginBottom: '6px' }}>
                                    Role
                                </label>
                                <select
                                    value={editingUser.role}
                                    disabled={editingUser.id === 'usr-1'}
                                    onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                                    style={{ width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #EDE8E1', fontSize: '13px', backgroundColor: '#FAF7F2', fontWeight: 600 }}
                                >
                                    <option value="Admin">Admin</option>
                                    <option value="Tailor">Tailor</option>
                                </select>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #EDE8E1' }}>
                                {editingUser.id !== 'usr-1' ? (
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteUser(editingUser.id)}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            border: '1px solid #FFCDD2',
                                            backgroundColor: '#FFF8F6',
                                            color: '#C62828',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <FiTrash2 size={12} /> Delete Account
                                    </button>
                                ) : (
                                    <span style={{ fontSize: '11px', color: '#7C6F65' }}>Primary Founder Account</span>
                                )}

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setEditingUser(null)}
                                        style={{ padding: '8px 14px', borderRadius: '6px', border: '1px solid #EDE8E1', backgroundColor: '#FAF7F2', fontSize: '12px', fontWeight: 600, color: '#7C6F65', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{ padding: '8px 18px', borderRadius: '6px', border: 'none', backgroundColor: '#1C0F07', fontSize: '12px', fontWeight: 600, color: '#FAF7F2', cursor: 'pointer' }}
                                    >
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
