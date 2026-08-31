import type { Metadata } from 'next'
import { cormorant, inter } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'CaptainStitches — Bespoke Fashion, Delivered',
    template: '%s | CaptainStitches',
  },
  description:
    'Bespoke Nigerian and European fashion made to your exact measurements. Native wear, English suits, and more — crafted in Nigeria, delivered to Italy and beyond.',
  keywords: [
    'bespoke tailor',
    'Nigerian fashion',
    'agbada Italy',
    'senator suit',
    'Nigerian suit Europe',
    'custom clothing delivery Italy',
    'bespoke African fashion',
  ],
  authors: [{ name: 'CaptainStitches' }],
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    alternateLocale: 'it_IT',
    siteName: 'CaptainStitches',
    title: 'CaptainStitches — Bespoke Fashion, Delivered',
    description:
      'Native Nigerian wear and English suits, made to your measurements and delivered across Europe.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CaptainStitches',
    description: 'Bespoke fashion. Crafted in Nigeria. Delivered to your door.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}