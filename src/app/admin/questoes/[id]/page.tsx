import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getQuestionListById } from '@/lib/data/question-lists'
import { getQuestionsByListId } from '@/lib/data/questions'
import { redirect } from 'next/navigation'
import { ListDetailClient } from './list-detail-client'

export default async function ListDetailPage({ params }: { params: { id: string } }) {
  await requireAdminOrProfessor()
  const [list, questions] = await Promise.all([
    getQuestionListById(params.id),
    getQuestionsByListId(params.id)
  ])
  
  if (!list) redirect('/admin/questoes')

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <ListDetailClient list={list} initialQuestions={questions} />
    </div>
  )
}
