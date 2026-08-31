import { Button } from "@/components/ui/Button"
import SectionEyebrow from "@/utils/sectionEyeBrow"

const referralRewards = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.2"
        stroke="currentColor"
        className="w-6 h-6 text-caramel-400"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0v11.25m-9-6h18" />
      </svg>
    ),
    title: 'Free accessory',
    body: 'Pocket square, tie, or cap — your choice on your next order',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.2"
        stroke="currentColor"
        className="w-6 h-6 text-caramel-400"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    title: 'Order discount',
    body: 'Applied automatically when your referral converts',
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.2"
        stroke="currentColor"
        className="w-6 h-6 text-caramel-400"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    title: 'Priority slot',
    body: 'Your next piece jumps to the front of our production queue',
  },
]

const ReferralProgramme = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
            6. REFERRAL PROGRAMME TEASER
            Full-width dark section — bold headline + reward cards.
            Decorative oversized background text like the reference footer.
        ══════════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden section-y bg-brown-950"
        aria-labelledby="referral-heading"
      >
        <div className="container-brand relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">

            {/* Left Column */}
            <div>
              <SectionEyebrow label="Referral programme" />
              <h2 id="referral-heading" className="text-heading-xl text-cream-200 mt-2 font-normal">
                Share the fit.<br />
                <span className="font-display italic text-caramel-500 font-normal">Get rewarded.</span>
              </h2>
              <p className="text-body mt-6 max-w-md text-stone-300 leading-relaxed">
                Refer a friend and when they place their first paid order,
                you both earn a reward. No limits — the more you share,
                the more you earn.
              </p>
              <div className="mt-8">
                <Button href="/referral" variant="primary" size="lg" style={{ padding: "12px 5px", marginTop: "10px" }}>
                  Join the programme
                </Button>
              </div>
            </div>

            {/* Right Column — vertical reward list */}
            <div className="flex flex-col gap-4">
              {referralRewards.map(r => (
                <div
                  key={r.title}
                  className="bg-brown-900/40 backdrop-blur-sm border border-brown-700/30 p-6 flex items-start gap-5 transition-all duration-300 hover:border-caramel-500/20 hover:bg-brown-900/60 group"
                >
                  <div className="shrink-0 p-3 bg-brown-950 border border-brown-700/50 rounded-none transition-all duration-300 group-hover:border-caramel-500/30">
                    {r.icon}
                  </div>
                  <div>
                    <h3 className="text-label text-caramel-400 mb-1.5 tracking-widest text-[10px] font-semibold uppercase">
                      {r.title}
                    </h3>
                    <p className="text-body text-sm text-stone-300 leading-relaxed">
                      {r.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Oversized decorative wordmark — matches reference background text treatment */}
        <div
          className="absolute -bottom-6 left-0 right-0 overflow-hidden pointer-events-none select-none"
          aria-hidden="true"
        >
          <p
            className="font-display font-bold uppercase leading-none whitespace-nowrap"
            style={{
              fontSize: 'clamp(5rem, 18vw, 18rem)',
              WebkitTextStroke: '1px var(--color-brown-800)',
              color: 'transparent',
              letterSpacing: '-0.02em',
            }}
          >
            REFER &amp; EARN
          </p>
        </div>
      </section>
    </>
  )
}

export default ReferralProgramme    