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
    description: 'Edite hero, destaques e blocos institucionais da página inicial.',
    icon: Home,
    sections: [
      {
        id: 'hero',
        title: 'Hero',
        helperText: 'Conteúdo principal exibido no primeiro bloco da homepage.',
        fields: [
          { id: 'hero_heading', label: 'Título principal', type: 'text', defaultValue: 'It\'s not about interior design itself' },
          { id: 'hero_subheading', label: 'Subtítulo', type: 'text', defaultValue: 'It\'s about you, your story, your connections...' },
          { id: 'hero_cta_label', label: 'Texto do botão', type: 'text', defaultValue: 'View Projects' },
          { id: 'hero_cta_url', label: 'URL do botão', type: 'url', defaultValue: '/projects' },
        ],
      },
      {
        id: 'intro',
        title: 'Intro',
        helperText: 'Resumo da proposta da RAIZ na home.',
        fields: [
          { id: 'intro_title', label: 'Título da seção', type: 'text', defaultValue: 'Design with soul and intention' },
          {
            id: 'intro_text',
            label: 'Texto',
            type: 'textarea',
            defaultValue:
              'Criamos espaços com identidade, equilíbrio e sofisticação para uma vida com propósito.',
          },
        ],
      },
      {
        id: 'featured',
        title: 'Selected Projects',
        helperText: 'Configuração de título e chamada para a seção de projetos selecionados.',
        fields: [
          { id: 'featured_title', label: 'Título', type: 'text', defaultValue: 'Selected Projects' },
          { id: 'featured_cta_label', label: 'Texto CTA', type: 'text', defaultValue: 'View All Projects' },
          { id: 'featured_cta_url', label: 'URL CTA', type: 'url', defaultValue: '/projects' },
        ],
      },
      {
        id: 'home_styles',
        title: 'Estilo visual',
        helperText: 'Imagem de fundo e paleta aplicada na home.',
        fields: [
          { id: 'home_background_image', label: 'Imagem de fundo principal', type: 'image', defaultValue: '/2026/home/galeria_inicial/suite_4k.jpg' },
          { id: 'home_background_color', label: 'Cor de fundo base', type: 'color', defaultValue: '#e3dfdc' },
          { id: 'home_text_color', label: 'Cor de texto principal', type: 'color', defaultValue: '#ffffff' },
          { id: 'home_overlay_color', label: 'Cor de overlay', type: 'color', defaultValue: '#000000' },
        ],
      },
      {
        id: 'home_gallery_layout',
        title: 'Layout de fotos',
        helperText: 'Galeria posicionável para Home (desktop e mobile).',
        fields: [
          {
            id: 'home_hero_slides_layout',
            label: 'Hero slides layout',
            type: 'gallery_layout',
            pageKey: 'home',
            sectionKey: 'hero_slides',
            defaultValue: JSON.stringify(getDefaultLayout('home', 'hero_slides')),
          },
          {
            id: 'home_about_preview_layout',
            label: 'About preview image layout',
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
    description: 'Gerencie textos de listagem e destaque para a página de projetos.',
    icon: Briefcase,
    sections: [
      {
        id: 'projects_hero',
        title: 'Cabeçalho',
        helperText: 'Conteúdo introdutório da página de projetos.',
        fields: [
          { id: 'projects_heading', label: 'Título', type: 'text', defaultValue: 'Our Projects' },
          {
            id: 'projects_description',
            label: 'Descrição',
            type: 'textarea',
            defaultValue:
              'Conheça uma seleção de projetos residenciais e comerciais com abordagem autoral e foco em experiência.',
          },
        ],
      },
      {
        id: 'filters',
        title: 'Filtros e categorias',
        helperText: 'Rótulos usados no filtro da galeria.',
        fields: [
          { id: 'filter_all', label: 'Rótulo "Todos"', type: 'text', defaultValue: 'All Projects' },
          { id: 'filter_residential', label: 'Rótulo "Residencial"', type: 'text', defaultValue: 'Residential' },
          { id: 'filter_commercial', label: 'Rótulo "Comercial"', type: 'text', defaultValue: 'Commercial' },
        ],
      },
      {
        id: 'projects_cta',
        title: 'CTA final',
        helperText: 'Bloco de chamada para contato ao final da página.',
        fields: [
          { id: 'projects_cta_title', label: 'Título CTA', type: 'text', defaultValue: 'Planning your next project?' },
          { id: 'projects_cta_button', label: 'Botão CTA', type: 'text', defaultValue: 'Talk with RAIZ' },
          { id: 'projects_cta_url', label: 'URL CTA', type: 'url', defaultValue: '/contact' },
        ],
      },
      {
        id: 'projects_styles',
        title: 'Estilo visual',
        helperText: 'Imagem de destaque e cores da página de projetos.',
        fields: [
          { id: 'projects_background_image', label: 'Imagem de fundo', type: 'image', defaultValue: '/contemporary_city_house.jpg' },
          { id: 'projects_background_color', label: 'Cor de fundo', type: 'color', defaultValue: '#f5f5f4' },
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
            defaultValue:
              'Da consultoria ao projeto completo, desenvolvemos soluções personalizadas para cada cliente.',
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
            defaultValue:
              'Acreditamos em espaços com identidade, desenhados para refletir histórias, conexões e estilo de vida.',
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
            defaultValue:
              'Com visão artística e rigor técnico, lidera projetos que unem sofisticação atemporal e funcionalidade.',
          },
        ],
      },
      {
        id: 'about_cta',
        title: 'CTA',
        helperText: 'Chamada de conversão ao final da página.',
        fields: [
          { id: 'about_cta_title', label: 'Título CTA', type: 'text', defaultValue: 'Let\'s design your next chapter' },
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
            defaultValue:
              "We'd love to hear about your project. Whether you're ready to start or just exploring possibilities, let's begin a conversation.",
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
            defaultValue:
              'Descreva aqui como dados são coletados, processados, armazenados e removidos, além dos direitos dos titulares.',
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
