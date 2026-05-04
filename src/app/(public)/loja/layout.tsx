import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Loja de Produtos',
  description: 'Compre materiais exclusivos da META 10: apostilas, mapas mentais, flashcards e jogos pedagógicos.',
  openGraph: {
    title: 'Loja de Produtos | META 10 Espaço Pedagógico',
    description: 'Materiais exclusivos para turbinar seus estudos.',
    type: 'website',
  },
}

export default function LojaLayout({ children }: { children: React.ReactNode }) {
  return children
}
