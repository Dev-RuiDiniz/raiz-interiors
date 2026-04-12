'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ComponentType, ReactNode } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Eye,
  Image as ImageIcon,
  LayoutGrid,
  Loader2,
  Palette,
  RefreshCw,
  Save,
  Sparkles,
  Upload,
  Wand2,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { GalleryLayoutField } from '@/components/admin/gallery-layout-field'
import { adminPageEditorConfigs } from '@/lib/admin-page-configs'
import type { EditorField, EditorSection } from '@/lib/admin-page-configs'

type HomeField = EditorField & {
  hint?: string
}

type HomeSection = EditorSection & {
  accent?: string
  icon?: ComponentType<{ size?: number; className?: string }>
  fields: HomeField[]
}

const homeSectionOrder = [
  'hero',
  'intro',
  'featured_projects',
  'services_preview',
  'about_preview',
  'visual_style',
  'photo_layout',
] as const

const sectionMeta: Record<
  (typeof homeSectionOrder)[number],
  {
    title: string
    description: string
    status: string
    accent: string
    icon: ComponentType<{ size?: number; className?: string }>
  }
> = {
  hero: {
    title: 'Hero',
    description: 'Primeiro impacto visual e mensagem principal da página inicial.',
    status: 'Acima da dobra',
    accent: 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-900/20',
    icon: Wand2,
  },
  intro: {
    title: 'Intro',
    description: 'Apresentação curta da proposta e da identidade do estúdio.',
    status: 'Seção institucional',
    accent: 'border-sky-200 bg-sky-50 dark:border-sky-900 dark:bg-sky-900/20',
    icon: Sparkles,
  },
  featured_projects: {
    title: 'Featured projects',
    description: 'Título e CTA da vitrine de projetos selecionados.',
    status: 'Bloco editorial',
    accent: 'border-emerald-200 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/20',
    icon: LayoutGrid,
  },
  services_preview: {
    title: 'Services preview',
    description: 'Resumo rápido dos serviços destacados na homepage.',
    status: 'Bloco de conversão',
    accent: 'border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-900/20',
    icon: Palette,
  },
  about_preview: {
    title: 'About preview',
    description: 'Prévia do bloco sobre a marca e o posicionamento.',
    status: 'Bloco institucional',
    accent: 'border-rose-200 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/20',
    icon: ImageIcon,
  },
  visual_style: {
    title: 'Estilo visual',
    description: 'Imagem de fundo, cores e overlay para controlar o ambiente visual.',
    status: 'Aparência global',
    accent: 'border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40',
    icon: Palette,
  },
  photo_layout: {
    title: 'Layout de fotos',
    description: 'Posicionamento fino dos visuais e das composições da homepage.',
    status: 'Layout avançado',
    accent: 'border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900',
    icon: LayoutGrid,
  },
}

const fieldHelp: Record<string, string> = {
  intro_text_pt: 'Texto introdutório exibido na Home em português.',
  intro_text_en: 'Texto introdutório exibido na Home em inglês.',
  featured_title_pt: 'Rótulo da secção de projetos em português.',
  featured_cta_label_pt: 'Texto do CTA de projetos em português.',
  featured_title_en: 'Rótulo da secção de projetos em inglês.',
  featured_cta_label_en: 'Texto do CTA de projetos em inglês.',
  featured_cta_url: 'Página de destino para a lista completa.',
  services_preview_title_pt: 'Título do bloco de serviços em português.',
  services_preview_text_pt: 'Texto resumido da vitrine de serviços em português.',
  services_preview_cta_label_pt: 'CTA do bloco de serviços em português.',
  services_preview_title_en: 'Título do bloco de serviços em inglês.',
  services_preview_text_en: 'Texto resumido da vitrine de serviços em inglês.',
  services_preview_cta_label_en: 'CTA do bloco de serviços em inglês.',
  services_preview_cta_url: 'Destino do CTA dos serviços.',
  about_preview_text_pt: 'Resumo institucional do bloco About em português.',
  about_preview_cta_label_pt: 'CTA do bloco About em português.',
  about_preview_text_en: 'Resumo institucional do bloco About em inglês.',
  about_preview_cta_label_en: 'CTA do bloco About em inglês.',
  about_preview_cta_url: 'Destino do CTA do bloco About.',
  home_background_image: 'Imagem principal usada como ambiente visual da homepage.',
  home_background_color: 'Cor de base aplicada no fundo da home.',
  home_text_color: 'Cor usada no texto principal e contrastes.',
  home_overlay_color: 'Overlay aplicado sobre a imagem de fundo.',
}

function sortHomeSections(sections: EditorSection[]) {
  const byId = new Map(sections.map((section) => [section.id, section]))
  return homeSectionOrder.map((sectionId) => byId.get(sectionId)).filter(Boolean) as EditorSection[]
}

function HomeFieldControl({
  field,
  value,
  onChange,
  onUploadImage,
  uploadingFieldId,
}: {
  field: HomeField
  value: string
  onChange: (nextValue: string) => void
  onUploadImage: (fieldId: string, file: File) => Promise<void>
  uploadingFieldId: string | null
}) {
  const help = field.hint || fieldHelp[field.id]

  return (
    <div className={field.type === 'textarea' || field.type === 'image' || field.type === 'gallery_layout' ? 'md:col-span-2 space-y-2' : 'space-y-2'}>
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={field.id} className="font-inter text-xs uppercase tracking-wide text-stone-500">
          {field.label}
        </Label>
        {help && <p className="font-inter text-[11px] text-stone-400 text-right max-w-[55%]">{help}</p>}
      </div>

      {field.type === 'textarea' && (
        <Textarea
          id={field.id}
          value={value}
          placeholder={field.placeholder}
          rows={6}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {(field.type === 'text' || field.type === 'url') && (
        <Input
          id={field.id}
          type={field.type === 'url' ? 'url' : 'text'}
          value={value}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.type === 'color' && (
        <div className="flex items-center gap-3">
          <Input
            id={field.id}
            type="color"
            value={value || '#000000'}
            className="w-16 h-10 p-1 cursor-pointer"
            onChange={(event) => onChange(event.target.value)}
          />
          <Input
            type="text"
            value={value || ''}
            placeholder="#000000"
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      )}

      {field.type === 'image' && (
        <div className="space-y-3">
          <Input
            id={field.id}
            type="text"
            value={value}
            placeholder="/uploads/admin/... ou https://..."
            onChange={(event) => onChange(event.target.value)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Label
              htmlFor={`upload-${field.id}`}
              className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
            >
              {uploadingFieldId === field.id ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Upload imagem
            </Label>
            <Input
              id={`upload-${field.id}`}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) {
                  onUploadImage(field.id, file)
                }
                event.currentTarget.value = ''
              }}
            />
            <p className="font-inter text-xs text-stone-500 dark:text-stone-400">JPG, PNG, WEBP ou GIF até 10MB</p>
          </div>
          {value && (
            <div className="relative h-44 w-full overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={value} alt={`${field.label} preview`} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      )}

      {field.type === 'gallery_layout' && (
        <GalleryLayoutField id={field.id} value={value} onChange={onChange} />
      )}
    </div>
  )
}

function SectionCard({
  section,
  index,
  expanded,
  onToggle,
  children,
}: {
  section: EditorSection
  index: number
  expanded: boolean
  onToggle: () => void
  children: ReactNode
}) {
  const meta = sectionMeta[section.id as keyof typeof sectionMeta] || sectionMeta.hero
  const Icon = meta.icon

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className={`rounded-2xl border ${meta.accent} overflow-hidden`}
    >
      <header className="p-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-11 h-11 rounded-xl bg-white/80 dark:bg-stone-950/70 border border-stone-200/80 dark:border-stone-700 flex items-center justify-center">
            <Icon size={18} className="text-stone-700 dark:text-stone-200" />
          </div>
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-inter text-sm font-semibold text-stone-900 dark:text-white">{meta.title}</h2>
              <Badge variant="outline" className="font-inter text-[11px]">
                {meta.status}
              </Badge>
            </div>
            <p className="font-inter text-xs text-stone-600 dark:text-stone-400">{meta.description}</p>
            <p className="font-inter text-[11px] text-stone-400">
              Bloco {index + 1} • {section.fields.length} campos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onToggle}
          className="inline-flex items-center gap-2 rounded-md border border-stone-200 dark:border-stone-700 px-3 h-9 text-xs font-inter text-stone-600 dark:text-stone-300 hover:bg-white/70 dark:hover:bg-stone-800 transition-colors"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          {expanded ? 'Recolher' : 'Expandir'}
        </button>
      </header>

      {expanded && <div className="border-t border-stone-200/70 dark:border-stone-800 bg-white/60 dark:bg-stone-950/20 p-5">{children}</div>}
    </motion.section>
  )
}

export function HomeBlockEditor() {
  const config = adminPageEditorConfigs.home
  const sections = useMemo(() => sortHomeSections(config.sections), [config.sections])
  const allFields = useMemo(() => sections.flatMap((section) => section.fields), [sections])
  const galleryFields = useMemo(() => allFields.filter((field) => field.type === 'gallery_layout' && field.pageKey && field.sectionKey), [allFields])
  const regularFields = useMemo(() => allFields.filter((field) => field.type !== 'gallery_layout'), [allFields])

  const initialValues = useMemo(
    () =>
      allFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = field.type === 'gallery_layout' ? field.defaultValue || '' : field.defaultValue || ''
        return acc
      }, {}),
    [allFields]
  )

  const [values, setValues] = useState<Record<string, string>>(initialValues)
  const [loadingSettings, setLoadingSettings] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [uploadingFieldId, setUploadingFieldId] = useState<string | null>(null)
  const [lastSaved, setLastSaved] = useState<string | null>(null)
  const [lastPublished, setLastPublished] = useState<string | null>(null)
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null)
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success')
  const [previewNonce, setPreviewNonce] = useState(0)
  const [previewLoading, setPreviewLoading] = useState(true)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(() =>
    sections.reduce<Record<string, boolean>>((acc, section) => {
      acc[section.id] = true
      return acc
    }, {})
  )

  const previewSrc = useMemo(() => {
    const separator = config.publicPath.includes('?') ? '&' : '?'
    return `${config.publicPath}${separator}preview_ts=${previewNonce}`
  }, [config.publicPath, previewNonce])

  useEffect(() => {
    let active = true

    const loadSavedValues = async () => {
      setLoadingSettings(true)
      try {
        const nextValues = { ...initialValues }

        if (regularFields.length > 0) {
          const response = await fetch(`/api/admin/page-settings?pageId=home`, {
            method: 'GET',
            cache: 'no-store',
          })

          if (response.ok) {
            const data = (await response.json()) as {
              values?: Record<string, string>
              updatedAt?: string | null
              publishedAt?: string | null
            }
            Object.assign(nextValues, data.values || {})
            if (data.updatedAt) setLastSaved(new Date(data.updatedAt).toLocaleString('pt-PT'))
            if (data.publishedAt) setLastPublished(new Date(data.publishedAt).toLocaleString('pt-PT'))
          }
        }

        for (const field of galleryFields) {
          const response = await fetch(
            `/api/admin/page-layout?pageKey=${encodeURIComponent(field.pageKey!)}&sectionKey=${encodeURIComponent(field.sectionKey!)}`,
            { method: 'GET', cache: 'no-store' }
          )

          if (!response.ok) continue

          const data = (await response.json()) as {
            draft?: unknown
            updatedAt?: string | null
            publishedAt?: string | null
          }

          nextValues[field.id] = data.draft ? JSON.stringify(data.draft) : field.defaultValue || ''
          if (data.updatedAt) setLastSaved(new Date(data.updatedAt).toLocaleString('pt-PT'))
          if (data.publishedAt) setLastPublished(new Date(data.publishedAt).toLocaleString('pt-PT'))
        }

        if (!active) return
        setValues(nextValues)
      } catch {
        if (!active) return
        setValues(initialValues)
      } finally {
        if (active) setLoadingSettings(false)
      }
    }

    loadSavedValues()

    return () => {
      active = false
    }
  }, [galleryFields, initialValues, regularFields.length])

  useEffect(() => {
    setPreviewLoading(true)
  }, [previewNonce])

  const onFieldChange = (id: string, value: string) => setValues((previous) => ({ ...previous, [id]: value }))

  const onUploadImage = async (fieldId: string, file: File) => {
    setUploadingFieldId(fieldId)
    setFeedbackMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      const result = (await response.json()) as { url?: string; error?: string }
      if (!response.ok || !result.url) throw new Error(result.error || 'Upload failed')

      onFieldChange(fieldId, result.url)
      setFeedbackType('success')
      setFeedbackMessage('Imagem enviada com sucesso.')
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(error instanceof Error ? error.message : 'Falha ao enviar imagem.')
    } finally {
      setUploadingFieldId(null)
    }
  }

  const persistDraft = async () => {
    try {
      if (regularFields.length > 0) {
        const regularValues = regularFields.reduce<Record<string, string>>((acc, field) => {
          acc[field.id] = values[field.id] || ''
          return acc
        }, {})

        const response = await fetch('/api/admin/page-settings', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: 'home', values: regularValues }),
        })

        if (!response.ok) throw new Error('Não foi possível guardar o rascunho.')
      }

      for (const field of galleryFields) {
        const rawValue = values[field.id] || field.defaultValue || ''
        let parsedDraft: unknown = null
        try {
          parsedDraft = rawValue ? JSON.parse(rawValue) : null
        } catch {
          parsedDraft = null
        }

        const response = await fetch('/api/admin/page-layout', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageKey: field.pageKey,
            sectionKey: field.sectionKey,
            draft: parsedDraft,
          }),
        })

        if (!response.ok) throw new Error(`Não foi possível guardar layout da seção ${field.label}.`)
      }

      setLastSaved(new Date().toLocaleString('pt-PT'))
      return true
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(error instanceof Error ? error.message : 'Erro ao guardar rascunho.')
      return false
    }
  }

  const onSaveDraft = async () => {
    setSaving(true)
    setFeedbackMessage(null)
    const ok = await persistDraft()
    if (ok) {
      setFeedbackType('success')
      setFeedbackMessage('Rascunho guardado com sucesso.')
    }
    setSaving(false)
  }

  const onPublishChanges = async () => {
    setPublishing(true)
    setFeedbackMessage(null)

    const draftSaved = await persistDraft()
    if (!draftSaved) {
      setPublishing(false)
      return
    }

    try {
      if (regularFields.length > 0) {
        const response = await fetch('/api/admin/page-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: 'home', action: 'publish' }),
        })
        if (!response.ok) {
          const data = (await response.json()) as { error?: string }
          throw new Error(data.error || 'Não foi possível publicar alterações.')
        }
      }

      for (const field of galleryFields) {
        const response = await fetch('/api/admin/page-layout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pageKey: field.pageKey,
            sectionKey: field.sectionKey,
            action: 'publish',
          }),
        })

        if (!response.ok) {
          const data = (await response.json()) as { error?: string }
          throw new Error(data.error || `Não foi possível publicar layout da seção ${field.label}.`)
        }
      }

      setLastPublished(new Date().toLocaleString('pt-PT'))
      setFeedbackType('success')
      setFeedbackMessage('Alterações publicadas com sucesso.')
      setPreviewNonce((current) => current + 1)
    } catch (error) {
      setFeedbackType('error')
      setFeedbackMessage(error instanceof Error ? error.message : 'Erro ao publicar alterações.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          <Link
            href="/admin/pages"
            className="inline-flex items-center gap-2 font-inter text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            Voltar para páginas
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
              <config.icon size={20} className="text-stone-600 dark:text-stone-300" />
            </div>
            <div>
              <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">Editar {config.title}</h1>
              <p className="font-inter text-sm text-stone-500 dark:text-stone-400">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-inter text-xs">
            Draft
          </Badge>
          {lastPublished && (
            <Badge className="font-inter text-xs bg-emerald-600 hover:bg-emerald-600 text-white">Published</Badge>
          )}
          <Button variant="outline" asChild>
            <a href={config.publicPath} target="_blank" rel="noopener noreferrer">
              <Eye size={16} />
              Ver página
            </a>
          </Button>
          <Button onClick={onSaveDraft} disabled={saving || loadingSettings}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar rascunho
          </Button>
          <Button onClick={onPublishChanges} disabled={publishing || saving || loadingSettings}>
            {publishing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
            Publicar alterações
          </Button>
        </div>
      </div>

      {loadingSettings && (
        <div className="rounded-xl border border-stone-200 bg-white dark:bg-stone-900 dark:border-stone-800 px-4 py-3">
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" />
            Carregando configurações salvas...
          </p>
        </div>
      )}

      {feedbackMessage && (
        <div
          className={
            feedbackType === 'success'
              ? 'rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-900 px-4 py-3'
              : 'rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-900 px-4 py-3'
          }
        >
          <p
            className={
              feedbackType === 'success'
                ? 'font-inter text-sm text-emerald-700 dark:text-emerald-300'
                : 'font-inter text-sm text-red-700 dark:text-red-300'
            }
          >
            {feedbackMessage}
          </p>
        </div>
      )}

      {lastSaved && !feedbackMessage && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-900 px-4 py-3">
          <p className="font-inter text-sm text-emerald-700 dark:text-emerald-300">
            Rascunho guardado com sucesso em {lastSaved}.
          </p>
        </div>
      )}

      {(lastSaved || lastPublished) && (
        <div className="rounded-xl border border-stone-200 bg-white dark:bg-stone-900 dark:border-stone-800 px-4 py-3">
          <div className="font-inter text-xs text-stone-500 dark:text-stone-400 space-y-1">
            {lastSaved && <p>Último rascunho: {lastSaved}</p>}
            {lastPublished && <p>Última publicação permanente: {lastPublished}</p>}
          </div>
        </div>
      )}

      <section className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl">
        <header className="px-5 py-4 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-inter text-sm font-medium text-stone-900 dark:text-white">Pré-visualização da página completa</h2>
            <p className="font-inter text-xs text-stone-500 dark:text-stone-400 mt-1">
              Visualize a página inteira como o cliente vê. Após publicar, clique em atualizar preview.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setPreviewNonce((current) => current + 1)}>
              <RefreshCw size={14} />
              Atualizar preview
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={config.publicPath} target="_blank" rel="noopener noreferrer">
                <Eye size={14} />
                Abrir em nova aba
              </a>
            </Button>
          </div>
        </header>

        <div className="p-4">
          <div className="relative rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden bg-stone-50 dark:bg-stone-950" style={{ height: '78vh' }}>
            {previewLoading && (
              <div className="absolute inset-0 z-10 bg-white/80 dark:bg-stone-900/80 flex items-center justify-center">
                <p className="font-inter text-xs text-stone-500 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Carregando preview...
                </p>
              </div>
            )}
            <iframe
              key={previewNonce}
              src={previewSrc}
              title={`Pré-visualização ${config.title}`}
              className="h-full w-full"
              onLoad={() => setPreviewLoading(false)}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {sections.map((section, sectionIndex) => (
          <SectionCard
            key={section.id}
            section={section}
            index={sectionIndex}
            expanded={expandedSections[section.id] ?? true}
            onToggle={() => setExpandedSections((previous) => ({ ...previous, [section.id]: !(previous[section.id] ?? true) }))}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <HomeFieldControl
                  key={field.id}
                  field={field}
                  value={values[field.id] || ''}
                  onChange={(nextValue) => onFieldChange(field.id, nextValue)}
                  onUploadImage={onUploadImage}
                  uploadingFieldId={uploadingFieldId}
                />
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}
