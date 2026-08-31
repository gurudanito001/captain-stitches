import Image from 'next/image';
import { Button } from '@/components/ui/Button'

const Hero = () => {
  return (
    <section
      className="relative w-full overflow-hidden bg-brown-950"
      style={{ minHeight: '97svh' }}
      aria-label="Hero — CaptainStitches bespoke fashion"
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-x-0 bottom-0 top-16 md:top-20">
        <Image
          src="/images/hero-bg.jpeg"
          alt="Three men in bespoke Nigerian and European fashion by CaptainStitches"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        {/* Gradient: subtle top, heavy bottom */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(17,9,4,0.45) 0%, rgba(17,9,4,0.15) 35%, rgba(17,9,4,0.6) 70%, rgba(17,9,4,0.97) 100%)',
          }}
          aria-hidden="true"
        />
      </div>

      {/*
        Bottom content row.
        - pt-20 md:pt-24 = navbar height clearance so nothing hides under it
        - items-end = both columns sit on the same bottom baseline
      */}
      <div className="absolute inset-x-0 bottom-0 top-16 md:top-20 z-10 flex flex-col">
        {/* Spacer that fills everything above the content row */}
        <div className="flex-1" />

        {/* Content row — pinned to the bottom */}
        <div className="container-brand pb-10 lg:pb-16">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">

            {/* Left: Giant display heading */}
            <div className="flex-1 min-w-0">
              <h1 className="text-display text-cream-200 leading-[0.85] tracking-tight">
                Captain
                <br />
                Stitches
              </h1>
            </div>

            {/* Right: Tagline + CTAs — aligned to the same bottom as the h1 */}
            <div className="flex flex-col items-start lg:items-end gap-8 lg:text-right shrink-0 lg:translate-y-[-25px] lg:translate-x-[50px]">

              {/* Tagline */}
              <div className="flex flex-col items-start lg:items-end gap-3">
                <span className="accent-line lg:self-end" />
                <p className="text-label text-cream-200 max-w-[17rem] lg:max-w-xs leading-relaxed">
                  Crafted in Nigeria
                  <br className="hidden lg:block" />
                  {' · '}Delivered to your door in Europe
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                <Button href="/order" variant="primary" size="lg" className="w-full sm:w-auto" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                  Order your piece
                </Button>
                <Button href="/catalogue" variant="outline" size="lg" className="w-full sm:w-auto" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                  View collection
                </Button>
              </div>

            </div>
          </div>
        </div>
      </div>

    </section>
  )
}

export default Hero