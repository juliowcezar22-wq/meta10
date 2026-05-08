import { requireAdmin } from '@/lib/auth/guards'
import { getQuestionLists } from '@/lib/data/question-lists'
import { PageHeader } from '@/components/admin/page-header'
import { QuestionListsClient } from './question-lists-client'

export default async function QuestoesPage() {
  await requireAdmin()
  const lists = await getQuestionLists()

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Questões" 
        description="Gerencie as listas de questões para os alunos."
        action={
          <button className="btn-primary">Nova Lista</button>
        }
      />
      <QuestionListsClient initialData={lists} />
    </div>
  )
}
