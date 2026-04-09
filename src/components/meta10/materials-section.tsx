import { ListChecks, ClipboardCheck, FileText, Network, BookOpen, ArrowUpRight } from 'lucide-react'
import { MATERIALS } from '@/lib/constants'

const iconMap: Record<string, React.ElementType> = { ListChecks, ClipboardCheck, FileText, Network, BookOpen }

const colors = [
  { bg: 'from-primary-50 to-primary-100/50', icon: 'bg-primary text-white shadow-glow-primary', border: 'hover:border-primary/30' },
  { bg: 'from-cyan-50 to-cyan-100/50', icon: 'bg-cyan-600 text-white shadow-glow-cyan', border: 'hover:border-cyan/30' },
  { bg: 'from-purple-50 to-purple-100/50', icon: 'bg-purple text-white shadow-glow-purple', border: 'hover:border-purple/30' },
  { bg: 'from-success-50 to-success-100/50', icon: 'bg-success-600 text-white', border: 'hover:border-success/30' },
  { bg: 'from-danger-50 to-danger-100/50', icon: 'bg-danger-500 text-white', border: 'hover:border-danger/30' },
]

export default function MaterialsSection() {
  return (
    <section className="section-padding bg-surface-50 relative overflow-hidden" id="materiais">
      <div className="bg-mesh-cool absolute inset-0 pointer-events-none" />
      <div className="relative container-custom">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4 tracking-tight">
            Nossos Materiais de Estudo
          </h2>
          <p className="text-surface-500 text-lg max-w-xl mx-auto">
            Tudo que você precisa para estudar de forma organizada, em um só lugar.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {MATERIALS.map((material, i) => {
            const Icon = iconMap[material.icon] || BookOpen
            const c = colors[i % colors.length]
            return (
              <div key={material.id} className={`group relative bg-gradient-to-br ${c.bg} rounded-2xl p-6 md:p-8 text-center cursor-pointer border border-transparent ${c.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}>
                <div className={`w-14 h-14 ${c.icon} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-surface-900 text-sm md:text-base mb-2">{material.title}</h3>
                <p className="text-surface-500 text-xs md:text-sm leading-relaxed hidden sm:block">{material.description}</p>
                <ArrowUpRight className="w-4 h-4 text-surface-400 mx-auto mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
