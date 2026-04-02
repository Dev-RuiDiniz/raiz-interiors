import { z } from 'zod'

export const objectFitValues = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const

export const imageBoxSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  w: z.number().min(1).max(100),
  h: z.number().min(1).max(100),
  z: z.number().int().min(0).max(100),
  objectFit: z.enum(objectFitValues).default('cover'),
  objectPosition: z.string().min(1).max(60).default('center'),
})

export const galleryLayoutItemSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  alt: z.string().default(''),
  order: z.number().int().min(0).default(0),
  visible: z.boolean().default(true),
  desktop: imageBoxSchema,
  mobile: imageBoxSchema,
})

export const galleryLayoutSchema = z.object({
  items: z.array(galleryLayoutItemSchema).default([]),
  canvasHeightDesktop: z.number().min(120).max(2400).default(560),
  canvasHeightMobile: z.number().min(120).max(2400).default(440),
})

export type ImageBox = z.infer<typeof imageBoxSchema>
export type GalleryLayoutItem = z.infer<typeof galleryLayoutItemSchema>
export type GalleryLayout = z.infer<typeof galleryLayoutSchema>

export function createDefaultBox(overrides?: Partial<ImageBox>): ImageBox {
  return {
    x: 0,
    y: 0,
    w: 100,
    h: 100,
    z: 1,
    objectFit: 'cover',
    objectPosition: 'center',
    ...overrides,
  }
}

export function normalizeGalleryLayout(input: unknown): GalleryLayout {
  const parsed = galleryLayoutSchema.safeParse(input)
  if (parsed.success) {
    const sorted = [...parsed.data.items].sort((a, b) => a.order - b.order)
    return {
      ...parsed.data,
      items: sorted.map((item, index) => ({ ...item, order: index })),
    }
  }

  return {
    items: [],
    canvasHeightDesktop: 560,
    canvasHeightMobile: 440,
  }
}
