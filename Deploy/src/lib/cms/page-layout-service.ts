import prisma from '@/lib/prisma'
import { getDefaultLayout } from '@/lib/cms/default-layouts'
import { normalizeGalleryLayout, type GalleryLayout } from '@/lib/cms/layout-types'

export interface PageLayoutResult {
  layout: GalleryLayout
  publishedAt: Date | null
  exists: boolean
}

export async function getPublishedPageLayout(pageKey: string, sectionKey: string): Promise<PageLayoutResult> {
  if (!prisma) {
    return {
      layout: getDefaultLayout(pageKey, sectionKey),
      publishedAt: null,
      exists: false,
    }
  }

  const record = await prisma.pageSectionLayout.findUnique({
    where: {
      pageKey_sectionKey: {
        pageKey,
        sectionKey,
      },
    },
  })

  if (!record) {
    return {
      layout: getDefaultLayout(pageKey, sectionKey),
      publishedAt: null,
      exists: false,
    }
  }

  return {
    layout: normalizeGalleryLayout(record.published),
    publishedAt: record.publishedAt,
    exists: true,
  }
}

export async function getDraftAndPublishedPageLayout(pageKey: string, sectionKey: string) {
  if (!prisma) {
    const fallback = getDefaultLayout(pageKey, sectionKey)
    return {
      draft: fallback,
      published: fallback,
      updatedAt: null,
      publishedAt: null,
      exists: false,
    }
  }

  const record = await prisma.pageSectionLayout.findUnique({
    where: {
      pageKey_sectionKey: {
        pageKey,
        sectionKey,
      },
    },
  })

  if (!record) {
    const fallback = getDefaultLayout(pageKey, sectionKey)
    return {
      draft: fallback,
      published: fallback,
      updatedAt: null,
      publishedAt: null,
      exists: false,
    }
  }

  return {
    draft: normalizeGalleryLayout(record.draft),
    published: normalizeGalleryLayout(record.published),
    updatedAt: record.updatedAt,
    publishedAt: record.publishedAt,
    exists: true,
  }
}
