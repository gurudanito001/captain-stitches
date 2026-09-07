'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
    terminateAllOtherSessions,
    getAdminProfile,
} from '@/data/adminProfileData'
import {
    FiArrowLeft,
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheck,
    FiCheckCircle,
    FiAlertTriangle,
    FiShield,
} from '@/components/admin/SettingsIcons'

export default function AdminChangePasswordPage() {
    const profile = getAdminProfile()
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [showCurrent, setShowCurrent] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    const [isSaved, setIsSaved] = useState(false)
    const [savedTimestamp, setSavedTimestamp] = useState('')

    // Password requirements verification
    const hasMinLength = newPassword.length >= 8
    const hasUppercase = /[A-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

    const allRequirementsMet =
        hasMinLength && hasUppercase && hasNumber && hasSpecial && passwordsMatch && currentPassword.length > 0

    // Strength calculation
    const getStrength = () => {
        if (newPassword.length === 0) return { label: '', color: '', percent: 0 }
        if (!hasMinLength) return { label: 'Weak', color: '#D93025', percent: 25 }
        let score = 0
        if (hasUppercase) score += 1
        if (hasNumber) score += 1
        if (hasSpecial) score += 1

        if (score <= 1) return { label: 'Fair', color: '#B06000', percent: 55 }
        if (score >= 2) return { label: 'Strong', color: '#137333', percent: 100 }
        return { label: 'Weak', color: '#D93025', percent: 25 }
    }

    const strength = getStrength()

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault()
        if (!allRequirementsMet) return

        // Invalidate all other active sessions (best practice)
        terminateAllOtherSessions()

        const now = new Date()
        const formatted = `${now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} at ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')} CET`
        setSavedTimestamp(formatted)
        setIsSaved(true)
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
            {/* Header Bar */}
            <div style={{ marginBottom: '28px', maxWidth: '640px' }}>
                <Link
                    href="/admin/profile"
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
                    Back to My Profile
                </Link>

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
                        <FiLock size={22} />
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
                            Change Password
                        </h1>
                        <p
                            style={{
                                fontSize: '13px',
                                color: '#7C6F64',
                                margin: '4px 0 0 0',
                            }}
                        >
                            Update your studio master password and revoke unattended active sessions.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Card */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #EDE8E1',
                    padding: '32px',
                    maxWidth: '640px',
                    boxShadow: '0 2px 10px rgba(28, 15, 7, 0.02)',
                }}
            >
                {isSaved ? (
                    /* Inline Success State */
                    <div>
                        <div
                            style={{
                                backgroundColor: '#E6F4EA',
                                borderRadius: '10px',
                                padding: '20px',
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: '14px',
                                marginBottom: '24px',
                            }}
                        >
                            <FiCheckCircle size={22} color="#137333" style={{ flexShrink: 0, marginTop: '2px' }} />
                            <div>
                                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#137333', margin: '0 0 4px 0' }}>
                                    Password Successfully Updated
                                </h3>
                                <p style={{ fontSize: '13px', color: '#202124', margin: '0 0 10px 0', lineHeight: 1.45 }}>
                                    Your password was changed on <strong>{savedTimestamp}</strong>.
                                </p>
                                <p style={{ fontSize: '12px', color: '#5F6368', margin: 0, lineHeight: 1.45 }}>
                                    Security notice: All other active device sessions have been automatically logged out. A security confirmation email has been dispatched to <strong>{profile.email}</strong>.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <Link
                                href="/admin/profile"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    backgroundColor: '#C4975A',
                                    color: '#FFFFFF',
                                    padding: '10px 20px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                Return to Profile
                            </Link>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsSaved(false)
                                    setCurrentPassword('')
                                    setNewPassword('')
                                    setConfirmPassword('')
                                }}
                                style={{
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #EDE8E1',
                                    color: '#1C0F07',
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Change Again
                            </button>
                        </div>
                    </div>
                ) : (
                    /* Password Input Form */
                    <form onSubmit={handleSavePassword}>
                        {/* Current Password */}
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
                                Current Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showCurrent ? 'text' : 'password'}
                                    required
                                    placeholder="Enter current password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 40px 11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        backgroundColor: '#FAF7F2',
                                        fontSize: '13px',
                                        color: '#1C0F07',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrent(!showCurrent)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#7C6F64',
                                        padding: '4px',
                                    }}
                                >
                                    {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            <p style={{ fontSize: '11px', color: '#7C6F64', margin: '4px 0 0 0' }}>
                                Required to verify your identity on this screen.
                            </p>
                        </div>

                        {/* New Password */}
                        <div style={{ marginBottom: '16px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    marginBottom: '6px',
                                }}
                            >
                                New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    required
                                    placeholder="Create new strong password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 40px 11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        backgroundColor: '#FAF7F2',
                                        fontSize: '13px',
                                        color: '#1C0F07',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#7C6F64',
                                        padding: '4px',
                                    }}
                                >
                                    {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {newPassword.length > 0 && (
                                <div style={{ marginTop: '8px' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            marginBottom: '4px',
                                        }}
                                    >
                                        <span style={{ fontSize: '11px', color: '#7C6F64' }}>Password Strength:</span>
                                        <span style={{ fontSize: '11px', fontWeight: 700, color: strength.color }}>
                                            {strength.label}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            width: '100%',
                                            height: '4px',
                                            backgroundColor: '#EDE8E1',
                                            borderRadius: '2px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: `${strength.percent}%`,
                                                height: '100%',
                                                backgroundColor: strength.color,
                                                transition: 'width 0.25s ease, background-color 0.25s ease',
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm New Password */}
                        <div style={{ marginBottom: '22px' }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    marginBottom: '6px',
                                }}
                            >
                                Confirm New Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    required
                                    placeholder="Repeat new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '11px 40px 11px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #EDE8E1',
                                        backgroundColor: '#FAF7F2',
                                        fontSize: '13px',
                                        color: '#1C0F07',
                                        outline: 'none',
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    style={{
                                        position: 'absolute',
                                        right: '12px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: '#7C6F64',
                                        padding: '4px',
                                    }}
                                >
                                    {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && !passwordsMatch && (
                                <p style={{ fontSize: '11px', color: '#D93025', margin: '4px 0 0 0' }}>
                                    Passwords do not match.
                                </p>
                            )}
                        </div>

                        {/* Password Requirements Checklist */}
                        <div
                            style={{
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #EDE8E1',
                                borderRadius: '8px',
                                padding: '16px',
                                marginBottom: '24px',
                            }}
                        >
                            <div
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.04em',
                                    color: '#7C6F64',
                                    marginBottom: '10px',
                                }}
                            >
                                Password Security Checklist:
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: hasMinLength ? '#137333' : '#7C6F64',
                                    }}
                                >
                                    <span style={{ fontWeight: 700 }}>{hasMinLength ? '✓' : '○'}</span>
                                    <span>At least 8 characters</span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: hasUppercase ? '#137333' : '#7C6F64',
                                    }}
                                >
                                    <span style={{ fontWeight: 700 }}>{hasUppercase ? '✓' : '○'}</span>
                                    <span>At least one uppercase</span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: hasNumber ? '#137333' : '#7C6F64',
                                    }}
                                >
                                    <span style={{ fontWeight: 700 }}>{hasNumber ? '✓' : '○'}</span>
                                    <span>At least one number</span>
                                </div>

                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '12px',
                                        color: hasSpecial ? '#137333' : '#7C6F64',
                                    }}
                                >
                                    <span style={{ fontWeight: 700 }}>{hasSpecial ? '✓' : '○'}</span>
                                    <span>At least one symbol</span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <Link
                                href="/admin/profile"
                                style={{
                                    padding: '10px 18px',
                                    borderRadius: '8px',
                                    border: '1px solid #EDE8E1',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    color: '#7C6F64',
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                }}
                            >
                                Cancel
                            </Link>

                            <button
                                type="submit"
                                disabled={!allRequirementsMet}
                                style={{
                                    padding: '10px 22px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: allRequirementsMet ? '#C4975A' : '#E5DDD1',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: allRequirementsMet ? 'pointer' : 'not-allowed',
                                    boxShadow: allRequirementsMet ? '0 2px 6px rgba(196, 151, 90, 0.25)' : 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                Save New Password
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
