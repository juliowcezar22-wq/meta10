import { requireAdmin } from '@/lib/auth/guards'
import { getMessages } from '@/lib/data/messages'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'

export default async function MensagensPage() {
  await requireAdmin()
  const messages = await getMessages()

  const formattedMessages = messages.map(m => ({
    ...m,
    subjectNode: m.subject || '-',
    statusNode: (
      <Badge variant={m.is_read ? 'gray' : 'warning'}>
        {m.is_read ? 'Lida' : 'Não lida'}
      </Badge>
    ),
    dateFormatted: new Date(m.created_at).toLocaleDateString('pt-BR')
  }))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Mensagens (Leads)" 
        description="Acompanhe os contatos recebidos pelo site."
      />
      
      <DataTable 
        data={formattedMessages}
        searchKey="name"
        searchPlaceholder="Buscar por nome ou email..."
        columns={[
          { header: 'Nome', accessor: 'name' },
          { header: 'E-mail', accessor: 'email' },
          { header: 'Assunto', accessor: 'subjectNode' },
          { header: 'Status', accessor: 'statusNode' },
          { header: 'Data', accessor: 'dateFormatted' }
        ]}
      />
    </div>
  )
}
