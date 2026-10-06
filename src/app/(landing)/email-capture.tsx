'use client'

import { useState } from 'react'
import Link from 'next/link'
import { subscribeNewsletterAction } from '@/lib/actions/newsletter'

const EmailCapture = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isCopied, setIsCopied] = useState(false)
  const [subscriptionResult, setSubscriptionResult] = useState<{
    success: boolean
    alreadySubscribed?: boolean
    promoCode?: string
    message: string
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    const cleanEmail = email.trim()
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setErrorMessage('Please enter a valid email address.')
      return
    }

    setIsSubmitting(true)

    try {
      const res = await subscribeNewsletterAction({
        email: cleanEmail,
        name: name.trim() || undefined,
        source: 'homepage',
        language: 'EN',
      })

      if (res.success) {
        setSubscriptionResult({
          success: true,
          alreadySubscribed: res.alreadySubscribed,
          promoCode: res.promoCode || 'WELCOME10',
          message: res.message,
        })
      } else {
        setErrorMessage(res.error || res.message || 'Subscription failed. Please check your email.')
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCopyCode = () => {
    if (subscriptionResult?.promoCode) {
      navigator.clipboard.writeText(subscriptionResult.promoCode)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2500)
    }
  }

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

            {/* Right Column: Sleek VIP Form or Animated Gold Success Card */}
            <div
              className="lg:col-span-6 bg-[#FAF7F2] rounded-3xl border border-[#E2D8CA] shadow-sm"
              style={{ padding: 'clamp(1.75rem, 4vw, 2.5rem)' }}
            >
              {subscriptionResult ? (
                /* Gold Success Confirmation Card */
                <div className="text-center py-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-caramel-500/20 text-caramel-600 border border-caramel-400 flex items-center justify-center mx-auto text-2xl">
                    ✦
                  </div>

                  <h3 className="font-display text-2xl font-bold text-[#140C07] uppercase">
                    {subscriptionResult.alreadySubscribed
                      ? 'Welcome Back, Patron'
                      : 'Welcome to the Patron Circle'}
                  </h3>

                  <p className="font-body text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                    {subscriptionResult.message}
                  </p>

                  <div className="my-4 p-4 rounded-2xl bg-[#0C0704] text-cream-100 border border-brown-800 flex items-center justify-between gap-3 max-w-sm mx-auto shadow-inner">
                    <div className="text-left">
                      <span className="block text-[9px] uppercase tracking-widest text-caramel-400 font-bold">
                        Bespoke Commission Privilege
                      </span>
                      <span className="font-mono text-base font-bold tracking-wider text-white">
                        {subscriptionResult.promoCode}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyCode}
                      className="px-3 py-1.5 rounded-lg bg-caramel-500 hover:bg-caramel-400 text-brown-950 font-bold text-[10px] tracking-wider uppercase transition-colors cursor-pointer"
                    >
                      {isCopied ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/catalogue"
                      className="inline-block rounded-full bg-[#180E07] hover:bg-black text-white font-body text-xs tracking-[0.18em] uppercase font-bold px-6 py-3 shadow-md transition-all duration-300"
                    >
                      Explore the Collection Now &rarr;
                    </Link>
                  </div>
                </div>
              ) : (
                /* VIP Lead Capture Form */
                <form
                  onSubmit={handleSubmit}
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
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Chukwuma Sterling"
                      autoComplete="given-name"
                      className="w-full bg-white border border-[#D5CABE] text-[#140C07] placeholder-[#8F8175] rounded-2xl font-body text-sm outline-none focus:border-caramel-500 focus:ring-1 focus:ring-caramel-500 transition-all shadow-sm"
                      style={{ padding: '0.85rem 1.25rem' }}
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
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (errorMessage) setErrorMessage(null)
                      }}
                      placeholder="you@domain.com"
                      autoComplete="email"
                      className={`w-full bg-white border ${
                        errorMessage ? 'border-red-400 focus:border-red-500' : 'border-[#D5CABE] focus:border-caramel-500'
                      } text-[#140C07] placeholder-[#8F8175] rounded-2xl font-body text-sm outline-none focus:ring-1 focus:ring-caramel-500 transition-all shadow-sm`}
                      style={{ padding: '0.85rem 1.25rem' }}
                      required
                    />
                    {errorMessage && (
                      <p className="text-red-600 font-body text-[11px] mt-1.5 ml-1">
                        ⚠️ {errorMessage}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="group w-full flex items-center justify-between rounded-full bg-[#180E07] hover:bg-black text-white transition-all duration-300 shadow-md cursor-pointer disabled:opacity-60"
                    style={{ padding: '0.45rem 0.5rem 0.45rem 1.6rem', marginTop: '0.5rem' }}
                  >
                    <span className="font-body text-xs tracking-[0.18em] uppercase font-bold text-cream-100">
                      {isSubmitting ? 'Securing Privilege...' : 'Claim 10% Welcome Credit'}
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
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EmailCapture