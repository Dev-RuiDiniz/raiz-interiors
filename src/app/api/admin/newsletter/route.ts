import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getAdminSession } from '@/lib/admin-auth'

export const runtime = 'nodejs'

function forbidden() {
  return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
}

export async function GET() {
  const session = await getAdminSession()
  if (!session) return forbidden()
  if (!prisma) return NextResponse.json([])

  const subscribers = await prisma.newsletter.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    subscribers.map((subscriber) => ({
      id: subscriber.id,
      email: subscriber.email,
      active: subscriber.active,
      createdAt: subscriber.createdAt,
    }))
  )
}
