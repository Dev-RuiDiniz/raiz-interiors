'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import { SiteImage } from '@/components/ui/site-image'

interface ServiceDetailClientProps {
  locale: string
  dict: any
  service: any
}

export function ServiceDetailClient({ locale, dict, service }: ServiceDetailClientProps) {
  return (
    <>
      {/* Hero Section - Menor */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 font-inter text-[10px] tracking-[0.15em] uppercase text-stone-500 hover:text-stone-700 transition-colors mb-6"
            >
              <ArrowLeft size={12} />
              {dict.back}
            </Link>

            <h1 className="font-cormorant text-3xl lg:text-4xl font-light text-stone-800 leading-tight">
              {service.title}
            </h1>
            <p className="mt-2 font-cormorant text-base lg:text-lg text-stone-600 italic">
              {service.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 lg:py-24 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-xl mb-12"
          >
            <h2 
              className="font-cormorant text-xl lg:text-2xl font-light text-stone-800 mb-6"
              dangerouslySetInnerHTML={{ __html: dict.offer }}
            />
            <div className="font-inter text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {service.description}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="grid grid-cols-2 gap-4"
            >
              {service.images.map((image: string, index: number) => (
                <div
                  key={`${image}-${index}`}
                  className="relative aspect-[3/4] overflow-hidden bg-stone-300"
                >
                  <SiteImage
                    src={image}
                    alt={`${service.title} ${index + 1}`}
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h3 className="font-inter text-[10px] tracking-[0.2em] uppercase text-stone-500 mb-6">
                {dict.include}
              </h3>
              <ul className="space-y-3">
                {service.features.map((feature: string, index: number) => (
                  <li key={`${feature}-${index}`} className="flex items-center gap-3">
                    <span className="font-inter text-xs text-stone-400 shrink-0">•</span>
                    <span className="font-inter text-xs text-stone-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 lg:py-16 bg-[#CFCAC7]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-cormorant text-xl lg:text-3xl font-light text-white italic mb-6">
              {dict.cta.text}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block px-8 py-3 border border-white/50 text-white font-inter text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-stone-800 transition-all duration-300"
            >
              {dict.cta.button}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
