import { requireAdmin } from '@/lib/auth/guards'
import { getQuestions } from '@/lib/data/questions'
import { PageHeader } from '@/components/admin/page-header'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'

export default async function QuestoesPage() {
  await requireAdmin()
  const questions = await getQuestions()

  const formattedQuestions = questions.map(q => ({
    ...q,
    enunciadoNode: <span className="truncate max-w-sm block" title={q.enunciado}>{q.enunciado}</span>,
    subjectNode: <span className="capitalize">{q.subject}</span>,
    difficultyNode: (
      <Badge variant={q.difficulty === 'facil' ? 'success' : q.difficulty === 'medio' ? 'warning' : 'danger'}>
        {q.difficulty}
      </Badge>
    ),
    gabaritoNode: <span className="uppercase font-bold">{q.gabarito}</span>
  }))

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Banco de Questões" 
        description="Gerencie as questões para os simulados."
        action={
          <button className="btn-primary">Nova Questão</button>
        }
      />
      
      <DataTable 
        data={formattedQuestions}
        searchKey="enunciado"
        searchPlaceholder="Buscar no enunciado..."
        columns={[
          { header: 'Enunciado', accessor: 'enunciadoNode' },
          { header: 'Disciplina', accessor: 'subjectNode' },
          { header: 'Dificuldade', accessor: 'difficultyNode' },
          { header: 'Gabarito', accessor: 'gabaritoNode' }
        ]}
      />
    </div>
  )
}
