'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Edit, Eye, FileText, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { adminPageEditorConfigs, type AdminPageEditorConfig } from '@/lib/admin-page-configs'

type PageStatus = 'published' | 'draft'

type PageRow = {
  id: AdminPageEditorConfig['pageId']
  title: string
  slug: string
  icon: AdminPageEditorConfig['icon']
  sections: string[]
  status: PageStatus
  lastModified: string | null
}

const pageOrder: AdminPageEditorConfig['pageId'][] = ['home', 'projects', 'services', 'about', 'contact', 'privacy']

function createBaseRows(): PageRow[] {
  return pageOrder.map((pageId) => {
    const config = adminPageEditorConfigs[pageId]
    return {
      id: config.pageId,
      title: config.title,
      slug: config.publicPath,
      icon: config.icon,
      sections: config.sections.map((section) => section.title),
      status: 'draft',
      lastModified: null,
    }
  })
}

function formatDate(value: string | null) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleDateString()
}

export default function PagesPage() {
  const initialRows = useMemo(() => createBaseRows(), [])
  const [pages, setPages] = useState<PageRow[]>(initialRows)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function loadPageStatuses() {
      setLoading(true)
      setLoadError(null)
      try {
        const nextRows = await Promise.all(
          initialRows.map(async (row) => {
            const config = adminPageEditorConfigs[row.id]
            const timestamps: string[] = []
            let hasPublished = false

            try {
              const settingsResponse = await fetch(`/api/admin/page-settings?pageId=${row.id}`, {
                cache: 'no-store',
              })
              if (settingsResponse.ok) {
                const settings = (await settingsResponse.json()) as {
                  updatedAt?: string | null
                  publishedAt?: string | null
                }
                if (settings.updatedAt) timestamps.push(settings.updatedAt)
                if (settings.publishedAt) {
                  hasPublished = true
                  timestamps.push(settings.publishedAt)
                }
              }
            } catch {
              // keep processing with layout data only
            }

            const galleryFields = config.sections
              .flatMap((section) => section.fields)
              .filter((field) => field.type === 'gallery_layout' && field.pageKey && field.sectionKey)

            for (const field of galleryFields) {
              try {
                const layoutResponse = await fetch(
                  `/api/admin/page-layout?pageKey=${encodeURIComponent(field.pageKey!)}&sectionKey=${encodeURIComponent(field.sectionKey!)}`,
                  { cache: 'no-store' }
                )
                if (!layoutResponse.ok) continue

                const layout = (await layoutResponse.json()) as {
                  updatedAt?: string | null
                  publishedAt?: string | null
                }

                if (layout.updatedAt) timestamps.push(layout.updatedAt)
                if (layout.publishedAt) {
                  hasPublished = true
                  timestamps.push(layout.publishedAt)
                }
              } catch {
                // ignore single layout errors
              }
            }

            const latestTimestamp = timestamps
              .map((value) => new Date(value))
              .filter((value) => !Number.isNaN(value.getTime()))
              .sort((a, b) => b.getTime() - a.getTime())[0]

            const nextStatus: PageStatus = hasPublished ? 'published' : 'draft'

            return {
              ...row,
              status: nextStatus,
              lastModified: latestTimestamp ? latestTimestamp.toISOString() : null,
            }
          })
        )

        if (!active) return
        setPages(nextRows)
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar paginas.')
        setPages(initialRows)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadPageStatuses()
    return () => {
      active = false
    }
  }, [initialRows])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Pages
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your website pages content
          </p>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      {loading && (
        <div className="rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 py-10">
          <div className="flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400">
            <Loader2 size={18} className="animate-spin" />
            A carregar paginas...
          </div>
        </div>
      )}

      {!loading && (
        <div className="grid gap-4">
          {pages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center shrink-0">
                      <page.icon size={24} className="text-stone-600 dark:text-stone-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-inter text-base font-medium text-stone-900 dark:text-white">
                          {page.title}
                        </h3>
                        <span
                          className={cn(
                            'px-2 py-0.5 rounded-full font-inter text-[10px] uppercase tracking-wide',
                            page.status === 'published'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                              : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                          )}
                        >
                          {page.status}
                        </span>
                      </div>
                      <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
                        {page.slug}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {page.sections.map((section) => (
                          <span
                            key={section}
                            className="px-2 py-1 bg-stone-100 dark:bg-stone-800 rounded font-inter text-[10px] text-stone-600 dark:text-stone-400"
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-inter text-xs text-stone-400 hidden sm:block">
                      Modified {formatDate(page.lastModified)}
                    </span>
                    <a
                      href={page.slug}
                      target="_blank"
                      className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                      title="View Page"
                    >
                      <Eye size={18} />
                    </a>
                    <Link
                      href={`/admin/pages/${page.id}`}
                      className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                      title="Edit Page"
                    >
                      <Edit size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-5">
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center shrink-0">
            <FileText size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-inter text-sm font-medium text-blue-900 dark:text-blue-100">
              Page Editor
            </h3>
            <p className="font-inter text-sm text-blue-700 dark:text-blue-300 mt-1">
              Click on Edit to customize each page content. Published status reflects what is currently live.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
