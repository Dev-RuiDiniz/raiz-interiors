import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export interface PageSettingsEntry {
  draft: Record<string, string>
  published: Record<string, string>
  updatedAt: string | null
  publishedAt: string | null
}

export type PageSettingsMap = Record<string, PageSettingsEntry>
export type LegacyPageSettingsMap = Record<string, Record<string, string>>

const settingsDir = join(process.cwd(), 'data')
const settingsPath = join(settingsDir, 'admin-page-settings.json')

export async function readPageSettingsFile(): Promise<PageSettingsMap> {
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

export async function writePageSettingsFile(settings: PageSettingsMap) {
  await mkdir(settingsDir, { recursive: true })
  await writeFile(settingsPath, JSON.stringify(settings, null, 2), 'utf8')
}