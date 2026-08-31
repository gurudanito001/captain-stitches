'use client'

import { use, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'

function ConfirmationContent() {
  const searchParams = useSearchParams()

  const orderId = searchParams.get('id') || 'CS-983174'
  const designSlug = searchParams.get('design') || 'grand-agbada'
  const total = searchParams.get('total') || '68'
  const currency = searchParams.get('currency') || 'EUR'

  const formattedDesignName = designSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="container-brand max-w-xl text-center">
          {/* Success Checkmark Circle */}
          <div className="mx-auto w-16 h-16 rounded-full bg-caramel-500/10 border border-caramel-500 flex items-center justify-center mb-8 animate-scaleIn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
              stroke="currentColor"
              className="w-8 h-8 text-caramel-500"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
            </svg>
          </div>

          <SectionEyebrow label="Order Confirmed" />
          <h1 className="text-heading-lg text-cream-200 mt-2 font-normal">
            Bespoke Order Placed
          </h1>
          <p className="text-body text-stone-300 mt-4 leading-relaxed">
            Thank you for choosing CaptainStitches. Your deposit has been securely processed and your order has been registered in our tailoring workshop.
          </p>

          {/* Order Details Invoice Card */}
          <div className="my-8 p-6 bg-brown-950/40 border border-brown-850 text-left flex flex-col gap-3 font-body text-xs text-stone-300">
            <div className="flex justify-between border-b border-brown-900 pb-2">
              <span className="text-stone-500 font-semibold uppercase tracking-wider text-[10px]">Order reference:</span>
              <strong className="text-caramel-400 font-body text-sm font-semibold tracking-wider">{orderId}</strong>
            </div>
            <div className="flex justify-between">
              <span>Selected Piece:</span>
              <span className="text-cream-200 font-semibold">{formattedDesignName}</span>
            </div>
            <div className="flex justify-between">
              <span>Deposit Paid (50%):</span>
              <span className="text-cream-200 font-semibold">
                {currency === 'EUR' ? `€${(parseInt(total) / 2).toFixed(0)}` : `₦${(parseInt(total) / 2).toLocaleString('en-NG')}`}
              </span>
            </div>
            <div className="flex justify-between text-stone-500 border-t border-brown-900 pt-2">
              <span>Remaining Balance:</span>
              <span className="text-stone-400 font-semibold">
                {currency === 'EUR' ? `€${(parseInt(total) / 2).toFixed(0)}` : `₦${(parseInt(total) / 2).toLocaleString('en-NG')}`}
              </span>
            </div>
          </div>

          {/* What Happens Next Section */}
          <div className="mb-10 text-left">
            <h3 className="text-label text-caramel-400 font-bold mb-4">What Happens Next</h3>
            <ul className="flex flex-col gap-4 font-body text-xs text-stone-400" role="list">
              <li className="flex gap-3">
                <span className="text-caramel-500 font-semibold shrink-0">01 /</span>
                <span>Our head tailor reviews your custom body measurements. We will contact you via WhatsApp if any details require adjustment.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-caramel-500 font-semibold shrink-0">02 /</span>
                <span>Fabric cutting and assembly starts in our Nigerian workshop. You can track live progress anytime using your Order ID.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-caramel-500 font-semibold shrink-0">03 /</span>
                <span>When complete, inspection photos & videos will be uploaded. The remaining 50% balance is requested prior to DHL courier dispatch.</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href={`/track?id=${orderId}`} variant="primary" size="md" className="flex-1">
              Track Your Order
            </Button>
            <Button
              href={`https://wa.me/message/PLACEHOLDER?text=Hello%20CaptainStitches,%20I%20just%20placed%20order%20${orderId}`}
              variant="outline"
              size="md"
              external
              className="flex-1"
            >
              Chat on WhatsApp
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="bg-brown-900 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  )
}
