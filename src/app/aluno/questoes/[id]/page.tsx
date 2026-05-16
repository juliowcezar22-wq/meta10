import { requireAuth } from '@/lib/auth/guards'
import { getQuestionListById } from '@/lib/data/question-lists'
import { getQuestionsByListId } from '@/lib/data/questions'
import { redirect } from 'next/navigation'
import { QuizClient } from './quiz-client'

export default async function QuizPage({ params }: { params: { id: string } }) {
  await requireAuth()
  const list = await getQuestionListById(params.id)
  
  if (!list || !list.is_active) redirect('/aluno/questoes')

  const questions = await getQuestionsByListId(params.id)

  if (questions.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-surface-500">Este simulado não possui questões ainda.</p>
      </div>
    )
  }

  return <QuizClient list={list} questions={questions} />
}
