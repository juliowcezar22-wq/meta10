import { requireAuth } from '@/lib/auth/guards'
import { getProducts } from '@/lib/data/products'
import { LojaClient } from './loja-client'

export default async function LojaPage() {
  await requireAuth()
  const products = await getProducts()
  const activeProducts = products.filter(p => p.is_active)

  return <LojaClient products={activeProducts} />
}
