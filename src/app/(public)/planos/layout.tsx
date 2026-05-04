import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos de Assinatura',
  description: 'Escolha o plano ideal para seus estudos na META 10. Planos mensal, semestral e anual com acesso a todo conteúdo.',
}

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return children
}
