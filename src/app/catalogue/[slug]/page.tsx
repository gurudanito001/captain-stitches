import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import {
  getDesignBySlug,
  getPublishedDesigns,
  fromPrismaCategory,
  getCategoryLabel,
} from '@/lib/dal/catalogue'
import {
  DesignDetailClientView,
  DetailDesignData,
  RelatedDesignItem,
} from './design-detail-client-view'
import { parseColour } from '@/lib/utils/colours'

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const design = await getDesignBySlug(slug)

  if (!design) {
    return {
      title: 'Design Not Found — CaptainStitches Lookbook',
    }
  }

  return {
    title: design.metaTitleEN || `${design.nameEN} — Bespoke Fashion | CaptainStitches`,
    description: design.metaDescEN || design.descriptionEN.slice(0, 160),
    openGraph: {
      title: design.nameEN,
      description: design.descriptionEN.slice(0, 160),
      images: design.photos[0] ? [design.photos[0].url] : [],
    },
  }
}

export default async function DesignDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const dbDesign = await getDesignBySlug(slug)

  if (!dbDesign) {
    notFound()
  }

  const coverPhoto =
    dbDesign.photos.find((p: any) => p.isPrimary)?.url ||
    dbDesign.photos[0]?.url ||
    '/images/design-agbada.jpg'

  const reviews = (dbDesign.reviews || []).map((r: any) => ({
    name: r.customer ? `${r.customer.firstName} ${r.customer.lastName?.[0] || ''}.`.trim() : 'Verified Patron',
    rating: r.rating || 5,
    date: r.createdAt ? new Date(r.createdAt).toISOString().split('T')[0] : '2026-08-01',
    comment: r.comment || '',
  }))

  const avgRating =
    reviews.length > 0
      ? Number((reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / reviews.length).toFixed(1))
      : 5.0

  const colors = (dbDesign.colourOptionsEN || []).map((raw: string) => parseColour(raw))

  const designData: DetailDesignData = {
    slug: dbDesign.slug,
    name: dbDesign.nameEN,
    category: fromPrismaCategory(dbDesign.category),
    categoryLabel: getCategoryLabel(dbDesign.category),
    priceNGN: dbDesign.priceNGN,
    priceEUR: dbDesign.priceEUR,
    turnaround: `${dbDesign.turnaroundDays ?? 14}–${(dbDesign.turnaroundDays ?? 14) + 4} days`,
    rating: avgRating,
    reviewCount: reviews.length || dbDesign._count?.reviews || 0,
    image: coverPhoto,
    description: dbDesign.descriptionEN,
    fabrics: dbDesign.fabricOptionsEN?.length ? dbDesign.fabricOptionsEN : ['Imperial Cashmere Cotton', 'Royal Guinea Brocade'],
    colors: colors.length > 0 ? colors : [{ name: 'Midnight Black', hex: '#1C1C1C' }, { name: 'Royal Ivory', hex: '#FAF5EA' }],
    photos: dbDesign.photos.map((p: any) => ({
      id: p.id,
      url: p.url,
      caption: p.altText || undefined,
      isCover: p.isPrimary,
    })),
    reviews,
  }

  // Fetch related designs
  const allRelated = await getPublishedDesigns(dbDesign.category)
  const relatedDesigns: RelatedDesignItem[] = allRelated
    .filter((d: any) => d.id !== dbDesign.id && d.slug !== dbDesign.slug)
    .slice(0, 4)
    .map((d: any) => ({
      slug: d.slug,
      name: d.nameEN,
      category: fromPrismaCategory(d.category),
      categoryLabel: getCategoryLabel(d.category),
      priceEUR: d.priceEUR,
      priceNGN: d.priceNGN,
      turnaround: `${d.turnaroundDays ?? 14} days`,
      rating: 4.8,
      reviewCount: d._count?.reviews || 0,
      image: d.photos.find((p: any) => p.isPrimary)?.url || d.photos[0]?.url || '/images/design-agbada.jpg',
    }))

  return <DesignDetailClientView design={designData} relatedDesigns={relatedDesigns} />
}
