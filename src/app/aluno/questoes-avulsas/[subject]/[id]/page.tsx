import { requireAuth } from '@/lib/auth/guards'
import { getStandaloneQuestionById } from '@/lib/data/questions'
import { getMyStandaloneAnswers } from '@/lib/data/standalone-answers'
import { notFound } from 'next/navigation'
import { SolveClient } from './solve-client'

export const dynamic = 'force-dynamic'

export default async function SolveQuestionPage({ params }: { params: { subject: string, id: string } }) {
  const user = await requireAuth()
  const question = await getStandaloneQuestionById(params.id)

  if (!question || question.subject !== params.subject) {
    notFound()
  }

  // Verificar se o aluno já respondeu esta questão antes
  const answers = await getMyStandaloneAnswers(user.profile.id)
  const previousAnswer = answers.find(a => a.question_id === question.id)

  return (
    <SolveClient 
      question={question} 
      subject={params.subject} 
      previousAnswer={previousAnswer || null} 
    />
  )
}
