import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça a META 10 Espaço Pedagógico. Nossa missão, método e localização. Reforço escolar de qualidade.',
  openGraph: {
    title: 'Sobre a META 10 | Espaço Pedagógico',
    description: 'Conheça nossa missão e método de ensino.',
  },
}

export default function SobreLayout({ children }: { children: React.ReactNode }) {
  return children
}
