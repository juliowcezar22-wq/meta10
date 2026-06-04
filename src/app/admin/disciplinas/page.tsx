import { requireAdmin } from '@/lib/auth/guards'
import { getDisciplines } from '@/lib/data/disciplines'
import { DisciplinasClient } from './disciplinas-client'

export const dynamic = 'force-dynamic'

export default async function DisciplinasPage() {
  await requireAdmin()
  
  const disciplines = await getDisciplines()

  return <DisciplinasClient disciplines={disciplines} />
}
