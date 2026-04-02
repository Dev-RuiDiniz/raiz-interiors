'use client'

import { motion } from 'framer-motion'

interface LegalSection {
  title: string
  content: string
}

interface LegalClientProps {
  title: string
  description: string
  sections: LegalSection[]
}

export function LegalClient({ title, description, sections }: LegalClientProps) {
  return (
    <>
      <section className="relative pt-28 pb-12 lg:pt-36 lg:pb-16 bg-[#E3DFDD]">
        <div className="container mx-auto px-6 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 
              className="font-cormorant text-3xl lg:text-4xl font-light text-stone-800 leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="mt-4 font-inter text-sm text-stone-600 leading-relaxed">
              {description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 lg:py-16 bg-[#E3DFDD] min-h-[50vh]">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-4xl space-y-12">
            {sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <h2 className="font-cormorant text-xl text-stone-900 mb-4 uppercase tracking-wider">
                  {section.title}
                </h2>
                <p className="font-inter text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
