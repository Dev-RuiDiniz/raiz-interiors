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

  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(
    contacts.map((contact) => ({
      id: contact.id,
      name: contact.name,
      email: contact.email,
      phone: contact.phone || '',
      subject: contact.subject || '',
      message: contact.message,
      status: contact.status,
      createdAt: contact.createdAt,
    }))
  )
}
