import { getInstagramPosts } from '@/lib/apify'
import { prisma } from '@/lib/prisma'

interface SyncOptions {
  force?: boolean
  minIntervalMinutes?: number
}

interface SyncStats {
  total: number
  created: number
  updated: number
  skipped: number
}

type SyncReason = 'token_missing' | 'database_unavailable' | 'recent_sync' | 'no_posts_from_apify'

export interface InstagramSyncResult {
  success: boolean
  skipped: boolean
  reason?: SyncReason
  message: string
  stats: SyncStats
}

const DEFAULT_INTERVAL_MINUTES = 30

let syncInFlight: Promise<InstagramSyncResult> | null = null

const emptyStats = (): SyncStats => ({
  total: 0,
  created: 0,
  updated: 0,
  skipped: 0,
})

function skippedResult(reason: SyncReason, message: string): InstagramSyncResult {
  return {
    success: false,
    skipped: true,
    reason,
    message,
    stats: emptyStats(),
  }
}

async function canSkipByInterval(minIntervalMinutes: number): Promise<boolean> {
  if (!prisma) return false

  const lastSavedPost = await prisma.instagramPost.findFirst({
    select: { updatedAt: true },
    orderBy: { updatedAt: 'desc' },
  })

  if (!lastSavedPost) return false

  const elapsedMs = Date.now() - new Date(lastSavedPost.updatedAt).getTime()
  const minIntervalMs = minIntervalMinutes * 60 * 1000

  return elapsedMs < minIntervalMs
}

export async function syncInstagramPosts(options: SyncOptions = {}): Promise<InstagramSyncResult> {
  const { force = false, minIntervalMinutes = DEFAULT_INTERVAL_MINUTES } = options

  if (!process.env.APIFY_API_TOKEN) {
    return skippedResult(
      'token_missing',
      'APIFY_API_TOKEN não configurada. Sincronização automática desativada.'
    )
  }

  if (!prisma) {
    return skippedResult('database_unavailable', 'Database não configurada.')
  }

  if (!force && (await canSkipByInterval(minIntervalMinutes))) {
    return skippedResult(
      'recent_sync',
      `Sincronização ignorada: última atualização ocorreu há menos de ${minIntervalMinutes} minuto(s).`
    )
  }

  if (!syncInFlight) {
    syncInFlight = (async () => {
      const posts = await getInstagramPosts()

      if (!posts.length) {
        return skippedResult('no_posts_from_apify', 'Nenhum post encontrado no Apify.')
      }

      const stats: SyncStats = {
        total: posts.length,
        created: 0,
        updated: 0,
        skipped: 0,
      }

      for (const post of posts) {
        try {
          const existing = await prisma.instagramPost.findUnique({
            where: { postId: post.id },
            select: { id: true },
          })

          const displayUrl = post.displayUrl || post.images?.[0] || ''

          const postData = {
            shortCode: post.shortCode,
            type: post.type || 'Image',
            url: post.url,
            displayUrl,
            videoUrl: post.videoUrl || null,
            caption: post.caption || null,
            hashtags: post.hashtags || [],
            mentions: post.mentions || [],
            likesCount: post.likesCount || 0,
            commentsCount: post.commentsCount || 0,
            videoViewCount: post.videoViewCount || null,
            dimensionsWidth: post.dimensionsWidth || null,
            dimensionsHeight: post.dimensionsHeight || null,
            timestamp: post.timestamp ? new Date(post.timestamp) : null,
            isActive: true,
          }

          if (existing) {
            await prisma.instagramPost.update({
              where: { postId: post.id },
              data: postData,
            })
            stats.updated++
          } else {
            await prisma.instagramPost.create({
              data: {
                postId: post.id,
                ...postData,
              },
            })
            stats.created++
          }
        } catch (error) {
          console.error(`Erro ao processar post ${post.id}:`, error)
          stats.skipped++
        }
      }

      return {
        success: true,
        skipped: false,
        message: 'Sincronização concluída.',
        stats,
      }
    })()
      .catch((error) => {
        console.error('Erro na sincronização automática do Instagram:', error)
        return {
          success: false,
          skipped: false,
          message: 'Erro inesperado ao sincronizar Instagram.',
          stats: emptyStats(),
        } satisfies InstagramSyncResult
      })
      .finally(() => {
        syncInFlight = null
      })
  }

  return syncInFlight
}
