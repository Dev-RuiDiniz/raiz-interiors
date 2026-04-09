export const locales = ['en', 'pt'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const localeCookieName = 'raiz_locale'
export const localeCookieMaxAge = 60 * 60 * 24 * 365

export const isLocale = (value: string): value is Locale => {
  return locales.includes(value as Locale)
}
