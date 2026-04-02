/*
Arquivo: src/components/layout/footer.tsx
Objetivo: Componente estrutural de layout (ex.: header/footer).
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Linkedin, Mail, MapPin } from 'lucide-react'
import { FaPinterestP } from 'react-icons/fa'

const socialLinks = [
  { icon: Instagram, href: 'https://www.instagram.com/raiz.interiors.living', label: 'Instagram' },
  { icon: FaPinterestP, href: 'https://pt.pinterest.com/raizinteriorsliving/', label: 'Pinterest' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/raiz-interiors-living', label: 'LinkedIn' },
]

import { Locale } from '@/i18n/config'

interface FooterProps {
  dict: {
    navigation: string
    contact: string
    follow_us: string
    privacy: string
    terms: string
    rights: string
    about_us: string
    brand_description: string
  }
  locale: Locale
}

export function Footer({ dict, locale }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const navLinks = [
    { label: dict.navigation === 'Navigation' ? 'Projects' : 'Projetos', href: `/${locale}/projects` },
    { label: dict.navigation === 'Navigation' ? 'Services' : 'Serviços', href: `/${locale}/services` },
    { label: dict.about_us, href: `/${locale}/about` },
    { label: dict.contact === 'Contact' ? 'Contact' : 'Contacto', href: `/${locale}/contact` },
  ]

  return (
    <footer className="bg-[#b5adaa] text-stone-800">
      {/* Newsletter Section - Desligado por enquanto */}

      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <Link href={`/${locale}`} className="inline-block mb-6">
              <span className="font-cormorant text-2xl tracking-[0.2em] text-stone-800">RAIZ</span>
              <span className="block font-inter text-[10px] tracking-[0.3em] text-stone-600 mt-1">
                INTERIORS & LIVING STUDIO
              </span>
            </Link>
            <p className="font-inter text-sm text-stone-600 leading-relaxed">
              {dict.brand_description}
            </p>
          </motion.div>

          {/* Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="font-inter text-xs tracking-[0.2em] uppercase mb-6 text-stone-700">
              {dict.navigation}
            </h4>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-inter text-sm text-stone-600 hover:text-stone-800 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </motion.div>

          {/* Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="font-inter text-xs tracking-[0.2em] uppercase mb-6 text-stone-700">
              {dict.contact}
            </h4>
            <div className="flex flex-col gap-4">
              <a
                href="mailto:info@raiz-interiors.com"
                className="flex items-center gap-3 font-inter text-sm text-stone-600 hover:text-stone-800 transition-colors"
              >
                <Mail size={16} />
                info@raiz-interiors.com
              </a>
              <div className="flex items-start gap-3 font-inter text-sm text-stone-600">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span>Lisbon, Portugal</span>
              </div>
            </div>
          </motion.div>

          {/* Social */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="font-inter text-xs tracking-[0.2em] uppercase mb-6 text-stone-700">
              {dict.follow_us}
            </h4>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-stone-600/30 flex items-center justify-center text-stone-600 hover:text-stone-800 hover:border-stone-600/50 transition-all"
                  aria-label={social.label}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-stone-600/20">
        <div className="container mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-inter text-xs text-stone-600">
              © {currentYear} RAIZ Interiors. {dict.rights}.
            </p>
            <div className="flex gap-6">
              <Link
                href={`/${locale}/privacy`}
                className="font-inter text-xs text-stone-600 hover:text-stone-800 transition-colors"
              >
                {dict.privacy}
              </Link>
              <Link
                href={`/${locale}/terms`}
                className="font-inter text-xs text-stone-600 hover:text-stone-800 transition-colors"
              >
                {dict.terms}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

