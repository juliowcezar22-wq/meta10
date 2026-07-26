'use client'

import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import Link from 'next/link'
import { ProfessorMetrics } from '@/lib/data/users'

export function ProfessoresClient({ professores, period }: { professores: ProfessorMetrics[], period: string }) {
  const router = useRouter()
  
  const formattedProfessores = professores.map(p => {
    const formatDate = (d: string | null) => d ? new Date(d).toLocaleDateString('pt-BR') : '—'

    return {
      ...p,
      nomeNode: (
        <div>
          <div className="font-medium text-surface-900">{p.nome}</div>
          <div className="text-surface-500 text-xs hidden md:block">{p.email}</div>
        </div>
      ),
      questoesNode: <Badge variant={p.metricas.questoes > 0 ? 'primary' : 'gray'}>{p.metricas.questoes}</Badge>,
      atividadesNode: <Badge variant={p.metricas.atividades > 0 ? 'purple' : 'gray'}>{p.metricas.atividades}</Badge>,
      jogosNode: <Badge variant={p.metricas.jogos > 0 ? 'purple' : 'gray'}>{p.metricas.jogos}</Badge>,
      resumosNode: <Badge variant={p.metricas.resumos > 0 ? 'warning' : 'gray'}>{p.metricas.resumos}</Badge>,
      mediaNode: <span className="text-surface-600 font-medium">{p.metricas.mediaDia} / dia</span>,
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Produtividade</h1>
          <p className="text-surface-500 text-sm mt-1">
            Acompanhe a criação de conteúdo por professor
          </p>
        </div>
        
        <div className="flex bg-surface-100 p-1 rounded-xl">
          <button
            onClick={() => router.push('?period=7d')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${period === '7d' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Últimos 7 dias
          </button>
          <button
            onClick={() => router.push('?period=30d')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${period === '30d' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Últimos 30 dias
          </button>
          <button
            onClick={() => router.push('?period=total')}
            className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${period === 'total' ? 'bg-white text-surface-900 shadow-sm' : 'text-surface-500 hover:text-surface-900'}`}
          >
            Total
          </button>
        </div>
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
              { header: 'Professor', accessor: 'nomeNode' },
              { header: 'Questões', accessor: 'questoesNode' },
              { header: 'Atividades', accessor: 'atividadesNode' },
              { header: 'Jogos', accessor: 'jogosNode' },
              { header: 'Resumos', accessor: 'resumosNode' },
              { header: 'Média', accessor: 'mediaNode' },
              { header: 'Ações', accessor: 'actionsNode' }
            ]}
          />
        )}
      </div>
    </div>
  )
}
