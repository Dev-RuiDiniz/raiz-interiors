import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { imagePayloadSchema } from '@/lib/cms/admin-schemas'
import {
  getLocalServiceByIdOrFallbackSlug,
  upsertLocalServiceByIdOrFallbackSlug,
} from '@/lib/cms/local-service-store'

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

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const { id: serviceId } = await params
  const body = await request.json().catch(() => null)
  const parsed = imagePayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  if (!prisma) {
    const existing = await getLocalServiceByIdOrFallbackSlug(serviceId)
    if (!existing) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
    }

    const nextImages = [...existing.images, parsed.data.url].filter(Boolean)
    const updated = await upsertLocalServiceByIdOrFallbackSlug(serviceId, {
      slug: existing.slug,
      title: existing.title,
      subtitle: existing.subtitle,
      description: existing.description,
      coverImage: existing.coverImage,
      icon: existing.icon,
      features: existing.features,
      order: existing.order,
      status: existing.status,
      active: existing.active,
      images: nextImages.map((url, index) => ({
        url,
        alt: '',
        width: null,
        height: null,
        order: index,
        visible: true,
        desktopLayout: null,
        mobileLayout: null,
      })),
    })

    return NextResponse.json(updated, { status: 201 })
  }

  const image = await prisma.serviceImage.create({
    data: {
      serviceId,
      url: parsed.data.url,
      alt: parsed.data.alt,
      width: parsed.data.width,
      height: parsed.data.height,
      order: parsed.data.order,
      visible: parsed.data.visible,
      desktopLayout: parsed.data.desktopLayout ?? undefined,
      mobileLayout: parsed.data.mobileLayout ?? undefined,
    },
  })

  return NextResponse.json(image, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const { id: serviceId } = await params
  const imageId = request.nextUrl.searchParams.get('imageId')

  if (!imageId) {
    return NextResponse.json({ error: 'imageId is required.' }, { status: 400 })
  }

  if (!prisma) {
    const existing = await getLocalServiceByIdOrFallbackSlug(serviceId)
    if (!existing) {
      return NextResponse.json({ error: 'Service not found.' }, { status: 404 })
    }

    const nextImages = existing.images.filter((url) => url !== imageId)
    await upsertLocalServiceByIdOrFallbackSlug(serviceId, {
      slug: existing.slug,
      title: existing.title,
      subtitle: existing.subtitle,
      description: existing.description,
      coverImage: existing.coverImage,
      icon: existing.icon,
      features: existing.features,
      order: existing.order,
      status: existing.status,
      active: existing.active,
      images: nextImages.map((url, index) => ({
        url,
        alt: '',
        width: null,
        height: null,
        order: index,
        visible: true,
        desktopLayout: null,
        mobileLayout: null,
      })),
    })

    return NextResponse.json({ success: true })
  }

  await prisma.serviceImage.deleteMany({
    where: {
      id: imageId,
      serviceId,
    },
  })

  return NextResponse.json({ success: true })
}