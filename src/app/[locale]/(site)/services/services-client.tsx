'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { SiteImage } from '@/components/ui/site-image'
import { cn } from '@/lib/utils'

interface ServicesClientProps {
  locale: string
  dict: any
  services: any[]
}

export function ServicesClient({ locale, dict, services }: ServicesClientProps) {
  return (
    <>
      {/* Hero Section - Frase minimalista */}
      <section className="relative pt-32 pb-8 lg:pt-40 lg:pb-12 bg-[#e3dfdc]">
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

      {/* Services Grid - 3 colunas, títulos centrados */}
      <section className="py-8 lg:py-12 bg-[#e3dfdc]">
        <div className="px-2 lg:px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-3">
            {services.map((service, index) => (
              <motion.div
                key={service.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={`/${locale}/services/${service.slug}`}
                  className="group block relative aspect-[4/3] overflow-hidden bg-stone-300"
                >
                  <SiteImage
                    src={service.image}
                    alt={service.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/30 transition-opacity duration-500" />
                  
                  {/* Content - Centrado */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <h3 className="font-cormorant text-sm sm:text-base lg:text-lg font-light text-white leading-tight tracking-wide uppercase">
                      {service.title}
                    </h3>
                    <p className="font-inter text-[8px] sm:text-[9px] tracking-[0.12em] uppercase text-white/70 mt-1.5">
                      {service.excerpt}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section - Com numeração e linhas conectoras */}
      <section className="py-16 lg:py-24 bg-[#e3dfdc]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <h2 
              className="font-cormorant text-2xl lg:text-3xl font-light text-stone-800"
              dangerouslySetInnerHTML={{ __html: dict.process.title }}
            />
          </motion.div>

          {/* Process Steps com linhas conectoras */}
          <div className="relative">
            {/* Linha conectora horizontal (desktop) */}
            <div className="hidden lg:block absolute top-6 left-[10%] right-[10%] h-px bg-stone-500/30" />
            
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4">
              {dict.process.steps.map((step: any, index: number) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center relative"
                >
                  {/* Número */}
                  <div className="relative z-10 w-12 h-12 rounded-full bg-[#f4efec] border border-stone-500/30 flex items-center justify-center mx-auto mb-4">
                    <span className="font-cormorant text-lg text-stone-600">{step.number}</span>
                  </div>
                  <h4 className="font-cormorant text-base lg:text-lg text-stone-900">
                    {step.title}
                  </h4>
                  <p className="mt-2 font-inter text-[10px] lg:text-xs text-stone-600 leading-relaxed max-w-[180px] mx-auto">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Menos agressivo */}
      <section className="py-12 lg:py-16 bg-[#CFCAC7]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-cormorant text-2xl lg:text-4xl font-light text-white italic mb-8">
              {dict.cta.text}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block px-8 py-3 border border-white/50 text-white font-inter text-xs tracking-[0.2em] uppercase hover:bg-white hover:text-stone-800 transition-all duration-300"
            >
              {dict.cta.button}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
