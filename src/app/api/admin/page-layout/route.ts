import { NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/lib/admin-auth'
import prisma from '@/lib/prisma'
import { normalizeGalleryLayout } from '@/lib/cms/layout-types'
import { getDefaultLayout } from '@/lib/cms/default-layouts'
import {
  getLocalDraftAndPublishedPageLayout,
  publishLocalPageLayout,
  upsertLocalPageLayoutDraft,
} from '@/lib/cms/local-page-layout-store'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const pageKey = request.nextUrl.searchParams.get('pageKey')
  const sectionKey = request.nextUrl.searchParams.get('sectionKey')

  if (!pageKey || !sectionKey) {
    return badRequest('pageKey and sectionKey are required.')
  }

  if (!prisma) {
    const local = await getLocalDraftAndPublishedPageLayout(pageKey, sectionKey)
    return NextResponse.json({
      pageKey,
      sectionKey,
      draft: local.draft,
      published: local.published,
      updatedAt: local.updatedAt,
      publishedAt: local.publishedAt,
      exists: local.exists,
    })
  }

  const layout = await prisma.pageSectionLayout.findUnique({
    where: {
      pageKey_sectionKey: {
        pageKey,
        sectionKey,
      },
    },
  })

  if (!layout) {
    const empty = getDefaultLayout(pageKey, sectionKey)
    return NextResponse.json({
      pageKey,
      sectionKey,
      draft: empty,
      published: empty,
      updatedAt: null,
      publishedAt: null,
      exists: false,
    })
  }

  return NextResponse.json({
    pageKey,
    sectionKey,
    draft: normalizeGalleryLayout(layout.draft),
    published: normalizeGalleryLayout(layout.published),
    updatedAt: layout.updatedAt,
    publishedAt: layout.publishedAt,
    exists: true,
  })
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const body = await request.json().catch(() => null)
  const pageKey = body?.pageKey
  const sectionKey = body?.sectionKey

  if (!pageKey || !sectionKey) {
    return badRequest('pageKey and sectionKey are required.')
  }

  const draft = normalizeGalleryLayout(body?.draft)

  if (!prisma) {
    const saved = await upsertLocalPageLayoutDraft(pageKey, sectionKey, draft)
    return NextResponse.json({
      success: true,
      pageKey,
      sectionKey,
      draft: saved.draft,
      updatedAt: saved.updatedAt,
    })
  }

  const result = await prisma.pageSectionLayout.upsert({
    where: {
      pageKey_sectionKey: {
        pageKey,
        sectionKey,
      },
    },
    create: {
      pageKey,
      sectionKey,
      draft,
      published: draft,
      publishedAt: null,
    },
    update: {
      draft,
    },
  })

  return NextResponse.json({
    success: true,
    pageKey,
    sectionKey,
    draft: normalizeGalleryLayout(result.draft),
    updatedAt: result.updatedAt,
  })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const body = await request.json().catch(() => null)
  const pageKey = body?.pageKey
  const sectionKey = body?.sectionKey
  const action = body?.action

  if (!pageKey || !sectionKey) {
    return badRequest('pageKey and sectionKey are required.')
  }

  if (action !== 'publish') {
    return badRequest('Unsupported action.')
  }

  if (!prisma) {
    const saved = await publishLocalPageLayout(pageKey, sectionKey)
    return NextResponse.json({
      success: true,
      pageKey,
      sectionKey,
      published: saved.published,
      publishedAt: saved.publishedAt,
    })
  }

  const existing = await prisma.pageSectionLayout.findUnique({
    where: {
      pageKey_sectionKey: {
        pageKey,
        sectionKey,
      },
    },
  })

  if (!existing) {
    const empty = getDefaultLayout(pageKey, sectionKey)
    const created = await prisma.pageSectionLayout.create({
      data: {
        pageKey,
        sectionKey,
        draft: empty,
        published: empty,
        publishedAt: new Date(),
      },
    })
    return NextResponse.json({
      success: true,
      pageKey,
      sectionKey,
      published: normalizeGalleryLayout(created.published),
      publishedAt: created.publishedAt,
    })
  }

  const published = normalizeGalleryLayout(existing.draft)
  const updated = await prisma.pageSectionLayout.update({
    where: { id: existing.id },
    data: {
      published,
      publishedAt: new Date(),
    },
  })

  return NextResponse.json({
    success: true,
    pageKey,
    sectionKey,
    published: normalizeGalleryLayout(updated.published),
    publishedAt: updated.publishedAt,
  })
}
