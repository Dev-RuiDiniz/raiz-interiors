/*
Arquivo: src/components/ui/floating-chat.tsx
Objetivo: Componente de UI reutilizavel.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send } from 'lucide-react'
import { FaWhatsapp } from 'react-icons/fa'

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)

  const whatsappNumber = '+351912345678' // Número do WhatsApp
  const defaultMessage = encodeURIComponent(
    "Hello! I'm interested in learning more about your interior design services."
  )

  const handleWhatsAppClick = () => {
    window.open(
      `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${defaultMessage}`,
      '_blank'
    )
  }

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: 'spring', stiffness: 200 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center"
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaWhatsapp size={28} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#25D366] px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <FaWhatsapp size={22} className="text-white" />
                </div>
                <div>
                  <h3 className="font-inter text-sm font-medium text-white">
                    RAIZ Interiors
                  </h3>
                  <p className="font-inter text-xs text-white/80">
                    Typically replies within 1 hour
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-5 bg-[#ECE5DD]">
              <div className="bg-white rounded-lg p-4 shadow-sm relative">
                <div className="absolute -left-2 top-3 w-0 h-0 border-t-8 border-t-transparent border-r-8 border-r-white border-b-8 border-b-transparent" />
                <p className="font-inter text-sm text-stone-700 leading-relaxed">
                  Hello! 👋
                  <br /><br />
                  How can we help you with your interior design project?
                </p>
                <span className="block text-right font-inter text-[10px] text-stone-400 mt-2">
                  Just now
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-stone-100">
              <button
                onClick={handleWhatsAppClick}
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20BD5A] text-white font-inter text-sm py-3 px-4 rounded-lg transition-colors"
              >
                <FaWhatsapp size={18} />
                Start Conversation
              </button>
              <p className="text-center font-inter text-[10px] text-stone-400 mt-3">
                Opens WhatsApp in a new window
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

