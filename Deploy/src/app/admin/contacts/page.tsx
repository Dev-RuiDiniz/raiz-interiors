/*
Arquivo: src/app/admin/contacts/page.tsx
Objetivo: Pagina do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Mail,
  Phone,
  Calendar,
  Eye,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Reply,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const contacts = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@email.com',
    phone: '+351 912 345 678',
    subject: 'Interior Design Consultation',
    message: 'Hello, I am interested in scheduling a consultation for my new apartment in Lisbon. I would like to discuss a complete interior design project for a 150m² space. Looking forward to hearing from you.',
    status: 'new',
    createdAt: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+351 923 456 789',
    subject: 'Beach House Project',
    message: 'Hi, I saw your beautiful Beach House project in Troia. We have a similar property in Comporta and would love to discuss a potential project with your team.',
    status: 'read',
    createdAt: '2024-01-14T15:45:00',
  },
  {
    id: '3',
    name: 'Ana Costa',
    email: 'ana.costa@email.com',
    phone: '+351 934 567 890',
    subject: 'Renovation Inquiry',
    message: 'Good afternoon, I would like to inquire about your renovation services. We have a 1920s building in Porto that needs a complete makeover while preserving its original character.',
    status: 'replied',
    createdAt: '2024-01-13T09:15:00',
  },
  {
    id: '4',
    name: 'Pedro Santos',
    email: 'pedro.santos@email.com',
    phone: '+351 945 678 901',
    subject: 'Office Space Design',
    message: 'Hello, our company is moving to a new office space and we need professional interior design services. The space is approximately 500m² in central Lisbon.',
    status: 'new',
    createdAt: '2024-01-12T14:20:00',
  },
]

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: Clock },
  read: { label: 'Read', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', icon: Eye },
  replied: { label: 'Replied', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400', icon: CheckCircle },
}

export default function ContactsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedContact, setSelectedContact] = useState<typeof contacts[0] | null>(null)

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const newCount = contacts.filter((c) => c.status === 'new').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
          Contacts
        </h1>
        <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
          {newCount} new messages waiting for response
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <Search size={18} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {['all', 'new', 'read', 'replied'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-4 py-2.5 rounded-lg font-inter text-xs uppercase tracking-wide transition-colors',
                statusFilter === status
                  ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900'
                  : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
              )}
            >
              {status}
              {status === 'new' && newCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-[10px] rounded-full">
                  {newCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contact List */}
      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
        {filteredContacts.map((contact) => {
          const StatusIcon = statusConfig[contact.status].icon
          return (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors',
                contact.status === 'new' && 'bg-blue-50/50 dark:bg-blue-900/10'
              )}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={cn(
                      'font-inter text-sm',
                      contact.status === 'new' ? 'font-semibold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-300'
                    )}>
                      {contact.name}
                    </h3>
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-inter',
                      statusConfig[contact.status].color
                    )}>
                      <StatusIcon size={10} />
                      {statusConfig[contact.status].label}
                    </span>
                  </div>
                  <p className="font-inter text-sm font-medium text-stone-900 dark:text-white mb-1">
                    {contact.subject}
                  </p>
                  <p className="font-inter text-xs text-stone-500 dark:text-stone-400 line-clamp-2">
                    {contact.message}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-inter text-xs text-stone-400">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </p>
                  <p className="font-inter text-xs text-stone-400">
                    {new Date(contact.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}

        {filteredContacts.length === 0 && (
          <div className="p-12 text-center">
            <Mail size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
            <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
              No contacts found
            </p>
          </div>
        )}
      </div>

      {/* Contact Detail Modal */}
      <AnimatePresence>
        {selectedContact && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setSelectedContact(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-white dark:bg-stone-900 rounded-xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h2 className="font-inter text-lg font-medium text-stone-900 dark:text-white">
                    {selectedContact.name}
                  </h2>
                  <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
                    {selectedContact.subject}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-stone-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Contact Info */}
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    <Mail size={16} />
                    <span className="font-inter text-sm">{selectedContact.email}</span>
                  </a>
                  <a
                    href={`tel:${selectedContact.phone}`}
                    className="flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    <Phone size={16} />
                    <span className="font-inter text-sm">{selectedContact.phone}</span>
                  </a>
                  <div className="flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-500 dark:text-stone-400">
                    <Calendar size={16} />
                    <span className="font-inter text-sm">
                      {new Date(selectedContact.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <h3 className="font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                    Message
                  </h3>
                  <p className="font-inter text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800 p-4 rounded-lg">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-inter text-sm">
                  <Trash2 size={16} />
                  Delete
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors font-inter text-sm"
                >
                  <Reply size={16} />
                  Reply via Email
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

