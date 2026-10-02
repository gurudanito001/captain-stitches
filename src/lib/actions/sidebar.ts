'use server'

import { prisma } from '@/lib/prisma'
import { OrderStatus, ReviewStatus, ReferralRewardStatus } from '@prisma/client'

export interface AdminSidebarCounts {
    orders: number
    reviews: number
    referrals: number
    inspections: number
    latestInspectionOrderNumber?: string
    latestInspectionGarment?: string
    inspectionOrderNumbers?: string[]
}

/**
 * Server Action: Fetch the real-time count of unattended items from PostgreSQL
 * - Orders: Placed/intake orders with status = NEW (awaiting triage / deposit confirmation)
 * - Reviews: Client reviews with status = PENDING (awaiting atelier moderation / approval)
 * - Referrals: Converted referrals with status = PENDING (awaiting reward crediting)
 * - Inspections: Garments actively in the INSPECTION stage or in production with media uploaded waiting for QC sign-off
 */
export async function getAdminSidebarCountsAction(): Promise<AdminSidebarCounts> {
    try {
        const [orders, reviews, referrals, inspectionOrders] = await Promise.all([
            // 1. Unattended Orders in status NEW
            prisma.order.count({
                where: {
                    status: OrderStatus.NEW,
                },
            }),
            // 2. Unattended Reviews in status PENDING
            prisma.review.count({
                where: {
                    status: ReviewStatus.PENDING,
                },
            }),
            // 3. Unattended Referrals pending reward issuance
            prisma.referral.count({
                where: {
                    referrerRewardStatus: ReferralRewardStatus.PENDING,
                    convertedOrderId: { not: null },
                },
            }),
            // 4. Orders waiting for inspection pre-shipment review
            prisma.order.findMany({
                where: {
                    OR: [
                        { status: OrderStatus.INSPECTION },
                        {
                            AND: [
                                { status: { in: [OrderStatus.IN_PRODUCTION, OrderStatus.INSPECTION] } },
                                { inspectionApprovedAt: null },
                                {
                                    OR: [
                                        { inspectionMediaUrls: { isEmpty: false } },
                                        { inspectionVideoUrl: { not: null } },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                select: {
                    id: true,
                    orderNumber: true,
                    status: true,
                    customDesignNotes: true,
                    design: {
                        select: {
                            nameEN: true,
                        },
                    },
                },
                orderBy: {
                    updatedAt: 'desc',
                },
            }),
        ])

        const inspectionOrderNumbers = inspectionOrders.map((o) => o.orderNumber)
        const firstOrder = inspectionOrders[0]

        return {
            orders,
            reviews,
            referrals,
            inspections: inspectionOrders.length,
            latestInspectionOrderNumber: firstOrder ? firstOrder.orderNumber : undefined,
            latestInspectionGarment: firstOrder
                ? firstOrder.design?.nameEN || firstOrder.customDesignNotes || 'Bespoke piece'
                : undefined,
            inspectionOrderNumbers,
        }
    } catch (error) {
        console.error('Failed to query admin sidebar counts from database:', error)
        return {
            orders: 0,
            reviews: 0,
            referrals: 0,
            inspections: 0,
        }
    }
}
