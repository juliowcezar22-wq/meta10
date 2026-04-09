import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Materiais PDF',
  description: 'Baixe apostilas, listas de exercícios e materiais complementares.',
}

export default function PdfsLayout({ children }: { children: React.ReactNode }) {
  return children
}
