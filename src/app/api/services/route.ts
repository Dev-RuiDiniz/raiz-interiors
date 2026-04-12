import { NextRequest, NextResponse } from 'next/server'
import { getServiceDetailContent, getServicesContent } from '@/lib/cms/content-service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (slug) {
    const service = await getServiceDetailContent(slug)
    return NextResponse.json(service)
  }

  const services = await getServicesContent()
  return NextResponse.json(services)
}
