import { IntroSection } from '@/components/sections/intro'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { ServicesPreview } from '@/components/sections/services-preview'
import { AboutPreview } from '@/components/sections/about-preview'
import { ManagedHero } from '@/components/cms/managed-hero'
import { getProjectsContent } from '@/lib/cms/content-service'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const localizedProjectList = dict.projects.list as Record<
    string,
    { title?: string; subtitle?: string; location?: string }
  >
  const localizedServiceList = dict.services.list as Record<string, { title?: string }>

  const projects = await getProjectsContent()
  const featuredProjects = projects.slice(0, 4).map((project) => {
    const projectDict = localizedProjectList[project.slug]

    return {
      id: project.id,
      slug: project.slug,
      title: projectDict?.title || project.title,
      location: projectDict?.location || project.location,
      coverImage: project.coverImage,
      status: project.status === 'DRAFT' ? 'WORK_IN_PROGRESS' : project.status,
    }
  })

  return (
    <div className="bg-[#e3dfdc]">
      <ManagedHero dict={dict.home.hero} locale={locale as Locale} />
      <IntroSection dict={dict.home.intro} locale={locale as Locale} />
      <FeaturedProjects 
        projects={featuredProjects} 
        dict={dict.home.featured_projects} 
        locale={locale as Locale} 
      />
      <ServicesPreview
        dict={dict.home.services_preview}
        serviceTitles={localizedServiceList}
        locale={locale as Locale}
      />
      <AboutPreview dict={dict.home.about_preview} locale={locale as Locale} />
    </div>
  )
}
