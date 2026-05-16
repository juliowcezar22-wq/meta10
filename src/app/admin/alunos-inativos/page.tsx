import { requireAdmin } from '@/lib/auth/guards'
import { getInactiveStudents } from '@/lib/data/users'
import { AlunosInativosClient } from './alunos-inativos-client'

export const dynamic = 'force-dynamic'

export default async function AlunosInativosPage() {
  await requireAdmin()
  const inactiveStudents = await getInactiveStudents()
  
  return <AlunosInativosClient students={inactiveStudents} />
}
