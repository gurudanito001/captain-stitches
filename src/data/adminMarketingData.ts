export type SubscriberStatus = 'active' | 'unsubscribed' | 'bounced' | 'cleaned'
export type SubscriberLanguage = 'EN' | 'IT'
export type SubscriberLocation = 'Italy' | 'Nigeria' | 'Other'
export type SignupSource = 'homepage' | 'order_confirmation' | 'blog' | 'manual' | 'referral'

export interface MarketingSubscriber {
    id: string
    name: string
    email: string
    language: SubscriberLanguage
    location: SubscriberLocation
    signupSource: SignupSource
    dateSubscribed: string
    status: SubscriberStatus
    lastOpenedEmailDate?: string
    linkedCustomerId?: string
    openRate: number
}

export type ConditionField =
    | 'language'
    | 'location'
    | 'signup_source'
    | 'order_count'
    | 'last_order_date'
    | 'status'
    | 'referral_count'
    | 'date_joined'

export type ConditionOperator = 'is' | 'is_not' | 'greater_than' | 'less_than' | 'contains'

export interface MarketingSegmentCondition {
    id: string
    field: ConditionField
    operator: ConditionOperator
    value: string
}

export interface MarketingSegment {
    id: string
    name: string
    description: string
    subscriberCount: number
    lastUsedDate?: string
    isPrebuilt: boolean
    logic: 'AND' | 'OR'
    conditions: MarketingSegmentCondition[]
}

export type CampaignStatus = 'draft' | 'scheduled' | 'sent'
export type CampaignAudienceType = 'all' | 'en_only' | 'it_only' | 'segment'

export interface ClickMapLink {
    url: string
    label: string
    clicks: number
    uniqueClicks: number
    ctr: number
    topPercent: number
}

export interface MarketingCampaign {
    id: string
    name: string
    status: CampaignStatus
    subjectEN: string
    subjectIT: string
    previewTextEN: string
    previewTextIT: string
    fromName: string
    replyTo: string
    audienceType: CampaignAudienceType
    targetSegmentId?: string
    targetSegmentName?: string
    excludedSegmentId?: string
    excludedSegmentName?: string
    recipientCount: number
    sendDate?: string
    sendTime?: string
    scheduledDate?: string
    scheduledTime?: string
    timezone: string
    contentEN: {
        title: string
        subtitle: string
        body: string
        featuredImage?: string
        ctaText?: string
        ctaUrl?: string
    }
    contentIT: {
        title: string
        subtitle: string
        body: string
        featuredImage?: string
        ctaText?: string
        ctaUrl?: string
    }
    stats?: {
        delivered: number
        opened: number
        uniqueOpens: number
        openRate: number
        clicked: number
        uniqueClicks: number
        clickRate: number
        unsubscribes: number
        hardBounces: number
        softBounces: number
        hourlyOpens48h: Array<{ hour: number; label: string; count: number }>
        clickMapLinks: ClickMapLink[]
        deviceSplit: { mobile: number; desktop: number }
        locationSplit: { italy: number; nigeria: number; other: number }
        languageSplit: { en: number; it: number }
        unsubscribedList: Array<{ name: string; email: string; reason?: string }>
        bouncedList: Array<{ email: string; type: 'Hard Bounce' | 'Soft Bounce'; reason: string }>
    }
    lastSaved?: string
}

export interface TransactionalEmailType {
    id: string
    name: string
    description: string
    isActive: boolean
}

export interface MarketingSettings {
    platform: 'mailchimp' | 'brevo'
    isConnected: boolean
    apiKey: string
    listId: string
    fromName: string
    fromEmail: string
    replyToEmail: string
    footer: {
        businessName: string
        addressItaly: string
        addressNigeria: string
        socialInstagram: string
        socialFacebook: string
        socialWhatsApp: string
        unsubscribeText: string
    }
    brand: {
        logoUrl: string
        accentColor: string
        fontFamily: string
    }
    transactional: {
        provider: 'resend' | 'brevo'
        apiKey: string
        fromName: string
        fromEmail: string
        emailTypes: TransactionalEmailType[]
    }
    notifications: {
        notifyOnNewSubscriber: boolean
        notifyOnCampaignSent: boolean
        notifyOnHighBounceRate: boolean
        bounceThresholdPercent: number
    }
    compliance: {
        gdprConsentMode: boolean
        consentStatement: string
        dataRetentionMonths: number
    }
}

// STORAGE KEYS
const STORAGE_KEY_SUBSCRIBERS = 'cs_marketing_subscribers_v1'
const STORAGE_KEY_SEGMENTS = 'cs_marketing_segments_v1'
const STORAGE_KEY_CAMPAIGNS = 'cs_marketing_campaigns_v1'
const STORAGE_KEY_SETTINGS = 'cs_marketing_settings_v1'

