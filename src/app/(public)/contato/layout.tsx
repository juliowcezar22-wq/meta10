import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contato',
  description: 'Entre em contato com a META 10 Espaço Pedagógico. Tire dúvidas, envie sugestões ou saiba mais sobre nossos planos.',
}

export default function ContatoLayout({ children }: { children: React.ReactNode }) {
  return children
}
