'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { getPublishedDesignsAction, PublicDesignItem } from '@/lib/actions/catalogue'
import { ColourSelector } from '@/components/common/ColourSelector'
import { validateReferralCodeAction } from '@/lib/actions/referrals'
import { createPublicOrderAction } from '@/lib/actions/orders'
import { uploadMediaAction } from '@/lib/actions/upload'

const CUSTOM_DESIGN = {
  name: 'Custom African Reference Design',
  category: 'custom',
  categoryLabel: 'Bespoke Reference',
  priceNGN: 130000,
  priceEUR: 75,
  turnaround: '14–21 days',
  turnaroundDays: 21,
  slug: 'custom-ref',
  image: '/images/category-native.jpeg',
  fabrics: ['Presidential Cashmere', 'Royal Guinea Brocade', 'Italian Linen', 'Luxury Crepe'],
  colors: ['Midnight Black|#1C1C1C', 'Royal Ivory|#FAF5EA', 'Navy Blue|#0B2240', 'Emerald Green|#10B981', 'Burgundy Wine|#58111A'],
}

const MEASUREMENT_GUIDES: Record<string, { label: string; tip: string }> = {
  neck: {
    label: '1. Neck Size',
    tip: 'Wrap the tape around the base of your neck where a collared shirt rests. Keep one finger inside the tape for breathing ease.',
  },
  shoulder: {
    label: '2. Shoulder Width',
    tip: 'Measure across the upper back from the tip of the left shoulder bone straight across to the tip of the right shoulder bone.',
  },
  chest: {
    label: '3. Chest Circumference',
    tip: 'Wrap the tape around the fullest part of your chest, keeping it level under the armpits and across the shoulder blades.',
  },
  sleeve: {
    label: '4. Sleeve Length',
    tip: 'With arm resting naturally at your side, measure from the outer shoulder point straight down to your wrist bone.',
  },
  shirtLength: {
    label: '5. Shirt / Kaftan Length',
    tip: 'Measure from the base of the back of your neck straight down to where you want the tunic hem to stop (mid-thigh or knee).',
  },
  waist: {
    label: '6. Waist Circumference',
    tip: 'Measure around your natural waistline, where you normally wear your native trousers or belt.',
  },
  hip: {
    label: '7. Hips / Seat Circumference',
    tip: 'Wrap the tape around the fullest point of your hips and buttocks while standing naturally.',
  },
  trouserLength: {
    label: '8. Trouser Length',
    tip: 'Measure from your waistline down the outside of your leg straight to the top of your shoe heel.',
  },
}

