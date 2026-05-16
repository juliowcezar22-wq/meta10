import { requireAuth } from '@/lib/auth/guards'
import { getQuestionLists } from '@/lib/data/question-lists'
import Link from 'next/link'
import { BookOpen, ArrowRight } from 'lucide-react'

export default async function AlunoQuestoesPage() {
  await requireAuth()
  const lists = await getQuestionLists()
  const activeLists = lists.filter(l => l.is_active)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-surface-900">Simulados</h1>
        <p className="text-surface-500 mt-2">Simulados disponíveis para você responder.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeLists.map(list => (
          <Link key={list.id} href={`/aluno/questoes/${list.id}`} className="card p-6 hover:border-primary/50 transition-colors group">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h2 className="text-lg font-bold text-surface-900 mb-2">{list.name}</h2>
            {list.description && <p className="text-surface-500 text-sm mb-4 line-clamp-2">{list.description}</p>}
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-surface-100">
              <span className="text-sm font-medium text-surface-500 capitalize">{list.subject}</span>
              <span className="text-sm font-medium text-primary flex items-center gap-1">
                Iniciar <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
