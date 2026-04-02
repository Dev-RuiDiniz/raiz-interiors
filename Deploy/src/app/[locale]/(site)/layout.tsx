import type { Metadata } from 'next'
import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { locales, type Locale } from '@/i18n/config'
import { getDictionary } from '@/i18n/get-dictionary'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { GDPRBanner } from '@/components/ui/gdpr-banner'

const pageMetadata: Record<Locale, Record<string, { title: string; description: string }>> = {
  en: {
    '/': {
      title: 'RAIZ Interiors | Interior Design Studio',
      description:
        'Creating meaningful spaces that tell your story through thoughtful design and attention to detail.',
    },
    '/about': {
      title: 'About | RAIZ Interiors',
      description:
        'Meet RAIZ Interiors and discover our values, design approach, and studio vision.',
    },
    '/contact': {
      title: 'Contact | RAIZ Interiors',
      description:
        'Start your project with RAIZ Interiors. Contact our Lisbon-based interior design studio.',
    },
    '/services': {
      title: 'Services | RAIZ Interiors',
      description:
        'Explore architecture, interior design, decoration, consultancy, and styling services by RAIZ Interiors.',
    },
    '/projects': {
      title: 'Projects | RAIZ Interiors',
      description:
        'Browse selected interior design and architecture projects by RAIZ Interiors.',
    },
    '/privacy': {
      title: 'Privacy Policy | RAIZ Interiors',
      description:
        'Read the RAIZ Interiors privacy policy and how we handle personal information.',
    },
    '/terms': {
      title: 'Terms of Use | RAIZ Interiors',
      description:
        'Read the terms and conditions for using the RAIZ Interiors website.',
    },
  },
  pt: {
    '/': {
      title: 'RAIZ Interiors | Estudio de Design de Interiores',
      description:
        'Criamos espacos com significado que contam a sua historia atraves de um design cuidado e atencao ao detalhe.',
    },
    '/about': {
      title: 'Sobre | RAIZ Interiors',
      description:
        'Conheca a RAIZ Interiors e descubra os nossos valores e abordagem ao design.',
    },
    '/contact': {
      title: 'Contacto | RAIZ Interiors',
      description:
        'Inicie o seu projeto com a RAIZ Interiors. Contacte o nosso estudio em Lisboa.',
    },
    '/services': {
      title: 'Servicos | RAIZ Interiors',
      description:
        'Explore servicos de arquitetura, design de interiores, decoracao, consultoria e styling.',
    },
    '/projects': {
      title: 'Projetos | RAIZ Interiors',
      description:
        'Descubra uma selecao de projetos de design de interiores e arquitetura da RAIZ Interiors.',
    },
    '/privacy': {
      title: 'Politica de Privacidade | RAIZ Interiors',
      description:
        'Leia a politica de privacidade da RAIZ Interiors e o tratamento de dados pessoais.',
    },
    '/terms': {
      title: 'Termos de Utilizacao | RAIZ Interiors',
      description:
        'Leia os termos e condicoes de utilizacao do website da RAIZ Interiors.',
    },
  },
}

const stripLocaleFromPathname = (pathname: string, locale: Locale): string => {
  const localeBasePath = `/${locale}`

  if (pathname === localeBasePath) return '/'

  if (pathname.startsWith(`${localeBasePath}/`)) {
    return pathname.slice(localeBasePath.length)
  }

  return '/'
}

const formatSlug = (value: string): string => {
  return decodeURIComponent(value)
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

const getDynamicMetadata = (locale: Locale, pathWithoutLocale: string) => {
  if (pathWithoutLocale.startsWith('/services/')) {
    const slug = formatSlug(pathWithoutLocale.replace('/services/', ''))
    return {
      title:
        locale === 'pt'
          ? `${slug} | Servicos | RAIZ Interiors`
          : `${slug} | Services | RAIZ Interiors`,
      description:
        locale === 'pt'
          ? 'Detalhes de servico e processo de design da RAIZ Interiors.'
          : 'Service details and design process from RAIZ Interiors.',
    }
  }

  if (pathWithoutLocale.startsWith('/projects/')) {
    const slug = formatSlug(pathWithoutLocale.replace('/projects/', ''))
    return {
      title:
        locale === 'pt'
          ? `${slug} | Projetos | RAIZ Interiors`
          : `${slug} | Projects | RAIZ Interiors`,
      description:
        locale === 'pt'
          ? 'Detalhes de projeto e inspiracao da RAIZ Interiors.'
          : 'Project details and inspiration from RAIZ Interiors.',
    }
  }

  return pageMetadata[locale]['/']
}

const getMetadataForPath = (locale: Locale, pathWithoutLocale: string) => {
  return pageMetadata[locale][pathWithoutLocale] ?? getDynamicMetadata(locale, pathWithoutLocale)
}

const buildLocalizedPath = (locale: Locale, pathWithoutLocale: string) => {
  if (pathWithoutLocale === '/') return `/${locale}`
  return `/${locale}${pathWithoutLocale}`
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    return {}
  }

  const localeValue = locale as Locale
  const headerStore = await headers()
  const pathname = headerStore.get('x-pathname') ?? `/${localeValue}`
  const pathWithoutLocale = stripLocaleFromPathname(pathname, localeValue)
  const seo = getMetadataForPath(localeValue, pathWithoutLocale)
  const canonicalPath = buildLocalizedPath(localeValue, pathWithoutLocale)

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: buildLocalizedPath('en', pathWithoutLocale),
        'pt-PT': buildLocalizedPath('pt', pathWithoutLocale),
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      type: 'website',
      locale: localeValue === 'pt' ? 'pt_PT' : 'en_US',
      url: canonicalPath,
    },
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale as Locale)

  return (
    <>
      <Header dict={dictionary.nav} locale={locale as Locale} />
      <main>{children}</main>
      <Footer dict={dictionary.footer} locale={locale as Locale} />
      <GDPRBanner locale={locale as Locale} />
    </>
  )
}
