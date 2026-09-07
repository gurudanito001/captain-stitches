'use client'

import React, { useMemo } from 'react'
import { AdminBlogEditor } from '@/components/admin/AdminBlogEditor'
import { AdminBlogPost } from '@/data/adminBlogData'

export default function NewBlogPostPage() {
    const newBlankPost: AdminBlogPost = useMemo(() => {
        return {
            id: `post-${Date.now()}`,
            slug: '',
            featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
            featuredImageAlt: 'Bespoke tailoring craft in atelier',
            category: 'Style Guide',
            status: 'draft',
            publishDate: 'Draft',
            author: 'Samuelson',
            visibility: 'public',
            contentEN: {
                title: '',
                excerpt: '',
                body: '',
                tags: ['Bespoke', 'Tailoring'],
                metaTitle: '',
                metaDescription: '',
            },
            contentIT: {
                title: '',
                excerpt: '',
                body: '',
                tags: ['Su Misura', 'Sartoria'],
                metaTitle: '',
                metaDescription: '',
            },
            cta: {
                isEnabled: true,
                text: 'Ready to commission your next bespoke piece? Browse the atelier collection →',
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
                trafficSources: {
                    direct: 0,
                    whatsapp: 0,
                    instagram: 0,
                    google: 0,
                    other: 0,
                },
                languageSplit: {
                    en: 100,
                    it: 0,
                },
                searchKeywords: [],
            },
            lastSaved: 'Not saved yet',
        }
    }, [])

    return <AdminBlogEditor initialPost={newBlankPost} isNew={true} />
}
