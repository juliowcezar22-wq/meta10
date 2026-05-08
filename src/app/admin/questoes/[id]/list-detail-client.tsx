'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Pencil, Trash2, ArrowLeft } from 'lucide-react'
import { deleteQuestion } from '@/app/actions/admin/questions'
import type { QuestionList, Question } from '@/lib/types/quiz'

export function ListDetailClient({ list, initialQuestions }: { list: QuestionList, initialQuestions: Question[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteQuestion(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    router.refresh()
  }

  const formattedQuestions = initialQuestions.map(q => ({
    ...q,
    enunciadoNode: <span className="truncate max-w-[300px] block" title={q.enunciado}>{q.enunciado}</span>,
    difficultyNode: (
      <Badge variant={q.difficulty === 'facil' ? 'success' : q.difficulty === 'medio' ? 'warning' : 'danger'}>
        {q.difficulty}
      </Badge>
    ),
    gabaritoNode: <span className="uppercase font-bold">{q.gabarito}</span>,
    actionsNode: (
      <div className="flex items-center gap-2">
        <button className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar Questão">
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setDeleteId(q.id)}
          className="p-2 text-surface-400 hover:text-danger-500 transition-colors rounded-lg hover:bg-surface-100" title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }))

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/questoes" className="p-2 hover:bg-surface-100 rounded-lg transition-colors text-surface-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-surface-900">{list.name}</h1>
          {list.description && <p className="text-surface-500 text-sm mt-1">{list.description}</p>}
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary">Editar Lista</button>
          <Link href={`/admin/questoes/${list.id}/respostas`} className="btn-secondary">Ver Respostas</Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-surface-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-surface-900">Questões desta Lista</h2>
          <button className="btn-primary">Nova Questão</button>
        </div>

        {initialQuestions.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-100">
            <p className="text-surface-500">Nenhuma questão nesta lista ainda. Clique em &apos;Nova Questão&apos; para começar.</p>
          </div>
        ) : (
          <DataTable 
            data={formattedQuestions}
            searchKey="enunciado"
            searchPlaceholder="Buscar no enunciado..."
            columns={[
              { header: 'Enunciado', accessor: 'enunciadoNode' },
              { header: 'Dificuldade', accessor: 'difficultyNode' },
              { header: 'Gabarito', accessor: 'gabaritoNode' },
              { header: 'Ações', accessor: 'actionsNode' }
            ]}
          />
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Questão"
        description="Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </>
  )
}
