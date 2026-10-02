import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'

export const metadata = {
  title: 'Our Story — Heritage & Master Tailoring | CaptainStitches',
  description:
    "Learn about Samuelson Anaele's vision, our dual operations in Verona and Nigeria, and the generational craft of our master artisans.",
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="w-full overflow-hidden bg-[#0C0704]">
        {/* ─── 01: HERO SECTION (Deep Obsidian & Framing) ────────────────────── */}
        <section
          className="relative text-cream-100 overflow-hidden border-b border-brown-800/60"
          style={{
            width: '100%',
            paddingTop: 'clamp(7rem, 12vw, 9.5rem)',
            paddingBottom: 'clamp(4rem, 8vw, 6rem)',
          }}
        >
          {/* Subtle warm ambient glow */}
          <div
            className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full bg-caramel-500/10 blur-[140px] pointer-events-none"
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
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 mb-4">
                <span className="w-6 h-px bg-caramel-400" />
                <span className="font-body text-[11px] tracking-[0.25em] uppercase text-caramel-400 font-bold">
                  [ 01 — OUR HERITAGE &amp; ORIGIN ]
                </span>
              </div>
              <h1
                className="text-display text-cream-100 font-display font-bold leading-[0.95] tracking-tight uppercase"
                style={{ fontSize: 'clamp(2.75rem, 6vw, 5.5rem)' }}
              >
                Connecting Worlds.
                <br />
                <span className="italic font-light text-caramel-300">
                  Preserving Pride.
                </span>
              </h1>
              <p
                className="font-body text-sm sm:text-base text-stone-300 leading-relaxed"
                style={{ marginTop: '1.5rem', maxWidth: '620px' }}
              >
                Bespoke garments connecting cultures. From fabric selection and measurement validation in Italy to master craftsmanship in Lagos and Aba, every stitch honors authentic Nigerian sartorial heritage.
              </p>
            </div>
          </div>
        </section>

        {/* ─── 02: FOUNDER'S STORY (Luminous Warm Alabaster) ────────────────── */}
        <section
          className="bg-[#FAF6F0] text-[#140C07] relative overflow-hidden"
          style={{
            width: '100%',
            paddingTop: 'clamp(4rem, 8vw, 6rem)',
            paddingBottom: 'clamp(4rem, 8vw, 6rem)',
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Founder Image */}
              <div className="lg:col-span-6 relative h-[420px] sm:h-[520px] rounded-3xl overflow-hidden shadow-2xl border border-[#E2D8CA] bg-[#EAE2D5]">
                <Image
                  src="/images/blog-bespoke.jpg"
                  alt="Samuelson Anaele reviewing textiles"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140C07]/80 via-transparent to-transparent" />
                <div
                  className="absolute bottom-6 inset-x-6 text-white"
                  style={{ padding: '0 0.5rem' }}
                >
                  <span className="font-body text-[10px] tracking-widest uppercase font-bold text-caramel-400 block">
                    Founder &amp; Creative Director
                  </span>
                  <p className="font-display text-2xl font-bold">
                    Samuelson Anaele
                  </p>
                </div>
              </div>

              {/* Founder Text */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-5 h-px bg-terracotta-500" />
                    <span className="font-body text-[10px] tracking-[0.25em] uppercase text-terracotta-600 font-bold">
                      [ 02 — THE VISION ]
                    </span>
                  </div>

                  <h2 className="text-heading-xl !text-[#140C07] font-normal leading-tight tracking-tight uppercase">
                    Born Between
                    <br />
                    <span className="font-display italic font-light text-caramel-600">
                      Verona &amp; Lagos
                    </span>
                  </h2>

                  <div
                    className="font-body text-[#52453B] text-sm md:text-base leading-relaxed flex flex-col gap-4"
                    style={{ marginTop: '1.25rem' }}
                  >
                    <p>
                      CaptainStitches was born out of a desire to eliminate a common frustration experienced by Africans living across Europe: accessing authentic, high-grade traditional native attires without stressful delays, ill-fitting cuts, or unreliable logistics.
                    </p>
                    <p>
                      Splitting his time between Verona, Italy, and Nigeria, Samuelson envisioned a luxury service bridging both continents. By combining European customer care, transparent pricing, and rigorous video sign-offs with generational craftsmanship in Aba and Lagos, CaptainStitches crafts garments that command immediate respect.
                    </p>
                  </div>
                </div>

                <div
                  className="rounded-2xl border-l-4 border-caramel-500 bg-[#F3ECE1] text-[#140C07]"
                  style={{ padding: '1.25rem 1.5rem', marginTop: '2rem' }}
                >
                  <p className="font-display italic text-base sm:text-lg text-[#2A1D13] leading-snug">
                    &ldquo;We don't just assemble fabrics; we preserve identity. Every Agbada, Senator, and African fabric accessory we craft carries the dignity of culture and the precision of fine tailoring.&rdquo;
                  </p>
                  <span
                    className="font-body text-[10px] tracking-widest uppercase font-bold text-stone-600 block"
                    style={{ marginTop: '0.5rem' }}
                  >
                    — Samuelson Anaele
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 03: DUAL OPERATIONS (Royal Heritage Emerald Inset Card) ─────── */}
        <section
          className="bg-[#FAF6F0] relative overflow-hidden"
          style={{
            width: '100%',
            paddingBottom: 'clamp(4rem, 8vw, 6rem)',
            paddingLeft: 'clamp(1rem, 3vw, 2rem)',
            paddingRight: 'clamp(1rem, 3vw, 2rem)',
            boxSizing: 'border-box',
          }}
        >
          <div
            className="rounded-[2.5rem] md:rounded-[3.5rem] bg-[#071A14] border border-emerald-700/60 shadow-2xl relative overflow-hidden text-cream-100"
            style={{
              maxWidth: '1400px',
              marginLeft: 'auto',
              marginRight: 'auto',
              padding: 'clamp(2rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            {/* Emerald ambient blur */}
            <div
              className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#174D3B]/20 blur-[130px] pointer-events-none"
              aria-hidden="true"
            />

            <div
              className="relative z-10 border-b border-emerald-800/60"
              style={{ paddingBottom: '2rem', marginBottom: '2.5rem' }}
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-caramel-400" />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-caramel-400 font-bold">
                  [ 03 — DUAL HUBS ]
                </span>
              </div>
              <h2 className="text-heading-xl text-white font-normal leading-tight tracking-tight uppercase">
                Bridging Continents:
                <br />
                <span className="font-display italic font-light text-caramel-300">
                  Verona To Aba
                </span>
              </h2>
              <p
                className="font-body text-xs sm:text-sm text-emerald-200/80 max-w-xl"
                style={{ marginTop: '0.75rem' }}
              >
                How our cross-continental logistics pipeline ensures fitting accuracy, premium fabric integrity, and direct European doorstep arrival.
              </p>
            </div>

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Verona Hub */}
              <div
                className="rounded-3xl bg-[#0D2D23]/80 border border-emerald-700/50 backdrop-blur-md flex flex-col justify-between"
                style={{ padding: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                <div>
                  <span
                    className="inline-block rounded-full bg-[#061711] border border-caramel-500/40 text-caramel-300 font-body text-[10px] tracking-widest uppercase font-bold"
                    style={{ padding: '0.3rem 0.75rem', marginBottom: '1.25rem' }}
                  >
                    Verona, Italy 🇮🇹
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Client Fit &amp; Measurement Validation
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Our European base oversees initial client consultations, sizing validations, and delivery logistics. Every commission is cross-checked against our precision fitting guide before production begins, ensuring garments comply with European bespoke standards.
                  </p>
                </div>
                <div
                  className="border-t border-emerald-800/60 flex items-center justify-between text-xs font-body text-emerald-200/70"
                  style={{ paddingTop: '1.25rem', marginTop: '1.75rem' }}
                >
                  <span>European Express Hub</span>
                  <span className="text-caramel-400 font-bold">Direct Dispatch</span>
                </div>
              </div>

              {/* Nigeria Hub */}
              <div
                className="rounded-3xl bg-[#0D2D23]/80 border border-emerald-700/50 backdrop-blur-md flex flex-col justify-between"
                style={{ padding: 'clamp(1.75rem, 3vw, 2.5rem)' }}
              >
                <div>
                  <span
                    className="inline-block rounded-full bg-[#061711] border border-caramel-500/40 text-caramel-300 font-body text-[10px] tracking-widest uppercase font-bold"
                    style={{ padding: '0.3rem 0.75rem', marginBottom: '1.25rem' }}
                  >
                    Lagos &amp; Aba, Nigeria 🇳🇬
                  </span>
                  <h3 className="font-display text-2xl font-bold text-white mb-2">
                    Textile Sourcing &amp; Master Tailoring
                  </h3>
                  <p className="font-body text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    Our primary workshops sit at the heart of Nigerian textile craftsmanship. Master artisans hand-cut rich cashmeres, heavy polished cottons, and execute the intricate geometric chest embroideries unique to authentic Nigerian native attires.
                  </p>
                </div>
                <div
                  className="border-t border-emerald-800/60 flex items-center justify-between text-xs font-body text-emerald-200/70"
                  style={{ paddingTop: '1.25rem', marginTop: '1.75rem' }}
                >
                  <span>Atelier Workshops</span>
                  <span className="text-caramel-400 font-bold">100% Hand-Finished</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 04: CRAFTSMEN SPOTLIGHT (Warm Sand Bento) ────────────────────── */}
        <section
          className="bg-[#F7F3EB] text-[#140C07] relative overflow-hidden"
          style={{
            width: '100%',
            paddingTop: 'clamp(4rem, 8vw, 6rem)',
            paddingBottom: 'clamp(4rem, 8vw, 6rem)',
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Text Left */}
              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-2 mb-3">
                    <span className="w-5 h-px bg-terracotta-500" />
                    <span className="font-body text-[10px] tracking-[0.25em] uppercase text-terracotta-600 font-bold">
                      [ 04 — THE ARTISANS ]
                    </span>
                  </div>

                  <h2 className="text-heading-xl !text-[#140C07] font-normal leading-tight tracking-tight uppercase">
                    Celebrating Our
                    <br />
                    <span className="font-display italic font-light text-caramel-600">
                      Master Tailors
                    </span>
                  </h2>

                  <div
                    className="font-body text-[#52453B] text-sm md:text-base leading-relaxed flex flex-col gap-4"
                    style={{ marginTop: '1.25rem' }}
                  >
                    <p>
                      At CaptainStitches, our tailors are not factory workers; they are revered artisans and co-creators. We employ master tailors in Aba and Lagos, many of whom have spent over two decades perfecting freehand pattern drafting and intricate embroidery symmetry.
                    </p>
                    <p>
                      Every piece undergoes a strict three-tier verification process: seam integrity check, mannequin drape validation, and a high-definition 4K video inspection that is shared with the client before courier dispatch.
                    </p>
                    <p>
                      We are proud to provide ethical workshop conditions, fair compensation, and dedicated platforms for African talent to shine on the world stage.
                    </p>
                  </div>
                </div>
              </div>

              {/* Image Right */}
              <div className="lg:col-span-6 relative h-[420px] sm:h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-[#E2D8CA] bg-[#EAE2D5]">
                <Image
                  src="/images/blog-suit-senator.jpg"
                  alt="Artisans at work in the workshop"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#140C07]/80 via-transparent to-transparent" />
                <div
                  className="absolute bottom-6 inset-x-6 text-white"
                  style={{ padding: '0 0.5rem' }}
                >
                  <span className="font-body text-[10px] tracking-widest uppercase font-bold text-caramel-400 block">
                    Workshop Bench
                  </span>
                  <p className="font-display text-2xl font-bold">
                    Generational Needlecraft
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── 05: VALUES BENTO (Deep Obsidian Inset) ───────────────────────── */}
        <section
          className="bg-[#0C0704] text-cream-100 relative overflow-hidden"
          style={{
            width: '100%',
            paddingTop: 'clamp(4rem, 8vw, 6rem)',
            paddingBottom: 'clamp(4rem, 8vw, 6rem)',
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
            <div className="text-center max-w-2xl mx-auto" style={{ marginBottom: '3.5rem' }}>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-caramel-400" />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-caramel-400 font-bold">
                  [ 05 — CORE PILLARS ]
                </span>
                <span className="w-5 h-px bg-caramel-400" />
              </div>
              <h2 className="text-heading-xl text-white font-normal leading-tight tracking-tight uppercase">
                The Principles That
                <br />
                <span className="font-display italic font-light text-caramel-400">
                  Bind Our Craft
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  code: '01',
                  title: 'Cultural Heritage',
                  body: 'Preserving authentic Nigerian silhouettes, traditional embroideries, and dignified native ceremonial wear.',
                },
                {
                  code: '02',
                  title: 'Precision Fitting',
                  body: 'Eliminating guess-work with illustrative measurement guidance and dual validation in Italy and Nigeria.',
                },
                {
                  code: '03',
                  title: 'Dense Textiles',
                  body: 'Zero synthetic blends. We curate heavy cashmeres, pure wools, and dense polished cottons that stand the test of time.',
                },
                {
                  code: '04',
                  title: 'Total Transparency',
                  body: 'Full stage tracking, video sign-off before dispatch, and direct WhatsApp communication throughout your build.',
                },
              ].map((val) => (
                <div
                  key={val.code}
                  className="rounded-3xl bg-[#140D08]/90 border border-brown-800/80 flex flex-col justify-between hover:border-caramel-500/50 hover:bg-[#1A110A] transition-all duration-300 shadow-xl group"
                  style={{ padding: '1.75rem' }}
                >
                  <div>
                    <span className="font-display text-2xl font-bold text-caramel-400/60 group-hover:text-caramel-400 transition-colors block mb-4">
                      {val.code}
                    </span>
                    <h3 className="font-display text-xl font-bold text-white group-hover:text-caramel-300 transition-colors mb-2">
                      {val.title}
                    </h3>
                  </div>
                  <p className="font-body text-xs sm:text-sm text-stone-300 leading-relaxed mt-2">
                    {val.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Invitation Callout */}
            <div
              className="rounded-[2.5rem] bg-[#FAF6F0] text-[#140C07] text-center shadow-2xl relative overflow-hidden"
              style={{
                marginTop: '4rem',
                padding: 'clamp(2.5rem, 5vw, 4rem)',
              }}
            >
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-5 h-px bg-terracotta-500" />
                <span className="font-body text-[10px] tracking-[0.25em] uppercase text-terracotta-600 font-bold">
                  [ 06 — EXPERIENCE THE FIT ]
                </span>
                <span className="w-5 h-px bg-terracotta-500" />
              </div>
              <h3 className="font-display text-2xl sm:text-4xl !text-[#140C07] font-normal uppercase max-w-xl mx-auto leading-snug">
                Uncompromising fit. Culturally authentic. Delivered to Europe.
              </h3>
              <p
                className="font-body text-sm text-[#5C4F44] max-w-md mx-auto leading-relaxed"
                style={{ marginTop: '1rem', marginBottom: '2rem' }}
              >
                Explore our collection of custom native Senators, Agbadas, and African fabric accessories, or commission a direct bespoke order with our master tailors.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/catalogue"
                  className="rounded-full bg-[#180E07] hover:bg-black text-white font-body text-xs tracking-widest uppercase font-bold transition-all shadow-md"
                  style={{ padding: '0.85rem 2rem' }}
                >
                  Browse Catalogue
                </Link>
                <Link
                  href="/order"
                  className="rounded-full border border-[#D1C5B5] hover:border-[#140C07] text-[#140C07] font-body text-xs tracking-widest uppercase font-semibold transition-all"
                  style={{ padding: '0.85rem 2rem' }}
                >
                  Commission Bespoke Piece &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
