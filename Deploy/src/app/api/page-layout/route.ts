import { NextRequest, NextResponse } from 'next/server'
import { getPublishedPageLayout } from '@/lib/cms/page-layout-service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const pageKey = request.nextUrl.searchParams.get('pageKey')
  const sectionKey = request.nextUrl.searchParams.get('sectionKey')

  if (!pageKey || !sectionKey) {
    return NextResponse.json({ error: 'pageKey and sectionKey are required.' }, { status: 400 })
  }

  const result = await getPublishedPageLayout(pageKey, sectionKey)

  return NextResponse.json({
    pageKey,
    sectionKey,
    layout: result.layout,
    publishedAt: result.publishedAt,
    exists: result.exists,
  })
}
