import SectionEyebrow from "@/utils/sectionEyeBrow"
import { Button } from "@/components/ui/Button"




const EmailCapture = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
            8. EMAIL CAPTURE
            Two-column layout — bold headline left, form right.
            Mirrors Norven's CUSTOMIZE section with tape measure image.
        ══════════════════════════════════════════════════════════════════ */}
      <section
        className="bg-brown-800 section-y"
        aria-labelledby="email-heading"
      >
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">

            {/* Left */}
            <div className="flex flex-col justify-between py-2">
              <div>
                <SectionEyebrow label="Stay in the know" />
                <h2 id="email-heading" className="text-heading-xl text-cream-200">
                  New designs.
                  <br />
                  <em className="not-italic text-caramel-500">First to know.</em>
                </h2>
                <p className="text-body max-w-sm" style={{ margin: "30px 0" }}>
                  Join our list and get 10% off your first order. We share new
                  collection drops, style guides, and exclusive early access — never spam.
                </p>
              </div>

              {/* Trust marks */}
              <div className="flex items-center gap-6 mt-8">
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-cream-200">150+</p>
                  <p className="text-label text-stone-400">Happy customers</p>
                </div>
                <span className="w-px h-10 bg-brown-600" aria-hidden="true" />
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-cream-200">10+</p>
                  <p className="text-label text-stone-400">Countries delivered</p>
                </div>
                <span className="w-px h-10 bg-brown-600" aria-hidden="true" />
                <div className="text-center">
                  <p className="font-display font-bold text-2xl text-cream-200">4.9★</p>
                  <p className="text-label text-stone-400">Average rating</p>
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="bg-brown-900/50 backdrop-blur-sm border border-brown-700/40 p-8 lg:p-12 shadow-2xl flex flex-col h-full justify-between" style={{ padding: "12px" }}>
              <form
                action="/api/email-capture"
                method="POST"
                className="flex flex-col justify-between h-full gap-8"
                aria-label="Newsletter signup"
              >
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email-name"
                      className="text-label text-stone-400 text-[10px] tracking-widest uppercase"
                    >
                      Your name
                    </label>
                    <input
                      id="email-name"
                      name="name"
                      type="text"
                      placeholder="Emeka Obi"
                      autoComplete="given-name"
                      className="bg-transparent border-b border-brown-700/80 text-cream-200 placeholder-stone-600 py-5 font-body text-sm outline-none focus:outline-none focus-visible:outline-none focus:border-caramel-500 transition-colors w-full rounded-none"
                      required
                      style={{ height: '50px' }}
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label
                      htmlFor="email-address"
                      className="text-label text-stone-400 text-[10px] tracking-widest uppercase"
                    >
                      Email address
                    </label>
                    <input
                      id="email-address"
                      name="email"
                      type="email"
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="bg-transparent border-b border-brown-700/80 text-cream-200 placeholder-stone-600 py-5 font-body text-sm outline-none focus:outline-none focus-visible:outline-none focus:border-caramel-500 transition-colors w-full rounded-none"
                      required
                      style={{ height: '50px' }}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-4 mt-6">
                  <Button type="submit" variant="primary" size="lg" fullWidth className="mt-2" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
                    Claim 10% off my first order
                  </Button>

                  <p className="text-label text-stone-500 text-center text-[10px] tracking-wider" style={{ fontSize: '0.625rem' }}>
                    No spam. Unsubscribe any time.
                  </p>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}

export default EmailCapture