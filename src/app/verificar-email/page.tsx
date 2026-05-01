import Link from 'next/link'
import { Mail } from 'lucide-react'

export default function VerificarEmailPage() {
  return (
    <section className="min-h-[100dvh] flex items-center justify-center bg-mesh px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <div className="w-3 h-3 rounded-full bg-purple" />
              <div className="w-3 h-3 rounded-full bg-success-500" />
            </div>
            <span className="text-xl font-bold ml-1"><span className="text-surface-400">Meta</span> <span className="text-danger">10</span></span>
          </Link>
        </div>

        <div className="card p-10 text-center max-w-sm mx-auto !rounded-3xl animate-scale-in">
          <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Mail className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-xl font-extrabold text-surface-900 mb-2">Verifique seu e-mail</h2>
          <p className="text-surface-500 text-sm mb-6">
            Enviamos um link de confirmação para o seu email. Clique no link para ativar sua conta.
          </p>
          <p className="text-xs text-surface-400 mb-6">
            Não recebeu? Verifique sua caixa de spam ou tente cadastrar novamente.
          </p>
          <Link href="/login" className="btn-primary w-full justify-center">
            Voltar para o login
          </Link>
        </div>
      </div>
    </section>
  )
}
