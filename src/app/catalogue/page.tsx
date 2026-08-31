'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import StarRating from '@/utils/starRating'
import SectionEyebrow from '@/utils/sectionEyeBrow'

const ALL_DESIGNS = [
  {
    name: 'Grand Agbada',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 120000,
    priceEUR: 68,
    turnaround: '10–14 days',
    rating: 4.9,
    reviewCount: 38,
    image: '/images/design-agbada.jpg',
    slug: 'grand-agbada',
  },
  {
    name: 'Classic Senator',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 85000,
    priceEUR: 47,
    turnaround: '7–10 days',
    rating: 4.8,
    reviewCount: 52,
    image: '/images/design-senator.jpg',
    slug: 'classic-senator',
  },
  {
    name: 'Italian 3-Piece Suit',
    category: 'english-suit',
    categoryLabel: 'English Suits',
    priceNGN: 160000,
    priceEUR: 90,
    turnaround: '14–21 days',
    rating: 5.0,
    reviewCount: 24,
    image: '/images/design-suit.jpg',
    slug: 'italian-3-piece-suit',
  },
  {
    name: 'Kaftan Royale',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 75000,
    priceEUR: 42,
    turnaround: '7–10 days',
    rating: 4.7,
    reviewCount: 41,
    image: '/images/design-kaftan.jpg',
    slug: 'kaftan-royale',
  },
  {
    name: 'Double-Breasted Executive Suit',
    category: 'english-suit',
    categoryLabel: 'English Suits',
    priceNGN: 195000,
    priceEUR: 110,
    turnaround: '14–21 days',
    rating: 4.9,
    reviewCount: 18,
    image: '/images/category-suits.jpg',
    slug: 'double-breasted-executive-suit',
  },
  {
    name: 'Linen Summer Set',
    category: 'casual',
    categoryLabel: 'Casual Wear',
    priceNGN: 60000,
    priceEUR: 35,
    turnaround: '5–7 days',
    rating: 4.6,
    reviewCount: 15,
    image: '/images/category-casual.jpg',
    slug: 'linen-summer-set',
  },
  {
    name: 'Signature Embroidered Kaftan',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 90000,
    priceEUR: 50,
    turnaround: '7–10 days',
    rating: 4.8,
    reviewCount: 29,
    image: '/images/category-native.jpeg',
    slug: 'signature-embroidered-kaftan',
  },
  {
    name: 'Mini Senator Set',
    category: 'children',
    categoryLabel: "Children's Wear",
    priceNGN: 50000,
    priceEUR: 30,
    turnaround: '5–7 days',
    rating: 4.7,
    reviewCount: 12,
    image: '/images/category-children.jpg',
    slug: 'mini-senator-set',
  },
  {
    name: 'Junior Tuxedo',
    category: 'children',
    categoryLabel: "Children's Wear",
    priceNGN: 95000,
    priceEUR: 55,
    turnaround: '10–14 days',
    rating: 4.9,
    reviewCount: 8,
    image: '/images/category-children.jpg',
    slug: 'junior-tuxedo',
  },
  {
    name: 'Urban Kaftan Short',
    category: 'casual',
    categoryLabel: 'Casual Wear',
    priceNGN: 65000,
    priceEUR: 38,
    turnaround: '5–7 days',
    rating: 4.5,
    reviewCount: 21,
    image: '/images/category-casual.jpg',
    slug: 'urban-kaftan-short',
  }
]

const CATEGORIES = [
  { slug: 'all', label: 'All Pieces' },
  { slug: 'native-wear', label: 'Native Wear' },
  { slug: 'english-suit', label: 'English Suits' },
  { slug: 'casual', label: 'Casual Wear' },
  { slug: 'children', label: "Children's Wear" },
]

