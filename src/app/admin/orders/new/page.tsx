'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
    AdminOrder,
    CustomerProfile,
    Location,
    Currency,
    MeasurementProfile,
    CUSTOMERS_DIRECTORY,
    TAILORS_ROSTER,
    getAllOrders,
    updateOrder,
} from '@/data/adminOrdersData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
)

const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: '#8A7A6E', flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
)

const IconCheck = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><polyline points="20 6 9 17 4 12" /></svg>
)

const IconWhatsApp = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /></svg>
)

const IconUploadCloud = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', flexShrink: 0, color: '#C4975A' }}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
)

// Catalogue designs list
const CATALOGUE_DESIGNS = [
    {
        id: 'cat-1',
        name: 'Grand Agbada',
        category: 'Native Wear',
        priceNGN: 120000,
        priceEUR: 68,
        image: '/images/design-agbada.jpg',
        defaultFabrics: ['Imperial Royal Guinea Brocade', 'Swiss Voile Damask', 'Aso Oke Silk Accent'],
        defaultColours: ['Obsidian Black & Gold', 'Emerald & Champagne', 'Midnight Navy', 'Pure White'],
    },
    {
        id: 'cat-2',
        name: 'Classic Senator',
        category: 'Native Wear',
        priceNGN: 85000,
        priceEUR: 47,
        image: '/images/design-senator.jpg',
        defaultFabrics: ['Super 140s Wool Linen', 'Cashmere Cotton Blend', 'Italian Lightweight Crepe'],
        defaultColours: ['Charcoal Grey with Burgundy Trim', 'Jet Black', 'Deep Navy', 'Warm Olive'],
    },
    {
        id: 'cat-3',
        name: 'Italian 3-Piece Suit',
        category: 'English Suits',
        priceNGN: 160000,
        priceEUR: 90,
        image: '/images/design-suit.jpg',
        defaultFabrics: ['Super 150s Merino Wool (Biella)', 'Tropical Wool 130s', 'Herringbone Tweed'],
        defaultColours: ['Midnight Navy Pinstripe', 'Slate Grey', 'Classic Black', 'Espresso Brown'],
    },
    {
        id: 'cat-4',
        name: 'Kaftan Royale',
        category: 'Native Wear',
        priceNGN: 75000,
        priceEUR: 42,
        image: '/images/design-kaftan.jpg',
        defaultFabrics: ['Cashmere Wool Blend', 'High-twist Egyptian Cotton', 'Polished Linen'],
        defaultColours: ['Emerald Green & Bronze', 'Burgundy Wine', 'Sand Stone', 'Ivory'],
    },
    {
        id: 'cat-5',
        name: 'Double-Breasted Executive Suit',
        category: 'English Suits',
        priceNGN: 195000,
        priceEUR: 110,
        image: '/images/design-suit.jpg',
        defaultFabrics: ['Vitale Barberis Canonico Super 160s', 'Worsted Wool Flannel', 'Silk-Wool Blend'],
        defaultColours: ['Rich Cocoa Brown', 'Chalkstripe Navy', 'Anthracite Charcoal'],
    },
]

const STEPS = [
    { num: 1, title: 'Customer' },
    { num: 2, title: 'Design' },
    { num: 3, title: 'Measurements' },
    { num: 4, title: 'Order Details' },
    { num: 5, title: 'Pricing & Payment' },
    { num: 6, title: 'Review & Confirm' },
]

