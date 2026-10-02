'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { validateReferralCodeAction } from '@/lib/actions/referrals'

export default function ReferralLandingPage() {
  const params = useParams()
  const router = useRouter()
  const code = (params?.code as string || '').toUpperCase()

  const [isLoading, setIsLoading] = useState(true)
  const [isValid, setIsValid] = useState(false)
  const [referrerName, setReferrerName] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!code) {
      setIsLoading(false)
      setIsValid(false)
      return
    }

    let isMounted = true

    async function verify() {
      try {
        const res = await validateReferralCodeAction(code)
        if (!isMounted) return

        if (res.success && res.valid) {
          setIsValid(true)
          setReferrerName(res.referrerName || 'A CaptainStitches Patron')
          // Save referral code in browser storage so it auto-applies at checkout
          if (typeof window !== 'undefined') {
            localStorage.setItem('cs_active_referral', code)
          }
        } else {
          setIsValid(false)
          setErrorMessage(res.error || 'This referral link is no longer active.')
        }
      } catch (err: any) {
        if (!isMounted) return
        setIsValid(false)
        setErrorMessage(err.message || 'Error validating referral code.')
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    verify()

    return () => {
      isMounted = false
    }
  }, [code])

  return (
    <div className="bg-[#0C0704] text-[#FAF6F0] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-16 px-4 relative overflow-hidden">
        {/* Ambient Gold and Emerald Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#C4975A]/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-xl w-full mx-auto relative z-10">
          {isLoading ? (
            <div className="rounded-3xl border border-stone-800 bg-[#140C07]/90 p-12 text-center shadow-2xl">
              <div
                className="border-3 border-[#C4975A] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                style={{ width: '40px', height: '40px', borderWidth: '3px' }}
              />
              <h3 className="font-serif text-lg font-bold text-cream-100 mb-1">
                Validating Bespoke Invitation
              </h3>
              <p className="text-xs text-stone-400 font-body">
                Verifying patron referral link &ldquo;{code}&rdquo;...
              </p>
            </div>
          ) : isValid ? (
            <div className="rounded-3xl border border-[#C4975A]/50 bg-gradient-to-br from-[#1A120A] via-[#120B07] to-[#0A1A14] p-8 sm:p-12 text-center shadow-2xl animate-fadeIn">
              <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C4975A]/20 border border-[#C4975A]/40 text-[#E8D4B0] text-xs font-semibold uppercase tracking-widest mb-4">
                <span>✦</span> Personal Atelier Invitation
              </span>

              <h1
                className="font-serif font-bold text-cream-100 tracking-tight leading-tight mb-3"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
              >
                €10 / ₦10,000 Welcome Voucher
              </h1>

              <p className="text-xs sm:text-sm text-stone-300 font-body leading-relaxed max-w-md mx-auto mb-6">
                You were personally invited to CaptainStitches by <strong className="text-[#E8D4B0]">{referrerName}</strong>. Your welcome credit has been activated and will apply automatically to your first bespoke commission.
              </p>

              {/* Code Voucher Banner */}
              <div className="p-4 rounded-2xl bg-black/60 border border-[#C4975A]/30 mb-8 inline-flex items-center gap-3">
                <span className="text-xs text-stone-400 font-body">Voucher Code:</span>
                <span className="font-mono text-base font-bold text-[#E8D4B0] tracking-wider px-3 py-1 rounded-lg bg-stone-900 border border-stone-700">
                  {code}
                </span>
                <span className="text-[10px] text-[#34D399] font-bold">✓ ACTIVATED</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={`/order?ref=${encodeURIComponent(code)}`}
                  className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#C4975A] hover:bg-[#d6aa6d] text-[#0C0704] font-serif font-bold text-xs uppercase tracking-wider transition-all shadow-xl shadow-[#C4975A]/20 text-center"
                >
                  Book Bespoke Commission →
                </Link>
                <Link
                  href={`/catalogue?ref=${encodeURIComponent(code)}`}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 border border-stone-700 font-serif font-semibold text-xs uppercase tracking-wider transition-all text-center"
                >
                  Explore Lookbook
                </Link>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-red-900/50 bg-[#140C07]/90 p-8 sm:p-12 text-center shadow-2xl">
              <span className="text-3xl block mb-2">⚠️</span>
              <h2 className="font-serif text-2xl font-bold text-cream-100 mb-2">
                Invitation Not Valid
              </h2>
              <p className="text-xs text-stone-300 font-body leading-relaxed max-w-md mx-auto mb-6">
                {errorMessage || `Referral code "${code}" could not be located in our records.`}
              </p>
              <div className="flex justify-center gap-3">
                <Link
                  href="/catalogue"
                  className="px-6 py-3 rounded-xl bg-[#C4975A] text-[#0C0704] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#d6aa6d]"
                >
                  Browse Catalogue
                </Link>
                <Link
                  href="/referral"
                  className="px-6 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 text-xs font-serif font-bold uppercase tracking-wider hover:bg-stone-800"
                >
                  Referral Programme Info
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
