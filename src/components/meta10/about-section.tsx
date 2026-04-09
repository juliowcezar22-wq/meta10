import Image from 'next/image'
import { BookOpen, Target, Users, Sparkles } from 'lucide-react'

const features = [
  { icon: BookOpen, label: 'Material Curado', desc: 'Conteúdo selecionado por especialistas em educação', accent: 'primary' },
  { icon: Target, label: 'Foco em Resultados', desc: 'Preparação direcionada para provas e vestibulares', accent: 'cyan' },
  { icon: Users, label: 'Comunidade Ativa', desc: 'Alunos engajados em constante evolução', accent: 'purple' },
]

const accentMap: Record<string, { bg: string; icon: string; ring: string }> = {
  primary: { bg: 'bg-primary-50', icon: 'text-primary', ring: 'group-hover:ring-primary/20' },
  cyan: { bg: 'bg-cyan-50', icon: 'text-cyan-600', ring: 'group-hover:ring-cyan/20' },
  purple: { bg: 'bg-purple-50', icon: 'text-purple', ring: 'group-hover:ring-purple/20' },
}

export default function AboutSection() {
  return (
    <section className="relative py-24 md:py-32 bg-white overflow-hidden" id="sobre">
      <div className="bg-mesh absolute inset-0 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center gap-2 badge-primary mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Quem Somos
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-surface-900 mb-6 tracking-tight leading-tight">
              O que é a{' '}
              <span className="text-gradient-primary">META 10</span>?
            </h2>
            <p className="text-surface-500 text-lg leading-relaxed mb-4">
              A META 10 é um espaço pedagógico digital criado para oferecer reforço escolar de qualidade a alunos do ensino fundamental e médio.
            </p>
            <p className="text-surface-500 text-lg leading-relaxed mb-10">
              Nossa plataforma reúne materiais de estudo cuidadosamente elaborados — desde questões e simulados até PDFs, mapas mentais e resumos — tudo organizado para maximizar seu aprendizado.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map(({ icon: Icon, label, desc, accent }) => {
                const colors = accentMap[accent]
                return (
                  <div key={label} className={`group relative p-6 rounded-2xl bg-surface-50 border border-surface-100 hover:bg-white hover:shadow-card-hover hover:border-surface-200 transition-all duration-300 hover:-translate-y-1 ring-4 ring-transparent ${colors.ring}`}>
                    <div className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    <h3 className="font-bold text-surface-900 text-sm mb-1.5">{label}</h3>
                    <p className="text-surface-500 text-xs leading-relaxed">{desc}</p>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-cyan/10 to-purple/20 rounded-[2rem] blur-2xl opacity-60" />
            <div className="relative rounded-3xl overflow-hidden shadow-glass-xl aspect-[4/5] lg:aspect-square ring-1 ring-surface-200/50">
              <Image src="/seçaosobre.jpeg" alt="META 10 Espaço Pedagógico" fill className="object-cover transition-transform duration-700 hover:scale-[1.03]" sizes="(max-width: 768px) 100vw, 50vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
