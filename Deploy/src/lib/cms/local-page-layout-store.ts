import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDefaultLayout } from '@/lib/cms/default-layouts'
import { normalizeGalleryLayout, type GalleryLayout } from '@/lib/cms/layout-types'

interface LocalPageLayoutRecord {
  pageKey: string
  sectionKey: string
  draft: GalleryLayout
  published: GalleryLayout
  updatedAt: string | null
  publishedAt: string | null
}

type LocalPageLayoutStore = Record<string, LocalPageLayoutRecord>

const dataDir = join(process.cwd(), 'data')
const storePath = join(dataDir, 'admin-page-layouts.json')

function buildStoreKey(pageKey: string, sectionKey: string) {
  return `${pageKey}::${sectionKey}`
}

function createDefaultRecord(pageKey: string, sectionKey: string): LocalPageLayoutRecord {
  const fallback = getDefaultLayout(pageKey, sectionKey)
  return {
    pageKey,
    sectionKey,
    draft: fallback,
    published: fallback,
    updatedAt: null,
    publishedAt: null,
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function sanitizeRecord(
  pageKey: string,
  sectionKey: string,
  input: unknown
): LocalPageLayoutRecord {
  const fallback = createDefaultRecord(pageKey, sectionKey)
  if (!isPlainObject(input)) return fallback

  return {
    pageKey,
    sectionKey,
    draft: normalizeGalleryLayout(input.draft),
    published: normalizeGalleryLayout(input.published),
    updatedAt: typeof input.updatedAt === 'string' ? input.updatedAt : null,
    publishedAt: typeof input.publishedAt === 'string' ? input.publishedAt : null,
  }
}

async function readStore(): Promise<LocalPageLayoutStore> {
  try {
    const raw = await readFile(storePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    return isPlainObject(parsed) ? (parsed as LocalPageLayoutStore) : {}
  } catch {
    return {}
  }
}

async function writeStore(store: LocalPageLayoutStore) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(storePath, JSON.stringify(store, null, 2), 'utf8')
}

export async function getLocalDraftAndPublishedPageLayout(pageKey: string, sectionKey: string) {
  const store = await readStore()
  const key = buildStoreKey(pageKey, sectionKey)
  const existing = store[key]
  const record = sanitizeRecord(pageKey, sectionKey, existing)
  return {
    draft: record.draft,
    published: record.published,
    updatedAt: record.updatedAt,
    publishedAt: record.publishedAt,
    exists: Boolean(existing),
  }
}

export async function getLocalPublishedPageLayout(pageKey: string, sectionKey: string) {
  const result = await getLocalDraftAndPublishedPageLayout(pageKey, sectionKey)
  return {
    layout: result.published,
    publishedAt: result.publishedAt ? new Date(result.publishedAt) : null,
    exists: result.exists,
  }
}

export async function upsertLocalPageLayoutDraft(
  pageKey: string,
  sectionKey: string,
  draft: unknown
) {
  const store = await readStore()
  const key = buildStoreKey(pageKey, sectionKey)
  const existing = sanitizeRecord(pageKey, sectionKey, store[key])

  const updated: LocalPageLayoutRecord = {
    ...existing,
    draft: normalizeGalleryLayout(draft),
    updatedAt: new Date().toISOString(),
  }

  store[key] = updated
  await writeStore(store)
  return updated
}

export async function publishLocalPageLayout(pageKey: string, sectionKey: string) {
  const store = await readStore()
  const key = buildStoreKey(pageKey, sectionKey)
  const existing = sanitizeRecord(pageKey, sectionKey, store[key])

  const published = normalizeGalleryLayout(existing.draft)
  const updated: LocalPageLayoutRecord = {
    ...existing,
    published,
    publishedAt: new Date().toISOString(),
  }

  store[key] = updated
  await writeStore(store)
  return updated
}
