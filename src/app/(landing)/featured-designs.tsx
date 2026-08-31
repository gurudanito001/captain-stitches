import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow';
import StarRating from '@/utils/starRating';


const featuredDesigns = [
  {
    name: 'Grand Agbada',
    category: 'Native Wear',
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
    category: 'Native Wear',
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
    category: 'English Suits',
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
    category: 'Native Wear',
    priceNGN: 75000,
    priceEUR: 42,
    turnaround: '7–10 days',
    rating: 4.7,
    reviewCount: 41,
    image: '/images/design-kaftan.jpg',
    slug: 'kaftan-royale',
  },
]


const FeaturedDesigns = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
            3. FEATURED DESIGNS GRID
            4-column product cards with image, rating, price.
            Responsive touch slider on mobile, standard grid on desktop.
        ══════════════════════════════════════════════════════════════════ */}
      <section
        className="bg-brown-800 section-y"
        aria-labelledby="featured-heading"
      >
        <div className="container-brand">

          <div className="flex items-end justify-between mb-10">
            <div>
              <SectionEyebrow label="Most ordered" />
              <h2 id="featured-heading" className="text-heading-xl text-cream-200 mt-2">
                Featured<br />pieces
              </h2>
            </div>
            <Button href="/catalogue" variant="accent" size="sm" style={{ marginBottom: '10px' }}>
              View all
            </Button>
          </div>

          {/* Cards container: Horizontal scroll on mobile, 4-col grid on desktop */}
          <div className="flex overflow-x-auto md:grid md:grid-cols-4 gap-6 snap-x snap-mandatory no-scrollbar pb-6 md:pb-0 -mx-6 px-6 md:mx-0 md:px-0">
            {featuredDesigns.map(design => (
              <Link
                key={design.slug}
                href={`/catalogue/${design.slug}`}
                className="group block w-[85vw] sm:w-[45vw] md:w-auto shrink-0 snap-start snap-always"
                aria-label={`View ${design.name}`}
              >
                {/* Image block */}
                <div className="relative overflow-hidden h-[360px] md:h-[420px] bg-brown-900 border border-brown-700/30">
                  <Image
                    src={design.image}
                    alt={design.name}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  {/* Turnaround badge */}
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

                {/* Info block */}
                <div className="pt-4 flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-label text-caramel-500 text-[10px] tracking-widest font-semibold uppercase">
                      {design.category}
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

        </div>
      </section>
    </>
  )
}

export default FeaturedDesigns