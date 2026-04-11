'use client'

import { use, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Bold, CaseLower, CaseSensitive, CaseUpper, Eye, Italic, Loader2, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GalleryLayoutField } from '@/components/admin/gallery-layout-field'
import { createDefaultBox, normalizeGalleryLayout, type GalleryLayout } from '@/lib/cms/layout-types'
import type { JsonValue } from '@/lib/cms/dictionary-utils'

interface PageProps {
  params: Promise<{ id: string }>
}

type EditableProject = {
  id: string
  slug: string
  title: string
  subtitle: string
  location: string
  category: 'RESIDENTIAL' | 'COMMERCIAL' | 'HOSPITALITY' | 'RETAIL'
  status: 'DRAFT' | 'PUBLISHED' | 'COMING_SOON' | 'WORK_IN_PROGRESS'
  description: string
  coverImage: string
  year: string
  client: string
  credits: string
  featured: boolean
  order: number
}

function wrapSelection(
  text: string,
  selectionStart: number,
  selectionEnd: number,
  before: string,
  after: string
) {
  const start = Math.max(0, selectionStart)
  const end = Math.max(start, selectionEnd)
  return text.slice(0, start) + before + text.slice(start, end) + after + text.slice(end)
}

function transformSelection(text: string, selectionStart: number, selectionEnd: number, mode: 'upper' | 'lower') {
  const start = Math.max(0, selectionStart)
  const end = Math.max(start, selectionEnd)
  const selected = text.slice(start, end)
  const transformed = mode === 'upper' ? selected.toUpperCase() : selected.toLowerCase()
  return text.slice(0, start) + transformed + text.slice(end)
}

