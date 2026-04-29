'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Menu } from 'lucide-react'

import { Sheet, SheetClose, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { isLocale, locales, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

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
  const LOGO_DESKTOP_CLASS =
    'block h-auto w-[202px] object-contain transition-all duration-500 sm:w-[240px] lg:w-[350px]'
  const HEADER_HEIGHT_CLASS =
    'flex min-h-[80px] items-center justify-between gap-4 lg:min-h-[96px]'

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
        }
      : {
          languageSwitcher: 'Language switcher',
          openMenu: 'Open menu',
        }

  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [hasMounted, setHasMounted] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const darkHeroPages = [`/${locale}`]
  const hasDarkHero = darkHeroPages.includes(pathname) || pathname.startsWith(`/${locale}/projects/`)

  const effectiveScrolled = hasMounted ? isScrolled : false
  const useDarkText = !hasDarkHero || effectiveScrolled || isOpen

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
    setHasMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 w-full transition-all duration-500',
          effectiveScrolled ? 'bg-[#CFCAC7] backdrop-blur-md shadow-sm' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-6 lg:px-12">
          <div className={HEADER_HEIGHT_CLASS}>
            <Link href={`/${locale}`} className="relative z-50 block shrink-0 flex-none">
              <Image
                src="/raizlogo_white.png"
                alt="RAIZ Interiors"
                priority
                loading="eager"
                unoptimized
                width={375}
                height={133}
                className={cn(
                  LOGO_DESKTOP_CLASS,
                  useDarkText ? 'opacity-0 pointer-events-none absolute inset-0' : 'opacity-100'
                )}
              />
              <Image
                src="/raizlogo_preta.png"
                alt="RAIZ Interiors"
                unoptimized
                width={375}
                height={133}
                className={cn(
                  LOGO_DESKTOP_CLASS,
                  useDarkText ? 'opacity-100' : 'opacity-0 absolute inset-0'
                )}
              />
            </Link>

            <nav className="hidden items-center gap-12 lg:flex">
              {navItems.map((item) => (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'relative whitespace-nowrap font-inter text-xs leading-none tracking-[0.2em] uppercase transition-colors duration-300 group',
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
                </div>
              ))}

              <div
                className={cn(
                  'flex items-center rounded-full border px-1 py-1 whitespace-nowrap',
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
                        'rounded-full px-3 py-1 font-inter text-[10px] leading-none tracking-[0.2em] uppercase transition-colors',
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

            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                  'flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition-colors duration-300',
                  useDarkText ? 'text-stone-900' : 'text-white'
                )}
                aria-label={uiLabels.openMenu}
                aria-expanded={isOpen}
                aria-controls="mobile-navigation-drawer"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side="right"
          className="z-[60] w-[85vw] max-w-sm overflow-y-auto px-6 py-8 sm:px-8"
          id="mobile-navigation-drawer"
        >
          <SheetTitle className="sr-only">{uiLabels.openMenu}</SheetTitle>

          <div className="flex h-full min-h-full flex-col justify-between pt-10">
            <nav className="flex flex-1 flex-col items-center justify-center gap-8">
              {navItems.map((item) => (
                <SheetClose asChild key={item.href}>
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
                </SheetClose>
              ))}
            </nav>

            <div className="mt-10 flex flex-col items-center gap-3">
              <p className="font-inter text-[10px] tracking-[0.25em] uppercase text-stone-500">
                {uiLabels.languageSwitcher}
              </p>

              <div
                className={cn(
                  'flex items-center rounded-full border px-1 py-1 whitespace-nowrap',
                  useDarkText ? 'border-stone-500/50' : 'border-stone-300'
                )}
                aria-label={uiLabels.languageSwitcher}
              >
                {locales.map((option) => {
                  const isActive = option === locale
                  return (
                    <SheetClose asChild key={option}>
                      <Link
                        href={equivalentPathsByLocale[option]}
                        className={cn(
                          'rounded-full px-3 py-1 font-inter text-[10px] leading-none tracking-[0.2em] uppercase transition-colors',
                          isActive
                            ? 'bg-stone-800 text-white'
                            : 'text-stone-600 hover:text-stone-900'
                        )}
                      >
                        {option.toUpperCase()}
                      </Link>
                    </SheetClose>
                  )
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
