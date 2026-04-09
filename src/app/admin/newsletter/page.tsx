'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Download, Loader2, Mail, Search, Send, Trash2, TrendingUp, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type Subscriber = {
  id: string
  email: string
  active: boolean
  createdAt: string
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([])

  useEffect(() => {
    let active = true

    async function loadSubscribers() {
      setLoading(true)
      setLoadError(null)
      try {
        const response = await fetch('/api/admin/newsletter', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Nao foi possivel carregar newsletter.')
        }
        const data = (await response.json()) as Subscriber[]
        if (!active) return
        setSubscribers(Array.isArray(data) ? data : [])
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar newsletter.')
        setSubscribers([])
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadSubscribers()
    return () => {
      active = false
    }
  }, [])

  const filteredSubscribers = useMemo(
    () =>
      subscribers.filter((sub) =>
        sub.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [subscribers, searchQuery]
  )

  const activeSubscribers = subscribers.filter((sub) => sub.active).length
  const inactiveSubscribers = subscribers.length - activeSubscribers
  const growthRate = subscribers.length > 0 ? Math.round((activeSubscribers / subscribers.length) * 100) : 0

  const stats = [
    { label: 'Total Subscribers', value: String(subscribers.length), icon: Users, change: 'Live data' },
    { label: 'Active', value: String(activeSubscribers), icon: Mail, change: `${growthRate}% of total` },
    { label: 'Inactive', value: String(inactiveSubscribers), icon: TrendingUp, change: 'Require review' },
  ]

  const toggleSelect = (id: string) => {
    setSelectedSubscribers((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedSubscribers.length === filteredSubscribers.length) {
      setSelectedSubscribers([])
    } else {
      setSelectedSubscribers(filteredSubscribers.map((s) => s.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Newsletter
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            Manage your email subscribers
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-inter text-xs tracking-wide hover:border-stone-300 dark:hover:border-stone-700 transition-colors rounded-lg">
            <Download size={16} />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-wide hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors rounded-lg">
            <Send size={16} />
            Send Campaign
          </button>
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-lg flex items-center justify-center">
                <stat.icon size={20} className="text-stone-600 dark:text-stone-400" />
              </div>
              <div>
                <p className="font-inter text-2xl font-semibold text-stone-900 dark:text-white">
                  {stat.value}
                </p>
                <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                  {stat.label}
                </p>
              </div>
            </div>
            <p className="mt-3 font-inter text-xs text-emerald-600 dark:text-emerald-400">
              {stat.change}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <Search size={18} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
        </div>
      </div>

      {selectedSubscribers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg"
        >
          <span className="font-inter text-sm text-stone-600 dark:text-stone-400">
            {selectedSubscribers.length} selected
          </span>
          <button className="font-inter text-sm text-red-600 hover:text-red-700 transition-colors">
            Delete
          </button>
          <button className="font-inter text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
            Export Selected
          </button>
        </motion.div>
      )}

      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800/50">
                <th className="px-5 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
                  />
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-4 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Subscribed
                </th>
                <th className="px-5 py-4 text-right font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {loading && (
                <tr>
                  <td colSpan={5} className="px-5 py-8">
                    <div className="flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400">
                      <Loader2 size={16} className="animate-spin" />
                      A carregar subscritores...
                    </div>
                  </td>
                </tr>
              )}

              {!loading && filteredSubscribers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center font-inter text-sm text-stone-500 dark:text-stone-400">
                    No subscribers found
                  </td>
                </tr>
              )}

              {filteredSubscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onChange={() => toggleSelect(subscriber.id)}
                      className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
                    />
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-inter text-sm text-stone-900 dark:text-white">
                      {subscriber.email}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className={cn(
                        'inline-flex px-2.5 py-1 rounded-full font-inter text-xs',
                        subscriber.active
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                      )}
                    >
                      {subscriber.active ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400">
                      <Calendar size={14} />
                      <span className="font-inter text-sm">
                        {new Date(subscriber.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
            Showing {filteredSubscribers.length} of {subscribers.length} subscribers
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
