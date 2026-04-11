'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Check, CheckCheck, Clock, Mail, Settings, Trash2, Users } from 'lucide-react'
import { cn } from '@/lib/utils'

type ContactNotification = {
  id: string
  name: string
  email: string
  subject: string
  createdAt: string
}

type SubscriberNotification = {
  id: string
  email: string
  active: boolean
  createdAt: string
}

type NotificationItem = {
  id: string
  type: 'contact' | 'subscriber' | 'system'
  title: string
  message: string
  time: string
  timestamp: string
  read: boolean
}

const typeColors: Record<NotificationItem['type'], string> = {
  contact: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  subscriber: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  system: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

function relativeTime(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '-'
  const diff = Date.now() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes} minutes ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.floor(hours / 24)
  return `${days} days ago`
}

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    let active = true

    async function loadNotifications() {
      setLoading(true)
      setLoadError(null)
      try {
        const [contactsResponse, newsletterResponse] = await Promise.all([
          fetch('/api/admin/contacts', { cache: 'no-store' }),
          fetch('/api/admin/newsletter', { cache: 'no-store' }),
        ])

        if (!contactsResponse.ok || !newsletterResponse.ok) {
          throw new Error('Nao foi possivel carregar notificacoes.')
        }

        const contacts = (await contactsResponse.json()) as ContactNotification[]
        const subscribers = (await newsletterResponse.json()) as SubscriberNotification[]

        const contactItems: NotificationItem[] = contacts.slice(0, 25).map((contact) => ({
          id: `contact:${contact.id}`,
          type: 'contact',
          title: 'New Contact Form Submission',
          message: `${contact.name} (${contact.email}) sent "${contact.subject || 'No subject'}".`,
          time: relativeTime(contact.createdAt),
          timestamp: contact.createdAt,
          read: false,
        }))

        const subscriberItems: NotificationItem[] = subscribers
          .filter((subscriber) => subscriber.active)
          .slice(0, 25)
          .map((subscriber) => ({
            id: `subscriber:${subscriber.id}`,
            type: 'subscriber',
            title: 'New Newsletter Subscriber',
            message: `${subscriber.email} subscribed to your newsletter.`,
            time: relativeTime(subscriber.createdAt),
            timestamp: subscriber.createdAt,
            read: false,
          }))

        const merged = [...contactItems, ...subscriberItems]
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 50)

        if (!active) return
        setNotificationList(merged)
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar notificacoes.')
        setNotificationList([])
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadNotifications()
    return () => {
      active = false
    }
  }, [])

  const unreadCount = notificationList.filter((n) => !n.read).length

  const filteredNotifications = useMemo(
    () => notificationList.filter((n) => (filter === 'all' ? true : !n.read)),
    [filter, notificationList]
  )

  const markAsRead = (id: string) => {
    setNotificationList((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotificationList((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotificationList((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAll = () => {
    setNotificationList([])
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Notifications
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
          </p>
        </div>
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-inter text-xs tracking-wide hover:border-stone-300 dark:hover:border-stone-700 transition-colors rounded-lg"
            >
              <CheckCheck size={16} />
              Mark all as read
            </button>
          )}
          {notificationList.length > 0 && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-red-600 dark:text-red-400 font-inter text-xs tracking-wide hover:border-red-300 dark:hover:border-red-700 transition-colors rounded-lg"
            >
              <Trash2 size={16} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn(
            'px-4 py-2 rounded-lg font-inter text-xs transition-colors',
            filter === 'all'
              ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
          )}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn(
            'px-4 py-2 rounded-lg font-inter text-xs transition-colors',
            filter === 'unread'
              ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
          )}
        >
          Unread
          {unreadCount > 0 && (
            <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-flex items-center gap-2 text-stone-500 dark:text-stone-400">
              <Clock size={16} />
              Loading notifications...
            </div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.03 }}
              className={cn(
                'p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors',
                !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
              )}
            >
              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                    typeColors[notification.type]
                  )}
                >
                  {notification.type === 'contact' && <Mail size={20} />}
                  {notification.type === 'subscriber' && <Users size={20} />}
                  {notification.type === 'system' && <Settings size={20} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <h3
                          className={cn(
                            'font-inter text-sm',
                            !notification.read
                              ? 'font-semibold text-stone-900 dark:text-white'
                              : 'font-medium text-stone-700 dark:text-stone-300'
                          )}
                        >
                          {notification.title}
                        </h3>
                      </div>
                      <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-1 mt-2 text-stone-400">
                        <Clock size={12} />
                        <span className="font-inter text-xs">{notification.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {!notification.read && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="p-2 text-stone-400 hover:text-emerald-500 transition-colors"
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="p-12 text-center">
            <Bell size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
            <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
              {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
