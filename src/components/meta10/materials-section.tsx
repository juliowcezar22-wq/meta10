import Link from 'next/link'
import { ListChecks, FileText, Network, BookOpen, ArrowUpRight, Gamepad2 } from 'lucide-react'
import { MATERIALS } from '@/lib/constants'

const iconMap: Record<string, React.ElementType> = { ListChecks, FileText, Network, BookOpen, Gamepad2 }

const colors = [
  { bg: 'from-[#151E32] to-[#0B0F19]', icon: 'bg-primary text-white shadow-glow-primary', border: 'border-[#1E293B] hover:border-primary/50' },
  { bg: 'from-[#151E32] to-[#0B0F19]', icon: 'bg-cyan-600 text-white shadow-glow-cyan', border: 'border-[#1E293B] hover:border-cyan/50' },
  { bg: 'from-[#151E32] to-[#0B0F19]', icon: 'bg-purple text-white shadow-glow-purple', border: 'border-[#1E293B] hover:border-purple/50' },
  { bg: 'from-[#151E32] to-[#0B0F19]', icon: 'bg-success-600 text-white', border: 'border-[#1E293B] hover:border-success/50' },
  { bg: 'from-[#151E32] to-[#0B0F19]', icon: 'bg-danger-500 text-white', border: 'border-[#1E293B] hover:border-danger/50' },
  { bg: 'from-[#151E32] to-[#0B0F19]', icon: 'bg-amber-500 text-white shadow-glow-amber', border: 'border-[#1E293B] hover:border-amber/50' },
]

export default function MaterialsSection() {
  return (
    <section className="section-padding bg-[#0B0F19] relative overflow-hidden" id="materiais">
      <div className="bg-mesh-cool absolute inset-0 pointer-events-none opacity-20" />
      <div className="relative container-custom">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight">
            Materiais de Estudo
          </h2>
          <p className="text-surface-300 text-lg max-w-xl mx-auto">
            Tudo que você precisa para estudar de forma organizada, em um só lugar.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {MATERIALS.map((material, i) => {
            const Icon = iconMap[material.icon] || BookOpen
            const c = colors[i % colors.length]
            return (
              <Link key={material.id} href={material.href} className={`group relative w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-1.1rem)] lg:w-[calc(20%-1.25rem)] bg-gradient-to-br ${c.bg} rounded-2xl p-6 md:p-8 text-center cursor-pointer border ${c.border} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg`}>
                <div className={`w-14 h-14 ${c.icon} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-white text-sm md:text-base mb-2">{material.title}</h3>
                <p className="text-surface-300 text-xs md:text-sm leading-relaxed hidden sm:block">{material.description}</p>
                <ArrowUpRight className="w-4 h-4 text-surface-400 mx-auto mt-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
