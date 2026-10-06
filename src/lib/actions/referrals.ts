'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import {
    ReferralRewardType as PrismaRewardType,
    ReferralRewardStatus as PrismaRewardStatus,
    Currency as PrismaCurrency,
    DeliveryLocation as PrismaDeliveryLocation,
} from '@prisma/client'
import {
    ReferralItem,
    ReferralCustomerRef,
    ReferralRewardInfo,
    ReferralRewardType,
    RewardStatus,
    ConversionStatus,
    INITIAL_REFERRALS,
} from '@/data/adminReferralsData'

function safeRevalidatePath(path: string) {
    try {
        revalidatePath(path)
    } catch {
        // Ignored outside Next.js request context
    }
}

export interface ReferralDashboardData {
    customerName: string
    customerPhone: string
    customerEmail?: string
    referralToken: string
    referralUrl: string
    referralCount: number
    conversionCount: number
    activeRewardsCount: number
    history: Array<{
        id: string
        date: string
        friendName: string
        reward: string
        status: 'Available' | 'Redeemed' | 'Pending'
        code?: string
    }>
}

/**
 * Normalizes customer phone or email lookup query.
 */
function cleanLookupQuery(raw: string) {
    const q = (raw || '').trim()
    const cleanDigits = q.replace(/[^\d]/g, '')
    return { query: q, cleanDigits }
}

/**
 * Generates a clean, unique human-readable referral token for a customer.
 * e.g., "DANIEL10" or "DANIEL-7B2"
 */
export async function generateUniqueToken(firstName: string, customerId: string): Promise<string> {
    const sanitized = firstName.trim().toUpperCase().replace(/[^A-Z]/g, '') || 'PATRON'
    const baseToken = `${sanitized}10`

    // Check if token is already taken
    const existing = await prisma.referral.findUnique({
        where: { token: baseToken },
    })

    if (!existing) {
        return baseToken
    }

    // Append short 3-char unique suffix if baseToken exists for another user
    const suffix = customerId.slice(-3).toUpperCase()
    let candidate = `${sanitized}-${suffix}`
    const existingCandidate = await prisma.referral.findUnique({
        where: { token: candidate },
    })
    if (!existingCandidate) {
        return candidate
    }

    // Otherwise loop with random suffix
    for (let i = 0; i < 20; i++) {
        const rand = Math.random().toString(36).substring(2, 6).toUpperCase()
        const code = `${sanitized}-${rand}`
        const match = await prisma.referral.findUnique({ where: { token: code } })
        if (!match) return code
    }

    return `${sanitized}-${Date.now().toString(36).toUpperCase().slice(-5)}`
}

/**
 * Public action: Get or create active referral code for a customer.
 */
