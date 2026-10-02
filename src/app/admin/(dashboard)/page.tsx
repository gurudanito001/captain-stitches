import Link from 'next/link'
import type { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { OrderStatus as PrismaOrderStatus } from '@prisma/client'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'Overview — CaptainStitches Admin',
}

// ─── Types ────────────────────────────────────────────────────────────────────
type OrderStatus = 'NEW' | 'CONFIRMED' | 'IN_PRODUCTION' | 'INSPECTION' | 'APPROVED' | 'DISPATCHED' | 'DELIVERED'
type Location = 'Italy' | 'Nigeria'

interface RecentOrder {
    id: string
    orderNumber: string
    customerName: string
    garmentType: string
    location: Location
    status: OrderStatus
    deadline: string
    amount: number
    isOverdue: boolean
}

// ─── Status config ────────────────────────────────────────────────────────────
const statusConfig: Record<OrderStatus, { label: string; color: string; bg: string }> = {
    NEW: { label: 'New', color: '#92600A', bg: '#FEF3CD' },
    CONFIRMED: { label: 'Confirmed', color: '#C4975A', bg: '#FDF3E7' },
    IN_PRODUCTION: { label: 'In production', color: '#7A4F2E', bg: '#F5ECD9' },
    INSPECTION: { label: 'Inspection', color: '#5C3820', bg: '#E2C99E' },
    APPROVED: { label: 'Approved', color: '#166534', bg: '#DCFCE7' },
    DISPATCHED: { label: 'Dispatched', color: '#1D4ED8', bg: '#DBEAFE' },
    DELIVERED: { label: 'Delivered', color: '#6B7280', bg: '#F3F4F6' },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(n: number) {
    return '₦' + n.toLocaleString('en-NG')
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '16px',
                boxShadow: '0 1px 4px rgba(28,15,7,0.06), 0 0 0 1px rgba(28,15,7,0.04)',
                ...style,
            }}
        >
            {children}
        </div>
    )
}

function StatusPill({ status }: { status: OrderStatus }) {
    const s = statusConfig[status] || statusConfig.NEW
    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '4px 12px',
                borderRadius: '999px',
                fontSize: '0.6875rem',
                fontWeight: 600,
                background: s.bg,
                color: s.color,
                whiteSpace: 'nowrap',
            }}
        >
            {s.label}
        </span>
    )
}

// ─── Bar chart ────────────────────────────────────
function RevenueChart({ data }: { data: { month: string; amount: number }[] }) {
    const max = Math.max(...data.map(d => d.amount), 1000)
    const currentMonth = 'Sep'

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px', padding: '0 4px' }}>
            {data.map(d => {
                const heightPct = Math.max(10, (d.amount / max) * 100)
                const isCurrent = d.month === currentMonth
                return (
                    <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                        {isCurrent && d.amount > 0 && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#C4975A' }}>
                                {Math.round(d.amount / 1000)}K
                            </span>
                        )}
                        <div
                            style={{
                                width: '100%',
                                height: `${d.amount > 0 ? heightPct : 6}%`,
                                borderRadius: '6px 6px 0 0',
                                background: isCurrent ? '#C4975A' : '#F5ECD9',
                                transition: 'height 0.3s ease',
                                minHeight: '6px',
                            }}
                        />
                        <span style={{ fontSize: '0.625rem', color: isCurrent ? '#C4975A' : '#A8998C', fontWeight: isCurrent ? 700 : 400 }}>
                            {d.month}
                        </span>
                    </div>
                )
            })}
        </div>
    )
}

