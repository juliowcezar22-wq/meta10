import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getMaterialsByType } from '@/lib/data/materials'
import { ResumosClient } from './resumos-client'

export const dynamic = 'force-dynamic'

export default async function ResumosAdminPage() {
  await requireAdminOrProfessor()
  const materials = await getMaterialsByType('resumo')

  return <ResumosClient initialData={materials} />
}
