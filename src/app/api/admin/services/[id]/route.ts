import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { servicePayloadSchema } from '@/lib/cms/admin-schemas'
import { defaultServices } from '@/lib/cms/default-services'

export const runtime = 'nodejs'

function unauthorized() {
  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
}

function notConfigured() {
  return NextResponse.json({ error: 'Database not configured.' }, { status: 503 })
}

interface RouteParams {
  params: Promise<{ id: string }>
}

async function resolveServiceByIdOrFallbackSlug(id: string) {
  if (!prisma) return null

  const byId = await prisma.service.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (byId) return byId

  const fallbackSlug = defaultServices.find((service) => service.id === id)?.slug
  if (!fallbackSlug) return null

  return prisma.service.findUnique({
    where: { slug: fallbackSlug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params
  const service = await resolveServiceByIdOrFallbackSlug(id)

  if (!service) {
    return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
  }

  return NextResponse.json(service)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = servicePayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const payload = parsed.data

  try {
    const existing = await resolveServiceByIdOrFallbackSlug(id)

    const data = {
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
    }

    const service = existing
      ? await prisma.service.update({
          where: { id: existing.id },
          data,
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        })
      : await prisma.service.create({
          data,
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Failed to save service:', error)
    return NextResponse.json(
      { error: 'Failed to save service.' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params

  try {
    const existing = await resolveServiceByIdOrFallbackSlug(id)
    if (!existing) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
    }

    await prisma.service.delete({
      where: { id: existing.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete service:', error)
    return NextResponse.json(
      { error: 'Failed to delete service.' },
      { status: 500 }
    )
  }
}
