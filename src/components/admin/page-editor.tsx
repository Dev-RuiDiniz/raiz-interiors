'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Bold, CaseLower, CaseSensitive, CaseUpper, CheckCircle2, Eye, Italic, Loader2, RefreshCw, Save, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { GalleryLayoutField } from '@/components/admin/gallery-layout-field'
import { DictionaryEditor } from '@/components/admin/dictionary-editor'
import { adminPageEditorConfigs } from '@/lib/admin-page-configs'
import type { AdminPageEditorConfig } from '@/lib/admin-page-configs'
import enDictionary from '@/i18n/dictionaries/en.json'
import ptDictionary from '@/i18n/dictionaries/pt.json'
import { createDictionaryDiff, deepMergeDictionary, type JsonValue } from '@/lib/cms/dictionary-utils'

interface PageEditorProps {
  pageId: AdminPageEditorConfig['pageId']
}

type Locale = 'en' | 'pt'
const localeOptions: Array<{ id: Locale; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
]

function getDictionaryScope(pageId: AdminPageEditorConfig['pageId']) {
  if (pageId === 'home') return ['home']
  if (pageId === 'projects') return ['projects']
  if (pageId === 'services') return ['services']
  if (pageId === 'about') return ['about']
  if (pageId === 'contact') return ['contact']
  return ['legal', 'privacy']
}

function getNestedValue(root: unknown, path: string[]) {
  return path.reduce<unknown>((current, segment) => {
    if (!current || typeof current !== 'object' || Array.isArray(current)) return undefined
    return (current as Record<string, unknown>)[segment]
  }, root)
}

