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
