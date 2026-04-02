import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ProjectDetailClient } from './project-detail-client'
import { defaultProjectDetails, defaultProjects } from '@/lib/cms/default-projects'

interface PageProps {
  params: Promise<{ locale: string; slug: string }>
}

const categoryTranslations = {
  en: {
    RESIDENTIAL: 'Residential',
    COMMERCIAL: 'Commercial',
    HOSPITALITY: 'Hospitality',
    RETAIL: 'Retail',
  },
  pt: {
    RESIDENTIAL: 'Residencial',
    COMMERCIAL: 'Comercial',
    HOSPITALITY: 'Hotelaria',
    RETAIL: 'Retalho',
  },
} as const

const clientTranslations = {
  en: {
    'Private Client': 'Private Client',
  },
  pt: {
    'Private Client': 'Cliente Privado',
  },
} as const

function localizeCategory(locale: Locale, value: string) {
  const localeMap = categoryTranslations[locale]
  const key = value as keyof typeof localeMap
  return localeMap[key] || value
}

function localizeClient(locale: Locale, value: string) {
  if (!value) return value
  const localeMap = clientTranslations[locale]
  return localeMap[value as keyof typeof localeMap] || value
}

function getAdjacentProjects(slug: string, dict: any) {
  const index = defaultProjects.findIndex((project) => project.slug === slug)
  
  const getLocalizedTitle = (project: (typeof defaultProjects)[number] | null) => {
    if (!project) return null
    const projectDict = dict.projects.list[project.slug as keyof typeof dict.projects.list]
    return projectDict?.title || project.title
  }

  const prev = index > 0 ? defaultProjects[index - 1] : null
  const next = index >= 0 && index < defaultProjects.length - 1 ? defaultProjects[index + 1] : null

  return {
    prev: prev ? { slug: prev.slug, title: getLocalizedTitle(prev)! } : null,
    next: next ? { slug: next.slug, title: getLocalizedTitle(next)! } : null,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const localeValue = locale as Locale
  const dict = await getDictionary(localeValue)

  // Get base data
  const baseProject = defaultProjectDetails[slug] || defaultProjectDetails['summer-house-comporta']
  
  // Get localized content from dictionary
  const listDict = dict.projects.list[slug as keyof typeof dict.projects.list]
  const detailDict = dict.projects.detail.items[slug as keyof typeof dict.projects.detail.items] as any

  const localizedProject = {
    ...baseProject,
    images: baseProject.images,
    title: listDict?.title || baseProject.title,
    subtitle: listDict?.subtitle !== undefined ? listDict.subtitle : baseProject.subtitle,
    location: listDict?.location || baseProject.location,
    category: localizeCategory(localeValue, baseProject.category),
    client: localizeClient(localeValue, baseProject.client),
    description: detailDict?.description || baseProject.description,
    credits: detailDict?.credits !== undefined ? detailDict.credits : baseProject.credits,
    photography: detailDict?.photography !== undefined ? detailDict.photography : baseProject.photography,
  }

  const adjacent = getAdjacentProjects(slug, dict)

  return (
    <ProjectDetailClient
      locale={locale}
      dict={dict.projects.detail}
      project={localizedProject}
      adjacent={adjacent}
    />
  )
}
