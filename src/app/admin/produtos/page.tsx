import { requireAdmin } from '@/lib/auth/guards'
import { getProducts } from '@/lib/data/products'
import { getDisciplines } from '@/lib/data/disciplines'
import { getAllSubjects } from '@/lib/data/subjects'
import { ProdutosClient } from './produtos-client'

export default async function ProdutosPage() {
  await requireAdmin()
  const [products, disciplines, subjects] = await Promise.all([
    getProducts(),
    getDisciplines(),
    getAllSubjects(),
  ])

  return <ProdutosClient initialData={products} disciplines={disciplines} subjects={subjects} />
}
