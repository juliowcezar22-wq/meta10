import { requireAdmin } from '@/lib/auth/guards'

export default async function AdminPage() {
  const { profile } = await requireAdmin()

  return (
    <main className="min-h-screen bg-[#0B0F19] text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-4">Painel Admin</h1>
      <p className="text-xl mb-2">Olá, {profile.nome}</p>
      <p className="text-surface-400">Sistema em construção. Volte em breve.</p>
    </main>
  )
}
