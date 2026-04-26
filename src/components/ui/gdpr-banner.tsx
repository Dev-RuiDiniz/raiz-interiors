/*
Arquivo: src/components/ui/gdpr-banner.tsx
Objetivo: Componente de UI reutilizavel.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { X, Cookie } from 'lucide-react'
import { type Locale } from '@/i18n/config'

const COOKIE_CONSENT_KEY = 'raiz-cookie-consent'

type ConsentType = 'all' | 'essential' | null

const gdprCopy: Record<
  Locale,
  {
    title: string
    description: string
    learnMore: string
    manageCookies: string
    essentialOnly: string
    acceptAll: string
    settingsTitle: string
    essentialTitle: string
    essentialDescription: string
    analyticsTitle: string
    analyticsDescription: string
    marketingTitle: string
    marketingDescription: string
    savePreferences: string
  }
> = {
  en: {
    title: 'We Value Your Privacy',
    description:
      'We use cookies to enhance your browsing experience, analyze site traffic, and personalize content.',
    learnMore: 'Learn more',
    manageCookies: 'Manage Cookies',
    essentialOnly: 'Essential Only',
    acceptAll: 'Accept All',
    settingsTitle: 'Cookie Settings',
    essentialTitle: 'Essential Cookies',
    essentialDescription: 'Required for the website to function properly. Cannot be disabled.',
    analyticsTitle: 'Analytics Cookies',
    analyticsDescription: 'Help us understand how visitors interact with our website.',
    marketingTitle: 'Marketing Cookies',
    marketingDescription:
      'Used to deliver relevant advertisements and track campaign performance.',
    savePreferences: 'Save Preferences',
  },
  pt: {
    title: 'Valorizamos a Sua Privacidade',
    description:
      'Utilizamos cookies para melhorar a sua experiencia de navegacao, analisar trafego e personalizar conteudo.',
    learnMore: 'Saber mais',
    manageCookies: 'Gerir Cookies',
    essentialOnly: 'Apenas Essenciais',
    acceptAll: 'Aceitar Todos',
    settingsTitle: 'Definicoes de Cookies',
    essentialTitle: 'Cookies Essenciais',
    essentialDescription: 'Necessarios para o funcionamento do website. Nao podem ser desativados.',
    analyticsTitle: 'Cookies de Analise',
    analyticsDescription: 'Ajudam-nos a perceber como os visitantes utilizam o website.',
    marketingTitle: 'Cookies de Marketing',
    marketingDescription:
      'Utilizados para apresentar publicidade relevante e avaliar campanhas.',
    savePreferences: 'Guardar Preferencias',
  },
}

export function GDPRBanner({ locale }: { locale: Locale }) {
  const [showBanner, setShowBanner] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const copy = gdprCopy[locale]

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleConsent = (type: ConsentType) => {
    if (type) {
      localStorage.setItem(COOKIE_CONSENT_KEY, type)
      setShowBanner(false)
      setShowSettings(false)
    }
  }

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-[100] p-4 lg:p-6"
        >
          <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
            {!showSettings ? (
              <div className="p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center shrink-0">
                      <Cookie size={24} className="text-stone-600" />
                    </div>
                    <div>
                      <h3 className="font-cormorant text-xl text-stone-900 mb-2">
                        {copy.title}
                      </h3>
                      <p className="font-inter text-sm text-stone-600 leading-relaxed">
                        {copy.description}{' '}
                        <Link
                          href={`/${locale}/privacy`}
                          className="text-stone-900 underline underline-offset-2 hover:text-stone-600"
                        >
                          {copy.learnMore}
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 lg:shrink-0">
                    <button
                      onClick={() => setShowSettings(true)}
                      className="px-6 py-3 border border-stone-300 text-stone-700 font-inter text-xs tracking-[0.1em] uppercase hover:border-stone-900 hover:text-stone-900 transition-colors"
                    >
                      {copy.manageCookies}
                    </button>
                    <button
                      onClick={() => handleConsent('essential')}
                      className="px-6 py-3 border border-stone-300 text-stone-700 font-inter text-xs tracking-[0.1em] uppercase hover:border-stone-900 hover:text-stone-900 transition-colors"
                    >
                      {copy.essentialOnly}
                    </button>
                    <button
                      onClick={() => handleConsent('all')}
                      className="px-6 py-3 bg-stone-900 text-white font-inter text-xs tracking-[0.1em] uppercase hover:bg-stone-800 transition-colors"
                    >
                      {copy.acceptAll}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 lg:p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-cormorant text-xl text-stone-900">
                    {copy.settingsTitle}
                  </h3>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="p-2 text-stone-500 hover:text-stone-900 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 rounded-lg">
                    <div>
                      <h4 className="font-inter text-sm font-medium text-stone-900 mb-1">
                        {copy.essentialTitle}
                      </h4>
                      <p className="font-inter text-xs text-stone-500">
                        {copy.essentialDescription}
                      </p>
                    </div>
                    <div className="w-10 h-6 bg-stone-900 rounded-full flex items-center justify-end px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 rounded-lg">
                    <div>
                      <h4 className="font-inter text-sm font-medium text-stone-900 mb-1">
                        {copy.analyticsTitle}
                      </h4>
                      <p className="font-inter text-xs text-stone-500">
                        {copy.analyticsDescription}
                      </p>
                    </div>
                    <div className="w-10 h-6 bg-stone-300 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-4 p-4 bg-stone-50 rounded-lg">
                    <div>
                      <h4 className="font-inter text-sm font-medium text-stone-900 mb-1">
                        {copy.marketingTitle}
                      </h4>
                      <p className="font-inter text-xs text-stone-500">
                        {copy.marketingDescription}
                      </p>
                    </div>
                    <div className="w-10 h-6 bg-stone-300 rounded-full flex items-center px-1">
                      <div className="w-4 h-4 bg-white rounded-full" />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleConsent('essential')}
                    className="flex-1 px-6 py-3 border border-stone-300 text-stone-700 font-inter text-xs tracking-[0.1em] uppercase hover:border-stone-900 hover:text-stone-900 transition-colors"
                  >
                    {copy.savePreferences}
                  </button>
                  <button
                    onClick={() => handleConsent('all')}
                    className="flex-1 px-6 py-3 bg-stone-900 text-white font-inter text-xs tracking-[0.1em] uppercase hover:bg-stone-800 transition-colors"
                  >
                    {copy.acceptAll}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
