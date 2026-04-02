/*
Arquivo: src/app/admin/services/page.tsx
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
  Edit,
  Trash2,
  Eye,
  GripVertical,
  MoreVertical,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { defaultServices } from '@/lib/cms/default-services'

type AdminServiceRow = {
  id: string
  title: string
  slug: string
  description: string
  image: string
  order: number
  active: boolean
}

const defaultAdminServices: AdminServiceRow[] = defaultServices.map((service) => ({
  id: service.id,
  title: service.title,
  slug: service.slug,
  description: service.excerpt,
  image: service.image,
  order: service.order,
  active: service.status === 'PUBLISHED',
}))

export default function ServicesPage() {
  const [services, setServices] = useState<AdminServiceRow[]>(defaultAdminServices)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    let active = true

    async function fetchServices() {
      try {
        const response = await fetch('/api/admin/services', { cache: 'no-store' })
        if (!response.ok) return

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

        if (!active || !Array.isArray(data) || data.length === 0) return

        setServices(
          data.map((service) => ({
            id: service.id,
            slug: service.slug,
            title: service.title,
            description: service.description || service.subtitle || '',
            image: service.coverImage || '/2026/services/interior_design.jpg',
            order: service.order,
            active: service.active,
          }))
        )
      } catch {
        // fallback mantém defaults
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
      {/* Header */}
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

      {/* Search */}
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

      {/* Services Grid */}
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
            {/* Image */}
            <div className="relative aspect-[16/10] bg-stone-100 dark:bg-stone-800">
              <Image
                src={service.image}
                alt={service.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
              
              {/* Drag Handle */}
              <button className="absolute top-3 left-3 p-1.5 bg-white/90 dark:bg-stone-900/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                <GripVertical size={16} className="text-stone-500" />
              </button>

              {/* Status Badge */}
              {!service.active && (
                <span className="absolute top-3 right-3 px-2 py-1 bg-stone-900/80 text-white text-[10px] font-inter uppercase tracking-wide rounded">
                  Inactive
                </span>
              )}
            </div>

            {/* Content */}
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

              {/* Actions */}
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

      {filteredServices.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800">
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
            No services found
          </p>
        </div>
      )}
    </div>
  )
}
