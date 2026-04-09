import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Área do Aluno',
  description: 'Acesse seus materiais de estudo, questões, simulados, PDFs, mapas mentais e resumos.',
}

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  return children
}
