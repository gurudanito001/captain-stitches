'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    BlogGlobalSettings,
    getBlogSettings,
    saveBlogSettings,
    getAllBlogPosts,
} from '@/data/adminBlogData'

export default function BlogSettingsPage() {
    const [settings, setSettings] = useState<BlogGlobalSettings | null>(null)
    const [posts, setPosts] = useState<any[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Category modal
    const [isCatModalOpen, setIsCatModalOpen] = useState(false)
    const [editingCatId, setEditingCatId] = useState<string | null>(null)
    const [catNameEN, setCatNameEN] = useState('')
    const [catNameIT, setCatNameIT] = useState('')
    const [catSlug, setCatSlug] = useState('')

    useEffect(() => {
        const loadedSettings = getBlogSettings()
        setSettings(loadedSettings)
        const loadedPosts = getAllBlogPosts()
        setPosts(loadedPosts)
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3200)
    }

    const categoryCounts = useMemo(() => {
        const map: Record<string, number> = {}
        posts.forEach((p) => {
            map[p.category] = (map[p.category] || 0) + 1
        })
        return map
    }, [posts])

    if (!settings) {
        return (
            <div
                style={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
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
                <p style={{ fontSize: '14px', color: '#8C827A', fontFamily: 'serif' }}>Loading blog preferences...</p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    const handleSave = () => {
        setIsSaving(true)
        saveBlogSettings(settings)
        setTimeout(() => {
            setIsSaving(false)
            showToast('Blog global settings saved successfully')
        }, 300)
    }

    const handleCopyRSS = () => {
        navigator.clipboard.writeText(`https://captainstitches.com${settings.rssUrl}`)
        showToast('RSS feed endpoint copied to clipboard')
    }

    const handleOpenAddCategory = () => {
        setEditingCatId(null)
        setCatNameEN('')
        setCatNameIT('')
        setCatSlug('')
        setIsCatModalOpen(true)
    }

    const handleOpenEditCategory = (cat: { id: string; nameEN: string; nameIT: string; slug: string }) => {
        setEditingCatId(cat.id)
        setCatNameEN(cat.nameEN)
        setCatNameIT(cat.nameIT)
        setCatSlug(cat.slug)
        setIsCatModalOpen(true)
    }

    const handleSaveCategory = () => {
        if (!catNameEN.trim()) return
        const slug = catSlug.trim() || catNameEN.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        
        let updatedCategories: Array<{ id: string; nameEN: string; nameIT: string; slug: string }>
        if (editingCatId) {
            updatedCategories = settings.categories.map((c) =>
                c.id === editingCatId ? { ...c, nameEN: catNameEN.trim(), nameIT: catNameIT.trim(), slug } : c
            )
        } else {
            const newCat = {
                id: `cat-${Date.now()}`,
                nameEN: catNameEN.trim(),
                nameIT: catNameIT.trim() || catNameEN.trim(),
                slug,
            }
            updatedCategories = [...settings.categories, newCat]
        }

        const newSettings = { ...settings, categories: updatedCategories }
        setSettings(newSettings)
        saveBlogSettings(newSettings)
        setIsCatModalOpen(false)
        showToast(editingCatId ? 'Category updated' : 'New category added')
    }

    const handleDeleteCategory = (id: string, name: string) => {
        if (categoryCounts[name] && categoryCounts[name] > 0) {
            if (!confirm(`Warning: There are ${categoryCounts[name]} post(s) tagged with "${name}". Are you sure you want to delete it?`)) {
                return
            }
        }
        const updated = settings.categories.filter((c) => c.id !== id)
        const newSettings = { ...settings, categories: updated }
        setSettings(newSettings)
        saveBlogSettings(newSettings)
        showToast('Category deleted')
    }

    return (
        <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 0 80px' }}>
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
                        boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
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

            {/* HEADER */}
            <div style={{ marginBottom: '32px' }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '12px',
                        color: '#8C827A',
                        marginBottom: '8px',
                    }}
                >
                    <Link href="/admin/blog" style={{ color: '#8C827A', textDecoration: 'none' }}>
                        Blog Journal
                    </Link>
                    <span>/</span>
                    <span style={{ color: '#C4975A' }}>Atelier Settings</span>
                </div>

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
                                fontFamily: 'serif',
                                fontSize: '28px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: '0 0 6px',
                            }}
                        >
                            Blog Journal Configuration
                        </h1>
                        <p style={{ fontSize: '14px', color: '#8C827A', margin: 0 }}>
                            Configure editorial defaults, global call-to-actions, syndication, and category taxonomies.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isSaving}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '10px 24px',
                            backgroundColor: '#C4975A',
                            color: '#1C0F07',
                            borderRadius: '8px',
                            border: 'none',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        {isSaving ? 'Saving Preferences...' : 'Save Blog Settings'}
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* 1. DEFAULT CTA BANNER */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '19px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: '0 0 4px',
                                }}
                            >
                                Default Editorial CTA Banner
                            </h2>
                            <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                                Automatically injected at the foot of all journal publications unless overridden on a specific post.
                            </p>
                        </div>

                        {/* Toggle switch */}
                        <label
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '10px',
                                cursor: 'pointer',
                            }}
                        >
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                                {settings.defaultCTA.isEnabledGlobally ? 'Active on all articles' : 'CTA Disabled Globally'}
                            </span>
                            <input
                                type="checkbox"
                                checked={settings.defaultCTA.isEnabledGlobally}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        defaultCTA: { ...settings.defaultCTA, isEnabledGlobally: e.target.checked },
                                    })
                                }
                                style={{ display: 'none' }}
                            />
                            <div
                                style={{
                                    width: '42px',
                                    height: '24px',
                                    backgroundColor: settings.defaultCTA.isEnabledGlobally ? '#C4975A' : '#D1C9BE',
                                    borderRadius: '12px',
                                    padding: '2px',
                                    transition: 'background-color 0.2s ease',
                                    position: 'relative',
                                }}
                            >
                                <div
                                    style={{
                                        width: '20px',
                                        height: '20px',
                                        backgroundColor: '#FFFFFF',
                                        borderRadius: '50%',
                                        position: 'absolute',
                                        left: settings.defaultCTA.isEnabledGlobally ? '20px' : '2px',
                                        transition: 'left 0.2s ease',
                                    }}
                                />
                            </div>
                        </label>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
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
                                English Headline Text 🇬🇧
                            </label>
                            <input
                                type="text"
                                value={settings.defaultCTA.textEN}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        defaultCTA: { ...settings.defaultCTA, textEN: e.target.value },
                                    })
                                }
                                placeholder="Ready to commission your bespoke garment? Browse our collection →"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

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
                                Italian Headline Text 🇮🇹
                            </label>
                            <input
                                type="text"
                                value={settings.defaultCTA.textIT}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        defaultCTA: { ...settings.defaultCTA, textIT: e.target.value },
                                    })
                                }
                                placeholder="Pronto a commissionare il tuo prossimo capo su misura? Scopri la collezione →"
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '14px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
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
                                    Button Destination
                                </label>
                                <select
                                    value={settings.defaultCTA.linkType}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            defaultCTA: {
                                                ...settings.defaultCTA,
                                                linkType: e.target.value as any,
                                                customUrl:
                                                    e.target.value === 'catalogue'
                                                        ? '/catalogue'
                                                        : e.target.value === 'order'
                                                        ? '/order'
                                                        : settings.defaultCTA.customUrl,
                                            },
                                        })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '10px 12px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        backgroundColor: '#FAF7F2',
                                    }}
                                >
                                    <option value="catalogue">Public Catalogue (/catalogue)</option>
                                    <option value="order">Custom Order Flow (/order)</option>
                                    <option value="custom">Custom Atelier URL</option>
                                </select>
                            </div>

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
                                    Destination Path
                                </label>
                                <input
                                    type="text"
                                    value={settings.defaultCTA.customUrl}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            defaultCTA: { ...settings.defaultCTA, customUrl: e.target.value },
                                        })
                                    }
                                    style={{
                                        width: '100%',
                                        padding: '10px 14px',
                                        borderRadius: '8px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Visual Banner Preview */}
                        <div style={{ marginTop: '12px' }}>
                            <span
                                style={{
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.06em',
                                    color: '#8C827A',
                                    display: 'block',
                                    marginBottom: '8px',
                                }}
                            >
                                Live Banner Visual Mockup
                            </span>
                            <div
                                style={{
                                    padding: '24px',
                                    borderRadius: '12px',
                                    backgroundColor: '#1C0F07',
                                    border: '1px solid #C4975A',
                                    color: '#FAF7F2',
                                    textAlign: 'center',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '10px',
                                }}
                            >
                                <span
                                    style={{
                                        fontSize: '10px',
                                        fontWeight: 700,
                                        letterSpacing: '0.12em',
                                        textTransform: 'uppercase',
                                        color: '#C4975A',
                                    }}
                                >
                                    Experience Bespoke Excellence
                                </span>
                                <div style={{ fontFamily: 'serif', fontSize: '18px', fontWeight: 500 }}>
                                    {settings.defaultCTA.textEN || 'Commission Your Next Bespoke Garment'}
                                </div>
                                <span
                                    style={{
                                        display: 'inline-block',
                                        padding: '8px 20px',
                                        backgroundColor: '#C4975A',
                                        color: '#1C0F07',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        marginTop: '4px',
                                    }}
                                >
                                    Explore Catalogue →
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. CATEGORIES MANAGER */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '19px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: '0 0 4px',
                                }}
                            >
                                Editorial Taxonomy & Categories
                            </h2>
                            <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                                Manage the primary topics used for journal classification and reader filtering.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleOpenAddCategory}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                border: '1px solid #C4975A',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '12px',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            + Add New Category
                        </button>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #E8E2D9', textAlign: 'left' }}>
                                    <th style={{ padding: '10px 8px', color: '#8C827A', fontWeight: 600 }}>
                                        English Name
                                    </th>
                                    <th style={{ padding: '10px 8px', color: '#8C827A', fontWeight: 600 }}>
                                        Italian Name
                                    </th>
                                    <th style={{ padding: '10px 8px', color: '#8C827A', fontWeight: 600 }}>Slug</th>
                                    <th style={{ padding: '10px 8px', color: '#8C827A', fontWeight: 600 }}>
                                        Published Posts
                                    </th>
                                    <th style={{ padding: '10px 8px', color: '#8C827A', fontWeight: 600, textAlign: 'right' }}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {settings.categories.map((cat) => (
                                    <tr key={cat.id} style={{ borderBottom: '1px solid #F5F1EB' }}>
                                        <td style={{ padding: '12px 8px', fontWeight: 600, color: '#1C0F07' }}>
                                            {cat.nameEN}
                                        </td>
                                        <td style={{ padding: '12px 8px', color: '#4A3D36' }}>{cat.nameIT}</td>
                                        <td style={{ padding: '12px 8px', color: '#8C827A', fontFamily: 'monospace' }}>
                                            {cat.slug}
                                        </td>
                                        <td style={{ padding: '12px 8px' }}>
                                            <span
                                                style={{
                                                    padding: '2px 8px',
                                                    borderRadius: '10px',
                                                    backgroundColor: '#FAF7F2',
                                                    border: '1px solid #E8E2D9',
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    color: '#1C0F07',
                                                }}
                                            >
                                                {categoryCounts[cat.nameEN] || 0} posts
                                            </span>
                                        </td>
                                        <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                                            <div style={{ display: 'inline-flex', gap: '8px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOpenEditCategory(cat)}
                                                    style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '4px',
                                                        border: '1px solid #E8E2D9',
                                                        backgroundColor: '#FFFFFF',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                        color: '#1C0F07',
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteCategory(cat.id, cat.nameEN)}
                                                    style={{
                                                        padding: '4px 10px',
                                                        borderRadius: '4px',
                                                        border: '1px solid rgba(199, 43, 43, 0.2)',
                                                        backgroundColor: '#FFFFFF',
                                                        fontSize: '11px',
                                                        cursor: 'pointer',
                                                        color: '#C72B2B',
                                                    }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3. DEFAULT AUTHOR & CREDENTIALS */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '20px',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '19px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: '0 0 4px',
                                }}
                            >
                                Author Sign-off & Bylines
                            </h2>
                            <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                                Default author identity presented at the top and conclusion of journal manuscripts.
                            </p>
                        </div>

                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>
                                Show Author Byline
                            </span>
                            <input
                                type="checkbox"
                                checked={settings.showAuthor}
                                onChange={(e) => setSettings({ ...settings, showAuthor: e.target.checked })}
                                style={{ width: '16px', height: '16px', accentColor: '#C4975A' }}
                            />
                        </label>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px' }}>
                        <div
                            style={{
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                backgroundColor: '#1C0F07',
                                color: '#FAF7F2',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontFamily: 'serif',
                                fontSize: '20px',
                                fontWeight: 600,
                                border: '2px solid #C4975A',
                                flexShrink: 0,
                            }}
                        >
                            {settings.defaultAuthor.charAt(0)}
                        </div>

                        <div style={{ flex: 1 }}>
                            <label
                                style={{
                                    display: 'block',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    marginBottom: '4px',
                                }}
                            >
                                Master Tailor / Author Name
                            </label>
                            <input
                                type="text"
                                value={settings.defaultAuthor}
                                onChange={(e) => setSettings({ ...settings, defaultAuthor: e.target.value })}
                                style={{
                                    width: '100%',
                                    maxWidth: '360px',
                                    padding: '9px 12px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '14px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* 4. RSS FEED & SYNDICATION */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            marginBottom: '18px',
                            flexWrap: 'wrap',
                            gap: '12px',
                        }}
                    >
                        <div>
                            <h2
                                style={{
                                    fontFamily: 'serif',
                                    fontSize: '19px',
                                    fontWeight: 600,
                                    color: '#1C0F07',
                                    margin: '0 0 4px',
                                }}
                            >
                                RSS Feed & Syndication
                            </h2>
                            <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                                Automatically generates an RSS 2.0 XML endpoint for news readers and newsletter automations.
                            </p>
                        </div>

                        <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                            <span style={{ fontSize: '12px', fontWeight: 600, color: '#1C0F07' }}>RSS Feed Active</span>
                            <input
                                type="checkbox"
                                checked={settings.rssEnabled}
                                onChange={(e) => setSettings({ ...settings, rssEnabled: e.target.checked })}
                                style={{ width: '16px', height: '16px', accentColor: '#C4975A' }}
                            />
                        </label>
                    </div>

                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '14px 16px',
                            backgroundColor: '#FAF7F2',
                            borderRadius: '10px',
                            border: '1px solid #E8E2D9',
                            flexWrap: 'wrap',
                        }}
                    >
                        <span style={{ fontSize: '13px', color: '#1C0F07', fontFamily: 'monospace', flex: 1 }}>
                            https://captainstitches.com{settings.rssUrl}
                        </span>
                        <button
                            type="button"
                            onClick={handleCopyRSS}
                            style={{
                                padding: '6px 14px',
                                backgroundColor: '#1C0F07',
                                color: '#FAF7F2',
                                borderRadius: '6px',
                                border: 'none',
                                fontSize: '12px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            Copy Feed URL
                        </button>
                    </div>
                </div>

                {/* 5. SOCIAL SHARING & OPEN GRAPH DEFAULTS */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #E8E2D9',
                        padding: '28px',
                        boxShadow: '0 2px 8px rgba(28, 15, 7, 0.02)',
                    }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <h2
                            style={{
                                fontFamily: 'serif',
                                fontSize: '19px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: '0 0 4px',
                            }}
                        >
                            Social Media & Open Graph Defaults
                        </h2>
                        <p style={{ fontSize: '13px', color: '#8C827A', margin: 0 }}>
                            Fallbacks applied when sharing articles across WhatsApp, LinkedIn, and Instagram.
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                                Default Hashtags Appended to Shares
                            </label>
                            <input
                                type="text"
                                value={settings.socialDefaults.hashtags}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        socialDefaults: { ...settings.socialDefaults, hashtags: e.target.value },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>

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
                                Fallback Open Graph Image URL (1200 × 630px)
                            </label>
                            <input
                                type="text"
                                value={settings.socialDefaults.defaultOgImage}
                                onChange={(e) =>
                                    setSettings({
                                        ...settings,
                                        socialDefaults: { ...settings.socialDefaults, defaultOgImage: e.target.value },
                                    })
                                }
                                style={{
                                    width: '100%',
                                    padding: '10px 14px',
                                    borderRadius: '8px',
                                    border: '1px solid #E8E2D9',
                                    fontSize: '13px',
                                    boxSizing: 'border-box',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* CATEGORY ADD / EDIT MODAL */}
            {isCatModalOpen && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(28, 15, 7, 0.65)',
                        backdropFilter: 'blur(3px)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999,
                        padding: '16px',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            maxWidth: '460px',
                            width: '100%',
                            padding: '28px',
                            border: '1px solid #E8E2D9',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
                        }}
                    >
                        <h3
                            style={{
                                fontFamily: 'serif',
                                fontSize: '20px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                margin: '0 0 16px',
                            }}
                        >
                            {editingCatId ? 'Edit Journal Category' : 'Add New Category'}
                        </h3>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
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
                                    Category Name (English) *
                                </label>
                                <input
                                    type="text"
                                    value={catNameEN}
                                    onChange={(e) => {
                                        setCatNameEN(e.target.value)
                                        if (!editingCatId) {
                                            setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))
                                        }
                                    }}
                                    placeholder="e.g. Masterclass"
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

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
                                    Category Name (Italian)
                                </label>
                                <input
                                    type="text"
                                    value={catNameIT}
                                    onChange={(e) => setCatNameIT(e.target.value)}
                                    placeholder="e.g. Masterclass"
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>

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
                                    URL Slug
                                </label>
                                <input
                                    type="text"
                                    value={catSlug}
                                    onChange={(e) => setCatSlug(e.target.value)}
                                    placeholder="e.g. masterclass"
                                    style={{
                                        width: '100%',
                                        padding: '9px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #E8E2D9',
                                        fontSize: '13px',
                                        fontFamily: 'monospace',
                                        boxSizing: 'border-box',
                                    }}
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                type="button"
                                onClick={() => setIsCatModalOpen(false)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    border: '1px solid #E8E2D9',
                                    backgroundColor: '#FFFFFF',
                                    fontSize: '13px',
                                    color: '#4A3D36',
                                    cursor: 'pointer',
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleSaveCategory}
                                style={{
                                    padding: '8px 18px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: '#C4975A',
                                    color: '#1C0F07',
                                    fontSize: '13px',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                {editingCatId ? 'Save Changes' : 'Create Category'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
