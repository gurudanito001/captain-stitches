import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen" style={{ background: '#FAF7F2' }}>
            <AdminSidebar />
            <div style={{ marginLeft: '17rem' }}>
                <main className="min-h-screen">{children}</main>
            </div>
        </div>
    )
}