export type OrderStatus =
    | 'NEW'
    | 'CONFIRMED'
    | 'IN_PRODUCTION'
    | 'INSPECTION'
    | 'APPROVED'
    | 'DISPATCHED'
    | 'DELIVERED'

export type Location = 'Italy' | 'Nigeria'
export type Currency = 'NGN' | 'EUR'

export interface MeasurementProfile {
    chest: number
    shoulder: number
    sleeve: number
    waist: number
    hips: number
    inseam: number
    neck: number
    length: number
    fitNotes?: string
    unit: 'inches' | 'cm'
}

export interface CustomerProfile {
    id: string
    name: string
    phone: string
    whatsapp: string
    email: string
    location: Location
    address: string
    language: 'English' | 'Italian'
    currency: Currency
    savedMeasurements: MeasurementProfile
    totalOrders: number
}

export interface Tailor {
    id: string
    name: string
    role: string
    location: string
    activeOrdersCount: number
}

export interface AdminOrder {
    id: string
    orderNumber: string
    createdAt: string
    status: OrderStatus
    isOverdue: boolean
    tailorAssigned: string
    customer: CustomerProfile
    design: {
        id: string
        name: string
        category: string
        image: string
        isCustom: boolean
        fabric: string
        colour: string
        specialInstructions?: string
    }
    measurements: MeasurementProfile
    details: {
        occasion: string
        deadline: string
        deliveryLocation: Location
        fullAddress: string
        currency: Currency
        estimatedDeliveryDate: string
        additionalNotes?: string
    }
    payment: {
        totalNGN: number
        totalEUR: number
        depositAmount: number
        depositStatus: 'PAID' | 'UNPAID'
        depositPaidDate?: string
        balanceAmount: number
        balanceStatus: 'PAID' | 'UNPAID'
        balancePaidDate?: string
        gateway: 'Paystack' | 'Stripe' | 'Manual Bank Transfer' | 'Cash'
        referenceNumber: string
        balancePaymentLink: string
    }
    inspection: {
        photos: string[]
        videoUrl?: string
        notes: string
        approvedBy?: string
        approvedAt?: string
        isApproved: boolean
    }
    adminNotes: Array<{
        id: string
        author: string
        text: string
        timestamp: string
    }>
    notifications: Array<{
        id: string
        event: string
        channel: 'WhatsApp' | 'Email'
        timestamp: string
        details?: string
    }>
}

export const TAILORS_ROSTER: Tailor[] = [
    { id: 't-1', name: 'Samuelson (Master Tailor)', role: 'Creative Director & Lead Cutter', location: 'Lagos & Milan', activeOrdersCount: 4 },
    { id: 't-2', name: 'Babatunde Bello', role: 'Head Native Wear Artisan', location: 'Lagos Atelier', activeOrdersCount: 3 },
    { id: 't-3', name: 'Ibrahim Musa', role: 'Bespoke Suit Specialist', location: 'Lagos Atelier', activeOrdersCount: 2 },
    { id: 't-4', name: 'Kolapo Adeleke', role: 'Agbada & Embroidery Master', location: 'Lagos Atelier', activeOrdersCount: 3 },
    { id: 't-5', name: 'Chioma Okafor', role: 'Finishing & Quality Assurance', location: 'Lagos Atelier', activeOrdersCount: 1 },
]

