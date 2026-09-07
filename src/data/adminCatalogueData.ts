export type CatalogueCategory = 'native-wear' | 'english-suit' | 'casual' | 'children'

export interface DesignPhoto {
    id: string
    url: string
    isCover: boolean
    caption?: string
}

export interface DesignReviewItem {
    id: string
    customerName: string
    rating: number
    comment: string
    date: string
    status: 'APPROVED' | 'PENDING' | 'REJECTED'
    photos?: string[]
}

export interface CatalogueDesign {
    id: string
    slug: string
    sortOrder: number
    category: CatalogueCategory
    categoryLabel: string
    isVisible: boolean
    isFeatured: boolean
    turnaroundDays: number
    pricing: {
        priceNGN: number
        priceEUR: number
        pricingNote?: string
    }
    photos: DesignPhoto[]
    fabrics: string[]
    colours: Array<{ name: string; hex?: string }>
    contentEN: {
        name: string
        description: string
        tags: string[]
    }
    contentIT: {
        name: string
        description: string
        tags: string[]
    }
    seo: {
        metaTitleEN: string
        metaDescriptionEN: string
        metaTitleIT: string
        metaDescriptionIT: string
    }
    stats: {
        totalOrders: number
        averageRating: number
        reviewCount: number
        dateCreated: string
        lastUpdated: string
        popularFabrics: string[]
        popularColours: string[]
    }
    reviews: DesignReviewItem[]
}

export const CATEGORY_OPTIONS: { key: CatalogueCategory; label: string }[] = [
    { key: 'native-wear', label: 'Native Wear' },
    { key: 'english-suit', label: 'English Suits' },
    { key: 'casual', label: 'Casual Wear' },
    { key: 'children', label: "Children's" },
]

