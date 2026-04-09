import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Simulados',
  description: 'Realize simulados completos com correção automática e comentários.',
}

export default function SimuladosLayout({ children }: { children: React.ReactNode }) {
  return children
}
