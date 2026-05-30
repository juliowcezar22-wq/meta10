import { requireAuth } from '@/lib/auth/guards'
import Link from 'next/link'
import { BookOpen, Calculator, Globe, Atom, Binary, Languages, Milestone, Dna, FlaskConical, Library } from 'lucide-react'

export const dynamic = 'force-dynamic'

const subjects = [
  { id: 'matematica', name: 'Matemática', icon: Calculator, color: 'bg-blue-500' },
  { id: 'portugues', name: 'Português', icon: BookOpen, color: 'bg-red-500' },
  { id: 'historia', name: 'História', icon: Library, color: 'bg-amber-600' },
  { id: 'geografia', name: 'Geografia', icon: Globe, color: 'bg-emerald-600' },
  { id: 'ciencias', name: 'Ciências', icon: Atom, color: 'bg-teal-500' },
  { id: 'ingles', name: 'Inglês', icon: Languages, color: 'bg-indigo-500' },
  { id: 'fisica', name: 'Física', icon: Milestone, color: 'bg-cyan-600' },
  { id: 'quimica', name: 'Química', icon: FlaskConical, color: 'bg-violet-500' },
  { id: 'biologia', name: 'Biologia', icon: Dna, color: 'bg-green-600' },
  { id: 'outros', name: 'Outros', icon: Binary, color: 'bg-slate-500' },
]

export default async function JogosPedagogicosAlunoPage() {
  await requireAuth()

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-surface-900">Jogos Pedagógicos</h1>
        <p className="text-surface-500 mt-2">Escolha uma matéria para acessar dinâmicas e jogos de aprendizagem.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {subjects.map((sub) => {
          const Icon = sub.icon
          return (
            <Link 
              key={sub.id} 
              href={`/aluno/jogos-pedagogicos/${sub.id}`}
              className="group block bg-white rounded-2xl p-6 border border-surface-200 shadow-sm hover:shadow-md transition-all hover:border-primary-200"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${sub.color} bg-opacity-90 group-hover:bg-opacity-100 transition-all`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-surface-900 group-hover:text-primary transition-colors">{sub.name}</h3>
                  <p className="text-sm text-surface-500 mt-0.5">Ver jogos</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
