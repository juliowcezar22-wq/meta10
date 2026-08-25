'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, FileText, BookOpen, Network, Gamepad2, LayoutGrid } from 'lucide-react'
import { MATERIAL_TYPES } from '@/lib/constants'

const ICONS: Record<string, React.ElementType> = {
  atividade_pdf: FileText,
  resumo: BookOpen,
  mapa_mental: Network,
  jogo: Gamepad2,
}

interface StoreCategoryNavProps {
  basePath: string
  disciplines: { slug: string; name: string }[]
  activeType?: string | null
  activeDiscipline?: string | null
}

/**
 * Navegação por categoria "clica e abre as opções" (pedido da cliente):
 * cada tipo de material expande a lista de disciplinas; cada disciplina
 * leva à loja já filtrada por tipo + disciplina.
 */
export function StoreCategoryNav({ basePath, disciplines, activeType = null, activeDiscipline = null }: StoreCategoryNavProps) {
  const [open, setOpen] = useState<string | null>(activeType ?? null)

  return (
    <nav className="bg-white rounded-2xl border border-surface-200 overflow-hidden" aria-label="Categorias da loja">
      <div className="px-4 py-3 border-b border-surface-100 flex items-center gap-2 text-sm font-bold text-surface-900">
        <LayoutGrid className="w-4 h-4 text-primary" />
        Navegar por categoria
      </div>

      <Link
        href={basePath}
        className={`block px-4 py-2.5 text-sm font-medium transition-colors border-b border-surface-100 ${!activeType ? 'bg-primary-50 text-primary' : 'text-surface-600 hover:bg-surface-50'}`}
      >
        Todos os produtos
      </Link>

      {MATERIAL_TYPES.map((type) => {
        const Icon = ICONS[type.slug] ?? FileText
        const isOpen = open === type.slug
        const isActive = activeType === type.slug
        return (
          <div key={type.slug} className="border-b border-surface-100 last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : type.slug)}
              aria-expanded={isOpen}
              className={`w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors ${isActive ? 'text-primary bg-primary-50/60' : 'text-surface-700 hover:bg-surface-50'}`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                {type.label}
              </span>
              <ChevronDown className={`w-4 h-4 text-surface-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
              <div className="px-4 pb-3 flex flex-wrap gap-2">
                <Link
                  href={`${basePath}?tipo=${type.slug}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isActive && !activeDiscipline ? 'bg-primary text-white border-primary' : 'bg-white text-surface-600 border-surface-200 hover:border-primary/50'}`}
                >
                  Todas as disciplinas
                </Link>
                {disciplines.map((d) => (
                  <Link
                    key={d.slug}
                    href={`${basePath}?tipo=${type.slug}&disciplina=${d.slug}`}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${isActive && activeDiscipline === d.slug ? 'bg-primary text-white border-primary' : 'bg-white text-surface-600 border-surface-200 hover:border-primary/50'}`}
                  >
                    {d.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
