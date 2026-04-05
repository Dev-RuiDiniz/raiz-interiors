'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { GalleryLayoutField } from '@/components/admin/gallery-layout-field'
import { createDefaultBox, normalizeGalleryLayout, type GalleryLayout } from '@/lib/cms/layout-types'

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
        <Field label="Titulo" value={project.title} onChange={(value) => setProject((prev) => prev ? { ...prev, title: value } : prev)} />
        <Field label="Slug" value={project.slug} onChange={(value) => setProject((prev) => prev ? { ...prev, slug: value } : prev)} />
        <Field label="Subtitulo" value={project.subtitle} onChange={(value) => setProject((prev) => prev ? { ...prev, subtitle: value } : prev)} />
        <Field label="Location" value={project.location} onChange={(value) => setProject((prev) => prev ? { ...prev, location: value } : prev)} />
        <Field label="Cover image" value={project.coverImage} onChange={(value) => setProject((prev) => prev ? { ...prev, coverImage: value } : prev)} />
        <Field label="Year" value={project.year} onChange={(value) => setProject((prev) => prev ? { ...prev, year: value } : prev)} />
        <Field label="Client" value={project.client} onChange={(value) => setProject((prev) => prev ? { ...prev, client: value } : prev)} />
        <Field label="Credits" value={project.credits} onChange={(value) => setProject((prev) => prev ? { ...prev, credits: value } : prev)} />
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

      <div className="space-y-2">
        <Label>Descricao</Label>
        <Textarea
          rows={6}
          value={project.description}
          onChange={(event) => setProject((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
        />
      </div>

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
