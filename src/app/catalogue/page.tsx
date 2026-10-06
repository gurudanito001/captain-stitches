import { Suspense } from 'react'
import type { Metadata } from 'next'
import { getPublishedDesigns, fromPrismaCategory, getCategoryLabel } from '@/lib/dal/catalogue'
import { CatalogueClientView, PublicCatalogueItem } from './catalogue-client-view'

export const metadata: Metadata = {
  title: 'Bespoke Collections — African Native Wear & Fabric Accessories | CaptainStitches',
  description:
    'Explore our collections of hand-crafted Nigerian native wear and authentic African fabric accessories. Select any design to customize it to your measurements, with direct delivery across Europe.',
}

// Force dynamic so newly created or toggled designs appear instantly
export const dynamic = 'force-dynamic'

export default async function CataloguePage() {
  let dbDesigns: any[] = []
  try {
    dbDesigns = await getPublishedDesigns()
  } catch (err: any) {
    console.error('[CataloguePage] getPublishedDesigns error:', err)
  }

  const designs: PublicCatalogueItem[] = dbDesigns.map((d: any) => {
    const coverPhoto = d.photos.find((p: any) => p.isPrimary)?.url || d.photos[0]?.url || '/images/design-agbada.jpg'
    const reviews = d.reviews || []
    const rating = reviews.length > 0
      ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 4.9
    const turnaround = `${d.turnaroundDays ?? 14} days`

    return {
      name: d.nameEN,
      category: fromPrismaCategory(d.category),
      categoryLabel: getCategoryLabel(d.category),
      priceNGN: d.priceNGN,
      priceEUR: d.priceEUR,
      turnaround,
      rating,
      reviewCount: reviews.length || d._count?.reviews || 0,
      image: coverPhoto,
      slug: d.slug,
    }
  })

  return (
    <Suspense
      fallback={
        <div className="bg-brown-900 min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-caramel-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <CatalogueClientView initialDesigns={designs} />
    </Suspense>
  )
}
