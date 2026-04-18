import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Área do Aluno',
  description: 'Acesse seus materiais de estudo, questões, simulados, PDFs, mapas mentais e resumos.',
}

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === 'production') {
    return (
      <div className="min-h-screen bg-surface-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center shadow-card border border-surface-200">
          <Image src="/logomarca-meta10.png" alt="META 10" width={160} height={40} className="h-8 w-auto mx-auto mb-8 object-contain" />
          <h1 className="text-3xl font-extrabold text-surface-900 mb-4">Em Breve</h1>
          <p className="text-surface-500 mb-8">
            Estamos preparando uma plataforma incrível de estudos para você. A Área do Aluno estará disponível em breve!
          </p>
          <Link href="/" className="btn-primary w-full justify-center">
            Voltar para o Início
          </Link>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
