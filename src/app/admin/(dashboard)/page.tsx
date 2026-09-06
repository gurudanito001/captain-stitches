import Link from 'next/link'
import type { Metadata } from 'next'

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

// ─── Data (replace with Prisma) ───────────────────────────────────────────────
const recentOrders: RecentOrder[] = [
    { id: '1', orderNumber: 'CS-0091', customerName: 'Adewale Okafor', garmentType: 'Grand Agbada', location: 'Italy', status: 'INSPECTION', deadline: 'Jun 14', amount: 120000, isOverdue: false },
    { id: '2', orderNumber: 'CS-0090', customerName: 'Chidi Ikenna', garmentType: 'English 3-piece', location: 'Nigeria', status: 'IN_PRODUCTION', deadline: 'Jun 10', amount: 160000, isOverdue: true },
    { id: '3', orderNumber: 'CS-0089', customerName: 'Ngozi Nwosu', garmentType: 'Kaftan Royale', location: 'Italy', status: 'CONFIRMED', deadline: 'Jun 20', amount: 75000, isOverdue: false },
    { id: '4', orderNumber: 'CS-0088', customerName: 'Emeka Balogun', garmentType: 'Classic Senator', location: 'Nigeria', status: 'DISPATCHED', deadline: 'Jun 8', amount: 85000, isOverdue: false },
    { id: '5', orderNumber: 'CS-0087', customerName: 'Fatima Kamara', garmentType: 'Grand Agbada', location: 'Italy', status: 'NEW', deadline: 'Jun 25', amount: 120000, isOverdue: false },
    { id: '6', orderNumber: 'CS-0086', customerName: 'Tunde Adeyemi', garmentType: 'English suit', location: 'Italy', status: 'IN_PRODUCTION', deadline: 'Jun 12', amount: 160000, isOverdue: false },
]

const topDesigns = [
    { name: 'Grand Agbada', orders: 38, pct: 94 },
    { name: 'Classic Senator', orders: 31, pct: 77 },
    { name: 'Italian 3-piece', orders: 24, pct: 60 },
    { name: 'Kaftan Royale', orders: 18, pct: 45 },
]

const monthlyRevenue = [
    { month: 'Jan', amount: 820000 },
    { month: 'Feb', amount: 1050000 },
    { month: 'Mar', amount: 960000 },
    { month: 'Apr', amount: 1240000 },
    { month: 'May', amount: 1080000 },
    { month: 'Jun', amount: 1840000 },
    { month: 'Jul', amount: 1100000 },
    { month: 'Aug', amount: 1320000 },
]

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
    const s = statusConfig[status]
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

