import webpManifest from '@/generated/webp-manifest.json'
import blurManifest from '@/generated/blur-manifest.json'

const manifest = webpManifest as Record<string, string>
const blurs = blurManifest as Record<string, string>

/** Strip query string before manifest lookup so ?foo=bar paths resolve correctly */
function stripQuery(src: string): string {
  const q = src.indexOf('?')
  return q !== -1 ? src.slice(0, q) : src
}

export function getOptimizedAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src
  }

  const clean = stripQuery(src)
  return manifest[clean] || clean
}

export function getBlurDataUrl(src: string): string | undefined {
  if (typeof src !== 'string') return undefined
  const clean = stripQuery(src)
  return blurs[clean] ?? blurs[manifest[clean] ?? ''] ?? undefined
}
