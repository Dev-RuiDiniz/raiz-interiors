import { NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.preprocess(
    (value) => {
      if (typeof value !== 'string') return undefined
      const trimmed = value.trim()
      return trimmed.length > 0 ? trimmed : undefined
    },
    z.string().max(40).optional()
  ),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  locale: z.string().trim().optional(),
  source: z.string().trim().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: 'Dados do formulário inválidos.',
          issues: parsed.error.flatten(),
        },
        { status: 400 }
      )
    }

    const payload = parsed.data
    const contactSource = payload.source || `website-contact-form:${payload.locale || 'en'}`

    if (prisma) {
      try {
        await prisma.contact.create({
          data: {
            name: payload.name,
            email: payload.email,
            phone: payload.phone || null,
            subject: payload.subject,
            message: payload.message,
            source: contactSource,
          },
        })
      } catch (dbError) {
        console.error('Erro ao salvar contato no banco:', dbError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Contato salvo com sucesso.',
      source: contactSource,
    })
  } catch (error) {
    console.error('Erro no salvamento do contato:', error)
    return NextResponse.json(
      { error: 'Erro inesperado ao salvar a mensagem.' },
      { status: 500 }
    )
  }
}