function ProjectTextField({
  label,
  value,
  onChange,
  multiline = false,
  helper,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  helper?: string
}) {
  const [open, setOpen] = useState(false)
  const [fontFamily, setFontFamily] = useState('inherit')
  const [fontSize, setFontSize] = useState('16')
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  const applyMarkup = (before: string, after: string) => {
    const el = inputRef.current
    if (!el) return
    const nextValue = wrapSelection(value, el.selectionStart ?? 0, el.selectionEnd ?? 0, before, after)
    onChange(nextValue)
  }

  const applyTransform = (mode: 'upper' | 'lower') => {
    const el = inputRef.current
    if (!el) return
    const nextValue = transformSelection(value, el.selectionStart ?? 0, el.selectionEnd ?? 0, mode)
    onChange(nextValue)
  }

  const applyFontStyle = () => {
    const el = inputRef.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    if (start === end) return
    onChange(
      wrapSelection(
        value,
        start,
        end,
        `<span style="font-family:${fontFamily}; font-size:${fontSize}px">`,
        '</span>'
      )
    )
  }

  return (
    <>
      <div className="rounded-[1.75rem] border border-stone-200 bg-white p-4 shadow-sm dark:border-stone-800 dark:bg-stone-950/70">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="space-y-1">
            <Label className="text-[11px] uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
              {label}
            </Label>
            {helper && <p className="font-inter text-xs text-stone-400 dark:text-stone-500">{helper}</p>}
          </div>
          <Button type="button" variant="outline" size="sm" onClick={() => setOpen(true)} className="h-9 rounded-full px-4">
            Editar
          </Button>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => applyMarkup('<strong>', '</strong>')}>
            <Bold size={14} />
            Negrito
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyMarkup('<em>', '</em>')}>
            <Italic size={14} />
            Itálico
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyTransform('upper')}>
            <CaseUpper size={14} />
            Maiúsculas
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={() => applyTransform('lower')}>
            <CaseLower size={14} />
            Minúsculas
          </Button>
        </div>

        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            rows={5}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] w-[min(980px,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border-stone-200 bg-white p-0 dark:border-stone-800 dark:bg-stone-950">
          <div className="grid max-h-[92vh] lg:grid-cols-[1fr_300px]">
            <div className="flex min-h-0 flex-col border-b border-stone-200 p-6 lg:border-b-0 lg:border-r dark:border-stone-800">
              <DialogHeader className="mb-5 text-left">
                <DialogTitle className="font-cormorant text-3xl text-stone-900 dark:text-white">
                  {label}
                </DialogTitle>
                {helper && <DialogDescription className="font-inter text-sm text-stone-500 dark:text-stone-400">{helper}</DialogDescription>}
              </DialogHeader>

              <div className="mb-4 flex flex-wrap gap-2 rounded-2xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-950/60">
                <Button type="button" variant="outline" size="sm" onClick={() => applyMarkup('<strong>', '</strong>')}>
                  <Bold size={14} />
                  Negrito
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyMarkup('<em>', '</em>')}>
                  <Italic size={14} />
                  Itálico
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyTransform('upper')}>
                  <CaseUpper size={14} />
                  Maiúsculas
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => applyTransform('lower')}>
                  <CaseLower size={14} />
                  Minúsculas
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={applyFontStyle}>
                  <CaseSensitive size={14} />
                  Fonte
                </Button>
                <div className="ml-auto flex gap-2">
                  <select
                    value={fontFamily}
                    onChange={(event) => setFontFamily(event.target.value)}
                    className="h-10 rounded-full border border-stone-200 bg-white px-3 font-inter text-sm dark:border-stone-800 dark:bg-stone-950"
                  >
                    <option value="inherit">Fonte do site</option>
                    <option value="Cormorant Garamond, serif">Cormorant</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="Arial, sans-serif">Arial</option>
                  </select>
                  <select
                    value={fontSize}
                    onChange={(event) => setFontSize(event.target.value)}
                    className="h-10 rounded-full border border-stone-200 bg-white px-3 font-inter text-sm dark:border-stone-800 dark:bg-stone-950"
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                    <option value="20">20px</option>
                  </select>
                </div>
              </div>

              {multiline ? (
                <Textarea
                  ref={inputRef as React.RefObject<HTMLTextAreaElement>}
                  rows={22}
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  className="min-h-[56vh] flex-1 resize-none rounded-[1.5rem] border-stone-200 font-inter text-sm leading-7 dark:border-stone-800"
                />
              ) : (
                <Input
                  ref={inputRef as React.RefObject<HTMLInputElement>}
                  value={value}
                  onChange={(event) => onChange(event.target.value)}
                  className="h-12 rounded-2xl border-stone-200 font-inter text-sm dark:border-stone-800"
                />
              )}
            </div>
            <div className="space-y-4 overflow-y-auto bg-stone-50 p-6 dark:bg-stone-900/40">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950/70">
                <p className="font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                  Preview
                </p>
                <p className="mt-2 break-words font-inter text-sm leading-7 text-stone-700 dark:text-stone-300">
                  {value || 'Campo vazio'}
                </p>
              </div>
              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950/70">
                <p className="font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                  Dica
                </p>
                <p className="mt-2 font-inter text-sm leading-6 text-stone-600 dark:text-stone-300">
                  Formatação é salva como texto compatível com os projetos antigos e novos.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

type AdminProjectResponse = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  location: string
  category: EditableProject['category']
  status: EditableProject['status']
  description: string | null
  coverImage: string
  year: string | null
  client: string | null
  credits: string | null
  featured: boolean
  order: number
  images?: Array<
    | string
    | {
        id?: string
        url?: string | null
        src?: string | null
        alt?: string | null
        order?: number | null
        visible?: boolean | null
      }
  >
}

function buildLayoutFromProjectImages(images: AdminProjectResponse['images']): GalleryLayout {
  if (!images?.length) {
    return normalizeGalleryLayout(null)
  }

  const normalized = images
    .map((image, index) => {
      if (typeof image === 'string') {
        if (!image) return null
        return {
          id: `project-image-${index + 1}`,
          src: image,
          alt: '',
          order: index,
          visible: true,
          desktop: createDefaultBox(),
          mobile: createDefaultBox(),
        }
      }

      const src = (image.url || image.src || '').trim()
      if (!src) return null
      if (image.visible === false) return null

      return {
        id: image.id || `project-image-${index + 1}`,
        src,
        alt: image.alt || '',
        order: typeof image.order === 'number' ? image.order : index,
        visible: true,
        desktop: createDefaultBox(),
        mobile: createDefaultBox(),
      }
    })
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }))

  if (!normalized.length) {
    return normalizeGalleryLayout(null)
  }

  return {
    items: normalized,
    canvasHeightDesktop: 560,
    canvasHeightMobile: 440,
  }
}

