'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'

interface RewardHistoryItem {
  id: string
  date: string
  friendName: string
  reward: string
  status: 'Available' | 'Redeemed' | 'Pending'
  code?: string
}

const MOCK_DASHBOARD_DATA: Record<string, {
  userName: string
  referralCount: number
  conversionCount: number
  activeRewardsCount: number
  history: RewardHistoryItem[]
}> = {
  'CHIDI@STITCHES.COM': {
    userName: 'Chidi O.',
    referralCount: 4,
    conversionCount: 3,
    activeRewardsCount: 2,
    history: [
      { id: '1', date: '22 Aug 2026', friendName: 'Emeka N.', reward: '10% Discount Code', status: 'Available', code: 'REF-CHIDI10' },
      { id: '2', date: '10 Aug 2026', friendName: 'Kunle A.', reward: 'Priority Rush Slot', status: 'Available', code: 'REF-RUSH33' },
      { id: '3', date: '28 Jul 2026', friendName: 'Tunde B.', reward: '10% Discount Code', status: 'Redeemed', code: 'REF-CHIDI10-OLD' },
      { id: '4', date: '15 Jul 2026', friendName: 'Yusuf M.', reward: '10% Discount Code', status: 'Pending' },
    ],
  },
  'SAMUEL@STITCHES.COM': {
    userName: 'Samuel D.',
    referralCount: 2,
    conversionCount: 1,
    activeRewardsCount: 1,
    history: [
      { id: '1', date: '18 Aug 2026', friendName: 'Amadi K.', reward: '10% Discount Code', status: 'Available', code: 'REF-SAMUEL10' },
      { id: '2', date: '05 Aug 2026', friendName: 'Rita U.', reward: '10% Discount Code', status: 'Pending' },
    ],
  },
}

