import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ProjectsClient } from './projects-client'
import { getProjectsContent } from '@/lib/cms/content-service'

const hiddenProjectSlugs = new Set(['young-soul-city-apartment'])

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const localeValue = locale as Locale
  const dict = await getDictionary(localeValue)
  const projects = await getProjectsContent()
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
        status: project.status === 'DRAFT' ? 'WORK_IN_PROGRESS' : project.status,
      }
    })

  return (
    <ProjectsClient
      locale={locale}
      dict={dict.projects}
      projects={localizedProjects}
    />
  )
}