export default function AdminProjectDetailEditorPage({ params }: PageProps) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [project, setProject] = useState<EditableProject | null>(null)
  const [layoutValue, setLayoutValue] = useState<string>(JSON.stringify(normalizeGalleryLayout(null)))

  const pageKey = useMemo(() => (project ? `project:${project.slug}` : ''), [project])
  const sectionKey = 'detail_gallery'

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)
      setLoadError(null)

      try {
        const response = await fetch(`/api/admin/projects/${id}`, { cache: 'no-store' })
        if (!response.ok) {
          const raw = await response.text().catch(() => '')
          throw new Error(raw || 'Nao foi possivel carregar o projeto.')
        }

        const data = (await response.json()) as AdminProjectResponse
        if (!active) return

        const nextProject: EditableProject = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          subtitle: data.subtitle ?? '',
          location: data.location,
          category: data.category,
          status: data.status,
          description: data.description ?? '',
          coverImage: data.coverImage,
          year: data.year ?? '',
          client: data.client ?? '',
          credits: data.credits ?? '',
          featured: data.featured,
          order: data.order,
        }

        setProject(nextProject)

        const fallbackLayout = buildLayoutFromProjectImages(data.images)

        const layoutResponse = await fetch(
          `/api/admin/page-layout?pageKey=${encodeURIComponent(`project:${nextProject.slug}`)}&sectionKey=${encodeURIComponent(sectionKey)}`,
          { cache: 'no-store' }
        )

        if (!active) return

        if (layoutResponse.ok) {
          const layoutData = (await layoutResponse.json()) as { draft?: unknown; exists?: boolean }
          const draftLayout = normalizeGalleryLayout(layoutData.draft)
          const useFallbackImages =
            fallbackLayout.items.length > 0 &&
            (layoutData.exists === false || draftLayout.items.length === 0)
          setLayoutValue(JSON.stringify(useFallbackImages ? fallbackLayout : draftLayout))
        } else {
          setLayoutValue(JSON.stringify(fallbackLayout))
        }
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar projeto.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadData()
    return () => {
      active = false
    }
  }, [id])

  const persistProject = async () => {
    if (!project) return

    const response = await fetch(`/api/admin/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    })
    if (!response.ok) {
      const rawText = await response.text().catch(() => '')
      let parsedError: string | null = null
      try {
        const parsed = JSON.parse(rawText) as { error?: string }
        parsedError = parsed?.error || null
      } catch {
        parsedError = null
      }

      throw new Error(parsedError || 'Nao foi possivel guardar dados do projeto.')
    }
  }

  const persistLayoutDraft = async () => {
    if (!pageKey) return

    let parsedLayout: unknown = null
    try {
      parsedLayout = JSON.parse(layoutValue || '{}')
    } catch {
      parsedLayout = null
    }

    const response = await fetch('/api/admin/page-layout', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageKey,
        sectionKey,
        draft: parsedLayout,
      }),
    })

    if (!response.ok) {
      throw new Error('Nao foi possivel guardar layout da galeria.')
    }
  }

  const onSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await persistProject()
      await persistLayoutDraft()
      setMessage('Rascunho guardado com sucesso.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao guardar rascunho.')
    } finally {
      setSaving(false)
    }
  }

  const onPublish = async () => {
    if (!pageKey) return

    setPublishing(true)
    setMessage(null)
    try {
      await persistProject()
      await persistLayoutDraft()
      const response = await fetch('/api/admin/page-layout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pageKey,
          sectionKey,
          action: 'publish',
        }),
      })
      if (!response.ok) {
        throw new Error('Nao foi possivel publicar galeria.')
      }
      setMessage('Projeto e galeria publicados com sucesso.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao publicar.')
    } finally {
      setPublishing(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-stone-500">
        <Loader2 size={18} className="animate-spin" />
        Carregando projeto...
      </div>
    )
  }

  if (loadError || !project) {
    return (
      <div className="space-y-4">
        <Link href="/admin/projects" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900">
          <ArrowLeft size={14} />
          Voltar para Projects
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError || 'Projeto nao encontrado.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Link href="/admin/projects" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900">
            <ArrowLeft size={14} />
            Voltar para Projects
          </Link>
          <h1 className="font-cormorant text-3xl text-stone-900 dark:text-white">Editar Projeto</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href={`/projects/${project.slug}`} target="_blank" rel="noopener noreferrer">
              <Eye size={16} />
              Ver pagina
            </a>
          </Button>
          <Button onClick={onSave} disabled={saving || publishing}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Guardar
          </Button>
          <Button onClick={onPublish} disabled={saving || publishing}>
            {publishing ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            Publicar
          </Button>
        </div>
      </div>

      {message && (
        <div className="rounded-lg border border-stone-200 px-4 py-3 text-sm text-stone-700 dark:border-stone-700 dark:text-stone-300">
          {message}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <ProjectTextField
          label="Titulo"
          value={project.title}
          onChange={(value) => setProject((prev) => (prev ? { ...prev, title: value } : prev))}
          helper="Título principal do projeto."
        />
        <Field label="Slug" value={project.slug} onChange={(value) => setProject((prev) => prev ? { ...prev, slug: value } : prev)} />
        <ProjectTextField
          label="Subtitulo"
          value={project.subtitle}
          onChange={(value) => setProject((prev) => (prev ? { ...prev, subtitle: value } : prev))}
          helper="Aceita negrito, itálico, maiúsculas/minúsculas e ajuste de fonte."
        />
        <Field label="Location" value={project.location} onChange={(value) => setProject((prev) => prev ? { ...prev, location: value } : prev)} />
        <Field label="Cover image" value={project.coverImage} onChange={(value) => setProject((prev) => prev ? { ...prev, coverImage: value } : prev)} />
        <Field label="Year" value={project.year} onChange={(value) => setProject((prev) => prev ? { ...prev, year: value } : prev)} />
        <ProjectTextField
          label="Client"
          value={project.client}
          onChange={(value) => setProject((prev) => (prev ? { ...prev, client: value } : prev))}
          helper="Útil para nomes, parceiros e créditos curtos."
        />
        <ProjectTextField
          label="Credits"
          value={project.credits}
          onChange={(value) => setProject((prev) => (prev ? { ...prev, credits: value } : prev))}
          helper="Pode receber formatação leve."
        />
        <div className="space-y-2">
          <Label>Status</Label>
          <select
            className="h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 text-sm dark:border-stone-700"
            value={project.status}
            onChange={(event) =>
              setProject((prev) => (prev ? { ...prev, status: event.target.value as EditableProject['status'] } : prev))
            }
          >
            {['DRAFT', 'PUBLISHED', 'WORK_IN_PROGRESS', 'COMING_SOON'].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Categoria</Label>
          <select
            className="h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 text-sm dark:border-stone-700"
            value={project.category}
            onChange={(event) =>
              setProject((prev) => (prev ? { ...prev, category: event.target.value as EditableProject['category'] } : prev))
            }
          >
            {['RESIDENTIAL', 'COMMERCIAL', 'HOSPITALITY', 'RETAIL'].map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <ProjectTextField
        label="Descricao"
        value={project.description}
        onChange={(value) => setProject((prev) => (prev ? { ...prev, description: value } : prev))}
        multiline
        helper="Aqui a formatação ajuda muito na apresentação do projeto."
      />

      <div className="space-y-2">
        <h2 className="font-inter text-sm font-semibold uppercase tracking-wide text-stone-500">
          Galeria responsiva do detalhe
        </h2>
        <GalleryLayoutField id="project-detail-gallery" value={layoutValue} onChange={setLayoutValue} />
      </div>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
