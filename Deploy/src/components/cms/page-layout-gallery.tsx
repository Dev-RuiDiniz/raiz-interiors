'use client'

import { GalleryLayoutRenderer } from '@/components/cms/gallery-layout-renderer'
import { usePageLayout } from '@/lib/cms/use-page-layout'

interface PageLayoutGalleryProps {
  pageKey: string
  sectionKey: string
  className?: string
}

export function PageLayoutGallery({ pageKey, sectionKey, className }: PageLayoutGalleryProps) {
  const { layout } = usePageLayout(pageKey, sectionKey)

  if (!layout.items.length) {
    return null
  }

  return <GalleryLayoutRenderer layout={layout} className={className} />
}
