'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
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
      <section className="relative pt-32 pb-8 lg:pt-40 lg:pb-12 bg-[#E3DFDD]">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto text-center"
          >
            <p 
              className="font-cormorant text-base sm:text-lg lg:text-xl font-light text-stone-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dict.hero.text }}
            />
          </motion.div>
        </div>
      </section>

      {/* Projects Grid - 3 colunas */}
      <section className="py-8 lg:py-12 bg-[#E3DFDD]">
        <div className="px-2 lg:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.03 }}
              >
                <ProjectCard locale={locale} dict={dict} project={project} />
              </motion.div>
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
