import Image, { type ImageProps } from 'next/image'
import { getOptimizedAssetPath, getOriginalAssetPath } from '@/lib/asset-variants'

type SiteImageProps = ImageProps & {
  assetMode?: 'optimized' | 'original'
}

export function SiteImage({ src, assetMode = 'optimized', ...props }: SiteImageProps) {
  const resolvedSrc =
    typeof src === 'string'
      ? assetMode === 'original'
        ? getOriginalAssetPath(src)
        : getOptimizedAssetPath(src)
      : src

  return <Image {...props} quality={props.quality ?? 85} src={resolvedSrc} />
}
