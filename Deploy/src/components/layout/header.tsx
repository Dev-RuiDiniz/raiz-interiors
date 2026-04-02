/*
Arquivo: src/components/layout/header.tsx
Objetivo: Componente estrutural de layout (ex.: header/footer).
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

import {
  isLocale,
  locales,
  type Locale,
} from '@/i18n/config'

interface HeaderProps {
  dict: {
    projects: string
    services: string
    about: string
    contact: string
  }
  locale: Locale
}

export function Header({ dict, locale }: HeaderProps) {
  const navItems = [
    { label: dict.projects, href: `/${locale}/projects` },
    { label: dict.services, href: `/${locale}/services` },
    { label: dict.about, href: `/${locale}/about` },
    { label: dict.contact, href: `/${locale}/contact` },
  ]
  const uiLabels =
    locale === 'pt'
      ? {
          languageSwitcher: 'Seletor de idioma',
          openMenu: 'Abrir menu',
          closeMenu: 'Fechar menu',
        }
      : {
          languageSwitcher: 'Language switcher',
          openMenu: 'Open menu',
          closeMenu: 'Close menu',
        }

  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Pages with dark hero (white header text).
  const darkHeroPages = [`/${locale}`]
  const hasDarkHero = darkHeroPages.includes(pathname) || pathname.startsWith(`/${locale}/projects/`)

  // Use dark text when hero is light, on scroll, or with mobile menu open.
  const useDarkText = !hasDarkHero || isScrolled || isOpen

  const equivalentPathsByLocale = useMemo(() => {
    const query = searchParams.toString()
    const [, firstSegment] = pathname.split('/')
    const pathWithoutLocale = isLocale(firstSegment ?? '')
      ? pathname.replace(new RegExp(`^/${firstSegment}(?=/|$)`), '')
      : pathname

    const normalizedPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale

    return locales.reduce<Record<Locale, string>>((acc, targetLocale) => {
      const nextPath = `/${targetLocale}${normalizedPath}`
      acc[targetLocale] = query ? `${nextPath}?${query}` : nextPath
      return acc
    }, { en: '/en', pt: '/pt' })
  }, [pathname, searchParams])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-[#CFCAC7] backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo */}
            <Link href={`/${locale}`} className="relative z-50">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* White logo visible at top of home before scroll */}
                <Image
                  src="/raizlogo_white.png"
                  alt="RAIZ Interiors"
                  width={350}
                  height={125}
                  className={cn(
                    'object-contain transition-all duration-500 absolute top-1/2 -translate-y-1/2',
                    useDarkText ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  )}
                />
                {/* Dark logo visible on scroll and on light pages */}
                <Image
                  src="/raizlogo_preta.png"
                  alt="RAIZ Interiors"
                  width={350}
                  height={125}
                  className={cn(
                    'object-contain transition-all duration-500',
                    useDarkText ? 'opacity-100' : 'opacity-0'
                  )}
                />
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-12">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      'relative font-inter text-xs tracking-[0.2em] uppercase transition-colors duration-300 group',
                      pathname === item.href
                        ? useDarkText
                          ? 'text-stone-900'
                          : 'text-white'
                        : useDarkText
                          ? 'text-stone-600 hover:text-stone-900'
                          : 'text-white/80 hover:text-white'
                    )}
                  >
                    {item.label}
                    <span
                      className={cn(
                        'absolute -bottom-1 left-0 h-px bg-current transition-all duration-300',
                        pathname === item.href ? 'w-full' : 'w-0 group-hover:w-full'
                      )}
                    />
                  </Link>
                </motion.div>
              ))}

              <div
                className={cn(
                  'flex items-center rounded-full border px-1 py-1',
                  useDarkText ? 'border-stone-500/50' : 'border-white/60'
                )}
                aria-label={uiLabels.languageSwitcher}
              >
                {locales.map((option) => {
                  const isActive = option === locale
                  return (
                    <Link
                      key={option}
                      href={equivalentPathsByLocale[option]}
                      className={cn(
                        'rounded-full px-3 py-1 font-inter text-[10px] tracking-[0.2em] uppercase transition-colors',
                        isActive
                          ? useDarkText
                            ? 'bg-stone-800 text-white'
                            : 'bg-white text-stone-900'
                          : useDarkText
                            ? 'text-stone-600 hover:text-stone-900'
                            : 'text-white/80 hover:text-white'
                      )}
                    >
                      {option.toUpperCase()}
                    </Link>
                  )
                })}
              </div>
            </nav>

            <div className="flex items-center gap-3 lg:hidden">
              <div
                className={cn(
                  'flex items-center rounded-full border px-1 py-1',
                  useDarkText ? 'border-stone-500/50' : 'border-white/60'
                )}
                aria-label={uiLabels.languageSwitcher}
              >
                {locales.map((option) => {
                  const isActive = option === locale
                  return (
                    <Link
                      key={option}
                      href={equivalentPathsByLocale[option]}
                      className={cn(
                        'rounded-full px-2 py-1 font-inter text-[9px] tracking-[0.2em] uppercase transition-colors',
                        isActive
                          ? useDarkText
                            ? 'bg-stone-800 text-white'
                            : 'bg-white text-stone-900'
                          : useDarkText
                            ? 'text-stone-700 hover:text-stone-900'
                            : 'text-white/80 hover:text-white'
                      )}
                    >
                      {option.toUpperCase()}
                    </Link>
                  )
                })}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  'lg:hidden relative z-50 p-2 transition-colors duration-300',
                  useDarkText ? 'text-stone-900' : 'text-white'
                )}
                aria-label={isOpen ? uiLabels.closeMenu : uiLabels.openMenu}
              >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4 }}
              className="absolute inset-0 bg-white"
            >
              <div className="flex flex-col items-center justify-center h-full">
                <nav className="flex flex-col items-center gap-8">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'font-cormorant text-3xl tracking-[0.15em] transition-colors duration-300',
                          pathname === item.href
                            ? 'text-stone-900'
                            : 'text-stone-400 hover:text-stone-900'
                        )}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
