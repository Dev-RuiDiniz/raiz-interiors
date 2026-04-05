'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { SiteImage } from '@/components/ui/site-image'
import { cn } from '@/lib/utils'

interface ProjectDetailClientProps {
  locale: string
  dict: any
  project: any
  adjacent: {
    prev: { slug: string; title: string } | null
    next: { slug: string; title: string } | null
  }
}

export function ProjectDetailClient({ locale, dict, project, adjacent }: ProjectDetailClientProps) {
  const labels = dict.labels
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null)

  const lightboxLabels =
    locale === 'pt'
      ? {
          open: 'Ampliar imagem',
          previous: 'Imagem anterior',
          next: 'Próxima imagem',
          close: 'Fechar galeria',
        }
      : {
          open: 'Open image',
          previous: 'Previous image',
          next: 'Next image',
          close: 'Close gallery',
        }

  useEffect(() => {
    if (activeImageIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveImageIndex(null)
      }

      if (event.key === 'ArrowLeft') {
        setActiveImageIndex((current) => {
          if (current === null) return current
          return (current - 1 + project.images.length) % project.images.length
        })
      }

      if (event.key === 'ArrowRight') {
        setActiveImageIndex((current) => {
          if (current === null) return current
          return (current + 1) % project.images.length
        })
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeImageIndex, project.images.length])

  const showPreviousImage = () => {
    setActiveImageIndex((current) => {
      if (current === null) return current
      return (current - 1 + project.images.length) % project.images.length
    })
  }

  const showNextImage = () => {
    setActiveImageIndex((current) => {
      if (current === null) return current
      return (current + 1) % project.images.length
    })
  }

  return (
    <>
      {/* Hero Cover */}
      <section className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <div className="absolute inset-0">
          <SiteImage
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto px-6 lg:px-12 h-full flex flex-col justify-end pb-12 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              {project.title} {project.subtitle && <span className="italic">{project.subtitle}</span>}
            </h1>
            <p className="mt-2 font-inter text-sm text-white/80 uppercase tracking-wide">
              {project.location}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-[#CFCAC7]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="font-inter text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {project.description}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-8 lg:py-12 bg-[#CFCAC7]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-3 lg:gap-6">
            {project.images.map((image: string, index: number) => (
              <motion.div
                key={`${image}-${index}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.04 }}
              >
                <button
                  type="button"
                  onClick={() => setActiveImageIndex(index)}
                  className="group block w-full text-left"
                  aria-label={`${lightboxLabels.open} ${index + 1}`}
                >
                  <AspectRatio ratio={4 / 5} className="overflow-hidden bg-stone-300">
                    <div className="absolute inset-0 border border-stone-100/60 shadow-[0_18px_40px_-24px_rgba(28,25,23,0.8)]">
                      <SiteImage
                        src={image}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/5 via-transparent to-stone-950/20" />
                    </div>
                  </AspectRatio>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Dialog open={activeImageIndex !== null} onOpenChange={(open) => !open && setActiveImageIndex(null)}>
        <DialogContent
          showCloseButton={false}
          className="max-w-[calc(100vw-1rem)] border-none bg-transparent p-0 shadow-none sm:max-w-[calc(100vw-2rem)]"
        >
          <DialogTitle className="sr-only">{project.title} gallery</DialogTitle>

          <div className="relative flex min-h-[88vh] items-center justify-center">
            {project.images.length > 1 && (
              <button
                type="button"
                onClick={showPreviousImage}
                className={cn(
                  'absolute left-2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75',
                  'sm:left-4 sm:h-12 sm:w-12'
                )}
                aria-label={lightboxLabels.previous}
              >
                <ChevronLeft size={22} />
              </button>
            )}

            <div className="relative mx-12 flex h-[88vh] w-full items-center justify-center overflow-hidden bg-black/78 p-4 shadow-[0_24px_80px_-28px_rgba(0,0,0,0.8)] sm:mx-16 sm:p-6">
              {activeImageIndex !== null && (
                <SiteImage
                  src={project.images[activeImageIndex]}
                  alt={`${project.title} - Image ${activeImageIndex + 1}`}
                  assetMode="original"
                  fill
                  priority
                  sizes="100vw"
                  className="object-contain"
                />
              )}

              <button
                type="button"
                onClick={() => setActiveImageIndex(null)}
                className="absolute right-3 top-3 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 sm:right-4 sm:top-4 sm:h-12 sm:w-12"
                aria-label={lightboxLabels.close}
              >
                <X size={20} />
              </button>

              <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1.5 font-inter text-[10px] tracking-[0.18em] uppercase text-white/80 backdrop-blur-sm">
                {(activeImageIndex ?? 0) + 1} / {project.images.length}
              </div>
            </div>

            {project.images.length > 1 && (
              <button
                type="button"
                onClick={showNextImage}
                className={cn(
                  'absolute right-2 z-20 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75',
                  'sm:right-4 sm:h-12 sm:w-12'
                )}
                aria-label={lightboxLabels.next}
              >
                <ChevronRight size={22} />
              </button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <section className="py-10 lg:py-14 bg-[#CFCAC7]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 lg:gap-3"
          >
            <DetailItem label={labels.location} value={project.location} />
            <DetailItem label={labels.year} value={project.year} />
            <DetailItem label={labels.category} value={project.category} />
            <DetailItem label={labels.type} value={project.client} />
            {project.credits && <DetailItem label={labels.credits} value={project.credits} />}
            {project.photography && <DetailItem label={labels.photography} value={project.photography} />}
          </motion.div>
        </div>
      </section>

      <section className="py-10 lg:py-14 bg-[#B4ADA8] border-t border-stone-500/20">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-3 font-inter text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-stone-900 transition-colors group"
            >
              <ArrowLeft size={16} className="transform group-hover:-translate-x-1 transition-transform" />
              <span>{labels.back}</span>
            </Link>

            <div className="flex items-center gap-8">
              {adjacent.prev && (
                <Link href={`/${locale}/projects/${adjacent.prev.slug}`} className="text-right group">
                  <span className="block font-inter text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1">
                    {labels.prev}
                  </span>
                  <span className="font-cormorant text-lg text-stone-600 group-hover:text-stone-900 transition-colors">
                    {adjacent.prev.title}
                  </span>
                </Link>
              )}

              {adjacent.next && (
                <Link href={`/${locale}/projects/${adjacent.next.slug}`} className="text-left group">
                  <span className="block font-inter text-[10px] tracking-[0.2em] uppercase text-stone-400 mb-1">
                    {labels.next}
                  </span>
                  <span className="font-cormorant text-lg text-stone-600 group-hover:text-stone-900 transition-colors">
                    {adjacent.next.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-b border-stone-200 pb-3 md:border-b-0">
      <span className="block font-inter text-[9px] tracking-[0.2em] uppercase text-stone-400 mb-1">
        {label}
      </span>
      <span className="font-inter text-[9px] text-stone-800 leading-tight">{value}</span>
    </div>
  )
}
