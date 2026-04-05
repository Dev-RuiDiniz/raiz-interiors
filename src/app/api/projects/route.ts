import { NextRequest, NextResponse } from 'next/server'
import { getProjectDetailContent, getProjectsContent } from '@/lib/cms/content-service'

export const runtime = 'nodejs'
const publicCacheHeaders = {
  'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=86400',
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (slug) {
    const project = await getProjectDetailContent(slug)
    return NextResponse.json(project, { headers: publicCacheHeaders })
  }

  const projects = await getProjectsContent()
  return NextResponse.json(projects, { headers: publicCacheHeaders })
}