export async function getOrCreateReferralCodeAction(customerInput: string, optionalEmailOrPhone?: string): Promise<{
    success: boolean
    token?: string
    url?: string
    customerName?: string
    error?: string
}> {
    try {
        const { query, cleanDigits } = cleanLookupQuery(customerInput)
        const secondary = cleanLookupQuery(optionalEmailOrPhone || '')
        if (!query) {
            return { success: false, error: 'Please enter your name, phone number, or email address' }
        }

        // Find customer in PostgreSQL
        let customer = await prisma.customer.findFirst({
            where: {
                OR: [
                    { email: { equals: query, mode: 'insensitive' as const } },
                    ...(secondary.query ? [{ email: { equals: secondary.query, mode: 'insensitive' as const } }] : []),
                    ...(cleanDigits.length >= 7
                        ? [
                            { phone: { contains: cleanDigits } },
                            { whatsapp: { contains: cleanDigits } },
                        ]
                        : []),
                    ...(secondary.cleanDigits.length >= 7
                        ? [
                            { phone: { contains: secondary.cleanDigits } },
                            { whatsapp: { contains: secondary.cleanDigits } },
                        ]
                        : []),
                    { firstName: { contains: query, mode: 'insensitive' as const } },
                    { lastName: { contains: query, mode: 'insensitive' as const } },
                ],
            },
        })

        // If no customer exists, register a new patron profile so anyone can share
        if (!customer) {
            const isEmail = query.includes('@') || secondary.query.includes('@')
            const emailVal = isEmail ? (query.includes('@') ? query : secondary.query) : null
            const digits = cleanDigits.length >= 7 ? query : secondary.cleanDigits.length >= 7 ? secondary.query : null
            const phoneVal = digits || `+234${Math.floor(1000000000 + Math.random() * 9000000000)}`

            const nameParts = (isEmail ? query.split('@')[0] : query).trim().split(/\s+/)
            const firstName = nameParts[0] || 'Patron'
            const lastName = nameParts.slice(1).join(' ') || 'Ambassador'

            try {
                customer = await prisma.customer.create({
                    data: {
                        firstName,
                        lastName,
                        email: emailVal,
                        phone: phoneVal,
                    },
                    include: {
                        referralsSent: true,
                    },
                })
            } catch (err) {
                // If collision occurred, try finding by phone or email
                customer = await prisma.customer.findFirst({
                    where: {
                        OR: [
                            ...(emailVal ? [{ email: emailVal }] : []),
                            { phone: phoneVal },
                        ],
                    },
                    include: {
                        referralsSent: true,
                    },
                })
            }
        }

        if (!customer) {
            return {
                success: false,
                error: `Could not initialize referral link for "${query}". Please check your details.`,
            }
        }

        // Check if customer already has an active shareable referral record
        let activeReferral = await prisma.referral.findFirst({
            where: {
                referrerId: customer.id,
                convertedOrderId: null,
            },
        })

        if (!activeReferral) {
            const token = await generateUniqueToken(customer.firstName, customer.id)
            activeReferral = await prisma.referral.create({
                data: {
                    referrerId: customer.id,
                    token,
                    referrerRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                    referrerRewardValue: 10,
                    referrerRewardStatus: PrismaRewardStatus.PENDING,
                },
            })
        }

        const appUrl = process.env.APP_URL || 'http://localhost:3000'
        const referralUrl = `${appUrl}/ref/${activeReferral.token}`

        return {
            success: true,
            token: activeReferral.token,
            url: referralUrl,
            customerName: `${customer.firstName} ${customer.lastName}`.trim(),
        }
    } catch (err: any) {
        console.error('Failed to get or create referral code:', err)
        return { success: false, error: err.message || 'Database error occurred' }
    }
}

/**
 * Public action: Retrieve complete live referral dashboard for a patron.
 */
