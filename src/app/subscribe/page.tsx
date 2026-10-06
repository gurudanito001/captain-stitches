import { redirect } from 'next/navigation'
import { getAdminSettings } from '@/data/adminSettingsData'

export default function SubscribePage() {
    const settings = getAdminSettings()

    // Edge Case: If subscriptions feature flag is off (dormant launch mode), gracefully redirect to catalogue
    if (!settings.subscriptions.enabled) {
        redirect('/catalogue')
    }

    return (
        <div style={{ padding: '80px 20px', textAlign: 'center', background: '#0C0704', color: '#FAF6F0', minHeight: '100vh' }}>
            <h1 style={{ fontFamily: 'serif', fontSize: '2.5rem' }}>Bespoke Wardrobe Subscriptions</h1>
            <p style={{ color: '#D4C5B0', marginTop: '12px' }}>Experience recurring seasonal tailoring allocations.</p>
        </div>
    )
}
