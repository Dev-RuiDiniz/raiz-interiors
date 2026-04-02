import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { LegalClient } from '../privacy/legal-client'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)
  const legal = dict.legal.terms

  return (
    <LegalClient 
      title={legal.title}
      description={legal.description}
      sections={legal.sections}
    />
  )
}