export const CUSTOMERS_DIRECTORY: CustomerProfile[] = [
    {
        id: 'cust-1',
        name: 'Adewale Okafor',
        phone: '+39 347 123 4567',
        whatsapp: '+39 347 123 4567',
        email: 'adewale.okafor@gmail.com',
        location: 'Italy',
        address: 'Via Dante 14, 20121 Milano, Italy',
        language: 'English',
        currency: 'EUR',
        savedMeasurements: {
            chest: 42,
            shoulder: 18.5,
            sleeve: 25.5,
            waist: 35,
            hips: 41,
            inseam: 32,
            neck: 16.5,
            length: 44,
            unit: 'inches',
            fitNotes: 'Prefers slightly tapered sleeves and comfort fit around chest for Agbada.',
        },
        totalOrders: 4,
    },
    {
        id: 'cust-2',
        name: 'Chidi Ikenna',
        phone: '+234 803 555 7890',
        whatsapp: '+234 803 555 7890',
        email: 'chidi.ikenna@venturepartners.ng',
        location: 'Nigeria',
        address: 'Plot 12B Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
        language: 'English',
        currency: 'NGN',
        savedMeasurements: {
            chest: 40,
            shoulder: 17.5,
            sleeve: 24.5,
            waist: 33,
            hips: 39,
            inseam: 31,
            neck: 15.5,
            length: 41,
            unit: 'inches',
            fitNotes: 'Slim fit Italian cut, high armhole, slight break on trousers.',
        },
        totalOrders: 2,
    },
    {
        id: 'cust-3',
        name: 'Ngozi Nwosu',
        phone: '+39 338 889 0123',
        whatsapp: '+39 338 889 0123',
        email: 'ngozi.nwosu@studiolegale.it',
        location: 'Italy',
        address: 'Corso Buenos Aires 45, 20124 Milano, Italy',
        language: 'Italian',
        currency: 'EUR',
        savedMeasurements: {
            chest: 38,
            shoulder: 16.5,
            sleeve: 23.5,
            waist: 31,
            hips: 38,
            inseam: 30,
            neck: 15.0,
            length: 39,
            unit: 'inches',
            fitNotes: 'Clean, minimalist lines, mandarin collar.',
        },
        totalOrders: 3,
    },
    {
        id: 'cust-4',
        name: 'Emeka Balogun',
        phone: '+234 812 443 2199',
        whatsapp: '+234 812 443 2199',
        email: 'e.balogun@firstbank.ng',
        location: 'Nigeria',
        address: '15 Glover Road, Ikoyi, Lagos, Nigeria',
        language: 'English',
        currency: 'NGN',
        savedMeasurements: {
            chest: 44,
            shoulder: 19.5,
            sleeve: 26.0,
            waist: 37,
            hips: 43,
            inseam: 33,
            neck: 17.5,
            length: 43,
            unit: 'inches',
            fitNotes: 'Relaxed fit Senator cut with concealed placket.',
        },
        totalOrders: 5,
    },
    {
        id: 'cust-5',
        name: 'Fatima Kamara',
        phone: '+39 320 994 5612',
        whatsapp: '+39 320 994 5612',
        email: 'fatima.kamara@artelier.eu',
        location: 'Italy',
        address: 'Via dei Condotti 88, 00187 Roma, Italy',
        language: 'Italian',
        currency: 'EUR',
        savedMeasurements: {
            chest: 36,
            shoulder: 15.5,
            sleeve: 23.0,
            waist: 28,
            hips: 37,
            inseam: 29.5,
            neck: 14.5,
            length: 42,
            unit: 'inches',
            fitNotes: 'Graceful drape with high embroidery finish.',
        },
        totalOrders: 1,
    },
    {
        id: 'cust-6',
        name: 'Tunde Adeyemi',
        phone: '+39 333 412 8871',
        whatsapp: '+39 333 412 8871',
        email: 'tunde.adeyemi@bocconi.it',
        location: 'Italy',
        address: 'Via Guglielmo Marconi 12, 10125 Torino, Italy',
        language: 'English',
        currency: 'EUR',
        savedMeasurements: {
            chest: 41,
            shoulder: 18.0,
            sleeve: 25.0,
            waist: 34,
            hips: 40,
            inseam: 32,
            neck: 16.0,
            length: 42,
            unit: 'inches',
            fitNotes: 'Classic 3-piece tailored fit with silk inner lining.',
        },
        totalOrders: 3,
    },
    {
        id: 'cust-7',
        name: 'Gianluigi Rossi',
        phone: '+39 349 771 2309',
        whatsapp: '+39 349 771 2309',
        email: 'gianluigi.rossi@milanodesign.it',
        location: 'Italy',
        address: 'Via Solferino 19, 20121 Milano, Italy',
        language: 'Italian',
        currency: 'EUR',
        savedMeasurements: {
            chest: 43,
            shoulder: 19.0,
            sleeve: 25.5,
            waist: 36,
            hips: 42,
            inseam: 32.5,
            neck: 17.0,
            length: 43,
            unit: 'inches',
            fitNotes: 'Double-breasted peak lapel with horn buttons.',
        },
        totalOrders: 2,
    },
]

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
    {
        id: '1',
        orderNumber: 'CS-0091',
        createdAt: '2026-05-28T10:14:00Z',
        status: 'INSPECTION',
        isOverdue: false,
        tailorAssigned: 'Kolapo Adeleke',
        customer: CUSTOMERS_DIRECTORY[0],
        design: {
            id: 'd-1',
            name: 'Grand Agbada',
            category: 'Native Wear',
            image: '/images/design-agbada.jpg',
            isCustom: false,
            fabric: 'Imperial Royal Guinea Brocade',
            colour: 'Obsidian Black with Gold Stitching',
            specialInstructions: 'Hand-stitched geometric embroidery motif along the neckline and front yoke.',
        },
        measurements: CUSTOMERS_DIRECTORY[0].savedMeasurements,
        details: {
            occasion: 'Sister’s Traditional Wedding in Milan',
            deadline: '2026-06-14',
            deliveryLocation: 'Italy',
            fullAddress: 'Via Dante 14, 20121 Milano, Italy',
            currency: 'EUR',
            estimatedDeliveryDate: '2026-06-12',
            additionalNotes: 'Urgent event on June 16th. Needs to arrive at Milan apartment by June 12th.',
        },
        payment: {
            totalNGN: 120000,
            totalEUR: 68,
            depositAmount: 34,
            depositStatus: 'PAID',
            depositPaidDate: 'May 28, 2026',
            balanceAmount: 34,
            balanceStatus: 'UNPAID',
            gateway: 'Stripe',
            referenceNumber: 'STR-CS91-09827341',
            balancePaymentLink: 'https://pay.captainstitches.com/balance/cs-0091-bal',
        },
        inspection: {
            photos: [
                '/images/design-agbada.jpg',
                '/images/category-native.jpeg',
            ],
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: 'Awaiting Samuelson sign-off. Embroidery lines aligned crisply. Hemline verified at exactly 44 inches.',
            isApproved: false,
        },
        adminNotes: [
            { id: 'an-1', author: 'Samuelson', text: 'Customer requested matching cap (Fila). Confirmed with Kolapo that matching Fila is cut from same brocade lot.', timestamp: 'May 28, 2026 · 11:30 AM' },
            { id: 'an-2', author: 'Kolapo Adeleke', text: 'Tailoring complete. High resolution inspection photos and walkthrough video uploaded.', timestamp: 'Jun 2, 2026 · 04:15 PM' },
        ],
        notifications: [
            { id: 'notif-1', event: 'Order Created', channel: 'WhatsApp', timestamp: 'May 28, 2026 · 10:14 AM', details: 'Order reference and 50% deposit receipt sent to +39 347 123 4567' },
            { id: 'notif-2', event: 'Production Commenced', channel: 'WhatsApp', timestamp: 'May 29, 2026 · 09:00 AM', details: 'Notification sent: Fabric cut and assigned to Kolapo Adeleke' },
            { id: 'notif-3', event: 'Inspection Ready Notice', channel: 'Email', timestamp: 'Jun 2, 2026 · 04:16 PM', details: 'Internal alert to Samuelson: Garment completed and submitted for QC' },
        ],
    },
    {
        id: '2',
        orderNumber: 'CS-0090',
        createdAt: '2026-05-20T08:30:00Z',
        status: 'IN_PRODUCTION',
        isOverdue: true, // Passed deadline Jun 10 (or deadline alert)
        tailorAssigned: 'Ibrahim Musa',
        customer: CUSTOMERS_DIRECTORY[1],
        design: {
            id: 'd-2',
            name: 'Italian 3-Piece Suit',
            category: 'English Suits',
            image: '/images/design-suit.jpg',
            isCustom: false,
            fabric: 'Super 150s Merino Wool (Biella)',
            colour: 'Midnight Navy with Chalk Pinstripe',
            specialInstructions: 'Peak lapels with genuine horn buttons and interior burgundy silk piping.',
        },
        measurements: CUSTOMERS_DIRECTORY[1].savedMeasurements,
        details: {
            occasion: 'Annual Tech Summit Keynote Address',
            deadline: '2026-06-10',
            deliveryLocation: 'Nigeria',
            fullAddress: 'Plot 12B Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
            currency: 'NGN',
            estimatedDeliveryDate: '2026-06-09',
            additionalNotes: 'Client travels to London immediately after the summit on the 12th.',
        },
        payment: {
            totalNGN: 160000,
            totalEUR: 90,
            depositAmount: 80000,
            depositStatus: 'PAID',
            depositPaidDate: 'May 20, 2026',
            balanceAmount: 80000,
            balanceStatus: 'UNPAID',
            gateway: 'Paystack',
            referenceNumber: 'PSTK-0923847-CS90',
            balancePaymentLink: 'https://pay.captainstitches.com/balance/cs-0090-bal',
        },
        inspection: {
            photos: [],
            notes: 'In jacket sleeve fitting stage. Delayed by 24 hours waiting for imported lining.',
            isApproved: false,
        },
        adminNotes: [
            { id: 'an-1', author: 'Samuelson', text: 'Spoke with Ibrahim. Expedited finishing tonight. Will conduct quality check tomorrow 9 AM sharp.', timestamp: 'Jun 4, 2026 · 02:00 PM' },
        ],
        notifications: [
            { id: 'notif-1', event: 'Order Confirmed', channel: 'WhatsApp', timestamp: 'May 20, 2026 · 08:35 AM', details: 'Deposit verified via Paystack.' },
            { id: 'notif-2', event: 'Timeline Update', channel: 'WhatsApp', timestamp: 'Jun 3, 2026 · 11:15 AM', details: 'Courtesy update sent to customer regarding expedited dispatch.' },
        ],
    },
    {
        id: '3',
        orderNumber: 'CS-0089',
        createdAt: '2026-06-01T14:22:00Z',
        status: 'CONFIRMED',
        isOverdue: false,
        tailorAssigned: 'Babatunde Bello',
        customer: CUSTOMERS_DIRECTORY[2],
        design: {
            id: 'd-3',
            name: 'Kaftan Royale',
            category: 'Native Wear',
            image: '/images/design-kaftan.jpg',
            isCustom: false,
            fabric: 'Cashmere Wool Blend',
            colour: 'Emerald Green with Bronze Threading',
            specialInstructions: 'Minimalist mandarin collar with concealed mother-of-pearl buttons.',
        },
        measurements: CUSTOMERS_DIRECTORY[2].savedMeasurements,
        details: {
            occasion: 'Milan Fashion Gala',
            deadline: '2026-06-20',
            deliveryLocation: 'Italy',
            fullAddress: 'Corso Buenos Aires 45, 20124 Milano, Italy',
            currency: 'EUR',
            estimatedDeliveryDate: '2026-06-18',
            additionalNotes: 'Prefers eco-friendly dust bag.',
        },
        payment: {
            totalNGN: 75000,
            totalEUR: 42,
            depositAmount: 21,
            depositStatus: 'PAID',
            depositPaidDate: 'Jun 1, 2026',
            balanceAmount: 21,
            balanceStatus: 'UNPAID',
            gateway: 'Stripe',
            referenceNumber: 'STR-88234190-CS89',
            balancePaymentLink: 'https://pay.captainstitches.com/balance/cs-0089-bal',
        },
        inspection: {
            photos: [],
            notes: 'Fabric pre-shrunk and drafted. Awaiting cutting bench slot.',
            isApproved: false,
        },
        adminNotes: [
            { id: 'an-1', author: 'Samuelson', text: 'Confirmed bronze embroidery thread swatch via WhatsApp with customer.', timestamp: 'Jun 1, 2026 · 03:10 PM' },
        ],
        notifications: [
            { id: 'notif-1', event: 'Order Confirmed', channel: 'WhatsApp', timestamp: 'Jun 1, 2026 · 02:25 PM', details: 'Deposit received. Production scheduled.' },
        ],
    },
    {
        id: '4',
        orderNumber: 'CS-0088',
        createdAt: '2026-05-15T12:00:00Z',
        status: 'DISPATCHED',
        isOverdue: false,
        tailorAssigned: 'Babatunde Bello',
        customer: CUSTOMERS_DIRECTORY[3],
        design: {
            id: 'd-4',
            name: 'Classic Senator',
            category: 'Native Wear',
            image: '/images/design-senator.jpg',
            isCustom: false,
            fabric: 'Super 140s Wool Linen',
            colour: 'Charcoal Grey with Burgundy Trim',
            specialInstructions: 'Slanted side pockets and double vented back hem.',
        },
        measurements: CUSTOMERS_DIRECTORY[3].savedMeasurements,
        details: {
            occasion: 'Board of Directors Quarterly Dinner',
            deadline: '2026-06-08',
            deliveryLocation: 'Nigeria',
            fullAddress: '15 Glover Road, Ikoyi, Lagos, Nigeria',
            currency: 'NGN',
            estimatedDeliveryDate: '2026-06-06',
            additionalNotes: 'Delivered directly to front security desk with sealed tamper-evident seal.',
        },
        payment: {
            totalNGN: 85000,
            totalEUR: 47,
            depositAmount: 42500,
            depositStatus: 'PAID',
            depositPaidDate: 'May 15, 2026',
            balanceAmount: 42500,
            balanceStatus: 'PAID',
            balancePaidDate: 'Jun 5, 2026',
            gateway: 'Paystack',
            referenceNumber: 'PSTK-7712390-CS88',
            balancePaymentLink: 'https://pay.captainstitches.com/balance/cs-0088-bal',
        },
        inspection: {
            photos: ['/images/design-senator.jpg'],
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: 'Inspected by Samuelson. Perfect collar symmetry and seam finishing. 10/10.',
            approvedBy: 'Samuelson (Lead Admin)',
            approvedAt: 'Jun 4, 2026 · 11:30 AM',
            isApproved: true,
        },
        adminNotes: [
            { id: 'an-1', author: 'Samuelson', text: 'Full payment received. Dispatched via CaptainStitches VIP Lagos Courier (Waybill #CS-LG-9821).', timestamp: 'Jun 5, 2026 · 09:30 AM' },
        ],
        notifications: [
            { id: 'notif-1', event: 'Dispatch Confirmation', channel: 'WhatsApp', timestamp: 'Jun 5, 2026 · 09:35 AM', details: 'Tracking link & courier contact shared with Mr. Balogun.' },
            { id: 'notif-2', event: 'Balance Receipt', channel: 'Email', timestamp: 'Jun 5, 2026 · 09:31 AM', details: 'Full payment tax invoice generated and dispatched.' },
        ],
    },
    {
        id: '5',
        orderNumber: 'CS-0087',
        createdAt: '2026-06-03T16:45:00Z',
        status: 'NEW',
        isOverdue: false,
        tailorAssigned: 'Samuelson (Master Tailor)',
        customer: CUSTOMERS_DIRECTORY[4],
        design: {
            id: 'd-5',
            name: 'Grand Agbada',
            category: 'Native Wear',
            image: '/images/design-agbada.jpg',
            isCustom: true,
            fabric: 'Swiss Voile Lace with Damask Yoke',
            colour: 'Ivory Cream & Champagne Gold',
            specialInstructions: 'Bespoke custom embroidery layout based on customer WhatsApp reference sketch.',
        },
        measurements: CUSTOMERS_DIRECTORY[4].savedMeasurements,
        details: {
            occasion: 'Diplomatic Embassy Reception Rome',
            deadline: '2026-06-25',
            deliveryLocation: 'Italy',
            fullAddress: 'Via dei Condotti 88, 00187 Roma, Italy',
            currency: 'EUR',
            estimatedDeliveryDate: '2026-06-22',
            additionalNotes: 'Requires express DHL courier to Rome embassy residence.',
        },
        payment: {
            totalNGN: 120000,
            totalEUR: 68,
            depositAmount: 34,
            depositStatus: 'UNPAID',
            balanceAmount: 34,
            balanceStatus: 'UNPAID',
            gateway: 'Stripe',
            referenceNumber: 'PENDING_DEPOSIT',
            balancePaymentLink: 'https://pay.captainstitches.com/deposit/cs-0087',
        },
        inspection: {
            photos: [],
            notes: 'Awaiting deposit verification before cutting expensive Swiss voile fabric.',
            isApproved: false,
        },
        adminNotes: [
            { id: 'an-1', author: 'Samuelson', text: 'Created manual order after WhatsApp consultation. Payment link sent.', timestamp: 'Jun 3, 2026 · 04:50 PM' },
        ],
        notifications: [
            { id: 'notif-1', event: 'Payment Link Generated', channel: 'WhatsApp', timestamp: 'Jun 3, 2026 · 04:52 PM', details: 'Deposit link sent to +39 320 994 5612.' },
        ],
    },
    {
        id: '6',
        orderNumber: 'CS-0086',
        createdAt: '2026-05-18T11:10:00Z',
        status: 'APPROVED',
        isOverdue: false,
        tailorAssigned: 'Ibrahim Musa',
        customer: CUSTOMERS_DIRECTORY[5],
        design: {
            id: 'd-6',
            name: 'Italian 3-Piece Suit',
            category: 'English Suits',
            image: '/images/design-suit.jpg',
            isCustom: false,
            fabric: 'Italian Tropical Wool 130s',
            colour: 'Slate Grey',
            specialInstructions: 'Hand-sewn pick stitching on lapels and ticket pocket.',
        },
        measurements: CUSTOMERS_DIRECTORY[5].savedMeasurements,
        details: {
            occasion: 'University Commencement Convocation',
            deadline: '2026-06-12',
            deliveryLocation: 'Italy',
            fullAddress: 'Via Guglielmo Marconi 12, 10125 Torino, Italy',
            currency: 'EUR',
            estimatedDeliveryDate: '2026-06-10',
            additionalNotes: 'Packaged in branded CaptainStitches garment carrier.',
        },
        payment: {
            totalNGN: 160000,
            totalEUR: 90,
            depositAmount: 45,
            depositStatus: 'PAID',
            depositPaidDate: 'May 18, 2026',
            balanceAmount: 45,
            balanceStatus: 'PAID',
            balancePaidDate: 'Jun 3, 2026',
            gateway: 'Stripe',
            referenceNumber: 'STR-991203-CS86',
            balancePaymentLink: 'https://pay.captainstitches.com/balance/cs-0086-bal',
        },
        inspection: {
            photos: ['/images/design-suit.jpg'],
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: 'Quality passed with flying colours. Seams pressed with industrial vacuum press.',
            approvedBy: 'Samuelson',
            approvedAt: 'Jun 3, 2026 · 03:40 PM',
            isApproved: true,
        },
        adminNotes: [
            { id: 'an-1', author: 'Samuelson', text: 'Quality approved. Waiting for courier handover scheduled for June 5.', timestamp: 'Jun 3, 2026 · 03:45 PM' },
        ],
        notifications: [
            { id: 'notif-1', event: 'Quality Passed Notice', channel: 'WhatsApp', timestamp: 'Jun 3, 2026 · 03:50 PM', details: 'Video preview sent to customer via WhatsApp with seal of approval.' },
        ],
    },
    {
        id: '7',
        orderNumber: 'CS-0085',
        createdAt: '2026-05-02T09:15:00Z',
        status: 'DELIVERED',
        isOverdue: false,
        tailorAssigned: 'Samuelson (Master Tailor)',
        customer: CUSTOMERS_DIRECTORY[6],
        design: {
            id: 'd-7',
            name: 'Double-Breasted Executive Suit',
            category: 'English Suits',
            image: '/images/design-suit.jpg',
            isCustom: false,
            fabric: 'Vitale Barberis Canonico Super 160s',
            colour: 'Rich Cocoa Brown',
            specialInstructions: 'Wide peaked lapels, double-breasted 6x2 closure with unconstructed shoulders.',
        },
        measurements: CUSTOMERS_DIRECTORY[6].savedMeasurements,
        details: {
            occasion: 'Salone del Mobile Opening Ceremony',
            deadline: '2026-05-25',
            deliveryLocation: 'Italy',
            fullAddress: 'Via Solferino 19, 20121 Milano, Italy',
            currency: 'EUR',
            estimatedDeliveryDate: '2026-05-22',
            additionalNotes: 'Customer requested doorstep hand delivery.',
        },
        payment: {
            totalNGN: 195000,
            totalEUR: 110,
            depositAmount: 55,
            depositStatus: 'PAID',
            depositPaidDate: 'May 2, 2026',
            balanceAmount: 55,
            balanceStatus: 'PAID',
            balancePaidDate: 'May 20, 2026',
            gateway: 'Stripe',
            referenceNumber: 'STR-772910-CS85',
            balancePaymentLink: 'https://pay.captainstitches.com/balance/cs-0085-bal',
        },
        inspection: {
            photos: ['/images/design-suit.jpg'],
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notes: 'Exquisite execution. Italian silhouette perfected.',
            approvedBy: 'Samuelson',
            approvedAt: 'May 19, 2026 · 10:00 AM',
            isApproved: true,
        },
        adminNotes: [
            { id: 'an-1', author: 'Samuelson', text: 'Gianluigi confirmed fitting is impeccable. Left a 5-star review.', timestamp: 'May 24, 2026 · 07:15 PM' },
        ],
        notifications: [
            { id: 'notif-1', event: 'Delivery Confirmed', channel: 'WhatsApp', timestamp: 'May 24, 2026 · 07:00 PM', details: 'Customer confirmed safe receipt.' },
        ],
    },
]

