import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { adminPageEditorConfigs } from '@/lib/admin-page-configs'
import type { Locale } from '@/i18n/config'

export interface ProjectsPageSettings {
  projects_heading: string
  projects_description: string
  filter_all: string
  filter_residential: string
  filter_commercial: string
  projects_cta_title: string
  projects_cta_button: string
  projects_cta_url: string
  projects_background_image: string
  projects_background_color: string
  projects_title_color: string
  projects_badge_color: string
  [key: string]: string
}

interface PageSettingsEntry {
  draft?: Record<string, string>
  published?: Record<string, string>
}

type PageSettingsMap = Record<string, PageSettingsEntry>

const settingsPath = join(process.cwd(), 'data', 'admin-page-settings.json')

function getProjectsDefaults() {
  const config = adminPageEditorConfigs.projects
  const defaults: Record<string, string> = {}

  for (const section of config.sections) {
    for (const field of section.fields) {
      if (typeof field.defaultValue === 'string') {
        defaults[field.id] = field.defaultValue
      }
    }
  }

  return defaults
}

async function readSettings(): Promise<PageSettingsMap> {
  try {
    const content = await readFile(settingsPath, 'utf8')
    return JSON.parse(content) as PageSettingsMap
  } catch {
    return {}
  }
}

function cleanValue(value: string | undefined | null) {
  if (typeof value !== 'string') return ''
  return value.trim()
}

function getLocalizedValue(
  published: Record<string, string>,
  defaults: Record<string, string>,
  baseKey: string,
  locale: Locale
) {
  const localizedKey = `${baseKey}_${locale}`
  return cleanValue(published[localizedKey]) || defaults[localizedKey] || ''
}

export async function getPublishedProjectsSettings(locale: Locale): Promise<ProjectsPageSettings> {
  const defaults = getProjectsDefaults()
  const settings = await readSettings()
  const published = settings.projects?.published || {}

  return {
    projects_heading: getLocalizedValue(published, defaults, 'projects_heading', locale),
    projects_description: getLocalizedValue(published, defaults, 'projects_description', locale),
    filter_all: getLocalizedValue(published, defaults, 'filter_all', locale),
    filter_residential: getLocalizedValue(published, defaults, 'filter_residential', locale),
    filter_commercial: getLocalizedValue(published, defaults, 'filter_commercial', locale),
    projects_cta_title: getLocalizedValue(published, defaults, 'projects_cta_title', locale),
    projects_cta_button: getLocalizedValue(published, defaults, 'projects_cta_button', locale),
    projects_cta_url: cleanValue(published.projects_cta_url) || defaults.projects_cta_url || '/contact',
    projects_background_image: cleanValue(published.projects_background_image) || defaults.projects_background_image || '',
    projects_background_color: cleanValue(published.projects_background_color) || defaults.projects_background_color || '#e3dfdd',
    projects_title_color: cleanValue(published.projects_title_color) || defaults.projects_title_color || '#1c1917',
    projects_badge_color: cleanValue(published.projects_badge_color) || defaults.projects_badge_color || '#44403c',
  }
}
