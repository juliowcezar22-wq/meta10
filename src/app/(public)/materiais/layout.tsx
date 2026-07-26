import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Materiais de Estudo',
  description: 'Explore todos os materiais de estudo do META 10: questões, atividades em PDF, mapas mentais e resumos.',
}

export default function MateriaisLayout({ children }: { children: React.ReactNode }) {
  return children
}
