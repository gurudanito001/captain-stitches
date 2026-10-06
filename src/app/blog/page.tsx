'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'
import { BLOG_POSTS, BlogPost } from '@/utils/blogData'
import { getAllBlogPosts } from '@/data/adminBlogData'

const CATEGORIES = ['All Journal', 'Style Guide', 'Case Study', 'Design Opinions']

export default function BlogListingPage() {
  const [activeFilter, setActiveFilter] = useState('All Journal')

  const allPosts = useMemo(() => {
    const adminPosts = getAllBlogPosts()
    const publishedAdmin = adminPosts
      .filter((p) => p.status === 'published')
      .map((p) => ({
        title: p.contentEN.title,
        category: p.category,
        date: p.publishDate !== 'Draft' ? p.publishDate : 'Recent',
        readTime: `${Math.max(1, Math.ceil(p.contentEN.body.split(/\s+/).length / 200))} min read`,
        excerpt: p.contentEN.excerpt,
        slug: p.slug,
        image: p.featuredImage || '/images/blog-bespoke.jpg',
        tags: p.contentEN.tags,
        content: p.contentEN.body.split('\n\n').filter(Boolean),
      }))

    const map = new Map<string, BlogPost>()
    BLOG_POSTS.forEach((p) => map.set(p.slug, p))
    publishedAdmin.forEach((p) => map.set(p.slug, p))
    return Array.from(map.values())
  }, [])

  // Featured Post - select the first post by default
  const featuredPost = useMemo(() => allPosts[0], [allPosts])

  // Filtered posts (excluding the featured one, unless category filter is selected which shows all matching)
  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      if (activeFilter === 'All Journal') {
        return post.slug !== featuredPost.slug
      }
      return post.category.toLowerCase() === activeFilter.toLowerCase()
    })
  }, [activeFilter, featuredPost, allPosts])

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-950 min-h-screen">
        {/* =========================================================================
            SECTION 1: OBSIDIAN EDITORIAL HEADER (#0C0704)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#0C0704] text-cream-100 border-b border-brown-800/60"
          style={{
            paddingTop: 'clamp(6.5rem, 11vw, 9rem)',
            paddingBottom: 'clamp(2.5rem, 5vw, 4rem)',
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
            <div className="max-w-3xl">
              <span
                className="inline-block text-[#C4975A] font-semibold text-xs tracking-[0.2em] uppercase"
                style={{ marginBottom: '8px' }}
              >
                The Captain's Journal
              </span>
              <h1
                className="font-serif text-cream-100 font-bold leading-tight"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', marginBottom: '1rem' }}
              >
                Style, Heritage &amp; Craft
              </h1>
              <p
                className="font-body text-stone-300 leading-relaxed"
                style={{ fontSize: 'clamp(1rem, 1.25vw, 1.15rem)', maxWidth: '640px' }}
              >
                Tailoring essays, sartorial history, and fitting insights directly from our dual ateliers in Verona and Lagos.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div
              className="flex items-center gap-3 overflow-x-auto no-scrollbar"
              style={{ marginTop: '2.5rem' }}
            >
              {CATEGORIES.map(category => {
                const isActive = activeFilter === category
                return (
                  <button
                    key={category}
                    onClick={() => setActiveFilter(category)}
                    className={[
                      'rounded-full font-semibold uppercase tracking-wider transition-all duration-300 shrink-0 cursor-pointer border',
                      isActive
                        ? 'bg-[#C4975A] text-[#0C0704] border-[#C4975A] shadow-lg shadow-[#C4975A]/20 font-bold'
                        : 'bg-brown-900/60 text-stone-300 border-brown-800 hover:border-stone-500 hover:text-cream-100',
                    ].join(' ')}
                    style={{
                      padding: '10px 22px',
                      fontSize: '11px',
                      letterSpacing: '0.12em',
                    }}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION 2: LUMINOUS ALABASTER FEATURED DISPATCH (#FAF6F0)
        ========================================================================= */}
        {activeFilter === 'All Journal' && featuredPost && (
          <section
            className="relative w-full bg-[#FAF6F0] text-[#140C07] border-b border-[#EBE3D7]"
            style={{
              paddingTop: 'clamp(3.5rem, 6vw, 5.5rem)',
              paddingBottom: 'clamp(3.5rem, 6vw, 5.5rem)',
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
              <div className="mb-6 flex items-center justify-between">
                <span
                  className="text-[#C2410C] font-semibold text-xs tracking-[0.2em] uppercase"
                >
                  Featured Story
                </span>
                <span className="text-xs text-[#8A7A6E] uppercase tracking-wider font-semibold">
                  Curated Dispatch
                </span>
              </div>

              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-3xl bg-white border border-[#EBE3D7] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
                style={{ padding: 'clamp(1.5rem, 3.5vw, 2.5rem)' }}
              >
                {/* Featured Image */}
                <div
                  className="lg:col-span-7 relative w-full rounded-2xl overflow-hidden bg-[#0C0704]"
                  style={{ minHeight: '320px', height: 'clamp(320px, 42vh, 460px)' }}
                >
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div
                    className="absolute top-4 left-4 bg-[#C2410C] text-white rounded-full font-bold uppercase tracking-widest text-[9px] shadow-md"
                    style={{ padding: '6px 14px' }}
                  >
                    Featured Story
                  </div>
                </div>

                {/* Featured Content */}
                <div className="lg:col-span-5 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-xs tracking-widest font-semibold uppercase text-[#C4975A] mb-3">
                    <span>{featuredPost.category}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C4975A]" />
                    <span className="text-[#8A7A6E]">{featuredPost.readTime}</span>
                  </div>

                  <h2
                    className="font-serif text-[#140C07] group-hover:text-[#C2410C] transition-colors duration-300 font-bold leading-tight"
                    style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.35rem)', marginBottom: '1rem' }}
                  >
                    {featuredPost.title}
                  </h2>

                  <p
                    className="font-body text-[#52453B] text-sm leading-relaxed"
                    style={{ marginBottom: '1.5rem', lineHeight: 1.7 }}
                  >
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-[#F2ECE1]">
                    <span className="text-[#8A7A6E] text-xs uppercase tracking-wider font-semibold">
                      {featuredPost.date}
                    </span>
                    <span className="text-xs tracking-widest font-bold uppercase text-[#C2410C] group-hover:translate-x-1 transition-transform inline-flex items-center gap-1.5">
                      Read Full Story →
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        )}

        {/* =========================================================================
            SECTION 3: WARM SAND JOURNAL ARCHIVE (#F7F3EB)
        ========================================================================= */}
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
                  Archive &amp; Chronicles
                </span>
                <h2
                  className="font-serif font-normal leading-tight text-[#140C07]"
                  style={{ fontSize: 'clamp(1.85rem, 3vw, 2.5rem)' }}
                >
                  {activeFilter === 'All Journal' ? 'Recent Articles' : `${activeFilter} Articles`}
                </h2>
              </div>
              <span className="text-xs text-[#8A7A6E] font-semibold uppercase tracking-wider hidden sm:block">
                {filteredPosts.length} articles
              </span>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col justify-between rounded-3xl bg-white border border-[#EBE3D7] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-1.5"
                    aria-label={`Read ${post.title}`}
                  >
                    <div>
                      {/* Thumbnail Image */}
                      <div className="relative h-60 w-full overflow-hidden bg-[#0C0704]">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute top-3 left-3 bg-[#0C0704]/80 backdrop-blur-md rounded-full px-3 py-1">
                          <span className="text-[9px] text-[#C4975A] uppercase tracking-widest font-bold">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-6">
                        <div className="flex items-center gap-3 text-[10px] tracking-widest font-semibold uppercase text-[#8A7A6E] mb-2.5">
                          <span>{post.readTime}</span>
                          <span className="w-1 h-1 rounded-full bg-[#8A7A6E]" />
                          <span>{post.date}</span>
                        </div>

                        <h3 className="font-serif text-lg font-bold text-[#140C07] group-hover:text-[#C2410C] transition-colors leading-snug mb-3">
                          {post.title}
                        </h3>

                        <p className="font-body text-[#52453B] text-xs leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    <div className="px-6 pb-6 pt-3 border-t border-[#F2ECE1] flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] group-hover:underline">
                        Read Story
                      </span>
                      <span className="text-[#C2410C] font-bold text-sm">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div
                className="rounded-3xl bg-white border border-[#EBE3D7] p-12 text-center max-w-md mx-auto"
              >
                <p className="text-sm text-[#52453B] font-body mb-4">
                  No articles found in this specific category yet.
                </p>
                <button
                  onClick={() => setActiveFilter('All Journal')}
                  className="rounded-full bg-[#0C0704] text-[#FAF6F0] px-6 py-2.5 text-xs uppercase tracking-widest font-semibold hover:bg-[#C4975A] hover:text-[#0C0704] transition-colors cursor-pointer"
                >
                  View All Journal Dispatches
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =========================================================================
            SECTION 4: ROYAL HERITAGE EMERALD PATRON INVITATION (#071A14)
        ========================================================================= */}
        <section
          className="relative w-full bg-[#071A14] text-[#FAF6F0] border-t border-[#10B981]/20"
          style={{
            paddingTop: 'clamp(4.5rem, 8vw, 7rem)',
            paddingBottom: 'clamp(4.5rem, 8vw, 7rem)',
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
            <div
              className="rounded-3xl border border-[#10B981]/30 bg-[#0C0704]/70 p-8 sm:p-14 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8"
            >
              <div className="max-w-xl">
                <span
                  className="inline-block text-[#34D399] font-semibold text-xs tracking-[0.2em] uppercase"
                  style={{ marginBottom: '6px' }}
                >
                  Bespoke Commission
                </span>
                <h2
                  className="font-serif text-cream-100 font-bold leading-tight"
                  style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '1rem' }}
                >
                  Dress with Sovereign Precision
                </h2>
                <p className="font-body text-stone-300 text-sm leading-relaxed">
                  Crafted by master tailors in Nigeria, measured and verified in Verona, and delivered directly to your doorstep in Italy or anywhere in Europe.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 shrink-0 w-full md:w-auto">
                <Button
                  href="/catalogue"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                  style={{
                    padding: '14px 26px',
                    borderRadius: '12px',
                    borderColor: '#E8D4B0',
                    color: '#E8D4B0',
                  }}
                >
                  View Lookbook
                </Button>
                <Button
                  href="/order"
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto"
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                  }}
                >
                  Commission Now
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
