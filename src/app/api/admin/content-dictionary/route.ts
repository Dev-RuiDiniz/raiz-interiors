import { NextRequest, NextResponse } from 'next/server'
import { Locale, locales } from '@/i18n/config'
import { getAdminSession } from '@/lib/admin-auth'
import {
  getDraftDictionaryForLocale,
  publishDictionaryForLocale,
  saveDraftDictionaryForLocale,
} from '@/lib/cms/content-dictionary-service'

export const runtime = 'nodejs'

function forbidden() {
  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
}

function badRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 })
}

function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && locales.includes(value as Locale)
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return forbidden()

  const locale = request.nextUrl.searchParams.get('locale')
  if (!isLocale(locale)) {
    return badRequest('A valid locale is required.')
  }

  const entry = await getDraftDictionaryForLocale(locale)

  return NextResponse.json({
    locale,
    draft: entry.draft,
    published: entry.published,
    updatedAt: entry.updatedAt,
    publishedAt: entry.publishedAt,
  })
}

export async function PUT(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return forbidden()

  const body = await request.json().catch(() => null)
  const locale = body?.locale
  const draft = body?.draft

  if (!isLocale(locale)) {
    return badRequest('A valid locale is required.')
  }

  if (!isObject(draft)) {
    return badRequest('draft object is required.')
  }

  const entry = await saveDraftDictionaryForLocale(locale, draft)

  return NextResponse.json({
    success: true,
    locale,
    updatedAt: entry.updatedAt,
  })
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return forbidden()

  const body = await request.json().catch(() => null)
  const locale = body?.locale
  const action = body?.action

  if (!isLocale(locale)) {
    return badRequest('A valid locale is required.')
  }

  if (action !== 'publish') {
    return badRequest('Unsupported action.')
  }

  const entry = await publishDictionaryForLocale(locale)
  return NextResponse.json({
    success: true,
    locale,
    publishedAt: entry.publishedAt,
  })
}