// ─── Donut chart ────────────────────────────────────────────────────────
function DonutChart({ italyCount, nigeriaCount }: { italyCount: number; nigeriaCount: number }) {
    const total = italyCount + nigeriaCount
    const r = 52
    const cx = 70
    const cy = 70
    const circumference = 2 * Math.PI * r

    const italyPct = total > 0 ? Math.round((italyCount / total) * 100) : 50
    const nigeriaPct = total > 0 ? 100 - italyPct : 50

    const segments = [
        { pct: italyPct, color: '#C4975A', label: 'Italy' },
        { pct: nigeriaPct, color: '#E2C99E', label: 'Nigeria' },
    ]

    let offset = 0
    const arcs = segments.map(seg => {
        const dash = (seg.pct / 100) * circumference
        const gap = circumference - dash
        const arc = { dash, gap, offset, ...seg }
        offset += dash
        return arc
    })

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                <svg width="140" height="140" viewBox="0 0 140 140">
                    {arcs.map((arc, i) => (
                        <circle
                            key={i}
                            cx={cx} cy={cy} r={r}
                            fill="none"
                            stroke={total > 0 ? arc.color : '#E5E0D8'}
                            strokeWidth="18"
                            strokeDasharray={`${arc.dash} ${arc.gap}`}
                            strokeDashoffset={-arc.offset}
                            strokeLinecap="round"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '70px 70px' }}
                        />
                    ))}
                </svg>
                {/* Centre label */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1 }}>{total}</span>
                    <span style={{ fontSize: '0.625rem', color: '#A8998C', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>orders</span>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {segments.map(seg => (
                    <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.725rem', color: '#6B5D52', fontWeight: 500 }}>{seg.label} {total > 0 ? `${seg.pct}%` : '0%'}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Page (Server Component fetching live Prisma data) ──────────────────────────
export default async function AdminDashboard() {
    const now = new Date()
    const hour = now.getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    // Fetch database counts and records in parallel
    const [
        activeCount,
        awaitingDepositCount,
        inspectionCount,
        deliveredCount,
        recentOrdersDb,
        designsDb,
        italyCount,
        nigeriaCount,
        paidOrders,
    ] = await Promise.all([
        prisma.order.count({ where: { status: { not: PrismaOrderStatus.DELIVERED } } }),
        prisma.order.count({ where: { status: PrismaOrderStatus.NEW } }),
        prisma.order.count({ where: { status: PrismaOrderStatus.INSPECTION } }),
        prisma.order.count({ where: { status: PrismaOrderStatus.DELIVERED } }),
        prisma.order.findMany({
            take: 6,
            orderBy: { createdAt: 'desc' },
            include: { customer: true, design: true },
        }),
        prisma.design.findMany({
            take: 4,
            include: {
                _count: { select: { orders: true } },
            },
        }),
        prisma.order.count({ where: { deliveryLocation: 'ITALY' } }),
        prisma.order.count({ where: { deliveryLocation: 'NIGERIA' } }),
        prisma.order.findMany({
            where: { depositPaid: true },
            select: { totalAmount: true, depositAmount: true, balancePaid: true, balanceAmount: true },
        }),
    ])

    // Calculate revenue
    const totalRevenueNGN = paidOrders.reduce((sum, o) => {
        const collected = o.depositAmount + (o.balancePaid ? o.balanceAmount : 0)
        return sum + collected
    }, 0)

    const recentOrders: RecentOrder[] = recentOrdersDb.map((o) => {
        const isOverdue = o.deadline ? new Date() > o.deadline && o.status !== PrismaOrderStatus.DELIVERED : false
        return {
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: `${o.customer.firstName} ${o.customer.lastName}`.trim(),
            garmentType: o.design?.nameEN || o.customDesignNotes || 'Bespoke Garment',
            location: o.deliveryLocation === 'ITALY' ? 'Italy' : 'Nigeria',
            status: o.status as OrderStatus,
            deadline: o.deadline ? o.deadline.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Standard',
            amount: o.totalAmount,
            isOverdue,
        }
    })

    const topDesigns = designsDb.map((d) => {
        const orderCount = d._count.orders
        const maxOrders = Math.max(...designsDb.map(item => item._count.orders), 1)
        const pct = Math.round((orderCount / maxOrders) * 100)
        return {
            name: d.nameEN,
            orders: orderCount,
            pct,
        }
    })

    const monthlyRevenue = [
        { month: 'Apr', amount: 0 },
        { month: 'May', amount: 0 },
        { month: 'Jun', amount: 0 },
        { month: 'Jul', amount: 0 },
        { month: 'Aug', amount: 0 },
        { month: 'Sep', amount: totalRevenueNGN },
    ]

    return (
        <div style={{ padding: '32px 36px', minHeight: '100vh', background: '#FAF7F2' }}>

            {/* ── Top bar ──────────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1.2, fontFamily: 'var(--font-display, Georgia, serif)', margin: 0 }}>
                        Overview
                    </h1>
                    <p style={{ fontSize: '0.8125rem', color: '#A8998C', marginTop: '4px', margin: '4px 0 0 0' }}>
                        {greeting}, Samuelson — here&apos;s what&apos;s happening in the studio today
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* New order CTA */}
                    <Link
                        href="/admin/orders/new"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0 18px', height: '38px', borderRadius: '10px', background: '#C4975A', fontSize: '0.8125rem', fontWeight: 600, color: '#ffffff', textDecoration: 'none' }}
                    >
                        <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
                        New order
                    </Link>

                    {/* User avatar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '4px 14px 4px 5px', borderRadius: '10px', background: '#ffffff', border: '1px solid #EDE8E1' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#C4975A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6875rem', fontWeight: 700, color: '#ffffff' }}>SA</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <p style={{ fontSize: '0.78rem', fontWeight: 600, color: '#1C0F07', lineHeight: 1.2, margin: 0 }}>Samuelson A.</p>
                            <p style={{ fontSize: '0.625rem', color: '#A8998C', margin: 0 }}>Admin</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Row 1: Stat cards ─────────────────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '24px' }}>

                {/* Active orders */}
                <Card style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Active orders</p>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#C4975A', background: '#FDF3E7', padding: '3px 10px', borderRadius: '999px' }}>live</span>
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>{activeCount}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>across Italy &amp; Nigeria</p>
                </Card>

                {/* Awaiting deposit (unattended intake) */}
                <Card style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Awaiting deposit</p>
                        {awaitingDepositCount > 0 && (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#ef4444', background: '#FEE2E2', padding: '3px 10px', borderRadius: '999px' }}>action</span>
                        )}
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: awaitingDepositCount > 0 ? '#ef4444' : '#1C0F07', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>{awaitingDepositCount}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>new unconfirmed intake</p>
                </Card>

                {/* Inspection queue */}
                <Card style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Inspection queue</p>
                        {inspectionCount > 0 && (
                            <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#C4975A', background: '#FDF3E7', padding: '3px 10px', borderRadius: '999px' }}>review</span>
                        )}
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: inspectionCount > 0 ? '#C4975A' : '#1C0F07', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>{inspectionCount}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>ready for QC sign-off</p>
                </Card>

                {/* Delivered */}
                <Card style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Delivered</p>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#166534', background: '#DCFCE7', padding: '3px 10px', borderRadius: '999px' }}>completed</span>
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>{deliveredCount}</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>total delivered orders</p>
                </Card>

            </div>

            {/* ── Row 2: Chart + Top designs + Donut ───────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1.05fr 1fr', gap: '20px', marginBottom: '24px' }}>

                {/* Revenue chart */}
                <Card style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                            <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Collected Revenue</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1.1, marginTop: '6px', marginBottom: '2px', fontFamily: 'var(--font-display, Georgia, serif)' }}>
                                {fmt(totalRevenueNGN)}
                            </p>
                            <p style={{ fontSize: '0.725rem', color: '#C4975A', fontWeight: 600, margin: 0 }}>
                                Live database receipts
                            </p>
                        </div>
                    </div>
                    <div style={{ marginTop: '22px' }}>
                        <RevenueChart data={monthlyRevenue} />
                    </div>
                </Card>

                {/* Top designs */}
                <Card style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', marginBottom: '18px', margin: '0 0 18px 0' }}>Top designs</p>
                        {topDesigns.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {topDesigns.map((d, i) => (
                                    <div key={d.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: i === 0 ? '#C4975A' : '#F5ECD9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                                    <span style={{ fontSize: '0.725rem', fontWeight: 700, color: i === 0 ? '#ffffff' : '#C4975A' }}>
                                                        {d.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                                                    </span>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#1C0F07', lineHeight: 1.2, margin: 0 }}>{d.name}</p>
                                                    <p style={{ fontSize: '0.625rem', color: '#A8998C', margin: '2px 0 0 0' }}>{d.orders} orders</p>
                                                </div>
                                            </div>
                                            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#C4975A' }}>{d.pct}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ fontSize: '0.8125rem', color: '#8A7A6E', margin: '24px 0', textAlign: 'center' }}>
                                No catalogue design orders recorded yet.
                            </p>
                        )}
                    </div>
                </Card>

                {/* Donut: Orders by Location */}
                <Card style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', margin: 0 }}>Orders by location</p>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px 0' }}>
                            <DonutChart italyCount={italyCount} nigeriaCount={nigeriaCount} />
                        </div>
                    </div>

                    <Link
                        href="/admin/orders"
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '11px 16px', borderRadius: '10px', border: '1px solid #EDE8E1', fontSize: '0.8125rem', color: '#C4975A', fontWeight: 600, textDecoration: 'none', transition: 'background 0.15s ease' }}
                    >
                        View all orders
                    </Link>
                </Card>

            </div>

            {/* ── Row 3: Recent orders + Actions ────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '20px' }}>

                {/* Recent orders table */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F5ECD9' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', margin: 0 }}>Recent orders</p>
                        <Link href="/admin/orders" style={{ fontSize: '0.75rem', color: '#C4975A', fontWeight: 600, textDecoration: 'none' }}>
                            View pipeline →
                        </Link>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid #F5ECD9' }}>
                                    {['Order ID', 'Customer', 'Garment', 'Location', 'Deadline', 'Amount', 'Status', ''].map(col => (
                                        <th
                                            key={col}
                                            style={{ padding: '12px 24px', textAlign: 'left', fontSize: '0.6875rem', fontWeight: 600, color: '#A8998C', letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}
                                        >
                                            {col}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {recentOrders.length > 0 ? (
                                    recentOrders.map((order, i) => (
                                        <tr
                                            key={order.id}
                                            style={{ borderBottom: i < recentOrders.length - 1 ? '1px solid #FAF7F2' : 'none', background: order.isOverdue ? '#FFF5F5' : 'transparent' }}
                                        >
                                            <td style={{ padding: '15px 24px', whiteSpace: 'nowrap' }}>
                                                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#C4975A' }}>{order.orderNumber}</span>
                                                {order.isOverdue && (
                                                    <span style={{ marginLeft: '8px', padding: '2px 8px', borderRadius: '999px', fontSize: '0.625rem', color: '#ef4444', background: '#FEE2E2', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                                                        overdue
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: '15px 24px', whiteSpace: 'nowrap' }}>
                                                <span style={{ fontSize: '0.8125rem', color: '#1C0F07', fontWeight: 500 }}>{order.customerName}</span>
                                            </td>
                                            <td style={{ padding: '15px 24px' }}>
                                                <span style={{ fontSize: '0.8125rem', color: '#6B5D52' }}>{order.garmentType}</span>
                                            </td>
                                            <td style={{ padding: '15px 24px', whiteSpace: 'nowrap' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: order.location === 'Italy' ? '#93C5FD' : '#86EFAC', flexShrink: 0 }} />
                                                    <span style={{ fontSize: '0.8125rem', color: '#6B5D52' }}>{order.location}</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '15px 24px', whiteSpace: 'nowrap' }}>
                                                <span style={{ fontSize: '0.8125rem', color: order.isOverdue ? '#ef4444' : '#6B5D52', fontWeight: order.isOverdue ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>{order.deadline}</span>
                                            </td>
                                            <td style={{ padding: '15px 24px', whiteSpace: 'nowrap' }}>
                                                <span style={{ fontSize: '0.8125rem', color: '#1C0F07', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(order.amount)}</span>
                                            </td>
                                            <td style={{ padding: '15px 24px' }}>
                                                <StatusPill status={order.status} />
                                            </td>
                                            <td style={{ padding: '15px 24px', textAlign: 'right' }}>
                                                <Link href={`/admin/orders/${order.id}`} style={{ fontSize: '0.75rem', color: '#C4975A', fontWeight: 600, textDecoration: 'none' }}>
                                                    Open →
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} style={{ padding: '40px 24px', textAlign: 'center', color: '#8A7A6E', fontSize: '0.85rem' }}>
                                            No bespoke orders recorded in database yet.{' '}
                                            <Link href="/admin/orders/new" style={{ color: '#C4975A', fontWeight: 600, textDecoration: 'underline' }}>
                                                Commission your first order
                                            </Link>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Right column: Quick actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Card style={{ padding: '24px 24px' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', margin: '0 0 16px 0' }}>Quick actions</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Log a bespoke order', href: '/admin/orders/new', emoji: '📋' },
                                { label: 'Add catalogue design', href: '/admin/catalogue/new', emoji: '✦' },
                                { label: 'Moderate reviews', href: '/admin/reviews', emoji: '★' },
                                { label: 'Manage customers', href: '/admin/customers', emoji: '👤' },
                            ].map(action => (
                                <Link
                                    key={action.href}
                                    href={action.href}
                                    style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '11px 14px', borderRadius: '12px', background: '#FAF7F2', textDecoration: 'none', transition: 'background 0.15s' }}
                                >
                                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0, boxShadow: '0 1px 2px rgba(0,0,0,0.04)' }}>
                                        {action.emoji}
                                    </div>
                                    <span style={{ fontSize: '0.8125rem', color: '#1C0F07', fontWeight: 500 }}>{action.label}</span>
                                    <span style={{ marginLeft: 'auto', fontSize: '0.875rem', color: '#C4975A', fontWeight: 600 }}>→</span>
                                </Link>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>

        </div>
    )
}