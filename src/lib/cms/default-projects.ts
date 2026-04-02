import type { ProjectCategory, ProjectStatus } from '@/lib/cms/default-types'

export interface DefaultProjectSummary {
  id: string
  slug: string
  title: string
  subtitle: string
  location: string
  category: ProjectCategory
  status: ProjectStatus
  coverImage: string
  order: number
}

export interface DefaultProjectDetail {
  slug: string
  title: string
  subtitle: string
  location: string
  category: ProjectCategory
  status: ProjectStatus
  year: string
  client: string
  description: string
  credits: string
  photography: string
  coverImage: string
  images: string[]
}

export const defaultProjects: DefaultProjectSummary[] = [
  {
    id: '1',
    slug: 'summer-house-comporta',
    title: 'SUMMER HOUSE COMPORTA',
    subtitle: '',
    location: 'COMPORTA RETREAT',
    category: 'RESIDENTIAL',
    status: 'PUBLISHED',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/summer_house_in_comporta.jpg',
    order: 1,
  },
  {
    id: '2',
    slug: 'contemporary-city-house',
    title: 'CONTEMPORARY CITY HOUSE',
    subtitle: '',
    location: 'ALMADA',
    category: 'RESIDENTIAL',
    status: 'PUBLISHED',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/contemporary_city_house.jpg',
    order: 2,
  },
  {
    id: '3',
    slug: 'elegant-timeless-duplex',
    title: 'ELEGANT & TIMELESS DUPLEX',
    subtitle: '',
    location: 'BRAGA',
    category: 'RESIDENTIAL',
    status: 'PUBLISHED',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/elegant_and_tmeless_duplex.jpg',
    order: 3,
  },
  {
    id: '4',
    slug: 'beach-house-troia',
    title: 'BEACH HOUSE',
    subtitle: 'in TROIA',
    location: 'PESTANA TROIA ECO RESORT',
    category: 'RESIDENTIAL',
    status: 'WORK_IN_PROGRESS',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/beach_house_in_troia.jpg',
    order: 4,
  },
  {
    id: '5',
    slug: 'pombaline-restoration-principe-real',
    title: 'PRÍNCIPE REAL POMBALINE RESTORATION',
    subtitle: '',
    location: 'LISBOA',
    category: 'RESIDENTIAL',
    status: 'WORK_IN_PROGRESS',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/principe_real_pombaline_restoration.jpg',
    order: 5,
  },
  {
    id: '6',
    slug: 'rural-retreat',
    title: 'RURAL RETREAT',
    subtitle: '',
    location: 'SERRA DA ESTRELA',
    category: 'HOSPITALITY',
    status: 'WORK_IN_PROGRESS',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/rural_retreat.jpeg',
    order: 6,
  },
  {
    id: '7',
    slug: 'store-restauration-atelier',
    title: 'CURATED OBJECTS & RESTAURATION ATELIER',
    subtitle: '',
    location: 'ALMADA',
    category: 'COMMERCIAL',
    status: 'PUBLISHED',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/store_and_restauration_atelier.jpg',
    order: 7,
  },
  {
    id: '8',
    slug: 'beach-house-troia-ii',
    title: 'BEACH HOUSE',
    subtitle: 'in Troia II',
    location: 'PESTANA TROIA ECO RESORT',
    category: 'RESIDENTIAL',
    status: 'COMING_SOON',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/beach_house_troia_ii.jpg',
    order: 8,
  },
  {
    id: '9',
    slug: 'weekend-family-house',
    title: 'WEEKEND FAMILY HOUSE',
    subtitle: '',
    location: 'AROEIRA',
    category: 'RESIDENTIAL',
    status: 'COMING_SOON',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/aroeira_weekend_house.jpg',
    order: 9,
  },
  {
    id: '10',
    slug: 'young-soul-city-apartment',
    title: 'YOUNG SOUL CITY APARTMENT',
    subtitle: '',
    location: 'MIREAR TERRACES',
    category: 'RESIDENTIAL',
    status: 'COMING_SOON',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/young_soul_city_apatment.jpeg',
    order: 10,
  },
]

