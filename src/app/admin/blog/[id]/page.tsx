'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AdminBlogEditor } from '@/components/admin/AdminBlogEditor'
import { AdminBlogPost, getBlogPostById } from '@/data/adminBlogData'

export default function EditBlogPostPage() {
    const params = useParams()
    const postId = params.id as string

    const [post, setPost] = useState<AdminBlogPost | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!postId) return
        const found = getBlogPostById(postId)
        if (found) {
            setPost(found)
        }
        setIsLoading(false)
    }, [postId])

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '60px 20px',
                    gap: '16px',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        border: '3px solid rgba(196, 151, 90, 0.2)',
                        borderTopColor: '#C4975A',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
                <p style={{ fontSize: '14px', color: '#8C827A', fontFamily: 'serif' }}>
                    Loading manuscript from atelier archives...
                </p>
                <style>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    if (!post) {
        return (
            <div
                style={{
                    padding: '80px 24px',
                    textAlign: 'center',
                    maxWidth: '520px',
                    margin: '40px auto',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    boxShadow: '0 4px 20px rgba(28, 15, 7, 0.04)',
                }}
            >
                <div
                    style={{
                        width: '56px',
                        height: '56px',
                        backgroundColor: '#FAF5EE',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 18px',
                        color: '#C4975A',
                    }}
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h2
                    style={{
                        fontSize: '22px',
                        fontFamily: 'serif',
                        fontWeight: 600,
                        color: '#1C0F07',
                        marginBottom: '8px',
                    }}
                >
                    Blog Post Not Found
                </h2>
                <p
                    style={{
                        fontSize: '14px',
                        color: '#8C827A',
                        lineHeight: 1.6,
                        marginBottom: '24px',
                    }}
                >
                    The article you are attempting to edit could not be located in the atelier records. It may have been
                    archived or removed.
                </p>
                <Link
                    href="/admin/blog"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 22px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 500,
                        textDecoration: 'none',
                    }}
                >
                    Return to Blog Directory
                </Link>
            </div>
        )
    }

    return <AdminBlogEditor initialPost={post} isNew={false} />
}
