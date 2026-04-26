import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { adminPageEditorConfigs } from '@/lib/admin-page-configs'
import type { Locale } from '@/i18n/config'

export interface HomePageSettings {
  hero_slide1_line1: string
  hero_slide1_line2: string
  hero_slide2_line1: string
  hero_slide2_line2: string
  hero_slide3_line1: string
  hero_slide3_line2: string
  hero_slide4_line1: string
  hero_slide4_line2: string
  hero_slide5_line1: string
  hero_slide5_line2: string
  hero_slide6_line1: string
  hero_slide6_line2: string
  intro_text: string
  featured_title: string
  featured_cta_label: string
  featured_cta_url: string
  services_preview_title: string
  services_preview_text: string
  services_preview_cta_label: string
  services_preview_cta_url: string
  about_preview_text: string
  about_preview_cta_label: string
  about_preview_cta_url: string
  home_background_image: string
  home_background_color: string
  home_text_color: string
  home_overlay_color: string
  [key: string]: string
}

interface PageSettingsEntry {
  draft?: Record<string, string>
  published?: Record<string, string>
}

type PageSettingsMap = Record<string, PageSettingsEntry>

const settingsPath = join(process.cwd(), 'data', 'admin-page-settings.json')

function getHomeDefaults() {
  const homeConfig = adminPageEditorConfigs.home
  const defaults: Record<string, string> = {}

  for (const section of homeConfig.sections) {
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

export async function getPublishedHomeSettings(locale: Locale): Promise<HomePageSettings> {
  const defaults = getHomeDefaults()
  const settings = await readSettings()
  const published = settings.home?.published || {}

  return {
    hero_slide1_line1: getLocalizedValue(published, defaults, 'hero_slide1_line1', locale),
    hero_slide1_line2: getLocalizedValue(published, defaults, 'hero_slide1_line2', locale),
    hero_slide2_line1: getLocalizedValue(published, defaults, 'hero_slide2_line1', locale),
    hero_slide2_line2: getLocalizedValue(published, defaults, 'hero_slide2_line2', locale),
    hero_slide3_line1: getLocalizedValue(published, defaults, 'hero_slide3_line1', locale),
    hero_slide3_line2: getLocalizedValue(published, defaults, 'hero_slide3_line2', locale),
    hero_slide4_line1: getLocalizedValue(published, defaults, 'hero_slide4_line1', locale),
    hero_slide4_line2: getLocalizedValue(published, defaults, 'hero_slide4_line2', locale),
    hero_slide5_line1: getLocalizedValue(published, defaults, 'hero_slide5_line1', locale),
    hero_slide5_line2: getLocalizedValue(published, defaults, 'hero_slide5_line2', locale),
    hero_slide6_line1: getLocalizedValue(published, defaults, 'hero_slide6_line1', locale),
    hero_slide6_line2: getLocalizedValue(published, defaults, 'hero_slide6_line2', locale),
    intro_text: getLocalizedValue(published, defaults, 'intro_text', locale),
    featured_title: getLocalizedValue(published, defaults, 'featured_title', locale),
    featured_cta_label: getLocalizedValue(published, defaults, 'featured_cta_label', locale),
    featured_cta_url: cleanValue(published.featured_cta_url) || defaults.featured_cta_url || '/projects',
    services_preview_title: getLocalizedValue(published, defaults, 'services_preview_title', locale),
    services_preview_text: getLocalizedValue(published, defaults, 'services_preview_text', locale),
    services_preview_cta_label: getLocalizedValue(published, defaults, 'services_preview_cta_label', locale),
    services_preview_cta_url: cleanValue(published.services_preview_cta_url) || defaults.services_preview_cta_url || '/services',
    about_preview_text: getLocalizedValue(published, defaults, 'about_preview_text', locale),
    about_preview_cta_label: getLocalizedValue(published, defaults, 'about_preview_cta_label', locale),
    about_preview_cta_url: cleanValue(published.about_preview_cta_url) || defaults.about_preview_cta_url || '/about',
    home_background_image: cleanValue(published.home_background_image) || defaults.home_background_image || '',
    home_background_color: cleanValue(published.home_background_color) || defaults.home_background_color || '#e3dfdc',
    home_text_color: cleanValue(published.home_text_color) || defaults.home_text_color || '#ffffff',
    home_overlay_color: cleanValue(published.home_overlay_color) || defaults.home_overlay_color || '#000000',
  }
}
