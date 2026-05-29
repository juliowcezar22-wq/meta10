import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ShoppingBag, ExternalLink, Download } from 'lucide-react'
import { getActiveProducts } from '@/lib/data/products'

export default async function ProductsSection() {
  const products = await getActiveProducts()

  if (!products || products.length === 0) return null

  const displayProducts = products.slice(0, 3)

  return (
    <section className="section-padding bg-[#78B140]">
      <div className="container-custom">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#0B0F19] mb-4 tracking-tight">
            Nossa Loja
          </h2>
          <p className="text-[#0f2404] text-lg max-w-xl mx-auto font-medium">
            Cursos, apostilas e materiais premium para acelerar seus estudos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {displayProducts.map((product) => {
            const isGratuito = product.tipo === 'gratuito'
            const href = isGratuito ? (product.arquivo_url || '#') : (product.hotmart_link || '#')

            return (
              <div key={product.id} className="card overflow-hidden flex flex-col group hover:shadow-card-hover transition-all duration-300 bg-white">
                <div className="relative w-full h-48 sm:h-56 bg-surface-100 shrink-0">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-surface-300">
                      <ShoppingBag className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${isGratuito ? 'bg-success text-white' : 'bg-primary text-white'
                      }`}>
                      {isGratuito ? 'Gratuito' : `R$ ${product.price?.toFixed(2).replace('.', ',')}`}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-bold text-surface-900 text-lg mb-2 line-clamp-1">{product.name}</h3>
                  <p className="text-surface-500 text-sm mb-6 line-clamp-2 flex-1">{product.description}</p>

                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn w-full justify-center !py-2.5 group/btn ${isGratuito ? 'btn-secondary' : 'btn-primary'}`}
                  >
                    <span>{isGratuito ? 'Baixar Material' : 'Comprar Agora'}</span>
                    {isGratuito ? (
                      <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                    ) : (
                      <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                    )}
                  </a>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center">
          <Link href="/loja" className="inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-600 transition-colors">
            Ver loja completa
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
