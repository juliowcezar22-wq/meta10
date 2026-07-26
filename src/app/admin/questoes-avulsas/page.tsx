import { getDisciplines } from '@/lib/data/disciplines'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getAllStandaloneQuestions } from '@/lib/data/questions'
import { getAllSubjects } from '@/lib/data/subjects'
import { getQuestionStats } from '@/lib/data/standalone-answers'
import { StandaloneClient } from './standalone-client'

export const dynamic = 'force-dynamic'

export default async function QuestoesAvulsasPage() {
  await requireAdminOrProfessor()
  const [questions, subjects, disciplines, statsMap] = await Promise.all([
    getAllStandaloneQuestions(),
    getAllSubjects(),
    getDisciplines(),
    getQuestionStats(),
  ])

  // Map -> objeto serializável para o client component
  const stats = Object.fromEntries(
    Array.from(statsMap.entries()).map(([id, s]) => [id, {
      total_attempts: Number(s.total_attempts),
      correct_pct: Number(s.correct_pct),
    }])
  )

  return <StandaloneClient initialQuestions={questions} subjects={subjects} disciplines={disciplines} stats={stats} />
}
