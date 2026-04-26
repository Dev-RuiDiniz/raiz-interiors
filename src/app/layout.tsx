/*
Arquivo: src/app/layout.tsx
Objetivo: Layout compartilhado entre paginas da respectiva area.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import "./globals.css"
import { cormorant, inter, playfair } from "@/lib/fonts"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { SessionProvider } from "@/components/providers/session-provider"
import { isLocale, localeCookieName } from "@/i18n/config"

const getMetadataBase = () => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.raiz-interiors.com")
  } catch {
    return new URL("https://www.raiz-interiors.com")
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: "RAIZ Interiors | Interior Design Studio",
  description: "Creating meaningful spaces that tell your story through thoughtful design and attention to detail. Architecture, Interior Design, Decoration, Consultancy & Staging.",
  keywords: ["interior design", "architecture", "decoration", "Portugal", "Lisbon", "design studio"],
  authors: [{ name: "RAIZ Interiors" }],
  openGraph: {
    title: "RAIZ Interiors | Interior Design Studio",
    description: "Creating meaningful spaces that tell your story.",
    type: "website",
    locale: "en_US",
  },
}

const getDocumentLang = async (): Promise<"en" | "pt-PT"> => {
  const headerStore = await headers()
  const cookieStore = await cookies()
  const pathname = headerStore.get("x-pathname") ?? ""
  const firstPathSegment = pathname.split("/")[1]
  const cookieLocale = cookieStore.get(localeCookieName)?.value

  const locale = isLocale(firstPathSegment ?? "")
    ? firstPathSegment
    : isLocale(cookieLocale ?? "")
      ? cookieLocale
      : "en"

  return locale === "pt" ? "pt-PT" : "en"
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const documentLang = await getDocumentLang()

  return (
    <html lang={documentLang} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${inter.variable} ${playfair.variable} font-inter antialiased`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
