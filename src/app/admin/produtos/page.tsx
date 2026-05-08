import { requireAdmin } from '@/lib/auth/guards'
import { getProducts } from '@/lib/data/products'
import { ProdutosClient } from './produtos-client'

export default async function ProdutosPage() {
  await requireAdmin()
  const products = await getProducts()

  return <ProdutosClient initialData={products} />
}
