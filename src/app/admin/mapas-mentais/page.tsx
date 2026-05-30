import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { getMaterialsByType } from '@/lib/data/materials'
import { MapasMentaisClient } from './mapas-mentais-client'

export const dynamic = 'force-dynamic'

export default async function MapasMentaisAdminPage() {
  await requireAdminOrProfessor()
  const materials = await getMaterialsByType('mapa_mental')

  return <MapasMentaisClient initialData={materials} />
}
