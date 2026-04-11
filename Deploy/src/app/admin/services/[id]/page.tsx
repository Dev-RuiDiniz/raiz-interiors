'use client'

import { use, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Loader2, Save } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { GalleryLayoutField } from '@/components/admin/gallery-layout-field'
import { normalizeGalleryLayout } from '@/lib/cms/layout-types'

interface PageProps {
  params: Promise<{ id: string }>
}

type EditableService = {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  coverImage: string
  order: number
  active: boolean
  status: 'DRAFT' | 'PUBLISHED' | 'COMING_SOON' | 'WORK_IN_PROGRESS'
}

type AdminServiceResponse = {
  id: string
  slug: string
  title: string
  subtitle: string | null
  description: string | null
  coverImage: string | null
  order: number
  active: boolean
  status: EditableService['status']
}

export default function AdminServiceDetailEditorPage({ params }: PageProps) {
  const { id } = use(params)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [service, setService] = useState<EditableService | null>(null)
  const [layoutValue, setLayoutValue] = useState<string>(JSON.stringify(normalizeGalleryLayout(null)))

  const pageKey = useMemo(() => (service ? `service:${service.slug}` : ''), [service])
  const sectionKey = 'detail_gallery'

  useEffect(() => {
    let active = true

    async function loadData() {
      setLoading(true)
      setLoadError(null)
      try {
        const response = await fetch(`/api/admin/services/${id}`, { cache: 'no-store' })
        if (!response.ok) {
          const raw = await response.text().catch(() => '')
          throw new Error(raw || 'Nao foi possivel carregar o servico.')
        }

        const data = (await response.json()) as AdminServiceResponse
        if (!active) return

        const nextService: EditableService = {
          id: data.id,
          slug: data.slug,
          title: data.title,
          subtitle: data.subtitle ?? '',
          description: data.description ?? '',
          coverImage: data.coverImage ?? '',
          order: data.order ?? 0,
          active: !!data.active,
          status: data.status || 'DRAFT',
        }

        setService(nextService)

        const layoutResponse = await fetch(
          `/api/admin/page-layout?pageKey=${encodeURIComponent(`service:${nextService.slug}`)}&sectionKey=${encodeURIComponent(sectionKey)}`,
          { cache: 'no-store' }
        )

        if (!active) return

        if (layoutResponse.ok) {
          const layoutData = (await layoutResponse.json()) as { draft?: unknown }
          setLayoutValue(JSON.stringify(normalizeGalleryLayout(layoutData.draft)))
        } else {
          setLayoutValue(JSON.stringify(normalizeGalleryLayout(null)))
        }
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar servico.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadData()
    return () => {
      active = false
    }
  }, [id])

  const persistService = async () => {
    if (!service) return

    const response = await fetch(`/api/admin/services/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...service,
        features: [],
      }),
    })
    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      throw new Error(data?.error || 'Nao foi possivel guardar dados do servico.')
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
      await persistService()
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
      await persistService()
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
      setMessage('Servico e galeria publicados com sucesso.')
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
        Carregando servico...
      </div>
    )
  }

  if (loadError || !service) {
    return (
      <div className="space-y-4">
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900">
          <ArrowLeft size={14} />
          Voltar para Services
        </Link>
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError || 'Servico nao encontrado.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <Link href="/admin/services" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900">
            <ArrowLeft size={14} />
            Voltar para Services
          </Link>
          <h1 className="font-cormorant text-3xl text-stone-900 dark:text-white">Editar Servico</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href={`/services/${service.slug}`} target="_blank" rel="noopener noreferrer">
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
        <Field label="Titulo" value={service.title} onChange={(value) => setService((prev) => (prev ? { ...prev, title: value } : prev))} />
        <Field label="Slug" value={service.slug} onChange={(value) => setService((prev) => (prev ? { ...prev, slug: value } : prev))} />
        <Field label="Subtitulo" value={service.subtitle} onChange={(value) => setService((prev) => (prev ? { ...prev, subtitle: value } : prev))} />
        <Field label="Cover image" value={service.coverImage} onChange={(value) => setService((prev) => (prev ? { ...prev, coverImage: value } : prev))} />
      </div>

      <div className="space-y-2">
        <Label>Descricao</Label>
        <Textarea
          rows={6}
          value={service.description}
          onChange={(event) => setService((prev) => (prev ? { ...prev, description: event.target.value } : prev))}
        />
      </div>

      <div className="space-y-2">
        <h2 className="font-inter text-sm font-semibold uppercase tracking-wide text-stone-500">
          Galeria responsiva do detalhe
        </h2>
        <GalleryLayoutField id="service-detail-gallery" value={layoutValue} onChange={setLayoutValue} />
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
