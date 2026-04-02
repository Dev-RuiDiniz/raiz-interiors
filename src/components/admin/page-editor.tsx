'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Eye, Loader2, RefreshCw, Save, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { GalleryLayoutField } from '@/components/admin/gallery-layout-field'
import { adminPageEditorConfigs } from '@/lib/admin-page-configs'
import type { AdminPageEditorConfig } from '@/lib/admin-page-configs'

interface PageEditorProps {
  pageId: AdminPageEditorConfig['pageId']
}

export function PageEditor({ pageId }: PageEditorProps) {
  const config = adminPageEditorConfigs[pageId]
  const allFields = useMemo(() => config.sections.flatMap((section) => section.fields), [config.sections])
  const galleryFields = useMemo(
    () => allFields.filter((field) => field.type === 'gallery_layout' && field.pageKey && field.sectionKey),
    [allFields]
  )
  const regularFields = useMemo(() => allFields.filter((field) => field.type !== 'gallery_layout'), [allFields])

  const initialValues = useMemo(
    () =>
      allFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = field.defaultValue || ''
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
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [previewNonce, setPreviewNonce] = useState(0)
  const [previewLoading, setPreviewLoading] = useState(true)

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
          const response = await fetch(`/api/admin/page-settings?pageId=${pageId}`, {
            method: 'GET',
            cache: 'no-store',
          })
          if (!response.ok) {
            throw new Error('Failed to load saved settings')
          }

          const data = (await response.json()) as {
            values?: Record<string, string>
            updatedAt?: string | null
            publishedAt?: string | null
          }
          const persisted = data.values || {}
          Object.assign(nextValues, persisted)
          if (data.updatedAt) {
            setLastSaved(new Date(data.updatedAt).toLocaleString('pt-PT'))
          }
          if (data.publishedAt) {
            setLastPublished(new Date(data.publishedAt).toLocaleString('pt-PT'))
          }
        }

        for (const field of galleryFields) {
          const response = await fetch(
            `/api/admin/page-layout?pageKey=${encodeURIComponent(field.pageKey!)}&sectionKey=${encodeURIComponent(field.sectionKey!)}`,
            {
              method: 'GET',
              cache: 'no-store',
            }
          )

          if (!response.ok) {
            continue
          }

          const data = (await response.json()) as {
            draft?: unknown
            updatedAt?: string | null
            publishedAt?: string | null
          }

          if (data.draft) {
            nextValues[field.id] = JSON.stringify(data.draft)
          } else {
            nextValues[field.id] = field.defaultValue || ''
          }
          if (data.updatedAt) {
            setLastSaved(new Date(data.updatedAt).toLocaleString('pt-PT'))
          }
          if (data.publishedAt) {
            setLastPublished(new Date(data.publishedAt).toLocaleString('pt-PT'))
          }
        }

        if (!active) return
        setValues(nextValues)
      } catch {
        if (!active) return
        setValues(initialValues)
      } finally {
        if (active) {
          setLoadingSettings(false)
        }
      }
    }

    loadSavedValues()

    return () => {
      active = false
    }
  }, [galleryFields, initialValues, pageId, regularFields.length])

  useEffect(() => {
    setPreviewLoading(true)
  }, [previewSrc])

  const onFieldChange = (id: string, value: string) => {
    setValues((previous) => ({ ...previous, [id]: value }))
  }

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
      if (!response.ok || !result.url) {
        throw new Error(result.error || 'Upload failed')
      }

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
          body: JSON.stringify({ pageId, values: regularValues }),
        })
        if (!response.ok) {
          throw new Error('Não foi possível guardar o rascunho.')
        }
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

        if (!response.ok) {
          throw new Error(`Não foi possível guardar layout da seção ${field.label}.`)
        }
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
          body: JSON.stringify({ pageId, action: 'publish' }),
        })
        const data = (await response.json()) as { publishedAt?: string; error?: string }

        if (!response.ok) {
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
        const data = (await response.json()) as { error?: string }
        if (!response.ok) {
          throw new Error(data.error || `Não foi possível publicar layout da seção ${field.label}.`)
        }
      }

      const publishedAt = new Date().toLocaleString('pt-PT')
      setLastPublished(publishedAt)
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
              <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
                Editar {config.title}
              </h1>
              <p className="font-inter text-sm text-stone-500 dark:text-stone-400">{config.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="font-inter text-xs">
            Draft
          </Badge>
          {lastPublished && (
            <Badge className="font-inter text-xs bg-emerald-600 hover:bg-emerald-600 text-white">
              Published
            </Badge>
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
            <div className="flex rounded-md border border-stone-200 dark:border-stone-700 overflow-hidden">
              <button
                type="button"
                onClick={() => setPreviewViewport('desktop')}
                className={`h-9 px-3 text-xs font-inter ${
                  previewViewport === 'desktop'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-transparent text-stone-600 dark:text-stone-300'
                }`}
              >
                Desktop
              </button>
              <button
                type="button"
                onClick={() => setPreviewViewport('mobile')}
                className={`h-9 px-3 text-xs font-inter ${
                  previewViewport === 'mobile'
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-transparent text-stone-600 dark:text-stone-300'
                }`}
              >
                Mobile
              </button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPreviewNonce((current) => current + 1)}
            >
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
          <div
            className={`relative rounded-lg border border-stone-200 dark:border-stone-700 overflow-hidden bg-stone-50 dark:bg-stone-950 ${
              previewViewport === 'mobile' ? 'mx-auto max-w-[420px]' : ''
            }`}
            style={{ height: previewViewport === 'mobile' ? '740px' : '78vh' }}
          >
            {previewLoading && (
              <div className="absolute inset-0 z-10 bg-white/80 dark:bg-stone-900/80 flex items-center justify-center">
                <p className="font-inter text-xs text-stone-500 flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Carregando preview...
                </p>
              </div>
            )}
            <iframe
              key={`${previewViewport}-${previewNonce}`}
              src={previewSrc}
              title={`Pré-visualização ${config.title}`}
              className="h-full w-full"
              onLoad={() => setPreviewLoading(false)}
            />
          </div>
        </div>
      </section>

      <div className="grid gap-4">
        {config.sections.map((section, sectionIndex) => (
          <motion.section
            key={section.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: sectionIndex * 0.05 }}
            className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl"
          >
            <header className="px-5 py-4 border-b border-stone-200 dark:border-stone-800">
              <h2 className="font-inter text-sm font-medium text-stone-900 dark:text-white">{section.title}</h2>
              <p className="font-inter text-xs text-stone-500 dark:text-stone-400 mt-1">{section.helperText}</p>
            </header>

            <div className="p-5 grid gap-4 md:grid-cols-2">
              {section.fields.map((field) => (
                <div
                  key={field.id}
                  className={
                    field.type === 'textarea' || field.type === 'image' || field.type === 'gallery_layout'
                      ? 'md:col-span-2 space-y-2'
                      : 'space-y-2'
                  }
                >
                  <Label htmlFor={field.id} className="font-inter text-xs uppercase tracking-wide text-stone-500">
                    {field.label}
                  </Label>
                  {field.type === 'textarea' && (
                    <Textarea
                      id={field.id}
                      value={values[field.id] || ''}
                      placeholder={field.placeholder}
                      rows={6}
                      onChange={(event) => onFieldChange(field.id, event.target.value)}
                    />
                  )}
                  {(field.type === 'text' || field.type === 'url') && (
                    <Input
                      id={field.id}
                      type={field.type === 'url' ? 'url' : 'text'}
                      value={values[field.id] || ''}
                      placeholder={field.placeholder}
                      onChange={(event) => onFieldChange(field.id, event.target.value)}
                    />
                  )}
                  {field.type === 'color' && (
                    <div className="flex items-center gap-3">
                      <Input
                        id={field.id}
                        type="color"
                        value={values[field.id] || '#000000'}
                        className="w-16 h-10 p-1 cursor-pointer"
                        onChange={(event) => onFieldChange(field.id, event.target.value)}
                      />
                      <Input
                        type="text"
                        value={values[field.id] || ''}
                        placeholder="#000000"
                        onChange={(event) => onFieldChange(field.id, event.target.value)}
                      />
                    </div>
                  )}
                  {field.type === 'image' && (
                    <div className="space-y-3">
                      <Input
                        id={field.id}
                        type="text"
                        value={values[field.id] || ''}
                        placeholder="/uploads/admin/... ou https://..."
                        onChange={(event) => onFieldChange(field.id, event.target.value)}
                      />
                      <div className="flex flex-wrap items-center gap-3">
                        <Label
                          htmlFor={`upload-${field.id}`}
                          className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                        >
                          {uploadingFieldId === field.id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Upload size={14} />
                          )}
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
                        <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                          JPG, PNG, WEBP ou GIF at 10MB
                        </p>
                      </div>
                      {values[field.id] && (
                        <div className="relative h-44 w-full overflow-hidden rounded-lg border border-stone-200 dark:border-stone-700 bg-stone-100 dark:bg-stone-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={values[field.id]}
                            alt={`${field.label} preview`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {field.type === 'gallery_layout' && (
                    <GalleryLayoutField
                      id={field.id}
                      value={values[field.id] || ''}
                      onChange={(nextValue) => onFieldChange(field.id, nextValue)}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  )
}
