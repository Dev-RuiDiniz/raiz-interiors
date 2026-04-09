import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Locale, locales } from '@/i18n/config'
import { deepMergeDictionary } from '@/lib/cms/dictionary-utils'

type JsonRecord = Record<string, unknown>

interface LocaleDictionaryEntry {
  draft: JsonRecord
  published: JsonRecord
  updatedAt: string | null
  publishedAt: string | null
}

type DictionaryStore = Record<Locale, LocaleDictionaryEntry>

const dataDir = join(process.cwd(), 'data')
const storePath = join(dataDir, 'admin-content-dictionary.json')

function emptyEntry(): LocaleDictionaryEntry {
  return {
    draft: {},
    published: {},
    updatedAt: null,
    publishedAt: null,
  }
}

function createEmptyStore(): DictionaryStore {
  return {
    en: emptyEntry(),
    pt: emptyEntry(),
  }
}

function isPlainObject(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeEntry(value: unknown): LocaleDictionaryEntry {
  if (!isPlainObject(value)) return emptyEntry()

  const draft = isPlainObject(value.draft) ? value.draft : {}
  const published = isPlainObject(value.published) ? value.published : {}

  return {
    draft,
    published,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : null,
    publishedAt: typeof value.publishedAt === 'string' ? value.publishedAt : null,
  }
}

export async function readDictionaryStore(): Promise<DictionaryStore> {
  try {
    const raw = await readFile(storePath, 'utf8')
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const fallback = createEmptyStore()

    for (const locale of locales) {
      fallback[locale] = sanitizeEntry(parsed?.[locale])
    }

    return fallback
  } catch {
    return createEmptyStore()
  }
}

async function writeDictionaryStore(store: DictionaryStore) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(storePath, JSON.stringify(store, null, 2), 'utf8')
}

export async function getDraftDictionaryForLocale(locale: Locale): Promise<LocaleDictionaryEntry> {
  const store = await readDictionaryStore()
  return store[locale]
}

export async function saveDraftDictionaryForLocale(locale: Locale, draft: JsonRecord) {
  const store = await readDictionaryStore()
  store[locale] = {
    ...store[locale],
    draft,
    updatedAt: new Date().toISOString(),
  }
  await writeDictionaryStore(store)
  return store[locale]
}

export async function publishDictionaryForLocale(locale: Locale) {
  const store = await readDictionaryStore()
  store[locale] = {
    ...store[locale],
    published: store[locale].draft || {},
    publishedAt: new Date().toISOString(),
  }
  await writeDictionaryStore(store)
  return store[locale]
}

export async function applyPublishedDictionaryOverrides<T>(locale: Locale, baseDictionary: T): Promise<T> {
  const store = await readDictionaryStore()
  const published = store[locale]?.published || {}
  return deepMergeDictionary(baseDictionary, published)
}