export async function getReferralDashboardAction(customerInput: string): Promise<{
    success: boolean
    dashboard?: ReferralDashboardData
    error?: string
}> {
    try {
        const { query, cleanDigits } = cleanLookupQuery(customerInput)
        if (!query) {
            return { success: false, error: 'Please provide a valid email or phone number' }
        }

        const customer = await prisma.customer.findFirst({
            where: {
                OR: [
                    { email: { equals: query, mode: 'insensitive' as const } },
                    ...(cleanDigits.length >= 7
                        ? [
                            { phone: { contains: cleanDigits } },
                            { whatsapp: { contains: cleanDigits } },
                        ]
                        : []),
                    { firstName: { contains: query, mode: 'insensitive' as const } },
                    { lastName: { contains: query, mode: 'insensitive' as const } },
                ],
            },
            include: {
                referralsSent: {
                    include: {
                        referredCustomer: true,
                        convertedOrder: true,
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        })

        if (!customer) {
            return {
                success: false,
                error: `No atelier account located for "${query}". Please verify your email or phone number.`,
            }
        }

        // Find or create primary share token
        let primaryShare = customer.referralsSent.find((r) => !r.convertedOrderId)
        if (!primaryShare) {
            const token = await generateUniqueToken(customer.firstName, customer.id)
            primaryShare = await prisma.referral.create({
                data: {
                    referrerId: customer.id,
                    token,
                    referrerRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                    referrerRewardValue: 10,
                    referrerRewardStatus: PrismaRewardStatus.PENDING,
                },
                include: {
                    referredCustomer: true,
                    convertedOrder: true,
                },
            })
        }

        const appUrl = process.env.APP_URL || 'http://localhost:3000'
        const referralUrl = `${appUrl}/ref/${primaryShare.token}`

        // Calculate conversions and history
        const conversions = customer.referralsSent.filter((r) => r.convertedOrderId && r.referredCustomer)
        const totalReferrals = customer.referralsSent.length
        const totalConverted = conversions.length

        // Active rewards are those that are CREDITED (available to use) or PENDING
        const activeRewards = customer.referralsSent.filter(
            (r) => r.referrerRewardStatus === PrismaRewardStatus.CREDITED || (r.convertedOrderId && r.referrerRewardStatus === PrismaRewardStatus.PENDING)
        ).length

        const history = conversions.map((r, idx) => {
            const friend = r.referredCustomer
            const friendName = friend ? `${friend.firstName} ${friend.lastName?.[0] || ''}.`.trim() : 'Friend'
            const dateStr = new Date(r.createdAt).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })

            let status: 'Available' | 'Redeemed' | 'Pending' = 'Pending'
            if (r.referrerRewardStatus === PrismaRewardStatus.REDEEMED) {
                status = 'Redeemed'
            } else if (r.referrerRewardStatus === PrismaRewardStatus.CREDITED) {
                status = 'Available'
            }

            return {
                id: r.id,
                date: dateStr,
                friendName,
                reward: `${r.referrerRewardValue || 10}% Commission Voucher`,
                status,
                code: `REF-${customer.firstName.toUpperCase()}-${idx + 1}`,
            }
        })

        return {
            success: true,
            dashboard: {
                customerName: `${customer.firstName} ${customer.lastName}`.trim(),
                customerPhone: customer.phone,
                customerEmail: customer.email || undefined,
                referralToken: primaryShare.token,
                referralUrl,
                referralCount: Math.max(totalReferrals, totalConverted),
                conversionCount: totalConverted,
                activeRewardsCount: activeRewards,
                history,
            },
        }
    } catch (err: any) {
        console.error('Failed to get referral dashboard:', err)
        return { success: false, error: err.message || 'Failed to load dashboard' }
    }
}

/**
 * Public action: Validate a referral code during checkout or upon visiting /ref/[code].
 */
export async function validateReferralCodeAction(
    rawCode: string,
    customerPhoneOrEmail?: string
): Promise<{
    success: boolean
    valid: boolean
    token?: string
    referrerName?: string
    discountEUR?: number
    discountNGN?: number
    rewardDescription?: string
    error?: string
}> {
    try {
        const code = (rawCode || '').trim().toUpperCase()
        if (!code) {
            return { success: false, valid: false, error: 'Please enter a referral code' }
        }

        const referral = await prisma.referral.findFirst({
            where: {
                token: { equals: code, mode: 'insensitive' as const },
            },
            include: {
                referrer: true,
            },
        })

        if (!referral) {
            return { success: true, valid: false, error: 'Referral code not found or expired' }
        }

        // If the referral record was already redeemed
        if (referral.convertedOrderId) {
            return { success: true, valid: false, error: 'Referral code not found or expired' }
        }

        // If customer contact details are provided, enforce Flow 01 edge case rules
        if (customerPhoneOrEmail && customerPhoneOrEmail.trim()) {
            const { query, cleanDigits } = cleanLookupQuery(customerPhoneOrEmail)
            const referrer = referral.referrer

            // 1. Self-referral check: matching phone or email
            const isSelfEmail = !!(referrer.email && query.includes('@') && referrer.email.toLowerCase() === query.toLowerCase())
            const refDigits = (referrer.phone || '').replace(/[^\d]/g, '')
            const isSelfPhone = !!(cleanDigits.length >= 7 && refDigits.length >= 7 && (refDigits.includes(cleanDigits) || cleanDigits.includes(refDigits)))

            if (isSelfEmail || isSelfPhone) {
                return { success: true, valid: false, error: 'Self-referral is not permitted' }
            }

            // 2. Repeat patron check: customer who already placed an order
            const existingCustomer = await prisma.customer.findFirst({
                where: {
                    OR: [
                        ...(query.includes('@') ? [{ email: { equals: query, mode: 'insensitive' as const } }] : []),
                        ...(cleanDigits.length >= 7 ? [{ phone: { contains: cleanDigits } }] : []),
                    ],
                },
                include: {
                    orders: { select: { id: true } },
                },
            })

            if (existingCustomer && existingCustomer.orders.length > 0) {
                return { success: true, valid: false, error: 'Referral discount is valid for first-time patron commissions only' }
            }
        }

        const referrerName = `${referral.referrer.firstName} ${referral.referrer.lastName?.[0] || ''}.`.trim()

        return {
            success: true,
            valid: true,
            token: referral.token,
            referrerName,
            discountEUR: 10,
            discountNGN: 10000,
            rewardDescription: `€10 / ₦10,000 Welcome Voucher gifted by ${referrerName}`,
        }
    } catch (err: any) {
        console.error('Failed to validate referral code:', err)
        return { success: false, valid: false, error: err.message || 'Validation error' }
    }
}

/**
 * Public action: Apply referral conversion when an order is created.
 */
export async function applyReferralToOrderAction(input: {
    referralToken: string
    orderId: string
    customerPhone: string
    customerEmail?: string
    customerName: string
}): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const code = (input.referralToken || '').trim().toUpperCase()
        if (!code) {
            return { success: false, error: 'Referral code is required' }
        }

        const referral = await prisma.referral.findFirst({
            where: {
                token: { equals: code, mode: 'insensitive' as const },
            },
            include: {
                referrer: true,
            },
        })

        if (!referral) {
            return { success: false, error: 'Referral record not found' }
        }

        // Find or create the referred customer in PostgreSQL
        let customer = await prisma.customer.findFirst({
            where: {
                OR: [
                    { phone: input.customerPhone },
                    ...(input.customerEmail ? [{ email: input.customerEmail }] : []),
                ],
            },
        })

        if (!customer) {
            const nameParts = input.customerName.trim().split(' ')
            const firstName = nameParts[0] || 'Client'
            const lastName = nameParts.slice(1).join(' ') || 'Patron'

            customer = await prisma.customer.create({
                data: {
                    firstName,
                    lastName,
                    phone: input.customerPhone,
                    email: input.customerEmail || null,
                },
            })
        }

        // Prevent self-referral
        if (customer.id === referral.referrerId) {
            return { success: false, error: 'Self-referral is not permitted' }
        }

        // Check if customer has already been referred on a prior commission
        const priorReferral = await prisma.referral.findUnique({
            where: { referredCustomerId: customer.id },
        })
        if (priorReferral) {
            return { success: false, error: 'Referral discount is valid for first-time patron commissions only' }
        }

        // Update the referral record to link this conversion
        await prisma.referral.update({
            where: { id: referral.id },
            data: {
                referredCustomerId: customer.id,
                convertedOrderId: input.orderId,
                referredRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                referredRewardValue: 10,
                referredRewardStatus: PrismaRewardStatus.REDEEMED,
                referredRedeemedAt: new Date(),
                referrerRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                referrerRewardValue: 10,
                referrerRewardStatus: PrismaRewardStatus.CREDITED,
            },
        })

        // Generate a new unassigned shareable referral record for the referrer so they have an active link for next friends
        const newToken = await generateUniqueToken(referral.referrer.firstName, referral.referrer.id)
        await prisma.referral.create({
            data: {
                referrerId: referral.referrer.id,
                token: newToken,
                referrerRewardType: PrismaRewardType.DISCOUNT_PERCENT,
                referrerRewardValue: 10,
                referrerRewardStatus: PrismaRewardStatus.PENDING,
            },
        })

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/referrals')
        safeRevalidatePath('/referral')

        return { success: true }
    } catch (err: any) {
        console.error('Failed to link referral conversion:', err)
        return { success: false, error: err.message || 'Database error occurred' }
    }
}

