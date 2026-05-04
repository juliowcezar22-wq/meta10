import { ShoppingCart, FileText, BookOpen, Gamepad2 } from 'lucide-react'
import { STORE_PRODUCTS } from '@/lib/constants'

const categoryIcons: Record<string, React.ElementType> = {
  PDF: FileText,
  Apostila: BookOpen,
  Jogo: Gamepad2,
}

export default function LojaPage() {
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
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {STORE_PRODUCTS.map((product) => {
              const Icon = categoryIcons[product.category] || FileText
              return (
                <div key={product.id} className="card card-hover overflow-hidden">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-gray-400" />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-medium text-purple bg-purple-50 px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                    <h3 className="font-semibold text-gray-900 mt-2 mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{product.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">{product.price}</span>
                      <button className="btn-primary text-sm">
                        <ShoppingCart className="w-4 h-4" />
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
