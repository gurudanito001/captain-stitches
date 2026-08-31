'use client'

import { use, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'
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
        <main className="bg-brown-900 min-h-screen flex items-center justify-center pt-24">
          <div className="text-center px-6">
            <h1 className="text-heading-xl text-cream-200">Article Not Found</h1>
            <p className="text-body text-stone-400 mt-4">
              We couldn't find the article you were looking for. It may have been removed or renamed.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button href="/blog" variant="primary">
                Return to Journal
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // Pre-configured social links
  const pageUrl = typeof window !== 'undefined' ? window.location.href : `https://captainstitches.com/blog/${slug}`
  const shareText = encodeURIComponent(`Check out this article: "${post.title}" by CaptainStitches`)
  
  const shareWhatsApp = `https://wa.me/?text=${shareText}%20${encodeURIComponent(pageUrl)}`
  const shareTwitter = `https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(pageUrl)}`
  const shareFacebook = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pt-28 pb-24 animate-fadeIn">
        <div className="container-brand">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-stone-500 text-[10px] tracking-widest font-semibold uppercase mb-8">
            <Link href="/" className="hover:text-caramel-500 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-caramel-500 transition-colors">
              Journal
            </Link>
            <span>/</span>
            <span className="text-caramel-500 truncate max-w-[200px] md:max-w-none">
              {post.title}
            </span>
          </div>

          {/* Article Header Details */}
          <article className="max-w-3xl mx-auto">
            <header className="mb-10 text-center md:text-left">
              {/* Category & Read Time */}
              <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] tracking-widest font-semibold uppercase text-caramel-500 mb-4">
                <span>{post.category}</span>
                <span className="w-1 h-1 rounded-full bg-brown-600" />
                <span className="text-stone-500">{post.readTime}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-5xl text-cream-200 font-bold leading-tight mb-6">
                {post.title}
              </h1>

              {/* Date & Tags */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-6 border-t border-brown-850">
                <span className="text-stone-500 text-[10px] uppercase tracking-wider font-semibold">
                  Published on {post.date}
                </span>

                <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      className="bg-brown-950 text-stone-400 border border-brown-850 px-2.5 py-1 text-[8px] uppercase tracking-widest font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </header>

            {/* Featured Image */}
            <div className="relative h-[320px] md:h-[500px] w-full overflow-hidden bg-brown-950 border border-brown-850 mb-12">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </div>

            {/* Rich Text Body Content */}
            <div className="font-body text-stone-300 text-sm leading-relaxed flex flex-col gap-6 max-w-2xl mx-auto">
              {post.content.map((paragraph, index) => {
                // Check if paragraph starts with markdown header format
                if (paragraph.startsWith('**') && paragraph.includes('**')) {
                  const parts = paragraph.split('\n')
                  const heading = parts[0].replace(/\*\*/g, '')
                  const body = parts.slice(1).join('\n')
                  return (
                    <div key={index} className="mt-4 flex flex-col gap-2">
                      <h3 className="font-display text-lg text-cream-100 font-semibold uppercase tracking-wider">
                        {heading}
                      </h3>
                      {body && <p className="text-body text-stone-300">{body}</p>}
                    </div>
                  )
                }

                return (
                  <p key={index} className="text-body text-stone-300">
                    {paragraph}
                  </p>
                )
              })}
            </div>

            {/* Social Share & Back list */}
            <div className="max-w-2xl mx-auto mt-12 pt-8 border-t border-brown-850 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                  Share Journal:
                </span>
                <div className="flex items-center gap-2">
                  {/* WhatsApp */}
                  <a
                    href={shareWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-brown-850 hover:border-caramel-500 hover:text-caramel-500 text-stone-400 transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.248 8.477 3.518 2.266 2.27 3.51 5.284 3.507 8.482-.003 6.544-5.341 11.883-11.95 11.883-2.007-.001-3.98-.51-5.772-1.482L0 24zm6.59-4.817c1.72.975 3.42 1.487 5.356 1.487 5.485 0 9.948-4.463 9.95-9.95.002-2.659-1.033-5.16-2.909-7.04C17.07 1.792 14.567.755 12.01.755 6.523.755 2.06 5.218 2.057 10.705c-.001 1.94.507 3.834 1.47 5.514L2.53 21.662l5.117-1.341z" />
                    </svg>
                  </a>
                  {/* Twitter / X */}
                  <a
                    href={shareTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-brown-850 hover:border-caramel-500 hover:text-caramel-500 text-stone-400 transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  {/* Facebook */}
                  <a
                    href={shareFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border border-brown-850 hover:border-caramel-500 hover:text-caramel-500 text-stone-400 transition-colors"
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
                className="text-[10px] uppercase tracking-widest font-bold text-caramel-400 hover:text-caramel-300 transition-colors"
              >
                ← Return to Journal
              </Link>
            </div>

            {/* Contextual CTA Banner */}
            <div className="max-w-2xl mx-auto mt-16 p-8 bg-brown-950/60 border border-caramel-500/20 text-center flex flex-col items-center gap-4 shadow-xl">
              <span className="text-label text-caramel-400 font-bold">
                Experience Bespoke Excellence
              </span>
              <h3 className="font-display text-xl text-cream-200 font-normal">
                Crafted in Nigeria. Delivered directly to your door in Europe.
              </h3>
              <p className="text-body text-stone-400 text-xs leading-relaxed max-w-md">
                Inspired by our craft? Secure your custom outfit today. Settle a 50% deposit and our tailors will immediately start assembling your garment.
              </p>
              <div className="flex gap-4 mt-2">
                <Button href="/catalogue" variant="accent" size="sm">
                  Explore Catalogue
                </Button>
                <Button href="/order" variant="primary" size="sm">
                  Order Now
                </Button>
              </div>
            </div>
          </article>

          {/* Related Articles Grid */}
          {relatedPosts.length > 0 && (
            <section className="mt-24 pt-16 border-t border-brown-850">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <SectionEyebrow label="Journal Insights" />
                  <h2 className="text-heading-md text-cream-200 font-normal">
                    Related Articles
                  </h2>
                </div>
                <Button href="/blog" variant="outline" size="sm">
                  View all journal
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map(rel => (
                  <Link
                    key={rel.slug}
                    href={`/blog/${rel.slug}`}
                    className="group flex flex-col justify-between h-full bg-brown-950/10 border border-brown-850 p-5 hover:border-brown-750 transition-colors duration-300"
                    aria-label={`Read ${rel.title}`}
                  >
                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative h-48 w-full overflow-hidden bg-brown-950 border border-brown-900">
                        <Image
                          src={rel.image}
                          alt={rel.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Info Meta */}
                      <div className="pt-5 flex flex-col gap-2.5">
                        <div className="flex items-center gap-3 text-[9px] tracking-widest font-semibold uppercase text-caramel-500">
                          <span>{rel.category}</span>
                          <span className="w-1 h-1 rounded-full bg-brown-800" />
                          <span className="text-stone-500">{rel.readTime}</span>
                        </div>

                        <h3 className="font-display text-base text-cream-200 group-hover:text-caramel-400 transition-colors duration-300 font-bold leading-snug">
                          {rel.title}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Date and Action */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-brown-900">
                      <span className="text-stone-500 text-[9px] uppercase tracking-wider font-semibold">
                        {rel.date}
                      </span>
                      <span className="text-[9px] tracking-widest font-bold uppercase text-caramel-400 group-hover:text-caramel-300 transition-colors">
                        Read Article
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
