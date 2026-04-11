'use client'

import { SiteImage } from '@/components/ui/site-image'
import { cn } from '@/lib/utils'
import type { GalleryLayout, GalleryLayoutItem } from '@/lib/cms/layout-types'

interface GalleryLayoutRendererProps {
  layout: GalleryLayout
  className?: string
  itemClassName?: string
}

function itemStyle(item: GalleryLayoutItem, mode: 'desktop' | 'mobile') {
  const box = mode === 'desktop' ? item.desktop : item.mobile
  return {
    left: `${box.x}%`,
    top: `${box.y}%`,
    width: `${box.w}%`,
    height: `${box.h}%`,
    zIndex: box.z,
  }
}

function imageStyle(item: GalleryLayoutItem, mode: 'desktop' | 'mobile') {
  const box = mode === 'desktop' ? item.desktop : item.mobile
  return {
    objectFit: box.objectFit,
    objectPosition: box.objectPosition,
  } as const
}

function imageSizes(item: GalleryLayoutItem) {
  const desktopWidth = Math.max(10, Math.min(100, Math.round(item.desktop.w)))
  const mobileWidth = Math.max(20, Math.min(100, Math.round(item.mobile.w)))
  return `(min-width: 768px) ${desktopWidth}vw, ${mobileWidth}vw`
}

export function GalleryLayoutRenderer({ layout, className, itemClassName }: GalleryLayoutRendererProps) {
  const visibleItems = layout.items.filter((item) => item.visible).sort((a, b) => a.order - b.order)

  if (!visibleItems.length) return null

  return (
    <div className={cn('space-y-4', className)}>
      <div
        className="relative hidden md:block overflow-hidden rounded-xl bg-stone-200/70"
        style={{ height: `${layout.canvasHeightDesktop}px` }}
      >
        {visibleItems.map((item) => (
          <div
            key={`desktop-${item.id}`}
            style={itemStyle(item, 'desktop')}
            className={cn('absolute overflow-hidden rounded-lg bg-stone-300', itemClassName)}
          >
            <SiteImage
              src={item.src}
              alt={item.alt || 'Gallery image'}
              fill
              loading="lazy"
              sizes={imageSizes(item)}
              className="select-none"
              style={imageStyle(item, 'desktop')}
            />
          </div>
        ))}
      </div>

      <div
        className="relative md:hidden overflow-hidden rounded-xl bg-stone-200/70"
        style={{ height: `${layout.canvasHeightMobile}px` }}
      >
        {visibleItems.map((item) => (
          <div
            key={`mobile-${item.id}`}
            style={itemStyle(item, 'mobile')}
            className={cn('absolute overflow-hidden rounded-lg bg-stone-300', itemClassName)}
          >
            <SiteImage
              src={item.src}
              alt={item.alt || 'Gallery image'}
              fill
              loading="lazy"
              sizes={imageSizes(item)}
              className="select-none"
              style={imageStyle(item, 'mobile')}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
