import webpManifest from '@/generated/webp-manifest.json'

const manifest = webpManifest as Record<string, string>

export function getOptimizedAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src
  }

  return manifest[src] || src
}