export const STAGES_PIPELINE: { key: OrderStatus; label: string; description: string; badgeColor: string; badgeBg: string }[] = [
    { key: 'NEW', label: 'New', description: 'Placed, awaiting deposit', badgeColor: '#92600A', badgeBg: '#FEF3CD' },
    { key: 'CONFIRMED', label: 'Confirmed', description: '50% deposit received', badgeColor: '#C4975A', badgeBg: '#FDF3E7' },
    { key: 'IN_PRODUCTION', label: 'In Production', description: 'Tailor actively crafting', badgeColor: '#7A4F2E', badgeBg: '#F5ECD9' },
    { key: 'INSPECTION', label: 'Inspection', description: 'Media uploaded, QC review', badgeColor: '#5C3820', badgeBg: '#E2C99E' },
    { key: 'APPROVED', label: 'Approved', description: 'Samuelson signed off', badgeColor: '#166534', badgeBg: '#DCFCE7' },
    { key: 'DISPATCHED', label: 'Dispatched', description: 'Shipped via courier', badgeColor: '#1D4ED8', badgeBg: '#DBEAFE' },
    { key: 'DELIVERED', label: 'Delivered', description: 'Customer confirmed receipt', badgeColor: '#4B5563', badgeBg: '#F3F4F6' },
]

