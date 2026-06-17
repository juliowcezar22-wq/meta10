import { getDisciplines } from '@/lib/data/disciplines'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getAllSubjects } from '@/lib/data/subjects'
import { AssuntosClient } from './assuntos-client'

export const dynamic = 'force-dynamic'

export default async function AssuntosPage() {
  await requireAdminOrProfessor()
  
  const subjects = await getAllSubjects()

  const disciplines = await getDisciplines()

  return <AssuntosClient subjects={subjects}  disciplines={disciplines} />
}
