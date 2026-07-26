import { requireAdmin } from '@/lib/auth/guards'
import { getUsers } from '@/lib/data/users'
import { getActivePlans } from '@/lib/data/plans'
import { UsuariosClient } from './usuarios-client'

export default async function UsuariosPage() {
  const { profile } = await requireAdmin()
  const [users, plans] = await Promise.all([getUsers(), getActivePlans()])

  return <UsuariosClient initialData={users} initialPlans={plans} currentUserId={profile.id} />
}
