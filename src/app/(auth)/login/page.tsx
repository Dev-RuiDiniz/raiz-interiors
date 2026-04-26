/*
Arquivo: src/app/(auth)/login/page.tsx
Objetivo: Pagina de autenticacao.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginFormData = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/admin')
        router.refresh()
      }
    } catch {
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-stone-50 dark:bg-stone-950">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <Image
          src="/2026/home/galeria_inicial/suite_4k.jpg"
          alt="Interior Design"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <div className="text-center">
            <h1 className="font-cormorant text-5xl font-light tracking-[0.3em]">RAIZ</h1>
            <p className="mt-2 font-inter text-xs tracking-[0.4em] uppercase text-white/70">
              Interiors & Living Studio
            </p>
            <div className="mt-8 w-16 h-px bg-white/30 mx-auto" />
            <p className="mt-8 font-cormorant text-xl italic text-white/80 max-w-md">
              &quot;Creating spaces that tell your story&quot;
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-12">
            <h1 className="font-cormorant text-3xl font-light tracking-[0.3em] text-stone-900 dark:text-white">
              RAIZ
            </h1>
            <p className="mt-1 font-inter text-[10px] tracking-[0.3em] uppercase text-stone-500">
              Interiors & Living Studio
            </p>
          </div>

          <div className="mb-10">
            <h2 className="font-cormorant text-3xl font-light text-stone-900 dark:text-white">
              Welcome <span className="italic">back</span>
            </h2>
            <p className="mt-2 font-inter text-sm text-stone-500 dark:text-stone-400">
              Sign in to access your dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="font-inter text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block font-inter text-xs tracking-[0.1em] uppercase text-stone-500 dark:text-stone-400 mb-2">
                Email Address
              </label>
              <input
                {...register('email')}
                type="email"
                autoComplete="email"
                placeholder="admin@raiz-interiors.com"
                className="w-full h-14 px-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white font-inter text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 transition-colors"
              />
              {errors.email && <p className="mt-1 font-inter text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block font-inter text-xs tracking-[0.1em] uppercase text-stone-500 dark:text-stone-400 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full h-14 px-4 pr-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-white font-inter text-sm focus:outline-none focus:border-stone-400 dark:focus:border-stone-600 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 font-inter text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-inter text-xs tracking-[0.2em] uppercase hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <Link
              href="/"
              className="font-inter text-sm text-stone-500 hover:text-stone-900 dark:hover:text-white transition-colors"
            >
              ← Back to website
            </Link>
          </div>

          <div className="mt-8 p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
            <p className="font-inter text-xs text-stone-500 dark:text-stone-400 text-center">
              <strong>Demo:</strong> admin@raiz-interiors.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