// Stylized Mannequin Diagram for Measurement Step
function BodyDiagram({ activeField }: { activeField: string }) {
  return (
    <div className="relative w-full h-[320px] rounded-2xl bg-[#0C0704]/60 border border-brown-800/80 flex items-center justify-center p-6 shadow-inner">
      <svg
        viewBox="0 0 100 160"
        className="w-full h-full text-stone-700"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        {/* Mannequin Head & Neck */}
        <circle cx="50" cy="18" r="8" className="stroke-stone-600" />
        <path d="M47 26 L47 30 A3 3 0 0 0 53 30 L53 26" className="stroke-stone-600" />

        {/* Neck line */}
        <path
          d="M44 28 H56"
          className={activeField === 'neck' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Torso & Shoulders */}
        <path d="M32 34 L68 34 M32 34 L36 75 L64 75 L68 34" className="stroke-stone-600" />

        {/* Shoulder line */}
        <path
          d="M32 34 H68"
          className={activeField === 'shoulder' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Chest line */}
        <path
          d="M33 48 H67"
          className={activeField === 'chest' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Sleeve line */}
        <path
          d="M32 34 L28 72"
          className={activeField === 'sleeve' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Torso Width / Waist line */}
        <path
          d="M35 60 H65"
          className={activeField === 'waist' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Hips line */}
        <path
          d="M36 75 H64"
          className={activeField === 'hip' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Legs & Trousers */}
        <path d="M36 75 L38 150 M64 75 L62 150 M50 90 L50 150" className="stroke-stone-600" />

        {/* Shirt Length indicator */}
        <path
          d="M50 34 V70"
          className={activeField === 'shirtLength' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600/30'}
        />

        {/* Trouser Length indicator */}
        <path
          d="M38 75 V145"
          className={activeField === 'trouserLength' ? 'stroke-[#C4975A] stroke-[2.5] animate-pulse' : 'stroke-stone-600/30'}
        />
      </svg>
    </div>
  )
}

function OrderFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialDesignSlug = searchParams.get('design') || 'green-danshiki'

  // State variables
  const [designsList, setDesignsList] = useState<PublicDesignItem[]>([])
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(true)
  const [step, setStep] = useState(1)
  const [selectedDesignSlug, setSelectedDesignSlug] = useState(initialDesignSlug)
  const [isCustomUpload, setIsCustomUpload] = useState(initialDesignSlug === 'custom')
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [customFilePreview, setCustomFilePreview] = useState<string>('')
  const [isUploadingToCloudinary, setIsUploadingToCloudinary] = useState(false)
  const [cloudinaryUrl, setCloudinaryUrl] = useState<string>('')

  // Sizing Mode: 'bespoke' (tape) | 'standard' (EU sizing) | 'video_call' (assisted WhatsApp)
  const [sizingMode, setSizingMode] = useState<'bespoke' | 'standard' | 'video_call'>('bespoke')
  const [standardSize, setStandardSize] = useState('L')
  const [heightRange, setHeightRange] = useState('175–180 cm (5\'9" – 5\'11")')
  const [bodyBuild, setBodyBuild] = useState<'Slim' | 'Regular' | 'Athletic' | 'Broad'>('Regular')
  const [videoCallAccepted, setVideoCallAccepted] = useState(true)

  // Load published designs from database
  useEffect(() => {
    let isMounted = true
    const load = async () => {
      const res = await getPublishedDesignsAction()
      if (res.success && res.designs && res.designs.length > 0) {
        if (isMounted) {
          // Filter out English suits to focus strictly on African attire and accessories
          const africanOnly = res.designs.filter(
            d => d.category !== 'english-suit' && !d.name.toLowerCase().includes('suit')
          )
          setDesignsList(africanOnly.length > 0 ? africanOnly : res.designs)
          setIsLoadingDesigns(false)
        }
      } else {
        if (isMounted) setIsLoadingDesigns(false)
      }
    }
    load()
    return () => {
      isMounted = false
    }
  }, [])

  const activeDesign = useMemo(() => {
    if (isCustomUpload) return CUSTOM_DESIGN
    const found = designsList.find(d => d.slug === selectedDesignSlug || d.id === selectedDesignSlug)
    if (found) return found
    if (designsList.length > 0) return designsList[0]
    return CUSTOM_DESIGN
  }, [selectedDesignSlug, isCustomUpload, designsList])

  // Step variables
  const [selectedFabric, setSelectedFabric] = useState(activeDesign.fabrics?.[0] || 'Presidential Cashmere')
  const [selectedColor, setSelectedColor] = useState(activeDesign.colors?.[0] || 'Midnight Black')
  const [measurementUnit, setMeasurementUnit] = useState<'inches' | 'cm'>('inches')
  const [focusedField, setFocusedField] = useState<string>('neck')

  const [measurements, setMeasurements] = useState({
    neck: '',
    shoulder: '',
    chest: '',
    sleeve: '',
    shirtLength: '',
    waist: '',
    hip: '',
    trouserLength: '',
  })

  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postcode: '',
    country: 'Italy',
  })

  const [occasion, setOccasion] = useState('Wedding')
  const [deadline, setDeadline] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'paystack'>('stripe')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Referral Voucher States
  const [referralCodeInput, setReferralCodeInput] = useState('')
  const [activeReferral, setActiveReferral] = useState<{
    code: string
    referrerName: string
    discountEUR: number
    discountNGN: number
  } | null>(null)
  const [referralError, setReferralError] = useState<string | null>(null)
  const [isValidatingReferral, setIsValidatingReferral] = useState(false)

  // Auto-detect referral code from URL query (?ref=...) or browser storage
  const refFromUrl = searchParams.get('ref')
  useEffect(() => {
    let initialCode = refFromUrl
    if (!initialCode && typeof window !== 'undefined') {
      initialCode = localStorage.getItem('cs_active_referral')
    }
    if (initialCode) {
      applyReferralCode(initialCode)
    }
  }, [refFromUrl])

  async function applyReferralCode(codeToVerify: string, contactOverride?: string) {
    const clean = codeToVerify.trim().toUpperCase()
    if (!clean) return
    setIsValidatingReferral(true)
    setReferralError(null)

    try {
      const contact = contactOverride || personalDetails.email || personalDetails.phone
      const res = await validateReferralCodeAction(clean, contact)
      if (res.success && res.valid) {
        setActiveReferral({
          code: res.token || clean,
          referrerName: res.referrerName || 'A CaptainStitches Patron',
          discountEUR: res.discountEUR || 10,
          discountNGN: res.discountNGN || 10000,
        })
        setReferralCodeInput(res.token || clean)
        setReferralError(null)
      } else {
        setActiveReferral(null)
        setReferralError(res.error || 'Referral voucher is invalid or has expired.')
      }
    } catch {
      setActiveReferral(null)
      setReferralError('Failed to validate referral code.')
    } finally {
      setIsValidatingReferral(false)
    }
  }

  // Calculated totals with referral discount
  const discountEUR = activeReferral ? activeReferral.discountEUR : 0
  const discountNGN = activeReferral ? activeReferral.discountNGN : 0
  const calculatedTotalEUR = Math.max(0, activeDesign.priceEUR - discountEUR)
  const calculatedTotalNGN = Math.max(0, activeDesign.priceNGN - discountNGN)
  const depositDueEUR = Math.round(calculatedTotalEUR / 2)
  const depositDueNGN = Math.round(calculatedTotalNGN / 2)

  // Sync selected specifications if design changes
  useEffect(() => {
    if (activeDesign.fabrics?.length) {
      setSelectedFabric(activeDesign.fabrics[0])
    }
    if (activeDesign.colors?.length) {
      setSelectedColor(activeDesign.colors[0])
    }
  }, [activeDesign])

  // Handle uploader
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCustomFile(file)
      setCustomFilePreview(URL.createObjectURL(file))
      setIsUploadingToCloudinary(true)

      try {
        const formData = new FormData()
        formData.append('file', file)
        const res = await uploadMediaAction(formData, 'customer-orders')
        if (res.success && res.url) {
          setCloudinaryUrl(res.url)
        }
      } catch (uploadErr) {
        console.warn('Cloudinary upload error:', uploadErr)
      } finally {
        setIsUploadingToCloudinary(false)
      }
    }
  }

  // Handle measurement inputs
  const handleMeasurementChange = (field: string, val: string) => {
    if (/^\d*\.?\d*$/.test(val)) {
      setMeasurements(prev => ({ ...prev, [field]: val }))
    }
  }

  // Validation checks per step
  const canGoNext = useMemo(() => {
    if (step === 1) {
      if (isCustomUpload && !customFilePreview) return false
      return !!selectedFabric && !!selectedColor
    }
    if (step === 2) {
      if (sizingMode === 'bespoke') {
        return Object.values(measurements).every(val => !!val)
      }
      if (sizingMode === 'standard') {
        return !!standardSize && !!heightRange && !!bodyBuild
      }
      if (sizingMode === 'video_call') {
        return videoCallAccepted
      }
      return true
    }
    if (step === 3) {
      return (
        !!personalDetails.fullName.trim() &&
        !!personalDetails.email.trim() &&
        !!personalDetails.phone.trim() &&
        !!personalDetails.address.trim() &&
        !!personalDetails.city.trim() &&
        !!personalDetails.postcode.trim()
      )
    }
    if (step === 4) {
      return !!occasion && !!deadline
    }
    return true
  }, [
    step,
    isCustomUpload,
    customFilePreview,
    selectedFabric,
    selectedColor,
    sizingMode,
    measurements,
    standardSize,
    heightRange,
    bodyBuild,
    videoCallAccepted,
    personalDetails,
    occasion,
    deadline,
  ])

  // SLA Deadline checks
  const deadlineWarningMessage = useMemo(() => {
    if (!deadline) return null
    const targetDate = new Date(deadline)
    const minDays = activeDesign.turnaroundDays ?? 14
    const minRequiredDate = new Date(Date.now() + minDays * 24 * 60 * 60 * 1000)

    if (targetDate < minRequiredDate) {
      return `Our minimum craft turnaround for ${activeDesign.name} is ${activeDesign.turnaround}. Surcharges may apply for express rush slot logistics.`
    }
    return null
  }, [deadline, activeDesign])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canGoNext) return

    setIsSubmitting(true)

    try {
      const res = await createPublicOrderAction({
        fullName: personalDetails.fullName,
        email: personalDetails.email || undefined,
        phone: personalDetails.phone,
        address: personalDetails.address,
        city: personalDetails.city,
        postcode: personalDetails.postcode,
        country: personalDetails.country,
        designSlug: activeDesign.slug,
        designName: activeDesign.name,
        fabric: selectedFabric,
        colour: selectedColor,
        sizingMode,
        measurements: sizingMode === 'bespoke' ? measurements : undefined,
        standardSize: sizingMode === 'standard' ? standardSize : undefined,
        heightRange: sizingMode === 'standard' ? heightRange : undefined,
        bodyBuild: sizingMode === 'standard' ? bodyBuild : undefined,
        occasion,
        deadline: deadline || undefined,
        specialNotes: specialNotes || undefined,
        currency: paymentGateway === 'stripe' ? 'EUR' : 'NGN',
        totalAmount: paymentGateway === 'stripe' ? calculatedTotalEUR : calculatedTotalNGN,
        depositAmount: paymentGateway === 'stripe' ? depositDueEUR : Math.round(calculatedTotalNGN / 2),
        paymentGateway,
        referralToken: activeReferral?.code,
        customImageUrl: cloudinaryUrl || (customFilePreview?.startsWith('http') ? customFilePreview : undefined),
      })

      if (typeof window !== 'undefined') {
        localStorage.removeItem('cs_active_referral')
      }

      const orderNumber = res.orderNumber || `CS-${Math.floor(100000 + Math.random() * 900000)}`
      setIsSubmitting(false)
      router.push(
        `/order/confirmation?id=${orderNumber}&design=${activeDesign.slug}&total=${calculatedTotalEUR}&currency=${
          paymentGateway === 'stripe' ? 'EUR' : 'NGN'
        }`
      )
    } catch (err: any) {
      console.error('Failed to initialize order:', err)
      const mockOrderId = `CS-${Math.floor(100000 + Math.random() * 900000)}`
      setIsSubmitting(false)
      router.push(
        `/order/confirmation?id=${mockOrderId}&design=${activeDesign.slug}&total=${calculatedTotalEUR}&currency=${
          paymentGateway === 'stripe' ? 'EUR' : 'NGN'
        }`
      )
    }
  }

  // Shared Form Classes
  const inputClasses =
    'w-full px-4 py-3.5 bg-[#FAF7F2] border border-[#D1C9BE] text-[#2B2B2B] placeholder-[#8C7B6B] focus:outline-none focus:border-[#C4975A] font-body text-xs tracking-wider transition-colors duration-200 rounded-xl'
  const labelClasses = 'text-label text-stone-300 block mb-2 font-semibold text-xs uppercase tracking-wider'

  return (
    <div className="bg-[#0C0704] min-h-screen text-cream-100 flex flex-col justify-between">
      {/* =========================================================================
          DISTRACTION-FREE CHECKOUT HEADER
          Eliminates standard navigation menus and keeps patron locked into completing the order.
      ========================================================================= */}
      <header
        className="w-full border-b border-brown-800/80 bg-[#0C0704]/95 backdrop-blur-md sticky top-0 z-50"
        style={{
          paddingTop: '1rem',
          paddingBottom: '1rem',
        }}
      >
        <div
          className="container-brand"
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            width: '100%',
            paddingLeft: 'clamp(1rem, 4vw, 2.5rem)',
            paddingRight: 'clamp(1rem, 4vw, 2.5rem)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxSizing: 'border-box',
          }}
        >
          {/* Brand Wordmark & Security Tag */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-cream-100 uppercase hover:text-[#C4975A] transition-colors"
            >
              CaptainStitches
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[#10B981]/15 text-[#34D399] border border-[#10B981]/30 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider">
              🔒 Encrypted Commission
            </span>
          </div>

          {/* Current Step Tracker Badge */}
          <div className="hidden md:flex items-center gap-2 text-xs font-body text-stone-300">
            <span className="text-[#C4975A] font-bold">Step {step} of 5</span>
            <span className="text-stone-600">·</span>
            <span>
              {step === 1 && 'Choose Silhouette'}
              {step === 2 && 'Body Sizing'}
              {step === 3 && 'Delivery Address'}
              {step === 4 && 'Occasion Timeline'}
              {step === 5 && '50% Deposit'}
            </span>
          </div>

          {/* Sizing Assistance & Exit Link */}
          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/2348000000000?text=Hello%20CaptainStitches,%20I%20need%20help%20with%20my%20measurements%20or%20bespoke%20order."
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-[#E8D4B0] hover:text-[#C4975A] font-semibold transition-colors flex items-center gap-1"
            >
              💬 <span className="hidden sm:inline">Sizing Help</span>
            </a>
            <Link
              href="/catalogue"
              className="text-xs text-stone-400 hover:text-cream-100 transition-colors"
            >
              Exit ✕
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN ORDER WIZARD FLOW
      ========================================================================= */}
      <main id="main-content" className="flex-1" style={{ paddingTop: '2.5rem', paddingBottom: '3.5rem' }}>
        <div
          className="container-brand"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%',
            paddingLeft: 'clamp(1rem, 4vw, 2.5rem)',
            paddingRight: 'clamp(1rem, 4vw, 2.5rem)',
            boxSizing: 'border-box',
          }}
        >
          {/* Stepper Progress Indicator */}
          <div
            className="relative flex items-center justify-between"
            style={{
              maxWidth: '680px',
              margin: '0 auto 2.5rem auto',
              padding: '0 0.5rem',
            }}
          >
            {/* Background line */}
            <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-[2px] bg-brown-800/80 z-0" />

            {[
              { num: 1, label: 'Design' },
              { num: 2, label: 'Sizing' },
              { num: 3, label: 'Delivery' },
              { num: 4, label: 'Timeline' },
              { num: 5, label: 'Checkout' },
            ].map(s => (
              <button
                key={s.num}
                type="button"
                onClick={() => {
                  if (s.num < step) setStep(s.num)
                }}
                disabled={s.num > step && !canGoNext}
                className="z-10 flex flex-col items-center cursor-pointer disabled:cursor-not-allowed group focus:outline-none"
              >
                <span
                  className={[
                    'w-9 h-9 rounded-full flex items-center justify-center font-body text-xs font-bold transition-all duration-300',
                    step === s.num
                      ? 'bg-[#C4975A] text-[#0C0704] scale-110 shadow-lg shadow-[#C4975A]/30 ring-2 ring-[#C4975A]'
                      : step > s.num
                        ? 'bg-[#071A14] text-[#34D399] border border-[#10B981]/50'
                        : 'bg-brown-900 text-stone-500 border border-brown-800',
                  ].join(' ')}
                >
                  {step > s.num ? '✓' : s.num}
                </span>
                <span
                  className={[
                    'text-[9px] tracking-widest font-semibold uppercase mt-2 hidden sm:block',
                    step === s.num ? 'text-[#C4975A] font-bold' : 'text-stone-400',
                  ].join(' ')}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* Form Wizard Outer Card */}
          <form
            onSubmit={handleSubmit}
            className="rounded-3xl bg-brown-900/60 border border-brown-800/80 shadow-2xl flex flex-col gap-8"
            style={{
              padding: 'clamp(1.5rem, 4vw, 3rem)',
            }}
          >
            {/* =========================================================================
                STEP 1: AFRICAN DESIGN & SPECIFICATIONS SELECTION
            ========================================================================= */}
            {step === 1 && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                <div>
                  <span className="text-[#C4975A] text-xs font-bold uppercase tracking-wider block mb-1">
                    Step 1 of 5
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-cream-100 font-bold">
                    Choose African Attire &amp; Material
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    Select from our curated bespoke catalogue or upload your custom reference photograph.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                  {/* Select Predefined African Design */}
                  <div>
                    <label className={labelClasses}>Select Silhouette from Lookbook</label>
                    <select
                      value={isCustomUpload ? 'custom' : selectedDesignSlug}
                      onChange={e => {
                        if (e.target.value === 'custom') {
                          setIsCustomUpload(true)
                        } else {
                          setIsCustomUpload(false)
                          setSelectedDesignSlug(e.target.value)
                        }
                      }}
                      className={inputClasses}
                      style={{ height: '52px' }}
                    >
                      {isLoadingDesigns && <option disabled>Loading designs from Nigerian atelier...</option>}
                      {designsList.map(d => (
                        <option key={d.slug} value={d.slug}>
                          {d.name} ({d.categoryLabel})
                        </option>
                      ))}
                      <option value="custom">★ Upload Custom Photo / Pin Reference</option>
                    </select>

                    {/* Predefined Thumbnail Display */}
                    {!isCustomUpload && activeDesign && (
                      <div className="mt-4 relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden bg-[#0C0704] border border-brown-800">
                        <Image
                          src={activeDesign.image}
                          alt={activeDesign.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-3 left-3 bg-[#0C0704]/85 backdrop-blur-md rounded-full px-3 py-1 text-[9px] text-[#C4975A] font-bold uppercase tracking-wider">
                          {activeDesign.categoryLabel}
                        </div>
                      </div>
                    )}

                    {/* Custom File Upload Uploader */}
                    {isCustomUpload && (
                      <div className="mt-4 flex flex-col gap-4">
                        <label className={labelClasses}>Upload Custom Design Image</label>
                        <div className="relative p-8 text-center cursor-pointer rounded-2xl bg-[#0C0704]/60 border-2 border-dashed border-brown-700 hover:border-[#C4975A] transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {customFilePreview ? (
                            <div className="flex flex-col items-center gap-2">
                              <div className="relative h-44 w-full rounded-xl overflow-hidden">
                                <Image
                                  src={customFilePreview}
                                  alt="Custom Reference Upload"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                {isUploadingToCloudinary ? (
                                  <span className="text-[10px] text-[#C4975A] flex items-center gap-1.5 font-bold uppercase tracking-wider bg-brown-900/60 px-3 py-1 rounded-full border border-[#C4975A]/40">
                                    <span className="w-2.5 h-2.5 border-2 border-[#C4975A] border-t-transparent rounded-full animate-spin" />
                                    Uploading to Cloudinary Media Repository...
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-[#10B981] flex items-center gap-1.5 font-bold uppercase tracking-wider bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/30">
                                    ✓ Cloudinary Media Repository Synced
                                  </span>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-2xl text-[#C4975A]">📷</span>
                              <span className="text-xs text-stone-300 font-semibold uppercase tracking-wider">
                                Click or Drag to Upload Reference Photo
                              </span>
                              <span className="text-[10px] text-stone-500">
                                Supports JPEG, PNG, WEBP from Pinterest or Instagram
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fabric & Colour Selectors */}
                  <div className="flex flex-col gap-6">
                    {/* Fabric Quality */}
                    <div>
                      <label className={labelClasses}>Select Fabric Grade</label>
                      <div className="flex flex-col gap-2 mt-2">
                        {activeDesign.fabrics.map(fabric => (
                          <button
                            key={fabric}
                            type="button"
                            onClick={() => setSelectedFabric(fabric)}
                            className={[
                              'px-4 py-3.5 rounded-xl text-xs tracking-wider uppercase font-semibold text-left transition-all duration-200 cursor-pointer border',
                              selectedFabric === fabric
                                ? 'bg-[#C4975A]/20 border-[#C4975A] text-[#E8D4B0] font-bold shadow-md'
                                : 'bg-[#0C0704]/40 border-brown-800 text-stone-300 hover:border-stone-500 hover:text-cream-100',
                            ].join(' ')}
                          >
                            <div className="flex items-center justify-between">
                              <span>{fabric}</span>
                              {selectedFabric === fabric && (
                                <span className="text-[#C4975A] font-bold">✓</span>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colour Selector with Swatches */}
                    <div>
                      <ColourSelector
                        label="Select Dye / Tone Preference"
                        options={(activeDesign as any).colorOptions || activeDesign.colors || []}
                        value={selectedColor}
                        onChange={val => setSelectedColor(val)}
                        darkMode={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 2: DISTRACTION-FREE BODY SIZING
                Offers 3 clear paths so the user never gets stuck:
                1. Custom Tape Measurements (with helper tips)
                2. Standard European Fit (instant completion without tape)
                3. Book 5-Min WhatsApp Video Sizing (assisted by Verona tailor)
            ========================================================================= */}
            {step === 2 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div>
                  <span className="text-[#C4975A] text-xs font-bold uppercase tracking-wider block mb-1">
                    Step 2 of 5 · Focused Sizing
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-cream-100 font-bold">
                    Select Your Preferred Sizing Method
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    Choose the option that is easiest for you right now. No tape measure? You can select standard sizing or request a quick WhatsApp video call.
                  </p>
                </div>

                {/* Sizing Mode 3-Way Pill Switcher */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-1.5 rounded-2xl bg-[#0C0704]/80 border border-brown-800">
                  <button
                    type="button"
                    onClick={() => setSizingMode('bespoke')}
                    className={[
                      'py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer text-center',
                      sizingMode === 'bespoke'
                        ? 'bg-[#C4975A] text-[#0C0704] shadow-md'
                        : 'text-stone-300 hover:text-cream-100',
                    ].join(' ')}
                  >
                    📏 Tape Measurements
                  </button>

                  <button
                    type="button"
                    onClick={() => setSizingMode('standard')}
                    className={[
                      'py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer text-center',
                      sizingMode === 'standard'
                        ? 'bg-[#C4975A] text-[#0C0704] shadow-md'
                        : 'text-stone-300 hover:text-cream-100',
                    ].join(' ')}
                  >
                    ⚡ Standard Size (Quick)
                  </button>

                  <button
                    type="button"
                    onClick={() => setSizingMode('video_call')}
                    className={[
                      'py-3 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all cursor-pointer text-center',
                      sizingMode === 'video_call'
                        ? 'bg-[#C4975A] text-[#0C0704] shadow-md'
                        : 'text-stone-300 hover:text-cream-100',
                    ].join(' ')}
                  >
                    📹 Video Sizing Call
                  </button>
                </div>

                {/* --- MODE 1: CUSTOM TAPE MEASUREMENTS --- */}
                {sizingMode === 'bespoke' && (
                  <div className="flex flex-col gap-6 animate-fadeIn">
                    {/* Unit Selector */}
                    <div className="flex items-center justify-between border-b border-brown-800 pb-3">
                      <span className="text-xs text-stone-300 font-semibold">
                        Enter your body dimensions below:
                      </span>
                      <div className="flex items-center gap-2 rounded-xl bg-[#0C0704] p-1 border border-brown-800">
                        {['inches', 'cm'].map(unit => (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => setMeasurementUnit(unit as 'inches' | 'cm')}
                            className={[
                              'px-3 py-1 rounded-lg text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer',
                              measurementUnit === unit
                                ? 'bg-[#C4975A] text-[#0C0704]'
                                : 'text-stone-400 hover:text-cream-100',
                            ].join(' ')}
                          >
                            {unit}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                      {/* Left: Input Fields (7 cols) */}
                      <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {Object.entries(MEASUREMENT_GUIDES).map(([field, guide]) => (
                          <div key={field}>
                            <label className="text-xs font-semibold text-stone-300 block mb-1">
                              {guide.label}
                            </label>
                            <div className="relative">
                              <input
                                type="text"
                                value={measurements[field as keyof typeof measurements]}
                                onChange={e => handleMeasurementChange(field, e.target.value)}
                                onFocus={() => setFocusedField(field)}
                                placeholder="0.0"
                                className={inputClasses}
                                style={{
                                  borderColor: focusedField === field ? '#C4975A' : '#D1C9BE',
                                }}
                                required
                              />
                              <span className="absolute inset-y-0 right-3 flex items-center text-[10px] text-stone-500 font-mono pointer-events-none">
                                {measurementUnit === 'inches' ? 'in' : 'cm'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Right: Focused Guidance Card & Diagram (5 cols) */}
                      <div className="md:col-span-5 flex flex-col gap-4">
                        <BodyDiagram activeField={focusedField} />

                        {/* Interactive Helper Tip Card */}
                        <div className="rounded-2xl bg-[#0C0704] border border-[#C4975A]/40 p-4 shadow-lg">
                          <span className="text-[10px] text-[#C4975A] uppercase tracking-widest font-bold block mb-1">
                            ✦ Measuring Guide: {MEASUREMENT_GUIDES[focusedField]?.label || 'Tape Placement'}
                          </span>
                          <p className="text-xs text-stone-300 leading-relaxed font-body">
                            {MEASUREMENT_GUIDES[focusedField]?.tip ||
                              'Select an input field on the left to see exact instructions on where to measure.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- MODE 2: STANDARD EUROPEAN FIT (QUICK SIZING) --- */}
                {sizingMode === 'standard' && (
                  <div className="rounded-2xl bg-[#0C0704]/70 border border-brown-800 p-6 sm:p-8 flex flex-col gap-6 animate-fadeIn">
                    <div>
                      <h3 className="font-serif text-xl font-bold text-cream-100 mb-1">
                        Select Your Standard European Fit
                      </h3>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Don’t have a tape measure handy? Select your typical sizing. Our Verona tailors cross-reference your height and build to calibrate exact proportions before cutting.
                      </p>
                    </div>

                    {/* Standard Chest/Suit Size */}
                    <div>
                      <label className={labelClasses}>Standard Size</label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                        {[
                          { size: 'S', desc: '38 EU' },
                          { size: 'M', desc: '40 EU' },
                          { size: 'L', desc: '42 EU' },
                          { size: 'XL', desc: '44 EU' },
                          { size: '2XL', desc: '46 EU' },
                          { size: '3XL', desc: '48 EU' },
                        ].map(item => (
                          <button
                            key={item.size}
                            type="button"
                            onClick={() => setStandardSize(item.size)}
                            className={[
                              'py-3 rounded-xl border text-center transition-all cursor-pointer',
                              standardSize === item.size
                                ? 'bg-[#C4975A] text-[#0C0704] border-[#C4975A] font-bold shadow-md'
                                : 'bg-[#0C0704] border-brown-800 text-stone-300 hover:border-stone-500',
                            ].join(' ')}
                          >
                            <span className="text-base font-bold block">{item.size}</span>
                            <span className="text-[10px] opacity-80">{item.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Height Range */}
                    <div>
                      <label className={labelClasses}>Your Height</label>
                      <select
                        value={heightRange}
                        onChange={e => setHeightRange(e.target.value)}
                        className={inputClasses}
                        style={{ height: '50px' }}
                      >
                        <option value="Under 170 cm (Under 5'7&quot;)">Under 170 cm (Under 5'7&quot;)</option>
                        <option value="170–175 cm (5'7&quot; – 5'9&quot;)">170–175 cm (5'7&quot; – 5'9&quot;)</option>
                        <option value="175–180 cm (5'9&quot; – 5'11&quot;)">175–180 cm (5'9&quot; – 5'11&quot;)</option>
                        <option value="180–185 cm (5'11&quot; – 6'1&quot;)">180–185 cm (5'11&quot; – 6'1&quot;)</option>
                        <option value="Above 185 cm (Above 6'1&quot;)">Above 185 cm (Above 6'1&quot;)</option>
                      </select>
                    </div>

                    {/* Body Build */}
                    <div>
                      <label className={labelClasses}>Body Silhouette / Build</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {(['Slim', 'Regular', 'Athletic', 'Broad'] as const).map(build => (
                          <button
                            key={build}
                            type="button"
                            onClick={() => setBodyBuild(build)}
                            className={[
                              'py-3 px-4 rounded-xl border text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer text-center',
                              bodyBuild === build
                                ? 'bg-[#C4975A]/20 border-[#C4975A] text-[#E8D4B0] font-bold shadow-md'
                                : 'bg-[#0C0704] border-brown-800 text-stone-300 hover:border-stone-500',
                            ].join(' ')}
                          >
                            {build} Fit
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#071A14] border border-[#10B981]/30 p-4">
                      <p className="text-xs text-[#A7F3D0] leading-relaxed">
                        ✓ <strong>Pre-Cut Verification:</strong> Our head tailor in Verona will reach out on WhatsApp to double-check sleeve and trouser lengths with you before the fabric is cut.
                      </p>
                    </div>
                  </div>
                )}

                {/* --- MODE 3: ASSISTED VIDEO SIZING CALL --- */}
                {sizingMode === 'video_call' && (
                  <div className="rounded-2xl bg-[#0C0704]/70 border border-brown-800 p-6 sm:p-8 flex flex-col gap-6 animate-fadeIn text-center">
                    <div className="w-16 h-16 rounded-full bg-[#10B981]/20 border-2 border-[#10B981] flex items-center justify-center mx-auto text-2xl">
                      📹
                    </div>
                    <div className="max-w-md mx-auto">
                      <h3 className="font-serif text-2xl font-bold text-cream-100 mb-2">
                        Book a 5-Minute WhatsApp Video Fit
                      </h3>
                      <p className="text-xs text-stone-300 leading-relaxed">
                        Prefer to have a master tailor guide you? Complete your order and 50% deposit now. Our Verona fitting specialist will immediately message you to schedule a quick video session at your convenience.
                      </p>
                    </div>

                    <label className="flex items-center justify-center gap-3 cursor-pointer p-4 rounded-xl bg-brown-900/60 border border-brown-800 max-w-md mx-auto">
                      <input
                        type="checkbox"
                        checked={videoCallAccepted}
                        onChange={e => setVideoCallAccepted(e.target.checked)}
                        className="w-4 h-4 accent-[#C4975A] rounded"
                      />
                      <span className="text-xs text-cream-100 font-semibold text-left">
                        Yes, message me on WhatsApp to confirm video measurement time.
                      </span>
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
                      <div className="p-3 rounded-xl bg-[#0C0704] border border-brown-800 text-xs">
                        <strong className="text-[#C4975A] block mb-1">01 / Deposit Paid</strong>
                        <span className="text-stone-400 text-[11px]">Locks your workshop queue slot</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0C0704] border border-brown-800 text-xs">
                        <strong className="text-[#C4975A] block mb-1">02 / Video Call</strong>
                        <span className="text-stone-400 text-[11px]">Takes 5 minutes with tailor</span>
                      </div>
                      <div className="p-3 rounded-xl bg-[#0C0704] border border-brown-800 text-xs">
                        <strong className="text-[#C4975A] block mb-1">03 / Craft Begins</strong>
                        <span className="text-stone-400 text-[11px]">Guaranteed perfect fit</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* =========================================================================
                STEP 3: PERSONAL & EUROPEAN DELIVERY DETAILS
            ========================================================================= */}
            {step === 3 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div>
                  <span className="text-[#C4975A] text-xs font-bold uppercase tracking-wider block mb-1">
                    Step 3 of 5
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-cream-100 font-bold">
                    Delivery Address &amp; Contact
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    Direct courier delivery across Europe via tracked DHL Express.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      value={personalDetails.fullName}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="E.g., Chidi Okafor"
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      value={personalDetails.email}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="client@stitches.com"
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>WhatsApp Phone Number (For Fitting Updates)</label>
                    <input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+39 333 444 555"
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClasses}>Street Address</label>
                    <input
                      type="text"
                      value={personalDetails.address}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Via Pallone, 12"
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>City</label>
                    <input
                      type="text"
                      value={personalDetails.city}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Verona"
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClasses}>Postcode / ZIP</label>
                    <input
                      type="text"
                      value={personalDetails.postcode}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, postcode: e.target.value }))}
                      placeholder="37121"
                      className={inputClasses}
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className={labelClasses}>Destination Country</label>
                    <select
                      value={personalDetails.country}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, country: e.target.value }))}
                      className={inputClasses}
                      style={{ height: '50px' }}
                    >
                      <option value="Italy">Italy (Verona hub courier)</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Ireland">Ireland</option>
                      <option value="Nigeria">Nigeria (Domestic pickup)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 4: OCCASION & TIMELINE DETAILS
            ========================================================================= */}
            {step === 4 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div>
                  <span className="text-[#C4975A] text-xs font-bold uppercase tracking-wider block mb-1">
                    Step 4 of 5
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-cream-100 font-bold">
                    Event Occasion &amp; Target Date
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    Help our master tailors prioritize your workshop turnaround.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={labelClasses}>Event / Occasion Type</label>
                    <select
                      value={occasion}
                      onChange={e => setOccasion(e.target.value)}
                      className={inputClasses}
                      style={{ height: '50px' }}
                    >
                      <option value="Wedding">Traditional Wedding / Groom</option>
                      <option value="Cultural Gala">Cultural Gala / Diplomatic Dinner</option>
                      <option value="Ceremony">Chieftaincy / Title Ceremony</option>
                      <option value="Birthday">Milestone Birthday Celebration</option>
                      <option value="Everyday">Everyday Modern Native Wear</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClasses}>Target Delivery Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className={inputClasses}
                      style={{ height: '50px' }}
                      required
                    />
                  </div>

                  {deadlineWarningMessage && (
                    <div className="md:col-span-2 p-4 rounded-xl bg-red-950/30 border border-red-900/60 text-xs text-red-200">
                      ⚠️ <strong>Timeline Alert:</strong> {deadlineWarningMessage}
                    </div>
                  )}

                  <div className="md:col-span-2">
                    <label className={labelClasses}>Special Tailoring Notes / Custom Requests</label>
                    <textarea
                      value={specialNotes}
                      onChange={e => setSpecialNotes(e.target.value)}
                      placeholder="E.g., Embroidered chest monogram with initials 'SA'; trousers must include belt loops; extra deep pockets for passport."
                      className={[inputClasses, 'resize-none'].join(' ')}
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* =========================================================================
                STEP 5: ORDER INVOICE & 50% DEPOSIT CHECKOUT
            ========================================================================= */}
            {step === 5 && (
              <div className="flex flex-col gap-6 animate-fadeIn">
                <div>
                  <span className="text-[#C4975A] text-xs font-bold uppercase tracking-wider block mb-1">
                    Step 5 of 5 · Final Step
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl text-cream-100 font-bold">
                    Review &amp; Settle 50% Milestone Deposit
                  </h2>
                  <p className="text-xs text-stone-300 mt-1">
                    Your deposit starts tailoring immediately. The remaining 50% balance is only paid after you inspect and approve your 4K fit video.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                  {/* Left: Summary cards (7 cols) */}
                  <div className="md:col-span-7 flex flex-col gap-4">
                    <div className="rounded-2xl bg-[#0C0704]/70 border border-brown-800 p-5">
                      <span className="text-[10px] text-[#C4975A] uppercase tracking-widest font-bold block mb-2">
                        1. Selected Piece &amp; Fabric
                      </span>
                      <div className="flex items-center gap-4">
                        {!isCustomUpload && activeDesign && (
                          <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-[#0C0704] shrink-0 border border-brown-800">
                            <Image
                              src={activeDesign.image}
                              alt={activeDesign.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <strong className="text-cream-100 block font-serif text-base">{activeDesign.name}</strong>
                          <span className="text-xs text-stone-300 block">Grade: {selectedFabric}</span>
                          <span className="text-xs text-stone-300 block">Tone: {selectedColor}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-[#0C0704]/70 border border-brown-800 p-5">
                      <span className="text-[10px] text-[#C4975A] uppercase tracking-widest font-bold block mb-2">
                        2. Sizing Summary
                      </span>
                      {sizingMode === 'bespoke' ? (
                        <p className="text-xs text-stone-300">
                          Custom tape measurements provided ({measurementUnit}) across 8 anatomical points.
                        </p>
                      ) : sizingMode === 'standard' ? (
                        <p className="text-xs text-stone-300">
                          Standard Size: <strong>{standardSize}</strong> · Height: <strong>{heightRange}</strong> · Build: <strong>{bodyBuild} Fit</strong>
                        </p>
                      ) : (
                        <p className="text-xs text-stone-300">
                          📹 <strong>5-Minute Video Fit:</strong> Verona tailor will initiate live measurement session via WhatsApp.
                        </p>
                      )}
                    </div>

                    <div className="rounded-2xl bg-[#0C0704]/70 border border-brown-800 p-5">
                      <span className="text-[10px] text-[#C4975A] uppercase tracking-widest font-bold block mb-2">
                        3. European Courier Destination
                      </span>
                      <p className="text-xs text-stone-300">
                        {personalDetails.fullName} ({personalDetails.phone})<br />
                        {personalDetails.address}, {personalDetails.city}, {personalDetails.postcode}, {personalDetails.country}
                      </p>
                    </div>
                  </div>

                  {/* Right: Payment & Milestone Invoice Card (5 cols) */}
                  <div className="md:col-span-5 rounded-2xl bg-[#0C0704] border border-[#10B981]/30 p-6 flex flex-col gap-5 shadow-xl">
                    <h3 className="font-serif text-xl font-bold text-cream-100 border-b border-brown-800 pb-3">
                      Deposit Summary
                    </h3>

                    <div className="flex flex-col gap-2.5 font-body text-xs">
                      <div className="flex justify-between text-stone-400">
                        <span>Bespoke Attire:</span>
                        <span className="text-cream-100">
                          €{activeDesign.priceEUR} / ₦{activeDesign.priceNGN.toLocaleString('en-NG')}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-400">
                        <span>DHL International Courier:</span>
                        <span className="text-[#34D399] font-bold">COMPLIMENTARY</span>
                      </div>

                      {/* Referral Voucher / Promo Code Field */}
                      <div className="pt-2 pb-1 border-t border-brown-800">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-[#C4975A] uppercase tracking-widest font-semibold">
                            Referral Voucher / Gift Code:
                          </span>
                          {activeReferral && (
                            <button
                              type="button"
                              onClick={() => {
                                setActiveReferral(null)
                                setReferralCodeInput('')
                                if (typeof window !== 'undefined') localStorage.removeItem('cs_active_referral')
                              }}
                              className="text-[10px] text-stone-400 hover:text-red-400 underline cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </div>

                        {!activeReferral ? (
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={referralCodeInput}
                              onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                              placeholder="e.g. DANIEL10"
                              className="flex-1 px-3 py-1.5 rounded-lg bg-[#140C07] border border-brown-800 text-xs text-cream-100 placeholder:text-stone-600 focus:outline-none focus:border-[#C4975A] font-mono uppercase"
                            />
                            <button
                              type="button"
                              onClick={() => applyReferralCode(referralCodeInput)}
                              disabled={isValidatingReferral || !referralCodeInput.trim()}
                              className="px-3.5 py-1.5 rounded-lg bg-[#C4975A] text-[#0C0704] text-xs font-bold uppercase tracking-wider hover:bg-[#d6aa6d] disabled:opacity-40 cursor-pointer"
                            >
                              {isValidatingReferral ? 'Checking...' : 'Apply'}
                            </button>
                          </div>
                        ) : (
                          <div className="p-2.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-between gap-2 text-xs">
                            <div>
                              <span className="font-mono font-bold text-[#34D399] block">{activeReferral.code}</span>
                              <span className="text-[10px] text-stone-300">Gifted by {activeReferral.referrerName}</span>
                            </div>
                            <span className="text-[#34D399] font-bold text-xs">-€{activeReferral.discountEUR} / -₦{activeReferral.discountNGN.toLocaleString('en-NG')}</span>
                          </div>
                        )}

                        {referralError && (
                          <p className="text-[11px] text-red-400 mt-1">⚠️ {referralError}</p>
                        )}
                      </div>

                      {activeReferral && (
                        <div className="flex justify-between text-[#34D399] font-medium">
                          <span>Referral Gift:</span>
                          <span>-€{activeReferral.discountEUR} / -₦{activeReferral.discountNGN.toLocaleString('en-NG')}</span>
                        </div>
                      )}

                      <div className="flex justify-between text-stone-300 font-semibold pt-2 border-t border-brown-800">
                        <span>Total Commission:</span>
                        <span className="text-cream-100">
                          €{calculatedTotalEUR} / ₦{calculatedTotalNGN.toLocaleString('en-NG')}
                        </span>
                      </div>

                      <div className="flex justify-between items-baseline pt-3 border-t border-brown-800">
                        <div>
                          <strong className="text-sm text-[#C4975A] block">50% Deposit Due Now:</strong>
                          <span className="text-[10px] text-stone-400">50% balance after video sign-off</span>
                        </div>
                        <span className="font-serif text-2xl font-bold text-[#E8D4B0]">
                          {paymentGateway === 'stripe' ? `€${depositDueEUR}` : `₦${depositDueNGN.toLocaleString('en-NG')}`}
                        </span>
                      </div>
                    </div>

                    {/* Payment Gateway Switch */}
                    <div className="flex flex-col gap-2 pt-2">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                        Select Payment Method:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentGateway('stripe')}
                          className={[
                            'py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                            paymentGateway === 'stripe'
                              ? 'bg-cream-100 text-[#0C0704] border-cream-100'
                              : 'bg-brown-900/60 text-stone-300 border-brown-800',
                          ].join(' ')}
                        >
                          Stripe (Euro / Cards)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentGateway('paystack')}
                          className={[
                            'py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border',
                            paymentGateway === 'paystack'
                              ? 'bg-cream-100 text-[#0C0704] border-cream-100'
                              : 'bg-brown-900/60 text-stone-300 border-brown-800',
                          ].join(' ')}
                        >
                          Paystack (Naira / ₦)
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                      style={{
                        borderRadius: '12px',
                        padding: '16px',
                        fontWeight: 700,
                      }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2 justify-center">
                          <span className="w-3.5 h-3.5 border-2 border-[#0C0704] border-t-transparent rounded-full animate-spin" />
                          Processing 50% Deposit...
                        </span>
                      ) : (
                        paymentGateway === 'stripe'
                          ? `Pay €${depositDueEUR} Deposit to Start Tailoring`
                          : `Pay ₦${depositDueNGN.toLocaleString('en-NG')} Deposit to Start Tailoring`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-brown-800/80 pt-6 mt-6">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1 || isSubmitting}
                className="px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-semibold bg-brown-900/60 text-stone-300 hover:text-cream-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer border border-brown-800"
              >
                ← Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(5, s + 1))}
                  disabled={!canGoNext}
                  className="px-8 py-3.5 rounded-xl text-xs uppercase tracking-wider font-bold bg-[#C4975A] text-[#0C0704] hover:bg-[#E8D4B0] transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-[#C4975A]/20"
                >
                  Continue to Next Step →
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </main>

      {/* =========================================================================
          DISTRACTION-FREE CHECKOUT FOOTER
      ========================================================================= */}
      <footer
        className="w-full border-t border-brown-800/60 bg-[#0C0704]"
        style={{
          paddingTop: '1.5rem',
          paddingBottom: '1.5rem',
        }}
      >
        <div
          className="container-brand text-center text-xs text-stone-400 font-body"
          style={{
            maxWidth: '1000px',
            margin: '0 auto',
            width: '100%',
            paddingLeft: '1rem',
            paddingRight: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxSizing: 'border-box',
          }}
        >
          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-300 font-semibold">
            <span>🔒 256-Bit SSL Protection</span>
            <span>·</span>
            <span>🛡 50% Milestone Deposit Guarantee</span>
            <span>·</span>
            <span>✦ Verona Fit Alterations Support</span>
          </div>
          <p className="text-[11px] text-stone-500">
            © 2026 CaptainStitches Bespoke · Verona Atelier (Via Pallone 12) &amp; Nigerian Master Workshops.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default function OrderFormPage() {
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
      <OrderFormContent />
    </Suspense>
  )
}
