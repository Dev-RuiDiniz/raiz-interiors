/*
Arquivo: src/app/admin/settings/page.tsx
Objetivo: Pagina do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from 'next-themes'
import {
  Globe,
  Palette,
  Bell,
  Shield,
  User,
  Mail,
  Save,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const tabs = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'profile', label: 'Profile', icon: User },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('general')
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Settings
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your site settings and preferences
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-wide hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors rounded-lg disabled:opacity-50"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-3 px-4 py-2.5 rounded-lg font-inter text-sm whitespace-nowrap transition-colors',
                  activeTab === tab.id
                    ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                    : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 p-6"
          >
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="font-inter text-lg font-medium text-stone-900 dark:text-white">
                  General Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      Site Name
                    </label>
                    <input
                      type="text"
                      defaultValue="RAIZ Interiors"
                      className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      Site Description
                    </label>
                    <textarea
                      rows={3}
                      defaultValue="Creating meaningful spaces that tell your story through thoughtful design and attention to detail."
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        defaultValue="hello@raiz-interiors.com"
                        className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                      />
                    </div>
                    <div>
                      <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue="+351 912 345 678"
                        className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      Address
                    </label>
                    <input
                      type="text"
                      defaultValue="Lisbon, Portugal"
                      className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h2 className="font-inter text-lg font-medium text-stone-900 dark:text-white">
                  Appearance
                </h2>

                <div>
                  <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-4">
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { value: 'light', icon: Sun, label: 'Light' },
                      { value: 'dark', icon: Moon, label: 'Dark' },
                      { value: 'system', icon: Monitor, label: 'System' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          'flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all',
                          theme === option.value
                            ? 'border-stone-900 dark:border-white bg-stone-50 dark:bg-stone-800'
                            : 'border-stone-200 dark:border-stone-700 hover:border-stone-300 dark:hover:border-stone-600'
                        )}
                      >
                        <option.icon
                          size={24}
                          className={cn(
                            theme === option.value
                              ? 'text-stone-900 dark:text-white'
                              : 'text-stone-400'
                          )}
                        />
                        <span
                          className={cn(
                            'font-inter text-sm',
                            theme === option.value
                              ? 'text-stone-900 dark:text-white'
                              : 'text-stone-500 dark:text-stone-400'
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-4">
                    Primary Color
                  </label>
                  <div className="flex gap-3">
                    {['#78716c', '#1c1917', '#0ea5e9', '#8b5cf6', '#f59e0b'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-stone-800 shadow-md"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="font-inter text-lg font-medium text-stone-900 dark:text-white">
                  Notification Settings
                </h2>

                <div className="space-y-4">
                  {[
                    { label: 'Email notifications for new contacts', defaultChecked: true },
                    { label: 'Email notifications for new subscribers', defaultChecked: true },
                    { label: 'Weekly summary report', defaultChecked: false },
                    { label: 'Browser push notifications', defaultChecked: false },
                  ].map((option) => (
                    <label
                      key={option.label}
                      className="flex items-center justify-between p-4 bg-stone-50 dark:bg-stone-800 rounded-lg cursor-pointer"
                    >
                      <span className="font-inter text-sm text-stone-700 dark:text-stone-300">
                        {option.label}
                      </span>
                      <input
                        type="checkbox"
                        defaultChecked={option.defaultChecked}
                        className="w-5 h-5 rounded border-stone-300 dark:border-stone-600"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="font-inter text-lg font-medium text-stone-900 dark:text-white">
                  Security Settings
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                    />
                  </div>

                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>

                <button className="px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-wide hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors rounded-lg">
                  Update Password
                </button>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-inter text-lg font-medium text-stone-900 dark:text-white">
                  Profile Settings
                </h2>

                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-stone-200 dark:bg-stone-700 rounded-full flex items-center justify-center">
                    <User size={32} className="text-stone-400" />
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-wide rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors">
                      Upload Photo
                    </button>
                    <p className="mt-2 font-inter text-xs text-stone-500 dark:text-stone-400">
                      JPG, PNG or GIF. Max 2MB.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                    />
                  </div>
                  <div>
                    <label className="block font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@raiz-interiors.com"
                      className="w-full h-12 px-4 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg font-inter text-sm text-stone-900 dark:text-white focus:outline-none focus:border-stone-400"
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

