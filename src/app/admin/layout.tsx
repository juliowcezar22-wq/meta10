import { requireAdmin } from '@/lib/auth/guards'
import { AdminShell } from '@/components/admin/admin-shell'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { profile } = await requireAdmin()

  return (
    <AdminShell nome={profile.nome} email={profile.email}>
      {children}
    </AdminShell>
  )
}
