import webpManifest from '@/generated/webp-manifest.json'

const manifest = webpManifest as Record<string, string>
const reverseManifest = Object.fromEntries(
  Object.entries(manifest).map(([originalPath, optimizedPath]) => [optimizedPath, originalPath])
) as Record<string, string>

function normalizeAssetPath(src: string) {
  return src.replace(/\/{2,}/g, '/')
}

export function getOptimizedAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src
  }

  const normalizedSrc = normalizeAssetPath(src)
  return manifest[normalizedSrc] || manifest[src] || src
}

export function getOriginalAssetPath(src: string) {
  if (!src.startsWith('/')) {
    return src
  }

  const normalizedSrc = normalizeAssetPath(src)
  return reverseManifest[normalizedSrc] || reverseManifest[src] || src
}

export function getAssetBlurDataURL(src: string) {
  if (!src.startsWith('/')) {
    return undefined
  }

  const assetPath = getOptimizedAssetPath(src)
  const extension = assetPath.split('.').pop()?.toLowerCase()

  if (extension === 'jpg' || extension === 'jpeg') {
    return 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUQEhIVFRUVFRUVFRUVFRUVFRUVFhUXFhUVFRcYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OFxAQGi0fHh0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAJ8BPQMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQADBgIBB//EADwQAAIBAgQDBgQEBQQDAQAAAAECAAMRBBIhMQVBUQYiYXGBkQYUMpGx0fAHFSNC4fAkM2KS8RUzYoLxFjNDU3Oy/8QAGgEBAAMBAQEAAAAAAAAAAAAAAAEDBAIFBv/EAC4RAAICAQMDAgQGAwEAAAAAAAAAAAECEQMhEjFBBVFhEyJxgZGh8CKhscHR4f/aAAwDAQACEQMRAD8A9xREQEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAEREBERAERH//2Q=='
  }

  if (extension === 'png') {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGD4DwABBAEAIf1m9AAAAABJRU5ErkJggg=='
  }

  if (extension === 'webp') {
    return 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4ICAAAAAvAAAAEAcQERH/2Q=='
  }

  if (extension === 'avif') {
    return 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAG1pZjFhdmlmAAAAAG1ldGEAAAAAaG1kYXQAAAAA'
  }

  return undefined
}

export function getAdjacentAssetPaths(src: string) {
  const optimized = getOptimizedAssetPath(src)
  const original = getOriginalAssetPath(src)

  return {
    optimized,
    original,
    blurDataURL: getAssetBlurDataURL(src),
  }
}