import { requireAdmin } from '@/lib/auth/guards'
import { getActiveStudents } from '@/lib/data/users'
import { AlunosAtivosClient } from './alunos-ativos-client'

export const dynamic = 'force-dynamic'

export default async function AlunosAtivosPage() {
  await requireAdmin()
  const activeStudents = await getActiveStudents()
  
  return <AlunosAtivosClient students={activeStudents} />
}
