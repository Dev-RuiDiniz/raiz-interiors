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

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  }

  return NextResponse.json(project)
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = projectPayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const payload = parsed.data

  const project = await prisma.project.update({
    where: { id },
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
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  return NextResponse.json(project)
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()
  if (!prisma) return notConfigured()

  const { id } = await params
  await prisma.project.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
