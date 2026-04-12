/*
Arquivo: src/components/admin/sidebar.tsx
Objetivo: Componente de interface do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  FolderKanban,
  Layers,
  Users,
  Mail,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Image as ImageIcon,
  FileText,
  Bell,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    href: '/admin',
  },
  {
    title: 'Projects',
    icon: FolderKanban,
    href: '/admin/projects',
  },
  {
    title: 'Services',
    icon: Layers,
    href: '/admin/services',
  },
  {
    title: 'Media',
    icon: ImageIcon,
    href: '/admin/media',
  },
  {
    title: 'Contacts',
    icon: Mail,
    href: '/admin/contacts',
  },
  {
    title: 'Newsletter',
    icon: Users,
    href: '/admin/newsletter',
  },
  {
    title: 'Pages',
    icon: FileText,
    href: '/admin/pages',
  },
  {
    title: 'Notifications',
    icon: Bell,
    href: '/admin/notifications',
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/admin/settings',
  },
]

interface SidebarProps {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="fixed left-0 top-0 z-40 h-screen bg-white dark:bg-stone-950 border-r border-stone-200 dark:border-stone-800 flex flex-col"
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-stone-200 dark:border-stone-800">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Link href="/admin" className="flex items-center gap-2">
                <span className="font-cormorant text-xl font-light tracking-[0.2em] text-stone-900 dark:text-white">
                  RAIZ
                </span>
                <span className="font-inter text-[8px] tracking-[0.2em] uppercase text-stone-500 dark:text-stone-400">
                  Admin
                </span>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 dark:hover:bg-stone-900 transition-colors text-stone-500"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                      : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-900 hover:text-stone-900 dark:hover:text-white'
                  )}
                >
                  <item.icon size={20} className="shrink-0" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="font-inter text-sm whitespace-nowrap overflow-hidden"
                      >
                        {item.title}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-800">
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut size={20} className="shrink-0" />
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="font-inter text-sm"
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}

