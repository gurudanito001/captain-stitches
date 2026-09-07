'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
    AdminBlogPost,
    getBlogPostById,
    saveBlogPost,
} from '@/data/adminBlogData'

export default function BlogPostPreviewPage() {
    const params = useParams()
    const router = useRouter()
    const postId = params.id as string

    const [post, setPost] = useState<AdminBlogPost | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeLang, setActiveLang] = useState<'EN' | 'IT'>('EN')
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        if (!postId) return
        const found = getBlogPostById(postId)
        if (found) {
            setPost(found)
        }
        setIsLoading(false)
    }, [postId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    const handlePublishNow = () => {
        if (!post) return
        const now = new Date()
        const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        const updated: AdminBlogPost = {
            ...post,
            status: 'published',
            publishDate: dateStr,
        }
        saveBlogPost(updated)
        setPost(updated)
        showToast('Article published to public journal successfully!')
    }

    const currentContent = useMemo(() => {
        if (!post) return null
        if (activeLang === 'IT' && post.contentIT.title.trim()) {
            return post.contentIT
        }
        return post.contentEN
    }, [post, activeLang])

    const wordCount = useMemo(() => {
        if (!currentContent) return 0
        const text = `${currentContent.title} ${currentContent.excerpt} ${currentContent.body}`
        const words = text.trim().split(/\s+/).filter(Boolean)
        return words.length
    }, [currentContent])

    const readTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#140A04',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                    color: '#FAF7F2',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        border: '3px solid rgba(196, 151, 90, 0.2)',
                        borderTopColor: '#C4975A',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
                <p style={{ fontSize: '14px', color: '#BFA89B', fontFamily: 'serif' }}>
                    Compiling storefront journal preview...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!post || !currentContent) {
        return (
            <div
                style={{
                    minHeight: '100vh',
                    backgroundColor: '#140A04',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px 20px',
                    textAlign: 'center',
                }}
            >
                <h1 style={{ fontSize: '24px', fontFamily: 'serif', color: '#FAF7F2', marginBottom: '12px' }}>
                    Article Not Found For Preview
                </h1>
                <p style={{ fontSize: '14px', color: '#A89E96', marginBottom: '24px' }}>
                    Could not retrieve the blog post record with ID: {postId}
                </p>
                <Link
                    href="/admin/blog"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#C4975A',
                        color: '#1C0F07',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    Return to Blog Admin
                </Link>
            </div>
        )
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#140A04', color: '#E8E2D9' }}>
            {/* Toast Notification */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '28px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '12px 20px',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: 500,
                        boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
                        border: '1px solid #C4975A',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        zIndex: 9999,
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* TOP FIXED PREVIEW BANNER */}
            <div
                style={{
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    backgroundColor: '#1C0F07',
                    borderBottom: '1px solid rgba(196, 151, 90, 0.3)',
                    padding: '12px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                }}
            >
                {/* Left: Indicator & Status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            fontSize: '11px',
                            fontWeight: 700,
                            letterSpacing: '0.08em',
                            textTransform: 'uppercase',
                            padding: '4px 10px',
                            borderRadius: '20px',
                            backgroundColor:
                                post.status === 'published'
                                    ? 'rgba(74, 124, 89, 0.25)'
                                    : post.status === 'scheduled'
                                    ? 'rgba(58, 125, 173, 0.25)'
                                    : 'rgba(217, 131, 36, 0.25)',
                            color:
                                post.status === 'published'
                                    ? '#78B88C'
                                    : post.status === 'scheduled'
                                    ? '#79B7E3'
                                    : '#E8A355',
                            border: `1px solid ${
                                post.status === 'published'
                                    ? 'rgba(74, 124, 89, 0.4)'
                                    : post.status === 'scheduled'
                                    ? 'rgba(58, 125, 173, 0.4)'
                                    : 'rgba(217, 131, 36, 0.4)'
                            }`,
                        }}
                    >
                        <span
                            style={{
                                width: '6px',
                                height: '6px',
                                borderRadius: '50%',
                                backgroundColor: 'currentColor',
                            }}
                        />
                        Storefront Preview • {post.status.toUpperCase()}
                    </span>

                    <span style={{ fontSize: '13px', color: '#A89E96', display: 'none' }}>
                        Notice: You are viewing an uncommitted storefront state.
                    </span>
                </div>

                {/* Center: Language Switcher */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        backgroundColor: '#27150A',
                        borderRadius: '8px',
                        padding: '3px',
                        border: '1px solid #3D2214',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => setActiveLang('EN')}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: activeLang === 'EN' ? '#C4975A' : 'transparent',
                            color: activeLang === 'EN' ? '#1C0F07' : '#BFA89B',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        🇬🇧 English (EN)
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveLang('IT')}
                        style={{
                            padding: '6px 14px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            border: 'none',
                            backgroundColor: activeLang === 'IT' ? '#C4975A' : 'transparent',
                            color: activeLang === 'IT' ? '#1C0F07' : '#BFA89B',
                            transition: 'all 0.15s ease',
                        }}
                    >
                        🇮🇹 Italiano (IT)
                    </button>
                </div>

                {/* Right: Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Link
                        href={`/admin/blog/${post.id}`}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '6px',
                            border: '1px solid #4D2D1B',
                            backgroundColor: '#2A170C',
                            color: '#FAF7F2',
                            fontSize: '12px',
                            fontWeight: 500,
                            textDecoration: 'none',
                        }}
                    >
                        ← Back to Editor
                    </Link>

                    {post.status !== 'published' ? (
                        <button
                            type="button"
                            onClick={handlePublishNow}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 18px',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: '#C4975A',
                                color: '#1C0F07',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Publish Now
                        </button>
                    ) : (
                        <span
                            style={{
                                fontSize: '12px',
                                color: '#78B88C',
                                fontWeight: 500,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            ✓ Live on Storefront
                        </span>
                    )}
                </div>
            </div>

            {/* PUBLIC STOREFRONT MOCKUP CONTAINER */}
            <main style={{ maxWidth: '860px', margin: '0 auto', padding: '56px 24px 96px' }}>
                {/* Breadcrumbs */}
                <nav
                    aria-label="Breadcrumbs"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '11px',
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        fontWeight: 600,
                        color: '#8C7E75',
                        marginBottom: '32px',
                    }}
                >
                    <span style={{ color: '#8C7E75' }}>Home</span>
                    <span>/</span>
                    <span style={{ color: '#C4975A' }}>Journal</span>
                    <span>/</span>
                    <span
                        style={{
                            color: '#E8E2D9',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '300px',
                        }}
                    >
                        {currentContent.title || 'Untitled Draft'}
                    </span>
                </nav>

                <article>
                    {/* Header */}
                    <header style={{ marginBottom: '40px' }}>
                        {/* Meta strip */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: '11px',
                                letterSpacing: '0.12em',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                color: '#C4975A',
                                marginBottom: '18px',
                            }}
                        >
                            <span>{post.category}</span>
                            <span
                                style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: '#664733',
                                }}
                            />
                            <span style={{ color: '#A89E96' }}>{readTimeMinutes} min read</span>
                            <span
                                style={{
                                    width: '4px',
                                    height: '4px',
                                    borderRadius: '50%',
                                    backgroundColor: '#664733',
                                }}
                            />
                            <span style={{ color: '#A89E96' }}>By {post.author}</span>
                        </div>

                        {/* Title */}
                        <h1
                            style={{
                                fontFamily: 'serif',
                                fontSize: 'clamp(28px, 4.5vw, 44px)',
                                lineHeight: 1.22,
                                fontWeight: 700,
                                color: '#FAF7F2',
                                marginBottom: '20px',
                            }}
                        >
                            {currentContent.title || 'Untitled Post'}
                        </h1>

                        {/* Excerpt */}
                        {currentContent.excerpt && (
                            <p
                                style={{
                                    fontSize: '18px',
                                    lineHeight: 1.6,
                                    color: '#C4B7AC',
                                    fontFamily: 'serif',
                                    fontStyle: 'italic',
                                    marginBottom: '24px',
                                }}
                            >
                                {currentContent.excerpt}
                            </p>
                        )}

                        {/* Date & Tags Strip */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexWrap: 'wrap',
                                gap: '16px',
                                paddingTop: '20px',
                                borderTop: '1px solid rgba(196, 151, 90, 0.2)',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.08em',
                                    color: '#8C7E75',
                                    fontWeight: 600,
                                }}
                            >
                                {post.status === 'published' ? `Published on ${post.publishDate}` : `Scheduled for ${post.publishDate}`}
                            </span>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                {currentContent.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        style={{
                                            backgroundColor: '#1E1108',
                                            border: '1px solid rgba(196, 151, 90, 0.25)',
                                            color: '#BFA89B',
                                            padding: '4px 10px',
                                            fontSize: '10px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.08em',
                                            fontWeight: 600,
                                        }}
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </header>

                    {/* Featured Image */}
                    {post.featuredImage && (
                        <div
                            style={{
                                width: '100%',
                                aspectRatio: '16 / 9',
                                position: 'relative',
                                overflow: 'hidden',
                                backgroundColor: '#1C0F07',
                                border: '1px solid rgba(196, 151, 90, 0.25)',
                                marginBottom: '44px',
                            }}
                        >
                            <Image
                                src={post.featuredImage}
                                alt={post.featuredImageAlt || currentContent.title}
                                fill
                                style={{ objectFit: 'cover' }}
                                priority
                                sizes="(max-width: 900px) 100vw, 860px"
                            />
                        </div>
                    )}

                    {/* Article Body */}
                    <div
                        style={{
                            fontSize: '16px',
                            lineHeight: 1.8,
                            color: '#E0D6CE',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '24px',
                            maxWidth: '720px',
                            margin: '0 auto',
                        }}
                    >
                        {currentContent.body ? (
                            currentContent.body.split('\n\n').map((block, idx) => {
                                const trimmed = block.trim()
                                if (!trimmed) return null

                                if (trimmed.startsWith('## ')) {
                                    return (
                                        <h2
                                            key={idx}
                                            style={{
                                                fontFamily: 'serif',
                                                fontSize: '24px',
                                                fontWeight: 600,
                                                color: '#FAF7F2',
                                                marginTop: '16px',
                                                marginBottom: '4px',
                                                letterSpacing: '0.02em',
                                            }}
                                        >
                                            {trimmed.replace('## ', '')}
                                        </h2>
                                    )
                                }

                                if (trimmed.startsWith('### ')) {
                                    return (
                                        <h3
                                            key={idx}
                                            style={{
                                                fontFamily: 'serif',
                                                fontSize: '19px',
                                                fontWeight: 600,
                                                color: '#C4975A',
                                                marginTop: '12px',
                                                marginBottom: '2px',
                                            }}
                                        >
                                            {trimmed.replace('### ', '')}
                                        </h3>
                                    )
                                }

                                if (trimmed.startsWith('> ')) {
                                    return (
                                        <blockquote
                                            key={idx}
                                            style={{
                                                borderLeft: '3px solid #C4975A',
                                                padding: '12px 20px',
                                                margin: '12px 0',
                                                backgroundColor: 'rgba(196, 151, 90, 0.06)',
                                                fontStyle: 'italic',
                                                color: '#E8DED6',
                                                fontFamily: 'serif',
                                                fontSize: '17px',
                                            }}
                                        >
                                            {trimmed.replace('> ', '')}
                                        </blockquote>
                                    )
                                }

                                if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                                    const items = trimmed.split('\n').map((line) => line.replace(/^[-*]\s*/, ''))
                                    return (
                                        <ul
                                            key={idx}
                                            style={{
                                                paddingLeft: '24px',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '8px',
                                            }}
                                        >
                                            {items.map((item, itemIdx) => (
                                                <li key={itemIdx} style={{ listStyleType: 'square' }}>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                }

                                return (
                                    <p key={idx} style={{ margin: 0 }}>
                                        {trimmed}
                                    </p>
                                )
                            })
                        ) : (
                            <p style={{ fontStyle: 'italic', color: '#8C7E75', textAlign: 'center' }}>
                                (This manuscript does not yet have any body copy written.)
                            </p>
                        )}
                    </div>

                    {/* CONTEXTUAL CTA BANNER */}
                    {post.cta.isEnabled && (
                        <div
                            style={{
                                maxWidth: '720px',
                                margin: '56px auto 0',
                                padding: '36px 32px',
                                backgroundColor: '#1A0E07',
                                border: '1px solid rgba(196, 151, 90, 0.3)',
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '16px',
                                boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
                            }}
                        >
                            <span
                                style={{
                                    fontSize: '10px',
                                    fontWeight: 700,
                                    letterSpacing: '0.14em',
                                    textTransform: 'uppercase',
                                    color: '#C4975A',
                                }}
                            >
                                Experience Bespoke Excellence
                            </span>
                            <h3
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '22px',
                                    fontWeight: 500,
                                    color: '#FAF7F2',
                                    margin: 0,
                                }}
                            >
                                {post.cta.text}
                            </h3>
                            <p
                                style={{
                                    fontSize: '13px',
                                    color: '#A89E96',
                                    maxWidth: '480px',
                                    lineHeight: 1.6,
                                    margin: 0,
                                }}
                            >
                                Crafted in Nigeria with Savile Row precision. Delivered directly to your door in Europe.
                            </p>
                            <a
                                href={post.cta.customUrl || '/catalogue'}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    marginTop: '8px',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '12px 26px',
                                    backgroundColor: '#C4975A',
                                    color: '#1C0F07',
                                    borderRadius: '6px',
                                    fontSize: '13px',
                                    fontWeight: 700,
                                    letterSpacing: '0.04em',
                                    textDecoration: 'none',
                                }}
                            >
                                Commission Your Garment →
                            </a>
                        </div>
                    )}

                    {/* Social Share Mockup */}
                    <div
                        style={{
                            maxWidth: '720px',
                            margin: '48px auto 0',
                            paddingTop: '28px',
                            borderTop: '1px solid rgba(196, 151, 90, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexWrap: 'wrap',
                            gap: '16px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <span
                                style={{
                                    fontSize: '11px',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.1em',
                                    color: '#8C7E75',
                                    fontWeight: 600,
                                }}
                            >
                                Share Journal:
                            </span>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                {['WhatsApp', 'Twitter / X', 'Facebook'].map((platform) => (
                                    <span
                                        key={platform}
                                        style={{
                                            padding: '6px 12px',
                                            border: '1px solid rgba(196, 151, 90, 0.2)',
                                            color: '#BFA89B',
                                            fontSize: '11px',
                                            borderRadius: '4px',
                                        }}
                                    >
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link
                            href="/admin/blog"
                            style={{
                                fontSize: '11px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                                color: '#C4975A',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            ← Return to Admin Journal
                        </Link>
                    </div>
                </article>
            </main>
        </div>
    )
}
