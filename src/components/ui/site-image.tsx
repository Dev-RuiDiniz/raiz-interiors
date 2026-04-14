import Image, { type ImageProps } from 'next/image'
import { getBlurDataUrl, getOptimizedAssetPath } from '@/lib/asset-variants'

type SiteImageProps = ImageProps & {
  preserveQuality?: boolean
}

export function SiteImage({ src, priority, loading, placeholder, blurDataURL, preserveQuality = false, ...props }: SiteImageProps) {
  const resolvedSrc =
    typeof src === 'string' && !preserveQuality
      ? getOptimizedAssetPath(src)
      : src
  const resolvedLoading = loading ?? (priority ? 'eager' : 'lazy')

  const resolvedBlurDataURL = blurDataURL ?? (typeof src === 'string' ? getBlurDataUrl(src) : undefined)
  const resolvedPlaceholder = placeholder ?? (resolvedBlurDataURL ? 'blur' : undefined)

  return (
    <Image
      {...props}
      src={resolvedSrc}
      priority={priority}
      loading={resolvedLoading}
      placeholder={resolvedPlaceholder}
      blurDataURL={resolvedBlurDataURL}
    />
  )
}
