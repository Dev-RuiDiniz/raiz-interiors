/*
Arquivo: src/components/sections/home-gallery.tsx
Objetivo: Secao de interface usada em paginas publicas.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { motion } from 'framer-motion'
import { SiteImage } from '@/components/ui/site-image'

const galleryImages = [
  '/2026/home/galeria_inicial/beautiful_and_timeless_comporta_summer_house_interior_design_by_raiz.jpg',
  '/2026/home/galeria_inicial/contemporary_minimalist_living_room_suspended_staircase_and_fireplace_interior_design_by_raiz.jpg',
  '/2026/home/galeria_inicial/contemporary_beach_house_living_room_with_fireplace_interior_design_by_raiz.jpg',
  '/2026/home/galeria_inicial/elegant_timeless_luxury_master_suite_interior_design_by_raiz.jpg',
  '/2026/home/galeria_inicial/img_0820_snapseedcopy.jpg',
  '/2026/home/galeria_inicial/suite_4k.jpg',
]

export function HomeGallery() {
  return (
    <section className="py-8 lg:py-12 bg-[#E3DFDD]">
      <div className="px-2 lg:px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 lg:gap-3">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="relative aspect-[4/3] overflow-hidden bg-stone-300"
            >
              <SiteImage
                src={image}
                alt={`RAIZ Interiors Gallery ${index + 1}`}
                fill
                sizes="(min-width: 768px) 33vw, 50vw"
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
