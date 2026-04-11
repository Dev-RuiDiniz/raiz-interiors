'use client'

import Link from 'next/link'
import { SiteImage } from '@/components/ui/site-image'
import { cn } from '@/lib/utils'

interface ProjectsClientProps {
  locale: string
  dict: any
  projects: any[]
}

export function ProjectsClient({ locale, dict, projects }: ProjectsClientProps) {
  return (
    <>
      {/* Hero Section - Frase minimalista */}
      <section
        className="relative pt-32 pb-8 lg:pt-40 lg:pb-12"
        style={{ backgroundColor: dict.hero.backgroundColor || '#E3DFDD' }}
      >
        {dict.hero.backgroundImage && (
          <div className="absolute inset-0">
            <SiteImage
              src={dict.hero.backgroundImage}
              alt={dict.hero.heading || 'Projects background'}
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-white/80" />
          </div>
        )}
        <div className="container relative z-10 mx-auto px-4 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            {dict.hero.heading && (
              <p
                className="mb-4 font-inter text-[10px] sm:text-xs tracking-[0.24em] uppercase"
                style={{ color: dict.hero.badgeColor || '#44403c' }}
              >
                {dict.hero.heading}
              </p>
            )}
            <p
              className="font-cormorant text-base sm:text-lg lg:text-xl font-light leading-relaxed"
              style={{ color: dict.hero.titleColor || '#57534e' }}
              dangerouslySetInnerHTML={{ __html: dict.hero.text }}
            />
          </div>
        </div>
      </section>

      {/* Projects Grid - 3 colunas */}
      <section
        className="py-8 lg:py-12"
        style={{ backgroundColor: dict.hero.backgroundColor || '#E3DFDD' }}
      >
        <div className="px-2 lg:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
            {projects.map((project) => (
              <div key={project.id}>
                <ProjectCard locale={locale} dict={dict} project={project} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ProjectCard({ locale, dict, project }: { locale: string; dict: any; project: any }) {
  const isComingSoon = project.status === 'COMING_SOON'
  const isWorkInProgress = project.status === 'WORK_IN_PROGRESS'

  const statusLabel = isComingSoon 
    ? dict.status.coming_soon 
    : isWorkInProgress 
      ? dict.status.work_in_progress 
      : null

  return (
    <Link
      href={isComingSoon ? '#' : `/${locale}/projects/${project.slug}`}
      className={cn(
        'group block relative overflow-hidden bg-stone-300 aspect-[4/3]',
        isComingSoon && 'cursor-default'
      )}
    >
      {/* Image */}
      <div className="absolute inset-0">
        <SiteImage
          src={project.coverImage}
          alt={project.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={cn(
            'object-cover transition-transform duration-700',
            !isComingSoon && 'group-hover:scale-105'
          )}
        />
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-500',
            isComingSoon
              ? 'bg-stone-900/50'
              : 'bg-stone-900/20 group-hover:bg-stone-900/30'
          )}
        />
      </div>

      {/* Content - Centrado */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full p-4 text-center">
        <h3 className="font-cormorant text-sm sm:text-base lg:text-lg font-light text-white leading-tight tracking-wide">
          {project.title} {project.subtitle && <span className="italic">{project.subtitle}</span>}
        </h3>
        <p className="font-inter text-[8px] sm:text-[9px] tracking-[0.12em] uppercase text-white/70 mt-1.5">
          {project.location}
        </p>
        
        {/* Status Badge */}
        {statusLabel && (
          <span className="mt-1 font-inter text-[7px] sm:text-[8px] tracking-[0.1em] lowercase text-white/60 italic">
            {statusLabel}
          </span>
        )}
      </div>
    </Link>
  )
}