// SEED SUBSCRIBERS
export const INITIAL_SUBSCRIBERS: MarketingSubscriber[] = [
    {
        id: 'sub-1',
        name: 'Marco Rossi',
        email: 'marco.rossi@verona-design.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'homepage',
        dateSubscribed: 'Feb 14, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Sep 02, 2026',
        linkedCustomerId: 'cust-1',
        openRate: 88,
    },
    {
        id: 'sub-2',
        name: 'Chinedu Okafor',
        email: 'chinedu.okafor@lagos-capital.ng',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'order_confirmation',
        dateSubscribed: 'Jan 10, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Sep 04, 2026',
        linkedCustomerId: 'cust-2',
        openRate: 94,
    },
    {
        id: 'sub-3',
        name: 'Matteo Bianchi',
        email: 'matteo.bianchi@milano-moda.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'blog',
        dateSubscribed: 'Mar 19, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Aug 28, 2026',
        linkedCustomerId: 'cust-3',
        openRate: 72,
    },
    {
        id: 'sub-4',
        name: 'Amina Bello',
        email: 'amina.bello@abuja-luxury.com',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'referral',
        dateSubscribed: 'Apr 02, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Sep 05, 2026',
        linkedCustomerId: 'cust-4',
        openRate: 85,
    },
    {
        id: 'sub-5',
        name: 'Emeka Nwosu',
        email: 'emeka.nwosu@aba-trade.ng',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'order_confirmation',
        dateSubscribed: 'Dec 12, 2025',
        status: 'active',
        lastOpenedEmailDate: 'Aug 15, 2026',
        linkedCustomerId: 'cust-5',
        openRate: 64,
    },
    {
        id: 'sub-6',
        name: 'Sofia Esposito',
        email: 'sofia.esposito@roma-atelier.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'homepage',
        dateSubscribed: 'May 08, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Sep 01, 2026',
        linkedCustomerId: 'cust-6',
        openRate: 81,
    },
    {
        id: 'sub-7',
        name: 'David Sterling',
        email: 'david.sterling@mayfair-london.co.uk',
        language: 'EN',
        location: 'Other',
        signupSource: 'manual',
        dateSubscribed: 'Jun 22, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Aug 30, 2026',
        openRate: 59,
    },
    {
        id: 'sub-8',
        name: 'Gianluca Conti',
        email: 'gianluca.conti@torino-textile.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'blog',
        dateSubscribed: 'Jul 11, 2026',
        status: 'unsubscribed',
        lastOpenedEmailDate: 'Jul 24, 2026',
        openRate: 25,
    },
    {
        id: 'sub-9',
        name: 'Tunde Adeleke',
        email: 'tunde.adeleke@invalid-domain-bounce.ng',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'manual',
        dateSubscribed: 'Aug 04, 2026',
        status: 'bounced',
        openRate: 0,
    },
    {
        id: 'sub-10',
        name: 'Leonardo Ricci',
        email: 'leonardo.ricci@venezia-gala.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'homepage',
        dateSubscribed: 'Aug 18, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Sep 03, 2026',
        openRate: 90,
    },
    {
        id: 'sub-11',
        name: 'Ngozi Eze',
        email: 'ngozi.eze@enugu-heritage.ng',
        language: 'EN',
        location: 'Nigeria',
        signupSource: 'order_confirmation',
        dateSubscribed: 'Aug 29, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Sep 06, 2026',
        openRate: 100,
    },
    {
        id: 'sub-12',
        name: 'Andrea Moretti',
        email: 'andrea.moretti@bologna-sartoria.it',
        language: 'IT',
        location: 'Italy',
        signupSource: 'homepage',
        dateSubscribed: 'Jul 03, 2026',
        status: 'active',
        lastOpenedEmailDate: 'Aug 22, 2026',
        openRate: 67,
    },
]

