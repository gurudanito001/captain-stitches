export type BlogPostStatus = 'published' | 'scheduled' | 'draft'

export interface BlogLanguageVariant {
    title: string
    excerpt: string
    body: string
    tags: string[]
    metaTitle: string
    metaDescription: string
}

export interface BlogCallToAction {
    isEnabled: boolean
    text: string
    linkType: 'catalogue' | 'order' | 'custom'
    customUrl?: string
}

export interface AdminBlogPost {
    id: string
    slug: string
    featuredImage: string
    featuredImageAlt: string
    category: string
    status: BlogPostStatus
    publishDate: string
    publishTime?: string
    author: string
    visibility: 'public' | 'members_only'
    contentEN: BlogLanguageVariant
    contentIT: BlogLanguageVariant
    cta: BlogCallToAction
    stats: {
        views: number
        uniqueVisitors: number
        avgTimeOnPage: string
        bounceRate: string
        monthlyViews: number
        previousMonthViews: number
        ctaClicks: number
        orderConversions: number
        subscribersGained: number
        trafficSources: {
            direct: number
            whatsapp: number
            instagram: number
            google: number
            other: number
        }
        languageSplit: {
            en: number
            it: number
        }
        searchKeywords: Array<{
            keyword: string
            clicks: number
            position: number
        }>
    }
    lastSaved: string
}

export interface BlogGlobalSettings {
    defaultCTA: {
        textEN: string
        textIT: string
        linkType: 'catalogue' | 'order' | 'custom'
        customUrl: string
        isEnabledGlobally: boolean
    }
    categories: Array<{
        id: string
        nameEN: string
        nameIT: string
        slug: string
    }>
    defaultAuthor: string
    showAuthor: boolean
    rssEnabled: boolean
    rssUrl: string
    socialDefaults: {
        hashtags: string
        defaultOgImage: string
    }
}

export const INITIAL_BLOG_SETTINGS: BlogGlobalSettings = {
    defaultCTA: {
        textEN: 'Ready to commission your next bespoke piece? Browse the curated atelier collection →',
        textIT: 'Pronto a commissionare il tuo prossimo capo su misura? Scopri la collezione →',
        linkType: 'catalogue',
        customUrl: '/catalogue',
        isEnabledGlobally: true,
    },
    categories: [
        { id: 'cat-1', nameEN: 'Style Guide', nameIT: 'Guida allo Stile', slug: 'style-guide' },
        { id: 'cat-2', nameEN: 'Case Study', nameIT: 'Casi Studio', slug: 'case-study' },
        { id: 'cat-3', nameEN: 'Design Opinions', nameIT: 'Opinioni di Design', slug: 'design-opinions' },
        { id: 'cat-4', nameEN: 'Brand News', nameIT: 'Novità del Brand', slug: 'brand-news' },
    ],
    defaultAuthor: 'Samuelson',
    showAuthor: true,
    rssEnabled: true,
    rssUrl: 'https://captainstitches.com/blog/rss.xml',
    socialDefaults: {
        hashtags: '#CaptainStitches #BespokeFashion #AfricanLuxury #MadeInNigeria',
        defaultOgImage: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=80',
    },
}

