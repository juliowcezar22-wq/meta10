import { getDisciplines } from '@/lib/data/disciplines'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getAllStandaloneQuestions } from '@/lib/data/questions'
import { getAllSubjects } from '@/lib/data/subjects'
import { StandaloneClient } from './standalone-client'

export const dynamic = 'force-dynamic'

export default async function QuestoesAvulsasPage() {
  await requireAdminOrProfessor()
  const questions = await getAllStandaloneQuestions()
  const subjects = await getAllSubjects()

  const disciplines = await getDisciplines()

  return <StandaloneClient initialQuestions={questions} subjects={subjects}  disciplines={disciplines} />
}
