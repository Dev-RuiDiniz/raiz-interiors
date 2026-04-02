import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'admin@raiz-interiors.com').toLowerCase()

export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return null
  }

  const email = session.user.email.toLowerCase()
  if (email !== ADMIN_EMAIL) {
    return null
  }

  return session
}
