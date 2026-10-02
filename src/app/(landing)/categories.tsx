import Image from 'next/image'
import Link from 'next/link'

const categoriesList = [
  {
    num: '01',
    code: 'CUSTOM NATIVE',
    title: 'Native Wear',
    subtitle: 'Agbada · Senator · Kaftan · Babban Riga',
    href: '/catalogue?category=native-wear',
    image: '/images/category-native.jpeg',
    badge: 'Signature Heritage',
    colSpan: 'md:col-span-8',
  },
  {
    num: '02',
    code: 'AFRICAN ACCENTS',
    title: 'Fabric Accessories',
    subtitle: 'Ankara Ties · Beaded Cufflinks · Pocket Squares · Caps',
    href: '/catalogue?category=accessories',
    image: '/images/category-accessories.jpg',
    badge: 'Ankara & Coral',
    colSpan: 'md:col-span-4',
  },
  {
    num: '03',
    code: 'SMART CASUAL',
    title: 'Casual Wear',
    subtitle: 'Everyday Linens · Smart Tunics',
    href: '/catalogue?category=casual',
    image: '/images/category-casual.jpg',
    badge: 'Modern Relaxed',
    colSpan: 'md:col-span-4',
  },
  {
    num: '04',
    code: 'KIDS & TEENS',
    title: "Children's Wear",
    subtitle: 'Bespoke Native & Senator Sets',
    href: '/catalogue?category=children',
    image: '/images/category-children.jpg',
    badge: 'Family Ensemble',
    colSpan: 'md:col-span-8',
  },
]

const Categories = () => {
  return (
    <section
      className="bg-[#FAF6F0] text-[#140C07] relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
      }}
      aria-labelledby="collections-heading"
    >
      {/* Decorative subtle linen watermark */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-caramel-500/5 rounded-full blur-3xl pointer-events-none" />

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
        {/* Top Editorial Eyebrow & Headline — matching reference section 2 */}
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end border-b border-[#E6DDD0]"
          style={{ paddingBottom: '2.5rem' }}
        >
          {/* Left Column: Eyebrow + Big headline */}
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="w-6 h-px bg-terracotta-500" />
              <span className="font-body text-[11px] tracking-[0.25em] uppercase text-terracotta-600 font-bold">
                [ 01 — ATELIER COLLECTIONS ]
              </span>
            </div>
            <h2
              id="collections-heading"
              className="text-heading-xl !text-[#140C07] font-normal leading-[1.02] tracking-tight uppercase"
            >
              Built For Those
              <br />
              <span className="font-display italic font-light text-caramel-600">
                Who Choose Differently
              </span>
            </h2>
          </div>

          {/* Right Column: Description + Dual-tone action pill */}
          <div className="lg:col-span-5 flex flex-col items-start lg:items-end justify-between gap-6">
            <p className="font-body text-sm md:text-base text-[#52453B] leading-relaxed max-w-md lg:text-right">
              From hand-selected Nigerian fabrics to precision European cuts, every garment is custom-tailored to your exact silhouette and delivered to your doorstep.
            </p>

            <Link
              href="/catalogue"
              className="group inline-flex items-center gap-3 rounded-full bg-[#180E07] hover:bg-black text-white transition-all duration-300 shadow-md"
              style={{ padding: '0.45rem 0.5rem 0.45rem 1.5rem' }}
            >
              <span className="font-body text-[11px] tracking-[0.18em] uppercase font-bold text-cream-100">
                Explore All Designs
              </span>
              <div className="w-8 h-8 rounded-full bg-caramel-500 group-hover:bg-caramel-400 flex items-center justify-center text-brown-950 transition-transform duration-300 group-hover:translate-x-0.5">
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
        </div>

        {/* Feature Micro-Bar (Directly inspired by reference layout) */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E6DDD0] text-xs font-body text-[#6E5F52]"
          style={{ paddingTop: '1.25rem', paddingBottom: '1.25rem', marginBottom: '2.5rem' }}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-700" />
            <span className="tracking-wider uppercase font-semibold text-[#140C07]">Global Sourcing:</span>
            <span>Premium Nigerian Voiles, Cashmeres &amp; Italian Silks</span>
          </div>

          <div className="flex items-center gap-6">
            <span
              className="tracking-widest uppercase text-[10px] font-bold text-terracotta-600 bg-terracotta-50 rounded-full border border-terracotta-200"
              style={{ padding: '0.25rem 0.75rem' }}
            >
              Hand-Inspected On Video
            </span>
            <div className="hidden sm:flex items-center gap-1.5 text-stone-400">
              <span className="w-6 h-6 rounded-full border border-[#D5CABE] flex items-center justify-center text-[10px] text-[#140C07] font-bold">
                &larr;
              </span>
              <span className="w-6 h-6 rounded-full bg-[#180E07] text-white flex items-center justify-center text-[10px] font-bold">
                &rarr;
              </span>
            </div>
          </div>
        </div>

        {/* Grid Layout — Interlocking Editorial Cards with rounded corners & clean borders */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6" style={{ marginTop: '1rem' }}>
          {categoriesList.map((cat) => (
            <Link
              key={cat.code}
              href={cat.href}
              className={`${cat.colSpan} group relative block h-[380px] md:h-[460px] rounded-3xl overflow-hidden shadow-lg border border-[#E3D9CC] bg-[#EDE4D6] transition-all duration-500 hover:shadow-2xl hover:border-caramel-500/50`}
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.05]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />

              {/* Multi-layered cinematic gradient */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#140C07]/90 via-[#140C07]/30 to-transparent"
                aria-hidden="true"
              />

              {/* Top Tag & Code */}
              <div
                className="absolute top-6 inset-x-6 z-10 flex items-center justify-between"
                style={{ padding: '0 0.5rem' }}
              >
                <span
                  className="rounded-full bg-white/90 backdrop-blur-md text-[#140C07] font-body text-[10px] tracking-[0.2em] font-bold uppercase shadow-sm"
                  style={{ padding: '0.3rem 0.75rem' }}
                >
                  {cat.num} — {cat.code}
                </span>
                <span
                  className="rounded-full bg-[#140C07]/75 backdrop-blur-md text-caramel-300 font-body text-[10px] tracking-widest uppercase font-semibold"
                  style={{ padding: '0.3rem 0.75rem' }}
                >
                  {cat.badge}
                </span>
              </div>

              {/* Bottom Label Content */}
              <div
                className="absolute bottom-0 inset-x-0 z-10 flex items-end justify-between transition-transform duration-500 group-hover:translate-y-[-4px]"
                style={{ padding: '1.75rem' }}
              >
                <div>
                  <h3 className="font-display text-2xl md:text-3xl text-white font-bold tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="font-body text-xs md:text-sm text-stone-200 mt-1">
                    {cat.subtitle}
                  </p>
                </div>

                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white transition-all duration-300 group-hover:bg-caramel-500 group-hover:text-brown-950 group-hover:border-caramel-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories