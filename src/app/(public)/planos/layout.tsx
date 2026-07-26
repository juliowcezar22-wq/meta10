import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Planos de Assinatura',
  description: 'Escolha o plano ideal para seus estudos na META 10: Gratuito, Mensal ou Anual, com acesso ao Banco de Questões.',
}

export default function PlanosLayout({ children }: { children: React.ReactNode }) {
  return children
}
