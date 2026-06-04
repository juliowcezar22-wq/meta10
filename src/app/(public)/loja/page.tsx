import { ShoppingBag, ExternalLink, Download } from 'lucide-react'
import Image from 'next/image'
import { getActiveProducts } from '@/lib/data/products'

export default async function LojaPage() {
  const products = await getActiveProducts()

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-purple-50 to-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Loja de Produtos
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Materiais exclusivos para turbinar seus estudos.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding bg-gray-50 min-h-[50vh]">
        <div className="container-custom">
          {!products || products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Nenhum produto disponível no momento.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const isGratuito = product.tipo === 'gratuito'
                const href = isGratuito ? (product.arquivo_url || '#') : (product.hotmart_link || '#')

                return (
                  <div key={product.id} className="card card-hover overflow-hidden flex flex-col bg-white">
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
                        <span className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${isGratuito ? 'bg-success text-white' : 'bg-primary text-white'}`}>
                          {isGratuito ? 'Gratuito' : `R$ ${product.price?.toFixed(2).replace('.', ',')}`}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex flex-col flex-1">
                      <span className="self-start text-xs font-medium text-purple bg-purple-50 px-2 py-0.5 rounded-full mb-2">
                        {isGratuito ? 'Material Gratuito' : 'Material Premium'}
                      </span>
                      <h3 className="font-bold text-gray-900 text-lg mb-1 line-clamp-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-6 line-clamp-2 flex-1">{product.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-2xl font-bold text-primary mr-4">
                          {isGratuito ? 'Grátis' : `R$ ${product.price?.toFixed(2).replace('.', ',')}`}
                        </span>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`btn text-sm !py-2 px-4 group/btn ${isGratuito ? 'btn-secondary' : 'btn-primary'}`}
                        >
                          <span>{isGratuito ? 'Baixar' : 'Comprar'}</span>
                          {isGratuito ? (
                            <Download className="w-4 h-4 ml-2" />
                          ) : (
                            <ExternalLink className="w-4 h-4 ml-2" />
                          )}
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
