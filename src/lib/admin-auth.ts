import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const DEFAULT_ADMIN_EMAIL = 'admin@raiz-interiors.com'
const CONFIGURED_ADMIN_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase()

const ALLOWED_ADMIN_EMAILS = new Set(
  [DEFAULT_ADMIN_EMAIL, CONFIGURED_ADMIN_EMAIL].filter((value): value is string => Boolean(value))
)

export async function getAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return null
  }

  const email = session.user.email.toLowerCase()
  if (!ALLOWED_ADMIN_EMAILS.has(email)) {
    return null
  }

  return session
}
