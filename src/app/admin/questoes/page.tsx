import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getQuestionLists } from '@/lib/data/question-lists'
import { QuestionListsClient } from './question-lists-client'

export default async function QuestoesPage() {
  await requireAdminOrProfessor()
  const lists = await getQuestionLists()

  return <QuestionListsClient initialData={lists} />
}
