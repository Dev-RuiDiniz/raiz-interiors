import webpManifest from '@/generated/webp-manifest.json'
import blurManifest from '@/generated/blur-manifest.json'

const manifest = webpManifest as Record<string, string>
const blurs = blurManifest as Record<string, string>

export function getOptimizedAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src
  }

  return manifest[src] || src
}

export function getBlurDataUrl(src: string): string | undefined {
  if (typeof src !== 'string') return undefined
  return blurs[src] ?? blurs[manifest[src] ?? ''] ?? undefined
}
