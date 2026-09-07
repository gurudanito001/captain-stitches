'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    AdminBlogPost,
    BlogPostStatus,
    getAllBlogPosts,
    deleteBlogPost,
    duplicateBlogPost,
    saveBlogPost,
    getBlogStats,
} from '@/data/adminBlogData'

type FilterTab = 'all' | 'published' | 'scheduled' | 'draft'
type LanguageFilter = 'all' | 'en_only' | 'it_only' | 'both'
type SortOption = 'newest' | 'oldest' | 'views' | 'edited'
type ViewMode = 'table' | 'grid'

export default function AdminBlogListPage() {
    const router = useRouter()
    const [posts, setPosts] = useState<AdminBlogPost[]>([])
    const [activeTab, setActiveTab] = useState<FilterTab>('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [languageFilter, setLanguageFilter] = useState<LanguageFilter>('all')
    const [authorFilter, setAuthorFilter] = useState('all')
    const [sortBy, setSortBy] = useState<SortOption>('newest')
    const [viewMode, setViewMode] = useState<ViewMode>('table')

    // Modals & Popups
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; post?: AdminBlogPost }>({
        isOpen: false,
    })
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    useEffect(() => {
        setPosts(getAllBlogPosts())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const stats = useMemo(() => getBlogStats(posts), [posts])

    // Unique categories and authors for filters
    const availableCategories = useMemo(() => {
        const set = new Set<string>()
        posts.forEach((p) => set.add(p.category))
        return Array.from(set)
    }, [posts])

    const availableAuthors = useMemo(() => {
        const set = new Set<string>()
        posts.forEach((p) => set.add(p.author))
        return Array.from(set)
    }, [posts])

    // Filtered and sorted posts
    const filteredPosts = useMemo(() => {
        return posts
            .filter((p) => {
                // Tab filter
                if (activeTab !== 'all' && p.status !== activeTab) return false

                // Search query
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase()
                    const matchEN = p.contentEN.title.toLowerCase().includes(q)
                    const matchIT = p.contentIT.title.toLowerCase().includes(q)
                    const matchCategory = p.category.toLowerCase().includes(q)
                    const matchTags =
                        p.contentEN.tags.some((t) => t.toLowerCase().includes(q)) ||
                        p.contentIT.tags.some((t) => t.toLowerCase().includes(q))
                    if (!matchEN && !matchIT && !matchCategory && !matchTags) return false
                }

                // Category filter
                if (categoryFilter !== 'all' && p.category !== categoryFilter) return false

                // Author filter
                if (authorFilter !== 'all' && p.author !== authorFilter) return false

                // Language variant filter
                const hasEN = Boolean(p.contentEN.title && p.contentEN.body)
                const hasIT = Boolean(p.contentIT.title && p.contentIT.body)
                if (languageFilter === 'en_only' && (!hasEN || hasIT)) return false
                if (languageFilter === 'it_only' && (!hasIT || hasEN)) return false
                if (languageFilter === 'both' && (!hasEN || !hasIT)) return false

                return true
            })
            .sort((a, b) => {
                if (sortBy === 'views') {
                    return b.stats.views - a.stats.views
                }
                if (sortBy === 'oldest') {
                    return new Date(a.publishDate).getTime() - new Date(b.publishDate).getTime()
                }
                if (sortBy === 'edited') {
                    return new Date(b.lastSaved).getTime() - new Date(a.lastSaved).getTime()
                }
                // default 'newest'
                return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
            })
    }, [posts, activeTab, searchQuery, categoryFilter, languageFilter, authorFilter, sortBy])

    // Actions
    const handleDuplicate = (id: string) => {
        const dup = duplicateBlogPost(id)
        if (dup) {
            setPosts(getAllBlogPosts())
            setActiveMenuId(null)
            showToast(`Duplicated post as draft: "${dup.contentEN.title}"`)
        }
    }

    const handleTogglePublish = (post: AdminBlogPost) => {
        const isPublished = post.status === 'published'
        const updatedPost: AdminBlogPost = {
            ...post,
            status: isPublished ? 'draft' : 'published',
            publishDate: isPublished ? 'Draft' : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        }
        const updated = saveBlogPost(updatedPost)
        setPosts(updated)
        setActiveMenuId(null)
        showToast(isPublished ? 'Post unpublished and moved to drafts.' : 'Post published to public blog!')
    }

    const handleConfirmDelete = () => {
        if (!deleteModal.post) return
        const updated = deleteBlogPost(deleteModal.post.id)
        setPosts(updated)
        setDeleteModal({ isOpen: false })
        showToast('Blog post deleted permanently.')
    }

    return (
        <div style={{ padding: '36px 40px 100px', minHeight: '100vh', background: '#FAF7F2' }}>
            {/* Toast Notification */}
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

            {/* Header Bar */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '20px',
                    marginBottom: '28px',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h1
                            style={{
                                fontSize: '1.875rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                letterSpacing: '-0.02em',
                                margin: 0,
                            }}
                        >
                            Editorial Journal & Blog
                        </h1>
                        <span
                            style={{
                                padding: '4px 12px',
                                borderRadius: '9999px',
                                background: '#EDE8E1',
                                color: '#1C0F07',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                            }}
                        >
                            {posts.length} Posts
                        </span>
                    </div>
                    <p style={{ margin: '6px 0 0', fontSize: '0.9375rem', color: '#6B7280' }}>
                        Craft articles, customer wedding case studies, style editorials, and bilingual atelier dispatches.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Link
                        href="/admin/blog/settings"
                        style={{
                            background: '#FFFFFF',
                            color: '#1C0F07',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            padding: '10px 18px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        ⚙ Blog Settings
                    </Link>

                    <Link
                        href="/admin/blog/new"
                        style={{
                            background: '#C4975A',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '10px 22px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                            boxShadow: '0 2px 5px rgba(196, 151, 90, 0.25)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                        }}
                    >
                        <span>+</span> Write New Post
                    </Link>
                </div>
            </div>

            {/* 5-Tile Stats Strip */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '16px',
                    marginBottom: '32px',
                }}
            >
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Published
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#15803D' }}>
                        {stats.totalPublished}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>live on storefront</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Drafts
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#6B7280' }}>
                        {stats.totalDrafts}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>in preparation</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Scheduled
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#D97706' }}>
                        {stats.totalScheduled}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#B45309', fontWeight: 600 }}>queued dispatches</span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Top Post This Month
                    </p>
                    <p
                        style={{
                            margin: '6px 0 0',
                            fontSize: '0.9375rem',
                            fontWeight: 700,
                            color: '#1C0F07',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {stats.mostViewed.title}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#C4975A', fontWeight: 600 }}>
                        {stats.mostViewed.views.toLocaleString()} reads
                    </span>
                </div>

                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '14px',
                        padding: '18px 20px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        New Newsletter Leads
                    </p>
                    <p style={{ margin: '6px 0 0', fontSize: '1.75rem', fontWeight: 700, color: '#1C0F07' }}>
                        +{stats.totalSubscribers}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#15803D', fontWeight: 600 }}>from blog CTA capture</span>
                </div>
            </div>

            {/* Filter Tabs, Search & Filter Controls */}
            <div
                style={{
                    background: '#FFFFFF',
                    border: '1px solid #EDE8E1',
                    borderRadius: '16px',
                    padding: '20px 24px',
                    marginBottom: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
            >
                {/* Tabs & View Switcher Row */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '1px solid #EDE8E1',
                        paddingBottom: '16px',
                        marginBottom: '18px',
                        gap: '12px',
                        flexWrap: 'wrap',
                    }}
                >
                    {/* Filter Tabs */}
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
                        {(
                            [
                                { key: 'all', label: 'All Posts', count: posts.length },
                                { key: 'published', label: 'Published', count: stats.totalPublished },
                                { key: 'scheduled', label: 'Scheduled', count: stats.totalScheduled },
                                { key: 'draft', label: 'Drafts', count: stats.totalDrafts },
                            ] as const
                        ).map((tab) => {
                            const active = activeTab === tab.key
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActiveTab(tab.key)}
                                    style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '6px',
                                        padding: '6px 14px',
                                        borderRadius: '8px',
                                        fontSize: '0.8125rem',
                                        fontWeight: active ? 700 : 500,
                                        color: active ? '#FFFFFF' : '#4B5563',
                                        background: active ? '#1C0F07' : 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {tab.label}
                                    <span
                                        style={{
                                            padding: '2px 6px',
                                            borderRadius: '9999px',
                                            fontSize: '0.6875rem',
                                            fontWeight: 600,
                                            background: active ? 'rgba(255,255,255,0.2)' : '#F3F4F6',
                                            color: active ? '#FFFFFF' : '#6B7280',
                                        }}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            )
                        })}
                    </div>

                    {/* View Switcher Toggle */}
                    <div
                        style={{
                            display: 'inline-flex',
                            background: '#FAF7F2',
                            padding: '3px',
                            borderRadius: '8px',
                            border: '1px solid #EDE8E1',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setViewMode('table')}
                            style={{
                                border: 'none',
                                background: viewMode === 'table' ? '#1C0F07' : 'transparent',
                                color: viewMode === 'table' ? '#FFFFFF' : '#6B7280',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            ☰ Table
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('grid')}
                            style={{
                                border: 'none',
                                background: viewMode === 'grid' ? '#1C0F07' : 'transparent',
                                color: viewMode === 'grid' ? '#FFFFFF' : '#6B7280',
                                padding: '5px 12px',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px',
                            }}
                        >
                            ⊞ Grid
                        </button>
                    </div>
                </div>

                {/* Filter Controls Row */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '12px',
                    }}
                >
                    {/* Search Bar */}
                    <div style={{ flex: '1 1 240px', position: 'relative' }}>
                        <span
                            style={{
                                position: 'absolute',
                                left: '12px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#9CA3AF',
                                fontSize: '0.875rem',
                            }}
                        >
                            🔍
                        </span>
                        <input
                            type="text"
                            placeholder="Search by title, category, tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                height: '38px',
                                padding: '0 14px 0 34px',
                                border: '1px solid #EDE8E1',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                color: '#1C0F07',
                                background: '#FAF7F2',
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    color: '#9CA3AF',
                                    cursor: 'pointer',
                                }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        style={{
                            height: '38px',
                            padding: '0 12px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="all">All Categories</option>
                        {availableCategories.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>

                    {/* Language Variant Filter */}
                    <select
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value as LanguageFilter)}
                        style={{
                            height: '38px',
                            padding: '0 12px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="all">All Languages</option>
                        <option value="en_only">🇬🇧 English Only</option>
                        <option value="it_only">🇮🇹 Italian Only</option>
                        <option value="both">Both Complete (EN + IT)</option>
                    </select>

                    {/* Author Filter */}
                    <select
                        value={authorFilter}
                        onChange={(e) => setAuthorFilter(e.target.value)}
                        style={{
                            height: '38px',
                            padding: '0 12px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="all">All Authors</option>
                        {availableAuthors.map((a) => (
                            <option key={a} value={a}>
                                {a}
                            </option>
                        ))}
                    </select>

                    {/* Sort Selector */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        style={{
                            height: '38px',
                            padding: '0 12px',
                            border: '1px solid #EDE8E1',
                            borderRadius: '8px',
                            fontSize: '0.8125rem',
                            color: '#1C0F07',
                            background: '#FAF7F2',
                            cursor: 'pointer',
                            outline: 'none',
                        }}
                    >
                        <option value="newest">Sort: Newest First</option>
                        <option value="oldest">Sort: Oldest First</option>
                        <option value="views">Sort: Most Viewed</option>
                        <option value="edited">Sort: Recently Edited</option>
                    </select>
                </div>
            </div>

            {/* Empty State */}
            {filteredPosts.length === 0 ? (
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px dashed #D1D5DB',
                        borderRadius: '16px',
                        padding: '60px 20px',
                        textAlign: 'center',
                    }}
                >
                    <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#1C0F07', margin: '0 0 8px' }}>
                        No articles found
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6B7280', margin: '0 0 20px' }}>
                        Try adjusting your filters or write a fresh editorial dispatch for the atelier journal.
                    </p>
                    <Link
                        href="/admin/blog/new"
                        style={{
                            background: '#C4975A',
                            color: '#FFFFFF',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        + Write First Article
                    </Link>
                </div>
            ) : viewMode === 'table' ? (
                /* Table View */
                <div
                    style={{
                        background: '#FFFFFF',
                        border: '1px solid #EDE8E1',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    }}
                >
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ background: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Article
                                    </th>
                                    <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Category
                                    </th>
                                    <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Language
                                    </th>
                                    <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Status
                                    </th>
                                    <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Date
                                    </th>
                                    <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Views
                                    </th>
                                    <th style={{ padding: '14px 14px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase' }}>
                                        Author
                                    </th>
                                    <th style={{ padding: '14px 18px', fontSize: '0.75rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', textAlign: 'right' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPosts.map((post) => {
                                    const hasEN = Boolean(post.contentEN.title && post.contentEN.body)
                                    const hasIT = Boolean(post.contentIT.title && post.contentIT.body)
                                    const isPublished = post.status === 'published'
                                    const isScheduled = post.status === 'scheduled'

                                    return (
                                        <tr key={post.id} style={{ borderBottom: '1px solid #F3F4F6' }}>
                                            {/* Thumbnail & Title */}
                                            <td style={{ padding: '16px 18px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                                    <img
                                                        src={post.featuredImage}
                                                        alt={post.featuredImageAlt || post.contentEN.title}
                                                        style={{
                                                            width: '68px',
                                                            height: '42px',
                                                            borderRadius: '6px',
                                                            objectFit: 'cover',
                                                            border: '1px solid #EDE8E1',
                                                            flexShrink: 0,
                                                        }}
                                                    />
                                                    <div>
                                                        <Link
                                                            href={`/admin/blog/${post.id}`}
                                                            style={{
                                                                fontSize: '0.9375rem',
                                                                fontWeight: 700,
                                                                color: '#1C0F07',
                                                                textDecoration: 'none',
                                                                display: 'block',
                                                                lineHeight: 1.35,
                                                            }}
                                                        >
                                                            {post.contentEN.title || 'Untitled Post'}
                                                        </Link>
                                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>
                                                            /{post.slug}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Category */}
                                            <td style={{ padding: '16px 14px' }}>
                                                <span
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        padding: '3px 8px',
                                                        borderRadius: '4px',
                                                        background: '#FAF7F2',
                                                        border: '1px solid #EDE8E1',
                                                        color: '#4B5563',
                                                        fontWeight: 600,
                                                    }}
                                                >
                                                    {post.category}
                                                </span>
                                            </td>

                                            {/* Language Availability */}
                                            <td style={{ padding: '16px 14px' }}>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <span
                                                        style={{
                                                            fontSize: '0.6875rem',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontWeight: 700,
                                                            background: hasEN ? '#E0E7FF' : '#F3F4F6',
                                                            color: hasEN ? '#3730A3' : '#9CA3AF',
                                                        }}
                                                    >
                                                        EN
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: '0.6875rem',
                                                            padding: '2px 6px',
                                                            borderRadius: '4px',
                                                            fontWeight: 700,
                                                            background: hasIT ? '#DCFCE7' : '#F3F4F6',
                                                            color: hasIT ? '#15803D' : '#9CA3AF',
                                                        }}
                                                    >
                                                        IT
                                                    </span>
                                                </div>
                                            </td>

                                            {/* Status Badge */}
                                            <td style={{ padding: '16px 14px' }}>
                                                {isPublished ? (
                                                    <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        Published
                                                    </span>
                                                ) : isScheduled ? (
                                                    <span style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                                                        Scheduled
                                                    </span>
                                                ) : (
                                                    <span style={{ background: '#F3F4F6', color: '#6B7280', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                                                        Draft
                                                    </span>
                                                )}
                                            </td>

                                            {/* Date */}
                                            <td style={{ padding: '16px 14px', fontSize: '0.8125rem', color: '#4B5563' }}>
                                                {post.publishDate}
                                            </td>

                                            {/* Views */}
                                            <td style={{ padding: '16px 14px', fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07' }}>
                                                {post.stats.views > 0 ? post.stats.views.toLocaleString() : '—'}
                                            </td>

                                            {/* Author */}
                                            <td style={{ padding: '16px 14px', fontSize: '0.8125rem', color: '#6B7280' }}>
                                                {post.author}
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '16px 18px', textAlign: 'right', position: 'relative' }}>
                                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                                    {isPublished && (
                                                        <Link
                                                            href={`/blog/${post.slug}`}
                                                            target="_blank"
                                                            title="View on public site"
                                                            style={{
                                                                color: '#C4975A',
                                                                fontSize: '0.875rem',
                                                                textDecoration: 'none',
                                                                padding: '4px',
                                                            }}
                                                        >
                                                            ↗
                                                        </Link>
                                                    )}

                                                    <Link
                                                        href={`/admin/blog/${post.id}`}
                                                        style={{
                                                            background: '#FAF7F2',
                                                            color: '#1C0F07',
                                                            border: '1px solid #EDE8E1',
                                                            borderRadius: '6px',
                                                            padding: '6px 12px',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            textDecoration: 'none',
                                                        }}
                                                    >
                                                        Edit
                                                    </Link>

                                                    {/* Three-dot Trigger */}
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveMenuId(activeMenuId === post.id ? null : post.id)}
                                                        style={{
                                                            background: '#FFFFFF',
                                                            border: '1px solid #EDE8E1',
                                                            borderRadius: '6px',
                                                            padding: '6px 8px',
                                                            fontSize: '0.875rem',
                                                            cursor: 'pointer',
                                                            color: '#4B5563',
                                                        }}
                                                    >
                                                        •••
                                                    </button>
                                                </div>

                                                {/* Dropdown Menu */}
                                                {activeMenuId === post.id && (
                                                    <div
                                                        style={{
                                                            position: 'absolute',
                                                            right: '18px',
                                                            top: '46px',
                                                            background: '#FFFFFF',
                                                            border: '1px solid #EDE8E1',
                                                            borderRadius: '10px',
                                                            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                                            zIndex: 100,
                                                            width: '180px',
                                                            textAlign: 'left',
                                                            overflow: 'hidden',
                                                        }}
                                                    >
                                                        <Link
                                                            href={`/admin/blog/${post.id}/preview`}
                                                            style={{
                                                                display: 'block',
                                                                padding: '10px 14px',
                                                                fontSize: '0.8125rem',
                                                                color: '#1C0F07',
                                                                textDecoration: 'none',
                                                                borderBottom: '1px solid #F3F4F6',
                                                            }}
                                                        >
                                                            👁 Live Preview
                                                        </Link>
                                                        <Link
                                                            href={`/admin/blog/${post.id}/analytics`}
                                                            style={{
                                                                display: 'block',
                                                                padding: '10px 14px',
                                                                fontSize: '0.8125rem',
                                                                color: '#1C0F07',
                                                                textDecoration: 'none',
                                                                borderBottom: '1px solid #F3F4F6',
                                                            }}
                                                        >
                                                            📊 Post Analytics
                                                        </Link>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleDuplicate(post.id)}
                                                            style={{
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                padding: '10px 14px',
                                                                fontSize: '0.8125rem',
                                                                color: '#1C0F07',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                borderBottom: '1px solid #F3F4F6',
                                                            }}
                                                        >
                                                            📋 Duplicate Post
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleTogglePublish(post)}
                                                            style={{
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                padding: '10px 14px',
                                                                fontSize: '0.8125rem',
                                                                color: isPublished ? '#B45309' : '#15803D',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                                borderBottom: '1px solid #F3F4F6',
                                                            }}
                                                        >
                                                            {isPublished ? '⏸ Move to Drafts' : '✓ Publish Now'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setActiveMenuId(null)
                                                                setDeleteModal({ isOpen: true, post })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                textAlign: 'left',
                                                                padding: '10px 14px',
                                                                fontSize: '0.8125rem',
                                                                color: '#B91C1C',
                                                                background: 'none',
                                                                border: 'none',
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            🗑 Delete Post
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                /* Card Grid View */
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: '24px',
                    }}
                >
                    {filteredPosts.map((post) => {
                        const hasEN = Boolean(post.contentEN.title && post.contentEN.body)
                        const hasIT = Boolean(post.contentIT.title && post.contentIT.body)
                        const isPublished = post.status === 'published'

                        return (
                            <div
                                key={post.id}
                                style={{
                                    background: '#FFFFFF',
                                    border: '1px solid #EDE8E1',
                                    borderRadius: '16px',
                                    overflow: 'hidden',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {/* 16:9 Thumbnail Header */}
                                <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                                    <img
                                        src={post.featuredImage}
                                        alt={post.featuredImageAlt || post.contentEN.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                                        <span
                                            style={{
                                                background: 'rgba(28, 15, 7, 0.85)',
                                                color: '#FAF7F2',
                                                fontSize: '0.6875rem',
                                                fontWeight: 700,
                                                padding: '3px 8px',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            {post.category}
                                        </span>
                                    </div>
                                    <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', gap: '4px' }}>
                                        <span
                                            style={{
                                                fontSize: '0.6875rem',
                                                padding: '3px 6px',
                                                borderRadius: '4px',
                                                fontWeight: 700,
                                                background: isPublished ? '#DCFCE7' : post.status === 'scheduled' ? '#FEF3C7' : '#F3F4F6',
                                                color: isPublished ? '#15803D' : post.status === 'scheduled' ? '#B45309' : '#4B5563',
                                            }}
                                        >
                                            {post.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                        <span style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{post.publishDate}</span>
                                        <span style={{ color: '#D1D5DB' }}>·</span>
                                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{post.author}</span>
                                        <span style={{ color: '#D1D5DB' }}>·</span>
                                        <div style={{ display: 'flex', gap: '4px' }}>
                                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: hasEN ? '#3730A3' : '#D1D5DB' }}>
                                                EN
                                            </span>
                                            <span style={{ fontSize: '0.6875rem', fontWeight: 700, color: hasIT ? '#15803D' : '#D1D5DB' }}>
                                                IT
                                            </span>
                                        </div>
                                    </div>

                                    <Link
                                        href={`/admin/blog/${post.id}`}
                                        style={{
                                            fontSize: '1.0625rem',
                                            fontWeight: 700,
                                            color: '#1C0F07',
                                            textDecoration: 'none',
                                            lineHeight: 1.4,
                                            marginBottom: '8px',
                                        }}
                                    >
                                        {post.contentEN.title || 'Untitled Post'}
                                    </Link>

                                    <p
                                        style={{
                                            margin: '0 0 16px',
                                            fontSize: '0.8125rem',
                                            color: '#6B7280',
                                            lineHeight: 1.5,
                                            flex: 1,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {post.contentEN.excerpt}
                                    </p>

                                    {/* Footer Stats & Actions */}
                                    <div
                                        style={{
                                            borderTop: '1px solid #EDE8E1',
                                            paddingTop: '14px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
                                            👁 {post.stats.views.toLocaleString()} reads
                                        </span>

                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            <Link
                                                href={`/admin/blog/${post.id}/analytics`}
                                                style={{
                                                    fontSize: '0.75rem',
                                                    color: '#4B5563',
                                                    textDecoration: 'none',
                                                    padding: '4px 8px',
                                                    background: '#FAF7F2',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                Stats
                                            </Link>
                                            <Link
                                                href={`/admin/blog/${post.id}`}
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 600,
                                                    color: '#C4975A',
                                                    textDecoration: 'none',
                                                    padding: '4px 8px',
                                                    background: '#FAF7F2',
                                                    borderRadius: '4px',
                                                }}
                                            >
                                                Edit →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteModal.isOpen && deleteModal.post && (
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
                            Delete Article Permanently?
                        </h3>
                        <p style={{ margin: '0 0 20px', fontSize: '0.875rem', color: '#6B7280', lineHeight: 1.5 }}>
                            Are you sure you want to delete <strong>&ldquo;{deleteModal.post.contentEN.title}&rdquo;</strong>?
                            This action will remove both English and Italian variants and cannot be undone.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setDeleteModal({ isOpen: false })}
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
                                Delete Article
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
