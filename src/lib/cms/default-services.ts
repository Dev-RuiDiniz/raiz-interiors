import type { ServiceStatus } from '@/lib/cms/default-types'

export interface DefaultServiceSummary {
  id: string
  slug: string
  title: string
  excerpt: string
  image: string
  status: ServiceStatus
  order: number
}

export interface DefaultServiceDetail {
  slug: string
  title: string
  subtitle: string
  description: string
  features: string[]
  images: string[]
  status: ServiceStatus
}

export const defaultServices: DefaultServiceSummary[] = [
  {
    id: '1',
    slug: 'architecture',
    title: 'Architecture',
    excerpt: 'Architectural solutions that create experiences.',
    image: '/2026/services/architeture.jpg',
    status: 'PUBLISHED',
    order: 1,
  },
  {
    id: '2',
    slug: 'interior-design',
    title: 'Interior Design',
    excerpt: 'Interior environments that reflect your lifestyle and soul.',
    image: '/2026/services/interior_design.jpg',
    status: 'PUBLISHED',
    order: 2,
  },
  {
    id: '3',
    slug: 'decoration',
    title: 'Decoration',
    excerpt: 'Curating furniture, art and accessories to bring personality to the space.',
    image: '/2026/services/decoration.jpg',
    status: 'PUBLISHED',
    order: 3,
  },
  {
    id: '4',
    slug: 'bespoke-furniture',
    title: 'Bespoke Furniture',
    excerpt: 'Custom furniture designed to fit your unique space and style.',
    image: '/2026/services/bespoke_furniture.jpg',
    status: 'PUBLISHED',
    order: 4,
  },
  {
    id: '5',
    slug: 'consultancy',
    title: 'Consultancy',
    excerpt: 'Personalized expert guidance on Design solutions.',
    image: '/2026/services/consultancy.jpg',
    status: 'PUBLISHED',
    order: 5,
  },
  {
    id: '6',
    slug: 'styling-staging',
    title: 'Styling & Staging',
    excerpt: 'Transforming spaces strategically to maximize appeal.',
    image: '/2026/services/styling_and_staging.png',
    status: 'PUBLISHED',
    order: 6,
  },
]

export const defaultServiceDetails: Record<string, DefaultServiceDetail> = {
  architecture: {
    slug: 'architecture',
    title: 'Architecture',
    subtitle: 'Architectural solutions that create experiences',
    description: `From concept to completion, we design architectural solutions that balance form and function. Our architectural services encompass the complete journey from initial concept to final construction.

Every project begins with listening - to your aspirations, your lifestyle, and your vision for the space. From there, we develop solutions that are both functionally excellent and aesthetically inspiring.`,
    features: [
      'New construction design',
      'Renovations and extensions',
      'Spatial planning and optimization',
      'Building permit documentation',
      'Construction supervision',
      'Sustainable design solutions',
    ],
    images: ['/2026/services/architecture/img_3189.jpg', '/2026/services/architecture/img_e9009.jpg'],
    status: 'PUBLISHED',
  },
  'interior-design': {
    slug: 'interior-design',
    title: 'Interior Design',
    subtitle: 'Interior environments that reflect your lifestyle and soul',
    description: `Creating cohesive interior environments that reflect your lifestyle and aspirations. Interior design is where vision meets reality.

Our approach combines careful space planning with a keen eye for materials, colors, and textures. The result is spaces that feel both curated and lived-in, sophisticated yet welcoming.`,
    features: [
      'Space planning and layout design',
      'Material and finish selection',
      'Custom furniture design',
      'Lighting design',
      'Color consultation',
      'Art and accessory curation',
    ],
    images: ['/2026/services/interior_design/img_2563.jpg', '/2026/services/interior_design/img_6437_1.jpg'],
    status: 'PUBLISHED',
  },
  decoration: {
    slug: 'decoration',
    title: 'Decoration',
    subtitle: 'Interior environments that reflect your lifestyle and soul',
    description: `Curating furniture, art, and accessories to bring your space to life with personality. Decoration is the layer that brings warmth and uniqueness to any space.

Whether refreshing a single room or styling an entire home, we bring an expert eye and access to exclusive sources to elevate your interiors.`,
    features: [
      'Furniture selection and sourcing',
      'Art advisory and acquisition',
      'Textile and soft furnishing selection',
      'Decorative object curation',
      'Antique and vintage sourcing',
      'Final styling and installation',
    ],
    images: ['/2026/services/decoration/img_4898.jpg', '/2026/services/decoration/img_4900.jpg'],
    status: 'PUBLISHED',
  },
  'bespoke-furniture': {
    slug: 'bespoke-furniture',
    title: 'Bespoke Furniture',
    subtitle: 'Custom furniture Designed to fit your unique space and style.',
    description: `Custom furniture designed and crafted to perfectly fit your unique space and personal style. Each piece is conceived with purpose, balancing aesthetics and function.

From concept to production, we oversee every detail to ensure the result is a truly one-of-a-kind piece that elevates your interior.`,
    features: [
      'Custom furniture design',
      'Material and finish selection',
      'Production management',
      'Built-in solutions',
      'Upholstery and textile selection',
      'Installation and styling',
    ],
    images: ['/2026/services/bespoke_furniture/img_3439.jpg', '/2026/services/bespoke_furniture/img_4996.jpg'],
    status: 'PUBLISHED',
  },
  consultancy: {
    slug: 'consultancy',
    title: 'Consultancy',
    subtitle: 'Personalized expert guidance on Design solutions',
    description: `Expert guidance on design decisions, materials, and spatial planning for your project. Not every project requires full-service design.

Whether you need help with a challenging layout, material decisions, or a second opinion on your design direction, we're here to guide you with clarity and expertise.`,
    features: [
      'Design direction and concept development',
      'Material and color consultation',
      'Spatial problem-solving',
      'Vendor and contractor recommendations',
      'Budget planning and optimization',
      'Project timeline guidance',
    ],
    images: [
      '/2026/services/consultancy/chatgpt_image_4_02_2026_11_29_17.png',
      '/2026/services/consultancy/chatgpt_image_4_02_2026_12_53_50.png',
    ],
    status: 'PUBLISHED',
  },
  'styling-staging': {
    slug: 'styling-staging',
    title: 'Styling & Staging',
    subtitle: 'Transforming spaces strategically to maximize appeal',
    description: `Transforming properties for sale or rent with strategic styling that maximizes appeal. First impressions matter.

We understand what buyers are looking for and create environments that allow them to envision themselves in the space. Strategic styling that makes all the difference.`,
    features: [
      'Property assessment and strategy',
      'Furniture rental and placement',
      'Accessory styling',
      'Photography preparation',
      'Open house styling',
      'Vacant and occupied staging',
    ],
    images: ['/2026/services/styling/31d57e06_0c61_42d2_9caa_b6dd526b0e06.png', '/2026/services/styling/raiz_202404_tp1_027.jpg'],
    status: 'PUBLISHED',
  },
}
