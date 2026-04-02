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

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params
  const service = await prisma.service.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

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
  const service = await prisma.service.update({
    where: { id },
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
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return NextResponse.json(service)
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params
  await prisma.service.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
