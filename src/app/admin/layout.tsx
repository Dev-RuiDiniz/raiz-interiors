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
      <div className="min-h-screen bg-[#f5f1eb] text-stone-900">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="hidden border-r border-stone-200/80 bg-white/70 px-6 py-8 backdrop-blur lg:block">
            <div className="h-10 w-28 animate-pulse rounded-full bg-stone-200/70" />
            <div className="mt-10 space-y-3">
              <div className="h-11 w-full animate-pulse rounded-2xl bg-stone-200/60" />
              <div className="h-11 w-full animate-pulse rounded-2xl bg-stone-200/50" />
              <div className="h-11 w-4/5 animate-pulse rounded-2xl bg-stone-200/40" />
            </div>
          </aside>

          <div className="flex min-h-screen flex-col">
            <div className="h-16 border-b border-stone-200/80 bg-white/65 backdrop-blur" />
            <main className="flex-1 p-4 lg:p-8">
              <div className="mx-auto max-w-6xl">
                <div className="rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_30px_80px_-40px_rgba(28,25,23,0.25)] backdrop-blur sm:p-8">
                  <div className="h-5 w-32 animate-pulse rounded-full bg-stone-200/70" />
                  <div className="mt-4 h-10 w-72 animate-pulse rounded-full bg-stone-200/60" />
                  <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
                    <div className="h-28 animate-pulse rounded-[24px] bg-stone-200/60" />
                    <div className="h-28 animate-pulse rounded-[24px] bg-stone-200/50" />
                    <div className="h-28 animate-pulse rounded-[24px] bg-stone-200/40" />
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-[#f5f1eb] text-stone-900 dark:bg-stone-950 dark:text-white">
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
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="h-full w-[300px] border-r border-stone-200/70 bg-white/95 shadow-2xl dark:border-stone-800 dark:bg-stone-950"
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
