/*
Arquivo: src/components/sections/hero.tsx
Objetivo: Secao de interface usada em paginas publicas.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { SiteImage } from '@/components/ui/site-image'
import { defaultHeroSlides, type HeroSlideContent } from '@/lib/cms/default-layouts'

interface HeroProps {
  videoUrl?: string
  slideshow?: boolean
  slides?: HeroSlideContent[]
}

const stripHtml = (value: string) => value.replace(/<[^>]+>/g, '')

export function Hero({
  videoUrl,
  slideshow = true,
  slides = defaultHeroSlides,
}: HeroProps) {
  const safeSlides = slides.length ? slides : defaultHeroSlides
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Slideshow effect
  useEffect(() => {
    if (!slideshow || videoUrl) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeSlides.length)
    }, 6000) // Troca a cada 6 segundos

    return () => clearInterval(interval)
  }, [slideshow, videoUrl, safeSlides.length])

  useEffect(() => {
    if (!videoUrl) {
      const timer = setTimeout(() => setIsLoaded(true), 300)
      return () => clearTimeout(timer)
    }
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75
    }
  }, [videoUrl])

  const currentSlide = safeSlides[currentIndex] || safeSlides[0]
  const nextIndex = (currentIndex + 1) % safeSlides.length
  const shouldRenderSlide = (slideIndex: number) => {
    return slideIndex === currentIndex || slideIndex === nextIndex
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Images - Crossfade real */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            onLoadedData={() => setIsLoaded(true)}
            className="h-full w-full object-cover"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        ) : (
          <>
            {/* Todas as imagens empilhadas com opacidade controlada */}
            {safeSlides.map((slide, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
                style={{ opacity: index === currentIndex ? 1 : 0 }}
              >
                {shouldRenderSlide(index) && (
                  <SiteImage
                    src={slide.image}
                    alt={stripHtml(slide.line1)}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover scale-105"
                    onLoad={() => index === 0 && setIsLoaded(true)}
                  />
                )}
                {/* Zoom suave na imagem ativa */}
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    scale: index === currentIndex ? [1, 1.05] : 1,
                  }}
                  transition={{
                    duration: 6,
                    ease: 'linear',
                  }}
                />
              </div>
            ))}
          </>
        )}

        {/* Overlay Gradient - Escuro no topo para destacar o menu */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/50" />
      </div>

      {/* Content - Animado por slide */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="w-full max-w-6xl"
          >
            {/* Main Title - exactly two centered lines, shrinking on smaller screens */}
            <Link href={currentSlide.link} className="block group">
              <h1 className="font-cormorant text-[clamp(0.72rem,2vw,2.85rem)] font-light text-white leading-[1.12] tracking-[0.08em] md:tracking-[0.12em]">
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="block whitespace-nowrap [&_em]:font-light [&_em]:italic [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: currentSlide.line1 }}
                />
                <motion.span
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.25 }}
                  className="mt-1 block whitespace-nowrap text-white [&_em]:font-light [&_em]:italic [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{ __html: currentSlide.line2 }}
                />
              </h1>
            </Link>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators - Bolinhas */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
          {safeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
