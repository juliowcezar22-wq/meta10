'use client'

import Link from 'next/link'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function RecuperarSenhaPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-cyan-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Recuperar Senha</h1>
            <p className="text-gray-500 mt-1">
              Informe seu e-mail e enviaremos um link para redefinir sua senha.
            </p>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div>
                <label htmlFor="recovery-email" className="block text-sm font-medium text-gray-700 mb-1">E-mail cadastrado</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    id="recovery-email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="seu@email.com"
                    autoComplete="email"
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary w-full">
                Enviar Link de Recuperação
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-cyan flex-shrink-0 mt-0.5" />
              <p className="text-sm text-cyan-700">
                Esta funcionalidade será disponibilizada na fase de backend. Entre em contato pelo WhatsApp para suporte imediato.
              </p>
            </div>
          </div>

          <p className="text-center text-gray-600 mt-6">
            <Link href="/login" className="inline-flex items-center gap-1 text-primary font-semibold hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
