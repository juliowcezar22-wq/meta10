import { requireAdmin } from '@/lib/auth/guards'

export default async function AdminPage() {
  const { profile } = await requireAdmin()

  return (
    <main className="flex-1 p-4 md:p-6 flex flex-col items-center justify-center text-center">
      <h1 className="text-3xl font-bold text-surface-900 mb-4">Painel Admin</h1>
      <p className="text-xl text-surface-600 mb-2">Olá, {profile.nome}</p>
      <p className="text-surface-400">Sistema em construção. Volte em breve.</p>
    </main>
  )
}
