import { requireAuth } from '@/lib/auth/guards'
import { searchProducts } from '@/lib/data/products'
import { getDisciplines } from '@/lib/data/disciplines'
import { getAllSubjects } from '@/lib/data/subjects'
import { StoreSearch } from '@/components/loja/store-search'
import { StoreResults } from '@/components/loja/store-results'
import { parseStoreParams, type StoreSearchParamsInput } from '@/lib/store-filters'

export const dynamic = 'force-dynamic'

export default async function LojaPage({ searchParams }: { searchParams?: StoreSearchParamsInput }) {
  await requireAuth()

  const filters = parseStoreParams(searchParams)

  const [disciplines, subjects, result] = await Promise.all([
    getDisciplines(),
    getAllSubjects(),
    searchProducts({
      q: filters.q || undefined,
      materialType: filters.tipo || undefined,
      subject: filters.disciplina || undefined,
      subjectId: filters.assunto || undefined,
      page: filters.page,
    }),
  ])

  const disciplineNames = Object.fromEntries(disciplines.map(d => [d.slug, d.name]))

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-surface-900">Loja</h1>
        <p className="text-surface-500 mt-2">Confira nossos produtos adicionais para acelerar sua aprovação.</p>
      </div>

      <div className="mb-8">
        <StoreSearch
          basePath="/aluno/loja"
          disciplines={disciplines}
          subjects={subjects}
          values={{ q: filters.q, tipo: filters.tipo, disciplina: filters.disciplina, assunto: filters.assunto }}
        />
      </div>

      <StoreResults
        result={result}
        basePath="/aluno/loja"
        filters={filters}
        disciplineNames={disciplineNames}
      />
    </div>
  )
}
