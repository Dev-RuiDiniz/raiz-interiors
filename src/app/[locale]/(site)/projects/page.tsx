import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'
import { ProjectsClient } from './projects-client'
import { defaultProjects } from '@/lib/cms/default-projects'

const hiddenProjectSlugs = new Set(['young-soul-city-apartment'])

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  // Merge default projects with localized titles, subtitles and locations
  const localizedProjects = defaultProjects
    .filter((project) => !hiddenProjectSlugs.has(project.slug))
    .map((project) => {
      const projectDict = dict.projects.list[project.slug as keyof typeof dict.projects.list]
      return {
        ...project,
        title: projectDict?.title || project.title,
        subtitle: projectDict?.subtitle !== undefined ? projectDict.subtitle : project.subtitle,
        location: projectDict?.location || project.location,
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
