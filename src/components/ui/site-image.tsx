import Image, { type ImageProps } from 'next/image'
import { getOptimizedAssetPath, getOriginalAssetPath } from '@/lib/asset-variants'

type SiteImageProps = ImageProps & {
  assetMode?: 'optimized' | 'original'
  blurDataURL?: string
}

function isRemoteSrc(src: ImageProps['src']) {
  return typeof src === 'string' && /^(https?:)?\/\//.test(src)
}

function shouldUsePlaceholder(
  src: ImageProps['src'],
  placeholder: ImageProps['placeholder'],
  blurDataURL?: string
) {
  if (placeholder === 'blur') {
    return true
  }

  return Boolean(blurDataURL) && !isRemoteSrc(src)
}

export function SiteImage({ src, assetMode = 'optimized', blurDataURL, placeholder, ...props }: SiteImageProps) {
  const resolvedSrc =
    typeof src === 'string'
      ? assetMode === 'original'
        ? getOriginalAssetPath(src)
        : getOptimizedAssetPath(src)
      : src

  const finalPlaceholder = shouldUsePlaceholder(resolvedSrc, placeholder, blurDataURL) ? placeholder ?? 'blur' : placeholder

  return (
    <Image
      {...props}
      quality={props.quality ?? 85}
      src={resolvedSrc}
      placeholder={finalPlaceholder}
      blurDataURL={blurDataURL}
    />
  )
}