import {
    PrismaClient,
    UserRole,
    OrderStatus,
    DeliveryLocation,
    Language,
    Currency,
    PaymentGateway,
    PaymentStatus,
    PaymentType,
    ReviewStatus,
    SubscriberStatus,
    DesignCategory,
} from '@prisma/client'
import bcrypt from 'bcryptjs'

import { INITIAL_CATALOGUE_DESIGNS } from '../src/data/adminCatalogueData'
import { INITIAL_ADMIN_CUSTOMERS } from '../src/data/adminCustomersData'
import { INITIAL_ADMIN_ORDERS, TAILORS_ROSTER } from '../src/data/adminOrdersData'
import { INITIAL_ADMIN_REVIEWS } from '../src/data/adminReviewsData'
import { INITIAL_SUBSCRIBERS } from '../src/data/adminMarketingData'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting CaptainStitches Atelier database seed...')

    // 1. Clear existing records in proper relational order
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

    // 2. Seed Admin & Tailor Users
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

    console.log(`👤 Created Super Admin: ${samuelson.displayName}`)

    // Create tailors
    const tailorIdMap = new Map<string, string>()
    for (const t of TAILORS_ROSTER) {
        const parts = t.name.split(' ')
        const createdTailor = await prisma.user.create({
            data: {
                id: `usr-${t.id}`,
                firstName: parts[0] || t.name,
                lastName: parts.slice(1).join(' ') || 'Tailor',
                displayName: t.name,
                email: `${t.name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@captainstitches.com`,
                passwordHash,
                phone: '+234 803 123 4567',
                role: UserRole.MASTER_TAILOR,
                avatarInitials: t.name.split(' ').map(n => n[0]).join(''),
                avatarColor: '#1C0F07',
                isActive: true,
                location: t.location,
            },
        })
        tailorIdMap.set(t.name, createdTailor.id)
    }

    console.log(`✂️ Seeded ${TAILORS_ROSTER.length} artisan tailors.`)

    // 3. Seed Catalogue Garment Designs (24 Foundation Designs)
    const categoryMap: Record<string, DesignCategory> = {
        'Native Wear': DesignCategory.NATIVE_WEAR,
        'English Suits': DesignCategory.ENGLISH_SUIT,
        'Casual Wear': DesignCategory.CASUAL,
        "Children's": DesignCategory.CHILDRENS,
    }

    const designIdMap = new Map<string, string>()
    for (const d of INITIAL_CATALOGUE_DESIGNS) {
        const cat = categoryMap[d.categoryLabel] || DesignCategory.NATIVE_WEAR
        const createdDesign = await prisma.design.create({
            data: {
                id: d.id,
                slug: d.slug,
                sku: `CS-${d.id.toUpperCase()}`,
                category: cat,
                isFeatured: d.isFeatured,
                isVisible: d.isVisible,
                sortOrder: 0,
                turnaroundDays: d.turnaroundDays,
                priceEUR: d.pricing.priceEUR,
                priceNGN: d.pricing.priceNGN,
                nameEN: d.contentEN.name,
                descriptionEN: d.contentEN.description,
                fabricOptionsEN: d.fabrics,
                colourOptionsEN: ['Midnight Navy', 'Emerald Green', 'Obsidian Black', 'Burgundy Wine'],
                nameIT: d.contentIT.name,
                descriptionIT: d.contentIT.description,
                fabricOptionsIT: d.fabrics,
                colourOptionsIT: ['Blu Notte', 'Verde Smeraldo', 'Nero Ossidiana', 'Bordeaux'],
                photos: {
                    create: d.photos.map((p, idx) => ({
                        url: p.url,
                        altText: p.caption || d.contentEN.name,
                        sortOrder: idx,
                        isPrimary: idx === 0,
                    })),
                },
            },
        })
        designIdMap.set(d.id, createdDesign.id)
    }

    console.log(`👗 Seeded ${INITIAL_CATALOGUE_DESIGNS.length} foundation lookbook designs.`)

    // 4. Seed Customers with Master Centimeter Measurements
    for (const c of INITIAL_ADMIN_CUSTOMERS) {
        const parts = c.name.split(' ')
        const createdCustomer = await prisma.customer.create({
            data: {
                id: c.id,
                firstName: parts[0] || c.name,
                lastName: parts.slice(1).join(' ') || 'Patron',
                email: c.email,
                phone: c.phone,
                whatsapp: c.whatsapp,
                deliveryLocation: c.location === 'Italy' ? DeliveryLocation.ITALY : DeliveryLocation.NIGERIA,
                deliveryAddress: c.address,
                preferredLang: c.language?.toLowerCase() === 'it' ? Language.IT : Language.EN,
                preferredCurrency: c.currency === 'NGN' ? Currency.NGN : Currency.EUR,
            },
        })

        // Measurement profile
        if (c.measurements) {
            await prisma.measurement.create({
                data: {
                    customerId: createdCustomer.id,
                    chest: c.measurements.chest || 104,
                    shoulder: c.measurements.shoulder || 47,
                    sleeveLength: c.measurements.sleeve || 64,
                    waist: c.measurements.waist || 88,
                    hips: c.measurements.hips || 102,
                    inseam: c.measurements.inseam || 82,
                    neck: c.measurements.neck || 41,
                    length: c.measurements.length || 145,
                    trouserLength: 106,
                    thigh: 62,
                    fitNotes: c.measurements.fitNotes || 'Prefers tailored Italian silhouette with comfort room.',
                },
            })
        }
    }

    console.log(`👥 Seeded ${INITIAL_ADMIN_CUSTOMERS.length} patrons with tailored measurements.`)

    // 5. Seed Bespoke Orders & Production Timelines
    const orderStatusMap: Record<string, OrderStatus> = {
        NEW: OrderStatus.NEW,
        CONFIRMED: OrderStatus.CONFIRMED,
        IN_PRODUCTION: OrderStatus.IN_PRODUCTION,
        INSPECTION: OrderStatus.INSPECTION,
        APPROVED: OrderStatus.APPROVED,
        DISPATCHED: OrderStatus.DISPATCHED,
        DELIVERED: OrderStatus.DELIVERED,
    }

    const createdOrderIds: string[] = []
    for (const o of INITIAL_ADMIN_ORDERS) {
        const customerId = o.customer?.id
        if (!customerId) continue

        const custExists = await prisma.customer.findUnique({ where: { id: customerId } })
        if (!custExists) continue

        const tailorUserId = tailorIdMap.get(o.tailorAssigned) || null
        const targetDesignId = designIdMap.get(o.design?.id || '') || null
        const statusEnum = orderStatusMap[o.status] || OrderStatus.NEW

        const createdOrder = await prisma.order.create({
            data: {
                id: `order-${o.id}`,
                orderNumber: o.orderNumber,
                customerId: customerId,
                designId: targetDesignId,
                tailorId: tailorUserId,
                status: statusEnum,
                deliveryLocation: o.details?.deliveryLocation === 'Italy' ? DeliveryLocation.ITALY : DeliveryLocation.NIGERIA,
                deliveryAddress: o.details?.fullAddress || 'Atelier Collection Point',
                occasion: o.details?.occasion || 'Black Tie Gala',
                deadline: o.details?.deadline ? new Date(o.details.deadline) : null,
                estimatedDelivery: o.details?.estimatedDeliveryDate ? new Date(o.details.estimatedDeliveryDate) : null,
                currency: o.details?.currency === 'NGN' ? Currency.NGN : Currency.EUR,
                totalAmount: o.payment?.totalEUR || 180,
                depositAmount: o.payment?.depositAmount || 120,
                balanceAmount: o.payment?.balanceAmount || 60,
                depositPaid: o.payment?.depositStatus === 'PAID',
                balancePaid: o.payment?.balanceStatus === 'PAID',
                fabricChoice: o.design?.fabric || 'Super 150s Italian Wool',
                colourChoice: o.design?.colour || 'Midnight Navy',
                inspectionNotes: o.inspection?.notes || null,
                inspectionApprovedAt: o.inspection?.isApproved ? new Date() : null,
                courierName: 'DHL Express',
                trackingNumber: 'DHL-9842198031',
                trackingUrl: 'https://www.dhl.com/track?num=DHL-9842198031',
                createdAt: new Date(o.createdAt),
            },
        })
        createdOrderIds.push(createdOrder.id)

        // Initial payment record
        if (o.payment) {
            await prisma.payment.create({
                data: {
                    orderId: createdOrder.id,
                    gateway: PaymentGateway.PAYSTACK,
                    type: PaymentType.DEPOSIT,
                    status: o.payment.depositStatus === 'PAID' ? PaymentStatus.SUCCESS : PaymentStatus.PENDING,
                    currency: o.details?.currency === 'NGN' ? Currency.NGN : Currency.EUR,
                    amount: o.payment.depositAmount,
                    reference: `REF-DEP-${o.orderNumber}`,
                    paidAt: o.payment.depositStatus === 'PAID' ? new Date() : null,
                },
            })
        }

        // Timeline milestones
        await prisma.orderTimelineEvent.create({
            data: {
                orderId: createdOrder.id,
                toStatus: statusEnum,
                actorName: 'Concierge System',
                notes: `Client commissioned bespoke outfit ${o.orderNumber}.`,
                createdAt: new Date(o.createdAt),
            },
        })
    }

    console.log(`📦 Seeded ${createdOrderIds.length} bespoke orders with stage audit logs & payments.`)

    // 6. Seed Reviews
    for (let i = 0; i < INITIAL_ADMIN_REVIEWS.length; i++) {
        const r = INITIAL_ADMIN_REVIEWS[i]
        const orderId = createdOrderIds[i]
        const cust = await prisma.customer.findFirst()
        if (orderId && cust) {
            await prisma.review.create({
                data: {
                    id: r.id,
                    orderId: orderId,
                    customerId: cust.id,
                    rating: r.rating,
                    comment: r.comment,
                    status: r.status === 'APPROVED' ? ReviewStatus.APPROVED : r.status === 'PENDING' ? ReviewStatus.PENDING : ReviewStatus.REJECTED,
                },
            })
        }
    }

    console.log(`⭐ Seeded ${INITIAL_ADMIN_REVIEWS.length} customer reviews.`)

    // 7. Seed Subscribers
    for (const s of INITIAL_SUBSCRIBERS) {
        await prisma.subscriber.create({
            data: {
                id: s.id,
                email: s.email,
                name: s.name || null,
                status: s.status === 'active' ? SubscriberStatus.ACTIVE : SubscriberStatus.UNSUBSCRIBED,
                language: s.language === 'IT' ? Language.IT : Language.EN,
                source: s.signupSource || 'homepage',
            },
        })
    }

    console.log(`📬 Seeded ${INITIAL_SUBSCRIBERS.length} newsletter subscribers.`)

    // 8. Seed App Settings Singleton
    await prisma.appSettings.create({
        data: {
            id: 'singleton',
            businessName: 'CaptainStitches Atelier',
            businessEmail: 'concierge@captainstitches.com',
            whatsappNumber: '+39 345 678 9012',
            instagramHandle: '@captainstitches',
            veronaAddress: 'Via Giuseppe Mazzini 14, 37121 Verona, Italy',
            lagosAddress: 'Plot 12, Admiralty Way, Lekki Phase 1, Lagos, Nigeria',
            fxRateNGNToEUR: 0.00055,
            useLiveFxRate: false,
            depositPercent: 50,
            defaultTurnaroundDays: {
                NATIVE_WEAR: 14,
                ENGLISH_SUIT: 21,
                CASUAL: 10,
                CHILDRENS: 7,
            },
            subscriptionsEnabled: false,
            referralsEnabled: true,
        },
    })

    console.log('⚙️ Seeded App Settings singleton.')
    console.log('✅ CaptainStitches Atelier database seeding complete!')
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