// SEED SEGMENTS
export const INITIAL_SEGMENTS: MarketingSegment[] = [
    {
        id: 'seg-1',
        name: 'All Active Subscribers',
        description: 'Every verified active subscriber on the atelier mailing list across both Italy and Nigeria.',
        subscriberCount: 10,
        lastUsedDate: 'Sep 01, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [{ id: 'c1', field: 'status', operator: 'is', value: 'active' }],
    },
    {
        id: 'seg-2',
        name: 'English Language Subscribers',
        description: 'Subscribers who prefer English communications and British-tailored dispatch updates.',
        subscriberCount: 5,
        lastUsedDate: 'Aug 20, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [
            { id: 'c1', field: 'status', operator: 'is', value: 'active' },
            { id: 'c2', field: 'language', operator: 'is', value: 'EN' },
        ],
    },
    {
        id: 'seg-3',
        name: 'Italian Language Subscribers',
        description: 'Patrons in Verona, Milan, and Rome receiving editorial content in Italian.',
        subscriberCount: 5,
        lastUsedDate: 'Sep 01, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [
            { id: 'c1', field: 'status', operator: 'is', value: 'active' },
            { id: 'c2', field: 'language', operator: 'is', value: 'IT' },
        ],
    },
    {
        id: 'seg-4',
        name: 'Italy-Based Customers',
        description: 'European clients eligible for direct Verona courier and Mediterranean tailoring drops.',
        subscriberCount: 5,
        lastUsedDate: 'Aug 14, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [
            { id: 'c1', field: 'status', operator: 'is', value: 'active' },
            { id: 'c2', field: 'location', operator: 'is', value: 'Italy' },
        ],
    },
    {
        id: 'seg-5',
        name: 'Nigeria-Based Customers',
        description: 'Domestic patrons with direct workshop fittings in Aba and Lagos delivery lines.',
        subscriberCount: 4,
        lastUsedDate: 'Aug 28, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [
            { id: 'c1', field: 'status', operator: 'is', value: 'active' },
            { id: 'c2', field: 'location', operator: 'is', value: 'Nigeria' },
        ],
    },
    {
        id: 'seg-6',
        name: 'Prospects (Subscribed, Never Ordered)',
        description: 'Mailing list members who have not yet settled a 50% bespoke deposit.',
        subscriberCount: 3,
        lastUsedDate: 'Jul 30, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [
            { id: 'c1', field: 'status', operator: 'is', value: 'active' },
            { id: 'c2', field: 'order_count', operator: 'is', value: '0' },
        ],
    },
    {
        id: 'seg-7',
        name: 'Repeat Patrons (2+ Bespoke Orders)',
        description: 'VIP clients who have commissioned 2 or more bespoke garments from CaptainStitches.',
        subscriberCount: 4,
        lastUsedDate: 'Aug 05, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [
            { id: 'c1', field: 'status', operator: 'is', value: 'active' },
            { id: 'c2', field: 'order_count', operator: 'greater_than', value: '1' },
        ],
    },
    {
        id: 'seg-8',
        name: 'Ambassadors With Pending Rewards',
        description: 'Clients with unredeemed referral reward credits awaiting deduction on next order.',
        subscriberCount: 3,
        lastUsedDate: 'Jun 18, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [
            { id: 'c1', field: 'status', operator: 'is', value: 'active' },
            { id: 'c2', field: 'referral_count', operator: 'greater_than', value: '0' },
        ],
    },
    {
        id: 'seg-9',
        name: 'Newcomers (Joined Last 30 Days)',
        description: 'Recent subscribers welcoming them to our atelier heritage with welcome series.',
        subscriberCount: 2,
        lastUsedDate: 'Sep 04, 2026',
        isPrebuilt: true,
        logic: 'AND',
        conditions: [{ id: 'c1', field: 'date_joined', operator: 'greater_than', value: '30' }],
    },
]

