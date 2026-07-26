import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { searchProducts } from '@/lib/data/products'
import { getDisciplines } from '@/lib/data/disciplines'
import { getAllSubjects } from '@/lib/data/subjects'
import { StoreSearch } from '@/components/loja/store-search'
import { ProductCard } from '@/components/loja/product-card'

export default async function ProductsSection() {
  const [disciplines, subjects, result] = await Promise.all([
    getDisciplines(),
    getAllSubjects(),
    searchProducts({ page: 1 }),
  ])

  if (result.count === 0) return null

  const displayProducts = result.products.slice(0, 4)
  const disciplineNames = Object.fromEntries(disciplines.map(d => [d.slug, d.name]))

  return (
    <section className="section-padding bg-[#78B140]">
      <div className="container-custom">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B0F19] mb-4 tracking-tight">
            Nossa Loja
          </h2>
          <p className="text-[#0f2404] text-lg max-w-xl mx-auto font-medium">
            Cursos, apostilas e materiais premium para acelerar seus estudos.
          </p>
        </div>

        {/* Busca: ao filtrar, navega para /loja já com os filtros aplicados */}
        <div className="max-w-4xl mx-auto mb-10">
          <StoreSearch basePath="/loja" disciplines={disciplines} subjects={subjects} dark />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-12">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} disciplineNames={disciplineNames} />
          ))}
        </div>

        <div className="text-center">
          <Link href="/loja" className="inline-flex items-center gap-2 text-[#0B0F19] font-semibold hover:text-white transition-colors">
            Ver loja completa
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
