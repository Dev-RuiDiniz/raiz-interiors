'use client'

import { useMemo, useRef, useState } from 'react'
import { ArrowDown, ArrowUp, Bold, CaseLower, CaseSensitive, CaseUpper, Italic, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { JsonValue } from '@/lib/cms/dictionary-utils'

type PathKey = string | number

interface DictionaryEditorProps {
  value: JsonValue
  onChange: (nextValue: JsonValue) => void
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function formatKeyLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
}

function isTextAreaValue(value: string) {
  return value.length > 72 || value.includes('\n') || /<[^>]+>/.test(value)
}

function getNodeLabel(path: PathKey[]) {
  if (!path.length) return 'Site Dictionary'
  const last = path[path.length - 1]
  if (typeof last === 'number') return `Item ${last + 1}`
  return formatKeyLabel(String(last))
}

function getNodeTrail(path: PathKey[]) {
  if (!path.length) return 'Raiz'
  return path
    .map((segment) => (typeof segment === 'number' ? `#${segment + 1}` : formatKeyLabel(segment)))
    .join(' / ')
}

function resolveArrayItemLabel(item: JsonValue, index: number) {
  if (isPlainObject(item)) {
    const candidates = ['title', 'label', 'name', 'number', 'slug']
    for (const candidate of candidates) {
      const raw = item[candidate]
      if (typeof raw === 'string' && raw.trim()) {
        return raw
      }
    }
  }

  return `Item ${index + 1}`
}

function updateAtPath(root: JsonValue, path: PathKey[], nextValue: JsonValue): JsonValue {
  if (!path.length) return nextValue

  const [head, ...tail] = path

  if (Array.isArray(root) && typeof head === 'number') {
    const next = root.slice()
    next[head] = updateAtPath(root[head], tail, nextValue)
    return next
  }

  if (isPlainObject(root) && typeof head === 'string') {
    return {
      ...root,
      [head]: updateAtPath(root[head] as JsonValue, tail, nextValue),
    }
  }

  return root
}

function insertAtPath(root: JsonValue, path: PathKey[], valueToInsert: JsonValue): JsonValue {
  if (!path.length) return root

  const [head, ...tail] = path

  if (Array.isArray(root) && typeof head === 'number') {
    const next = root.slice()
    if (!tail.length) {
      next.splice(head, 0, valueToInsert)
      return next
    }
    next[head] = insertAtPath(root[head], tail, valueToInsert)
    return next
  }

  if (isPlainObject(root) && typeof head === 'string') {
    return {
      ...root,
      [head]: insertAtPath(root[head] as JsonValue, tail, valueToInsert),
    }
  }

  return root
}

function removeAtPath(root: JsonValue, path: PathKey[]): JsonValue {
  if (!path.length) return root

  const [head, ...tail] = path
  if (Array.isArray(root) && typeof head === 'number') {
    const next = root.slice()
    if (!tail.length) {
      next.splice(head, 1)
      return next
    }
    next[head] = removeAtPath(root[head], tail)
    return next
  }

  if (isPlainObject(root) && typeof head === 'string') {
    const next = { ...root }
    if (!tail.length) {
      delete next[head]
      return next
    }
    next[head] = removeAtPath(root[head] as JsonValue, tail)
    return next
  }

  return root
}

function moveArrayItem(root: JsonValue, path: PathKey[], direction: -1 | 1): JsonValue {
  if (!path.length) return root

  const index = path[path.length - 1]
  if (typeof index !== 'number') return root
  const itemIndex = index

  const target = itemIndex + direction
  if (target < 0) return root

  function walk(current: JsonValue, currentPath: PathKey[]): JsonValue {
    if (!currentPath.length) {
      if (!Array.isArray(current)) return current
      if (target >= current.length) return current
      const next = current.slice()
      const [item] = next.splice(itemIndex, 1)
      next.splice(target, 0, item)
      return next
    }

    const [head, ...tail] = currentPath
    if (Array.isArray(current) && typeof head === 'number') {
      const next = current.slice()
      next[head] = walk(current[head], tail)
      return next
    }

    if (isPlainObject(current) && typeof head === 'string') {
      return {
        ...current,
        [head]: walk(current[head] as JsonValue, tail),
      }
    }

    return current
  }

  return walk(root, path.slice(0, -1))
}

function createEmptyLike(value: JsonValue): JsonValue {
  if (typeof value === 'string') return ''
  if (typeof value === 'number') return 0
  if (typeof value === 'boolean') return false
  if (Array.isArray(value)) {
    return value.length ? [createEmptyLike(value[0])] : ['']
  }
  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, createEmptyLike(entry as JsonValue)])
    ) as JsonValue
  }
  return null
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

