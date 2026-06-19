import { NextResponse } from 'next/server'
import { syncInstagramPosts } from '@/lib/instagram-sync'

export const dynamic = 'force-dynamic'

function isVercelCronRequest(request: Request) {
  const userAgent = request.headers.get('user-agent') || ''
  const cronSchedule = request.headers.get('x-vercel-cron-schedule')

  return userAgent.includes('vercel-cron/1.0') || Boolean(cronSchedule)
}

export async function GET(request: Request) {
  if (!isVercelCronRequest(request)) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    )
  }

  try {
    const syncResult = await syncInstagramPosts({ force: true, minIntervalMinutes: 0 })

    if (!syncResult.success) {
      const statusByReason: Record<string, number> = {
        token_missing: 503,
        database_unavailable: 503,
        no_posts_from_apify: 404,
      }

      return NextResponse.json(
        {
          error: syncResult.message,
          reason: syncResult.reason,
          stats: syncResult.stats,
        },
        { status: statusByReason[syncResult.reason || ''] || 500 }
      )
    }

    return NextResponse.json(syncResult)
  } catch (error) {
    console.error('Erro no cron de sincronização do Instagram:', error)
    return NextResponse.json(
      { error: 'Erro na sincronização' },
      { status: 500 }
    )
  }
}
