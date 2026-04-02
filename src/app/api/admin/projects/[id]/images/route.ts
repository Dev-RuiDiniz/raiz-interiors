import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { imagePayloadSchema } from '@/lib/cms/admin-schemas'

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
  if (!prisma) return notConfigured()

  const { id: projectId } = await params
  const body = await request.json().catch(() => null)
  const parsed = imagePayloadSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid payload.', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const image = await prisma.projectImage.create({
    data: {
      projectId,
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
  if (!prisma) return notConfigured()

  const { id: projectId } = await params
  const imageId = request.nextUrl.searchParams.get('imageId')

  if (!imageId) {
    return NextResponse.json({ error: 'imageId is required.' }, { status: 400 })
  }

  await prisma.projectImage.deleteMany({
    where: {
      id: imageId,
      projectId,
    },
  })

  return NextResponse.json({ success: true })
}