// SEED CAMPAIGNS
export const INITIAL_CAMPAIGNS: MarketingCampaign[] = [
    {
        id: 'camp-1',
        name: 'Mediterranean Summer Capsule 2026',
        status: 'sent',
        subjectEN: 'Announcing the Mediterranean Summer Linen Capsule ☀️',
        subjectIT: 'Presentazione della Capsule Estiva in Lino Mediterraneo ☀️',
        previewTextEN: 'Discover 8 breathable linen silhouettes crafted in Aba, delivered directly to Europe.',
        previewTextIT: 'Scopri 8 silhouette in lino traspirante confezionate ad Aba, consegnate in tutta Europa.',
        fromName: 'Samuelson at CaptainStitches',
        replyTo: 'samuelson@captainstitches.com',
        audienceType: 'all',
        targetSegmentName: 'All Active Subscribers',
        recipientCount: 148,
        sendDate: 'Sep 01, 2026',
        sendTime: '10:30 AM CET',
        timezone: 'Europe/Rome (CET)',
        contentEN: {
            title: 'Refined Summer Bespoke: Where Italian Elegance Meets Nigerian Craft',
            subtitle: 'Breathable European linens cut with Nigerian regal silhouettes.',
            body: `Dear Patron,\n\nAs the Mediterranean summer reaches its warmest peak, our atelier is proud to present an exclusive collection of unlined linen safari jackets, fluid senator suits, and breezy pleated trousers.\n\nEach garment is individually cut from Irish and Italian flax linens in Aba, rigorously inspected in our Verona studio, and hand-finished with horn buttons.\n\nCommission your tailored piece this week and enjoy direct door-to-door courier transit within 7 to 10 working days.`,
            featuredImage:
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Explore the Capsule Collection →',
            ctaUrl: 'https://captainstitches.com/catalogue',
        },
        contentIT: {
            title: 'Eleganza Estiva su Misura: L’Atelier Tra Verona e la Nigeria',
            subtitle: 'Lini europei traspiranti con il taglio maestoso dei grandi sarti nigeriani.',
            body: `Gentile Cliente,\n\nNel cuore della stagione estiva, il nostro atelier presenta una collezione speciale di giacche sahariane sfoderate in puro lino, completi Senator fluidi e pantaloni con pinces.\n\nOgni capo è tagliato individualmente ad Aba con lini irlandesi e italiani, ispezionato a mano nel nostro studio di Verona e rifinito con bottoni in corno naturale.\n\nOrdina il tuo capo su misura questa settimana con consegna rapida garantita a domicilio.`,
            featuredImage:
                'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Scopri la Collezione Capsule →',
            ctaUrl: 'https://captainstitches.com/catalogue',
        },
        stats: {
            delivered: 146,
            opened: 94,
            uniqueOpens: 88,
            openRate: 60.3,
            clicked: 42,
            uniqueClicks: 38,
            clickRate: 26.0,
            unsubscribes: 1,
            hardBounces: 2,
            softBounces: 0,
            hourlyOpens48h: [
                { hour: 1, label: '10:00', count: 18 },
                { hour: 2, label: '11:00', count: 32 },
                { hour: 3, label: '12:00', count: 14 },
                { hour: 4, label: '13:00', count: 9 },
                { hour: 6, label: '15:00', count: 7 },
                { hour: 8, label: '17:00', count: 5 },
                { hour: 12, label: '21:00', count: 6 },
                { hour: 24, label: '+24h', count: 3 },
            ],
            clickMapLinks: [
                {
                    url: 'https://captainstitches.com/catalogue',
                    label: 'Explore the Capsule Collection Button',
                    clicks: 28,
                    uniqueClicks: 26,
                    ctr: 17.8,
                    topPercent: 55,
                },
                {
                    url: 'https://captainstitches.com/blog/linen-tailoring-guide',
                    label: 'Read Linen Care & Tailoring Guide',
                    clicks: 10,
                    uniqueClicks: 9,
                    ctr: 6.2,
                    topPercent: 42,
                },
                {
                    url: 'https://wa.me/393471234567',
                    label: 'Book WhatsApp Bespoke Fitting',
                    clicks: 4,
                    uniqueClicks: 3,
                    ctr: 2.1,
                    topPercent: 78,
                },
            ],
            deviceSplit: { mobile: 68, desktop: 32 },
            locationSplit: { italy: 58, nigeria: 34, other: 8 },
            languageSplit: { en: 45, it: 55 },
            unsubscribedList: [
                { name: 'Gianluca Conti', email: 'gianluca.conti@torino-textile.it', reason: 'No longer buying bespoke suits this year' },
            ],
            bouncedList: [
                { email: 'tunde.adeleke@invalid-domain-bounce.ng', type: 'Hard Bounce', reason: '550 Mailbox does not exist' },
                { email: 'bad-email@temp-sample.it', type: 'Hard Bounce', reason: 'Host unreachable / DNS failure' },
            ],
        },
        lastSaved: 'Sep 01, 2026 · 10:30 AM',
    },
    {
        id: 'camp-2',
        name: 'The Art of the Agbada: Masterclass & Lookbook',
        status: 'sent',
        subjectEN: 'Mastering the Grand Agbada: Heritage in Modern Form',
        subjectIT: 'L’Arte del Gran Agbada: Tradizione Nigeriana in Chiave Moderna',
        previewTextEN: 'How three-piece regal tailoring is conquering international galas.',
        previewTextIT: 'Come la sartoria a tre pezzi sta conquistando i gala internazionali.',
        fromName: 'CaptainStitches Atelier',
        replyTo: 'orders@captainstitches.com',
        audienceType: 'all',
        targetSegmentName: 'All Active Subscribers',
        recipientCount: 140,
        sendDate: 'Aug 15, 2026',
        sendTime: '02:15 PM CET',
        timezone: 'Europe/Rome (CET)',
        contentEN: {
            title: 'Regal Majesty: Three Pieces of Pure Ceremonial Presence',
            subtitle: 'Embroidered silk damask engineered for comfortable movement.',
            body: `Every grand occasion demands a silhouette that announces distinction before words are spoken.\n\nOur latest journal exploration breaks down the intricate embroidery motifs hand-stitched by our Aba masters, and how our lightweight Italian lining techniques ensure the robe falls with graceful poise without overheating.\n\nExplore our bespoke ceremonial collection and secure your wedding or gala commission with a 50% deposit.`,
            featuredImage:
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Commission Your Agbada →',
            ctaUrl: 'https://captainstitches.com/catalogue?category=agbada',
        },
        contentIT: {
            title: 'Maestosità Cerimoniale: Il Capo Supremo della Tradizione Nigeriana',
            subtitle: 'Damaschi e ricami preziosi con la comodità sartoriale moderna.',
            body: `Per le grandi occasioni e cerimonie, il grand agbada a tre pezzi rappresenta il vertice della distinzione.\n\nIn questa newsletter approfondiamo i dettagli del nostro ricamo a mano realizzato dai maestri sarti di Aba e il segreto della fodera leggera italiana che garantisce freschezza ed eleganza.\n\nScopri la selezione da cerimonia e prenota il tuo capo unico.`,
            featuredImage:
                'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Commissiona il Tuo Agbada →',
            ctaUrl: 'https://captainstitches.com/catalogue?category=agbada',
        },
        stats: {
            delivered: 139,
            opened: 81,
            uniqueOpens: 76,
            openRate: 54.7,
            clicked: 31,
            uniqueClicks: 28,
            clickRate: 20.1,
            unsubscribes: 0,
            hardBounces: 1,
            softBounces: 0,
            hourlyOpens48h: [
                { hour: 1, label: '14:00', count: 24 },
                { hour: 2, label: '15:00', count: 22 },
                { hour: 4, label: '17:00', count: 12 },
                { hour: 8, label: '21:00', count: 8 },
                { hour: 24, label: '+24h', count: 10 },
            ],
            clickMapLinks: [
                {
                    url: 'https://captainstitches.com/catalogue?category=agbada',
                    label: 'Commission Your Agbada Button',
                    clicks: 22,
                    uniqueClicks: 20,
                    ctr: 14.4,
                    topPercent: 60,
                },
                {
                    url: 'https://captainstitches.com/blog/agbada-styling',
                    label: 'Read Agbada Style Guide',
                    clicks: 9,
                    uniqueClicks: 8,
                    ctr: 5.7,
                    topPercent: 38,
                },
            ],
            deviceSplit: { mobile: 72, desktop: 28 },
            locationSplit: { italy: 42, nigeria: 48, other: 10 },
            languageSplit: { en: 60, it: 40 },
            unsubscribedList: [],
            bouncedList: [
                { email: 'stale-address@olddomain.com', type: 'Hard Bounce', reason: 'User not found' },
            ],
        },
        lastSaved: 'Aug 15, 2026 · 02:15 PM',
    },
    {
        id: 'camp-3',
        name: 'Autumn Cashmere Kaftan Preview (Early Access)',
        status: 'scheduled',
        subjectEN: 'Private Preview: Autumn Double-Faced Cashmere Kaftans',
        subjectIT: 'Anteprima Riservata: Kaftani Autunnali in Cashmere Double-Face',
        previewTextEN: 'Exclusive 48-hour commission window for atelier subscribers.',
        previewTextIT: 'Accesso prioritario di 48 ore per i clienti iscritti al club sartoriale.',
        fromName: 'Samuelson at CaptainStitches',
        replyTo: 'samuelson@captainstitches.com',
        audienceType: 'segment',
        targetSegmentId: 'seg-7',
        targetSegmentName: 'Repeat Patrons (2+ Bespoke Orders)',
        recipientCount: 36,
        scheduledDate: '2026-09-18',
        scheduledTime: '09:00',
        timezone: 'Europe/Rome (CET)',
        contentEN: {
            title: 'Quiet Luxury in Pure Cashmere & Raw Silk',
            subtitle: 'Hand-loomed in Aba with Loro Piana Italian cashmere yarns.',
            body: `Dear VIP Patron,\n\nBefore we present our upcoming Autumn capsule to the public catalogue, you are invited to reserve one of only 25 hand-numbered cashmere kaftans.\n\nFeaturing subtle geometric cuffs and hand-molded bronze aglets, this piece marries warmth with Savile Row draping.\n\nUse your VIP priority reservation link below to select your color palette and confirm your measurements.`,
            featuredImage:
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Access VIP Reservation Window →',
            ctaUrl: 'https://captainstitches.com/order?capsule=autumn-cashmere',
        },
        contentIT: {
            title: 'Lusso Discreto in Cashmere Puro e Seta Grezza',
            subtitle: 'Tessuto a mano ad Aba con filati di cashmere italiano Loro Piana.',
            body: `Gentile Cliente VIP,\n\nPrima del lancio ufficiale sul catalogo pubblico, ti invitiamo a prenotare uno dei soli 25 kaftani in cashmere numerati a mano per questa stagione.\n\nCaratterizzato da polsini con motivi geometrici discreti e fermagli in bronzo forgiati a mano, unisce il calore all’eleganza fluida della sartoria su misura.\n\nAccedi alla prevendita riservata per scegliere la tua palette e confermare le tue misure.`,
            featuredImage:
                'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Accedi alla Prevendita Riservata →',
            ctaUrl: 'https://captainstitches.com/order?capsule=autumn-cashmere',
        },
        lastSaved: 'Sep 06, 2026 · 04:45 PM',
    },
    {
        id: 'camp-4',
        name: 'The Verona Fitting Tour Announcement (Draft)',
        status: 'draft',
        subjectEN: 'Private Trunk Show: Bespoke Fittings in Verona & Milan',
        subjectIT: 'Trunk Show Privato: Misure dal Vivo a Verona e Milano',
        previewTextEN: 'Meet Master Tailor Samuelson in Italy for hands-on fabric curation.',
        previewTextIT: 'Incontra il sarto Samuelson in Italia per scegliere i tessuti e prendere le misure.',
        fromName: 'Samuelson at CaptainStitches',
        replyTo: 'fittings@captainstitches.com',
        audienceType: 'segment',
        targetSegmentId: 'seg-4',
        targetSegmentName: 'Italy-Based Customers',
        recipientCount: 52,
        timezone: 'Europe/Rome (CET)',
        contentEN: {
            title: 'Personal Bespoke Consultations in Northern Italy',
            subtitle: 'Touch the raw silks, inspect the Aso-Oke weaves, and record your master profile.',
            body: `We are delighted to announce our October European Trunk Show.\n\nMaster Tailor Samuelson will be hosting private 45-minute appointments at our Verona studio and a selected Milan hotel salon.\n\nSlots are limited to ensure comprehensive consultation for wedding ensembles and winter bespoke commissions.`,
            featuredImage:
                'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Reserve Your Private Fitting Slot →',
            ctaUrl: 'https://captainstitches.com/contact?booking=verona-tour',
        },
        contentIT: {
            title: 'Consulenze Sartoriali Private nel Nord Italia',
            subtitle: 'Tocca con mano le sete grezze, i tessuti Aso-Oke e definisci il tuo profilo di misure.',
            body: `Siamo felici di annunciare il nostro Trunk Show di ottobre in Italia.\n\nIl Maestro Sarto Samuelson riceverà su appuntamento privato di 45 minuti presso il nostro studio di Verona e in una suite riservata a Milano.\n\nI posti sono strettamente limitati per dedicare la massima attenzione a ciascun cliente.`,
            featuredImage:
                'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=1200',
            ctaText: 'Prenota il Tuo Appuntamento Privato →',
            ctaUrl: 'https://captainstitches.com/contact?booking=verona-tour',
        },
        lastSaved: 'Sep 07, 2026 · 07:15 AM',
    },
]

