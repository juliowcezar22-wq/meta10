import { requireAdmin } from '@/lib/auth/guards'
import { getQuestionListById } from '@/lib/data/question-lists'
import { getAttemptsByListId } from '@/lib/data/question-lists'
import { redirect } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function RespostasPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const list = await getQuestionListById(params.id)
  
  if (!list) redirect('/admin/questoes')

  const attempts = await getAttemptsByListId(params.id)

  const formattedAttempts = attempts
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(attempt => {
      const percentage = attempt.total_questions 
        ? Math.round(((attempt.score || 0) / attempt.total_questions) * 100) 
        : 0
      
      let variant: 'success' | 'warning' | 'danger' = 'success'
      if (percentage < 40) variant = 'danger'
      else if (percentage <= 70) variant = 'warning'

      return {
        ...attempt,
        dataNode: <span>{new Date(attempt.finished_at || attempt.created_at).toLocaleDateString('pt-BR')}</span>,
        acertosNode: <span>{attempt.score || 0} / {attempt.total_questions || 0}</span>,
        percentNode: <Badge variant={variant}>{percentage}%</Badge>
      }
    })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/admin/questoes/${list.id}`} className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900">Respostas: {list.name}</h1>
        </div>
      </div>

      <DataTable 
        data={formattedAttempts}
        searchKey="user_name"
        searchPlaceholder="Buscar por nome do aluno..."
        emptyMessage="Nenhum aluno respondeu esta lista ainda."
        columns={[
          { header: 'Nome do Aluno', accessor: 'user_name' },
          { header: 'Data', accessor: 'dataNode' },
          { header: 'Acertos', accessor: 'acertosNode' },
          { header: '% de Acerto', accessor: 'percentNode' }
        ]}
      />
    </div>
  )
}
