import { searchProducts } from '@/lib/data/products'
import { getDisciplines } from '@/lib/data/disciplines'
import { getAllSubjects } from '@/lib/data/subjects'
import { StoreSearch } from '@/components/loja/store-search'
import { StoreResults } from '@/components/loja/store-results'
import { parseStoreParams, type StoreSearchParamsInput } from '@/lib/store-filters'

export const dynamic = 'force-dynamic'

export default async function LojaPage({ searchParams }: { searchParams?: StoreSearchParamsInput }) {
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
    <>
      {/* Hero + busca */}
      <section className="bg-gradient-to-br from-purple-50 to-white section-padding !pb-10">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Loja de Produtos
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Materiais exclusivos para turbinar seus estudos.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <StoreSearch
              basePath="/loja"
              disciplines={disciplines}
              subjects={subjects}
              values={{ q: filters.q, tipo: filters.tipo, disciplina: filters.disciplina, assunto: filters.assunto }}
            />
          </div>
        </div>
      </section>

      {/* Resultados */}
      <section className="section-padding bg-gray-50 min-h-[50vh] !pt-10">
        <div className="container-custom">
          <StoreResults
            result={result}
            basePath="/loja"
            filters={filters}
            disciplineNames={disciplineNames}
          />
        </div>
      </section>
    </>
  )
}
