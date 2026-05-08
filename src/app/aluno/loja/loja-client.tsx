'use client'

import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/types/product'

export function LojaClient({ products }: { products: Product[] }) {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-surface-900">Loja</h1>
        <p className="text-surface-500 mt-2">Confira nossos produtos adicionais para acelerar sua aprovação.</p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-surface-50 rounded-2xl border border-surface-200">
          <ShoppingBag className="w-12 h-12 text-surface-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-surface-900 mb-2">Nenhum produto disponível</h2>
          <p className="text-surface-500">Estamos preparando novidades para você. Volte em breve!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <div key={product.id} className="card overflow-hidden flex flex-col hover:border-primary/50 transition-colors">
              <div className="aspect-video bg-surface-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-surface-400">
                  <ShoppingBag className="w-8 h-8 opacity-50" />
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-surface-900 mb-2">{product.name}</h3>
                {product.description && (
                  <p className="text-surface-500 text-sm mb-6 line-clamp-3 flex-1">{product.description}</p>
                )}
                
                <div className="mt-auto pt-4 border-t border-surface-100 flex items-center justify-between">
                  {product.tipo === 'pago' ? (
                    <>
                      <span className="text-xl font-extrabold text-primary">
                        R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                      <a 
                        href={product.hotmart_link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-primary"
                      >
                        Comprar
                      </a>
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-extrabold text-success-600 bg-success-50 px-3 py-1.5 rounded-md">
                        GRATUITO
                      </span>
                      <a 
                        href={product.arquivo_url || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-success-500 hover:bg-success-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Baixar
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
