import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ServiceDetailClient } from './service-detail-client'
import { defaultServiceDetails } from '@/lib/cms/default-services'

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const dict = await getDictionary(locale as Locale)

  // Use the dictionary to get localized details
  const detailDict = dict.services.detail as any
  const itemDict = detailDict.items[slug]
  
  // Fallback to default if not found (though dictionary should have all)
  const baseService = defaultServiceDetails[slug] || defaultServiceDetails['interior-design']
  
  const localizedService = {
    ...baseService,
    title: itemDict?.title || baseService.title, // Base service has title, dictionary has it in list.items too but better use consistent mapping
    subtitle: itemDict?.subtitle || baseService.subtitle,
    description: itemDict?.description || baseService.description,
    features: itemDict?.features || baseService.features,
  }
  
  // If the dictionary doesn't have the title in the detail.items section, 
  // we might want to grab it from services.list[slug].
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
