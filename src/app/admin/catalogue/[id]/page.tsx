'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import {
    CatalogueDesign,
    CatalogueCategory,
    CATEGORY_OPTIONS,
    DesignPhoto,
} from '@/data/adminCatalogueData'
import {
    getDesignByIdAction,
    updateDesignAction,
    deleteDesignAction,
    createDesignAction,
} from '@/lib/actions/catalogue'
import { uploadMediaAction } from '@/lib/actions/upload'
import { AdminColourInput } from '@/components/admin/AdminColourInput'
import { serializeColour, ColourOption } from '@/lib/utils/colours'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconExternalLink = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

const IconUploadCloud = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px', flexShrink: 0, color: '#C4975A' }}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
)

const IconMoreVertical = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>
)

const IconStar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
)

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', flexShrink: 0 }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
)

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
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

export default function DesignDetailEditPage() {
    const params = useParams()
    const router = useRouter()
    const designId = params?.id as string

    const [design, setDesign] = useState<CatalogueDesign | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [toastMessage, setToastMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)

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
    const [isVisible, setIsVisible] = useState(true)
    const [isFeatured, setIsFeatured] = useState(false)
    const [sortOrder, setSortOrder] = useState(1)
    const [priceNGN, setPriceNGN] = useState(120000)
    const [priceEUR, setPriceEUR] = useState(68)
    const [pricingNote, setPricingNote] = useState('')

    // Photos
    const [photos, setPhotos] = useState<DesignPhoto[]>([])
    const [previewPhoto, setPreviewPhoto] = useState<string | null>(null)
    const [draggedPhotoIdx, setDraggedPhotoIdx] = useState<number | null>(null)
    const [imageUrlInput, setImageUrlInput] = useState('')
    const [imageCaptionInput, setImageCaptionInput] = useState('')
    const [imageAsCover, setImageAsCover] = useState(false)
    const [photoError, setPhotoError] = useState<string | null>(null)
    const [isUploadingFile, setIsUploadingFile] = useState(false)
    const imageUrlInputRef = useRef<HTMLInputElement>(null)

    // Fabrics & Colours
    const [fabrics, setFabrics] = useState<string[]>([])
    const [fabricInput, setFabricInput] = useState('')
    const [colours, setColours] = useState<ColourOption[]>([])

    // SEO
    const [metaTitleEN, setMetaTitleEN] = useState('')
    const [metaDescriptionEN, setMetaDescriptionEN] = useState('')
    const [metaTitleIT, setMetaTitleIT] = useState('')
    const [metaDescriptionIT, setMetaDescriptionIT] = useState('')
    const [slug, setSlug] = useState('')

    const populateDesign = (found: CatalogueDesign) => {
        setDesign(found)
        setNameEN(found.contentEN.name)
        setDescriptionEN(found.contentEN.description)
        setTagsEN([...found.contentEN.tags])
        setNameIT(found.contentIT.name)
        setDescriptionIT(found.contentIT.description)
        setTagsIT([...found.contentIT.tags])
        setCategory(found.category)
        setTurnaroundDays(found.turnaroundDays)
        setIsVisible(found.isVisible)
        setIsFeatured(found.isFeatured)
        setSortOrder(found.sortOrder)
        setPriceNGN(found.pricing.priceNGN)
        setPriceEUR(found.pricing.priceEUR)
        setPricingNote(found.pricing.pricingNote || '')
        setPhotos([...found.photos])
        setFabrics([...found.fabrics])
        setColours(found.colours.map((c) => ({ name: c.name, hex: c.hex || '#1C1C1C' })))
        setMetaTitleEN(found.seo.metaTitleEN)
        setMetaDescriptionEN(found.seo.metaDescriptionEN)
        setMetaTitleIT(found.seo.metaTitleIT)
        setMetaDescriptionIT(found.seo.metaDescriptionIT)
        setSlug(found.slug)
    }

    // Load design from database
    useEffect(() => {
        let isMounted = true
        const load = async () => {
            setIsLoading(true)
            try {
                const res = await getDesignByIdAction(designId)
                if (res.success && res.design) {
                    if (isMounted) populateDesign(res.design)
                }
            } finally {
                if (isMounted) setIsLoading(false)
            }
        }
        load()
        return () => {
            isMounted = false
        }
    }, [designId])

    const showToast = (msg: string) => {
        setToastMessage(msg)
        setTimeout(() => setToastMessage(null), 3000)
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

    // Photo reordering (drag & drop)
    const handlePhotoDragStart = (idx: number) => {
        setDraggedPhotoIdx(idx)
    }

    const handlePhotoDrop = (targetIdx: number) => {
        if (draggedPhotoIdx === null || draggedPhotoIdx === targetIdx) return
        const updated = [...photos]
        const [moved] = updated.splice(draggedPhotoIdx, 1)
        updated.splice(targetIdx, 0, moved)

        // Ensure index 0 is cover photo
        const reIndexed = updated.map((p, i) => ({
            ...p,
            isCover: i === 0,
        }))
        setPhotos(reIndexed)
        setDraggedPhotoIdx(null)
        showToast('Photo order updated. First photo set as catalogue cover.')
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

    const handleAddPhotoUrl = (urlOverride?: string, captionOverride?: string) => {
        setPhotoError(null)
        const targetUrl = (urlOverride || imageUrlInput).trim()
        const targetCaption = (captionOverride || imageCaptionInput).trim()

        if (!targetUrl) {
            setPhotoError('Please enter an image URL.')
            return
        }

        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('/') && !targetUrl.startsWith('data:image/')) {
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
        showToast('Image URL added to gallery')
    }

    const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setPhotoError(null)
        setIsUploadingFile(true)

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
                showToast('Photo uploaded to Cloudinary successfully')
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

    // Save all changes to database
    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!design) return

        setIsSaving(true)
        const categoryLabel = CATEGORY_OPTIONS.find((c) => c.key === category)?.label || 'Bespoke'

        const updated: CatalogueDesign = {
            ...design,
            slug: slug.trim() || design.slug,
            category,
            categoryLabel,
            isVisible,
            isFeatured,
            sortOrder,
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
                description: descriptionEN,
                tags: tagsEN,
            },
            contentIT: {
                name: nameIT.trim(),
                description: descriptionIT,
                tags: tagsIT,
            },
            seo: {
                metaTitleEN,
                metaDescriptionEN,
                metaTitleIT,
                metaDescriptionIT,
            },
            stats: {
                ...design.stats,
                lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            },
        }

        const res = await updateDesignAction(design.id, {
            nameEN: nameEN.trim(),
            descriptionEN,
            fabricOptionsEN: fabrics,
            colourOptionsEN: colours.map((c) => serializeColour(c)),
            nameIT: nameIT.trim(),
            descriptionIT,
            category,
            turnaroundDays,
            priceNGN,
            priceEUR,
            pricingNote: pricingNote.trim(),
            isVisible,
            isFeatured,
            slug: slug.trim() || design.slug,
            photos: photos.map((p, idx) => ({
                url: p.url,
                altText: p.caption || nameEN.trim(),
                sortOrder: idx,
                isPrimary: p.isCover ?? (idx === 0),
            })),
        })

        setIsSaving(false)
        if (res.success) {
            setDesign(updated)
            showToast('All changes saved successfully to database!')
        } else {
            showToast(`Failed to save: ${res.error}`)
        }
    }

    if (isLoading) {
        return (
            <div style={{ padding: '4rem', textAlign: 'center' }}>
                <div
                    className="animate-spin"
                    style={{
                        display: 'inline-block',
                        width: '36px',
                        height: '36px',
                        border: '3px solid #C4975A',
                        borderTopColor: 'transparent',
                        borderRadius: '50%',
                    }}
                />
                <p style={{ marginTop: '1rem', color: '#8C7B6B', fontSize: '0.875rem' }}>Loading design details...</p>
            </div>
        )
    }

    if (!design) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07' }}>Design not found</h2>
                <Link
                    href="/admin/catalogue"
                    style={{
                        display: 'inline-block',
                        marginTop: '1rem',
                        padding: '0.625rem 1.25rem',
                        backgroundColor: '#C4975A',
                        color: '#FFFFFF',
                        borderRadius: '8px',
                        textDecoration: 'none',
                        fontWeight: 600,
                    }}
                >
                    Back to Catalogue
                </Link>
            </div>
        )
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

            {/* ─── Back Nav & Header Bar ──────────────────────────────────────────────── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                        width: 'fit-content',
                    }}
                >
                    <IconArrowLeft />
                    <span>Back to Catalogue List</span>
                </Link>

                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '16px',
                        padding: '1.25rem 1.5rem',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.25rem',
                    }}
                >
                    {/* Left: Title, Category Badge, Visibility */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1C0F07', margin: 0 }}>
                                    {nameEN || design.contentEN.name}
                                </h1>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '6px',
                                        backgroundColor: '#FDF3E7',
                                        color: '#C4975A',
                                        border: '1px solid #EAD8C3',
                                    }}
                                >
                                    {CATEGORY_OPTIONS.find((c) => c.key === category)?.label}
                                </span>
                                <span
                                    style={{
                                        fontSize: '0.75rem',
                                        fontWeight: 700,
                                        padding: '0.2rem 0.6rem',
                                        borderRadius: '6px',
                                        backgroundColor: isVisible ? '#DCFCE7' : '#F3F4F6',
                                        color: isVisible ? '#166534' : '#6B7280',
                                        border: isVisible ? '1px solid #BBF7D0' : '1px solid #E5E7EB',
                                    }}
                                >
                                    {isVisible ? '● Live on Site' : '○ Hidden / Draft'}
                                </span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#8A7A6E', marginTop: '0.25rem' }}>
                                URL: <code style={{ backgroundColor: '#FAF7F2', padding: '0.1rem 0.35rem', borderRadius: '4px' }}>/catalogue/{slug}</code>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* View on site */}
                        <a
                            href={`/catalogue/${slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                padding: '0.55rem 0.95rem',
                                borderRadius: '8px',
                                border: '1px solid #E0D7CB',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                textDecoration: 'none',
                            }}
                        >
                            <span>View on Site</span>
                            <IconExternalLink />
                        </a>

                        {/* Top Save Button */}
                        <button
                            type="button"
                            onClick={handleSaveChanges}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.45rem',
                                backgroundColor: '#C4975A',
                                color: '#FFFFFF',
                                border: 'none',
                                padding: '0.55rem 1.25rem',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                            }}
                        >
                            <IconCheck />
                            <span>Save Changes</span>
                        </button>

                        {/* Three-Dot Menu */}
                        <div style={{ position: 'relative' }}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                style={{
                                    border: '1px solid #E4DDD3',
                                    backgroundColor: '#FAF7F2',
                                    color: '#6E5D4F',
                                    borderRadius: '8px',
                                    padding: '0.55rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <IconMoreVertical />
                            </button>

                            {isMenuOpen && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        right: 0,
                                        top: '110%',
                                        backgroundColor: '#FFFFFF',
                                        border: '1px solid #EDE8E1',
                                        borderRadius: '10px',
                                        boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                                        width: '170px',
                                        zIndex: 30,
                                        padding: '0.35rem 0',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={async (e) => {
                                            setIsMenuOpen(false)
                                            const dupRes = await createDesignAction({
                                                category: design.category,
                                                turnaroundDays: design.turnaroundDays,
                                                priceNGN: design.pricing.priceNGN,
                                                priceEUR: design.pricing.priceEUR,
                                                nameEN: `${design.contentEN.name} (Copy)`,
                                                descriptionEN: design.contentEN.description,
                                                fabricOptionsEN: design.fabrics,
                                                colourOptionsEN: design.colours.map(c => serializeColour(c)),
                                                photos: design.photos.map(p => ({ url: p.url, isPrimary: p.isCover })),
                                            })
                                            if (dupRes.success) {
                                                showToast('Design duplicated to database')
                                                router.push('/admin/catalogue')
                                            } else {
                                                showToast(`Failed to duplicate: ${dupRes.error}`)
                                            }
                                        }}
                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#1C0F07', cursor: 'pointer' }}
                                    >
                                        Duplicate Design
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsMenuOpen(false)
                                            setIsVisible(!isVisible)
                                            showToast(isVisible ? 'Design hidden' : 'Design visible')
                                        }}
                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#1C0F07', cursor: 'pointer' }}
                                    >
                                        {isVisible ? 'Hide from Site' : 'Publish to Site'}
                                    </button>
                                    <div style={{ height: '1px', backgroundColor: '#F3EFE9', margin: '0.25rem 0' }} />
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            setIsMenuOpen(false)
                                            if (confirm(`Are you sure you want to delete ${nameEN} from the database?`)) {
                                                await deleteDesignAction(design.id)
                                                router.push('/admin/catalogue')
                                            }
                                        }}
                                        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '0.5rem 0.85rem', fontSize: '0.8rem', color: '#DC2626', cursor: 'pointer', fontWeight: 600 }}
                                    >
                                        Delete Design
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Two-Column Form Layout: Editor + Stats Sidebar ───────────────────── */}
            <form
                onSubmit={handleSaveChanges}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
                    gap: '1.5rem',
                    alignItems: 'start',
                }}
            >
                {/* ── LEFT COLUMN: Gallery, Basic, Pricing, Fabrics, Content, SEO ─────── */}
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
                                    Photo Gallery ({photos.length} photos)
                                </h2>
                                <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                    Drag thumbnails to reorder. The <strong>first photo</strong> is the primary cover image shown on the catalogue grid.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    imageUrlInputRef.current?.focus()
                                    imageUrlInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                }}
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
                                <IconPlus />
                                <span>+ Add Image via URL</span>
                            </button>
                        </div>

                        {/* Add Image via URL Panel */}
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
                                        ref={imageUrlInputRef}
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
                                        placeholder="e.g. Back view, embroidery detail"
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

                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
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
                                    Quick Presets (Click to add reference photos):
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

                        {/* Thumbnails Horizontal Strip */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '0.85rem',
                                overflowX: 'auto',
                                paddingBottom: '0.5rem',
                                alignItems: 'center',
                            }}
                        >
                            {photos.map((p, idx) => (
                                <div
                                    key={p.id}
                                    draggable
                                    onDragStart={() => handlePhotoDragStart(idx)}
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={() => handlePhotoDrop(idx)}
                                    style={{
                                        width: '120px',
                                        height: '140px',
                                        borderRadius: '10px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        border: p.isCover ? '2.5px solid #C4975A' : '1px solid #EDE8E1',
                                        boxShadow: p.isCover ? '0 2px 8px rgba(196,151,90,0.3)' : 'none',
                                        cursor: 'grab',
                                        flexShrink: 0,
                                        backgroundColor: '#FAF7F2',
                                    }}
                                >
                                    <Image src={p.url} alt="Catalogue photo" fill style={{ objectFit: 'cover' }} unoptimized={p.url.startsWith('http')} onClick={() => setPreviewPhoto(p.url)} />

                                    {/* Cover Badge */}
                                    {p.isCover && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '6px',
                                                left: '6px',
                                                backgroundColor: '#C4975A',
                                                color: '#FFFFFF',
                                                fontSize: '0.65rem',
                                                fontWeight: 800,
                                                padding: '0.15rem 0.4rem',
                                                borderRadius: '4px',
                                            }}
                                        >
                                            COVER
                                        </div>
                                    )}

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        title="Delete photo"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemovePhoto(p.id)
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '6px',
                                            right: '6px',
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            color: '#FFFFFF',
                                            border: 'none',
                                            borderRadius: '9999px',
                                            width: '22px',
                                            height: '22px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        <IconTrash />
                                    </button>
                                </div>
                            ))}

                            {/* Drop area button */}
                            <div
                                onClick={() => {
                                    imageUrlInputRef.current?.focus()
                                    imageUrlInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                }}
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
                                <span>+ Add by URL</span>
                            </div>
                        </div>
                    </div>

                    {/* 2. Basic Details Section */}
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
                            Basic Classification & Availability
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
                                        <option key={c.key} value={c.key}>
                                            {c.label}
                                        </option>
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

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Storefront Visibility
                                </label>
                                <select
                                    value={isVisible ? 'visible' : 'hidden'}
                                    onChange={(e) => setIsVisible(e.target.value === 'visible')}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                >
                                    <option value="visible">Visible on Public Storefront</option>
                                    <option value="hidden">Hidden / Private Draft</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Homepage Featured Placement
                                </label>
                                <select
                                    value={isFeatured ? 'yes' : 'no'}
                                    onChange={(e) => setIsFeatured(e.target.value === 'yes')}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                >
                                    <option value="yes">★ Featured on Homepage Carousel</option>
                                    <option value="no">Standard Catalogue Display</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 3. Independent Pricing Section (₦ and €) */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Independent Multi-Currency Pricing
                            </h2>
                            <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                Prices are set independently per market, not calculated from volatile live FX rates.
                            </p>
                        </div>

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
                                Pricing Note / Transparency Remarks
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Price includes hand embroidery; fabric upgrades quoted upon request."
                                value={pricingNote}
                                onChange={(e) => setPricingNote(e.target.value)}
                                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>
                    </div>

                    {/* 4. Fabric & Colour Tag-Style Options */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        }}
                    >
                        <div style={{ marginBottom: '1rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Customization Options (Fabrics & Colours)
                            </h2>
                            <p style={{ fontSize: '0.78rem', color: '#8A7A6E', margin: 0, marginTop: '0.2rem' }}>
                                Shown on the order placement form as selectable options for patrons.
                            </p>
                        </div>

                        {/* Fabrics Tag Input */}
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Available Fabric Options (Type & Press Enter)
                            </label>
                            <div
                                style={{
                                    display: 'flex',
                                    flexWrap: 'wrap',
                                    gap: '0.45rem',
                                    padding: '0.5rem',
                                    backgroundColor: '#FAF7F2',
                                    borderRadius: '8px',
                                    border: '1px solid #E0D7CB',
                                    alignItems: 'center',
                                }}
                            >
                                {fabrics.map((f) => (
                                    <span
                                        key={f}
                                        style={{
                                            backgroundColor: '#FFFFFF',
                                            border: '1px solid #EAD8C3',
                                            color: '#1C0F07',
                                            fontSize: '0.8rem',
                                            fontWeight: 600,
                                            padding: '0.25rem 0.6rem',
                                            borderRadius: '6px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                        }}
                                    >
                                        <span>{f}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFabric(f)}
                                            style={{ border: 'none', background: 'transparent', color: '#A8998C', cursor: 'pointer', padding: 0, fontSize: '0.85rem' }}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                ))}
                                <input
                                    type="text"
                                    placeholder="Add fabric (e.g. Cotton Brocade)..."
                                    value={fabricInput}
                                    onChange={(e) => setFabricInput(e.target.value)}
                                    onKeyDown={handleAddFabric}
                                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.825rem', flex: '1 1 180px', padding: '0.25rem' }}
                                />
                            </div>
                        </div>

                        <AdminColourInput
                            colours={colours}
                            onChange={(updated) => setColours(updated)}
                        />
                    </div>

                    {/* 5. Bilingual Content Section (EN and IT Tabs) */}
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
                                Editorial Descriptions
                            </h2>

                            {/* EN / IT Language Switcher */}
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
                                        value={nameEN}
                                        onChange={(e) => setNameEN(e.target.value)}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.9rem', fontWeight: 700 }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                        Full Story & Craftsmanship Description (English)
                                    </label>
                                    <textarea
                                        rows={5}
                                        value={descriptionEN}
                                        onChange={(e) => setDescriptionEN(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', lineHeight: 1.5, resize: 'vertical' }}
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
                                        placeholder="Lascia vuoto per usare il nome in inglese"
                                        value={nameIT}
                                        onChange={(e) => setNameIT(e.target.value)}
                                        style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.9rem', fontWeight: 700 }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                        Descrizione Sartoriale & Dettagli (Italiano)
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Descrizione in lingua italiana per i clienti in Italia ed Europa..."
                                        value={descriptionIT}
                                        onChange={(e) => setDescriptionIT(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem', lineHeight: 1.5, resize: 'vertical' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 6. SEO & Google Live Snippet Preview */}
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
                            Search Engine Optimization (SEO)
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
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
                                    value={metaTitleEN}
                                    onChange={(e) => setMetaTitleEN(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Meta Description ({metaDescriptionEN.length}/160 chars)
                                </label>
                                <textarea
                                    rows={2}
                                    value={metaDescriptionEN}
                                    onChange={(e) => setMetaDescriptionEN(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>
                        </div>

                        {/* Google Search Live Preview */}
                        <div>
                            <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                Google Search Snippet Preview
                            </div>
                            <div
                                style={{
                                    backgroundColor: '#FAF7F2',
                                    border: '1px solid #EAE3D9',
                                    borderRadius: '10px',
                                    padding: '1rem',
                                    fontFamily: 'Arial, sans-serif',
                                }}
                            >
                                <div style={{ fontSize: '0.78rem', color: '#202124' }}>
                                    https://captainstitches.com › catalogue › <span style={{ color: '#5f6368' }}>{slug}</span>
                                </div>
                                <div style={{ fontSize: '1.05rem', color: '#1a0dab', fontWeight: 500, marginTop: '0.2rem', cursor: 'pointer' }}>
                                    {metaTitleEN || `${nameEN} — Bespoke Fashion | CaptainStitches`}
                                </div>
                                <div style={{ fontSize: '0.825rem', color: '#4d5156', marginTop: '0.25rem', lineHeight: 1.4 }}>
                                    {metaDescriptionEN || descriptionEN.slice(0, 150) + '...'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT COLUMN: Stats Sidebar ─────────────────────────────────────── */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {/* Stats Card */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            border: '1px solid #EDE8E1',
                            boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <h2 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Design Performance
                        </h2>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                            <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Orders</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.2rem' }}>
                                    {design.stats.totalOrders}
                                </div>
                            </div>

                            <div style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.7rem', color: '#8A7A6E', fontWeight: 700, textTransform: 'uppercase' }}>Rating</div>
                                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#B45309', marginTop: '0.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                                    <span>★</span>
                                    <span>{design.stats.averageRating}</span>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Shortcut */}
                        <Link
                            href={`/admin/catalogue/${design.id}/reviews`}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                backgroundColor: '#FDF3E7',
                                border: '1px solid #EAD8C3',
                                padding: '0.75rem 1rem',
                                borderRadius: '8px',
                                color: '#C4975A',
                                fontWeight: 700,
                                fontSize: '0.8125rem',
                                textDecoration: 'none',
                            }}
                        >
                            <span>View All Reviews ({design.stats.reviewCount})</span>
                            <IconExternalLink />
                        </Link>

                        <div style={{ height: '1px', backgroundColor: '#F3EFE9' }} />

                        <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: '#6E5D4F' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#8A7A6E' }}>Date Created:</span>
                                <strong>{design.stats.dateCreated}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span style={{ color: '#8A7A6E' }}>Last Updated:</span>
                                <strong>{design.stats.lastUpdated}</strong>
                            </div>
                        </div>

                        {/* Common Fabrics */}
                        {design.stats.popularFabrics.length > 0 && (
                            <div>
                                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                                    Most Ordered Fabrics
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                                    {design.stats.popularFabrics.map((fab) => (
                                        <span key={fab} style={{ backgroundColor: '#FAF7F2', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', color: '#3A2B20' }}>
                                            {fab}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Quick Publish / Save Box */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '16px',
                            padding: '1.25rem',
                            border: '1px solid #EDE8E1',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                        }}
                    >
                        <button
                            type="submit"
                            style={{
                                width: '100%',
                                padding: '0.75rem',
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
                            Save All Changes
                        </button>

                        <Link
                            href="/admin/catalogue"
                            style={{
                                width: '100%',
                                padding: '0.65rem',
                                borderRadius: '8px',
                                border: '1px solid #E0D7CB',
                                backgroundColor: '#FAF7F2',
                                color: '#6E5D4F',
                                fontSize: '0.825rem',
                                fontWeight: 600,
                                textAlign: 'center',
                                textDecoration: 'none',
                            }}
                        >
                            Cancel & Return
                        </Link>
                    </div>
                </div>
            </form>

            {/* ─── Full-size Image Preview Modal ────────────────────────────────────── */}
            {previewPhoto && (
                <div
                    onClick={() => setPreviewPhoto(null)}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 150,
                        padding: '2rem',
                    }}
                >
                    <div style={{ position: 'relative', width: '90%', maxWidth: '600px', height: '500px' }}>
                        <Image src={previewPhoto} alt="Full preview" fill style={{ objectFit: 'contain' }} />
                    </div>
                </div>
            )}
        </div>
    )
}
