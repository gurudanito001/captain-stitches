import Image from 'next/image'
import { Button } from '@/components/ui/Button'

const Hero = () => {
  return (
    <section
      className="relative w-full overflow-hidden bg-brown-950 pb-4 md:pb-6"
      aria-label="Hero — CaptainStitches bespoke fashion"
    >
      {/* Outer framing wrapper with rounded bottom corners for a refined transition */}
      <div
        className="relative w-full overflow-hidden rounded-b-[2rem] md:rounded-b-[3rem] border-b border-brown-800/60 bg-[#0C0704] shadow-2xl"
        style={{ minHeight: '94svh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
      >
        {/* Full-bleed background image with clear visibility of models */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero-bg.jpeg"
            alt="Three gentlemen in bespoke Nigerian native wear and African fabric accessories by CaptainStitches"
            fill
            priority
            className="object-cover object-top opacity-90"
            sizes="100vw"
          />
          {/* Gentle cinematic gradient: transparent middle so models are fully visible, soft dark base for typography */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(12,7,4,0.45) 0%, rgba(12,7,4,0.1) 40%, rgba(12,7,4,0.65) 75%, rgba(12,7,4,0.96) 100%)',
            }}
            aria-hidden="true"
          />
        </div>

        {/* Content row — pinned to the bottom baseline like the original design */}
        <div
          className="container-brand relative z-10"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            width: '100%',
            paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
            paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
            paddingBottom: 'clamp(2.5rem, 5vw, 4.5rem)',
            paddingTop: '6rem',
            boxSizing: 'border-box',
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-16">
            {/* Left: Signature Brand Display Wordmark */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-display text-cream-100 font-display font-bold leading-[0.88] tracking-tight uppercase select-none"
                style={{ fontSize: 'clamp(3.5rem, 9vw, 8.5rem)' }}
              >
                Captain
                <br />
                Stitches
              </h1>
            </div>

            {/* Right: Tagline + Clean Action Buttons */}
            <div className="flex flex-col items-start lg:items-end gap-6 lg:text-right shrink-0">
              {/* Tagline with accent line */}
              <div className="flex flex-col items-start lg:items-end gap-2.5">
                <span className="accent-line lg:self-end" />
                <p className="text-label text-cream-200/90 max-w-[17rem] lg:max-w-xs leading-relaxed font-body text-xs tracking-[0.16em] uppercase">
                  Crafted in Nigeria
                  <br className="hidden lg:block" />
                  {' · '}Delivered to your door in Europe
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
                <Button
                  href="/order"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  style={{
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    paddingLeft: '28px',
                    paddingRight: '28px',
                  }}
                >
                  Order your piece
                </Button>
                <Button
                  href="/catalogue"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  style={{
                    paddingTop: '14px',
                    paddingBottom: '14px',
                    paddingLeft: '28px',
                    paddingRight: '28px',
                  }}
                >
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