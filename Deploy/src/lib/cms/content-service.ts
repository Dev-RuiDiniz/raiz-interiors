import prisma from '@/lib/prisma'
import { defaultProjects, defaultProjectDetails } from '@/lib/cms/default-projects'
import { defaultServices, defaultServiceDetails } from '@/lib/cms/default-services'
import { getPublishedPageLayout } from '@/lib/cms/page-layout-service'
import { getLocalProjectBySlug, getLocalProjects } from '@/lib/cms/local-project-store'

type ProjectImageSource = string | { url?: string | null; visible?: boolean | null; order?: number | null }

type ProjectLike = {
  slug: string
  coverImage: string
  images?: ProjectImageSource[]
}

export async function resolveProjectDetailImages(project: ProjectLike) {
  const visibleImages =
    project.images
      ?.map((image) => {
        if (typeof image === 'string') return image
        if (image.visible === false) return ''
        return image.url || ''
      })
      .filter(Boolean) || []

  let detailImages = visibleImages

  const publishedDetailLayout = await getPublishedPageLayout(`project:${project.slug}`, 'detail_gallery')
  if (publishedDetailLayout.exists && publishedDetailLayout.layout.items.length > 0) {
    detailImages = publishedDetailLayout.layout.items
      .filter((item) => item.visible)
      .sort((a, b) => a.order - b.order)
      .map((item) => item.src)
      .filter(Boolean)
  }

  if (!detailImages.length) {
    const fallbackImages = defaultProjectDetails[project.slug]?.images || []
    detailImages = fallbackImages.length ? fallbackImages : project.coverImage ? [project.coverImage] : []
  }

  return detailImages
}

export async function getProjectsContent() {
  if (!prisma) {
    const projects = await getLocalProjects()
    return projects.map((project, index) => ({
      id: project.id,
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle || '',
      location: project.location,
      category: project.category,
      status: project.status,
      coverImage: project.coverImage,
      order: project.order ?? index + 1,
    }))
  }

  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })

  if (!projects.length) {
    return defaultProjects
  }

  return projects.map((project, index) => ({
    id: project.id,
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle || '',
    location: project.location,
    category: project.category,
    status: project.status,
    coverImage: project.coverImage,
    order: project.order ?? index + 1,
  }))
}

export async function getProjectDetailContent(slug: string) {
  if (!prisma) {
    const project = await getLocalProjectBySlug(slug)
    if (!project) {
      return defaultProjectDetails[slug] || defaultProjectDetails['summer-house-comporta']
    }

    return {
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle || '',
      location: project.location,
      category: project.category,
      status: project.status,
      year: project.year || '',
      client: project.client || '',
      description: project.description || '',
      credits: project.credits || '',
      photography: '',
      coverImage: project.coverImage,
      images: project.images?.length ? project.images : defaultProjectDetails[slug]?.images || (project.coverImage ? [project.coverImage] : []),
    }
  }

  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      images: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!project) {
    return defaultProjectDetails[slug] || defaultProjectDetails['summer-house-comporta']
  }

  const detailImages = await resolveProjectDetailImages({
    slug: project.slug,
    coverImage: project.coverImage,
    images: project.images,
  })

  return {
    slug: project.slug,
    title: project.title,
    subtitle: project.subtitle || '',
    location: project.location,
    category: project.category,
    status: project.status,
    year: project.year || '',
    client: project.client || '',
    description: project.description || '',
    credits: project.credits || '',
    photography: '',
    coverImage: project.coverImage,
    images: detailImages,
  }
}

export async function getServicesContent() {
  if (!prisma) {
    return defaultServices
  }

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
  })

  if (!services.length) {
    return defaultServices
  }

  return services.map((service, index) => ({
    id: service.id,
    slug: service.slug,
    title: service.title,
    excerpt: service.subtitle || '',
    image: service.coverImage || defaultServices[index % defaultServices.length]?.image || '',
    status: service.status,
    order: service.order ?? index + 1,
  }))
}

export async function getServiceDetailContent(slug: string) {
  if (!prisma) {
    return defaultServiceDetails[slug] || defaultServiceDetails['interior-design']
  }

  const service = await prisma.service.findUnique({
    where: { slug },
    include: {
      images: {
        where: { visible: true },
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!service) {
    return defaultServiceDetails[slug] || defaultServiceDetails['interior-design']
  }

  let detailImages = service.images.map((image) => image.url)
  const publishedDetailLayout = await getPublishedPageLayout(`service:${service.slug}`, 'detail_gallery')
  if (publishedDetailLayout.exists && publishedDetailLayout.layout.items.length > 0) {
    detailImages = publishedDetailLayout.layout.items
      .filter((item) => item.visible)
      .sort((a, b) => a.order - b.order)
      .map((item) => item.src)
      .filter(Boolean)
  }

  if (!detailImages.length) {
    detailImages = service.coverImage ? [service.coverImage] : []
  }

  return {
    slug: service.slug,
    title: service.title,
    subtitle: service.subtitle || '',
    description: service.description || '',
    features: service.features,
    images: detailImages,
    status: service.status,
  }
}
