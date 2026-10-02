import 'server-only'
import { cache } from 'react'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

/**
 * Verify administrator login credentials.
 */
export async function verifyAdminCredentials(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
    })

    if (!user || !user.passwordHash) {
        return null
    }

    const isValid = await bcrypt.compare(passwordPlain, user.passwordHash)
    if (!isValid) {
        return null
    }

    // Return safe User DTO without passwordHash
    const { passwordHash: _, ...safeUser } = user
    return safeUser
}

/**
 * Fetch staff user by ID with safe DTO.
 */
export const getAdminUserById = cache(async (id: string) => {
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            displayName: true,
            email: true,
            role: true,
            phone: true,
            whatsApp: true,
            avatarInitials: true,
            avatarColor: true,
            isActive: true,
            location: true,
            createdAt: true,
        },
    })
})

/**
 * Fetch active device sessions for a user.
 */
export const getUserActiveSessions = cache(async (userId: string) => {
    return prisma.session.findMany({
        where: {
            userId,
            expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
    })
})

/**
 * Create a new active device session.
 */
export async function createSession(data: {
    userId: string
    token: string
    deviceName?: string
    browser?: string
    os?: string
    ipAddress?: string
    location?: string
    expiresAt: Date
}) {
    return prisma.session.create({ data })
}

/**
 * Fetch active session by token including user details.
 */
export const getSessionByToken = cache(async (token: string) => {
    return prisma.session.findUnique({
        where: { token },
        include: {
            user: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    displayName: true,
                    email: true,
                    role: true,
                    avatarInitials: true,
                    avatarColor: true,
                    isActive: true,
                    location: true,
                },
            },
        },
    })
})

/**
 * Invalidate a specific device session by token.
 */
export async function invalidateSession(token: string) {
    return prisma.session.deleteMany({
        where: { token },
    })
}

/**
 * Invalidate all other active sessions for a user, keeping only current device.
 */
export async function invalidateAllOtherSessions(userId: string, currentToken: string) {
    return prisma.session.deleteMany({
        where: {
            userId,
            token: { not: currentToken },
        },
    })
}
