import {
    PrismaClient,
    UserRole,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting CaptainStitches clean database initialization...')

    // 1. Clear all existing records in proper relational order
    await prisma.orderTimelineEvent.deleteMany()
    await prisma.payment.deleteMany()
    await prisma.orderNotification.deleteMany()
    await prisma.review.deleteMany()
    await prisma.referral.deleteMany()
    await prisma.order.deleteMany()
    await prisma.measurement.deleteMany()
    await prisma.designPhoto.deleteMany()
    await prisma.design.deleteMany()
    await prisma.subscriber.deleteMany()
    await prisma.emailCampaign.deleteMany()
    await prisma.blogPost.deleteMany()
    await prisma.customer.deleteMany()
    await prisma.session.deleteMany()
    await prisma.auditLog.deleteMany()
    await prisma.user.deleteMany()
    await prisma.subscriptionTier.deleteMany()
    await prisma.appSettings.deleteMany()

    console.log('🧹 Cleaned existing tables.')

    // 2. Initialize Single Super Admin User
    const passwordHash = await bcrypt.hash('CaptainStitches2026!', 10)

    const samuelson = await prisma.user.create({
        data: {
            id: 'usr-samuelson',
            firstName: 'Samuelson',
            lastName: 'Anaele',
            displayName: 'Samuelson Anaele',
            email: 'samuelson@captainstitches.com',
            passwordHash,
            phone: '+39 345 678 9012',
            whatsApp: '+39 345 678 9012',
            role: UserRole.SUPER_ADMIN,
            avatarInitials: 'SA',
            avatarColor: '#C4975A',
            isActive: true,
            location: 'Verona Atelier',
        },
    })

    console.log(`👤 Initialized Super Admin: ${samuelson.displayName} (${samuelson.email})`)

    // 3. Seed Core Catalogue Designs
    const designsData = [
        {
            slug: 'monarch-agbada',
            sku: 'CS-NAT-AGB-001',
            category: 'NATIVE_WEAR' as const,
            turnaroundDays: 14,
            priceNGN: 220000,
            priceEUR: 150,
            pricingNote: 'Includes full 3-piece tailoring & DHL courier',
            nameEN: 'Monarch Agbada',
            descriptionEN: 'Hand-embroidered 3-piece grand boubou in presidential cashmere with metallic gold filigree.',
            fabricOptionsEN: ['Presidential Cashmere', 'Super 150s Wool', 'Italian Linen', 'Royal Guinea Brocade'],
            colourOptionsEN: ['Midnight Black|#1C1C1C', 'Emerald Green|#10B981', 'Royal Blue|#1E3A8A', 'Burgundy Wine|#58111A'],
            nameIT: 'Monarch Agbada Reale',
            descriptionIT: 'Agbada 3 pezzi su misura con ricami artigianali in filo dorato e cashmere presidenziale.',
            fabricOptionsIT: ['Cashmere Presidenziale', 'Lana Super 150s', 'Lino Italiano', 'Brocato Guinea'],
            colourOptionsIT: ['Nero Notte|#1C1C1C', 'Verde Smeraldo|#10B981', 'Blu Reale|#1E3A8A', 'Rosso Borgogna|#58111A'],
            isFeatured: true,
            isVisible: true,
            sortOrder: 1,
            photos: ['/images/design-agbada.jpg'],
        },
        {
            slug: 'emerald-kaftan',
            sku: 'CS-NAT-KAF-002',
            category: 'NATIVE_WEAR' as const,
            turnaroundDays: 10,
            priceNGN: 160000,
            priceEUR: 110,
            pricingNote: 'Includes matching kaftan top and tailored trousers',
            nameEN: 'Emerald Danshiki Kaftan',
            descriptionEN: 'Contemporary Nigerian kaftan crafted with subtle gold geometric collar stitching.',
            fabricOptionsEN: ['Italian Linen', 'Luxury Crepe', 'Presidential Cashmere'],
            colourOptionsEN: ['Emerald Green|#10B981', 'Royal Ivory|#FAF5EA', 'Midnight Black|#1C1C1C'],
            nameIT: 'Caftano Danshiki Smeraldo',
            descriptionIT: 'Caftano nigeriano contemporaneo con ricami geometrici dorati al colletto.',
            fabricOptionsIT: ['Lino Italiano', 'Crepe di Lusso', 'Cashmere Presidenziale'],
            colourOptionsIT: ['Verde Smeraldo|#10B981', 'Avorio Reale|#FAF5EA', 'Nero Notte|#1C1C1C'],
            isFeatured: true,
            isVisible: true,
            sortOrder: 2,
            photos: ['/images/design-kaftan.jpg'],
        },
        {
            slug: 'regal-senator',
            sku: 'CS-NAT-SEN-003',
            category: 'NATIVE_WEAR' as const,
            turnaroundDays: 12,
            priceNGN: 180000,
            priceEUR: 125,
            pricingNote: 'Two-piece bespoke senator suit with Italian buttons',
            nameEN: 'Regal Senator Suit',
            descriptionEN: 'Two-piece tailored senator attire featuring clean front panel lines and Italian horn buttons.',
            fabricOptionsEN: ['Super 150s Wool', 'Presidential Cashmere', 'Italian Linen'],
            colourOptionsEN: ['Navy Blue|#0B2240', 'Charcoal Grey|#374151', 'Burgundy Wine|#58111A'],
            nameIT: 'Completo Senator Reale',
            descriptionIT: 'Abito senatore sartoriale a due pezzi con bottoni in corno italiano.',
            fabricOptionsIT: ['Lana Super 150s', 'Cashmere Presidenziale', 'Lino Italiano'],
            colourOptionsIT: ['Blu Navy|#0B2240', 'Grigio Antracite|#374151', 'Rosso Borgogna|#58111A'],
            isFeatured: true,
            isVisible: true,
            sortOrder: 3,
            photos: ['/images/design-senator.jpg'],
        },
    ]

    for (const d of designsData) {
        const { photos, ...rest } = d
        await prisma.design.create({
            data: {
                ...rest,
                photos: {
                    create: photos.map((url, idx) => ({
                        url,
                        isPrimary: idx === 0,
                        sortOrder: idx + 1,
                    })),
                },
            },
        })
    }

    console.log(`👗 Seeded ${designsData.length} core catalogue designs (Monarch Agbada, Emerald Kaftan, Regal Senator).`)

    // 4. Seed Canonical Delivered Order CS-0092 (Daniel Nwokocha)
    const monarchDb = await prisma.design.findFirst({ where: { slug: 'monarch-agbada' } })
    const danielCustomer = await prisma.customer.create({
        data: {
            firstName: 'Daniel',
            lastName: 'Nwokocha',
            email: 'gurudanito001@gmail.com',
            phone: '+2348140715723',
            whatsapp: '+2348140715723',
            deliveryLocation: 'NIGERIA' as const,
            deliveryAddress: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
            preferredCurrency: 'NGN' as const,
        },
    })

    const order0092 = await prisma.order.create({
        data: {
            orderNumber: 'CS-0092',
            customerId: danielCustomer.id,
            designId: monarchDb?.id,
            status: 'DELIVERED' as const,
            deliveryLocation: 'NIGERIA' as const,
            deliveryAddress: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
            occasion: 'Brother Wedding (Groom Attire)',
            deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            estimatedDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            fabricChoice: 'Presidential Cashmere',
            colourChoice: 'Teal Green',
            customDesignNotes: 'Teal Green 3-Piece Agbada with Gold Filigree',
            currency: 'NGN' as const,
            totalAmount: 220000,
            depositAmount: 110000,
            balanceAmount: 110000,
            depositPaid: true,
            balancePaid: true,
            courierName: 'DHL Express',
            trackingNumber: 'DHL-NG-88992211',
            trackingUrl: 'https://www.dhl.com/en/express/tracking.html?AWB=DHL-NG-88992211',
            inspectionMediaUrls: ['/images/design-agbada.jpg'],
            inspectionVideoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
            inspectionNotes: 'Gold metallic filigree embroidery verified. Seam allowances checked for comfort.',
            measurementSnapshot: {
                unit: 'cm',
                neck: '43.0',
                shoulder: '49.0',
                chest: '106.0',
                sleeve: '66.0',
                shirtLength: '96.0',
                waist: '90.0',
                hip: '104.0',
                trouserLength: '106.0',
            },
            timeline: {
                create: [
                    {
                        toStatus: 'NEW' as const,
                        actorName: 'Client Portal',
                        notes: 'Commission initialized online by Daniel Nwokocha.',
                    },
                    {
                        toStatus: 'CONFIRMED' as const,
                        actorName: 'Paystack Gateway',
                        notes: '50% deposit confirmed. Measurements validated by Verona cutter.',
                    },
                    {
                        toStatus: 'IN_PRODUCTION' as const,
                        actorName: 'Nigeria Workshop',
                        notes: 'Cashmere chalking and gold metallic embroidery in progress.',
                    },
                    {
                        toStatus: 'INSPECTION' as const,
                        actorName: 'Quality Lead',
                        notes: 'Attire completed. HD inspection photos and video uploaded.',
                    },
                    {
                        toStatus: 'APPROVED' as const,
                        actorName: 'Samuelson Anaele',
                        notes: 'Approved by Master Tailor Samuelson. Balance paid.',
                    },
                    {
                        toStatus: 'DISPATCHED' as const,
                        actorName: 'DHL Express',
                        notes: 'Air freight tracking DHL-NG-88992211 active.',
                    },
                    {
                        toStatus: 'DELIVERED' as const,
                        actorName: 'DHL Courier',
                        notes: 'Package successfully delivered and received in Lekki, Lagos.',
                    },
                ],
            },
        },
    })

    console.log(`📦 Seeded Canonical Delivered Order: ${order0092.orderNumber} for ${danielCustomer.firstName} ${danielCustomer.lastName}.`)
    console.log('✨ Clean database ready for fresh data creation.')
}

main()
    .catch((e) => {
        console.error('❌ Error initializing database:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
