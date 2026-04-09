'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Edit, Eye, GripVertical, Loader2, Plus, Search, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

type AdminServiceRow = {
  id: string
  title: string
  slug: string
  description: string
  image: string
  order: number
  active: boolean
}

export default function ServicesPage() {
  const [services, setServices] = useState<AdminServiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true

    async function fetchServices() {
      setLoading(true)
      setLoadError(null)
      try {
        const response = await fetch('/api/admin/services', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Nao foi possivel carregar servicos.')
        }

        const data = (await response.json()) as Array<{
          id: string
          slug: string
          title: string
          subtitle: string | null
          description: string | null
          coverImage: string | null
          order: number
          active: boolean
        }>

        if (!active || !Array.isArray(data)) return

        setServices(
          data.map((service) => ({
            id: service.id,
            slug: service.slug,
            title: service.title,
            description: service.description || service.subtitle || '',
            image: service.coverImage || '',
            order: service.order,
            active: service.active,
          }))
        )
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar servicos.')
        setServices([])
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void fetchServices()
    return () => {
      active = false
    }
  }, [])

  const filteredServices = services.filter((service) =>
    service.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Services
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your service offerings
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-wide hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors rounded-lg"
        >
          <Plus size={16} />
          New Service
        </Link>
      </div>

      <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg max-w-md">
        <Search size={18} className="text-stone-400" />
        <input
          type="text"
          placeholder="Search services..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
        />
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
            A carregar servicos...
          </div>
        </div>
      )}

      {!loading && filteredServices.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={cn(
                'bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden group',
                !service.active && 'opacity-60'
              )}
            >
              <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-800">
                {service.image ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-stone-400 font-inter text-xs">
                    Sem imagem
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                <button className="absolute top-3 left-3 p-1.5 bg-white/90 dark:bg-stone-900/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                  <GripVertical size={16} className="text-stone-500" />
                </button>

                {!service.active && (
                  <span className="absolute top-3 right-3 px-2 py-1 bg-stone-900/80 text-white text-[10px] font-inter uppercase tracking-wide rounded">
                    Inactive
                  </span>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                      {service.title}
                    </h3>
                    <p className="font-inter text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2">
                      {service.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <span className="font-inter text-xs text-stone-400">
                    Order: {service.order}
                  </span>
                  <div className="flex items-center gap-1">
                    <a
                      href={`/services/${service.slug}`}
                      target="_blank"
                      className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    >
                      <Eye size={16} />
                    </a>
                    <Link
                      href={`/admin/services/${service.id}`}
                      className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                    >
                      <Edit size={16} />
                    </Link>
                    <button className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
            Nenhum servico encontrado
          </p>
        </div>
      )}
    </div>
  )
}