// INITIAL SETTINGS
export const INITIAL_MARKETING_SETTINGS: MarketingSettings = {
    platform: 'mailchimp',
    isConnected: true,
    apiKey: 'cs_live_mc_9847192847291847291038572910',
    listId: 'mc_aud_7749102',
    fromName: 'Samuelson at CaptainStitches',
    fromEmail: 'samuelson@captainstitches.com',
    replyToEmail: 'orders@captainstitches.com',
    footer: {
        businessName: 'CaptainStitches Sartoria & Atelier',
        addressItaly: 'Via Roma 42, 37121 Verona (VR), Italy',
        addressNigeria: '18 Faulkner Road, Aba, Abia State / Victoria Island, Lagos, Nigeria',
        socialInstagram: 'https://instagram.com/captainstitches',
        socialFacebook: 'https://facebook.com/captainstitches',
        socialWhatsApp: 'https://wa.me/393471234567',
        unsubscribeText: 'You received this email because you commissioned a garment or subscribed at captainstitches.com.',
    },
    brand: {
        logoUrl: '/logo.png',
        accentColor: '#C4975A',
        fontFamily: 'serif',
    },
    transactional: {
        provider: 'resend',
        apiKey: 're_live_99482710492817492810',
        fromName: 'CaptainStitches Atelier Notifications',
        fromEmail: 'notifications@captainstitches.com',
        emailTypes: [
            { id: 'tx-1', name: 'Order Confirmation', description: 'Triggered when 50% deposit is paid', isActive: true },
            { id: 'tx-2', name: 'Order Status Update', description: 'Triggered upon stage progression', isActive: true },
            { id: 'tx-3', name: 'Inspection Ready Notification', description: 'Sends high-res photos for approval', isActive: true },
            { id: 'tx-4', name: 'Delivery Confirmation', description: 'Sent with tracking URL upon dispatch', isActive: true },
            { id: 'tx-5', name: 'Review Request', description: 'Automated 5 days post-delivery', isActive: true },
            { id: 'tx-6', name: 'Referral Reward Credited', description: 'Sent when referred friend places order', isActive: true },
            { id: 'tx-7', name: 'Referral Expiry Warning', description: 'Warning 14 days before credit lapse', isActive: true },
            { id: 'tx-8', name: 'Balance Payment Request', description: 'Sent after inspection approval', isActive: true },
            { id: 'tx-9', name: 'Welcome Email', description: 'Sent to first-time bespoke clients', isActive: true },
        ],
    },
    notifications: {
        notifyOnNewSubscriber: true,
        notifyOnCampaignSent: true,
        notifyOnHighBounceRate: true,
        bounceThresholdPercent: 5.0,
    },
    compliance: {
        gdprConsentMode: true,
        consentStatement:
            'By subscribing, you agree to receive editorial newsletters, bespoke previews, and seasonal invitations from CaptainStitches. You may withdraw consent at any time via the one-click unsubscribe link.',
        dataRetentionMonths: 12,
    },
}

