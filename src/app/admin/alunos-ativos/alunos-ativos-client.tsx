'use client'

import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import Link from 'next/link'
import { ActiveStudent } from '@/lib/data/users'

export function AlunosAtivosClient({ students }: { students: ActiveStudent[] }) {
  const formattedStudents = students.map(s => {
    let planVariant: 'primary' | 'success' | 'cyan' = 'primary'
    const planNameLower = s.plan_name?.toLowerCase() || ''
    
    if (planNameLower.includes('anual')) {
      planVariant = 'success'
    } else if (planNameLower.includes('semestral')) {
      planVariant = 'cyan'
    }

    const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

    return {
      ...s,
      nomeNode: <div className="font-medium text-surface-900">{s.nome}</div>,
      emailNode: <div className="text-surface-500 text-sm">{s.email}</div>,
      planoNode: <Badge variant={planVariant}>{s.plan_name || 'Desconhecido'}</Badge>,
      expiresAtNode: <span className="text-surface-600">{formatDate(s.expires_at)}</span>,
      lastSubNode: <span className="text-surface-600">{formatDate(s.last_subscription_date)}</span>,
      actionsNode: (
        <Link 
          href={`/admin/usuarios?manage=${s.id}`}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          Gerenciar acesso
        </Link>
      )
    }
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Alunos Ativos</h1>
        <p className="text-surface-500 text-sm mt-1">
          Alunos com assinatura ativa
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-surface-200">
        {students.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-100">
            <p className="text-surface-500">Nenhum aluno ativo no momento.</p>
          </div>
        ) : (
          <DataTable 
            data={formattedStudents}
            searchKey="nome"
            searchPlaceholder="Buscar por nome ou email..."
            columns={[
              { header: 'Nome', accessor: 'nomeNode' },
              { header: 'Email', accessor: 'emailNode' },
              { header: 'Plano', accessor: 'planoNode' },
              { header: 'Data Expiração', accessor: 'expiresAtNode' },
              { header: 'Última Assinatura', accessor: 'lastSubNode' },
              { header: 'Ações', accessor: 'actionsNode' }
            ]}
          />
        )}
      </div>
    </div>
  )
}
