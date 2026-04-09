import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defaultProjectDetails, defaultProjects } from '@/lib/cms/default-projects'
import type { projectPayloadSchema } from '@/lib/cms/admin-schemas'
import type { z } from 'zod'

type ProjectPayload = z.infer<typeof projectPayloadSchema>

export interface LocalProjectRecord {
  id: string
  slug: string
  title: string
  subtitle: string
  location: string
  category: ProjectPayload['category']
  status: ProjectPayload['status']
  description: string
  coverImage: string
  year: string
  client: string
  area: string
  credits: string
  featured: boolean
  order: number
  images: string[]
  createdAt: string
  updatedAt: string
}

const dataDir = join(process.cwd(), 'data')
const storePath = join(dataDir, 'admin-projects.json')

function toIsoNow() {
  return new Date().toISOString()
}

function createSeedProjects(): LocalProjectRecord[] {
  const now = toIsoNow()
  return defaultProjects.map((project) => {
    const detail = defaultProjectDetails[project.slug]
    return {
      id: project.id,
      slug: project.slug,
      title: detail?.title || project.title,
      subtitle: detail?.subtitle || project.subtitle || '',
      location: detail?.location || project.location,
      category: (detail?.category || project.category) as ProjectPayload['category'],
      status: project.status as ProjectPayload['status'],
      description: detail?.description || '',
      coverImage: detail?.coverImage || project.coverImage,
      year: detail?.year || '',
      client: detail?.client || '',
      area: '',
      credits: detail?.credits || '',
      featured: project.status === 'PUBLISHED',
      order: project.order,
      images: detail?.images || [],
      createdAt: now,
      updatedAt: now,
    }
  })
}

function sanitizeRecord(input: unknown): LocalProjectRecord | null {
  if (!input || typeof input !== 'object') return null
  const value = input as Record<string, unknown>
  if (typeof value.id !== 'string' || typeof value.slug !== 'string') return null

  const now = toIsoNow()
  return {
    id: value.id,
    slug: value.slug,
    title: String(value.title || ''),
    subtitle: String(value.subtitle || ''),
    location: String(value.location || ''),
    category: (value.category as ProjectPayload['category']) || 'RESIDENTIAL',
    status: (value.status as ProjectPayload['status']) || 'DRAFT',
    description: String(value.description || ''),
    coverImage: String(value.coverImage || ''),
    year: String(value.year || ''),
    client: String(value.client || ''),
    area: String(value.area || ''),
    credits: String(value.credits || ''),
    featured: Boolean(value.featured),
    order: Number.isFinite(value.order) ? Number(value.order) : 0,
    images: Array.isArray(value.images) ? value.images.map((item) => String(item)).filter(Boolean) : [],
    createdAt: typeof value.createdAt === 'string' ? value.createdAt : now,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : now,
  }
}

async function readStore(): Promise<LocalProjectRecord[]> {
  try {
    const raw = await readFile(storePath, 'utf8')
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return createSeedProjects()
    const records = parsed.map(sanitizeRecord).filter((record): record is LocalProjectRecord => Boolean(record))
    return records.length ? records : createSeedProjects()
  } catch {
    return createSeedProjects()
  }
}

async function writeStore(records: LocalProjectRecord[]) {
  await mkdir(dataDir, { recursive: true })
  await writeFile(storePath, JSON.stringify(records, null, 2), 'utf8')
}

function sortRecords(records: LocalProjectRecord[]) {
  return [...records].sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
}

function resolveFallbackSlugFromLegacyId(id: string): string | null {
  const fallback = defaultProjects.find((project) => project.id === id)
  return fallback?.slug || null
}

export async function getLocalProjects() {
  return sortRecords(await readStore())
}

export async function getLocalProjectBySlug(slug: string) {
  const records = await readStore()
  return records.find((record) => record.slug === slug) || null
}

export async function getLocalProjectByIdOrFallbackSlug(id: string) {
  const records = await readStore()
  const byId = records.find((record) => record.id === id)
  if (byId) return byId

  const fallbackSlug = resolveFallbackSlugFromLegacyId(id)
  if (!fallbackSlug) return null
  return records.find((record) => record.slug === fallbackSlug) || null
}

export async function createLocalProject(payload: ProjectPayload) {
  const records = await readStore()
  const now = toIsoNow()
  const created: LocalProjectRecord = {
    id: crypto.randomUUID(),
    slug: payload.slug,
    title: payload.title,
    subtitle: payload.subtitle || '',
    location: payload.location,
    category: payload.category,
    status: payload.status,
    description: payload.description || '',
    coverImage: payload.coverImage,
    year: payload.year || '',
    client: payload.client || '',
    area: payload.area || '',
    credits: payload.credits || '',
    featured: payload.featured,
    order: payload.order,
    images: payload.images?.map((image) => image.url).filter(Boolean) || [],
    createdAt: now,
    updatedAt: now,
  }

  const next = sortRecords([...records.filter((record) => record.slug !== created.slug), created])
  await writeStore(next)
  return created
}

export async function upsertLocalProjectByIdOrFallbackSlug(id: string, payload: ProjectPayload) {
  const records = await readStore()
  const existing = records.find((record) => record.id === id)
  const fallbackSlug = resolveFallbackSlugFromLegacyId(id)
  const fallback = !existing && fallbackSlug
    ? records.find((record) => record.slug === fallbackSlug)
    : null
  const target = existing || fallback
  const now = toIsoNow()

  if (!target) {
    return createLocalProject(payload)
  }

  const updated: LocalProjectRecord = {
    ...target,
    slug: payload.slug,
    title: payload.title,
    subtitle: payload.subtitle || '',
    location: payload.location,
    category: payload.category,
    status: payload.status,
    description: payload.description || '',
    coverImage: payload.coverImage,
    year: payload.year || '',
    client: payload.client || '',
    area: payload.area || '',
    credits: payload.credits || '',
    featured: payload.featured,
    order: payload.order,
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

export async function deleteLocalProjectByIdOrFallbackSlug(id: string) {
  const records = await readStore()
  const existing = records.find((record) => record.id === id)
  const fallbackSlug = resolveFallbackSlugFromLegacyId(id)
  const fallback = !existing && fallbackSlug
    ? records.find((record) => record.slug === fallbackSlug)
    : null
  const target = existing || fallback
  if (!target) return false

  const next = records.filter((record) => record.id !== target.id)
  await writeStore(next)
  return true
}
