'use client'

import { useState, useEffect, useMemo, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'

const DESIGNS_LIST = [
  {
    name: 'Grand Agbada',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 120000,
    priceEUR: 68,
    turnaround: '10–14 days',
    turnaroundDays: 14,
    image: '/images/design-agbada.jpg',
    slug: 'grand-agbada',
    fabrics: ['Presidential Cashmere', 'Premium Heavy Cotton', 'Supreme Damascus Silk'],
    colors: ['Midnight Black', 'Royal Ivory', 'Imperial Blue', 'Burgundy Wine'],
  },
  {
    name: 'Classic Senator',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 85000,
    priceEUR: 47,
    turnaround: '7–10 days',
    turnaroundDays: 10,
    image: '/images/design-senator.jpg',
    slug: 'classic-senator',
    fabrics: ['Super-Wax Crepe', 'Italian Linen', 'Soft Wool Blend'],
    colors: ['Slate Grey', 'Forest Green', 'Navy Blue', 'Chocolate Brown'],
  },
  {
    name: 'Italian 3-Piece Suit',
    category: 'english-suit',
    categoryLabel: 'English Suits',
    priceNGN: 160000,
    priceEUR: 90,
    turnaround: '14–21 days',
    turnaroundDays: 21,
    image: '/images/design-suit.jpg',
    slug: 'italian-3-piece-suit',
    fabrics: ['Super 120s Italian Wool', 'Cashmere-Wool Blend', 'Premium Flannel'],
    colors: ['Charcoal Grey', 'Classic Navy', 'Jet Black'],
  },
  {
    name: 'Kaftan Royale',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 75000,
    priceEUR: 42,
    turnaround: '7–10 days',
    turnaroundDays: 10,
    image: '/images/design-kaftan.jpg',
    slug: 'kaftan-royale',
    fabrics: ['Presidential Crepe', 'Soft Cotton Blend', 'Polished Linen'],
    colors: ['Ivory Cream', 'Emerald Green', 'Mustard Gold', 'Ocean Teal'],
  },
  {
    name: 'Double-Breasted Executive Suit',
    category: 'english-suit',
    categoryLabel: 'English Suits',
    priceNGN: 195000,
    priceEUR: 110,
    turnaround: '14–21 days',
    turnaroundDays: 21,
    image: '/images/category-suits.jpg',
    slug: 'double-breasted-executive-suit',
    fabrics: ['Super 150s Merino Wool Blend', 'English Tweed', 'Wool-Silk Twill'],
    colors: ['Midnight Navy', 'Oxford Grey', 'Classic Pinstripe'],
  },
  {
    name: 'Linen Summer Set',
    category: 'casual',
    categoryLabel: 'Casual Wear',
    priceNGN: 60000,
    priceEUR: 35,
    turnaround: '5–7 days',
    turnaroundDays: 7,
    image: '/images/category-casual.jpg',
    slug: 'linen-summer-set',
    fabrics: ['100% Irish Linen', 'French Flax Linen', 'Linen-Cotton Blend'],
    colors: ['Sand Beige', 'Sky Blue', 'Olive Green', 'Pure White'],
  },
  {
    name: 'Signature Embroidered Kaftan',
    category: 'native-wear',
    categoryLabel: 'Native Wear',
    priceNGN: 90000,
    priceEUR: 50,
    turnaround: '7–10 days',
    turnaroundDays: 10,
    image: '/images/category-native.jpeg',
    slug: 'signature-embroidered-kaftan',
    fabrics: ['Premium Senator Cashmere', 'Japanese Cotton-Wool Blend'],
    colors: ['Royal Gold', 'Midnight Black', 'Teal Blue'],
  },
  {
    name: 'Mini Senator Set',
    category: 'children',
    categoryLabel: "Children's Wear",
    priceNGN: 50000,
    priceEUR: 30,
    turnaround: '5–7 days',
    turnaroundDays: 7,
    image: '/images/category-children.jpg',
    slug: 'mini-senator-set',
    fabrics: ['Super-Soft Cotton', 'Senator Crepe-Soft'],
    colors: ['Sky Blue', 'Royal Blue', 'Burgundy Wine'],
  },
  {
    name: 'Junior Tuxedo',
    category: 'children',
    categoryLabel: "Children's Wear",
    priceNGN: 95000,
    priceEUR: 55,
    turnaround: '10–14 days',
    turnaroundDays: 14,
    image: '/images/category-children.jpg',
    slug: 'junior-tuxedo',
    fabrics: ['Soft Velvet-Wool Blend', 'Italian Wool-Cotton Blend'],
    colors: ['Classic Black', 'Midnight Navy'],
  },
  {
    name: 'Urban Kaftan Short',
    category: 'casual',
    categoryLabel: 'Casual Wear',
    priceNGN: 65000,
    priceEUR: 38,
    turnaround: '5–7 days',
    turnaroundDays: 7,
    image: '/images/category-casual.jpg',
    slug: 'urban-kaftan-short',
    fabrics: ['Polished Cotton', 'Linen Premium'],
    colors: ['Sage Green', 'Rust Orange', 'Navy Blue'],
  },
]

const CUSTOM_DESIGN = {
  name: 'Custom Reference Design',
  category: 'custom',
  categoryLabel: 'Bespoke Reference',
  priceNGN: 130000,
  priceEUR: 75,
  turnaround: '14–21 days',
  turnaroundDays: 21,
  slug: 'custom-ref',
  image: '/images/category-native.jpeg',
  fabrics: ['Premium Cashmere', 'Classic Cotton', 'Italian Linen', 'Luxury Crepe'],
  colors: ['Midnight Black', 'Ivory White', 'Navy Blue', 'Forest Green', 'Burgundy Wine'],
}

// Stylized Mannequin Diagram for Measurement Step
function BodyDiagram({ activeField }: { activeField: string }) {
  return (
    <div className="relative w-full h-[320px] bg-brown-950/40 flex items-center justify-center p-6">
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
          className={activeField === 'neck' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Torso & Shoulders */}
        <path d="M32 34 L68 34 M32 34 L36 75 L64 75 L68 34" className="stroke-stone-600" />

        {/* Shoulder line */}
        <path
          d="M32 34 H68"
          className={activeField === 'shoulder' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Chest line */}
        <path
          d="M33 48 H67"
          className={activeField === 'chest' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Sleeve line */}
        <path
          d="M32 34 L28 72"
          className={activeField === 'sleeve' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Torso Width / Waist line */}
        <path
          d="M35 60 H65"
          className={activeField === 'waist' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Hips line */}
        <path
          d="M36 75 H64"
          className={activeField === 'hip' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600'}
        />

        {/* Legs & Trousers */}
        <path d="M36 75 L38 150 M64 75 L62 150 M50 90 L50 150" className="stroke-stone-600" />

        {/* Shirt Length indicator */}
        <path
          d="M50 34 V70"
          className={activeField === 'shirtLength' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600/30'}
        />

        {/* Trouser Length indicator */}
        <path
          d="M38 75 V145"
          className={activeField === 'trouserLength' ? 'stroke-caramel-500 stroke-[2.5] animate-pulse' : 'stroke-stone-600/30'}
        />
      </svg>
    </div>
  )
}

function OrderFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Retrieve selected item from query parameters
  const initialDesignSlug = searchParams.get('design') || 'grand-agbada'

  // State variables
  const [step, setStep] = useState(1)
  const [selectedDesignSlug, setSelectedDesignSlug] = useState(initialDesignSlug)
  const [isCustomUpload, setIsCustomUpload] = useState(initialDesignSlug === 'custom')
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [customFilePreview, setCustomFilePreview] = useState<string>('')

  const activeDesign = useMemo(() => {
    if (isCustomUpload) return CUSTOM_DESIGN
    return DESIGNS_LIST.find(d => d.slug === selectedDesignSlug) || DESIGNS_LIST[0]
  }, [selectedDesignSlug, isCustomUpload])

  // Step variables
  const [selectedFabric, setSelectedFabric] = useState(activeDesign.fabrics[0])
  const [selectedColor, setSelectedColor] = useState(activeDesign.colors[0])
  const [measurementUnit, setMeasurementUnit] = useState<'inches' | 'cm'>('inches')
  const [focusedField, setFocusedField] = useState<string>('')

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

  // Sync selected specifications if design changes
  useEffect(() => {
    setSelectedFabric(activeDesign.fabrics[0])
    setSelectedColor(activeDesign.colors[0])
  }, [activeDesign])

  // Handle uploader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCustomFile(file)
      setCustomFilePreview(URL.createObjectURL(file))
    }
  }

  // Handle measurement inputs
  const handleMeasurementChange = (field: string, val: string) => {
    // Only allow numbers and decimals
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
      return Object.values(measurements).every(val => !!val)
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
  }, [step, isCustomUpload, customFilePreview, selectedFabric, selectedColor, measurements, personalDetails, occasion, deadline])

  // SLA Deadline checks
  const deadlineWarningMessage = useMemo(() => {
    if (!deadline) return null

    const targetDate = new Date(deadline)
    const minDays = activeDesign.turnaroundDays
    const minRequiredDate = new Date(Date.now() + minDays * 24 * 60 * 60 * 1000)

    if (targetDate < minRequiredDate) {
      return `Our minimum turnaround for ${activeDesign.name} is ${activeDesign.turnaround}. Surcharges of €30 / ₦50,000 may apply for express logistics validation.`
    }
    return null
  }, [deadline, activeDesign])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canGoNext) return

    setIsSubmitting(true)
    // Simulate API call to payment webhook
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Mock Order ID generation and redirection to the order confirmation page
    const mockOrderId = `CS-${Math.floor(100000 + Math.random() * 900000)}`
    setIsSubmitting(false)
    router.push(`/order/confirmation?id=${mockOrderId}&design=${activeDesign.slug}&total=${activeDesign.priceEUR}&currency=${paymentGateway === 'stripe' ? 'EUR' : 'NGN'}`)
  }

  // Shared Form Classes
  const inputClasses =
    'w-full px-4 bg-brown-950/40 border border-brown-800 text-cream-200 placeholder-stone-600 focus:outline-none focus:border-caramel-500 font-body text-xs tracking-wider transition-colors duration-200 rounded-none'
  const labelClasses = 'text-label text-stone-400 block mb-2 font-semibold'

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pb-24" style={{ paddingTop: "150px", paddingBottom: "50px" }}>
        <div className="container-brand max-w-4xl">

          {/* Header Title */}
          <div className="text-center mb-10" style={{ marginBottom: "40px" }}>
            <SectionEyebrow label="Bespoke Order" />
            <h1 className="text-heading-xl text-cream-200 mt-2 font-normal text-left">
              Tailor-Made Order Form
            </h1>
          </div>

          {/* Stepper Progress Indicator — Clean, borderless indicators */}
          <div className="mb-12 relative flex items-center justify-between" style={{ marginBottom: "25px" }}>
            {/* Background line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-brown-900/60 z-0" />

            {[
              { num: 1, label: 'Design' },
              { num: 2, label: 'Size' },
              { num: 3, label: 'Details' },
              { num: 4, label: 'Timeline' },
              { num: 5, label: 'Checkout' },
            ].map(s => (
              <button
                key={s.num}
                onClick={() => {
                  if (s.num < step) setStep(s.num)
                }}
                disabled={s.num > step && !canGoNext}
                className="z-10 flex flex-col items-center cursor-pointer disabled:cursor-not-allowed group focus:outline-none"
              >
                <span
                  className={[
                    'w-8 h-8 rounded-full flex items-center justify-center font-body text-[10px] font-bold transition-all duration-300',
                    step === s.num
                      ? 'bg-caramel-500 text-brown-900 scale-110 shadow-lg shadow-caramel-500/20'
                      : step > s.num
                        ? 'bg-brown-800 text-caramel-400'
                        : 'bg-brown-950 text-stone-500',
                  ].join(' ')}
                >
                  {s.num}
                </span>
                <span
                  className={[
                    'text-[8px] tracking-widest font-semibold uppercase mt-2 hidden sm:block',
                    step === s.num ? 'text-caramel-400 font-bold' : 'text-stone-500',
                  ].join(' ')}
                >
                  {s.label}
                </span>
              </button>
            ))}
          </div>

          {/* Form Wizard Outer Wrapper — Flat panel, borderless */}
          <form onSubmit={handleSubmit} className="bg-brown-950/40 p-8 md:p-12 shadow-2xl flex flex-col gap-8">

            {/* STEP 1: Design and Fabric Selection */}
            {step === 1 && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                <h2 className="text-heading-md text-cream-200 mb-6">
                  Step 1: Choose Design & Specifications
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Select Predefined Design */}
                  <div>
                    <label className={labelClasses}>Select Design from Catalogue</label>
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
                      style={{ height: '50px' }}
                    >
                      {DESIGNS_LIST.map(d => (
                        <option key={d.slug} value={d.slug}>
                          {d.name}
                        </option>
                      ))}
                      <option value="custom">★ Upload Custom Reference Design</option>
                    </select>

                    {/* Predefined Thumbnail Display — Borderless */}
                    {!isCustomUpload && activeDesign && (
                      <div className="mt-4 relative h-80 w-full bg-brown-950/40">
                        <Image
                          src={activeDesign.image}
                          alt={activeDesign.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    {/* Custom File Upload Uploader — Flat panel */}
                    {isCustomUpload && (
                      <div className="mt-4 flex flex-col gap-4">
                        <label className={labelClasses}>Upload Reference Image</label>
                        <div className="relative p-8 text-center cursor-pointer bg-brown-950/40 hover:bg-brown-950/60 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          {customFilePreview ? (
                            <div className="relative h-32 w-full">
                              <Image
                                src={customFilePreview}
                                alt="Custom Reference Upload"
                                fill
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1"
                                stroke="currentColor"
                                className="w-8 h-8 text-stone-500"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                                />
                              </svg>
                              <span className="text-[10px] text-stone-400 tracking-wider uppercase font-semibold">
                                Drag & Drop or Click to Upload
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Fabric & Colour Selectors */}
                  <div className="flex flex-col gap-6">
                    {/* Fabric */}
                    <div>
                      <label className={labelClasses}>Selected Fabric Quality</label>
                      <div className="flex flex-col gap-2" style={{ marginTop: "10px" }}>
                        {activeDesign.fabrics.map(fabric => (
                          <button
                            key={fabric}
                            type="button"
                            onClick={() => setSelectedFabric(fabric)}
                            className={[
                              'px-4 text-[10px] tracking-widest font-semibold uppercase text-left transition-all duration-300 cursor-pointer select-none rounded-none border-0 outline-none',
                              selectedFabric === fabric
                                ? 'bg-caramel-500 text-brown-900 font-bold'
                                : 'bg-brown-950/60 text-stone-300 hover:bg-brown-950/80 hover:text-cream-100',
                            ].join(' ')}
                            style={{ height: '50px', padding: "0 12px" }}
                          >
                            {fabric}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Colour */}
                    <div>
                      <label className={labelClasses} style={{ marginBottom: "10px" }}>Selected Colour Preference</label>
                      <select
                        value={selectedColor}
                        onChange={e => setSelectedColor(e.target.value)}
                        className={inputClasses}
                        style={{ height: '50px' }}
                      >
                        {activeDesign.colors.map(color => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Size & Measurements */}
            {step === 2 && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                <h2 className="text-heading-md text-cream-200 mb-6">
                  Step 2: Custom Body Measurements
                </h2>

                {/* Measurement Unit Selector — Borderless flat */}
                <div className="flex items-center justify-end gap-3 -mb-3">
                  <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                    Measurement Unit:
                  </span>
                  <div className="flex gap-2 bg-brown-950/40 p-1">
                    {['inches', 'cm'].map(unit => (
                      <button
                        key={unit}
                        type="button"
                        onClick={() => setMeasurementUnit(unit as 'inches' | 'cm')}
                        className={[
                          'px-3 py-1.5 text-[8px] uppercase tracking-widest font-semibold cursor-pointer transition-colors duration-200 select-none border-0 outline-none',
                          measurementUnit === unit
                            ? 'bg-caramel-500 text-brown-900 font-bold'
                            : 'bg-transparent text-stone-400 hover:text-cream-100',
                        ].join(' ')}
                      >
                        {unit}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Form Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { field: 'neck', label: '1. Neck Size' },
                      { field: 'shoulder', label: '2. Shoulder Width' },
                      { field: 'chest', label: '3. Chest Circumference' },
                      { field: 'sleeve', label: '4. Sleeve Length' },
                      { field: 'shirtLength', label: '5. Shirt/Kaftan Length' },
                      { field: 'waist', label: '6. Waist circumference' },
                      { field: 'hip', label: '7. Hips Circumference' },
                      { field: 'trouserLength', label: '8. Trouser Length' },
                    ].map(item => (
                      <div key={item.field}>
                        <label className={labelClasses}>{item.label}</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={measurements[item.field as keyof typeof measurements]}
                            onChange={e => handleMeasurementChange(item.field, e.target.value)}
                            onFocus={() => setFocusedField(item.field)}
                            onBlur={() => setFocusedField('')}
                            placeholder="0.0"
                            className={inputClasses}
                            style={{ height: '50px', padding: '0px 10px' }}
                            required
                          />
                          <span className="absolute inset-y-0 right-3 flex items-center text-[8px] text-stone-500 uppercase tracking-widest font-semibold pointer-events-none">
                            {measurementUnit === 'inches' ? 'in' : 'cm'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Right Column: Visual Mannequin SVG diagram — Borderless */}
                  <div>
                    <label className={labelClasses}>Illustrative Helper Guide</label>
                    <BodyDiagram activeField={focusedField} />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Personal details */}
            {step === 3 && (
              <div className="flex flex-col gap-8 animate-fadeIn" style={{ padding: "12px 25px" }}>
                <h2 className="text-heading-md text-cream-200 mb-6" style={{}}>
                  Step 3: Personal & Delivery Details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Full Name</label>
                    <input
                      type="text"
                      value={personalDetails.fullName}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Samuelson Anaele"
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input
                      type="email"
                      value={personalDetails.email}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="client@stitches.com"
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className={labelClasses}>WhatsApp Phone Number</label>
                    <input
                      type="tel"
                      value={personalDetails.phone}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+39 333 444 555"
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                      required
                    />
                  </div>

                  {/* Street Address */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Delivery Address</label>
                    <input
                      type="text"
                      value={personalDetails.address}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Via Pallone, 12"
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                      required
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label className={labelClasses}>City</label>
                    <input
                      type="text"
                      value={personalDetails.city}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="Verona"
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                      required
                    />
                  </div>

                  {/* Postcode */}
                  <div>
                    <label className={labelClasses}>Postcode / ZIP</label>
                    <input
                      type="text"
                      value={personalDetails.postcode}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, postcode: e.target.value }))}
                      placeholder="37121"
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                      required
                    />
                  </div>

                  {/* Country Selector */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Country</label>
                    <select
                      value={personalDetails.country}
                      onChange={e => setPersonalDetails(prev => ({ ...prev, country: e.target.value }))}
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                    >
                      <option value="Italy">Italy</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Ireland">Ireland</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Timeline & Occasion Details */}
            {step === 4 && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                <h2 className="text-heading-md text-cream-200 mb-6">
                  Step 4: Occasion & Timeline
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Occasion Selection */}
                  <div>
                    <label className={labelClasses}>Event/Occasion Type</label>
                    <select
                      value={occasion}
                      onChange={e => setOccasion(e.target.value)}
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                    >
                      <option value="Wedding">Wedding / Groom</option>
                      <option value="Corporate Event">Corporate / Black-tie Dinner</option>
                      <option value="Traditional Celebration">Traditional Igbo/Yoruba Ceremony</option>
                      <option value="Birthday">Birthday Celebration</option>
                      <option value="Everyday Wear">Everyday Elegant Wear</option>
                    </select>
                  </div>

                  {/* Deadline Datepicker */}
                  <div>
                    <label className={labelClasses}>Requested Delivery Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className={inputClasses}
                      style={{ height: '50px', padding: "0px 10px" }}
                      required
                    />
                  </div>

                  {/* Turnaround Warning Alert Box */}
                  {deadlineWarningMessage && (
                    <div className="md:col-span-2 p-4 bg-red-950/20 border border-red-900/50 flex items-start gap-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-5 h-5 text-red-500 shrink-0 mt-0.5"
                      >
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <span className="block text-[10px] text-red-400 font-semibold uppercase tracking-wider">Timeline Alert</span>
                        <span className="text-red-200 text-xs font-semibold">{deadlineWarningMessage}</span>
                      </div>
                    </div>
                  )}

                  {/* Special Customization Notes */}
                  <div className="md:col-span-2">
                    <label className={labelClasses}>Special Tailoring Instructions / Notes</label>
                    <textarea
                      value={specialNotes}
                      onChange={e => setSpecialNotes(e.target.value)}
                      placeholder="E.g., I want an extra inner pocket inside the coat; pants should have belt loops; include custom chest embroidery details."
                      className={[inputClasses, 'resize-none py-4'].join(' ')}
                      style={{ height: '140px', padding: "0px 10px" }}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: Order Summary & Deposit Checkout */}
            {step === 5 && (
              <div className="flex flex-col gap-8 animate-fadeIn">
                <h2 className="text-heading-md text-cream-200 mb-6">
                  Step 5: Review & Pay 50% Deposit
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Left: Specs review summary card */}
                  <div className="md:col-span-2 flex flex-col gap-6">
                    {/* Design Specs summary — Flat, borderless */}
                    <div className="p-6 bg-brown-950/40 flex flex-col gap-3">
                      <h3 className="text-label text-caramel-400 font-bold mb-2">1. Design Specifications</h3>
                      <div className="flex items-center gap-4">
                        {!isCustomUpload && activeDesign && (
                          <div className="relative h-20 w-20 bg-brown-950">
                            <Image
                              src={activeDesign.image}
                              alt={activeDesign.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <span className="block font-display text-base font-semibold text-cream-200">{activeDesign.name}</span>
                          <span className="block text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                            Fabric: {selectedFabric}
                          </span>
                          <span className="block text-[10px] text-stone-400 uppercase tracking-widest mt-0.5">
                            Colour: {selectedColor}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Measurements review — Flat, borderless */}
                    <div className="p-6 bg-brown-950/40 flex flex-col gap-3">
                      <h3 className="text-label text-caramel-400 font-bold mb-2">2. Sizes ({measurementUnit})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {Object.entries(measurements).map(([field, val]) => (
                          <div key={field} className="pb-2">
                            <span className="block text-[8px] text-stone-500 uppercase tracking-widest">{field}</span>
                            <span className="text-cream-200 text-xs font-semibold">{val} {measurementUnit === 'inches' ? 'in' : 'cm'}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Details — Flat, borderless */}
                    <div className="p-6 bg-brown-950/40 flex flex-col gap-3">
                      <h3 className="text-label text-caramel-400 font-bold mb-2">3. Personal & Event Details</h3>
                      <div className="flex flex-col gap-2 font-body text-xs text-stone-300">
                        <p><strong className="text-cream-200">Client:</strong> {personalDetails.fullName} ({personalDetails.email})</p>
                        <p><strong className="text-cream-200">WhatsApp:</strong> {personalDetails.phone}</p>
                        <p><strong className="text-cream-200">Ship To:</strong> {personalDetails.address}, {personalDetails.city}, {personalDetails.postcode}, {personalDetails.country}</p>
                        <p><strong className="text-cream-200">Occasion:</strong> {occasion} (Target: {new Date(deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })})</p>
                      </div>
                    </div>
                  </div>

                  {/* Right: Deposit Billing summary — Flat panel, matched style */}
                  <div className="p-8 bg-brown-950/40 flex flex-col justify-between h-fit gap-6">
                    <div>
                      <h3 className="text-label text-caramel-400 font-bold mb-4">
                        Order Invoice
                      </h3>
                      <div className="flex flex-col gap-3 font-body text-xs">
                        <div className="flex justify-between text-stone-400">
                          <span>Bespoke Attire:</span>
                          <span className="text-cream-200">
                            €{activeDesign.priceEUR} / ₦{activeDesign.priceNGN.toLocaleString('en-NG')}
                          </span>
                        </div>
                        <div className="flex justify-between text-stone-400">
                          <span>Delivery (DHL):</span>
                          <span className="text-cream-200">FREE</span>
                        </div>
                        <div className="flex justify-between text-stone-400 font-semibold pb-3">
                          <span>Total Amount:</span>
                          <span className="text-cream-200">
                            €{activeDesign.priceEUR} / ₦{activeDesign.priceNGN.toLocaleString('en-NG')}
                          </span>
                        </div>
                        <div className="flex justify-between font-display text-base font-bold text-caramel-400 pt-2">
                          <span>50% Deposit Due:</span>
                          <span>
                            €{(activeDesign.priceEUR / 2).toFixed(0)} / ₦{(activeDesign.priceNGN / 2).toLocaleString('en-NG')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Gateway Toggle — Flat selectors, borderless */}
                    <div className="flex flex-col gap-3">
                      <span className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold">
                        Select Payment Method:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPaymentGateway('stripe')}
                          className={[
                            'text-[9px] uppercase tracking-widest font-bold transition-all cursor-pointer border-0 outline-none select-none rounded-none',
                            paymentGateway === 'stripe'
                              ? 'bg-cream-100 text-brown-900'
                              : 'bg-brown-950/40 text-stone-400 hover:bg-brown-950/60 hover:text-stone-300',
                          ].join(' ')}
                          style={{ height: '50px' }}
                        >
                          Stripe (Euro)
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentGateway('paystack')}
                          className={[
                            'text-[9px] uppercase tracking-widest font-bold transition-all cursor-pointer border-0 outline-none select-none rounded-none',
                            paymentGateway === 'paystack'
                              ? 'bg-cream-100 text-brown-900'
                              : 'bg-brown-950/40 text-stone-400 hover:bg-brown-950/60 hover:text-stone-300',
                          ].join(' ')}
                          style={{ height: '50px' }}
                        >
                          Paystack (₦)
                        </button>
                      </div>
                      <p className="text-[8px] text-stone-500 uppercase tracking-wider text-center leading-relaxed">
                        Secure connection encrypted with 256-bit SSL certificate.
                      </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                      className="mt-2"
                      style={{ padding: "12px 5px" }}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2 justify-center">
                          <span className="w-3 h-3 border-2 border-brown-900 border-t-transparent rounded-full animate-spin" />
                          Processing Payment...
                        </span>
                      ) : (
                        `Pay Deposit (50%)`
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Buttons (Prev / Next) — Faint separator */}
            <div className="flex items-center justify-between border-t border-brown-900/40 pt-6 mt-10">
              <button
                type="button"
                onClick={() => setStep(s => Math.max(1, s - 1))}
                disabled={step === 1 || isSubmitting}
                className="px-6 py-3 text-[10px] tracking-widest font-semibold uppercase bg-brown-950/40 text-stone-300 hover:bg-brown-950/60 hover:text-cream-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none cursor-pointer border-0 rounded-none outline-none"
                style={{ padding: "12px 24px" }}
              >
                Back
              </button>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(5, s + 1))}
                  disabled={!canGoNext}
                  className="px-6 py-3 text-[10px] tracking-widest font-semibold uppercase bg-caramel-500 text-brown-900 hover:bg-caramel-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed select-none cursor-pointer font-bold border-0 rounded-none outline-none"
                  style={{ padding: "12px 24px" }}
                >
                  Continue
                </button>
              ) : null}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </>
  )
}

export default function OrderFormPage() {
  return (
    <Suspense fallback={
      <div className="bg-brown-900 min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <OrderFormContent />
    </Suspense>
  )
}
