import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { defaultLocale, isLocale } from '@/i18n/config'

export const metadata: Metadata = {
  title: 'Redirecting | RAIZ Interiors',
  description: 'Redirecting to the RAIZ Interiors homepage.',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function LanguagePage({
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const cookieStore = await cookies()
  const cookieLocale = cookieStore.get('raiz_locale')?.value
  const locale = cookieLocale && isLocale(cookieLocale) ? cookieLocale : defaultLocale

  redirect(`/${locale}`)
}
