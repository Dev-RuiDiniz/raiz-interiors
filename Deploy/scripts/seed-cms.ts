import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { defaultProjects, defaultProjectDetails } from '../src/lib/cms/default-projects'
import { defaultServices, defaultServiceDetails } from '../src/lib/cms/default-services'
import { defaultPageSectionLayouts } from '../src/lib/cms/default-layouts'
import { createDefaultBox } from '../src/lib/cms/layout-types'

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DIRECT_URL or DATABASE_URL is required to run cms seed.')
}

const schema = process.env.DATABASE_SCHEMA?.trim()
const adapter = new PrismaPg(
  { connectionString },
  schema ? { schema } : undefined
)
const prisma = new PrismaClient({ adapter } as any)

function layoutFromImages(images: string[]) {
  return {
    items: images.map((src, index) => ({
      id: `img-${index + 1}`,
      src,
      alt: '',
      order: index,
      visible: true,
      desktop: createDefaultBox({
        x: (index % 3) * 33.34,
        y: Math.floor(index / 3) * 33.34,
        w: 33.34,
        h: 33.34,
      }),
      mobile: createDefaultBox({
        x: (index % 2) * 50,
        y: Math.floor(index / 2) * 26,
        w: 50,
        h: 26,
      }),
    })),
    canvasHeightDesktop: 700,
    canvasHeightMobile: 1050,
  }
}

async function seedProjects() {
  for (const project of defaultProjects) {
    const detail = defaultProjectDetails[project.slug]
    const created = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        title: detail?.title || project.title,
        subtitle: detail?.subtitle || project.subtitle,
        location: detail?.location || project.location,
        category: detail?.category || project.category,
        status: detail?.status || project.status,
        description: detail?.description || '',
        coverImage: detail?.coverImage || project.coverImage,
        year: detail?.year || '',
        client: detail?.client || '',
        credits: detail?.credits || '',
        featured: project.status === 'PUBLISHED',
        order: project.order,
      },
      create: {
        slug: project.slug,
        title: detail?.title || project.title,
        subtitle: detail?.subtitle || project.subtitle,
        location: detail?.location || project.location,
        category: detail?.category || project.category,
        status: detail?.status || project.status,
        description: detail?.description || '',
        coverImage: detail?.coverImage || project.coverImage,
        year: detail?.year || '',
        client: detail?.client || '',
        credits: detail?.credits || '',
        featured: project.status === 'PUBLISHED',
        order: project.order,
      },
    })

    await prisma.projectImage.deleteMany({ where: { projectId: created.id } })
    const images = detail?.images || []
    for (let i = 0; i < images.length; i += 1) {
      const url = images[i]
      await prisma.projectImage.create({
        data: {
          projectId: created.id,
          url,
          alt: `${created.title} image ${i + 1}`,
          order: i,
          visible: true,
          desktopLayout: createDefaultBox(),
          mobileLayout: createDefaultBox(),
        },
      })
    }

    await prisma.pageSectionLayout.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey: `project:${project.slug}`,
          sectionKey: 'detail_gallery',
        },
      },
      update: {
        draft: layoutFromImages(images),
        published: layoutFromImages(images),
        publishedAt: new Date(),
      },
      create: {
        pageKey: `project:${project.slug}`,
        sectionKey: 'detail_gallery',
        draft: layoutFromImages(images),
        published: layoutFromImages(images),
        publishedAt: new Date(),
      },
    })
  }
}

async function seedServices() {
  for (const service of defaultServices) {
    const detail = defaultServiceDetails[service.slug]
    const created = await prisma.service.upsert({
      where: { slug: service.slug },
      update: {
        title: detail?.title || service.title,
        subtitle: detail?.subtitle || '',
        description: detail?.description || service.excerpt,
        coverImage: service.image,
        features: detail?.features || [],
        order: service.order,
        status: service.status,
        active: service.status === 'PUBLISHED',
      },
      create: {
        slug: service.slug,
        title: detail?.title || service.title,
        subtitle: detail?.subtitle || '',
        description: detail?.description || service.excerpt,
        coverImage: service.image,
        features: detail?.features || [],
        order: service.order,
        status: service.status,
        active: service.status === 'PUBLISHED',
      },
    })

    await prisma.serviceImage.deleteMany({ where: { serviceId: created.id } })
    const images = detail?.images || [service.image]
    for (let i = 0; i < images.length; i += 1) {
      const url = images[i]
      await prisma.serviceImage.create({
        data: {
          serviceId: created.id,
          url,
          alt: `${created.title} image ${i + 1}`,
          order: i,
          visible: true,
          desktopLayout: createDefaultBox(),
          mobileLayout: createDefaultBox(),
        },
      })
    }

    await prisma.pageSectionLayout.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey: `service:${service.slug}`,
          sectionKey: 'detail_gallery',
        },
      },
      update: {
        draft: layoutFromImages(images),
        published: layoutFromImages(images),
        publishedAt: new Date(),
      },
      create: {
        pageKey: `service:${service.slug}`,
        sectionKey: 'detail_gallery',
        draft: layoutFromImages(images),
        published: layoutFromImages(images),
        publishedAt: new Date(),
      },
    })
  }
}

async function seedPageLayouts() {
  for (const [pageKey, sections] of Object.entries(defaultPageSectionLayouts)) {
    for (const [sectionKey, layout] of Object.entries(sections)) {
      await prisma.pageSectionLayout.upsert({
        where: {
          pageKey_sectionKey: {
            pageKey,
            sectionKey,
          },
        },
        update: {
          draft: layout,
          published: layout,
          publishedAt: new Date(),
        },
        create: {
          pageKey,
          sectionKey,
          draft: layout,
          published: layout,
          publishedAt: new Date(),
        },
      })
    }
  }
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to run cms seed.')
  }

  await seedProjects()
  await seedServices()
  await seedPageLayouts()
}

main()
  .then(async () => {
    await prisma.$disconnect()
    console.log('CMS seed completed.')
  })
  .catch(async (error) => {
    await prisma.$disconnect()
    console.error('CMS seed failed:', error)
    process.exit(1)
  })
