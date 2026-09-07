'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    AdminBlogPost,
    BlogPostStatus,
    saveBlogPost,
    deleteBlogPost,
    getBlogSettings,
} from '@/data/adminBlogData'

interface AdminBlogEditorProps {
    initialPost: AdminBlogPost
    isNew?: boolean
}

export function AdminBlogEditor({ initialPost, isNew = false }: AdminBlogEditorProps) {
    const router = useRouter()
    const [post, setPost] = useState<AdminBlogPost>(initialPost)
    const [activeLang, setActiveLang] = useState<'EN' | 'IT'>('EN')

    // Toast & Saving State
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [isSaving, setIsSaving] = useState(false)
    const [lastSavedTime, setLastSavedTime] = useState(initialPost.lastSaved || 'Not saved yet')

    // Schedule / Publish Modal
    const [isPublishModalOpen, setIsPublishModalOpen] = useState(false)
    const [scheduleDate, setScheduleDate] = useState(post.publishDate !== 'Draft' ? post.publishDate : '2026-06-20')
    const [scheduleTime, setScheduleTime] = useState(post.publishTime || '09:00')

    // Delete Modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

    // Inline New Category
    const [isAddingCategory, setIsAddingCategory] = useState(false)
    const [newCategoryName, setNewCategoryName] = useState('')

    // Tag input state
    const [currentTagInput, setCurrentTagInput] = useState('')

    // Body textarea ref for formatting insertions
    const bodyTextareaRef = useRef<HTMLTextAreaElement>(null)

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    // Auto-generate slug from title if new or slug empty
    const handleTitleChange = (newTitle: string) => {
        const activeContent = activeLang === 'EN' ? post.contentEN : post.contentIT
        const updatedContent = { ...activeContent, title: newTitle }

        let newSlug = post.slug
        if (activeLang === 'EN' && (isNew || !post.slug || post.slug === 'new-post')) {
            newSlug = newTitle
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '')
        }

        setPost((prev) => ({
            ...prev,
            slug: newSlug,
            contentEN: activeLang === 'EN' ? updatedContent : prev.contentEN,
            contentIT: activeLang === 'IT' ? updatedContent : prev.contentIT,
        }))
    }

    // Text formatting toolbar helper
    const insertFormatting = (prefix: string, suffix = '') => {
        const textarea = bodyTextareaRef.current
        if (!textarea) return
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = activeLang === 'EN' ? post.contentEN.body : post.contentIT.body
        const selected = text.substring(start, end)
        const replacement = `${prefix}${selected || 'text'}${suffix}`

        const newBody = text.substring(0, start) + replacement + text.substring(end)

        if (activeLang === 'EN') {
            setPost((prev) => ({ ...prev, contentEN: { ...prev.contentEN, body: newBody } }))
        } else {
            setPost((prev) => ({ ...prev, contentIT: { ...prev.contentIT, body: newBody } }))
        }

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + prefix.length, start + prefix.length + (selected.length || 4))
        }, 10)
    }

    // Tag additions
    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const trimmed = currentTagInput.trim()
            if (!trimmed) return

            const currentTags = activeLang === 'EN' ? post.contentEN.tags : post.contentIT.tags
            if (!currentTags.includes(trimmed)) {
                const updatedTags = [...currentTags, trimmed]
                if (activeLang === 'EN') {
                    setPost((prev) => ({ ...prev, contentEN: { ...prev.contentEN, tags: updatedTags } }))
                } else {
                    setPost((prev) => ({ ...prev, contentIT: { ...prev.contentIT, tags: updatedTags } }))
                }
            }
            setCurrentTagInput('')
        }
    }

    const handleRemoveTag = (tagToRemove: string) => {
        const currentTags = activeLang === 'EN' ? post.contentEN.tags : post.contentIT.tags
        const updatedTags = currentTags.filter((t) => t !== tagToRemove)
        if (activeLang === 'EN') {
            setPost((prev) => ({ ...prev, contentEN: { ...prev.contentEN, tags: updatedTags } }))
        } else {
            setPost((prev) => ({ ...prev, contentIT: { ...prev.contentIT, tags: updatedTags } }))
        }
    }

    // Calculate reading time & words
    const currentBody = activeLang === 'EN' ? post.contentEN.body : post.contentIT.body
    const wordCount = useMemo(() => {
        return currentBody ? currentBody.trim().split(/\s+/).filter(Boolean).length : 0
    }, [currentBody])

    const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200))

    // Validation checks for language tabs
    const isENComplete = Boolean(post.contentEN.title.trim() && post.contentEN.body.trim())
    const isITComplete = Boolean(post.contentIT.title.trim() && post.contentIT.body.trim())
    const isITPartiallyFilled = Boolean(
        (post.contentIT.title.trim() || post.contentIT.body.trim()) && !isITComplete
    )

    // Save Draft
    const handleSaveDraft = () => {
        setIsSaving(true)
        const updatedPost: AdminBlogPost = {
            ...post,
            status: post.status === 'published' ? 'published' : 'draft',
        }
        saveBlogPost(updatedPost)
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        setLastSavedTime(`Saved at ${now}`)
        setIsSaving(false)
        showToast('Article draft saved successfully.')
    }

    // Publish / Schedule
    const handlePublishNow = () => {
        setIsSaving(true)
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        const updatedPost: AdminBlogPost = {
            ...post,
            status: 'published',
            publishDate: today,
        }
        saveBlogPost(updatedPost)
        setPost(updatedPost)
        setIsPublishModalOpen(false)
        setIsSaving(false)
        showToast('Article published live to public atelier journal!')
    }

    const handleConfirmSchedule = () => {
        setIsSaving(true)
        const updatedPost: AdminBlogPost = {
            ...post,
            status: 'scheduled',
            publishDate: scheduleDate,
            publishTime: scheduleTime,
        }
        saveBlogPost(updatedPost)
        setPost(updatedPost)
        setIsPublishModalOpen(false)
        setIsSaving(false)
        showToast(`Article scheduled for ${scheduleDate} at ${scheduleTime}`)
    }

    const handleUnpublish = () => {
        const updatedPost: AdminBlogPost = {
            ...post,
            status: 'draft',
            publishDate: 'Draft',
        }
        saveBlogPost(updatedPost)
        setPost(updatedPost)
        setIsPublishModalOpen(false)
        showToast('Article moved to drafts.')
    }

    // Delete
    const handleConfirmDelete = () => {
        deleteBlogPost(post.id)
        router.push('/admin/blog')
    }

    return (
        <div style={{ padding: '32px 40px 100px', minHeight: '100vh', background: '#FAF7F2' }}>
            {/* Toast */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '28px',
                        right: '32px',
                        background: '#1C0F07',
                        color: '#FAF7F2',
                        padding: '14px 22px',
                        borderRadius: '10px',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                        zIndex: 9999,
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    {toastMessage}
                </div>
            )}

            {/* Top Navigation & Status Bar */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    marginBottom: '28px',
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <Link
                        href="/admin/blog"
                        style={{
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            color: '#6B7280',
                            textDecoration: 'none',
                        }}
                    >
                        ← Back to Posts
                    </Link>
                    <span style={{ color: '#D1D5DB' }}>|</span>
                    <span
                        style={{
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            padding: '4px 10px',
                            borderRadius: '9999px',
                            background:
                                post.status === 'published'
                                    ? '#DCFCE7'
                                    : post.status === 'scheduled'
                                      ? '#FEF3C7'
                                      : '#F3F4F6',
                            color:
                                post.status === 'published'
                                    ? '#15803D'
                                    : post.status === 'scheduled'
                                      ? '#B45309'
                                      : '#6B7280',
                        }}
                    >
                        ● {post.status.toUpperCase()}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{lastSavedTime}</span>
                </div>

                {/* Right Action Buttons */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <button
                        type="button"
                        onClick={handleSaveDraft}
                        disabled={isSaving}
                        style={{
                            background: '#FFFFFF',
                            color: '#1C0F07',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            padding: '9px 18px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        Save Draft
                    </button>

                    <Link
                        href={`/admin/blog/${post.id}/preview`}
                        target="_blank"
                        style={{
                            background: '#FFFFFF',
                            color: '#1C0F07',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            padding: '9px 18px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        Preview ↗
                    </Link>

                    <button
                        type="button"
                        onClick={() => setIsPublishModalOpen(true)}
                        style={{
                            background: post.status === 'published' ? '#15803D' : '#C4975A',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '9px 20px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(196, 151, 90, 0.25)',
                        }}
                    >
                        {post.status === 'published' ? '✓ Published (Options)' : 'Publish / Schedule ▼'}
                    </button>
                </div>
            </div>

            {/* 2-Column Main Workspace */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
                    gap: '28px',
                    alignItems: 'start',
                }}
            >
                {/* Left Column: Writing Canvas & Editorial Fields */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Language Switcher Tabs Banner */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '14px',
                            padding: '12px 18px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '0.8125rem', color: '#6B7280', fontWeight: 600 }}>
                                Editorial Language:
                            </span>
                            <button
                                type="button"
                                onClick={() => setActiveLang('EN')}
                                style={{
                                    border: 'none',
                                    background: activeLang === 'EN' ? '#1C0F07' : '#F3F4F6',
                                    color: activeLang === 'EN' ? '#FFFFFF' : '#4B5563',
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                🇬🇧 English {isENComplete && '✓'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveLang('IT')}
                                style={{
                                    border: 'none',
                                    background: activeLang === 'IT' ? '#1C0F07' : '#F3F4F6',
                                    color: activeLang === 'IT' ? '#FFFFFF' : '#4B5563',
                                    padding: '6px 14px',
                                    borderRadius: '6px',
                                    fontSize: '0.8125rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}
                            >
                                🇮🇹 Italiano {isITComplete ? '✓' : isITPartiallyFilled ? '⚠️' : ''}
                            </button>
                        </div>

                        {/* Language Warning Alert */}
                        {isITPartiallyFilled && (
                            <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>
                                ⚠️ Italian variant incomplete
                            </span>
                        )}
                        {!post.contentIT.body.trim() && activeLang === 'IT' && (
                            <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                Fields left blank will fallback to English on public blog.
                            </span>
                        )}
                    </div>

                    {/* Article Title Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Article Title ({activeLang})
                            </label>
                            <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                {(activeLang === 'EN' ? post.contentEN.title : post.contentIT.title).length} chars
                            </span>
                        </div>
                        <input
                            type="text"
                            placeholder={activeLang === 'EN' ? 'Enter a captivating headline...' : 'Titolo dell’articolo in italiano...'}
                            value={activeLang === 'EN' ? post.contentEN.title : post.contentIT.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            style={{
                                width: '100%',
                                fontSize: '1.5rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                border: 'none',
                                outline: 'none',
                                padding: 0,
                                fontFamily: 'serif',
                            }}
                        />

                        {/* URL Slug */}
                        <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', borderTop: '1px solid #F3F4F6', paddingTop: '12px' }}>
                            <span style={{ fontSize: '0.8125rem', color: '#9CA3AF', fontFamily: 'monospace' }}>
                                captainstitches.com/blog/
                            </span>
                            <input
                                type="text"
                                value={post.slug}
                                onChange={(e) => setPost((prev) => ({ ...prev, slug: e.target.value }))}
                                placeholder="article-url-slug"
                                style={{
                                    flex: 1,
                                    fontSize: '0.8125rem',
                                    fontFamily: 'monospace',
                                    color: '#C4975A',
                                    fontWeight: 600,
                                    border: 'none',
                                    outline: 'none',
                                    padding: 0,
                                    background: 'transparent',
                                }}
                            />
                        </div>
                    </div>

                    {/* Rich Body Editor Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        {/* Formatting Toolbar */}
                        <div
                            style={{
                                background: '#FAF7F2',
                                borderBottom: '1px solid #EDE8E1',
                                padding: '10px 16px',
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                gap: '6px',
                            }}
                        >
                            {[
                                { label: 'B', prefix: '**', suffix: '**', title: 'Bold' },
                                { label: 'I', prefix: '*', suffix: '*', title: 'Italic' },
                                { label: 'U', prefix: '<u>', suffix: '</u>', title: 'Underline' },
                                { label: 'S', prefix: '~~', suffix: '~~', title: 'Strikethrough' },
                                { label: 'H2', prefix: '## ', suffix: '\n', title: 'Heading 2' },
                                { label: 'H3', prefix: '### ', suffix: '\n', title: 'Heading 3' },
                                { label: '• List', prefix: '- ', suffix: '\n', title: 'Bullet List' },
                                { label: '1. List', prefix: '1. ', suffix: '\n', title: 'Numbered List' },
                                { label: '❝ Quote', prefix: '> ', suffix: '\n', title: 'Blockquote' },
                                { label: '— Divider', prefix: '\n---\n', suffix: '', title: 'Horizontal Rule' },
                                { label: '🔗 Link', prefix: '[', suffix: '](https://)', title: 'Insert Link' },
                                { label: '🖼 Image', prefix: '![Alt text](', suffix: ')', title: 'Inline Image' },
                            ].map((btn, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => insertFormatting(btn.prefix, btn.suffix)}
                                    title={btn.title}
                                    style={{
                                        background: '#FFFFFF',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        color: '#374151',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {btn.label}
                                </button>
                            ))}
                        </div>

                        {/* Textarea Canvas */}
                        <div style={{ padding: '24px 28px' }}>
                            <textarea
                                ref={bodyTextareaRef}
                                rows={18}
                                placeholder={
                                    activeLang === 'EN'
                                        ? 'Craft your bespoke editorial article here using Markdown or rich text...'
                                        : 'Scrivi qui il corpo del testo in italiano...'
                                }
                                value={activeLang === 'EN' ? post.contentEN.body : post.contentIT.body}
                                onChange={(e) => {
                                    const val = e.target.value
                                    if (activeLang === 'EN') {
                                        setPost((prev) => ({ ...prev, contentEN: { ...prev.contentEN, body: val } }))
                                    } else {
                                        setPost((prev) => ({ ...prev, contentIT: { ...prev.contentIT, body: val } }))
                                    }
                                }}
                                style={{
                                    width: '100%',
                                    border: 'none',
                                    outline: 'none',
                                    fontSize: '1rem',
                                    lineHeight: 1.7,
                                    color: '#1F2937',
                                    resize: 'vertical',
                                    fontFamily: 'inherit',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        {/* Editor Footer: Word Count & Reading Time */}
                        <div
                            style={{
                                borderTop: '1px solid #F3F4F6',
                                padding: '12px 24px',
                                background: '#FAF7F2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                fontSize: '0.75rem',
                                color: '#6B7280',
                            }}
                        >
                            <span>
                                <strong>{wordCount}</strong> words · <strong>{readingTimeMinutes} min</strong> estimated read
                            </span>
                            <span>Markdown supported (headings, lists, blockquotes)</span>
                        </div>
                    </div>

                    {/* Excerpt Field */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <label style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                Article Excerpt / Summary ({activeLang})
                            </label>
                            <span
                                style={{
                                    fontSize: '0.75rem',
                                    color:
                                        (activeLang === 'EN' ? post.contentEN.excerpt : post.contentIT.excerpt).length > 150
                                            ? '#B45309'
                                            : '#9CA3AF',
                                }}
                            >
                                {(activeLang === 'EN' ? post.contentEN.excerpt : post.contentIT.excerpt).length}/150 recommended
                            </span>
                        </div>
                        <textarea
                            rows={3}
                            placeholder="A concise 1–2 sentence summary used on listing cards, email newsletters, and social previews..."
                            value={activeLang === 'EN' ? post.contentEN.excerpt : post.contentIT.excerpt}
                            onChange={(e) => {
                                const val = e.target.value
                                if (activeLang === 'EN') {
                                    setPost((prev) => ({ ...prev, contentEN: { ...prev.contentEN, excerpt: val } }))
                                } else {
                                    setPost((prev) => ({ ...prev, contentIT: { ...prev.contentIT, excerpt: val } }))
                                }
                            }}
                            style={{
                                width: '100%',
                                padding: '12px 14px',
                                border: '1px solid #D1D5DB',
                                borderRadius: '8px',
                                fontSize: '0.875rem',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                    </div>

                    {/* CTA Configuration Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                                    Article Bottom Call to Action (CTA)
                                </h3>
                                <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#6B7280' }}>
                                    Auto-appended banner shown at the bottom of the article to capture bespoke inquiries.
                                </p>
                            </div>
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={post.cta.isEnabled}
                                    onChange={(e) =>
                                        setPost((prev) => ({
                                            ...prev,
                                            cta: { ...prev.cta, isEnabled: e.target.checked },
                                        }))
                                    }
                                    style={{ width: '18px', height: '18px', accentColor: '#C4975A' }}
                                />
                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1C0F07' }}>
                                    Show CTA Banner
                                </span>
                            </label>
                        </div>

                        {post.cta.isEnabled && (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                        CTA Headline Text
                                    </label>
                                    <input
                                        type="text"
                                        value={post.cta.text}
                                        onChange={(e) =>
                                            setPost((prev) => ({
                                                ...prev,
                                                cta: { ...prev.cta, text: e.target.value },
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            padding: '0 12px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            boxSizing: 'border-box',
                                        }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                        Link Destination
                                    </label>
                                    <select
                                        value={post.cta.linkType}
                                        onChange={(e) =>
                                            setPost((prev) => ({
                                                ...prev,
                                                cta: {
                                                    ...prev.cta,
                                                    linkType: e.target.value as 'catalogue' | 'order' | 'custom',
                                                },
                                            }))
                                        }
                                        style={{
                                            width: '100%',
                                            height: '40px',
                                            padding: '0 10px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '8px',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                        }}
                                    >
                                        <option value="catalogue">Catalogue Page (/catalogue)</option>
                                        <option value="order">Commission Page (/order)</option>
                                        <option value="custom">Custom URL</option>
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Google SEO & Open Graph Preview Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 28px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 700, color: '#1C0F07' }}>
                            Search Engine Optimization (SEO) & Social Sharing ({activeLang})
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '0.8125rem', color: '#6B7280' }}>
                            Customize how this post appears on Google Search and WhatsApp / social card previews.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>
                                        Meta Title
                                    </label>
                                    <span style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>
                                        {(activeLang === 'EN' ? post.contentEN.metaTitle : post.contentIT.metaTitle).length}/60 recommended
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Meta title tag..."
                                    value={activeLang === 'EN' ? post.contentEN.metaTitle : post.contentIT.metaTitle}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        if (activeLang === 'EN') {
                                            setPost((prev) => ({ ...prev, contentEN: { ...prev.contentEN, metaTitle: val } }))
                                        } else {
                                            setPost((prev) => ({ ...prev, contentIT: { ...prev.contentIT, metaTitle: val } }))
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '38px',
                                        padding: '0 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151' }}>
                                        Meta Description
                                    </label>
                                    <span style={{ fontSize: '0.6875rem', color: '#9CA3AF' }}>
                                        {(activeLang === 'EN' ? post.contentEN.metaDescription : post.contentIT.metaDescription).length}/160 recommended
                                    </span>
                                </div>
                                <textarea
                                    rows={2}
                                    placeholder="Meta description for search engine snippets..."
                                    value={activeLang === 'EN' ? post.contentEN.metaDescription : post.contentIT.metaDescription}
                                    onChange={(e) => {
                                        const val = e.target.value
                                        if (activeLang === 'EN') {
                                            setPost((prev) => ({ ...prev, contentEN: { ...prev.contentEN, metaDescription: val } }))
                                        } else {
                                            setPost((prev) => ({ ...prev, contentIT: { ...prev.contentIT, metaDescription: val } }))
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '8px',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Live Google Preview */}
                        <div
                            style={{
                                background: '#FAF7F2',
                                border: '1px solid #EDE8E1',
                                borderRadius: '12px',
                                padding: '16px 20px',
                            }}
                        >
                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                Google Search Live Result Preview
                            </span>
                            <div style={{ marginTop: '8px' }}>
                                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#202124' }}>
                                    https://captainstitches.com › blog › {post.slug}
                                </p>
                                <p style={{ margin: '2px 0 0', fontSize: '1.125rem', color: '#1a0dab', fontWeight: 500, lineHeight: 1.3 }}>
                                    {(activeLang === 'EN' ? post.contentEN.metaTitle : post.contentIT.metaTitle) || post.contentEN.title || 'CaptainStitches Journal Article'}
                                </p>
                                <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: '#4d5156', lineHeight: 1.45 }}>
                                    {(activeLang === 'EN' ? post.contentEN.metaDescription : post.contentIT.metaDescription) || post.contentEN.excerpt || 'Read the latest bespoke tailoring dispatch from CaptainStitches atelier.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Publishing Sidebar & Metadata */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Featured Image Card (16:9 Aspect Ratio) */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 26px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 12px', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                            Featured Article Image (16:9)
                        </h3>

                        {post.featuredImage ? (
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '8px', overflow: 'hidden', border: '1px solid #EDE8E1', marginBottom: '12px' }}>
                                <img
                                    src={post.featuredImage}
                                    alt={post.featuredImageAlt}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setPost((prev) => ({ ...prev, featuredImage: '' }))}
                                    style={{
                                        position: 'absolute',
                                        top: '8px',
                                        right: '8px',
                                        background: 'rgba(0,0,0,0.7)',
                                        color: '#FFFFFF',
                                        border: 'none',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        fontSize: '0.6875rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    ✕ Remove
                                </button>
                            </div>
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    aspectRatio: '16/9',
                                    border: '2px dashed #D1D5DB',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#9CA3AF',
                                    fontSize: '0.8125rem',
                                    marginBottom: '12px',
                                }}
                            >
                                No image selected
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Image URL (Unsplash or local asset)
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/..."
                                    value={post.featuredImage}
                                    onChange={(e) => setPost((prev) => ({ ...prev, featuredImage: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        height: '36px',
                                        padding: '0 10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Alt Text (SEO & Accessibility)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Descriptive caption of photograph..."
                                    value={post.featuredImageAlt}
                                    onChange={(e) => setPost((prev) => ({ ...prev, featuredImageAlt: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        height: '36px',
                                        padding: '0 10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '0.75rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category & Tags Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 26px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                            Taxonomy & Discovery
                        </h3>

                        {/* Category Dropdown */}
                        <div style={{ marginBottom: '18px' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Category
                            </label>
                            <select
                                value={post.category}
                                onChange={(e) => setPost((prev) => ({ ...prev, category: e.target.value }))}
                                style={{
                                    width: '100%',
                                    height: '38px',
                                    padding: '0 10px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '6px',
                                    fontSize: '0.8125rem',
                                    outline: 'none',
                                }}
                            >
                                <option value="Style Guide">Style Guide</option>
                                <option value="Case Study">Case Study</option>
                                <option value="Design Opinions">Design Opinions</option>
                                <option value="Brand News">Brand News</option>
                                {post.category && !['Style Guide', 'Case Study', 'Design Opinions', 'Brand News'].includes(post.category) && (
                                    <option value={post.category}>{post.category}</option>
                                )}
                            </select>

                            {isAddingCategory ? (
                                <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                                    <input
                                        type="text"
                                        placeholder="New category name..."
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        style={{
                                            flex: 1,
                                            height: '32px',
                                            padding: '0 8px',
                                            border: '1px solid #C4975A',
                                            borderRadius: '6px',
                                            fontSize: '0.75rem',
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (newCategoryName.trim()) {
                                                setPost((prev) => ({ ...prev, category: newCategoryName.trim() }))
                                                setIsAddingCategory(false)
                                                setNewCategoryName('')
                                            }
                                        }}
                                        style={{
                                            background: '#1C0F07',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '6px',
                                            padding: '0 10px',
                                            fontSize: '0.75rem',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Add
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setIsAddingCategory(true)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#C4975A',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        padding: '6px 0 0',
                                    }}
                                >
                                    + Add new category
                                </button>
                            )}
                        </div>

                        {/* Tags Input */}
                        <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                Tags ({activeLang}) — press Enter to add
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '6px',
                                    padding: '8px',
                                    border: '1px solid #D1D5DB',
                                    borderRadius: '8px',
                                    minHeight: '44px',
                                    background: '#FAF7F2',
                                    alignItems: 'center',
                                }}
                            >
                                {(activeLang === 'EN' ? post.contentEN.tags : post.contentIT.tags).map((tag, tIdx) => (
                                    <span
                                        key={tIdx}
                                        style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '4px',
                                            background: '#FFFFFF',
                                            border: '1px solid #EDE8E1',
                                            padding: '3px 8px',
                                            borderRadius: '4px',
                                            fontSize: '0.75rem',
                                            color: '#1C0F07',
                                        }}
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#9CA3AF',
                                                fontSize: '0.75rem',
                                                padding: 0,
                                            }}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}

                                <input
                                    type="text"
                                    placeholder="Add tag..."
                                    value={currentTagInput}
                                    onChange={(e) => setCurrentTagInput(e.target.value)}
                                    onKeyDown={handleAddTag}
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        background: 'transparent',
                                        fontSize: '0.75rem',
                                        minWidth: '70px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Publishing Metadata Card */}
                    <div
                        style={{
                            background: '#FFFFFF',
                            border: '1px solid #EDE8E1',
                            borderRadius: '16px',
                            padding: '24px 26px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 14px', fontSize: '0.9375rem', fontWeight: 700, color: '#1C0F07' }}>
                            Author & Visibility
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Author
                                </label>
                                <select
                                    value={post.author}
                                    onChange={(e) => setPost((prev) => ({ ...prev, author: e.target.value }))}
                                    style={{
                                        width: '100%',
                                        height: '38px',
                                        padding: '0 10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '0.8125rem',
                                        outline: 'none',
                                    }}
                                >
                                    <option value="Samuelson">Samuelson (Lead Master Tailor)</option>
                                    <option value="CaptainStitches Editorial Team">CaptainStitches Editorial Team</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px' }}>
                                    Audience Visibility
                                </label>
                                <select
                                    value={post.visibility}
                                    onChange={(e) => setPost((prev) => ({ ...prev, visibility: e.target.value as 'public' | 'members_only' }))}
                                    style={{
                                        width: '100%',
                                        height: '38px',
                                        padding: '0 10px',
                                        border: '1px solid #D1D5DB',
                                        borderRadius: '6px',
                                        fontSize: '0.8125rem',
                                        outline: 'none',
                                    }}
                                >
                                    <option value="public">Public (Open Storefront)</option>
                                    <option value="members_only">Members / VIP Only</option>
                                </select>
                            </div>
                        </div>

                        {/* Delete Article Button */}
                        {!isNew && (
                            <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '16px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    style={{
                                        width: '100%',
                                        background: '#FEF2F2',
                                        color: '#B91C1C',
                                        border: '1px solid #FECACA',
                                        borderRadius: '8px',
                                        padding: '8px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    🗑 Delete Article
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Schedule / Publish Modal */}
            {isPublishModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '460px',
                            padding: '28px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>
                            Publication Options
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#6B7280' }}>
                            Choose whether to make this article live now, schedule a future launch, or return to drafts.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                            {/* Option 1: Publish Now */}
                            <button
                                type="button"
                                onClick={handlePublishNow}
                                style={{
                                    background: '#15803D',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    fontSize: '0.875rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                }}
                            >
                                ✓ Publish Live Immediately
                            </button>

                            {/* Option 2: Schedule */}
                            <div style={{ border: '1px solid #EDE8E1', borderRadius: '10px', padding: '14px' }}>
                                <p style={{ margin: '0 0 10px', fontSize: '0.8125rem', fontWeight: 700, color: '#1C0F07' }}>
                                    📅 Schedule for Future Release
                                </p>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                                    <input
                                        type="date"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px',
                                            fontSize: '0.8125rem',
                                        }}
                                    />
                                    <input
                                        type="time"
                                        value={scheduleTime}
                                        onChange={(e) => setScheduleTime(e.target.value)}
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #D1D5DB',
                                            borderRadius: '6px',
                                            fontSize: '0.8125rem',
                                        }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleConfirmSchedule}
                                    style={{
                                        width: '100%',
                                        background: '#FAF7F2',
                                        border: '1px solid #C4975A',
                                        color: '#C4975A',
                                        borderRadius: '6px',
                                        padding: '8px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Confirm Scheduled Launch
                                </button>
                            </div>

                            {/* Option 3: Unpublish (if currently published) */}
                            {post.status === 'published' && (
                                <button
                                    type="button"
                                    onClick={handleUnpublish}
                                    style={{
                                        background: '#F3F4F6',
                                        color: '#4B5563',
                                        border: 'none',
                                        borderRadius: '8px',
                                        padding: '10px',
                                        fontSize: '0.8125rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    Revert to Private Draft
                                </button>
                            )}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => setIsPublishModalOpen(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6B7280',
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        zIndex: 10000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                    }}
                >
                    <div
                        style={{
                            background: '#FFFFFF',
                            borderRadius: '16px',
                            width: '100%',
                            maxWidth: '440px',
                            padding: '28px',
                            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                        }}
                    >
                        <h3 style={{ margin: '0 0 10px', fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>
                            Delete Article Permanently?
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.5 }}>
                            Are you sure you want to delete this post? All content, revisions, and language variants will be erased.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsDeleteModalOpen(false)}
                                style={{
                                    background: '#F3F4F6',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 18px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#4B5563',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmDelete}
                                style={{
                                    background: '#B91C1C',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '10px 20px',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    color: '#FFFFFF',
                                    cursor: 'pointer',
                                }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
