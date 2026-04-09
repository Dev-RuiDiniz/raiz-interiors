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

function ServiceTextField({
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
    onChange(wrapSelection(value, el.selectionStart ?? 0, el.selectionEnd ?? 0, before, after))
  }

  const applyTransform = (mode: 'upper' | 'lower') => {
    const el = inputRef.current
    if (!el) return
    onChange(transformSelection(value, el.selectionStart ?? 0, el.selectionEnd ?? 0, mode))
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
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
        <ServiceTextField
          label="Titulo"
          value={service.title}
          onChange={(value) => setService((prev) => (prev ? { ...prev, title: value } : prev))}
          helper="Título principal do serviço."
        />
        <Field label="Slug" value={service.slug} onChange={(value) => setService((prev) => (prev ? { ...prev, slug: value } : prev))} />
        <ServiceTextField
          label="Subtitulo"
          value={service.subtitle}
          onChange={(value) => setService((prev) => (prev ? { ...prev, subtitle: value } : prev))}
          helper="Pode usar formatação tipográfica leve."
        />
        <Field label="Cover image" value={service.coverImage} onChange={(value) => setService((prev) => (prev ? { ...prev, coverImage: value } : prev))} />
      </div>

      <ServiceTextField
        label="Descricao"
        value={service.description}
        onChange={(value) => setService((prev) => (prev ? { ...prev, description: value } : prev))}
        multiline
        helper="Texto de apresentação do serviço, com suporte a formatação."
      />

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
