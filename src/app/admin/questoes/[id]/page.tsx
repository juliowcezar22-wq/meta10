import { requireAdmin } from '@/lib/auth/guards'
import { getQuestionListById } from '@/lib/data/question-lists'
import { getQuestionsByListId } from '@/lib/data/questions'
import { redirect } from 'next/navigation'
import { ListDetailClient } from './list-detail-client'

export default async function ListDetailPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const list = await getQuestionListById(params.id)
  
  if (!list) redirect('/admin/questoes')

  const questions = await getQuestionsByListId(params.id)

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <ListDetailClient list={list} initialQuestions={questions} />
    </div>
  )
}