export const INITIAL_CATALOGUE_DESIGNS: CatalogueDesign[] = [
    {
        id: 'des-1',
        slug: 'grand-agbada',
        sortOrder: 1,
        category: 'native-wear',
        categoryLabel: 'Native Wear',
        isVisible: true,
        isFeatured: true,
        turnaroundDays: 14,
        pricing: {
            priceNGN: 120000,
            priceEUR: 68,
            pricingNote: 'Price includes handcrafted geometric yoke embroidery and matching Fila cap.',
        },
        photos: [
            { id: 'p-1', url: '/images/design-agbada.jpg', isCover: true, caption: 'Grand Agbada in Royal Obsidian Brocade' },
            { id: 'p-2', url: '/images/category-native.jpeg', isCover: false, caption: 'Neckline & yoke hand-embroidery detail' },
            { id: 'p-3', url: '/images/design-kaftan.jpg', isCover: false, caption: 'Inner Kaftan and matching trousers' },
        ],
        fabrics: ['Imperial Royal Guinea Brocade', 'Swiss Voile Damask', 'Supreme Cashmere Cotton', 'Aso Oke Silk Accent'],
        colours: [
            { name: 'Obsidian Black & Gold', hex: '#1C1C1C' },
            { name: 'Royal Ivory & Champagne', hex: '#FAF5EA' },
            { name: 'Imperial Navy', hex: '#0B2240' },
            { name: 'Burgundy Wine', hex: '#58111A' },
        ],
        contentEN: {
            name: 'Grand Agbada',
            description: 'A majestic, statement three-piece Nigerian attire consisting of the inner kaftan, trousers, and the flowing outer robe (Agbada). Handcrafted with geometric embroidery on premium fabric, it represents prestige and heritage. Ideal for weddings, traditional ceremonies, and major celebrations.',
            tags: ['Agbada', 'Nigerian Wedding', 'Milan Bespoke', 'Native Wear', 'Royal Brocade'],
        },
        contentIT: {
            name: 'Grand Agbada Reale',
            description: 'Un maestoso abito tradizionale nigeriano a tre pezzi, composto da caftano interno, pantaloni sartoriali e ampia veste esterna fluente (Agbada). Rifinito a mano con ricami geometrici su broccato di altissimo pregio. Ideale per matrimoni, ricevimenti e cerimonie importanti.',
            tags: ['Agbada', 'Sartoria Nigeriana', 'Milano Bespoke', 'Abito Tradizionale'],
        },
        seo: {
            metaTitleEN: 'Grand Agbada — Bespoke Nigerian Royal Attire | CaptainStitches',
            metaDescriptionEN: 'Handcrafted Grand Agbada tailored to your precise measurements. Hand-stitched embroidery on premium Guinea brocade, delivered worldwide to Milan and Nigeria.',
            metaTitleIT: 'Grand Agbada Reale — Sartoria Tradizionale Nigeriana | CaptainStitches',
            metaDescriptionIT: 'Grand Agbada su misura con ricami artigianali su broccato reale. Consegna sartoriale a Milano e in tutta Europa.',
        },
        stats: {
            totalOrders: 38,
            averageRating: 4.9,
            reviewCount: 38,
            dateCreated: 'Oct 10, 2025',
            lastUpdated: 'May 28, 2026',
            popularFabrics: ['Imperial Royal Guinea Brocade', 'Swiss Voile Damask'],
            popularColours: ['Obsidian Black & Gold', 'Royal Ivory & Champagne'],
        },
        reviews: [
            {
                id: 'rev-101',
                customerName: 'Chidi O.',
                rating: 5,
                comment: 'Absolutely stunning. Wore it to a wedding in Milan and got compliments all night. The embroidery is flawless.',
                date: 'Aug 12, 2026',
                status: 'APPROVED',
            },
            {
                id: 'rev-102',
                customerName: 'Kunle A.',
                rating: 5,
                comment: 'Top-tier quality. The fit is perfect, exactly to the measurements I provided. Delivered to Rome right on time.',
                date: 'Jul 28, 2026',
                status: 'APPROVED',
            },
            {
                id: 'rev-103',
                customerName: 'Emeka N.',
                rating: 4,
                comment: 'Very heavy, high-quality fabric. Feels very premium. The custom embroidery detail is outstanding.',
                date: 'Jul 15, 2026',
                status: 'APPROVED',
            },
            {
                id: 'rev-104',
                customerName: 'Matteo R.',
                rating: 5,
                comment: 'Fascinating craftsmanship. The drape is spectacular.',
                date: 'Aug 20, 2026',
                status: 'PENDING',
            },
        ],
    },
    {
        id: 'des-2',
        slug: 'classic-senator',
        sortOrder: 2,
        category: 'native-wear',
        categoryLabel: 'Native Wear',
        isVisible: true,
        isFeatured: true,
        turnaroundDays: 10,
        pricing: {
            priceNGN: 85000,
            priceEUR: 47,
            pricingNote: 'Includes tailored trousers and matching breast-pocket kerchief.',
        },
        photos: [
            { id: 'p-4', url: '/images/design-senator.jpg', isCover: true, caption: 'Classic Senator in Charcoal Wool Linen' },
            { id: 'p-5', url: '/images/category-native.jpeg', isCover: false, caption: 'Minimalist chest placket detail' },
        ],
        fabrics: ['Super 140s Wool Linen', 'Cashmere Cotton Blend', 'Italian Lightweight Crepe'],
        colours: [
            { name: 'Charcoal Grey with Burgundy Trim', hex: '#333333' },
            { name: 'Jet Black', hex: '#111111' },
            { name: 'Deep Navy', hex: '#0B2240' },
            { name: 'Warm Olive', hex: '#556B2F' },
        ],
        contentEN: {
            name: 'Classic Senator',
            description: 'The epitome of modern African executive elegance. A clean two-piece tunic and tailored trouser ensemble with crisp collar lines and concealed placket detailing. Versatile for corporate diplomacy, church, and evening soirees.',
            tags: ['Senator Suit', 'African Corporate', 'Lagos Fashion', 'Minimalist'],
        },
        contentIT: {
            name: 'Abito Senator Classico',
            description: 'L’emblema dell’eleganza executive afro-europea. Completo a due pezzi con tunica sartoriale e pantaloni a sigaretta, caratterizzato da collo rigido e abbottonatura a scomparsa.',
            tags: ['Senator', 'Stile Executive', 'Moda Uomo', 'Bespoke'],
        },
        seo: {
            metaTitleEN: 'Classic Senator Suit — Bespoke African Executive Wear | CaptainStitches',
            metaDescriptionEN: 'Elegantly tailored Classic Senator suit. Custom crafted from Super 140s wool linen for business and formal occasions.',
            metaTitleIT: 'Abito Senator Classico — Eleganza Africana Executive | CaptainStitches',
            metaDescriptionIT: 'Completo Senator su misura in misto lana e lino. Sartoria afro-italiana di alta qualità.',
        },
        stats: {
            totalOrders: 52,
            averageRating: 4.8,
            reviewCount: 52,
            dateCreated: 'Sep 15, 2025',
            lastUpdated: 'May 15, 2026',
            popularFabrics: ['Super 140s Wool Linen'],
            popularColours: ['Charcoal Grey with Burgundy Trim', 'Deep Navy'],
        },
        reviews: [
            {
                id: 'rev-201',
                customerName: 'Emeka Balogun',
                rating: 5,
                comment: 'Wore it for our bank annual keynote. The cut and seam precision are flawless.',
                date: 'May 16, 2026',
                status: 'APPROVED',
            },
            {
                id: 'rev-202',
                customerName: 'David K.',
                rating: 5,
                comment: 'Breathable fabric and sharp styling. Very impressed with the quick delivery to Lagos.',
                date: 'Apr 02, 2026',
                status: 'APPROVED',
            },
        ],
    },
    {
        id: 'des-3',
        slug: 'italian-3-piece-suit',
        sortOrder: 3,
        category: 'english-suit',
        categoryLabel: 'English Suits',
        isVisible: true,
        isFeatured: true,
        turnaroundDays: 21,
        pricing: {
            priceNGN: 160000,
            priceEUR: 90,
            pricingNote: 'Includes peak-lapel jacket, double-breasted vest, and flat-front trousers.',
        },
        photos: [
            { id: 'p-6', url: '/images/design-suit.jpg', isCover: true, caption: 'Italian 3-Piece Suit in Midnight Biella Wool' },
            { id: 'p-7', url: '/images/category-suits.jpg', isCover: false, caption: 'Pick-stitched lapel and silk horn buttons' },
        ],
        fabrics: ['Super 150s Merino Wool (Biella)', 'Tropical Wool 130s', 'Herringbone Tweed'],
        colours: [
            { name: 'Midnight Navy Pinstripe', hex: '#111D2D' },
            { name: 'Slate Grey', hex: '#708090' },
            { name: 'Classic Black', hex: '#000000' },
            { name: 'Espresso Brown', hex: '#3B2F2F' },
        ],
        contentEN: {
            name: 'Italian 3-Piece Suit',
            description: 'Handcrafted bespoke three-piece tailored suit cut from authentic Italian Biella merino wool. Features sharp peak lapels, tailored waistcoat, genuine horn buttons, and interior silk piping.',
            tags: ['Italian Suit', '3-Piece Bespoke', 'Milan Tailoring', 'Biella Wool'],
        },
        contentIT: {
            name: 'Abito Tre Pezzi Sartoriale',
            description: 'Abito tre pezzi confezionato a mano con lane merino selezionate di Biella. Rever a lancia, gilet coordinato e bottoni in vero corno naturale.',
            tags: ['Abito Uomo', 'Tre Pezzi', 'Lana Biella', 'Sartoria Milano'],
        },
        seo: {
            metaTitleEN: 'Italian 3-Piece Suit — Bespoke Biella Wool | CaptainStitches',
            metaDescriptionEN: 'Bespoke 3-piece Italian suit crafted from Super 150s Merino wool. Hand-cut and fitted in Milan and Lagos.',
            metaTitleIT: 'Abito Sartoriale 3 Pezzi in Lana di Biella | CaptainStitches',
            metaDescriptionIT: 'Completo da uomo 3 pezzi su misura in pura lana merino. Sartoria d’eccellenza a Milano.',
        },
        stats: {
            totalOrders: 24,
            averageRating: 5.0,
            reviewCount: 24,
            dateCreated: 'Nov 01, 2025',
            lastUpdated: 'May 20, 2026',
            popularFabrics: ['Super 150s Merino Wool (Biella)'],
            popularColours: ['Midnight Navy Pinstripe', 'Slate Grey'],
        },
        reviews: [
            {
                id: 'rev-301',
                customerName: 'Adewale Okafor',
                rating: 5,
                comment: 'The shoulders fit like a dream. Master craftsmanship.',
                date: 'Dec 18, 2025',
                status: 'APPROVED',
            },
        ],
    },
    {
        id: 'des-4',
        slug: 'kaftan-royale',
        sortOrder: 4,
        category: 'native-wear',
        categoryLabel: 'Native Wear',
        isVisible: true,
        isFeatured: false,
        turnaroundDays: 10,
        pricing: {
            priceNGN: 75000,
            priceEUR: 42,
            pricingNote: 'Minimalist mandarin collar with concealed mother-of-pearl buttons.',
        },
        photos: [
            { id: 'p-8', url: '/images/design-kaftan.jpg', isCover: true, caption: 'Kaftan Royale in Emerald Wool Cashmere' },
            { id: 'p-9', url: '/images/category-native.jpeg', isCover: false, caption: 'Mandarin collar detail' },
        ],
        fabrics: ['Cashmere Wool Blend', 'High-twist Egyptian Cotton', 'Polished Linen'],
        colours: [
            { name: 'Emerald Green & Bronze', hex: '#0B6623' },
            { name: 'Burgundy Wine', hex: '#58111A' },
            { name: 'Sand Stone', hex: '#C2B280' },
            { name: 'Ivory', hex: '#FFFFF0' },
        ],
        contentEN: {
            name: 'Kaftan Royale',
            description: 'Refined native attire offering effortless grandeur. Featuring a clean mandarin collar, hand-finished hems, and concealed mother-of-pearl buttons.',
            tags: ['Kaftan', 'African Bespoke', 'Casual Native'],
        },
        contentIT: {
            name: 'Caftano Royale',
            description: 'Caftano sartoriale di alta classe con collo coreano e bottoni in madreperla nascosti.',
            tags: ['Caftano', 'Moda Etnica Chic', 'Sartoria'],
        },
        seo: {
            metaTitleEN: 'Kaftan Royale — Bespoke African Kaftan | CaptainStitches',
            metaDescriptionEN: 'Modern tailored Kaftan Royale in cashmere wool blend with mandarin collar.',
            metaTitleIT: 'Caftano Royale su Misura | CaptainStitches',
            metaDescriptionIT: 'Elegante caftano da uomo in misto cashmere con collo alla coreana.',
        },
        stats: {
            totalOrders: 41,
            averageRating: 4.7,
            reviewCount: 41,
            dateCreated: 'Oct 15, 2025',
            lastUpdated: 'Jun 01, 2026',
            popularFabrics: ['Cashmere Wool Blend'],
            popularColours: ['Emerald Green & Bronze'],
        },
        reviews: [
            {
                id: 'rev-401',
                customerName: 'Ngozi Nwosu',
                rating: 5,
                comment: 'Beautiful drape and color. Perfect for Milan summer galas.',
                date: 'Jun 02, 2026',
                status: 'APPROVED',
            },
        ],
    },
    {
        id: 'des-5',
        slug: 'double-breasted-executive-suit',
        sortOrder: 5,
        category: 'english-suit',
        categoryLabel: 'English Suits',
        isVisible: true,
        isFeatured: false,
        turnaroundDays: 21,
        pricing: {
            priceNGN: 195000,
            priceEUR: 110,
            pricingNote: '6x2 button stance with wide peaked lapels.',
        },
        photos: [
            { id: 'p-10', url: '/images/category-suits.jpg', isCover: true, caption: 'Double-Breasted Suit in Cocoa Barberis Canonico' },
            { id: 'p-11', url: '/images/design-suit.jpg', isCover: false, caption: 'Hand-sewn lapel roll' },
        ],
        fabrics: ['Vitale Barberis Canonico Super 160s', 'Worsted Wool Flannel', 'Silk-Wool Blend'],
        colours: [
            { name: 'Rich Cocoa Brown', hex: '#4A3728' },
            { name: 'Chalkstripe Navy', hex: '#1C2841' },
            { name: 'Anthracite Charcoal', hex: '#292B2E' },
        ],
        contentEN: {
            name: 'Double-Breasted Executive Suit',
            description: 'Commanding double-breasted silhouette tailored in Vitale Barberis Canonico wool with wide peak lapels and structured drape.',
            tags: ['Double Breasted', 'Executive Suit', 'Power Suit', 'Italian Tailoring'],
        },
        contentIT: {
            name: 'Abito Doppiopetto Executive',
            description: 'Abito doppiopetto dal taglio deciso con ampi rever a lancia e tessuto Vitale Barberis Canonico Super 160s.',
            tags: ['Doppiopetto', 'Abito Elegante', 'Sartoria Classica'],
        },
        seo: {
            metaTitleEN: 'Double-Breasted Executive Suit | CaptainStitches',
            metaDescriptionEN: 'Power dressing perfected. Bespoke double-breasted suit tailored in premium Italian wool.',
            metaTitleIT: 'Abito Doppiopetto Executive su Misura | CaptainStitches',
            metaDescriptionIT: 'Abito doppiopetto sartoriale in lana Vitale Barberis Canonico.',
        },
        stats: {
            totalOrders: 18,
            averageRating: 4.9,
            reviewCount: 18,
            dateCreated: 'Dec 05, 2025',
            lastUpdated: 'May 02, 2026',
            popularFabrics: ['Vitale Barberis Canonico Super 160s'],
            popularColours: ['Rich Cocoa Brown'],
        },
        reviews: [
            {
                id: 'rev-501',
                customerName: 'Gianluigi Rossi',
                rating: 5,
                comment: 'Precision cut. Feels comfortable yet powerful.',
                date: 'May 22, 2026',
                status: 'APPROVED',
            },
        ],
    },
    {
        id: 'des-6',
        slug: 'linen-summer-set',
        sortOrder: 6,
        category: 'casual',
        categoryLabel: 'Casual Wear',
        isVisible: true,
        isFeatured: false,
        turnaroundDays: 7,
        pricing: {
            priceNGN: 60000,
            priceEUR: 35,
            pricingNote: 'Includes relaxed camp-collar shirt and drawstring linen shorts/trousers.',
        },
        photos: [
            { id: 'p-12', url: '/images/category-casual.jpg', isCover: true, caption: 'Linen Summer Set in Terracotta Clay' },
        ],
        fabrics: ['100% Normandy Linen', 'Slub Cotton Linen', 'Bamboo Blend'],
        colours: [
            { name: 'Terracotta Sand', hex: '#E2725B' },
            { name: 'Off-White Ivory', hex: '#FAF9F6' },
            { name: 'Sage Green', hex: '#8A9A86' },
        ],
        contentEN: {
            name: 'Linen Summer Set',
            description: 'Effortless Mediterranean resort wear crafted from 100% Normandy linen. Breathable camp collar shirt with relaxed drawstring trousers.',
            tags: ['Linen Set', 'Resort Wear', 'Summer Casual', 'Mediterranean'],
        },
        contentIT: {
            name: 'Completo Estivo in Lino',
            description: 'Completo casual estivo in puro lino di Normandia con camicia collo cubano e pantalone morbido.',
            tags: ['Completo Lino', 'Abbigliamento Estivo', 'Casual Chic'],
        },
        seo: {
            metaTitleEN: 'Linen Summer Set — Mediterranean Casual | CaptainStitches',
            metaDescriptionEN: 'Bespoke 100% linen resort set for warm European and African summers.',
            metaTitleIT: 'Completo Estivo in Lino su Misura | CaptainStitches',
            metaDescriptionIT: 'Completo estivo uomo in puro lino traspirante.',
        },
        stats: {
            totalOrders: 15,
            averageRating: 4.6,
            reviewCount: 15,
            dateCreated: 'Jan 10, 2026',
            lastUpdated: 'Apr 18, 2026',
            popularFabrics: ['100% Normandy Linen'],
            popularColours: ['Terracotta Sand'],
        },
        reviews: [],
    },
    {
        id: 'des-7',
        slug: 'signature-embroidered-kaftan',
        sortOrder: 7,
        category: 'native-wear',
        categoryLabel: 'Native Wear',
        isVisible: true,
        isFeatured: false,
        turnaroundDays: 10,
        pricing: {
            priceNGN: 90000,
            priceEUR: 50,
            pricingNote: 'Intricate contrast chain-stitch chest embroidery.',
        },
        photos: [
            { id: 'p-13', url: '/images/category-native.jpeg', isCover: true, caption: 'Signature Embroidered Kaftan' },
        ],
        fabrics: ['Presidential Cashmere Cotton', 'Damask Brocade'],
        colours: [
            { name: 'Deep Burgundy & Gold', hex: '#58111A' },
            { name: 'Midnight Black & Silver', hex: '#1C1C1C' },
        ],
        contentEN: {
            name: 'Signature Embroidered Kaftan',
            description: 'Striking modern kaftan featuring signature chain-stitch threadwork along the chest and cuffs.',
            tags: ['Embroidered Kaftan', 'Native Style', 'Luxury African'],
        },
        contentIT: {
            name: 'Caftano Ricamato Signature',
            description: 'Caftano esclusivo con ricami a punto catenella sul petto e polsini rifiniti.',
            tags: ['Caftano Ricamato', 'Stile Afro'],
        },
        seo: {
            metaTitleEN: 'Signature Embroidered Kaftan | CaptainStitches',
            metaDescriptionEN: 'Exclusive chain-stitch embroidered Kaftan tailored to your body.',
            metaTitleIT: 'Caftano Ricamato Esclusivo | CaptainStitches',
            metaDescriptionIT: 'Caftano con ricami artistici su misura.',
        },
        stats: {
            totalOrders: 29,
            averageRating: 4.8,
            reviewCount: 29,
            dateCreated: 'Nov 18, 2025',
            lastUpdated: 'May 10, 2026',
            popularFabrics: ['Presidential Cashmere Cotton'],
            popularColours: ['Deep Burgundy & Gold'],
        },
        reviews: [],
    },
    {
        id: 'des-8',
        slug: 'mini-senator-set',
        sortOrder: 8,
        category: 'children',
        categoryLabel: "Children's",
        isVisible: false, // Draft / Hidden example
        isFeatured: false,
        turnaroundDays: 7,
        pricing: {
            priceNGN: 45000,
            priceEUR: 28,
            pricingNote: 'Child sizes from age 2 to 14 with soft cotton inner lining.',
        },
        photos: [
            { id: 'p-14', url: '/images/category-children.jpg', isCover: true, caption: 'Mini Senator Set for Boys' },
        ],
        fabrics: ['Soft Touch Cotton Linen', 'Skin-friendly Egyptian Cotton'],
        colours: [
            { name: 'Sky Blue & White', hex: '#87CEEB' },
            { name: 'Navy & Gold', hex: '#000080' },
            { name: 'Cream Ivory', hex: '#FFFDD0' },
        ],
        contentEN: {
            name: 'Mini Senator Set',
            description: 'Adorable father-and-son matching Senator set tailored from ultra-soft, hypoallergenic cotton linen.',
            tags: ["Children's Fashion", 'Father and Son', 'Mini Senator'],
        },
        contentIT: {
            name: 'Completo Mini Senator',
            description: 'Completo sartoriale elegante per bambini in morbido cotone traspirante.',
            tags: ['Moda Bambino', 'Mini Senator', 'Cerimonia Bambino'],
        },
        seo: {
            metaTitleEN: "Mini Senator Set — Children's Native Wear | CaptainStitches",
            metaDescriptionEN: 'Handcrafted mini Senator sets for kids. Hypoallergenic and comfortable for ceremonies.',
            metaTitleIT: 'Completo Mini Senator per Bambini | CaptainStitches',
            metaDescriptionIT: 'Abiti eleganti tradizionali per bambini su misura.',
        },
        stats: {
            totalOrders: 12,
            averageRating: 4.9,
            reviewCount: 12,
            dateCreated: 'Feb 01, 2026',
            lastUpdated: 'Apr 05, 2026',
            popularFabrics: ['Soft Touch Cotton Linen'],
            popularColours: ['Sky Blue & White'],
        },
        reviews: [],
    },
]

