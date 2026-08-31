import Image from 'next/image'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'

export const metadata = {
  title: 'Our Story — About CaptainStitches',
  description: 'Learn about Samuelson Anaele\'s vision, our dual operations in Italy and Nigeria, and the craft of our tailors.',
}

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pb-24" style={{ paddingTop: "150px" }}>
        <div className="container-brand">

          {/* Hero Section — Clean borderless header */}
          <section className="pb-12" style={{ marginBottom: "64px" }}>
            <SectionEyebrow label="About the Brand" />
            <h1 className="text-heading-xl text-cream-200 mt-2 font-normal">
              Our Story &amp;<br />Heritage
            </h1>
            <p className="text-body text-stone-300 mt-4 max-w-xl">
              Bespoke garments connecting cultures. From fabric selection and measurement validation in Italy to master craftsmanship in Nigeria.
            </p>
          </section>

          {/* Founder's Story — Increased spacing, no borders */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center" style={{ marginBottom: "96px" }}>
            <div className="lg:col-span-6 relative h-[400px] md:h-[500px] bg-brown-950">
              <Image
                src="/images/blog-bespoke.jpg"
                alt="Samuelson Anaele reviewing fabrics"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div className="lg:col-span-6 flex flex-col gap-6">
              <span className="text-label text-caramel-500 font-bold">The Founder</span>
              <h2 className="text-heading-lg text-cream-200 font-normal">
                Samuelson Anaele's Vision
              </h2>
              <div className="font-body text-stone-300 text-sm leading-relaxed flex flex-col gap-4">
                <p>
                  Founded by Samuelson Anaele, CaptainStitches was born out of a desire to address a common problem faced by Nigerians living in Europe: access to high-quality, authentic traditional attires without the stress and uncertainty of informal logistics.
                </p>
                <p>
                  Splitting his time between Verona, Italy, and Nigeria, Samuelson envisioned a platform that bridges the gap. By combining premium European service standards and strict measurement verification with the peerless heritage tailoring found in Lagos and Aba, CaptainStitches delivers garments that command respect.
                </p>
                <p>
                  "We don't just make clothes; we preserve identity. Every Agbada, Senator, and Suit we craft tells a story of pride, fit precision, and cultural history."
                </p>
              </div>
            </div>
          </section>

          {/* Dual-Location Showcase — Flat background, borderless cards */}
          <section className="p-8 md:p-12 lg:p-16 bg-brown-950/20" style={{ marginBottom: "96px" }}>
            <div className="text-center mb-12 max-w-xl mx-auto">
              <span className="text-label text-caramel-500 font-bold">Dual Operations</span>
              <h2 className="text-heading-md text-cream-200 mt-2 font-normal">
                Crafted in Nigeria, Delivered Across Europe
              </h2>
              <p className="text-body text-stone-400 text-xs mt-3">
                How our unique logistics model ensures speed, fabric quality, and fitting accuracy.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
              {/* Italy */}
              <div className="p-8 bg-brown-950/40 flex flex-col gap-3">
                <span className="text-caramel-500 font-semibold tracking-wider text-[10px] uppercase">
                  Verona, Italy — Showroom &amp; Fit
                </span>
                <h3 className="font-display text-lg font-bold text-cream-100">
                  Design &amp; Measurement Validation
                </h3>
                <p className="text-body text-stone-400 text-xs leading-relaxed">
                  Our European presence handles all styling consultations, physical sample viewing, and measurement verifications. Every custom order is reviewed in Verona before production instructions are dispatched to ensure compliance with European tailoring standards.
                </p>
              </div>

              {/* Nigeria */}
              <div className="p-8 bg-brown-950/40 flex flex-col gap-3">
                <span className="text-caramel-500 font-semibold tracking-wider text-[10px] uppercase">
                  Lagos &amp; Aba, Nigeria — Workshop
                </span>
                <h3 className="font-display text-lg font-bold text-cream-100">
                  Sourcing &amp; Master Tailoring
                </h3>
                <p className="text-body text-stone-400 text-xs leading-relaxed">
                  Our main tailoring workshops are located in Lagos and Aba—the hearts of Nigerian textile craftsmanship. Here, our master tailors source dense cashmeres, heavy polished cottons, and perform the intricate hand-guided embroidery unique to authentic native wear.
                </p>
              </div>
            </div>
          </section>

          {/* Meet the Tailors — Borderless layout */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center" style={{ marginBottom: "96px" }}>
            <div className="lg:col-span-6 lg:order-2 relative h-[400px] md:h-[500px] bg-brown-950">
              <Image
                src="/images/blog-suit-senator.jpg"
                alt="Bespoke tailors at work in Aba"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
              />
            </div>
            <div className="lg:col-span-6 lg:order-1 flex flex-col gap-6">
              <span className="text-label text-caramel-500 font-bold">The Craftsmen</span>
              <h2 className="text-heading-lg text-cream-200 font-normal">
                Celebrating Our Tailoring Team
              </h2>
              <div className="font-body text-stone-300 text-sm leading-relaxed flex flex-col gap-4">
                <p>
                  At CaptainStitches, our tailors are not employees; they are artisans and co-creators. We employ master tailors in Aba and Lagos, many of whom have spent over two decades perfecting the art of freehand pattern cutting and intricate geometric embroidery.
                </p>
                <p>
                  Every garment undergoes a rigorous three-step quality inspection checklist. Before an outfit leaves the workshop, it is draped on a measurement dummy and recorded in a 4K inspection video, ensuring that seams, stitching, and linings are flawless.
                </p>
                <p>
                  We are proud to support local talent in Nigeria, providing ethical working environments, fair compensation, and preserving traditional craftsmanship techniques.
                </p>
              </div>
            </div>
          </section>

          {/* Brand Values — Flat cards, increased padding */}
          <section className="text-center" style={{ marginBottom: "96px" }}>
            <span className="text-label text-caramel-500 font-bold block mb-4">Our Values</span>
            <h2 className="text-heading-md text-cream-200 font-normal mb-12">
              The Principles That Bind Us
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              {/* Heritage */}
              <div className="p-8 bg-brown-950/20 flex flex-col gap-3">
                <h4 className="font-display text-base font-bold text-cream-100">01 / Heritage</h4>
                <p className="text-body text-stone-400 text-xs leading-relaxed">
                  Preserving cultural pride by keeping traditional embroidery, fabric aesthetics, and design silhouettes authentic.
                </p>
              </div>

              {/* Fit Accuracy */}
              <div className="p-8 bg-brown-950/20 flex flex-col gap-3">
                <h4 className="font-display text-base font-bold text-cream-100">02 / Fit Accuracy</h4>
                <p className="text-body text-stone-400 text-xs leading-relaxed">
                  Eliminating structural guess-work through illustrative measuring guides and dual check-points in Europe and Nigeria.
                </p>
              </div>

              {/* Quality First */}
              <div className="p-8 bg-brown-950/20 flex flex-col gap-3">
                <h4 className="font-display text-base font-bold text-cream-100">03 / Quality First</h4>
                <p className="text-body text-stone-400 text-xs leading-relaxed">
                  Rejecting light synthetic mixes in favor of heavy cashmeres, pure wools, and dense polished cottons that stand the test of time.
                </p>
              </div>

              {/* Transparency */}
              <div className="p-8 bg-brown-950/20 flex flex-col gap-3">
                <h4 className="font-display text-base font-bold text-cream-100">04 / Transparency</h4>
                <p className="text-body text-stone-400 text-xs leading-relaxed">
                  Eliminating customer anxiety with real-time stepper tracking, estimated dates, and tailor inspection videos.
                </p>
              </div>
            </div>
          </section>

          {/* Bottom CTA — Premium Editorial Callout Card */}
          <div className="mx-auto p-10 md:p-16 bg-brown-950/40 text-center flex flex-col items-center gap-6" style={{ marginTop: "120px", marginBottom: "50px", padding: "50px 0px" }}>
            <span className="text-label text-caramel-500 font-bold">Experience Bespoke Luxury</span>
            <h3 className="font-display text-2xl md:text-3xl text-cream-200 font-normal max-w-xl leading-snug">
              Uncompromising fit. Culturally authentic. Delivered to Europe.
            </h3>
            <p className="text-body text-stone-400 text-xs max-w-md leading-relaxed">
              Explore our collection of hand-crafted native senator wear, agbadas, and English suits, or start a direct custom measurement order today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Button href="/catalogue" variant="primary" size="lg" className="w-full sm:w-auto" style={{ padding: '12px 5px' }}>
                Browse Catalogue
              </Button>
              <Button href="/order" variant="outline" size="lg" className="w-full sm:w-auto" style={{ padding: '12px 5px' }}>
                Order Custom Piece
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