// ==========================================
// STORAGE & CRUD HELPERS
// ==========================================

export function getAllSubscribers(): MarketingSubscriber[] {
    if (typeof window === 'undefined') return INITIAL_SUBSCRIBERS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SUBSCRIBERS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(INITIAL_SUBSCRIBERS))
            return INITIAL_SUBSCRIBERS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_SUBSCRIBERS
    }
}

export function saveAllSubscribers(subs: MarketingSubscriber[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_SUBSCRIBERS, JSON.stringify(subs))
    } catch (e) {
        console.error('Failed to save subscribers to localStorage', e)
    }
}

export function saveSubscriber(sub: MarketingSubscriber): MarketingSubscriber[] {
    const list = getAllSubscribers()
    const index = list.findIndex((s) => s.id === sub.id)
    let updated: MarketingSubscriber[]
    if (index >= 0) {
        updated = [...list]
        updated[index] = sub
    } else {
        updated = [sub, ...list]
    }
    saveAllSubscribers(updated)
    return updated
}

export function deleteSubscribers(ids: string[]): MarketingSubscriber[] {
    const list = getAllSubscribers()
    const idSet = new Set(ids)
    const updated = list.filter((s) => !idSet.has(s.id))
    saveAllSubscribers(updated)
    return updated
}

export function bulkUpdateSubscriberStatus(ids: string[], newStatus: SubscriberStatus): MarketingSubscriber[] {
    const list = getAllSubscribers()
    const idSet = new Set(ids)
    const updated = list.map((s) => (idSet.has(s.id) ? { ...s, status: newStatus } : s))
    saveAllSubscribers(updated)
    return updated
}