const CATALOGUE_STORAGE_KEY = 'cs_admin_catalogue_store_v1'

export function getAllDesigns(): CatalogueDesign[] {
    if (typeof window === 'undefined') return INITIAL_CATALOGUE_DESIGNS
    try {
        const stored = localStorage.getItem(CATALOGUE_STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(CATALOGUE_STORAGE_KEY, JSON.stringify(INITIAL_CATALOGUE_DESIGNS))
            return INITIAL_CATALOGUE_DESIGNS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_CATALOGUE_DESIGNS
    }
}

export function saveAllDesigns(designs: CatalogueDesign[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(CATALOGUE_STORAGE_KEY, JSON.stringify(designs))
    } catch (e) {
        console.error('Failed to persist catalogue store', e)
    }
}

export function getDesignById(idOrSlug: string): CatalogueDesign | undefined {
    const list = getAllDesigns()
    return list.find((d) => d.id === idOrSlug || d.slug === idOrSlug)
}

export function saveDesign(updatedDesign: CatalogueDesign): void {
    const list = getAllDesigns()
    const idx = list.findIndex((d) => d.id === updatedDesign.id)
    if (idx !== -1) {
        list[idx] = updatedDesign
    } else {
        list.unshift(updatedDesign)
    }
    saveAllDesigns(list)
}

export function deleteDesign(id: string): void {
    const list = getAllDesigns()
    const filtered = list.filter((d) => d.id !== id)
    saveAllDesigns(filtered)
}

export function duplicateDesign(id: string): CatalogueDesign | undefined {
    const original = getDesignById(id)
    if (!original) return undefined
    const newId = `des-${Date.now()}`
    const duplicated: CatalogueDesign = {
        ...original,
        id: newId,
        slug: `${original.slug}-copy-${Math.floor(Math.random() * 1000)}`,
        contentEN: {
            ...original.contentEN,
            name: `${original.contentEN.name} (Copy)`,
        },
        contentIT: {
            ...original.contentIT,
            name: `${original.contentIT.name} (Copia)`,
        },
        isVisible: false,
        isFeatured: false,
        stats: {
            totalOrders: 0,
            averageRating: 0,
            reviewCount: 0,
            dateCreated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            lastUpdated: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            popularFabrics: [],
            popularColours: [],
        },
        reviews: [],
    }
    saveDesign(duplicated)
    return duplicated
}
