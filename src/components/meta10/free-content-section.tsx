import { LockOpen, FileText, ClipboardList, Network, BookOpen, ArrowRight } from 'lucide-react'
import { FREE_CONTENTS } from '@/lib/constants'

const iconMap: Record<string, React.ElementType> = {
  PDF: FileText, Resumo: BookOpen, 'Mapa Mental': Network, Simulado: ClipboardList,
}

const typeColors: Record<string, string> = {
  PDF: 'bg-primary-50 text-primary', Resumo: 'bg-purple-50 text-purple',
  'Mapa Mental': 'bg-success-50 text-success-600', Simulado: 'bg-cyan-50 text-cyan-600',
}

export default function FreeContentSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4 tracking-tight">
            Conteúdos Gratuitos
          </h2>
          <p className="text-surface-500 text-lg max-w-xl mx-auto">
            Comece agora mesmo com materiais gratuitos selecionados para você.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {FREE_CONTENTS.map((content, index) => {
            const Icon = iconMap[content.type] || FileText
            return (
              <div key={index} className="card card-hover p-6 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                  <Icon className="w-5 h-5 text-surface-400" />
                  <span className={`badge ${typeColors[content.type] || 'bg-surface-100 text-surface-600'}`}>
                    {content.type}
                  </span>
                  <LockOpen className="w-4 h-4 text-success-500 ml-auto" />
                </div>
                <h3 className="font-bold text-surface-900 text-sm mb-1">{content.title}</h3>
                <p className="text-xs text-surface-400 mb-5">{content.pages}</p>
                <button className="btn-primary text-sm mt-auto !py-2.5 justify-between group/btn w-full">
                  <span>Acessar Grátis</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