function CatalogueContent() {
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
    return ALL_DESIGNS.filter(design => {
      const matchesCategory =
        currentCategory === 'all' || design.category === currentCategory

      const matchesSearch =
        design.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        design.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [currentCategory, searchQuery])

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen" style={{ paddingTop: "150px", paddingBottom: "50px" }}>
        {/* Header Section */}
        <section className="bg-brown-900 pt-32 pb-12" style={{ marginBottom: "50px" }}>
          <div className="container-brand">
            <SectionEyebrow label="Bespoke Catalogue" />
            <h1 className="text-heading-xl text-cream-200 mt-2 font-normal">
              Bespoke<br />Collections
            </h1>
            <p className="text-body text-stone-300 mt-4 max-w-xl">
              Explore our collections of hand-crafted Nigerian native wear and premium English suits.
              Select any design to customize it to your measurements, with direct delivery across Europe.
            </p>
          </div>
        </section>

        {/* Filters and Grid Section */}
        <section className="bg-brown-900 pb-24">
          <div className="container-brand">
            {/* Search Bar & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 pb-8 border-b border-brown-850">
              {/* Category Tabs */}
              <div className="flex overflow-x-auto gap-3 no-scrollbar pb-3 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0 scroll-smooth snap-x">
                {CATEGORIES.map(category => {
                  const isActive = currentCategory === category.slug
                  return (
                    <button
                      key={category.slug}
                      onClick={() => handleCategoryChange(category.slug)}
                      className={[
                        'px-5 py-2.5 text-[10px] tracking-widest font-semibold uppercase border transition-all duration-300 shrink-0 cursor-pointer select-none',
                        isActive
                          ? 'bg-caramel-500 text-brown-900 border-caramel-500'
                          : 'bg-transparent text-stone-300 border-brown-700 hover:border-stone-400 hover:text-cream-100',
                      ].join(' ')}
                    >
                      {category.label}
                    </button>
                  )
                })}
              </div>

              {/* Search Input */}
              <div className="relative w-full md:max-w-xs shrink-0" style={{ marginBottom: "10px" }}>
                <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search designs..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-brown-950/40 border border-brown-800 text-cream-200 placeholder-stone-500 focus:outline-none focus:border-caramel-500 font-body text-xs tracking-wider transition-colors duration-200"
                  style={{ height: "50px", paddingLeft: "44px", paddingRight: "40px" }}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-4 flex items-center text-stone-400 hover:text-cream-200 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Design Grid */}
            {filteredDesigns.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
                {filteredDesigns.map(design => (
                  <Link
                    key={design.slug}
                    href={`/catalogue/${design.slug}`}
                    className="group block"
                    aria-label={`View ${design.name}`}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden h-[360px] md:h-[400px] bg-brown-900 border border-brown-700/30">
                      <Image
                        src={design.image}
                        alt={design.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Turnaround Badge */}
                      <div className="absolute top-4 left-4 bg-brown-950/80 backdrop-blur-sm px-3 py-1.5 border border-brown-700/50">
                        <span className="text-label text-caramel-300 text-[9px] tracking-widest font-semibold uppercase">
                          {design.turnaround}
                        </span>
                      </div>

                      {/* Editorial Hover Overlay Action */}
                      <div className="absolute inset-0 bg-brown-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                        <span className="bg-cream-100/90 backdrop-blur-md text-brown-900 font-body text-[10px] tracking-[0.2em] uppercase font-bold py-3 px-6 shadow-2xl transition-transform duration-500 translate-y-3 group-hover:translate-y-0">
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Info Block */}
                    <div className="pt-4 flex flex-col gap-1.5">
                      <div>
                        <span className="text-label text-caramel-500 text-[10px] tracking-widest font-semibold uppercase">
                          {design.categoryLabel}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4 mt-0.5">
                        <h3 className="font-display text-lg text-cream-200 group-hover:text-caramel-400 transition-colors duration-300 font-bold leading-tight">
                          {design.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className="font-body text-sm font-semibold text-cream-100">
                            €{design.priceEUR}
                          </span>
                          <span className="block font-body text-[10px] text-stone-400 mt-0.5">
                            ₦{design.priceNGN.toLocaleString('en-NG')}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <StarRating rating={design.rating} />
                        <span className="font-body text-[10px] text-stone-400 tracking-wide mt-0.5">
                          {design.rating} ({design.reviewCount} reviews)
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center text-center py-20 px-6 border border-dashed border-brown-850 bg-brown-950/20 max-w-lg mx-auto mt-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="w-12 h-12 text-caramel-500/60 mb-6"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                  />
                </svg>
                <h3 className="font-display text-xl text-cream-200 font-bold mb-2">
                  No Designs Found
                </h3>
                <p className="text-body text-stone-400 mb-8 text-sm max-w-sm">
                  We couldn't find any designs matching your search or filter. Try switching to a different category or resetting filters.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => {
                      setSearchQuery('')
                      handleCategoryChange('all')
                    }}
                    className="px-5 py-2 text-xs tracking-widest bg-transparent text-cream-200 border border-cream-400 hover:border-caramel-500 hover:text-caramel-500 uppercase font-body font-medium transition-colors duration-200 cursor-pointer select-none"
                  >
                    Reset Filters
                  </button>
                  <Button href="/order" variant="primary" size="sm">
                    Request Custom Design
                  </Button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default function CataloguePage() {
  return (
    <Suspense fallback={
      <div className="bg-brown-900 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <CatalogueContent />
    </Suspense>
  )
}
