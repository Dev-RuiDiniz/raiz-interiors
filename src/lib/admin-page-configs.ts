import { Briefcase, Globe, Home, Lock, Mail, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getDefaultLayout } from '@/lib/cms/default-layouts'

export type EditorFieldType = 'text' | 'textarea' | 'url' | 'image' | 'color' | 'gallery_layout'

export interface EditorField {
  id: string
  label: string
  type: EditorFieldType
  placeholder?: string
  defaultValue?: string
  pageKey?: string
  sectionKey?: string
}

export interface EditorSection {
  id: string
  title: string
  helperText: string
  fields: EditorField[]
}

export interface AdminPageEditorConfig {
  pageId: 'home' | 'projects' | 'services' | 'about' | 'privacy' | 'contact'
  title: string
  publicPath: string
  description: string
  icon: LucideIcon
  sections: EditorSection[]
}

export const adminPageEditorConfigs: Record<AdminPageEditorConfig['pageId'], AdminPageEditorConfig> = {
  home: {
    pageId: 'home',
    title: 'Home',
    publicPath: '/',
    description: 'Edite os textos da Home em PT/EN, os slides da chamada inicial e os blocos institucionais com seed do conteúdo atual do site.',
    icon: Home,
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        helperText: 'Textos da chamada inicial por idioma. Cada slide pode ser editado em português e inglês.',
        fields: [
          { id: 'hero_slide1_line1_pt', label: 'Slide 1 · Linha 1 (PT)', type: 'text', defaultValue: '<em>Não é sobre</em> DESIGN de INTERIORES' },
          { id: 'hero_slide1_line2_pt', label: 'Slide 1 · Linha 2 (PT)', type: 'text', defaultValue: '<em>É sobre SI, a sua HISTORIA e as suas LIGAÇÕES</em>' },
          { id: 'hero_slide1_line1_en', label: 'Slide 1 · Linha 1 (EN)', type: 'text', defaultValue: "<em>It's not about</em> INTERIOR DESIGN <em>itself</em>" },
          { id: 'hero_slide1_line2_en', label: 'Slide 1 · Linha 2 (EN)', type: 'text', defaultValue: "<em>It's about YOU, your STORY , your CONNECTIONS</em>" },
          { id: 'hero_slide2_line1_pt', label: 'Slide 2 · Linha 1 (PT)', type: 'text', defaultValue: 'CRIAMOS <em>ESPAÇOS</em>' },
          { id: 'hero_slide2_line2_pt', label: 'Slide 2 · Linha 2 (PT)', type: 'text', defaultValue: 'Com <em>PROPÓSITO</em>' },
          { id: 'hero_slide2_line1_en', label: 'Slide 2 · Linha 1 (EN)', type: 'text', defaultValue: '<em>CRAFTING SPACES</em>' },
          { id: 'hero_slide2_line2_en', label: 'Slide 2 · Linha 2 (EN)', type: 'text', defaultValue: '<em>with</em> PURPOSE' },
          { id: 'hero_slide3_line1_pt', label: 'Slide 3 · Linha 1 (PT)', type: 'text', defaultValue: '<em>Onde o DESIGN</em>' },
          { id: 'hero_slide3_line2_pt', label: 'Slide 3 · Linha 2 (PT)', type: 'text', defaultValue: '<em>encontra a sua</em> ALMA' },
          { id: 'hero_slide3_line1_en', label: 'Slide 3 · Linha 1 (EN)', type: 'text', defaultValue: '<em>Where DESIGN</em>' },
          { id: 'hero_slide3_line2_en', label: 'Slide 3 · Linha 2 (EN)', type: 'text', defaultValue: '<em>meets</em> your <em>SOUL</em>' },
          { id: 'hero_slide4_line1_pt', label: 'Slide 4 · Linha 1 (PT)', type: 'text', defaultValue: 'ESPAÇOS <em>TAILOR-MADE</em>' },
          { id: 'hero_slide4_line2_pt', label: 'Slide 4 · Linha 2 (PT)', type: 'text', defaultValue: '<em>que contam a sua historia</em>' },
          { id: 'hero_slide4_line1_en', label: 'Slide 4 · Linha 1 (EN)', type: 'text', defaultValue: 'BESPOKE <strong><em>SPACES</em></strong>' },
          { id: 'hero_slide4_line2_en', label: 'Slide 4 · Linha 2 (EN)', type: 'text', defaultValue: '<em>that tell your story</em>' },
          { id: 'hero_slide5_line1_pt', label: 'Slide 5 · Linha 1 (PT)', type: 'text', defaultValue: 'CASA <em>é onde os momentos mais simples</em>' },
          { id: 'hero_slide5_line2_pt', label: 'Slide 5 · Linha 2 (PT)', type: 'text', defaultValue: '<em>ganham</em> SIGNIFICADO' },
          { id: 'hero_slide5_line1_en', label: 'Slide 5 · Linha 1 (EN)', type: 'text', defaultValue: 'HOME <em>is where ordinary moments</em>' },
          { id: 'hero_slide5_line2_en', label: 'Slide 5 · Linha 2 (EN)', type: 'text', defaultValue: '<em>become</em> MEANINGFUL' },
          { id: 'hero_slide6_line1_pt', label: 'Slide 6 · Linha 1 (PT)', type: 'text', defaultValue: 'CASA <em>que ACOLHE, ENVOLVE</em>' },
          { id: 'hero_slide6_line2_pt', label: 'Slide 6 · Linha 2 (PT)', type: 'text', defaultValue: '<em>e faz</em> FICAR' },
          { id: 'hero_slide6_line1_en', label: 'Slide 6 · Linha 1 (EN)', type: 'text', defaultValue: 'HOME <em>that EMBRACES, MOVES you</em>' },
          { id: 'hero_slide6_line2_en', label: 'Slide 6 · Linha 2 (EN)', type: 'text', defaultValue: '<em>And makes you STAY</em>' },
        ],
      },
      {
        id: 'intro',
        title: 'Introdução',
        helperText: 'Texto introdutório da Home, com valores iniciais iguais aos textos atuais do site em PT e EN.',
        fields: [
          {
            id: 'intro_text_pt',
            label: 'Texto introdutório (PT)',
            type: 'textarea',
            defaultValue: 'Os nossos INTERIORES são DESENHADOS para estimular os SENTIDOS despertar EMOÇÕES e CRIAR novas EXPERIÊNCIAS e RITUAIS — inspirando NOVAS FORMAS de VIVER.',
          },
          {
            id: 'intro_text_en',
            label: 'Texto introdutório (EN)',
            type: 'textarea',
            defaultValue: 'Our INTERIORS are DESIGNED to stimulate the SENSES awaken EMOTIONS and CREATE new EXPERIENCES and RITUALS — inspiring NEW WAYS of LIVING.',
          },
        ],
      },
      {
        id: 'featured_projects',
        title: 'Featured Projects',
        helperText: 'Textos da secção de projetos em destaque por idioma.',
        fields: [
          { id: 'featured_title_pt', label: 'Título da secção (PT)', type: 'text', defaultValue: 'Projectos Selecionados' },
          { id: 'featured_cta_label_pt', label: 'CTA da secção (PT)', type: 'text', defaultValue: 'Ver todos os projectos' },
          { id: 'featured_title_en', label: 'Título da secção (EN)', type: 'text', defaultValue: 'Selected Projects' },
          { id: 'featured_cta_label_en', label: 'CTA da secção (EN)', type: 'text', defaultValue: 'View All Projects' },
          { id: 'featured_cta_url', label: 'Link do CTA', type: 'url', defaultValue: '/projects' },
        ],
      },
      {
        id: 'services_preview',
        title: 'Services Preview',
        helperText: 'Resumo dos serviços na Home em português e inglês.',
        fields: [
          { id: 'services_preview_title_pt', label: 'Título da secção (PT)', type: 'text', defaultValue: 'Os Nossos Serviços' },
          {
            id: 'services_preview_text_pt',
            label: 'Texto de apoio (PT)',
            type: 'textarea',
            defaultValue: 'Somos um ESTÚDIO de DESIGN dedicado a entregar um SERVIÇO de DESIGN PERSONALIZADO do início ao fim, criado com QUALIDADE, PRECISÃO e PROFISSIONALISMO.',
          },
          { id: 'services_preview_cta_label_pt', label: 'CTA da secção (PT)', type: 'text', defaultValue: 'Explorar Serviços' },
          { id: 'services_preview_title_en', label: 'Título da secção (EN)', type: 'text', defaultValue: 'Our Services' },
          {
            id: 'services_preview_text_en',
            label: 'Texto de apoio (EN)',
            type: 'textarea',
            defaultValue: 'We are a DESIGN STUDIO dedicated to delivering a BESPOKE start-to-finish DESIGN SERVICE, crafted with QUALITY, PRECISION and PROFESSIONALISM.',
          },
          { id: 'services_preview_cta_label_en', label: 'CTA da secção (EN)', type: 'text', defaultValue: 'Explore Services' },
          { id: 'services_preview_cta_url', label: 'Link do CTA', type: 'url', defaultValue: '/services' },
        ],
      },
      {
        id: 'about_preview',
        title: 'About Preview',
        helperText: 'Resumo do bloco About na Home, em ambos os idiomas.',
        fields: [
          {
            id: 'about_preview_text_pt',
            label: 'Texto de apoio (PT)',
            type: 'textarea',
            defaultValue: 'Não criamos apenas <span class="uppercase">casas bonitas</span>, desenhamos espaços <span class="uppercase">significativos</span> que contam a <span class="uppercase">sua história</span>, e inspiram <span class="uppercase">experiências</span> onde se constroem <span class="uppercase">memórias</span>.',
          },
          { id: 'about_preview_cta_label_pt', label: 'CTA da secção (PT)', type: 'text', defaultValue: 'Saber Mais' },
          {
            id: 'about_preview_text_en',
            label: 'Texto de apoio (EN)',
            type: 'textarea',
            defaultValue: 'We don\'t just create <span class="uppercase">beautiful homes</span>, we design <span class="uppercase">meaningful</span> spaces that tell <span class="uppercase">your story</span>, and inspire <span class="uppercase">experiences</span> where <span class="uppercase">memories</span> are built.',
          },
          { id: 'about_preview_cta_label_en', label: 'CTA da secção (EN)', type: 'text', defaultValue: 'Learn More' },
          { id: 'about_preview_cta_url', label: 'Link do CTA', type: 'url', defaultValue: '/about' },
        ],
      },
      {
        id: 'visual_style',
        title: 'Estilo visual',
        helperText: 'Imagem de fundo e cores globais aplicadas na homepage.',
        fields: [
          { id: 'home_background_image', label: 'Imagem de fundo principal', type: 'image', defaultValue: '/2026/home/galeria_inicial/suite_4k.jpg' },
          { id: 'home_background_color', label: 'Cor de fundo base', type: 'color', defaultValue: '#e3dfdc' },
          { id: 'home_text_color', label: 'Cor principal do texto', type: 'color', defaultValue: '#ffffff' },
          { id: 'home_overlay_color', label: 'Cor do overlay', type: 'color', defaultValue: '#000000' },
        ],
      },
      {
        id: 'photo_layout',
        title: 'Slides e imagens da Home',
        helperText: 'Aqui pode trocar as imagens do slider inicial e a imagem do bloco About Preview. O admin já carrega as imagens atuais do site como base.',
        fields: [
          {
            id: 'home_hero_slides_layout',
            label: 'Slides da chamada inicial',
            type: 'gallery_layout',
            pageKey: 'home',
            sectionKey: 'hero_slides',
            defaultValue: JSON.stringify(getDefaultLayout('home', 'hero_slides')),
          },
          {
            id: 'home_about_preview_layout',
            label: 'Imagem do About Preview',
            type: 'gallery_layout',
            pageKey: 'home',
            sectionKey: 'about_preview_image',
            defaultValue: JSON.stringify(getDefaultLayout('home', 'about_preview_image')),
          },
        ],
      },
    ],
  },
  projects: {
    pageId: 'projects',
    title: 'Projects',
    publicPath: '/projects',
    description: 'Gerencie textos bilíngues, filtros, CTA e layouts da página de projetos.',
    icon: Briefcase,
    sections: [
      {
        id: 'projects_hero',
        title: 'Cabeçalho',
        helperText: 'Conteúdo introdutório da página de projetos em português e inglês.',
        fields: [
          { id: 'projects_heading_pt', label: 'Título (PT)', type: 'text', defaultValue: 'Projetos' },
          { id: 'projects_heading_en', label: 'Title (EN)', type: 'text', defaultValue: 'Projects' },
          {
            id: 'projects_description_pt',
            label: 'Descrição (PT)',
            type: 'textarea',
            defaultValue: 'Uma seleção <span class="uppercase">curada</span> do nosso trabalho, onde cada projeto reflete o nosso compromisso em criar espaços com <span class="uppercase">significado</span>, pensados para contar histórias <span class="uppercase">únicas</span>.',
          },
          {
            id: 'projects_description_en',
            label: 'Description (EN)',
            type: 'textarea',
            defaultValue: 'A <span class="uppercase">curated</span> selection of our work, each project reflecting our commitment to create <span class="uppercase">meaningful</span> spaces that tell unique <span class="uppercase">stories</span>.',
          },
        ],
      },
      {
        id: 'filters',
        title: 'Filtros e categorias',
        helperText: 'Rótulos usados no filtro da galeria por idioma.',
        fields: [
          { id: 'filter_all_pt', label: 'Rótulo "Todos" (PT)', type: 'text', defaultValue: 'Todos os projetos' },
          { id: 'filter_all_en', label: 'Rótulo "All" (EN)', type: 'text', defaultValue: 'All Projects' },
          { id: 'filter_residential_pt', label: 'Rótulo "Residencial" (PT)', type: 'text', defaultValue: 'Residencial' },
          { id: 'filter_residential_en', label: 'Rótulo "Residential" (EN)', type: 'text', defaultValue: 'Residential' },
          { id: 'filter_commercial_pt', label: 'Rótulo "Comercial" (PT)', type: 'text', defaultValue: 'Comercial' },
          { id: 'filter_commercial_en', label: 'Rótulo "Commercial" (EN)', type: 'text', defaultValue: 'Commercial' },
        ],
      },
      {
        id: 'projects_cta',
        title: 'CTA final',
        helperText: 'Bloco de chamada para contato ao final da página, com texto bilíngue.',
        fields: [
          { id: 'projects_cta_title_pt', label: 'Título CTA (PT)', type: 'text', defaultValue: 'Está a planear o seu próximo projeto?' },
          { id: 'projects_cta_title_en', label: 'CTA title (EN)', type: 'text', defaultValue: 'Planning your next project?' },
          { id: 'projects_cta_button_pt', label: 'Botão CTA (PT)', type: 'text', defaultValue: 'Falar com a RAIZ' },
          { id: 'projects_cta_button_en', label: 'CTA button (EN)', type: 'text', defaultValue: 'Talk with RAIZ' },
          { id: 'projects_cta_url', label: 'URL CTA', type: 'url', defaultValue: '/contact' },
        ],
      },
      {
        id: 'projects_styles',
        title: 'Estilo visual',
        helperText: 'Imagem de destaque e cores da página de projetos.',
        fields: [
          { id: 'projects_background_image', label: 'Imagem de fundo', type: 'image', defaultValue: '' },
          { id: 'projects_background_color', label: 'Cor de fundo', type: 'color', defaultValue: '#E3DFDD' },
          { id: 'projects_title_color', label: 'Cor de título', type: 'color', defaultValue: '#1c1917' },
          { id: 'projects_badge_color', label: 'Cor de badges', type: 'color', defaultValue: '#44403c' },
        ],
      },
      {
        id: 'projects_gallery_layout',
        title: 'Layout de fotos',
        helperText: 'Controle visual de posição e tamanho das imagens da listagem de projetos.',
        fields: [
          {
            id: 'projects_cards_layout',
            label: 'Projects cards layout',
            type: 'gallery_layout',
            pageKey: 'projects',
            sectionKey: 'project_cards',
            defaultValue: JSON.stringify(getDefaultLayout('projects', 'project_cards')),
          },
        ],
      },
    ],
  },
  services: {
    pageId: 'services',
    title: 'Services',
    publicPath: '/services',
    description: 'Edite descrições, processo e chamadas comerciais de serviços.',
    icon: Globe,
    sections: [
      {
        id: 'services_intro',
        title: 'Introdução',
        helperText: 'Texto principal da página de serviços.',
        fields: [
          { id: 'services_heading', label: 'Título', type: 'text', defaultValue: 'What We Do' },
          {
            id: 'services_description',
            label: 'Descrição',
            type: 'textarea',
            defaultValue: 'Da consultoria ao projeto completo, desenvolvemos soluções personalizadas para cada cliente.',
          },
        ],
      },
      {
        id: 'services_list',
        title: 'Serviços em destaque',
        helperText: 'Textos curtos dos cards principais.',
        fields: [
          { id: 'service_1_name', label: 'Serviço 1', type: 'text', defaultValue: 'Interior Design' },
          { id: 'service_1_excerpt', label: 'Resumo 1', type: 'textarea', defaultValue: 'Projetos completos com curadoria de materiais e mobiliário.' },
          { id: 'service_2_name', label: 'Serviço 2', type: 'text', defaultValue: 'Consultancy' },
          { id: 'service_2_excerpt', label: 'Resumo 2', type: 'textarea', defaultValue: 'Orientação especializada para decisões estratégicas de espaço.' },
        ],
      },
      {
        id: 'services_process',
        title: 'Processo',
        helperText: 'Etapas do processo de trabalho.',
        fields: [
          { id: 'process_step_1', label: 'Etapa 1', type: 'text', defaultValue: 'Discovery & Briefing' },
          { id: 'process_step_2', label: 'Etapa 2', type: 'text', defaultValue: 'Concept & Design' },
          { id: 'process_step_3', label: 'Etapa 3', type: 'text', defaultValue: 'Execution & Delivery' },
        ],
      },
      {
        id: 'services_styles',
        title: 'Estilo visual',
        helperText: 'Imagem principal e cores da página de serviços.',
        fields: [
          { id: 'services_background_image', label: 'Imagem de fundo', type: 'image', defaultValue: '/2026/services/interior_design.jpg' },
          { id: 'services_background_color', label: 'Cor de fundo', type: 'color', defaultValue: '#e7e5e4' },
          { id: 'services_card_color', label: 'Cor dos cards', type: 'color', defaultValue: '#ffffff' },
          { id: 'services_text_color', label: 'Cor de texto', type: 'color', defaultValue: '#292524' },
        ],
      },
      {
        id: 'services_gallery_layout',
        title: 'Layout de fotos',
        helperText: 'Controle visual de posição e tamanho das imagens da listagem de serviços.',
        fields: [
          {
            id: 'services_cards_layout',
            label: 'Services cards layout',
            type: 'gallery_layout',
            pageKey: 'services',
            sectionKey: 'service_cards',
            defaultValue: JSON.stringify(getDefaultLayout('services', 'service_cards')),
          },
        ],
      },
    ],
  },
  about: {
    pageId: 'about',
    title: 'About',
    publicPath: '/about',
    description: 'Atualize posicionamento, história e conteúdo institucional.',
    icon: Users,
    sections: [
      {
        id: 'about_intro',
        title: 'Manifesto',
        helperText: 'Bloco principal de apresentação da marca.',
        fields: [
          { id: 'about_heading', label: 'Título', type: 'text', defaultValue: 'About RAIZ Interiors' },
          {
            id: 'about_manifesto',
            label: 'Texto institucional',
            type: 'textarea',
            defaultValue: 'Acreditamos em espaços com identidade, desenhados para refletir histórias, conexões e estilo de vida.',
          },
        ],
      },
      {
        id: 'founder',
        title: 'Founder',
        helperText: 'Seção com bio da fundadora.',
        fields: [
          { id: 'founder_name', label: 'Nome', type: 'text', defaultValue: 'Raquel Diniz' },
          { id: 'founder_role', label: 'Cargo', type: 'text', defaultValue: 'Founder & Creative Director' },
          {
            id: 'founder_bio',
            label: 'Biografia',
            type: 'textarea',
            defaultValue: 'Com visão artística e rigor técnico, lidera projetos que unem sofisticação atemporal e funcionalidade.',
          },
        ],
      },
      {
        id: 'about_cta',
        title: 'CTA',
        helperText: 'Chamada de conversão ao final da página.',
        fields: [
          { id: 'about_cta_title', label: 'Título CTA', type: 'text', defaultValue: "Let's design your next chapter" },
          { id: 'about_cta_button', label: 'Texto do botão', type: 'text', defaultValue: 'Start a Project' },
          { id: 'about_cta_url', label: 'URL do botão', type: 'url', defaultValue: '/contact' },
        ],
      },
      {
        id: 'about_styles',
        title: 'Estilo visual',
        helperText: 'Imagem de fundo e cores institucionais do About.',
        fields: [
          { id: 'about_background_image', label: 'Imagem de fundo', type: 'image', defaultValue: '/2026/about_us/img_3574.jpg' },
          { id: 'about_background_color', label: 'Cor de fundo', type: 'color', defaultValue: '#fafaf9' },
          { id: 'about_text_color', label: 'Cor de texto', type: 'color', defaultValue: '#1c1917' },
          { id: 'about_highlight_color', label: 'Cor de destaque', type: 'color', defaultValue: '#a16207' },
        ],
      },
      {
        id: 'about_gallery_layout',
        title: 'Layout de fotos',
        helperText: 'Controle visual para imagens principais do About.',
        fields: [
          {
            id: 'about_hero_layout',
            label: 'About hero image layout',
            type: 'gallery_layout',
            pageKey: 'about',
            sectionKey: 'hero_image',
            defaultValue: JSON.stringify(getDefaultLayout('about', 'hero_image')),
          },
          {
            id: 'about_founder_layout',
            label: 'About founder image layout',
            type: 'gallery_layout',
            pageKey: 'about',
            sectionKey: 'founder_image',
            defaultValue: JSON.stringify(getDefaultLayout('about', 'founder_image')),
          },
        ],
      },
    ],
  },
  contact: {
    pageId: 'contact',
    title: 'Contact',
    publicPath: '/contact',
    description: 'Gerencie conteúdo e layout visual da página de contato.',
    icon: Mail,
    sections: [
      {
        id: 'contact_intro',
        title: 'Introdução',
        helperText: 'Textos principais da página de contato.',
        fields: [
          { id: 'contact_heading', label: 'Título', type: 'text', defaultValue: 'Get in Touch' },
          {
            id: 'contact_description',
            label: 'Descrição',
            type: 'textarea',
            defaultValue: "We'd love to hear about your project. Whether you're ready to start or just exploring possibilities, let's begin a conversation.",
          },
        ],
      },
      {
        id: 'contact_gallery_layout',
        title: 'Layout de fotos',
        helperText: 'Galeria visual adicional na página de contato.',
        fields: [
          {
            id: 'contact_hero_visual_layout',
            label: 'Contact visual layout',
            type: 'gallery_layout',
            pageKey: 'contact',
            sectionKey: 'hero_visual',
            defaultValue: JSON.stringify(getDefaultLayout('contact', 'hero_visual')),
          },
        ],
      },
    ],
  },
  privacy: {
    pageId: 'privacy',
    title: 'Privacy Policy',
    publicPath: '/privacy',
    description: 'Edite o texto legal e as seções de política de privacidade.',
    icon: Lock,
    sections: [
      {
        id: 'privacy_header',
        title: 'Cabeçalho legal',
        helperText: 'Informações principais e data de atualização.',
        fields: [
          { id: 'privacy_title', label: 'Título da página', type: 'text', defaultValue: 'Privacy Policy' },
          { id: 'privacy_last_update', label: 'Última atualização', type: 'text', defaultValue: 'February 27, 2026' },
        ],
      },
      {
        id: 'privacy_content',
        title: 'Conteúdo',
        helperText: 'Texto completo da política de privacidade.',
        fields: [
          {
            id: 'privacy_body',
            label: 'Texto legal',
            type: 'textarea',
            defaultValue: 'Descreva aqui como dados são coletados, processados, armazenados e removidos, além dos direitos dos titulares.',
          },
        ],
      },
      {
        id: 'privacy_contact',
        title: 'Canal de contato',
        helperText: 'E-mail e instruções para solicitações de titulares.',
        fields: [
          { id: 'privacy_email', label: 'E-mail DPO/Responsável', type: 'text', defaultValue: 'privacy@raiz-interiors.com' },
          { id: 'privacy_response_sla', label: 'Prazo de resposta', type: 'text', defaultValue: 'Até 15 dias úteis' },
        ],
      },
      {
        id: 'privacy_styles',
        title: 'Estilo visual',
        helperText: 'Personalização visual da página de privacidade.',
        fields: [
          { id: 'privacy_background_image', label: 'Imagem de fundo', type: 'image', defaultValue: '' },
          { id: 'privacy_background_color', label: 'Cor de fundo', type: 'color', defaultValue: '#fafaf9' },
          { id: 'privacy_text_color', label: 'Cor de texto', type: 'color', defaultValue: '#292524' },
          { id: 'privacy_link_color', label: 'Cor de links', type: 'color', defaultValue: '#0f766e' },
        ],
      },
      {
        id: 'privacy_gallery_layout',
        title: 'Layout de fotos',
        helperText: 'Visual auxiliar da página de privacidade.',
        fields: [
          {
            id: 'privacy_visual_layout',
            label: 'Privacy visual layout',
            type: 'gallery_layout',
            pageKey: 'privacy',
            sectionKey: 'policy_visual',
            defaultValue: JSON.stringify(getDefaultLayout('privacy', 'policy_visual')),
          },
        ],
      },
    ],
  },
}
