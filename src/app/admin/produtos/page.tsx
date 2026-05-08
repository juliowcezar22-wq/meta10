import { requireAdmin } from '@/lib/auth/guards'
import { getProducts } from '@/lib/data/products'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'

export default async function ProdutosPage() {
  await requireAdmin()
  const products = await getProducts()

  const formattedProducts = products.map(product => ({
    ...product,
    priceFormatted: `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
    linkNode: (
      <a href={product.hotmart_link} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px] block">
        {product.hotmart_link}
      </a>
    ),
    statusNode: (
      <Badge variant={product.is_active ? 'success' : 'gray'}>
        {product.is_active ? 'Ativo' : 'Inativo'}
      </Badge>
    )
  }))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Produtos" 
        description="Gerencie os produtos vendidos na plataforma."
        action={
          <button className="btn-primary">Novo Produto</button>
        }
      />
      
      <DataTable 
        data={formattedProducts}
        searchKey="name"
        searchPlaceholder="Buscar por nome..."
        columns={[
          { header: 'Nome', accessor: 'name' },
          { header: 'Preço', accessor: 'priceFormatted' },
          { header: 'Link Hotmart', accessor: 'linkNode' },
          { header: 'Status', accessor: 'statusNode' }
        ]}
      />
    </div>
  )
}
