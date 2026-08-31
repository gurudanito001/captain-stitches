import SectionEyebrow from '@/utils/sectionEyeBrow'
import { Button } from '@/components/ui/Button'
import StarRating from '@/utils/starRating'


const testimonials = [
  {
    name: 'Adewale O.',
    location: 'Verona, Italy',
    rating: 5,
    text: 'I wore my agbada to a wedding in Rome and could not stop getting compliments. The quality is exactly what I expected from back home — only better.',
    initials: 'AO',
  },
  {
    name: 'Chidinma E.',
    location: 'London, UK',
    rating: 5,
    text: "Ordered a senator for my husband's 50th birthday. They captured every measurement perfectly and delivered two weeks before the date. Absolutely brilliant.",
    initials: 'CE',
  },
  {
    name: 'Emeka B.',
    location: 'Milan, Italy',
    rating: 5,
    text: 'Three suits in two years. Every single one has been perfect. My Italian colleagues always ask where I get them — I tell them Nigeria.',
    initials: 'EB',
  },
]


const Testimonials = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
            5. CUSTOMER TESTIMONIALS
            3-column review cards on a dark surface.
            Staggered desktop grid, editorial quote marks & typography.
        ══════════════════════════════════════════════════════════════════ */}
      <section
        className="bg-brown-800 section-y"
        aria-labelledby="testimonials-heading"
      >
        <div className="container-brand">

          {/* Editorial Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 pb-8 border-b border-brown-700/30">
            <div className="max-w-xl">
              <SectionEyebrow label="What clients say" />
              <h2 id="testimonials-heading" className="text-heading-xl text-cream-200 mt-2 font-normal">
                Worn across<br />Europe
              </h2>
            </div>
            
            {/* Header Right: Aggregate Proof */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:items-end shrink-0">
              <div className="flex flex-col gap-1 sm:items-end">
                <div className="flex items-center gap-2.5">
                  <StarRating rating={5} size="md" />
                  <span className="font-body text-sm font-bold text-cream-200">
                    4.9 / 5.0
                  </span>
                </div>
                <p className="text-label text-stone-400 text-[9px] tracking-[0.18em] uppercase">
                  150+ bespoke clients across Europe
                </p>
              </div>
              <span className="hidden sm:block w-px h-8 bg-brown-700" aria-hidden="true" />
              <Button href="/catalogue" variant="outline" size="sm" style={{ marginBottom: '10px' }}>
                View reviews
              </Button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <figure
                key={t.name}
                className={`relative bg-brown-900/60 backdrop-blur-sm border border-brown-700/40 p-8 md:p-10 flex flex-col gap-6 transition-all duration-300 hover:border-caramel-500/30 hover:bg-brown-900/85 group ${
                  idx === 1 ? 'md:translate-y-4' : ''
                }`}
              >
                {/* Giant decorative quotation mark in the background */}
                <div className="absolute top-4 right-8 text-cream-200/5 font-display text-[8rem] leading-none select-none pointer-events-none transition-colors duration-500 group-hover:text-caramel-500/10">
                  “
                </div>

                <div className="relative z-10">
                  <StarRating rating={t.rating} size="sm" />
                </div>

                <blockquote className="font-display italic text-lg md:text-xl text-cream-200/90 leading-relaxed flex-1 relative z-10">
                  &ldquo;{t.text}&rdquo;
                </blockquote>

                <figcaption className="flex items-center gap-3 pt-6 border-t border-brown-700/50 relative z-10">
                  {/* Editorial initials circle */}
                  <div
                    className="w-10 h-10 rounded-full bg-brown-850 border border-brown-700/80 flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-caramel-500/40 group-hover:bg-brown-900"
                    aria-hidden="true"
                  >
                    <span className="text-caramel-400 font-body font-semibold text-xs tracking-wider uppercase">{t.initials}</span>
                  </div>
                  <div>
                    <p className="text-label text-cream-100 text-[10px] tracking-widest font-semibold uppercase">
                      {t.name}
                    </p>
                    <p className="text-label text-stone-400 text-[9px] tracking-wider mt-0.5">
                      {t.location}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

        </div>
      </section>
    </>
  )
}

export default Testimonials