// SEGMENTS CRUD
export function getAllSegments(): MarketingSegment[] {
    if (typeof window === 'undefined') return INITIAL_SEGMENTS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SEGMENTS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(INITIAL_SEGMENTS))
            return INITIAL_SEGMENTS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_SEGMENTS
    }
}

export function saveAllSegments(segments: MarketingSegment[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_SEGMENTS, JSON.stringify(segments))
    } catch (e) {
        console.error('Failed to save segments to localStorage', e)
    }
}

export function saveSegment(segment: MarketingSegment): MarketingSegment[] {
    const list = getAllSegments()
    const index = list.findIndex((s) => s.id === segment.id)
    let updated: MarketingSegment[]
    if (index >= 0) {
        updated = [...list]
        updated[index] = segment
    } else {
        updated = [...list, segment]
    }
    saveAllSegments(updated)
    return updated
}

export function deleteSegment(id: string): MarketingSegment[] {
    const list = getAllSegments()
    const updated = list.filter((s) => s.id !== id)
    saveAllSegments(updated)
    return updated
}

// CAMPAIGNS CRUD
export function getAllCampaigns(): MarketingCampaign[] {
    if (typeof window === 'undefined') return INITIAL_CAMPAIGNS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CAMPAIGNS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(INITIAL_CAMPAIGNS))
            return INITIAL_CAMPAIGNS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_CAMPAIGNS
    }
}

