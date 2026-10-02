import Link from 'next/link'
import StarRating from '@/utils/starRating'

const testimonials = [
  {
    name: 'Adewale O.',
    location: 'Verona, Italy 🇮🇹',
    rating: 5,
    event: 'Roman Catholic Wedding',
    text: 'I wore my bespoke agbada to a cathedral wedding in Rome and could not stop receiving compliments from both Italians and diaspora. The cut and drape rival Savile Row.',
    initials: 'AO',
  },
  {
    name: 'Chidinma E.',
    location: 'London, UK 🇬🇧',
    rating: 5,
    event: '50th Jubilee Celebration',
    text: "Ordered a tailored senator for my husband's milestone birthday. CaptainStitches captured every measurement perfectly and delivered to our door 10 days before the celebration.",
    initials: 'CE',
  },
  {
    name: 'Emeka B.',
    location: 'Milan, Italy 🇮🇹',
    rating: 5,
    event: 'Corporate Executive Gala',
    text: 'Three suits in two years. Every single one has been immaculate. My Italian colleagues in the fashion district frequently ask where I get them cut — proudly made in Nigeria.',
    initials: 'EB',
  },
]

const Testimonials = () => {
  return (
    <section
      className="bg-[#071A14] text-cream-100 relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
      }}
      aria-labelledby="testimonials-heading"
    >
      {/* Decorative ambient emerald & gold glow */}
      <div
        className="absolute top-0 right-1/4 w-[600px] h-[600px] rounded-full bg-[#174D3B]/20 blur-[150px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-0 left-10 w-[450px] h-[450px] rounded-full bg-caramel-500/10 blur-[130px] pointer-events-none"
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
        {/* Top Header Section */}
        <div
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-emerald-800/50"
          style={{ paddingBottom: '2.5rem' }}
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-caramel-400" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-caramel-400 font-bold">
                [ 04 — CLIENT VERIFICATIONS ]
              </span>
            </div>
            <h2
              id="testimonials-heading"
              className="text-heading-xl text-white font-normal leading-tight tracking-tight uppercase"
            >
              Worn With Pride
              <br />
              <span className="font-display italic font-light text-caramel-300">
                Across Europe
              </span>
            </h2>
          </div>

          {/* Social Proof Aggregate Badge */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 lg:items-end shrink-0">
            <div className="flex flex-col gap-1 sm:items-end">
              <div className="flex items-center gap-3">
                <StarRating rating={5} size="md" />
                <span className="font-display text-2xl font-bold text-white leading-none">
                  4.95 / 5.0
                </span>
              </div>
              <p className="text-[10px] font-body tracking-[0.2em] uppercase text-emerald-200/80 font-medium">
                150+ Bespoke Patrons across Italy, UK &amp; Germany
              </p>
            </div>

            <span className="hidden sm:block w-px h-10 bg-emerald-800/80" aria-hidden="true" />

            <Link
              href="/catalogue"
              className="inline-flex items-center gap-2 rounded-full border border-caramel-400/40 hover:border-caramel-400 text-caramel-300 hover:text-white font-body text-xs tracking-widest uppercase font-semibold transition-all backdrop-blur-sm"
              style={{ padding: '0.65rem 1.5rem' }}
            >
              View All Reviews &rarr;
            </Link>
          </div>
        </div>

        {/* 3-Column Testimonial Cards on Emerald Surface */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginTop: '3rem' }}>
          {testimonials.map((t, idx) => (
            <figure
              key={t.name}
              className={`relative rounded-3xl bg-[#0D2D23]/80 backdrop-blur-md border border-emerald-700/50 flex flex-col justify-between gap-6 transition-all duration-500 hover:border-caramel-400/60 hover:bg-[#12382C] group shadow-xl ${
                idx === 1 ? 'md:-translate-y-3' : ''
              }`}
              style={{ padding: 'clamp(1.75rem, 3vw, 2.25rem)' }}
            >
              {/* Giant decorative quotation mark */}
              <div
                className="absolute top-4 right-7 text-emerald-500/10 font-display text-[7rem] leading-none select-none pointer-events-none transition-colors duration-500 group-hover:text-caramel-400/15"
                aria-hidden="true"
              >
                “
              </div>

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <StarRating rating={t.rating} size="sm" />
                  <span className="text-[9px] font-body tracking-widest uppercase font-bold text-caramel-400 bg-[#071A14]/80 px-2.5 py-1 rounded-full border border-emerald-700/60">
                    {t.event}
                  </span>
                </div>

                <blockquote className="font-display italic text-lg sm:text-xl text-cream-100 leading-relaxed">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
              </div>

              <figcaption className="flex items-center gap-3.5 pt-6 border-t border-emerald-800/60 relative z-10">
                {/* Monogram circle */}
                <div
                  className="w-11 h-11 rounded-full bg-[#061711] border border-caramel-500/50 flex items-center justify-center flex-shrink-0 transition-colors group-hover:border-caramel-400 shadow-md"
                  aria-hidden="true"
                >
                  <span className="text-caramel-300 font-body font-bold text-xs tracking-wider">
                    {t.initials}
                  </span>
                </div>

                <div>
                  <p className="font-body text-xs font-bold text-white tracking-wider uppercase">
                    {t.name}
                  </p>
                  <p className="font-body text-[11px] text-emerald-200/80 mt-0.5 font-medium">
                    {t.location}
                  </p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials