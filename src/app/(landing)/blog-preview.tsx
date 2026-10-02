import Image from 'next/image'
import Link from 'next/link'

const blogPosts = [
  {
    title: 'Why bespoke beats ready-to-wear for Nigerian occasions',
    category: 'Style Guide',
    readTime: '4 min read',
    date: 'Jun 1, 2026',
    excerpt:
      "There's a reason every agbada you admire at a high-society wedding was cut to measure. Off-the-rack will never match authentic Nigerian proportions.",
    slug: 'bespoke-vs-ready-to-wear',
    image: '/images/blog-bespoke.jpg',
  },
  {
    title: 'How we tailored an agbada in 10 days for a wedding in Rome',
    category: 'Case Study',
    readTime: '6 min read',
    date: 'May 20, 2026',
    excerpt:
      'When Adewale contacted us 12 days before his Vatican wedding, we expedited production and personally signed off on video before express dispatch.',
    slug: 'agbada-rome-wedding',
    image: '/images/blog-rome.jpg',
  },
  {
    title: 'Beyond the off-the-rack suit: why bespoke senator wear & African fabric ties lead European galas',
    category: 'Atelier Note',
    readTime: '5 min read',
    date: 'May 5, 2026',
    excerpt:
      'Off-the-rack Western suits are everywhere. We explore why bespoke Senator sets and handcrafted African fabric accessories command true distinction.',
    slug: 'suit-vs-senator',
    image: '/images/blog-suit-senator.jpg',
  },
]

const BlogPreview = () => {
  return (
    <section
      className="bg-[#FAF8F5] text-[#140C07] relative overflow-hidden"
      style={{
        width: '100%',
        paddingTop: 'clamp(4rem, 8vw, 6rem)',
        paddingBottom: 'clamp(4rem, 8vw, 6rem)',
      }}
      aria-labelledby="blog-heading"
    >
      <div
        className="container-brand relative z-10"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          paddingLeft: 'clamp(1.5rem, 5vw, 4rem)',
          paddingRight: 'clamp(1.5rem, 5vw, 4rem)',
          boxSizing: 'border-box',
        }}
      >
        {/* Top Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-[#E7E0D6]"
          style={{ paddingBottom: '2.5rem', marginBottom: '2.5rem' }}
        >
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-terracotta-500" />
              <span className="font-body text-[11px] tracking-[0.25em] uppercase text-terracotta-600 font-bold">
                [ 05 — THE ATELIER JOURNAL ]
              </span>
            </div>
            <h2
              id="blog-heading"
              className="text-heading-xl !text-[#140C07] font-normal leading-[1.02] tracking-tight uppercase"
            >
              Style &amp; Craft
              <br />
              <span className="font-display italic font-light text-caramel-600">
                Editorial Notes
              </span>
            </h2>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-3 rounded-full bg-[#180E07] hover:bg-black text-white transition-all duration-300 shadow-md self-start sm:self-end"
            style={{ padding: '0.45rem 0.5rem 0.45rem 1.4rem' }}
          >
            <span className="font-body text-xs tracking-[0.18em] uppercase font-bold text-cream-100">
              Read All Stories
            </span>
            <div className="w-8 h-8 rounded-full bg-caramel-500 group-hover:bg-caramel-400 flex items-center justify-center text-brown-950 transition-transform duration-300 group-hover:translate-x-0.5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </Link>
        </div>

        {/* Editorial Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Cover Article (8 cols) */}
          <div className="lg:col-span-7">
            <Link
              href={`/blog/${blogPosts[0].slug}`}
              className="group block rounded-3xl overflow-hidden border border-[#E4DDD2] bg-white shadow-sm hover:shadow-xl transition-all duration-500"
              aria-label={`Read ${blogPosts[0].title}`}
            >
              <div className="relative overflow-hidden h-[300px] sm:h-[400px] bg-stone-200">
                <Image
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                  priority
                />
                <div
                  className="absolute top-5 left-5 rounded-full bg-terracotta-500 text-white font-body text-[10px] tracking-widest font-bold uppercase shadow-md"
                  style={{ padding: '0.35rem 0.85rem' }}
                >
                  Featured Cover
                </div>
                <div
                  className="absolute top-5 right-5 rounded-full bg-black/60 backdrop-blur-md text-white font-body text-[10px] tracking-wider"
                  style={{ padding: '0.3rem 0.75rem' }}
                >
                  {blogPosts[0].readTime}
                </div>
              </div>

              <div style={{ padding: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
                <div className="flex items-center gap-3 mb-2.5">
                  <span className="font-body text-xs font-bold uppercase tracking-widest text-terracotta-600">
                    {blogPosts[0].category}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-stone-400" />
                  <span className="font-body text-xs text-stone-500">
                    {blogPosts[0].date}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold !text-[#140C07] group-hover:text-caramel-600 transition-colors leading-tight">
                  {blogPosts[0].title}
                </h3>

                <p
                  className="font-body text-sm text-[#5C4F44] leading-relaxed"
                  style={{ marginTop: '0.75rem' }}
                >
                  {blogPosts[0].excerpt}
                </p>

                <div
                  className="flex items-center gap-2 font-body text-xs tracking-widest uppercase font-bold text-[#140C07] group-hover:text-caramel-600 transition-colors"
                  style={{ marginTop: '1.5rem' }}
                >
                  <span>Read Article</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Sidebar Articles (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <span
              className="font-body text-[11px] tracking-[0.2em] uppercase font-bold text-stone-400 border-b border-[#E7E0D6]"
              style={{ paddingBottom: '0.5rem' }}
            >
              Recent Journal Dispatches
            </span>

            {blogPosts.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row gap-5 rounded-3xl border border-[#E7E0D6] bg-white hover:border-caramel-500/50 hover:shadow-lg transition-all duration-300"
                style={{ padding: '1.25rem' }}
                aria-label={`Read ${post.title}`}
              >
                <div className="relative overflow-hidden w-full sm:w-36 h-40 sm:h-32 rounded-2xl bg-stone-200 shrink-0">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="160px"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-white font-body text-[9px] tracking-wider">
                    {post.readTime}
                  </div>
                </div>

                <div className="flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-body text-[10px] font-bold uppercase tracking-widest text-caramel-600">
                        {post.category}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-stone-300" />
                      <span className="font-body text-[10px] text-stone-400">
                        {post.date}
                      </span>
                    </div>

                    <h4 className="font-display text-lg font-bold !text-[#140C07] group-hover:text-caramel-600 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="font-body text-xs text-[#6B5E53] mt-1.5 line-clamp-2 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <span className="font-body text-[11px] tracking-wider uppercase font-bold text-stone-400 group-hover:text-caramel-600 transition-colors mt-3 flex items-center gap-1">
                    Read Story &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogPreview