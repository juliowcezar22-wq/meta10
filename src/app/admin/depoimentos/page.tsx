import { requireAdmin } from '@/lib/auth/guards'
import { getTestimonials } from '@/lib/data/testimonials'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'

export default async function DepoimentosPage() {
  await requireAdmin()
  const testimonials = await getTestimonials()

  const formattedTestimonials = testimonials.map(t => ({
    ...t,
    textNode: <span className="truncate max-w-xs block" title={t.text}>{t.text}</span>,
    ratingFormatted: `${t.rating} estrelas`,
    statusNode: (
      <Badge variant={t.is_active ? 'success' : 'gray'}>
        {t.is_active ? 'Visível' : 'Oculto'}
      </Badge>
    )
  }))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Depoimentos" 
        description="Gerencie os depoimentos dos alunos aprovados."
        action={
          <button className="btn-primary">Novo Depoimento</button>
        }
      />
      
      <DataTable 
        data={formattedTestimonials}
        searchKey="author_name"
        searchPlaceholder="Buscar por nome..."
        columns={[
          { header: 'Autor', accessor: 'author_name' },
          { header: 'Texto', accessor: 'textNode' },
          { header: 'Avaliação', accessor: 'ratingFormatted' },
          { header: 'Status', accessor: 'statusNode' }
        ]}
      />
    </div>
  )
}
