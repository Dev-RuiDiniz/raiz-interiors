import prisma from '@/lib/prisma'
import { defaultProjects, defaultProjectDetails } from '@/lib/cms/default-projects'
import { defaultServices, defaultServiceDetails } from '@/lib/cms/default-services'

export async function getProjectsContent() {
  if (!prisma) {
    return defaultProjects
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
    return defaultProjectDetails[slug] || defaultProjectDetails['summer-house-comporta']
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
    images: project.images.map((image) => image.url),
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

  return {
    slug: service.slug,
    title: service.title,
    subtitle: service.subtitle || '',
    description: service.description || '',
    features: service.features,
    images: service.images.length ? service.images.map((image) => image.url) : [service.coverImage || ''],
    status: service.status,
  }
}
