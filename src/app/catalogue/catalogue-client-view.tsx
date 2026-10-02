'use client'

import { useState, useMemo } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import StarRating from '@/utils/starRating'

export interface PublicCatalogueItem {
  name: string
  category: string
  categoryLabel: string
  priceNGN: number
  priceEUR: number
  turnaround: string
  rating: number
  reviewCount: number
  image: string
  slug: string
}

const CATEGORIES = [
  { slug: 'all', label: 'All Pieces' },
  { slug: 'native-wear', label: 'Native Wear' },
  { slug: 'english-suit', label: 'Fabric Accessories' },
  { slug: 'casual', label: 'Casual Wear' },
  { slug: 'children', label: "Children's Wear" },
]

export function CatalogueClientView({ initialDesigns }: { initialDesigns: PublicCatalogueItem[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')

  const currentCategory = searchParams.get('category') || 'all'

  const handleCategoryChange = (categorySlug: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categorySlug === 'all') {
      params.delete('category')
    } else {
      params.set('category', categorySlug)
    }
    router.push(`/catalogue?${params.toString()}`, { scroll: false })
  }

  // Filtered designs based on Category and Search Query
  const filteredDesigns = useMemo(() => {
    return initialDesigns.filter((design) => {
      const matchesCategory =
        currentCategory === 'all' ||
        design.category === currentCategory ||
        ((currentCategory === 'accessories' || currentCategory === 'english-suit') &&
          (design.category === 'english-suit' || design.category === 'accessories'))

      const matchesSearch =
        design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [initialDesigns, currentCategory, searchQuery])

  return (
    <>
      <Navbar />

      <main id="main-content" className="w-full overflow-hidden bg-[#0C0704]">
        {/* ─── 01: HERO HEADER (Deep Obsidian with Inset Framing) ───────────── */}
        <section
          className="relative text-cream-100 overflow-hidden border-b border-brown-800/60"
          style={{
            width: '100%',
            paddingTop: 'clamp(7rem, 12vw, 9.5rem)',
            paddingBottom: 'clamp(3.5rem, 6vw, 5rem)',
          }}
        >
          {/* Subtle warm glow */}
          <div
            className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-caramel-500/10 blur-[140px] pointer-events-none"
            aria-hidden="true"
          />

          <div
            className="container-brand relative z-10"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-6 h-px bg-caramel-400" />
                  <span className="font-body text-[11px] tracking-[0.25em] uppercase text-caramel-400 font-bold">
                    [ BESPOKE ATELIER CATALOGUE ]
                  </span>
                </div>
                <h1
                  className="text-display text-cream-100 font-display font-bold leading-[0.95] tracking-tight uppercase"
                  style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
                >
                  Curated Pieces,
                  <br />
                  <span className="italic font-light text-caramel-300">
                    Precision Tailored
                  </span>
                </h1>
                <p
                  className="font-body text-sm sm:text-base text-stone-300 leading-relaxed max-w-xl"
                  style={{ marginTop: '1.25rem' }}
                >
                  Explore our handcrafted Nigerian native attire and authentic African fabric accessories. Every piece is cut from high-density brocades, cashmeres, and silks, tailored to your exact measurements, and shipped directly across Europe.
                </p>
              </div>

              {/* Search Pill */}
              <div className="relative w-full sm:w-80 shrink-0">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-caramel-400"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search pieces or fabrics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#180F0A] border border-brown-700/80 text-cream-100 placeholder-stone-400 rounded-full font-body text-xs focus:outline-none focus:border-caramel-500 shadow-inner"
                  style={{ padding: '0.8rem 2.5rem 0.8rem 2.8rem' }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-4 flex items-center text-stone-400 hover:text-white"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter Pills */}
            <div
              className="flex overflow-x-auto gap-2.5 no-scrollbar scroll-smooth"
              style={{ paddingTop: '1rem', paddingBottom: '0.5rem' }}
            >
              {CATEGORIES.map((category) => {
                const isActive = currentCategory === category.slug
                return (
                  <button
                    key={category.slug}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`rounded-full text-xs font-body tracking-[0.16em] uppercase font-bold transition-all duration-300 select-none cursor-pointer whitespace-nowrap shadow-sm ${
                      isActive
                        ? 'bg-caramel-500 text-brown-950 shadow-md shadow-caramel-500/20'
                        : 'bg-[#180F0A] text-stone-300 border border-brown-700 hover:border-caramel-500/40 hover:text-white'
                    }`}
                    style={{ padding: '0.65rem 1.4rem' }}
                  >
                    {category.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── 02: PRODUCT SHOWCASE GRID (Luminous Warm Alabaster) ─────────── */}
        <section
          className="bg-[#FAF6F0] text-[#140C07] relative overflow-hidden"
          style={{
            width: '100%',
            paddingTop: 'clamp(3.5rem, 6vw, 5rem)',
            paddingBottom: 'clamp(5rem, 8vw, 7rem)',
          }}
        >
          <div
            className="container-brand relative z-10"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            {/* Results count & status bar */}
            <div
              className="flex items-center justify-between border-b border-[#E6DDD0] text-xs font-body text-[#6E5F52]"
              style={{ paddingBottom: '1.25rem', marginBottom: '2.5rem' }}
            >
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="font-bold text-[#140C07]">Showing:</span>
                <span>{filteredDesigns.length} Bespoke Designs Available</span>
              </div>
              <span className="hidden sm:inline font-body text-[11px] tracking-wider uppercase text-terracotta-600 font-bold">
                Hand-Inspected On Video · 10–14 Day Delivery
              </span>
            </div>

            {/* Designs Grid */}
            {filteredDesigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDesigns.map((design, idx) => (
                  <Link
                    key={design.slug}
                    href={`/catalogue/${design.slug}`}
                    className="group flex flex-col rounded-3xl overflow-hidden border border-[#E3D9CC] bg-white hover:border-caramel-500/60 hover:shadow-2xl transition-all duration-500 shadow-md"
                    aria-label={`View ${design.name}`}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-[360px] md:h-[400px] w-full bg-[#EDE6DC]">
                      <Image
                        src={design.image}
                        alt={design.name}
                        fill
                        unoptimized={design.image.startsWith('http')}
                        className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />

                      {/* Subtle gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#140C07]/80 via-transparent to-transparent opacity-50 group-hover:opacity-30 transition-opacity" />

                      {/* Top Spec Badges */}
                      <div
                        className="absolute top-4 inset-x-4 flex items-center justify-between z-10"
                        style={{ padding: '0 0.25rem' }}
                      >
                        <span
                          className="rounded-full bg-white/95 backdrop-blur-md text-[#140C07] font-body text-[9px] tracking-widest font-bold uppercase shadow-sm"
                          style={{ padding: '0.3rem 0.75rem' }}
                        >
                          {design.turnaround}
                        </span>
                        <span
                          className="rounded-full bg-[#140C07]/80 backdrop-blur-md text-caramel-300 font-body text-[9px] tracking-widest font-bold uppercase"
                          style={{ padding: '0.3rem 0.75rem' }}
                        >
                          0{idx + 1}
                        </span>
                      </div>

                      {/* Hover action pill */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brown-950/20 backdrop-blur-[1px]">
                        <span
                          className="rounded-full bg-[#180E07] text-white font-body text-[10px] tracking-[0.2em] font-bold uppercase shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform"
                          style={{ padding: '0.65rem 1.4rem' }}
                        >
                          Customize Fit &rarr;
                        </span>
                      </div>
                    </div>

                    {/* Details Box */}
                    <div
                      className="flex flex-col justify-between flex-1 gap-3.5"
                      style={{ padding: '1.35rem' }}
                    >
                      <div>
                        <span className="text-[10px] font-body tracking-[0.2em] uppercase font-bold text-terracotta-600 block">
                          {design.categoryLabel}
                        </span>
                        <h3 className="font-display text-xl text-[#140C07] group-hover:text-caramel-600 transition-colors mt-1 font-bold line-clamp-1">
                          {design.name}
                        </h3>
                      </div>

                      <div
                        className="border-t border-[#EAE3D8] flex items-end justify-between"
                        style={{ paddingTop: '0.85rem' }}
                      >
                        <div>
                          <div className="flex items-center gap-1.5 mb-1">
                            <StarRating rating={design.rating} size="sm" />
                            <span className="text-[10px] text-stone-500 font-body">
                              ({design.reviewCount})
                            </span>
                          </div>
                          <span className="text-[11px] text-stone-500 font-body block">
                            ₦{design.priceNGN.toLocaleString('en-NG')}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-display font-bold text-[#140C07] block leading-none">
                            €{design.priceEUR}
                          </span>
                          <span className="text-[9px] font-body text-stone-500 uppercase tracking-widest mt-1 block">
                            Bespoke Fit
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Empty state */
              <div
                className="text-center rounded-3xl border border-dashed border-[#D5CABE] bg-white"
                style={{ padding: '4rem 2rem' }}
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF6F0] flex items-center justify-center mx-auto mb-4 text-caramel-600">
                  🔍
                </div>
                <h3 className="font-display text-2xl text-[#140C07] font-bold mb-2">
                  No Pieces Found
                </h3>
                <p className="font-body text-stone-600 mb-6 text-sm max-w-sm mx-auto">
                  We couldn't find any designs matching your filter. Try clearing your search query or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    handleCategoryChange('all')
                  }}
                  className="rounded-full bg-[#180E07] text-white font-body text-xs tracking-widest uppercase font-bold shadow-md cursor-pointer"
                  style={{ padding: '0.75rem 1.75rem' }}
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ─── 03: BESPOKE COMMISSION INVITATION (Royal Emerald Card) ──────── */}
        <section
          className="bg-[#0C0704] text-cream-100 relative overflow-hidden"
          style={{
            width: '100%',
            paddingTop: 'clamp(4rem, 8vw, 6rem)',
            paddingBottom: 'clamp(4rem, 8vw, 6rem)',
            paddingLeft: 'clamp(1rem, 3vw, 2rem)',
            paddingRight: 'clamp(1rem, 3vw, 2rem)',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="rounded-[2.5rem] md:rounded-[3.5rem] bg-[#071A14] border border-emerald-700/60 shadow-2xl relative overflow-hidden text-center"
            style={{
              maxWidth: '1400px',
              margin: '0 auto',
              padding: 'clamp(3rem, 6vw, 5rem)',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="absolute top-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[#174D3B]/30 blur-[130px] pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-caramel-400 font-bold block mb-3">
                [ DON'T SEE YOUR EXACT DESIGN? ]
              </span>
              <h2 className="text-heading-xl text-white font-normal leading-tight tracking-tight uppercase mb-4">
                Have A Custom Fabric
                <br />
                <span className="font-display italic font-light text-caramel-300">
                  Or Reference In Mind?
                </span>
              </h2>
              <p className="font-body text-sm sm:text-base text-emerald-100/80 leading-relaxed mb-8">
                Send us your inspiration photo, sketch, or custom fabric request. Our master artisans in Lagos and Aba will cut and tailor your piece from scratch according to your exact European measurements.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/order"
                  className="rounded-full bg-caramel-500 hover:bg-caramel-400 text-brown-950 font-body text-xs tracking-widest uppercase font-bold transition-all shadow-lg"
                  style={{ padding: '0.85rem 2rem' }}
                >
                  Commission Custom Outfit &rarr;
                </Link>
                <a
                  href="https://wa.me/message/PLACEHOLDER"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-emerald-600 hover:border-caramel-400 text-cream-100 font-body text-xs tracking-widest uppercase font-semibold transition-all"
                  style={{ padding: '0.85rem 2rem' }}
                >
                  Chat On WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
