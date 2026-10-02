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

export const INITIAL_BLOG_POSTS: AdminBlogPost[] = []

const STORAGE_KEY_POSTS = 'cs_admin_blog_posts_v2'
const STORAGE_KEY_SETTINGS = 'cs_admin_blog_settings_v2'

export function getAllBlogPosts(): AdminBlogPost[] {
    if (typeof window === 'undefined') return INITIAL_BLOG_POSTS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_POSTS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_POSTS, JSON.stringify(INITIAL_BLOG_POSTS))
            return INITIAL_BLOG_POSTS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_BLOG_POSTS
    }
}

export function saveAllBlogPosts(posts: AdminBlogPost[]): void {
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
    if (typeof window === 'undefined') return INITIAL_BLOG_SETTINGS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_BLOG_SETTINGS))
            return INITIAL_BLOG_SETTINGS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_BLOG_SETTINGS
    }
}

export function saveBlogSettings(settings: BlogGlobalSettings): void {
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
