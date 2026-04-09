import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Modo Treino - Questões',
  description: 'Pratique com questões de múltipla escolha e receba feedback imediato.',
}

export default function QuestoesLayout({ children }: { children: React.ReactNode }) {
  return children
}
