import Link from 'next/link'
import { ListChecks, FileText, Network, BookOpen, Gamepad2 } from 'lucide-react'
import { MATERIALS } from '@/lib/constants'

const iconMap: Record<string, React.ElementType> = {
  ListChecks,
  FileText,
  Network,
  BookOpen,
  Gamepad2,
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
            Explore todo o conteúdo disponível no META 10.
          </p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-8">
            {MATERIALS.map((material) => {
              const Icon = iconMap[material.icon] || BookOpen
              return (
                <Link
                  key={material.id}
                  href={material.href}
                  className="card card-hover p-8 text-center cursor-pointer w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.333%-1.375rem)]"
                >
                  <div className="w-16 h-16 bg-primary-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{material.title}</h3>
                  <p className="text-sm text-gray-500">{material.description}</p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
