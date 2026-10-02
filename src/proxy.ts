import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const config = {
    matcher: ['/admin', '/admin/:path*'],
}

/**
 * Route protection proxy for Atelier Admin routes.
 * Intercepts requests to /admin/* and ensures valid session credentials.
 */
export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl
    const sessionCookie = request.cookies.get('cs_admin_session')?.value

    const isLoginPage = pathname === '/admin/login' || pathname.startsWith('/admin/login/')

    // If visiting the login page while already authenticated, redirect to the dashboard
    if (isLoginPage) {
        if (sessionCookie) {
            return NextResponse.redirect(new URL('/admin', request.url))
        }
        return NextResponse.next()
    }

    // Protected admin route: if session cookie is missing, redirect to login with callback URL
    if (!sessionCookie) {
        const from = encodeURIComponent(pathname + search)
        const loginUrl = new URL(`/admin/login?from=${from}`, request.url)
        return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
}
