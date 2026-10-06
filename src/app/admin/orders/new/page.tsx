'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { getAllDesignsAdminAction } from '@/lib/actions/catalogue'
import {
    getAllCustomersAdminAction,
    updateCustomerMeasurementAction,
    createCustomerAction,
    DbCustomerItem,
} from '@/lib/actions/customers'
import {
    AdminOrder,
    CustomerProfile,
    Location,
    Currency,
    MeasurementProfile,
    TAILORS_ROSTER,
    getAllOrders,
    updateOrder,
} from '@/data/adminOrdersData'
import { createOrderAdminAction } from '@/lib/actions/orders'
import { ColourSelector } from '@/components/common/ColourSelector'
import { parseColour, ATELIER_PALETTE, ColourOption } from '@/lib/utils/colours'

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
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '22px', height: '22px', flexShrink: 0, color: '#C4975A' }}><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /><polyline points="16 16 12 12 8 16" /></svg>
)

const IconLink = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></svg>
)

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0 }}><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
)

const IconPhoto = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '15px', height: '15px', flexShrink: 0 }}><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
)

export interface OrderCatalogueItem {
    id: string
    name: string
    category: string
    priceNGN: number
    priceEUR: number
    image: string
    defaultFabrics: string[]
    defaultColours: Array<ColourOption | string>
}

