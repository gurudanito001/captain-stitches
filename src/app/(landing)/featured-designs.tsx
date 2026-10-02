import Image from 'next/image'
import Link from 'next/link'
import StarRating from '@/utils/starRating'
import { getFeaturedDesigns, getCategoryLabel } from '@/lib/dal/catalogue'

const CURATED_FALLBACKS = [
  {
    name: 'Imperial Royal Agbada',
    category: 'Native Wear',
    priceNGN: 240000,
    priceEUR: 145,
    turnaround: '12 days',
    rating: 5.0,
    reviewCount: 14,
    image: '/images/design-agbada.jpg',
    slug: 'imperial-royal-agbada',
  },
  {
    name: 'Executive Charcoal Senator',
    category: 'Native Wear',
    priceNGN: 160000,
    priceEUR: 98,
    turnaround: '10 days',
    rating: 4.9,
    reviewCount: 22,
    image: '/images/design-senator.jpg',
    slug: 'executive-charcoal-senator',
  },
  {
    name: 'Ankara Silk Tie & Cufflink Ensemble',
    category: 'Fabric Accessories',
    priceNGN: 65000,
    priceEUR: 40,
    turnaround: '5 days',
    rating: 5.0,
    reviewCount: 16,
    image: '/images/design-accessories.jpg',
    slug: 'ankara-tie-cufflink-set',
  },
  {
    name: 'Golden Hour Kaftan Ensemble',
    category: 'Native Wear',
    priceNGN: 180000,
    priceEUR: 110,
    turnaround: '10 days',
    rating: 4.8,
    reviewCount: 18,
    image: '/images/design-kaftan.jpg',
    slug: 'golden-hour-kaftan-ensemble',
  },
]