export const INITIAL_BLOG_POSTS: AdminBlogPost[] = [
    {
        id: 'post-modern-agbada-europe',
        slug: 'the-modern-agbada-in-europe',
        featuredImage: '/images/blog-bespoke.jpg',
        featuredImageAlt: 'Modern Agbada styling for European weddings',
        category: 'Style Guide',
        status: 'published',
        publishDate: 'Jun 5, 2026',
        publishTime: '10:00',
        author: 'Samuelson',
        visibility: 'public',
        contentEN: {
            title: "The Modern Agbada in Europe: A Gentleman's Guide to Diaspora Weddings",
            excerpt: "Discover how to style traditional Nigerian Agbada in Italy and Europe with bespoke cashmere tailoring by CaptainStitches.",
            body: `In the realm of traditional Nigerian fashion, fit is not just a preference — it is the entire statement. Whether it is a grand Agbada, a sleek Senator set, or a Kaftan, these garments are culturally designed to drape, flow, and align precisely with the wearer’s body.

## The European Diaspora Context
Wearing an Agbada in Rome, Milan, or Verona carries immense cultural pride. However, European climates and architectural settings demand thoughtful adaptations in fabric choice and tailoring cut. Traditional heavy jacquards can overheat in indoor Mediterranean ballrooms, which is why our Verona atelier crafts modern Agbadas from breathable high-twist Italian wool and refined cashmere-cottons.

> "A bespoke Agbada must command the room without restricting the gentleman wearing it. Seam balance across the shoulders determines whether the cloth flies or drapes." — Master Tailor Samuelson

## 3 Sartorial Rules for European Ceremonies
1. **Shoulder Finish:** Ensure the winged drape falls cleanly at wrist-point when hands are at rest.
2. **Inner Buba Collar:** Choose a tailored Nehru or embroidered split-mandarin neckline that sits flush without bunching under the outer cloak.
3. **Footwear Harmony:** Pair with bespoke velvet slippers or hand-burnished Italian monk-strap shoes.

Ready to craft your bespoke wedding piece? Explore our collection or book a commission.`,
            tags: ['Agbada', 'Bespoke', 'Diaspora Wedding', 'Style Guide', 'Italy'],
            metaTitle: 'Bespoke Agbada Tailor in Italy | CaptainStitches',
            metaDescription: 'Discover how to style traditional Nigerian Agbada in Italy and Europe with bespoke cashmere tailoring by CaptainStitches.',
        },
        contentIT: {
            title: "L'Agbada Moderno in Europa: Guida di Stile per Matrimoni ed Eventi",
            excerpt: "Scopri come indossare l'Agbada tradizionale nigeriano in Italia ed Europa con la sartoria su misura di CaptainStitches.",
            body: `Nell'ambito della moda tradizionale nigeriana, la vestibilità non è una semplice preferenza: è l'intera dichiarazione sartoriale. Che si tratti di un maestoso Agbada o di un completo Senator, questi capi sono culturalmente disegnati per drappeggiare ed esaltare la figura.

La nostra sartoria a Verona reinterpreta l'Agbada utilizzando pregiate lane italiane e sete traspiranti, perfette per matrimoni e cerimonie in tutta Europa.`,
            tags: ['Agbada', 'Su Misura', 'Matrimonio Diaspora', 'Guida di Stile', 'Italia'],
            metaTitle: 'Sarto Agbada su Misura in Italia | CaptainStitches',
            metaDescription: "Scopri come indossare l'Agbada tradizionale nigeriano in Italia ed Europa con la sartoria su misura di CaptainStitches.",
        },
        cta: {
            isEnabled: true,
            text: 'Ready to craft your bespoke wedding piece? Explore our collection or book a commission.',
            linkType: 'order',
            customUrl: '/order',
        },
        stats: {
            views: 450,
            uniqueVisitors: 380,
            avgTimeOnPage: '5m',
            bounceRate: '24%',
            monthlyViews: 450,
            previousMonthViews: 310,
            ctaClicks: 62,
            orderConversions: 14,
            subscribersGained: 28,
            trafficSources: { direct: 35, whatsapp: 30, instagram: 20, google: 10, other: 5 },
            languageSplit: { en: 70, it: 30 },
            searchKeywords: [{ keyword: 'bespoke agbada italy', clicks: 24, position: 2 }],
        },
        lastSaved: 'Jun 5, 2026',
    },
    {
        id: 'post-bespoke-vs-ready',
        slug: 'bespoke-vs-ready-to-wear',
        featuredImage: '/images/blog-bespoke.jpg',
        featuredImageAlt: 'Why bespoke beats ready-to-wear native attires',
        category: 'Style Guide',
        status: 'published',
        publishDate: 'Jun 1, 2026',
        publishTime: '09:00',
        author: 'Samuelson',
        visibility: 'public',
        contentEN: {
            title: 'Why Bespoke Beats Ready-to-Wear for Nigerian Occasions',
            excerpt: "There's a reason every agbada you admire at a wedding was made to order. We explain why off-the-rack will never match the real thing.",
            body: `In the realm of traditional Nigerian fashion, fit is not just a preference — it is the entire statement. Whether it is a grand Agbada, a sleek Senator set, or a Kaftan, these garments are culturally designed to drape, flow, and align precisely with the wearer’s body.

Ready-to-wear clothes are engineered to represent averages. But African bodies, and particularly the posture required to carry traditional attires, are unique. When you choose bespoke tailoring through CaptainStitches, every seam is designed around your physical profile.`,
            tags: ['Agbada', 'Bespoke', 'Traditional Wedding', 'Fashion Guide'],
            metaTitle: 'Why Bespoke Beats Ready-to-Wear | CaptainStitches',
            metaDescription: 'Discover why bespoke tailoring outshines off-the-rack fashion for African traditional occasions.',
        },
        contentIT: {
            title: 'Perché il Su Misura Supera il Pret-a-Porter per le Cerimonie Africane',
            excerpt: "Ogni capo ammirato a un matrimonio è realizzato su misura. Ecco perché il pret-a-porter non può competere.",
            body: `La moda tradizionale richiede precisione millimetrica. Scopri i vantaggi del taglio sartoriale rispetto alle taglie standard.`,
            tags: ['Su Misura', 'Sartoria', 'Stile'],
            metaTitle: 'Su Misura vs Pret-a-Porter | CaptainStitches',
            metaDescription: 'I vantaggi della sartoria tradizionale africana su misura.',
        },
        cta: {
            isEnabled: true,
            text: 'Ready to commission your next bespoke piece? Browse the curated atelier collection →',
            linkType: 'catalogue',
            customUrl: '/catalogue',
        },
        stats: {
            views: 310,
            uniqueVisitors: 260,
            avgTimeOnPage: '4m',
            bounceRate: '28%',
            monthlyViews: 310,
            previousMonthViews: 190,
            ctaClicks: 41,
            orderConversions: 8,
            subscribersGained: 15,
            trafficSources: { direct: 40, whatsapp: 35, instagram: 15, google: 10, other: 0 },
            languageSplit: { en: 80, it: 20 },
            searchKeywords: [],
        },
        lastSaved: 'Jun 1, 2026',
    },
]

