'use client'

import { use, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import { BLOG_POSTS } from '@/utils/blogData'

export default function BlogPostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = use(params)

  // Find active blog post
  const post = useMemo(() => {
    return BLOG_POSTS.find(p => p.slug === slug)
  }, [slug])

  // Find related posts (excluding current one)
  const relatedPosts = useMemo(() => {
    if (!post) return []
    return BLOG_POSTS.filter(p => p.slug !== slug).slice(0, 3)
  }, [post, slug])

  if (!post) {
    return (
      <>
        <Navbar />
        <main
          className="bg-[#0C0704] min-h-screen flex items-center justify-center text-center text-cream-100"
          style={{ paddingTop: '140px', paddingBottom: '100px', paddingLeft: '20px', paddingRight: '20px' }}
        >
          <div style={{ maxWidth: '500px', margin: '0 auto' }}>
            <span className="text-[#C4975A] text-4xl block mb-4">✦</span>
            <h1 className="font-serif text-3xl font-bold text-cream-100 mb-3">Article Not Found</h1>
            <p className="font-body text-stone-300 text-sm mb-6">
              The editorial article you are seeking is either archived or unavailable.
            </p>
            <Button href="/blog" variant="primary">
              Return to The Journal
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Pre-configured social links
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://captainstitches.com/blog/${slug}`
  const shareText = encodeURIComponent(`Read "${post.title}" on CaptainStitches Journal`)

  const shareWhatsApp = `https://wa.me/?text=${shareText}%20${encodeURIComponent(pageUrl)}`
  const shareTwitter = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(pageUrl)}`
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-950 min-h-screen">
        {/* =========================================================================
            SECTION 1: OBSIDIAN ARTICLE HERO HEADER (#0C0704)
        ========================================================================= */}
        <header
          className="relative w-full bg-[#0C0704] text-cream-100 border-b border-brown-800/60"
          style={{
            paddingTop: 'clamp(6.5rem, 11vw, 9rem)',
            paddingBottom: 'clamp(3rem, 6vw, 4.5rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            {/* Breadcrumb Navigation */}
            <nav
              aria-label="Breadcrumbs"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '11px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                fontWeight: 600,
                color: '#8A7A6E',
                marginBottom: '1.75rem',
              }}
            >
              <Link href="/" className="hover:text-[#C4975A] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-[#C4975A] transition-colors">
                Journal
              </Link>
              <span>/</span>
              <span style={{ color: '#C4975A' }}>{post.category}</span>
            </nav>

            <div className="flex items-center gap-3 text-xs tracking-widest font-semibold uppercase text-[#C4975A] mb-4">
              <span className="rounded-full bg-[#C4975A]/15 border border-[#C4975A]/30 px-3 py-1 text-[10px]">
                {post.category}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4975A]" />
              <span className="text-stone-400">{post.readTime}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C4975A]" />
              <span className="text-stone-400">Published {post.date}</span>
            </div>

            <h1
              className="font-serif text-cream-100 font-bold leading-tight"
              style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)', marginBottom: '1.5rem' }}
            >
              {post.title}
            </h1>

            {/* Tags Strip */}
            <div className="flex flex-wrap gap-2 pt-2">
              {post.tags.map(tag => (
                <span
                  key={tag}
                  className="rounded-full bg-brown-900/80 text-stone-300 border border-brown-700/60 px-3 py-1 text-[10px] uppercase tracking-wider font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </header>

        {/* =========================================================================
            SECTION 2: LUMINOUS ALABASTER ARTICLE BODY (#FAF6F0)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#FAF6F0] text-[#140C07]"
          style={{
            paddingTop: 'clamp(3rem, 6vw, 5rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            {/* Featured Hero Photo */}
            <div
              className="relative w-full rounded-3xl overflow-hidden bg-[#0C0704] shadow-xl border border-[#EBE3D7]"
              style={{
                height: 'clamp(320px, 48vh, 560px)',
                marginBottom: 'clamp(2.5rem, 5vw, 4rem)',
              }}
            >
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 75vw"
              />
            </div>

            {/* Editorial Content */}
            <article
              className="font-body text-[#140C07] mx-auto"
              style={{
                maxWidth: '740px',
                fontSize: 'clamp(1.05rem, 1.3vw, 1.15rem)',
                lineHeight: 1.85,
              }}
            >
              <div className="flex flex-col gap-6">
                {post.content.map((paragraph, index) => {
                  if (paragraph.startsWith('**') && paragraph.includes('**')) {
                    const parts = paragraph.split('\n')
                    const heading = parts[0].replace(/\*\*/g, '')
                    const body = parts.slice(1).join('\n')
                    return (
                      <div key={index} style={{ marginTop: '1.5rem' }}>
                        <h2
                          className="font-serif text-[#140C07] font-bold"
                          style={{
                            fontSize: 'clamp(1.5rem, 2.2vw, 1.85rem)',
                            marginBottom: '0.75rem',
                            lineHeight: 1.3,
                          }}
                        >
                          {heading}
                        </h2>
                        {body && (
                          <p className="text-[#52453B]" style={{ lineHeight: 1.8 }}>
                            {body}
                          </p>
                        )}
                      </div>
                    )
                  }

                  return (
                    <p key={index} className="text-[#52453B]" style={{ lineHeight: 1.8 }}>
                      {paragraph}
                    </p>
                  )
                })}
              </div>

              {/* Social Sharing & Return Row */}
              <div
                className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-[#EBE3D7]"
                style={{ marginTop: '3.5rem' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-bold text-[#8A7A6E] uppercase tracking-wider">
                    Share:
                  </span>
                  <div className="flex items-center gap-2">
                    <a
                      href={shareWhatsApp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#25D366] text-white p-2.5 hover:opacity-90 transition-opacity"
                      aria-label="Share on WhatsApp"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.518 2.266 2.27 3.51 5.284 3.507 8.482-.003 6.544-5.341 11.883-11.95 11.883-2.007-.001-3.98-.51-5.772-1.482L0 24zm6.59-4.817c1.72.975 3.42 1.487 5.356 1.487 5.485 0 9.948-4.463 9.95-9.95.002-2.659-1.033-5.16-2.909-7.04C17.07 1.792 14.567.755 12.01.755 6.523.755 2.06 5.218 2.057 10.705c-.001 1.94.507 3.834 1.47 5.514L2.53 21.662l5.117-1.341z" />
                      </svg>
                    </a>
                    <a
                      href={shareTwitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#0C0704] text-white p-2.5 hover:opacity-80 transition-opacity"
                      aria-label="Share on X"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </a>
                    <a
                      href={shareFacebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#1877F2] text-white p-2.5 hover:opacity-90 transition-opacity"
                      aria-label="Share on Facebook"
                    >
                      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <Link
                  href="/blog"
                  className="text-xs uppercase tracking-widest font-bold text-[#C2410C] hover:underline"
                >
                  ← Back to All Dispatches
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* =========================================================================
            SECTION 3: ROYAL HERITAGE EMERALD COMMISSION CALLOUT (#071A14)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#071A14] text-[#FAF6F0] border-y border-[#10B981]/20"
          style={{
            paddingTop: 'clamp(4rem, 7vw, 6rem)',
            paddingBottom: 'clamp(4rem, 7vw, 6rem)',
          }}
        >
          <div
            className="container-brand"
            style={{
              maxWidth: '1000px',
              margin: '0 auto',
              width: '100%',
              paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
              paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
              boxSizing: 'border-box',
            }}
          >
            <div
              className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/75 p-8 sm:p-12 text-center flex flex-col items-center gap-5 shadow-2xl"
            >
              <span
                className="inline-block text-[#34D399] font-bold text-xs tracking-[0.2em] uppercase"
              >
                Experience Bespoke Excellence
              </span>
              <h2
                className="font-serif text-cream-100 font-normal leading-tight"
                style={{ fontSize: 'clamp(1.85rem, 3.2vw, 2.5rem)', maxWidth: '600px' }}
              >
                Ready to Commission Your Own Custom Silhouette?
              </h2>
              <p
                className="font-body text-stone-300 text-sm leading-relaxed"
                style={{ maxWidth: '520px' }}
              >
                Every garment is crafted to your unique body dimensions. Settle a 50% deposit and our master tailors will begin cutting and stitching your bespoke piece immediately.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <Button
                  href="/catalogue"
                  variant="outline"
                  size="md"
                  style={{
                    borderColor: '#E8D4B0',
                    color: '#E8D4B0',
                    borderRadius: '10px',
                    padding: '12px 24px',
                  }}
                >
                  Browse Catalogue
                </Button>
                <Button
                  href="/order"
                  variant="primary"
                  size="md"
                  style={{
                    borderRadius: '10px',
                    padding: '12px 28px',
                  }}
                >
                  Order Bespoke Attire
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: WARM SAND RELATED ARTICLES (#F7F3EB)
        ========================================================================= */}
        {relatedPosts.length > 0 && (
          <section
            className="relative w-full bg-[#F7F3EB] text-[#140C07]"
            style={{
              paddingTop: 'clamp(4rem, 7vw, 6rem)',
              paddingBottom: 'clamp(4rem, 7vw, 6rem)',
            }}
          >
            <div
              className="container-brand"
              style={{
                maxWidth: '1400px',
                margin: '0 auto',
                width: '100%',
                paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
                paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
                boxSizing: 'border-box',
              }}
            >
              <div className="flex items-end justify-between mb-8">
                <div>
                  <span
                    className="inline-block text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                    style={{ marginBottom: '6px' }}
                  >
                    Further Reading
                  </span>
                  <h2
                    className="font-serif font-normal leading-tight text-[#140C07]"
                    style={{ fontSize: 'clamp(1.85rem, 3vw, 2.5rem)' }}
                  >
                    Related Dispatches
                  </h2>
                </div>
                <Button
                  href="/blog"
                  variant="outline"
                  size="sm"
                  style={{
                    borderColor: '#140C07',
                    color: '#140C07',
                    borderRadius: '10px',
                  }}
                >
                  View All Journal →
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col justify-between rounded-3xl bg-white border border-[#EBE3D7] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
                  >
                    <div>
                      <div className="relative h-56 w-full overflow-hidden bg-[#0C0704]">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-[10px] tracking-widest font-semibold uppercase text-[#8A7A6E] mb-2.5">
                          <span>{rel.category}</span>
                          <span className="w-1 h-1 rounded-full bg-[#8A7A6E]" />
                          <span>{rel.readTime}</span>
                        </div>
                        <h3 className="font-serif text-base font-bold text-[#140C07] group-hover:text-[#C2410C] transition-colors leading-snug">
                          {rel.title}
                        </h3>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-[#F2ECE1] flex items-center justify-between text-xs text-[#C2410C] font-bold uppercase tracking-wider">
                      <span>Read Story</span>
                      <span>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  )
}
