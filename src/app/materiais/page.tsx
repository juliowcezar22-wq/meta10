import { BookOpen, FileText, Network, ListChecks, ClipboardCheck } from 'lucide-react'
import { MATERIALS } from '@/lib/constants'

const iconMap: Record<string, React.ElementType> = {
  ListChecks,
  ClipboardCheck,
  FileText,
  Network,
  BookOpen,
}

export default function MateriaisPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-cyan-50 to-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Materiais de Estudo
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore todo o conteúdo disponível na META 10.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
            {MATERIALS.map((material) => {
              const Icon = iconMap[material.icon] || BookOpen
              return (
                <a
                  key={material.id}
                  href={`/aluno/${material.id === 'questoes' ? 'questoes' : material.id === 'simulados' ? 'simulados' : material.id === 'pdfs' ? 'pdfs' : material.id === 'mapas' ? 'mapas-mentais' : 'resumos'}`}
                  className="card card-hover p-8 text-center cursor-pointer"
                >
                  <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{material.title}</h3>
                  <p className="text-sm text-gray-500">{material.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
