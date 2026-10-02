'use client'

import { Suspense } from 'react'
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

      <main
        id="main-content"
        className="bg-[#0C0704] min-h-screen text-cream-100 flex items-center justify-center"
        style={{
          paddingTop: 'clamp(7rem, 12vw, 10rem)',
          paddingBottom: 'clamp(4rem, 8vw, 6.5rem)',
          paddingLeft: 'clamp(1rem, 4vw, 2.5rem)',
          paddingRight: 'clamp(1rem, 4vw, 2.5rem)',
          boxSizing: 'border-box',
        }}
      >
        <div
          className="container-brand"
          style={{
            maxWidth: '680px',
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
          }}
        >
          {/* Confirmed Card in Royal Heritage Emerald (#071A14) */}
          <div
            className="rounded-3xl border border-[#10B981]/30 bg-[#071A14]/90 shadow-2xl"
            style={{
              padding: 'clamp(2rem, 5vw, 3.5rem)',
              boxSizing: 'border-box',
            }}
          >
            {/* Success Checkmark Circle */}
            <div
              className="rounded-full bg-[#C4975A]/20 border-2 border-[#C4975A] flex items-center justify-center animate-scaleIn shadow-lg shadow-[#C4975A]/20"
              style={{ width: '72px', height: '72px', margin: '0 auto 1.5rem auto' }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2.5"
                stroke="currentColor"
                className="text-[#E8D4B0]"
                style={{ width: '36px', height: '36px' }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <span
                className="inline-block text-[#34D399] font-bold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '8px' }}
              >
                Deposit Confirmed · Commission Registered
              </span>
              <h1
                className="font-serif text-cream-100 font-bold leading-tight"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)', marginBottom: '0.75rem' }}
              >
                Bespoke Order Secured
              </h1>
              <p
                className="font-body text-stone-300 text-xs sm:text-sm leading-relaxed"
                style={{ maxWidth: '520px', margin: '0 auto' }}
              >
                Thank you for patronizing CaptainStitches. Your 50% deposit has been processed and your custom commission has been transmitted to our tailoring workshop.
              </p>
            </div>

            {/* Order Invoice Summary Card */}
            <div
              className="rounded-2xl bg-[#0C0704]/75 border border-[#10B981]/30 text-left font-body text-xs text-stone-300"
              style={{
                padding: '1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              <div
                className="flex justify-between items-center border-b border-brown-800/80"
                style={{ paddingBottom: '12px' }}
              >
                <span className="text-stone-400 font-semibold uppercase tracking-wider text-[10px]">
                  Order Reference:
                </span>
                <strong className="text-[#C4975A] font-mono text-sm font-bold tracking-wider">
                  {orderId}
                </strong>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">Commissioned Silhouette:</span>
                <span className="text-cream-100 font-semibold">{formattedDesignName}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-stone-400">50% Deposit Paid:</span>
                <span className="text-[#34D399] font-bold">
                  {currency === 'EUR'
                    ? `€${(parseInt(total) / 2).toFixed(0)}`
                    : `₦${(parseInt(total) / 2).toLocaleString('en-NG')}`}
                </span>
              </div>

              <div
                className="flex justify-between items-center text-stone-400 border-t border-brown-800/80"
                style={{ paddingTop: '12px' }}
              >
                <span>Remaining Balance (Due Upon Video Sign-off):</span>
                <span className="text-cream-200 font-semibold">
                  {currency === 'EUR'
                    ? `€${(parseInt(total) / 2).toFixed(0)}`
                    : `₦${(parseInt(total) / 2).toLocaleString('en-NG')}`}
                </span>
              </div>
            </div>

            {/* Next Steps Roadmap */}
            <div style={{ textAlign: 'left', marginBottom: '2rem' }}>
              <h3
                className="text-xs uppercase tracking-widest text-[#C4975A] font-bold"
                style={{ marginBottom: '14px' }}
              >
                What Happens Next
              </h3>
              <ul
                className="font-body text-xs text-stone-300"
                role="list"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                }}
              >
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span className="text-[#34D399] font-bold shrink-0" style={{ minWidth: '32px' }}>
                    01 /
                  </span>
                  <span style={{ lineHeight: 1.6 }}>
                    Our head tailor in Verona reviews your submitted measurements against our sizing templates. We will reach out on WhatsApp if anything requires clarification.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span className="text-[#34D399] font-bold shrink-0" style={{ minWidth: '32px' }}>
                    02 /
                  </span>
                  <span style={{ lineHeight: 1.6 }}>
                    Fabric chalking and hand-cutting starts at our Nigerian atelier. You can track real-time workshop milestones anytime using your Order ID.
                  </span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span className="text-[#34D399] font-bold shrink-0" style={{ minWidth: '32px' }}>
                    03 /
                  </span>
                  <span style={{ lineHeight: 1.6 }}>
                    Upon completion, detailed inspection photos and a 360° fit video will be provided for your approval before final dispatch via DHL Express courier.
                  </span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: '14px',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Button
                href={`/track?id=${orderId}`}
                variant="primary"
                size="md"
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  flex: 1,
                  minWidth: '200px',
                  textAlign: 'center',
                }}
              >
                Track Live Progress
              </Button>
              <Button
                href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                  `Hello CaptainStitches, I just placed order ${orderId} for the ${formattedDesignName}.`
                )}`}
                variant="outline"
                size="md"
                external
                style={{
                  padding: '14px 28px',
                  borderRadius: '12px',
                  borderColor: '#E8D4B0',
                  color: '#E8D4B0',
                  flex: 1,
                  minWidth: '200px',
                  textAlign: 'center',
                }}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div
          className="bg-[#0C0704] min-h-screen flex items-center justify-center"
          style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div
            className="border-2 border-[#C4975A] border-t-transparent rounded-full animate-spin"
            style={{ width: '36px', height: '36px' }}
          />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
