'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    CatalogueDesign,
    CatalogueCategory,
    CATEGORY_OPTIONS,
    DesignPhoto,
    getAllDesigns,
    saveDesign,
} from '@/data/adminCatalogueData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconUploadCloud = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px', flexShrink: 0, color: '#C4975A' }}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
)

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', flexShrink: 0 }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

export default function CreateNewDesignPage() {
    const router = useRouter()

    // Form fields
    const [nameEN, setNameEN] = useState('')
    const [descriptionEN, setDescriptionEN] = useState('')
    const [tagsEN, setTagsEN] = useState<string[]>([])
    const [nameIT, setNameIT] = useState('')
    const [descriptionIT, setDescriptionIT] = useState('')
    const [tagsIT, setTagsIT] = useState<string[]>([])
    const [activeLangTab, setActiveLangTab] = useState<'EN' | 'IT'>('EN')

    // Basic & Pricing
    const [category, setCategory] = useState<CatalogueCategory>('native-wear')
    const [turnaroundDays, setTurnaroundDays] = useState(14)
    const [priceNGN, setPriceNGN] = useState(100000)
    const [priceEUR, setPriceEUR] = useState(60)
    const [pricingNote, setPricingNote] = useState('')

    // Photos
    const [photos, setPhotos] = useState<DesignPhoto[]>([
        { id: 'p-init', url: '/images/design-agbada.jpg', isCover: true, caption: 'Primary design cover photo' },
    ])
    const [draggedPhotoIdx, setDraggedPhotoIdx] = useState<number | null>(null)

    // Fabrics & Colours
    const [fabrics, setFabrics] = useState<string[]>(['Imperial Cashmere Cotton', 'Royal Guinea Brocade'])
    const [fabricInput, setFabricInput] = useState('')
    const [colours, setColours] = useState<Array<{ name: string; hex?: string }>>([
        { name: 'Midnight Black', hex: '#1C1C1C' },
        { name: 'Royal Ivory', hex: '#FAF5EA' },
    ])
    const [colourInput, setColourInput] = useState('')

    // SEO
    const [metaTitleEN, setMetaTitleEN] = useState('')
    const [metaDescriptionEN, setMetaDescriptionEN] = useState('')
    const [slug, setSlug] = useState('')

    // Auto-generate slug from nameEN
    const handleNameChange = (val: string) => {
        setNameEN(val)
        if (!slug || slug === nameEN.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')) {
            setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
        }
    }

    // Fabric tag handler
    const handleAddFabric = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const val = fabricInput.trim()
            if (val && !fabrics.includes(val)) {
                setFabrics([...fabrics, val])
                setFabricInput('')
            }
        }
    }

    const handleRemoveFabric = (item: string) => {
        setFabrics(fabrics.filter((f) => f !== item))
    }

    // Colour tag handler
    const handleAddColour = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            const val = colourInput.trim()
            if (val && !colours.some((c) => c.name.toLowerCase() === val.toLowerCase())) {
                setColours([...colours, { name: val }])
                setColourInput('')
            }
        }
    }

    const handleRemoveColour = (name: string) => {
        setColours(colours.filter((c) => c.name !== name))
    }

    const handleAddMockPhoto = () => {
        const samples = [
            '/images/design-agbada.jpg',
            '/images/design-suit.jpg',
            '/images/design-senator.jpg',
            '/images/design-kaftan.jpg',
            '/images/category-suits.jpg',
            '/images/category-native.jpeg',
        ]
        const randomSrc = samples[Math.floor(Math.random() * samples.length)]
        const newPhoto: DesignPhoto = {
            id: `p-${Date.now()}`,
            url: randomSrc,
            isCover: photos.length === 0,
            caption: 'Atelier gallery preview',
        }
        setPhotos([...photos, newPhoto])
    }

    const handleRemovePhoto = (photoId: string) => {
        if (photos.length <= 1) {
            alert('A design must have at least 1 photo.')
            return
        }
        const updated = photos.filter((p) => p.id !== photoId).map((p, i) => ({
            ...p,
            isCover: i === 0,
        }))
        setPhotos(updated)
    }

    // Submit handler
    const handleSubmit = (publishImmediately: boolean) => {
        if (!nameEN.trim()) {
            alert('Please provide an English name for the design.')
            return
        }

        const newId = `des-${Date.now()}`
        const finalSlug = slug.trim() || nameEN.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `design-${Date.now()}`
        const categoryLabel = CATEGORY_OPTIONS.find((c) => c.key === category)?.label || 'Bespoke'
        const existing = getAllDesigns()

        const newDesign: CatalogueDesign = {
            id: newId,
            slug: finalSlug,
            sortOrder: existing.length + 1,
            category,
            categoryLabel,
            isVisible: publishImmediately,
            isFeatured: false,
            turnaroundDays,
            pricing: {
                priceNGN,
                priceEUR,
                pricingNote,
            },
            photos,
            fabrics,
            colours,
            contentEN: {
                name: nameEN.trim(),
                description: descriptionEN.trim(),
                tags: tagsEN,
            },
            contentIT: {
                name: nameIT.trim() || nameEN.trim(),
                description: descriptionIT.trim() || descriptionEN.trim(),
                tags: tagsIT,
            },
            seo: {
                metaTitleEN: metaTitleEN || `${nameEN} — Bespoke Fashion | CaptainStitches`,
                metaDescriptionEN: metaDescriptionEN || descriptionEN.slice(0, 150),
                metaTitleIT: `${nameIT || nameEN} — Sartoria su Misura | CaptainStitches`,
                metaDescriptionIT: descriptionIT.slice(0, 150) || descriptionEN.slice(0, 150),
            },
            stats: {
                totalOrders: 0,
                averageRating: 0,
                reviewCount: 0,
                dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                popularFabrics: [],
                popularColours: [],
            },
            reviews: [],
        }

        saveDesign(newDesign)
        router.push(`/admin/catalogue/${newId}`)
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                    href="/admin/catalogue"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: '#8A7A6E',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    <IconArrowLeft />
                    <span>Back to Catalogue List</span>
                </Link>

                <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                    New Design Creation Flow
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0F07', margin: 0, letterSpacing: '-0.02em' }}>
                    Add New Design
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                    Introduce a new handcrafted creation to the CaptainStitches public storefront.
                </p>
            </div>

            {/* Form Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 1. Photo Gallery Section */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                1. Design Photography
                            </h2>
                            <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                The first image serves as the primary catalogue card cover.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleAddMockPhoto}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                backgroundColor: '#FAF7F2',
                                border: '1px solid #E0D7CB',
                                borderRadius: '8px',
                                padding: '0.45rem 0.85rem',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                color: '#C4975A',
                                cursor: 'pointer',
                            }}
                        >
                            <IconUploadCloud />
                            <span>+ Upload Image</span>
                        </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.85rem', overflowX: 'auto', paddingBottom: '0.5rem', alignItems: 'center' }}>
                        {photos.map((p, idx) => (
                            <div
                                key={p.id}
                                style={{
                                    width: '120px',
                                    height: '140px',
                                    borderRadius: '10px',
                                    overflow: 'hidden',
                                    position: 'relative',
                                    border: p.isCover ? '2.5px solid #C4975A' : '1px solid #EDE8E1',
                                    flexShrink: 0,
                                }}
                            >
                                <Image src={p.url} alt="Uploaded photo" fill style={{ objectFit: 'cover' }} />
                                {p.isCover && (
                                    <div style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#C4975A', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                                        COVER
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(p.id)}
                                    style={{ position: 'absolute', top: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.6)', color: '#FFFFFF', border: 'none', borderRadius: '9999px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                >
                                    <IconTrash />
                                </button>
                            </div>
                        ))}

                        <div
                            onClick={handleAddMockPhoto}
                            style={{
                                width: '120px',
                                height: '140px',
                                borderRadius: '10px',
                                border: '2px dashed #D5CCA8',
                                backgroundColor: '#FAF7F2',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.35rem',
                                cursor: 'pointer',
                                fontSize: '0.75rem',
                                color: '#8A7A6E',
                                fontWeight: 600,
                                flexShrink: 0,
                            }}
                        >
                            <IconUploadCloud />
                            <span>Add Photo</span>
                        </div>
                    </div>
                </div>

                {/* 2. Basic Details & Category */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1.25rem' }}>
                        2. Classification & Turnaround
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Garment Category *
                            </label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as CatalogueCategory)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            >
                                {CATEGORY_OPTIONS.map((c) => (
                                    <option key={c.key} value={c.key}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Standard Turnaround (Days)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={turnaroundDays}
                                onChange={(e) => setTurnaroundDays(parseInt(e.target.value) || 1)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Independent Pricing (₦ and €) */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1rem' }}>
                        3. Pricing Structure (Independent)
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginBottom: '1rem' }}>
                        <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                Price in Naira (₦ NGN) *
                            </label>
                            <input
                                type="number"
                                step="1000"
                                value={priceNGN}
                                onChange={(e) => setPriceNGN(parseFloat(e.target.value) || 0)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '1.15rem', fontWeight: 800, color: '#1C0F07' }}
                            />
                        </div>

                        <div style={{ backgroundColor: '#FAF7F2', padding: '1rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                Price in Euro (€ EUR) *
                            </label>
                            <input
                                type="number"
                                step="1"
                                value={priceEUR}
                                onChange={(e) => setPriceEUR(parseFloat(e.target.value) || 0)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '1.15rem', fontWeight: 800, color: '#C4975A' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Pricing Context Note
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Price varies with fabric choice — confirm with customer."
                            value={pricingNote}
                            onChange={(e) => setPricingNote(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                        />
                    </div>
                </div>

                {/* 4. Fabrics & Colours */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1rem' }}>
                        4. Fabrics & Colour Options
                    </h2>

                    <div style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Available Fabrics (Type & Press Enter)
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', padding: '0.5rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E0D7CB', alignItems: 'center' }}>
                            {fabrics.map((f) => (
                                <span key={f} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAD8C3', color: '#1C0F07', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <span>{f}</span>
                                    <button type="button" onClick={() => handleRemoveFabric(f)} style={{ border: 'none', background: 'transparent', color: '#A8998C', cursor: 'pointer', padding: 0 }}>✕</button>
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder="Type fabric and press Enter..."
                                value={fabricInput}
                                onChange={(e) => setFabricInput(e.target.value)}
                                onKeyDown={handleAddFabric}
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.825rem', flex: '1 1 180px', padding: '0.25rem' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Available Colours (Type & Press Enter)
                        </label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', padding: '0.5rem', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E0D7CB', alignItems: 'center' }}>
                            {colours.map((c) => (
                                <span key={c.name} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAD8C3', color: '#1C0F07', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                                    <span>{c.name}</span>
                                    <button type="button" onClick={() => handleRemoveColour(c.name)} style={{ border: 'none', background: 'transparent', color: '#A8998C', cursor: 'pointer', padding: 0 }}>✕</button>
                                </span>
                            ))}
                            <input
                                type="text"
                                placeholder="Type colour and press Enter..."
                                value={colourInput}
                                onChange={(e) => setColourInput(e.target.value)}
                                onKeyDown={handleAddColour}
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.825rem', flex: '1 1 180px', padding: '0.25rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* 5. Bilingual Content (EN / IT) */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            5. Editorial Content
                        </h2>
                        <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#FAF7F2', padding: '0.25rem', borderRadius: '8px', border: '1px solid #E5DFD7' }}>
                            <button
                                type="button"
                                onClick={() => setActiveLangTab('EN')}
                                style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: activeLangTab === 'EN' ? '#C4975A' : 'transparent',
                                    color: activeLangTab === 'EN' ? '#FFFFFF' : '#6E5D4F',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                }}
                            >
                                🇬🇧 English
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveLangTab('IT')}
                                style={{
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    border: 'none',
                                    backgroundColor: activeLangTab === 'IT' ? '#C4975A' : 'transparent',
                                    color: activeLangTab === 'IT' ? '#FFFFFF' : '#6E5D4F',
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    cursor: 'pointer',
                                }}
                            >
                                🇮🇹 Italian
                            </button>
                        </div>
                    </div>

                    {activeLangTab === 'EN' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Design Title (English) *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Royal Emperor Agbada"
                                    value={nameEN}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.9rem', fontWeight: 700 }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Story & Craftsmanship Description (English)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe the silhouette, cultural heritage, and occasion recommendations..."
                                    value={descriptionEN}
                                    onChange={(e) => setDescriptionEN(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', lineHeight: 1.5 }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Titolo del Modello (Italiano)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Lascia vuoto per usare il titolo inglese"
                                    value={nameIT}
                                    onChange={(e) => setNameIT(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.9rem', fontWeight: 700 }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Descrizione Sartoriale (Italiano)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Descrizione in lingua italiana per clienti a Milano e in Europa..."
                                    value={descriptionIT}
                                    onChange={(e) => setDescriptionIT(e.target.value)}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', lineHeight: 1.5 }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* 6. SEO & Slug */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1rem' }}>
                        6. Search Engine Optimization (SEO)
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                URL Slug
                            </label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', fontFamily: 'monospace' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Meta Title
                            </label>
                            <input
                                type="text"
                                placeholder={`${nameEN || 'Design'} | CaptainStitches`}
                                value={metaTitleEN}
                                onChange={(e) => setMetaTitleEN(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        <div style={{ gridColumn: 'span 2' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Meta Description
                            </label>
                            <textarea
                                rows={2}
                                value={metaDescriptionEN}
                                onChange={(e) => setMetaDescriptionEN(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>
                </div>

                {/* ─── Actions Bar ──────────────────────────────────────────────────────── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '1rem',
                        marginTop: '0.5rem',
                    }}
                >
                    <Link
                        href="/admin/catalogue"
                        style={{
                            padding: '0.65rem 1.25rem',
                            borderRadius: '8px',
                            border: '1px solid #E0D7CB',
                            backgroundColor: '#FAF7F2',
                            color: '#6E5D4F',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}
                    >
                        Cancel
                    </Link>

                    <button
                        type="button"
                        onClick={() => handleSubmit(false)}
                        style={{
                            padding: '0.65rem 1.35rem',
                            borderRadius: '8px',
                            border: '1px solid #C4975A',
                            backgroundColor: '#FDF3E7',
                            color: '#C4975A',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                        }}
                    >
                        Save as Private Draft
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSubmit(true)}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.45rem',
                            padding: '0.65rem 1.5rem',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            fontSize: '0.875rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                        }}
                    >
                        <IconCheck />
                        <span>Publish to Storefront</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
