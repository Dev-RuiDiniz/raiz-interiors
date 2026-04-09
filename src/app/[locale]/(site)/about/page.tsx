/*
Arquivo: src/app/(site)/about/page.tsx
Objetivo: Pagina publica do site (rota App Router).
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import { getPublishedPageLayout } from '@/lib/cms/page-layout-service'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { AboutClient } from './about-client'

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  const aboutDict = dict.about

  const { layout: heroLayout } = await getPublishedPageLayout('about', 'hero_image')
  const { layout: founderLayout } = await getPublishedPageLayout('about', 'founder_image')
  
  const heroImage = heroLayout.items[0]?.src || '/2026/about_us/live_beautiful_interior_design_by_raiz.jpg'
  const founderImage = founderLayout.items[0]?.src || '/2026/about_us/img_3574.jpg'

  return (
    <AboutClient 
      locale={locale} 
      aboutDict={aboutDict} 
      heroImage={heroImage} 
      founderImage={founderImage} 
    />
  )
}
