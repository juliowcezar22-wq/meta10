import { requireAdmin, requireAuth } from '@/lib/auth/guards'
import { getDashboardStats } from '@/lib/data/dashboard-stats'
import { Users, UserCheck, BookOpen, ShoppingBag, Target, GraduationCap, UserX, ListChecks, HelpCircle, MessageSquareQuote, MessageSquarePlus, FileText, Gamepad2, Network, Library } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function AdminPage() {
  const session = await requireAuth()
  if (session.profile.role === 'professor') redirect('/admin/questoes')

  const { profile } = await requireAdmin()
  const stats = await getDashboardStats()

  return (
    <main className="flex-1 p-4 md:p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-surface-900 mb-2">Painel Admin</h1>
        <p className="text-surface-600">Olá, {profile.nome}. Aqui está o resumo do sistema.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        <Link href="/admin/usuarios" className="card p-6 flex items-center gap-4 hover:border-primary/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Usuários</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalUsers}</p>
          </div>
        </Link>

        <Link href="/admin/professores" className="card p-6 flex items-center gap-4 hover:border-primary/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Professores</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalProfessores}</p>
          </div>
        </Link>

        <Link href="/admin/alunos-ativos" className="card p-6 flex items-center gap-4 hover:border-success-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-success-500/10 flex items-center justify-center text-success-600 flex-shrink-0 group-hover:bg-success-500 group-hover:text-white transition-colors">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Alunos Ativos</p>
            <p className="text-2xl font-bold text-surface-900">{stats.activeStudents}</p>
          </div>
        </Link>

        <Link href="/admin/alunos-inativos" className="card p-6 flex items-center gap-4 hover:border-surface-400/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-surface-200 flex items-center justify-center text-surface-600 flex-shrink-0 group-hover:bg-surface-400 group-hover:text-white transition-colors">
            <UserX className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Alunos Inativos</p>
            <p className="text-2xl font-bold text-surface-900">{stats.inactiveStudents}</p>
          </div>
        </Link>

        <Link href="/admin/mapas-mentais" className="card p-6 flex items-center gap-4 hover:border-orange-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-600 flex-shrink-0 group-hover:bg-orange-500 group-hover:text-white transition-colors">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Mapas Mentais</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalMapasMentais}</p>
          </div>
        </Link>

        <Link href="/admin/atividades-pdf" className="card p-6 flex items-center gap-4 hover:border-red-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-600 flex-shrink-0 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Atividades PDF</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalAtividadesPdf}</p>
          </div>
        </Link>

        <Link href="/admin/jogos-pedagogicos" className="card p-6 flex items-center gap-4 hover:border-green-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center text-green-600 flex-shrink-0 group-hover:bg-green-500 group-hover:text-white transition-colors">
            <Gamepad2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Jogos Pedagógicos</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalJogosPedagogicos}</p>
          </div>
        </Link>

        <Link href="/admin/questoes-avulsas" className="card p-6 flex items-center gap-4 hover:border-purple-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-600 flex-shrink-0 group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <ListChecks className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Questões</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalQuestoesAvulsas}</p>
          </div>
        </Link>

        <Link href="/admin/questoes" className="card p-6 flex items-center gap-4 hover:border-blue-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 flex-shrink-0 group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Simulados</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalSimulados}</p>
          </div>
        </Link>

        <Link href="/admin/resumos" className="card p-6 flex items-center gap-4 hover:border-yellow-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 flex-shrink-0 group-hover:bg-yellow-500 group-hover:text-white transition-colors">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Resumos</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalResumos}</p>
          </div>
        </Link>

        <Link href="/admin/produtos" className="card p-6 flex items-center gap-4 hover:border-teal-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-teal-500/10 flex items-center justify-center text-teal-600 flex-shrink-0 group-hover:bg-teal-500 group-hover:text-white transition-colors">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Loja</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalProducts}</p>
          </div>
        </Link>

        <Link href="/admin/depoimentos" className="card p-6 flex items-center gap-4 hover:border-pink-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-600 flex-shrink-0 group-hover:bg-pink-500 group-hover:text-white transition-colors">
            <MessageSquareQuote className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Depoimentos</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalDepoimentos}</p>
          </div>
        </Link>

        <Link href="/admin/sugestoes" className="card p-6 flex items-center gap-4 hover:border-amber-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600 flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Sugestões</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalSugestoes}</p>
          </div>
        </Link>

        <Link href="/admin/disciplinas" className="card p-6 flex items-center gap-4 hover:border-indigo-500/50 transition-colors group">
          <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
            <Library className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-surface-500 font-medium">Disciplinas</p>
            <p className="text-2xl font-bold text-surface-900">{stats.totalDisciplinas}</p>
          </div>
        </Link>

      </div>
    </main>
  )
}
