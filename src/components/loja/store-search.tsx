'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, XCircle } from 'lucide-react'
import { MATERIAL_TYPES } from '@/lib/constants'

export interface StoreSearchValues {
  q: string
  tipo: string
  disciplina: string
  assunto: string
}

interface StoreSearchProps {
  /** Rota que recebe os filtros ('/loja' ou '/aluno/loja') */
  basePath: string
  disciplines: { slug: string; name: string }[]
  subjects: { id: string; discipline: string; name: string }[]
  values?: Partial<StoreSearchValues>
  /** Tema escuro (seção Nossa Loja da home) */
  dark?: boolean
}

/**
 * Busca e filtros da loja. O estado vive na URL (query params), então o
 * link é compartilhável e os redirecionamentos das páginas de matéria já
 * chegam filtrados. Reutilizado na home, na loja pública e na loja do aluno.
 */
export function StoreSearch({ basePath, disciplines, subjects, values, dark = false }: StoreSearchProps) {
  const router = useRouter()
  const [q, setQ] = useState(values?.q ?? '')
  const tipo = values?.tipo ?? ''
  const disciplina = values?.disciplina ?? ''
  const assunto = values?.assunto ?? ''

  const navigate = (next: Partial<StoreSearchValues>) => {
    const merged: StoreSearchValues = { q, tipo, disciplina, assunto, ...next }
    // Trocar de disciplina invalida o assunto selecionado
    if (next.disciplina !== undefined && next.disciplina !== disciplina) merged.assunto = ''

    const params = new URLSearchParams()
    if (merged.q.trim()) params.set('q', merged.q.trim())
    if (merged.tipo) params.set('tipo', merged.tipo)
    if (merged.disciplina) params.set('disciplina', merged.disciplina)
    if (merged.assunto) params.set('assunto', merged.assunto)
    const qs = params.toString()
    router.push(qs ? `${basePath}?${qs}` : basePath)
  }

  const hasFilters = Boolean((values?.q ?? '') || tipo || disciplina || assunto)
  const subjectOptions = disciplina ? subjects.filter(s => s.discipline === disciplina) : []

  const fieldClass = dark
    ? 'bg-white/10 border-white/20 text-white placeholder:text-white/50 [&>option]:text-surface-900'
    : 'bg-white border-surface-200 text-surface-700'

  return (
    <div className="flex flex-col gap-3">
      <form
        onSubmit={(e) => { e.preventDefault(); navigate({ q }) }}
        className="flex gap-2"
      >
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${dark ? 'text-white/50' : 'text-surface-400'}`} />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            className={`w-full pl-9 pr-3 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${fieldClass}`}
          />
        </div>
        <button type="submit" className="btn-primary !py-2.5 px-5 text-sm">Buscar</button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={tipo}
          onChange={(e) => navigate({ tipo: e.target.value })}
          className={`px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldClass}`}
          aria-label="Tipo de material"
        >
          <option value="">Todos os materiais</option>
          {MATERIAL_TYPES.map(m => (
            <option key={m.slug} value={m.slug}>{m.label}</option>
          ))}
        </select>

        <select
          value={disciplina}
          onChange={(e) => navigate({ disciplina: e.target.value })}
          className={`px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all ${fieldClass}`}
          aria-label="Disciplina"
        >
          <option value="">Todas as disciplinas</option>
          {disciplines.map(d => (
            <option key={d.slug} value={d.slug}>{d.name}</option>
          ))}
        </select>

        <select
          value={assunto}
          onChange={(e) => navigate({ assunto: e.target.value })}
          disabled={!disciplina || subjectOptions.length === 0}
          className={`px-3 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-50 ${fieldClass}`}
          aria-label="Assunto"
        >
          <option value="">
            {!disciplina ? 'Assunto (escolha a disciplina)' : subjectOptions.length === 0 ? 'Sem assuntos cadastrados' : 'Todos os assuntos'}
          </option>
          {subjectOptions.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => { setQ(''); router.push(basePath) }}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${dark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-surface-500 hover:text-danger-600 hover:bg-danger-50'}`}
          >
            <XCircle className="w-4 h-4" />
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  )
}
