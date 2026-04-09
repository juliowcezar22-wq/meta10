import Link from 'next/link'
import { Home, MessageCircle, ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <section className="min-h-[80dvh] flex items-center justify-center bg-surface-50 px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <p className="text-8xl font-extrabold text-gradient-primary mb-4">404</p>
        <h1 className="text-2xl font-extrabold text-surface-900 mb-2">Página não encontrada</h1>
        <p className="text-surface-500 mb-8 text-sm">A página que você procura não existe ou foi movida.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="btn-primary justify-center">
            <Home className="w-4 h-4" /> Voltar ao Início
          </Link>
          <Link href="/contato" className="btn-outline justify-center">
            <MessageCircle className="w-4 h-4" /> Fale Conosco
          </Link>
        </div>
      </div>
    </section>
  )
}
