'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    CatalogueCategory,
    CATEGORY_OPTIONS,
    DesignPhoto,
} from '@/data/adminCatalogueData'
import { createDesignAction } from '@/lib/actions/catalogue'
import { uploadMediaAction } from '@/lib/actions/upload'
import { AdminColourInput } from '@/components/admin/AdminColourInput'
import { serializeColour, ColourOption } from '@/lib/utils/colours'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconUploadCloud = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', flexShrink: 0, color: '#C4975A' }}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
)

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', flexShrink: 0 }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)

const SAMPLE_DESIGNS = [
    { label: 'Grand Agbada', url: '/images/design-agbada.jpg', caption: 'Grand Agbada Studio Look' },
    { label: 'Classic Senator', url: '/images/design-senator.jpg', caption: 'Senator Bespoke Fit' },
    { label: 'Italian 3-Piece', url: '/images/design-suit.jpg', caption: 'Tailored Italian 3-Piece' },
    { label: 'Kaftan Royale', url: '/images/design-kaftan.jpg', caption: 'Kaftan Royale Geometric Embroidery' },
    { label: 'Executive Suits', url: '/images/category-suits.jpg', caption: 'Double-Breasted Wool Suite' },
    { label: 'Linen Casual', url: '/images/category-casual.jpg', caption: 'Bespoke Linen Lounge Set' },
    { label: 'Native Brocade', url: '/images/category-native.jpeg', caption: 'Embroidered Guinea Brocade' },
    { label: 'Editorial Tailoring (Unsplash)', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80', caption: 'Editorial Luxury Suit Portrait' },
]

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
    const [priceNGN, setPriceNGN] = useState(120000)
    const [priceEUR, setPriceEUR] = useState(68)
    const [pricingNote, setPricingNote] = useState('')

    // Image URL inputs & Photos
    const [photos, setPhotos] = useState<DesignPhoto[]>([
        { id: 'p-init', url: '/images/design-agbada.jpg', isCover: true, caption: 'Primary design cover photo' },
    ])
    const [imageUrlInput, setImageUrlInput] = useState('')
    const [imageCaptionInput, setImageCaptionInput] = useState('')
    const [imageAsCover, setImageAsCover] = useState(false)
    const [photoError, setPhotoError] = useState<string | null>(null)
    const [isUploadingFile, setIsUploadingFile] = useState(false)

    // Fabrics & Colours
    const [fabrics, setFabrics] = useState<string[]>(['Imperial Cashmere Cotton', 'Royal Guinea Brocade'])
    const [fabricInput, setFabricInput] = useState('')
    const [colours, setColours] = useState<ColourOption[]>([
        { name: 'Midnight Black', hex: '#1C1C1C' },
        { name: 'Royal Ivory', hex: '#FAF5EA' },
    ])

    // SEO
    const [metaTitleEN, setMetaTitleEN] = useState('')
    const [metaDescriptionEN, setMetaDescriptionEN] = useState('')
    const [slug, setSlug] = useState('')

    // Submission states
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

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

    // Image URL Add Handler
    const handleAddPhotoUrl = (urlOverride?: string, captionOverride?: string) => {
        setPhotoError(null)
        const targetUrl = (urlOverride || imageUrlInput).trim()
        const targetCaption = (captionOverride || imageCaptionInput).trim()

        if (!targetUrl) {
            setPhotoError('Please enter an image URL.')
            return
        }

        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('/')) {
            setPhotoError('Image URL must begin with https://, http://, or / (for local assets).')
            return
        }

        const newPhoto: DesignPhoto = {
            id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            url: targetUrl,
            isCover: imageAsCover || photos.length === 0,
            caption: targetCaption || undefined,
        }

        if (newPhoto.isCover) {
            setPhotos((prev) => [newPhoto, ...prev.map((p) => ({ ...p, isCover: false }))])
        } else {
            setPhotos((prev) => [...prev, newPhoto])
        }

        if (!urlOverride) {
            setImageUrlInput('')
            setImageCaptionInput('')
            setImageAsCover(false)
        }
    }

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        const file = e.target.files[0]
        setIsUploadingFile(true)
        setPhotoError(null)

        try {
            const formData = new FormData()
            formData.append('file', file)
            const res = await uploadMediaAction(formData, 'catalogue-products')

            if (res.success && res.url) {
                const newPhoto: DesignPhoto = {
                    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                    url: res.url,
                    isCover: imageAsCover || photos.length === 0,
                    caption: file.name.replace(/\.[^/.]+$/, ''),
                }

                if (newPhoto.isCover) {
                    setPhotos((prev) => [newPhoto, ...prev.map((p) => ({ ...p, isCover: false }))])
                } else {
                    setPhotos((prev) => [...prev, newPhoto])
                }
            } else {
                setPhotoError(res.error || 'Failed to upload photo to Cloudinary')
            }
        } catch {
            setPhotoError('Error uploading file to Cloudinary')
        } finally {
            setIsUploadingFile(false)
            e.target.value = ''
        }
    }

    const handleSetCover = (photoId: string) => {
        setPhotos((prev) =>
            prev.map((p) => ({
                ...p,
                isCover: p.id === photoId,
            }))
        )
    }

    const handleRemovePhoto = (photoId: string) => {
        if (photos.length <= 1) {
            setPhotoError('A design must have at least 1 photo for lookbook display.')
            return
        }
        const remaining = photos.filter((p) => p.id !== photoId)
        // If we removed the cover, mark the first one as cover
        if (!remaining.some((p) => p.isCover)) {
            remaining[0].isCover = true
        }
        setPhotos(remaining)
    }

    // Submit handler via Server Action
    const handleSubmit = async (publishImmediately: boolean) => {
        setSubmitError(null)

        if (!nameEN.trim()) {
            setSubmitError('Please provide an English name for the design.')
            return
        }

        if (priceNGN <= 0 || priceEUR <= 0) {
            setSubmitError('Please specify valid pricing in both NGN and EUR.')
            return
        }

        if (photos.length === 0) {
            setSubmitError('Please add at least 1 image URL for the design lookbook.')
            return
        }

        setIsSubmitting(true)

        try {
            const finalSlug = slug.trim() || nameEN.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `design-${Date.now()}`

            const result = await createDesignAction({
                slug: finalSlug,
                category,
                turnaroundDays,
                priceNGN,
                priceEUR,
                pricingNote: pricingNote.trim() || undefined,
                nameEN: nameEN.trim(),
                descriptionEN: descriptionEN.trim(),
                fabricOptionsEN: fabrics,
                colourOptionsEN: colours.map((c) => serializeColour(c)),
                metaTitleEN: metaTitleEN.trim() || undefined,
                metaDescEN: metaDescriptionEN.trim() || undefined,
                nameIT: nameIT.trim() || nameEN.trim(),
                descriptionIT: descriptionIT.trim() || descriptionEN.trim(),
                fabricOptionsIT: fabrics,
                colourOptionsIT: colours.map((c) => serializeColour(c)),
                metaTitleIT: nameIT.trim() ? `${nameIT.trim()} — Sartoria su Misura | CaptainStitches` : undefined,
                metaDescIT: descriptionIT.trim() || undefined,
                isVisible: publishImmediately,
                isFeatured: false,
                photos: photos.map((p, idx) => ({
                    url: p.url,
                    altText: p.caption || nameEN.trim(),
                    sortOrder: idx,
                    isPrimary: p.isCover ?? (idx === 0),
                })),
            })

            if (!result.success) {
                setSubmitError(result.error || 'Failed to save design to database.')
                setIsSubmitting(false)
                return
            }

            // Successfully saved in database! Redirect to newly created design detail or catalogue
            router.push(`/admin/catalogue/${result.designId}`)
        } catch (err: any) {
            console.error('Submission error:', err)
            setSubmitError(err.message || 'An unexpected error occurred while saving.')
            setIsSubmitting(false)
        }
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
                    New Design Creation Flow · PostgreSQL & Prisma Connected
                </div>
            </div>

            {/* Header */}
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0F07', margin: 0, letterSpacing: '-0.02em' }}>
                    Add New Design
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                    Introduce a handcrafted bespoke piece to the catalogue database and CaptainStitches public lookbook.
                </p>
            </div>

            {/* Error Banner */}
            {submitError && (
                <div
                    style={{
                        backgroundColor: '#FDE8E8',
                        border: '1px solid #F8B4B4',
                        color: '#9B1C1C',
                        padding: '0.875rem 1.25rem',
                        borderRadius: '10px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <span><strong>Creation Error:</strong> {submitError}</span>
                    <button
                        type="button"
                        onClick={() => setSubmitError(null)}
                        style={{ background: 'none', border: 'none', color: '#9B1C1C', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        ✕
                    </button>
                </div>
            )}

            {/* Form Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 1. Photo Gallery Section with Image URLs */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                1. Design Photography (Image URLs)
                            </h2>
                            <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                Add direct image URLs from Unsplash, cloud storage, or studio photography. The cover photo appears on storefront grids.
                            </p>
                        </div>
                    </div>

                    {/* Image URL Add Input Box */}
                    <div
                        style={{
                            backgroundColor: '#FAF7F2',
                            borderRadius: '12px',
                            border: '1px solid #EAE3D9',
                            padding: '1rem',
                            marginBottom: '1.25rem',
                        }}
                    >
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr auto', gap: '0.75rem', alignItems: 'flex-end' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Image URL *
                                </label>
                                <input
                                    type="text"
                                    placeholder="https://images.unsplash.com/... or /images/design-suit.jpg"
                                    value={imageUrlInput}
                                    onChange={(e) => {
                                        setImageUrlInput(e.target.value)
                                        setPhotoError(null)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddPhotoUrl()
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.55rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1C9BE',
                                        backgroundColor: '#FFFFFF',
                                        fontSize: '0.85rem',
                                        color: '#2B2B2B',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Caption / Description (Optional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Front embroidery close-up"
                                    value={imageCaptionInput}
                                    onChange={(e) => setImageCaptionInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            handleAddPhotoUrl()
                                        }
                                    }}
                                    style={{
                                        width: '100%',
                                        padding: '0.55rem 0.75rem',
                                        borderRadius: '8px',
                                        border: '1px solid #D1C9BE',
                                        backgroundColor: '#FFFFFF',
                                        fontSize: '0.85rem',
                                        color: '#2B2B2B',
                                        outline: 'none',
                                    }}
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleAddPhotoUrl()}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    backgroundColor: '#C4975A',
                                    color: '#FFFFFF',
                                    border: 'none',
                                    borderRadius: '8px',
                                    padding: '0.6rem 1.15rem',
                                    fontSize: '0.825rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 1px 3px rgba(196,151,90,0.3)',
                                }}
                            >
                                <IconPlus />
                                <span>Add Image URL</span>
                            </button>

                            <label
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    backgroundColor: '#FAF7F2',
                                    color: '#C4975A',
                                    border: '1px solid #C4975A',
                                    borderRadius: '8px',
                                    padding: '0.6rem 1.15rem',
                                    fontSize: '0.825rem',
                                    fontWeight: 700,
                                    cursor: isUploadingFile ? 'wait' : 'pointer',
                                    whiteSpace: 'nowrap',
                                    position: 'relative',
                                }}
                            >
                                <input
                                    type="file"
                                    accept="image/*"
                                    disabled={isUploadingFile}
                                    onChange={handleUploadFile}
                                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
                                />
                                {isUploadingFile ? (
                                    <>
                                        <span style={{ width: '12px', height: '12px', border: '2px solid #C4975A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <>
                                        <IconUploadCloud />
                                        <span>Upload File (Cloudinary)</span>
                                    </>
                                )}
                            </label>
                        </div>

                        {/* As Cover Checkbox */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.65rem' }}>
                            <input
                                type="checkbox"
                                id="imageAsCoverCheck"
                                checked={imageAsCover}
                                onChange={(e) => setImageAsCover(e.target.checked)}
                                style={{ accentColor: '#C4975A', cursor: 'pointer' }}
                            />
                            <label htmlFor="imageAsCoverCheck" style={{ fontSize: '0.75rem', color: '#6E5D4F', cursor: 'pointer' }}>
                                Set this image as the primary cover photo
                            </label>
                        </div>

                        {photoError && (
                            <p style={{ fontSize: '0.75rem', color: '#DC2626', margin: '0.5rem 0 0 0' }}>
                                {photoError}
                            </p>
                        )}

                        {/* Quick Presets for Rapid Testing */}
                        <div style={{ marginTop: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid #EAE3D9' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                                Quick Presets (Click to add sample photos):
                            </span>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {SAMPLE_DESIGNS.map((sample) => (
                                    <button
                                        key={sample.label}
                                        type="button"
                                        onClick={() => handleAddPhotoUrl(sample.url, sample.caption)}
                                        style={{
                                            fontSize: '0.72rem',
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #D1C9BE',
                                            borderRadius: '6px',
                                            padding: '0.25rem 0.6rem',
                                            color: '#2B2B2B',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                        }}
                                    >
                                        + {sample.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Active Photos Gallery Strip */}
                    <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '0.75rem', alignItems: 'flex-start' }}>
                        {photos.map((p, idx) => (
                            <div
                                key={p.id}
                                style={{
                                    width: '140px',
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: p.isCover ? '2.5px solid #C4975A' : '1px solid #EDE8E1',
                                    backgroundColor: '#FAF7F2',
                                    flexShrink: 0,
                                    position: 'relative',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                }}
                            >
                                <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                                    <Image
                                        src={p.url}
                                        alt={p.caption || 'Design photo'}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        unoptimized={p.url.startsWith('http')}
                                    />
                                    {p.isCover && (
                                        <div style={{ position: 'absolute', top: '6px', left: '6px', backgroundColor: '#C4975A', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                                            COVER
                                        </div>
                                    )}
                                    <button
                                        type="button"
                                        title="Remove photo"
                                        onClick={() => handleRemovePhoto(p.id)}
                                        style={{ position: 'absolute', top: '6px', right: '6px', backgroundColor: 'rgba(0,0,0,0.65)', color: '#FFFFFF', border: 'none', borderRadius: '9999px', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                                    >
                                        <IconTrash />
                                    </button>
                                </div>

                                <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                    <p style={{ fontSize: '0.72rem', color: '#6E5D4F', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {p.caption || `Photo ${idx + 1}`}
                                    </p>
                                    {!p.isCover && (
                                        <button
                                            type="button"
                                            onClick={() => handleSetCover(p.id)}
                                            style={{
                                                fontSize: '0.68rem',
                                                color: '#C4975A',
                                                border: '1px solid #E0D7CB',
                                                backgroundColor: '#FFFFFF',
                                                borderRadius: '4px',
                                                padding: '0.2rem 0.4rem',
                                                cursor: 'pointer',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Set as Cover
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
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
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
                            >
                                {CATEGORY_OPTIONS.map((c) => (
                                    <option key={c.key} value={c.key}>{c.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Standard Turnaround (Days) *
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={turnaroundDays}
                                onChange={(e) => setTurnaroundDays(parseInt(e.target.value) || 1)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
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
                        3. Dual-Currency Pricing
                    </h2>
                    <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: '0 0 1rem 0' }}>
                        Set market-tailored prices for patrons in Nigeria (NGN) and Europe / Italy (EUR).
                    </p>

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
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '1.15rem', fontWeight: 800, color: '#2B2B2B', backgroundColor: '#FFFFFF' }}
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
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '1.15rem', fontWeight: 800, color: '#2B2B2B', backgroundColor: '#FFFFFF' }}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                            Pricing Context Note (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Price includes standard bespoke embroidery; luxury lace carries surcharge."
                            value={pricingNote}
                            onChange={(e) => setPricingNote(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
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
                                <span key={f} style={{ backgroundColor: '#FFFFFF', border: '1px solid #EAD8C3', color: '#2B2B2B', fontSize: '0.8rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
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
                                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.825rem', flex: '1 1 180px', padding: '0.25rem', color: '#2B2B2B' }}
                            />
                        </div>
                    </div>

                    <AdminColourInput
                        colours={colours}
                        onChange={(updated) => setColours(updated)}
                    />
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
                            5. Content & Descriptions
                        </h2>
                        <div style={{ display: 'flex', backgroundColor: '#FAF7F2', padding: '0.25rem', borderRadius: '8px', border: '1px solid #EAE3D9' }}>
                            <button
                                type="button"
                                onClick={() => setActiveLangTab('EN')}
                                style={{
                                    border: 'none',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    backgroundColor: activeLangTab === 'EN' ? '#FFFFFF' : 'transparent',
                                    color: activeLangTab === 'EN' ? '#1C0F07' : '#8A7A6E',
                                    boxShadow: activeLangTab === 'EN' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                }}
                            >
                                English (Primary)
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveLangTab('IT')}
                                style={{
                                    border: 'none',
                                    padding: '0.35rem 0.75rem',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    backgroundColor: activeLangTab === 'IT' ? '#FFFFFF' : 'transparent',
                                    color: activeLangTab === 'IT' ? '#1C0F07' : '#8A7A6E',
                                    boxShadow: activeLangTab === 'IT' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                                }}
                            >
                                Italiano (Italian)
                            </button>
                        </div>
                    </div>

                    {activeLangTab === 'EN' ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Design Title (English) *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Presidential Embroidered Agbada"
                                    value={nameEN}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.95rem', fontWeight: 600, color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Story & Description (English)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe the craftsmanship, silhouette, and occasion suitability..."
                                    value={descriptionEN}
                                    onChange={(e) => setDescriptionEN(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
                                />
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Titolo del Design (Italiano)
                                </label>
                                <input
                                    type="text"
                                    placeholder={nameEN || 'es. Abito Tradizionale Agbada Reale'}
                                    value={nameIT}
                                    onChange={(e) => setNameIT(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.95rem', fontWeight: 600, color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Descrizione e Sartoria (Italiano)
                                </label>
                                <textarea
                                    rows={4}
                                    placeholder="Descrivi i dettagli sartoriali per i clienti italiani..."
                                    value={descriptionIT}
                                    onChange={(e) => setDescriptionIT(e.target.value)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
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
                    <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0, marginBottom: '1.25rem' }}>
                        6. Storefront URL & Search Optimization
                    </h2>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                URL Slug (Auto-generated from Title)
                            </label>
                            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#FAF7F2', borderRadius: '8px', border: '1px solid #E0D7CB', overflow: 'hidden' }}>
                                <span style={{ padding: '0.65rem 0.75rem', fontSize: '0.8rem', color: '#8A7A6E', borderRight: '1px solid #E0D7CB', backgroundColor: '#F5EFE6' }}>
                                    captainstitches.com/catalogue/
                                </span>
                                <input
                                    type="text"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                                    style={{ flex: 1, padding: '0.65rem', border: 'none', background: 'transparent', fontSize: '0.85rem', outline: 'none', color: '#2B2B2B', fontWeight: 600 }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Meta Title (Browser & Search Snippet)
                            </label>
                            <input
                                type="text"
                                placeholder={`${nameEN || 'Design Title'} — Bespoke Fashion | CaptainStitches`}
                                value={metaTitleEN}
                                onChange={(e) => setMetaTitleEN(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Meta Description
                            </label>
                            <textarea
                                rows={2}
                                value={metaDescriptionEN}
                                onChange={(e) => setMetaDescriptionEN(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', color: '#2B2B2B', backgroundColor: '#FAF7F2' }}
                            />
                        </div>
                    </div>
                </div>

                {/* Actions Bar */}
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
                        disabled={isSubmitting}
                        onClick={() => handleSubmit(false)}
                        style={{
                            padding: '0.65rem 1.35rem',
                            borderRadius: '8px',
                            border: '1px solid #C4975A',
                            backgroundColor: '#FDF3E7',
                            color: '#C4975A',
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.6 : 1,
                        }}
                    >
                        {isSubmitting ? 'Saving...' : 'Save as Private Draft'}
                    </button>

                    <button
                        type="button"
                        disabled={isSubmitting}
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
                            cursor: isSubmitting ? 'not-allowed' : 'pointer',
                            opacity: isSubmitting ? 0.6 : 1,
                            boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                        }}
                    >
                        <IconCheck />
                        <span>{isSubmitting ? 'Saving to Database...' : 'Publish to Storefront'}</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
