import { createDefaultBox, type GalleryLayout } from '@/lib/cms/layout-types'

export interface HeroSlideContent {
  id: string
  image: string
  line1: string
  line2: string
  link: string
}

export const defaultHeroSlides: HeroSlideContent[] = [
  {
    id: '1',
    image: '/2026/home/galeria_inicial/beautiful_and_timeless_comporta_summer_house_interior_design_by_raiz.jpg',
    line1: "<em>It's not about</em> INTERIOR DESIGN <em>itself</em>",
    line2: "<em>It's about YOU, your STORY , your CONNECTIONS</em>",
    link: '/projects',
  },
  {
    id: '2',
    image: '/2026/home/galeria_inicial/contemporary_minimalist_living_room_suspended_staircase_and_fireplace_interior_design_by_raiz.jpg',
    line1: '<em>CRAFTING SPACES</em>',
    line2: '<em>with</em> PURPOSE',
    link: '/projects',
  },
  {
    id: '3',
    image: '/2026/home/galeria_inicial/contemporary_beach_house_living_room_with_fireplace_interior_design_by_raiz.jpg',
    line1: '<em>Where DESIGN</em>',
    line2: '<em>meets</em> your <em>SOUL</em>',
    link: '/projects',
  },
  {
    id: '4',
    image: '/2026/home/galeria_inicial/elegant_timeless_luxury_master_suite_interior_design_by_raiz.jpg',
    line1: 'BESPOKE <strong><em>SPACES</em></strong>',
    line2: '<em>that tell your story</em>',
    link: '/projects',
  },
  {
    id: '5',
    image: '/2026/home/galeria_inicial/img_0820_snapseedcopy.jpg',
    line1: 'HOME <em>is where ordinary moments</em>',
    line2: '<em>become</em> MEANINGFUL',
    link: '/projects',
  },
  {
    id: '6',
    image: '/2026/home/galeria_inicial/suite_4k.jpg',
    line1: 'HOME <em>that EMBRACES, MOVES you</em>',
    line2: '<em>And makes you STAY</em>',
    link: '/about',
  },
]

function createSingleImageLayout(src: string, alt: string, desktopHeight = 560, mobileHeight = 420): GalleryLayout {
  return {
    items: [
      {
        id: '1',
        src,
        alt,
        order: 0,
        visible: true,
        desktop: createDefaultBox(),
        mobile: createDefaultBox(),
      },
    ],
    canvasHeightDesktop: desktopHeight,
    canvasHeightMobile: mobileHeight,
  }
}

function createGridLayout(images: Array<{ id: string; src: string; alt: string }>): GalleryLayout {
  return {
    items: images.map((image, index) => {
      const col = index % 3
      const row = Math.floor(index / 3)
      return {
        id: image.id,
        src: image.src,
        alt: image.alt,
        order: index,
        visible: true,
        desktop: createDefaultBox({
          x: col * 33.34,
          y: row * 33.34,
          w: 33.34,
          h: 33.34,
        }),
        mobile: createDefaultBox({
          x: (index % 2) * 50,
          y: Math.floor(index / 2) * 28,
          w: 50,
          h: 28,
        }),
      }
    }),
    canvasHeightDesktop: 660,
    canvasHeightMobile: 980,
  }
}

export const defaultPageSectionLayouts: Record<string, Record<string, GalleryLayout>> = {
  home: {
    hero_slides: createGridLayout(
      defaultHeroSlides.map((slide) => ({
        id: slide.id,
        src: slide.image,
        alt: `${slide.line1} ${slide.line2}`,
      }))
    ),
    about_preview_image: createSingleImageLayout('/2026/home/beautiful_homes.png', 'Live Beautiful'),
  },
  about: {
    hero_image: createSingleImageLayout('/2026/about_us/live_beautiful_interior_design_by_raiz.jpg', 'About hero image'),
    founder_image: createSingleImageLayout('/2026/about_us/img_3574.jpg', 'Founder image'),
  },
  services: {
    service_cards: createGridLayout([
      { id: '1', src: '/2026/services/architeture.jpg', alt: 'Architecture' },
      { id: '2', src: '/2026/services/interior_design.jpg', alt: 'Interior Design' },
      { id: '3', src: '/2026/services/decoration.jpg', alt: 'Decoration' },
      { id: '4', src: '/2026/services/bespoke_furniture.jpg', alt: 'Bespoke Furniture' },
      { id: '5', src: '/2026/services/consultancy.jpg', alt: 'Consultancy' },
      { id: '6', src: '/2026/services/styling_and_staging.png', alt: 'Styling & Staging' },
    ]),
  },
  projects: {
    project_cards: createGridLayout([
      { id: '1', src: '/2026/projects/fotos_capa_menu_projectos/summer_house_in_comporta.jpg', alt: 'Summer House' },
      { id: '2', src: '/2026/projects/fotos_capa_menu_projectos/contemporary_city_house.jpg', alt: 'Contemporary City House' },
      { id: '3', src: '/2026/projects/fotos_capa_menu_projectos/elegant_and_tmeless_duplex.jpg', alt: 'Elegant & Timeless Duplex' },
      { id: '4', src: '/2026/projects/fotos_capa_menu_projectos/beach_house_in_troia.jpg', alt: 'Beach House in Troia' },
      {
        id: '5',
        src: '/2026/projects/fotos_capa_menu_projectos/principe_real_pombaline_restoration.jpg',
        alt: 'Pombaline Restoration',
      },
      { id: '6', src: '/2026/projects/fotos_capa_menu_projectos/rural_retreat.jpeg', alt: 'Rural Retreat' },
    ]),
  },
  contact: {
    hero_visual: createSingleImageLayout('/2026/home/galeria_inicial/suite_4k.jpg', 'Contact visual'),
  },
  privacy: {
    policy_visual: createSingleImageLayout('/2026/home/galeria_inicial/img_0820_snapseedcopy.jpg', 'Privacy visual'),
  },
}

export function getDefaultLayout(pageKey: string, sectionKey: string): GalleryLayout {
  return (
    defaultPageSectionLayouts[pageKey]?.[sectionKey] || {
      items: [],
      canvasHeightDesktop: 560,
      canvasHeightMobile: 440,
    }
  )
}
