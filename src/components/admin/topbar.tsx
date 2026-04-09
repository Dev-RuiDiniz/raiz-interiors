/*
Arquivo: src/components/admin/topbar.tsx
Objetivo: Componente de interface do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { useSession } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  Search,
  Moon,
  Sun,
  Globe,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'pt', label: 'Português', flag: '🇵🇹' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
]

const notifications = [
  {
    id: 1,
    title: 'New contact form submission',
    message: 'John Doe submitted a contact form',
    time: '5 min ago',
    unread: true,
  },
  {
    id: 2,
    title: 'New newsletter subscriber',
    message: 'jane@example.com subscribed',
    time: '1 hour ago',
    unread: true,
  },
  {
    id: 3,
    title: 'Project updated',
    message: 'Beach House in Troia was updated',
    time: '2 hours ago',
    unread: false,
  },
]

interface TopbarProps {
  onMenuClick: () => void
  isSidebarCollapsed: boolean
}

export function Topbar({ onMenuClick, isSidebarCollapsed }: TopbarProps) {
  const { theme, setTheme } = useTheme()
  const { data: session } = useSession()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showLanguages, setShowLanguages] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentLang, setCurrentLang] = useState(languages[0])
  const [searchQuery, setSearchQuery] = useState('')

  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <header
      className={cn(
        'fixed top-0 right-0 z-30 h-16 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 transition-all duration-300',
        isSidebarCollapsed ? 'left-20' : 'left-[280px]'
      )}
    >
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left Side */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg transition-colors"
          >
            <Menu size={20} className="text-stone-600 dark:text-stone-400" />
          </button>

          {/* Search */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-stone-100 dark:bg-stone-900 rounded-lg w-64 lg:w-80">
            <Search size={18} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
            />
            <kbd className="hidden lg:inline-flex items-center px-2 py-0.5 bg-white dark:bg-stone-800 rounded text-[10px] font-inter text-stone-400 border border-stone-200 dark:border-stone-700">
              ⌘K
            </kbd>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* View Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 px-3 py-2 text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            <ExternalLink size={16} />
            <span className="font-inter text-xs">View Site</span>
          </a>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLanguages(!showLanguages)
                setShowNotifications(false)
                setShowProfile(false)
              }}
              className="flex items-center gap-2 px-3 py-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg transition-colors"
            >
              <Globe size={18} className="text-stone-600 dark:text-stone-400" />
              <span className="hidden sm:inline font-inter text-xs text-stone-600 dark:text-stone-400">
                {currentLang.flag}
              </span>
            </button>

            <AnimatePresence>
              {showLanguages && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50"
                >
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setCurrentLang(lang)
                        setShowLanguages(false)
                      }}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-2 font-inter text-sm transition-colors',
                        currentLang.code === lang.code
                          ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white'
                          : 'text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800'
                      )}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg transition-colors"
          >
            {theme === 'dark' ? (
              <Sun size={18} className="text-stone-400" />
            ) : (
              <Moon size={18} className="text-stone-600" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications)
                setShowLanguages(false)
                setShowProfile(false)
              }}
              className="relative p-2 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg transition-colors"
            >
              <Bell size={18} className="text-stone-600 dark:text-stone-400" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-inter font-medium flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-800 z-50"
                >
                  <div className="p-4 border-b border-stone-200 dark:border-stone-800">
                    <h3 className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={cn(
                          'p-4 border-b border-stone-100 dark:border-stone-800 last:border-0 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors cursor-pointer',
                          notification.unread && 'bg-stone-50 dark:bg-stone-800/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {notification.unread && (
                            <span className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full shrink-0" />
                          )}
                          <div className={cn(!notification.unread && 'ml-5')}>
                            <p className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                              {notification.title}
                            </p>
                            <p className="font-inter text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="font-inter text-[10px] text-stone-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 border-t border-stone-200 dark:border-stone-800">
                    <button className="w-full text-center font-inter text-xs text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                      View all notifications
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfile(!showProfile)
                setShowLanguages(false)
                setShowNotifications(false)
              }}
              className="flex items-center gap-2 px-2 py-1.5 hover:bg-stone-100 dark:hover:bg-stone-900 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-stone-200 dark:bg-stone-800 rounded-full flex items-center justify-center">
                <User size={16} className="text-stone-600 dark:text-stone-400" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="font-inter text-sm text-stone-900 dark:text-white">
                  {session?.user?.name || 'Admin'}
                </p>
              </div>
              <ChevronDown size={14} className="text-stone-400" />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-stone-900 rounded-lg shadow-xl border border-stone-200 dark:border-stone-800 py-2 z-50"
                >
                  <div className="px-4 py-3 border-b border-stone-200 dark:border-stone-800">
                    <p className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                      {session?.user?.name || 'Admin'}
                    </p>
                    <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                      {session?.user?.email}
                    </p>
                  </div>
                  <div className="py-2">
                    <a
                      href="/admin/settings"
                      className="flex items-center gap-3 px-4 py-2 font-inter text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800 transition-colors"
                    >
                      <Settings size={16} />
                      Settings
                    </a>
                    <button
                      onClick={() => signOut({ callbackUrl: '/login' })}
                      className="w-full flex items-center gap-3 px-4 py-2 font-inter text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  )
}

