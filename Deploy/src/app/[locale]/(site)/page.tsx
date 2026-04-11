import { IntroSection } from '@/components/sections/intro'
import { FeaturedProjects } from '@/components/sections/featured-projects'
import { ServicesPreview } from '@/components/sections/services-preview'
import { AboutPreview } from '@/components/sections/about-preview'
import { ManagedHero } from '@/components/cms/managed-hero'
import { getProjectsContent, getServicesContent } from '@/lib/cms/content-service'
import { getPublishedPageLayout } from '@/lib/cms/page-layout-service'
import { getPublishedHomeSettings } from '@/lib/cms/home-settings'
import { getDictionary } from '@/i18n/get-dictionary'
import { Locale } from '@/i18n/config'

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const dict = await getDictionary(locale as Locale)

  const localizedProjectList = dict.projects.list as Record<
    string,
    { title?: string; subtitle?: string; location?: string }
  >
  const localizedServiceList = dict.services.list as Record<string, { title?: string }>

  const [projects, services, aboutLayout, homeSettings] = await Promise.all([
    getProjectsContent(),
    getServicesContent(),
    getPublishedPageLayout('home', 'about_preview_image'),
    getPublishedHomeSettings(locale as Locale),
  ])

  const featuredProjects = projects.slice(0, 4).map((project) => {
    const projectDict = localizedProjectList[project.slug]

    return {
      id: project.id,
      slug: project.slug,
      title: projectDict?.title || project.title,
      location: projectDict?.location || project.location,
      coverImage: project.coverImage,
      status: project.status === 'DRAFT' ? 'WORK_IN_PROGRESS' : project.status,
    }
  })

  const aboutImageUrl = aboutLayout.exists
    ? aboutLayout.layout.items[0]?.src || '/2026/home/beautiful_homes.png'
    : '/2026/home/beautiful_homes.png'

  const serviceCards = services.map((service) => ({
    slug: service.slug,
    title: localizedServiceList[service.slug]?.title || service.title,
  }))

  const heroDict = {
    ...dict.home.hero,
    slide1: {
      ...dict.home.hero.slide1,
      line1: homeSettings.hero_slide1_line1 || dict.home.hero.slide1.line1,
      line2: homeSettings.hero_slide1_line2 || dict.home.hero.slide1.line2,
    },
    slide2: {
      ...dict.home.hero.slide2,
      line1: homeSettings.hero_slide2_line1 || dict.home.hero.slide2.line1,
      line2: homeSettings.hero_slide2_line2 || dict.home.hero.slide2.line2,
    },
    slide3: {
      ...dict.home.hero.slide3,
      line1: homeSettings.hero_slide3_line1 || dict.home.hero.slide3.line1,
      line2: homeSettings.hero_slide3_line2 || dict.home.hero.slide3.line2,
    },
    slide4: {
      ...dict.home.hero.slide4,
      line1: homeSettings.hero_slide4_line1 || dict.home.hero.slide4.line1,
      line2: homeSettings.hero_slide4_line2 || dict.home.hero.slide4.line2,
    },
    slide5: {
      ...dict.home.hero.slide5,
      line1: homeSettings.hero_slide5_line1 || dict.home.hero.slide5.line1,
      line2: homeSettings.hero_slide5_line2 || dict.home.hero.slide5.line2,
    },
    slide6: {
      ...dict.home.hero.slide6,
      line1: homeSettings.hero_slide6_line1 || dict.home.hero.slide6.line1,
      line2: homeSettings.hero_slide6_line2 || dict.home.hero.slide6.line2,
    },
    backgroundImage: homeSettings.home_background_image,
    backgroundColor: homeSettings.home_background_color,
    textColor: homeSettings.home_text_color,
    overlayColor: homeSettings.home_overlay_color,
  }

  const introDict = {
    ...dict.home.intro,
    text: homeSettings.intro_text || dict.home.intro.text,
  }

  const featuredDict = {
    ...dict.home.featured_projects,
    label: homeSettings.featured_title || dict.home.featured_projects.label,
    view_all: homeSettings.featured_cta_label || dict.home.featured_projects.view_all,
    ctaUrl: homeSettings.featured_cta_url || `/${locale}/projects`,
  }

  const servicesPreviewDict = {
    ...dict.home.services_preview,
    label: homeSettings.services_preview_title || dict.home.services_preview.label,
    text: homeSettings.services_preview_text || dict.home.services_preview.text,
    cta: homeSettings.services_preview_cta_label || dict.home.services_preview.cta,
    ctaUrl: homeSettings.services_preview_cta_url || `/${locale}/services`,
  }

  const aboutPreviewDict = {
    ...dict.home.about_preview,
    text: homeSettings.about_preview_text || dict.home.about_preview.text,
    cta: homeSettings.about_preview_cta_label || dict.home.about_preview.cta,
    ctaUrl: homeSettings.about_preview_cta_url || `/${locale}/about`,
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: homeSettings.home_background_color,
        color: homeSettings.home_text_color,
      }}
    >
      <ManagedHero dict={heroDict} locale={locale as Locale} />
      <IntroSection dict={introDict} locale={locale as Locale} />
      <FeaturedProjects
        projects={featuredProjects}
        dict={featuredDict}
        locale={locale as Locale}
      />
      <ServicesPreview dict={servicesPreviewDict} services={serviceCards} locale={locale as Locale} />
      <AboutPreview dict={aboutPreviewDict} imageUrl={aboutImageUrl} locale={locale as Locale} />
    </div>
  )
}
