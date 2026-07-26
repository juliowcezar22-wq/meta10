import { requireAuth } from '@/lib/auth/guards'
import { getStandaloneQuestionsBySubject } from '@/lib/data/questions'
import {
  getMyQuestionStats,
  getQuestionStats,
  countMyAnsweredQuestions,
} from '@/lib/data/standalone-answers'
import { hasActiveSubscription } from '@/lib/data/subscriptions'
import { getAllSubjects } from '@/lib/data/subjects'
import { getDisciplineBySlug } from '@/lib/data/disciplines'
import { FREE_PLAN_QUESTION_LIMIT } from '@/lib/plans'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Circle, RotateCcw, Users, Crown } from 'lucide-react'
import { Badge } from '@/components/admin/badge'
import { SubjectFilter } from '@/components/aluno/subject-filter'
import { DIFFICULTY_LABELS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function QuestoesAvulsasSubjectPage({ params, searchParams }: { params: { subject: string }, searchParams: { assunto?: string } }) {
  await requireAuth()
  const assuntoId = searchParams.assunto

  const [questions, allSubjects, discipline, isPaid, answeredCount] = await Promise.all([
    getStandaloneQuestionsBySubject(params.subject, assuntoId),
    getAllSubjects(),
    getDisciplineBySlug(params.subject),
    hasActiveSubscription(),
    countMyAnsweredQuestions(),
  ])

  const questionIds = questions.map(q => q.id)
  const [myStats, collectiveStats] = questionIds.length > 0
    ? await Promise.all([getMyQuestionStats(questionIds), getQuestionStats(questionIds)])
    : [new Map(), new Map()]

  const currentSubjects = allSubjects.filter(s => s.discipline === params.subject)
  const subjectName = discipline?.name ?? params.subject
  const limitReached = !isPaid && answeredCount >= FREE_PLAN_QUESTION_LIMIT

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

      {!isPaid && (
        <div className={`mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 ${limitReached ? 'bg-amber-50 border-amber-200' : 'bg-white border-surface-200'}`}>
          <p className="text-sm text-surface-600">
            <strong className="text-surface-900">Plano Gratuito:</strong>{' '}
            {Math.min(answeredCount, FREE_PLAN_QUESTION_LIMIT)} de {FREE_PLAN_QUESTION_LIMIT} questões respondidas.
            {limitReached && ' Você atingiu o limite — refazer questões já respondidas continua liberado.'}
          </p>
          {limitReached && (
            <Link href="/planos" className="btn-primary text-sm !py-2 !px-4 shrink-0">
              <Crown className="w-4 h-4" />
              Assinar para continuar
            </Link>
          )}
        </div>
      )}

      <SubjectFilter subjects={currentSubjects} discipline={params.subject} />

      {questions.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <p className="text-surface-500">Nenhuma questão encontrada para este filtro.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {questions.map((q, index) => {
            const mine = myStats.get(q.id)
            const coletiva = collectiveStats.get(q.id)
            const isAnswered = Boolean(mine)

            return (
              <div
                key={q.id}
                className="bg-white rounded-2xl p-5 md:p-6 border border-surface-200 shadow-sm hover:shadow-md hover:border-primary-200 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                  <Link href={`/aluno/questoes-avulsas/${params.subject}/${q.id}`} className="flex-1 block">
                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                      <span className="text-sm font-medium text-surface-500 bg-surface-100 px-2 py-1 rounded-md">
                        Questão {index + 1}
                      </span>
                      <Badge variant={q.difficulty === 'facil' ? 'success' : q.difficulty === 'medio' ? 'warning' : 'danger'}>
                        {DIFFICULTY_LABELS[q.difficulty] || q.difficulty}
                      </Badge>
                      <Badge variant={q.question_type === 'multipla_escolha' ? 'primary' : 'purple'}>
                        {q.question_type === 'multipla_escolha' ? 'Múltipla Escolha' : 'V ou F'}
                      </Badge>
                    </div>
                    <p className="text-surface-900 font-medium line-clamp-2">{q.enunciado}</p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-surface-500">
                      {mine && (
                        <span>
                          Você fez <strong className="text-surface-700">{mine.attempts}x</strong>
                          {' · '}
                          <span className="text-success-600 font-semibold">{mine.correct} acerto{mine.correct === 1 ? '' : 's'}</span>
                          {' · '}
                          <span className="text-danger-600 font-semibold">{mine.wrong} erro{mine.wrong === 1 ? '' : 's'}</span>
                        </span>
                      )}
                      {coletiva && coletiva.total_attempts > 0 && (
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {Math.round(Number(coletiva.correct_pct))}% de acerto geral
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="shrink-0 flex md:flex-col items-center md:items-end gap-2">
                    {isAnswered ? (
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${mine?.last_is_correct ? 'bg-success-50 text-success-700 border-success-200' : 'bg-danger-50 text-danger-700 border-danger-200'}`}>
                        <CheckCircle2 className="w-4 h-4" />
                        Respondida
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-surface-50 text-surface-500 border border-surface-200">
                        <Circle className="w-4 h-4" />
                        Não respondida
                      </div>
                    )}
                    {isAnswered && (
                      <Link
                        href={`/aluno/questoes-avulsas/${params.subject}/${q.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium text-primary bg-primary-50 border border-primary-200 hover:bg-primary-100 transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Refazer
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