const DEFAULT_PLACEHOLDER_DESIGN: OrderCatalogueItem = {
    id: 'placeholder',
    name: 'Grand Agbada',
    category: 'Native Wear',
    priceNGN: 120000,
    priceEUR: 68,
    image: '/images/design-agbada.jpg',
    defaultFabrics: ['Imperial Royal Guinea Brocade', 'Swiss Voile Damask', 'Aso Oke Silk Accent'],
    defaultColours: [
        { name: 'Obsidian Black & Gold', hex: '#1C1C1C' },
        { name: 'Emerald & Champagne', hex: '#10B981' },
        { name: 'Midnight Navy', hex: '#0B2240' },
        { name: 'Pure White', hex: '#FFFFFF' },
    ],
}

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

    // ─── Step 1: Customer State (Database-backed) ──────────────────────────────
    const [dbCustomers, setDbCustomers] = useState<DbCustomerItem[]>([])
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true)
    const [customerSearch, setCustomerSearch] = useState('')
    const [selectedCustomer, setSelectedCustomer] = useState<DbCustomerItem | null>(null)
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

    // ─── Step 2: Design State (Database-backed) ────────────────────────────────
    const [catalogueDesigns, setCatalogueDesigns] = useState<OrderCatalogueItem[]>([])
    const [isLoadingDesigns, setIsLoadingDesigns] = useState(true)
    const [designType, setDesignType] = useState<'catalogue' | 'custom'>('catalogue')
    const [selectedDesign, setSelectedDesign] = useState<OrderCatalogueItem | null>(null)
    const [customDesign, setCustomDesign] = useState({
        name: '',
        category: 'Custom Commission',
        image: '',
        fabric: '',
        colour: '',
        specialInstructions: '',
    })
    const [customImageMode, setCustomImageMode] = useState<'upload' | 'url'>('upload')
    const [customImageUrlInput, setCustomImageUrlInput] = useState('')
    const [customImageName, setCustomImageName] = useState('')
    const [isDraggingFile, setIsDraggingFile] = useState(false)
    const [customImageError, setCustomImageError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleCustomImageFile = (file: File) => {
        setCustomImageError(null)
        if (!file.type.startsWith('image/')) {
            setCustomImageError('Please select a valid image file (JPG, PNG, WebP, etc.)')
            return
        }
        const maxBytes = 20 * 1024 * 1024 // 20MB
        if (file.size > maxBytes) {
            setCustomImageError('The image is larger than 20MB. Please select a smaller file.')
            return
        }
        const formattedSize = file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`

        const reader = new FileReader()
        reader.onload = (event) => {
            const result = event.target?.result as string
            if (result) {
                setCustomDesign((prev) => ({ ...prev, image: result }))
                setCustomImageName(`${file.name} (${formattedSize})`)
            }
        }
        reader.onerror = () => {
            setCustomImageError('Failed to read image file. Please try another image.')
        }
        reader.readAsDataURL(file)
    }

    const handleApplyCustomImageUrl = (urlToApply?: string) => {
        const targetUrl = (urlToApply !== undefined ? urlToApply : customImageUrlInput).trim()
        if (!targetUrl) {
            setCustomImageError('Please enter or paste an image URL.')
            return
        }
        if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('data:image/')) {
            setCustomImageError('Please enter a valid URL starting with https://, http://, or data:image/')
            return
        }
        setCustomImageError(null)
        setCustomDesign((prev) => ({ ...prev, image: targetUrl }))
        try {
            const parsed = new URL(targetUrl)
            const parts = parsed.pathname.split('/').filter(Boolean)
            const filename = parts.length > 0 ? parts[parts.length - 1] : parsed.hostname
            setCustomImageName(filename.length > 30 ? `${filename.slice(0, 27)}...` : filename)
        } catch {
            setCustomImageName('External Web Image Reference')
        }
    }

    const handleRemoveCustomImage = () => {
        setCustomDesign((prev) => ({ ...prev, image: '' }))
        setCustomImageName('')
        setCustomImageUrlInput('')
        setCustomImageError(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFile(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFile(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFile(false)
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleCustomImageFile(e.dataTransfer.files[0])
        }
    }

    const handlePasteEvent = (e: React.ClipboardEvent) => {
        const items = e.clipboardData?.items
        if (items) {
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') !== -1) {
                    const file = items[i].getAsFile()
                    if (file) {
                        e.preventDefault()
                        handleCustomImageFile(file)
                        return
                    }
                }
            }
        }
        const text = e.clipboardData.getData('text')?.trim()
        if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
            e.preventDefault()
            setCustomImageUrlInput(text)
            handleApplyCustomImageUrl(text)
        }
    }
    const [fabricChoice, setFabricChoice] = useState('')
    const [colourChoice, setColourChoice] = useState('')
    const [specialInstructions, setSpecialInstructions] = useState('')

    // ─── Load Customers & Designs from PostgreSQL Database ───────────────────
    useEffect(() => {
        let isMounted = true
        const loadInitialData = async () => {
            // Load Customers
            setIsLoadingCustomers(true)
            const custRes = await getAllCustomersAdminAction()
            if (custRes.success && isMounted) {
                setDbCustomers(custRes.customers)
            }
            if (isMounted) setIsLoadingCustomers(false)

            // Load Designs
            setIsLoadingDesigns(true)
            const designRes = await getAllDesignsAdminAction()
            if (designRes.success && designRes.designs && isMounted) {
                const mapped: OrderCatalogueItem[] = designRes.designs.map((d) => ({
                    id: d.id,
                    name: d.contentEN.name,
                    category: d.categoryLabel,
                    priceNGN: d.pricing.priceNGN,
                    priceEUR: d.pricing.priceEUR,
                    image: d.photos.find((p) => p.isCover)?.url || d.photos[0]?.url || '/images/design-agbada.jpg',
                    defaultFabrics: d.fabrics.length ? d.fabrics : ['Imperial Guinea Brocade', 'Swiss Voile Damask'],
                    defaultColours: d.colours && d.colours.length ? d.colours.map((c) => ({ name: c.name, hex: c.hex || '#1C1C1C' })) : [{ name: 'Obsidian Black', hex: '#1C1C1C' }, { name: 'Midnight Navy', hex: '#0B2240' }],
                }))
                setCatalogueDesigns(mapped)
                if (mapped.length > 0) {
                    setSelectedDesign(mapped[0])
                    setFabricChoice(mapped[0].defaultFabrics[0] || '')
                    const initCol = mapped[0].defaultColours[0]
                    setColourChoice(typeof initCol === 'string' ? initCol : initCol?.name || '')
                }
            }
            if (isMounted) setIsLoadingDesigns(false)
        }

        loadInitialData()
        return () => {
            isMounted = false
        }
    }, [])

    // ─── Step 3: Measurements State ───────────────────────────────────────────
    const [measurements, setMeasurements] = useState<MeasurementProfile>({
        chest: 102,
        shoulder: 45,
        sleeve: 62,
        waist: 84,
        hips: 100,
        inseam: 80,
        neck: 40,
        length: 105,
        unit: 'cm',
        fitNotes: '',
    })
    const [saveToProfile, setSaveToProfile] = useState(true)
    const [isSavingMeasurements, setIsSavingMeasurements] = useState(false)
    const [measurementSaveStatus, setMeasurementSaveStatus] = useState<string | null>(null)

    // ─── Step 4: Order Details State ──────────────────────────────────────────
    const [occasion, setOccasion] = useState('Wedding Celebration')
    const [deadline, setDeadline] = useState('2026-06-25')
    const [deliveryLocation, setDeliveryLocation] = useState<Location>('Italy')
    const [fullAddress, setFullAddress] = useState('')
    const [currency, setCurrency] = useState<Currency>('EUR')
    const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('2026-06-22')
    const [customerNotes, setCustomerNotes] = useState('')
    const [assignedTailor, setAssignedTailor] = useState('')

    // ─── Step 5: Pricing & Payment State ──────────────────────────────────────
    const [totalAmount, setTotalAmount] = useState(68)
    const [depositAmount, setDepositAmount] = useState(34)
    const [paymentMethod, setPaymentMethod] = useState<'Stripe' | 'Paystack' | 'Manual Bank Transfer' | 'Cash'>('Stripe')
    const [markDepositAsPaid, setMarkDepositAsPaid] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)

    // Autocomplete customers search against database records
    const filteredCustomers = useMemo(() => {
        if (!customerSearch.trim()) return []
        const q = customerSearch.toLowerCase().trim()
        return dbCustomers.filter(
            (c) =>
                c.name.toLowerCase().includes(q) ||
                c.phone.includes(q) ||
                c.whatsapp.includes(q) ||
                c.email.toLowerCase().includes(q)
        )
    }, [customerSearch, dbCustomers])

    // Select existing customer from database
    const handleSelectCustomer = (customer: DbCustomerItem) => {
        setSelectedCustomer(customer)
        setIsNewCustomer(false)
        setFullAddress(customer.address)
        setDeliveryLocation(customer.location)
        setCurrency(customer.currency)
        setMeasurements({ ...customer.savedMeasurements })
        setMeasurementSaveStatus(null)
        setCustomerSearch('')

        // Adjust prices if currency switched
        if (selectedDesign) {
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
    }

    // Save measurements directly to customer profile in database
    const handleSaveMeasurementsToDb = async (measurementsToSave?: MeasurementProfile) => {
        if (!selectedCustomer) return
        const target = measurementsToSave || measurements
        setIsSavingMeasurements(true)
        setMeasurementSaveStatus(null)
        const res = await updateCustomerMeasurementAction(selectedCustomer.id, {
            unit: target.unit,
            chest: target.chest,
            shoulder: target.shoulder,
            sleeve: target.sleeve,
            waist: target.waist,
            hips: target.hips,
            inseam: target.inseam,
            neck: target.neck,
            length: target.length,
            fitNotes: target.fitNotes,
        })
        setIsSavingMeasurements(false)
        if (res.success) {
            const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            setMeasurementSaveStatus(`Saved to database at ${timeStr} ✓`)
            setSelectedCustomer((prev) =>
                prev
                    ? {
                          ...prev,
                          savedMeasurements: { ...target, updatedAt: res.updatedAt },
                          hasSavedMeasurements: true,
                          measurementDate: res.updatedAt,
                      }
                    : null
            )
            setDbCustomers((prevList) =>
                prevList.map((c) =>
                    c.id === selectedCustomer.id
                        ? {
                              ...c,
                              savedMeasurements: { ...target, updatedAt: res.updatedAt },
                              hasSavedMeasurements: true,
                              measurementDate: res.updatedAt,
                          }
                        : c
                )
            )
        } else {
            setMeasurementSaveStatus(`Failed to save: ${res.error}`)
        }
    }

    // Select design helper
    const handleSelectDesign = (item: OrderCatalogueItem) => {
        setSelectedDesign(item)
        setFabricChoice(item.defaultFabrics[0] || '')
        const initCol = item.defaultColours[0]
        setColourChoice(typeof initCol === 'string' ? initCol : initCol?.name || '')
        const total = currency === 'EUR' ? item.priceEUR : item.priceNGN
        setTotalAmount(total)
        setDepositAmount(Math.round(total / 2))
    }

    // Submit and create order
    const handleCreateOrder = async () => {
        if (isSubmitting) return

        if (depositAmount > totalAmount) {
            setSubmitError('Deposit amount cannot exceed total commission price.')
            return
        }

        const todayStr = new Date().toISOString().split('T')[0]
        if (deadline && deadline < todayStr) {
            setSubmitError('Production deadline date cannot be in the past.')
            return
        }

        setIsSubmitting(true)
        setSubmitError(null)

        let activeCustomer: CustomerProfile

        if (isNewCustomer) {
            const createdRes = await createCustomerAction({
                name: newCustomer.name,
                phone: newCustomer.phone,
                whatsapp: newCustomer.whatsapp,
                email: newCustomer.email,
                location: newCustomer.location,
                address: fullAddress || newCustomer.address,
                language: newCustomer.language,
                currency: newCustomer.currency,
                measurements: measurements,
            })
            if (createdRes.success && createdRes.customer) {
                activeCustomer = createdRes.customer
            } else {
                activeCustomer = {
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
            }
        } else {
            activeCustomer = selectedCustomer || dbCustomers[0]
            if (selectedCustomer && saveToProfile) {
                await handleSaveMeasurementsToDb(measurements)
            }
        }

        const existingOrders = getAllOrders()
        const nextNumber = `CS-00${92 + existingOrders.length}`
        const newId = String(Date.now())

        const createdOrder: AdminOrder = {
            id: newId,
            orderNumber: nextNumber,
            createdAt: new Date().toISOString(),
            status: markDepositAsPaid ? 'CONFIRMED' : 'NEW',
            isOverdue: false,
            tailorAssigned: assignedTailor,
            customer: activeCustomer,
            design: {
                id: designType === 'catalogue' ? (selectedDesign?.id || 'catalogue-item') : 'custom-design',
                name: designType === 'catalogue' ? (selectedDesign?.name || 'Selected Design') : customDesign.name || 'Custom Bespoke Creation',
                category: designType === 'catalogue' ? (selectedDesign?.category || 'Bespoke Custom') : 'Bespoke Custom',
                image: designType === 'catalogue' ? (selectedDesign?.image || '/images/design-agbada.jpg') : (customDesign.image || '/images/design-agbada.jpg'),
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
                depositPaidDate: markDepositAsPaid ? new Date().toISOString() : undefined,
                balanceAmount: totalAmount - depositAmount,
                balanceStatus: 'UNPAID',
                gateway: paymentMethod,
                referenceNumber: `DEP-${Date.now().toString().slice(-6)}`,
                balancePaymentLink: `https://captainstitches.com/pay/bal-${newId}`,
            },
            inspection: {
                photos: [],
                notes: '',
                isApproved: false,
            },
            adminNotes: [
                {
                    id: `note-${Date.now()}`,
                    author: 'Samuelson Anaele',
                    text: `Manual bespoke order created via admin panel for ${activeCustomer.name}.`,
                    timestamp: new Date().toISOString(),
                },
            ],
            notifications: [
                {
                    id: `notif-${Date.now()}`,
                    event: 'Order Created',
                    channel: 'WhatsApp',
                    timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    details: `Initial bespoke commission order logged for ${activeCustomer.name}.`,
                },
            ],
        }

        // Persist to PostgreSQL database
        let finalId = newId
        try {
            const dbRes = await createOrderAdminAction({
                orderNumber: nextNumber,
                customerId: activeCustomer.id,
                status: markDepositAsPaid ? 'CONFIRMED' : 'NEW',
                deliveryLocation: deliveryLocation,
                deliveryAddress: fullAddress,
                occasion: occasion,
                deadline: deadline,
                estimatedDeliveryDate: estimatedDeliveryDate,
                measurements: measurements,
                currency: currency,
                totalAmount: totalAmount,
                depositAmount: depositAmount,
                depositPaid: markDepositAsPaid,
                paymentGateway: paymentMethod,
                additionalNotes: customerNotes,
                catalogueDesign: designType === 'catalogue' && selectedDesign ? {
                    id: selectedDesign.id,
                    name: selectedDesign.name,
                    category: selectedDesign.category,
                    image: selectedDesign.image,
                    fabric: fabricChoice,
                    colour: colourChoice,
                    specialInstructions: specialInstructions,
                } : undefined,
                customDesign: designType === 'custom' ? {
                    name: customDesign.name,
                    image: customDesign.image,
                    fabric: customDesign.fabric,
                    colour: customDesign.colour,
                    specialInstructions: customDesign.specialInstructions || specialInstructions,
                } : undefined,
                tailorAssigned: assignedTailor,
            })

            if (dbRes.success && dbRes.order) {
                updateOrder(dbRes.order)
                finalId = dbRes.order.id
            } else {
                setSubmitError(dbRes.error || 'Failed to save order in database.')
                setIsSubmitting(false)
                return
            }
        } catch (e: any) {
            console.error('Error saving order to database:', e)
            setSubmitError(e?.message || 'Unexpected error creating order.')
            setIsSubmitting(false)
            return
        }

        setIsSubmitting(false)

        // Notify sidebar & components to refresh database counts
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('admin-counts-update'))
        }

        // Generate WhatsApp link confirmation
        const cleanPhone = activeCustomer.whatsapp.replace(/[^0-9]/g, '')
        const msg = encodeURIComponent(
            `Hello ${activeCustomer.name}, your CaptainStitches bespoke order #${nextNumber} has been logged in our system! Estimated completion: ${estimatedDeliveryDate}. Tracking reference: https://captainstitches.com/track?id=${nextNumber}. Thank you!`
        )
        if (cleanPhone) {
            window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank')
        }

        router.push(`/admin/orders/${finalId}`)
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
                            onClick={() => {
                                if (currentStep === 3 && selectedCustomer && saveToProfile) {
                                    handleSaveMeasurementsToDb(measurements)
                                }
                                setCurrentStep(s.num)
                            }}
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
                                    {customerSearch.trim() && (
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
                                            {filteredCustomers.length > 0 ? (
                                                filteredCustomers.map((c) => (
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
                                                ))
                                            ) : (
                                                <div style={{ padding: '1rem', textAlign: 'center', fontSize: '0.8rem', color: '#8A7A6E' }}>
                                                    No database customers match &quot;{customerSearch}&quot;.
                                                </div>
                                            )}
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
                                                <span style={{ fontSize: '0.7rem', fontWeight: 600, backgroundColor: '#ECFDF5', color: '#065F46', padding: '0.15rem 0.45rem', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                                                    Database Customer
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
                                    <div style={{ fontSize: '0.8rem', color: '#8A7A6E' }}>
                                        {isLoadingCustomers ? (
                                            <div>Loading patrons from database...</div>
                                        ) : dbCustomers.length > 0 ? (
                                            <div>
                                                <span style={{ fontStyle: 'italic' }}>Pick from patrons saved in database:</span>
                                                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                                    {dbCustomers.slice(0, 6).map((c) => (
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
                                        ) : (
                                            <div>No customer records in database yet. Use <strong>+ Create New Customer</strong> above.</div>
                                        )}
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
                                    {!newCustomer.whatsapp.trim() && newCustomer.email.trim() && (
                                        <span style={{ fontSize: '0.725rem', color: '#B45309', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                                            ⚠️ WhatsApp updates require a valid phone number with country code.
                                        </span>
                                    )}
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
                                {isLoadingDesigns ? (
                                    <div style={{ padding: '2.5rem', textAlign: 'center', color: '#8A7A6E', fontSize: '0.875rem' }}>
                                        Loading catalogue designs from database...
                                    </div>
                                ) : catalogueDesigns.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#FAF7F2', borderRadius: '12px', border: '1px solid #EDE8E1' }}>
                                        <p style={{ margin: 0, fontWeight: 700, color: '#1C0F07' }}>No catalogue designs found in database</p>
                                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#8A7A6E' }}>
                                            Please add designs in the Admin Catalogue or switch to <strong>Custom Reference Design</strong>.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Catalogue Grid */}
                                        <div
                                            style={{
                                                display: 'grid',
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                                                gap: '1rem',
                                                marginBottom: '1.5rem',
                                            }}
                                        >
                                            {catalogueDesigns.map((item) => {
                                                const isSelected = selectedDesign?.id === item.id

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
                                        {selectedDesign && (
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
                                                        {(selectedDesign.defaultFabrics || []).map((f) => (
                                                            <option key={f} value={f}>{f}</option>
                                                        ))}
                                                        <option value="Client Supplied Fabric">Client Supplied Fabric</option>
                                                    </select>
                                                </div>
                                                <div style={{ gridColumn: 'span 2' }}>
                                                    <ColourSelector
                                                        label="Colour Palette Selection"
                                                        options={selectedDesign.defaultColours}
                                                        value={colourChoice}
                                                        onChange={(val) => setColourChoice(val)}
                                                        darkMode={false}
                                                    />
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
                                        )}
                                    </>
                                )}
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
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
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
                                    <div style={{ gridColumn: 'span 2' }}>
                                        <ColourSelector
                                            label="Garment Colour & Custom Shade"
                                            options={ATELIER_PALETTE}
                                            value={customDesign.colour}
                                            onChange={(val) => setCustomDesign({ ...customDesign, colour: val })}
                                            darkMode={false}
                                        />
                                    </div>
                                </div>
                                <div>
                                    {/* Always render hidden input so file picker can be triggered */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            if (e.target.files && e.target.files[0]) {
                                                handleCustomImageFile(e.target.files[0])
                                            }
                                        }}
                                    />

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                                        <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: '#6E5D4F' }}>
                                            Reference Sketch / Photo
                                        </label>
                                        {customDesign.image && (
                                            <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, backgroundColor: '#ECFDF5', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid #A7F3D0' }}>
                                                ✓ Reference Attached
                                            </span>
                                        )}
                                    </div>

                                    {customDesign.image ? (
                                        /* Active Image Preview Card */
                                        <div
                                            style={{
                                                display: 'flex',
                                                flexWrap: 'wrap',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                                gap: '1rem',
                                                backgroundColor: '#FFFFFF',
                                                padding: '0.85rem 1rem',
                                                borderRadius: '10px',
                                                border: '1px solid #D5CCA8',
                                                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', minWidth: '220px', flex: '1 1 auto' }}>
                                                <div
                                                    style={{
                                                        width: '68px',
                                                        height: '68px',
                                                        minWidth: '68px',
                                                        borderRadius: '8px',
                                                        overflow: 'hidden',
                                                        border: '1px solid #E0D7CB',
                                                        backgroundColor: '#F5EFEB',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <img
                                                        src={customDesign.image}
                                                        alt="Custom design preview"
                                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                        onError={() => {
                                                            setCustomImageError('Failed to load image from this URL. Please verify the link or upload a file.')
                                                        }}
                                                    />
                                                </div>
                                                <div style={{ overflow: 'hidden' }}>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C0F07', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                        {customImageName || 'Customer WhatsApp Reference'}
                                                    </div>
                                                    <div style={{ fontSize: '0.725rem', color: '#8A7A6E', marginTop: '0.2rem' }}>
                                                        {customDesign.image.startsWith('data:') ? 'Uploaded device file • Attached to order' : 'Web URL reference • Attached to order'}
                                                    </div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (customImageMode === 'upload') {
                                                            fileInputRef.current?.click()
                                                        } else {
                                                            setCustomDesign((prev) => ({ ...prev, image: '' }))
                                                        }
                                                    }}
                                                    style={{
                                                        padding: '0.45rem 0.75rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #D5CCA8',
                                                        backgroundColor: '#FAF7F2',
                                                        color: '#1C0F07',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                    }}
                                                >
                                                    <IconPhoto />
                                                    Change
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={handleRemoveCustomImage}
                                                    style={{
                                                        padding: '0.45rem 0.75rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #FECACA',
                                                        backgroundColor: '#FEF2F2',
                                                        color: '#DC2626',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 600,
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                    }}
                                                >
                                                    <IconTrash />
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        /* Dual Mode Upload / Paste Area */
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                                            {/* Mode Switcher Tabs */}
                                            <div style={{ display: 'flex', gap: '0.35rem', backgroundColor: '#EDE8E1', padding: '0.25rem', borderRadius: '8px', width: 'fit-content' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => { setCustomImageMode('upload'); setCustomImageError(null) }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        backgroundColor: customImageMode === 'upload' ? '#C4975A' : 'transparent',
                                                        color: customImageMode === 'upload' ? '#FFFFFF' : '#6E5D4F',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    <IconUploadCloud />
                                                    Upload / Drop File
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setCustomImageMode('url'); setCustomImageError(null) }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                        padding: '0.35rem 0.75rem',
                                                        borderRadius: '6px',
                                                        border: 'none',
                                                        backgroundColor: customImageMode === 'url' ? '#C4975A' : 'transparent',
                                                        color: customImageMode === 'url' ? '#FFFFFF' : '#6E5D4F',
                                                        fontSize: '0.75rem',
                                                        fontWeight: 700,
                                                        cursor: 'pointer',
                                                        transition: 'all 0.15s ease',
                                                    }}
                                                >
                                                    <IconLink />
                                                    Paste Image URL
                                                </button>
                                            </div>

                                            {customImageMode === 'upload' ? (
                                                /* Dropzone */
                                                <div
                                                    onClick={() => fileInputRef.current?.click()}
                                                    onDragOver={handleDragOver}
                                                    onDragLeave={handleDragLeave}
                                                    onDrop={handleDrop}
                                                    onPaste={handlePasteEvent}
                                                    tabIndex={0}
                                                    role="button"
                                                    aria-label="Upload reference sketch or photo"
                                                    style={{
                                                        border: isDraggingFile ? '2px dashed #C4975A' : '2px dashed #D5CCA8',
                                                        borderRadius: '10px',
                                                        padding: '1.75rem 1rem',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        backgroundColor: isDraggingFile ? '#FDF8F3' : '#FFFFFF',
                                                        transition: 'border-color 0.2s, background-color 0.2s',
                                                        outline: 'none',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.4rem' }}>
                                                        <IconUploadCloud />
                                                    </div>
                                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1C0F07' }}>
                                                        Click or drop customer&apos;s WhatsApp image reference
                                                    </div>
                                                    <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.2rem' }}>
                                                        Supports JPG, PNG, WebP up to 20MB • Or paste directly with Ctrl+V / ⌘+V
                                                    </div>
                                                    <div style={{ marginTop: '0.75rem' }}>
                                                        <span
                                                            style={{
                                                                display: 'inline-block',
                                                                padding: '0.35rem 0.85rem',
                                                                borderRadius: '6px',
                                                                backgroundColor: '#FAF7F2',
                                                                border: '1px solid #D5CCA8',
                                                                fontSize: '0.75rem',
                                                                fontWeight: 600,
                                                                color: '#6E5D4F',
                                                            }}
                                                        >
                                                            Browse Device Photos
                                                        </span>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* URL Paste Box */
                                                <div
                                                    onPaste={handlePasteEvent}
                                                    style={{
                                                        backgroundColor: '#FFFFFF',
                                                        border: '1px solid #E0D7CB',
                                                        borderRadius: '10px',
                                                        padding: '1.25rem',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: '0.75rem',
                                                    }}
                                                >
                                                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1C0F07' }}>
                                                        Paste Image URL from WhatsApp Web, Cloudinary, or web link:
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        <input
                                                            type="url"
                                                            placeholder="https://example.com/custom-suit-sketch.jpg"
                                                            value={customImageUrlInput}
                                                            onChange={(e) => {
                                                                setCustomImageUrlInput(e.target.value)
                                                                if (customImageError) setCustomImageError(null)
                                                            }}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault()
                                                                    handleApplyCustomImageUrl()
                                                                }
                                                            }}
                                                            style={{
                                                                flex: '1 1 240px',
                                                                padding: '0.55rem 0.75rem',
                                                                borderRadius: '8px',
                                                                border: '1px solid #E0D7CB',
                                                                fontSize: '0.85rem',
                                                                outline: 'none',
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleApplyCustomImageUrl()}
                                                            style={{
                                                                padding: '0.55rem 1.25rem',
                                                                borderRadius: '8px',
                                                                border: 'none',
                                                                backgroundColor: '#C4975A',
                                                                color: '#FFFFFF',
                                                                fontSize: '0.825rem',
                                                                fontWeight: 700,
                                                                cursor: 'pointer',
                                                                flexShrink: 0,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '0.35rem',
                                                            }}
                                                        >
                                                            <IconLink />
                                                            Attach URL
                                                        </button>
                                                    </div>
                                                    <div style={{ fontSize: '0.725rem', color: '#8A7A6E' }}>
                                                        Tip: Right-click any image in WhatsApp Web or Google &rarr; &quot;Copy image address&quot; &rarr; Paste here.
                                                    </div>
                                                </div>
                                            )}

                                            {customImageError && (
                                                <div
                                                    style={{
                                                        fontSize: '0.75rem',
                                                        color: '#DC2626',
                                                        backgroundColor: '#FEF2F2',
                                                        padding: '0.5rem 0.75rem',
                                                        borderRadius: '6px',
                                                        border: '1px solid #FECACA',
                                                    }}
                                                >
                                                    {customImageError}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ── STEP 3: MEASUREMENTS ────────────────────────────────────────────── */}
                {currentStep === 3 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                    Step 3: Measurements
                                </h2>
                                <p style={{ fontSize: '0.825rem', color: '#8A7A6E', margin: 0, marginTop: '0.25rem' }}>
                                    {selectedCustomer
                                        ? `Loaded directly from ${selectedCustomer.name}'s database profile.`
                                        : 'Input client measurements taken via WhatsApp or in person.'}
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                {selectedCustomer && (
                                    <button
                                        type="button"
                                        onClick={() => handleSaveMeasurementsToDb(measurements)}
                                        disabled={isSavingMeasurements}
                                        style={{
                                            padding: '0.4rem 0.85rem',
                                            borderRadius: '8px',
                                            border: '1px solid #D5CCA8',
                                            backgroundColor: '#FFFFFF',
                                            color: '#1C0F07',
                                            fontSize: '0.78rem',
                                            fontWeight: 700,
                                            cursor: isSavingMeasurements ? 'not-allowed' : 'pointer',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '0.35rem',
                                            boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                                        }}
                                    >
                                        <IconCheck />
                                        <span>{isSavingMeasurements ? 'Saving to Database...' : 'Save to DB Profile'}</span>
                                    </button>
                                )}
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
                        </div>

                        {/* Customer Database Measurement Notice */}
                        {selectedCustomer && (
                            <div
                                style={{
                                    backgroundColor: '#FDFBF7',
                                    border: '1px solid #D5CCA8',
                                    borderRadius: '12px',
                                    padding: '1rem 1.25rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.5rem',
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <span
                                            style={{
                                                backgroundColor: '#ECFDF5',
                                                color: '#065F46',
                                                border: '1px solid #A7F3D0',
                                                padding: '0.2rem 0.55rem',
                                                borderRadius: '6px',
                                                fontSize: '0.725rem',
                                                fontWeight: 700,
                                            }}
                                        >
                                            ✓ Database Verified
                                        </span>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1C0F07' }}>
                                            Latest Measurements for {selectedCustomer.name}
                                        </span>
                                    </div>
                                    {selectedCustomer.measurementDate && (
                                        <span style={{ fontSize: '0.75rem', color: '#8A7A6E', fontWeight: 600 }}>
                                            Profile Updated: {new Date(selectedCustomer.measurementDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#6E5D4F' }}>
                                        These measurements belong to {selectedCustomer.name} and were fetched from the database. Any edits made will be saved to their customer profile in the database.
                                    </p>
                                    {measurementSaveStatus && (
                                        <span
                                            style={{
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: measurementSaveStatus.includes('Error') || measurementSaveStatus.includes('Failed') ? '#DC2626' : '#166534',
                                                backgroundColor: measurementSaveStatus.includes('Error') || measurementSaveStatus.includes('Failed') ? '#FEF2F2' : '#DCFCE7',
                                                padding: '0.2rem 0.6rem',
                                                borderRadius: '6px',
                                            }}
                                        >
                                            {measurementSaveStatus}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

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
                                <span>Save these updated measurements back to {selectedCustomer.name}&apos;s customer profile in the database</span>
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
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(e) => setDeadline(e.target.value)}
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
                                {deadline && deadline < new Date().toISOString().split('T')[0] && (
                                    <span style={{ fontSize: '0.725rem', color: '#DC2626', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                                        Production deadline date cannot be in the past.
                                    </span>
                                )}
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
                                    Estimated Completion Date
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
                                    Assigned Tailor / Artisan
                                </label>
                                <input
                                    type="text"
                                    value={assignedTailor}
                                    onChange={(e) => setAssignedTailor(e.target.value)}
                                    placeholder="Enter tailor or artisan name (e.g. Babatunde Bello, Kolapo Adeleke)"
                                    style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #E0D7CB', fontSize: '0.85rem' }}
                                />
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
                                    style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: depositAmount > totalAmount ? '1px solid #DC2626' : '1px solid #E0D7CB', fontSize: '1.1rem', fontWeight: 800, color: '#2B2B2B' }}
                                />
                                {depositAmount > totalAmount ? (
                                    <span style={{ fontSize: '0.725rem', color: '#DC2626', marginTop: '0.25rem', display: 'block', fontWeight: 600 }}>
                                        Deposit amount cannot exceed total commission price.
                                    </span>
                                ) : (
                                    <span style={{ fontSize: '0.725rem', color: '#8A7A6E', marginTop: '0.2rem', display: 'block' }}>
                                        Balance due before dispatch: {currency === 'EUR' ? `€${totalAmount - depositAmount}` : `₦${(totalAmount - depositAmount).toLocaleString()}`}
                                    </span>
                                )}
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
                                        { id: 'Cash', label: 'Direct Cash / POS' },
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
                                <div style={{ display: 'flex', gap: '0.85rem', marginTop: '0.5rem', alignItems: 'center' }}>
                                    {((designType === 'catalogue' && selectedDesign?.image) || (designType === 'custom' && customDesign.image)) && (
                                        <div style={{ width: '56px', height: '56px', minWidth: '56px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #E0D7CB', backgroundColor: '#F5EFEB', flexShrink: 0 }}>
                                            <img
                                                src={designType === 'catalogue' ? selectedDesign?.image : customDesign.image}
                                                alt="Garment preview"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        </div>
                                    )}
                                    <div>
                                        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1C0F07' }}>
                                            {designType === 'catalogue' ? (selectedDesign?.name || 'Selected Design') : (customDesign.name || 'Custom Bespoke Creation')}
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: '#6E5D4F', marginTop: '0.15rem' }}>
                                            Fabric: {designType === 'catalogue' ? fabricChoice : (customDesign.fabric || 'Consultation')}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: '#8A7A6E', marginTop: '0.15rem' }}>
                                            Colour: {designType === 'catalogue' ? colourChoice : (customDesign.colour || 'Consultation')}
                                        </div>
                                    </div>
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
                                    Assigned: {assignedTailor || 'Unassigned'}
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
                            onClick={async () => {
                                if (currentStep === 3 && selectedCustomer && saveToProfile) {
                                    await handleSaveMeasurementsToDb(measurements)
                                }
                                setCurrentStep(currentStep + 1)
                            }}
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
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                            <button
                                type="button"
                                onClick={handleCreateOrder}
                                disabled={isSubmitting || depositAmount > totalAmount}
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem 1.75rem',
                                    borderRadius: '10px',
                                    border: 'none',
                                    backgroundColor: isSubmitting || depositAmount > totalAmount ? '#9CA3AF' : '#166534',
                                    color: '#FFFFFF',
                                    fontSize: '0.9rem',
                                    fontWeight: 800,
                                    cursor: isSubmitting || depositAmount > totalAmount ? 'not-allowed' : 'pointer',
                                    boxShadow: isSubmitting || depositAmount > totalAmount ? 'none' : '0 3px 10px rgba(22,101,52,0.3)',
                                }}
                            >
                                <IconCheck />
                                <span>{isSubmitting ? 'Creating Order...' : 'Create Order & Send WhatsApp Confirmation'}</span>
                            </button>
                            {submitError && (
                                <div style={{ fontSize: '0.75rem', color: '#DC2626', fontWeight: 600 }}>
                                    {submitError}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
