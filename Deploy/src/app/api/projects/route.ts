import { NextRequest, NextResponse } from 'next/server'
import { getProjectDetailContent, getProjectsContent } from '@/lib/cms/content-service'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')

  if (slug) {
    const project = await getProjectDetailContent(slug)
    return NextResponse.json(project)
  }

  const projects = await getProjectsContent()
  return NextResponse.json(projects)
}
