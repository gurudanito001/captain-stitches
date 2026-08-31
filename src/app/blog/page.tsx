'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { Button } from '@/components/ui/Button'
import SectionEyebrow from '@/utils/sectionEyeBrow'
import { BLOG_POSTS } from '@/utils/blogData'

const CATEGORIES = ['All Journal', 'Style Guide', 'Case Study', 'Design Opinions']

export default function BlogListingPage() {
  const [activeFilter, setActiveFilter] = useState('All Journal')

  // Featured Post - select the first post by default
  const featuredPost = useMemo(() => BLOG_POSTS[0], [])

  // Filtered posts (excluding the featured one, unless category filter is selected which shows all matching)
  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      // If filtering "All Journal", show all posts except the featured one in the grid
      if (activeFilter === 'All Journal') {
        return post.slug !== featuredPost.slug
      }
      return post.category.toLowerCase() === activeFilter.toLowerCase()
    })
  }, [activeFilter, featuredPost])

  return (
    <>
      <Navbar />

      <main id="main-content" className="bg-brown-900 min-h-screen pb-24" style={{ paddingTop: "150px", paddingBottom: "50px" }}>
        <div className="container-brand">

          {/* Header Title — Clean borderless header */}
          <div className="pb-8" style={{ marginBottom: "40px" }}>
            <SectionEyebrow label="The Journal" />
            <h1 className="text-heading-xl text-cream-200 mt-2 font-normal">
              Style &amp; Craft
            </h1>
            <p className="text-body text-stone-300 mt-4 max-w-xl">
              Insights, case studies, and tailoring guides straight from our workshops in Verona and Lagos.
            </p>
          </div>

          {/* Category Filter Tabs — Flat and borderless */}
          <div className="flex overflow-x-auto gap-3 no-scrollbar" style={{ marginBottom: "12px" }}>
            {CATEGORIES.map(category => {
              const isActive = activeFilter === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={[
                    'px-5 py-2.5 text-[10px] tracking-widest font-semibold uppercase transition-all duration-300 shrink-0 cursor-pointer select-none rounded-none border-0 outline-none',
                    isActive
                      ? 'bg-caramel-500 text-brown-900'
                      : 'bg-brown-950/40 text-stone-300 hover:bg-brown-950/60 hover:text-cream-100',
                  ].join(' ')}
                >
                  {category}
                </button>
              )
            })}
          </div>

          {/* Hero Section: Featured Post — Flat panel, borderless card */}
          {activeFilter === 'All Journal' && featuredPost && (
            <section className="animate-fadeIn" aria-labelledby="featured-post-title" style={{ marginBottom: "64px" }}>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-brown-950/40 p-8 md:p-12 hover:bg-brown-950/50 transition-colors duration-300"
              >
                {/* Featured Image — No border */}
                <div className="lg:col-span-7 relative h-[300px] md:h-[400px] w-full overflow-hidden bg-brown-950">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.02]"
                    priority
                    sizes="(max-width: 1024px) 100vw, 55vw"
                  />
                  <div className="absolute top-4 left-4 bg-caramel-500 text-brown-950 px-3 py-1 font-body text-[9px] tracking-widest font-bold uppercase select-none">
                    Featured
                  </div>
                </div>

                {/* Featured Details */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="flex items-center gap-4 text-[10px] tracking-widest font-semibold uppercase text-caramel-500">
                    <span>{featuredPost.category}</span>
                    <span className="w-1 h-1 rounded-full bg-brown-600" />
                    <span className="text-stone-500">{featuredPost.readTime}</span>
                  </div>

                  <h2 id="featured-post-title" className="font-display text-2xl md:text-3xl text-cream-200 group-hover:text-caramel-400 transition-colors duration-300 font-bold leading-tight">
                    {featuredPost.title}
                  </h2>

                  <p className="text-body text-stone-400 text-sm leading-relaxed">
                    {featuredPost.excerpt}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-stone-500 text-[10px] tracking-wider uppercase font-semibold">
                      {featuredPost.date}
                    </span>
                    <span className="accent-line w-8" />
                    <span className="text-[10px] tracking-widest font-semibold uppercase text-cream-200 group-hover:text-caramel-400 transition-colors">
                      Read Article
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Grid Layout: Regular Posts */}
          <section>
            {activeFilter !== 'All Journal' && (
              <div className="mb-8">
                <span className="text-[10px] text-stone-500 uppercase tracking-widest font-semibold">
                  Showing Journal Category: {activeFilter}
                </span>
              </div>
            )}

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map(post => (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col justify-between h-full bg-brown-950/40 p-6 hover:bg-brown-950/50 transition-colors duration-300"
                    aria-label={`Read ${post.title}`}
                  >
                    <div>
                      {/* Thumbnail Image — Borderless */}
                      <div className="relative h-56 w-full overflow-hidden bg-brown-950">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Info Meta */}
                      <div className="pt-5 flex flex-col gap-3">
                        <div className="flex items-center gap-3 text-[9px] tracking-widest font-semibold uppercase text-caramel-500">
                          <span>{post.category}</span>
                          <span className="w-1 h-1 rounded-full bg-brown-800" />
                          <span className="text-stone-500">{post.readTime}</span>
                        </div>

                        <h3 className="font-display text-lg text-cream-200 group-hover:text-caramel-400 transition-colors duration-300 font-bold leading-snug">
                          {post.title}
                        </h3>

                        <p className="text-body text-stone-400 text-xs leading-relaxed line-clamp-3">
                          {post.excerpt}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Date and Action — Faint border-t line */}
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-brown-900/40">
                      <span className="text-stone-500 text-[9px] uppercase tracking-wider font-semibold">
                        {post.date}
                      </span>
                      <span className="text-[9px] tracking-widest font-bold uppercase text-caramel-400 group-hover:text-caramel-300 transition-colors">
                        Read More
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              /* Empty state — Flat panel box */
              <div className="text-center p-12 bg-brown-950/40 max-w-md mx-auto flex flex-col items-center">
                <p className="text-body text-stone-400 text-sm font-medium">
                  No articles found in this category yet. Check back soon!
                </p>
                <button
                  onClick={() => setActiveFilter('All Journal')}
                  className="mt-6 text-[10px] uppercase tracking-widest font-bold text-caramel-400 hover:text-caramel-300 cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}
