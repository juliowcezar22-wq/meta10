import React from 'react'
import { BookOpen, Target, Users } from 'lucide-react'

export default function AboutSection() {
  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
      `}} />
      <section className="py-20 md:py-28 bg-white" id="sobre" style={{ fontFamily: "'Poppins', sans-serif" }}>
        {/* Utilizei max-w-7xl e mx-auto para garantir um alinhamento perfeito, 
            mas você pode voltar para sua classe 'container-custom' se preferir */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
                O que é a META 10?
              </h2>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                A META 10 é um espaço pedagógico digital criado para oferecer reforço escolar de qualidade a alunos do ensino fundamental e médio.
              </p>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-10">
                Nossa plataforma reúne materiais de estudo cuidadosamente elaborados - desde questões e simulados até PDFs, mapas mentais e resumos - tudo organizado para maximizar seu aprendizado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {[
                  { icon: BookOpen, label: 'Material Curado', desc: 'Conteúdo selecionado por especialistas' },
                  { icon: Target, label: 'Foco em Resultados', desc: 'Preparação para provas e vestibulares' },
                  { icon: Users, label: 'Comunidade Ativa', desc: 'Alunos engajados e motivados' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div
                    key={label}
                    className="group flex flex-col items-center text-center p-6 bg-gray-50 rounded-2xl border border-gray-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-14 h-14 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 text-[#F1781F]" />
                    </div>
                    <span className="font-bold text-gray-900 mb-2">{label}</span>
                    <span className="text-sm text-gray-600 leading-relaxed">{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2 relative group mt-8 lg:mt-0">
              {/* Fundo decorativo (offset) para dar profundidade ao design */}
              <div className="absolute inset-0 bg-gray-100 rounded-3xl transform translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>

              <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/10 aspect-square border border-gray-100 bg-white">
                <img
                  src="/seçaosobre.jpeg"
                  alt="META 10 Espaço Pedagógico"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}