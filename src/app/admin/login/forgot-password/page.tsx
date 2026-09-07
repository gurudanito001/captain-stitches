'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    FiArrowLeft,
    FiCheckCircle,
    FiLock,
    FiExternalLink,
} from '@/components/admin/SettingsIcons'

export default function AdminForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('samuelson@captainstitches.com')
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.includes('@')) return
        setIsSubmitted(true)
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
                    Account Recovery
                </p>
            </div>

            {/* Main Card */}
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
                {isSubmitted ? (
                    <div>
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
                                margin: '0 auto 16px auto',
                            }}
                        >
                            <FiCheckCircle size={24} />
                        </div>

                        <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 8px 0', color: '#1C0F07', textAlign: 'center' }}>
                            Check your inbox
                        </h2>

                        <p style={{ fontSize: '13px', color: '#7C6F64', lineHeight: 1.5, margin: '0 0 20px 0', textAlign: 'center' }}>
                            If an account exists for <strong>{email}</strong>, a password reset link has been dispatched. The link remains valid for 1 hour.
                        </p>

                        {/* Direct testing simulation button */}
                        <div
                            style={{
                                backgroundColor: '#FAF7F2',
                                border: '1px dashed #D1C9BE',
                                borderRadius: '8px',
                                padding: '14px',
                                marginBottom: '20px',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{ fontSize: '11px', color: '#7C6F64', marginBottom: '8px' }}>
                                💡 Direct Demo Preview:
                            </div>
                            <Link
                                href={`/admin/login/reset-password?token=demo_token_${Date.now()}`}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #C4975A',
                                    color: '#C4975A',
                                    padding: '7px 14px',
                                    borderRadius: '6px',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                }}
                            >
                                <span>Proceed to Set New Password</span>
                                <FiExternalLink size={12} />
                            </Link>
                        </div>

                        <div style={{ textAlign: 'center' }}>
                            <Link
                                href="/admin/login"
                                style={{
                                    fontSize: '13px',
                                    color: '#7C6F64',
                                    textDecoration: 'none',
                                    fontWeight: 500,
                                }}
                            >
                                Back to Sign In
                            </Link>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 6px 0', color: '#1C0F07' }}>
                                Reset your password
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7C6F64', margin: 0, lineHeight: 1.45 }}>
                                Enter the email address associated with your studio administrator account.
                            </p>
                        </div>

                        <div style={{ marginBottom: '24px' }}>
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
                                placeholder="name@captainstitches.com"
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

                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '12px 20px',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#C4975A',
                                color: '#FFFFFF',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(196, 151, 90, 0.3)',
                                marginBottom: '18px',
                            }}
                        >
                            Send Reset Link
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
                                ← Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
