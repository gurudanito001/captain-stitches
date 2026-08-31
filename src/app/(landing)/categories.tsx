import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow';

const Categories = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
            2. EDITORIAL CATEGORY GRID
            Asymmetric grid: interlocking 2x2 grid system.
            Directly mirrors the Norven suits/tops/bottoms grid section.
        ══════════════════════════════════════════════════════════════════ */}
      <section className="bg-brown-900 section-y" aria-labelledby="collections-heading">
        <div className="container-brand">

          {/* Header section — clean editorial layout */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-brown-850">
            <div className="max-w-xl">
              <SectionEyebrow label="Collections" />
              <h2 id="collections-heading" className="text-heading-xl text-cream-200 mt-2 font-normal">
                Curated styles<br className="hidden sm:block" /> for every occasion
              </h2>
            </div>
            <div className="max-w-md lg:text-right flex flex-col lg:items-end gap-5">
              <p className="text-body text-stone-300">
                Every piece is built around you — from fabric selection to the
                final stitch, clothing that fits your body, your occasion, and
                your identity. Crafted in Nigeria and delivered across Europe.
              </p>
              <Button href="/catalogue" variant="accent" size="sm" style={{ marginBottom: '12px' }}>
                Explore all designs
              </Button>
            </div>
          </div>

          {/* Grid Layout — Interlocking asymmetrical grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 md:mt-16">

            {/* Large block — Native Wear (Row 1, Cols 1-2) */}
            <Link
              href="/catalogue?category=native-wear"
              className="img-overlay md:col-span-2 relative block h-[320px] md:h-[450px] group overflow-hidden"
              aria-label="Browse native wear collection"
            >
              <Image
                src="/images/category-native.jpeg"
                alt="Nigerian native wear — agbada, senator, kaftan"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute top-6 right-6 z-10 font-body text-[10px] tracking-[0.2em] text-cream-300/80 font-medium">
                01 — CUSTOM NATIVE
              </div>
              <div className="img-overlay-label transition-transform duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-heading-lg text-cream-100 font-bold">
                  Native Wear
                </h3>
                <p className="text-label mt-2 text-stone-300">
                  Agbada · Senator · Kaftan · Babban Riga
                </p>
              </div>
            </Link>

            {/* Small block — English Suits (Row 1, Col 3) */}
            <Link
              href="/catalogue?category=english-suit"
              className="img-overlay block h-[320px] md:h-[450px] group overflow-hidden"
              aria-label="Browse English suits collection"
            >
              <Image
                src="/images/category-suits.jpg"
                alt="English suits and corporate wear"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute top-6 right-6 z-10 font-body text-[10px] tracking-[0.2em] text-cream-300/80 font-medium">
                02 — BESPOKE SUITS
              </div>
              <div className="img-overlay-label transition-transform duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-heading-md text-cream-100 font-bold uppercase tracking-tight">
                  English Suits
                </h3>
                <p className="text-label mt-2 text-stone-300">
                  Business · Tuxedo · 3-piece
                </p>
              </div>
            </Link>

            {/* Small block — Casual (Row 2, Col 1) */}
            <Link
              href="/catalogue?category=casual"
              className="img-overlay block h-[320px] md:h-[450px] group overflow-hidden"
              aria-label="Browse casual wear collection"
            >
              <Image
                src="/images/category-casual.jpg"
                alt="Casual and smart casual clothing"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute top-6 right-6 z-10 font-body text-[10px] tracking-[0.2em] text-cream-300/80 font-medium">
                03 — SMART CASUAL
              </div>
              <div className="img-overlay-label transition-transform duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-heading-md text-cream-100 font-bold uppercase tracking-tight">
                  Casual Wear
                </h3>
                <p className="text-label mt-2 text-stone-300">
                  Everyday · Smart casual
                </p>
              </div>
            </Link>

            {/* Large block — Children's Wear (Row 2, Cols 2-3) */}
            <Link
              href="/catalogue?category=children"
              className="img-overlay md:col-span-2 relative block h-[320px] md:h-[450px] group overflow-hidden"
              aria-label="Browse children collection"
            >
              <Image
                src="/images/category-children.jpg"
                alt="Bespoke children's native and casual outfits"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute top-6 right-6 z-10 font-body text-[10px] tracking-[0.2em] text-cream-300/80 font-medium">
                04 — KIDS & TEENS
              </div>
              <div className="img-overlay-label transition-transform duration-500 group-hover:translate-y-[-4px]">
                <h3 className="text-heading-lg text-cream-100 font-bold">
                  Children's Wear
                </h3>
                <p className="text-label mt-2 text-stone-300">
                  Bespoke Native · Kaftan · Senator outfits for kids
                </p>
              </div>
            </Link>

          </div>

        </div>
      </section>
    </>
  )
}

export default Categories;