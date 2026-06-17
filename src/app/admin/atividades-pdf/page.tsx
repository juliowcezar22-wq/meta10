import { getDisciplines } from '@/lib/data/disciplines'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getMaterialsByType } from '@/lib/data/materials'
import { AtividadesPdfClient } from './atividades-pdf-client'

export const dynamic = 'force-dynamic'

export default async function AtividadesPdfPage() {
  await requireAdminOrProfessor()
  const materials = await getMaterialsByType('atividade_pdf')

  const disciplines = await getDisciplines()

  return <AtividadesPdfClient initialData={materials}  disciplines={disciplines} />
}