export function saveAllCampaigns(campaigns: MarketingCampaign[]): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_CAMPAIGNS, JSON.stringify(campaigns))
    } catch (e) {
        console.error('Failed to save campaigns to localStorage', e)
    }
}

export function getCampaignById(id: string): MarketingCampaign | undefined {
    const list = getAllCampaigns()
    return list.find((c) => c.id === id)
}

export function saveCampaign(campaign: MarketingCampaign): MarketingCampaign[] {
    const list = getAllCampaigns()
    const now = new Date()
    const timeStr = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`

    const withTimestamp = {
        ...campaign,
        lastSaved: timeStr,
    }

    const index = list.findIndex((c) => c.id === campaign.id)
    let updated: MarketingCampaign[]
    if (index >= 0) {
        updated = [...list]
        updated[index] = withTimestamp
    } else {
        updated = [withTimestamp, ...list]
    }
    saveAllCampaigns(updated)
    return updated
}

export function deleteCampaign(id: string): MarketingCampaign[] {
    const list = getAllCampaigns()
    const updated = list.filter((c) => c.id !== id)
    saveAllCampaigns(updated)
    return updated
}

export function duplicateCampaign(id: string): MarketingCampaign | null {
    const list = getAllCampaigns()
    const target = list.find((c) => c.id === id)
    if (!target) return null

    const newId = `camp-${Date.now()}`
    const duplicated: MarketingCampaign = {
        ...target,
        id: newId,
        name: `${target.name} (Copy)`,
        status: 'draft',
        sendDate: undefined,
        sendTime: undefined,
        scheduledDate: undefined,
        scheduledTime: undefined,
        stats: undefined,
        lastSaved: 'Just duplicated',
    }

    const updated = [duplicated, ...list]
    saveAllCampaigns(updated)
    return duplicated
}

// SETTINGS
export function getMarketingSettings(): MarketingSettings {
    if (typeof window === 'undefined') return INITIAL_MARKETING_SETTINGS
    try {
        const stored = localStorage.getItem(STORAGE_KEY_SETTINGS)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(INITIAL_MARKETING_SETTINGS))
            return INITIAL_MARKETING_SETTINGS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_MARKETING_SETTINGS
    }
}

export function saveMarketingSettings(settings: MarketingSettings): void {
    if (typeof window === 'undefined') return
    try {
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings))
    } catch (e) {
        console.error('Failed to save marketing settings to localStorage', e)
    }
}

// OVERVIEW STATS HELPER
export function getMarketingOverviewStats(subscribers = getAllSubscribers(), campaigns = getAllCampaigns()) {
    const activeSubscribers = subscribers.filter((s) => s.status === 'active').length
    const unsubscribedCount = subscribers.filter((s) => s.status === 'unsubscribed').length
    const bouncedCount = subscribers.filter((s) => s.status === 'bounced').length

    // Growth simulation (month of September)
    const newThisMonth = 4
    const unsubscribesThisMonth = 1
    const netGrowth = newThisMonth - unsubscribesThisMonth

    // Campaign averages
    const sentCampaigns = campaigns.filter((c) => c.status === 'sent' && c.stats)
    let totalOpenRate = 0
    let totalClickRate = 0
    let bestCampaign = { name: 'None', subject: 'None', openRate: 0 }

    if (sentCampaigns.length > 0) {
        sentCampaigns.forEach((c) => {
            if (c.stats) {
                totalOpenRate += c.stats.openRate
                totalClickRate += c.stats.clickRate
                if (c.stats.openRate > bestCampaign.openRate) {
                    bestCampaign = {
                        name: c.name,
                        subject: c.subjectEN,
                        openRate: c.stats.openRate,
                    }
                }
            }
        })
        totalOpenRate = parseFloat((totalOpenRate / sentCampaigns.length).toFixed(1))
        totalClickRate = parseFloat((totalClickRate / sentCampaigns.length).toFixed(1))
    }

    // Sources breakdown
    const sourceCounts: Record<SignupSource, number> = {
        homepage: 0,
        order_confirmation: 0,
        blog: 0,
        manual: 0,
        referral: 0,
    }

    subscribers.forEach((s) => {
        if (sourceCounts[s.signupSource] !== undefined) {
            sourceCounts[s.signupSource]++
        }
    })

    return {
        activeSubscribers,
        unsubscribedCount,
        bouncedCount,
        newThisMonth,
        unsubscribesThisMonth,
        netGrowth,
        avgOpenRate: totalOpenRate,
        avgClickRate: totalClickRate,
        bestCampaign,
        sourceCounts,
    }
}
