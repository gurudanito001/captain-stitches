'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import {
  getReviewableOrderAction,
  submitCustomerReviewAction,
  updateCustomerReviewAction,
  ReviewableOrderDetails,
} from '@/lib/actions/reviews'

const FIT_TAGS = [
  'True to measurements',
  'Flawless shoulder drape',
  'Clean stitching & seams',
  'Luxurious fabric texture',
  'Immaculate collar & cuffs',
  'Received wedding compliments',
  'Comfortable movement',
  'Savile Row standard finish',
]

const RATING_DESCRIPTIONS: Record<number, string> = {
  5: 'Masterpiece — Flawless drape, finish & fit',
  4: 'Exceeded Expectations — Exceptional craftsmanship',
  3: 'Satisfactory — Quality bespoke tailoring',
  2: 'Fair — Requires minor alteration',
  1: 'Needs Attention — Atelier fit adjustment required',
}

function ReviewPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const rawQuery = (
    searchParams.get('order') ||
    searchParams.get('id') ||
    searchParams.get('ref') ||
    ''
  ).trim()

  const [lookupInput, setLookupInput] = useState(rawQuery)
  const [isLoadingOrder, setIsLoadingOrder] = useState(false)
  const [orderData, setOrderData] = useState<ReviewableOrderDetails | null>(null)
  const [orderError, setOrderError] = useState<string | null>(null)

  const modeParam = searchParams.get('mode')
  const [isEditing, setIsEditing] = useState(modeParam === 'edit')

  // Review Form States
  const [rating, setRating] = useState<number>(5)
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'True to measurements',
    'Clean stitching & seams',
  ])
  const [comment, setComment] = useState('')
  const [photoUrls, setPhotoUrls] = useState<string[]>([])
  const [photoInputUrl, setPhotoInputUrl] = useState('')
  const [showPhotoUrlInput, setShowPhotoUrlInput] = useState(false)
  const [consentGranted, setConsentGranted] = useState(true)

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleStartEditing = (existing?: ReviewableOrderDetails['existingReview']) => {
    const rev = existing || orderData?.existingReview
    if (rev) {
      setRating(rev.rating)
      const raw = rev.comment || ''
      let cleanComment = raw
      let parsedTags: string[] = []
      const match = raw.match(/^\[Fit Feedback:\s*([^\]]+)\]\s*\n\n?([\s\S]*)$/)
      if (match) {
        parsedTags = match[1].split(',').map((t) => t.trim())
        cleanComment = match[2] || ''
      }
      setSelectedTags(parsedTags.length > 0 ? parsedTags : ['True to measurements'])
      setComment(cleanComment)
      setPhotoUrls(rev.photos || [])
      setIsEditing(true)
    }
  }

  // Load Order details when rawQuery changes
  useEffect(() => {
    if (!rawQuery) {
      setOrderData(null)
      setOrderError(null)
      return
    }

    setLookupInput(rawQuery)
    setIsLoadingOrder(true)
    setOrderError(null)
    setSubmitSuccess(false)
    setSubmitError(null)

    let isMounted = true

    async function fetchOrder() {
      try {
        const res = await getReviewableOrderAction(rawQuery)
        if (!isMounted) return

        if (res.success && res.order) {
          setOrderData(res.order)
          setOrderError(null)

          // If edit mode requested via URL, pre-fill review data
          if (modeParam === 'edit' && res.order.existingReview) {
            handleStartEditing(res.order.existingReview)
          }
        } else {
          // If not in DB, check fallback for sample order CS-112233
          if (rawQuery.toUpperCase() === 'CS-112233') {
            setOrderData({
              orderNumber: 'CS-112233',
              dbId: 'static-4',
              customerName: 'Kunle Adeyemi',
              customerPhone: '+39 333 111 222',
              customerEmail: 'kunle@example.com',
              designName: 'Classic Senator',
              designPhoto: '/images/design-senator.jpg',
              fabric: 'Italian Linen',
              colour: 'Slate Grey',
              status: 'DELIVERED',
              isDelivered: true,
            })
            setOrderError(null)
          } else {
            setOrderData(null)
            setOrderError(res.error || `Commission "${rawQuery}" was not found.`)
          }
        }
      } catch (err: any) {
        if (!isMounted) return
        setOrderData(null)
        setOrderError(err.message || 'Failed to query order records.')
      } finally {
        if (isMounted) setIsLoadingOrder(false)
      }
    }

    fetchOrder()

    return () => {
      isMounted = false
    }
  }, [rawQuery])

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!lookupInput.trim()) return

    const trimmed = lookupInput.trim().toUpperCase()
    const params = new URLSearchParams()
    params.set('order', trimmed)
    router.push(`/review?${params.toString()}`)
  }

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // Convert up to 3 files to data URLs for instant preview & persistence
    Array.from(files).slice(0, 3).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === 'string') {
          setPhotoUrls((prev) => [...prev, event.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  const handleAddPhotoUrl = () => {
    if (!photoInputUrl.trim()) return
    setPhotoUrls((prev) => [...prev, photoInputUrl.trim()])
    setPhotoInputUrl('')
    setShowPhotoUrlInput(false)
  }

  const removePhoto = (index: number) => {
    setPhotoUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orderData) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const isUpdating = Boolean(orderData.existingReview || isEditing)
      const action = isUpdating ? updateCustomerReviewAction : submitCustomerReviewAction

      const res = await action({
        orderNumber: orderData.orderNumber,
        rating,
        comment,
        photoUrls,
        fitTags: selectedTags,
      })

      if (res.success) {
        setSubmitSuccess(true)
        setIsEditing(false)
      } else {
        setSubmitError(res.error || 'Failed to submit review. Please try again.')
      }
    } catch (err: any) {
      setSubmitError(err.message || 'An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-[#0C0704] text-[#FAF6F0] min-h-screen flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 w-full" id="review-main-content">
        {/* =========================================================================
            HERO HEADER SECTION
        ========================================================================= */}
        <section
          className="relative w-full bg-gradient-to-b from-[#140C07] via-[#0C0704] to-[#071A14] text-cream-100 overflow-hidden border-b border-stone-800/80"
          style={{
            paddingTop: 'clamp(3.5rem, 6vw, 5.5rem)',
            paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
          }}
        >
          {/* Ambient Gold & Emerald Glows */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C4975A]/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none" />

          <div
            className="container-brand relative z-10 text-center"
            style={{
              maxWidth: '860px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.25rem, 4vw, 2.5rem)',
              paddingRight: 'clamp(1.25rem, 4vw, 2.5rem)',
              boxSizing: 'border-box',
            }}
          >
            <span className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C4975A]/15 border border-[#C4975A]/30 text-[#E8D4B0] text-xs font-semibold uppercase tracking-widest mb-4">
              <span>✦</span> Bespoke Fitting &amp; Patron Testimonials
            </span>
            <h1
              className="font-serif font-bold text-cream-100 tracking-tight leading-tight mb-4"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.25rem)' }}
            >
              Share Your Bespoke Experience
            </h1>
            <p className="text-sm sm:text-base text-stone-300 font-body max-w-xl mx-auto leading-relaxed">
              Every seam, tuck, and drape was crafted specifically for you. Tell our master tailors in Verona and Nigeria how your attire fits.
            </p>

            {/* Quick Order Lookup Form (if no order loaded or switching order) */}
            <form
              onSubmit={handleLookupSubmit}
              className="mt-8 max-w-md mx-auto flex items-center gap-2 bg-[#1C120C]/80 border border-stone-800 rounded-2xl p-1.5 shadow-2xl focus-within:border-[#C4975A]/60 transition-colors"
            >
              <input
                id="review-order-input"
                type="text"
                value={lookupInput}
                onChange={(e) => setLookupInput(e.target.value)}
                placeholder="Enter Order ID (e.g. CS-0092 or CS-112233)"
                className="flex-1 bg-transparent px-4 py-2.5 text-xs sm:text-sm text-cream-100 placeholder:text-stone-500 focus:outline-none uppercase font-mono tracking-wider"
              />
              <button
                type="submit"
                id="review-lookup-btn"
                className="px-5 py-2.5 rounded-xl bg-[#C4975A] hover:bg-[#d6aa6d] text-[#0C0704] text-xs font-serif font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
              >
                Find Order
              </button>
            </form>

            {/* Sample Order Quick Pills */}
            <div className="flex items-center justify-center gap-2 mt-3 text-xs text-stone-400 flex-wrap">
              <span>Sample Orders:</span>
              <button
                type="button"
                onClick={() => {
                  setLookupInput('CS-0092')
                  router.push('/review?order=CS-0092')
                }}
                className="font-mono text-[#C4975A] hover:underline"
              >
                CS-0092
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => {
                  setLookupInput('CS-112233')
                  router.push('/review?order=CS-112233')
                }}
                className="font-mono text-[#34D399] hover:underline"
              >
                CS-112233 (Delivered)
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            MAIN REVIEW SECTION
        ========================================================================= */}
        <section
          className="relative w-full bg-[#071A14] text-[#FAF6F0]"
          style={{
            paddingTop: 'clamp(2.5rem, 5vw, 4rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              paddingRight: 'clamp(1.25rem, 3.5vw, 2.5rem)',
              boxSizing: 'border-box',
            }}
          >
            {/* Loading Order Indicator */}
            {isLoadingOrder && (
              <div className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/90 p-12 text-center shadow-2xl">
                <div
                  className="border-3 border-[#C4975A] border-t-transparent rounded-full animate-spin mx-auto mb-4"
                  style={{ width: '40px', height: '40px', borderWidth: '3px' }}
                />
                <h3 className="font-serif text-lg font-bold text-cream-100 mb-1">
                  Locating Commission Records
                </h3>
                <p className="text-xs text-stone-300 font-body">
                  Verifying tailoring records for order &ldquo;{rawQuery}&rdquo;...
                </p>
              </div>
            )}

            {/* Error / Not Located State */}
            {!isLoadingOrder && orderError && (
              <div className="rounded-3xl border border-red-900/60 bg-[#0C0704]/90 p-8 sm:p-10 text-center shadow-2xl">
                <span className="text-3xl block mb-2">⚠️</span>
                <h3 className="font-serif text-xl font-bold text-cream-100 mb-2">
                  Commission Not Located
                </h3>
                <p className="text-xs text-stone-300 font-body leading-relaxed max-w-md mx-auto mb-6">
                  {orderError} Please check the Order ID sent to your email or WhatsApp receipt.
                </p>
                <div className="flex justify-center gap-3">
                  <Button href="/track" variant="outline" size="sm">
                    Track An Order Instead
                  </Button>
                  <Button
                    href={`https://wa.me/2348000000000?text=${encodeURIComponent(
                      `Hello Samuelson, I am trying to submit a review for my order reference "${rawQuery}".`
                    )}`}
                    variant="primary"
                    size="sm"
                    external
                  >
                    💬 Concierge Help
                  </Button>
                </div>
              </div>
            )}

            {/* No Order Selected Initial State */}
            {!isLoadingOrder && !orderError && !orderData && (
              <div className="rounded-3xl border border-stone-800 bg-[#0C0704]/80 p-8 sm:p-12 text-center shadow-2xl">
                <span className="text-4xl block mb-3">🪡</span>
                <h3 className="font-serif text-2xl font-bold text-cream-100 mb-2">
                  Enter Your Commission Reference
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 font-body leading-relaxed max-w-md mx-auto mb-6">
                  Please enter your Order ID (such as <strong>CS-0092</strong> or <strong>CS-112233</strong>) above to rate your bespoke attire.
                </p>
                <p className="text-xs text-stone-500 font-mono">
                  All reviews are moderated by our Master Tailor before appearing on the lookbook.
                </p>
              </div>
            )}

            {/* Order Found and Success State */}
            {!isLoadingOrder && orderData && submitSuccess && (
              <div className="rounded-3xl border border-[#10B981]/50 bg-gradient-to-br from-[#0C0704] to-[#0A261C] p-8 sm:p-12 text-center shadow-2xl animate-fadeIn">
                <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border border-[#10B981]/50 text-[#34D399] flex items-center justify-center text-3xl mx-auto mb-4">
                  ✓
                </div>
                <span className="text-[10px] text-[#A7F3D0] uppercase tracking-widest font-bold block mb-1">
                  Craftsmanship Feedback Received
                </span>
                <h2 className="font-serif text-3xl font-bold text-cream-100 mb-3">
                  Thank You, {orderData.customerName}!
                </h2>
                <p className="text-xs sm:text-sm text-stone-300 font-body leading-relaxed max-w-lg mx-auto mb-6">
                  Your review for <strong>{orderData.designName}</strong> (Order #{orderData.orderNumber}) has been recorded in the atelier ledger. Samuelson and our tailoring team appreciate your valuable feedback.
                </p>
                <div className="p-4 rounded-2xl bg-black/40 border border-stone-800 max-w-md mx-auto mb-8 text-xs text-stone-300">
                  <div className="flex items-center justify-center gap-1.5 text-[#C4975A] text-lg mb-1">
                    {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
                  </div>
                  <p className="text-[#E8D4B0] font-semibold">{RATING_DESCRIPTIONS[rating]}</p>
                  <p className="text-stone-400 mt-2 text-[11px]">
                    Status: <span className="text-amber-400">Under Atelier Review</span> — Approved reviews are featured on the public lookbook.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link
                    href={`/track?id=${encodeURIComponent(orderData.orderNumber)}`}
                    className="px-6 py-3 rounded-xl bg-[#C4975A] text-[#0C0704] font-serif font-bold text-xs uppercase tracking-wider hover:bg-[#d6aa6d] transition-all shadow-md"
                  >
                    Return to Order Tracker
                  </Link>
                  <Link
                    href="/catalogue"
                    className="px-6 py-3 rounded-xl bg-stone-900 border border-stone-700 text-stone-200 text-xs font-serif font-bold uppercase tracking-wider hover:bg-stone-800 transition-all"
                  >
                    Explore Lookbook
                  </Link>
                </div>
              </div>
            )}

            {/* Order Found — Existing Review View (when not in edit mode) */}
            {!isLoadingOrder && orderData && !submitSuccess && orderData.existingReview && !isEditing && (
              <div className="rounded-3xl border border-[#C4975A]/40 bg-[#0C0704]/90 p-8 sm:p-10 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] text-[#A7F3D0] uppercase tracking-widest font-bold">
                    Review Already Submitted
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-100 mb-2">
                  Feedback Logged for {orderData.orderNumber}
                </h3>
                <p className="text-xs text-stone-300 font-body mb-6">
                  Patron: <strong className="text-cream-100">{orderData.customerName}</strong> · Garment: <strong className="text-cream-100">{orderData.designName}</strong>
                </p>

                <div className="p-6 rounded-2xl bg-[#1C120C]/70 border border-stone-800 mb-6">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex text-[#C4975A] text-lg">
                        {'★'.repeat(orderData.existingReview.rating)}
                        {'☆'.repeat(5 - orderData.existingReview.rating)}
                      </div>
                      <span className="font-bold text-sm text-[#E8D4B0]">
                        {orderData.existingReview.rating}.0 / 5.0
                      </span>
                    </div>
                    <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-stone-800 text-stone-300 border border-stone-700 uppercase">
                      Status: {orderData.existingReview.status}
                    </span>
                  </div>

                  {orderData.existingReview.comment && (
                    <p className="text-xs sm:text-sm text-stone-200 font-body leading-relaxed italic bg-black/40 p-4 rounded-xl border border-stone-800/60">
                      &ldquo;{orderData.existingReview.comment}&rdquo;
                    </p>
                  )}

                  {orderData.existingReview.photos && orderData.existingReview.photos.length > 0 && (
                    <div className="mt-4 flex gap-3 flex-wrap">
                      {orderData.existingReview.photos.map((ph, idx) => (
                        <div
                          key={idx}
                          className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-800"
                        >
                          <Image
                            src={ph}
                            alt={`Review photo ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-stone-400 block mt-4">
                    Submitted on {new Date(orderData.existingReview.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    type="button"
                    onClick={() => handleStartEditing()}
                    className="px-6 py-2.5 rounded-xl bg-[#C4975A] text-[#0C0704] text-xs font-serif font-bold uppercase tracking-wider hover:bg-[#d6aa6d] transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                  >
                    <span>✏️ Edit Review &amp; Fit Photos</span>
                  </button>
                  <Link
                    href={`/track?id=${encodeURIComponent(orderData.orderNumber)}`}
                    className="px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 text-xs font-serif font-bold uppercase tracking-wider hover:bg-stone-800"
                  >
                    View in Order Tracker
                  </Link>
                  <Link
                    href="/catalogue"
                    className="px-5 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-stone-300 text-xs font-serif font-bold uppercase tracking-wider hover:bg-stone-800"
                  >
                    View Lookbook
                  </Link>
                </div>
              </div>
            )}

            {/* Order Found — Review Form (New Review or Edit Mode) */}
            {!isLoadingOrder && orderData && !submitSuccess && (!orderData.existingReview || isEditing) && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                {/* 1. Verified Garment Card */}
                <div className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/90 p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative w-28 h-32 rounded-2xl overflow-hidden bg-[#1C120C] border border-stone-800 shrink-0">
                    <Image
                      src={orderData.designPhoto}
                      alt={orderData.designName}
                      fill
                      className="object-cover"
                      sizes="120px"
                    />
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#34D399] text-[10px] font-bold">
                        ✓ Verified Commission
                      </span>
                      <span className="font-mono text-xs text-stone-400">
                        {orderData.orderNumber}
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl font-bold text-[#E8D4B0]">
                      {orderData.designName}
                    </h2>
                    <p className="text-xs text-stone-300 font-body mt-1">
                      Patron: <strong className="text-cream-100">{orderData.customerName}</strong>
                      {orderData.fabric && ` · Fabric: ${orderData.fabric}`}
                      {orderData.colour && ` · Color: ${orderData.colour}`}
                    </p>

                    {/* Delivery Status Note */}
                    {!orderData.isDelivered && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-[11px] text-amber-200">
                        ℹ️ Note: This commission is currently marked as{' '}
                        <strong>{orderData.status}</strong>. You may leave early fitting notes below.
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. The Review Form */}
                <form
                  onSubmit={handleSubmitReview}
                  className="rounded-3xl border border-[#C4975A]/40 bg-[#0C0704]/85 p-6 sm:p-10 shadow-2xl flex flex-col gap-8 relative overflow-hidden"
                >
                  {/* Edit Mode Notice Banner */}
                  {isEditing && (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#C4975A]/15 border border-[#C4975A]/40 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-base">✏️</span>
                        <span className="text-[#E8D4B0] font-semibold">
                          Editing existing review for commission #{orderData.orderNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-[11px] text-stone-400 hover:text-white underline cursor-pointer self-start sm:self-auto"
                      >
                        Cancel Editing
                      </button>
                    </div>
                  )}
                  {/* Rating Stars Selection */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#E8D4B0] mb-2">
                      Overall Craftsmanship &amp; Fit Rating *
                    </label>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isFilled =
                            (hoverRating !== null ? hoverRating : rating) >= starVal

                          return (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setRating(starVal)}
                              onMouseEnter={() => setHoverRating(starVal)}
                              onMouseLeave={() => setHoverRating(null)}
                              className="text-3xl sm:text-4xl transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                              style={{
                                color: isFilled ? '#C4975A' : '#3F352E',
                                filter: isFilled
                                  ? 'drop-shadow(0 0 8px rgba(196, 151, 90, 0.4))'
                                  : 'none',
                              }}
                              aria-label={`${starVal} Star`}
                            >
                              ★
                            </button>
                          )
                        })}
                      </div>

                      <span className="text-xs sm:text-sm font-serif font-bold text-cream-100 ml-2">
                        {RATING_DESCRIPTIONS[hoverRating !== null ? hoverRating : rating]}
                      </span>
                    </div>
                  </div>

                  {/* Quick Fit Evaluation Tags */}
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#E8D4B0] mb-2">
                      Tailoring &amp; Drape Attributes (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {FIT_TAGS.map((tag) => {
                        const isSelected = selectedTags.includes(tag)
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => toggleTag(tag)}
                            className={[
                              'px-3.5 py-1.5 rounded-full text-xs font-body transition-all cursor-pointer border',
                              isSelected
                                ? 'bg-[#C4975A] text-[#0C0704] font-semibold border-[#C4975A] shadow-md'
                                : 'bg-stone-900/80 text-stone-300 border-stone-800 hover:border-stone-600',
                            ].join(' ')}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {tag}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Written Testimonial Textarea */}
                  <div>
                    <label
                      htmlFor="review-comment"
                      className="block text-xs font-semibold uppercase tracking-wider text-[#E8D4B0] mb-2"
                    >
                      Written Testimonial / Fitting Details
                    </label>
                    <textarea
                      id="review-comment"
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Describe how the garment feels, compliments received at your wedding or event, or how the cut complements your posture..."
                      className="w-full bg-[#140C07] border border-stone-800 rounded-2xl p-4 text-xs sm:text-sm text-cream-100 placeholder:text-stone-500 focus:outline-none focus:border-[#C4975A]/60 leading-relaxed"
                    />
                  </div>

                  {/* Customer Fit Photos Upload */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#E8D4B0]">
                        Upload Fit Photos (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPhotoUrlInput(!showPhotoUrlInput)}
                        className="text-[11px] text-[#C4975A] hover:underline cursor-pointer"
                      >
                        {showPhotoUrlInput ? 'Hide URL input' : '+ Attach Image URL'}
                      </button>
                    </div>

                    {/* Direct Image URL input */}
                    {showPhotoUrlInput && (
                      <div className="flex items-center gap-2 mb-3 bg-[#1C120C] p-2 rounded-xl border border-stone-800">
                        <input
                          type="url"
                          value={photoInputUrl}
                          onChange={(e) => setPhotoInputUrl(e.target.value)}
                          placeholder="https://example.com/my-photo.jpg"
                          className="flex-1 bg-transparent px-3 py-1.5 text-xs text-cream-100 placeholder:text-stone-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddPhotoUrl}
                          className="px-3 py-1.5 rounded-lg bg-[#C4975A] text-[#0C0704] text-xs font-bold"
                        >
                          Add
                        </button>
                      </div>
                    )}

                    {/* File Upload Drop Area */}
                    <div className="border-2 border-dashed border-stone-800 hover:border-[#C4975A]/50 rounded-2xl p-6 text-center transition-colors bg-[#140C07]/60">
                      <input
                        type="file"
                        id="review-photo-upload"
                        accept="image/*"
                        multiple
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="review-photo-upload"
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <span className="text-2xl">📸</span>
                        <span className="text-xs font-semibold text-[#E8D4B0]">
                          Click to select photos wearing your attire
                        </span>
                        <span className="text-[11px] text-stone-500">
                          PNG, JPG up to 10MB (Up to 3 photos)
                        </span>
                      </label>
                    </div>

                    {/* Photo Previews */}
                    {photoUrls.length > 0 && (
                      <div className="flex flex-wrap gap-3 mt-4">
                        {photoUrls.map((url, idx) => (
                          <div
                            key={idx}
                            className="relative w-24 h-24 rounded-xl overflow-hidden border border-stone-700 bg-stone-900 group"
                          >
                            <Image
                              src={url}
                              alt={`Fit Photo ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(idx)}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              title="Remove photo"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Public Consent Checkbox */}
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-stone-900/60 border border-stone-800/80">
                    <input
                      type="checkbox"
                      id="review-consent"
                      checked={consentGranted}
                      onChange={(e) => setConsentGranted(e.target.checked)}
                      className="w-4 h-4 rounded border-stone-700 bg-black text-[#C4975A] focus:ring-0 mt-0.5 cursor-pointer"
                    />
                    <label
                      htmlFor="review-consent"
                      className="text-xs text-stone-300 font-body leading-relaxed cursor-pointer"
                    >
                      I grant permission for CaptainStitches to publish my rating and fit comments on the public lookbook and diaspora testimonials.
                    </label>
                  </div>

                  {/* Submission Error Message */}
                  {submitError && (
                    <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-200">
                      ⚠️ {submitError}
                    </div>
                  )}

                  {/* Submit Action */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="text-xs text-stone-400 font-body">
                      🔒 Secured via verified commission #{orderData.orderNumber}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#C4975A] hover:bg-[#d6aa6d] text-[#0C0704] font-serif font-bold text-sm uppercase tracking-wider transition-all shadow-xl shadow-[#C4975A]/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting
                        ? (isEditing ? 'Updating Atelier Review...' : 'Recording Review in Atelier...')
                        : (isEditing ? 'Save Changes & Update Review →' : 'Submit Bespoke Review →')}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default function ReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#0C0704] min-h-screen flex items-center justify-center">
          <div
            className="border-2 border-[#C4975A] border-t-transparent rounded-full animate-spin"
            style={{ width: '36px', height: '36px' }}
          />
        </div>
      }
    >
      <ReviewPageContent />
    </Suspense>
  )
}
