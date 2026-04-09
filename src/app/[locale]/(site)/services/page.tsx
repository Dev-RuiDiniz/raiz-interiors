import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ServicesClient } from './services-client'
import { getServicesContent } from '@/lib/cms/content-service'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeValue = locale as Locale
  const dict = await getDictionary(localeValue)
  const services = await getServicesContent()
  const preferDictionary = localeValue === 'pt'

  const localizedServices = services.map((service) => ({
    ...service,
    title: preferDictionary
      ? dict.services.list[service.slug as keyof typeof dict.services.list]?.title || service.title
      : service.title || dict.services.list[service.slug as keyof typeof dict.services.list]?.title || '',
    excerpt: preferDictionary
      ? dict.services.list[service.slug as keyof typeof dict.services.list]?.excerpt || service.excerpt
      : service.excerpt || dict.services.list[service.slug as keyof typeof dict.services.list]?.excerpt || '',
  }))

  return (
    <ServicesClient
      locale={locale}
      dict={dict.services}
      services={localizedServices}
    />
  )
}
