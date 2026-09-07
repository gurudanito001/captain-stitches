'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    CatalogueDesign,
    CatalogueCategory,
    CATEGORY_OPTIONS,
    getAllDesigns,
    saveAllDesigns,
    saveDesign,
    deleteDesign,
    duplicateDesign,
} from '@/data/adminCatalogueData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: '#8A7A6E', flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
)

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)

const IconStar = ({ filled }: { filled: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? '#F59E0B' : 'none'} stroke={filled ? '#F59E0B' : '#A8998C'} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
)

const IconGripVertical = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: '#B3A69A', flexShrink: 0 }}><circle cx="9" cy="12" r="1" /><circle cx="9" cy="5" r="1" /><circle cx="9" cy="19" r="1" /><circle cx="15" cy="12" r="1" /><circle cx="15" cy="5" r="1" /><circle cx="15" cy="19" r="1" /></svg>
)

const IconMoreVertical = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
)

const IconEye = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

export default function AdminCataloguePage() {
    const router = useRouter()
    const [designs, setDesigns] = useState<CatalogueDesign[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [categoryFilter, setCategoryFilter] = useState<'all' | CatalogueCategory>('all')
    const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all')
    const [featuredFilter, setFeaturedFilter] = useState<'all' | 'featured'>('all')
    const [sortBy, setSortBy] = useState<'custom' | 'orders' | 'recent' | 'price_high' | 'price_low'>('custom')

    // Drag reordering state
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [hasUnsavedOrder, setHasUnsavedOrder] = useState(false)
    const [activeMenuId, setActiveMenuId] = useState<string | null>(null)
    const [toastMessage, setToastMessage] = useState<string | null>(null)

    // Load designs
    useEffect(() => {
        setDesigns(getAllDesigns())
    }, [])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
    }

    // Filtered & Sorted designs
    const filteredDesigns = useMemo(() => {
        let result = designs.filter((d) => {
            // Search by name or category
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim()
                const matchesName = d.contentEN.name.toLowerCase().includes(q) || d.contentIT.name.toLowerCase().includes(q)
                const matchesCategory = d.categoryLabel.toLowerCase().includes(q)
                const matchesTags = d.contentEN.tags.some((t) => t.toLowerCase().includes(q))
                if (!matchesName && !matchesCategory && !matchesTags) return false
            }
            // Category filter
            if (categoryFilter !== 'all' && d.category !== categoryFilter) return false
            // Visibility filter
            if (visibilityFilter === 'visible' && !d.isVisible) return false
            if (visibilityFilter === 'hidden' && d.isVisible) return false
            // Featured filter
            if (featuredFilter === 'featured' && !d.isFeatured) return false

            return true
        })

        // Sort
        if (sortBy === 'orders') {
            result.sort((a, b) => b.stats.totalOrders - a.stats.totalOrders)
        } else if (sortBy === 'recent') {
            result.sort((a, b) => new Date(b.stats.dateCreated).getTime() - new Date(a.stats.dateCreated).getTime())
        } else if (sortBy === 'price_high') {
            result.sort((a, b) => b.pricing.priceNGN - a.pricing.priceNGN)
        } else if (sortBy === 'price_low') {
            result.sort((a, b) => a.pricing.priceNGN - b.pricing.priceNGN)
        } else {
            // Default custom sortOrder
            result.sort((a, b) => a.sortOrder - b.sortOrder)
        }

        return result
    }, [designs, searchQuery, categoryFilter, visibilityFilter, featuredFilter, sortBy])

    // Toggle visibility on card
    const handleToggleVisibility = (e: React.MouseEvent, designId: string) => {
        e.stopPropagation()
        const updated = designs.map((d) => (d.id === designId ? { ...d, isVisible: !d.isVisible } : d))
        setDesigns(updated)
        saveAllDesigns(updated)
        const target = updated.find((d) => d.id === designId)
        showToast(`${target?.contentEN.name} is now ${target?.isVisible ? 'Visible on site' : 'Hidden from site'}`)
    }

    // Toggle featured on card
    const handleToggleFeatured = (e: React.MouseEvent, designId: string) => {
        e.stopPropagation()
        const updated = designs.map((d) => (d.id === designId ? { ...d, isFeatured: !d.isFeatured } : d))
        setDesigns(updated)
        saveAllDesigns(updated)
        const target = updated.find((d) => d.id === designId)
        showToast(`${target?.contentEN.name} ${target?.isFeatured ? 'marked as Featured' : 'removed from Featured'}`)
    }

    // Duplicate design
    const handleDuplicate = (e: React.MouseEvent, designId: string) => {
        e.stopPropagation()
        setActiveMenuId(null)
        const copy = duplicateDesign(designId)
        if (copy) {
            setDesigns(getAllDesigns())
            showToast(`Duplicated as draft: ${copy.contentEN.name}`)
        }
    }

    // Delete design
    const handleDelete = (e: React.MouseEvent, designId: string, designName: string) => {
        e.stopPropagation()
        setActiveMenuId(null)
        if (confirm(`Are you sure you want to delete "${designName}" from the catalogue?`)) {
            deleteDesign(designId)
            setDesigns(getAllDesigns())
            showToast(`Deleted ${designName}`)
        }
    }

    // Drag-and-drop reordering
    const handleDragStart = (e: React.DragEvent, index: number) => {
        setDraggedIndex(index)
        e.dataTransfer.setData('text/plain', String(index))
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
    }

    const handleDrop = (e: React.DragEvent, targetIndex: number) => {
        e.preventDefault()
        if (draggedIndex === null || draggedIndex === targetIndex) return

        const reordered = [...filteredDesigns]
        const [movedItem] = reordered.splice(draggedIndex, 1)
        reordered.splice(targetIndex, 0, movedItem)

        // Update sortOrder sequence
        const updatedWithOrders = reordered.map((item, idx) => ({
            ...item,
            sortOrder: idx + 1,
        }))

        // Merge back into full state
        const remaining = designs.filter((d) => !updatedWithOrders.some((u) => u.id === d.id))
        const combined = [...updatedWithOrders, ...remaining]

        setDesigns(combined)
        setDraggedIndex(null)
        setHasUnsavedOrder(true)
    }

    const handleSaveOrder = () => {
        saveAllDesigns(designs)
        setHasUnsavedOrder(false)
        showToast('Catalogue layout order saved to live storefront!')
    }

    const resetFilters = () => {
        setSearchQuery('')
        setCategoryFilter('all')
        setVisibilityFilter('all')
        setFeaturedFilter('all')
        setSortBy('custom')
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
            {/* Toast */}
            {toastMessage && (
                <div
                    style={{
                        position: 'fixed',
                        bottom: '2rem',
                        right: '2rem',
                        backgroundColor: '#1C0F07',
                        color: '#FFFFFF',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '10px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        zIndex: 100,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                    }}
                >
                    <span style={{ color: '#C4975A' }}>✓</span>
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* ─── Header Bar ────────────────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h1
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                letterSpacing: '-0.02em',
                                margin: 0,
                            }}
                        >
                            Designs Catalogue
                        </h1>
                        <span
                            style={{
                                backgroundColor: '#FDF3E7',
                                color: '#C4975A',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '9999px',
                                border: '1px solid #EAD8C3',
                            }}
                        >
                            {designs.length} designs ({designs.filter((d) => d.isVisible).length} visible)
                        </span>
                    </div>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#8A7A6E',
                            margin: 0,
                            marginTop: '0.25rem',
                        }}
                    >
                        Manage styles, photography, dual ₦ and € pricing, fabric options, and public showcase order.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {hasUnsavedOrder && (
                        <button
                            type="button"
                            onClick={handleSaveOrder}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                backgroundColor: '#166534',
                                color: '#FFFFFF',
                                fontSize: '0.825rem',
                                fontWeight: 700,
                                padding: '0.625rem 1.15rem',
                                borderRadius: '10px',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(22,101,52,0.25)',
                            }}
                        >
                            <IconCheck />
                            <span>Save Reordered Display</span>
                        </button>
                    )}

                    <Link
                        href="/admin/catalogue/new"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            padding: '0.625rem 1.125rem',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                        }}
                    >
                        <IconPlus />
                        <span>Add New Design</span>
                    </Link>
                </div>
            </div>

            {/* ─── Search & Filters Bar ──────────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '1.25rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                {/* Search Input + Sort Row */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            backgroundColor: '#FAF7F2',
                            border: '1px solid #E5DFD7',
                            borderRadius: '10px',
                            padding: '0.6rem 0.95rem',
                            flex: '1 1 320px',
                        }}
                    >
                        <IconSearch />
                        <input
                            type="text"
                            placeholder="Search by design name, category, or tags..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                border: 'none',
                                outline: 'none',
                                backgroundColor: 'transparent',
                                fontSize: '0.85rem',
                                color: '#1C0F07',
                                width: '100%',
                            }}
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                style={{ border: 'none', background: 'transparent', color: '#A8998C', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Sort by:
                        </span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.8rem',
                                padding: '0.55rem 0.75rem',
                                borderRadius: '8px',
                                outline: 'none',
                                cursor: 'pointer',
                                fontWeight: 600,
                            }}
                        >
                            <option value="custom">Custom Order (Drag & Drop)</option>
                            <option value="orders">Most Ordered (Popular)</option>
                            <option value="recent">Recently Added</option>
                            <option value="price_high">Price (High to Low)</option>
                            <option value="price_low">Price (Low to High)</option>
                        </select>
                    </div>
                </div>

                {/* Filter Controls Row */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '1rem',
                        paddingTop: '0.75rem',
                        borderTop: '1px solid #F3EFE9',
                    }}
                >
                    {/* Category Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Category:
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                            <button
                                type="button"
                                onClick={() => setCategoryFilter('all')}
                                style={{
                                    border: '1px solid',
                                    borderColor: categoryFilter === 'all' ? '#C4975A' : '#E8E2D9',
                                    backgroundColor: categoryFilter === 'all' ? '#FDF3E7' : '#FFFFFF',
                                    color: categoryFilter === 'all' ? '#C4975A' : '#6E5D4F',
                                    fontSize: '0.78rem',
                                    fontWeight: categoryFilter === 'all' ? 700 : 500,
                                    padding: '0.35rem 0.65rem',
                                    borderRadius: '7px',
                                    cursor: 'pointer',
                                }}
                            >
                                All
                            </button>
                            {CATEGORY_OPTIONS.map((cat) => (
                                <button
                                    key={cat.key}
                                    type="button"
                                    onClick={() => setCategoryFilter(cat.key)}
                                    style={{
                                        border: '1px solid',
                                        borderColor: categoryFilter === cat.key ? '#C4975A' : '#E8E2D9',
                                        backgroundColor: categoryFilter === cat.key ? '#FDF3E7' : '#FFFFFF',
                                        color: categoryFilter === cat.key ? '#C4975A' : '#6E5D4F',
                                        fontSize: '0.78rem',
                                        fontWeight: categoryFilter === cat.key ? 700 : 500,
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '7px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Visibility Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Visibility:
                        </span>
                        <select
                            value={visibilityFilter}
                            onChange={(e) => setVisibilityFilter(e.target.value as any)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '7px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="all">All Designs</option>
                            <option value="visible">Visible on Site</option>
                            <option value="hidden">Hidden / Draft</option>
                        </select>
                    </div>

                    {/* Featured Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase' }}>
                            Featured:
                        </span>
                        <select
                            value={featuredFilter}
                            onChange={(e) => setFeaturedFilter(e.target.value as any)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '7px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="all">All</option>
                            <option value="featured">Featured on Homepage</option>
                        </select>
                    </div>

                    {/* Reset button */}
                    {(searchQuery || categoryFilter !== 'all' || visibilityFilter !== 'all' || featuredFilter !== 'all' || sortBy !== 'custom') && (
                        <button
                            type="button"
                            onClick={resetFilters}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#DC2626',
                                fontSize: '0.78rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textDecoration: 'underline',
                                marginLeft: 'auto',
                            }}
                        >
                            Reset filters
                        </button>
                    )}
                </div>
            </div>

            {/* ─── Drag to Reorder Notice Banner ────────────────────────────────────── */}
            {sortBy === 'custom' && (
                <div
                    style={{
                        backgroundColor: '#FFFDF9',
                        border: '1px solid #EAD8C3',
                        borderRadius: '10px',
                        padding: '0.65rem 1rem',
                        fontSize: '0.8rem',
                        color: '#8A7A6E',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <IconGripVertical />
                        <span>
                            <strong>Drag to Reorder:</strong> Grab cards by their drag handle to re-sequence. This sequence controls the public storefront presentation order.
                        </span>
                    </div>
                    {hasUnsavedOrder && (
                        <span style={{ color: '#C4975A', fontWeight: 700 }}>
                            ● Unsaved display order changes
                        </span>
                    )}
                </div>
            )}

            {/* ─── Design Cards Grid (3 or 4 Columns) ───────────────────────────────── */}
            {filteredDesigns.length > 0 ? (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.25rem',
                    }}
                >
                    {filteredDesigns.map((design, index) => {
                        const coverPhoto = design.photos.find((p) => p.isCover)?.url || design.photos[0]?.url || '/images/design-agbada.jpg'
                        const isMenuOpen = activeMenuId === design.id

                        return (
                            <div
                                key={design.id}
                                draggable={sortBy === 'custom'}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, index)}
                                onClick={() => router.push(`/admin/catalogue/${design.id}`)}
                                style={{
                                    backgroundColor: '#FFFFFF',
                                    borderRadius: '14px',
                                    border: '1px solid #EDE8E1',
                                    overflow: 'hidden',
                                    boxShadow: '0 2px 5px rgba(0,0,0,0.03)',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                    opacity: design.isVisible ? 1 : 0.72,
                                }}
                            >
                                {/* Photo Container */}
                                <div style={{ height: '220px', position: 'relative', backgroundColor: '#F3EFE9' }}>
                                    <Image
                                        src={coverPhoto}
                                        alt={design.contentEN.name}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />

                                    {/* Drag Handle Overlay */}
                                    {sortBy === 'custom' && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '10px',
                                                left: '10px',
                                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                                borderRadius: '6px',
                                                padding: '0.25rem 0.35rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                                cursor: 'grab',
                                            }}
                                            title="Drag to reorder card sequence"
                                        >
                                            <IconGripVertical />
                                            <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1C0F07', marginLeft: '0.15rem' }}>
                                                #{design.sortOrder}
                                            </span>
                                        </div>
                                    )}

                                    {/* Featured Star Button */}
                                    <button
                                        type="button"
                                        title={design.isFeatured ? 'Featured on homepage (click to remove)' : 'Click to feature on homepage'}
                                        onClick={(e) => handleToggleFeatured(e, design.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '10px',
                                            right: '10px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                            borderRadius: '9999px',
                                            width: '32px',
                                            height: '32px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            border: 'none',
                                            cursor: 'pointer',
                                            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                                        }}
                                    >
                                        <IconStar filled={design.isFeatured} />
                                    </button>

                                    {/* Category Pill */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: '10px',
                                            left: '10px',
                                            backgroundColor: '#1C0F07',
                                            color: '#FFFFFF',
                                            fontSize: '0.7rem',
                                            fontWeight: 700,
                                            padding: '0.25rem 0.55rem',
                                            borderRadius: '6px',
                                            letterSpacing: '0.02em',
                                        }}
                                    >
                                        {design.categoryLabel}
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                                    {/* Name & Three Dot Menu */}
                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                                        <div>
                                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C0F07', lineHeight: 1.3 }}>
                                                {design.contentEN.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.15rem' }}>
                                                {design.turnaroundDays} days turnaround
                                            </div>
                                        </div>

                                        {/* Three Dot Action Menu */}
                                        <div style={{ position: 'relative' }}>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setActiveMenuId(isMenuOpen ? null : design.id)
                                                }}
                                                style={{
                                                    background: 'none',
                                                    border: 'none',
                                                    color: '#8A7A6E',
                                                    cursor: 'pointer',
                                                    padding: '0.25rem',
                                                }}
                                            >
                                                <IconMoreVertical />
                                            </button>

                                            {isMenuOpen && (
                                                <div
                                                    style={{
                                                        position: 'absolute',
                                                        right: 0,
                                                        top: '100%',
                                                        backgroundColor: '#FFFFFF',
                                                        border: '1px solid #EDE8E1',
                                                        borderRadius: '10px',
                                                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                                                        width: '160px',
                                                        zIndex: 30,
                                                        padding: '0.35rem 0',
                                                    }}
                                                >
                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            router.push(`/admin/catalogue/${design.id}`)
                                                        }}
                                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#1C0F07', cursor: 'pointer' }}
                                                    >
                                                        Edit Design
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDuplicate(e, design.id)}
                                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#1C0F07', cursor: 'pointer' }}
                                                    >
                                                        Duplicate Design
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleToggleVisibility(e, design.id)}
                                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#1C0F07', cursor: 'pointer' }}
                                                    >
                                                        {design.isVisible ? 'Hide from Site' : 'Publish to Site'}
                                                    </button>
                                                    <div style={{ height: '1px', backgroundColor: '#F3EFE9', margin: '0.25rem 0' }} />
                                                    <button
                                                        type="button"
                                                        onClick={(e) => handleDelete(e, design.id, design.contentEN.name)}
                                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer', fontWeight: 600 }}
                                                    >
                                                        Delete Design
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Dual Price: ₦ and € */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'baseline',
                                            justifyContent: 'space-between',
                                            backgroundColor: '#FAF7F2',
                                            padding: '0.5rem 0.75rem',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#1C0F07' }}>
                                            ₦{design.pricing.priceNGN.toLocaleString()}
                                        </span>
                                        <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#C4975A' }}>
                                            €{design.pricing.priceEUR}
                                        </span>
                                    </div>

                                    {/* Stats: Orders count & Average Rating */}
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: '#8A7A6E' }}>
                                        <span>{design.stats.totalOrders} bespoke orders</span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#B45309', fontWeight: 700 }}>
                                            <span>★</span>
                                            <span>{design.stats.averageRating}</span>
                                            <span style={{ color: '#A8998C', fontWeight: 400 }}>({design.stats.reviewCount})</span>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div style={{ height: '1px', backgroundColor: '#F3EFE9' }} />

                                    {/* Card Footer: Instant Visibility Switch */}
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingTop: '0.15rem',
                                        }}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <span style={{ fontSize: '0.75rem', color: design.isVisible ? '#166534' : '#6B7280', fontWeight: 700 }}>
                                            {design.isVisible ? '● Visible on Site' : '○ Hidden / Draft'}
                                        </span>

                                        {/* Toggle Switch */}
                                        <button
                                            type="button"
                                            onClick={(e) => handleToggleVisibility(e, design.id)}
                                            style={{
                                                width: '42px',
                                                height: '24px',
                                                borderRadius: '9999px',
                                                backgroundColor: design.isVisible ? '#166534' : '#E5E7EB',
                                                border: 'none',
                                                cursor: 'pointer',
                                                position: 'relative',
                                                transition: 'background-color 0.15s ease',
                                                padding: '2px',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '9999px',
                                                    backgroundColor: '#FFFFFF',
                                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                                    transform: design.isVisible ? 'translateX(18px)' : 'translateX(0px)',
                                                    transition: 'transform 0.15s ease',
                                                }}
                                            />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                /* ─── Empty State ──────────────────────────────────────────────────────── */
                <div
                    style={{
                        padding: '4rem 2rem',
                        textAlign: 'center',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        border: '1px solid #EDE8E1',
                    }}
                >
                    <div
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '9999px',
                            backgroundColor: '#F3EFE9',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#8A7A6E',
                        }}
                    >
                        <IconSearch />
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            No catalogue designs found
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                            Adjust your filters or add a new bespoke design to the collection.
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                        <button
                            type="button"
                            onClick={resetFilters}
                            style={{
                                padding: '0.55rem 1rem',
                                borderRadius: '8px',
                                border: '1px solid #E0D7CB',
                                backgroundColor: '#FAF7F2',
                                color: '#6E5D4F',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            Clear Filters
                        </button>
                        <Link
                            href="/admin/catalogue/new"
                            style={{
                                padding: '0.55rem 1.15rem',
                                borderRadius: '8px',
                                backgroundColor: '#C4975A',
                                color: '#FFFFFF',
                                fontSize: '0.825rem',
                                fontWeight: 700,
                                textDecoration: 'none',
                            }}
                        >
                            + Add New Design
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