export default function ReferralPage() {
  const [emailInput, setEmailInput] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [activeDashboard, setActiveDashboard] = useState<typeof MOCK_DASHBOARD_DATA[string] | null>(null)
  
  // Custom Referral Link Generator state
  const [clientName, setClientName] = useState('')
  const [generatedRefCode, setGeneratedRefCode] = useState('')
  const [copied, setCopied] = useState(false)

  // Handle Rewards Lookup
  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!emailInput.trim()) return

    const key = emailInput.trim().toUpperCase()
    if (MOCK_DASHBOARD_DATA[key]) {
      setActiveDashboard(MOCK_DASHBOARD_DATA[key])
    } else {
      // Create empty/new mock dashboard if not found to allow user interaction
      setActiveDashboard({
        userName: emailInput.split('@')[0],
        referralCount: 0,
        conversionCount: 0,
        activeRewardsCount: 0,
        history: [],
      })
    }
    setHasSearched(true)
  }

  // Handle generating referral link
  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName.trim()) return
    const formattedCode = clientName.trim().toUpperCase().replace(/\s+/g, '') + '10'
    setGeneratedRefCode(`https://captainstitches.com/ref/${formattedCode}`)
    setCopied(false)
  }

  // Handle Copy Link
  const handleCopyLink = () => {
    if (!generatedRefCode) return
    navigator.clipboard.writeText(generatedRefCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const generatedRefCodeMailLink = useMemo(() => {
    return `mailto:?subject=Tailor-Made Bespoke Attire - €10 Off&body=Hey! I custom-ordered my native wear from CaptainStitches and the fit is amazing. Use my referral link to get €10 off your first bespoke order: ${generatedRefCode}`
  }, [generatedRefCode])

  const generatedRefCodeWhatsAppLink = useMemo(() => {
    return `https://wa.me/?text=Hey!%20I%20custom-ordered%20my%20native%20wear%20from%20CaptainStitches%20and%20the%20fit%20is%20amazing.%20Use%20my%20link%20to%20get%20%E2%82%AC10%20off%20your%20first%20order:%20${encodeURIComponent(generatedRefCode)}`
  }, [generatedRefCode])

  const inputClasses =
    'w-full px-4 py-3 bg-brown-950/40 border border-brown-800 text-cream-200 placeholder-stone-600 focus:outline-none focus:border-caramel-500 font-body text-xs tracking-wider transition-colors duration-200 rounded-none'
  const labelClasses = 'text-label text-stone-400 block mb-2 font-semibold'

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pt-32 pb-24">
        <div className="container-brand max-w-4xl">
          {/* Header Hero Section */}
          <div className="text-center mb-16">
            <SectionEyebrow label="Referral Programme" />
            <h1 className="text-heading-xl text-cream-200 mt-2 font-normal">
              Share the Craft.<br />Get Rewarded.
            </h1>
            <p className="text-body text-stone-300 mt-4 max-w-lg mx-auto">
              Introduce your friends to the luxury of handcrafted, custom-fitted attire. 
              They receive discounts on their first order, and you earn bespoke tailoring rewards.
            </p>
          </div>

          {/* Reward Tiers Grid */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest block mb-2">
                Program Benefits
              </span>
              <h2 className="text-heading-md text-cream-200 font-normal">
                Bespoke Reward Tiers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div className="p-6 bg-brown-950/20 border border-brown-850 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-caramel-500 font-display text-2xl font-bold">Tier 01</span>
                  <h3 className="font-display text-lg font-semibold text-cream-200 mt-2">1 Friend Referred</h3>
                  <p className="text-body text-stone-400 text-xs mt-2 leading-relaxed">
                    Earn a **10% Discount Voucher** on your next custom attire order. Your friend gets **€10 (or ₦15,000) off** their first deposit checkout.
                  </p>
                </div>
                <div className="pt-4 border-t border-brown-900">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold">Reward: 10% Voucher</span>
                </div>
              </div>

              {/* Tier 2 */}
              <div className="p-6 bg-brown-950/20 border border-brown-850 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-caramel-500 font-display text-2xl font-bold">Tier 02</span>
                  <h3 className="font-display text-lg font-semibold text-cream-200 mt-2">3 Friends Referred</h3>
                  <p className="text-body text-stone-400 text-xs mt-2 leading-relaxed">
                    Earn a **Priority Rush Slot** (halves production timeline on any garment without extra charges) + **Free Custom Native Cap** matching your design.
                  </p>
                </div>
                <div className="pt-4 border-t border-brown-900">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold">Reward: Queue Skip + Cap</span>
                </div>
              </div>

              {/* Tier 3 */}
              <div className="p-6 bg-brown-950/30 border border-caramel-500/20 flex flex-col justify-between gap-4 shadow-xl">
                <div>
                  <span className="text-caramel-500 font-display text-2xl font-bold">Tier 03</span>
                  <h3 className="font-display text-lg font-semibold text-cream-200 mt-2">5+ Friends Referred</h3>
                  <p className="text-body text-stone-400 text-xs mt-2 leading-relaxed">
                    Earn **VIP Master Status**: custom initials embroidered inside your jackets, free matching native accessories, and **15% Lifetime Discount**.
                  </p>
                </div>
                <div className="pt-4 border-t border-brown-900">
                  <span className="text-[9px] text-stone-500 uppercase tracking-widest font-semibold">Reward: VIP Lifetime Perks</span>
                </div>
              </div>
            </div>
          </section>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left: Referral Link Generator & Social Share */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="p-6 md:p-8 bg-brown-950/20 border border-brown-850">
                <h3 className="text-label text-caramel-400 font-bold mb-4 pb-2 border-b border-brown-850">
                  Referral Link Generator
                </h3>

                {!generatedRefCode ? (
                  <form onSubmit={handleGenerateLink} className="flex flex-col gap-4">
                    <div>
                      <label className={labelClasses}>Enter Your Full Name</label>
                      <input
                        type="text"
                        placeholder="E.g., Samuel Anaele"
                        value={clientName}
                        onChange={e => setClientName(e.target.value)}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <Button type="submit" variant="primary" size="sm" className="mt-2">
                      Generate Referral Link
                    </Button>
                  </form>
                ) : (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    {/* Share Link Copy Card */}
                    <div className="flex flex-col gap-2">
                      <span className={labelClasses}>Your Custom Referral Link</span>
                      <div className="flex border border-brown-800">
                        <input
                          type="text"
                          readOnly
                          value={generatedRefCode}
                          className={[inputClasses, 'border-0 bg-transparent flex-1 select-all'].join(' ')}
                        />
                        <button
                          onClick={handleCopyLink}
                          className="px-4 bg-brown-850 text-[10px] uppercase tracking-widest text-caramel-400 hover:text-caramel-300 font-bold font-body cursor-pointer select-none transition-colors border-l border-brown-800"
                        >
                          {copied ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>

                    {/* Sharing suite options */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                        Quick Share with Friends:
                      </span>
                      <div className="grid grid-cols-3 gap-2">
                        {/* WhatsApp */}
                        <a
                          href={generatedRefCodeWhatsAppLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-3 bg-[#25D366] text-brown-950 text-[9px] uppercase tracking-widest font-bold font-body hover:bg-[#20ba5a] text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          WhatsApp
                        </a>

                        {/* Email */}
                        <a
                          href={generatedRefCodeMailLink}
                          className="py-3 bg-brown-800 text-cream-200 border border-brown-750 text-[9px] uppercase tracking-widest font-bold font-body hover:border-stone-500 text-center transition-colors flex items-center justify-center gap-1.5"
                        >
                          Email
                        </a>

                        {/* Reset button */}
                        <button
                          onClick={() => {
                            setGeneratedRefCode('')
                            setClientName('')
                          }}
                          className="py-3 bg-transparent text-stone-400 border border-brown-850 text-[9px] uppercase tracking-widest font-bold font-body hover:border-stone-500 text-center transition-colors flex items-center justify-center gap-1.5 cursor-pointer select-none"
                        >
                          New Link
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Personal Rewards Dashboard lookup */}
            <div className="lg:col-span-6 flex flex-col gap-6">
              <div className="p-6 md:p-8 bg-brown-950/20 border border-brown-850 flex flex-col gap-6">
                <h3 className="text-label text-caramel-400 font-bold pb-2 border-b border-brown-850">
                  Referrals Dashboard
                </h3>

                {!hasSearched ? (
                  <form onSubmit={handleLookup} className="flex flex-col gap-4">
                    <p className="text-body text-stone-400 text-xs leading-relaxed">
                      Enter your email to check your active referrals count, confirmed customer conversions, and redeemeable discount codes.
                    </p>
                    <div>
                      <label className={labelClasses}>Your Email Address</label>
                      <input
                        type="email"
                        placeholder="E.g., chidi@stitches.com"
                        value={emailInput}
                        onChange={e => setEmailInput(e.target.value)}
                        className={inputClasses}
                        required
                      />
                    </div>
                    <Button type="submit" variant="outline" size="sm">
                      Access Dashboard
                    </Button>
                    <p className="text-[9px] text-stone-500 uppercase tracking-widest text-center mt-2">
                      Try `chidi@stitches.com` to see mock statistics
                    </p>
                  </form>
                ) : (
                  activeDashboard && (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                      {/* Stats grids */}
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-brown-950/40 border border-brown-900 text-center">
                          <span className="block text-[8px] text-stone-500 uppercase tracking-widest">Referred</span>
                          <strong className="text-2xl font-display text-cream-200 mt-1 block">{activeDashboard.referralCount}</strong>
                        </div>
                        <div className="p-4 bg-brown-950/40 border border-brown-900 text-center">
                          <span className="block text-[8px] text-stone-500 uppercase tracking-widest">Conversions</span>
                          <strong className="text-2xl font-display text-caramel-400 mt-1 block">{activeDashboard.conversionCount}</strong>
                        </div>
                        <div className="p-4 bg-brown-950/40 border border-brown-900 text-center">
                          <span className="block text-[8px] text-stone-500 uppercase tracking-widest">Rewards</span>
                          <strong className="text-2xl font-display text-cream-200 mt-1 block">{activeDashboard.activeRewardsCount}</strong>
                        </div>
                      </div>

                      {/* Reward Code History / Details */}
                      <div>
                        <span className="text-label text-stone-400 block mb-3 font-semibold">Reward History & Claims</span>
                        {activeDashboard.history.length > 0 ? (
                          <div className="flex flex-col gap-3 max-h-56 overflow-y-auto no-scrollbar">
                            {activeDashboard.history.map(item => (
                              <div
                                key={item.id}
                                className="p-3 bg-brown-950/60 border border-brown-900 flex justify-between items-center text-xs"
                              >
                                <div>
                                  <span className="block font-body text-cream-200 font-semibold">{item.reward}</span>
                                  <span className="block text-[9px] text-stone-500 mt-0.5">
                                    Friend: {item.friendName} · {item.date}
                                  </span>
                                </div>
                                <div className="text-right">
                                  {item.status === 'Available' && item.code ? (
                                    <div className="flex flex-col items-end gap-1">
                                      <span className="bg-caramel-500/10 text-caramel-400 border border-caramel-500/20 px-2 py-0.5 text-[8px] uppercase tracking-widest font-semibold">
                                        Claimable
                                      </span>
                                      <code className="text-[9px] text-cream-100 font-mono tracking-wider">{item.code}</code>
                                    </div>
                                  ) : item.status === 'Redeemed' ? (
                                    <span className="text-stone-500 text-[9px] uppercase tracking-widest font-semibold">
                                      Redeemed
                                    </span>
                                  ) : (
                                    <span className="text-stone-500 text-[9px] uppercase tracking-widest font-semibold animate-pulse">
                                      Processing
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 border border-dashed border-brown-900 text-center text-stone-500 font-body text-xs">
                            No referrals registered yet. Generate your link on the left to get started!
                          </div>
                        )}
                      </div>

                      {/* Reset button */}
                      <button
                        onClick={() => {
                          setHasSearched(false)
                          setEmailInput('')
                          setActiveDashboard(null)
                        }}
                        className="text-stone-400 hover:text-cream-200 text-[9px] uppercase tracking-widest font-bold text-center mt-2 cursor-pointer select-none"
                      >
                        ← Look up another email
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
