import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ServicesClient } from './services-client'
import { defaultServices } from '@/lib/cms/default-services'

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  // Merge default services with localized titles and excerpts
  const localizedServices = defaultServices.map((service) => ({
    ...service,
    title: dict.services.list[service.slug as keyof typeof dict.services.list]?.title || service.title,
    excerpt: dict.services.list[service.slug as keyof typeof dict.services.list]?.excerpt || service.excerpt,
  }))

  return (
    <ServicesClient
      locale={locale}
      dict={dict.services}
      services={localizedServices}
    />
  )
}
