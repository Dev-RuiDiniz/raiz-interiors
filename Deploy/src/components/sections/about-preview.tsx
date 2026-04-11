'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { SiteImage } from '@/components/ui/site-image'

import { Locale } from '@/i18n/config'

interface AboutPreviewProps {
  dict: {
    text: string
    cta: string
    img_alt: string
  }
  imageUrl: string
  locale: Locale
}

export function AboutPreview({ dict, imageUrl, locale }: AboutPreviewProps) {
  return (
    <section className="bg-[#e3dfdc] py-20 lg:py-28">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <SiteImage
              src={imageUrl}
              alt={dict.img_alt}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center lg:text-left"
          >
            <p
              className="font-cormorant text-lg sm:text-xl lg:text-2xl font-light text-stone-800 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: dict.text }}
            />

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8"
            >
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 font-inter text-[10px] tracking-[0.2em] uppercase text-stone-600 hover:text-stone-800 transition-colors group"
              >
                <span>{dict.cta}</span>
                <ArrowRight
                  size={12}
                  className="transform group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
