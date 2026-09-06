'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const IconDashboard = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>
)
const IconOrders = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" /><rect x="9" y="3" width="6" height="4" rx="1" /><path d="M9 12h6M9 16h4" /></svg>
)
const IconCustomers = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></svg>
)
const IconCatalogue = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
)
const IconReviews = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
)
const IconReferrals = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M17 1l4 4-4 4" /><path d="M3 11V9a4 4 0 0 1 4-4h14" /><path d="M7 23l-4-4 4-4" /><path d="M21 13v2a4 4 0 0 1-4 4H3" /></svg>
)
const IconBlog = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" /></svg>
)
const IconMarketing = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
)
const IconAnalytics = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
)
const IconSettings = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px', flexShrink: 0 }}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
)

const navItems = [
    { label: 'Overview', href: '/admin', icon: <IconDashboard /> },
    { label: 'Orders', href: '/admin/orders', icon: <IconOrders />, badge: 3 },
    { label: 'Customers', href: '/admin/customers', icon: <IconCustomers /> },
    { label: 'Catalogue', href: '/admin/catalogue', icon: <IconCatalogue /> },
    { label: 'Reviews', href: '/admin/reviews', icon: <IconReviews />, badge: 5 },
    { label: 'Referrals', href: '/admin/referrals', icon: <IconReferrals /> },
    { label: 'Blog', href: '/admin/blog', icon: <IconBlog /> },
    { label: 'Marketing', href: '/admin/marketing', icon: <IconMarketing /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <IconAnalytics /> },
]

const bottomItems = [
    { label: 'Settings', href: '/admin/settings', icon: <IconSettings /> },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const isActive = (href: string) =>
        href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

    return (
        <aside
            className="fixed left-0 top-0 bottom-0 z-40 flex flex-col"
            style={{ width: '17rem', background: '#ffffff', borderRight: '1px solid #EDE8E1' }}
        >
            {/* Header: Logo & initials with generous padding and spacing */}
            <div
                style={{
                    borderBottom: '1px solid #EDE8E1',
                    padding: '20px 22px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                }}
            >
                <div
                    style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '12px',
                        background: '#C4975A',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 5px rgba(196, 151, 90, 0.25)',
                    }}
                >
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff', fontFamily: 'serif', letterSpacing: '0.04em' }}>
                        CS
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <p style={{ fontSize: '0.975rem', fontWeight: 700, color: '#1C0F07', lineHeight: 1.25, letterSpacing: '-0.01em', margin: 0 }}>
                        CaptainStitches
                    </p>
                    <p style={{ fontSize: '0.6875rem', color: '#8C7B6B', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 500, margin: 0 }}>
                        Studio Admin
                    </p>
                </div>
            </div>

            {/* Main Navigation with comfortable padding and item spacing via style objects */}
            <nav
                aria-label="Admin navigation"
                style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '18px 12px 14px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <p
                    style={{
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        letterSpacing: '0.12em',
                        textTransform: 'uppercase',
                        color: '#A8998C',
                        padding: '6px 14px 10px 14px',
                        margin: 0,
                    }}
                >
                    Main Menu
                </p>
                <ul
                    role="list"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '6px',
                        listStyle: 'none',
                        margin: 0,
                        padding: 0,
                    }}
                >
                    {navItems.map(item => {
                        const active = isActive(item.href)
                        return (
                            <li key={item.href} style={{ margin: 0, padding: 0 }}>
                                <Link
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '11px 16px',
                                        borderRadius: '10px',
                                        background: active ? '#FDF3E7' : 'transparent',
                                        color: active ? '#C4975A' : '#6B5D52',
                                        textDecoration: 'none',
                                        transition: 'all 0.15s ease',
                                    }}
                                    aria-current={active ? 'page' : undefined}
                                >
                                    <span style={{ color: active ? '#C4975A' : '#A8998C', display: 'flex', alignItems: 'center' }}>
                                        {item.icon}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: active ? 600 : 500, flex: 1 }}>
                                        {item.label}
                                    </span>
                                    {item.badge && (
                                        <span
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: '999px',
                                                fontSize: '0.625rem',
                                                fontWeight: 700,
                                                minWidth: '20px',
                                                height: '20px',
                                                padding: '0 6px',
                                                background: active ? '#C4975A' : '#F5ECD9',
                                                color: active ? '#ffffff' : '#C4975A',
                                            }}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        )
                    })}
                </ul>

                <div
                    style={{
                        marginTop: '22px',
                        paddingTop: '16px',
                        borderTop: '1px solid #EDE8E1',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <p
                        style={{
                            fontSize: '0.625rem',
                            fontWeight: 700,
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: '#A8998C',
                            padding: '0 14px 10px 14px',
                            margin: 0,
                        }}
                    >
                        Preferences
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {bottomItems.map(item => {
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '11px 16px',
                                        borderRadius: '10px',
                                        background: active ? '#FDF3E7' : 'transparent',
                                        color: active ? '#C4975A' : '#6B5D52',
                                        textDecoration: 'none',
                                        transition: 'all 0.15s ease',
                                    }}
                                >
                                    <span style={{ color: active ? '#C4975A' : '#A8998C', display: 'flex', alignItems: 'center' }}>
                                        {item.icon}
                                    </span>
                                    <span style={{ fontSize: '0.85rem', fontWeight: active ? 600 : 500 }}>
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </nav>

            {/* Bottom promo card with generous margin/padding around and spacious contents */}
            <div style={{ padding: '10px 14px 16px 14px' }}>
                <div
                    style={{
                        borderRadius: '16px',
                        background: '#2C1810',
                        overflow: 'hidden',
                        padding: '20px 18px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '14px',
                        boxShadow: '0 4px 14px rgba(44, 24, 16, 0.12)',
                    }}
                >
                    <div
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '10px',
                            background: 'rgba(196, 151, 90, 0.18)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <span style={{ fontSize: '1.25rem', color: '#C4975A' }}>✦</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#F2EDE6', lineHeight: 1.3, margin: 0 }}>
                            Video inspection
                        </p>
                        <p style={{ fontSize: '0.75rem', color: '#A8998C', lineHeight: 1.5, margin: 0 }}>
                            2 garments are waiting for your review before dispatch
                        </p>
                    </div>
                    <Link
                        href="/admin/orders?filter=inspection"
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '10px',
                            padding: '11px 16px',
                            background: '#C4975A',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            color: '#ffffff',
                            textDecoration: 'none',
                            textAlign: 'center',
                            transition: 'background 0.2s ease',
                        }}
                    >
                        Review now
                    </Link>
                </div>
            </div>

            {/* Logged in User Section with generous padding and clear spacing */}
            <div
                style={{
                    borderTop: '1px solid #EDE8E1',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                }}
            >
                <div
                    style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: '#C4975A',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                    }}
                >
                    SA
                </div>
                <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '3px' }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1C0F07', lineHeight: 1.25, margin: 0 }}>
                        Samuelson A.
                    </p>
                    <p style={{ fontSize: '0.725rem', color: '#8C7B6B', margin: 0 }}>
                        Owner · Admin
                    </p>
                </div>
                <Link
                    href="/admin/login"
                    title="Sign out"
                    style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#8C7B6B',
                        textDecoration: 'none',
                        flexShrink: 0,
                        background: 'transparent',
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ width: '18px', height: '18px' }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                </Link>
            </div>
        </aside>
    )
}