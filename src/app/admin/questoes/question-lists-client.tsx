'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Pencil, Trash2, List } from 'lucide-react'
import { deleteQuestionList } from '@/app/actions/admin/question-lists'
import type { QuestionList } from '@/lib/types/quiz'

export function QuestionListsClient({ initialData }: { initialData: QuestionList[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteQuestionList(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    router.refresh()
  }

  const formattedLists = initialData.map(list => ({
    ...list,
    subjectNode: <span className="capitalize">{list.subject}</span>,
    statusNode: (
      <Badge variant={list.is_active ? 'success' : 'gray'}>
        {list.is_active ? 'Ativa' : 'Inativa'}
      </Badge>
    ),
    qtdNode: <span>5</span>, // Mocked 5 questões por lista
    actionsNode: (
      <div className="flex items-center gap-2">
        <button className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar Lista">
          <Pencil className="w-4 h-4" />
        </button>
        <Link href={`/admin/questoes/${list.id}/respostas`} className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Ver Respostas">
          <List className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => setDeleteId(list.id)}
          className="p-2 text-surface-400 hover:text-danger-500 transition-colors rounded-lg hover:bg-surface-100" title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }))

  const deletingList = initialData.find(l => l.id === deleteId)

  return (
    <>
      <DataTable 
        data={formattedLists}
        searchKey="name"
        searchPlaceholder="Buscar lista..."
        columns={[
          { header: 'Nome da Lista', accessor: 'name' },
          { header: 'Disciplina', accessor: 'subjectNode' },
          { header: 'Qtde Questões', accessor: 'qtdNode' },
          { header: 'Status', accessor: 'statusNode' },
          { header: 'Ações', accessor: 'actionsNode' }
        ]}
      />

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Lista"
        description={`Tem certeza que deseja excluir a lista "${deletingList?.name}"? Esta ação removerá a lista e todas as questões dentro dela.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />
    </>
  )
}
