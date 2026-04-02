/*
Arquivo: src/app/admin/media/page.tsx
Objetivo: Pagina do painel administrativo.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  Upload,
  Search,
  Grid,
  List,
  Trash2,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Film,
  File,
  MoreVertical,
  FolderPlus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const mediaFiles = [
  {
    id: '1',
    name: 'beach-house-living.jpg',
    type: 'image',
    size: '2.4 MB',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
    uploadedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'comporta-bedroom.jpg',
    type: 'image',
    size: '1.8 MB',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&q=80',
    uploadedAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'city-house-kitchen.jpg',
    type: 'image',
    size: '3.1 MB',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&q=80',
    uploadedAt: '2024-01-13',
  },
  {
    id: '4',
    name: 'duplex-dining.jpg',
    type: 'image',
    size: '2.7 MB',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&q=80',
    uploadedAt: '2024-01-12',
  },
  {
    id: '5',
    name: 'modern-bathroom.jpg',
    type: 'image',
    size: '1.5 MB',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=400&q=80',
    uploadedAt: '2024-01-11',
  },
  {
    id: '6',
    name: 'exterior-view.jpg',
    type: 'image',
    size: '4.2 MB',
    url: 'https://images.unsplash.com/photo-1600573472592-401b489a3cdc?w=400&q=80',
    uploadedAt: '2024-01-10',
  },
]

export default function MediaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filteredFiles = mediaFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleSelect = (id: string) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    )
  }

  const copyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon
      case 'video':
        return Film
      default:
        return File
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-2xl lg:text-3xl font-light text-stone-900 dark:text-white">
            Media Library
          </h1>
          <p className="font-inter text-sm text-stone-500 dark:text-stone-400 mt-1">
            {mediaFiles.length} files • 15.7 MB used
          </p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-inter text-xs tracking-wide hover:border-stone-300 dark:hover:border-stone-700 transition-colors rounded-lg">
            <FolderPlus size={16} />
            New Folder
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-wide hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors rounded-lg">
            <Upload size={16} />
            Upload Files
          </button>
        </div>
      </div>

      {/* Search & View Mode */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <Search size={18} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent font-inter text-sm text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none"
          />
        </div>
        <div className="flex gap-1 p-1 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'grid'
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            )}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={cn(
              'p-2 rounded transition-colors',
              viewMode === 'list'
                ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-white'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            )}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedFiles.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 p-4 bg-stone-100 dark:bg-stone-800 rounded-lg"
        >
          <span className="font-inter text-sm text-stone-600 dark:text-stone-400">
            {selectedFiles.length} selected
          </span>
          <button className="font-inter text-sm text-red-600 hover:text-red-700 transition-colors">
            Delete
          </button>
          <button className="font-inter text-sm text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
            Download
          </button>
        </motion.div>
      )}

      {/* Upload Area */}
      <div className="border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-xl p-8 text-center hover:border-stone-300 dark:hover:border-stone-700 transition-colors cursor-pointer">
        <Upload size={40} className="mx-auto text-stone-300 dark:text-stone-600 mb-4" />
        <p className="font-inter text-sm text-stone-600 dark:text-stone-400">
          Drag and drop files here, or{' '}
          <span className="text-stone-900 dark:text-white underline">browse</span>
        </p>
        <p className="font-inter text-xs text-stone-400 mt-2">
          Supports: JPG, PNG, GIF, MP4, PDF (Max 10MB)
        </p>
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredFiles.map((file, index) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                'group relative bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 overflow-hidden cursor-pointer',
                selectedFiles.includes(file.id) && 'ring-2 ring-stone-900 dark:ring-white'
              )}
              onClick={() => toggleSelect(file.id)}
            >
              {/* Image */}
              <div className="relative aspect-square bg-stone-100 dark:bg-stone-800">
                <Image
                  src={file.url}
                  alt={file.name}
                  fill
                  className="object-cover"
                />
                
                {/* Checkbox */}
                <div className={cn(
                  'absolute top-2 left-2 w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                  selectedFiles.includes(file.id)
                    ? 'bg-stone-900 dark:bg-white border-stone-900 dark:border-white'
                    : 'border-white/80 bg-white/20 opacity-0 group-hover:opacity-100'
                )}>
                  {selectedFiles.includes(file.id) && (
                    <Check size={12} className="text-white dark:text-stone-900" />
                  )}
                </div>

                {/* Actions */}
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyUrl(file.id, file.url)
                    }}
                    className="p-1.5 bg-white/90 dark:bg-stone-900/90 rounded-lg hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  >
                    {copiedId === file.id ? (
                      <Check size={14} className="text-emerald-500" />
                    ) : (
                      <Copy size={14} className="text-stone-600 dark:text-stone-400" />
                    )}
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1.5 bg-white/90 dark:bg-stone-900/90 rounded-lg hover:bg-white dark:hover:bg-stone-900 transition-colors"
                  >
                    <Download size={14} className="text-stone-600 dark:text-stone-400" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="font-inter text-xs text-stone-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="font-inter text-[10px] text-stone-400 mt-1">
                  {file.size}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type)
            return (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedFiles.includes(file.id)}
                  onChange={() => toggleSelect(file.id)}
                  className="w-4 h-4 rounded border-stone-300 dark:border-stone-600"
                />
                <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0">
                  <Image
                    src={file.url}
                    alt={file.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-inter text-sm text-stone-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="font-inter text-xs text-stone-400">
                    {file.size} • {file.uploadedAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyUrl(file.id, file.url)}
                    className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                  >
                    {copiedId === file.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                  <button className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors">
                    <Download size={16} />
                  </button>
                  <button className="p-2 text-stone-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

