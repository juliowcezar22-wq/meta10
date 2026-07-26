import Link from 'next/link'
import { ListChecks, FileText, Network, BookOpen, TrendingUp, Award, BarChart3, Lock, Crown, ArrowRight, CheckCircle2, XCircle, Gamepad2 } from 'lucide-react'
import { getCurrentSubscription } from '@/lib/data/subscriptions'
import { getStudentStats } from '@/lib/data/standalone-answers'
import { requireAuth } from '@/lib/auth/guards'

const quickAccess = [
  { title: 'Banco de Questões', href: '/aluno/questoes-avulsas', icon: ListChecks, gradient: 'from-primary-500 to-primary-600', bg: 'bg-primary-50' },
  { title: 'Jogos Pedagógicos', href: '/aluno/jogos-pedagogicos', icon: Gamepad2, gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
  { title: 'Atividades em PDF', href: '/aluno/atividades-pdf', icon: FileText, gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50' },
  { title: 'Mapas Mentais', href: '/aluno/mapas-mentais', icon: Network, gradient: 'from-success-500 to-success-600', bg: 'bg-success-50' },
  { title: 'Resumos', href: '/aluno/resumos', icon: BookOpen, gradient: 'from-danger-500 to-danger-600', bg: 'bg-danger-50' },
]

export default async function DashboardPage() {
  const { profile } = await requireAuth()
  
  const [subscription, studentStats] = await Promise.all([
    getCurrentSubscription(),
    getStudentStats(profile.id)
  ])

  // hasSub = assinatura paga ativa; sem ela o plano real é o Gratuito
  const hasSub = subscription !== null
  const planName = subscription?.plan?.name ?? 'Gratuito'

  const stats = [
    { label: 'Exercícios Feitos', value: studentStats.exerciciosFeitos, icon: ListChecks, color: 'text-primary', bg: 'bg-primary-50' },
    { label: 'Acertos', value: studentStats.acertos, icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Erros', value: studentStats.erros, icon: XCircle, color: 'text-danger-600', bg: 'bg-danger-50' },
    { label: 'Desempenho Médio', value: `${studentStats.desempenhoMedio}%`, icon: BarChart3, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  ]

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-surface-900">
              Olá, Estudante! 👋
            </h1>
            <p className="text-surface-500 mt-1">Continue seus estudos de onde parou.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${hasSub ? 'bg-primary-100 text-primary-700' : 'bg-surface-200 text-surface-600'}`}>
              {planName}
            </span>
            {!hasSub && (
              <Link href="/planos" className="btn-primary text-sm !py-2 !px-4">
                <Crown className="w-4 h-4" />
                Assinar
              </Link>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="card p-5 group hover:shadow-card-hover transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <TrendingUp className="w-4 h-4 text-surface-300" />
              </div>
              <p className="text-2xl font-extrabold text-surface-900 tracking-tight">{stat.value}</p>
              <p className="text-xs text-surface-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <h2 className="text-lg font-bold text-surface-900 mb-5">Acesso Rápido</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {quickAccess.map((item) => (
            <Link key={item.href} href={item.href} className="card card-hover p-5 text-center group">
              <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 group-hover:shadow-lg transition-all duration-300`}>
                <item.icon className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-surface-900 text-sm">{item.title}</span>
              <ArrowRight className="w-4 h-4 text-surface-300 mx-auto mt-1.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
            </Link>
          ))}
        </div>

        {/* Locked Content - Only show if NO subscription */}
        {!hasSub && (
          <>
            <h2 className="text-lg font-bold text-surface-900 mb-5">Conteúdo Premium</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { title: 'Banco de Questões Completo', desc: 'Questões novas toda semana' },
                { title: 'Mapas Mentais Exclusivos', desc: 'Conteúdo visual completo' },
                { title: 'Acompanhamento', desc: 'Gráficos detalhados de progresso' },
              ].map((item) => (
                <div key={item.title} className="card p-6 relative overflow-hidden group">
                  <div className="absolute inset-0 bg-surface-50/90 backdrop-blur-[2px] flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="w-10 h-10 bg-surface-200 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-5 h-5 text-surface-400" />
                      </div>
                      <p className="text-xs text-surface-500 font-medium mb-3">Disponível no plano pago</p>
                      <Link href="/planos" className="btn-primary text-xs !py-2 !px-4">Assinar Plano</Link>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-surface-100 rounded-xl flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 text-surface-300" />
                  </div>
                  <h3 className="font-bold text-surface-900 text-sm mb-1">{item.title}</h3>
                  <p className="text-xs text-surface-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
