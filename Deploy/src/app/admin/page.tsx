/*
Arquivo: src/app/admin/page.tsx
Objetivo: Arquivo de codigo da aplicacao.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { motion } from 'framer-motion'
import {
  FolderKanban,
  Users,
  Mail,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Calendar,
  Clock,
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  {
    title: 'Total Projects',
    value: '24',
    change: '+3',
    trend: 'up',
    icon: FolderKanban,
    color: 'bg-blue-500',
  },
  {
    title: 'Page Views',
    value: '12.5K',
    change: '+18%',
    trend: 'up',
    icon: Eye,
    color: 'bg-emerald-500',
  },
  {
    title: 'Contacts',
    value: '48',
    change: '+12',
    trend: 'up',
    icon: Mail,
    color: 'bg-amber-500',
  },
  {
    title: 'Subscribers',
    value: '892',
    change: '+24',
    trend: 'up',
    icon: Users,
    color: 'bg-purple-500',
  },
]

const recentContacts = [
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@email.com',
    subject: 'Project Inquiry',
    time: '2 hours ago',
  },
  {
    id: 2,
    name: 'John Doe',
    email: 'john@email.com',
    subject: 'Interior Design',
    time: '5 hours ago',
  },
  {
    id: 3,
    name: 'Ana Costa',
    email: 'ana@email.com',
    subject: 'Consultation Request',
    time: '1 day ago',
  },
]

const recentProjects = [
  {
    id: 1,
    title: 'Beach House in Troia',
    status: 'In Progress',
    statusColor: 'bg-amber-500',
    updated: '2 hours ago',
  },
  {
    id: 2,
    title: 'Summer House in Comporta',
    status: 'Published',
    statusColor: 'bg-emerald-500',
    updated: '1 day ago',
  },
  {
    id: 3,
    title: 'Contemporary City House',
    status: 'Draft',
    statusColor: 'bg-stone-400',
    updated: '3 days ago',
  },
]

const activities = [
  {
    id: 1,
    action: 'New contact form submission',
    detail: 'from maria@email.com',
    time: '2 hours ago',
  },
  {
    id: 2,
    action: 'Project updated',
    detail: 'Beach House in Troia',
    time: '3 hours ago',
  },
  {
    id: 3,
    action: 'New newsletter subscriber',
    detail: 'john@example.com',
    time: '5 hours ago',
  },
  {
    id: 4,
    action: 'Settings changed',
    detail: 'Site metadata updated',
    time: '1 day ago',
  },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Dashboard
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            Welcome back! Here's what's happening with your site.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-white dark:bg-stone-900 rounded-xl p-5 border border-stone-200 dark:border-stone-800"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={20} className="text-white" />
              </div>
              <div className={`flex items-center gap-1 font-inter text-xs ${
                stat.trend === 'up' ? 'text-emerald-500' : 'text-red-500'
              }`}>
                {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.change}
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800"
        >
          <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <h2 className="font-inter text-sm font-medium text-stone-900 dark:text-white">
              Recent Contacts
            </h2>
            <Link
              href="/admin/contacts"
              className="flex items-center gap-1 font-inter text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-stone-100 dark:divide-stone-800">
            {recentContacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-inter text-sm font-medium text-stone-900 dark:text-white">
                      {contact.name}
                    </p>
                    <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                      {contact.email}
                    </p>
                    <p className="font-inter text-xs text-stone-400 dark:text-stone-500 mt-1">
                      {contact.subject}
                    </p>
                  </div>
                  <span className="font-inter text-[10px] text-stone-400 flex items-center gap-1">
                    <Clock size={10} />
                    {contact.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800"
        >
          <div className="p-5 border-b border-stone-200 dark:border-stone-800">
            <h2 className="font-inter text-sm font-medium text-stone-900 dark:text-white">
              Recent Activity
            </h2>
          </div>
          <div className="p-4 space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="w-2 h-2 mt-1.5 bg-stone-300 dark:bg-stone-600 rounded-full shrink-0" />
                <div>
                  <p className="font-inter text-sm text-stone-900 dark:text-white">
                    {activity.action}
                  </p>
                  <p className="font-inter text-xs text-stone-500 dark:text-stone-400">
                    {activity.detail}
                  </p>
                  <p className="font-inter text-[10px] text-stone-400 dark:text-stone-500 mt-0.5">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Projects Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.6 }}
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800">
                <th className="px-5 py-3 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Project
                </th>
                <th className="px-5 py-3 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-5 py-3 text-left font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Last Updated
                </th>
                <th className="px-5 py-3 text-right font-inter text-xs font-medium text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {recentProjects.map((project) => (
                <tr
                  key={project.id}
                  className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="font-inter text-sm text-stone-900 dark:text-white">
                      {project.title}
                    </p>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${project.statusColor}`} />
                      <span className="font-inter text-xs text-stone-600 dark:text-stone-400">
                        {project.status}
                      </span>
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="font-inter text-xs text-stone-500 dark:text-stone-400">
                      {project.updated}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button className="font-inter text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors">
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

