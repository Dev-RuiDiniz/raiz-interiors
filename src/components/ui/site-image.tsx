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

  const defaultQuality = assetMode === 'original' ? 92 : 80

  return <Image {...props} quality={props.quality ?? defaultQuality} src={resolvedSrc} />
}
