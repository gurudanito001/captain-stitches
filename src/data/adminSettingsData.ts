// CaptainStitches Studio Admin Settings Data Layer & Persistence

export interface ProductionTurnaroundDays {
    nativeWear: number
    englishSuits: number
    casualWear: number
    childrenClothing: number
}

export interface BrandSettings {
    businessName: string
    tagline: string
    logoUrl: string
    brandColor: string
    businessEmail: string
    whatsappNumber: string
    instagramHandle: string
    facebookUrl: string
}

export interface LocationDetail {
    isActive: boolean
    address: string
    city: string
    postcodeOrState: string
    country: string
}

export interface BusinessSettingsState {
    brand: BrandSettings
    locations: {
        verona: LocationDetail
        lagos: LocationDetail
    }
    production: {
        turnaroundDays: ProductionTurnaroundDays
        bufferDays: number
    }
    orderDefaults: {
        depositPercentage: number
        confirmationTemplate: string
        deliveryTemplate: string
    }
    contact: {
        responseTimePromise: string
        whatsappHours: string
        prefilledMessage: string
    }
}

export interface GatewayConfig {
    isConnected: boolean
    publicKey: string
    secretKey: string
    webhookUrl: string
    testMode: boolean
}

export interface PaymentSettingsState {
    paystack: GatewayConfig
    stripe: GatewayConfig
    currency: {
        activeCurrencies: ('NGN' | 'EUR')[]
        exchangeRateMode: 'manual' | 'live'
        manualRate: number
        liveRateSource: string
        lastFetched: string
        manualOverride: boolean
        lastUpdated: string
    }
    depositAndBalance: {
        depositPercentage: number
        balanceTrigger: 'before_dispatch' | 'on_delivery'
        linkExpiryDays: number
        autoSendBalanceRequest: boolean
    }
    notifications: {
        notifyDeposit: boolean
        notifyBalance: boolean
        notifyFailed: boolean
        sendReceipt: boolean
    }
}

export interface NotificationChannelToggle {
    whatsapp: boolean
    email: boolean
    thresholdDays?: number
    delayDays?: number
    daysBefore?: number
}

export interface NotificationTemplate {
    id: string
    title: string
    category: 'customer' | 'tailor' | 'admin'
    enText: string
    itText: string
    placeholders: string[]
}

export interface NotificationSettingsState {
    samuelson: {
        newOrder: NotificationChannelToggle
        depositReceived: NotificationChannelToggle
        orderOverdue: NotificationChannelToggle
        tailorInspectionReady: NotificationChannelToggle
        newReview: NotificationChannelToggle
        referralConverts: NotificationChannelToggle
        newSubscriber: NotificationChannelToggle
        balanceReceived: NotificationChannelToggle
        paymentFailed: NotificationChannelToggle
    }
    tailor: {
        newOrderAssigned: NotificationChannelToggle
        deadlineApproaching: NotificationChannelToggle
        orderDetailsUpdated: NotificationChannelToggle
    }
    customer: {
        orderConfirmation: NotificationChannelToggle
        statusConfirmed: NotificationChannelToggle
        statusInProduction: NotificationChannelToggle
        statusInspection: NotificationChannelToggle
        statusApproved: NotificationChannelToggle
        statusDispatched: NotificationChannelToggle
        statusDelivered: NotificationChannelToggle
        balanceRequest: NotificationChannelToggle
        reviewRequest: NotificationChannelToggle
        referralRewardCredited: NotificationChannelToggle
        rewardExpiryWarning: NotificationChannelToggle
        welcomeMessage: NotificationChannelToggle
    }
    templates: NotificationTemplate[]
    whatsappApi: {
        status: 'Connected' | 'Disconnected' | 'Rate Limited'
        accountSid: string
        authToken: string
        dailyLimit: number
        usedToday: number
    }
}

export interface LanguageAndCurrencySettingsState {
    languages: {
        englishActive: boolean
        italianActive: boolean
        defaultLanguage: 'EN' | 'IT'
        autoDetectBrowserLanguage: boolean
    }
    translationCompleteness: {
        overallPercentage: number
        catalogue: { translated: number; total: number }
        blog: { translated: number; total: number }
        emailTemplates: { translated: number; total: number }
    }
    currencies: {
        ngnActive: boolean
        eurActive: boolean
        defaultCurrency: 'EUR' | 'NGN'
        autoDetectGeoCurrency: boolean
    }
    displayFormat: {
        symbolPosition: 'before' | 'after'
        decimalPlaces: 0 | 2
        thousandsSeparator: 'comma' | 'period'
    }
}

