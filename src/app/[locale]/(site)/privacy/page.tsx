import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { LegalClient } from './legal-client'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  const legal = dict.legal.privacy

  return (
    <LegalClient 
      title={legal.title}
      description={legal.description}
      sections={legal.sections}
    />
  )
}
