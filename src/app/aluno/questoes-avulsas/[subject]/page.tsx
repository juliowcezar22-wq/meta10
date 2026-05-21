import { requireAuth } from '@/lib/auth/guards'
import { getStandaloneQuestionsBySubject } from '@/lib/data/questions'
import { getMyStandaloneAnswers } from '@/lib/data/standalone-answers'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import { Badge } from '@/components/admin/badge'

export const dynamic = 'force-dynamic'

export default async function QuestoesAvulsasSubjectPage({ params }: { params: { subject: string } }) {
  const user = await requireAuth()
  const questions = await getStandaloneQuestionsBySubject(params.subject)
  const myAnswers = await getMyStandaloneAnswers(user.profile.id)

  const answeredIds = new Set(myAnswers.map(a => a.question_id))

  const subjectName = params.subject.charAt(0).toUpperCase() + params.subject.slice(1)

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto w-full">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/aluno/questoes-avulsas" className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-surface-900">Questões de {subjectName}</h1>
          <p className="text-surface-500 mt-1">Pratique resolvendo as questões abaixo.</p>
        </div>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <p className="text-surface-500">Nenhuma questão encontrada para esta matéria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {questions.map((q, index) => {
            const isAnswered = answeredIds.has(q.id)
            const answerDetail = myAnswers.find(a => a.question_id === q.id)

            return (
              <Link 
                key={q.id} 
                href={`/aluno/questoes-avulsas/${params.subject}/${q.id}`}
                className="block bg-white rounded-2xl p-5 md:p-6 border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-surface-500 bg-surface-100 px-2 py-1 rounded-md">
                        Questão {index + 1}
                      </span>
                      <Badge variant={q.difficulty === 'facil' ? 'success' : q.difficulty === 'medio' ? 'warning' : 'danger'}>
                        {q.difficulty}
                      </Badge>
                      <Badge variant={q.question_type === 'multipla_escolha' ? 'primary' : 'purple'}>
                        {q.question_type === 'multipla_escolha' ? 'Múltipla Escolha' : 'V ou F'}
                      </Badge>
                    </div>
                    <p className="text-surface-900 font-medium line-clamp-2">{q.enunciado}</p>
                  </div>
                  
                  <div className="shrink-0 flex items-center justify-end">
                    {isAnswered ? (
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${answerDetail?.is_correct ? 'bg-success-50 text-success-700 border-success-200' : 'bg-danger-50 text-danger-700 border-danger-200'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        Respondida
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-surface-50 text-surface-500 border border-surface-200">
                        <Circle className="w-4 h-4" />
                        Não respondida
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
