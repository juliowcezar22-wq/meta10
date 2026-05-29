'use client'

import { DataTable } from '@/components/admin/data-table'
import Link from 'next/link'
import { Professor } from '@/lib/data/users'

export function ProfessoresClient({ professores }: { professores: Professor[] }) {
  const formattedProfessores = professores.map(p => {
    const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

    return {
      ...p,
      nomeNode: <div className="font-medium text-surface-900">{p.nome}</div>,
      emailNode: <div className="text-surface-500 text-sm">{p.email}</div>,
      createdAtNode: <span className="text-surface-600">{formatDate(p.created_at)}</span>,
      actionsNode: (
        <Link 
          href={`/admin/usuarios?manage=${p.id}`}
          className="btn-secondary text-sm py-1.5 px-3"
        >
          Gerenciar acesso
        </Link>
      )
    }
  })

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900">Professores</h1>
        <p className="text-surface-500 text-sm mt-1">
          Professores com acesso parcial ao painel
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-surface-200">
        {professores.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-100">
            <p className="text-surface-500">Nenhum professor cadastrado ainda.</p>
          </div>
        ) : (
          <DataTable 
            data={formattedProfessores}
            searchKey="nome"
            searchPlaceholder="Buscar por nome ou email..."
            columns={[
              { header: 'Nome', accessor: 'nomeNode' },
              { header: 'Email', accessor: 'emailNode' },
              { header: 'Data de Cadastro', accessor: 'createdAtNode' },
              { header: 'Ações', accessor: 'actionsNode' }
            ]}
          />
        )}
      </div>
    </>
  )
}
