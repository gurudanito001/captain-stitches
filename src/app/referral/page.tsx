'use client'

import { useState, useMemo } from 'react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import {
  getOrCreateReferralCodeAction,
  getReferralDashboardAction,
  type ReferralDashboardData,
} from '@/lib/actions/referrals'

export default function ReferralPage() {
  // Custom Referral Link Generator state
  const [clientName, setClientName] = useState('')
  const [clientContact, setClientContact] = useState('')
  const [generatedRefCode, setGeneratedRefCode] = useState('')
  const [assignedName, setAssignedName] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [genError, setGenError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Rewards Dashboard state
  const [emailInput, setEmailInput] = useState('')
  const [hasSearched, setHasSearched] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [searchError, setSearchError] = useState<string | null>(null)
  const [activeDashboard, setActiveDashboard] = useState<ReferralDashboardData | null>(null)
  const [dashboardLinkCopied, setDashboardLinkCopied] = useState(false)

  const handleLookup = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault()
    const targetQuery = (customQuery || emailInput).trim()
    if (!targetQuery) return

    if (customQuery) setEmailInput(customQuery)
    setIsSearching(true)
    setSearchError(null)

    try {
      const res = await getReferralDashboardAction(targetQuery)
      if (res.success && res.dashboard) {
        setActiveDashboard(res.dashboard)
        setHasSearched(true)
      } else {
        setSearchError(res.error || 'Could not find patron account')
      }
    } catch (err: any) {
      setSearchError(err.message || 'Failed to search account')
    } finally {
      setIsSearching(false)
    }
  }

  const handleGenerateLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!clientName.trim()) return

    setIsGenerating(true)
    setGenError(null)

    try {
      const res = await getOrCreateReferralCodeAction(clientName.trim(), clientContact.trim())
      if (res.success && res.url) {
        setGeneratedRefCode(res.url)
        setAssignedName(res.customerName || clientName.trim())
        setCopied(false)
      } else {
        setGenError(res.error || 'Failed to generate referral link')
      }
    } catch (err: any) {
      setGenError(err.message || 'An unexpected error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyLink = () => {
    if (!generatedRefCode) return
    navigator.clipboard.writeText(generatedRefCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleCopyDashboardLink = () => {
    if (!activeDashboard?.referralUrl) return
    navigator.clipboard.writeText(activeDashboard.referralUrl)
    setDashboardLinkCopied(true)
    setTimeout(() => setDashboardLinkCopied(false), 2500)
  }

  const generatedRefCodeMailLink = useMemo(() => {
    return `mailto:?subject=Bespoke Attire Voucher - €10 Off&body=Hey! I custom-ordered my native wear from CaptainStitches and the fit is amazing. Use my referral link to get €10 off your first bespoke order: ${generatedRefCode}`
  }, [generatedRefCode])

  const generatedRefCodeWhatsAppLink = useMemo(() => {
    return `https://wa.me/?text=Hey!%20I%20custom-ordered%20my%20native%20wear%20from%20CaptainStitches%20and%20the%20fit%20is%20amazing.%20Use%20my%20link%20to%20get%20%E2%82%AC10%20off%20your%20first%20order:%20${encodeURIComponent(
      generatedRefCode
    )}`
  }, [generatedRefCode])

  const inputClasses =
    'w-full px-4 py-3 bg-[#FAF7F2] border border-[#D1C9BE] text-[#2B2B2B] placeholder-[#8C7B6B] focus:outline-none focus:border-[#C4975A] font-body text-xs tracking-wider transition-colors duration-200 rounded-xl'
  const labelClasses = 'text-label text-stone-300 block mb-2 font-semibold text-xs uppercase tracking-wider'

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-950 min-h-screen">
        {/* =========================================================================
            SECTION 1: OBSIDIAN HERO HEADER (#0C0704)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#0C0704] text-cream-100 border-b border-brown-800/60"
          style={{
            paddingTop: 'clamp(6.5rem, 11vw, 9rem)',
            paddingBottom: 'clamp(3rem, 6vw, 4.5rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 4vw, 3rem)',
              paddingRight: 'clamp(1.5rem, 4vw, 3rem)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto' }}>
              <span
                className="inline-block text-[#C4975A] font-semibold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '8px' }}
              >
                Patron Circle &amp; Privileges
              </span>
              <h1
                className="font-serif text-cream-100 font-bold leading-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}
              >
                Share the Craft.<br />Dress with Sovereign Pride.
              </h1>
              <p
                className="font-body text-stone-300 text-sm leading-relaxed"
                style={{ maxWidth: '580px', margin: '0 auto', lineHeight: 1.7 }}
              >
                Introduce your friends and family across Europe to authentic Nigerian craftsmanship. They receive €10 off their first piece, and you unlock tailoring rewards and priority workshop slots.
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: LUMINOUS ALABASTER REWARD TIERS (#FAF6F0)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#FAF6F0] text-[#140C07] border-b border-[#EBE3D7]"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 4vw, 3rem)',
              paddingRight: 'clamp(1.5rem, 4vw, 3rem)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <span
                className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '6px' }}
              >
                Milestone Rewards
              </span>
              <h2
                className="font-serif font-normal leading-tight text-[#140C07]"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
              >
                Bespoke Patron Tiers
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Tier 1 */}
              <div
                className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[#C2410C] font-serif text-2xl font-bold block mb-1">
                    Tier 01
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">
                    1 Patron Introduced
                  </h3>
                  <p className="text-xs text-[#52453B] leading-relaxed">
                    Earn a <strong>10% Discount Voucher</strong> on your next bespoke attire commission. Your friend gets <strong>€10 (or ₦15,000) off</strong> their deposit checkout.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2ECE1]">
                  <span className="text-[10px] text-[#C4975A] font-bold uppercase tracking-widest">
                    ✦ 10% Bespoke Voucher
                  </span>
                </div>
              </div>

              {/* Tier 2 */}
              <div
                className="rounded-3xl bg-white border border-[#C4975A]/60 p-8 shadow-md flex flex-col justify-between relative"
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C4975A] text-[#0C0704] text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow"
                >
                  Most Popular
                </div>
                <div>
                  <span className="text-[#C2410C] font-serif text-2xl font-bold block mb-1">
                    Tier 02
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">
                    3 Patrons Introduced
                  </h3>
                  <p className="text-xs text-[#52453B] leading-relaxed">
                    Earn a <strong>Priority Workshop Rush Slot</strong> (halves production timeline without surcharge) + a <strong>Matching Hand-Embroidered Native Cap</strong>.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2ECE1]">
                  <span className="text-[10px] text-[#C4975A] font-bold uppercase tracking-widest">
                    ✦ Priority Slot + Custom Cap
                  </span>
                </div>
              </div>

              {/* Tier 3 */}
              <div
                className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <span className="text-[#C2410C] font-serif text-2xl font-bold block mb-1">
                    Tier 03
                  </span>
                  <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">
                    5+ Patrons Introduced
                  </h3>
                  <p className="text-xs text-[#52453B] leading-relaxed">
                    Elevated to <strong>VIP Sovereign Patron</strong> status: complimentary internal jacket monogram embroidery, matching accessories, and a <strong>15% Lifetime Discount</strong>.
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-[#F2ECE1]">
                  <span className="text-[10px] text-[#C4975A] font-bold uppercase tracking-widest">
                    ✦ Lifetime VIP Status
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: ROYAL HERITAGE EMERALD GENERATOR & DASHBOARD (#071A14)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#071A14] text-[#FAF6F0] border-y border-[#10B981]/20"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 4vw, 3rem)',
              paddingRight: 'clamp(1.5rem, 4vw, 3rem)',
              boxSizing: 'border-box',
            }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Link Generator (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div
                  className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/75 p-6 sm:p-8 shadow-2xl"
                >
                  <h3
                    className="font-serif text-xl font-bold text-cream-100 mb-2 pb-3 border-b border-[#10B981]/25"
                  >
                    Generate Custom Referral Link
                  </h3>
                  <p className="text-xs text-stone-300 font-body mb-6">
                    Enter your name and contact to create your bespoke invitation link. Friends receive €10 / ₦10,000 off their first piece.
                  </p>

                  {genError && (
                    <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
                      {genError}
                    </div>
                  )}

                  {!generatedRefCode ? (
                    <form onSubmit={handleGenerateLink} className="flex flex-col gap-4">
                      <div>
                        <label className={labelClasses}>Your Full Name</label>
                        <input
                          type="text"
                          placeholder="E.g., Daniel Nwokocha or Samuel Anaele"
                          value={clientName}
                          onChange={e => setClientName(e.target.value)}
                          className={inputClasses}
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Phone or Email (To Track Your Rewards)</label>
                        <input
                          type="text"
                          placeholder="E.g., gurudanito001@gmail.com or +234..."
                          value={clientContact}
                          onChange={e => setClientContact(e.target.value)}
                          className={inputClasses}
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={isGenerating}
                        style={{
                          borderRadius: '12px',
                          padding: '14px 24px',
                          fontWeight: 700,
                          opacity: isGenerating ? 0.7 : 1,
                        }}
                      >
                        {isGenerating ? 'Generating Unique Link...' : 'Generate Unique Link'}
                      </Button>
                    </form>
                  ) : (
                    <div className="flex flex-col gap-6 animate-fadeIn">
                      <div>
                        <span className={labelClasses}>
                          Bespoke Link for {assignedName}
                        </span>
                        <div className="flex rounded-xl overflow-hidden border border-[#C4975A]/50 bg-[#0C0704]">
                          <input
                            type="text"
                            readOnly
                            value={generatedRefCode}
                            className="flex-1 px-4 py-3 bg-transparent text-cream-100 text-xs font-mono select-all focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleCopyLink}
                            className="px-5 bg-[#C4975A] text-[#0C0704] text-xs font-bold uppercase tracking-wider cursor-pointer hover:bg-[#E8D4B0] transition-colors"
                          >
                            {copied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                          Quick Share Channels:
                        </span>
                        <div className="grid grid-cols-3 gap-2">
                          <a
                            href={generatedRefCodeWhatsAppLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-3 rounded-xl bg-[#25D366] text-white text-[10px] uppercase tracking-wider font-bold text-center hover:opacity-90 transition-opacity"
                          >
                            WhatsApp
                          </a>
                          <a
                            href={generatedRefCodeMailLink}
                            className="py-3 rounded-xl bg-brown-900 text-cream-100 border border-brown-700 text-[10px] uppercase tracking-wider font-bold text-center hover:border-stone-400 transition-colors"
                          >
                            Email
                          </a>
                          <button
                            type="button"
                            onClick={() => {
                              setGeneratedRefCode('')
                              setClientName('')
                              setClientContact('')
                            }}
                            className="py-3 rounded-xl bg-transparent text-stone-400 border border-brown-800 text-[10px] uppercase tracking-wider font-bold text-center hover:text-cream-100 transition-colors cursor-pointer"
                          >
                            Reset
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Rewards Dashboard Lookup (6 Cols) */}
              <div className="lg:col-span-6 flex flex-col gap-6">
                <div
                  className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/75 p-6 sm:p-8 shadow-2xl flex flex-col gap-6"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#10B981]/25">
                    <h3 className="font-serif text-xl font-bold text-cream-100">
                      Patron Rewards Dashboard
                    </h3>
                    {activeDashboard && (
                      <span className="text-xs text-[#C4975A] font-semibold">
                        {activeDashboard.customerName}
                      </span>
                    )}
                  </div>

                  {searchError && (
                    <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/40 text-red-200 text-xs">
                      {searchError}
                    </div>
                  )}

                  {!hasSearched ? (
                    <form onSubmit={handleLookup} className="flex flex-col gap-4">
                      <p className="text-body text-stone-300 text-xs leading-relaxed">
                        Enter your patron email, phone, or name to view your referrals, confirmed commissions, and redeemable vouchers.
                      </p>
                      <div>
                        <label className={labelClasses}>Registered Email, Phone or Name</label>
                        <input
                          type="text"
                          placeholder="E.g., gurudanito001@gmail.com, +234..., or Daniel"
                          value={emailInput}
                          onChange={e => setEmailInput(e.target.value)}
                          className={inputClasses}
                          required
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        size="md"
                        disabled={isSearching}
                        style={{
                          borderColor: '#E8D4B0',
                          color: '#E8D4B0',
                          borderRadius: '12px',
                          padding: '12px 24px',
                          opacity: isSearching ? 0.7 : 1,
                        }}
                      >
                        {isSearching ? 'Searching Atelier Records...' : 'Access My Statistics'}
                      </Button>
                      <div className="pt-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleLookup(undefined, 'gurudanito001@gmail.com')}
                          className="text-[11px] text-stone-400 hover:text-[#C4975A] transition-colors cursor-pointer"
                        >
                          Quick preview: <code className="text-[#C4975A] underline">gurudanito001@gmail.com</code> (Daniel Nwokocha)
                        </button>
                      </div>
                    </form>
                  ) : (
                    activeDashboard && (
                      <div className="flex flex-col gap-6 animate-fadeIn">
                        {/* Live Share Link In Dashboard */}
                        <div className="p-3.5 rounded-xl bg-[#071A14] border border-[#10B981]/40 flex items-center justify-between gap-3">
                          <div className="truncate">
                            <span className="text-[10px] text-[#A7F3D0] uppercase font-bold tracking-wider block mb-0.5">
                              Your Active Referral Link
                            </span>
                            <span className="text-xs text-cream-100 font-mono truncate block">
                              {activeDashboard.referralUrl}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleCopyDashboardLink}
                            className="px-3 py-1.5 rounded-lg bg-[#C4975A] text-[#0C0704] text-[10px] font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer hover:bg-[#E8D4B0] transition-colors"
                          >
                            {dashboardLinkCopied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 gap-3">
                          <div className="p-4 rounded-2xl bg-brown-900/60 border border-brown-800 text-center">
                            <span className="block text-[9px] text-stone-400 uppercase tracking-wider">
                              Introduced
                            </span>
                            <strong className="text-2xl font-serif text-cream-100 mt-1 block">
                              {activeDashboard.referralCount}
                            </strong>
                          </div>
                          <div className="p-4 rounded-2xl bg-brown-900/60 border border-brown-800 text-center">
                            <span className="block text-[9px] text-[#A7F3D0] uppercase tracking-wider">
                              Conversions
                            </span>
                            <strong className="text-2xl font-serif text-[#34D399] mt-1 block">
                              {activeDashboard.conversionCount}
                            </strong>
                          </div>
                          <div className="p-4 rounded-2xl bg-brown-900/60 border border-brown-800 text-center">
                            <span className="block text-[9px] text-[#C4975A] uppercase tracking-wider">
                              Active Vouchers
                            </span>
                            <strong className="text-2xl font-serif text-[#E8D4B0] mt-1 block">
                              {activeDashboard.activeRewardsCount}
                            </strong>
                          </div>
                        </div>

                        {/* History */}
                        <div>
                          <span className="text-xs uppercase tracking-widest text-stone-300 font-bold block mb-3">
                            Reward History &amp; Codes
                          </span>
                          {activeDashboard.history.length > 0 ? (
                            <div className="flex flex-col gap-2.5 max-h-56 overflow-y-auto no-scrollbar">
                              {activeDashboard.history.map(item => (
                                <div
                                  key={item.id}
                                  className="p-3.5 rounded-xl bg-brown-900/50 border border-brown-800 flex justify-between items-center text-xs"
                                >
                                  <div>
                                    <span className="block font-semibold text-cream-100">
                                      {item.reward}
                                    </span>
                                    <span className="block text-[10px] text-stone-400 mt-0.5">
                                      Friend: {item.friendName} · {item.date}
                                    </span>
                                  </div>
                                  <div className="text-right">
                                    {item.status === 'Available' && item.code ? (
                                      <div className="flex flex-col items-end gap-1">
                                        <span className="bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 px-2 py-0.5 text-[8px] uppercase tracking-widest font-bold rounded">
                                          Claimable
                                        </span>
                                        <code className="text-[10px] text-[#E8D4B0] font-mono tracking-wider font-bold">
                                          {item.code}
                                        </code>
                                      </div>
                                    ) : item.status === 'Redeemed' ? (
                                      <span className="text-stone-500 text-[10px] uppercase tracking-widest font-semibold">
                                        Redeemed
                                      </span>
                                    ) : (
                                      <span className="text-[#C4975A] text-[10px] uppercase tracking-widest font-semibold animate-pulse">
                                        In Workshop
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="p-4 rounded-xl border border-dashed border-brown-800 text-center text-stone-400 text-xs">
                              No referral commissions yet. Share your custom invitation link to earn tailoring vouchers!
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setHasSearched(false)
                            setEmailInput('')
                            setActiveDashboard(null)
                          }}
                          className="text-stone-400 hover:text-[#C4975A] text-xs uppercase tracking-widest font-semibold text-center cursor-pointer transition-colors"
                        >
                          ← Search another patron
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: WARM SAND AMBASSADOR INVITATION (#F7F3EB)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#F7F3EB] text-[#140C07]"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 4vw, 3rem)',
              paddingRight: 'clamp(1.5rem, 4vw, 3rem)',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="rounded-3xl bg-white border border-[#EBE3D7] p-8 sm:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="max-w-xl">
                <span
                  className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                  style={{ marginBottom: '6px' }}
                >
                  Diaspora Ambassadors
                </span>
                <h2
                  className="font-serif font-normal leading-tight text-[#140C07]"
                  style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', marginBottom: '0.75rem' }}
                >
                  Organizing a Wedding or Gala in Europe?
                </h2>
                <p className="text-xs sm:text-sm text-[#52453B] leading-relaxed">
                  We offer bespoke group concierge packages for groom parties, cultural galas, and wedding aso-ebi across Italy, the UK, and Europe with custom measurement kits.
                </p>
              </div>

              <Button
                href="https://wa.me/2348000000000?text=Hello%20CaptainStitches,%20I%20am%20interested%20in%20arranging%20a%20group%20or%20wedding%20aso-ebi%20commission."
                variant="primary"
                size="md"
                external
                style={{
                  borderRadius: '12px',
                  padding: '14px 28px',
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                }}
              >
                Inquire on WhatsApp →
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
