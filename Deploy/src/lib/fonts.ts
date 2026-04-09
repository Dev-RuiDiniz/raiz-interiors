/*
Arquivo: src/lib/fonts.ts
Objetivo: Funcoes utilitarias e integracoes compartilhadas.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import { Cormorant_Garamond, Inter, Playfair_Display } from 'next/font/google'
import localFont from 'next/font/local'

// Fonte elegante para títulos e textos destacados
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

// Fonte moderna para corpo de texto
export const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
})

// Fonte sofisticada alternativa para títulos
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
  display: 'swap',
})

