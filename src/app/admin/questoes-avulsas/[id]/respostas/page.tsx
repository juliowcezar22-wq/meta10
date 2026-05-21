import { requireAdmin } from '@/lib/auth/guards'
import { getStandaloneQuestionById } from '@/lib/data/questions'
import { getStandaloneAnswersByQuestion } from '@/lib/data/standalone-answers'
import { redirect } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function RespostasAvulsaPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  
  const [question, answers] = await Promise.all([
    getStandaloneQuestionById(params.id),
    getStandaloneAnswersByQuestion(params.id)
  ])
  
  if (!question) redirect('/admin/questoes-avulsas')

  const formattedAnswers = answers
    .map(answer => {
      const isCorrect = answer.is_correct
      let displayAnswer = answer.answer
      if (question.question_type === 'verdadeiro_falso') {
        displayAnswer = displayAnswer.charAt(0).toUpperCase() + displayAnswer.slice(1)
      } else {
        displayAnswer = displayAnswer.toUpperCase()
      }

      return {
        ...answer,
        user_name: answer.user?.nome || answer.user?.email || 'Aluno Desconhecido',
        answerNode: <span className="font-medium text-surface-900">{displayAnswer}</span>,
        resultNode: <Badge variant={isCorrect ? 'success' : 'danger'}>{isCorrect ? 'Acertou' : 'Errou'}</Badge>,
        dataNode: <span className="text-surface-500">{new Date(answer.answered_at).toLocaleDateString('pt-BR')}</span>
      }
    })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <div className="mb-6 flex items-center gap-4">
        <Link href={`/admin/questoes-avulsas`} className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900 line-clamp-1" title={question.enunciado}>Respostas da Questão: {question.enunciado}</h1>
        </div>
      </div>

      <DataTable 
        data={formattedAnswers}
        searchKey="user_name"
        searchPlaceholder="Buscar por nome do aluno..."
        emptyMessage="Nenhum aluno respondeu esta questão ainda."
        columns={[
          { header: 'Nome do Aluno', accessor: 'user_name' },
          { header: 'Resposta', accessor: 'answerNode' },
          { header: 'Resultado', accessor: 'resultNode' },
          { header: 'Data', accessor: 'dataNode' }
        ]}
      />
    </div>
  )
}