// ─── Bar chart (pure CSS/SVG, no library) ────────────────────────────────────
function RevenueChart() {
    const max = Math.max(...monthlyRevenue.map(d => d.amount))
    const currentMonth = 'Jun'

    return (
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '140px', padding: '0 4px' }}>
            {monthlyRevenue.map(d => {
                const heightPct = (d.amount / max) * 100
                const isCurrent = d.month === currentMonth
                return (
                    <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%', justifyContent: 'flex-end' }}>
                        {isCurrent && (
                            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#C4975A' }}>
                                {Math.round(d.amount / 1000)}K
                            </span>
                        )}
                        <div
                            style={{
                                width: '100%',
                                height: `${heightPct}%`,
                                borderRadius: '6px 6px 0 0',
                                background: isCurrent ? '#C4975A' : '#F5ECD9',
                                transition: 'height 0.3s ease',
                                minHeight: '12px',
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

// ─── Donut chart (SVG) ────────────────────────────────────────────────────────
function DonutChart() {
    const r = 52
    const cx = 70
    const cy = 70
    const circumference = 2 * Math.PI * r

    // Italy 58%, Nigeria 42%
    const segments = [
        { pct: 58, color: '#C4975A', label: 'Italy' },
        { pct: 42, color: '#E2C99E', label: 'Nigeria' },
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
                            stroke={arc.color}
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
                    <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1 }}>12</span>
                    <span style={{ fontSize: '0.625rem', color: '#A8998C', marginTop: '3px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>orders</span>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                {segments.map(seg => (
                    <div key={seg.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color, flexShrink: 0 }} />
                        <span style={{ fontSize: '0.725rem', color: '#6B5D52', fontWeight: 500 }}>{seg.label} {seg.pct}%</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
    const now = new Date()
    const hour = now.getHours()
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

    return (
        <div style={{ padding: '32px 36px', minHeight: '100vh', background: '#FAF7F2' }}>

            {/* ── Top bar ──────────────────────────────────────────────────────── */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                <div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1.2, fontFamily: 'var(--font-display, Georgia, serif)', margin: 0 }}>
                        Overview
                    </h1>
                    <p style={{ fontSize: '0.8125rem', color: '#A8998C', marginTop: '4px', margin: '4px 0 0 0' }}>
                        {greeting}, Samuelson — here&apos;s what&apos;s happening today
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Search */}
                    <button
                        style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ffffff', border: '1px solid #EDE8E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', padding: 0 }}
                        aria-label="Search"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A8998C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </button>

                    {/* Notifications */}
                    <button
                        style={{ width: '38px', height: '38px', borderRadius: '10px', background: '#ffffff', border: '1px solid #EDE8E1', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', padding: 0 }}
                        aria-label="Notifications"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#A8998C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px' }}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                        <span style={{ position: 'absolute', top: '8px', right: '8px', width: '7px', height: '7px', borderRadius: '50%', background: '#C4975A', border: '1.5px solid #FAF7F2' }} aria-hidden="true" />
                    </button>

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
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#C4975A', background: '#FDF3E7', padding: '3px 10px', borderRadius: '999px' }}>+2 today</span>
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>12</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>across Italy &amp; Nigeria</p>
                </Card>

                {/* Awaiting deposit */}
                <Card style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Awaiting deposit</p>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#ef4444', background: '#FEE2E2', padding: '3px 10px', borderRadius: '999px' }}>urgent</span>
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: '#ef4444', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>3</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>unconfirmed orders</p>
                </Card>

                {/* Inspection queue */}
                <Card style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Inspection queue</p>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#C4975A', background: '#FDF3E7', padding: '3px 10px', borderRadius: '999px' }}>review</span>
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: '#C4975A', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>2</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>ready for your sign-off</p>
                </Card>

                {/* Delivered */}
                <Card style={{ padding: '22px 24px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Delivered — June</p>
                        <span style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#166534', background: '#DCFCE7', padding: '3px 10px', borderRadius: '999px' }}>↑ 14%</span>
                    </div>
                    <p style={{ fontSize: '2.1rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1, fontFamily: 'var(--font-display, Georgia, serif)', margin: '0 0 6px 0' }}>8</p>
                    <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: 0 }}>vs 7 last month</p>
                </Card>

            </div>

            {/* ── Row 2: Chart + Top designs + Donut ───────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1.05fr 1fr', gap: '20px', marginBottom: '24px' }}>

                {/* Revenue chart */}
                <Card style={{ padding: '24px 26px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                            <p style={{ fontSize: '0.8125rem', color: '#A8998C', margin: 0 }}>Monthly revenue</p>
                            <p style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1.1, marginTop: '6px', marginBottom: '2px', fontFamily: 'var(--font-display, Georgia, serif)' }}>
                                {fmt(1840000)}
                            </p>
                            <p style={{ fontSize: '0.725rem', color: '#C4975A', fontWeight: 600, margin: 0 }}>
                                ↑ {fmt(760000)} vs last month
                            </p>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', background: '#FAF7F2', padding: '4px', borderRadius: '999px' }}>
                            <button style={{ padding: '5px 14px', borderRadius: '999px', background: '#C4975A', color: '#ffffff', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}>Monthly</button>
                            <button style={{ padding: '5px 14px', borderRadius: '999px', background: 'transparent', color: '#A8998C', fontSize: '0.75rem', fontWeight: 500, border: 'none', cursor: 'pointer' }}>Yearly</button>
                        </div>
                    </div>
                    <div style={{ marginTop: '22px' }}>
                        <RevenueChart />
                    </div>
                </Card>

                {/* Top designs */}
                <Card style={{ padding: '24px 24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', marginBottom: '18px', margin: '0 0 18px 0' }}>Top designs</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {topDesigns.map((d, i) => (
                                <div key={d.name} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {/* Avatar circle */}
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
                                    {/* Progress bar */}
                                    <div style={{ height: '5px', borderRadius: '999px', background: '#F5ECD9', width: '100%', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: '999px', background: i === 0 ? '#C4975A' : '#D4AE7A', width: `${d.pct}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Location donut */}
                <Card style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', margin: 0 }}>By location</p>
                        </div>

                        {/* 3 mini stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '18px', background: '#FAF7F2', padding: '10px 8px', borderRadius: '12px' }}>
                            {[
                                { label: 'Italy', value: '7' },
                                { label: 'Nigeria', value: '5' },
                                { label: 'Referrals', value: '4' },
                            ].map(s => (
                                <div key={s.label} style={{ textAlign: 'center' }}>
                                    <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1, margin: 0 }}>{s.value}</p>
                                    <p style={{ fontSize: '0.625rem', color: '#A8998C', margin: '4px 0 0 0' }}>{s.label}</p>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'center', margin: '8px 0 16px 0' }}>
                            <DonutChart />
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

            {/* ── Row 3: Recent orders + Alerts ────────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: '20px' }}>

                {/* Recent orders table */}
                <Card style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #F5ECD9' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', margin: 0 }}>Recent orders</p>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', background: '#FAF7F2', padding: '4px', borderRadius: '999px' }}>
                            {['Daily', 'Weekly', 'Monthly'].map((tab, i) => (
                                <button
                                    key={tab}
                                    style={{
                                        padding: '5px 14px', borderRadius: '999px', fontSize: '0.75rem',
                                        fontWeight: i === 0 ? 600 : 500,
                                        background: i === 0 ? '#C4975A' : 'transparent',
                                        color: i === 0 ? '#ffffff' : '#A8998C',
                                        border: 'none', cursor: 'pointer',
                                    }}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
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
                                {recentOrders.map((order, i) => (
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Right column: Revenue + Quick actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Revenue summary */}
                    <Card style={{ padding: '24px 24px' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', margin: '0 0 16px 0' }}>Revenue — June</p>

                        <div style={{ marginBottom: '14px' }}>
                            <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: '0 0 4px 0' }}>Collected</p>
                            <p style={{ fontSize: '1.45rem', fontWeight: 700, color: '#1C0F07', fontFamily: 'var(--font-display, Georgia, serif)', margin: 0 }}>{fmt(1840000)}</p>
                        </div>

                        {/* Progress */}
                        <div style={{ height: '7px', borderRadius: '999px', background: '#F5ECD9', marginBottom: '8px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: '999px', background: '#C4975A', width: '75%' }} />
                        </div>
                        <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: '0 0 16px 0' }}>75% of expected revenue</p>

                        <div style={{ paddingTop: '14px', borderTop: '1px solid #F5ECD9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '0.6875rem', color: '#A8998C', margin: '0 0 4px 0' }}>Outstanding</p>
                                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ef4444', margin: 0 }}>{fmt(620000)}</p>
                            </div>
                            <Link
                                href="/admin/orders?filter=balance-pending"
                                style={{ fontSize: '0.75rem', color: '#C4975A', fontWeight: 600, textDecoration: 'none' }}
                            >
                                Chase up →
                            </Link>
                        </div>
                    </Card>

                    {/* Quick actions */}
                    <Card style={{ padding: '24px 24px' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', margin: '0 0 16px 0' }}>Quick actions</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                { label: 'Log a WhatsApp order', href: '/admin/orders/new', emoji: '📋' },
                                { label: 'Add catalogue design', href: '/admin/catalogue/new', emoji: '✦' },
                                { label: 'Write a blog post', href: '/admin/blog/new', emoji: '✏️' },
                                { label: 'Email your list', href: '/admin/marketing', emoji: '📬' },
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