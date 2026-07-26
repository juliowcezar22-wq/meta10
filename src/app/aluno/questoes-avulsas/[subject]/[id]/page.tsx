import { requireAuth } from '@/lib/auth/guards'
import { getStandaloneQuestionById } from '@/lib/data/questions'
import {
  getMyQuestionStats,
  getQuestionStats,
  countMyAnsweredQuestions,
} from '@/lib/data/standalone-answers'
import { hasActiveSubscription } from '@/lib/data/subscriptions'
import { getDisciplineBySlug } from '@/lib/data/disciplines'
import { FREE_PLAN_QUESTION_LIMIT } from '@/lib/plans'
import { notFound } from 'next/navigation'
import { SolveClient } from './solve-client'

export const dynamic = 'force-dynamic'

export default async function SolveQuestionPage({ params }: { params: { subject: string, id: string } }) {
  await requireAuth()
  const question = await getStandaloneQuestionById(params.id)

  if (!question || question.subject !== params.subject) {
    notFound()
  }

  const [discipline, myStatsMap, collectiveMap, isPaid, answeredCount] = await Promise.all([
    getDisciplineBySlug(params.subject),
    getMyQuestionStats([question.id]),
    getQuestionStats([question.id]),
    hasActiveSubscription(),
    countMyAnsweredQuestions(),
  ])

  const myStats = myStatsMap.get(question.id) ?? null

  return (
    <SolveClient
      question={question}
      subject={params.subject}
      disciplineName={discipline?.name ?? params.subject}
      myStats={myStats}
      collectiveStats={collectiveMap.get(question.id) ?? null}
      limitInfo={{
        isPaid,
        limit: FREE_PLAN_QUESTION_LIMIT,
        answeredCount,
        // refazer questão já respondida não consome o limite
        blocked: !isPaid && !myStats && answeredCount >= FREE_PLAN_QUESTION_LIMIT,
      }}
    />
  )
}
