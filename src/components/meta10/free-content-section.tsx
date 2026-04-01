import { LockOpen, FileText, ClipboardList, Network, BookOpen } from 'lucide-react'
import { FREE_CONTENTS } from '@/lib/constants'

const iconMap: Record<string, React.ElementType> = {
  PDF: FileText,
  Resumo: BookOpen,
  'Mapa Mental': Network,
  Simulado: ClipboardList,
}

export default function FreeContentSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Conteúdos Gratuitos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Comece agora mesmo com materiais gratuitos selecionados para você.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FREE_CONTENTS.map((content, index) => {
            const Icon = iconMap[content.type] || FileText
            return (
              <div
                key={index}
                className="card card-hover p-6 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-cyan" />
                  <span className="text-xs font-medium text-cyan bg-cyan-50 px-2 py-0.5 rounded-full">
                    {content.type}
                  </span>
                  <LockOpen className="w-4 h-4 text-green ml-auto" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{content.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{content.pages}</p>
                <button className="btn-primary text-sm mt-auto">
                  Acessar Grátis
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
