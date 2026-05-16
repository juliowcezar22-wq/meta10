import { requireAdmin } from '@/lib/auth/guards'
import { getDashboardStats } from '@/lib/data/dashboard-stats'
import { Users, UserCheck, MessageSquare, BookOpen, ShoppingBag, Target } from 'lucide-react'

export default async function AdminPage() {
  const { profile } = await requireAdmin()
  const stats = await getDashboardStats()

  return (
    <main className="flex-1 p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Painel Admin</h1>
        <p className="text-surface-600">Olá, {profile.nome}. Aqui está o resumo do sistema.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Total de Usuários</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalUsers}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-success-500/10 flex items-center justify-center text-success-600 flex-shrink-0">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Alunos Ativos</p>
            <p className="text-2xl font-bold text-surface-900">{stats.activeStudents}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-warning-500/10 flex items-center justify-center text-warning-600 flex-shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Msgs. Não Lidas</p>
            <p className="text-2xl font-bold text-surface-900">{stats.unreadMessages}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Simulados</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalQuestionLists}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 flex-shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Produtos Ativos</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalProducts}</p>
          </div>
        </div>

        <div className="card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 flex-shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Tentativas Concluídas</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalAttempts}</p>
          </div>
        </div>
      </div>
    </main>
  )
}
