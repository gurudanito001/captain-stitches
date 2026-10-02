import { redirect } from 'next/navigation'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function TrackByIdPage({ params }: PageProps) {
  const { id } = await params
  redirect(`/track?id=${encodeURIComponent(id)}`)
}
