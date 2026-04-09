import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, Star, Sparkles } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 z-0">
        <Image src="/background-meta10.jpg" alt="" fill className="object-cover object-center scale-105" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        {/* Animated orbs */}
        <div className="absolute top-[20%] left-[15%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px] animate-pulse-soft pointer-events-none" />
        <div className="absolute bottom-[20%] right-[15%] w-[400px] h-[400px] bg-cyan/15 rounded-full blur-[100px] animate-pulse-soft pointer-events-none" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-[60%] left-[50%] w-[300px] h-[300px] bg-purple/10 rounded-full blur-[100px] animate-pulse-soft pointer-events-none" style={{ animationDelay: '3s' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-5xl mx-auto text-center">
          {/* Trust badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-8">
            <div className="flex -space-x-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${['bg-primary', 'bg-cyan', 'bg-purple', 'bg-success'][i]}`} />
              ))}
            </div>
            <span className="text-white/80 text-sm font-medium">Espaço Pedagógico de Referência</span>
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
            </div>
          </div>

          {/* Logo symbol */}
          <div className="animate-fade-in-up animation-delay-100 mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 animate-float shadow-glass-lg">
              <Image src="/simbolo-meta10.png" alt="META 10" width={80} height={80} className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-lg" priority />
            </div>
          </div>

          {/* Headline */}
          <h1 className="animate-fade-in-up animation-delay-200 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-extrabold text-white leading-[1.08] tracking-tight mb-6">
            Seu reforço escolar{' '}
            <span className="relative inline-block">
              <span className="text-gradient-hero">começa aqui</span>
              <svg className="absolute -bottom-2 left-0 w-full h-2.5 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true">
                <path d="M0 8 Q 25 2, 50 6 T 100 4" stroke="currentColor" strokeWidth="3" fill="transparent" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up animation-delay-300 text-lg sm:text-xl md:text-[1.35rem] text-white/70 max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Questões, simulados, PDFs, mapas mentais e resumos organizados para você estudar de forma eficiente e conquistar os melhores resultados.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up animation-delay-400 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/cadastro"
              className="group relative w-full sm:w-auto flex items-center justify-center gap-2.5 bg-primary hover:bg-primary-600 text-white text-lg font-semibold px-8 py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_8px_32px_rgba(241,120,31,0.4)]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Comece a Estudar Agora</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/planos"
              className="group w-full sm:w-auto flex items-center justify-center gap-2.5 glass-dark text-white text-lg font-medium px-8 py-4 rounded-2xl border border-white/15 hover:border-white/25 transition-all duration-300 hover:scale-[1.02]"
            >
              <Play className="w-5 h-5 text-primary" />
              Conheça os Planos
            </Link>
          </div>

          {/* Social proof */}
          <div className="animate-fade-in-up animation-delay-500 mt-14 flex flex-col sm:flex-row items-center justify-center gap-6 text-white/50 text-sm">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['bg-primary', 'bg-cyan', 'bg-purple', 'bg-success'].map((c, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-white/20 flex items-center justify-center`}>
                    <span className="text-white text-xs font-bold">{['A', 'M', 'C', 'L'][i]}</span>
                  </div>
                ))}
              </div>
              <span><strong className="text-white/80">+500 alunos</strong> ativos</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-white/20" />
            <div className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              ))}
              <span className="ml-1"><strong className="text-white/80">4.9</strong> de satisfação</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-[1]" />
    </section>
  )
}
