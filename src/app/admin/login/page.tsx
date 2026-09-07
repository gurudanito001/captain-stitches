'use client'

import React, { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { loginAdmin } from '@/data/adminProfileData'
import {
    FiEye,
    FiEyeOff,
    FiCheckCircle,
    FiAlertTriangle,
    FiLock,
    FiArrowLeft,
} from '@/components/admin/SettingsIcons'

function LoginFormContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const isSignedOut = searchParams.get('signed_out') === '1'
    const isResetSuccess = searchParams.get('reset') === '1'

    const [email, setEmail] = useState('samuelson@captainstitches.com')
    const [password, setPassword] = useState('CaptainStitches2026!')
    const [rememberMe, setRememberMe] = useState(true)
    const [showPassword, setShowPassword] = useState(false)

    const [flashMessage, setFlashMessage] = useState<string | null>(
        isSignedOut
            ? 'You have been signed out successfully'
            : isResetSuccess
            ? 'Your password has been reset. Please sign in with your new password.'
            : null
    )

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [failedAttempts, setFailedAttempts] = useState(0)
    const [isLockedOut, setIsLockedOut] = useState(false)
    const [lockoutSecondsRemaining, setLockoutSecondsRemaining] = useState(0)

    const passwordInputRef = useRef<HTMLInputElement>(null)

    // Dismiss flash message after 4 seconds
    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => {
                setFlashMessage(null)
            }, 4000)
            return () => clearTimeout(timer)
        }
    }, [flashMessage])

    // Lockout countdown timer
    useEffect(() => {
        if (lockoutSecondsRemaining > 0) {
            const timer = setTimeout(() => {
                setLockoutSecondsRemaining(lockoutSecondsRemaining - 1)
            }, 1000)
            return () => clearTimeout(timer)
        } else if (isLockedOut && lockoutSecondsRemaining === 0) {
            setIsLockedOut(false)
            setFailedAttempts(0)
        }
    }, [lockoutSecondsRemaining, isLockedOut])

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage(null)

        if (isLockedOut) return

        // Validate credentials (demo simulation: any reasonable credentials or pre-filled defaults)
        const trimmedEmail = email.trim().toLowerCase()
        if (trimmedEmail === 'samuelson@captainstitches.com' && password.length >= 6) {
            // Success
            loginAdmin(trimmedEmail, rememberMe)
            router.push('/admin')
        } else {
            // Failed attempt
            const attempts = failedAttempts + 1
            setFailedAttempts(attempts)
            setPassword('')
            if (attempts >= 5) {
                setIsLockedOut(true)
                setLockoutSecondsRemaining(900) // 15 minutes
                setErrorMessage('Too many failed attempts. Account locked for 15 minutes.')
            } else {
                setErrorMessage('Incorrect email or password. Please try again.')
            }
            passwordInputRef.current?.focus()
        }
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
            {/* Top Logo / Brand Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div
                    style={{
                        width: '54px',
                        height: '54px',
                        borderRadius: '16px',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 14px auto',
                        boxShadow: '0 4px 16px rgba(196, 151, 90, 0.35)',
                    }}
                >
                    <span style={{ fontSize: '1.2rem', fontWeight: 700, fontFamily: 'serif', letterSpacing: '0.04em' }}>
                        CS
                    </span>
                </div>
                <h1
                    style={{
                        fontSize: '22px',
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
                        letterSpacing: '0.1em',
                        color: '#8C7B6B',
                        margin: '4px 0 0 0',
                    }}
                >
                    Bespoke Fashion Atelier
                </p>
            </div>

            {/* Flash Message */}
            {flashMessage && (
                <div
                    style={{
                        maxWidth: '420px',
                        width: '100%',
                        backgroundColor: '#E6F4EA',
                        border: '1px solid #CEEAD6',
                        color: '#137333',
                        padding: '12px 18px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontSize: '13px',
                        fontWeight: 500,
                    }}
                >
                    <FiCheckCircle size={16} color="#137333" style={{ flexShrink: 0 }} />
                    <span>{flashMessage}</span>
                </div>
            )}

            {/* Single Centered Luxury Card */}
            <div
                style={{
                    maxWidth: '420px',
                    width: '100%',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #EDE8E1',
                    padding: '36px 32px',
                    boxShadow: '0 8px 30px rgba(28, 15, 7, 0.05)',
                }}
            >
                <div style={{ marginBottom: '24px' }}>
                    <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 6px 0', color: '#1C0F07' }}>
                        Welcome back
                    </h2>
                    <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0 }}>
                        Sign in to your studio admin dashboard
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    {/* Email Input */}
                    <div style={{ marginBottom: '18px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '6px',
                            }}
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={isLockedOut}
                            style={{
                                width: '100%',
                                padding: '11px 14px',
                                borderRadius: '8px',
                                border: '1px solid #EDE8E1',
                                backgroundColor: '#FAF7F2',
                                fontSize: '13px',
                                color: '#1C0F07',
                                outline: 'none',
                            }}
                        />
                    </div>

                    {/* Password Input */}
                    <div style={{ marginBottom: '14px' }}>
                        <label
                            style={{
                                display: 'block',
                                fontSize: '12px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                marginBottom: '6px',
                            }}
                        >
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                ref={passwordInputRef}
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLockedOut}
                                placeholder="••••••••••••"
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
                                onClick={() => setShowPassword(!showPassword)}
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
                                {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                            </button>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '22px',
                        }}
                    >
                        <label
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontSize: '12px',
                                color: '#7C6F64',
                                cursor: 'pointer',
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                style={{ cursor: 'pointer' }}
                            />
                            <span>Remember me</span>
                        </label>

                        <Link
                            href="/admin/login/forgot-password"
                            style={{
                                fontSize: '12px',
                                color: '#C4975A',
                                textDecoration: 'none',
                                fontWeight: 500,
                            }}
                        >
                            Forgot password?
                        </Link>
                    </div>

                    {/* Error Message Banner */}
                    {errorMessage && (
                        <div
                            style={{
                                backgroundColor: '#FCE8E6',
                                border: '1px solid #FAD2CF',
                                color: '#D93025',
                                padding: '10px 14px',
                                borderRadius: '8px',
                                marginBottom: '18px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '12px',
                                fontWeight: 500,
                            }}
                        >
                            <FiAlertTriangle size={15} style={{ flexShrink: 0 }} />
                            <span>
                                {errorMessage}
                                {isLockedOut && ` Retry in ${Math.ceil(lockoutSecondsRemaining / 60)} minutes.`}
                            </span>
                        </div>
                    )}

                    {/* Full-width Solid Caramel Sign In Button */}
                    <button
                        type="submit"
                        disabled={isLockedOut}
                        style={{
                            width: '100%',
                            padding: '12px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: isLockedOut ? '#D1C9BE' : '#C4975A',
                            color: '#FFFFFF',
                            fontSize: '14px',
                            fontWeight: 600,
                            cursor: isLockedOut ? 'not-allowed' : 'pointer',
                            boxShadow: isLockedOut ? 'none' : '0 2px 8px rgba(196, 151, 90, 0.3)',
                            transition: 'background 0.2s',
                        }}
                    >
                        {isLockedOut ? 'Account Locked' : 'Sign in to Dashboard'}
                    </button>
                </form>
            </div>

            {/* Back to Homepage Link Below Card */}
            <div style={{ marginTop: '24px' }}>
                <Link
                    href="/"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        fontSize: '13px',
                        color: '#7C6F64',
                        textDecoration: 'none',
                        fontWeight: 500,
                    }}
                >
                    <FiArrowLeft size={14} />
                    Back to CaptainStitches Public Storefront
                </Link>
            </div>
        </div>
    )
}

export default function AdminLoginPage() {
    return (
        <Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: '#7C6F64' }}>Loading login...</div>}>
            <LoginFormContent />
        </Suspense>
    )
}
