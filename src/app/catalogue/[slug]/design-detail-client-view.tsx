'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import StarRating from '@/utils/starRating'
import SectionEyebrow from '@/utils/sectionEyeBrow'

export interface DetailDesignData {
  slug: string
  name: string
  category: string
  categoryLabel: string
  priceNGN: number
  priceEUR: number
  turnaround: string
  rating: number
  reviewCount: number
  image: string
  description: string
  fabrics: string[]
  colors: Array<{ name: string; hex?: string }>
  photos: Array<{ id: string; url: string; caption?: string; isCover?: boolean }>
  reviews: Array<{ name: string; rating: number; date: string; comment: string }>
}

export interface RelatedDesignItem {
  slug: string
  name: string
  category: string
  categoryLabel: string
  priceEUR: number
  priceNGN: number
  turnaround: string
  rating: number
  reviewCount: number
  image: string
}

const GALLERY_ZOOM_LEVELS = [
  { label: 'Full Silhouette', style: 'object-cover' },
  { label: 'Detail Zoom', style: 'object-cover scale-[1.3] origin-center' },
  { label: 'Stitch Detail', style: 'object-cover scale-[1.6] origin-top' },
  { label: 'Fit View', style: 'object-cover scale-[1.1] origin-bottom' },
]

export function DesignDetailClientView({
  design,
  relatedDesigns,
}: {
  design: DetailDesignData
  relatedDesigns: RelatedDesignItem[]
}) {
  const [activePhotoIdx, setActivePhotoIdx] = useState(0)
  const [selectedFabric, setSelectedFabric] = useState(design.fabrics[0] || 'Premium Bespoke Fabric')
  const [selectedColor, setSelectedColor] = useState(design.colors[0] || { name: 'Midnight Black', hex: '#1C1C1C' })

  // Use real photos if multiple exist, otherwise gallery zoom styles on the primary photo
  const hasMultiplePhotos = design.photos && design.photos.length > 1
  const currentPhotoUrl = hasMultiplePhotos
    ? design.photos[activePhotoIdx]?.url || design.image
    : design.image

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-950 min-h-screen">
        {/* =========================================================================
            SECTION 1: OBSIDIAN SHOWROOM & CUSTOMIZATION WORKSHOP (#0C0704)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#0C0704] text-cream-100 border-b border-brown-800/60"
          style={{
            paddingTop: 'clamp(6rem, 10vw, 8.5rem)',
            paddingBottom: 'clamp(3rem, 6vw, 5.5rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumbs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#8A7A6E',
                marginBottom: '2rem',
              }}
            >
              <Link href="/" className="hover:text-[#C4975A] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/catalogue" className="hover:text-[#C4975A] transition-colors">
                Lookbook
              </Link>
              <span>/</span>
              <span style={{ color: '#C4975A' }}>{design.name}</span>
            </nav>

            {/* Product Detail Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
              {/* Left Column: Photo Gallery (7 Cols) */}
              <div className="lg:col-span-7 flex flex-col gap-5">
                {/* Main Framed Showcase */}
                <div
                  className="relative overflow-hidden rounded-3xl border border-brown-800/80 bg-brown-900/60 shadow-2xl"
                  style={{ minHeight: '480px', height: 'clamp(480px, 58vh, 660px)' }}
                >
                  <Image
                    src={currentPhotoUrl}
                    alt={design.name}
                    fill
                    unoptimized={currentPhotoUrl.startsWith('http')}
                    className={`transition-all duration-700 ${
                      !hasMultiplePhotos
                        ? GALLERY_ZOOM_LEVELS[activePhotoIdx]?.style || 'object-cover'
                        : 'object-cover'
                    }`}
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    priority
                  />
                  {/* Turnaround Badge */}
                  <div
                    className="absolute top-5 left-5 bg-[#0C0704]/85 backdrop-blur-md border border-[#C4975A]/40 rounded-full"
                    style={{ padding: '6px 16px' }}
                  >
                    <span
                      style={{
                        color: '#E8D4B0',
                        fontSize: '10px',
                        letterSpacing: '0.18em',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                      }}
                    >
                      ⚡ {design.turnaround} Workshop Dispatch
                    </span>
                  </div>

                  {/* Category Pill Tag */}
                  <div
                    className="absolute bottom-5 left-5 bg-[#071A14]/90 backdrop-blur-md border border-[#10B981]/30 rounded-full"
                    style={{ padding: '6px 14px' }}
                  >
                    <span
                      style={{
                        color: '#6EE7B7',
                        fontSize: '10px',
                        letterSpacing: '0.15em',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                      }}
                    >
                      {design.categoryLabel}
                    </span>
                  </div>
                </div>

                {/* Thumbnails Strip */}
                <div className="grid grid-cols-4 gap-3 sm:gap-4">
                  {hasMultiplePhotos
                    ? design.photos.slice(0, 4).map((p, idx) => (
                        <button
                          key={p.id || idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={[
                            'relative h-20 sm:h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2',
                            activePhotoIdx === idx
                              ? 'border-[#C4975A] ring-2 ring-[#C4975A]/40 scale-[1.02]'
                              : 'border-brown-800/80 opacity-70 hover:opacity-100 hover:border-stone-500',
                          ].join(' ')}
                          style={{ boxSizing: 'border-box' }}
                        >
                          <Image
                            src={p.url}
                            alt={`${design.name} - view ${idx + 1}`}
                            fill
                            unoptimized={p.url.startsWith('http')}
                            className="object-cover"
                            sizes="14vw"
                          />
                          <div
                            className="absolute bottom-0 inset-x-0 bg-[#0C0704]/85 px-1 py-0.5 text-[9px] text-[#FAF6F0] tracking-wider uppercase font-semibold text-center truncate"
                          >
                            {p.caption || `View ${idx + 1}`}
                          </div>
                        </button>
                      ))
                    : GALLERY_ZOOM_LEVELS.map((zoom, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePhotoIdx(idx)}
                          className={[
                            'relative h-20 sm:h-24 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border-2',
                            activePhotoIdx === idx
                              ? 'border-[#C4975A] ring-2 ring-[#C4975A]/40 scale-[1.02]'
                              : 'border-brown-800/80 opacity-70 hover:opacity-100 hover:border-stone-500',
                          ].join(' ')}
                          style={{ boxSizing: 'border-box' }}
                        >
                          <Image
                            src={design.image}
                            alt={`${design.name} - ${zoom.label}`}
                            fill
                            unoptimized={design.image.startsWith('http')}
                            className={`object-cover ${zoom.style}`}
                            sizes="14vw"
                          />
                          <div
                            className="absolute bottom-0 inset-x-0 bg-[#0C0704]/85 px-1 py-0.5 text-[9px] text-[#FAF6F0] tracking-wider uppercase font-semibold text-center truncate"
                          >
                            {zoom.label}
                          </div>
                        </button>
                      ))}
                </div>
              </div>

              {/* Right Column: Customization Specs & Actions (5 Cols) */}
              <div
                className="lg:col-span-5 flex flex-col gap-6 bg-brown-900/50 border border-brown-800/80 rounded-3xl shadow-xl"
                style={{
                  padding: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                }}
              >
                {/* Header Title & Rating */}
                <div>
                  <span
                    className="inline-block text-[#C4975A] text-xs font-bold tracking-[0.2em] uppercase"
                    style={{ marginBottom: '6px' }}
                  >
                    Bespoke Handcrafted Piece
                  </span>
                  <h1
                    className="font-serif text-cream-100 font-bold leading-tight"
                    style={{ fontSize: 'clamp(2rem, 3.2vw, 2.75rem)' }}
                  >
                    {design.name}
                  </h1>

                  <div
                    className="flex items-center gap-3"
                    style={{ marginTop: '10px' }}
                  >
                    <StarRating rating={design.rating} size="md" />
                    <span className="font-body text-xs text-stone-300">
                      <strong className="text-cream-100">{design.rating}</strong> ({design.reviewCount} Verified Patrons)
                    </span>
                  </div>
                </div>

                {/* Dynamic Price & Deposit Card */}
                <div
                  className="rounded-2xl border border-brown-800/90 bg-[#0C0704]/60"
                  style={{ padding: '1.25rem 1.5rem' }}
                >
                  <div className="flex items-baseline justify-between flex-wrap gap-2">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-[#E8D4B0]">
                        €{design.priceEUR}
                      </span>
                      <span className="font-body text-stone-400 text-base sm:text-lg">
                        / ₦{design.priceNGN.toLocaleString('en-NG')}
                      </span>
                    </div>
                    <span
                      className="inline-block rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 font-semibold"
                      style={{ fontSize: '10px', padding: '4px 10px', letterSpacing: '0.08em', textTransform: 'uppercase' }}
                    >
                      All-Inclusive Bespoke
                    </span>
                  </div>

                  <p
                    className="font-body text-stone-400"
                    style={{ fontSize: '11px', marginTop: '8px', lineHeight: 1.5 }}
                  >
                    ✦ <strong className="text-cream-200">50% deposit required at commission:</strong> €{(design.priceEUR / 2).toFixed(0)} / ₦{(design.priceNGN / 2).toLocaleString('en-NG')}. Remainder due upon completed video inspection before DHL dispatch.
                  </p>
                </div>

                {/* Fabric Quality Selector */}
                {design.fabrics.length > 0 && (
                  <div>
                    <label
                      className="block text-stone-300 font-semibold uppercase tracking-wider"
                      style={{ fontSize: '11px', marginBottom: '8px' }}
                    >
                      Select Fabric Grade
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {design.fabrics.map(fabric => (
                        <button
                          key={fabric}
                          type="button"
                          onClick={() => setSelectedFabric(fabric)}
                          className={[
                            'rounded-xl text-left transition-all duration-300 cursor-pointer border',
                            selectedFabric === fabric
                              ? 'border-[#C4975A] bg-[#C4975A]/15 text-[#E8D4B0] font-bold shadow-md'
                              : 'border-brown-800 bg-[#0C0704]/40 text-stone-300 hover:border-stone-500 hover:text-cream-100',
                          ].join(' ')}
                          style={{
                            padding: '12px 14px',
                            fontSize: '11px',
                            letterSpacing: '0.05em',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{fabric}</span>
                            {selectedFabric === fabric && (
                              <span className="text-[#C4975A] font-bold text-xs ml-1">✓</span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Swatches */}
                {design.colors.length > 0 && (
                  <div>
                    <div
                      className="flex items-center justify-between"
                      style={{ marginBottom: '8px' }}
                    >
                      <span
                        className="text-stone-300 font-semibold uppercase tracking-wider"
                        style={{ fontSize: '11px' }}
                      >
                        Bespoke Dye / Tone: <strong className="text-cream-100">{selectedColor.name}</strong>
                      </span>
                      {selectedColor.hex && (
                        <span
                          className="font-mono text-xs rounded-md bg-[#0C0704] text-[#C4975A] border border-brown-700/60 font-semibold"
                          style={{ padding: '2px 8px' }}
                        >
                          {selectedColor.hex}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center flex-wrap gap-2.5">
                      {design.colors.map(color => (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={[
                            'h-9 px-3 rounded-full border transition-all duration-300 cursor-pointer flex items-center gap-2',
                            selectedColor.name === color.name
                              ? 'border-[#C4975A] bg-[#C4975A]/20 shadow-lg scale-105 ring-1 ring-[#C4975A]'
                              : 'border-brown-800 bg-[#0C0704]/60 hover:border-stone-500',
                          ].join(' ')}
                          title={`${color.name} (${color.hex || '#1C1C1C'})`}
                        >
                          <span
                            className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                            style={{ backgroundColor: color.hex || '#1C1C1C' }}
                          />
                          <span className="text-xs text-stone-200 font-medium">
                            {color.name}
                          </span>
                          {selectedColor.name === color.name && (
                            <span className="text-xs text-[#C4975A] font-bold">✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action CTA Buttons */}
                <div
                  className="flex flex-col gap-3"
                  style={{ paddingTop: '8px' }}
                >
                  <Button
                    href={`/order?design=${design.slug}&fabric=${encodeURIComponent(
                      selectedFabric
                    )}&color=${encodeURIComponent(selectedColor.name)}`}
                    variant="primary"
                    size="lg"
                    className="w-full text-center"
                    style={{
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      borderRadius: '14px',
                      fontSize: '12px',
                      letterSpacing: '0.15em',
                      fontWeight: 700,
                    }}
                  >
                    Commission This Piece — Bespoke
                  </Button>

                  <a
                    href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                      `Hello CaptainStitches, I am interested in the ${design.name} (Fabric: ${selectedFabric}, Colour: ${selectedColor.name}). Could you help me arrange measurements and delivery to Italy?`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center block rounded-xl border border-brown-700/80 bg-[#0C0704]/40 text-stone-300 hover:border-[#C4975A] hover:text-[#C4975A] font-semibold uppercase tracking-widest transition-all duration-200"
                    style={{
                      padding: '14px 20px',
                      fontSize: '11px',
                    }}
                  >
                    💬 Consult Tailor via WhatsApp
                  </a>
                </div>

                {/* 3 Trust Pillars */}
                <div
                  className="grid grid-cols-3 gap-3 border-t border-brown-800/80 text-center"
                  style={{ paddingTop: '1.25rem' }}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-[#C4975A] text-lg mb-1">✦</span>
                    <span className="text-stone-200 text-[10px] tracking-wider uppercase font-bold">
                      100% Bespoke
                    </span>
                    <span className="text-stone-400 text-[9px] mt-0.5">To your exact specs</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[#C4975A] text-lg mb-1">✈</span>
                    <span className="text-stone-200 text-[10px] tracking-wider uppercase font-bold">
                      Direct EU Courier
                    </span>
                    <span className="text-stone-400 text-[9px] mt-0.5">Tracked DHL Express</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[#C4975A] text-lg mb-1">🛡</span>
                    <span className="text-stone-200 text-[10px] tracking-wider uppercase font-bold">
                      Fit Guarantee
                    </span>
                    <span className="text-stone-400 text-[9px] mt-0.5">Free alterations support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: LUMINOUS ALABASTER HERITAGE & CRAFTSMANSHIP (#FAF6F0)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#FAF6F0] text-[#140C07]"
          style={{
            paddingTop: 'clamp(4.5rem, 8vw, 7rem)',
            paddingBottom: 'clamp(4.5rem, 8vw, 7rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Narrative (7 Cols) */}
              <div className="lg:col-span-7">
                <span
                  className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                  style={{ marginBottom: '8px' }}
                >
                  Artisan Narrative & Cut
                </span>
                <h2
                  className="font-serif font-normal leading-tight text-[#140C07]"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', marginBottom: '1.5rem' }}
                >
                  Tailored with Patience, Rooted in African Elegance
                </h2>

                <p
                  className="font-body text-[#52453B] leading-relaxed whitespace-pre-line"
                  style={{ fontSize: 'clamp(0.95rem, 1.2vw, 1.05rem)', lineHeight: 1.8 }}
                >
                  {design.description ||
                    `Each ${design.name} is constructed individually for the commissioning patron. From the initial chalk draft on premium cloth to the hand-embroidered collars and French-seamed finishes, our master tailors preserve the regal volume and crisp drape of authentic Nigerian ceremonial and luxury wear.`}
                </p>

                {/* Hallmarks of Excellence */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                  style={{ marginTop: '2.5rem' }}
                >
                  <div
                    className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm"
                  >
                    <span className="text-[#C4975A] font-serif text-2xl font-bold block mb-1">
                      01 /
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">
                      Hand-Pressed Seams
                    </h3>
                    <p className="text-xs text-[#52453B] leading-relaxed">
                      Reinforced structural interlinings that prevent buckling or creasing under warm European or tropical African climates.
                    </p>
                  </div>

                  <div
                    className="p-6 rounded-2xl bg-white border border-[#EBE3D7] shadow-sm"
                  >
                    <span className="text-[#C4975A] font-serif text-2xl font-bold block mb-1">
                      02 /
                    </span>
                    <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">
                      Personalized Proportions
                    </h3>
                    <p className="text-xs text-[#52453B] leading-relaxed">
                      Every measurement point is calibrated so shoulders sit natural, sleeves fall exact to wristbone, and hems hover clean.
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Garment Specifications Card (5 Cols) */}
              <div className="lg:col-span-5">
                <div
                  className="rounded-3xl bg-white border border-[#EBE3D7] shadow-lg p-8 sm:p-10 flex flex-col gap-6"
                >
                  <h3 className="font-serif text-2xl font-bold text-[#140C07] border-b border-[#EBE3D7] pb-4">
                    Garment Attributes
                  </h3>

                  <div className="flex flex-col gap-4 font-body text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-[#F2ECE1]">
                      <span className="text-[#8A7A6E] uppercase tracking-wider font-semibold">Silhouette Category</span>
                      <strong className="text-[#140C07] font-semibold">{design.categoryLabel}</strong>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#F2ECE1]">
                      <span className="text-[#8A7A6E] uppercase tracking-wider font-semibold">Atelier Origin</span>
                      <strong className="text-[#140C07] font-semibold">Aba & Lagos, Nigeria</strong>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#F2ECE1]">
                      <span className="text-[#8A7A6E] uppercase tracking-wider font-semibold">Quality Inspection Hub</span>
                      <strong className="text-[#140C07] font-semibold">Verona, Italy</strong>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-[#F2ECE1]">
                      <span className="text-[#8A7A6E] uppercase tracking-wider font-semibold">Production Cycle</span>
                      <strong className="text-[#C2410C] font-semibold">{design.turnaround}</strong>
                    </div>

                    <div className="flex justify-between items-center py-2">
                      <span className="text-[#8A7A6E] uppercase tracking-wider font-semibold">Courier Transit</span>
                      <strong className="text-[#140C07] font-semibold">3–5 Business Days (DHL EU)</strong>
                    </div>
                  </div>

                  <div
                    className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EBE3D7]"
                  >
                    <p className="text-xs text-[#52453B] leading-relaxed">
                      💡 <strong>Custom Reference Requests:</strong> Need bespoke embroidery motifs, monogrammed initials, or alternate cuff cuts? Submit your inspiration photograph during checkout.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: ROYAL HERITAGE EMERALD REVIEWS (#071A14)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#071A14] text-[#FAF6F0] border-y border-[#10B981]/20"
          style={{
            paddingTop: 'clamp(4.5rem, 8vw, 7rem)',
            paddingBottom: 'clamp(4.5rem, 8vw, 7rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
              <div>
                <span
                  className="inline-block text-[#34D399] font-semibold text-xs tracking-[0.2em] uppercase"
                  style={{ marginBottom: '6px' }}
                >
                  Patron Testimonials
                </span>
                <h2
                  className="font-serif text-cream-100 font-normal leading-tight"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
                >
                  Echoes from the Diaspora
                </h2>
              </div>

              <div className="flex items-center gap-4 bg-[#0C0704]/50 border border-[#10B981]/30 rounded-2xl px-6 py-4">
                <div className="text-right">
                  <span className="font-serif text-3xl font-bold text-[#E8D4B0] block leading-none">
                    {design.rating}
                  </span>
                  <span className="text-[#A7F3D0] text-[10px] tracking-wider uppercase font-semibold mt-1 block">
                    out of 5.0
                  </span>
                </div>
                <StarRating rating={design.rating} size="md" />
              </div>
            </div>

            {design.reviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {design.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-[#0C0704]/70 border border-[#10B981]/30 p-8 flex flex-col justify-between shadow-xl transition-all duration-300 hover:border-[#C4975A]"
                  >
                    <div>
                      <StarRating rating={rev.rating} />
                      <p
                        className="font-serif italic text-cream-100 text-sm leading-relaxed"
                        style={{ marginTop: '1.25rem', marginBottom: '1.5rem' }}
                      >
                        "{rev.comment}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#10B981]/20 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-[#E8D4B0] block font-semibold">{rev.name}</strong>
                        <span className="text-[10px] text-[#A7F3D0] uppercase tracking-wider">
                          Verified Commission
                        </span>
                      </div>
                      <span className="text-stone-400 text-[11px]">{rev.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl bg-[#0C0704]/60 border border-[#10B981]/30 p-12 text-center max-w-xl mx-auto">
                <span className="text-[#C4975A] text-2xl block mb-2">✦</span>
                <p className="text-sm text-stone-300 font-body">
                  No public reviews for this specific piece yet. Be the first patron in Europe to commission this bespoke attire!
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: WARM SAND COMPLEMENTARY DESIGNS (#F7F3EB)
        ========================================================================= */}
        {relatedDesigns.length > 0 && (
          <section
            className="relative w-full bg-[#F7F3EB] text-[#140C07]"
            style={{
              paddingTop: 'clamp(4.5rem, 8vw, 7rem)',
              paddingBottom: 'clamp(4.5rem, 8vw, 7rem)',
            }}
          >
            <div
              className="container-brand"
              style={{
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
                paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
                boxSizing: 'border-box',
              }}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
                <div>
                  <span
                    className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                    style={{ marginBottom: '6px' }}
                  >
                    Wardrobe Harmony
                  </span>
                  <h2
                    className="font-serif font-normal leading-tight text-[#140C07]"
                    style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
                  >
                    Complementary Designs
                  </h2>
                </div>

                <Button
                  href="/catalogue"
                  variant="outline"
                  size="sm"
                  style={{
                    padding: '10px 20px',
                    borderColor: '#140C07',
                    color: '#140C07',
                    borderRadius: '10px',
                  }}
                >
                  Explore Full Lookbook →
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedDesigns.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/catalogue/${rel.slug}`}
                    className="group flex flex-col rounded-3xl bg-white border border-[#EBE3D7] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
                  >
                    <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#FAF6F0]">
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        fill
                        unoptimized={rel.image.startsWith('http')}
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-[#0C0704]/80 backdrop-blur-md rounded-full px-3 py-1">
                        <span className="text-[9px] text-[#C4975A] uppercase tracking-widest font-bold">
                          {rel.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col justify-between flex-1">
                      <div>
                        <h3 className="font-serif text-base font-bold text-[#140C07] group-hover:text-[#C2410C] transition-colors leading-tight">
                          {rel.name}
                        </h3>
                      </div>

                      <div className="flex items-baseline justify-between pt-3 mt-3 border-t border-[#F2ECE1]">
                        <span className="font-serif text-base font-bold text-[#140C07]">
                          €{rel.priceEUR}
                        </span>
                        <span className="font-body text-[11px] text-[#8A7A6E]">
                          ₦{rel.priceNGN.toLocaleString('en-NG')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
