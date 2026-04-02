/*
Arquivo: src/app/api/auth/[...nextauth]/route.ts
Objetivo: Endpoint de API do Next.js (App Router).
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import NextAuth from 'next-auth'
import { authOptions } from '@/lib/auth'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