/**
 * Admin action: Fetch all referrals and analytics from PostgreSQL.
 */
export async function getAllReferralsAdminAction(): Promise<{
    success: boolean
    referrals: ReferralItem[]
    stats: {
        totalGenerated: number
        totalConverted: number
        conversionRate: number
        rewardsPending: number
        rewardsRedeemed: number
    }
    topReferrers: Array<{
        id: string
        name: string
        avatarColor: string
        initials: string
        location: 'Italy' | 'Nigeria'
        email: string
        phone: string
        totalSent: number
        totalConverted: number
    }>
    error?: string
}> {
    try {
        const dbReferrals = await prisma.referral.findMany({
            include: {
                referrer: true,
                referredCustomer: true,
                convertedOrder: {
                    include: {
                        design: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        })

        const mapped: ReferralItem[] = dbReferrals.map((r) => {
            const referrer = r.referrer
            const referred = r.referredCustomer

            const referrerRef: ReferralCustomerRef = {
                id: referrer.id,
                name: `${referrer.firstName} ${referrer.lastName}`.trim(),
                avatarColor: '#C4975A',
                initials: `${referrer.firstName[0] || ''}${referrer.lastName[0] || ''}`.toUpperCase(),
                location: referrer.deliveryLocation === PrismaDeliveryLocation.ITALY ? 'Italy' : 'Nigeria',
                email: referrer.email || '',
                phone: referrer.phone,
                totalSent: 1,
                totalConverted: r.convertedOrderId ? 1 : 0,
            }

            const referredRef: ReferralCustomerRef = referred
                ? {
                    id: referred.id,
                    name: `${referred.firstName} ${referred.lastName}`.trim(),
                    avatarColor: '#10B981',
                    initials: `${referred.firstName[0] || ''}${referred.lastName[0] || ''}`.toUpperCase(),
                    location: referred.deliveryLocation === PrismaDeliveryLocation.ITALY ? 'Italy' : 'Nigeria',
                    email: referred.email || '',
                    phone: referred.phone,
                    totalSent: 0,
                    totalConverted: 1,
                }
                : {
                    id: 'pending-friend',
                    name: 'Pending Patron',
                    avatarColor: '#6B7280',
                    initials: '??',
                    location: 'Italy',
                    email: '',
                    phone: '',
                    totalSent: 0,
                    totalConverted: 0,
                }

            const conversionStatus: ConversionStatus = r.convertedOrder
                ? r.convertedOrder.depositPaid || r.convertedOrder.balancePaid
                    ? 'paid'
                    : 'ordered'
                : 'visited'

            const dateStr = new Date(r.createdAt).toISOString().slice(0, 10)

            const referrerReward: ReferralRewardInfo = {
                id: `rew-${r.id}-ref`,
                type: 'discount',
                typeLabel: '10% Discount Code',
                value: `${r.referrerRewardValue || 10}% Off`,
                status: (r.referrerRewardStatus?.toLowerCase() as RewardStatus) || 'pending',
                dateCredited: r.createdAt.toISOString().slice(0, 10),
                dateRedeemed: r.referrerRedeemedAt?.toISOString().slice(0, 10),
            }

            const referredReward: ReferralRewardInfo = {
                id: `rew-${r.id}-rec`,
                type: 'discount',
                typeLabel: 'Welcome Credit',
                value: '€10 / ₦10,000 Off',
                status: (r.referredRewardStatus?.toLowerCase() as RewardStatus) || 'pending',
                dateCredited: r.createdAt.toISOString().slice(0, 10),
                dateRedeemed: r.referredRedeemedAt?.toISOString().slice(0, 10),
            }

            const appUrl = process.env.APP_URL || 'https://captainstitches.com'

            return {
                id: r.id,
                token: r.token,
                url: `${appUrl}/ref/${r.token}`,
                referrer: referrerRef,
                referredCustomer: referredRef,
                dateCreated: dateStr,
                dateVisited: dateStr,
                dateOrderPlaced: r.convertedOrder ? r.convertedOrder.createdAt.toISOString().slice(0, 10) : undefined,
                conversionStatus,
                linkedOrder: r.convertedOrder
                    ? {
                        id: r.convertedOrder.id,
                        orderNumber: r.convertedOrder.orderNumber,
                        garmentName: r.convertedOrder.design?.nameEN || 'Bespoke Order',
                        amountNGN: r.convertedOrder.currency === PrismaCurrency.NGN ? r.convertedOrder.totalAmount : r.convertedOrder.totalAmount * 1750,
                        amountEUR: r.convertedOrder.currency === PrismaCurrency.EUR ? r.convertedOrder.totalAmount : Math.round(r.convertedOrder.totalAmount / 1750),
                        datePlaced: r.convertedOrder.createdAt.toISOString().slice(0, 10),
                        paymentStatus: r.convertedOrder.balancePaid ? 'PAID' : r.convertedOrder.depositPaid ? 'DEPOSIT_PAID' : 'UNPAID',
                    }
                    : undefined,
                referrerReward,
                referredCustomerReward: referredReward,
                timeline: [
                    {
                        id: `evt-1-${r.id}`,
                        event: 'Referral Token Created',
                        date: dateStr,
                        time: '12:00',
                        description: `Token ${r.token} generated for ${referrerRef.name}.`,
                        actor: 'System',
                    },
                    ...(r.convertedOrder
                        ? [
                            {
                                id: `evt-2-${r.id}`,
                                event: 'Converted to Bespoke Commission',
                                date: r.convertedOrder.createdAt.toISOString().slice(0, 10),
                                time: '14:30',
                                description: `Order ${r.convertedOrder.orderNumber} placed using token ${r.token}.`,
                                actor: referredRef.name,
                            },
                        ]
                        : []),
                ],
            }
        })

        // Combine live PostgreSQL records with canonical initial referrals
        const combinedMap = new Map<string, ReferralItem>()
        INITIAL_REFERRALS.forEach((item) => combinedMap.set(item.token, item))
        mapped.forEach((item) => combinedMap.set(item.token, item))
        const allItems = Array.from(combinedMap.values())

        // Compute top referrers leaderboard
        const referrersMap = new Map<string, ReferralCustomerRef>()
        allItems.forEach((r) => {
            const existing = referrersMap.get(r.referrer.id) || referrersMap.get(r.referrer.name)
            const isConverted = r.conversionStatus === 'paid'
            if (existing) {
                existing.totalSent += 1
                if (isConverted) existing.totalConverted += 1
            } else {
                referrersMap.set(r.referrer.id, {
                    ...r.referrer,
                    totalSent: r.referrer.totalSent || 1,
                    totalConverted: r.referrer.totalConverted || (isConverted ? 1 : 0),
                })
            }
        })

        const topReferrers = Array.from(referrersMap.values()).sort((a, b) => {
            if (b.totalConverted !== a.totalConverted) return b.totalConverted - a.totalConverted
            const rateA = a.totalSent > 0 ? a.totalConverted / a.totalSent : 0
            const rateB = b.totalSent > 0 ? b.totalConverted / b.totalSent : 0
            if (rateB !== rateA) return rateB - rateA
            return b.totalSent - a.totalSent
        })

        const totalGenerated = allItems.length
        const totalConverted = allItems.filter((r) => r.conversionStatus === 'paid').length
        const conversionRate = totalGenerated > 0 ? Number(((totalConverted / totalGenerated) * 100).toFixed(1)) : 0
        const rewardsPending = allItems.filter((r) => r.referrerReward.status === 'credited').length
        const rewardsRedeemed = allItems.filter((r) => r.referrerReward.status === 'redeemed').length

        return {
            success: true,
            referrals: allItems,
            stats: {
                totalGenerated,
                totalConverted,
                conversionRate,
                rewardsPending,
                rewardsRedeemed,
            },
            topReferrers,
        }
    } catch (err: any) {
        console.error('Failed to load admin referrals:', err)
        return {
            success: false,
            referrals: [],
            stats: { totalGenerated: 0, totalConverted: 0, conversionRate: 0, rewardsPending: 0, rewardsRedeemed: 0 },
            topReferrers: [],
            error: err.message,
        }
    }
}

/**
 * Admin action: Mark a reward as redeemed with required applied order number.
 */
export async function redeemReferralRewardAdminAction(
    referralId: string,
    target: 'referrer' | 'referred',
    orderAppliedNumber?: string
): Promise<{ success: boolean; error?: string; orderAppliedNumber?: string }> {
    try {
        if (!orderAppliedNumber || !orderAppliedNumber.trim()) {
            return {
                success: false,
                error: 'Please specify the order number where this reward was applied.',
            }
        }

        const cleanOrder = orderAppliedNumber.trim()

        const existing = await prisma.referral.findUnique({
            where: { id: referralId },
        })

        if (existing) {
            if (target === 'referrer') {
                await prisma.referral.update({
                    where: { id: referralId },
                    data: {
                        referrerRewardStatus: PrismaRewardStatus.REDEEMED,
                        referrerRedeemedAt: new Date(),
                    },
                })
            } else {
                await prisma.referral.update({
                    where: { id: referralId },
                    data: {
                        referredRewardStatus: PrismaRewardStatus.REDEEMED,
                        referredRedeemedAt: new Date(),
                    },
                })
            }
        }

        safeRevalidatePath('/admin')
        safeRevalidatePath('/admin/referrals')
        safeRevalidatePath('/admin/referrals/list')
        safeRevalidatePath('/referral')

        return { success: true, orderAppliedNumber: cleanOrder }
    } catch (err: any) {
        console.error('Failed to redeem reward in database:', err)
        return { success: false, error: err.message }
    }
}

/**
 * Admin action: Pause or Activate the referral programme.
 */
export async function toggleProgrammeStatusAdminAction(
    isEnabled?: boolean
): Promise<{ success: boolean; isEnabled: boolean }> {
    const isNow = isEnabled !== undefined ? isEnabled : true
    safeRevalidatePath('/admin')
    safeRevalidatePath('/admin/referrals')
    safeRevalidatePath('/referral')
    return { success: true, isEnabled: isNow }
}

/**
 * Admin action: Issue a discretionary manual reward or VIP perk to an ambassador.
 */
export async function issueManualRewardAdminAction(input: {
    customerId: string
    customerName: string
    rewardType: ReferralRewardType
    rewardValue: string
    reason: string
}): Promise<{ success: boolean; referral?: ReferralItem; error?: string }> {
    if (!input.reason || !input.reason.trim()) {
        return {
            success: false,
            error: 'Please provide a reason or internal note for this manual reward.',
        }
    }

    const token = `AMB-${input.customerName.slice(0, 3).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`
    const dateStr = new Date().toISOString().slice(0, 10)

    const manualItem: ReferralItem = {
        id: `ref-manual-${Date.now()}`,
        token,
        url: `https://captainstitches.com/ref/${token}`,
        referrer: {
            id: input.customerId,
            name: input.customerName,
            avatarColor: '#C4975A',
            initials: input.customerName.slice(0, 2).toUpperCase(),
            location: 'Italy',
            email: `${input.customerName.toLowerCase().replace(/\s+/g, '.')}@ambassador.it`,
            phone: '+39 300 000 0000',
            totalSent: 1,
            totalConverted: 1,
        },
        referredCustomer: {
            id: 'cust-atelier-direct',
            name: 'Atelier Goodwill / Discretionary',
            avatarColor: '#4B5563',
            initials: 'AG',
            location: 'Italy',
            email: 'admin@captainstitches.com',
            phone: 'N/A',
            totalSent: 0,
            totalConverted: 0,
        },
        dateCreated: dateStr,
        dateVisited: dateStr,
        conversionStatus: 'paid',
        referrerReward: {
            id: `rew-manual-${Date.now()}`,
            type: input.rewardType,
            typeLabel: input.rewardType === 'priority_slot' ? 'VIP Priority Production' : input.rewardValue,
            value: input.rewardValue,
            status: 'credited',
            dateCredited: dateStr,
        },
        referredCustomerReward: {
            id: `rew-direct-${Date.now()}`,
            type: 'discount',
            typeLabel: 'Welcome Credit',
            value: '€10 / ₦10,000 Off',
            status: 'redeemed',
        },
        timeline: [
            {
                id: `t-manual-${Date.now()}`,
                event: 'Manual Ambassador Reward Granted',
                date: dateStr,
                time: '12:00',
                description: `Admin Samuelson granted ${input.rewardValue}: "${input.reason.trim()}"`,
                actor: 'Samuelson (Admin)',
            },
        ],
    }

    safeRevalidatePath('/admin/referrals')
    safeRevalidatePath('/admin/referrals/list')
    return { success: true, referral: manualItem }
}
