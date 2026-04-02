import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { projectPayloadSchema } from '@/lib/cms/admin-schemas'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
}

function notConfigured() {
  return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
}

export async function GET(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const includeImages = request.nextUrl.searchParams.get('includeImages') === 'true'

  const projects = await prisma.project.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    include: includeImages
      ? {
          images: {
            orderBy: { order: 'asc' },
          },
        }
      : undefined,
  })

  return NextResponse.json(projects)
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const body = await request.json().catch(() => null)
  const parsed = projectPayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const payload = parsed.data

  const project = await prisma.project.create({
    data: {
      slug: payload.slug,
      title: payload.title,
      subtitle: payload.subtitle,
      location: payload.location,
      category: payload.category,
      status: payload.status,
      description: payload.description,
      coverImage: payload.coverImage,
      year: payload.year,
      client: payload.client,
      area: payload.area,
      credits: payload.credits,
      featured: payload.featured,
      order: payload.order,
      images: payload.images.length
        ? {
            create: payload.images.map((image) => ({
              url: image.url,
              alt: image.alt,
              width: image.width,
              height: image.height,
              order: image.order,
              visible: image.visible,
              desktopLayout: image.desktopLayout ?? undefined,
              mobileLayout: image.mobileLayout ?? undefined,
            })),
          }
        : undefined,
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return NextResponse.json(project, { status: 201 })
}
