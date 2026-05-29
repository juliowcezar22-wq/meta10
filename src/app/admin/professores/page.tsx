import { requireAdmin } from '@/lib/auth/guards'
import { getProfessores } from '@/lib/data/users'
import { ProfessoresClient } from './professores-client'

export const dynamic = 'force-dynamic'

export default async function ProfessoresPage() {
  await requireAdmin()
  const professores = await getProfessores()
  
  return <ProfessoresClient professores={professores} />
}
