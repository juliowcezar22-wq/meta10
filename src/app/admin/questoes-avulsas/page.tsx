import { requireAdmin } from '@/lib/auth/guards'
import { getAllStandaloneQuestions } from '@/lib/data/questions'
import { StandaloneClient } from './standalone-client'

export const dynamic = 'force-dynamic'

export default async function QuestoesAvulsasPage() {
  await requireAdmin()
  const questions = await getAllStandaloneQuestions()

  return <StandaloneClient initialQuestions={questions} />
}
