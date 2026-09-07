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
        id: 'post-1',
        slug: 'bespoke-vs-ready-to-wear',
        featuredImage: 'https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=1200&q=80',
        featuredImageAlt: 'Hand-tailored Nigerian Grand Agbada with ornate embroidery detail',
        category: 'Style Guide',
        status: 'published',
        publishDate: 'Jun 1, 2026',
        publishTime: '10:00',
        author: 'Samuelson',
        visibility: 'public',
        contentEN: {
            title: 'Why Bespoke Beats Ready-to-Wear for Nigerian Occasions',
            excerpt: "There's a reason every agbada you admire at a wedding was made to order. We explain why off-the-rack will never match the real thing.",
            body: `In the realm of traditional Nigerian fashion, fit is not just a preference — it is the entire statement. Whether it is a grand Agbada, a sleek Senator set, or a Kaftan, these garments are culturally designed to drape, flow, and align precisely with the wearer’s body. This is why off-the-rack alternatives will always pale in comparison to a custom-tailored piece.

Ready-to-wear clothes are engineered to represent averages. They assume that if you have a certain shoulder width, your waist and sleeve lengths must fit standard proportions. But African bodies, and particularly the posture required to carry traditional attires, are unique. An Agbada that is too tight in the armholes or too short at the hem instantly loses its majestic presence.

When you choose bespoke tailoring through CaptainStitches, every seam is designed around your physical profile. The drape of the Agbada shoulder is structured to fall gracefully without bunching. The trousers are cut to sit comfortably, accommodating both standing posture and traditional sitting arrangements at ceremonies.

Additionally, bespoke fashion is about fabric integrity and embroidery craftsmanship. Ready-to-wear native attires often use lightweight, blended fabrics that do not hold the heavy chest embroidery characteristic of a premium Agbada. Our artisans in Aba and Lagos hand-select dense cashmere, structured cottons, and rich wools that support intricate geometric embroidery patterns without warping the material.

Investing in a bespoke piece is an investment in your personal brand. It ensures that when you step into the room at a wedding, gala, or community ceremony, your clothing communicates respect, dignity, and a flawless sense of style.`,
            tags: ['Agbada', 'Bespoke', 'Traditional Wedding', 'Fashion Guide'],
            metaTitle: 'Why Bespoke Beats Ready-to-Wear | CaptainStitches Journal',
            metaDescription: 'Discover why bespoke tailoring is essential for Nigerian traditional occasions. From drape to embroidery, learn why off-the-rack fashion falls short.',
        },
        contentIT: {
            title: 'Perché il Su Misura Supera il Prêt-à-Porter per le Cerimonie Nigeriane',
            excerpt: "C'è un motivo per cui ogni agbada ammirata a un matrimonio è stata realizzata su ordinazione. Spieghiamo perché il capo già pronto non regge il confronto.",
            body: `Nel mondo della moda tradizionale nigeriana, la vestibilità non è una semplice preferenza: è l'intera dichiarazione di stile. Che si tratti di un maestoso Agbada o di un completo Senator, questi capi sono progettati per cadere perfettamente sul corpo.

I capi prêt-à-porter sono calcolati su taglie standard che non tengono conto della postura e della solennità richieste da questi abiti. Quando scegli il su misura di CaptainStitches, ogni cucitura è calibrata sul tuo profilo corporeo.`,
            tags: ['Agbada', 'Su Misura', 'Matrimonio Tradizionale', 'Moda Africana'],
            metaTitle: 'Perché il Su Misura Vince Sempre | CaptainStitches',
            metaDescription: 'La guida completa alla sartoria bespoke per occasioni formali nigeriane. Scopri la maestria tessile di CaptainStitches.',
        },
        cta: {
            isEnabled: true,
            text: 'Ready to order your next piece? Browse the collection →',
            linkType: 'catalogue',
            customUrl: '/catalogue',
        },
        stats: {
            views: 1420,
            uniqueVisitors: 1180,
            avgTimeOnPage: '4m 12s',
            bounceRate: '38%',
            monthlyViews: 520,
            previousMonthViews: 440,
            ctaClicks: 88,
            orderConversions: 6,
            subscribersGained: 24,
            trafficSources: { direct: 22, whatsapp: 38, instagram: 24, google: 12, other: 4 },
            languageSplit: { en: 76, it: 24 },
            searchKeywords: [
                { keyword: 'bespoke agbada italy', clicks: 310, position: 1.4 },
                { keyword: 'traditional nigerian wedding attire milan', clicks: 180, position: 2.1 },
                { keyword: 'nigerian tailor in europe', clicks: 140, position: 1.8 },
            ],
        },
        lastSaved: 'Jun 1, 2026 · 10:00 AM',
    },
    {
        id: 'post-2',
        slug: 'agbada-rome-wedding',
        featuredImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80',
        featuredImageAlt: 'Groom wearing custom Royal Blue Agbada in Rome wedding setting',
        category: 'Case Study',
        status: 'published',
        publishDate: 'May 20, 2026',
        publishTime: '14:30',
        author: 'Samuelson',
        visibility: 'public',
        contentEN: {
            title: 'How We Made a Full Agbada Set in 10 Days for a Wedding in Rome',
            excerpt: 'When Adewale contacted us 12 days before his wedding, we had to move fast — here is exactly how we pulled it off.',
            body: `It was a Tuesday afternoon when Adewale reached out to us from Rome. He was getting married the following Saturday, and due to a catastrophic logistics failure with another tailor, he had no outfit. With only 10 days until the wedding ceremony, we had to execute our express tailoring pipeline with zero margin for error.

Here is the daily breakdown of how CaptainStitches mobilized operations between Verona, Lagos, and Rome to save the day:

Day 1: Measurement Collection & Verification
We immediately scheduled a WhatsApp video consultation. Our head coordinator guided Adewale through the measurements process, capturing precise shoulder, sleeve, chest, and trouser lengths. We finalized the design: a Grand Agbada in Royal Blue with gold embroidery, paired with a matching native cap (Fila).

Day 2–3: Material Sourcing & Cutting
The specifications were sent to our workshop in Aba. Our tailors sourced a premium, heavy-weight polished wool-blend that would drape majestically. By Wednesday evening, the panels were cut and ready for the embroidery machine.

Day 4–6: Detailed Hand-Finished Embroidery
Intricate embroidery is the soul of an Agbada. Our lead designer programmed the geometric chest and sleeve details. After machine embroidery, our artisans spent a full day hand-trimming and finishing the loose threads to ensure a clean look.

Day 7: Tailor Inspection & Video Sign-off
The completed pieces were assembled, pressed, and laid out on our quality check board. We recorded a 4K inspection video showing the stitch lines, seams, and fit dimensions, and sent it to Adewale for approval. He was thrilled.

Day 8–9: DHL Express Shipping
The package was dispatched via DHL Express from Lagos directly to Adewale’s address in Rome. We monitored the shipment hourly as it cleared customs.

Day 10: Fitting and Delivery
The package arrived in Rome on Thursday afternoon. Adewale tried it on immediately. The fit was impeccable — no alterations needed. Two days later, he walked down the aisle in a custom piece that looked like it took months to make.`,
            tags: ['Case Study', 'Agbada', 'Express Delivery', 'Rome'],
            metaTitle: 'Agbada in 10 Days: Rome Wedding Case Study | CaptainStitches',
            metaDescription: 'Read how CaptainStitches designed, tailored, and delivered an exquisite bespoke Grand Agbada to Rome in just 10 days.',
        },
        contentIT: {
            title: 'Come Abbiamo Realizzato un Agbada in 10 Giorni per un Matrimonio a Roma',
            excerpt: 'Quando Adewale ci ha contattati 12 giorni prima delle sue nozze, abbiamo dovuto agire in fretta: ecco come ci siamo riusciti.',
            body: `Un martedì pomeriggio Adewale ci ha contattati da Roma in preda al panico: il suo sarto precedente non aveva consegnato in tempo. Con soli 10 giorni a disposizione, abbiamo attivato la nostra linea sartoriale express tra Verona, Lagos e Roma.

Dalla videochiamata di misurazione alla consegna DHL, ecco la cronaca di un trionfo sartoriale che ha permesso allo sposo di risplendere all'altare.`,
            tags: ['Caso Studio', 'Agbada Express', 'Matrimonio Roma'],
            metaTitle: 'Agbada in 10 Giorni a Roma: Caso Studio | CaptainStitches',
            metaDescription: 'La storia vera di una consegna express per un matrimonio a Roma. Scopri la logistica e la maestria di CaptainStitches.',
        },
        cta: {
            isEnabled: true,
            text: 'Need express bespoke tailoring for an upcoming event? Start your commission →',
            linkType: 'order',
            customUrl: '/order',
        },
        stats: {
            views: 2890,
            uniqueVisitors: 2310,
            avgTimeOnPage: '5m 45s',
            bounceRate: '29%',
            monthlyViews: 940,
            previousMonthViews: 710,
            ctaClicks: 215,
            orderConversions: 14,
            subscribersGained: 52,
            trafficSources: { direct: 18, whatsapp: 46, instagram: 22, google: 10, other: 4 },
            languageSplit: { en: 68, it: 32 },
            searchKeywords: [
                { keyword: 'agbada express delivery europe', clicks: 420, position: 1.1 },
                { keyword: 'emergency nigerian wedding attire rome', clicks: 210, position: 1.2 },
            ],
        },
        lastSaved: 'May 20, 2026 · 02:30 PM',
    },
    {
        id: 'post-3',
        slug: 'suit-vs-senator',
        featuredImage: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=1200&q=80',
        featuredImageAlt: 'Modern Senator suit styled with geometric embroidery collar',
        category: 'Design Opinions',
        status: 'published',
        publishDate: 'May 5, 2026',
        publishTime: '09:15',
        author: 'Samuelson',
        visibility: 'public',
        contentEN: {
            title: 'English Suit vs Senator: Which Should You Wear to a Corporate Dinner?',
            excerpt: 'Both are sharp. Both command a room. The right choice depends on the message you want to send.',
            body: `It is the classic modern corporate dilemma for African professionals in Europe: do you wear a traditional English three-piece suit or a sharp custom Senator wear to a high-end corporate dinner? Both styles are formal, sophisticated, and command respect. However, they tell different stories.

The English Suit: Classic Corporate Authority
A classic three-piece suit (jacket, waistcoat, trousers) is the universal language of global business. It represents structure, formality, and alignment with corporate traditions. If the dinner is an international corporate gala where you are presenting or negotiating, the English suit is a bulletproof choice. It says you belong in the room and respect global corporate standards.

The Senator Set: Cultural Confidence and Pride
In recent years, the Senator wear (a structured two-piece native set with long-sleeved tunic and slim trousers) has migrated from Nigerian political circles to global corporate tables. It represents cultural pride, identity, and confidence. Wearing a sharp, dark-toned Senator wear (such as Midnight Navy or Slate Grey) with a breast pocket pocket-square is highly distinguished. It says you are proud of your heritage and stand out from the sea of black tuxedos.

How to Choose Based on the Context
1. The Dress Code: If the invitation explicitly says "Black Tie," a tuxedo or a Grand Agbada is appropriate. If it says "Business Formal," both the suit and the Senator wear are acceptable.
2. Your Role: If you are hosting or want to project an identity as a global African leader, the Senator set is an incredible icebreaker that starts conversations about craft and culture.
3. Fabric and Tailoring: A cheap suit looks bad, but a cheap Senator wear looks worse. If you wear Senator to a corporate dinner, the tailoring must be razor-sharp, made from high-grade wool or cashmere crepe, with clean plackets and invisible stitching.`,
            tags: ['Suits', 'Senator Wear', 'Corporate Fashion', 'Gala Attire'],
            metaTitle: 'English Suit vs Senator Wear | CaptainStitches Editorial',
            metaDescription: 'Choosing between a bespoke English suit and custom Senator attire for an executive dinner. Explore the dress code nuances with CaptainStitches.',
        },
        contentIT: {
            title: 'Abito Inglese vs Completo Senator: Cosa Indossare a una Cena Aziendale?',
            excerpt: 'Entrambi eleganti. Entrambi autorevoli. La scelta giusta dipende dal messaggio che desideri trasmettere.',
            body: `Il dilemma per i professionisti moderni: abito tre pezzi classico o completo Senator sartoriale? Analizziamo codici di abbigliamento, tessuti e presenza scenica per eccellere negli eventi di prestigio.`,
            tags: ['Abito Formale', 'Completo Senator', 'Moda Business'],
            metaTitle: 'Abito Sartoriale vs Senator | CaptainStitches',
            metaDescription: 'La guida definitiva tra stile sartoriale europeo e fiero abbigliamento Senator per serate di gala e cene corporate.',
        },
        cta: {
            isEnabled: true,
            text: 'Explore our bespoke English Suits and Royal Senator collection →',
            linkType: 'catalogue',
            customUrl: '/catalogue',
        },
        stats: {
            views: 1850,
            uniqueVisitors: 1540,
            avgTimeOnPage: '4m 30s',
            bounceRate: '34%',
            monthlyViews: 610,
            previousMonthViews: 580,
            ctaClicks: 140,
            orderConversions: 8,
            subscribersGained: 31,
            trafficSources: { direct: 30, whatsapp: 32, instagram: 18, google: 16, other: 4 },
            languageSplit: { en: 80, it: 20 },
            searchKeywords: [
                { keyword: 'senator wear corporate dinner', clicks: 290, position: 1.5 },
                { keyword: 'can you wear native wear to formal gala', clicks: 190, position: 2.0 },
            ],
        },
        lastSaved: 'May 5, 2026 · 09:15 AM',
    },
    {
        id: 'post-4',
        slug: 'summer-linen-preview',
        featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1200&q=80',
        featuredImageAlt: 'Pure Italian linen suit tailored in sand beige',
        category: 'Brand News',
        status: 'scheduled',
        publishDate: 'Jun 15, 2026',
        publishTime: '09:00',
        author: 'Samuelson',
        visibility: 'public',
        contentEN: {
            title: 'Upcoming: The Riviera Linen Capsule Collection for Mediterranean Summers',
            excerpt: 'Lightweight, breathable, and unapologetically tailored. A preview of our upcoming Mediterranean linen capsule for summer 2026.',
            body: `As summer approaches the Italian peninsula, CaptainStitches is proud to unveil our first dedicated seasonal capsule: The Riviera Linen Collection.

Combining heavy-weight Normandy flax linen woven in Northern Italy with signature African clean lines and collar profiles, this capsule solves the problem of formal summer dressing in extreme heat.`,
            tags: ['Linen', 'Summer 2026', 'Mediterranean Capsule', 'Preview'],
            metaTitle: 'The Riviera Linen Capsule Collection | CaptainStitches',
            metaDescription: 'Preview the summer 2026 Mediterranean linen capsule collection from CaptainStitches bespoke atelier.',
        },
        contentIT: {
            title: 'In Arrivo: La Collezione Riviera Linen per l’Estate Mediterranea',
            excerpt: 'Leggera, traspirante e sartoriale. Un’anteprima della nostra capsule estiva in lino italiano per l’estate 2026.',
            body: `Con l'arrivo della bella stagione, presentiamo in anteprima la collezione Riviera Linen: lino italiano pregiato combinato con le silhouette distintive del nostro atelier.`,
            tags: ['Lino', 'Estate 2026', 'Capsule Mediterranea'],
            metaTitle: 'Collezione Riviera Linen | CaptainStitches',
            metaDescription: 'Anteprima esclusiva della collezione estiva in lino puro CaptainStitches.',
        },
        cta: {
            isEnabled: true,
            text: 'Join the VIP priority waiting list for early access →',
            linkType: 'order',
            customUrl: '/order',
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
            languageSplit: { en: 50, it: 50 },
            searchKeywords: [],
        },
        lastSaved: 'Jun 4, 2026 · 04:20 PM',
    },
    {
        id: 'post-5',
        slug: 'care-for-cashmere-kaftans',
        featuredImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=1200&q=80',
        featuredImageAlt: 'Luxury double-faced cashmere kaftan hanging in wardrobe',
        category: 'Style Guide',
        status: 'draft',
        publishDate: 'Draft',
        publishTime: '',
        author: 'Samuelson',
        visibility: 'public',
        contentEN: {
            title: 'How to Care for and Preserve Double-Faced Cashmere Kaftans',
            excerpt: 'Cashmere kaftans are lifelong investments. Here are the master tailor rules for dry cleaning, steaming, and seasonal cedar storage.',
            body: `Double-faced cashmere represents the pinnacle of luxury winter native wear. However, improper washing or hanger choices can permanently damage the soft fibers.

Rule 1: Never Machine Wash or Tumble Dry. Always use specialist eco dry-cleaning.
Rule 2: Rest Your Garments Between Wears to allow natural elasticity to bounce back.
Rule 3: Store in breathable cotton garment bags with natural red cedar blocks to deter moths.`,
            tags: ['Cashmere', 'Garment Care', 'Kaftan Maintenance'],
            metaTitle: 'Preserving Cashmere Kaftans | CaptainStitches Guide',
            metaDescription: 'Master tailor rules on cleaning, pressing, and storing luxury cashmere native wear.',
        },
        contentIT: {
            title: '',
            excerpt: '',
            body: '',
            tags: [],
            metaTitle: '',
            metaDescription: '',
        },
        cta: {
            isEnabled: true,
            text: 'Explore our luxury Cashmere Evening Kaftans →',
            linkType: 'catalogue',
            customUrl: '/catalogue',
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
        lastSaved: 'Jun 2, 2026 · 11:15 AM',
    },
]

const STORAGE_KEY_POSTS = 'cs_admin_blog_posts_v1'
const STORAGE_KEY_SETTINGS = 'cs_admin_blog_settings_v1'

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
