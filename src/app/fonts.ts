import { Cormorant_Garamond, Inter } from 'next/font/google'

/**
 * Display / heading face.
 * Cormorant Garamond — editorial serif that matches the bold condensed
 * typography in the Norven reference image. Used for all h1–h6,
 * hero text, and the brand wordmark.
 */
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
  preload: true,
})

/**
 * Body / UI face.
 * Inter — neutral, highly legible sans-serif for body copy, labels,
 * navigation links, form fields, and all small text.
 */
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
})