import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ProjectDetailClient } from './project-detail-client'
import { getProjectDetailContent, getProjectsContent } from '@/lib/cms/content-service'

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

const hiddenProjectSlugs = new Set(['young-soul-city-apartment'])

type ProjectSummary = {
  slug: string
  title: string
}

function getAdjacentProjects(slug: string, projects: ProjectSummary[], dict: any) {
  const visibleProjects = projects.filter((project) => !hiddenProjectSlugs.has(project.slug))
  const index = visibleProjects.findIndex((project) => project.slug === slug)

  const getLocalizedTitle = (project: ProjectSummary | null) => {
    if (!project) return null
    const projectDict = dict.projects.list[project.slug as keyof typeof dict.projects.list]
    return projectDict?.title || project.title
  }

  const prev = index > 0 ? visibleProjects[index - 1] : null
  const next = index >= 0 && index < visibleProjects.length - 1 ? visibleProjects[index + 1] : null

  return {
    prev: prev ? { slug: prev.slug, title: getLocalizedTitle(prev)! } : null,
    next: next ? { slug: next.slug, title: getLocalizedTitle(next)! } : null,
  }
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { locale, slug } = await params
  const localeValue = locale as Locale
  const dict = await getDictionary(localeValue)
  const preferDictionary = localeValue === 'pt'
  const [baseProject, projects] = await Promise.all([
    getProjectDetailContent(slug),
    getProjectsContent(),
  ])

  const listDict = dict.projects.list[slug as keyof typeof dict.projects.list]
  const detailDict = dict.projects.detail.items[slug as keyof typeof dict.projects.detail.items] as any

  const localizedProject = {
    ...baseProject,
    images: baseProject.images,
    title: preferDictionary ? listDict?.title || baseProject.title : baseProject.title || listDict?.title || '',
    subtitle:
      preferDictionary
        ? listDict?.subtitle !== undefined
          ? listDict.subtitle
          : baseProject.subtitle
        : baseProject.subtitle || listDict?.subtitle || '',
    location: preferDictionary ? listDict?.location || baseProject.location : baseProject.location || listDict?.location || '',
    category: localizeCategory(localeValue, baseProject.category),
    client: localizeClient(localeValue, baseProject.client),
    description: preferDictionary ? detailDict?.description || baseProject.description : baseProject.description || detailDict?.description || '',
    credits:
      preferDictionary
        ? detailDict?.credits !== undefined
          ? detailDict.credits
          : baseProject.credits
        : baseProject.credits || detailDict?.credits || '',
    photography:
      preferDictionary
        ? detailDict?.photography !== undefined
          ? detailDict.photography
          : baseProject.photography
        : baseProject.photography || detailDict?.photography || '',
  }

  const adjacent = getAdjacentProjects(
    slug,
    projects.map((project) => ({ slug: project.slug, title: project.title })),
    dict
  )

  return (
    <ProjectDetailClient
      locale={locale}
      dict={dict.projects.detail}
      project={localizedProject}
      adjacent={adjacent}
    />
  )
}
