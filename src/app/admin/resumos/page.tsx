import { getDisciplines } from '@/lib/data/disciplines'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getMaterialsByType } from '@/lib/data/materials'
import { ResumosClient } from './resumos-client'

export const dynamic = 'force-dynamic'

export default async function ResumosAdminPage() {
  await requireAdminOrProfessor()
  const materials = await getMaterialsByType('resumo')

  const disciplines = await getDisciplines()

  return <ResumosClient initialData={materials}  disciplines={disciplines} />
}
