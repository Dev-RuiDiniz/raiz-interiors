/*
Arquivo: src/components/sections/intro.tsx
Objetivo: Secao de interface usada em paginas publicas.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ArtisticText } from '@/components/ui/artistic-text'

import { Locale } from '@/i18n/config'

interface IntroSectionProps {
  dict: {
    text: string
    highlightWords: string[]
    cta: string
  }
  locale: Locale
}

export function IntroSection({ dict, locale }: IntroSectionProps) {
  return (
    <section className="bg-[#e3dfdc] py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <ArtisticText
              as="p"
              highlightWords={dict.highlightWords}
              className="font-cormorant text-base sm:text-lg md:text-xl lg:text-2xl font-light text-stone-700 leading-relaxed"
              highlightClassName="uppercase text-stone-600"
            >
              {dict.text}
            </ArtisticText>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10"
          >
            <Link
              href={`/${locale}/projects`}
              className="inline-flex items-center gap-3 font-inter text-[10px] tracking-[0.2em] uppercase text-stone-500 hover:text-stone-700 transition-colors group"
            >
              <span>{dict.cta}</span>
              <ArrowRight
                size={14}
                className="transform group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

