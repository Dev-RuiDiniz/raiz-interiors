import Image, { type ImageProps } from 'next/image'
import { getOptimizedAssetPath } from '@/lib/asset-variants'

type SiteImageProps = ImageProps

export function SiteImage({ src, priority, loading, ...props }: SiteImageProps) {
  const resolvedSrc = typeof src === 'string' ? getOptimizedAssetPath(src) : src
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy')

  return <Image {...props} src={resolvedSrc} priority={priority} loading={resolvedLoading} />
}
