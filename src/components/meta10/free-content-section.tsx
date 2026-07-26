import { LockOpen, ListChecks, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function FreeContentSection() {
  return (
    <section className="section-padding bg-surface-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 text-success-700 text-sm font-semibold mb-6 ring-1 ring-success-500/20 animate-fade-in-up">
            <LockOpen className="w-4 h-4" />
            Acesso 100% Gratuito
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-6 tracking-tight animate-fade-in-up animation-delay-100">
            Conteúdos Gratuitos
          </h2>
          <p className="text-surface-500 text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Crie sua conta gratuita e comece agora a resolver questões do nosso Banco de Questões, sem pagar nada.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <div className="group relative bg-white rounded-[2.5rem] p-8 md:p-10 shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-surface-200 overflow-hidden group-hover:border-primary-500/30 animate-fade-in-up animation-delay-300">
            {/* Background Gradient */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary-500/10 to-transparent rounded-bl-[4rem] opacity-50 group-hover:scale-125 transition-transform duration-700 ease-out" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="flex items-start justify-between mb-8">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 ease-out">
                  <ListChecks className="w-8 h-8 text-primary-600" />
                </div>
                <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-success-50 text-success-700 ring-1 ring-success-500/20">
                  Grátis
                </span>
              </div>

              <div className="flex-grow">
                <h3 className="font-extrabold text-surface-900 text-2xl mb-3 group-hover:text-primary transition-colors duration-300">
                  Banco de Questões
                </h3>
                <p className="text-surface-500 mb-8 leading-relaxed">
                  Questões organizadas por disciplina e assunto, com correção na hora, para você estudar do seu jeito.
                </p>
              </div>

              <Link href="/cadastro" className="relative overflow-hidden w-full bg-surface-900 hover:bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 group/btn mt-auto">
                <span className="relative z-10 flex items-center gap-2">
                  Começar a Resolver Grátis
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform duration-300" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
