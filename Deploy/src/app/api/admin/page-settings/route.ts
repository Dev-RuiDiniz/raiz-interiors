import { NextRequest, NextResponse } from 'next/server'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'

interface PageSettingsEntry {
  draft: Record<string, string>
  published: Record<string, string>
  updatedAt: string | null
  publishedAt: string | null
}

type PageSettingsMap = Record<string, PageSettingsEntry>
type LegacyPageSettingsMap = Record<string, Record<string, string>>

const settingsDir = join(process.cwd(), 'data')
const settingsPath = join(settingsDir, 'admin-page-settings.json')

function forbidden() {
  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
}

async function readSettings(): Promise<PageSettingsMap> {
  try {
    const content = await readFile(settingsPath, 'utf8')
    const parsed = JSON.parse(content) as PageSettingsMap | LegacyPageSettingsMap

    const migrated: PageSettingsMap = {}
    for (const [pageId, value] of Object.entries(parsed)) {
      const candidate = value as Partial<PageSettingsEntry>
      if (
        candidate &&
        typeof candidate === 'object' &&
        'draft' in candidate &&
        'published' in candidate
      ) {
        migrated[pageId] = {
          draft: candidate.draft || {},
          published: candidate.published || {},
          updatedAt: candidate.updatedAt || null,
          publishedAt: candidate.publishedAt || null,
        }
      } else {
        migrated[pageId] = {
          draft: (value as Record<string, string>) || {},
          published: (value as Record<string, string>) || {},
          updatedAt: null,
          publishedAt: null,
        }
      }
    }
    return migrated
  } catch {
    return {}
  }
}

async function writeSettings(settings: PageSettingsMap) {
  await mkdir(settingsDir, { recursive: true })
  await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8')
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return forbidden()

  const pageId = request.nextUrl.searchParams.get('pageId')
  if (!pageId) {
    return NextResponse.json({ error: 'pageId is required.' }, { status: 400 })
  }

  const settings = await readSettings()
  const entry = settings[pageId] || {
    draft: {},
    published: {},
    updatedAt: null,
    publishedAt: null,
  }
  return NextResponse.json({
    pageId,
    values: entry.draft,
    draft: entry.draft,
    published: entry.published,
    updatedAt: entry.updatedAt,
    publishedAt: entry.publishedAt,
  })
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return forbidden()

  try {
    const body = await request.json()
    const pageId = body?.pageId
    const values = body?.values

    if (!pageId || typeof pageId !== 'string') {
      return NextResponse.json({ error: 'pageId is required.' }, { status: 400 })
    }

    if (!values || typeof values !== 'object') {
      return NextResponse.json({ error: 'values object is required.' }, { status: 400 })
    }

    const settings = await readSettings()
    const existing = settings[pageId] || {
      draft: {},
      published: {},
      updatedAt: null,
      publishedAt: null,
    }
    settings[pageId] = {
      ...existing,
      draft: values as Record<string, string>,
      updatedAt: new Date().toISOString(),
    }
    await writeSettings(settings)

    return NextResponse.json({ success: true, pageId })
  } catch (error) {
    console.error('Failed to update page settings:', error)
    return NextResponse.json({ error: 'Failed to save page settings.' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return forbidden()

  try {
    const body = await request.json()
    const pageId = body?.pageId
    const action = body?.action

    if (!pageId || typeof pageId !== 'string') {
      return NextResponse.json({ error: 'pageId is required.' }, { status: 400 })
    }

    if (action !== 'publish') {
      return NextResponse.json({ error: 'Unsupported action.' }, { status: 400 })
    }

    const settings = await readSettings()
    const existing = settings[pageId] || {
      draft: {},
      published: {},
      updatedAt: null,
      publishedAt: null,
    }

    settings[pageId] = {
      ...existing,
      published: existing.draft || {},
      publishedAt: new Date().toISOString(),
    }
    await writeSettings(settings)

    return NextResponse.json({
      success: true,
      pageId,
      publishedAt: settings[pageId].publishedAt,
    })
  } catch (error) {
    console.error('Failed to publish page settings:', error)
    return NextResponse.json({ error: 'Failed to publish page settings.' }, { status: 500 })
  }
}
