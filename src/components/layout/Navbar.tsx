'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { label: 'Collection', href: '/catalogue' },
  { label: 'Our Story', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [language, setLanguage] = useState<'EN' | 'IT'>('EN')
  const [currency, setCurrency] = useState<'NGN' | 'EUR'>('NGN')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change / resize
  useEffect(() => {
    if (menuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const toggleLang = () => setLanguage(l => l === 'EN' ? 'IT' : 'EN')
  const toggleCurrency = () => setCurrency(c => c === 'NGN' ? 'EUR' : 'NGN')

  return (
    <>
      <header
        className={[
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled || menuOpen
            ? 'bg-brown-900/95 backdrop-blur-md border-b border-brown-700'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="container-brand">
          <nav
            className="flex items-center justify-between h-16 md:h-20"
            aria-label="Main navigation"
          >
            {/* Wordmark */}
            <Link
              href="/"
              className="font-display text-xl md:text-2xl font-bold tracking-wider text-cream-200 uppercase hover:text-caramel-500 transition-colors"
              aria-label="CaptainStitches home"
            >
              CaptainStitches
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden lg:flex items-center gap-8" role="list">
              {navLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-label text-stone-300 hover:text-caramel-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Desktop controls */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Language toggle */}
              <button
                onClick={toggleLang}
                className="text-label text-stone-300 hover:text-caramel-500 transition-colors"
                aria-label={`Switch to ${language === 'EN' ? 'Italian' : 'English'}`}
              >
                {language === 'EN' ? 'IT' : 'EN'}
              </button>

              {/* Divider */}
              <span className="w-px h-4 bg-brown-600" aria-hidden />

              {/* Currency toggle */}
              <button
                onClick={toggleCurrency}
                className="text-label text-stone-300 hover:text-caramel-500 transition-colors"
                aria-label={`Switch to ${currency === 'NGN' ? 'Euro' : 'Naira'}`}
              >
                {currency === 'NGN' ? '€ EUR' : '₦ NGN'}
              </button>

              {/* Divider */}
              <span className="w-px h-4 bg-brown-600" aria-hidden />

              {/* Track order */}
              <Link
                href="/track"
                className="text-label text-stone-300 hover:text-caramel-500 transition-colors"
              >
                Track order
              </Link>

              {/* CTA */}
              <Button href="/order" variant="primary" size="lg" style={{ padding: "10px 5px" }}>
                Order now
              </Button>
            </div>

            {/* Mobile Controls */}
            <div className="flex lg:hidden items-center gap-3">
              {/* Mobile Language Toggle */}
              <button
                onClick={toggleLang}
                className="text-[10px] tracking-[0.2em] font-semibold text-stone-300 hover:text-caramel-500 transition-colors p-2 cursor-pointer"
                aria-label={`Switch to ${language === 'EN' ? 'Italian' : 'English'}`}
              >
                {language === 'EN' ? 'IT' : 'EN'}
              </button>

              {/* Mobile hamburger */}
              <button
                className="flex flex-col gap-1.5 p-2 text-cream-200 cursor-pointer"
                onClick={() => setMenuOpen(o => !o)}
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
              >
                <span
                  className={[
                    'block w-6 h-px bg-current transition-transform duration-200',
                    menuOpen ? 'translate-y-2 rotate-45' : '',
                  ].join(' ')}
                />
                <span
                  className={[
                    'block w-6 h-px bg-current transition-opacity duration-200',
                    menuOpen ? 'opacity-0' : '',
                  ].join(' ')}
                />
                <span
                  className={[
                    'block w-6 h-px bg-current transition-transform duration-200',
                    menuOpen ? '-translate-y-2 -rotate-45' : '',
                  ].join(' ')}
                />
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile menu drawer backdrop */}
      <div
        className={[
          'fixed inset-0 z-40 bg-brown-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        ].join(' ')}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu drawer panel */}
      <div
        className={[
          'fixed right-0 top-0 bottom-0 z-45 w-full sm:w-[420px] bg-brown-900 border-l border-brown-800/80 shadow-2xl flex flex-col pt-36 pb-12 px-8 sm:px-12',
          'transition-transform duration-500 ease-out lg:hidden overflow-y-auto no-scrollbar',
          menuOpen ? 'translate-x-0' : 'translate-x-full',
        ].join(' ')}
        aria-hidden={!menuOpen}
      >
        {/* Navigation list with index numbers and borders */}
        <ul className="flex flex-col gap-5" style={{ marginTop: '100px' }} role="list">

          {navLinks.map((link, index) => (
            <li key={link.href} className="border-b border-brown-800/40 pb-4 last:border-0 last:pb-0 mt-2">
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-baseline gap-4 group"
              >
                <span className="font-body text-xs text-caramel-500/60 group-hover:text-caramel-500 transition-colors font-medium">
                  0{index + 1} /
                </span>
                <span className="font-display text-3xl font-light text-cream-200 group-hover:text-caramel-400 transition-colors uppercase tracking-wide">
                  {link.label}
                </span>
              </Link>
            </li>
          ))}
          <li className="border-b border-brown-800/40 pb-4 mt-2">
            <Link
              href="/track"
              onClick={() => setMenuOpen(false)}
              className="flex items-baseline gap-4 group"
            >
              <span className="font-body text-xs text-caramel-500/60 group-hover:text-caramel-500 transition-colors font-medium">
                0{navLinks.length + 1} /
              </span>
              <span className="font-display text-3xl font-light text-cream-200 group-hover:text-caramel-400 transition-colors uppercase tracking-wide">
                Track order
              </span>
            </Link>
          </li>
        </ul>

        {/* Spacer to push controls to the bottom in flex flow */}
        <div className="flex-1 min-h-[4rem]" />

        {/* Mobile controls & CTA grouped at bottom */}
        <div className="" style={{ marginBottom: '20px' }}>
          {/* Toggles */}
          <div className="flex items-center gap-6 pb-6 border-b border-brown-800/85">
            <button
              onClick={toggleLang}
              className="text-label text-stone-300 hover:text-caramel-500 transition-colors text-[10px] tracking-widest font-semibold uppercase"
            >
              {language} / {language === 'EN' ? 'IT' : 'EN'}
            </button>
            <button
              onClick={toggleCurrency}
              className="text-label text-stone-300 hover:text-caramel-500 transition-colors text-[10px] tracking-widest font-semibold uppercase"
            >
              {currency === 'NGN' ? '₦ NGN' : '€ EUR'}
            </button>
          </div>

          <Button
            href="/order"
            variant="primary"
            size="lg"
            fullWidth
            className="my-10"
            style={{ paddingTop: '12px', paddingBottom: '12px' }}
            onClick={() => setMenuOpen(false)}
          >
            Order your piece
          </Button>

          <p className="text-center text-[9px] text-stone-500 tracking-widest mt-6 uppercase font-body">
            Verona · Lagos · Aba
          </p>
        </div>
      </div>

      {/* WhatsApp floating button — sitewide */}
      <a
        href="https://wa.me/message/PLACEHOLDER"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-caramel-500 text-brown-900 shadow-lg hover:bg-caramel-400 transition-colors"
        aria-label="Chat on WhatsApp"
      >
        {/* WhatsApp icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-7 h-7"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
        </svg>
      </a>
    </>
  )
}