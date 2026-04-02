/*
Arquivo: src/app/admin/notifications/page.tsx
Objetivo: Pagina do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bell,
  Mail,
  Users,
  FileText,
  Settings,
  Check,
  CheckCheck,
  Trash2,
  Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const notifications = [
  {
    id: '1',
    type: 'contact',
    title: 'New Contact Form Submission',
    message: 'Maria Silva submitted a contact form regarding interior design consultation.',
    time: '5 minutes ago',
    read: false,
    icon: Mail,
  },
  {
    id: '2',
    type: 'subscriber',
    title: 'New Newsletter Subscriber',
    message: 'john.doe@email.com subscribed to your newsletter.',
    time: '1 hour ago',
    read: false,
    icon: Users,
  },
  {
    id: '3',
    type: 'contact',
    title: 'New Contact Form Submission',
    message: 'Pedro Santos inquired about office space design services.',
    time: '3 hours ago',
    read: true,
    icon: Mail,
  },
  {
    id: '4',
    type: 'system',
    title: 'Project Published',
    message: 'Beach House in Troia has been published successfully.',
    time: '1 day ago',
    read: true,
    icon: FileText,
  },
  {
    id: '5',
    type: 'system',
    title: 'Settings Updated',
    message: 'Site metadata has been updated.',
    time: '2 days ago',
    read: true,
    icon: Settings,
  },
  {
    id: '6',
    type: 'subscriber',
    title: 'New Newsletter Subscriber',
    message: 'ana.costa@email.com subscribed to your newsletter.',
    time: '3 days ago',
    read: true,
    icon: Users,
  },
]

const typeColors: Record<string, string> = {
  contact: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  subscriber: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  system: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
}

export default function NotificationsPage() {
  const [notificationList, setNotificationList] = useState(notifications)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const unreadCount = notificationList.filter((n) => !n.read).length

  const filteredNotifications = notificationList.filter((n) =>
    filter === 'all' ? true : !n.read
  )

  const markAsRead = (id: string) => {
    setNotificationList((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    )
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
      {/* Header */}
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

      {/* Filters */}
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

      {/* Notifications List */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                'p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors',
                !notification.read && 'bg-blue-50/50 dark:bg-blue-900/10'
              )}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                  typeColors[notification.type]
                )}>
                  <notification.icon size={20} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <h3 className={cn(
                          'font-inter text-sm',
                          !notification.read
                            ? 'font-semibold text-stone-900 dark:text-white'
                            : 'font-medium text-stone-700 dark:text-stone-300'
                        )}>
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

                    {/* Actions */}
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

      {/* Notification Settings Link */}
      <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Settings size={20} className="text-stone-500" />
            <div>
              <p className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                Notification Preferences
              </p>
              <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                Manage how you receive notifications
              </p>
            </div>
          </div>
          <a
            href="/admin/settings"
            className="font-inter text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
          >
            Settings →
          </a>
        </div>
      </div>
    </div>
  )
}

