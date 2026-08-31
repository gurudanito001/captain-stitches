'use client'

import { use, useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import StarRating from '@/utils/starRating'
import SectionEyebrow from '@/utils/sectionEyeBrow'

const DESIGNS_DATABASE: Record<string, {
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
  colors: { name: string; hex: string }[]
  reviews: { name: string; rating: number; date: string; comment: string }[]
}> = {
  'grand-agbada': {
    name: 'Grand Agbada',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 120000,
    priceEUR: 68,
    turnaround: '10–14 days',
    rating: 4.9,
    reviewCount: 38,
    image: '/images/design-agbada.jpg',
    description: 'A majestic, statement three-piece Nigerian attire consisting of the inner kaftan, trousers, and the flowing outer robe (Agbada). Handcrafted with geometric embroidery on premium fabric, it represents prestige and heritage. Ideal for weddings, traditional ceremonies, and major celebrations.',
    fabrics: ['Presidential Cashmere', 'Premium Heavy Cotton', 'Supreme Damascus Silk'],
    colors: [
      { name: 'Midnight Black', hex: '#1C1C1C' },
      { name: 'Royal Ivory', hex: '#FAF5EA' },
      { name: 'Imperial Blue', hex: '#0B2240' },
      { name: 'Burgundy Wine', hex: '#58111A' },
    ],
    reviews: [
      { name: 'Chidi O.', rating: 5, date: '2026-08-12', comment: 'Absolutely stunning. Wore it to a wedding in Milan and got compliments all night. The embroidery is flawless.' },
      { name: 'Kunle A.', rating: 5, date: '2026-07-28', comment: 'Top-tier quality. The fit is perfect, exactly to the measurements I provided. Delivered to Rome right on time.' },
      { name: 'Emeka N.', rating: 4, date: '2026-07-15', comment: 'Very heavy, high-quality fabric. Feels very premium. The custom embroidery detail is outstanding.' },
    ],
  },
  'classic-senator': {
    name: 'Classic Senator',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 85000,
    priceEUR: 47,
    turnaround: '7–10 days',
    rating: 4.8,
    reviewCount: 52,
    image: '/images/design-senator.jpg',
    description: 'A sleek, minimalist two-piece native set featuring a structured long-sleeve top and slim-fit trousers. Popularized for its versatile, modern aesthetic, this Senator wear features subtle shoulder details and a clean front placket. Perfect for both formal business meetings and casual social gatherings.',
    fabrics: ['Super-Wax Crepe', 'Italian Linen', 'Soft Wool Blend'],
    colors: [
      { name: 'Slate Grey', hex: '#5A6065' },
      { name: 'Forest Green', hex: '#1E352F' },
      { name: 'Navy Blue', hex: '#1B2E43' },
      { name: 'Chocolate Brown', hex: '#3E2723' },
    ],
    reviews: [
      { name: 'Tunde B.', rating: 5, date: '2026-08-20', comment: 'Simple, sharp, and elegant. This has become my go-to outfit for formal Sunday services.' },
      { name: 'Obinna F.', rating: 5, date: '2026-08-05', comment: 'Excellent tailoring. The seams are clean and the shoulder fits perfectly. Highly recommended!' },
      { name: 'Yusuf M.', rating: 4, date: '2026-07-19', comment: 'Very comfortable and fits perfectly. The material is very breathable.' },
    ],
  },
  'italian-3-piece-suit': {
    name: 'Italian 3-Piece Suit',
    category: 'english-suit',
    categoryLabel: 'English Suits',
    priceNGN: 160000,
    priceEUR: 90,
    turnaround: '14–21 days',
    rating: 5.0,
    reviewCount: 24,
    image: '/images/design-suit.jpg',
    description: 'A masterpiece of European tailoring combined with structural excellence. This bespoke three-piece suit features a slim-fit jacket with peak lapels, a matching six-button waistcoat, and flat-front trousers. Crafted from fine wool and lined with silk, it offers unmatched comfort and style for corporate wear and black-tie events.',
    fabrics: ['Super 120s Italian Wool', 'Cashmere-Wool Blend', 'Premium Flannel'],
    colors: [
      { name: 'Charcoal Grey', hex: '#3B3C36' },
      { name: 'Classic Navy', hex: '#0F1E36' },
      { name: 'Jet Black', hex: '#0A0A0A' },
    ],
    reviews: [
      { name: 'Samuel D.', rating: 5, date: '2026-08-14', comment: 'Hands down the best fitting suit I own. Tailoring of this level in Italy would cost triple. Remarkable work.' },
      { name: 'Amadi K.', rating: 5, date: '2026-08-01', comment: 'The waistcoat fit is incredible. Makes you stand taller. Fabric feels soft but holds structure perfectly.' },
    ],
  },
  'kaftan-royale': {
    name: 'Kaftan Royale',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 75000,
    priceEUR: 42,
    turnaround: '7–10 days',
    rating: 4.7,
    reviewCount: 41,
    image: '/images/design-kaftan.jpg',
    description: 'An elegant long-cut kaftan top matching with tailored trousers. Features a clean, minimalist neckline with a modern zipper or button detail. Ideal for formal and casual gatherings, this design captures comfort and style seamlessly.',
    fabrics: ['Presidential Crepe', 'Soft Cotton Blend', 'Polished Linen'],
    colors: [
      { name: 'Ivory Cream', hex: '#ECE6D9' },
      { name: 'Emerald Green', hex: '#0A4B3E' },
      { name: 'Mustard Gold', hex: '#D4A317' },
      { name: 'Ocean Teal', hex: '#0E6251' },
    ],
    reviews: [
      { name: 'Ibrahim L.', rating: 5, date: '2026-08-22', comment: 'The material has a subtle sheen that looks highly luxurious. Very happy with my purchase.' },
      { name: 'Nonso E.', rating: 4, date: '2026-08-10', comment: 'Excellent fit, feels lightweight yet durable. Customer service was also very helpful with my sizing questions.' },
    ],
  },
  'double-breasted-executive-suit': {
    name: 'Double-Breasted Executive Suit',
    category: 'english-suit',
    categoryLabel: 'English Suits',
    priceNGN: 195000,
    priceEUR: 110,
    turnaround: '14–21 days',
    rating: 4.9,
    reviewCount: 18,
    image: '/images/category-suits.jpg',
    description: 'Exude authority with this executive-level double-breasted suit. Features sharp peak lapels, a classic six-on-two button configuration, and structural shoulder padding. Perfect for high-profile business meetings and formal occasions.',
    fabrics: ['Super 150s Merino Wool Blend', 'English Tweed', 'Wool-Silk Twill'],
    colors: [
      { name: 'Midnight Navy', hex: '#0A1528' },
      { name: 'Oxford Grey', hex: '#4B4C4E' },
      { name: 'Classic Pinstripe', hex: '#1E232B' },
    ],
    reviews: [
      { name: 'Oluwaseun T.', rating: 5, date: '2026-08-18', comment: 'Power suit. The double breast fits like a glove. Received so many compliments in the office.' },
    ],
  },
  'linen-summer-set': {
    name: 'Linen Summer Set',
    category: 'casual',
    categoryLabel: 'Casual Wear',
    priceNGN: 60000,
    priceEUR: 35,
    turnaround: '5–7 days',
    rating: 4.6,
    reviewCount: 15,
    image: '/images/category-casual.jpg',
    description: 'A breathable, relaxed two-piece linen shirt and trouser set. Crafted from premium long-staple flax linen, it offers maximum comfort in warm weather while maintaining a sharp, sophisticated profile. Ideal for holidays, summer dinners, and beach events.',
    fabrics: ['100% Irish Linen', 'French Flax Linen', 'Linen-Cotton Blend'],
    colors: [
      { name: 'Sand Beige', hex: '#E1D3BE' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Olive Green', hex: '#556B2F' },
      { name: 'Pure White', hex: '#FFFFFF' },
    ],
    reviews: [
      { name: 'Kenechi O.', rating: 5, date: '2026-08-25', comment: 'Super lightweight and breathable. Perfect for my summer trip to Sicily. Tailoring is high quality.' },
    ],
  },
  'signature-embroidered-kaftan': {
    name: 'Signature Embroidered Kaftan',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 90000,
    priceEUR: 50,
    turnaround: '7–10 days',
    rating: 4.8,
    reviewCount: 29,
    image: '/images/category-native.jpeg',
    description: 'A luxury native kaftan characterized by ornate hand-embroidered details along the neck and chest. Made from heavy high-quality fabric to hold its structure, it bridges the gap between classic heritage and contemporary fashion.',
    fabrics: ['Premium Senator Cashmere', 'Japanese Cotton-Wool Blend'],
    colors: [
      { name: 'Royal Gold', hex: '#C5A059' },
      { name: 'Midnight Black', hex: '#1C1C1C' },
      { name: 'Teal Blue', hex: '#005F73' },
    ],
    reviews: [
      { name: 'Dapo A.', rating: 5, date: '2026-08-08', comment: 'The embroidery is stunningly detailed. You can see it is hand-crafted. Extremely satisfied.' },
    ],
  },
  'mini-senator-set': {
    name: 'Mini Senator Set',
    category: 'children',
    categoryLabel: "Children's Wear",
    priceNGN: 50000,
    priceEUR: 30,
    turnaround: '5–7 days',
    rating: 4.7,
    reviewCount: 12,
    image: '/images/category-children.jpg',
    description: 'A handsome, comfortable native Senator wear custom-designed for children. Features child-friendly soft fabrics to prevent irritation and allows easy movement. Perfect for family weddings, Thanksgiving, and holidays.',
    fabrics: ['Super-Soft Cotton', 'Senator Crepe-Soft'],
    colors: [
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'Royal Blue', hex: '#003366' },
      { name: 'Burgundy Wine', hex: '#58111A' },
    ],
    reviews: [
      { name: 'Rita U.', rating: 5, date: '2026-08-11', comment: 'Tailored perfectly for my 6-year-old. The fabric is soft and not itchy. He looked so handsome for his uncle\'s wedding.' },
    ],
  },
  'junior-tuxedo': {
    name: 'Junior Tuxedo',
    category: 'children',
    categoryLabel: "Children's Wear",
    priceNGN: 95000,
    priceEUR: 55,
    turnaround: '10–14 days',
    rating: 4.9,
    reviewCount: 8,
    image: '/images/category-children.jpg',
    description: 'A sharp, custom-tailored tuxedo for young gentlemen. Complete with velvet lapels and comfortable, breathable inner lining. Excellent choice for ring bearers, page boys, and formal dinners.',
    fabrics: ['Soft Velvet-Wool Blend', 'Italian Wool-Cotton Blend'],
    colors: [
      { name: 'Classic Black', hex: '#0A0A0A' },
      { name: 'Midnight Navy', hex: '#0A1528' },
    ],
    reviews: [
      { name: 'Bisi O.', rating: 5, date: '2026-08-04', comment: 'Beautiful junior tuxedo. It was a perfect fit for my son who was the ring bearer.' },
    ],
  },
  'urban-kaftan-short': {
    name: 'Urban Kaftan Short',
    category: 'casual',
    categoryLabel: 'Casual Wear',
    priceNGN: 65000,
    priceEUR: 38,
    turnaround: '5–7 days',
    rating: 4.5,
    reviewCount: 21,
    image: '/images/category-casual.jpg',
    description: 'A contemporary take on traditional wear, featuring a short-length kaftan top and matching trousers. Crafted for casual weekend gatherings and smart social occasions.',
    fabrics: ['Polished Cotton', 'Linen Premium'],
    colors: [
      { name: 'Sage Green', hex: '#8F9779' },
      { name: 'Rust Orange', hex: '#B74F30' },
      { name: 'Navy Blue', hex: '#1B2E43' },
    ],
    reviews: [
      { name: 'Ayo D.', rating: 5, date: '2026-07-22', comment: 'Fit is perfect. Lightweight, simple, and clean.' },
    ],
  },
}

const GALLERY_ZOOM_LEVELS = [
  { label: 'Full Look', style: 'object-cover' },
  { label: 'Detail Zoom', style: 'object-cover scale-[1.3] origin-center' },
  { label: 'Stitch Detail', style: 'object-cover scale-[1.6] origin-top' },
  { label: 'Fit View', style: 'object-cover scale-[1.1] origin-bottom' }
]

export default function DesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)
  const design = DESIGNS_DATABASE[slug]

  const [activePhoto, setActivePhoto] = useState(0)
  const [selectedFabric, setSelectedFabric] = useState(design?.fabrics[0] || '')
  const [selectedColor, setSelectedColor] = useState(design?.colors[0] || { name: '', hex: '' })

  // Find related designs (excluding current one, matching same category)
  const relatedDesigns = useMemo(() => {
    if (!design) return []
    return Object.entries(DESIGNS_DATABASE)
      .filter(([key, val]) => val.category === design.category && key !== slug)
      .map(([key, val]) => ({ ...val, slug: key }))
      .slice(0, 4)
  }, [design, slug])

  if (!design) {
    return (
      <>
        <Navbar />
        <main className="bg-brown-900 min-h-screen flex items-center justify-center pt-24">
          <div className="text-center px-6">
            <h1 className="text-heading-xl text-cream-200">Design Not Found</h1>
            <p className="text-body text-stone-400 mt-4">
              We couldn't find the design you were looking for. It may have been removed or renamed.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/catalogue" variant="primary">
                Return to Catalogue
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pt-28 pb-24">
        <div className="container-brand">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-stone-500 text-[10px] tracking-widest font-semibold uppercase mb-8">
            <Link href="/" className="hover:text-caramel-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/catalogue" className="hover:text-caramel-500 transition-colors">
              Catalogue
            </Link>
            <span>/</span>
            <span className="text-caramel-500">{design.name}</span>
          </div>

          {/* Product Detail Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left Column: Photo Gallery */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              {/* Main Image Frame */}
              <div className="relative overflow-hidden h-[450px] md:h-[600px] bg-brown-950 border border-brown-750/30">
                <Image
                  src={design.image}
                  alt={design.name}
                  fill
                  className={`transition-all duration-700 ${GALLERY_ZOOM_LEVELS[activePhoto].style}`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Turnaround Badge */}
                <div className="absolute top-4 left-4 bg-brown-950/80 backdrop-blur-sm px-3 py-1.5 border border-brown-700/50">
                  <span className="text-label text-caramel-300 text-[9px] tracking-widest font-semibold uppercase">
                    {design.turnaround}
                  </span>
                </div>
              </div>

              {/* Thumbnails list */}
              <div className="grid grid-cols-4 gap-4">
                {GALLERY_ZOOM_LEVELS.map((zoom, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhoto(idx)}
                    className={[
                      'relative h-20 md:h-24 bg-brown-950 border overflow-hidden cursor-pointer transition-all duration-300',
                      activePhoto === idx
                        ? 'border-caramel-500'
                        : 'border-brown-850 hover:border-stone-500',
                    ].join(' ')}
                  >
                    <Image
                      src={design.image}
                      alt={`${design.name} - ${zoom.label}`}
                      fill
                      className={`object-cover ${zoom.style} ${
                        activePhoto === idx ? 'opacity-100' : 'opacity-60'
                      } hover:opacity-100 transition-opacity duration-300`}
                      sizes="12vw"
                    />
                    <div className="absolute bottom-1 left-1 right-1 bg-brown-950/80 px-1 py-0.5 text-[8px] text-cream-200 tracking-wider uppercase font-semibold text-center truncate">
                      {zoom.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Customization Specs */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Product Info Header */}
              <div>
                <span className="text-label text-caramel-500 font-semibold tracking-[0.2em]">
                  {design.categoryLabel}
                </span>
                <h1 className="text-heading-lg text-cream-200 mt-2 font-normal">
                  {design.name}
                </h1>
                <div className="flex items-center gap-3 mt-3">
                  <StarRating rating={design.rating} size="md" />
                  <span className="font-body text-xs text-stone-400">
                    {design.rating} ({design.reviewCount} Reviews)
                  </span>
                </div>
              </div>

              {/* Dynamic Prices */}
              <div className="py-6 border-y border-brown-850 my-2">
                <div className="flex items-baseline gap-4">
                  <span className="font-display text-4xl font-bold text-cream-100">
                    €{design.priceEUR}
                  </span>
                  <span className="font-body text-stone-400 text-lg">
                    / ₦{design.priceNGN.toLocaleString('en-NG')}
                  </span>
                </div>
                <p className="font-body text-[10px] text-stone-400 mt-2 uppercase tracking-wider">
                  50% deposit required at checkout (€{(design.priceEUR / 2).toFixed(0)} / ₦{(design.priceNGN / 2).toLocaleString('en-NG')})
                </p>
              </div>

              {/* Fabric Select */}
              <div>
                <span className="text-label text-stone-400 block mb-3 font-semibold">
                  Select Fabric Quality
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {design.fabrics.map(fabric => (
                    <button
                      key={fabric}
                      onClick={() => setSelectedFabric(fabric)}
                      className={[
                        'px-4 py-3.5 text-[10px] tracking-widest font-semibold uppercase text-left border transition-all duration-300 cursor-pointer',
                        selectedFabric === fabric
                          ? 'border-caramel-500 bg-caramel-500/10 text-caramel-300 font-bold'
                          : 'border-brown-800 text-stone-300 hover:border-stone-500 hover:text-cream-100',
                      ].join(' ')}
                    >
                      {fabric}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Select */}
              <div>
                <span className="text-label text-stone-400 block mb-3 font-semibold">
                  Select Colour: <span className="text-cream-200 ml-1 font-body">{selectedColor.name}</span>
                </span>
                <div className="flex items-center gap-3">
                  {design.colors.map(color => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={[
                        'w-8 h-8 rounded-full border transition-all duration-300 cursor-pointer flex items-center justify-center focus-visible:outline-2 focus-visible:outline-caramel-500',
                        selectedColor.name === color.name
                          ? 'border-caramel-500 scale-110 shadow-lg'
                          : 'border-brown-850 hover:border-stone-500',
                      ].join(' ')}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      aria-label={color.name}
                    >
                      {selectedColor.name === color.name && (
                        <span className="w-1.5 h-1.5 rounded-full bg-cream-100 invert" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-label text-stone-400 block mb-2.5 font-semibold">
                  Description
                </span>
                <p className="text-body text-stone-300 text-sm leading-relaxed">
                  {design.description}
                </p>
              </div>

              {/* Turnaround block */}
              <div className="p-4 bg-brown-950/40 border border-brown-850/80 flex items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 text-caramel-500 shrink-0"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <span className="block text-[10px] text-stone-400 font-semibold uppercase tracking-wider">
                    Production SLA
                  </span>
                  <span className="text-cream-200 text-xs font-semibold">
                    {design.turnaround} from measurement confirmation
                  </span>
                </div>
              </div>

              {/* Order Actions */}
              <div className="mt-2">
                <Button
                  href={`/order?design=${slug}&fabric=${encodeURIComponent(
                    selectedFabric
                  )}&color=${encodeURIComponent(selectedColor.name)}`}
                  variant="primary"
                  size="lg"
                  fullWidth
                >
                  Order This Design
                </Button>
                <p className="text-center text-[9px] text-stone-500 tracking-widest mt-3 uppercase">
                  Verona · Lagos · Aba Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Customer Reviews Section */}
          <section className="mt-24 pt-16 border-t border-brown-850">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              {/* Ratings Summary card */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <SectionEyebrow label="Reviews" />
                <h2 className="text-heading-md text-cream-200">
                  Customer feedback
                </h2>
                <div className="mt-4 p-6 bg-brown-950/20 border border-brown-850/80 text-center lg:text-left">
                  <div className="text-5xl font-display font-bold text-cream-100">
                    {design.rating}
                  </div>
                  <div className="flex justify-center lg:justify-start mt-2">
                    <StarRating rating={design.rating} size="md" />
                  </div>
                  <p className="text-body text-stone-400 text-xs mt-3">
                    Based on {design.reviewCount} approved customer reviews
                  </p>
                </div>
              </div>

              {/* Individual reviews list */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                {design.reviews.map((rev, idx) => (
                  <div
                    key={idx}
                    className="p-6 bg-brown-950/40 border border-brown-850/60 flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-base font-semibold text-cream-200">
                        {rev.name}
                      </span>
                      <span className="font-body text-[10px] text-stone-500">
                        {new Date(rev.date).toLocaleDateString('en-GB', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <StarRating rating={rev.rating} />
                    <p className="text-body text-stone-300 text-sm leading-relaxed mt-1">
                      "{rev.comment}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Related Pieces Grid */}
          {relatedDesigns.length > 0 && (
            <section className="mt-24 pt-16 border-t border-brown-850">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <SectionEyebrow label="Recommendations" />
                  <h2 className="text-heading-md text-cream-200 font-normal">
                    You may also like
                  </h2>
                </div>
                <Button href="/catalogue" variant="outline" size="sm">
                  Explore all
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedDesigns.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/catalogue/${rel.slug}`}
                    className="group block"
                    aria-label={`View ${rel.name}`}
                  >
                    {/* Image block */}
                    <div className="relative overflow-hidden h-[300px] bg-brown-900 border border-brown-700/30">
                      <Image
                        src={rel.image}
                        alt={rel.name}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                      {/* Turnaround Badge */}
                      <div className="absolute top-4 left-4 bg-brown-950/80 backdrop-blur-sm px-3 py-1.5 border border-brown-700/50">
                        <span className="text-label text-caramel-300 text-[9px] tracking-widest font-semibold uppercase">
                          {rel.turnaround}
                        </span>
                      </div>

                      {/* Editorial Hover Overlay */}
                      <div className="absolute inset-0 bg-brown-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                        <span className="bg-cream-100/90 backdrop-blur-md text-brown-900 font-body text-[10px] tracking-[0.2em] uppercase font-bold py-3 px-6 shadow-2xl transition-transform duration-500 translate-y-3 group-hover:translate-y-0">
                          View Details
                        </span>
                      </div>
                    </div>

                    {/* Info block */}
                    <div className="pt-4 flex flex-col gap-1.5">
                      <div>
                        <span className="text-label text-caramel-500 text-[10px] tracking-widest font-semibold uppercase">
                          {rel.categoryLabel}
                        </span>
                      </div>

                      <div className="flex items-start justify-between gap-4 mt-0.5">
                        <h3 className="font-display text-base text-cream-200 group-hover:text-caramel-400 transition-colors duration-300 font-bold leading-tight">
                          {rel.name}
                        </h3>
                        <div className="text-right shrink-0">
                          <span className="font-body text-xs font-semibold text-cream-100">
                            €{rel.priceEUR}
                          </span>
                          <span className="block font-body text-[9px] text-stone-400 mt-0.5">
                            ₦{rel.priceNGN.toLocaleString('en-NG')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
