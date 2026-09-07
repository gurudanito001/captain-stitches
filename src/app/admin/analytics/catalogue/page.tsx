'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    CATALOGUE_PERFORMANCE_ITEMS,
    CatalogueDesignPerformance,
    exportAnalyticsCSV,
    DateRangeKey,
} from '@/data/adminAnalyticsData'
import {
    FiLayers,
    FiStar,
    FiAward,
    FiTrendingUp,
    FiAlertTriangle,
    FiDownload,
    FiArrowLeft,
    FiExternalLink,
    FiFilter,
    FiBarChart2,
    FiEye,
    FiShoppingBag,
} from '@/components/admin/AnalyticsIcons'

export default function CatalogueAnalyticsPage() {
    const [dateRange, setDateRange] = useState<DateRangeKey>('30d')
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
    const [sortBy, setSortBy] = useState<'orders' | 'revenue' | 'rating' | 'reviews'>('orders')
    const [currency, setCurrency] = useState<'EUR' | 'NGN'>('EUR')

    const categories = ['ALL', 'Native Wear', 'English Suits', 'Casual', "Children's"]

    // Filter & Sort
    const filteredItems = CATALOGUE_PERFORMANCE_ITEMS.filter((item) => {
        if (selectedCategory === 'ALL') return true
        return item.category === selectedCategory
    }).sort((a, b) => {
        if (sortBy === 'orders') return b.ordersCount - a.ordersCount
        if (sortBy === 'revenue') return b.revenueEUR - a.revenueEUR
        if (sortBy === 'rating') return b.avgRating - a.avgRating
        if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount
        return 0
    })

    const handleExport = () => {
        const rows = filteredItems.map((item, idx) => ({
            Rank: idx + 1,
            DesignName: item.name,
            Category: item.category,
            Orders: item.ordersCount,
            RevenueEUR: `€${item.revenueEUR.toLocaleString()}`,
            RevenueNGN: `₦${item.revenueNGN.toLocaleString()}`,
            Rating: item.avgRating,
            Reviews: item.reviewsCount,
            Status: item.isDormant90d ? 'Dormant (90d+)' : 'Active Top-Tier',
        }))
        exportAnalyticsCSV('Catalogue_Performance_Report', rows)
    }

    return (
        <div style={{ padding: '32px', backgroundColor: '#FAF7F2', minHeight: '100vh' }}>
                {/* Top Header & Breadcrumb */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                            <Link
                                href="/admin/analytics"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '13px',
                                    color: '#7C6F65',
                                    textDecoration: 'none',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #EDE8E1',
                                }}
                            >
                                <FiArrowLeft size={14} /> Back to Overview
                            </Link>
                            <span style={{ fontSize: '13px', color: '#B3A89D' }}>/</span>
                            <span style={{ fontSize: '13px', color: '#1C0F07', fontWeight: 600 }}>Catalogue</span>
                        </div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Catalogue & Design Intelligence
                        </h1>
                        <p style={{ fontSize: '14px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                            Sartorial silhouette performance, revenue attribution, and fabric demand analytics.
                        </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {/* Currency Toggle */}
                        <div style={{ display: 'inline-flex', padding: '3px', backgroundColor: '#EDE8E1', borderRadius: '8px' }}>
                            {(['EUR', 'NGN'] as const).map((curr) => (
                                <button
                                    key={curr}
                                    type="button"
                                    onClick={() => setCurrency(curr)}
                                    style={{
                                        padding: '6px 14px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: currency === curr ? '#FFFFFF' : 'transparent',
                                        color: currency === curr ? '#1C0F07' : '#7C6F65',
                                        boxShadow: currency === curr ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {curr === 'EUR' ? '€ EUR' : '₦ NGN'}
                                </button>
                            ))}
                        </div>

                        {/* Date Range Selector */}
                        <div style={{ display: 'inline-flex', padding: '3px', backgroundColor: '#EDE8E1', borderRadius: '8px' }}>
                            {(['7d', '30d', '3m', '6m', '12m'] as const).map((range) => (
                                <button
                                    key={range}
                                    type="button"
                                    onClick={() => setDateRange(range)}
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        fontWeight: 600,
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        backgroundColor: dateRange === range ? '#1C0F07' : 'transparent',
                                        color: dateRange === range ? '#FAF7F2' : '#7C6F65',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    {range.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleExport}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '9px 16px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #EDE8E1',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#1C0F07',
                                cursor: 'pointer',
                            }}
                        >
                            <FiDownload size={14} color="#C4975A" /> Export Report
                        </button>
                    </div>
                </div>

                {/* Top-Level KPI Strip */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        marginBottom: '32px',
                    }}
                >
                    {[
                        {
                            label: 'Active Silhouettes',
                            value: '24 Designs',
                            sub: 'Across 4 collections',
                            icon: <FiLayers size={18} color="#C4975A" />,
                        },
                        {
                            label: 'Top Performing Design',
                            value: 'Grand Agbada',
                            sub: currency === 'EUR' ? '42 orders (€10.8k)' : '42 orders (₦18.9M)',
                            icon: <FiAward size={18} color="#C4975A" />,
                        },
                        {
                            label: 'Average Value Per Design',
                            value: currency === 'EUR' ? '€560 / order' : '₦980,000 / order',
                            sub: '+4.2% price retention',
                            icon: <FiTrendingUp size={18} color="#2E7D32" />,
                        },
                        {
                            label: 'Top Category by Volume',
                            value: 'Native Wear (58%)',
                            sub: '96 orders in period',
                            icon: <FiShoppingBag size={18} color="#1565C0" />,
                        },
                        {
                            label: 'Top Category by Revenue',
                            value: 'English Suits',
                            sub: currency === 'EUR' ? '€28,400 collected' : '₦49,700,000 collected',
                            icon: <FiBarChart2 size={18} color="#C4975A" />,
                        },
                        {
                            label: 'Catalogue Conversion',
                            value: '4.8%',
                            sub: 'Views to paid deposit',
                            icon: <FiEye size={18} color="#2E7D32" />,
                        },
                    ].map((kpi, i) => (
                        <div
                            key={i}
                            style={{
                                backgroundColor: '#FFFFFF',
                                borderRadius: '12px',
                                border: '1px solid #EDE8E1',
                                padding: '20px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <span style={{ fontSize: '12px', fontWeight: 600, color: '#7C6F65', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {kpi.label}
                                </span>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#FAF7F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {kpi.icon}
                                </div>
                            </div>
                            <div>
                                <div style={{ fontSize: '20px', fontWeight: 700, color: '#1C0F07', marginBottom: '4px' }}>
                                    {kpi.value}
                                </div>
                                <div style={{ fontSize: '12px', color: '#7C6F65' }}>
                                    {kpi.sub}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Section 1: Ranked Design Performance Table */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                        marginBottom: '32px',
                        overflowX: 'auto',
                    }}
                >
                    {/* Table Filters & Sorting Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Sartorial Performance Matrix
                            </h2>
                            <p style={{ fontSize: '13px', color: '#7C6F65', margin: '4px 0 0 0' }}>
                                Ranked by commissions, revenue yield, and patron satisfaction.
                            </p>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            {/* Category Filter Tabs */}
                            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#FAF7F2', padding: '3px', borderRadius: '8px', border: '1px solid #EDE8E1' }}>
                                {categories.map((cat) => (
                                    <button
                                        key={cat}
                                        type="button"
                                        onClick={() => setSelectedCategory(cat)}
                                        style={{
                                            padding: '5px 12px',
                                            fontSize: '12px',
                                            fontWeight: 600,
                                            borderRadius: '6px',
                                            border: 'none',
                                            cursor: 'pointer',
                                            backgroundColor: selectedCategory === cat ? '#1C0F07' : 'transparent',
                                            color: selectedCategory === cat ? '#FAF7F2' : '#7C6F65',
                                            transition: 'all 0.15s ease',
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>

                            {/* Sort Selector */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '12px', color: '#7C6F65', fontWeight: 600 }}>Sort:</span>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    style={{
                                        padding: '6px 12px',
                                        fontSize: '12px',
                                        borderRadius: '6px',
                                        border: '1px solid #EDE8E1',
                                        backgroundColor: '#FFFFFF',
                                        color: '#1C0F07',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                    }}
                                >
                                    <option value="orders">Most Ordered</option>
                                    <option value="revenue">Highest Revenue</option>
                                    <option value="rating">Highest Rated</option>
                                    <option value="reviews">Most Reviewed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#FAF7F2', borderBottom: '1px solid #EDE8E1' }}>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#7C6F65' }}>Rank</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Silhouette & Design</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Collection</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Commissions</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Revenue Yield</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Patron Rating</th>
                                <th style={{ padding: '12px 16px', fontWeight: 700, color: '#1C0F07' }}>Status</th>
                                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1C0F07' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map((item, idx) => {
                                const isTop = item.isTopPerformer
                                const isDormant = item.isDormant90d

                                let rowBg = '#FFFFFF'
                                if (isTop) rowBg = 'rgba(196, 151, 90, 0.08)'
                                if (isDormant) rowBg = 'rgba(239, 83, 80, 0.05)'

                                return (
                                    <tr
                                        key={item.id}
                                        style={{
                                            borderBottom: '1px solid #EDE8E1',
                                            backgroundColor: rowBg,
                                            transition: 'background-color 0.15s ease',
                                        }}
                                    >
                                        <td style={{ padding: '14px 16px', fontWeight: 700, color: isTop ? '#C4975A' : '#7C6F65' }}>
                                            {isTop ? '🏆 #1' : `#${idx + 1}`}
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div
                                                    style={{
                                                        width: '44px',
                                                        height: '56px',
                                                        borderRadius: '6px',
                                                        overflow: 'hidden',
                                                        position: 'relative',
                                                        backgroundColor: '#FAF7F2',
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    <Image
                                                        src={item.thumbnail}
                                                        alt={item.name}
                                                        fill
                                                        sizes="44px"
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#1C0F07', fontSize: '14px' }}>
                                                        {item.name}
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                                        SKU: {item.id.toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <span
                                                style={{
                                                    fontSize: '11px',
                                                    fontWeight: 600,
                                                    padding: '4px 8px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#FAF7F2',
                                                    border: '1px solid #EDE8E1',
                                                    color: '#1C0F07',
                                                }}
                                            >
                                                {item.category}
                                            </span>
                                        </td>
                                        <td style={{ padding: '14px 16px', fontWeight: 700, color: '#1C0F07' }}>
                                            {item.ordersCount} pieces
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ fontWeight: 700, color: '#1C0F07' }}>
                                                {currency === 'EUR' ? `€${item.revenueEUR.toLocaleString()}` : `₦${item.revenueNGN.toLocaleString()}`}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#7C6F65' }}>
                                                {currency === 'EUR' ? `₦${item.revenueNGN.toLocaleString()}` : `€${item.revenueEUR.toLocaleString()}`}
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontWeight: 700, color: '#C4975A' }}>
                                                    <FiStar size={13} fill="#C4975A" />
                                                    {item.avgRating.toFixed(1)}
                                                </span>
                                                <span style={{ fontSize: '11px', color: '#7C6F65' }}>
                                                    ({item.reviewsCount} reviews)
                                                </span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 16px' }}>
                                            {isTop && (
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        color: '#8A5D18',
                                                        backgroundColor: '#FFF4DE',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #F5D38A',
                                                    }}
                                                >
                                                    <FiAward size={12} /> Top Performer
                                                </span>
                                            )}
                                            {isDormant && (
                                                <span
                                                    style={{
                                                        display: 'inline-flex',
                                                        alignItems: 'center',
                                                        gap: '4px',
                                                        fontSize: '11px',
                                                        fontWeight: 700,
                                                        color: '#C62828',
                                                        backgroundColor: '#FFEBEE',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                        border: '1px solid #FFCDD2',
                                                    }}
                                                >
                                                    <FiAlertTriangle size={12} /> Dormant &gt;90d
                                                </span>
                                            )}
                                            {!isTop && !isDormant && (
                                                <span
                                                    style={{
                                                        fontSize: '11px',
                                                        fontWeight: 600,
                                                        color: '#2E7D32',
                                                        backgroundColor: '#E8F5E9',
                                                        padding: '3px 8px',
                                                        borderRadius: '6px',
                                                    }}
                                                >
                                                    Active Demand
                                                </span>
                                            )}
                                        </td>
                                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                                            <Link
                                                href={`/admin/catalogue/${item.id}`}
                                                style={{
                                                    display: 'inline-flex',
                                                    alignItems: 'center',
                                                    gap: '4px',
                                                    padding: '6px 12px',
                                                    borderRadius: '6px',
                                                    backgroundColor: '#FAF7F2',
                                                    border: '1px solid #EDE8E1',
                                                    fontSize: '12px',
                                                    fontWeight: 600,
                                                    color: '#1C0F07',
                                                    textDecoration: 'none',
                                                }}
                                            >
                                                Edit <FiExternalLink size={12} />
                                            </Link>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Section 2: Fabrics & Colour Popularity */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                    {/* Fabric Popularity */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Fabric Demand Breakdown
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Client preferences across bespoke garment commissions
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { name: 'Super 150s Italian Wool (Biella)', share: 36.4, count: 54, color: '#1C0F07' },
                                { name: 'Pure Irish & Mediterranean Linen', share: 24.2, count: 36, color: '#C4975A' },
                                { name: 'Loro Piana Double Cashmere', share: 18.5, count: 27, color: '#8A5D18' },
                                { name: 'Heavyweight Silk Velvet', share: 12.8, count: 19, color: '#5B3926' },
                                { name: 'Egyptian Giza Cotton', share: 8.1, count: 12, color: '#7C6F65' },
                            ].map((fab, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                            {fab.name}
                                        </span>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#7C6F65' }}>{fab.count} orders</span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>{fab.share}%</span>
                                        </div>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${fab.share}%`,
                                                height: '100%',
                                                backgroundColor: fab.color,
                                                borderRadius: '4px',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Colour Palette Popularity */}
                    <div
                        style={{
                            backgroundColor: '#FFFFFF',
                            borderRadius: '12px',
                            border: '1px solid #EDE8E1',
                            padding: '24px',
                        }}
                    >
                        <div style={{ marginBottom: '20px' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                                Colour Palette Popularity
                            </h2>
                            <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                                Sartorial hues chosen across international clientele
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {[
                                { name: 'Midnight Navy', hex: '#0B1B3D', share: 31.0, count: 46 },
                                { name: 'Espresso & Caramel Brown', hex: '#3E2723', share: 22.5, count: 33 },
                                { name: 'Deep Emerald Green', hex: '#1B5E20', share: 19.8, count: 29 },
                                { name: 'Imperial Burgundy / Wine', hex: '#880E4F', share: 15.2, count: 22 },
                                { name: 'Desert Sand & Pristine Ivory', hex: '#D7CCC8', share: 11.5, count: 17 },
                            ].map((col, i) => (
                                <div key={i}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ width: '14px', height: '14px', borderRadius: '4px', backgroundColor: col.hex, border: '1px solid #EDE8E1' }}></span>
                                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C0F07' }}>
                                                {col.name}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '12px', color: '#7C6F65' }}>{col.count} commissions</span>
                                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#1C0F07' }}>{col.share}%</span>
                                        </div>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: '#FAF7F2', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div
                                            style={{
                                                width: `${col.share}%`,
                                                height: '100%',
                                                backgroundColor: col.hex,
                                                borderRadius: '4px',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 3: Catalogue Conversion Funnel */}
                <div
                    style={{
                        backgroundColor: '#FFFFFF',
                        borderRadius: '12px',
                        border: '1px solid #EDE8E1',
                        padding: '24px',
                    }}
                >
                    <div style={{ marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1C0F07', margin: 0 }}>
                            Public Catalogue Conversion Funnel
                        </h2>
                        <p style={{ fontSize: '12px', color: '#7C6F65', margin: '2px 0 0 0' }}>
                            Progression from initial lookbook view to confirmed bespoke deposit
                        </p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                        {[
                            { step: '1. Lookbook Views', count: '4,280', drop: '0%', rate: '100%', color: '#1C0F07' },
                            { step: '2. Silhouette Detail Clicks', count: '1,712', drop: '-60.0%', rate: '40.0%', color: '#C4975A' },
                            { step: '3. Order Enquiries Started', count: '386', drop: '-77.5%', rate: '9.0%', color: '#8A5D18' },
                            { step: '4. 50% Deposit Paid', count: '205', drop: '-46.9%', rate: '4.8%', color: '#2E7D32' },
                        ].map((funnel, i) => (
                            <div
                                key={i}
                                style={{
                                    backgroundColor: '#FAF7F2',
                                    borderRadius: '10px',
                                    border: '1px solid #EDE8E1',
                                    padding: '16px',
                                    position: 'relative',
                                }}
                            >
                                <div style={{ fontSize: '11px', fontWeight: 600, color: '#7C6F65', textTransform: 'uppercase', marginBottom: '8px' }}>
                                    {funnel.step}
                                </div>
                                <div style={{ fontSize: '24px', fontWeight: 700, color: funnel.color, marginBottom: '6px' }}>
                                    {funnel.count}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#7C6F65' }}>
                                    <span>Funnel conversion: <b>{funnel.rate}</b></span>
                                    {i > 0 && <span style={{ color: '#C62828' }}>{funnel.drop}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
        </div>
    )
}
