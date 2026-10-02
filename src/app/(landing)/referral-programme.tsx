import Link from 'next/link'

const referralRewards = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5 text-caramel-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0v11.25m-9-6h18"
        />
      </svg>
    ),
    badge: 'Complementary',
    title: 'Bespoke Accessory',
    body: 'Hand-tailored pocket square, Italian silk tie, or embroidered cap on your next order.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5 text-terracotta-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
        />
      </svg>
    ),
    badge: 'Direct Credit',
    title: '€50 / ₦40,000 Voucher',
    body: 'Deducted directly from both your order and your friend’s first bespoke commission.',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="w-5 h-5 text-emerald-400"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
        />
      </svg>
    ),
    badge: 'VIP Queue',
    title: 'Priority Atelier Queue',
    body: 'Your garment jumps to the front of our production bench for accelerated delivery.',
  },
]

const ReferralProgramme = () => {
  return (
    <section
      className="bg-[#0C0704] text-cream-100 relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
      }}
      aria-labelledby="referral-heading"
    >
      {/* Decorative ambient background */}
      <div
        className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-caramel-500/10 blur-[130px] pointer-events-none"
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Bold proposition */}
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-5 h-px bg-caramel-400" />
              <span className="font-body text-[10px] tracking-[0.25em] uppercase text-caramel-400 font-bold">
                [ 06 — PATRON CIRCLE ]
              </span>
            </div>

            <h2
              id="referral-heading"
              className="text-heading-xl text-white font-normal leading-tight tracking-tight uppercase"
            >
              Share The Fit.
              <br />
              <span className="font-display italic font-light text-caramel-400">
                Earn Bespoke Rewards.
              </span>
            </h2>

            <p className="font-body text-sm md:text-base text-stone-300 mt-5 leading-relaxed max-w-md">
              Introduce a friend in Europe or Nigeria to CaptainStitches. When they place their first commission, you both receive an exclusive reward and priority atelier access.
            </p>

            <div style={{ marginTop: '2rem' }}>
              <Link
                href="/referral"
                className="group inline-flex items-center gap-4 rounded-full bg-cream-100 hover:bg-white text-brown-950 transition-all duration-300 shadow-xl"
                style={{ padding: '0.45rem 0.5rem 0.45rem 1.6rem' }}
              >
                <span className="font-body text-xs tracking-[0.18em] uppercase font-bold text-brown-950">
                  Join Patron Programme
                </span>
                <div className="w-10 h-10 rounded-full bg-terracotta-500 group-hover:bg-terracotta-400 flex items-center justify-center text-white transition-all duration-300 group-hover:translate-x-0.5">
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
              </Link>
            </div>
          </div>

          {/* Right Column: 3 Sleek Reward Cards */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {referralRewards.map((r) => (
              <div
                key={r.title}
                className="rounded-3xl bg-[#140D08]/90 border border-brown-800/80 flex items-start gap-5 hover:border-caramel-500/40 hover:bg-[#1A110A] transition-all duration-300 group shadow-lg"
                style={{ padding: '1.5rem' }}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#090503] border border-brown-800 flex items-center justify-center shrink-0 group-hover:border-caramel-500/30 transition-colors">
                  {r.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-display text-lg font-bold text-white group-hover:text-caramel-300 transition-colors">
                      {r.title}
                    </h3>
                    <span
                      className="text-[9px] font-body tracking-widest uppercase font-bold text-caramel-400 bg-brown-950 rounded-full border border-brown-800"
                      style={{ padding: '0.25rem 0.65rem' }}
                    >
                      {r.badge}
                    </span>
                  </div>

                  <p className="font-body text-xs sm:text-sm text-stone-300 mt-1 leading-relaxed">
                    {r.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Oversized decorative wordmark in background */}
      <div
        className="absolute -bottom-16 md:-bottom-24 left-0 right-0 overflow-hidden pointer-events-none select-none opacity-10"
        aria-hidden="true"
      >
        <p
          className="font-display font-bold uppercase leading-none whitespace-nowrap text-center"
          style={{
            fontSize: 'clamp(4rem, 14vw, 13rem)',
            WebkitTextStroke: '1px var(--color-caramel-500)',
            color: 'transparent',
            letterSpacing: '0.05em',
          }}
        >
          CAPTAIN STITCHES
        </p>
      </div>
    </section>
  )
}

export default ReferralProgramme