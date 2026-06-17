import { getDisciplines } from '@/lib/data/disciplines'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getMaterialsByType } from '@/lib/data/materials'
import { JogosPedagogicosClient } from './jogos-pedagogicos-client'

export const dynamic = 'force-dynamic'

export default async function JogosPedagogicosPage() {
  await requireAdminOrProfessor()
  const materials = await getMaterialsByType('jogo')

  const disciplines = await getDisciplines()

  return <JogosPedagogicosClient initialData={materials}  disciplines={disciplines} />
}
