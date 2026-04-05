import webpManifest from '@/generated/webp-manifest.json'

const manifest = webpManifest as Record<string, string>
const reverseManifest = Object.fromEntries(
  Object.entries(manifest).map(([originalPath, optimizedPath]) => [optimizedPath, originalPath])
) as Record<string, string>

export function getOptimizedAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src
  }

  return manifest[src] || src
}

export function getOriginalAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src
  }

  return reverseManifest[src] || src
}
