import { requireAdmin } from '@/lib/auth/guards'
import { getSimulados } from '@/lib/data/simulados'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'

export default async function SimuladosPage() {
  await requireAdmin()
  const simulados = await getSimulados()

  const formattedSimulados = simulados.map(s => ({
    ...s,
    subjectNode: <span className="capitalize">{s.subject}</span>,
    statusNode: (
      <Badge variant={s.is_active ? 'success' : 'gray'}>
        {s.is_active ? 'Ativo' : 'Inativo'}
      </Badge>
    )
  }))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Simulados" 
        description="Crie e gerencie provas simuladas."
        action={
          <button className="btn-primary">Novo Simulado</button>
        }
      />
      
      <DataTable 
        data={formattedSimulados}
        searchKey="name"
        searchPlaceholder="Buscar por nome..."
        columns={[
          { header: 'Nome', accessor: 'name' },
          { header: 'Disciplina', accessor: 'subjectNode' },
          { header: 'Duração (min)', accessor: 'duration_minutes' },
          { header: 'Status', accessor: 'statusNode' }
        ]}
      />
    </div>
  )
}
