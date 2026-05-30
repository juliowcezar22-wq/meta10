import { requireAdmin } from '@/lib/auth/guards'
import { getProfessoresWithMetrics } from '@/lib/data/users'
import { ProfessoresClient } from './professores-client'

export const dynamic = 'force-dynamic'

export default async function ProfessoresPage({ searchParams }: { searchParams: { period?: string } }) {
  await requireAdmin()
  const period = (searchParams.period === '7d' || searchParams.period === '30d') ? searchParams.period : 'total'
  const professores = await getProfessoresWithMetrics(period)
  
  return <ProfessoresClient professores={professores} period={period} />
}
