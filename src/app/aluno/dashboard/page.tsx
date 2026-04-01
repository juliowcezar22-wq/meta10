import Link from 'next/link'
import { ListChecks, ClipboardCheck, FileText, Network, BookOpen, TrendingUp, Clock, Award, BarChart3, Lock, Crown } from 'lucide-react'
import { MOCK_STATS } from '@/lib/constants'

const quickAccess = [
  { title: 'Questões', href: '/aluno/questoes', icon: ListChecks, color: 'bg-primary-50 text-primary' },
  { title: 'Simulados', href: '/aluno/simulados', icon: ClipboardCheck, color: 'bg-cyan-50 text-cyan' },
  { title: 'PDFs', href: '/aluno/pdfs', icon: FileText, color: 'bg-purple-50 text-purple' },
  { title: 'Mapas Mentais', href: '/aluno/mapas-mentais', icon: Network, color: 'bg-green-50 text-green' },
  { title: 'Resumos', href: '/aluno/resumos', icon: BookOpen, color: 'bg-red-50 text-red' },
]

export default function DashboardPage() {
  const studentName = 'Estudante'
  const planType = 'Gratuito'
  const planColor = 'bg-gray-500'

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Olá, {studentName}! 👋</h1>
            <p className="text-gray-600 mt-1">Continue seus estudos de onde parou.</p>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${planColor}`}>
              Plano {planType}
            </span>
            <Link href="/planos" className="btn-primary text-sm">
              <Crown className="w-4 h-4" />
              Assinar Plano
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Questões Resolvidas', value: MOCK_STATS.questionsSolved, icon: ListChecks, color: 'text-primary' },
            { label: 'Simulados Realizados', value: MOCK_STATS.quizzesCompleted, icon: ClipboardCheck, color: 'text-cyan' },
            { label: 'Horas de Estudo', value: MOCK_STATS.studyHours, icon: Clock, color: 'text-purple' },
            { label: 'Desempenho Médio', value: `${MOCK_STATS.avgScore}%`, icon: BarChart3, color: 'text-green' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                <TrendingUp className="w-4 h-4 text-green" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Access */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {quickAccess.map((item) => (
            <Link key={item.href} href={item.href} className="card card-hover p-6 text-center cursor-pointer">
              <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-gray-900">{item.title}</span>
            </Link>
          ))}
        </div>

        {/* Locked Content */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Conteúdo Premium</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Simulados Semanais', desc: 'Novos simulados toda semana' },
            { title: 'Mapas Mentais Exclusivos', desc: 'Conteúdo visual completo' },
            { title: 'Acompanhamento de Desempenho', desc: 'Gráficos detalhados de progresso' },
          ].map((item) => (
            <div key={item.title} className="card p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 font-medium">Disponível no plano pago</p>
                </div>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mb-3">
                <Award className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
