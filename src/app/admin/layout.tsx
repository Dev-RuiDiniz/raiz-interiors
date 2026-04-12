/*
Arquivo: src/app/admin/layout.tsx
Objetivo: Layout compartilhado entre paginas da respectiva area.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/admin/sidebar'
import { Topbar } from '@/components/admin/topbar'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-stone-400 mx-auto" />
          <p className="mt-4 font-inter text-sm text-stone-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Sidebar */}
      <div className="hidden lg:block">
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />
      </div>

      {/* Topbar */}
      <Topbar
        onMenuClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isSidebarCollapsed={isSidebarCollapsed}
      />

      {/* Main Content */}
      <main
        className={cn(
          'pt-16 min-h-screen transition-all duration-300',
          isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-[280px]'
        )}
      >
        <div className="p-4 lg:p-6">{children}</div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="w-[280px] h-full bg-white dark:bg-stone-950"
            onClick={(e) => e.stopPropagation()}
          >
            <Sidebar
              isCollapsed={false}
              setIsCollapsed={() => setIsMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

