import Image from "next/image"
import SectionEyebrow from "@/utils/sectionEyeBrow"
import { Button } from "@/components/ui/Button"
import Link from "next/link"


const blogPosts = [
  {
    title: 'Why bespoke beats ready-to-wear for Nigerian occasions',
    category: 'Style guide',
    date: 'Jun 1, 2026',
    excerpt:
      "There's a reason every agbada you admire at a wedding was made to order. We explain why off-the-rack will never match the real thing.",
    slug: 'bespoke-vs-ready-to-wear',
    image: '/images/blog-bespoke.jpg',
  },
  {
    title: 'How we made a full agbada set in 10 days for a wedding in Rome',
    category: 'Case study',
    date: 'May 20, 2026',
    excerpt:
      'When Adewale contacted us 12 days before his wedding, we had to move fast — here is exactly how we pulled it off.',
    slug: 'agbada-rome-wedding',
    image: '/images/blog-rome.jpg',
  },
  {
    title: 'English suit vs senator: which should you wear to a corporate dinner?',
    category: 'Design opinions',
    date: 'May 5, 2026',
    excerpt:
      'Both are sharp. Both command a room. The right choice depends on the message you want to send.',
    slug: 'suit-vs-senator',
    image: '/images/blog-suit-senator.jpg',
  },
]

const BlogPreview = () => {
  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
            7. BLOG PREVIEW
            Editorial split layout — Featured Cover (left) + recent list (right).
        ══════════════════════════════════════════════════════════════════ */}
      <section
        className="bg-brown-900 section-y"
        aria-labelledby="blog-heading"
      >
        <div className="container-brand">

          {/* Header section */}
          <div className="flex items-end justify-between pb-8 border-b border-brown-800/30 mb-12">
            <div>
              <SectionEyebrow label="From the journal" />
              <h2 id="blog-heading" className="text-heading-xl text-cream-200 mt-2 font-normal">
                Style &amp;<br />craft
              </h2>
            </div>
            <Button href="/blog" variant="accent" size="sm" style={{ marginBottom: '10px' }}>
              All posts
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-12">

            {/* Featured Post (Post 1) — spans 8 columns */}
            <div className="lg:col-span-8">
              <Link
                href={`/blog/${blogPosts[0].slug}`}
                className="group block"
                aria-label={`Read Featured: ${blogPosts[0].title}`}
              >
                {/* Large landscape image */}
                <div className="relative overflow-hidden h-[240px] sm:h-[340px] md:h-[400px] bg-brown-700">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 66vw"
                    priority
                  />
                  <div className="absolute top-4 left-4 bg-caramel-500 text-brown-900 px-3 py-1 font-body text-[9px] tracking-widest font-bold uppercase">
                    Featured Cover
                  </div>
                </div>

                {/* Content */}
                <div className="pt-6">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-label text-caramel-500 text-[10px] tracking-[0.2em] font-semibold uppercase">
                      {blogPosts[0].category}
                    </span>
                    <span className="text-label text-stone-500 text-[10px] tracking-wider">
                      {blogPosts[0].date}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl text-cream-200 group-hover:text-caramel-400 transition-colors duration-300 font-bold leading-tight">
                    {blogPosts[0].title}
                  </h3>
                  
                  <p className="text-body text-sm mt-3 line-clamp-3 text-stone-300 max-w-2xl leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>

                  <span className="text-label text-caramel-400 group-hover:text-caramel-300 mt-4 inline-flex items-center gap-2 text-[10px] tracking-[0.2em] font-bold uppercase transition-colors duration-300">
                    Read article <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </span>
                </div>
              </Link>
            </div>

            {/* Sidebar Posts (Post 2 & 3) — spans 4 columns */}
            <div className="lg:col-span-4 flex flex-col gap-6 md:gap-7 justify-start">
              <span className="text-label text-stone-500 tracking-[0.2em] uppercase text-[10px] pb-2 border-b border-brown-800/80">
                Recent Journals
              </span>

              {blogPosts.slice(1).map(post => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 sm:gap-6 items-start pb-6 border-b border-brown-800/40 last:border-b-0 last:pb-0"
                  aria-label={`Read: ${post.title}`}
                >
                  {/* Thumbnail Image */}
                  <div className="relative overflow-hidden w-24 sm:w-28 h-24 sm:h-28 bg-brown-700 shrink-0">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      sizes="(max-width: 640px) 100px, 120px"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-label text-caramel-500 text-[9px] tracking-widest font-semibold uppercase">
                        {post.category}
                      </span>
                      <span className="text-label text-stone-500 text-[9px] tracking-wider">
                        {post.date}
                      </span>
                    </div>
                    <h3 className="font-display text-base text-cream-200 group-hover:text-caramel-400 transition-colors duration-300 font-bold leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-body text-xs mt-1.5 line-clamp-2 text-stone-400">
                      {post.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

          </div>

        </div>
      </section>
    </>
  )
}

export default BlogPreview