
import { Navbar } from '@/components/layout/Navbar'
import Hero from './hero'
import Categories from './categories'
import FeaturedDesigns from './featured-designs'
import Testimonials from './testimonials'
import BlogPreview from './blog-preview'
import ReferralProgramme from './referral-programme'
import EmailCapture from './email-capture'
import { Footer } from '@/components/layout/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CaptainStitches — Bespoke Fashion, Delivered to Italy & Europe',
  description:
    'Bespoke Nigerian native wear and English suits made to your exact measurements. Crafted in Nigeria, delivered to Italy and across Europe.',
}


// ─── Page component ────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <Categories />
        <FeaturedDesigns />
        <Testimonials />
        <BlogPreview />
        <ReferralProgramme />
        <EmailCapture />
      </main>
      <Footer />
    </>
  )
}