const STORAGE_KEY_POSTS = 'cs_admin_blog_posts_v2'
const STORAGE_KEY_SETTINGS = 'cs_admin_blog_settings_v2'

let inMemoryPosts: AdminBlogPost[] = [...INITIAL_BLOG_POSTS]
let inMemorySettings: BlogGlobalSettings = { ...INITIAL_BLOG_SETTINGS }

export function getAllBlogPosts(): AdminBlogPost[] {
    if (typeof window === 'undefined') return inMemoryPosts
    try {
        const stored = localStorage.getItem(STORAGE_KEY_POSTS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_BLOG_POSTS))
            return INITIAL_BLOG_POSTS
        }
        const parsed = JSON.parse(stored)
        if (!Array.isArray(parsed) || parsed.length === 0) {
            localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_BLOG_POSTS))
            return INITIAL_BLOG_POSTS
        }
        return parsed
    } catch {
        return inMemoryPosts
    }
}

export function saveAllBlogPosts(posts: AdminBlogPost[]): void {
    inMemoryPosts = [...posts]
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(posts))
    } catch (e) {
        console.error('Failed to save blog posts to localStorage', e)
    }
}

export function getBlogPostById(id: string): AdminBlogPost | undefined {
    const posts = getAllBlogPosts()
    return posts.find((p) => p.id === id)
}

export function saveBlogPost(post: AdminBlogPost): AdminBlogPost[] {
    const posts = getAllBlogPosts()
    const now = new Date()
    const timeStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    const postWithTimestamp = {
        ...post,
        lastSaved: timeStr,
    }

    const index = posts.findIndex((p) => p.id === post.id)
    let updated: AdminBlogPost[]
    if (index >= 0) {
        updated = [...posts]
        updated[index] = postWithTimestamp
    } else {
        updated = [postWithTimestamp, ...posts]
    }

    saveAllBlogPosts(updated)
    return updated
}

export function deleteBlogPost(id: string): AdminBlogPost[] {
    const posts = getAllBlogPosts()
    const updated = posts.filter((p) => p.id !== id)
    saveAllBlogPosts(updated)
    return updated
}

export function duplicateBlogPost(id: string): AdminBlogPost | null {
    const posts = getAllBlogPosts()
    const target = posts.find((p) => p.id === id)
    if (!target) return null

    const newId = `post-${Date.now()}`
    const duplicated: AdminBlogPost = {
        ...target,
        id: newId,
        slug: `${target.slug}-copy`,
        status: 'draft',
        publishDate: 'Draft',
        contentEN: {
            ...target.contentEN,
            title: `${target.contentEN.title} (Copy)`,
        },
        contentIT: {
            ...target.contentIT,
            title: target.contentIT.title ? `${target.contentIT.title} (Copia)` : '',
        },
        stats: {
            views: 0,
            uniqueVisitors: 0,
            avgTimeOnPage: '0m',
            bounceRate: '0%',
            monthlyViews: 0,
            previousMonthViews: 0,
            ctaClicks: 0,
            orderConversions: 0,
            subscribersGained: 0,
            trafficSources: { direct: 0, whatsapp: 0, instagram: 0, google: 0, other: 0 },
            languageSplit: { en: 100, it: 0 },
            searchKeywords: [],
        },
        lastSaved: 'Just duplicated',
    }

    const updated = [duplicated, ...posts]
    saveAllBlogPosts(updated)
    return duplicated
}

export function getBlogSettings(): BlogGlobalSettings {
    if (typeof window === 'undefined') return inMemorySettings
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(inMemorySettings))
            return inMemorySettings
        }
        return JSON.parse(stored)
    } catch {
        return inMemorySettings
    }
}

export function saveBlogSettings(settings: BlogGlobalSettings): void {
    inMemorySettings = { ...settings }
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    } catch (e) {
        console.error('Failed to save blog settings', e)
    }
}

export function getBlogStats(posts = getAllBlogPosts()) {
    const totalPublished = posts.filter((p) => p.status === 'published').length
    const totalDrafts = posts.filter((p) => p.status === 'draft').length
    const totalScheduled = posts.filter((p) => p.status === 'scheduled').length

    let mostViewed = { title: 'None', views: 0 }
    let totalSubscribers = 0

    posts.forEach((p) => {
        if (p.stats.monthlyViews > mostViewed.views) {
            mostViewed = { title: p.contentEN.title, views: p.stats.monthlyViews }
        }
        totalSubscribers += p.stats.subscribersGained
    })

    return {
        totalPublished,
        totalDrafts,
        totalScheduled,
        mostViewed,
        totalSubscribers,
    }
}
