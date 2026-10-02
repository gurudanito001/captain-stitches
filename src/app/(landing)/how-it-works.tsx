import Image from 'next/image'
import Link from 'next/link'

const bentoFeatures = [
  {
    step: '01',
    title: 'Transparent Pricing',
    body: 'Fair atelier rates with zero middleman markup. Real-time conversion in EUR (€) and NGN (₦).',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="w-5 h-5 text-caramel-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    step: '02',
    title: 'Certified Fit Guarantee',
    body: 'Master tailors inspect every stitch. Samuelson personally reviews your finished garment on video before dispatch.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="w-5 h-5 text-caramel-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
        />
      </svg>
    ),
  },
  {
    step: '03',
    title: 'Direct European Delivery',
    body: 'Expedited express courier straight to your residence in Italy, the UK, and across mainland Europe.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="w-5 h-5 text-caramel-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75m0 0H4.5a1.5 1.5 0 00-1.5 1.5v9M14.25 7.5H4.5"
        />
      </svg>
    ),
  },
  {
    step: '04',
    title: 'Guided Measurements',
    body: 'Step-by-step visual measurement guide. We save your profile so all future reorders take just seconds.',
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.8"
        stroke="currentColor"
        className="w-5 h-5 text-caramel-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5m.75-9l3-3 2.25 2.25L15 6"
        />
      </svg>
    ),
  },
]

const HowItWorks = () => {
  return (
    <section
      className="bg-[#F7F3EB] relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
      }}
      aria-labelledby="bento-heading"
    >
      <div
        className="container-brand"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
          boxSizing: 'border-box',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: 4 Bento Cards with dark circular icons like in reference */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bentoFeatures.map((feat) => (
              <div
                key={feat.step}
                className="bg-white rounded-3xl border border-[#E4DCcf] shadow-sm hover:shadow-xl hover:border-caramel-500/40 transition-all duration-300 flex flex-col justify-between group"
                style={{ padding: '1.75rem' }}
              >
                <div>
                  <div
                    className="flex items-center justify-between"
                    style={{ marginBottom: '1.25rem' }}
                  >
                    <div className="w-12 h-12 rounded-full bg-[#180E07] flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-105">
                      {feat.icon}
                    </div>
                    <span className="font-body text-xs font-bold text-stone-400 tracking-widest uppercase">
                      {feat.step}
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold !text-[#140C07] group-hover:text-caramel-600 transition-colors">
                    {feat.title}
                  </h3>
                </div>

                <p
                  className="font-body text-xs md:text-sm text-[#5C4F44] leading-relaxed"
                  style={{ marginTop: '0.75rem' }}
                >
                  {feat.body}
                </p>
              </div>
            ))}
          </div>

          {/* Right Column: High-Impact Editorial Statement + Hero Showcase Image */}
          <div className="lg:col-span-6 flex flex-col justify-between h-full">
            <div>
              <div className="inline-flex items-center gap-2 mb-3">
                <span className="w-6 h-px bg-terracotta-500" />
                <span className="font-body text-[11px] tracking-[0.25em] uppercase text-terracotta-600 font-bold">
                  [ 03 — WHAT WE DELIVER ]
                </span>
              </div>

              <h2
                id="bento-heading"
                className="text-heading-xl !text-[#140C07] font-normal leading-[1.02] tracking-tight uppercase"
              >
                Everything We Do
                <br />
                <span className="font-display italic font-light text-caramel-600">
                  Is Built Around You
                </span>
              </h2>

              <p className="font-body text-sm md:text-base text-[#52453B] mt-5 leading-relaxed max-w-lg">
                We don’t just sew garments. We build lifelong relationships with patrons who demand elegance, cultural pride, and effortless European door delivery.
              </p>
            </div>

            {/* Visual Hero Feature Card */}
            <div
              className="relative rounded-3xl overflow-hidden h-[280px] sm:h-[320px] border border-[#E3D9CC] shadow-xl group"
              style={{ marginTop: '2rem' }}
            >
              <Image
                src="/images/design-senator.jpg"
                alt="Samuelson Master Tailor inspects bespoke outfit"
                fill
                className="object-cover object-top transition-transform duration-1000 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#140C07]/90 via-[#140C07]/20 to-transparent" />

              {/* Floating spec chip like reference */}
              <div
                className="absolute top-5 right-5 rounded-full bg-white/95 backdrop-blur-md text-[#140C07] font-body text-[10px] tracking-widest font-bold uppercase shadow-lg"
                style={{ padding: '0.4rem 0.9rem' }}
              >
                100% Bespoke · Nigerian Made
              </div>

              <div
                className="absolute bottom-0 inset-x-0 flex items-end justify-between"
                style={{ padding: '1.5rem' }}
              >
                <div>
                  <span className="font-body text-[10px] tracking-[0.2em] uppercase text-caramel-400 font-semibold block">
                    Tailored To Your Frame
                  </span>
                  <p className="font-display text-xl text-white font-bold">
                    Signature Charcoal Senator
                  </p>
                </div>

                <Link
                  href="/order"
                  className="rounded-full bg-caramel-500 hover:bg-caramel-400 text-brown-950 font-body text-[10px] tracking-[0.2em] uppercase font-bold transition-all shadow-md"
                  style={{ padding: '0.65rem 1.25rem' }}
                >
                  Start Order &rarr;
                </Link>
              </div>
            </div>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row items-center gap-4"
              style={{ marginTop: '2rem' }}
            >
              <Link
                href="/order"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 rounded-full bg-[#180E07] hover:bg-black text-white font-body text-xs tracking-[0.18em] uppercase font-bold transition-all shadow-lg"
                style={{ padding: '0.55rem 0.65rem 0.55rem 1.6rem' }}
              >
                <span>Book Custom Tailoring</span>
                <span className="w-7 h-7 rounded-full bg-caramel-500 text-brown-950 flex items-center justify-center">
                  &rarr;
                </span>
              </Link>

              <Link
                href="/track"
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-[#D1C5B5] hover:border-[#140C07] text-[#140C07] font-body text-xs tracking-[0.18em] uppercase font-semibold transition-all"
                style={{ padding: '0.75rem 1.6rem' }}
              >
                Track An Existing Order
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks