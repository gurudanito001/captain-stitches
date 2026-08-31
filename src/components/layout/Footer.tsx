import Link from 'next/link'

const collections = [
  { label: 'Native wear', href: '/catalogue?category=native-wear' },
  { label: 'English suits', href: '/catalogue?category=english-suit' },
  { label: 'Casual wear', href: '/catalogue?category=casual' },
  { label: "Children's clothing", href: '/catalogue?category=children' },
  { label: 'Custom order', href: '/order' },
]

const company = [
  { label: 'Our story', href: '/about' },
  { label: 'Blog', href: '/blog' },
  { label: 'Referral programme', href: '/referral' },
  { label: 'Contact', href: '/contact' },
]

const support = [
  { label: 'Track your order', href: '/track' },
  { label: 'How to measure', href: '/order#measurements' },
  { label: 'Shipping & delivery', href: '/contact#shipping' },
  { label: 'FAQs', href: '/contact#faq' },
]

export function Footer() {
  return (
    <footer className="bg-brown-950 border-t border-brown-800" style={{ padding: "32px 0px" }}>


      {/* Main footer content */}
      <div className="container-brand pt-24 pb-16 md:pt-32 md:pb-20" >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">

          {/* Brand column — spans 2 cols on large screens */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="font-display text-2xl font-bold tracking-wider text-cream-200 uppercase hover:text-caramel-500 transition-colors"
            >
              CaptainStitches
            </Link>

            <p className="text-body mt-4 max-w-xs">
              Bespoke fashion crafted in Nigeria, delivered to Italy and
              across Europe. Every piece made to your exact measurements.
            </p>

            <span className="accent-line mt-6 mb-4" />

            {/* Locations */}
            <div className="space-y-2">
              <p className="text-label">Verona, Italy</p>
              <p className="text-label">Lagos / Aba, Nigeria</p>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/message/PLACEHOLDER"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-label text-caramel-500 hover:text-caramel-400 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-label text-cream-200" style={{ marginBottom: "12px" }}>Collections</h3>
            <ul className="space-y-5" role="list">
              {collections.map(item => (
                <li key={item.href} style={{ marginBottom: "3px" }}>
                  <Link
                    href={item.href}
                    className="text-body text-stone-300 hover:text-caramel-500 transition-colors text-xs"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-label text-cream-200" style={{ marginBottom: "12px" }}>Company</h3>
            <ul className="space-y-5" role="list">
              {company.map(item => (
                <li key={item.href} style={{ marginBottom: "3px" }}>
                  <Link
                    href={item.href}
                    className="text-body text-stone-300 hover:text-caramel-500 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-label text-cream-200" style={{ marginBottom: "12px" }}>Support</h3>
            <ul className="space-y-5" role="list">
              {support.map(item => (
                <li key={item.href} style={{ marginBottom: "3px" }}>
                  <Link
                    href={item.href}
                    className="text-body text-stone-300 hover:text-caramel-500 transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Large brand wordmark — matches reference image footer */}
      <div
        className="container-brand pb-6 overflow-hidden"
        aria-hidden="true"
      >
        <p
          className="font-display font-bold uppercase leading-none select-none tracking-tight text-transparent"
          style={{
            fontSize: 'clamp(4rem, 15vw, 15rem)',
            WebkitTextStroke: '1px var(--color-brown-800)',
          }}
        >
          CAPTAIN<br />STITCHES
        </p>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brown-800" style={{ paddingTop: "20px" }}>
        <div className="container-brand py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-label text-stone-400 text-xs">
            © {new Date().getFullYear()} CaptainStitches. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-label text-stone-400 hover:text-caramel-500 transition-colors text-xs"
            >
              Privacy policy
            </Link>
            <Link
              href="/terms"
              className="text-label text-stone-400 hover:text-caramel-500 transition-colors text-xs"
            >
              Terms of use
            </Link>

            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href="https://instagram.com/captainstitches"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CaptainStitches on Instagram"
                className="text-stone-400 hover:text-caramel-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
                </svg>
              </a>
              <a
                href="https://facebook.com/captainstitches"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="CaptainStitches on Facebook"
                className="text-stone-400 hover:text-caramel-500 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}