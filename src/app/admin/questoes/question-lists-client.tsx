'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, List, X } from 'lucide-react'
import { createQuestionList, updateQuestionList, deleteQuestionList } from '@/app/actions/admin/question-lists'
import type { QuestionList } from '@/lib/types/quiz'

export function QuestionListsClient({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingList, setEditingList] = useState<QuestionList | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    subject: 'matematica',
    description: '',
    is_active: true,
  })

  const openModal = (list?: QuestionList) => {
    if (list) {
      setEditingList(list)
      setFormData({
        name: list.name,
        subject: list.subject,
        description: list.description || '',
        is_active: list.is_active,
      })
    } else {
      setEditingList(null)
      setFormData({
        name: '',
        subject: 'matematica',
        description: '',
        is_active: true,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingList(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const data = new FormData()
    data.append('name', formData.name)
    data.append('subject', formData.subject)
    data.append('description', formData.description)
    data.append('is_active', String(formData.is_active))

    let result
    if (editingList) {
      result = await updateQuestionList(editingList.id, data)
    } else {
      result = await createQuestionList(data)
    }

    setIsSaving(false)

    if (result.success) {
      closeModal()
      router.refresh()
    } else {
      alert((result.errors as any)?._form?.[0] || 'Erro ao salvar lista')
    }
  }

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
    qtdNode: <span>{list.question_count || 0}</span>,
    actionsNode: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => openModal(list)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar Lista"
        >
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Questões" 
        description="Gerencie as listas de questões para os alunos."
        action={
          <button onClick={() => openModal()} className="btn-primary">Nova Lista</button>
        }
      />

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
        description={`Tem certeza que deseja excluir a lista "${deletingList?.name}"? Esta ação removerá a lista e TODAS as questões dentro dela.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-surface-100">
              <h2 className="text-xl font-bold text-surface-900">
                {editingList ? 'Editar Lista' : 'Nova Lista'}
              </h2>
              <button type="button" onClick={closeModal} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Nome da Lista</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Disciplina</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="matematica">Matemática</option>
                  <option value="portugues">Português</option>
                  <option value="historia">História</option>
                  <option value="geografia">Geografia</option>
                  <option value="ciencias">Ciências</option>
                  <option value="ingles">Inglês</option>
                  <option value="fisica">Física</option>
                  <option value="quimica">Química</option>
                  <option value="biologia">Biologia</option>
                  <option value="outros">Outros</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Descrição</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-surface-700">Lista Ativa (visível para alunos)</label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-100">
                <button type="button" onClick={closeModal} className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="btn-primary">
                  {isSaving ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