const STORAGE_KEY = 'cs_admin_orders_store_v1'

export function getAllOrders(): AdminOrder[] {
    if (typeof window === 'undefined') return INITIAL_ADMIN_ORDERS
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_ORDERS))
            return INITIAL_ADMIN_ORDERS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ADMIN_ORDERS
    }
}

export function saveAllOrders(orders: AdminOrder[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(orders))
    } catch (e) {
        console.error('Failed to persist orders', e)
    }
}

export function getOrderById(id: string): AdminOrder | undefined {
    const orders = getAllOrders()
    return orders.find((o) => o.id === id || o.orderNumber.toLowerCase() === id.toLowerCase())
}

export function updateOrder(updatedOrder: AdminOrder): void {
    const orders = getAllOrders()
    const index = orders.findIndex((o) => o.id === updatedOrder.id)
    if (index !== -1) {
        orders[index] = updatedOrder
    } else {
        orders.unshift(updatedOrder)
    }
    saveAllOrders(orders)
}

export function updateOrderStatus(id: string, newStatus: OrderStatus): AdminOrder | undefined {
    const orders = getAllOrders()
    const target = orders.find((o) => o.id === id)
    if (target) {
        target.status = newStatus
        target.notifications.unshift({
            id: `notif-${Date.now()}`,
            event: `Status changed to ${newStatus}`,
            channel: 'WhatsApp',
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            details: `Order moved to stage ${newStatus} in admin operations.`,
        })
        saveAllOrders(orders)
    }
    return target
}

export function assignOrderTailor(id: string, tailorName: string): AdminOrder | undefined {
    const orders = getAllOrders()
    const target = orders.find((o) => o.id === id)
    if (target) {
        target.tailorAssigned = tailorName
        target.adminNotes.unshift({
            id: `an-${Date.now()}`,
            author: 'Samuelson',
            text: `Assigned tailor to ${tailorName}.`,
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
        })
        saveAllOrders(orders)
    }
    return target
}
