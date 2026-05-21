import { requireAuth } from '@/lib/auth/guards'
import { getQuestionLists } from '@/lib/data/question-lists'
import Link from 'next/link'
import { BookOpen, ArrowRight, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function SimuladosMateriaPage({ params }: { params: { subject: string } }) {
  await requireAuth()
  const lists = await getQuestionLists()
  const activeLists = lists.filter(l => l.is_active && l.subject === params.subject)

  const subjectName = params.subject.charAt(0).toUpperCase() + params.subject.slice(1)

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/aluno/questoes" className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-surface-900">Simulados de {subjectName}</h1>
          <p className="text-surface-500 mt-2">Simulados disponíveis para você responder.</p>
        </div>
      </div>

      {activeLists.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-surface-200">
          <p className="text-surface-500">Nenhum simulado encontrado para esta matéria.</p>
        </div>
      ) : (
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
      )}
    </div>
  )
}
