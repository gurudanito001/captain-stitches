'use client'

import React, { useMemo } from 'react'
import { AdminCampaignComposer } from '@/components/admin/AdminCampaignComposer'
import { MarketingCampaign } from '@/data/adminMarketingData'

export default function NewCampaignPage() {
    const newBlankCampaign: MarketingCampaign = useMemo(() => {
        return {
            id: `camp-${Date.now()}`,
            name: '',
            status: 'draft',
            subjectEN: '',
            subjectIT: '',
            previewTextEN: '',
            previewTextIT: '',
            fromName: 'Samuelson at CaptainStitches',
            replyTo: 'samuelson@captainstitches.com',
            audienceType: 'all',
            recipientCount: 0,
            timezone: 'Europe/Rome (CET)',
            contentEN: {
                title: '',
                subtitle: '',
                body: '',
                featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
                ctaText: 'Explore Collection →',
                ctaUrl: 'https://captainstitches.com/catalogue',
            },
            contentIT: {
                title: '',
                subtitle: '',
                body: '',
                featuredImage: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1200',
                ctaText: 'Scopri la Collezione →',
                ctaUrl: 'https://captainstitches.com/catalogue',
            },
            lastSaved: 'Not saved yet',
        }
    }, [])

    return <AdminCampaignComposer initialCampaign={newBlankCampaign} isNew={true} />
}