function LongTextField({
  value,
  title,
  trail,
  depth,
  onChange,
}: {
  value: string
  title: string
  trail: string
  depth: number
  onChange: (nextValue: JsonValue) => void
}) {
  const [open, setOpen] = useState(false)
  const [fontFamily, setFontFamily] = useState('inherit')
  const [fontSize, setFontSize] = useState('16')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const preview = useMemo(() => {
    const normalized = value.replace(/\s+/g, ' ').trim()
    if (!normalized) return 'Campo vazio'
    return normalized.length > 180 ? `${normalized.slice(0, 180)}...` : normalized
  }, [value])

  const applyMarkup = (before: string, after: string) => {
    const el = textareaRef.current
    if (!el) return
    const nextValue = wrapSelection(value, el.selectionStart ?? 0, el.selectionEnd ?? 0, before, after)
    onChange(nextValue)
  }

  const applyTransform = (mode: 'upper' | 'lower') => {
    const el = textareaRef.current
    if (!el) return
    const nextValue = transformSelection(value, el.selectionStart ?? 0, el.selectionEnd ?? 0, mode)
    onChange(nextValue)
  }

  const applyFontStyle = () => {
    const el = textareaRef.current
    if (!el) return
    const start = el.selectionStart ?? 0
    const end = el.selectionEnd ?? 0
    const selected = value.slice(start, end)
    if (!selected) return
    const nextValue = wrapSelection(
      value,
      start,
      end,
      `<span style="font-family:${fontFamily}; font-size:${fontSize}px">`,
      '</span>'
    )
    onChange(nextValue)
  }

  return (
    <>
      <section
        className={`rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-950/70 ${
          depth > 0 ? 'ring-1 ring-stone-100 dark:ring-stone-900' : ''
        }`}
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <Label className="text-[11px] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
              {title}
            </Label>
            <p className="font-inter text-xs text-stone-400 dark:text-stone-500">{trail}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-inter text-[11px] uppercase tracking-[0.2em] text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
              Texto longo
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="h-9 rounded-full px-4"
            >
              Abrir popup
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-900/40">
          <p className="mb-2 font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
            Pré-visualização
          </p>
          <p className="line-clamp-4 whitespace-pre-wrap font-inter text-sm leading-7 text-stone-700 dark:text-stone-300">
            {preview}
          </p>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] w-[min(1120px,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border-stone-200 bg-white p-0 shadow-[0_28px_100px_-40px_rgba(28,25,23,0.45)] dark:border-stone-800 dark:bg-stone-950">
          <div className="grid max-h-[92vh] lg:grid-cols-[1fr_360px]">
            <div className="flex min-h-0 flex-col border-b border-stone-200 p-6 lg:border-b-0 lg:border-r dark:border-stone-800">
              <DialogHeader className="mb-5 text-left">
                <DialogTitle className="font-cormorant text-3xl text-stone-900 dark:text-white">
                  {title}
                </DialogTitle>
                <DialogDescription className="font-inter text-sm text-stone-500 dark:text-stone-400">
                  {trail}
                </DialogDescription>
              </DialogHeader>

              <div className="mb-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/40">
                <p className="font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                  Edição completa
                </p>
                <p className="mt-1 font-inter text-sm text-stone-600 dark:text-stone-300">
                  Use este painel para ver e editar o conteúdo inteiro sem cortes.
                </p>
              </div>

              <div className="mb-4 rounded-2xl border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-950/60">
                <div className="flex flex-wrap items-center gap-2">
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
                    Aplicar fonte
                  </Button>
                  <div className="ml-auto flex flex-wrap items-center gap-2">
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
                      <option value="14">14px</option>
                      <option value="16">16px</option>
                      <option value="18">18px</option>
                      <option value="20">20px</option>
                      <option value="24">24px</option>
                    </select>
                  </div>
                </div>
              </div>

              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="min-h-[60vh] flex-1 resize-none rounded-[1.5rem] border-stone-200 font-inter text-sm leading-7 dark:border-stone-800"
                rows={24}
              />
            </div>

            <div className="min-h-0 space-y-4 overflow-y-auto bg-stone-50 p-6 dark:bg-stone-900/40">
              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950/70">
                <p className="font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                  Preview
                </p>
                <p className="mt-2 whitespace-pre-wrap break-words font-inter text-sm leading-7 text-stone-700 dark:text-stone-300">
                  {value || 'Campo vazio'}
                </p>
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-950/70">
                <p className="font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                  Dica
                </p>
                <p className="mt-2 font-inter text-sm leading-6 text-stone-600 dark:text-stone-300">
                  Se o texto tiver várias frases, este popup evita quebra visual e mantém a leitura
                  organizada.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function ShortTextField({
  value,
  title,
  trail,
  depth,
  onChange,
}: {
  value: string
  title: string
  trail: string
  depth: number
  onChange: (nextValue: JsonValue) => void
}) {
  const [open, setOpen] = useState(false)
  const [fontFamily, setFontFamily] = useState('inherit')
  const [fontSize, setFontSize] = useState('14')
  const inputRef = useRef<HTMLInputElement | null>(null)

  const preview = useMemo(() => {
    const normalized = value.replace(/\s+/g, ' ').trim()
    if (!normalized) return 'Campo vazio'
    return normalized.length > 70 ? `${normalized.slice(0, 70)}...` : normalized
  }, [value])

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
    const selected = value.slice(start, end)
    if (!selected) return
    const nextValue = wrapSelection(
      value,
      start,
      end,
      `<span style="font-family:${fontFamily}; font-size:${fontSize}px">`,
      '</span>'
    )
    onChange(nextValue)
  }

  return (
    <>
      <section
        className={`rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-950/70 ${
          depth > 0 ? 'ring-1 ring-stone-100 dark:ring-stone-900' : ''
        }`}
      >
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
          <div className="space-y-1">
            <Label className="text-[11px] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
              {title}
            </Label>
            <p className="font-inter text-xs text-stone-400 dark:text-stone-500">{trail}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-stone-200 bg-stone-50 px-3 py-1 font-inter text-[11px] uppercase tracking-[0.2em] text-stone-500 dark:border-stone-800 dark:bg-stone-900 dark:text-stone-400">
              Campo curto
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(true)}
              className="h-9 rounded-full px-4"
            >
              Editar
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
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

          <Input
            ref={inputRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="h-12 font-inter text-sm"
          />

          <div className="rounded-2xl border border-stone-200 bg-stone-50/80 p-4 dark:border-stone-800 dark:bg-stone-900/40">
            <p className="mb-2 font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
              Pré-visualização
            </p>
            <p className="line-clamp-2 font-inter text-sm leading-6 text-stone-700 dark:text-stone-300">
              {preview}
            </p>
          </div>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] w-[min(980px,calc(100vw-1.5rem))] overflow-hidden rounded-[2rem] border-stone-200 bg-white p-0 dark:border-stone-800 dark:bg-stone-950">
          <div className="grid max-h-[92vh] lg:grid-cols-[1fr_300px]">
            <div className="flex min-h-0 flex-col border-b border-stone-200 p-6 lg:border-b-0 lg:border-r dark:border-stone-800">
              <DialogHeader className="mb-5 text-left">
                <DialogTitle className="font-cormorant text-3xl text-stone-900 dark:text-white">
                  {title}
                </DialogTitle>
                <DialogDescription className="font-inter text-sm text-stone-500 dark:text-stone-400">
                  {trail}
                </DialogDescription>
              </DialogHeader>

              <div className="mb-4 rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 dark:border-stone-800 dark:bg-stone-900/40">
                <p className="font-inter text-[11px] uppercase tracking-[0.22em] text-stone-400 dark:text-stone-500">
                  Edição rápida
                </p>
                <p className="mt-1 font-inter text-sm text-stone-600 dark:text-stone-300">
                  Esse popup facilita ajustes sem perder a barra de formatação.
                </p>
              </div>

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
                  Aplicar fonte
                </Button>
              </div>

              <Input
                ref={inputRef}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-12 rounded-2xl border-stone-200 font-inter text-sm dark:border-stone-800"
              />
            </div>

            <div className="min-h-0 space-y-4 overflow-y-auto bg-stone-50 p-6 dark:bg-stone-900/40">
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
                  Fonte e tamanho
                </p>
                <div className="mt-3 space-y-3">
                  <select
                    value={fontFamily}
                    onChange={(event) => setFontFamily(event.target.value)}
                    className="h-10 w-full rounded-full border border-stone-200 bg-white px-3 font-inter text-sm dark:border-stone-800 dark:bg-stone-950"
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
                    className="h-10 w-full rounded-full border border-stone-200 bg-white px-3 font-inter text-sm dark:border-stone-800 dark:bg-stone-950"
                  >
                    <option value="12">12px</option>
                    <option value="14">14px</option>
                    <option value="16">16px</option>
                    <option value="18">18px</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

function FieldNode({
  value,
  path,
  onChange,
  depth = 0,
}: {
  value: JsonValue
  path: PathKey[]
  onChange: (nextValue: JsonValue) => void
  depth?: number
}) {
  const nodeLabel = getNodeLabel(path)
  const trail = getNodeTrail(path)
  const isRoot = path.length === 0

  if (typeof value === 'string') {
    const isLong = isTextAreaValue(value)

    return isLong ? (
      <LongTextField value={value} title={nodeLabel} trail={trail} depth={depth} onChange={onChange} />
    ) : (
      <ShortTextField
        value={value}
        title={nodeLabel}
        trail={trail}
        depth={depth}
        onChange={onChange}
      />
    )
  }

  if (typeof value === 'number' || typeof value === 'boolean' || value === null) {
    return (
      <section
        className={`rounded-3xl border border-stone-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-stone-800 dark:bg-stone-950/70 ${
          depth > 0 ? 'ring-1 ring-stone-100 dark:ring-stone-900' : ''
        }`}
      >
        <div className="mb-4 space-y-1">
          <Label className="text-[11px] uppercase tracking-[0.24em] text-stone-500 dark:text-stone-400">
            {nodeLabel}
          </Label>
          <p className="font-inter text-xs text-stone-400 dark:text-stone-500">{trail}</p>
        </div>
        <Input
          value={value === null ? '' : String(value)}
          onChange={(event) => {
            const nextRaw = event.target.value
            if (typeof value === 'number') {
              const parsed = Number(nextRaw)
              onChange(Number.isNaN(parsed) ? 0 : parsed)
              return
            }
            if (typeof value === 'boolean') {
              onChange((nextRaw === 'true' || nextRaw === '1') as unknown as JsonValue)
              return
            }
            onChange(nextRaw as unknown as JsonValue)
          }}
          className="h-12 font-inter text-sm"
        />
      </section>
    )
  }

  if (Array.isArray(value)) {
    const title = nodeLabel
    const itemKind = value.every(
      (item) =>
        typeof item === 'string' ||
        typeof item === 'number' ||
        typeof item === 'boolean' ||
        item === null
    )
      ? 'primitive'
      : 'object'

    return (
      <section className="overflow-hidden rounded-[2rem] border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950/60">
        <div className="border-b border-stone-200 bg-gradient-to-r from-stone-50 to-white px-6 py-5 dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-cormorant text-2xl text-stone-900 dark:text-white">{title}</p>
              <p className="font-inter text-xs uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {trail}
              </p>
              <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
                {value.length} item{value.length === 1 ? '' : 's'} - ramificação editável
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onChange([...value, value.length ? createEmptyLike(value[0]) : ''] as JsonValue)}
              className="h-11 gap-2 rounded-full px-4"
            >
              <Plus size={14} />
              Add item
            </Button>
          </div>
        </div>

        <div className="space-y-4 p-6">
          {value.map((item, index) => (
            <div
              key={`${path.join('.')}-${index}`}
              className="rounded-[1.75rem] border border-stone-200 bg-stone-50/80 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-stone-800 dark:bg-stone-900/35"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="font-inter text-[11px] uppercase tracking-[0.24em] text-stone-400 dark:text-stone-500">
                    {resolveArrayItemLabel(item, index)}
                  </p>
                  <p className="font-inter text-xs text-stone-400 dark:text-stone-500">
                    Caminho: {path.map((segment) => String(segment)).join(' / ')} / {index + 1}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={() => onChange(moveArrayItem(value, [...path, index], -1))}
                    disabled={index === 0}
                  >
                    <ArrowUp size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full"
                    onClick={() => onChange(moveArrayItem(value, [...path, index], 1))}
                    disabled={index === value.length - 1}
                  >
                    <ArrowDown size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full text-red-600 hover:text-red-700"
                    onClick={() => onChange(removeAtPath(value, [index]))}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>

              {itemKind === 'primitive' ? (
                typeof item === 'string' ? (
                  isTextAreaValue(item) ? (
                    <LongTextField
                      value={item}
                      title={`${resolveArrayItemLabel(item, index)}`}
                      trail={`Caminho: ${path.map((segment) => String(segment)).join(' / ')} / ${
                        index + 1
                      }`}
                      depth={depth + 1}
                      onChange={(nextValue) => {
                        const next = value.slice()
                        next[index] = nextValue
                        onChange(next as JsonValue)
                      }}
                    />
                  ) : (
                    <Textarea
                      value={item}
                      onChange={(event) => {
                        const next = value.slice()
                        next[index] = event.target.value
                        onChange(next as JsonValue)
                      }}
                      rows={6}
                      className="min-h-[180px] font-inter text-sm leading-7"
                    />
                  )
                ) : (
                  <Input
                    value={item === null ? '' : String(item)}
                    onChange={(event) => {
                      const next = value.slice()
                      next[index] = event.target.value as unknown as JsonValue
                      onChange(next as JsonValue)
                    }}
                    className="h-12 font-inter text-sm"
                  />
                )
              ) : (
                <div className="border-l-2 border-stone-200 pl-4 dark:border-stone-700">
                  <FieldNode
                    value={item}
                    path={[...path, index]}
                    depth={depth + 1}
                    onChange={(nextItem) => {
                      const next = value.slice()
                      next[index] = nextItem
                      onChange(next as JsonValue)
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    )
  }

  if (isPlainObject(value)) {
    const entries = Object.entries(value)
    const stackClass = isRoot
      ? 'space-y-6'
      : 'space-y-5 border-l-2 border-stone-200 pl-5 dark:border-stone-800'

    return (
      <section
        className={`rounded-[2rem] border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950/60 ${
          depth > 0 ? 'ring-1 ring-stone-100 dark:ring-stone-900' : ''
        }`}
      >
        <div className="border-b border-stone-200 bg-gradient-to-r from-stone-50 to-white px-6 py-5 dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <p className="font-cormorant text-3xl text-stone-900 dark:text-white">{nodeLabel}</p>
              <p className="font-inter text-xs uppercase tracking-[0.22em] text-stone-500 dark:text-stone-400">
                {trail}
              </p>
              <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
                {entries.length} field{entries.length === 1 ? '' : 's'} - blocos expandidos para leitura
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className={stackClass}>
            {entries.map(([key, childValue]) => (
              <FieldNode
                key={key}
                value={childValue as JsonValue}
                path={[...path, key]}
                depth={depth + 1}
                onChange={(nextChild) => {
                  onChange({
                    ...value,
                    [key]: nextChild,
                  } as JsonValue)
                }}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return null
}

export function DictionaryEditor({ value, onChange }: DictionaryEditorProps) {
  const rootValue = useMemo(() => value, [value])

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-stone-200 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.98),rgba(247,242,236,0.94))] p-6 shadow-[0_24px_80px_-44px_rgba(28,25,23,0.25)] dark:border-stone-800 dark:bg-[radial-gradient(circle_at_top_left,rgba(32,29,26,0.98),rgba(15,12,10,0.98))]">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="font-cormorant text-3xl text-stone-900 dark:text-white">Editor Estruturado</p>
            <p className="max-w-4xl font-inter text-sm leading-6 text-stone-500 dark:text-stone-400">
              Os blocos abaixo seguem a estrutura real do conteúdo. Cada ramo aparece expandido, com
              espaçamento maior, para facilitar revisão, comparação e edição sem perder contexto visual.
            </p>
          </div>

          <div className="rounded-full border border-stone-200 bg-white/80 px-4 py-2 font-inter text-[11px] uppercase tracking-[0.22em] text-stone-500 backdrop-blur dark:border-stone-800 dark:bg-stone-950/60 dark:text-stone-400">
            Layout focado em leitura e edição
          </div>
        </div>
      </div>

      <FieldNode value={rootValue} path={[]} onChange={(nextValue) => onChange(nextValue as JsonValue)} />
    </div>
  )
}