const FeaturedDesigns = async () => {
  const dbDesigns = await getFeaturedDesigns(4)

  const mappedDb = dbDesigns.map((d: any) => {
    const coverPhoto =
      d.photos.find((p: any) => p.isPrimary)?.url ||
      d.photos[0]?.url ||
      '/images/design-agbada.jpg'
    const reviews = d.reviews || []
    const rating =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce((acc: number, r: any) => acc + r.rating, 0) /
              reviews.length
            ).toFixed(1)
          )
        : 5.0
    const turnaround = `${d.turnaroundDays ?? 14} days`

    return {
      name: d.nameEN,
      category: getCategoryLabel(d.category),
      priceNGN: d.priceNGN,
      priceEUR: d.priceEUR,
      turnaround,
      rating,
      reviewCount: reviews.length || d._count?.reviews || 0,
      image: coverPhoto,
      slug: d.slug,
    }
  })

  // Ensure full 4 items in the showcase
  const existingSlugs = new Set(mappedDb.map(d => d.slug))
  const needed = Math.max(0, 4 - mappedDb.length)
  const additions = CURATED_FALLBACKS.filter(c => !existingSlugs.has(c.slug)).slice(0, needed)
  const featuredDesigns = [...mappedDb, ...additions]

  return (
    <section
      className="bg-[#FAF6F0] relative"
      style={{
        width: '100%',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
        paddingLeft: 'clamp(1rem, 3vw, 2rem)',
        paddingRight: 'clamp(1rem, 3vw, 2rem)',
        boxSizing: 'border-box',
      }}
      aria-labelledby="featured-heading"
    >
      {/* 
        Reference Image Feature Section:
        Inset Dark Luxury Showcase Card with rounded corners, subtle warm glow, and high-impact header
      */}
      <div
        className="rounded-[2.5rem] md:rounded-[3.5rem] bg-[#0E0906] border border-caramel-500/20 text-cream-100 shadow-2xl relative overflow-hidden"
        style={{
          maxWidth: '1400px',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 'clamp(2rem, 5vw, 4rem)',
          boxSizing: 'border-box',
        }}
      >
        {/* Ambient subtle warm spotlight glow inside card */}
        <div
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-caramel-500/10 blur-[130px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-terracotta-500/10 blur-[130px] pointer-events-none"
          aria-hidden="true"
        />

        {/* Top Header Row matching Reference Layout */}
        <div
          className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-brown-800/80"
          style={{ paddingBottom: '2rem' }}
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-caramel-400" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-caramel-400 font-bold">
                [ 02 — BESPOKE INVENTORY ]
              </span>
            </div>
            <h2
              id="featured-heading"
              className="text-heading-xl text-cream-100 font-normal leading-tight tracking-tight uppercase"
            >
              Browse What
              <br />
              <span className="italic font-display font-light text-caramel-400">
                Just Landed
              </span>
            </h2>
            <p className="font-body text-xs md:text-sm text-stone-400 mt-3 max-w-md">
              Fresh commissions from our Lagos and Aba tailors, ready for customization and expedited delivery across Europe.
            </p>
          </div>

          {/* Dual-tone pill CTA button like in reference */}
          <Link
            href="/catalogue"
            className="group self-start lg:self-end inline-flex items-center gap-4 rounded-full bg-cream-100 hover:bg-white text-brown-950 transition-all duration-300 shadow-lg"
            style={{ padding: '0.45rem 0.5rem 0.45rem 1.4rem' }}
          >
            <span className="font-body text-xs tracking-[0.18em] uppercase font-bold text-brown-950">
              Browse All Designs
            </span>
            <div className="w-9 h-9 rounded-full bg-terracotta-500 group-hover:bg-terracotta-400 flex items-center justify-center text-white transition-all duration-300 group-hover:translate-x-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* Product Cards Grid inside dark container */}
        <div className="relative z-10 mt-12">
          {featuredDesigns.length === 0 ? (
            <div className="py-20 text-center border border-dashed border-brown-700/60 rounded-3xl bg-brown-950/40 px-6">
              <p className="font-display text-xl text-cream-200 mb-2">
                New bespoke pieces currently in curation
              </p>
              <p className="text-stone-400 text-sm max-w-md mx-auto">
                Handcrafted designs will appear here as soon as they are published to the catalogue.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredDesigns.map((design, idx) => (
                <Link
                  key={design.slug}
                  href={`/catalogue/${design.slug}`}
                  className="group flex flex-col rounded-3xl overflow-hidden border border-brown-800/80 bg-[#140E0A] hover:border-caramel-500/50 hover:bg-[#1A120D] transition-all duration-500 shadow-xl"
                  aria-label={`View ${design.name}`}
                >
                  {/* Image container */}
                  <div className="relative overflow-hidden h-[340px] w-full bg-[#110A06]">
                    <Image
                      src={design.image}
                      alt={design.name}
                      fill
                      className="object-cover transition-transform duration-1000 group-hover:scale-[1.06]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Gradient overlay */}
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-[#140E0A] via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"
                      aria-hidden="true"
                    />

                    {/* Top spec chips */}
                    <div
                      className="absolute top-4 inset-x-4 flex items-center justify-between z-10"
                      style={{ padding: '0 0.25rem' }}
                    >
                      <span
                        className="rounded-full bg-brown-950/80 backdrop-blur-md border border-caramel-500/30 text-caramel-300 font-body text-[9px] tracking-widest font-bold uppercase"
                        style={{ padding: '0.25rem 0.65rem' }}
                      >
                        {design.turnaround}
                      </span>
                      <span
                        className="rounded-full bg-[#180E07]/80 backdrop-blur-md text-stone-300 font-body text-[9px] tracking-widest font-medium uppercase"
                        style={{ padding: '0.25rem 0.65rem' }}
                      >
                        0{idx + 1}
                      </span>
                    </div>

                    {/* Hover pill action */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-brown-950/40 backdrop-blur-[2px]">
                      <span
                        className="rounded-full bg-cream-100 text-brown-950 font-body text-[10px] tracking-[0.2em] font-bold uppercase shadow-2xl transform translate-y-2 group-hover:translate-y-0 transition-transform"
                        style={{ padding: '0.55rem 1.25rem' }}
                      >
                        Customize Piece &rarr;
                      </span>
                    </div>
                  </div>

                  {/* Details card content */}
                  <div
                    className="flex flex-col justify-between flex-1 gap-4"
                    style={{ padding: '1.25rem' }}
                  >
                    <div>
                      <span className="text-[10px] font-body tracking-[0.2em] uppercase font-bold text-caramel-400">
                        {design.category}
                      </span>
                      <h3 className="font-display text-xl text-cream-100 font-bold group-hover:text-caramel-300 transition-colors mt-1 line-clamp-1">
                        {design.name}
                      </h3>
                    </div>

                    <div className="pt-3 border-t border-brown-800/80 flex items-end justify-between">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <StarRating rating={design.rating} size="sm" />
                          <span className="text-[10px] text-stone-400 font-body">
                            ({design.reviewCount})
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-400 font-body tracking-wider block">
                          ₦{design.priceNGN.toLocaleString('en-NG')}
                        </span>
                      </div>

                      <div className="text-right">
                        <span className="text-lg font-display font-bold text-cream-100 block leading-none">
                          €{design.priceEUR}
                        </span>
                        <span className="text-[9px] font-body text-stone-400 uppercase tracking-widest mt-1 block">
                          Bespoke Fit
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Reassurance Bar inside dark card */}
        <div
          className="relative z-10 border-t border-brown-800/80 flex flex-wrap items-center justify-between gap-6 text-stone-400 font-body text-xs"
          style={{ marginTop: '2.5rem', paddingTop: '1.75rem' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-caramel-500/20 text-caramel-400 flex items-center justify-center font-bold text-xs">
              ✓
            </div>
            <span>Every order includes personal video sign-off before dispatch</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-stone-300">Custom Fabrics Available</span>
            <span className="w-1 h-1 rounded-full bg-stone-600" />
            <span className="text-stone-300">Doorstep Delivery to Italy &amp; UK</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedDesigns