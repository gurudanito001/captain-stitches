'use server'

import { cookies, headers } from 'next/headers'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

const ADMIN_COOKIE_NAME = 'cs_admin_session'

export interface LoginResult {
    success: boolean
    error?: string
    redirectUrl?: string
    user?: {
        id: string
        email: string
        displayName: string
        role: string
    }
}

export interface SessionValidationResult {
    authenticated: boolean
    user?: {
        id: string
        email: string
        displayName: string
        role: string
        avatarInitials?: string | null
        avatarColor?: string | null
    }
}

/**
 * Authenticates an administrator, creates a database session,
 * and sets an HTTP-only session cookie.
 */
export async function loginAdminAction(formData: {
    email: string
    password: string
    rememberMe?: boolean
    from?: string
}): Promise<LoginResult> {
    try {
        const cleanEmail = (formData.email || '').trim().toLowerCase()
        const password = formData.password || ''
        const rememberMe = formData.rememberMe ?? true

        if (!cleanEmail || !password) {
            return { success: false, error: 'Email and password are required.' }
        }

        // Fetch user from DB
        const user = await prisma.user.findUnique({
            where: { email: cleanEmail },
        })

        if (!user || !user.passwordHash || !user.isActive) {
            return { success: false, error: 'Incorrect email or password. Please try again.' }
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) {
            return { success: false, error: 'Incorrect email or password. Please try again.' }
        }

        // Extract device info from request headers
        let browser = 'Web Browser'
        let os = 'Unknown OS'
        let deviceName = 'Desktop Workstation'
        let ipAddress = '127.0.0.1'

        try {
            const headersList = await headers()
            const userAgent = headersList.get('user-agent') || ''
            ipAddress =
                headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
                headersList.get('x-real-ip') ||
                '127.0.0.1'

            if (/chrome/i.test(userAgent) && !/edge|edg/i.test(userAgent)) browser = 'Chrome'
            else if (/safari/i.test(userAgent) && !/chrome/i.test(userAgent)) browser = 'Safari'
            else if (/firefox/i.test(userAgent)) browser = 'Firefox'
            else if (/edg/i.test(userAgent)) browser = 'Edge'

            if (/macintosh|mac os x/i.test(userAgent)) os = 'macOS'
            else if (/windows/i.test(userAgent)) os = 'Windows'
            else if (/iphone/i.test(userAgent)) os = 'iPhone'
            else if (/ipad/i.test(userAgent)) os = 'iPad'
            else if (/android/i.test(userAgent)) os = 'Android'
            else if (/linux/i.test(userAgent)) os = 'Linux'

            if (/mobile|iphone|android/i.test(userAgent)) deviceName = 'Mobile Device'
            else if (/ipad|tablet/i.test(userAgent)) deviceName = 'iPad / Tablet'
            else if (/macintosh/i.test(userAgent)) deviceName = 'MacBook Pro'
            else if (/windows/i.test(userAgent)) deviceName = 'Windows PC'
        } catch {
            // Context without headers (e.g. CLI/tests)
        }

        // 30 days if rememberMe, else 24 hours
        const sessionDurationMs = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
        const expiresAt = new Date(Date.now() + sessionDurationMs)
        const sessionToken = `cs_sess_${crypto.randomBytes(32).toString('hex')}`

        // Persist session to database
        await prisma.session.create({
            data: {
                userId: user.id,
                token: sessionToken,
                deviceName,
                browser,
                os,
                ipAddress,
                location: user.location || 'Verona Atelier',
                expiresAt,
            },
        })

        // Set secure HTTP-only cookie
        try {
            const cookieStore = await cookies()
            cookieStore.set({
                name: ADMIN_COOKIE_NAME,
                value: sessionToken,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                path: '/',
                expires: expiresAt,
            })
        } catch {
            // Context without cookie store
        }

        // Determine destination safely (prevent open redirect attacks)
        let destination = formData.from || '/admin'
        if (!destination.startsWith('/admin') || destination.startsWith('/admin/login')) {
            destination = '/admin'
        }

        return {
            success: true,
            redirectUrl: destination,
            user: {
                id: user.id,
                email: user.email,
                displayName: user.displayName || `${user.firstName} ${user.lastName}`.trim() || 'Admin User',
                role: user.role,
            },
        }
    } catch (error) {
        console.error('Error in loginAdminAction:', error)
        return {
            success: false,
            error: 'Authentication failed due to a server error. Please try again.',
        }
    }
}

/**
 * Revokes the current admin session from the database and deletes the session cookie.
 */
export async function logoutAdminAction(): Promise<{ success: boolean }> {
    try {
        let token: string | undefined
        try {
            const cookieStore = await cookies()
            token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
            cookieStore.delete(ADMIN_COOKIE_NAME)
        } catch {
            // Context without cookie store
        }

        if (token) {
            await prisma.session.deleteMany({
                where: { token },
            }).catch(() => {})
        }

        return { success: true }
    } catch (error) {
        console.error('Error in logoutAdminAction:', error)
        return { success: true }
    }
}

/**
 * Validates the current admin session cookie against active database sessions.
 */
export async function validateAdminSessionAction(): Promise<SessionValidationResult> {
    try {
        let token: string | undefined
        let cookieStore: any
        try {
            cookieStore = await cookies()
            token = cookieStore.get(ADMIN_COOKIE_NAME)?.value
        } catch {
            return { authenticated: false }
        }

        if (!token) {
            return { authenticated: false }
        }

        const session = await prisma.session.findUnique({
            where: { token },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        displayName: true,
                        role: true,
                        avatarInitials: true,
                        avatarColor: true,
                        isActive: true,
                    },
                },
            },
        })

        if (!session || session.expiresAt < new Date() || !session.user || !session.user.isActive) {
            if (session) {
                await prisma.session.deleteMany({ where: { token } }).catch(() => {})
            }
            try {
                cookieStore?.delete(ADMIN_COOKIE_NAME)
            } catch {}
            return { authenticated: false }
        }

        // Touch lastActive periodically (if older than 5 minutes)
        const now = new Date()
        if (now.getTime() - session.lastActive.getTime() > 5 * 60 * 1000) {
            await prisma.session.update({
                where: { id: session.id },
                data: { lastActive: now },
            }).catch(() => {})
        }

        return {
            authenticated: true,
            user: {
                id: session.user.id,
                email: session.user.email,
                displayName: session.user.displayName || 'Admin User',
                role: session.user.role,
                avatarInitials: session.user.avatarInitials,
                avatarColor: session.user.avatarColor,
            },
        }
    } catch (error) {
        console.error('Error in validateAdminSessionAction:', error)
        return { authenticated: false }
    }
}
