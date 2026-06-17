import { getDisciplines } from '@/lib/data/disciplines'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getQuestionLists } from '@/lib/data/question-lists'
import { getAllSubjects } from '@/lib/data/subjects'
import { QuestionListsClient } from './question-lists-client'

export default async function QuestoesPage() {
  await requireAdminOrProfessor()
  const lists = await getQuestionLists()
  const subjects = await getAllSubjects()

  const disciplines = await getDisciplines()

  return <QuestionListsClient initialData={lists} subjects={subjects}  disciplines={disciplines} />
}
