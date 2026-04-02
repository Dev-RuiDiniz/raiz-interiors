import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { servicePayloadSchema } from '@/lib/cms/admin-schemas'

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
  const services = await prisma.service.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'asc' }],
    include: includeImages
      ? {
          images: {
            orderBy: { order: 'asc' },
          },
        }
      : undefined,
  })

  return NextResponse.json(services)
}

export async function POST(request: NextRequest) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const body = await request.json().catch(() => null)
  const parsed = servicePayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const payload = parsed.data
  const service = await prisma.service.create({
    data: {
      slug: payload.slug,
      title: payload.title,
      subtitle: payload.subtitle,
      description: payload.description,
      coverImage: payload.coverImage,
      icon: payload.icon,
      features: payload.features,
      order: payload.order,
      status: payload.status,
      active: payload.active,
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

  return NextResponse.json(service, { status: 201 })
}
