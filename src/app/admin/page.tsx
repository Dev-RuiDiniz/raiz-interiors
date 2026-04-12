'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Calendar, FolderKanban, Globe, Loader2 } from 'lucide-react'
import Link from 'next/link'

type AdminProject = {
  id: string
  title: string
  slug: string
  status: 'PUBLISHED' | 'DRAFT' | 'WORK_IN_PROGRESS' | 'COMING_SOON'
  updatedAt: string
}

type AdminService = {
  id: string
  title: string
  slug: string
  status: 'PUBLISHED' | 'DRAFT' | 'WORK_IN_PROGRESS' | 'COMING_SOON'
  active: boolean
  updatedAt: string
}

function formatDateTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  return date.toLocaleString()
}

function statusLabel(status: AdminProject['status'] | AdminService['status']) {
  return status.replace(/_/g, ' ')
}

function statusDotClass(status: AdminProject['status'] | AdminService['status']) {
  if (status === 'PUBLISHED') return 'bg-emerald-500'
  if (status === 'WORK_IN_PROGRESS') return 'bg-amber-500'
  if (status === 'COMING_SOON') return 'bg-blue-500'
  return 'bg-stone-400'
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [projects, setProjects] = useState<AdminProject[]>([])
  const [services, setServices] = useState<AdminService[]>([])

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      setLoading(true)
      setLoadError(null)
      try {
        const [projectsResponse, servicesResponse] = await Promise.all([
          fetch('/api/admin/projects', { cache: 'no-store' }),
          fetch('/api/admin/services', { cache: 'no-store' }),
        ])

        if (!projectsResponse.ok || !servicesResponse.ok) {
          throw new Error('Nao foi possivel carregar dados do dashboard.')
        }

        const projectsData = (await projectsResponse.json()) as AdminProject[]
        const servicesData = (await servicesResponse.json()) as AdminService[]

        if (!active) return
        setProjects(Array.isArray(projectsData) ? projectsData : [])
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar dashboard.')
        setProjects([])
        setServices([])
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadDashboard()
    return () => {
      active = false
    }
  }, [])

  const stats = useMemo(() => {
    const publishedProjects = projects.filter((project) => project.status === 'PUBLISHED').length
    const activeServices = services.filter((service) => service.active).length

    return [
      {
        title: 'Total Projects',
        value: projects.length,
        icon: FolderKanban,
      },
      {
        title: 'Published Projects',
        value: publishedProjects,
        icon: FolderKanban,
      },
      {
        title: 'Total Services',
        value: services.length,
        icon: Globe,
      },
      {
        title: 'Active Services',
        value: activeServices,
        icon: Globe,
      },
    ]
  }, [projects, services])

  const recentProjects = useMemo(
    () =>
      [...projects]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 6),
    [projects]
  )

  const recentServices = useMemo(
    () =>
      [...services]
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, 6),
    [services]
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Dashboard
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            Dados reais do conteudo publicado e em edicao.
          </p>
        </div>
        <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
          <Calendar size={16} />
          <span className="font-inter text-sm">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
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
            A carregar dados do dashboard...
          </div>
        </div>
      )}

      {!loading && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center">
                    <stat.icon size={20} className="text-stone-600 dark:text-stone-400" />
                  </div>
                </div>
                <div className="mt-4">
                  <p className="font-inter text-2xl font-semibold text-stone-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
                    {stat.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800"
            >
              <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <h2 className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                  Recent Projects
                </h2>
                <Link
                  href="/admin/projects"
                  className="flex items-center gap-1 font-inter text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {recentProjects.length === 0 && (
                  <div className="p-5 font-inter text-sm text-stone-500 dark:text-stone-400">
                    Sem projetos para mostrar.
                  </div>
                )}
                {recentProjects.map((project) => (
                  <div key={project.id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-inter text-sm text-stone-900 dark:text-white">{project.title}</p>
                        <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                          {formatDateTime(project.updatedAt)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusDotClass(project.status)}`} />
                        <span className="font-inter text-xs text-stone-600 dark:text-stone-400">
                          {statusLabel(project.status)}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.25 }}
              className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800"
            >
              <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <h2 className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                  Recent Services
                </h2>
                <Link
                  href="/admin/services"
                  className="flex items-center gap-1 font-inter text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
                >
                  View all <ArrowRight size={12} />
                </Link>
              </div>
              <div className="divide-y divide-stone-100 dark:divide-stone-800">
                {recentServices.length === 0 && (
                  <div className="p-5 font-inter text-sm text-stone-500 dark:text-stone-400">
                    Sem servicos para mostrar.
                  </div>
                )}
                {recentServices.map((service) => (
                  <div key={service.id} className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-inter text-sm text-stone-900 dark:text-white">{service.title}</p>
                        <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                          {formatDateTime(service.updatedAt)}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${statusDotClass(service.status)}`} />
                        <span className="font-inter text-xs text-stone-600 dark:text-stone-400">
                          {statusLabel(service.status)}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  )
}
