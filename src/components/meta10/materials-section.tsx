import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faListCheck, faClipboardCheck, faFileLines, faNetworkWired, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { MATERIALS } from '@/lib/constants'

const iconMap: Record<string, any> = {
  ListChecks: faListCheck,
  ClipboardCheck: faClipboardCheck,
  FileText: faFileLines,
  Network: faNetworkWired,
  BookOpen: faBookOpen,
}

export default function MaterialsSection() {
  return (
    <section className="section-padding bg-gray-50" id="materiais">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nossos Materiais de Estudo
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Tudo que você precisa para estudar de forma organizada e eficiente, em um só lugar.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {MATERIALS.map((material) => {
            const Icon = iconMap[material.icon] || faBookOpen
            return (
              <div
                key={material.id}
                className="card card-hover p-6 text-center cursor-pointer"
              >
                <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FontAwesomeIcon icon={Icon} className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{material.title}</h3>
                <p className="text-sm text-gray-500">{material.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
