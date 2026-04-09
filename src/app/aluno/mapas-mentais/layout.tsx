import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mapas Mentais',
  description: 'Visualize mapas mentais para organizar e fixar o conteúdo.',
}

export default function MapasMentaisLayout({ children }: { children: React.ReactNode }) {
  return children
}