export interface AdminUser {
    id: string
    name: string
    email: string
    role: 'Admin' | 'Tailor'
    status: 'Active' | 'Inactive'
    lastLogin: string
    avatarInitials: string
    avatarColor: string
    assignedOrdersCount?: number
}

export interface LoginHistoryItem {
    id: string
    userName: string
    email: string
    timestamp: string
    ipAddress: string
    device: string
    location: string
    isUnusual: boolean
}

export interface AccessControlSettingsState {
    users: AdminUser[]
    session: {
        timeoutMinutes: number
        rememberMeDays: number
    }
    loginHistory: LoginHistoryItem[]
}

export interface SubscriptionTier {
    id: string
    nameEN: string
    nameIT: string
    priceNGN: number
    priceEUR: number
    billingInterval: 'monthly' | 'quarterly' | 'annually'
    features: string[]
    activeSubscribers: number
    isVisible: boolean
    paystackPlanId: string
    stripePriceId: string
}

export interface SubscriptionSettingsState {
    enabled: boolean
    tiers: SubscriptionTier[]
    defaults: {
        defaultTierId: string
        trialDays: number
        cancellationPolicy: 'end_of_period' | 'immediate'
    }
}

export interface IntegrationCard {
    id: string
    name: string
    category: string
    description: string
    status: 'connected' | 'disconnected' | 'warning'
    lastSync: string
    configRoute: string
}

export interface CloudinarySettings {
    provider: 'cloudinary' | 's3'
    cloudName: string
    apiKey: string
    apiSecret: string
    defaultFolder: string
    storageUsedGb: number
    storageLimitGb: number
}

export interface IntegrationsSettingsState {
    integrations: IntegrationCard[]
    mediaStorage: CloudinarySettings
}

export interface DangerZoneSettingsState {
    lastBackupTimestamp: string
    factoryResetPending: boolean
    safetyLockoutHours: number
}

export interface MasterAdminSettings {
    business: BusinessSettingsState
    payments: PaymentSettingsState
    notifications: NotificationSettingsState
    languages: LanguageAndCurrencySettingsState
    access: AccessControlSettingsState
    subscriptions: SubscriptionSettingsState
    integrations: IntegrationsSettingsState
    danger: DangerZoneSettingsState
    lastUpdated: string
}

const STORAGE_KEY = 'cs_admin_settings_v1'

