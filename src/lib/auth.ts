/*
Arquivo: src/lib/auth.ts
Objetivo: Funcoes utilitarias e integracoes compartilhadas.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

const nextAuthSecret = process.env.NEXTAUTH_SECRET

if (!nextAuthSecret) {
  console.warn(
    'NEXTAUTH_SECRET not configured. Using fallback secret (configure this in staging/production).'
  )
}

// Usuário admin temporário (depois migrar para banco de dados)
const ADMIN_USER = {
  id: '1',
  name: 'Admin',
  email: 'admin@raiz-interiors.com',
  // Senha: admin123 (hash bcrypt)
  password: '$2a$10$8K1p/a0dL1LXMIgoEDFrwOex5F3c.0P6T5Q5Q5Q5Q5Q5Q5Q5Q5Q5u',
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required')
        }

        // Verificar credenciais (temporário - depois usar Prisma)
        if (credentials.email === ADMIN_USER.email) {
          // Para desenvolvimento, aceitar qualquer senha "admin123"
          if (credentials.password === 'admin123') {
            return {
              id: ADMIN_USER.id,
              name: ADMIN_USER.name,
              email: ADMIN_USER.email,
            }
          }
        }

        throw new Error('Invalid credentials')
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 dias
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id
      }
      return session
    },
  },
  secret: nextAuthSecret || 'dev-only-nextauth-secret',
}

