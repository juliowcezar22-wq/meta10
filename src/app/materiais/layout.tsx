import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Materiais de Estudo',
  description: 'Explore todos os materiais de estudo da META 10: questões, simulados, PDFs, mapas mentais e resumos.',
}

export default function MateriaisLayout({ children }: { children: React.ReactNode }) {
  return children
}
