'use client'

import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import Image from 'next/image'
import { ArrowDown, ArrowUp, Copy, Eye, EyeOff, Plus, Trash2, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  createDefaultBox,
  normalizeGalleryLayout,
  type GalleryLayout,
  type GalleryLayoutItem,
  objectFitValues,
} from '@/lib/cms/layout-types'

interface GalleryLayoutFieldProps {
  id: string
  value: string
  onChange: (nextValue: string) => void
}

type EditMode = 'desktop' | 'mobile'
type Box = GalleryLayoutItem['desktop']

type DragState = {
  itemId: string
  kind: 'move' | 'resize'
  mode: EditMode
  startClientX: number
  startClientY: number
  startBox: Box
  canvasWidth: number
  canvasHeight: number
}

function parseLayout(rawValue: string): GalleryLayout {
  if (!rawValue) return normalizeGalleryLayout(null)
  try {
    return normalizeGalleryLayout(JSON.parse(rawValue))
  } catch {
    return normalizeGalleryLayout(null)
  }
}

function serializeLayout(layout: GalleryLayout) {
  return JSON.stringify(layout)
}

function normalizeOrder(items: GalleryLayoutItem[]) {
  return items
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }))
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function round1(value: number) {
  return Math.round(value * 10) / 10
}

function normalizeBox(box: Box): Box {
  const safeW = clamp(Number.isFinite(box.w) ? box.w : 100, 1, 100)
  const safeH = clamp(Number.isFinite(box.h) ? box.h : 100, 1, 100)
  const safeX = clamp(Number.isFinite(box.x) ? box.x : 0, 0, 100 - safeW)
  const safeY = clamp(Number.isFinite(box.y) ? box.y : 0, 0, 100 - safeH)
  const safeZ = clamp(Math.round(Number.isFinite(box.z) ? box.z : 1), 0, 100)

  return {
    ...box,
    x: round1(safeX),
    y: round1(safeY),
    w: round1(safeW),
    h: round1(safeH),
    z: safeZ,
  }
}

async function uploadImage(file: File): Promise<string> {
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

  return result.url
}

export function GalleryLayoutField({ id, value, onChange }: GalleryLayoutFieldProps) {
  const parsedLayout = useMemo(() => parseLayout(value), [value])
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string | null>(parsedLayout.items[0]?.id || null)
  const [editingMode, setEditingMode] = useState<EditMode>('desktop')
  const [uploading, setUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const [nudgeStep, setNudgeStep] = useState(1)

  const sortedItems = useMemo(
    () => parsedLayout.items.slice().sort((a, b) => a.order - b.order),
    [parsedLayout.items]
  )

  useEffect(() => {
    if (!sortedItems.length) {
      if (selectedItemId !== null) {
        setSelectedItemId(null)
      }
      return
    }

    if (!selectedItemId || !sortedItems.some((item) => item.id === selectedItemId)) {
      setSelectedItemId(sortedItems[0].id)
    }
  }, [selectedItemId, sortedItems])

  const selectedItem = sortedItems.find((item) => item.id === selectedItemId) || sortedItems[0] || null

  const patchLayout = useCallback(
    (updater: (current: GalleryLayout) => GalleryLayout) => {
      const next = updater(parsedLayout)
      onChange(serializeLayout(next))
    },
    [onChange, parsedLayout]
  )

  const patchSelectedItem = (updater: (item: GalleryLayoutItem) => GalleryLayoutItem) => {
    if (!selectedItem) return

    patchLayout((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === selectedItem.id ? updater(item) : item)),
    }))
  }

  const updateSelectedBox = (updates: Partial<Box>) => {
    if (!selectedItem) return
    patchSelectedItem((item) => ({
      ...item,
      [editingMode]: normalizeBox({
        ...item[editingMode],
        ...updates,
      }),
    }))
  }

  const setBoxField = (key: keyof Box, rawValue: number) => {
    if (!selectedItem || !Number.isFinite(rawValue)) return
    const current = selectedItem[editingMode]

    if (key === 'z') {
      updateSelectedBox({ z: Math.round(rawValue) })
      return
    }

    if (key === 'x') {
      updateSelectedBox({ x: rawValue })
      return
    }

    if (key === 'y') {
      updateSelectedBox({ y: rawValue })
      return
    }

    if (key === 'w') {
      updateSelectedBox({ w: rawValue, x: clamp(current.x, 0, 100 - rawValue) })
      return
    }

    updateSelectedBox({ h: rawValue, y: clamp(current.y, 0, 100 - rawValue) })
  }

  const addImageByUrl = (url: string) => {
    const nextItem: GalleryLayoutItem = {
      id: crypto.randomUUID(),
      src: url,
      alt: '',
      order: sortedItems.length,
      visible: true,
      desktop: createDefaultBox(),
      mobile: createDefaultBox(),
    }

    patchLayout((current) => ({
      ...current,
      items: normalizeOrder([...current.items, nextItem]),
    }))
    setSelectedItemId(nextItem.id)
  }

  const duplicateSelected = () => {
    if (!selectedItem) return

    const duplicated: GalleryLayoutItem = {
      ...selectedItem,
      id: crypto.randomUUID(),
      order: sortedItems.length,
      desktop: normalizeBox({ ...selectedItem.desktop, x: selectedItem.desktop.x + 2 }),
      mobile: normalizeBox({ ...selectedItem.mobile, x: selectedItem.mobile.x + 2 }),
    }

    patchLayout((current) => ({
      ...current,
      items: normalizeOrder([...current.items, duplicated]),
    }))
    setSelectedItemId(duplicated.id)
  }

  const removeSelected = () => {
    if (!selectedItem) return

    patchLayout((current) => ({
      ...current,
      items: normalizeOrder(current.items.filter((item) => item.id !== selectedItem.id)),
    }))
  }

  const moveSelected = (direction: -1 | 1) => {
    if (!selectedItem) return

    const index = sortedItems.findIndex((item) => item.id === selectedItem.id)
    const targetIndex = index + direction
    if (targetIndex < 0 || targetIndex >= sortedItems.length) return

    const next = [...sortedItems]
    const [moved] = next.splice(index, 1)
    next.splice(targetIndex, 0, moved)

    patchLayout((current) => ({
      ...current,
      items: normalizeOrder(next),
    }))
  }

  const nudgeSelected = (dx: number, dy: number) => {
    if (!selectedItem) return
    const current = selectedItem[editingMode]
    updateSelectedBox({
      x: current.x + dx,
      y: current.y + dy,
    })
  }

  const alignSelected = (target: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'fill') => {
    if (!selectedItem) return
    const current = selectedItem[editingMode]

    if (target === 'fill') {
      updateSelectedBox({ x: 0, y: 0, w: 100, h: 100 })
      return
    }

    if (target === 'left') {
      updateSelectedBox({ x: 0 })
      return
    }

    if (target === 'center') {
      updateSelectedBox({ x: (100 - current.w) / 2 })
      return
    }

    if (target === 'right') {
      updateSelectedBox({ x: 100 - current.w })
      return
    }

    if (target === 'top') {
      updateSelectedBox({ y: 0 })
      return
    }

    if (target === 'middle') {
      updateSelectedBox({ y: (100 - current.h) / 2 })
      return
    }

    updateSelectedBox({ y: 100 - current.h })
  }

  const onUploadClick = async (file: File) => {
    setUploading(true)
    setErrorMessage(null)
    try {
      const url = await uploadImage(file)
      addImageByUrl(url)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Falha no upload.')
    } finally {
      setUploading(false)
    }
  }

  const startDrag = (
    event: ReactPointerEvent<HTMLElement>,
    item: GalleryLayoutItem,
    kind: DragState['kind']
  ) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    if (!rect.width || !rect.height) return

    setSelectedItemId(item.id)
    setDragState({
      itemId: item.id,
      kind,
      mode: editingMode,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startBox: item[editingMode],
      canvasWidth: rect.width,
      canvasHeight: rect.height,
    })
  }

  useEffect(() => {
    if (!dragState) return

    const onPointerMove = (event: PointerEvent) => {
      const deltaX = ((event.clientX - dragState.startClientX) / dragState.canvasWidth) * 100
      const deltaY = ((event.clientY - dragState.startClientY) / dragState.canvasHeight) * 100

      patchLayout((current) => ({
        ...current,
        items: current.items.map((item) => {
          if (item.id !== dragState.itemId) return item

          if (dragState.kind === 'move') {
            return {
              ...item,
              [dragState.mode]: normalizeBox({
                ...dragState.startBox,
                x: dragState.startBox.x + deltaX,
                y: dragState.startBox.y + deltaY,
              }),
            }
          }

          return {
            ...item,
            [dragState.mode]: normalizeBox({
              ...dragState.startBox,
              w: dragState.startBox.w + deltaX,
              h: dragState.startBox.h + deltaY,
            }),
          }
        }),
      }))
    }

    const onPointerUp = () => {
      setDragState(null)
    }

    window.addEventListener('pointermove', onPointerMove)
    window.addEventListener('pointerup', onPointerUp)

    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
    }
  }, [dragState, patchLayout])

  const currentBox = selectedItem ? selectedItem[editingMode] : null
  const canvasHeight = editingMode === 'desktop' ? parsedLayout.canvasHeightDesktop : parsedLayout.canvasHeightMobile
  const visibleItems = sortedItems.filter((item) => item.visible)

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Label
          htmlFor={`gallery-upload-${id}`}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-stone-200 dark:border-stone-700 cursor-pointer hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
        >
          <Upload size={14} />
          {uploading ? 'Enviando...' : 'Upload imagem'}
        </Label>
        <Input
          id={`gallery-upload-${id}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) {
              void onUploadClick(file)
            }
            event.currentTarget.value = ''
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addImageByUrl('/2026/home/galeria_inicial/suite_4k.jpg')}
        >
          <Plus size={14} />
          Adicionar placeholder
        </Button>
        <div className="flex rounded-md border border-stone-200 dark:border-stone-700 overflow-hidden">
          <button
            type="button"
            onClick={() => setEditingMode('desktop')}
            className={`px-3 h-9 text-xs font-medium ${
              editingMode === 'desktop'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-transparent text-stone-600 dark:text-stone-300'
            }`}
          >
            Desktop
          </button>
          <button
            type="button"
            onClick={() => setEditingMode('mobile')}
            className={`px-3 h-9 text-xs font-medium ${
              editingMode === 'mobile'
                ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900'
                : 'bg-transparent text-stone-600 dark:text-stone-300'
            }`}
          >
            Mobile
          </button>
        </div>
      </div>

      <p className="text-xs text-stone-500">
        Dica: selecione uma imagem e arraste no canvas para reposicionar. Use o quadrado no canto inferior direito para redimensionar.
      </p>

      {errorMessage && <p className="text-xs text-red-600">{errorMessage}</p>}

      <div
        ref={canvasRef}
        className="relative overflow-hidden rounded-xl border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-900"
        style={{
          height: `${canvasHeight}px`,
          backgroundImage:
            'linear-gradient(to right, rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
          backgroundSize: '5% 10%',
        }}
      >
        {visibleItems.map((item) => {
          const box = item[editingMode]
          const selected = item.id === selectedItem?.id
          return (
            <div
              key={`${editingMode}-${item.id}`}
              className={`absolute overflow-hidden rounded-md border-2 ${
                selected ? 'border-emerald-500 ring-2 ring-emerald-500/25' : 'border-white/70'
              }`}
              style={{
                left: `${box.x}%`,
                top: `${box.y}%`,
                width: `${box.w}%`,
                height: `${box.h}%`,
                zIndex: box.z,
                cursor: 'move',
              }}
              onPointerDown={(event) => startDrag(event, item, 'move')}
            >
              <Image
                src={item.src}
                alt={item.alt || 'Imagem'}
                fill
                className="select-none pointer-events-none"
                style={{
                  objectFit: box.objectFit,
                  objectPosition: box.objectPosition,
                }}
              />
              {selected && (
                <button
                  type="button"
                  className="absolute right-1 bottom-1 h-3 w-3 rounded-sm border border-white bg-emerald-500"
                  onPointerDown={(event) => {
                    event.stopPropagation()
                    startDrag(event, item, 'resize')
                  }}
                  aria-label="Resize image"
                />
              )}
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-2">
          {sortedItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedItemId(item.id)}
              className={`w-full text-left px-3 py-2 rounded border transition-colors ${
                selectedItem?.id === item.id
                  ? 'border-stone-800 bg-stone-100 dark:bg-stone-800 dark:border-stone-200'
                  : 'border-stone-200 hover:bg-stone-50 dark:border-stone-700 dark:hover:bg-stone-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="relative h-10 w-14 overflow-hidden rounded bg-stone-200">
                  <Image src={item.src} alt={item.alt || 'Imagem'} fill className="object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-stone-800 dark:text-stone-100">{item.alt || item.src}</p>
                  <p className="text-[11px] text-stone-500">Ordem: {item.order}</p>
                </div>
                {item.visible ? (
                  <Eye size={14} className="text-stone-500" />
                ) : (
                  <EyeOff size={14} className="text-stone-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {selectedItem && currentBox && (
          <div className="space-y-3 rounded-lg border border-stone-200 dark:border-stone-700 p-3">
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => moveSelected(-1)}>
                <ArrowUp size={14} />
                Subir
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={() => moveSelected(1)}>
                <ArrowDown size={14} />
                Descer
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={duplicateSelected}>
                <Copy size={14} />
                Duplicar
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={removeSelected}>
                <Trash2 size={14} />
                Remover
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => patchSelectedItem((item) => ({ ...item, visible: !item.visible }))}
              >
                {selectedItem.visible ? <EyeOff size={14} /> : <Eye size={14} />}
                {selectedItem.visible ? 'Ocultar' : 'Exibir'}
              </Button>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label>URL</Label>
                <Input
                  value={selectedItem.src}
                  onChange={(event) => patchSelectedItem((item) => ({ ...item, src: event.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Alt</Label>
                <Input
                  value={selectedItem.alt}
                  onChange={(event) => patchSelectedItem((item) => ({ ...item, alt: event.target.value }))}
                />
              </div>
            </div>

            <div className="grid gap-2 md:grid-cols-3">
              {(['x', 'y', 'w', 'h', 'z'] as const).map((key) => (
                <div className="space-y-1" key={key}>
                  <Label>{key.toUpperCase()}</Label>
                  <div className="space-y-1">
                    {key !== 'z' && (
                      <input
                        type="range"
                        min={key === 'w' || key === 'h' ? 1 : 0}
                        max={100}
                        step={0.5}
                        value={currentBox[key]}
                        onChange={(event) => setBoxField(key, Number(event.target.value))}
                        className="w-full"
                      />
                    )}
                    <Input
                      type="number"
                      step={key === 'z' ? 1 : 0.5}
                      value={currentBox[key]}
                      onChange={(event) => setBoxField(key, Number(event.target.value || 0))}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label>Alinhamento rápido</Label>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => alignSelected('left')}>
                  Esquerda
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => alignSelected('center')}>
                  Centro H
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => alignSelected('right')}>
                  Direita
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => alignSelected('top')}>
                  Topo
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => alignSelected('middle')}>
                  Centro V
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => alignSelected('bottom')}>
                  Base
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => alignSelected('fill')}>
                  Preencher
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ajuste fino (setas)</Label>
              <div className="flex flex-wrap items-center gap-2">
                <Input
                  type="number"
                  className="w-20"
                  value={nudgeStep}
                  min={0.5}
                  max={10}
                  step={0.5}
                  onChange={(event) => setNudgeStep(clamp(Number(event.target.value || 1), 0.5, 10))}
                />
                <span className="text-xs text-stone-500">% por clique</span>
                <Button type="button" variant="outline" size="sm" onClick={() => nudgeSelected(0, -nudgeStep)}>
                  ↑
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => nudgeSelected(-nudgeStep, 0)}>
                  ←
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => nudgeSelected(nudgeStep, 0)}>
                  →
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => nudgeSelected(0, nudgeStep)}>
                  ↓
                </Button>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Object fit</Label>
                <select
                  className="h-9 w-full rounded-md border border-stone-200 bg-transparent px-3 text-sm dark:border-stone-700"
                  value={currentBox.objectFit}
                  onChange={(event) =>
                    updateSelectedBox({
                      objectFit: event.target.value as GalleryLayoutItem['desktop']['objectFit'],
                    })
                  }
                >
                  {objectFitValues.map((fitValue) => (
                    <option key={fitValue} value={fitValue}>
                      {fitValue}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <Label>Object position</Label>
                <Input
                  value={currentBox.objectPosition}
                  onChange={(event) => updateSelectedBox({ objectPosition: event.target.value })}
                />
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label>Altura canvas desktop</Label>
                <Input
                  type="number"
                  value={parsedLayout.canvasHeightDesktop}
                  onChange={(event) => {
                    const number = Number(event.target.value || 0)
                    patchLayout((current) => ({
                      ...current,
                      canvasHeightDesktop: Number.isFinite(number) ? number : current.canvasHeightDesktop,
                    }))
                  }}
                />
              </div>
              <div className="space-y-1">
                <Label>Altura canvas mobile</Label>
                <Input
                  type="number"
                  value={parsedLayout.canvasHeightMobile}
                  onChange={(event) => {
                    const number = Number(event.target.value || 0)
                    patchLayout((current) => ({
                      ...current,
                      canvasHeightMobile: Number.isFinite(number) ? number : current.canvasHeightMobile,
                    }))
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-md border border-stone-200 bg-stone-50 p-3 dark:border-stone-700 dark:bg-stone-900/30">
        <p className="text-xs text-stone-500">Campo JSON bruto (compatibilidade/migração)</p>
        <Input value={value} onChange={(event) => onChange(event.target.value)} className="mt-2" />
      </div>
    </div>
  )
}
