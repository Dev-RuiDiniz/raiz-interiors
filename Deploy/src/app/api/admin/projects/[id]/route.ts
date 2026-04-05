import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'
import { projectPayloadSchema } from '@/lib/cms/admin-schemas'
import { defaultProjects, defaultProjectDetails } from '@/lib/cms/default-projects'
import { resolveProjectDetailImages } from '@/lib/cms/content-service'
import {
  deleteLocalProjectByIdOrFallbackSlug,
  getLocalProjectByIdOrFallbackSlug,
  upsertLocalProjectByIdOrFallbackSlug,
} from '@/lib/cms/local-project-store'

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

async function resolveProjectByIdOrFallbackSlug(id: string) {
  if (!prisma) return null

  const byId = await prisma.project.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (byId) return byId

  const fallbackSlug = defaultProjects.find((project) => project.id === id)?.slug
  if (!fallbackSlug) return null

  return prisma.project.findUnique({
    where: { slug: fallbackSlug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
    },
  })
}

async function hydrateProjectImages(project: {
  slug: string
  coverImage: string
  images?: Array<{ url?: string | null; visible?: boolean | null } | string>
}) {
  const images = await resolveProjectDetailImages(project)
  return {
    ...project,
    images: images.length ? images : defaultProjectDetails[project.slug]?.images || [],
  }
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const { id } = await params
  if (!prisma) {
    const project = await getLocalProjectByIdOrFallbackSlug(id)
    if (!project) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
    }
    return NextResponse.json(
      await hydrateProjectImages({
        ...project,
        images: project.images,
      })
    )
  }

  const project = await resolveProjectByIdOrFallbackSlug(id)

  if (!project) {
    return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
  }

  return NextResponse.json(
    await hydrateProjectImages({
      ...project,
      images: project.images,
    })
  )
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

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

  if (!prisma) {
    try {
      const project = await upsertLocalProjectByIdOrFallbackSlug(id, payload)
      return NextResponse.json(project)
    } catch (error) {
      console.error('Failed to save local project:', error)
      return NextResponse.json({ error: 'Failed to save project.' }, { status: 500 })
    }
  }

  try {
    const existing = await resolveProjectByIdOrFallbackSlug(id)

    const data = {
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
    }

    const project = existing
      ? await prisma.project.update({
          where: { id: existing.id },
          data,
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        })
      : await prisma.project.create({
          data,
          include: {
            images: {
              orderBy: { order: 'asc' },
            },
          },
        })

    return NextResponse.json(project)
  } catch (error) {
    console.error('Failed to save project:', error)
    return NextResponse.json(
      { error: 'Failed to save project.' },
      { status: 500 }
    )
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await getAdminSession()
  if (!session) return unauthorized()

  const { id } = await params

  if (!prisma) {
    try {
      const deleted = await deleteLocalProjectByIdOrFallbackSlug(id)
      if (!deleted) {
        return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
      }
      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Failed to delete local project:', error)
      return NextResponse.json({ error: 'Failed to delete project.' }, { status: 500 })
    }
  }

  try {
    const existing = await resolveProjectByIdOrFallbackSlug(id)
    if (!existing) {
      return NextResponse.json({ error: 'Project not found.' }, { status: 404 })
    }

    await prisma.project.delete({
      where: { id: existing.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete project:', error)
    return NextResponse.json(
      { error: 'Failed to delete project.' },
      { status: 500 }
    )
  }
}
