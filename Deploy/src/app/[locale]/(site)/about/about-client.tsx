'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { InstagramFeed } from '@/components/sections/instagram-feed'
import { SiteImage } from '@/components/ui/site-image'

interface AboutClientProps {
  locale: string
  aboutDict: any
  heroImage: string
  founderImage: string
}

export function AboutClient({ locale, aboutDict, heroImage, founderImage }: AboutClientProps) {
  return (
    <>
      {/* Hero Section - Menor */}
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 
                className="font-cormorant text-3xl lg:text-4xl font-light text-stone-800 leading-tight"
                dangerouslySetInnerHTML={{ __html: aboutDict.hero.title }}
              />
              {aboutDict.hero.paragraphs.map((p: string, i: number) => (
                <p key={i} className="mt-4 font-inter text-sm text-stone-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative aspect-[4/5] overflow-hidden"
            >
              <SiteImage
                src={heroImage}
                alt="RAIZ Interiors - Live Beautiful"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values - Movido para cima */}
      <section className="py-12 lg:py-16 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <h2 
              className="font-cormorant text-xl lg:text-2xl font-light text-stone-800"
              dangerouslySetInnerHTML={{ __html: aboutDict.values.title }}
            />
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {aboutDict.values.items.map((value: any, index: number) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <h3 className="font-cormorant text-base lg:text-lg text-stone-800 mb-2">
                  {value.title}
                </h3>
                <p className="font-inter text-[10px] lg:text-xs text-stone-600 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Founder */}
      <section className="py-12 lg:py-16 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative aspect-[4/5] overflow-hidden order-2 lg:order-1 max-w-md mx-auto lg:mx-0"
            >
              <SiteImage
                src={founderImage}
                alt="Founder of RAIZ Interiors"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="order-1 lg:order-2"
            >
              <span className="font-inter text-xs tracking-[0.3em] uppercase text-stone-500">
                {aboutDict.founder.label}
              </span>
              <h2 
                className="mt-4 font-cormorant text-2xl lg:text-3xl font-light text-stone-900 leading-tight"
                dangerouslySetInnerHTML={{ __html: aboutDict.founder.title }}
              />
              {aboutDict.founder.paragraphs.map((p: string, i: number) => (
                <p key={i} className="mt-6 font-inter text-sm text-stone-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Instagram Feed - Auto-scroll carrossel */}
      <InstagramFeed dict={aboutDict.instagram} />

      {/* CTA Section - Altura reduzida */}
      <section className="py-8 lg:py-10 bg-[#CFCAC7]">
        <div className="container mx-auto px-6 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="font-cormorant text-xl lg:text-2xl font-light text-white italic mb-6">
              {aboutDict.cta.text}
            </p>
            <Link
              href={`/${locale}/contact`}
              className="inline-block px-8 py-3 border border-white/50 text-white font-inter text-[10px] tracking-[0.2em] uppercase hover:bg-white hover:text-stone-800 transition-all duration-300"
            >
              {aboutDict.cta.button}
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  )
}
