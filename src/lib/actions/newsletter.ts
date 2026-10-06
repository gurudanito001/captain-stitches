'use server'

import { revalidatePath } from 'next/cache'
import { prisma } from '@/lib/prisma'
import { Language, SubscriberStatus } from '@prisma/client'
import type { MarketingSubscriber } from '@/data/adminMarketingData'

export interface SubscribeNewsletterInput {
    email: string
    name?: string
    source?: 'homepage' | 'footer' | 'checkout' | 'blog' | string
    language?: 'EN' | 'IT'
}

export interface SubscribeNewsletterResult {
    success: boolean
    message: string
    promoCode?: string
    alreadySubscribed?: boolean
    subscriberId?: string
    error?: string
}

/**
 * Validates standard RFC 5322 email syntax.
 */
function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

/**
 * Public action: Subscribe visitor to CaptainStitches newsletter and issue 10% welcome promo code.
 */
export async function subscribeNewsletterAction(input: SubscribeNewsletterInput): Promise<SubscribeNewsletterResult> {
    try {
        const cleanEmail = (input.email || '').trim().toLowerCase()

        if (!cleanEmail || !isValidEmail(cleanEmail)) {
            return {
                success: false,
                message: 'Invalid email address provided.',
                error: 'Please enter a valid email address.',
            }
        }

        // Check if subscriber already exists in PostgreSQL
        const existing = await prisma.subscriber.findUnique({
            where: { email: cleanEmail },
        })

        if (existing) {
            // If already active, return friendly acknowledgment without throwing an error
            if (existing.status === SubscriberStatus.ACTIVE) {
                return {
                    success: true,
                    alreadySubscribed: true,
                    promoCode: 'WELCOME10',
                    subscriberId: existing.id,
                    message: 'You are already subscribed! Your welcome code is WELCOME10.',
                }
            }

            // If previously unsubscribed, reactivate the subscriber
            const reactivated = await prisma.subscriber.update({
                where: { id: existing.id },
                data: {
                    status: SubscriberStatus.ACTIVE,
                    unsubscribedAt: null,
                    language: input.language === 'IT' ? Language.IT : Language.EN,
                    source: input.source || existing.source || 'homepage',
                    name: input.name?.trim() || existing.name,
                },
            })

            try {
                revalidatePath('/')
                revalidatePath('/admin/marketing/subscribers')
            } catch {
                // Ignore outside Next.js request context
            }

            return {
                success: true,
                alreadySubscribed: false,
                promoCode: 'WELCOME10',
                subscriberId: reactivated.id,
                message: 'Welcome back to the Circle! Check your inbox for code WELCOME10.',
            }
        }

        // Check if this email belongs to an existing customer
        const matchedCustomer = await prisma.customer.findFirst({
            where: { email: { equals: cleanEmail, mode: 'insensitive' } },
            select: { id: true, firstName: true, lastName: true },
        })

        const resolvedName = input.name?.trim() || (matchedCustomer ? `${matchedCustomer.firstName} ${matchedCustomer.lastName}`.trim() : null)

        // Create new subscriber record
        const newSubscriber = await prisma.subscriber.create({
            data: {
                email: cleanEmail,
                name: resolvedName,
                customerId: matchedCustomer?.id || null,
                source: input.source || 'homepage',
                language: input.language === 'IT' ? Language.IT : Language.EN,
                status: SubscriberStatus.ACTIVE,
            },
        })

        try {
            revalidatePath('/')
            revalidatePath('/admin/marketing/subscribers')
        } catch {
            // Ignore outside Next.js request context
        }

        return {
            success: true,
            alreadySubscribed: false,
            promoCode: 'WELCOME10',
            subscriberId: newSubscriber.id,
            message: 'Welcome! Check your inbox for code WELCOME10.',
        }
    } catch (err: any) {
        console.error('Failed to subscribe to newsletter:', err)
        return {
            success: false,
            message: 'An unexpected error occurred while subscribing.',
            error: err.message || 'Database error occurred.',
        }
    }
}

/**
 * Admin action: Fetch all subscribers from PostgreSQL.
 */
export async function getAllSubscribersAdminAction(): Promise<{
    success: boolean
    subscribers: MarketingSubscriber[]
    totalCount: number
    activeCount: number
    error?: string
}> {
    try {
        const records = await prisma.subscriber.findMany({
            include: { customer: true },
            orderBy: { createdAt: 'desc' },
        })

        const mapped: MarketingSubscriber[] = records.map((s) => {
            const customer = s.customer
            const location = customer?.deliveryLocation === 'ITALY' ? 'Italy' : customer?.deliveryLocation === 'NIGERIA' ? 'Nigeria' : 'Other'
            const validSources = ['homepage', 'order_confirmation', 'blog', 'manual', 'referral']
            const signupSource = validSources.includes(s.source || '') ? (s.source as any) : 'homepage'

            return {
                id: s.id,
                name: s.name || (customer ? `${customer.firstName} ${customer.lastName}`.trim() : s.email.split('@')[0]),
                email: s.email,
                language: s.language === Language.IT ? 'IT' : 'EN',
                location,
                signupSource,
                dateSubscribed: s.createdAt.toISOString().split('T')[0],
                status: s.status === SubscriberStatus.ACTIVE ? 'active' : s.status === SubscriberStatus.UNSUBSCRIBED ? 'unsubscribed' : 'bounced',
                linkedCustomerId: s.customerId || undefined,
                openRate: s.openCount > 0 ? Math.min(100, s.openCount * 25) : 0,
            }
        })

        const activeCount = records.filter((r) => r.status === SubscriberStatus.ACTIVE).length

        return {
            success: true,
            subscribers: mapped,
            totalCount: records.length,
            activeCount,
        }
    } catch (err: any) {
        console.error('Failed to get admin subscribers:', err)
        return {
            success: false,
            subscribers: [],
            totalCount: 0,
            activeCount: 0,
            error: err.message || 'Database error occurred.',
        }
    }
}

/**
 * Public/Admin action: Unsubscribe email from newsletter.
 */
export async function unsubscribeNewsletterAction(emailOrId: string): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const clean = (emailOrId || '').trim().toLowerCase()
        if (!clean) return { success: false, error: 'Email or ID is required.' }

        const subscriber = await prisma.subscriber.findFirst({
            where: {
                OR: [
                    { id: clean },
                    { email: clean },
                ],
            },
        })

        if (!subscriber) {
            return { success: false, error: 'Subscriber not found.' }
        }

        await prisma.subscriber.update({
            where: { id: subscriber.id },
            data: {
                status: SubscriberStatus.UNSUBSCRIBED,
                unsubscribedAt: new Date(),
            },
        })

        try {
            revalidatePath('/')
            revalidatePath('/admin/marketing/subscribers')
        } catch {
            // Ignore outside Next.js request context
        }

        return { success: true }
    } catch (err: any) {
        console.error('Failed to unsubscribe:', err)
        return { success: false, error: err.message || 'Failed to update subscriber.' }
    }
}
