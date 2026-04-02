'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Loader2, Plus } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function AdminServiceCreatePage() {
  const router = useRouter()
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [form, setForm] = useState({
    slug: '',
    title: '',
    subtitle: '',
    description: '',
    coverImage: '',
    icon: '',
    features: [] as string[],
    order: 0,
    status: 'DRAFT',
    active: true,
  })

  const onCreate = async () => {
    setCreating(true)
    setMessage(null)
    try {
      const response = await fetch('/api/admin/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = (await response.json()) as { id?: string; error?: string }
      if (!response.ok || !data.id) {
        throw new Error(data.error || 'Não foi possível criar o serviço.')
      }
      router.push(`/admin/services/${data.id}`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Erro ao criar serviço.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link href="/admin/services" className="inline-flex items-center gap-2 text-xs text-stone-500 hover:text-stone-900">
          <ArrowLeft size={14} />
          Voltar para Services
        </Link>
        <h1 className="font-cormorant text-3xl text-stone-900 dark:text-white">Novo Serviço</h1>
      </div>

      {message && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{message}</div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Título" value={form.title} onChange={(value) => setForm((prev) => ({ ...prev, title: value }))} />
        <Field label="Slug" value={form.slug} onChange={(value) => setForm((prev) => ({ ...prev, slug: value }))} />
        <Field label="Subtítulo" value={form.subtitle} onChange={(value) => setForm((prev) => ({ ...prev, subtitle: value }))} />
        <Field label="Cover image" value={form.coverImage} onChange={(value) => setForm((prev) => ({ ...prev, coverImage: value }))} />
      </div>

      <div className="space-y-2">
        <Label>Descrição</Label>
        <Textarea value={form.description} rows={6} onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))} />
      </div>

      <Button onClick={onCreate} disabled={creating}>
        {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
        Criar serviço
      </Button>
    </div>
  )
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(event) => onChange(event.target.value)} />
    </div>
  )
}