export const defaultProjectDetails: Record<string, DefaultProjectDetail> = {
  'summer-house-comporta': {
    slug: 'summer-house-comporta',
    title: 'SUMMER HOUSE COMPORTA',
    subtitle: '',
    location: 'COMPORTA RETREAT',
    category: 'RESIDENTIAL',
    status: 'PUBLISHED',
    year: '2023',
    client: 'Private Client',
    description: `Inspired by the natural beauty of Comporta and the serene rice fields stretching towards the horizon, this summer house captures the essence of its unique landscape. The interior design unfolds through a harmonious palette of colours, textures, and organic materials, creating a calm and grounded atmosphere.
  
  A true sanctuary for relaxation, this holiday retreat is designed for meaningful family moments, slow living, and the creation of lasting memories.`,
    credits: 'INTERIOR DESIGN & DECORATION (co-autoria Carla Belo)',
    photography: 'RAIZ INTERIORS STUDIO',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/summer_house_in_comporta.jpg',
    images: [
      '/2026/projects/summer_house_comporta/04_beautiful_and_timeless_comporta_style_summer_house_dinning_room_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/03_beautiful_and_timeless_comporta_style_summer_house_dinning_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/06_beautiful_and_timeless_comporta_style_summer_house_fireplace_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/11_beautiful_and_timeless_comporta_style_summer_house_master_suite_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/00_minimal_entrance_hall_w_sculptural_wooden_bench_and_handcraft_lamp_interiordesign_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/21_minimal_console_bespoke_design_by_raiz.png',
      '/2026/projects/summer_house_comporta/14_beautiful_and_timeless_comporta_style_summer_house_master_suite_closet_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/15_beautiful_and_timeless_comporta_style_summer_house_master_suite_bathroom_interior_design_by_raiz.png',
      '/2026/projects/summer_house_comporta/01_beautiful_and_timeless_comporta_style_summer_house_powder_room_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/02_beautiful_and_timeless_comporta_style_summer_house_powder_room_detail_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/20_beautiful_and_timeless_comporta_style_summer_house_room_interior_design_by_raiz.jpg',
      '/2026/projects/summer_house_comporta/24_beautiful_and_timeless_comporta_style_summer_house_yoga_shala_interior_design_by_raiz.jpg',
    ],
  },
  'contemporary-city-house': {
    slug: 'contemporary-city-house',
    title: 'CONTEMPORARY CITY HOUSE',
    subtitle: '',
    location: 'ALMADA',
    category: 'RESIDENTIAL',
    status: 'PUBLISHED',
    year: '2022',
    client: 'Private Client',
    description: `Elegant and understated, this contemporary city home embodies the soul of modern minimalism. A carefully curated monochromatic palette and clean architectural lines bring harmony and balance to the space, where every element has purpose and every detail speaks to refined simplicity.

Designed for a life lived with intention, the interiors merge functionality and beauty seamlessly. Natural light plays a central role, enhancing the sense of openness and calm. Thoughtful material choices and bespoke furniture pieces add subtle warmth, creating an environment that feels both sophisticated and deeply welcoming.`,
    credits: 'TOTAL RENOVATION, INTERIOR ARCHITECTURE & DECORATION',
    photography: 'RAIZ INTERIORS STUDIO',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/contemporary_city_house.jpg',
    images: [
      '/2026/projects/contemporary_city_house/03_contemporary_minimalist_living_room_suspended_staircase_and_fireplace_interior_design_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/05_contemporary_minimalist_living_room_dining_room_interior_design_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/04_contemporary_minimalist_living_room_suspended_staircase_interior_design_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/01_contemporary_minimalist_living_room_interior_design_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/07_contemporary_minimalist_microcement_kitchen_interior_design_by_raiz.jpeg',
      '/2026/projects/contemporary_city_house/12_contemporary_minimalist_staircase_interior_architecture_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/11_contemporary_minimalist_suspended_staircase_interior_architecture_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/16_contemporary_minimalist_microcement_bathroom_interior_design_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/15_contemporary_minimalist_microcement_bathroom_with_walk_in_shower_interior_design_by_raiz.jpg',
      '/2026/projects/contemporary_city_house/19_contemporary_minimalist_microcement_terrace_detail_interior_design_by_raiz.png',
    ],
  },
  'elegant-timeless-duplex': {
    slug: 'elegant-timeless-duplex',
    title: 'ELEGANT & TIMELESS DUPLEX',
    subtitle: '',
    location: 'BRAGA',
    category: 'RESIDENTIAL',
    status: 'PUBLISHED',
    year: '2023',
    client: 'Private Client',
    description: `Elegant and warm, this timeless duplex apartment was conceived to evoke the comfort and refinement of a boutique hotel, seamlessly adapted to the rhythm of multifunctional family living.
  
  Thoughtfully designed to balance sophistication with everyday ease, the spaces flow naturally between social and private moments. Rich materials, soft textures, and carefully layered lighting create an atmosphere that feels both luxurious and genuinely welcoming - a home where every detail has been considered, and every room invites you to stay and create memories.`,
    credits: 'TOTAL RENOVATION, INTERIOR ARCHITECTURE (co-autoria Carla Belo)',
    photography: 'JOAO RODRIGO CORREIA',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/elegant_and_tmeless_duplex.jpg',
    images: [
      '/2026/projects/elegant_and_timeless_duplex/05_elegant_timeless_luxury_master_suite_interior_design_by_raiz.jpg',
      '/2026/projects/elegant_and_timeless_duplex/04_elegant_timeless_luxury_master_suite_design_by_raiz.jpg',
      '/2026/projects/elegant_and_timeless_duplex/03_elegant_timeless_luxury_master_suite_bespoke_headboard_by_raiz.png',
      '/2026/projects/elegant_and_timeless_duplex/08_elegant_and_luxury_bathroom_interior_design_by_raiz.jpg',
      '/2026/projects/elegant_and_timeless_duplex/09_elegant_and_timeless_marble_bathroom_design_by_raiz.jpg',
      '/2026/projects/elegant_and_timeless_duplex/14_clean_and_minimal_attic_design_by_raiz.jpg',
      '/2026/projects/elegant_and_timeless_duplex/10_modern_and_contemporary_bespoke_headboard_design_by_raiz.jpg',
      '/2026/projects/elegant_and_timeless_duplex/13_minimal_and_contemporary_bathroom_design_by_raiz.png',
      '/2026/projects/elegant_and_timeless_duplex/02_modern_contemporary_staircase_design_with_led_lighting_detail_projected_by_raiz.jpg',
    ],
  },
  'beach-house-troia': {
    slug: 'beach-house-troia',
    title: 'BEACH HOUSE',
    subtitle: 'in TROIA',
    location: 'Pestana Troia Eco Resort',
    category: 'RESIDENTIAL',
    status: 'WORK_IN_PROGRESS',
    year: '2024',
    client: 'Private Client',
    description: `Nestled within the sweeping dunes of Troia, this beach house reflects the pure essence of coastal living. Inspired by the soft sandy tones of its surroundings, the design embraces a minimalist and monochromatic aesthetic where simplicity and serenity take centre stage.

Created as a seasonal family retreat, the spaces combine comfort and functionality, flowing seamlessly to encourage relaxed living, quiet moments, and joyful gatherings. A refined yet effortless celebration of seaside living in Portugal.`,
    credits: 'INTERIOR DESIGN & DECORATION (co-autoria Carla Belo)',
    photography: '3D IMAGES: SARA PETIZ VIANA',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/beach_house_in_troia.jpg',
    images: [
      '/2026/projects/beach_house_troia/03_contemporary_beach_house_living_room_with_fireplace_interior_design_by_raiz.jpg',
      '/2026/projects/beach_house_troia/02_contemporary_beach_house_living_room_interior_design_by_raiz.jpg',
      '/2026/projects/beach_house_troia/04_contemporary_beach_house_living_room_with_curved_sofa_interior_design_by_raiz.jpg',
      '/2026/projects/beach_house_troia/06_contemporary_beach_house_dinning_room_interior_design_by_raiz.jpg',
      '/2026/projects/beach_house_troia/05_contemporary_beach_house_open_kitchen_and_dinning_room_interior_design_by_raiz.jpg',
      '/2026/projects/beach_house_troia/08_contemporary_beach_house_master_suite_interior_design_by_raiz.jpg',
      '/2026/projects/beach_house_troia/09_contemporary_beach_house_microcement_bathroom_interior_design_by_raiz.jpg',
      '/2026/projects/beach_house_troia/07_contemporary_beach_house_office_interior_design_by_raiz.jpg',
    ],
  },
  'pombaline-restoration-principe-real': {
    slug: 'pombaline-restoration-principe-real',
    title: 'PRÍNCIPE REAL POMBALINE RESTORATION',
    subtitle: '',
    location: 'LISBOA',
    category: 'RESIDENTIAL',
    status: 'WORK_IN_PROGRESS',
    year: '2024',
    client: 'Private Client',
    description: `Located in the heart of Príncipe Real, this Pombaline building underwent a full rehabilitation to adapt each apartment to contemporary living while preserving its original character.
  
  Despite its advanced deterioration, key historical features—such as traditional tile panels, the original staircase, and traces of frescoes—were carefully restored to retain the soul of the building in the communal areas.
  
  Inside the apartments, where the alterations were most visible, a contemporary, neutral, and timeless design language was introduced, elegant yet understated, ensuring comfort and coherence while respecting the architectural identity of the Pombaline structure.`,
    credits: 'INTERIOR ARCHITECTURE AND RESTORATION',
    photography: '3D IMAGES: DMYTRO',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/principe_real_pombaline_restoration.jpg',
    images: [
      '/2026/projects/principe_real_pombaline_restoration/principe_02.jpg',
      '/2026/projects/principe_real_pombaline_restoration/principe_04.jpg',
      '/2026/projects/principe_real_pombaline_restoration/principe_05.jpg',
      '/2026/projects/principe_real_pombaline_restoration/principe_06.jpg',
      '/2026/projects/principe_real_pombaline_restoration/principe_07.jpg',
      '/2026/projects/principe_real_pombaline_restoration/principe_09.png',
      '/2026/projects/principe_real_pombaline_restoration/principe_10.jpg',
      '/2026/projects/principe_real_pombaline_restoration/principe_13.jpg',
    ],
  },
  'rural-retreat': {
    slug: 'rural-retreat',
    title: 'RURAL RETREAT',
    subtitle: '',
    location: 'SERRA DA ESTRELA',
    category: 'HOSPITALITY',
    status: 'WORK_IN_PROGRESS',
    year: '2024',
    client: 'Private Client',
    description: `Set in the peaceful interior of Portugal, this rural retreat offers a soothing escape from the rush of everyday life.
  
  Designed for those seeking tranquillity and authentic connection, it carries the charm of a traditional village home filled with history, textures, and quiet corners.
  
  Rooted in natural materials and vernacular architecture, the project preserves heritage while subtly reinterpreting it. Each space enhances comfort and sensory warmth, transforming the house into a sanctuary for rest, reflection, and deep rejuvenation.`,
    credits: 'ARCHITECTURE, INTERIOR ARCHITECTURE & DECORATION',
    photography: '',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/rural_retreat.jpeg',
    images: [
      '/2026/projects/rural_retreat/01_stone_ruin_restoration_project_for_a_guest_house_rural_mountain_retreat_by_raiz.jpg',
      '/2026/projects/rural_retreat/02_stone_ruin_restoration_project_for_a_rural_mountain_retreat_by_raiz.jpg',
      '/2026/projects/rural_retreat/03_textured_old_wood_rural_retreat_in_the_mountain_project_by_raiz.jpg',
    ],
  },
  'store-restauration-atelier': {
    slug: 'store-restauration-atelier',
    title: 'CURATED OBJECTS & RESTAURATION ATELIER',
    subtitle: '',
    location: 'ALMADA',
    category: 'COMMERCIAL',
    status: 'PUBLISHED',
    year: '2023',
    client: '',
    description: `In a contemporary reinterpretation of traditional historic-centre shops, this store-gallery emerges as a space where architecture, curation, and restoration coexist seamlessly.
  
  The project celebrates each object and its renewed meaning through an integrated restoration atelier, emphasizing authenticity, craftsmanship, and design.
  
  A minimalist aesthetic, thoughtfully designed lighting, and a neutral material palette create a calm atmosphere that highlights every piece, giving it a near-museographic presence and an immersive sense of discovery.`,
    credits: 'INTERIOR ARCHITECTURE',
    photography: 'RAIZ INTERIORS STUDIO',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/store_and_restauration_atelier.jpg',
    images: [
      '/2026/projects/store_and_restauration_atelier/store_01.jpg',
      '/2026/projects/store_and_restauration_atelier/store_02.jpg',
      '/2026/projects/store_and_restauration_atelier/store_03.jpg',
      '/2026/projects/store_and_restauration_atelier/store_04.jpg',
      '/2026/projects/store_and_restauration_atelier/store_05.jpg',
      '/2026/projects/store_and_restauration_atelier/store_06.jpg',
      '/2026/projects/store_and_restauration_atelier/store_07.jpg',
    ],
  },
  'beach-house-troia-ii': {
    slug: 'beach-house-troia-ii',
    title: 'BEACH HOUSE',
    subtitle: 'in Troia II',
    location: 'PESTANA TROIA ECO RESORT',
    category: 'RESIDENTIAL',
    status: 'COMING_SOON',
    year: '',
    client: 'Private Client',
    description: 'Coming soon.',
    credits: '',
    photography: '',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/beach_house_troia_ii.jpg',
    images: [],
  },
  'weekend-family-house': {
    slug: 'weekend-family-house',
    title: 'WEEKEND FAMILY HOUSE',
    subtitle: '',
    location: 'AROEIRA',
    category: 'RESIDENTIAL',
    status: 'COMING_SOON',
    year: '',
    client: 'Private Client',
    description: 'Coming soon.',
    credits: '',
    photography: '',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/aroeira_weekend_house.jpg',
    images: [],
  },
  'young-soul-city-apartment': {
    slug: 'young-soul-city-apartment',
    title: 'YOUNG SOUL CITY APARTMENT',
    subtitle: '',
    location: 'MIREAR TERRACES',
    category: 'RESIDENTIAL',
    status: 'COMING_SOON',
    year: '',
    client: 'Private Client',
    description: 'Coming soon.',
    credits: '',
    photography: '',
    coverImage: '/2026/projects/fotos_capa_menu_projectos/young_soul_city_apatment.jpeg',
    images: [],
  },
}
