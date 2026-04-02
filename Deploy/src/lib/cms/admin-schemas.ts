import { z } from 'zod'
import { imageBoxSchema } from '@/lib/cms/layout-types'

export const projectStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'COMING_SOON', 'WORK_IN_PROGRESS'])
export const projectCategorySchema = z.enum(['RESIDENTIAL', 'COMMERCIAL', 'HOSPITALITY', 'RETAIL'])
export const serviceStatusSchema = z.enum(['DRAFT', 'PUBLISHED', 'COMING_SOON', 'WORK_IN_PROGRESS'])

export const imagePayloadSchema = z.object({
  id: z.string().optional(),
  url: z.string().min(1),
  alt: z.string().optional().nullable(),
  width: z.number().int().optional().nullable(),
  height: z.number().int().optional().nullable(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  desktopLayout: imageBoxSchema.optional().nullable(),
  mobileLayout: imageBoxSchema.optional().nullable(),
})

export const projectPayloadSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  location: z.string().min(1),
  category: projectCategorySchema,
  status: projectStatusSchema.default('PUBLISHED'),
  description: z.string().optional().nullable(),
  coverImage: z.string().min(1),
  year: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  area: z.string().optional().nullable(),
  credits: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
  images: z.array(imagePayloadSchema).optional().default([]),
})

export const servicePayloadSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  coverImage: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  features: z.array(z.string()).default([]),
  order: z.number().int().default(0),
  status: serviceStatusSchema.default('PUBLISHED'),
  active: z.boolean().default(true),
  images: z.array(imagePayloadSchema).optional().default([]),
})
