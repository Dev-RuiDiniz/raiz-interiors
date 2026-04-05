 'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ArtisticText } from '@/components/ui/artistic-text'

import { Locale } from '@/i18n/config'

interface ServicesPreviewProps {
  dict: {
    label: string
    text: string
    highlightWords: string[]
    cta: string
  }
  services: Array<{ slug: string; title: string }>
  locale: Locale
}

export function ServicesPreview({ dict, services, locale }: ServicesPreviewProps) {
  return (
    <section className="bg-[#e3dfdc] py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="font-inter text-xs tracking-[0.3em] uppercase text-stone-500">
              {dict.label}
            </span>

            <div className="mt-6">
              <ArtisticText
                as="h2"
                highlightWords={dict.highlightWords}
                className="font-inter text-xl sm:text-2xl lg:text-3xl font-light text-stone-900 leading-relaxed"
                highlightClassName="text-stone-600"
              >
                {dict.text}
              </ArtisticText>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10"
            >
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-3 font-inter text-xs tracking-[0.2em] uppercase text-stone-600 hover:text-stone-900 transition-colors group"
              >
                <span>{dict.cta}</span>
                <ArrowRight
                  size={16}
                  className="text-stone-500 group-hover:text-stone-900 transform group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-0"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              >
                <Link
                  href={`/${locale}/services/${service.slug}`}
                  className="group flex items-center justify-between py-6 border-b border-stone-400/40 hover:border-stone-500/60 transition-colors"
                >
                  <span className="font-cormorant text-xl lg:text-2xl text-stone-900/90 group-hover:text-stone-900 transition-colors">
                    {service.title}
                  </span>
                  <ArrowRight
                    size={20}
                    className="text-stone-500 group-hover:text-stone-900 transform group-hover:translate-x-2 transition-all"
                  />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
