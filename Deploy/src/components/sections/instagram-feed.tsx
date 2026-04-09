/*
Arquivo: src/components/sections/instagram-feed.tsx
Objetivo: Secao de interface usada em paginas publicas.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { ArtisticText } from '@/components/ui/artistic-text'
import { SiteImage } from '@/components/ui/site-image'

interface InstagramPost {
  id: string
  postId: string
  shortCode: string | null
  type: string
  url: string
  displayUrl: string
  videoUrl: string | null
  caption: string | null
  likesCount: number
  commentsCount: number
}

// Fallback images caso não tenha posts no banco
const fallbackImages = [
  { id: '1', src: '/2026/home/galeria_inicial/beautiful_and_timeless_comporta_summer_house_interior_design_by_raiz.jpg', alt: 'RAIZ Interiors', url: 'https://www.instagram.com/raiz.interiors.living' },
  { id: '2', src: '/2026/home/galeria_inicial/contemporary_minimalist_living_room_suspended_staircase_and_fireplace_interior_design_by_raiz.jpg', alt: 'RAIZ Interiors', url: 'https://www.instagram.com/raiz.interiors.living' },
  { id: '3', src: '/2026/home/galeria_inicial/contemporary_beach_house_living_room_with_fireplace_interior_design_by_raiz.jpg', alt: 'RAIZ Interiors', url: 'https://www.instagram.com/raiz.interiors.living' },
  { id: '4', src: '/2026/home/galeria_inicial/elegant_timeless_luxury_master_suite_interior_design_by_raiz.jpg', alt: 'RAIZ Interiors', url: 'https://www.instagram.com/raiz.interiors.living' },
  { id: '5', src: '/2026/home/galeria_inicial/img_0820_snapseedcopy.jpg', alt: 'RAIZ Interiors', url: 'https://www.instagram.com/raiz.interiors.living' },
  { id: '6', src: '/2026/home/galeria_inicial/suite_4k.jpg', alt: 'RAIZ Interiors', url: 'https://www.instagram.com/raiz.interiors.living' },
]

import { Locale } from '@/i18n/config'

interface InstagramFeedProps {
  dict?: {
    text: string
    highlightWords: string[]
  }
}

export function InstagramFeed({ dict }: InstagramFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [posts, setPosts] = useState<InstagramPost[]>([])

  // Buscar posts do banco
  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/instagram/posts?limit=12', { cache: 'no-store' })
        if (response.ok) {
          const data = await response.json()
          if (data && data.length > 0) {
            setPosts(data)
          }
        }
      } catch (error) {
        console.error('Erro ao buscar posts do Instagram:', error)
      }
    }

    fetchPosts()

    const pollId = window.setInterval(fetchPosts, 10 * 60 * 1000)
    return () => window.clearInterval(pollId)
  }, [])

  // Auto scroll lento
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    let animationId: number
    let scrollPos = 0

    const scroll = () => {
      if (!isHovered && container) {
        scrollPos += 0.5
        if (scrollPos >= container.scrollWidth / 2) {
          scrollPos = 0
        }
        container.scrollLeft = scrollPos
      }
      animationId = requestAnimationFrame(scroll)
    }

    animationId = requestAnimationFrame(scroll)
    return () => cancelAnimationFrame(animationId)
  }, [isHovered])

  // Preparar imagens (posts reais ou fallback)
  const displayImages = posts.length > 0
    ? posts.map((post) => ({
        id: post.id,
        src: post.displayUrl,
        alt: post.caption?.substring(0, 50) || 'Post do Instagram @raiz.interiors.living',
        url: post.url,
      }))
    : fallbackImages

  // Duplicar para loop infinito
  const allImages = [...displayImages, ...displayImages]

  return (
    <section className="py-16 lg:py-24 bg-[#E3DFDD] overflow-hidden relative">
      {/* Header */}
      <div className="container mx-auto px-6 lg:px-12 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <ArtisticText
            as="p"
            highlightWords={dict?.highlightWords || ['INSPIRATION', 'DESIGN', 'WORLD', 'INSPIRED']}
            className="font-inter text-sm sm:text-base lg:text-lg font-light text-stone-700 leading-relaxed"
            highlightClassName="text-stone-600"
          >
            {dict?.text || 'INSPIRATION through DESIGN. Welcome to our WORLD and get INSPIRED...'}
          </ArtisticText>
        </motion.div>
      </div>

      {/* Carrossel auto-scroll */}
      <div
        ref={scrollRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="flex gap-3 overflow-x-hidden"
        style={{ scrollBehavior: 'auto' }}
      >
        {allImages.map((image, index) => (
          <Link
            key={`${image.id}-${index}`}
            href={image.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0"
          >
            <motion.div
              className="relative group"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-[200px] h-[200px] md:w-[240px] md:h-[240px] relative overflow-hidden bg-stone-300">
                <SiteImage
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="240px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <Instagram
                    size={24}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Gradient fades nas bordas */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#E3DFDD] to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#E3DFDD] to-transparent" />
    </section>
  )
}
