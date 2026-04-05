'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Eye, Loader2, Save, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import enDictionary from '@/i18n/dictionaries/en.json'
import ptDictionary from '@/i18n/dictionaries/pt.json'
import { DictionaryEditor } from '@/components/admin/dictionary-editor'
import {
  createDictionaryDiff,
  deepMergeDictionary,
  type JsonValue,
} from '@/lib/cms/dictionary-utils'

type Locale = 'en' | 'pt'
type EditorMode = 'visual' | 'json'

type DictionaryResponse = {
  locale: Locale
  draft: Record<string, unknown>
  published: Record<string, unknown>
  updatedAt: string | null
  publishedAt: string | null
}

const localeOptions: Array<{ id: Locale; label: string }> = [
  { id: 'en', label: 'English' },
  { id: 'pt', label: 'Português' },
]

const editorModeOptions: Array<{ id: EditorMode; label: string; description: string }> = [
  { id: 'visual', label: 'Editor visual', description: 'Blocos e campos, sem JSON cru.' },
  { id: 'json', label: 'JSON avançado', description: 'Acesso direto ao objeto completo.' },
]

export default function AdminContentDictionaryPage() {
  const [locale, setLocale] = useState<Locale>('en')
  const [mode, setMode] = useState<EditorMode>('visual')
  const [draftValue, setDraftValue] = useState<JsonValue>({})
  const [rawJson, setRawJson] = useState('{}')
  const [jsonError, setJsonError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [publishedAt, setPublishedAt] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  const baseDictionary = useMemo(
    () => (locale === 'en' ? (enDictionary as JsonValue) : (ptDictionary as JsonValue)),
    [locale]
  )

  const previewPath = useMemo(() => `/${locale}`, [locale])

  useEffect(() => {
    let active = true

    async function loadDictionary() {
      setLoading(true)
      setMessage(null)
      try {
        const response = await fetch(`/api/admin/content-dictionary?locale=${locale}`, {
          method: 'GET',
          cache: 'no-store',
        })
        const data = (await response.json()) as DictionaryResponse & { error?: string }
        if (!response.ok) {
          throw new Error(data.error || 'Failed to load content dictionary.')
        }

        if (!active) return

        const mergedDraft = deepMergeDictionary(baseDictionary, data.draft || {})
        setDraftValue(mergedDraft as JsonValue)
        setRawJson(JSON.stringify(mergedDraft, null, 2))
        setJsonError(null)
        setUpdatedAt(data.updatedAt)
        setPublishedAt(data.publishedAt)
      } catch (error) {
        if (!active) return
        setDraftValue(baseDictionary)
        setRawJson(JSON.stringify(baseDictionary, null, 2))
        setJsonError(null)
        setMessageType('error')
        setMessage(error instanceof Error ? error.message : 'Falha ao carregar conteúdo.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadDictionary()
    return () => {
      active = false
    }
  }, [baseDictionary, locale])

  const onVisualChange = (nextValue: JsonValue) => {
    setDraftValue(nextValue)
    setRawJson(JSON.stringify(nextValue, null, 2))
    setJsonError(null)
  }

  const onRawJsonChange = (nextRaw: string) => {
    setRawJson(nextRaw)
    try {
      const parsed = JSON.parse(nextRaw)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('JSON deve ter um objeto na raiz.')
      }

      setDraftValue(parsed as JsonValue)
      setJsonError(null)
    } catch (error) {
      setJsonError(error instanceof Error ? error.message : 'JSON inválido.')
    }
  }

  const onFormatJson = () => {
    try {
      const parsed = JSON.parse(rawJson)
      if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
        throw new Error('JSON deve ter um objeto na raiz.')
      }

      const formatted = JSON.stringify(parsed, null, 2)
      setRawJson(formatted)
      setDraftValue(parsed as JsonValue)
      setJsonError(null)
      setMessageType('success')
      setMessage('JSON formatado com sucesso.')
    } catch (error) {
      setMessageType('error')
      setMessage(error instanceof Error ? error.message : 'JSON inválido.')
    }
  }

  const persistDraft = async () => {
    const nextDraft =
      mode === 'json'
        ? (() => {
            const parsed = JSON.parse(rawJson)
            if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
              throw new Error('JSON deve ter um objeto na raiz.')
            }
            return parsed as JsonValue
          })()
        : draftValue

    const diff = createDictionaryDiff(baseDictionary, nextDraft)
    const override = (diff ?? {}) as Record<string, unknown>

    const response = await fetch('/api/admin/content-dictionary', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ locale, draft: override }),
    })

    const data = (await response.json()) as { updatedAt?: string; error?: string }
    if (!response.ok) {
      throw new Error(data.error || 'Não foi possível guardar rascunho.')
    }

    setDraftValue(nextDraft)
    setRawJson(JSON.stringify(nextDraft, null, 2))
    setUpdatedAt(data.updatedAt || new Date().toISOString())
  }

  const saveDraft = async () => {
    setSaving(true)
    setMessage(null)
    try {
      await persistDraft()
      setMessageType('success')
      setMessage('Rascunho guardado com sucesso.')
    } catch (error) {
      setMessageType('error')
      setMessage(error instanceof Error ? error.message : 'Falha ao guardar rascunho.')
    } finally {
      setSaving(false)
    }
  }

  const onPublish = async () => {
    setPublishing(true)
    setMessage(null)

    try {
      await persistDraft()
      const response = await fetch('/api/admin/content-dictionary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale, action: 'publish' }),
      })
      const data = (await response.json()) as { publishedAt?: string; error?: string }
      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível publicar conteúdo.')
      }

      setPublishedAt(data.publishedAt || new Date().toISOString())
      setMessageType('success')
      setMessage('Conteúdo publicado com sucesso.')
    } catch (error) {
      setMessageType('error')
      setMessage(error instanceof Error ? error.message : 'Falha ao publicar conteúdo.')
    } finally {
      setPublishing(false)
    }
  }

  const draftSize = useMemo(() => JSON.stringify(draftValue).length, [draftValue])

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-stone-200 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.96),rgba(243,238,232,0.92))] p-5 shadow-[0_24px_80px_-40px_rgba(28,25,23,0.25)] dark:border-stone-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(32,29,26,0.98),rgba(15,12,10,0.98))]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="font-cormorant text-3xl lg:text-4xl font-light text-stone-900 dark:text-white">
              Content Dictionary
            </h1>
            <p className="mt-2 max-w-3xl font-inter text-sm text-stone-500 dark:text-stone-400">
              Edite os textos do site em português e inglês sem lidar com JSON cru no dia a dia.
              O painel salva apenas as diferenças em relação ao texto base do site.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-inter text-xs">
              Draft
            </Badge>
            {publishedAt && (
              <Badge className="font-inter text-xs bg-emerald-600 hover:bg-emerald-600 text-white">
                Published
              </Badge>
            )}
            <Button variant="outline" asChild>
              <a href={previewPath} target="_blank" rel="noopener noreferrer">
                <Eye size={16} />
                Ver site ({locale.toUpperCase()})
              </a>
            </Button>
            <Button onClick={saveDraft} disabled={loading || saving || publishing}>
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              Guardar rascunho
            </Button>
            <Button onClick={onPublish} disabled={loading || saving || publishing}>
              {publishing ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
              Publicar
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                {localeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setLocale(option.id)}
                    className={`h-10 px-4 rounded-full text-xs font-inter tracking-[0.2em] uppercase transition-colors ${
                      locale === option.id
                        ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                {editorModeOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setMode(option.id)}
                    className={`rounded-xl border px-3 py-2 text-left transition-colors ${
                      mode === option.id
                        ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300 dark:hover:bg-stone-900'
                    }`}
                  >
                    <div className="font-inter text-xs font-medium">{option.label}</div>
                    <div className="mt-0.5 max-w-[220px] font-inter text-[11px] opacity-75">
                      {option.description}
                    </div>
                  </button>
                ))}
              </div>

              <Button variant="outline" size="sm" onClick={onFormatJson} disabled={loading || saving || publishing}>
                <SlidersHorizontal size={16} />
                Formatar JSON
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-20 text-stone-500 dark:text-stone-400">
                <Loader2 size={18} className="animate-spin" />
                Carregando conteúdo...
              </div>
            ) : mode === 'visual' ? (
              <DictionaryEditor value={draftValue} onChange={onVisualChange} />
            ) : (
              <div className="space-y-2">
                <Label htmlFor="content-dictionary-json">JSON ({locale.toUpperCase()})</Label>
                <Textarea
                  id="content-dictionary-json"
                  value={rawJson}
                  onChange={(event) => onRawJsonChange(event.target.value)}
                  rows={34}
                  className="font-mono text-xs leading-5"
                  disabled={loading}
                />
                {jsonError && (
                  <p className="font-inter text-xs text-red-600 dark:text-red-400">{jsonError}</p>
                )}
              </div>
            )}
          </div>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4 dark:border-stone-800 dark:bg-stone-950/60">
            <p className="font-cormorant text-2xl text-stone-900 dark:text-white">Resumo</p>
            <div className="mt-3 space-y-2 font-inter text-sm text-stone-600 dark:text-stone-400">
              <p>Idioma ativo: {locale.toUpperCase()}</p>
              <p>Modo: {mode === 'visual' ? 'Editor visual' : 'JSON avançado'}</p>
              <p>Tamanho atual: {draftSize.toLocaleString()} caracteres</p>
              <p>Base: conteúdo publicado do site + overrides do painel</p>
            </div>
          </div>

          <div className="rounded-3xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
            <p className="font-cormorant text-2xl text-stone-900 dark:text-white">Estado</p>
            <div className="mt-3 space-y-2 font-inter text-sm text-stone-600 dark:text-stone-400">
              {updatedAt && <p>Último draft: {new Date(updatedAt).toLocaleString('pt-PT')}</p>}
              {publishedAt && <p>Última publicação: {new Date(publishedAt).toLocaleString('pt-PT')}</p>}
              {!publishedAt && <p>Este idioma ainda não foi publicado.</p>}
            </div>
          </div>

          {message && (
            <div
              className={
                messageType === 'success'
                  ? 'rounded-3xl border border-emerald-200 bg-emerald-50 p-4 dark:bg-emerald-900/20 dark:border-emerald-900'
                  : 'rounded-3xl border border-red-200 bg-red-50 p-4 dark:bg-red-900/20 dark:border-red-900'
              }
            >
              <p
                className={
                  messageType === 'success'
                    ? 'font-inter text-sm text-emerald-700 dark:text-emerald-300'
                    : 'font-inter text-sm text-red-700 dark:text-red-300'
                }
              >
                {message}
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  )
}
