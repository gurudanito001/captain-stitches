'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { AdminCampaignComposer } from '@/components/admin/AdminCampaignComposer'
import { MarketingCampaign, getCampaignById } from '@/data/adminMarketingData'

export default function EditCampaignPage() {
    const params = useParams()
    const campaignId = params.id as string

    const [campaign, setCampaign] = useState<MarketingCampaign | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!campaignId) return
        const found = getCampaignById(campaignId)
        if (found) {
            setCampaign(found)
        }
        setIsLoading(false)
    }, [campaignId])

    if (isLoading) {
        return (
            <div
                style={{
                    minHeight: '60vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                }}
            >
                <div
                    style={{
                        width: '36px',
                        height: '36px',
                        border: '3px solid rgba(196, 151, 90, 0.2)',
                        borderTopColor: '#C4975A',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                    }}
                />
                <p style={{ fontSize: '14px', color: '#8C827A', fontFamily: 'serif' }}>
                    Loading campaign manuscript...
                </p>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        )
    }

    if (!campaign) {
        return (
            <div
                style={{
                    maxWidth: '520px',
                    margin: '60px auto',
                    padding: '40px 24px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8E2D9',
                    textAlign: 'center',
                }}
            >
                <h2 style={{ fontFamily: 'serif', fontSize: '20px', color: '#1C0F07', marginBottom: '8px' }}>
                    Campaign Not Found
                </h2>
                <p style={{ fontSize: '13px', color: '#8C827A', marginBottom: '20px' }}>
                    The campaign with ID "{campaignId}" could not be located in atelier records.
                </p>
                <Link
                    href="/admin/marketing/campaigns"
                    style={{
                        padding: '9px 18px',
                        backgroundColor: '#1C0F07',
                        color: '#FAF7F2',
                        borderRadius: '6px',
                        fontSize: '13px',
                        textDecoration: 'none',
                    }}
                >
                    Return to Campaigns Directory
                </Link>
            </div>
        )
    }

    return <AdminCampaignComposer initialCampaign={campaign} isNew={false} />
}
