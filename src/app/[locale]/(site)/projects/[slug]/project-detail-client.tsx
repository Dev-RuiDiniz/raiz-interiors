'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, X } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { SiteImage } from '@/components/ui/site-image'
import { getAdjacentAssetPaths } from '@/lib/asset-variants'
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

interface ProjectImageAsset {
  src: string
  blurDataURL?: string
  avifSrcSet?: string
  webpSrcSet?: string
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

  const activeImage = activeImageIndex !== null ? project.images[activeImageIndex] : null
  const activeImageNumber = activeImageIndex !== null ? activeImageIndex + 1 : 0

  const projectImages = useMemo<ProjectImageAsset[]>(
    () =>
      project.images.map((image: string, index: number) => ({
        src: image,
        ...getAdjacentAssetPaths(image),
      })),
    [project.images]
  )

  const coverAsset = useMemo(() => getAdjacentAssetPaths(project.coverImage), [project.coverImage])

  const preloadIndices = useMemo(() => {
    if (activeImageIndex === null || project.images.length < 2) return []

    const previous = (activeImageIndex - 1 + project.images.length) % project.images.length
    const next = (activeImageIndex + 1) % project.images.length

    return previous === next ? [previous] : [previous, next]
  }, [activeImageIndex, project.images.length])

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

  useEffect(() => {
    if (typeof window === 'undefined' || preloadIndices.length === 0) return

    preloadIndices.forEach((index) => {
      const image = project.images[index]
      if (!image) return

      const img = new window.Image()
      img.src = image
    })
  }, [preloadIndices, project.images])

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
      <section className="relative h-[50vh] overflow-hidden lg:h-[60vh]">
        <div className="absolute inset-0">
          <SiteImage
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            blurDataURL={coverAsset.blurDataURL}
            placeholder={coverAsset.blurDataURL ? 'blur' : 'empty'}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>

        <div className="relative z-10 container mx-auto flex h-full flex-col justify-end px-6 pb-12 lg:px-12 lg:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-cormorant text-3xl font-light leading-tight text-white sm:text-4xl lg:text-5xl">
              {project.title} {project.subtitle && <span className="italic">{project.subtitle}</span>}
            </h1>
            <p className="mt-2 font-inter text-sm uppercase tracking-wide text-white/80">
              {project.location}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#CFCAC7] py-12 lg:py-16">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="font-inter whitespace-pre-line text-sm leading-relaxed text-stone-600">
              {project.description}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#CFCAC7] py-8 lg:py-12">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 gap-3 lg:gap-6">
            {projectImages.map((image, index) => (
              <motion.div
                key={`${image.src}-${index}`}
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
                        src={image.src}
                        alt={`${project.title} - Image ${index + 1}`}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        blurDataURL={image.blurDataURL}
                        placeholder={image.blurDataURL ? 'blur' : 'empty'}
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
              {activeImage !== null && (
                  <SiteImage
                    src={activeImage}
                    alt={`${project.title} - Image ${activeImageNumber}`}
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
                {activeImageNumber} / {project.images.length}
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

      <section className="bg-[#CFCAC7] py-10 lg:py-14">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6 lg:gap-3"
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

      <section className="border-t border-stone-500/20 bg-[#B4ADA8] py-10 lg:py-14">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
            <Link
              href={`/${locale}/projects`}
              className="group inline-flex items-center gap-3 font-inter text-xs uppercase tracking-[0.2em] text-stone-600 transition-colors hover:text-stone-900"
            >
              <ArrowLeft size={16} className="transform transition-transform group-hover:-translate-x-1" />
              <span>{labels.back}</span>
            </Link>

            <div className="flex items-center gap-8">
              {adjacent.prev && (
                <Link href={`/${locale}/projects/${adjacent.prev.slug}`} className="group text-right">
                  <span className="mb-1 block font-inter text-[10px] uppercase tracking-[0.2em] text-stone-400">
                    {labels.prev}
                  </span>
                  <span className="font-cormorant text-lg text-stone-600 transition-colors group-hover:text-stone-900">
                    {adjacent.prev.title}
                  </span>
                </Link>
              )}

              {adjacent.next && (
                <Link href={`/${locale}/projects/${adjacent.next.slug}`} className="group text-left">
                  <span className="mb-1 block font-inter text-[10px] uppercase tracking-[0.2em] text-stone-400">
                    {labels.next}
                  </span>
                  <span className="font-cormorant text-lg text-stone-600 transition-colors group-hover:text-stone-900">
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
      <span className="mb-1 block font-inter text-[9px] uppercase tracking-[0.2em] text-stone-400">
        {label}
      </span>
      <span className="font-inter text-[9px] leading-tight text-stone-800">{value}</span>
    </div>
  )
}
