import { requireAdmin } from '@/lib/auth/guards'
import { getUsers } from '@/lib/data/users'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'

export default async function UsuariosPage() {
  await requireAdmin()
  const users = await getUsers()

  const formattedUsers = users.map(user => ({
    ...user,
    roleNode: (
      <Badge variant={user.role === 'admin' ? 'purple' : user.role === 'professor' ? 'cyan' : 'gray'}>
        {user.role}
      </Badge>
    ),
    planNode: user.plan_name || 'Nenhum',
    statusNode: user.plan_status ? (
      <Badge variant={user.plan_status === 'active' ? 'success' : 'danger'}>
        {user.plan_status === 'active' ? 'Ativo' : 'Expirado'}
      </Badge>
    ) : '-'
  }))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Usuários" 
        description="Gerencie os usuários e assinaturas da plataforma."
      />
      
      <DataTable 
        data={formattedUsers}
        searchKey="nome"
        searchPlaceholder="Buscar por nome..."
        columns={[
          { header: 'Nome', accessor: 'nome' },
          { header: 'Email', accessor: 'email' },
          { header: 'Tipo', accessor: 'roleNode' },
          { header: 'Plano Atual', accessor: 'planNode' },
          { header: 'Status', accessor: 'statusNode' }
        ]}
      />
    </div>
  )
}
