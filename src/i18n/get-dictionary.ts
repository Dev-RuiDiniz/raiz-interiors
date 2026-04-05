import type { Locale } from './config'
import { applyPublishedDictionaryOverrides } from '@/lib/cms/content-dictionary-service'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  pt: () => import('./dictionaries/pt.json').then((module) => module.default),
}

export const getDictionary = async (locale: Locale) => {
  const baseDictionary = await (dictionaries[locale] ? dictionaries[locale]() : dictionaries.en())
  return applyPublishedDictionaryOverrides(locale, baseDictionary)
}
