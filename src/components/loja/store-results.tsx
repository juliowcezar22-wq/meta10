import Link from 'next/link'
import { PackageSearch, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from './product-card'
import type { StoreSearchResult } from '@/lib/data/products'
import { storeHref, type StoreFilterState } from '@/lib/store-filters'

interface StoreResultsProps {
  result: StoreSearchResult
  basePath: string
  filters: StoreFilterState
  disciplineNames: Record<string, string>
}

/**
 * Resultados da loja: contagem, grid responsivo (4 desktop / 2 tablet /
 * 1 celular), estado vazio com sugestão de limpar filtros e paginação.
 */
export function StoreResults({ result, basePath, filters, disciplineNames }: StoreResultsProps) {
  const { products, count, page, totalPages } = result
  const hasFilters = Boolean(filters.q || filters.tipo || filters.disciplina || filters.assunto)

  if (count === 0) {
    return (
      <div className="text-center py-16 bg-surface-50 rounded-2xl border border-surface-200">
        <PackageSearch className="w-12 h-12 text-surface-400 mx-auto mb-4" />
        <h2 className="text-lg font-bold text-surface-900 mb-2">Nenhum produto encontrado</h2>
        <p className="text-surface-500 mb-4">
          {hasFilters
            ? 'Nenhum resultado com os filtros atuais. Tente ampliar a busca.'
            : 'Estamos preparando novidades para você. Volte em breve!'}
        </p>
        {hasFilters && (
          <Link href={basePath} className="btn-primary inline-flex text-sm !py-2 px-4">
            Limpar filtros
          </Link>
        )}
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-surface-500 mb-4">
        {count === 1 ? '1 produto encontrado' : `${count} produtos encontrados`}
        {totalPages > 1 && ` · página ${page} de ${totalPages}`}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {products.map(product => (
          <ProductCard key={product.id} product={product} disciplineNames={disciplineNames} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          {page > 1 ? (
            <Link href={storeHref(basePath, filters, page - 1)} className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-white border border-surface-200 rounded-lg hover:border-primary/50 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-surface-300 bg-surface-50 border border-surface-100 rounded-lg cursor-not-allowed">
              <ChevronLeft className="w-4 h-4" /> Anterior
            </span>
          )}
          <span className="text-sm text-surface-500 font-medium">{page} / {totalPages}</span>
          {page < totalPages ? (
            <Link href={storeHref(basePath, filters, page + 1)} className="flex items-center gap-1 px-4 py-2 text-sm font-medium bg-white border border-surface-200 rounded-lg hover:border-primary/50 transition-colors">
              Próxima <ChevronRight className="w-4 h-4" />
            </Link>
          ) : (
            <span className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-surface-300 bg-surface-50 border border-surface-100 rounded-lg cursor-not-allowed">
              Próxima <ChevronRight className="w-4 h-4" />
            </span>
          )}
        </div>
      )}
    </div>
  )
}
