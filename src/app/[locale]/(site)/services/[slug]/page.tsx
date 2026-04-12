import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ServiceDetailClient } from './service-detail-client'
import { getServiceDetailContent } from '@/lib/cms/content-service'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const localeValue = locale as Locale
  const dict = await getDictionary(localeValue)
  const baseService = await getServiceDetailContent(slug)
  const preferDictionary = localeValue === 'pt'

  const detailDict = dict.services.detail as any
  const itemDict = detailDict.items[slug]

  const localizedService = {
    ...baseService,
    title: preferDictionary ? itemDict?.title || baseService.title : baseService.title || itemDict?.title || '',
    subtitle: preferDictionary ? itemDict?.subtitle || baseService.subtitle : baseService.subtitle || itemDict?.subtitle || '',
    description:
      preferDictionary
        ? itemDict?.description || baseService.description
        : baseService.description || itemDict?.description || '',
    features:
      preferDictionary
        ? itemDict?.features || baseService.features
        : (baseService.features?.length ? baseService.features : itemDict?.features) || [],
  }

  if (!localizedService.title || localizedService.title === baseService.title) {
     localizedService.title = dict.services.list[slug as keyof typeof dict.services.list]?.title || baseService.title
  }

  return (
    <ServiceDetailClient
      locale={locale}
      dict={dict.services.detail}
      service={localizedService}
    />
  )
}
