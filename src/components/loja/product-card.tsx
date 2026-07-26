import Image from 'next/image'
import { ShoppingBag, ExternalLink, Download } from 'lucide-react'
import type { Product } from '@/lib/types/product'
import { MATERIAL_TYPE_LABELS } from '@/lib/constants'

const formatBRL = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

interface ProductCardProps {
  product: Product
  disciplineNames: Record<string, string>
}

/**
 * Card compacto de produto (referência Mundo Kids, em escala menor):
 * imagem em proporção fixa, nome, disciplina, tipo de material, preço
 * (com promoção riscando o cheio + % de desconto) e botão de compra.
 */
export function ProductCard({ product, disciplineNames }: ProductCardProps) {
  const isGratuito = product.tipo === 'gratuito'
  const href = isGratuito ? (product.arquivo_url || '#') : (product.hotmart_link || '#')
  const hasPromo = !isGratuito && product.promo_price != null && product.promo_price < product.price
  const discount = hasPromo ? Math.round((1 - (product.promo_price as number) / product.price) * 100) : 0

  return (
    <div className="card overflow-hidden flex flex-col bg-white group hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
      {/* Imagem em proporção fixa para não quebrar o grid */}
      <div className="relative aspect-[4/3] bg-surface-100 shrink-0">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            loading="lazy"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-surface-300">
            <ShoppingBag className="w-8 h-8" />
          </div>
        )}
        {hasPromo && (
          <span className="absolute top-2 left-2 bg-danger-500 text-white text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
            -{discount}%
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-2">
          {product.material_type && (
            <span className="text-[11px] font-medium text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
              {MATERIAL_TYPE_LABELS[product.material_type] || product.material_type}
            </span>
          )}
          {product.subject && (
            <span className="text-[11px] font-medium text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full capitalize">
              {disciplineNames[product.subject] || product.subject}
            </span>
          )}
        </div>

        <h3 className="font-bold text-surface-900 text-sm mb-1 line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-surface-500 mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="mt-auto pt-3 border-t border-surface-100 flex items-center justify-between gap-2">
          <div className="min-w-0">
            {isGratuito ? (
              <span className="text-sm font-extrabold text-success-600">Grátis</span>
            ) : hasPromo ? (
              <div className="leading-tight">
                <span className="block text-[11px] text-surface-400 line-through">{formatBRL(product.price)}</span>
                <span className="text-base font-extrabold text-primary">{formatBRL(product.promo_price as number)}</span>
              </div>
            ) : (
              <span className="text-base font-extrabold text-primary">{formatBRL(product.price)}</span>
            )}
          </div>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors ${isGratuito ? 'bg-success-500 hover:bg-success-600 text-white' : 'bg-primary hover:bg-primary-600 text-white'}`}
          >
            {isGratuito ? (<><Download className="w-3.5 h-3.5" /> Baixar</>) : (<><ExternalLink className="w-3.5 h-3.5" /> Comprar</>)}
          </a>
        </div>
      </div>
    </div>
  )
}
