'use client'

import React, { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { trackOrderAction, TrackedOrder } from '@/lib/actions/orders'
import { getAllOrders, AdminOrder } from '@/data/adminOrdersData'

const STATUS_STEPS: {
  status: TrackedOrder['status']
  label: string
  desc: string
}[] = [
  { status: 'New', label: 'Order Placed', desc: 'Awaiting deposit payment confirmation. Measurements and specifications logged.' },
  { status: 'Confirmed', label: 'Deposit Received', desc: '50% deposit processed. Measurements validated by head tailor in Verona.' },
  { status: 'In production', label: 'In Production', desc: 'Tailors in our Nigerian atelier are hand-chalking, cutting, and stitching your pieces.' },
  { status: 'Inspection', label: 'Quality Inspection', desc: 'Attire completed. Detailed high-res photos and 360° fit video uploaded for your sign-off.' },
  { status: 'Approved', label: 'Approved & Packaged', desc: 'Quality approved by client. Awaiting remaining 50% balance before courier dispatch.' },
  { status: 'Dispatched', label: 'Dispatched via Courier', desc: 'DHL Express international air freight tracking active to your European delivery address.' },
  { status: 'Delivered', label: 'Delivered to Door', desc: 'Garment successfully delivered. Covered by our Verona free alterations guarantee.' },
]

// Fallback static sample orders for instant testing and demonstration
const STATIC_FALLBACK_ORDERS: Record<string, TrackedOrder> = {
  'CS-783210': {
    id: 'CS-783210',
    dbId: 'static-1',
    customer: 'Chidi O.',
    customerFullName: 'Chidi Okonkwo',
    phone: '+39 333 444 555',
    design: 'Grand Agbada',
    fabric: 'Presidential Cashmere',
    color: 'Midnight Black',
    estimatedDelivery: '2026-10-15',
    occasion: 'Royal Wedding',
    status: 'In production',
    deliveryLocation: 'Italy',
    deliveryAddress: 'Via Giuseppe Mazzini 14, Verona, Italy',
    totalEUR: 68,
    totalNGN: 120000,
    depositAmount: 34,
    depositPaid: true,
    balanceAmount: 34,
    balancePaid: false,
    primaryImage: '/images/design-agbada.jpg',
    inspectionMedia: {
      photos: ['/images/design-agbada.jpg'],
    },
    timeline: [
      { status: 'New', date: '2026-09-01T10:00:00Z', notes: 'Order placed by client.', actor: 'Client Portal' },
      { status: 'Confirmed', date: '2026-09-02T12:30:00Z', notes: 'Deposit validated by atelier.', actor: 'Samuelson Anaele' },
      { status: 'In production', date: '2026-09-05T08:00:00Z', notes: 'Brocade chalking & cutting underway.', actor: 'Babatunde Bello' },
    ],
  },
  'CS-554210': {
    id: 'CS-554210',
    dbId: 'static-2',
    customer: 'Samuel D.',
    customerFullName: 'Samuel Danladi',
    phone: '+39 333 999 888',
    design: 'Ankara Silk Tie & Agbada Ensemble',
    fabric: 'Royal Nigerian Brocade & Silk',
    color: 'Midnight Gold',
    estimatedDelivery: '2026-10-08',
    occasion: 'Cultural Gala',
    status: 'Inspection',
    deliveryLocation: 'Italy',
    deliveryAddress: 'Corso Porta Nuova 22, Verona, Italy',
    totalEUR: 110,
    totalNGN: 180000,
    depositAmount: 55,
    depositPaid: true,
    balanceAmount: 55,
    balancePaid: false,
    primaryImage: '/images/category-accessories.jpg',
    inspectionMedia: {
      photos: ['/images/design-accessories.jpg', '/images/category-accessories.jpg'],
      videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
      notes: 'Embroidery finished with reinforced seams and satin pocket lining.',
    },
    timeline: [
      { status: 'New', date: '2026-08-20T10:00:00Z', notes: 'Commission initialized.', actor: 'Client Portal' },
      { status: 'Confirmed', date: '2026-08-21T11:00:00Z', notes: 'Deposit received.', actor: 'Samuelson Anaele' },
      { status: 'In production', date: '2026-08-24T09:00:00Z', notes: 'Hand stitching in progress.', actor: 'Ibrahim Musa' },
      { status: 'Inspection', date: '2026-09-02T16:00:00Z', notes: 'High-res photos uploaded for sign-off.', actor: 'Chioma Okafor' },
    ],
  },
  'CS-983174': {
    id: 'CS-983174',
    dbId: 'static-3',
    customer: 'Amadi K.',
    customerFullName: 'Amadi Kalu',
    phone: '+34 666 777 888',
    design: 'Kaftan Royale',
    fabric: 'Soft Cotton Blend',
    color: 'Emerald Green',
    estimatedDelivery: '2026-10-18',
    occasion: 'Birthday Party',
    status: 'Confirmed',
    deliveryLocation: 'Italy',
    deliveryAddress: 'Via Roma 45, Milan, Italy',
    totalEUR: 42,
    totalNGN: 75000,
    depositAmount: 21,
    depositPaid: true,
    balanceAmount: 21,
    balancePaid: false,
    primaryImage: '/images/design-kaftan.jpg',
    timeline: [
      { status: 'New', date: '2026-09-10T14:00:00Z', notes: 'Order placed.', actor: 'Client Portal' },
      { status: 'Confirmed', date: '2026-09-11T09:00:00Z', notes: 'Measurements approved.', actor: 'Samuelson Anaele' },
    ],
  },
  'CS-112233': {
    id: 'CS-112233',
    dbId: 'static-4',
    customer: 'Kunle A.',
    customerFullName: 'Kunle Adeyemi',
    phone: '+39 333 111 222',
    design: 'Classic Senator',
    fabric: 'Italian Linen',
    color: 'Slate Grey',
    estimatedDelivery: '2026-09-20',
    occasion: 'Diplomatic Reception',
    status: 'Delivered',
    deliveryLocation: 'Italy',
    deliveryAddress: 'Via Dante Alighieri 8, Brescia, Italy',
    totalEUR: 47,
    totalNGN: 85000,
    depositAmount: 23,
    depositPaid: true,
    balanceAmount: 24,
    balancePaid: true,
    primaryImage: '/images/design-senator.jpg',
    timeline: [
      { status: 'Delivered', date: '2026-09-20T17:00:00Z', notes: 'Delivered to client via DHL.', actor: 'DHL Courier' },
    ],
  },
}

function mapAdminOrderToTrackedOrder(adminOrder: AdminOrder): TrackedOrder {
  const statusMap: Record<string, TrackedOrder['status']> = {
    NEW: 'New',
    CONFIRMED: 'Confirmed',
    IN_PRODUCTION: 'In production',
    INSPECTION: 'Inspection',
    APPROVED: 'Approved',
    DISPATCHED: 'Dispatched',
    DELIVERED: 'Delivered',
  }

  return {
    id: adminOrder.orderNumber,
    dbId: adminOrder.id,
    customer: adminOrder.customer.name,
    customerFullName: adminOrder.customer.name,
    customerEmail: adminOrder.customer.email,
    phone: adminOrder.customer.phone,
    design: adminOrder.design.name,
    fabric: adminOrder.design.fabric || 'Premium Atelier Fabric',
    color: adminOrder.design.colour || 'Selected Hue',
    estimatedDelivery: adminOrder.details.estimatedDeliveryDate || 'Within 14 business days',
    occasion: adminOrder.details.occasion || 'Bespoke Fitting',
    status: statusMap[adminOrder.status] || 'New',
    deliveryLocation: adminOrder.details.deliveryLocation,
    deliveryAddress: adminOrder.details.fullAddress,
    totalEUR: adminOrder.payment.totalEUR,
    totalNGN: adminOrder.payment.totalNGN,
    depositAmount: adminOrder.payment.depositAmount,
    depositPaid: adminOrder.payment.depositStatus === 'PAID',
    balanceAmount: adminOrder.payment.balanceAmount,
    balancePaid: adminOrder.payment.balanceStatus === 'PAID',
    balancePaymentLink: adminOrder.payment.balancePaymentLink,
    primaryImage: adminOrder.design.image || '/images/design-agbada.jpg',
    inspectionMedia: adminOrder.inspection.photos.length > 0 || adminOrder.inspection.videoUrl ? {
      photos: adminOrder.inspection.photos,
      videoUrl: adminOrder.inspection.videoUrl,
      notes: adminOrder.inspection.notes,
    } : undefined,
    timeline: adminOrder.notifications.map((n) => ({
      status: n.event,
      date: n.timestamp,
      notes: n.details,
      actor: 'Atelier Operations',
    })),
  }
}

function TrackingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawQuery = searchParams.get('id') || searchParams.get('ref') || searchParams.get('order') || ''
  const [searchInput, setSearchInput] = useState(rawQuery)
  const [activeTab, setActiveTab] = useState<'details' | 'inspection' | 'timeline'>('details')
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrder | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  // Fetch order data whenever rawQuery changes
  useEffect(() => {
    if (!rawQuery.trim()) {
      setTrackedOrder(null)
      setIsLoading(false)
      setHasSearched(false)
      return
    }

    const q = rawQuery.trim()
    setSearchInput(q)
    setIsLoading(true)
    setHasSearched(true)

    let isMounted = true

    async function fetchOrder() {
      try {
        // 1. First, attempt fetching from PostgreSQL Database via Server Action
        const serverResult = await trackOrderAction(q)
        if (!isMounted) return

        if (serverResult.success && serverResult.order) {
          setTrackedOrder(serverResult.order)
          setIsLoading(false)
          return
        }

        // 2. Second, check browser LocalStorage (Admin Orders store)
        const localOrders = getAllOrders()
        const cleanQuery = q.toLowerCase()
        const foundLocal = localOrders.find(
          (o) =>
            o.orderNumber.toLowerCase() === cleanQuery ||
            o.id.toLowerCase() === cleanQuery ||
            o.customer.phone.replace(/[^\d]/g, '').includes(q.replace(/[^\d]/g, '')) ||
            (o.customer.email && o.customer.email.toLowerCase() === cleanQuery) ||
            o.orderNumber.toLowerCase().includes(cleanQuery)
        )

        if (foundLocal) {
          setTrackedOrder(mapAdminOrderToTrackedOrder(foundLocal))
          setIsLoading(false)
          return
        }

        // 3. Third, check Static Fallback Records
        const upper = q.toUpperCase()
        if (STATIC_FALLBACK_ORDERS[upper]) {
          setTrackedOrder(STATIC_FALLBACK_ORDERS[upper])
          setIsLoading(false)
          return
        }

        const foundStaticByPhone = Object.values(STATIC_FALLBACK_ORDERS).find((o) =>
          o.phone.replace(/[^\d]/g, '').includes(q.replace(/[^\d]/g, ''))
        )
        if (foundStaticByPhone) {
          setTrackedOrder(foundStaticByPhone)
          setIsLoading(false)
          return
        }

        // Not located in any layer
        setTrackedOrder(null)
        setIsLoading(false)
      } catch (err) {
        console.error('Failed to locate order:', err)
        if (isMounted) {
          setTrackedOrder(null)
          setIsLoading(false)
        }
      }
    }

    fetchOrder()

    return () => {
      isMounted = false
    }
  }, [rawQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    const trimmed = searchInput.trim().toUpperCase()
    const params = new URLSearchParams()
    params.set('id', trimmed)
    router.push(`/track?${params.toString()}`)
    setActiveTab('details')
  }

  const handleSampleClick = (sampleId: string) => {
    setSearchInput(sampleId)
    const params = new URLSearchParams()
    params.set('id', sampleId)
    router.push(`/track?${params.toString()}`)
    setActiveTab('details')
  }

  const activeStepIndex = useMemo(() => {
    if (!trackedOrder) return -1
    return STATUS_STEPS.findIndex((s) => s.status === trackedOrder.status)
  }, [trackedOrder])

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-[#0C0704] min-h-screen text-[#FAF6F0]">
        {/* =========================================================================
            SECTION 1: OBSIDIAN TRACKER PORTAL (#0C0704)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#0C0704] text-[#FAF6F0] border-b border-stone-800/80"
          style={{
            paddingTop: 'clamp(6rem, 10vw, 8.5rem)',
            paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '960px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              paddingRight: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              boxSizing: 'border-box',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <span
                className="inline-block text-[#C4975A] font-semibold text-xs tracking-[0.25em] uppercase"
                style={{ marginBottom: '8px' }}
              >
                Live Workshop Tracker
              </span>
              <h1
                className="font-serif text-[#FAF6F0] font-bold leading-tight"
                style={{ fontSize: 'clamp(2.15rem, 4.2vw, 3.25rem)', marginBottom: '0.75rem' }}
              >
                Track Your Bespoke Commission
              </h1>
              <p
                className="font-body text-stone-300 text-sm max-w-lg mx-auto"
                style={{ lineHeight: 1.6 }}
              >
                Monitor each hand-tailored milestone in real time—from measurement validation in Verona to hand-cutting in Nigeria and direct DHL delivery.
              </p>
            </div>

            {/* Search Input Card */}
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col sm:flex-row gap-3 rounded-2xl bg-[#140C07] border border-stone-800 p-2.5 shadow-2xl"
              style={{ maxWidth: '680px', margin: '0 auto' }}
            >
              <input
                type="text"
                placeholder="Enter Order ID (e.g. CS-0092), Phone or Email"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="flex-1 px-5 py-3.5 bg-[#FAF7F2] text-[#140C07] placeholder-[#786C60] font-body text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-[#C4975A]"
                required
              />
              <Button
                type="submit"
                variant="primary"
                size="md"
                className="shrink-0"
                style={{
                  padding: '12px 28px',
                  borderRadius: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                }}
              >
                {isLoading ? 'Locating...' : 'Track Order'}
              </Button>
            </form>

            {/* Quick Demo Reference Chips */}
            <div
              style={{
                marginTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span className="text-[11px] text-stone-400 font-body">Quick Test Samples:</span>
              <button
                type="button"
                onClick={() => handleSampleClick('CS-0092')}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#1C120C] text-[#C4975A] border border-[#C4975A]/40 hover:bg-[#C4975A]/20 transition-colors cursor-pointer"
              >
                CS-0092 (Live)
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('CS-783210')}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#1C120C] text-stone-300 border border-stone-800 hover:text-white transition-colors cursor-pointer"
              >
                CS-783210 (In Production)
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('CS-554210')}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#1C120C] text-stone-300 border border-stone-800 hover:text-white transition-colors cursor-pointer"
              >
                CS-554210 (Inspection Media)
              </button>
              <button
                type="button"
                onClick={() => handleSampleClick('CS-112233')}
                className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-[#1C120C] text-[#34D399] border border-[#10B981]/40 hover:bg-[#10B981]/20 transition-colors cursor-pointer"
              >
                CS-112233 (Delivered)
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: TRACKING RESULTS DISPLAY (#071A14 / Royal Emerald)
        ========================================================================= */}
        {hasSearched && (
          <section
            className="relative w-full bg-[#071A14] text-[#FAF6F0] border-b border-[#10B981]/25"
            style={{
              paddingTop: 'clamp(3rem, 5vw, 4.5rem)',
              paddingBottom: 'clamp(4rem, 6.5vw, 5.5rem)',
            }}
          >
            <div
              className="container-brand"
              style={{
                maxWidth: '960px',
                margin: '0 auto',
                width: '100%',
                paddingLeft: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                paddingRight: 'clamp(1.25rem, 3.5vw, 2.5rem)',
                boxSizing: 'border-box',
              }}
            >
              {isLoading ? (
                /* Loading State */
                <div
                  className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/90 p-12 text-center max-w-md mx-auto shadow-2xl"
                  style={{ padding: '3.5rem 2rem' }}
                >
                  <div
                    className="border-3 border-[#C4975A] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                    style={{ width: '42px', height: '42px', borderWidth: '3px' }}
                  />
                  <h3 className="font-serif text-lg font-bold text-cream-100 mb-1">
                    Consulting Atelier Records
                  </h3>
                  <p className="text-xs text-stone-300 font-body">
                    Retrieving live workshop status for reference &ldquo;{rawQuery}&rdquo;...
                  </p>
                </div>
              ) : trackedOrder ? (
                /* Found Order State */
                <div className="flex flex-col gap-8 animate-fadeIn">
                  {/* Order Header Summary Banner */}
                  <div
                    className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/85 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-2xl"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                        <span className="text-[10px] text-[#A7F3D0] uppercase tracking-widest font-bold">
                          Active Commission Record
                        </span>
                      </div>
                      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#E8D4B0] tracking-tight">
                        {trackedOrder.id}
                      </h2>
                      <p className="text-xs text-stone-300 font-body mt-2">
                        Patron: <strong className="text-cream-100">{trackedOrder.customerFullName}</strong> · Garment:{' '}
                        <strong className="text-cream-100">{trackedOrder.design}</strong>
                      </p>
                      <p className="text-xs text-stone-400 font-body mt-0.5">
                        Destination: <span className="text-stone-300">{trackedOrder.deliveryAddress}, {trackedOrder.deliveryLocation}</span>
                      </p>
                    </div>

                    <div className="md:text-right">
                      <span className="text-[10px] text-[#A7F3D0] uppercase tracking-widest font-semibold block mb-1">
                        Estimated Atelier Dispatch
                      </span>
                      <strong className="font-serif text-xl sm:text-2xl text-cream-100 block">
                        {new Date(trackedOrder.estimatedDelivery).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </strong>
                      <span className="inline-block mt-2 rounded-full bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/40 px-3.5 py-1 text-[11px] font-bold uppercase tracking-wider">
                        {STATUS_STEPS[activeStepIndex]?.label || trackedOrder.status}
                      </span>
                    </div>
                  </div>

                  {/* Garment Showcase Card */}
                  <div
                    className="rounded-3xl border border-[#10B981]/25 bg-[#0C0704]/75 p-6 sm:p-8 flex flex-col md:flex-row gap-6 items-center shadow-xl"
                  >
                    {/* Thumbnail Image */}
                    {trackedOrder.primaryImage && (
                      <div
                        className="relative w-full md:w-48 h-56 rounded-2xl overflow-hidden shrink-0 bg-[#1C120C] border border-stone-800 shadow-lg"
                      >
                        <Image
                          src={trackedOrder.primaryImage}
                          alt={trackedOrder.design}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 200px"
                          priority
                        />
                        <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/70 backdrop-blur-sm text-[#C4975A] text-[9px] font-bold uppercase tracking-wider">
                          Atelier Model
                        </div>
                      </div>
                    )}

                    {/* Garment Details & Specs */}
                    <div className="flex-1 w-full flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] text-[#C4975A] uppercase tracking-widest font-bold block mb-1">
                          Tailoring Specifications
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-cream-100 mb-2">
                          {trackedOrder.design}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs font-body text-stone-300 mt-3">
                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-400">Fabric Choice:</span>
                            <strong className="text-cream-100">{trackedOrder.fabric}</strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-400">Selected Color:</span>
                            <span className="inline-flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#C4975A] border border-white/20 inline-block" />
                              <strong className="text-cream-100">{trackedOrder.color}</strong>
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-400">Commission Occasion:</span>
                            <strong className="text-cream-100">{trackedOrder.occasion}</strong>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-stone-400">Total Investment:</span>
                            <strong className="text-[#C4975A] font-bold">
                              €{trackedOrder.totalEUR} / ₦{trackedOrder.totalNGN.toLocaleString('en-NG')}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Deposit / Balance Summary */}
                      <div
                        className="mt-4 pt-4 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-3 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${trackedOrder.depositPaid ? 'bg-emerald-400' : 'bg-amber-400'}`}
                          />
                          <span className="text-stone-300">
                            50% Deposit: <strong>€{trackedOrder.depositAmount}</strong> (
                            {trackedOrder.depositPaid ? 'Confirmed' : 'Awaiting Payment'})
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${trackedOrder.balancePaid ? 'bg-emerald-400' : 'bg-stone-500'}`}
                          />
                          <span className="text-stone-400">
                            50% Balance: <strong>€{trackedOrder.balanceAmount}</strong> (
                            {trackedOrder.balancePaid ? 'Settled' : 'Upon Inspection Approval'})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Delivered Customer Review Callout */}
                  {trackedOrder.status === 'Delivered' && (
                    <div className="rounded-3xl border border-[#C4975A]/50 bg-gradient-to-br from-[#1A120B] via-[#120B07] to-[#071A14] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-72 h-72 bg-[#C4975A]/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C4975A]/20 border border-[#C4975A]/40 text-[#E8D4B0] text-[10px] font-bold uppercase tracking-wider">
                              <span>✨</span> Delivered &amp; Fitting Guarantee
                            </span>
                            {trackedOrder.review && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-[10px] font-bold">
                                ✓ Review Submitted
                              </span>
                            )}
                          </div>
                          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mb-2">
                            {trackedOrder.review ? 'Thank You for Your Bespoke Review' : 'How Does Your Bespoke Attire Fit?'}
                          </h3>
                          <p className="text-xs sm:text-sm text-stone-300 font-body leading-relaxed max-w-xl">
                            {trackedOrder.review
                              ? 'Your feedback has been recorded in our atelier ledger and helps our master tailors uphold generational craftsmanship.'
                              : 'Your garment has arrived at your European doorstep. Our master tailors in Verona and Nigeria would be delighted to hear how your attire drapes and fits.'}
                          </p>

                          {trackedOrder.review && (
                            <div className="mt-4 p-4 rounded-2xl bg-black/50 border border-stone-800 text-xs text-stone-300">
                              <div className="flex items-center gap-2 mb-1.5">
                                <div className="flex text-[#C4975A] text-sm tracking-widest">
                                  {'★'.repeat(trackedOrder.review.rating)}{'☆'.repeat(5 - trackedOrder.review.rating)}
                                </div>
                                <span className="text-[11px] font-bold text-[#E8D4B0]">
                                  {trackedOrder.review.rating}.0 / 5.0
                                </span>
                                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-stone-800 text-stone-300 border border-stone-700">
                                  Status: {trackedOrder.review.status}
                                </span>
                              </div>
                              {trackedOrder.review.comment && (
                                <p className="italic text-stone-200 font-body text-xs mt-1.5 leading-relaxed">
                                  &ldquo;{trackedOrder.review.comment}&rdquo;
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full md:w-auto">
                          {!trackedOrder.review ? (
                            <Link
                              href={`/review?order=${encodeURIComponent(trackedOrder.id)}`}
                              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C4975A] hover:bg-[#d6aa6d] text-[#0C0704] font-serif font-bold text-sm px-6 py-3.5 shadow-xl shadow-[#C4975A]/20 transition-all hover:scale-[1.02] cursor-pointer text-center"
                            >
                              <span>⭐ Leave a Review &amp; Photos</span>
                              <span aria-hidden="true">→</span>
                            </Link>
                          ) : (
                            <div className="flex flex-col sm:flex-row md:flex-col gap-2">
                              <Link
                                href={`/review?order=${encodeURIComponent(trackedOrder.id)}&mode=edit`}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#C4975A] hover:bg-[#d6aa6d] text-[#0C0704] font-serif font-bold text-xs uppercase tracking-wider px-5 py-3 transition-all text-center shadow-md cursor-pointer"
                              >
                                <span>✏️ Edit Review &amp; Photos</span>
                              </Link>
                              <Link
                                href={`/review?order=${encodeURIComponent(trackedOrder.id)}`}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-[#E8D4B0] border border-[#C4975A]/40 text-xs font-semibold px-4 py-2 transition-all text-center"
                              >
                                <span>View Details</span>
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Tabs */}
                  <div className="flex justify-center gap-2.5 sm:gap-4 flex-wrap">
                    <button
                      onClick={() => setActiveTab('details')}
                      className={[
                        'rounded-full px-6 py-2.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer border',
                        activeTab === 'details'
                          ? 'bg-[#C4975A] text-[#0C0704] border-[#C4975A] shadow-lg'
                          : 'bg-[#0C0704]/70 text-stone-300 border-[#10B981]/30 hover:border-stone-400',
                      ].join(' ')}
                    >
                      Milestone Timeline
                    </button>
                    {trackedOrder.inspectionMedia && trackedOrder.inspectionMedia.photos.length > 0 && (
                      <button
                        onClick={() => setActiveTab('inspection')}
                        className={[
                          'rounded-full px-6 py-2.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer border flex items-center gap-1.5',
                          activeTab === 'inspection'
                            ? 'bg-[#C4975A] text-[#0C0704] border-[#C4975A] shadow-lg'
                            : 'bg-[#0C0704]/70 text-stone-300 border-[#10B981]/30 hover:border-stone-400',
                        ].join(' ')}
                      >
                        <span>Inspection Media</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      </button>
                    )}
                    {trackedOrder.timeline && trackedOrder.timeline.length > 0 && (
                      <button
                        onClick={() => setActiveTab('timeline')}
                        className={[
                          'rounded-full px-6 py-2.5 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer border',
                          activeTab === 'timeline'
                            ? 'bg-[#C4975A] text-[#0C0704] border-[#C4975A] shadow-lg'
                            : 'bg-[#0C0704]/70 text-stone-300 border-[#10B981]/30 hover:border-stone-400',
                        ].join(' ')}
                      >
                        Atelier Logs ({trackedOrder.timeline.length})
                      </button>
                    )}
                  </div>

                  {/* Tab 1: Stepper Milestones */}
                  {activeTab === 'details' && (
                    <div
                      className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/80 p-6 sm:p-10 shadow-2xl"
                    >
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 text-center mb-8">
                        Bespoke Production Milestones
                      </h3>

                      <div className="flex flex-col items-center">
                        {STATUS_STEPS.map((st, idx) => {
                          const isCompleted = idx < activeStepIndex
                          const isActive = idx === activeStepIndex

                          return (
                            <div key={idx} className="flex flex-col items-center w-full">
                              <div className="flex flex-col items-center text-center max-w-md py-2">
                                <div className="flex items-center gap-3 justify-center mb-1">
                                  <span
                                    className={[
                                      'w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold transition-all',
                                      isActive
                                        ? 'bg-[#C4975A] text-[#0C0704] ring-4 ring-[#C4975A]/25 scale-110 shadow-lg'
                                        : isCompleted
                                          ? 'bg-[#10B981] text-[#0C0704]'
                                          : 'bg-stone-900 text-stone-500 border border-stone-800',
                                    ].join(' ')}
                                  >
                                    {isCompleted ? '✓' : idx + 1}
                                  </span>
                                  <span
                                    className={[
                                      'text-xs tracking-wider uppercase font-bold',
                                      isActive
                                        ? 'text-[#C4975A]'
                                        : isCompleted
                                          ? 'text-cream-100'
                                          : 'text-stone-500',
                                    ].join(' ')}
                                  >
                                    {st.label}
                                  </span>
                                </div>
                                {isActive && (
                                  <p
                                    className="font-body text-xs text-stone-300 leading-relaxed max-w-sm mt-2 p-3.5 rounded-xl bg-stone-900/80 border border-[#C4975A]/30 text-center shadow-md"
                                  >
                                    {st.desc}
                                  </p>
                                )}
                              </div>

                              {idx < STATUS_STEPS.length - 1 && (
                                <div
                                  className={[
                                    'w-[2px] h-8 my-1',
                                    isCompleted ? 'bg-[#10B981]' : 'bg-stone-800',
                                  ].join(' ')}
                                />
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {/* WhatsApp Concierge Inquiries */}
                      <div className="text-center mt-10 pt-6 border-t border-stone-800/80">
                        <Button
                          href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                            `Hello Samuelson, I am inquiring about my bespoke commission ${trackedOrder.id} (${trackedOrder.design}).`
                          )}`}
                          variant="outline"
                          size="md"
                          external
                          style={{
                            borderColor: '#C4975A',
                            color: '#E8D4B0',
                            borderRadius: '12px',
                            padding: '12px 26px',
                            fontWeight: 600,
                          }}
                        >
                          💬 Inquire with Tailoring Concierge on WhatsApp
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Tab 2: Inspection Media */}
                  {activeTab === 'inspection' && trackedOrder.inspectionMedia && (
                    <div
                      className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/80 p-6 sm:p-10 shadow-2xl flex flex-col items-center gap-6"
                    >
                      <div className="text-center max-w-md">
                        <span className="text-[10px] text-[#A7F3D0] uppercase tracking-widest font-semibold block mb-1">
                          Quality Assurance Gate
                        </span>
                        <h3 className="font-serif text-2xl font-bold text-cream-100">
                          Workshop Quality Inspection
                        </h3>
                        <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                          Garment craftsmanship is ready. Review high-resolution workshop photos and finishing details below prior to dispatch.
                        </p>
                      </div>

                      {/* Photos Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
                        {trackedOrder.inspectionMedia.photos.map((ph, idx) => (
                          <div
                            key={idx}
                            className="relative h-72 rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-lg group"
                          >
                            <Image
                              src={ph}
                              alt={`Inspection Photo ${idx + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, 350px"
                            />
                            <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-stone-200 text-[10px] font-body px-2.5 py-1 rounded-full border border-white/10">
                              Atelier Angle #{idx + 1}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Video Player */}
                      {trackedOrder.inspectionMedia.videoUrl && (
                        <div className="w-full max-w-2xl rounded-2xl overflow-hidden border border-stone-800 bg-stone-900 shadow-xl">
                          <video
                            src={trackedOrder.inspectionMedia.videoUrl}
                            controls
                            className="w-full h-72 object-cover"
                            poster={trackedOrder.primaryImage}
                          />
                        </div>
                      )}

                      {/* Inspection Sign-off Notes */}
                      {trackedOrder.inspectionMedia.notes && (
                        <div className="w-full max-w-md p-4 rounded-xl bg-stone-900/60 border border-stone-800 text-xs text-stone-300 text-center font-body">
                          <strong className="text-[#C4975A] block mb-1 uppercase tracking-wider text-[10px]">
                            Tailor Sign-off Notes:
                          </strong>
                          {trackedOrder.inspectionMedia.notes}
                        </div>
                      )}

                      <Button
                        href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                          `Hello Samuelson, I have reviewed the quality inspection media for order ${trackedOrder.id} (${trackedOrder.design}) and I approve dispatch!`
                        )}`}
                        variant="primary"
                        size="md"
                        external
                        style={{
                          borderRadius: '12px',
                          padding: '14px 28px',
                          fontWeight: 700,
                        }}
                      >
                        Approve Inspection on WhatsApp →
                      </Button>
                    </div>
                  )}

                  {/* Tab 3: Timeline & Atelier Logs */}
                  {activeTab === 'timeline' && trackedOrder.timeline && (
                    <div
                      className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/80 p-6 sm:p-10 shadow-2xl"
                    >
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-cream-100 text-center mb-6">
                        Atelier Audit Log &amp; Timeline
                      </h3>
                      <div className="max-w-xl mx-auto space-y-4">
                        {trackedOrder.timeline.map((evt, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-start gap-3.5"
                          >
                            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shrink-0 mt-1.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-serif font-bold text-sm text-[#E8D4B0]">
                                  {evt.status}
                                </span>
                                <span className="text-[10px] text-stone-400 font-mono">
                                  {new Date(evt.date).toLocaleDateString('en-GB', {
                                    day: 'numeric',
                                    month: 'short',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              {evt.notes && (
                                <p className="text-xs text-stone-300 font-body mt-1 leading-relaxed">
                                  {evt.notes}
                                </p>
                              )}
                              {evt.actor && (
                                <span className="text-[10px] text-stone-500 font-body block mt-1">
                                  Logged by {evt.actor}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Order Not Found State */
                <div
                  className="rounded-3xl border border-red-900/60 bg-[#0C0704]/90 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-2xl"
                  style={{ padding: '3.5rem 2rem' }}
                >
                  <span className="text-4xl block mb-3">⚠️</span>
                  <h3 className="font-serif text-2xl font-bold text-cream-100 mb-2">
                    Order Reference Not Located
                  </h3>
                  <p className="text-xs text-stone-300 mb-6 leading-relaxed max-w-md mx-auto">
                    No order found matching &ldquo;<strong>{rawQuery}</strong>&rdquo;. Please verify the Order ID sent on your receipt or contact our tailoring concierge directly on WhatsApp.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                    <Button
                      href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                        `Hello Samuelson, I am trying to track my order with reference "${rawQuery}" but it was not located.`
                      )}`}
                      variant="primary"
                      size="sm"
                      external
                      style={{
                        borderRadius: '10px',
                        padding: '12px 24px',
                        fontWeight: 700,
                      }}
                    >
                      💬 Concierge Assistance
                    </Button>
                    <button
                      type="button"
                      onClick={() => handleSampleClick('CS-0092')}
                      className="text-xs font-mono text-[#C4975A] underline hover:text-[#E8D4B0] transition-colors cursor-pointer"
                    >
                      Try sample order &quot;CS-0092&quot;
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 3: WARM SAND TAILORING ASSURANCE PILLARS (#F7F3EB)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#F7F3EB] text-[#140C07]"
          style={{
            paddingTop: 'clamp(4.5rem, 7.5vw, 6.5rem)',
            paddingBottom: 'clamp(4.5rem, 7.5vw, 6.5rem)',
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
            <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
              <span
                className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '6px' }}
              >
                End-to-End Craft Guarantee
              </span>
              <h2
                className="font-serif font-normal leading-tight text-[#140C07]"
                style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)' }}
              >
                From Atelier Bench to European Doorstep
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm">
                <span className="text-[#C4975A] font-serif text-2xl font-bold block mb-2">01 /</span>
                <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">Verona Measurement Validation</h3>
                <p className="text-xs text-[#52453B] leading-relaxed">
                  Before any fabric is chalked, our master tailors in Verona cross-reference posture, chest, shoulder angle, and height data to guarantee millimeter-accurate drape.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm">
                <span className="text-[#C4975A] font-serif text-2xl font-bold block mb-2">02 /</span>
                <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">Nigerian Master Stitching</h3>
                <p className="text-xs text-[#52453B] leading-relaxed">
                  Crafted by generational native wear artisans in Aba and Lagos using premium brocades, cashmeres, and silks with reinforced internal canvassing.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-[#EBE3D7] p-8 shadow-sm">
                <span className="text-[#C4975A] font-serif text-2xl font-bold block mb-2">03 /</span>
                <h3 className="font-serif text-lg font-bold text-[#140C07] mb-2">Direct DHL Courier Dispatch</h3>
                <p className="text-xs text-[#52453B] leading-relaxed">
                  Air freight courier with real-time waypoint tracking delivers your piece safely sealed in breathable garment bags directly to your home in Italy or throughout Europe.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default function TrackingPage() {
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
      <TrackingContent />
    </Suspense>
  )
}
