'use client'

import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Calendar, Eye, Loader2, Mail, Phone, Reply, Trash2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ContactStatus = 'NEW' | 'READ' | 'REPLIED' | 'ARCHIVED'

type ContactRow = {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: ContactStatus
  createdAt: string
}

const statusConfig: Record<ContactStatus, { label: string; color: string }> = {
  NEW: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  READ: { label: 'Read', color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' },
  REPLIED: { label: 'Replied', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  ARCHIVED: { label: 'Archived', color: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400' },
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<ContactRow[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | ContactStatus>('all')
  const [selectedContact, setSelectedContact] = useState<ContactRow | null>(null)

  useEffect(() => {
    let active = true

    async function loadContacts() {
      setLoading(true)
      setLoadError(null)
      try {
        const response = await fetch('/api/admin/contacts', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Nao foi possivel carregar contactos.')
        }

        const data = (await response.json()) as ContactRow[]
        if (!active) return
        setContacts(Array.isArray(data) ? data : [])
      } catch (error) {
        if (!active) return
        setLoadError(error instanceof Error ? error.message : 'Erro ao carregar contactos.')
        setContacts([])
      } finally {
        if (active) setLoading(false)
      }
    }

    void loadContacts()
    return () => {
      active = false
    }
  }, [])

  const filteredContacts = useMemo(
    () =>
      contacts.filter((contact) => {
        const searchValue = searchQuery.toLowerCase()
        const matchesSearch =
          contact.name.toLowerCase().includes(searchValue) ||
          contact.email.toLowerCase().includes(searchValue) ||
          contact.subject.toLowerCase().includes(searchValue)
        const matchesStatus = statusFilter === 'all' || contact.status === statusFilter
        return matchesSearch && matchesStatus
      }),
    [contacts, searchQuery, statusFilter]
  )

  const newCount = contacts.filter((contact) => contact.status === 'NEW').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
          Contacts
        </h1>
        <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
          {newCount} new messages waiting for response
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <Mail size={18} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          {(['all', 'NEW', 'READ', 'REPLIED', 'ARCHIVED'] as Array<'all' | ContactStatus>).map((status) => (
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
            </button>
          ))}
        </div>
      </div>

      {loadError && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {loadError}
        </div>
      )}

      <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
        {loading && (
          <div className="p-8 flex items-center justify-center gap-2 text-stone-500 dark:text-stone-400">
            <Loader2 size={18} className="animate-spin" />
            A carregar contactos...
          </div>
        )}

        {!loading &&
          filteredContacts.map((contact) => (
            <motion.div
              key={contact.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={cn(
                'p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer transition-colors',
                contact.status === 'NEW' && 'bg-blue-50/50 dark:bg-blue-900/10'
              )}
              onClick={() => setSelectedContact(contact)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={cn(
                        'font-inter text-sm',
                        contact.status === 'NEW' ? 'font-semibold text-stone-900 dark:text-white' : 'font-medium text-stone-700 dark:text-stone-300'
                      )}
                    >
                      {contact.name}
                    </h3>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-inter',
                        statusConfig[contact.status].color
                      )}
                    >
                      {statusConfig[contact.status].label}
                    </span>
                  </div>
                  <p className="font-inter text-sm font-medium text-stone-900 dark:text-white mb-1">
                    {contact.subject || '(No subject)'}
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
          ))}

        {!loading && filteredContacts.length === 0 && (
          <div className="p-12 text-center">
            <Mail size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
            <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
              No contacts found
            </p>
          </div>
        )}
      </div>

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
              <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <div>
                  <h2 className="font-inter text-lg font-medium text-stone-900 dark:text-white">
                    {selectedContact.name}
                  </h2>
                  <p className="font-inter text-sm text-stone-500 dark:text-stone-400">
                    {selectedContact.subject || '(No subject)'}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedContact(null)}
                  className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors"
                >
                  <X size={20} className="text-stone-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-4">
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                  >
                    <Mail size={16} />
                    <span className="font-inter text-sm">{selectedContact.email}</span>
                  </a>
                  {selectedContact.phone && (
                    <a
                      href={`tel:${selectedContact.phone}`}
                      className="flex items-center gap-2 px-3 py-2 bg-stone-100 dark:bg-stone-800 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                    >
                      <Phone size={16} />
                      <span className="font-inter text-sm">{selectedContact.phone}</span>
                    </a>
                  )}
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

                <div>
                  <h3 className="font-inter text-xs uppercase tracking-wide text-stone-500 dark:text-stone-400 mb-2">
                    Message
                  </h3>
                  <p className="font-inter text-sm text-stone-700 dark:text-stone-300 leading-relaxed bg-stone-50 dark:bg-stone-800 p-4 rounded-lg">
                    {selectedContact.message}
                  </p>
                </div>
              </div>

              <div className="p-6 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
                <button className="flex items-center gap-2 px-4 py-2.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-inter text-sm">
                  <Trash2 size={16} />
                  Delete
                </button>
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Contact'}`}
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
