'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    AdminOrder,
    OrderStatus,
    Location,
    STAGES_PIPELINE,
    TAILORS_ROSTER,
    getAllOrders,
    updateOrderStatus,
} from '@/data/adminOrdersData'

// ─── Inline SVG Icons ──────────────────────────────────────────────────────────
const IconSearch = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', color: '#8A7A6E', flexShrink: 0 }}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
)

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
)

const IconKanban = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><rect x="3" y="3" width="5" height="18" rx="1" /><rect x="11" y="3" width="5" height="12" rx="1" /><rect x="19" y="3" width="5" height="15" rx="1" /></svg>
)

const IconList = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '16px', height: '16px', flexShrink: 0 }}><line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" /></svg>
)

const IconAlertTriangle = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', flexShrink: 0, color: '#DC2626' }}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
)

const IconCalendar = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ width: '13px', height: '13px', flexShrink: 0, color: '#8A7A6E' }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
)

const IconChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '14px', height: '14px', color: '#8A7A6E', flexShrink: 0 }}><polyline points="9 18 15 12 9 6" /></svg>
)

export default function AdminOrdersBoardPage() {
    const router = useRouter()
    const [orders, setOrders] = useState<AdminOrder[]>([])
    const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban')
    const [searchQuery, setSearchQuery] = useState('')
    const [locationFilter, setLocationFilter] = useState<'All' | Location>('All')
    const [tailorFilter, setTailorFilter] = useState<string>('All')
    const [depositFilter, setDepositFilter] = useState<'All' | 'PAID' | 'UNPAID'>('All')
    const [overdueOnly, setOverdueOnly] = useState(false)
    const [draggedOrderId, setDraggedOrderId] = useState<string | null>(null)
    const [dragOverColumn, setDragOverColumn] = useState<OrderStatus | null>(null)

    // Load orders on mount
    useEffect(() => {
        setOrders(getAllOrders())
    }, [])

    // Filtered orders
    const filteredOrders = useMemo(() => {
        return orders.filter((order) => {
            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim()
                const matchesId = order.orderNumber.toLowerCase().includes(q)
                const matchesName = order.customer.name.toLowerCase().includes(q)
                const matchesGarment = order.design.name.toLowerCase().includes(q)
                if (!matchesId && !matchesName && !matchesGarment) return false
            }
            // Location filter
            if (locationFilter !== 'All' && order.details.deliveryLocation !== locationFilter) {
                return false
            }
            // Tailor filter
            if (tailorFilter !== 'All' && !order.tailorAssigned.includes(tailorFilter)) {
                return false
            }
            // Deposit filter
            if (depositFilter !== 'All' && order.payment.depositStatus !== depositFilter) {
                return false
            }
            // Overdue filter
            if (overdueOnly && !order.isOverdue) {
                return false
            }
            return true
        })
    }, [orders, searchQuery, locationFilter, tailorFilter, depositFilter, overdueOnly])

    // Grouping by status
    const ordersByStage = useMemo(() => {
        const map: Record<OrderStatus, AdminOrder[]> = {
            NEW: [],
            CONFIRMED: [],
            IN_PRODUCTION: [],
            INSPECTION: [],
            APPROVED: [],
            DISPATCHED: [],
            DELIVERED: [],
        }
        filteredOrders.forEach((o) => {
            if (map[o.status]) {
                map[o.status].push(o)
            }
        })
        return map
    }, [filteredOrders])

    // Drag and Drop handlers
    const handleDragStart = (e: React.DragEvent, orderId: string) => {
        e.dataTransfer.setData('text/plain', orderId)
        setDraggedOrderId(orderId)
    }

    const handleDragOver = (e: React.DragEvent, stageKey: OrderStatus) => {
        e.preventDefault()
        if (dragOverColumn !== stageKey) {
            setDragOverColumn(stageKey)
        }
    }

    const handleDragLeave = (stageKey: OrderStatus) => {
        if (dragOverColumn === stageKey) {
            setDragOverColumn(null)
        }
    }

    const handleDrop = (e: React.DragEvent, newStage: OrderStatus) => {
        e.preventDefault()
        const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId
        setDragOverColumn(null)
        setDraggedOrderId(null)

        if (orderId) {
            updateOrderStatus(orderId, newStage)
            setOrders(getAllOrders())
        }
    }

    const activeCount = orders.filter((o) => o.status !== 'DELIVERED').length
    const overdueCount = orders.filter((o) => o.isOverdue).length

    return (
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
            {/* ─── Top Header ────────────────────────────────────────────────────────── */}
            <div
                style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                }}
            >
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <h1
                            style={{
                                fontSize: '1.75rem',
                                fontWeight: 700,
                                color: '#1C0F07',
                                letterSpacing: '-0.02em',
                                margin: 0,
                            }}
                        >
                            Orders Pipeline
                        </h1>
                        <span
                            style={{
                                backgroundColor: '#FDF3E7',
                                color: '#C4975A',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '9999px',
                                border: '1px solid #EAD8C3',
                            }}
                        >
                            {activeCount} active
                        </span>
                        {overdueCount > 0 && (
                            <span
                                style={{
                                    backgroundColor: '#FEE2E2',
                                    color: '#DC2626',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    padding: '0.25rem 0.65rem',
                                    borderRadius: '9999px',
                                    border: '1px solid #FCA5A5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                }}
                            >
                                <IconAlertTriangle />
                                {overdueCount} overdue
                            </span>
                        )}
                    </div>
                    <p
                        style={{
                            fontSize: '0.875rem',
                            color: '#8A7A6E',
                            margin: 0,
                            marginTop: '0.25rem',
                        }}
                    >
                        Real-time bespoke production tracking from deposit to final delivery.
                    </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* View Switcher (Kanban vs List) */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#F3EFE9',
                            borderRadius: '10px',
                            padding: '0.25rem',
                            gap: '0.25rem',
                            border: '1px solid #E4DDD3',
                        }}
                    >
                        <button
                            type="button"
                            onClick={() => setViewMode('kanban')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'all 0.15s ease',
                                backgroundColor: viewMode === 'kanban' ? '#FFFFFF' : 'transparent',
                                color: viewMode === 'kanban' ? '#1C0F07' : '#8A7A6E',
                                boxShadow: viewMode === 'kanban' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            <IconKanban />
                            <span>Board</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode('list')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                padding: '0.45rem 0.85rem',
                                borderRadius: '8px',
                                fontSize: '0.8125rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none',
                                transition: 'all 0.15s ease',
                                backgroundColor: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                                color: viewMode === 'list' ? '#1C0F07' : '#8A7A6E',
                                boxShadow: viewMode === 'list' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                            }}
                        >
                            <IconList />
                            <span>List</span>
                        </button>
                    </div>

                    {/* New Order Button */}
                    <Link
                        href="/admin/orders/new"
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            backgroundColor: '#C4975A',
                            color: '#FFFFFF',
                            fontSize: '0.875rem',
                            fontWeight: 600,
                            padding: '0.625rem 1.125rem',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            boxShadow: '0 2px 6px rgba(196,151,90,0.3)',
                            transition: 'background-color 0.15s ease',
                        }}
                    >
                        <IconPlus />
                        <span>New Order</span>
                    </Link>
                </div>
            </div>

            {/* ─── Filter & Search Bar ────────────────────────────────────────────────── */}
            <div
                style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    padding: '1rem 1.25rem',
                    border: '1px solid #EDE8E1',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                }}
            >
                {/* Search Input */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        backgroundColor: '#FAF7F2',
                        border: '1px solid #E5DFD7',
                        borderRadius: '9px',
                        padding: '0.5rem 0.85rem',
                        minWidth: '260px',
                        flex: '1 1 280px',
                    }}
                >
                    <IconSearch />
                    <input
                        type="text"
                        placeholder="Search by customer name, order number, garment..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            border: 'none',
                            outline: 'none',
                            backgroundColor: 'transparent',
                            fontSize: '0.84rem',
                            color: '#1C0F07',
                            width: '100%',
                        }}
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            style={{
                                border: 'none',
                                background: 'transparent',
                                color: '#A8998C',
                                cursor: 'pointer',
                                fontSize: '0.8rem',
                                padding: 0,
                            }}
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Filters Row */}
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        gap: '0.75rem',
                    }}
                >
                    {/* Location Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Location:
                        </span>
                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {(['All', 'Italy', 'Nigeria'] as const).map((loc) => (
                                <button
                                    key={loc}
                                    type="button"
                                    onClick={() => setLocationFilter(loc)}
                                    style={{
                                        border: '1px solid',
                                        borderColor: locationFilter === loc ? '#C4975A' : '#E8E2D9',
                                        backgroundColor: locationFilter === loc ? '#FDF3E7' : '#FFFFFF',
                                        color: locationFilter === loc ? '#C4975A' : '#6E5D4F',
                                        fontSize: '0.78rem',
                                        fontWeight: locationFilter === loc ? 700 : 500,
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '7px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {loc === 'Italy' ? '🇮🇹 Italy' : loc === 'Nigeria' ? '🇳🇬 Nigeria' : 'All'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tailor Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Tailor:
                        </span>
                        <select
                            value={tailorFilter}
                            onChange={(e) => setTailorFilter(e.target.value)}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '7px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="All">All Tailors</option>
                            {TAILORS_ROSTER.map((t) => (
                                <option key={t.id} value={t.name.split(' ')[0]}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Deposit Filter */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Deposit:
                        </span>
                        <select
                            value={depositFilter}
                            onChange={(e) => setDepositFilter(e.target.value as 'All' | 'PAID' | 'UNPAID')}
                            style={{
                                border: '1px solid #E5DFD7',
                                backgroundColor: '#FAF7F2',
                                color: '#1C0F07',
                                fontSize: '0.78rem',
                                padding: '0.35rem 0.65rem',
                                borderRadius: '7px',
                                outline: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            <option value="All">All Deposit</option>
                            <option value="PAID">Deposit Paid</option>
                            <option value="UNPAID">Deposit Pending</option>
                        </select>
                    </div>

                    {/* Overdue Only Toggle */}
                    <button
                        type="button"
                        onClick={() => setOverdueOnly(!overdueOnly)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.35rem 0.75rem',
                            borderRadius: '7px',
                            border: overdueOnly ? '1px solid #EF4444' : '1px solid #E5DFD7',
                            backgroundColor: overdueOnly ? '#FEE2E2' : '#FFFFFF',
                            color: overdueOnly ? '#DC2626' : '#6E5D4F',
                            fontSize: '0.78rem',
                            fontWeight: overdueOnly ? 700 : 500,
                            cursor: 'pointer',
                        }}
                    >
                        <IconAlertTriangle />
                        <span>Overdue Only</span>
                    </button>
                </div>
            </div>

            {/* ─── Kanban Board View ──────────────────────────────────────────────────── */}
            {viewMode === 'kanban' && (
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, minmax(280px, 1fr))',
                        gap: '1.125rem',
                        overflowX: 'auto',
                        paddingBottom: '1.5rem',
                        alignItems: 'start',
                    }}
                >
                    {STAGES_PIPELINE.map((stage) => {
                        const columnOrders = ordersByStage[stage.key] || []
                        const isDragOver = dragOverColumn === stage.key

                        return (
                            <div
                                key={stage.key}
                                onDragOver={(e) => handleDragOver(e, stage.key)}
                                onDragLeave={() => handleDragLeave(stage.key)}
                                onDrop={(e) => handleDrop(e, stage.key)}
                                style={{
                                    backgroundColor: isDragOver ? '#F8F1E7' : '#F7F4EE',
                                    border: isDragOver ? '2px dashed #C4975A' : '1px solid #EAE3D9',
                                    borderRadius: '14px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    minHeight: '580px',
                                    transition: 'background-color 0.15s ease, border-color 0.15s ease',
                                }}
                            >
                                {/* Column Header */}
                                <div
                                    style={{
                                        padding: '1rem',
                                        borderBottom: '1px solid #EAE3D9',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        backgroundColor: '#FFFFFF',
                                        borderTopLeftRadius: '13px',
                                        borderTopRightRadius: '13px',
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div
                                            style={{
                                                width: '10px',
                                                height: '10px',
                                                borderRadius: '9999px',
                                                backgroundColor: stage.badgeColor,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: '0.85rem',
                                                fontWeight: 700,
                                                color: '#1C0F07',
                                            }}
                                        >
                                            {stage.label}
                                        </span>
                                    </div>
                                    <span
                                        style={{
                                            fontSize: '0.725rem',
                                            fontWeight: 700,
                                            padding: '0.15rem 0.5rem',
                                            borderRadius: '9999px',
                                            backgroundColor: stage.badgeBg,
                                            color: stage.badgeColor,
                                        }}
                                    >
                                        {columnOrders.length}
                                    </span>
                                </div>

                                {/* Cards List Container */}
                                <div
                                    style={{
                                        padding: '0.85rem',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.85rem',
                                        flex: 1,
                                    }}
                                >
                                    {columnOrders.map((order) => {
                                        const isDepositPaid = order.payment.depositStatus === 'PAID'
                                        const isCardOverdue = order.isOverdue

                                        return (
                                            <div
                                                key={order.id}
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, order.id)}
                                                onClick={() => router.push(`/admin/orders/${order.id}`)}
                                                style={{
                                                    backgroundColor: isCardOverdue ? '#FFF5F5' : '#FFFFFF',
                                                    border: isCardOverdue
                                                        ? '1.5px solid #EF4444'
                                                        : '1px solid #EDE8E1',
                                                    borderRadius: '12px',
                                                    padding: '1rem',
                                                    cursor: 'grab',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.03)',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: '0.65rem',
                                                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                                                }}
                                            >
                                                {/* Card Header: Order # + Location flag */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontSize: '0.8rem',
                                                            fontWeight: 700,
                                                            color: '#C4975A',
                                                            letterSpacing: '0.02em',
                                                        }}
                                                    >
                                                        {order.orderNumber}
                                                    </span>

                                                    <span
                                                        style={{
                                                            fontSize: '0.75rem',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.25rem',
                                                            backgroundColor: '#F7F4EE',
                                                            padding: '0.15rem 0.45rem',
                                                            borderRadius: '5px',
                                                            color: '#6E5D4F',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        {order.details.deliveryLocation === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                                    </span>
                                                </div>

                                                {/* Customer Name */}
                                                <div
                                                    style={{
                                                        fontSize: '0.925rem',
                                                        fontWeight: 700,
                                                        color: isCardOverdue ? '#B91C1C' : '#1C0F07',
                                                        lineHeight: 1.25,
                                                    }}
                                                >
                                                    {order.customer.name}
                                                </div>

                                                {/* Garment Type */}
                                                <div
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        color: '#6E5D4F',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.35rem',
                                                    }}
                                                >
                                                    <span style={{ color: '#C4975A' }}>✦</span>
                                                    <span>{order.design.name}</span>
                                                </div>

                                                {/* Divider */}
                                                <div style={{ height: '1px', backgroundColor: isCardOverdue ? '#FCA5A5' : '#F3EFE9', margin: '0.15rem 0' }} />

                                                {/* Deadline & Deposit badges */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        gap: '0.5rem',
                                                    }}
                                                >
                                                    {/* Deadline */}
                                                    <div
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '0.3rem',
                                                            fontSize: '0.75rem',
                                                            color: isCardOverdue ? '#DC2626' : '#8A7A6E',
                                                            fontWeight: isCardOverdue ? 700 : 500,
                                                        }}
                                                    >
                                                        {isCardOverdue ? <IconAlertTriangle /> : <IconCalendar />}
                                                        <span>Due {order.details.deadline.split('-').slice(1).join('/')}</span>
                                                    </div>

                                                    {/* Deposit Badge */}
                                                    <span
                                                        style={{
                                                            fontSize: '0.675rem',
                                                            fontWeight: 700,
                                                            padding: '0.15rem 0.45rem',
                                                            borderRadius: '5px',
                                                            backgroundColor: isDepositPaid ? '#DCFCE7' : '#FEE2E2',
                                                            color: isDepositPaid ? '#166534' : '#DC2626',
                                                            border: isDepositPaid ? '1px solid #BBF7D0' : '1px solid #FCA5A5',
                                                        }}
                                                    >
                                                        {isDepositPaid ? 'Deposit Paid' : 'Deposit Unpaid'}
                                                    </span>
                                                </div>

                                                {/* Tailor Assigned Footer */}
                                                <div
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        fontSize: '0.725rem',
                                                        color: '#8A7A6E',
                                                        paddingTop: '0.2rem',
                                                    }}
                                                >
                                                    <span>Artisan:</span>
                                                    <span style={{ fontWeight: 600, color: '#3A2B20' }}>
                                                        {order.tailorAssigned.split(' ')[0]}
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    })}

                                    {columnOrders.length === 0 && (
                                        <div
                                            style={{
                                                padding: '2.5rem 1rem',
                                                textAlign: 'center',
                                                color: '#A8998C',
                                                fontSize: '0.78rem',
                                                fontStyle: 'italic',
                                                border: '1px dashed #E0D7CB',
                                                borderRadius: '10px',
                                                margin: '0.5rem 0',
                                            }}
                                        >
                                            No orders in this stage
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ─── List View (Dense Table) ────────────────────────────────────────────── */}
            {viewMode === 'list' && (
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '14px',
                        border: '1px solid #EDE8E1',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
                        overflowX: 'auto',
                    }}
                >
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EAE3D9' }}>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Garment</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Location</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Tailor</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deadline</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deposit</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                <th style={{ padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: 700, color: '#8A7A6E', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => {
                                const stageMeta = STAGES_PIPELINE.find((s) => s.key === order.status) || STAGES_PIPELINE[0]
                                const isDepositPaid = order.payment.depositStatus === 'PAID'

                                return (
                                    <tr
                                        key={order.id}
                                        style={{
                                            borderBottom: '1px solid #F3EFE9',
                                            backgroundColor: order.isOverdue ? '#FFF8F8' : 'transparent',
                                            transition: 'background-color 0.1s ease',
                                        }}
                                    >
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                {order.isOverdue && <IconAlertTriangle />}
                                                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C4975A' }}>
                                                    {order.orderNumber}
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07' }}>
                                                {order.customer.name}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: '#8A7A6E' }}>
                                                {order.customer.phone}
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#3A2B20' }}>
                                            {order.design.name}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6E5D4F' }}>
                                            {order.details.deliveryLocation === 'Italy' ? '🇮🇹 Italy' : '🇳🇬 Nigeria'}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem', fontSize: '0.85rem', color: '#6E5D4F' }}>
                                            {order.tailorAssigned}
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span
                                                style={{
                                                    fontSize: '0.825rem',
                                                    color: order.isOverdue ? '#DC2626' : '#6E5D4F',
                                                    fontWeight: order.isOverdue ? 700 : 500,
                                                }}
                                            >
                                                {order.details.deadline}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    padding: '0.2rem 0.55rem',
                                                    borderRadius: '6px',
                                                    backgroundColor: isDepositPaid ? '#DCFCE7' : '#FEE2E2',
                                                    color: isDepositPaid ? '#166534' : '#DC2626',
                                                    border: isDepositPaid ? '1px solid #BBF7D0' : '1px solid #FCA5A5',
                                                }}
                                            >
                                                {isDepositPaid ? 'Paid' : 'Unpaid'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <span
                                                style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: '9999px',
                                                    backgroundColor: stageMeta.badgeBg,
                                                    color: stageMeta.badgeColor,
                                                }}
                                            >
                                                {stageMeta.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem 1.25rem' }}>
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '0.35rem',
                                                    fontSize: '0.8125rem',
                                                    fontWeight: 600,
                                                    color: '#C4975A',
                                                    textDecoration: 'none',
                                                    padding: '0.35rem 0.75rem',
                                                    borderRadius: '7px',
                                                    backgroundColor: '#FDF3E7',
                                                    border: '1px solid #EAD8C3',
                                                }}
                                            >
                                                <span>View</span>
                                                <IconChevronRight />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
