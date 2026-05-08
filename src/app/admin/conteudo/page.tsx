import { requireAdmin } from '@/lib/auth/guards'
import { getMaterials } from '@/lib/data/materials'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'

export default async function ConteudoPage() {
  await requireAdmin()
  const materials = await getMaterials()

  const formattedMaterials = materials.map(material => ({
    ...material,
    typeNode: (
      <Badge variant="cyan" className="uppercase text-[10px]">
        {material.type}
      </Badge>
    ),
    subjectNode: <span className="capitalize">{material.subject || '-'}</span>,
    accessNode: (
      <Badge variant={material.is_free ? 'success' : 'primary'}>
        {material.is_free ? 'Gratuito' : 'Premium'}
      </Badge>
    )
  }))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Conteúdo e Materiais" 
        description="Gerencie PDFs, mapas mentais e resumos."
        action={
          <button className="btn-primary">Novo Material</button>
        }
      />
      
      <DataTable 
        data={formattedMaterials}
        searchKey="title"
        searchPlaceholder="Buscar por título..."
        columns={[
          { header: 'Título', accessor: 'title' },
          { header: 'Tipo', accessor: 'typeNode' },
          { header: 'Disciplina', accessor: 'subjectNode' },
          { header: 'Acesso', accessor: 'accessNode' }
        ]}
      />
    </div>
  )
}
