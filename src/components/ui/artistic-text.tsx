/*
Arquivo: src/components/ui/artistic-text.tsx
Objetivo: Componente de UI reutilizavel.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ArtisticTextProps {
  children: string
  highlightWords?: string[]
  className?: string
  highlightClassName?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span'
  animate?: boolean
}

/**
 * Componente de texto artístico no estilo Eye-Swoon
 * Destaca palavras específicas com itálico e serif
 */
export function ArtisticText({
  children,
  highlightWords = [],
  className,
  highlightClassName,
  as: Component = 'p',
  animate = true,
}: ArtisticTextProps) {
  const words = children.split(' ')

  const content = words.map((word, index) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '')
    const punctuation = word.match(/[.,!?;:]/g)?.join('') || ''
    const isHighlighted = highlightWords.some(
      (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
    )

    return (
      <span key={index}>
        {isHighlighted ? (
          <span
            className={cn(
              'font-cormorant italic font-medium',
              highlightClassName
            )}
          >
            {cleanWord}
          </span>
        ) : (
          cleanWord
        )}
        {punctuation}
        {index < words.length - 1 && ' '}
      </span>
    )
  })

  if (!animate) {
    return <Component className={className}>{content}</Component>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <Component className={className}>{content}</Component>
    </motion.div>
  )
}

interface SplitTextProps {
  children: string
  className?: string
  delay?: number
}

/**
 * Texto com animação letra por letra
 */
export function SplitText({ children, className, delay = 0 }: SplitTextProps) {
  const characters = children.split('')

  return (
    <span className={className}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            delay: delay + index * 0.03,
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  )
}

interface RevealTextProps {
  children: string
  className?: string
  delay?: number
}

/**
 * Texto com efeito reveal de baixo para cima
 */
export function RevealText({ children, className, delay = 0 }: RevealTextProps) {
  return (
    <div className="overflow-hidden">
      <motion.div
        initial={{ y: '100%' }}
        whileInView={{ y: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    </div>
  )
}

