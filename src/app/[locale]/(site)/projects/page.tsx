import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ProjectsClient } from './projects-client'
import { getProjectsContent } from '@/lib/cms/content-service'
import { getPublishedProjectsSettings } from '@/lib/cms/projects-settings'

const hiddenProjectSlugs = new Set(['young-soul-city-apartment'])

const forcedProjectStatuses: Record<string, string> = {
  'beach-house-troia': 'WORK_IN_PROGRESS',
  'pombaline-restoration-principe-real': 'WORK_IN_PROGRESS',
  'rural-retreat': 'WORK_IN_PROGRESS',
  'beach-house-troia-ii': 'COMING_SOON',
  'weekend-family-house': 'COMING_SOON',
}

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeValue = locale as Locale
  const dict = await getDictionary(localeValue)
  const [projects, projectsSettings] = await Promise.all([
    getProjectsContent(),
    getPublishedProjectsSettings(localeValue),
  ])
  const preferDictionary = localeValue === 'pt'

  const localizedProjects = projects
    .filter((project) => !hiddenProjectSlugs.has(project.slug))
    .map((project) => {
      const projectDict = dict.projects.list[project.slug as keyof typeof dict.projects.list]
      return {
        ...project,
        title: preferDictionary ? projectDict?.title || project.title : project.title || projectDict?.title,
        subtitle:
          preferDictionary
            ? projectDict?.subtitle !== undefined
              ? projectDict.subtitle
              : project.subtitle
            : project.subtitle || projectDict?.subtitle || '',
        location: preferDictionary ? projectDict?.location || project.location : project.location || projectDict?.location || '',
        status:
          forcedProjectStatuses[project.slug] ||
          (project.status === 'DRAFT' ? 'WORK_IN_PROGRESS' : project.status),
      }
    })

  const projectsDict = {
    ...dict.projects,
    hero: {
      ...dict.projects.hero,
      heading: projectsSettings.projects_heading,
      text: projectsSettings.projects_description || dict.projects.hero.text,
      backgroundImage: projectsSettings.projects_background_image,
      backgroundColor: projectsSettings.projects_background_color,
      titleColor: projectsSettings.projects_title_color,
      badgeColor: projectsSettings.projects_badge_color,
    },
    filters: {
      all: projectsSettings.filter_all,
      residential: projectsSettings.filter_residential,
      commercial: projectsSettings.filter_commercial,
    },
    cta: {
      title: projectsSettings.projects_cta_title,
      button: projectsSettings.projects_cta_button,
      url: projectsSettings.projects_cta_url,
    },
  }
  return (
    <ProjectsClient
      locale={locale}
      dict={projectsDict}
      projects={localizedProjects}
    />
  )
}
