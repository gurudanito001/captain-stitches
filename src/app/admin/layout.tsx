'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { validateAdminSessionAction } from '@/lib/actions/auth'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const router = useRouter()
    const isAuthPage = pathname.startsWith('/admin/login')
    const [isVerifying, setIsVerifying] = useState(!isAuthPage)

    useEffect(() => {
        if (isAuthPage) {
            setIsVerifying(false)
            return
        }

        let isMounted = true
        validateAdminSessionAction()
            .then((res) => {
                if (!isMounted) return
                if (!res.authenticated) {
                    const from = encodeURIComponent(pathname)
                    router.replace(`/admin/login?from=${from}`)
                } else {
                    setIsVerifying(false)
                }
            })
            .catch(() => {
                if (isMounted) setIsVerifying(false)
            })

        return () => {
            isMounted = false
        }
    }, [pathname, isAuthPage, router])

    if (isAuthPage) {
        return <main className="min-h-screen" style={{ background: '#FAF7F2' }}>{children}</main>
    }

    if (isVerifying) {
        return (
            <div
                className="min-h-screen flex items-center justify-center"
                style={{ background: '#FAF7F2', color: '#7C6F64' }}
            >
                <div style={{ textAlign: 'center' }}>
                    <div
                        style={{
                            width: '42px',
                            height: '42px',
                            margin: '0 auto 14px auto',
                            borderRadius: '12px',
                            backgroundColor: '#C4975A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#FFFFFF',
                            fontWeight: 700,
                            fontFamily: 'serif',
                            boxShadow: '0 4px 14px rgba(196, 151, 90, 0.3)',
                        }}
                    >
                        CS
                    </div>
                    <p style={{ fontSize: '13px', fontWeight: 500, letterSpacing: '0.04em' }}>
                        Verifying Atelier Security...
                    </p>
                </div>
            </div>
        )
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