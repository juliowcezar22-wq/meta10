import { requireAdmin } from '@/lib/auth/guards'
import { getMaterials } from '@/lib/data/materials'
import { ConteudoClient } from './conteudo-client'

export default async function ConteudoPage() {
  await requireAdmin()
  const materials = await getMaterials()

  return <ConteudoClient initialData={materials} />
}
