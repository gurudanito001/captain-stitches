'use client'

import { usePathname } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = pathname.startsWith('/admin/login')

    if (isAuthPage) {
        return <main className="min-h-screen" style={{ background: '#FAF7F2' }}>{children}</main>
    }

    return (
        <div className="min-h-screen" style={{ background: '#FAF7F2' }}>
            <AdminSidebar />
            <div style={{ marginLeft: '17rem' }}>
                <main className="min-h-screen">{children}</main>
            </div>
        </div>
    )
}