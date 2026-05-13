import { requireAdmin } from '@/lib/auth/guards'
import { getUsers } from '@/lib/data/users'
import { getPlans } from '@/lib/data/plans'
import { UsuariosClient } from './usuarios-client'

export default async function UsuariosPage() {
  const { profile } = await requireAdmin()
  const users = await getUsers()
  const plans = await getPlans()

  return <UsuariosClient initialData={users} initialPlans={plans} currentUserId={profile.id} />
}
