'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import {
    FiEye,
    FiEyeOff,
    FiCheckCircle,
    FiLock,
    FiArrowLeft,
    FiShield,
} from '@/components/admin/SettingsIcons'

function ResetPasswordFormContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token') || 'demo_token'

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Password requirements verification
    const hasMinLength = newPassword.length >= 8
    const hasUppercase = /[A-Z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword)
    const passwordsMatch = newPassword.length > 0 && newPassword === confirmPassword

    const allRequirementsMet =
        hasMinLength && hasUppercase && hasNumber && hasSpecial && passwordsMatch

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

    const handleReset = (e: React.FormEvent) => {
        e.preventDefault()
        if (!allRequirementsMet) return
        setIsSubmitting(true)

        setTimeout(() => {
            router.push('/admin/login?reset=1')
        }, 800)
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                backgroundColor: '#FAF7F2',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '24px',
                fontFamily: 'inherit',
                color: '#1C0F07',
            }}
        >
            {/* Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '14px',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px auto',
                        boxShadow: '0 4px 14px rgba(196, 151, 90, 0.3)',
                    }}
                >
                    <span style={{ fontSize: '1.1rem', fontWeight: 700, fontFamily: 'serif', letterSpacing: '0.04em' }}>
                        CS
                    </span>
                </div>
                <h1
                    style={{
                        fontSize: '20px',
                        fontWeight: 700,
                        letterSpacing: '-0.02em',
                        color: '#1C0F07',
                        margin: 0,
                    }}
                >
                    CaptainStitches
                </h1>
                <p
                    style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                        color: '#8C7B6B',
                        margin: '3px 0 0 0',
                    }}
                >
                    Secure Password Reset
                </p>
            </div>

            {/* Form Card */}
            <div
                style={{
                    maxWidth: '440px',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EDE8E1',
                    padding: '36px 32px',
                    boxShadow: '0 8px 30px rgba(28, 15, 7, 0.05)',
                }}
            >
                <div style={{ marginBottom: '20px' }}>
                    <div
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: '#E6F4EA',
                            color: '#137333',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '3px 8px',
                            borderRadius: '10px',
                            marginBottom: '10px',
                        }}
                    >
                        <FiShield size={12} />
                        Token Verified (Valid for 1 hour)
                    </div>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: '#1C0F07' }}>
                        Create New Password
                    </h2>
                    <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0, lineHeight: 1.45 }}>
                        Choose a secure new password for your studio administrative account.
                    </p>
                </div>

                <form onSubmit={handleReset}>
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
                                placeholder="Enter strong password"
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

                        {/* Password Strength Bar */}
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
                                    <span style={{ fontSize: '11px', color: '#7C6F64' }}>Strength:</span>
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
                                            transition: 'width 0.25s ease',
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
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

                    {/* Requirements Checklist */}
                    <div
                        style={{
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            padding: '14px',
                            marginBottom: '22px',
                        }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                            <div style={{ fontSize: '11px', color: hasMinLength ? '#137333' : '#7C6F64' }}>
                                {hasMinLength ? '✓' : '○'} 8+ characters
                            </div>
                            <div style={{ fontSize: '11px', color: hasUppercase ? '#137333' : '#7C6F64' }}>
                                {hasUppercase ? '✓' : '○'} One uppercase
                            </div>
                            <div style={{ fontSize: '11px', color: hasNumber ? '#137333' : '#7C6F64' }}>
                                {hasNumber ? '✓' : '○'} One number
                            </div>
                            <div style={{ fontSize: '11px', color: hasSpecial ? '#137333' : '#7C6F64' }}>
                                {hasSpecial ? '✓' : '○'} One symbol
                            </div>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <button
                        type="submit"
                        disabled={!allRequirementsMet || isSubmitting}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: allRequirementsMet ? '#C4975A' : '#E5DDD1',
                            color: '#FFFFFF',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: allRequirementsMet ? 'pointer' : 'not-allowed',
                            boxShadow: allRequirementsMet ? '0 2px 8px rgba(196, 151, 90, 0.3)' : 'none',
                            marginBottom: '16px',
                        }}
                    >
                        {isSubmitting ? 'Updating Password...' : 'Reset Password & Sign In'}
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <Link
                            href="/admin/login"
                            style={{
                                fontSize: '12px',
                                color: '#7C6F64',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}
                        >
                            Cancel and Return to Sign In
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function AdminResetPasswordPage() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#7C6F64' }}>Loading reset form...</div>}>
            <ResetPasswordFormContent />
        </Suspense>
    )
}
