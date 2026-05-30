import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getAllSubjects } from '@/lib/data/subjects'
import { AssuntosClient } from './assuntos-client'

export const dynamic = 'force-dynamic'

export default async function AssuntosPage() {
  await requireAdminOrProfessor()
  
  const subjects = await getAllSubjects()

  return <AssuntosClient subjects={subjects} />
}