function setNestedValue(root: Record<string, unknown>, path: string[], nextValue: JsonValue): Record<string, unknown> {
  if (!path.length) return root
  const [head, ...tail] = path
  if (!tail.length) {
    return { ...root, [head]: nextValue }
  }
  const current = root[head]
  return {
    ...root,
    [head]:
      current && typeof current === 'object' && !Array.isArray(current)
        ? setNestedValue(current as Record<string, unknown>, tail, nextValue)
        : setNestedValue({}, tail, nextValue),
  }
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

function RichTextField({
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
                <DialogTitle className="font-cormorant text-3xl text-stone-900 dark:text-white">{label}</DialogTitle>
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
                <p className="font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">Preview</p>
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

export function PageEditor({ pageId }: PageEditorProps) {
  const config = adminPageEditorConfigs[pageId]
  const dictionaryScope = useMemo(() => getDictionaryScope(pageId), [pageId])
  const allFields = useMemo(() => config.sections.flatMap((section) => section.fields), [config.sections])
  const galleryFields = useMemo(
    () => allFields.filter((field) => field.type === 'gallery_layout' && field.pageKey && field.sectionKey),
    [allFields]
  )
  const regularFields = useMemo(() => allFields.filter((field) => field.type !== 'gallery_layout'), [allFields])

  const initialValues = useMemo(
    () =>
      allFields.reduce<Record<string, string>>((acc, field) => {
        acc[field.id] = field.type === 'gallery_layout' ? field.defaultValue || '' : ''
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
  const [locale, setLocale] = useState<Locale>('en')
  const [dictionaryDraft, setDictionaryDraft] = useState<Record<string, unknown> | null>(null)
  const [dictionaryLoading, setDictionaryLoading] = useState(true)
  const [dictionarySaving, setDictionarySaving] = useState(false)
  const [dictionaryMessage, setDictionaryMessage] = useState<string | null>(null)
  const [dictionaryMessageType, setDictionaryMessageType] = useState<'success' | 'error'>('success')

  const previewSrc = useMemo(() => {
    const separator = config.publicPath.includes('?') ? '&' : '?'
    return `${config.publicPath}${separator}preview_ts=${previewNonce}`
  }, [config.publicPath, previewNonce])

  const baseDictionary = useMemo(
    () => (locale === 'en' ? (enDictionary as Record<string, unknown>) : (ptDictionary as Record<string, unknown>)),
    [locale]
  )

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
    let active = true

    async function loadDictionary() {
      setDictionaryLoading(true)
      setDictionaryMessage(null)
      try {
        const response = await fetch(`/api/admin/content-dictionary?locale=${locale}`, {
          cache: 'no-store',
        })
        const data = (await response.json()) as { draft?: Record<string, unknown>; error?: string }
        if (!response.ok) {
          throw new Error(data.error || 'Falha ao carregar textos.')
        }
        if (!active) return
        const merged = deepMergeDictionary(baseDictionary, data.draft || {})
        setDictionaryDraft(merged as Record<string, unknown>)
      } catch (error) {
        if (!active) return
        setDictionaryDraft(baseDictionary)
        setDictionaryMessageType('error')
        setDictionaryMessage(error instanceof Error ? error.message : 'Falha ao carregar textos.')
      } finally {
        if (active) setDictionaryLoading(false)
      }
    }

    void loadDictionary()
    return () => {
      active = false
    }
  }, [baseDictionary, locale])

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

  const dictionarySlice = useMemo(() => {
    if (!dictionaryDraft) return null
    return getNestedValue(dictionaryDraft, dictionaryScope)
  }, [dictionaryDraft, dictionaryScope])

  const onDictionaryChange = (nextValue: JsonValue) => {
    setDictionaryDraft((current) => {
      if (!current) return current
      return setNestedValue(current, dictionaryScope, nextValue)
    })
  }

  const persistDictionaryDraft = async () => {
    if (!dictionaryDraft) return
    const diff = createDictionaryDiff(baseDictionary, dictionaryDraft)
    const override = (diff ?? {}) as Record<string, unknown>

    const response = await fetch('/api/admin/content-dictionary', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, draft: override }),
    })
    const data = (await response.json()) as { error?: string }
    if (!response.ok) {
      throw new Error(data.error || 'Não foi possível guardar textos da página.')
    }
  }

  const persistDraft = async () => {
    try {
      await persistDictionaryDraft()
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
      await persistDictionaryDraft()
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

  const saveDictionaryOnly = async () => {
    setDictionarySaving(true)
    setDictionaryMessage(null)
    try {
      await persistDictionaryDraft()
      setDictionaryMessageType('success')
      setDictionaryMessage('Textos guardados com sucesso.')
    } catch (error) {
      setDictionaryMessageType('error')
      setDictionaryMessage(error instanceof Error ? error.message : 'Falha ao guardar textos.')
    } finally {
      setDictionarySaving(false)
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

      <section className="space-y-4 rounded-xl border border-stone-200 bg-white p-5 dark:border-stone-800 dark:bg-stone-900">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-cormorant text-2xl text-stone-900 dark:text-white">Textos do Site</h2>
            <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
              Texto publicado desta página, incluindo slides, títulos e blocos editoriais.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {localeOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setLocale(option.id)}
                className={`h-10 rounded-full px-4 text-xs font-inter uppercase tracking-[0.2em] ${
                  locale === option.id
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                    : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                }`}
              >
                {option.label}
              </button>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={saveDictionaryOnly}
              disabled={dictionaryLoading || dictionarySaving}
            >
              {dictionarySaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Guardar textos
            </Button>
          </div>
        </div>

        {dictionaryMessage && (
          <div
            className={
              dictionaryMessageType === 'success'
                ? 'rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-300'
                : 'rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300'
            }
          >
            {dictionaryMessage}
          </div>
        )}

        {dictionaryLoading ? (
          <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
            <Loader2 size={16} className="animate-spin" />
            Carregando textos...
          </div>
        ) : dictionarySlice ? (
          <DictionaryEditor value={dictionarySlice as JsonValue} onChange={onDictionaryChange} />
        ) : (
          <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-500 dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-400">
            Nenhum texto encontrado para esta página.
          </div>
        )}
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
                    <RichTextField
                      label={field.label}
                      value={values[field.id] || ''}
                      helper={field.placeholder}
                      multiline
                      onChange={(nextValue) => onFieldChange(field.id, nextValue)}
                    />
                  )}
                  {(field.type === 'text' || field.type === 'url') && (
                    <RichTextField
                      label={field.label}
                      value={values[field.id] || ''}
                      helper={field.placeholder}
                      onChange={(nextValue) => onFieldChange(field.id, nextValue)}
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
