/*
Arquivo: src/app/admin/projects/page.tsx
Objetivo: Pagina do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Copy,
  ChevronDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultProjects } from '@/lib/cms/default-projects'
type AdminProjectRow = {
  id: string
  title: string
  slug: string
  location: string
  category: string
  status: 'PUBLISHED' | 'DRAFT' | 'WORK_IN_PROGRESS' | 'COMING_SOON'
  featured: boolean
  image: string
  updatedAt: string
}

const defaultAdminProjects: AdminProjectRow[] = defaultProjects.map((project) => ({
  id: project.id,
  title: project.title,
  slug: project.slug,
  location: project.location,
  category: project.category,
  status: project.status,
  featured: project.status === 'PUBLISHED',
  image: project.coverImage,
  updatedAt: '2026-03-11',
}))

const statusColors: Record<string, { bg: string; text: string }> = {
  PUBLISHED: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', text: 'text-emerald-700 dark:text-emerald-400' },
  DRAFT: { bg: 'bg-stone-100 dark:bg-stone-800', text: 'text-stone-600 dark:text-stone-400' },
  WORK_IN_PROGRESS: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
  COMING_SOON: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<AdminProjectRow[]>(defaultAdminProjects)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedProjects, setSelectedProjects] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    async function fetchProjects() {
      try {
        const response = await fetch('/api/admin/projects', { cache: 'no-store' })
        if (!response.ok) return
        const data = (await response.json()) as Array<{
          id: string
          title: string
          slug: string
          location: string
          category: string
          status: AdminProjectRow['status']
          featured: boolean
          coverImage: string
          updatedAt: string
        }>
        if (!active || !Array.isArray(data) || data.length === 0) return

        setProjects(
          data.map((project) => ({
            id: project.id,
            title: project.title,
            slug: project.slug,
            location: project.location,
            category: project.category,
            status: project.status,
            featured: project.featured,
            image: project.coverImage,
            updatedAt: project.updatedAt,
          }))
        )
      } catch {
        // fallback mantém defaults
      }
    }

    void fetchProjects()
    return () => {
      active = false
    }
  }, [])

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleSelect = (id: string) => {
    setSelectedProjects((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([])
    } else {
      setSelectedProjects(filteredProjects.map((p) => p.id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Projects
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your portfolio projects
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-wide hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors rounded-lg"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <Search size={18} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(showDropdown === 'filter' ? null : 'filter')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg font-inter text-sm text-stone-600 dark:text-stone-400 hover:border-stone-300 dark:hover:border-stone-700 transition-colors"
          >
            <Filter size={16} />
            Status
            <ChevronDown size={14} />
          </button>

          {showDropdown === 'filter' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-10"
            >
              {['all', 'PUBLISHED', 'DRAFT', 'WORK_IN_PROGRESS', 'COMING_SOON'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setStatusFilter(status)
                    setShowDropdown(null)
                  }}
                  className={cn(
                    'w-full px-4 py-2 text-left font-inter text-sm transition-colors',
                    statusFilter === status
                      ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                  )}
                >
                  {status === 'all' ? 'All Statuses' : status.replace(/_/g, ' ')}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProjects.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg"
        >
          <span className="font-inter text-sm text-stone-600 dark:text-stone-400">
            {selectedProjects.length} selected
          </span>
          <button className="font-inter text-sm text-red-600 hover:text-red-700 transition-colors">
            Delete
          </button>
          <button className="font-inter text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
            Change Status
          </button>
        </motion.div>
      )}

      {/* Projects Table */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <th className="px-5 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
                  />
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-5 py-4 text-right font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedProjects.includes(project.id)}
                      onChange={() => toggleSelect(project.id)}
                      className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                          {project.title}
                        </p>
                        <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                          {project.location}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-inter text-sm text-stone-600 dark:text-stone-400">
                      {project.category}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 rounded-full font-inter text-xs',
                        statusColors[project.status]?.bg,
                        statusColors[project.status]?.text
                      )}
                    >
                      {project.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      'inline-flex w-8 h-5 rounded-full transition-colors',
                      project.featured ? 'bg-emerald-500' : 'bg-stone-300 dark:bg-stone-700'
                    )}>
                      <span className={cn(
                        'w-4 h-4 mt-0.5 rounded-full bg-white shadow transition-transform',
                        project.featured ? 'translate-x-3.5' : 'translate-x-0.5'
                      )} />
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-inter text-sm text-stone-500 dark:text-stone-400">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`/projects/${project.slug}`}
                        target="_blank"
                        className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                        title="View"
                      >
                        <Eye size={16} />
                      </a>
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </Link>
                      <button
                        className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-5 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 font-inter text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 rounded transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 font-inter text-sm bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded">
              1
            </button>
            <button className="px-3 py-1.5 font-inter text-sm text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white border border-stone-200 dark:border-stone-700 rounded transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
