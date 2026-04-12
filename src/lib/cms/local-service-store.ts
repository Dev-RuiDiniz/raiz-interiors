import { randomUUID } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defaultServiceDetails, defaultServices } from '@/lib/cms/default-services'
import type { servicePayloadSchema } from '@/lib/cms/admin-schemas'
import type { z } from 'zod'

type ServicePayload = z.infer<typeof servicePayloadSchema>

export interface LocalServiceRecord {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  coverImage: string
  icon: string
  features: string[]
  order: number
  status: ServicePayload['status']
  active: boolean
  images: string[]
  createdAt: string
  updatedAt: string
}

const dataDir = join(process.cwd(), 'data')
const storePath = join(dataDir, 'admin-services.json')

function toIsoNow() {
  return new Date().toISOString()
}

function createSeedServices(): LocalServiceRecord[] {
  const now = toIsoNow()

  return defaultServices.map((service) => {
    const detail = defaultServiceDetails[service.slug]

    return {
      id: service.id,
      slug: service.slug,
      title: detail?.title || service.title,
      subtitle: detail?.subtitle || service.excerpt,
      description: detail?.description || service.excerpt,
      coverImage: service.image,
      icon: '',
      features: detail?.features || [],
      order: service.order,
      status: detail?.status || service.status,
      active: (detail?.status || service.status) === 'PUBLISHED',
      images: detail?.images || [],
      createdAt: now,
      updatedAt: now,
    }
  })
}

function sanitizeRecord(input: unknown): LocalServiceRecord | null {
  if (!input || typeof input !== 'object') return null
  const value = input as Record<string, unknown>
  if (typeof value.id !== 'string' || typeof value.slug !== 'string') return null

  const now = toIsoNow()

  return {
    id: value.id,
    slug: value.slug,
    title: String(value.title || ''),
    subtitle: String(value.subtitle || ''),
    description: String(value.description || ''),
    coverImage: String(value.coverImage || ''),
    icon: String(value.icon || ''),
    features: Array.isArray(value.features)
      ? value.features.map((item) => String(item)).filter(Boolean)
      : [],
    order: Number.isFinite(value.order) ? Number(value.order) : 0,
    status: (value.status as ServicePayload['status']) || 'DRAFT',
    active:
      typeof value.active === 'boolean'
        ? value.active
        : (value.status as ServicePayload['status']) === 'PUBLISHED',
    images: Array.isArray(value.images)
      ? value.images.map((item) => String(item)).filter(Boolean)
      : [],
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : now,
  }
}

async function readStore(): Promise<LocalServiceRecord[]> {
  try {
    const raw = await readFile(storePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown

    if (!Array.isArray(parsed)) return createSeedServices()

    const records = parsed
      .map(sanitizeRecord)
      .filter((record): record is LocalServiceRecord => Boolean(record))

    return records.length ? records : createSeedServices()
  } catch {
    return createSeedServices()
  }
}

async function writeStore(records: LocalServiceRecord[]) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(storePath, JSON.stringify(records, null, 2), 'utf8')
}

function sortRecords(records: LocalServiceRecord[]) {
  return [...records].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

function resolveFallbackSlugFromLegacyId(id: string): string | null {
  const fallback = defaultServices.find((service) => service.id === id)
  return fallback?.slug || null
}

export async function getLocalServices() {
  return sortRecords(await readStore())
}

export async function getLocalServiceBySlug(slug: string) {
  const records = await readStore()
  return records.find((record) => record.slug === slug) || null
}

export async function getLocalServiceByIdOrFallbackSlug(id: string) {
  const records = await readStore()
  const byId = records.find((record) => record.id === id)
  if (byId) return byId

  const fallbackSlug = resolveFallbackSlugFromLegacyId(id)
  if (!fallbackSlug) return null

  return records.find((record) => record.slug === fallbackSlug) || null
}

export async function createLocalService(payload: ServicePayload) {
  const records = await readStore()
  const now = toIsoNow()

  const created: LocalServiceRecord = {
    id: randomUUID(),
    slug: payload.slug,
    title: payload.title,
    subtitle: payload.subtitle || '',
    description: payload.description || '',
    coverImage: payload.coverImage || '',
    icon: payload.icon || '',
    features: payload.features || [],
    order: payload.order,
    status: payload.status,
    active: payload.active,
    images: payload.images?.map((image) => image.url).filter(Boolean) || [],
    createdAt: now,
    updatedAt: now,
  }

  const next = sortRecords([...records.filter((record) => record.slug !== created.slug), created])
  await writeStore(next)
  return created
}

export async function upsertLocalServiceByIdOrFallbackSlug(id: string, payload: ServicePayload) {
  const records = await readStore()
  const existing = records.find((record) => record.id === id)
  const fallbackSlug = resolveFallbackSlugFromLegacyId(id)
  const fallback =
    !existing && fallbackSlug ? records.find((record) => record.slug === fallbackSlug) : null
  const target = existing || fallback
  const now = toIsoNow()

  if (!target) {
    return createLocalService(payload)
  }

  const updated: LocalServiceRecord = {
    ...target,
    slug: payload.slug,
    title: payload.title,
    subtitle: payload.subtitle || '',
    description: payload.description || '',
    coverImage: payload.coverImage || '',
    icon: payload.icon || '',
    features: payload.features || [],
    order: payload.order,
    status: payload.status,
    active: payload.active,
    images: payload.images?.map((image) => image.url).filter(Boolean) || [],
    updatedAt: now,
  }

  const next = sortRecords(
    records
      .filter((record) => record.id !== target.id)
      .filter((record) => record.slug !== updated.slug || record.id === updated.id)
      .concat(updated)
  )

  await writeStore(next)
  return updated
}

export async function deleteLocalServiceByIdOrFallbackSlug(id: string) {
  const records = await readStore()
  const existing = records.find((record) => record.id === id)
  const fallbackSlug = resolveFallbackSlugFromLegacyId(id)
  const fallback =
    !existing && fallbackSlug ? records.find((record) => record.slug === fallbackSlug) : null
  const target = existing || fallback

  if (!target) return false

  const next = records.filter((record) => record.id !== target.id)
  await writeStore(next)
  return true
}
