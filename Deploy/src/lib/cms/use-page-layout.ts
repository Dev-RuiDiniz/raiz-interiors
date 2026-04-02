'use client'

import { useEffect, useState } from 'react'
import { getDefaultLayout } from '@/lib/cms/default-layouts'
import { normalizeGalleryLayout, type GalleryLayout } from '@/lib/cms/layout-types'

interface UsePageLayoutResult {
  layout: GalleryLayout
  loading: boolean
}

export function usePageLayout(pageKey: string, sectionKey: string): UsePageLayoutResult {
  const [layout, setLayout] = useState<GalleryLayout>(() => getDefaultLayout(pageKey, sectionKey))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadLayout() {
      try {
        const response = await fetch(
          `/api/page-layout?pageKey=${encodeURIComponent(pageKey)}&sectionKey=${encodeURIComponent(sectionKey)}`,
          { cache: 'no-store' }
        )
        if (!response.ok) {
          throw new Error('Failed to load page layout')
        }
        const data = (await response.json()) as { layout?: unknown }
        if (!active) return
        setLayout(normalizeGalleryLayout(data.layout))
      } catch {
        if (!active) return
        setLayout(getDefaultLayout(pageKey, sectionKey))
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadLayout()
    return () => {
      active = false
    }
  }, [pageKey, sectionKey])

  return { layout, loading }
}
