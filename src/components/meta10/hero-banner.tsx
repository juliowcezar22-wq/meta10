import React from 'react'

export default function HeroBanner() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}} />

      <section
        className="relative overflow-hidden min-h-[calc(100vh-4rem)] pb-12 lg:pb-0 flex items-center justify-center"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        {/* BACKGROUND IMAGE & OVERLAYS */}
        <div className="absolute inset-0 z-0">
          <img
            src="/background-meta10.jpg"
            alt="Crianças estudando na escola"
            className="w-full h-full object-cover object-center"
          />

          {/* Overlay Escuro com Gradiente Radial para focar no centro */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#0a0a0a]/60 to-[#0a0a0a]/90 backdrop-blur-[2px]" />

          {/* Luzes decorativas de fundo (Orbes) */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#F1781F]/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
        </div>

        {/* CONTENT */}
        <div className="container mx-auto px-4 relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center flex flex-col items-center -mt-12 sm:-mt-16 lg:-mt-20">

            {/* LOGO */}
            <div className="animate-fade-in-up animate-float mb-6">
              <img
                src="/simbolo-meta10.png"
                alt="Símbolo META 10"
                className="w-32 h-auto sm:w-40 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
              />
            </div>

            {/* TITLE */}
            <h1 className="animate-fade-in-up delay-100 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold text-white leading-[1.1] tracking-tight mb-8">
              Seu reforço escolar{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F1781F] to-[#f59e5b] inline-block relative">
                começa aqui
                {/* Sublinhado decorativo moderno */}
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#F1781F]/40" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p className="animate-fade-in-up delay-200 text-lg sm:text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
              Questões, simulados, PDFs, mapas mentais e resumos organizados para você estudar de forma eficiente e conquistar os melhores resultados.
            </p>

            {/* BUTTONS */}
            <div className="animate-fade-in-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">

              <a
                href="/cadastro"
                className="group relative w-full sm:w-auto flex items-center justify-center gap-2 bg-[#F1781F] hover:bg-[#e06a16] text-white text-lg font-semibold px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(241,120,31,0.4)]"
              >
                <span>Comece a Estudar Agora</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>

              <a
                href="/planos"
                className="w-full sm:w-auto flex items-center justify-center bg-white/5 hover:bg-white/15 border border-white/20 text-white text-lg font-medium px-8 py-4 rounded-full backdrop-blur-sm transition-all duration-300 hover:border-white/40"
              >
                Conheça os Planos
              </a>

            </div>

          </div>
        </div>
      </section>
    </>
  )
}