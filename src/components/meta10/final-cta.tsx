import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export default function FinalCTA() {
  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-500 to-primary-600" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)]" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

      <div className="relative container-custom text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight">
          Pronto para transformar<br className="hidden sm:block" /> seus estudos?
        </h2>
        <p className="text-lg text-white/75 mb-10 max-w-xl mx-auto font-light">
          Junte-se a milhares de alunos que já estão conquistando melhores resultados com a META 10.
        </p>
        <Link
          href="/cadastro"
          className="group inline-flex items-center gap-2.5 bg-white text-primary hover:bg-white/95 font-bold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-[0_8px_32px_rgba(0,0,0,0.15)] text-lg"
        >
          <Sparkles className="w-5 h-5" />
          Comece a Estudar Agora
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </section>
  )
}
