import { NextRequest, NextResponse } from 'next/server'
import { getServiceDetailContent, getServicesContent } from '@/lib/cms/content-service'

export const runtime = 'nodejs'
const publicCacheHeaders = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (slug) {
    const service = await getServiceDetailContent(slug)
    return NextResponse.json(service, { headers: publicCacheHeaders })
  }

  const services = await getServicesContent()
  return NextResponse.json(services, { headers: publicCacheHeaders })
}
