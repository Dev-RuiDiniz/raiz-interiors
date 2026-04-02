/*
Arquivo: src/lib/prisma.ts
Objetivo: Funcoes utilitarias e integracoes compartilhadas.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | null | undefined
}

// Prisma v7 requer driver adapter para conexão direta com PostgreSQL
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not configured - Prisma client not initialized')
    return null
  }
  try {
    const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return new PrismaClient({ adapter } as any)
  } catch (e) {
    console.warn('Failed to initialize Prisma client:', e)
    return null
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production' && prisma) {
  globalForPrisma.prisma = prisma
}

export default prisma
