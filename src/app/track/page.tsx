'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'

interface OrderRecord {
  id: string
  customer: string
  design: string
  fabric: string
  color: string
  phone: string
  estimatedDelivery: string
  occasion: string
  status: 'New' | 'Confirmed' | 'In production' | 'Inspection' | 'Approved' | 'Dispatched' | 'Delivered'
  totalEUR: number
  totalNGN: number
  inspectionMedia?: {
    photos: string[]
    videoUrl?: string
  }
}

const STATIC_ORDERS: Record<string, OrderRecord> = {
  'CS-783210': {
    id: 'CS-783210',
    customer: 'Chidi O.',
    design: 'Grand Agbada',
    fabric: 'Presidential Cashmere',
    color: 'Midnight Black',
    phone: '+39 333 444 555',
    estimatedDelivery: '2026-09-08',
    occasion: 'Wedding',
    status: 'In production',
    totalEUR: 68,
    totalNGN: 120000,
  },
  'CS-554210': {
    id: 'CS-554210',
    customer: 'Samuel D.',
    design: 'Italian 3-Piece Suit',
    fabric: 'Super 120s Italian Wool',
    color: 'Charcoal Grey',
    phone: '+39 333 999 888',
    estimatedDelivery: '2026-09-02',
    occasion: 'Corporate Gala',
    status: 'Inspection',
    totalEUR: 90,
    totalNGN: 160000,
    inspectionMedia: {
      photos: ['/images/design-suit.jpg', '/images/category-suits.jpg'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    },
  },
  'CS-983174': {
    id: 'CS-983174',
    customer: 'Amadi K.',
    design: 'Kaftan Royale',
    fabric: 'Soft Cotton Blend',
    color: 'Emerald Green',
    phone: '+34 666 777 888',
    estimatedDelivery: '2026-09-12',
    occasion: 'Birthday Party',
    status: 'Confirmed',
    totalEUR: 42,
    totalNGN: 75000,
  },
  'CS-112233': {
    id: 'CS-112233',
    customer: 'Kunle A.',
    design: 'Classic Senator',
    fabric: 'Italian Linen',
    color: 'Slate Grey',
    phone: '+39 333 111 222',
    estimatedDelivery: '2026-08-25',
    occasion: 'Everyday wear',
    status: 'Delivered',
    totalEUR: 47,
    totalNGN: 85000,
  },
}

const STATUS_STEPS: {
  status: OrderRecord['status']
  label: string
  desc: string
}[] = [
    { status: 'New', label: 'Order Placed', desc: 'Awaiting deposit payment confirmation.' },
    { status: 'Confirmed', label: 'Deposit Received', desc: '50% deposit processed. Measurements validated.' },
    { status: 'In production', label: 'In Production', desc: 'Tailors in our Lagos/Aba workshop are crafting your pieces.' },
    { status: 'Inspection', label: 'Inspection Stage', desc: 'Attire completed. Samuelson reviews video for quality sign-off.' },
    { status: 'Approved', label: 'Approved & Ready', desc: 'Quality approved. Awaiting remaining 50% balance payment.' },
    { status: 'Dispatched', label: 'Dispatched', desc: 'DHL Express courier package handed over for delivery.' },
    { status: 'Delivered', label: 'Delivered', desc: 'Garment successfully delivered.' },
  ]

function TrackingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const queryId = searchParams.get('id') || ''
  const [searchInput, setSearchInput] = useState(queryId)
  const [activeTab, setActiveTab] = useState<'details' | 'inspection'>('details')

  // Search logic that matches Order ID or Phone Number
  const matchedOrder = useMemo(() => {
    if (!queryId) return null

    const formattedQuery = queryId.trim().toUpperCase()

    // Check static database first
    if (STATIC_ORDERS[formattedQuery]) {
      return STATIC_ORDERS[formattedQuery]
    }

    // Check by phone number
    const byPhone = Object.values(STATIC_ORDERS).find(
      o => o.phone.replace(/\s+/g, '') === queryId.trim().replace(/\s+/g, '')
    )
    if (byPhone) return byPhone

    // Fallback: If it's a valid looking Order ID format CS-XXXXXX, dynamically generate a "Confirmed" order record
    if (/^CS-\d{6}$/.test(formattedQuery)) {
      return {
        id: formattedQuery,
        customer: 'Bespoke Client',
        design: searchParams.get('design') ? searchParams.get('design')!.replace('-', ' ') : 'Custom Piece',
        fabric: 'Selected Fabric',
        color: 'Selected Color',
        phone: 'Registered Phone',
        estimatedDelivery: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        occasion: 'Bespoke Event',
        status: 'Confirmed' as const,
        totalEUR: parseInt(searchParams.get('total') || '68'),
        totalNGN: parseInt(searchParams.get('total') || '68') * 1700,
      }
    }

    return null
  }, [queryId, searchParams])

  // Sync state if URL search param updates
  useEffect(() => {
    if (queryId) setSearchInput(queryId)
  }, [queryId])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('id', searchInput.trim().toUpperCase())
    router.push(`/track?${params.toString()}`)
    setActiveTab('details')
  }

  // Get index of active status step
  const activeStepIndex = useMemo(() => {
    if (!matchedOrder) return -1
    return STATUS_STEPS.findIndex(s => s.status === matchedOrder.status)
  }, [matchedOrder])

  // Helper classes
  const inputClasses =
    'w-full px-4 bg-brown-950/40 border border-brown-800 text-cream-200 placeholder-stone-600 focus:outline-none focus:border-caramel-500 font-body text-xs tracking-wider transition-colors duration-200 rounded-none'

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pb-24 flex flex-col justify-between" style={{ paddingTop: "150px", paddingBottom: "80px" }}>
        <div className="container-brand max-w-2xl mx-auto flex-1 flex flex-col justify-center w-full">

          {/* Header Title — Centered */}
          <div className="text-center pb-8" style={{ marginBottom: "32px" }}>
            <SectionEyebrow label="Order Status" />
            <h1 className="text-heading-xl text-cream-200 mt-2 font-normal text-left">
              Track Your Piece
            </h1>
            <p className="text-body text-stone-300 mt-4 max-w-md mx-auto">
              Access real-time status updates of your bespoke tailoring order. Enter your Order ID or registered phone number below.
            </p>
          </div>

          {/* Input Portal Form — Centered, Spaced */}
          <div className="mx-auto w-full" style={{ marginBottom: "48px" }}>
            <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
              <input
                type="text"
                placeholder="E.g., CS-783210 or Phone Number"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className={inputClasses}
                style={{ height: "50px", padding: "0px 25px" }}
                required
              />
              <Button type="submit" variant="primary" size="lg" className="shrink-0" style={{ padding: "12px 24px" }}>
                Track
              </Button>
            </form>
          </div>

          {/* Search Result Display */}
          {queryId ? (
            matchedOrder ? (
              <div className="flex flex-col gap-10 animate-fadeIn w-full">

                {/* Order Meta Header Card — Centered details */}
                <div className="bg-brown-950/40 p-8 md:p-10 text-center flex flex-col items-center gap-6 border">
                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest block">
                      Order Reference
                    </span>
                    <h2 className="font-display text-2xl font-bold text-caramel-400 tracking-wider mt-1">
                      {matchedOrder.id}
                    </h2>
                    <p className="font-body text-xs text-stone-400 mt-2">
                      Item: <strong className="text-cream-200">{matchedOrder.design}</strong> · Fabric: <strong className="text-cream-200">{matchedOrder.fabric}</strong>
                    </p>
                  </div>

                  <div className="w-full h-px bg-brown-900/40" />

                  <div>
                    <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest block">
                      Estimated Delivery
                    </span>
                    <strong className="font-display text-2xl font-normal text-cream-100 block mt-1">
                      {new Date(matchedOrder.estimatedDelivery).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>
                    <span className="text-[9px] text-stone-500 uppercase tracking-widest block mt-1">
                      Status SLA: {STATUS_STEPS[activeStepIndex]?.label}
                    </span>
                  </div>
                </div>

                {/* Sub-navigation tabs — Centered category-style button tabs */}
                {matchedOrder.inspectionMedia && (
                  <div className="flex justify-center gap-3" style={{ marginBottom: "8px" }}>
                    <button
                      onClick={() => setActiveTab('details')}
                      className={[
                        'px-5 py-2.5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-300 shrink-0 cursor-pointer select-none rounded-none border-0 outline-none',
                        activeTab === 'details'
                          ? 'bg-caramel-500 text-brown-900 font-bold'
                          : 'bg-brown-950/40 text-stone-300 hover:bg-brown-950/60 hover:text-cream-100',
                      ].join(' ')}
                    >
                      Status Details
                    </button>
                    <button
                      onClick={() => setActiveTab('inspection')}
                      className={[
                        'px-5 py-2.5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-300 shrink-0 cursor-pointer select-none rounded-none border-0 outline-none',
                        activeTab === 'inspection'
                          ? 'bg-caramel-500 text-brown-900 font-bold'
                          : 'bg-brown-950/40 text-stone-300 hover:bg-brown-950/60 hover:text-cream-100',
                      ].join(' ')}
                    >
                      Inspection Media
                    </button>
                  </div>
                )}

                {/* Content Panel 1: Status Stepper details */}
                {activeTab === 'details' && (
                  <div className="flex flex-col gap-10 items-stretch">

                    {/* Visual Progress Stepper — Fully Centered layout */}
                    <div className="flex flex-col gap-6">
                      <h3 className="text-label text-caramel-400 font-bold text-center mb-2">Visual Progress Stepper</h3>
                      <div className="flex flex-col items-center">
                        {STATUS_STEPS.map((step, idx) => {
                          const isCompleted = idx < activeStepIndex
                          const isActive = idx === activeStepIndex

                          return (
                            <div key={idx} className="flex flex-col items-center w-full">
                              {/* Step circle + info */}
                              <div className="text-center flex flex-col items-center max-w-md py-2">
                                <div className="flex items-center gap-2 justify-center mb-1">
                                  <span
                                    className={[
                                      'w-2.5 h-2.5 rounded-full border flex items-center justify-center transition-all duration-300',
                                      isActive
                                        ? 'bg-caramel-500 border-caramel-500 scale-125 shadow-lg shadow-caramel-500/20'
                                        : isCompleted
                                          ? 'bg-brown-800 border-caramel-500'
                                          : 'bg-brown-950 border-brown-800',
                                    ].join(' ')}
                                  >
                                    {isCompleted && (
                                      <span className="w-1.5 h-1.5 rounded-full bg-caramel-500" />
                                    )}
                                  </span>
                                  <span
                                    className={[
                                      'text-xs tracking-wider uppercase font-semibold transition-colors duration-300',
                                      isActive
                                        ? 'text-caramel-400 font-bold'
                                        : isCompleted
                                          ? 'text-cream-200'
                                          : 'text-stone-500',
                                    ].join(' ')}
                                  >
                                    {step.label}
                                  </span>
                                </div>
                                {isActive && (
                                  <p className="text-body text-stone-300 text-xs leading-relaxed max-w-sm mt-2 animate-fadeIn">
                                    {step.desc}
                                  </p>
                                )}
                              </div>

                              {/* Vertical connector line */}
                              {idx < STATUS_STEPS.length - 1 && (
                                <div className="w-px h-10 bg-brown-900/60 my-1" />
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Specs Summary — Flat, borderless, centered */}
                    <div className="p-8 bg-brown-950/40 flex flex-col gap-4 text-center items-center max-w-md mx-auto w-full mt-4">
                      <h4 className="text-label text-caramel-400 font-bold">Specs Summary</h4>
                      <div className="flex flex-col gap-2 font-body text-xs text-stone-400">
                        <p><strong className="text-cream-200">Colour:</strong> {matchedOrder.color}</p>
                        <p><strong className="text-cream-200">Occasion:</strong> {matchedOrder.occasion}</p>
                        <p>
                          <strong className="text-cream-200">Invoiced:</strong> €{matchedOrder.totalEUR} / ₦{matchedOrder.totalNGN.toLocaleString('en-NG')}
                        </p>
                      </div>
                    </div>

                    {/* WhatsApp Help CTA — Flat, centered */}
                    <div className="p-8 bg-brown-950/40 text-center flex flex-col items-center gap-4 max-w-md mx-auto w-full mt-2">
                      <span className="text-[10px] text-stone-400 font-semibold uppercase tracking-widest block">
                        Need Assistance?
                      </span>
                      <p className="text-body text-stone-400 text-xs leading-relaxed max-w-xs">
                        Have questions about your sizing, deadline adjustments, or delivery options? Chat directly with Samuelson on WhatsApp.
                      </p>
                      <Button
                        href={`https://wa.me/message/PLACEHOLDER?text=Hello%20CaptainStitches,%20I%20have%20a%20question%20about%20order%20${matchedOrder.id}`}
                        variant="accent"
                        size="sm"
                        external
                        style={{ padding: "10px 24px" }}
                      >
                        Chat on WhatsApp
                      </Button>
                    </div>

                  </div>
                )}

                {/* Content Panel 2: Tailor Quality Inspection Media — Centered layout */}
                {activeTab === 'inspection' && matchedOrder.inspectionMedia && (
                  <div className="flex flex-col gap-8 animate-fadeIn w-full items-center">
                    <div className="text-center">
                      <h3 className="text-label text-caramel-400 font-bold">Tailor Inspection Quality Assurance</h3>
                      <p className="text-body text-stone-400 text-xs mt-2 max-w-md mx-auto leading-relaxed">
                        Our workshop in Nigeria has completed assembly. Review the inspection media below. Once you approve, proceed to settle your remaining balance.
                      </p>
                    </div>

                    <div className="flex flex-col gap-8 w-full max-w-lg">
                      {/* Photo Inspection Grid */}
                      <div className="flex flex-col gap-4 items-center">
                        <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest">
                          Inspection Photos
                        </span>
                        <div className="grid grid-cols-2 gap-4 w-full">
                          {matchedOrder.inspectionMedia.photos.map((ph, idx) => (
                            <div key={idx} className="relative h-64 bg-brown-950/40">
                              <Image
                                src={ph}
                                alt={`Inspection layout photo ${idx + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 50vw, 25vw"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Video Inspection player */}
                      {matchedOrder.inspectionMedia.videoUrl && (
                        <div className="flex flex-col gap-4 items-center w-full">
                          <span className="text-[10px] text-stone-500 font-semibold uppercase tracking-widest">
                            Inspection Video
                          </span>
                          <div className="relative h-[256px] bg-brown-950 flex items-center justify-center w-full">
                            <video
                              src={matchedOrder.inspectionMedia.videoUrl}
                              controls
                              className="w-full h-full object-cover"
                              poster="/images/hero-bg.jpeg"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Block to Approve quality — Flat panel */}
                    <div className="mt-4 p-8 bg-brown-950/40 text-center flex flex-col items-center gap-4 max-w-md mx-auto w-full">
                      <span className="text-label text-caramel-400 font-bold">Quality Approved?</span>
                      <p className="text-body text-stone-400 text-xs leading-relaxed max-w-xs">
                        Upon your approval, we will compile the courier packages. Settle your 50% outstanding balance to trigger DHL courier dispatch.
                      </p>
                      <div className="flex gap-4">
                        <Button href={`https://wa.me/message/PLACEHOLDER?text=Hello%20Samuelson,%20I%20approve%20quality%20for%20order%20${matchedOrder.id}`} variant="primary" size="sm" external style={{ padding: "10px 24px" }}>
                          Confirm & WhatsApp Samuelson
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Error/Empty state when ID not found — Centered flat panel */
              <div className="flex flex-col items-center justify-center text-center p-12 bg-brown-950/40 max-w-md mx-auto animate-fadeIn w-full" style={{ minHeight: "300px" }}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="w-12 h-12 text-red-500/60 mb-6"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z" />
                </svg>
                <h3 className="font-display text-xl text-cream-200 font-bold mb-2">
                  Order Reference Not Found
                </h3>
                <p className="text-body text-stone-400 mb-8 text-sm max-w-xs leading-relaxed">
                  We couldn't find any orders matching "{queryId}". Please verify the ID from your deposit confirmation receipt, or check your details.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setSearchInput('')
                      router.push('/track')
                    }}
                    className="px-5 py-2.5 text-xs tracking-widest bg-transparent text-cream-200 border border-brown-700 hover:border-caramel-500 hover:text-caramel-500 uppercase font-body font-medium transition-colors duration-200 cursor-pointer select-none rounded-none"
                    style={{ height: "45px" }}
                  >
                    Clear Search
                  </button>
                  <Button href="https://wa.me/message/PLACEHOLDER" variant="primary" size="sm" external style={{ padding: "12px 15px" }}>
                    Contact Support
                  </Button>
                </div>
              </div>
            )
          ) : (
            /* Idle Initial state — Centered flat panel */
            <div className="p-12 text-center max-w-full mx-auto bg-brown-950/40 w-full flex flex-col justify-center items-center" style={{ minHeight: "260px" }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="currentColor"
                className="w-10 h-10 text-stone-600 mx-auto mb-4"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <h3 className="font-display text-lg text-cream-200 font-semibold mb-2">
                Awaiting Order Reference
              </h3>
              <p className="text-body text-stone-400 text-xs leading-relaxed max-w-xs">
                Use your custom Order ID (e.g. `CS-783210`) sent to your email or WhatsApp after deposit confirmation to see your live stepper timeline.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function TrackingPage() {
  return (
    <Suspense fallback={
      <div className="bg-brown-900 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <TrackingContent />
    </Suspense>
  )
}
