'use client'

import { Hero } from '@/components/sections/hero'
import { defaultHeroSlides } from '@/lib/cms/default-layouts'
import { usePageLayout } from '@/lib/cms/use-page-layout'

import { Locale } from '@/i18n/config'

interface ManagedHeroProps {
  dict: any // hero dictionary slice
  locale: Locale
}

export function ManagedHero({ dict, locale }: ManagedHeroProps) {
  const { layout } = usePageLayout('home', 'hero_slides')

  const slides = layout.items.length
    ? layout.items
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((item, index) => {
          const fallback = defaultHeroSlides[index % defaultHeroSlides.length]
          const dictKey = `slide${(index % 6) + 1}`
          const slideDict = dict[dictKey] || fallback

          return {
            id: item.id,
            image: item.src,
            line1: slideDict.line1 || item.alt || fallback.line1,
            line2: slideDict.line2 || fallback.line2,
            link: `/${locale}${fallback.link}`,
          }
        })
    : defaultHeroSlides.map((slide, index) => {
        const dictKey = `slide${index + 1}`
        const slideDict = dict[dictKey] || slide
        return {
          ...slide,
          line1: slideDict.line1,
          line2: slideDict.line2,
          link: `/${locale}${slide.link}`,
        }
      })

  return <Hero slides={slides} />
}
