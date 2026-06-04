import { requireAuth } from '@/lib/auth/guards'
import Link from 'next/link'
import { getDisciplinesGrid } from '@/lib/data/disciplines'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

export const dynamic = 'force-dynamic'

export default async function AtividadesPdfAlunoPage() {
  await requireAuth()
  const subjects = await getDisciplinesGrid()

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900">Atividades em PDF</h1>
        <p className="text-surface-500 mt-2">Escolha uma matéria para ver as atividades em PDF disponíveis.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {subjects.map((sub) => {
          return (
            <Link 
              key={sub.id} 
              href={`/aluno/atividades-pdf/${sub.id}`}
              className="group block bg-white rounded-2xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition-all hover:border-primary-200"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${sub.color} bg-opacity-90 group-hover:bg-opacity-100 transition-all`}>
                  <DynamicIcon name={sub.iconName} className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary transition-colors">{sub.title}</h3>
                  <p className="text-sm text-surface-500 mt-0.5">Ver atividades</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
