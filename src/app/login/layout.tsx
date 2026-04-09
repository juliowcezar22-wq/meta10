import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Faça login na sua conta da META 10 Espaço Pedagógico e acesse seus materiais de estudo.',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