export default function CreateOrderPage() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)

    // ─── Step 1: Customer State ───────────────────────────────────────────────
    const [customerSearch, setCustomerSearch] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null)
    const [isNewCustomer, setIsNewCustomer] = useState(false)
    const [newCustomer, setNewCustomer] = useState({
        name: '',
        phone: '',
        whatsapp: '',
        email: '',
        location: 'Italy' as Location,
        address: '',
        language: 'English' as 'English' | 'Italian',
        currency: 'EUR' as Currency,
    })

    // ─── Step 2: Design State ─────────────────────────────────────────────────
    const [designType, setDesignType] = useState<'catalogue' | 'custom'>('catalogue')
    const [selectedDesign, setSelectedDesign] = useState(CATALOGUE_DESIGNS[0])
    const [customDesign, setCustomDesign] = useState({
        name: '',
        category: 'Custom Commission',
        image: '/images/design-agbada.jpg',
        fabric: '',
        colour: '',
        specialInstructions: '',
    })
    const [fabricChoice, setFabricChoice] = useState(CATALOGUE_DESIGNS[0].defaultFabrics[0])
    const [colourChoice, setColourChoice] = useState(CATALOGUE_DESIGNS[0].defaultColours[0])
    const [specialInstructions, setSpecialInstructions] = useState('')

    // ─── Step 3: Measurements State ───────────────────────────────────────────
    const [measurements, setMeasurements] = useState<MeasurementProfile>({
        chest: 40,
        shoulder: 18,
        sleeve: 25,
        waist: 34,
        hips: 40,
        inseam: 32,
        neck: 16,
        length: 42,
        unit: 'inches',
        fitNotes: '',
    })
    const [saveToProfile, setSaveToProfile] = useState(true)

    // ─── Step 4: Order Details State ──────────────────────────────────────────
    const [occasion, setOccasion] = useState('Wedding Celebration')
    const [deadline, setDeadline] = useState('2026-06-25')
    const [deliveryLocation, setDeliveryLocation] = useState<Location>('Italy')
    const [fullAddress, setFullAddress] = useState('')
    const [currency, setCurrency] = useState<Currency>('EUR')
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('2026-06-22')
    const [customerNotes, setCustomerNotes] = useState('')
    const [assignedTailor, setAssignedTailor] = useState(TAILORS_ROSTER[0].name)

    // ─── Step 5: Pricing & Payment State ──────────────────────────────────────
    const [totalAmount, setTotalAmount] = useState(68)
    const [depositAmount, setDepositAmount] = useState(34)
    const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'Paystack' | 'Manual Bank Transfer' | 'Cash'>('Stripe')
    const [markDepositAsPaid, setMarkDepositAsPaid] = useState(false)

    // Autocomplete customers search
    const filteredCustomers = useMemo(() => {
        if (!customerSearch.trim()) return []
        const q = customerSearch.toLowerCase()
        return CUSTOMERS_DIRECTORY.filter(
            (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.email.toLowerCase().includes(q)
        )
    }, [customerSearch])

    // Select existing customer
    const handleSelectCustomer = (customer: CustomerProfile) => {
        setSelectedCustomer(customer)
        setIsNewCustomer(false)
        setFullAddress(customer.address)
        setDeliveryLocation(customer.location)
        setCurrency(customer.currency)
        setMeasurements({ ...customer.savedMeasurements })
        setCustomerSearch('')

        // Adjust prices if currency switched
        if (customer.currency === 'NGN') {
            setTotalAmount(selectedDesign.priceNGN)
            setDepositAmount(Math.round(selectedDesign.priceNGN / 2))
            setPaymentMethod('Paystack')
        } else {
            setTotalAmount(selectedDesign.priceEUR)
            setDepositAmount(Math.round(selectedDesign.priceEUR / 2))
            setPaymentMethod('Stripe')
        }
    }

    // Select design helper
    const handleSelectDesign = (item: typeof CATALOGUE_DESIGNS[0]) => {
        setSelectedDesign(item)
        setFabricChoice(item.defaultFabrics[0])
        setColourChoice(item.defaultColours[0])
        const total = currency === 'EUR' ? item.priceEUR : item.priceNGN
        setTotalAmount(total)
        setDepositAmount(Math.round(total / 2))
    }

    // Submit and create order
    const handleCreateOrder = () => {
        const existingOrders = getAllOrders()
        const nextNumber = `CS-00${92 + existingOrders.length}`
        const newId = String(Date.now())

        const activeCustomer: CustomerProfile = isNewCustomer
            ? {
                  id: `cust-${Date.now()}`,
                  name: newCustomer.name,
                  phone: newCustomer.phone,
                  whatsapp: newCustomer.whatsapp,
                  email: newCustomer.email,
                  location: newCustomer.location,
                  address: fullAddress || newCustomer.address,
                  language: newCustomer.language,
                  currency: newCustomer.currency,
                  savedMeasurements: measurements,
                  totalOrders: 1,
              }
            : selectedCustomer || CUSTOMERS_DIRECTORY[0]

        const createdOrder: AdminOrder = {
            id: newId,
            orderNumber: nextNumber,
            createdAt: new Date().toISOString(),
            status: markDepositAsPaid ? 'CONFIRMED' : 'NEW',
            isOverdue: false,
            tailorAssigned: assignedTailor,
            customer: activeCustomer,
            design: {
                id: designType === 'catalogue' ? selectedDesign.id : 'custom-design',
                name: designType === 'catalogue' ? selectedDesign.name : customDesign.name || 'Custom Bespoke Creation',
                category: designType === 'catalogue' ? selectedDesign.category : 'Bespoke Custom',
                image: designType === 'catalogue' ? selectedDesign.image : customDesign.image,
                isCustom: designType === 'custom',
                fabric: designType === 'catalogue' ? fabricChoice : customDesign.fabric,
                colour: designType === 'catalogue' ? colourChoice : customDesign.colour,
                specialInstructions: specialInstructions || customDesign.specialInstructions,
            },
            measurements: measurements,
            details: {
                occasion: occasion,
                deadline: deadline,
                deliveryLocation: deliveryLocation,
                fullAddress: fullAddress,
                currency: currency,
                estimatedDeliveryDate: estimatedDeliveryDate,
                additionalNotes: customerNotes,
            },
            payment: {
                totalNGN: currency === 'NGN' ? totalAmount : totalAmount * 1750,
                totalEUR: currency === 'EUR' ? totalAmount : Math.round(totalAmount / 1750),
                depositAmount: depositAmount,
                depositStatus: markDepositAsPaid ? 'PAID' : 'UNPAID',
                depositPaidDate: markDepositAsPaid ? 'Just now' : undefined,
                balanceAmount: totalAmount - depositAmount,
                balanceStatus: 'UNPAID',
                gateway: paymentMethod,
                referenceNumber: `CS-MANUAL-${Math.floor(100000 + Math.random() * 900000)}`,
                balancePaymentLink: `https://pay.captainstitches.com/pay/${nextNumber.toLowerCase()}`,
            },
            inspection: {
                photos: [],
                notes: 'Awaiting pattern cutting bench slot.',
                isApproved: false,
            },
            adminNotes: [
                {
                    id: `an-${Date.now()}`,
                    author: 'Samuelson',
                    text: `Manually created order commissioned via WhatsApp consultation.`,
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                },
            ],
            notifications: [
                {
                    id: `notif-${Date.now()}`,
                    event: 'Manual Order Created',
                    channel: 'WhatsApp',
                    timestamp: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    details: `Confirmation sent to ${activeCustomer.whatsapp} with tracking ref ${nextNumber}.`,
                },
            ],
        }

        updateOrder(createdOrder)

        // Generate WhatsApp link confirmation
        const cleanPhone = activeCustomer.whatsapp.replace(/[^0-9]/g, '')
        const msg = encodeURIComponent(
            `Hello ${activeCustomer.name}, your CaptainStitches bespoke order #${nextNumber} has been logged in our atelier! Estimated completion: ${estimatedDeliveryDate}. Tracking reference: https://captainstitches.com/orders/track?ref=${nextNumber}. Thank you!`
        )
        window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')

        router.push(`/admin/orders/${newId}`)
    }

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%', maxWidth: '1080px', margin: '0 auto' }}>
            {/* Top Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Link
                    href="/admin/orders"
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        color: '#8A7A6E',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                    }}
                >
                    <IconArrowLeft />
                    <span>Back to Orders Board</span>
                </Link>

                <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                    Manual WhatsApp Commission Flow
                </div>
            </div>

            {/* Page Title */}
            <div>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1C0F07', margin: 0, letterSpacing: '-0.02em' }}>
                    Create Manual Order
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                    Log orders commissioned directly via WhatsApp, Milan studio meetings, or telephone consultations.
                </p>
            </div>

            {/* ─── Stepper Tabs Bar ─────────────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '0.75rem 1rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    overflowX: 'auto',
                    gap: '0.5rem',
                }}
            >
                {STEPS.map((s) => {
                    const isActive = currentStep === s.num
                    const isCompleted = currentStep > s.num

                    return (
                        <button
                            key={s.num}
                            type="button"
                            onClick={() => setCurrentStep(s.num)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 0.85rem',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                                backgroundColor: isActive ? '#FDF3E7' : 'transparent',
                                color: isActive ? '#C4975A' : isCompleted ? '#166534' : '#8A7A6E',
                                fontWeight: isActive || isCompleted ? 700 : 500,
                                fontSize: '0.8125rem',
                                whiteSpace: 'nowrap',
                            }}
                        >
                            <span
                                style={{
                                    width: '22px',
                                    height: '22px',
                                    borderRadius: '9999px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '0.75rem',
                                    fontWeight: 800,
                                    backgroundColor: isActive ? '#C4975A' : isCompleted ? '#DCFCE7' : '#F3EFE9',
                                    color: isActive ? '#FFFFFF' : isCompleted ? '#166534' : '#8A7A6E',
                                }}
                            >
                                {isCompleted ? '✓' : s.num}
                            </span>
                            <span>{s.title}</span>
                        </button>
                    )
                })}
            </div>

            {/* ─── Step Content Container ──────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    padding: '2rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                }}
            >
                {/* ── STEP 1: CUSTOMER ───────────────────────────────────────────────── */}
                {currentStep === 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Step 1: Customer Selection
                            </h2>
                            <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                Find an existing customer with saved measurements or create a new client profile.
                            </p>
                        </div>

                        {/* Search or Create Toggle */}
                        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #F3EFE9', paddingBottom: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setIsNewCustomer(false)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: !isNewCustomer ? '#C4975A' : '#E5DFD7',
                                    backgroundColor: !isNewCustomer ? '#FDF3E7' : '#FFFFFF',
                                    color: !isNewCustomer ? '#C4975A' : '#6E5D4F',
                                    fontWeight: 700,
                                    fontSize: '0.825rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Search Existing Customer
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsNewCustomer(true)
                                    setSelectedCustomer(null)
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '8px',
                                    border: '1px solid',
                                    borderColor: isNewCustomer ? '#C4975A' : '#E5DFD7',
                                    backgroundColor: isNewCustomer ? '#FDF3E7' : '#FFFFFF',
                                    color: isNewCustomer ? '#C4975A' : '#6E5D4F',
                                    fontWeight: 700,
                                    fontSize: '0.825rem',
                                    cursor: 'pointer',
                                }}
                            >
                                + Create New Customer
                            </button>
                        </div>

                        {!isNewCustomer ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {/* Search input */}
                                <div style={{ position: 'relative' }}>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.65rem',
                                            backgroundColor: '#FAF7F2',
                                            border: '1px solid #E5DFD7',
                                            borderRadius: '10px',
                                            padding: '0.65rem 1rem',
                                        }}
                                    >
                                        <IconSearch />
                                        <input
                                            type="text"
                                            placeholder="Type customer name, phone, or email..."
                                            value={customerSearch}
                                            onChange={(e) => setCustomerSearch(e.target.value)}
                                            style={{
                                                border: 'none',
                                                outline: 'none',
                                                backgroundColor: 'transparent',
                                                fontSize: '0.875rem',
                                                color: '#1C0F07',
                                                width: '100%',
                                            }}
                                        />
                                    </div>

                                    {/* Autocomplete dropdown */}
                                    {filteredCustomers.length > 0 && (
                                        <div
                                            style={{
                                                position: 'absolute',
                                                top: '105%',
                                                left: 0,
                                                right: 0,
                                                backgroundColor: '#FFFFFF',
                                                border: '1px solid #EDE8E1',
                                                borderRadius: '10px',
                                                boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
                                                maxHeight: '220px',
                                                overflowY: 'auto',
                                                zIndex: 20,
                                            }}
                                        >
                                            {filteredCustomers.map((c) => (
                                                <div
                                                    key={c.id}
                                                    onClick={() => handleSelectCustomer(c)}
                                                    style={{
                                                        padding: '0.75rem 1rem',
                                                        borderBottom: '1px solid #F3EFE9',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        justifyContent: 'space-between',
                                                        alignItems: 'center',
                                                    }}
                                                >
                                                    <div>
                                                        <div style={{ fontWeight: 700, fontSize: '0.875rem', color: '#1C0F07' }}>{c.name}</div>
                                                        <div style={{ fontSize: '0.75rem', color: '#8A7A6E' }}>{c.whatsapp} • {c.email}</div>
                                                    </div>
                                                    <span style={{ fontSize: '0.75rem', color: '#C4975A', fontWeight: 600 }}>
                                                        Select Customer →
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Currently Selected Customer card */}
                                {selectedCustomer ? (
                                    <div
                                        style={{
                                            backgroundColor: '#FDF3E7',
                                            border: '1px solid #EAD8C3',
                                            borderRadius: '12px',
                                            padding: '1.25rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#1C0F07' }}>
                                                    {selectedCustomer.name}
                                                </span>
                                                <span style={{ fontSize: '0.7rem', fontWeight: 700, backgroundColor: '#FFFFFF', padding: '0.15rem 0.45rem', borderRadius: '4px', color: '#C4975A' }}>
                                                    {selectedCustomer.location === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                                </span>
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#6E5D4F', marginTop: '0.35rem' }}>
                                                WhatsApp: {selectedCustomer.whatsapp} • Email: {selectedCustomer.email}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.2rem' }}>
                                                Address: {selectedCustomer.address}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setSelectedCustomer(null)}
                                            style={{
                                                border: 'none',
                                                background: 'transparent',
                                                color: '#A8998C',
                                                fontSize: '0.8rem',
                                                cursor: 'pointer',
                                                textDecoration: 'underline',
                                            }}
                                        >
                                            Change
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ fontSize: '0.8rem', color: '#8A7A6E', fontStyle: 'italic' }}>
                                        Or pick from quick recent contacts below:
                                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            {CUSTOMERS_DIRECTORY.slice(0, 4).map((c) => (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => handleSelectCustomer(c)}
                                                    style={{
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #E5DFD7',
                                                        backgroundColor: '#FAF7F2',
                                                        fontSize: '0.78rem',
                                                        color: '#1C0F07',
                                                        cursor: 'pointer',
                                                    }}
                                                >
                                                    {c.name} ({c.location})
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Create New Customer Inline Form */
                            <div
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(2, 1fr)',
                                    gap: '1rem',
                                    backgroundColor: '#FAF7F2',
                                    padding: '1.25rem',
                                    borderRadius: '12px',
                                    border: '1px solid #EAE3D9',
                                }}
                            >
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Customer Full Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Babatunde Lawal"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>WhatsApp Phone Number *</label>
                                    <input
                                        type="text"
                                        placeholder="+39 347 000 0000 or +234 803 000 0000"
                                        value={newCustomer.whatsapp}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, whatsapp: e.target.value, phone: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="client@gmail.com"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Location & Currency</label>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <select
                                            value={newCustomer.location}
                                            onChange={(e) => {
                                                const loc = e.target.value as Location
                                                const curr = loc === 'Italy' ? 'EUR' : 'NGN'
                                                setDeliveryLocation(loc)
                                                setCurrency(curr)
                                                setNewCustomer({ ...newCustomer, location: loc, currency: curr })
                                            }}
                                            style={{ flex: 1, padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                        >
                                            <option value="Italy">🇮🇹 Italy (EUR)</option>
                                            <option value="Nigeria">🇳🇬 Nigeria (NGN)</option>
                                        </select>
                                    </div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Delivery Address</label>
                                    <input
                                        type="text"
                                        placeholder="Full street address, city, postcode"
                                        value={fullAddress}
                                        onChange={(e) => setFullAddress(e.target.value)}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 2: DESIGN ─────────────────────────────────────────────────── */}
                {currentStep === 2 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Step 2: Garment Design
                            </h2>
                            <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                Select an outfit from the CaptainStitches catalogue or upload a custom WhatsApp reference image.
                            </p>
                        </div>

                        {/* Catalogue vs Custom tabs */}
                        <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #F3EFE9', paddingBottom: '0.75rem' }}>
                            <button
                                type="button"
                                onClick={() => setDesignType('catalogue')}
                                style={{
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: designType === 'catalogue' ? '#C4975A' : '#F3EFE9',
                                    color: designType === 'catalogue' ? '#FFFFFF' : '#6E5D4F',
                                    fontWeight: 700,
                                    fontSize: '0.8125rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Catalogue Designs
                            </button>
                            <button
                                type="button"
                                onClick={() => setDesignType('custom')}
                                style={{
                                    padding: '0.45rem 0.85rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    backgroundColor: designType === 'custom' ? '#C4975A' : '#F3EFE9',
                                    color: designType === 'custom' ? '#FFFFFF' : '#6E5D4F',
                                    fontWeight: 700,
                                    fontSize: '0.8125rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Custom Reference Design
                            </button>
                        </div>

                        {designType === 'catalogue' ? (
                            <div>
                                {/* Catalogue Grid */}
                                <div
                                    style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                        gap: '1rem',
                                        marginBottom: '1.5rem',
                                    }}
                                >
                                    {CATALOGUE_DESIGNS.map((item) => {
                                        const isSelected = selectedDesign.id === item.id

                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => handleSelectDesign(item)}
                                                style={{
                                                    border: isSelected ? '2px solid #C4975A' : '1px solid #EDE8E1',
                                                    backgroundColor: isSelected ? '#FFFDF9' : '#FFFFFF',
                                                    borderRadius: '12px',
                                                    overflow: 'hidden',
                                                    cursor: 'pointer',
                                                    boxShadow: isSelected ? '0 3px 8px rgba(196,151,90,0.2)' : 'none',
                                                    transition: 'all 0.15s ease',
                                                }}
                                            >
                                                <div style={{ height: '140px', position: 'relative' }}>
                                                    <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                                                    {isSelected && (
                                                        <div
                                                            style={{
                                                                position: 'absolute',
                                                                top: '6px',
                                                                right: '6px',
                                                                backgroundColor: '#C4975A',
                                                                color: '#FFFFFF',
                                                                width: '20px',
                                                                height: '20px',
                                                                borderRadius: '9999px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                            }}
                                                        >
                                                            ✓
                                                        </div>
                                                    )}
                                                </div>
                                                <div style={{ padding: '0.75rem' }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C0F07' }}>{item.name}</div>
                                                    <div style={{ fontSize: '0.78rem', color: '#C4975A', fontWeight: 700, marginTop: '0.2rem' }}>
                                                        {currency === 'EUR' ? `€${item.priceEUR}` : `₦${item.priceNGN.toLocaleString()}`}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>

                                {/* Customizations for chosen design */}
                                <div
                                    style={{
                                        backgroundColor: '#FAF7F2',
                                        padding: '1.25rem',
                                        borderRadius: '12px',
                                        border: '1px solid #EAE3D9',
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(2, 1fr)',
                                        gap: '1rem',
                                    }}
                                >
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                            Fabric Selection
                                        </label>
                                        <select
                                            value={fabricChoice}
                                            onChange={(e) => setFabricChoice(e.target.value)}
                                            style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                        >
                                            {selectedDesign.defaultFabrics.map((f) => (
                                                <option key={f} value={f}>{f}</option>
                                            ))}
                                            <option value="Client Supplied Fabric">Client Supplied Fabric</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                            Colour Palette
                                        </label>
                                        <select
                                            value={colourChoice}
                                            onChange={(e) => setColourChoice(e.target.value)}
                                            style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                        >
                                            {selectedDesign.defaultColours.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                            Special Tailoring Instructions
                                        </label>
                                        <textarea
                                            value={specialInstructions}
                                            onChange={(e) => setSpecialInstructions(e.target.value)}
                                            placeholder="e.g. Extra 2 inches on sleeve cuff, matching cap, hidden zip pocket..."
                                            rows={2}
                                            style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Custom Design Upload */
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: '#FAF7F2', padding: '1.25rem', borderRadius: '12px', border: '1px solid #EAE3D9' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Custom Outfit Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Bespoke Tuxedo with Nigerian Ankara Lapel"
                                        value={customDesign.name}
                                        onChange={(e) => setCustomDesign({ ...customDesign, name: e.target.value })}
                                        style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Fabric</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Scabal Super 180s Wool"
                                            value={customDesign.fabric}
                                            onChange={(e) => setCustomDesign({ ...customDesign, fabric: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Colour Choice</label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Royal Navy & Champagne"
                                            value={customDesign.colour}
                                            onChange={(e) => setCustomDesign({ ...customDesign, colour: e.target.value })}
                                            style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.25rem' }}>Upload Reference Sketch / Photo</label>
                                    <div
                                        style={{
                                            border: '2px dashed #D5CCA8',
                                            borderRadius: '10px',
                                            padding: '1.5rem',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            backgroundColor: '#FFFFFF',
                                        }}
                                    >
                                        <IconUploadCloud />
                                        <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#1C0F07', marginTop: '0.35rem' }}>
                                            Click or drop customer&apos;s WhatsApp image reference
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#8A7A6E' }}>Supports JPG, PNG up to 20MB</div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 3: MEASUREMENTS ────────────────────────────────────────────── */}
                {currentStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Step 3: Measurements
                                </h2>
                                <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                    {selectedCustomer
                                        ? `Auto-filled from ${selectedCustomer.name}'s profile. Modify if recent changes occurred.`
                                        : 'Input client measurements taken via WhatsApp or in person.'}
                                </p>
                            </div>
                            {/* Unit toggle */}
                            <div style={{ display: 'flex', gap: '0.25rem', backgroundColor: '#FAF7F2', padding: '0.25rem', borderRadius: '8px', border: '1px solid #E5DFD7' }}>
                                <button
                                    type="button"
                                    onClick={() => setMeasurements({ ...measurements, unit: 'inches' })}
                                    style={{
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: measurements.unit === 'inches' ? '#C4975A' : 'transparent',
                                        color: measurements.unit === 'inches' ? '#FFFFFF' : '#6E5D4F',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Inches
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setMeasurements({ ...measurements, unit: 'cm' })}
                                    style={{
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '6px',
                                        border: 'none',
                                        backgroundColor: measurements.unit === 'cm' ? '#C4975A' : 'transparent',
                                        color: measurements.unit === 'cm' ? '#FFFFFF' : '#6E5D4F',
                                        fontWeight: 700,
                                        fontSize: '0.75rem',
                                        cursor: 'pointer',
                                    }}
                                >
                                    CM
                                </button>
                            </div>
                        </div>

                        {/* 8 Inputs Grid */}
                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(4, 1fr)',
                                gap: '1rem',
                            }}
                        >
                            {[
                                { key: 'chest', label: 'Chest' },
                                { key: 'shoulder', label: 'Shoulder' },
                                { key: 'sleeve', label: 'Sleeve' },
                                { key: 'waist', label: 'Waist' },
                                { key: 'hips', label: 'Hips' },
                                { key: 'inseam', label: 'Inseam' },
                                { key: 'neck', label: 'Neck' },
                                { key: 'length', label: 'Length' },
                            ].map((field) => (
                                <div key={field.key} style={{ backgroundColor: '#FAF7F2', padding: '0.75rem', borderRadius: '10px', border: '1px solid #EAE3D9' }}>
                                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: '#6E5D4F', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                                        {field.label} ({measurements.unit})
                                    </label>
                                    <input
                                        type="number"
                                        step="0.25"
                                        value={measurements[field.key as keyof MeasurementProfile] as number}
                                        onChange={(e) =>
                                            setMeasurements({
                                                ...measurements,
                                                [field.key]: parseFloat(e.target.value) || 0,
                                            })
                                        }
                                        style={{
                                            width: '100%',
                                            padding: '0.55rem',
                                            borderRadius: '8px',
                                            border: '1px solid #E0D7CB',
                                            fontSize: '1rem',
                                            fontWeight: 800,
                                            color: '#1C0F07',
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                Customer Fit & Body Structure Notes
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Sloped left shoulder, prefers extra room in hips, low rise trousers..."
                                value={measurements.fitNotes}
                                onChange={(e) => setMeasurements({ ...measurements, fitNotes: e.target.value })}
                                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                            />
                        </div>

                        {selectedCustomer && (
                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: '#1C0F07' }}>
                                <input
                                    type="checkbox"
                                    checked={saveToProfile}
                                    onChange={(e) => setSaveToProfile(e.target.checked)}
                                    style={{ width: '16px', height: '16px', accentColor: '#C4975A' }}
                                />
                                <span>Save these updated measurements back to {selectedCustomer.name}&apos;s customer profile</span>
                            </label>
                        )}
                    </div>
                )}

                {/* ── STEP 4: ORDER DETAILS ───────────────────────────────────────────── */}
                {currentStep === 4 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Step 4: Order Logistics & Timeline
                            </h2>
                            <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                Occasion, event deadline, delivery destination, and tailor assignment.
                            </p>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Occasion / Event Name *
                                </label>
                                <input
                                    type="text"
                                    value={occasion}
                                    onChange={(e) => setOccasion(e.target.value)}
                                    placeholder="e.g. Traditional Wedding, Gala Dinner, Corporate Keynote"
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Customer Event Deadline *
                                </label>
                                <input
                                    type="date"
                                    value={deadline}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Delivery Country & Currency
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <select
                                        value={deliveryLocation}
                                        onChange={(e) => {
                                            const loc = e.target.value as Location
                                            setDeliveryLocation(loc)
                                            setCurrency(loc === 'Italy' ? 'EUR' : 'NGN')
                                        }}
                                        style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                    >
                                        <option value="Italy">🇮🇹 Italy (€ EUR)</option>
                                        <option value="Nigeria">🇳🇬 Nigeria (₦ NGN)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Estimated Atelier Completion Date
                                </label>
                                <input
                                    type="date"
                                    value={estimatedDeliveryDate}
                                    onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Full Delivery Address *
                                </label>
                                <input
                                    type="text"
                                    value={fullAddress}
                                    onChange={(e) => setFullAddress(e.target.value)}
                                    placeholder="Street, building, apartment, city, zip code"
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Assigned Atelier Artisan
                                </label>
                                <select
                                    value={assignedTailor}
                                    onChange={(e) => setAssignedTailor(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                >
                                    {TAILORS_ROSTER.map((t) => (
                                        <option key={t.id} value={t.name}>
                                            {t.name} — {t.role} ({t.location})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── STEP 5: PRICING & PAYMENT ──────────────────────────────────────── */}
                {currentStep === 5 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Step 5: Pricing & Payment Setup
                            </h2>
                            <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                Set total price, required deposit (default 50%), and select payment link gateway.
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1.25rem',
                                backgroundColor: '#FAF7F2',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #EAE3D9',
                            }}
                        >
                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Total Order Price ({currency})
                                </label>
                                <input
                                    type="number"
                                    value={totalAmount}
                                    onChange={(e) => {
                                        const tot = parseFloat(e.target.value) || 0
                                        setTotalAmount(tot)
                                        setDepositAmount(Math.round(tot / 2))
                                    }}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '1.1rem', fontWeight: 800, color: '#1C0F07' }}
                                />
                                <span style={{ fontSize: '0.725rem', color: '#8A7A6E', marginTop: '0.2rem', display: 'block' }}>
                                    Base catalogue rate. Editable for bespoke adjustments.
                                </span>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.35rem' }}>
                                    Deposit Amount (50% Required to Start)
                                </label>
                                <input
                                    type="number"
                                    value={depositAmount}
                                    onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '1.1rem', fontWeight: 800, color: '#C4975A' }}
                                />
                                <span style={{ fontSize: '0.725rem', color: '#8A7A6E', marginTop: '0.2rem', display: 'block' }}>
                                    Balance due before dispatch: {currency === 'EUR' ? `€${totalAmount - depositAmount}` : `₦${(totalAmount - depositAmount).toLocaleString()}`}
                                </span>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F', marginBottom: '0.5rem' }}>
                                    Payment Link Method
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
                                    {[
                                        { id: 'Stripe', label: 'Stripe Link (EUR / Intl)' },
                                        { id: 'Paystack', label: 'Paystack Link (NGN / Card)' },
                                        { id: 'Manual Bank Transfer', label: 'Direct Bank Wire' },
                                        { id: 'Cash', label: 'Atelier Cash / POS' },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            type="button"
                                            onClick={() => setPaymentMethod(m.id as any)}
                                            style={{
                                                padding: '0.75rem 0.5rem',
                                                borderRadius: '8px',
                                                border: paymentMethod === m.id ? '2px solid #C4975A' : '1px solid #E0D7CB',
                                                backgroundColor: paymentMethod === m.id ? '#FFFDF9' : '#FFFFFF',
                                                color: '#1C0F07',
                                                fontSize: '0.8rem',
                                                fontWeight: paymentMethod === m.id ? 700 : 500,
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {m.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.825rem', color: '#1C0F07' }}>
                                    <input
                                        type="checkbox"
                                        checked={markDepositAsPaid}
                                        onChange={(e) => setMarkDepositAsPaid(e.target.checked)}
                                        style={{ width: '16px', height: '16px', accentColor: '#166534' }}
                                    />
                                    <span>
                                        Mark deposit as already received (Customer already transferred or paid cash)
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── STEP 6: REVIEW & CONFIRM ───────────────────────────────────────── */}
                {currentStep === 6 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Review & Confirm Commission
                            </h2>
                            <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                Verify all order details before creating the official record and notifying customer via WhatsApp.
                            </p>
                        </div>

                        <div
                            style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(2, 1fr)',
                                gap: '1rem',
                                backgroundColor: '#FAF7F2',
                                padding: '1.5rem',
                                borderRadius: '12px',
                                border: '1px solid #EAE3D9',
                            }}
                        >
                            {/* Customer Summary */}
                            <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #EDE8E1' }}>
                                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase' }}>Customer</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>
                                    {selectedCustomer ? selectedCustomer.name : newCustomer.name || 'Anonymous Client'}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6E5D4F', marginTop: '0.2rem' }}>
                                    WhatsApp: {selectedCustomer ? selectedCustomer.whatsapp : newCustomer.whatsapp}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.2rem' }}>
                                    Delivery: {fullAddress} ({deliveryLocation})
                                </div>
                            </div>

                            {/* Garment Summary */}
                            <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #EDE8E1' }}>
                                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase' }}>Design & Specs</div>
                                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>
                                    {designType === 'catalogue' ? selectedDesign.name : customDesign.name}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#6E5D4F', marginTop: '0.2rem' }}>
                                    Fabric: {designType === 'catalogue' ? fabricChoice : customDesign.fabric}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.2rem' }}>
                                    Colour: {designType === 'catalogue' ? colourChoice : customDesign.colour}
                                </div>
                            </div>

                            {/* Timeline Summary */}
                            <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #EDE8E1' }}>
                                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase' }}>Timeline & Tailor</div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C0F07', marginTop: '0.2rem' }}>
                                    Occasion: {occasion}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#DC2626', fontWeight: 600, marginTop: '0.2rem' }}>
                                    Hard Deadline: {deadline}
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.2rem' }}>
                                    Assigned: {assignedTailor}
                                </div>
                            </div>

                            {/* Payment Summary */}
                            <div style={{ backgroundColor: '#FFFFFF', padding: '1rem', borderRadius: '10px', border: '1px solid #EDE8E1' }}>
                                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: '#C4975A', textTransform: 'uppercase' }}>Payment Breakdown</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1C0F07', marginTop: '0.2rem' }}>
                                    Total: {currency === 'EUR' ? `€${totalAmount}` : `₦${totalAmount.toLocaleString()}`}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: markDepositAsPaid ? '#166534' : '#92600A', fontWeight: 600, marginTop: '0.2rem' }}>
                                    Deposit: {currency === 'EUR' ? `€${depositAmount}` : `₦${depositAmount.toLocaleString()}`} ({markDepositAsPaid ? 'PAID' : 'PENDING'})
                                </div>
                                <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.2rem' }}>
                                    Gateway: {paymentMethod}
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                backgroundColor: '#FDF3E7',
                                border: '1px solid #EAD8C3',
                                padding: '1rem',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                            }}
                        >
                            <IconWhatsApp />
                            <div style={{ fontSize: '0.825rem', color: '#6E5D4F' }}>
                                Clicking <strong>&quot;Submit & Send WhatsApp Confirmation&quot;</strong> will log this order in the active Kanban pipeline and open a pre-filled WhatsApp chat with the customer containing their official order reference number and tracking link.
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Stepper Navigation Buttons ──────────────────────────────────────── */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginTop: '2rem',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid #F3EFE9',
                    }}
                >
                    {currentStep > 1 ? (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep - 1)}
                            style={{
                                padding: '0.625rem 1.25rem',
                                borderRadius: '8px',
                                border: '1px solid #E0D7CB',
                                backgroundColor: '#FAF7F2',
                                color: '#6E5D4F',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                            }}
                        >
                            ← Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep < 6 ? (
                        <button
                            type="button"
                            onClick={() => setCurrentStep(currentStep + 1)}
                            style={{
                                padding: '0.625rem 1.5rem',
                                borderRadius: '8px',
                                border: 'none',
                                backgroundColor: '#C4975A',
                                color: '#FFFFFF',
                                fontSize: '0.85rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                            }}
                        >
                            Continue to Step {currentStep + 1} →
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleCreateOrder}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.75rem',
                                borderRadius: '10px',
                                border: 'none',
                                backgroundColor: '#166534',
                                color: '#FFFFFF',
                                fontSize: '0.9rem',
                                fontWeight: 800,
                                cursor: 'pointer',
                                boxShadow: '0 3px 10px rgba(22,101,52,0.3)',
                            }}
                        >
                            <IconCheck />
                            <span>Create Order & Send WhatsApp Confirmation</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
