'use client'

import { FeaturedProjects } from './featured-projects'
import { Locale } from '@/i18n/config'

type Project = {
  id: string
  slug: string
  title: string
  subtitle: string
  location: string
  coverImage: string
  status: 'PUBLISHED' | 'COMING_SOON' | 'WORK_IN_PROGRESS'
}

type ProjectsDict = {
  hero: {
    text: string
  }
  status: {
    coming_soon: string
    work_in_progress: string
  }
  list: Record<
    string,
    {
      title?: string
      subtitle?: string
      location?: string
    }
  >
  detail?: Record<string, unknown>
}

interface ProjectsClientProps {
  locale: string
  dict: ProjectsDict
  projects: Project[]
}

export function ProjectsClient({ locale, dict, projects }: ProjectsClientProps) {
  return (
    <main>
      <section className="bg-[#e3dfdc] py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
          <p className="font-cormorant text-xl sm:text-2xl lg:text-3xl leading-snug text-stone-700">
            {dict.hero.text}
          </p>
        </div>
      </section>

      <FeaturedProjects
        locale={locale as Locale}
        projects={projects}
        dict={{
          label: 'Selected Projects',
          view_all: 'View All Projects',
          coming_soon: dict.status.coming_soon,
          work_in_progress: dict.status.work_in_progress,
        }}
      />
    </main>
  )
}