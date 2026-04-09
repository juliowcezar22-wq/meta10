import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Acompanhe seu progresso e acesse os materiais de estudo.',
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
