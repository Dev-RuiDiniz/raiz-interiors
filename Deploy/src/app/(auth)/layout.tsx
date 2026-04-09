/*
Arquivo: src/app/(auth)/layout.tsx
Objetivo: Layout compartilhado entre paginas da respectiva area.
Guia rapido: consulte imports no topo, depois tipos/constantes, e por fim a exportacao principal.
*/

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

