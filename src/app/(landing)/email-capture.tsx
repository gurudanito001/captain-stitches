import SectionEyebrow from '@/utils/sectionEyeBrow'

const EmailCapture = () => {
  return (
    <section
      className="bg-[#FAF6F0] relative overflow-hidden text-[#140C07]"
      style={{
        width: '100%',
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
      }}
      aria-labelledby="email-heading"
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
        {/* Contained VIP Invitation Card */}
        <div
          className="rounded-[2.5rem] md:rounded-[3.5rem] border border-[#E4DCcf] bg-white shadow-xl relative overflow-hidden"
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            padding: 'clamp(2rem, 5vw, 4rem)',
            boxSizing: 'border-box',
          }}
        >
          {/* Subtle warm accent watermark */}
          <div
            className="absolute top-0 right-0 w-80 h-80 rounded-full bg-caramel-500/10 blur-[100px] pointer-events-none"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Left Column: Heading & Value Proposition */}
            <div className="lg:col-span-6 flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="w-5 h-px bg-terracotta-500" />
                  <span className="font-body text-[10px] tracking-[0.25em] uppercase text-terracotta-600 font-bold">
                    [ 07 — VIP PRIVILEGE ]
                  </span>
                </div>

                <h2
                  id="email-heading"
                  className="text-heading-xl !text-[#140C07] font-normal leading-tight tracking-tight uppercase"
                >
                  New Designs.
                  <br />
                  <span className="font-display italic font-light text-caramel-600">
                    First To Know.
                  </span>
                </h2>

                <p className="font-body text-sm md:text-base text-[#55483F] mt-4 leading-relaxed max-w-md">
                  Join our private patron list and receive 10% off your inaugural bespoke commission, along with private drop previews and seasonal fabric releases.
                </p>
              </div>

              {/* Trust Indicators Pill Row */}
              <div
                className="grid grid-cols-3 gap-4 border-t border-[#EAE3D8]"
                style={{ paddingTop: '2rem', marginTop: '2rem' }}
              >
                <div>
                  <p className="font-display font-bold text-2xl md:text-3xl text-[#140C07]">
                    150+
                  </p>
                  <p className="font-body text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
                    Patrons
                  </p>
                </div>
                <div className="border-x border-[#EAE3D8] px-3">
                  <p className="font-display font-bold text-2xl md:text-3xl text-[#140C07]">
                    10+
                  </p>
                  <p className="font-body text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
                    Countries
                  </p>
                </div>
                <div>
                  <p className="font-display font-bold text-2xl md:text-3xl text-caramel-600">
                    4.95★
                  </p>
                  <p className="font-body text-[10px] text-stone-500 uppercase tracking-widest mt-0.5">
                    Rating
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Sleek VIP Form */}
            <div
              className="lg:col-span-6 bg-[#FAF7F2] rounded-3xl border border-[#E2D8CA] shadow-sm"
              style={{ padding: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              <form
                action="/api/email-capture"
                method="POST"
                className="flex flex-col gap-5"
                aria-label="Newsletter signup"
              >
                <div>
                  <label
                    htmlFor="email-name"
                    className="block font-body text-[10px] tracking-[0.2em] uppercase font-bold text-[#63554A] mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="email-name"
                    name="name"
                    type="text"
                    placeholder="e.g. Chukwuma Sterling"
                    autoComplete="given-name"
                    className="w-full bg-white border border-[#D5CABE] text-[#140C07] placeholder-[#8F8175] rounded-2xl font-body text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500 transition-all shadow-sm"
                    style={{ padding: '0.85rem 1.25rem' }}
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email-address"
                    className="block font-body text-[10px] tracking-[0.2em] uppercase font-bold text-[#63554A] mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    placeholder="you@domain.com"
                    autoComplete="email"
                    className="w-full bg-white border border-[#D5CABE] text-[#140C07] placeholder-[#8F8175] rounded-2xl font-body text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500 transition-all shadow-sm"
                    style={{ padding: '0.85rem 1.25rem' }}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="group w-full flex items-center justify-between rounded-full bg-[#180E07] hover:bg-black text-white transition-all duration-300 shadow-md cursor-pointer"
                  style={{ padding: '0.45rem 0.5rem 0.45rem 1.6rem', marginTop: '0.5rem' }}
                >
                  <span className="font-body text-xs tracking-[0.18em] uppercase font-bold text-cream-100">
                    Claim 10% Welcome Credit
                  </span>
                  <div className="w-10 h-10 rounded-full bg-caramel-500 group-hover:bg-caramel-400 flex items-center justify-center text-brown-950 transition-all duration-300 group-hover:translate-x-0.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </button>

                <p className="font-body text-[10px] text-stone-500 text-center tracking-wider mt-1">
                  Discretion assured. No spam, ever. Unsubscribe with one click.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmailCapture