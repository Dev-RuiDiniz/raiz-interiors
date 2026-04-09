'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Copy, Grid, Image as ImageIcon, List, Loader2, Search } from 'lucide-react'
import { cn } from '@/lib/utils'

type ProjectImage = {
  id: string
  url: string
  alt: string | null
}

type ProjectRecord = {
  id: string
  slug: string
  title: string
  coverImage: string
  images?: ProjectImage[]
}

type ServiceRecord = {
  id: string
  slug: string
  title: string
  coverImage: string | null
  images?: ProjectImage[]
}

type MediaFile = {
  id: string
  name: string
  type: 'image'
  url: string
  uploadedAt: string
  source: string
}

function extractName(url: string) {
  const cleaned = url.split('?')[0]
  const parts = cleaned.split('/')
  return parts[parts.length - 1] || cleaned
}

function normalizeUrl(input: string) {
  return input.trim()
}

export default function MediaPage() {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadMediaFromPublishedContent() {
      setLoading(true)
      setLoadError(null)
      try {
        const [projectsResponse, servicesResponse] = await Promise.all([
          fetch('/api/admin/projects?includeImages=true', { cache: 'no-store' }),
          fetch('/api/admin/services?includeImages=true', { cache: 'no-store' }),
        ])

        if (!projectsResponse.ok || !servicesResponse.ok) {
          throw new Error('Nao foi possivel carregar media.')
        }

        const projects = (await projectsResponse.json()) as ProjectRecord[]
        const services = (await servicesResponse.json()) as ServiceRecord[]

        const map = new Map<string, MediaFile>()

        const pushFile = (url: string, source: string, updatedAt?: string) => {
          const normalized = normalizeUrl(url)
          if (!normalized) return
          if (map.has(normalized)) return
          map.set(normalized, {
            id: normalized,
            name: extractName(normalized),
            type: 'image',
            url: normalized,
            uploadedAt: updatedAt || new Date().toISOString(),
            source,
          })
        }

        for (const project of projects || []) {
          pushFile(project.coverImage, `project:${project.slug}`)
          for (const image of project.images || []) {
            pushFile(image.url, `project:${project.slug}`)
          }
        }

        for (const service of services || []) {
          if (service.coverImage) pushFile(service.coverImage, `service:${service.slug}`)
          for (const image of service.images || []) {
            pushFile(image.url, `service:${service.slug}`)
          }
        }

        const merged = [...map.values()].sort((a, b) => a.name.localeCompare(b.name))

        if (!active) return
        setMediaFiles(merged)
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar media.')
        setMediaFiles([])
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadMediaFromPublishedContent()
    return () => {
      active = false
    }
  }, [])

  const filteredFiles = useMemo(
    () =>
      mediaFiles.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [mediaFiles, searchQuery]
  )

  const toggleSelect = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const copyUrl = async (id: string, url: string) => {
    await navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Media Library
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            {mediaFiles.length} files from published content
          </p>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <Search size={18} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 p-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'grid'
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            )}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'list'
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            )}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {loading && (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-10">
          <div className="flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400">
            <Loader2 size={18} className="animate-spin" />
            A carregar media...
          </div>
        </div>
      )}

      {!loading && viewMode === 'grid' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className={cn(
                'group relative bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden cursor-pointer',
                selectedFiles.includes(file.id) && 'ring-2 ring-stone-900 dark:ring-white'
              )}
              onClick={() => toggleSelect(file.id)}
            >
              <div className="relative aspect-square bg-stone-100 dark:bg-stone-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />

                <div
                  className={cn(
                    'absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                    selectedFiles.includes(file.id)
                      ? 'bg-stone-900 dark:bg-white border-stone-900 dark:border-white'
                      : 'border-white/80 bg-white/20 opacity-0 group-hover:opacity-100'
                  )}
                >
                  {selectedFiles.includes(file.id) && (
                    <Check size={12} className="text-white dark:text-stone-900" />
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    void copyUrl(file.id, file.url)
                  }}
                  className="absolute top-2 right-2 p-1.5 bg-white/90 dark:bg-stone-900/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {copiedId === file.id ? (
                    <Check size={14} className="text-emerald-500" />
                  ) : (
                    <Copy size={14} className="text-stone-600 dark:text-stone-400" />
                  )}
                </button>
              </div>

              <div className="p-3">
                <p className="font-inter text-xs text-stone-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="font-inter text-[10px] text-stone-400 mt-1 truncate">
                  {file.source}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && viewMode === 'list' && (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
            >
              <input
                type="checkbox"
                checked={selectedFiles.includes(file.id)}
                onChange={() => toggleSelect(file.id)}
                className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
              />
              <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={file.url} alt={file.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-inter text-sm text-stone-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="font-inter text-xs text-stone-400 truncate">
                  {file.source}
                </p>
              </div>
              <button
                onClick={() => void copyUrl(file.id, file.url)}
                className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
              >
                {copiedId === file.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredFiles.length === 0 && (
        <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
          <ImageIcon size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
            No media files found
          </p>
        </div>
      )}
    </div>
  )
}
