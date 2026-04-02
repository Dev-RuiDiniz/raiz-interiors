/*
Arquivo: src/app/admin/pages/page.tsx
Objetivo: Pagina do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  FileText,
  Edit,
  Eye,
  Globe,
  Home,
  Users,
  Briefcase,
  Lock,
  Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const pages = [
  {
    id: 'home',
    title: 'Home',
    slug: '/',
    icon: Home,
    status: 'published',
    lastModified: '2024-01-15',
    sections: ['Hero', 'Intro', 'Featured Projects', 'Services Preview', 'About Preview'],
  },
  {
    id: 'projects',
    title: 'Projects',
    slug: '/projects',
    icon: Briefcase,
    status: 'published',
    lastModified: '2024-01-14',
    sections: ['Hero', 'Projects Grid', 'Categories Filter'],
  },
  {
    id: 'services',
    title: 'Services',
    slug: '/services',
    icon: Globe,
    status: 'published',
    lastModified: '2024-01-13',
    sections: ['Hero', 'Services Grid', 'Process', 'CTA'],
  },
  {
    id: 'about',
    title: 'About',
    slug: '/about',
    icon: Users,
    status: 'published',
    lastModified: '2024-01-12',
    sections: ['Hero', 'Philosophy', 'Founder', 'Values', 'Instagram', 'CTA'],
  },
  {
    id: 'contact',
    title: 'Contact',
    slug: '/contact',
    icon: Mail,
    status: 'published',
    lastModified: '2026-03-11',
    sections: ['Hero', 'Contact Info', 'Form', 'Photos Layout'],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    slug: '/privacy',
    icon: Lock,
    status: 'draft',
    lastModified: '2024-01-10',
    sections: ['Content'],
  },
]

export default function PagesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Pages List */}
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
                {/* Page Info */}
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

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="font-inter text-xs text-stone-400 hidden sm:block">
                    Modified {page.lastModified}
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

      {/* Info Card */}
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
              Click on "Edit" to customize each page's content, including hero images, 
              text blocks, and section visibility. Changes are saved automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