export const INITIAL_ADMIN_SETTINGS: MasterAdminSettings = {
    lastUpdated: 'Sep 07, 2026 · 18:45 CET',
    business: {
        brand: {
            businessName: 'CaptainStitches',
            tagline: 'Bespoke Fashion, Delivered — Handcrafted in Lagos & Verona',
            logoUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=200',
            brandColor: '#C4975A',
            businessEmail: 'samuelson@captainstitches.com',
            whatsappNumber: '+39 347 123 4567',
            instagramHandle: '@captainstitches_atelier',
            facebookUrl: 'https://facebook.com/captainstitches',
        },
        locations: {
            verona: {
                isActive: true,
                address: 'Via Giuseppe Mazzini, 42',
                city: 'Verona',
                postcodeOrState: '37121',
                country: 'Italy',
            },
            lagos: {
                isActive: true,
                address: '14 Commercial Avenue, Sabo Yaba',
                city: 'Lagos',
                postcodeOrState: 'Lagos State',
                country: 'Nigeria',
            },
        },
        production: {
            turnaroundDays: {
                nativeWear: 14,
                englishSuits: 21,
                casualWear: 10,
                childrenClothing: 7,
            },
            bufferDays: 2,
        },
        orderDefaults: {
            depositPercentage: 50,
            confirmationTemplate:
                'Hello {customer_name}! Samuelson from CaptainStitches here. We have confirmed your 50% bespoke deposit for order {order_number} ({garment_type}). Our master tailors have begun preparation!',
            deliveryTemplate:
                'Dear {customer_name}, your bespoke garment {order_number} has been safely delivered! We hope it fits with sartorial perfection. Wear it in good health.',
        },
        contact: {
            responseTimePromise: 'We reply within 24 hours',
            whatsappHours: 'Mon–Fri 9:00 AM – 6:00 PM CET',
            prefilledMessage:
                'Hello Samuelson, I would like to enquire about commissioning a bespoke garment with CaptainStitches.',
        },
    },
    payments: {
        paystack: {
            isConnected: true,
            publicKey: 'pk_live_83921948271049281729',
            secretKey: 'sk_live_94827104928172938471',
            webhookUrl: 'https://captainstitches.com/api/webhooks/paystack',
            testMode: false,
        },
        stripe: {
            isConnected: true,
            publicKey: 'pk_live_51M0abcdef123456789xyz',
            secretKey: 'sk_live_51M0secret987654321xyz',
            webhookUrl: 'https://captainstitches.com/api/webhooks/stripe',
            testMode: false,
        },
        currency: {
            activeCurrencies: ['NGN', 'EUR'],
            exchangeRateMode: 'manual',
            manualRate: 1750,
            liveRateSource: 'Open Exchange Rates FX Feed',
            lastFetched: 'Sep 07, 2026 · 14:30 CET',
            manualOverride: false,
            lastUpdated: 'Sep 07, 2026 · 14:30 CET',
        },
        depositAndBalance: {
            depositPercentage: 50,
            balanceTrigger: 'before_dispatch',
            linkExpiryDays: 7,
            autoSendBalanceRequest: true,
        },
        notifications: {
            notifyDeposit: true,
            notifyBalance: true,
            notifyFailed: true,
            sendReceipt: true,
        },
    },
    notifications: {
        samuelson: {
            newOrder: { whatsapp: true, email: true },
            depositReceived: { whatsapp: true, email: true },
            orderOverdue: { whatsapp: true, email: true, thresholdDays: 1 },
            tailorInspectionReady: { whatsapp: true, email: true },
            newReview: { whatsapp: true, email: true },
            referralConverts: { whatsapp: true, email: true },
            newSubscriber: { whatsapp: false, email: true },
            balanceReceived: { whatsapp: true, email: true },
            paymentFailed: { whatsapp: true, email: true },
        },
        tailor: {
            newOrderAssigned: { whatsapp: true, email: true },
            deadlineApproaching: { whatsapp: true, email: true, thresholdDays: 2 },
            orderDetailsUpdated: { whatsapp: true, email: true },
        },
        customer: {
            orderConfirmation: { whatsapp: true, email: true },
            statusConfirmed: { whatsapp: true, email: true },
            statusInProduction: { whatsapp: true, email: true },
            statusInspection: { whatsapp: true, email: true },
            statusApproved: { whatsapp: true, email: true },
            statusDispatched: { whatsapp: true, email: true },
            statusDelivered: { whatsapp: true, email: true },
            balanceRequest: { whatsapp: true, email: true },
            reviewRequest: { whatsapp: true, email: true, delayDays: 2 },
            referralRewardCredited: { whatsapp: true, email: true },
            rewardExpiryWarning: { whatsapp: true, email: true, daysBefore: 5 },
            welcomeMessage: { whatsapp: true, email: true },
        },
        templates: [
            {
                id: 'tmpl-1',
                title: 'Order Confirmation (Deposit Paid)',
                category: 'customer',
                enText:
                    'Dear {customer_name}, thank you for your deposit on order {order_number} ({garment_type}). Estimated completion is {deadline}. Track your order live: {tracking_link}',
                itText:
                    'Gentile {customer_name}, grazie per il tuo acconto sull’ordine {order_number} ({garment_type}). Completamento previsto per il {deadline}. Segui l’ordine: {tracking_link}',
                placeholders: ['{customer_name}', '{order_number}', '{garment_type}', '{deadline}', '{tracking_link}'],
            },
            {
                id: 'tmpl-2',
                title: 'Inspection Photo Approval Request',
                category: 'customer',
                enText:
                    'Hello {customer_name}, your {garment_type} ({order_number}) has passed atelier inspection! View high-resolution photos and approve here: {tracking_link}',
                itText:
                    'Ciao {customer_name}, il tuo capo {garment_type} ({order_number}) ha superato il collaudo sartoriale! Guarda le foto e approva qui: {tracking_link}',
                placeholders: ['{customer_name}', '{order_number}', '{garment_type}', '{tracking_link}'],
            },
            {
                id: 'tmpl-3',
                title: 'Balance Payment Request',
                category: 'customer',
                enText:
                    'Dear {customer_name}, your garment {order_number} is ready for express dispatch. Please settle the remaining 50% balance here: {payment_link}',
                itText:
                    'Gentile {customer_name}, il tuo capo {order_number} è pronto per la spedizione. Ti invitiamo a saldare il restante 50%: {payment_link}',
                placeholders: ['{customer_name}', '{order_number}', '{payment_link}'],
            },
            {
                id: 'tmpl-4',
                title: 'Dispatch & Air Freight Tracking',
                category: 'customer',
                enText:
                    'Your order {order_number} has been dispatched with DHL Express! Track delivery to your doorstep: {tracking_link}',
                itText:
                    'Il tuo ordine {order_number} è stato spedito con DHL Express! Segui la consegna: {tracking_link}',
                placeholders: ['{customer_name}', '{order_number}', '{tracking_link}'],
            },
            {
                id: 'tmpl-5',
                title: 'Post-Delivery Review Invitation',
                category: 'customer',
                enText:
                    'Hello {customer_name}, how does your new {garment_type} fit? Share your review and photos with Samuelson to earn your next bespoke perk: {tracking_link}',
                itText:
                    'Ciao {customer_name}, come veste il tuo nuovo {garment_type}? Condividi la tua recensione e foto per ricevere un vantaggio sartoriale: {tracking_link}',
                placeholders: ['{customer_name}', '{garment_type}', '{tracking_link}'],
            },
            {
                id: 'tmpl-6',
                title: 'Referral Reward Credited Alert',
                category: 'customer',
                enText:
                    'Congratulations {customer_name}! Your friend placed their first bespoke order. We have credited your account with a {reward_type}. Share your link: {referral_link}',
                itText:
                    'Congratulazioni {customer_name}! Un amico ha confermato il suo ordine. Abbiamo accreditato un {reward_type} sul tuo account. Condividi il link: {referral_link}',
                placeholders: ['{customer_name}', '{reward_type}', '{referral_link}'],
            },
        ],
        whatsappApi: {
            status: 'Connected',
            accountSid: 'AC_94827104928172938471',
            authToken: 'auth_token_secret_****************',
            dailyLimit: 1000,
            usedToday: 248,
        },
    },
    languages: {
        languages: {
            englishActive: true,
            italianActive: true,
            defaultLanguage: 'EN',
            autoDetectBrowserLanguage: true,
        },
        translationCompleteness: {
            overallPercentage: 88,
            catalogue: { translated: 22, total: 24 },
            blog: { translated: 5, total: 6 },
            emailTemplates: { translated: 7, total: 8 },
        },
        currencies: {
            ngnActive: true,
            eurActive: true,
            defaultCurrency: 'EUR',
            autoDetectGeoCurrency: true,
        },
        displayFormat: {
            symbolPosition: 'before',
            decimalPlaces: 0,
            thousandsSeparator: 'comma',
        },
    },
    access: {
        users: [
            {
                id: 'usr-1',
                name: 'Samuelson Chukwuma',
                email: 'samuelson@captainstitches.com',
                role: 'Admin',
                status: 'Active',
                lastLogin: 'Today at 19:42 CET',
                avatarInitials: 'SC',
                avatarColor: '#C4975A',
            },
            {
                id: 'usr-2',
                name: 'Matteo Rossi',
                email: 'matteo.tailor@captainstitches.com',
                role: 'Tailor',
                status: 'Active',
                lastLogin: 'Today at 15:20 CET',
                avatarInitials: 'MR',
                avatarColor: '#1C0F07',
                assignedOrdersCount: 6,
            },
            {
                id: 'usr-3',
                name: 'Ifeanyi Okafor',
                email: 'ifeanyi.tailor@captainstitches.com',
                role: 'Tailor',
                status: 'Active',
                lastLogin: 'Yesterday at 18:10 WAT',
                avatarInitials: 'IO',
                avatarColor: '#2E7D32',
                assignedOrdersCount: 8,
            },
            {
                id: 'usr-4',
                name: 'Giulia Ferrari',
                email: 'giulia.qc@captainstitches.com',
                role: 'Tailor',
                status: 'Active',
                lastLogin: 'Sep 05, 2026 at 11:30 CET',
                avatarInitials: 'GF',
                avatarColor: '#1565C0',
                assignedOrdersCount: 4,
            },
        ],
        session: {
            timeoutMinutes: 60,
            rememberMeDays: 30,
        },
        loginHistory: [
            {
                id: 'log-1',
                userName: 'Samuelson Chukwuma',
                email: 'samuelson@captainstitches.com',
                timestamp: 'Sep 07, 2026 · 19:42 CET',
                ipAddress: '151.24.89.12',
                device: 'Chrome / macOS Sonoma',
                location: 'Verona, Italy',
                isUnusual: false,
            },
            {
                id: 'log-2',
                userName: 'Matteo Rossi',
                email: 'matteo.tailor@captainstitches.com',
                timestamp: 'Sep 07, 2026 · 15:20 CET',
                ipAddress: '151.24.44.78',
                device: 'Safari / iPhone 15 Pro',
                location: 'Verona, Italy',
                isUnusual: false,
            },
            {
                id: 'log-3',
                userName: 'Ifeanyi Okafor',
                email: 'ifeanyi.tailor@captainstitches.com',
                timestamp: 'Sep 06, 2026 · 18:10 WAT',
                ipAddress: '102.89.34.201',
                device: 'Chrome / Windows 11',
                location: 'Lagos, Nigeria',
                isUnusual: false,
            },
            {
                id: 'log-4',
                userName: 'Samuelson Chukwuma',
                email: 'samuelson@captainstitches.com',
                timestamp: 'Sep 06, 2026 · 09:15 CET',
                ipAddress: '151.24.89.12',
                device: 'Chrome / macOS Sonoma',
                location: 'Verona, Italy',
                isUnusual: false,
            },
            {
                id: 'log-5',
                userName: 'Giulia Ferrari',
                email: 'giulia.qc@captainstitches.com',
                timestamp: 'Sep 05, 2026 · 11:30 CET',
                ipAddress: '93.38.12.90',
                device: 'Firefox / iPadOS',
                location: 'Milan, Italy',
                isUnusual: true,
            },
        ],
    },
    subscriptions: {
        enabled: false,
        tiers: [
            {
                id: 'tier-standard',
                nameEN: 'Atelier Essential Wardrobe',
                nameIT: 'Guardaroba Essenziale Atelier',
                priceNGN: 150000,
                priceEUR: 85,
                billingInterval: 'monthly',
                features: [
                    '1 Custom tailored piece per quarter',
                    'Complimentary fabric swatch delivery',
                    'Priority production queue (10-day turnaround)',
                    'Free international air freight dispatch',
                ],
                activeSubscribers: 0,
                isVisible: true,
                paystackPlanId: 'PLN_essential_wardrobe_01',
                stripePriceId: 'price_essential_wardrobe_01',
            },
            {
                id: 'tier-priority',
                nameEN: 'Connoisseur Sartorial Club',
                nameIT: 'Club Sartoriale Connoisseur',
                priceNGN: 320000,
                priceEUR: 180,
                billingInterval: 'monthly',
                features: [
                    '2 Custom bespoke suits or native sets per quarter',
                    'Direct WhatsApp consultation with Samuelson',
                    'Express 7-day handcrafted turnaround',
                    'Private in-person fitting in Verona or Milan',
                    'Exclusive access to deadstock Italian wools',
                ],
                activeSubscribers: 0,
                isVisible: true,
                paystackPlanId: 'PLN_connoisseur_club_02',
                stripePriceId: 'price_connoisseur_club_02',
            },
            {
                id: 'tier-vip',
                nameEN: 'Imperial Bespoke Patron (Invite-Only)',
                nameIT: 'Patrono Imperiale Bespoke (Su Invito)',
                priceNGN: 850000,
                priceEUR: 485,
                billingInterval: 'quarterly',
                features: [
                    'Unlimited custom wardrobe curation',
                    'Loro Piana & Scabal cashmere fabric allocation',
                    'Same-week international courier delivery',
                    'Annual bespoke ceremonial trunk delivery',
                    'Personal tailor dispatched for private fitting',
                ],
                activeSubscribers: 0,
                isVisible: false,
                paystackPlanId: 'PLN_imperial_patron_03',
                stripePriceId: 'price_imperial_patron_03',
            },
        ],
        defaults: {
            defaultTierId: 'tier-standard',
            trialDays: 0,
            cancellationPolicy: 'end_of_period',
        },
    },
    integrations: {
        integrations: [
            {
                id: 'int-paystack',
                name: 'Paystack Payment Gateway',
                category: 'Financial',
                description: 'Accepts Nigerian Naira bank transfers, cards, and USSD deposits.',
                status: 'connected',
                lastSync: 'Today at 19:40 CET',
                configRoute: '/admin/settings/payments',
            },
            {
                id: 'int-stripe',
                name: 'Stripe International Gateway',
                category: 'Financial',
                description: 'Accepts Euro, British Pound, and global Visa/Mastercard transactions.',
                status: 'connected',
                lastSync: 'Today at 19:40 CET',
                configRoute: '/admin/settings/payments',
            },
            {
                id: 'int-whatsapp',
                name: 'WhatsApp Business API (Twilio)',
                category: 'Communication',
                description: 'Dispatches automated order updates, inspection previews, and balance requests.',
                status: 'connected',
                lastSync: 'Today at 18:22 CET',
                configRoute: '/admin/settings/notifications',
            },
            {
                id: 'int-resend',
                name: 'Resend Transactional Email',
                category: 'Communication',
                description: 'High-deliverability email service for receipts and password resets.',
                status: 'connected',
                lastSync: 'Today at 17:10 CET',
                configRoute: '/admin/marketing/settings',
            },
            {
                id: 'int-brevo',
                name: 'Brevo / Mailchimp Marketing',
                category: 'Marketing',
                description: 'Subscriber directory sync and editorial journal email broadcasts.',
                status: 'connected',
                lastSync: 'Today at 12:00 CET',
                configRoute: '/admin/marketing/settings',
            },
            {
                id: 'int-cloudinary',
                name: 'Cloudinary / S3 Media CDN',
                category: 'Infrastructure',
                description: 'High-resolution photo storage for garments, fabric swatches, and inspection media.',
                status: 'connected',
                lastSync: 'Today at 19:15 CET',
                configRoute: '/admin/settings/integrations',
            },
            {
                id: 'int-ga4',
                name: 'Google Analytics 4',
                category: 'Analytics',
                description: 'Tracks storefront visitor behavior, lookbook views, and conversion funnels.',
                status: 'connected',
                lastSync: 'Today at 04:00 CET',
                configRoute: '/admin/analytics/settings',
            },
            {
                id: 'int-gsc',
                name: 'Google Search Console',
                category: 'Analytics',
                description: 'Monitors international organic search keywords and indexing health.',
                status: 'connected',
                lastSync: 'Today at 05:30 CET',
                configRoute: '/admin/analytics/settings',
            },
            {
                id: 'int-fx',
                name: 'Open Exchange Rates FX API',
                category: 'Financial',
                description: 'Fetches real-time EUR to NGN currency exchange rates for conversion previews.',
                status: 'connected',
                lastSync: 'Today at 14:30 CET',
                configRoute: '/admin/settings/payments',
            },
        ],
        mediaStorage: {
            provider: 'cloudinary',
            cloudName: 'captain-stitches-media',
            apiKey: '849271049281729',
            apiSecret: 'sk_cloudinary_****************',
            defaultFolder: 'captainstitches/inspection-media',
            storageUsedGb: 4.2,
            storageLimitGb: 25.0,
        },
    },
    danger: {
        lastBackupTimestamp: 'Sep 07, 2026 · 02:00 CET',
        factoryResetPending: false,
        safetyLockoutHours: 24,
    },
}

// STORAGE HELPERS

export function getAdminSettings(): MasterAdminSettings {
    if (typeof window === 'undefined') return INITIAL_ADMIN_SETTINGS
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_ADMIN_SETTINGS))
            return INITIAL_ADMIN_SETTINGS
        }
        return JSON.parse(stored)
    } catch {
        return INITIAL_ADMIN_SETTINGS
    }
}

export function saveAdminSettings(settings: MasterAdminSettings): void {
    if (typeof window === 'undefined') return
    try {
        settings.lastUpdated = new Date().toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }) + ' CET'
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    } catch (e) {
        console.error('Failed to save admin settings', e)
    }
}

export function resetSettingsToDefaults(): MasterAdminSettings {
    if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY)
    }
    return INITIAL_ADMIN_SETTINGS
}

// GLOBAL SEARCH INDEX

export interface SearchResultItem {
    title: string
    section: string
    route: string
    description: string
    keywords: string[]
}

export const SETTINGS_SEARCH_INDEX: SearchResultItem[] = [
    {
        title: 'Brand Details & Business Name',
        section: 'Business',
        route: '/admin/settings/business',
        description: 'Business name, tagline, logo upload, and brand accent colour.',
        keywords: ['brand', 'name', 'tagline', 'logo', 'colour', 'color', 'email', 'instagram', 'facebook'],
    },
    {
        title: 'WhatsApp Hotline & Contact Hours',
        section: 'Business',
        route: '/admin/settings/business',
        description: 'Customer contact phone number, response guarantee, and availability hours.',
        keywords: ['whatsapp', 'phone', 'contact', 'hours', 'message', 'support'],
    },
    {
        title: 'Operating Ateliers (Verona & Lagos)',
        section: 'Business',
        route: '/admin/settings/business',
        description: 'Manage active workshop addresses in Italy and Nigeria.',
        keywords: ['location', 'address', 'verona', 'lagos', 'aba', 'italy', 'nigeria', 'workshop'],
    },
    {
        title: 'Production Turnaround Defaults',
        section: 'Business',
        route: '/admin/settings/business',
        description: 'Default tailoring turnaround days per category and safety buffer days.',
        keywords: ['turnaround', 'days', 'production', 'deadline', 'buffer', 'suits', 'native', 'casual'],
    },
    {
        title: 'Paystack API Credentials',
        section: 'Payments',
        route: '/admin/settings/payments',
        description: 'Public key, secret key, webhook URL, and test mode toggle.',
        keywords: ['paystack', 'naira', 'ngn', 'webhook', 'keys', 'secret', 'test mode'],
    },
    {
        title: 'Stripe API Credentials',
        section: 'Payments',
        route: '/admin/settings/payments',
        description: 'Stripe publishable and secret keys for European card processing.',
        keywords: ['stripe', 'euro', 'eur', 'cards', 'webhook', 'keys', 'test mode'],
    },
    {
        title: 'Currency Exchange Rate (₦/€ FX)',
        section: 'Payments',
        route: '/admin/settings/payments',
        description: 'Set manual or live exchange rates between Nigerian Naira and Euro.',
        keywords: ['exchange rate', 'currency', 'fx', 'rate', 'naira', 'euro', 'conversion'],
    },
    {
        title: 'Deposit & Balance Trigger Settings',
        section: 'Payments',
        route: '/admin/settings/payments',
        description: 'Adjust default 50% deposit and balance payment due trigger.',
        keywords: ['deposit', 'balance', 'trigger', 'payment link', 'expiry', 'percentage'],
    },
    {
        title: 'Samuelson Order & SLA Notifications',
        section: 'Notifications',
        route: '/admin/settings/notifications',
        description: 'Alert toggles for new orders, overdue pieces, and deposit receipts.',
        keywords: ['samuelson', 'notifications', 'whatsapp alerts', 'email alerts', 'overdue', 'deposit'],
    },
    {
        title: 'Bilingual Notification Templates (EN & IT)',
        section: 'Notifications',
        route: '/admin/settings/notifications',
        description: 'Customise WhatsApp and email text with dynamic placeholders in English and Italian.',
        keywords: ['templates', 'template', 'italian', 'english', 'placeholders', 'message text'],
    },
    {
        title: 'Active Languages & Translation Completeness',
        section: 'Languages',
        route: '/admin/settings/languages',
        description: 'Enable Italian, set default language, and monitor translation completeness.',
        keywords: ['language', 'italian', 'english', 'translation', 'translate', 'completeness'],
    },
    {
        title: 'Currency Display Formatting',
        section: 'Languages',
        route: '/admin/settings/languages',
        description: 'Symbol position, decimal places, and thousands separator styling.',
        keywords: ['symbol', 'decimals', 'separator', 'format', 'currency display'],
    },
    {
        title: 'Admin Users & Tailor Staff Accounts',
        section: 'Access Control',
        route: '/admin/settings/access',
        description: 'Invite new staff, assign Admin or Tailor roles, and manage credentials.',
        keywords: ['users', 'staff', 'tailor', 'admin', 'invite', 'role', 'permissions', 'accounts'],
    },
    {
        title: 'Session Timeout & Security Settings',
        section: 'Access Control',
        route: '/admin/settings/access',
        description: 'Set inactivity session limits and force global logout if compromised.',
        keywords: ['session', 'timeout', 'logout', 'security', 'login history', 'audit'],
    },
    {
        title: 'Subscription Tiers & Wardrobe Club (Feature Flag)',
        section: 'Subscriptions',
        route: '/admin/settings/subscriptions',
        description: 'Manage dormant recurring bespoke membership tiers and activation flag.',
        keywords: ['subscription', 'tiers', 'wardrobe club', 'recurring', 'membership', 'vip', 'standard'],
    },
    {
        title: 'Third-Party Connected Integrations Hub',
        section: 'Integrations',
        route: '/admin/settings/integrations',
        description: 'Central status dashboard for all connected payment, email, analytics, and CDN services.',
        keywords: ['integrations', 'connected', 'services', 'sync', 'status', 'api'],
    },
    {
        title: 'Cloudinary / S3 Media Storage CDN',
        section: 'Integrations',
        route: '/admin/settings/integrations',
        description: 'Configure image hosting bucket and monitor storage quota.',
        keywords: ['cloudinary', 's3', 'media', 'photos', 'storage', 'bucket', 'upload'],
    },
    {
        title: 'Clear Test Orders',
        section: 'Danger Zone',
        route: '/admin/settings/danger',
        description: 'Delete simulated test-mode orders without touching live customer commissions.',
        keywords: ['clear test orders', 'delete test', 'test data', 'danger'],
    },
    {
        title: 'Reset Catalogue Designs',
        section: 'Danger Zone',
        route: '/admin/settings/danger',
        description: 'Remove designs from the public lookbook while preserving order history.',
        keywords: ['reset catalogue', 'wipe designs', 'delete catalogue', 'danger'],
    },
    {
        title: 'Export Platform Data Archive (ZIP/CSV)',
        section: 'Danger Zone',
        route: '/admin/settings/danger',
        description: 'Download complete backup of customers, orders, designs, blog posts, and subscribers.',
        keywords: ['export data', 'backup', 'zip', 'csv', 'archive', 'download data'],
    },
    {
        title: 'Factory Reset (Nuclear Option)',
        section: 'Danger Zone',
        route: '/admin/settings/danger',
        description: 'Complete studio wipe with CAPTAINSTITCHES confirmation phrase and 24-hour lock.',
        keywords: ['factory reset', 'nuclear', 'wipe all', 'reset all', 'danger zone'],
    },
]

export function searchSettingsIndex(query: string): SearchResultItem[] {
    const q = query.toLowerCase().trim()
    if (!q) return []
    return SETTINGS_SEARCH_INDEX.filter((item) => {
        return (
            item.title.toLowerCase().includes(q) ||
            item.section.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.keywords.some((k) => k.toLowerCase().includes(q))
        )
    })
}

export function downloadPlatformExportArchive(): void {
    const simulatedData = {
        exportedAt: new Date().toISOString(),
        businessName: 'CaptainStitches Atelier',
        recordsCount: {
            customers: 148,
            orders: 124,
            catalogueDesigns: 24,
            blogArticles: 6,
            subscribers: 412,
        },
        format: 'JSON / CSV Consolidated Atelier Backup',
    }

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(simulatedData, null, 2))
    const link = document.createElement('a')
    link.setAttribute('href', dataStr)
    link.setAttribute('download', `captainstitches_platform_backup_${Date.now()}.json`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
