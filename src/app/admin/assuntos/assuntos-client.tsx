'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { SUBJECT_LABELS } from '@/lib/constants'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, Plus, X, Search, BookmarkPlus } from 'lucide-react'
import { createSubject, updateSubject, deleteSubject } from '@/app/actions/admin/subjects'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { useToast } from '@/components/admin/toast'

type Subject = {
  id: string
  discipline: string
  name: string
  created_at: string
  created_by: string | null
}

export function AssuntosClient({ subjects }: { subjects: Subject[] }) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    discipline: 'matematica',
    name: ''
  })

  // Agrupar por disciplina e filtrar
  const groupedSubjects = useMemo(() => {
    const filtered = subjects.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const groups = filtered.reduce((acc, subject) => {
      if (!acc[subject.discipline]) acc[subject.discipline] = []
      acc[subject.discipline].push(subject)
      return acc
    }, {} as Record<string, Subject[]>)

    return groups
  }, [subjects, searchTerm])

  const openModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject)
      setFormData({ discipline: subject.discipline, name: subject.name })
    } else {
      setEditingSubject(null)
      setFormData({ discipline: 'matematica', name: '' })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSubject(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const data = new FormData()
    data.append('discipline', formData.discipline)
    data.append('name', formData.name)

    let result
    if (editingSubject) {
      result = await updateSubject(editingSubject.id, data)
    } else {
      result = await createSubject(data)
    }

    setIsSaving(false)

    if (result.success) {
      toast(editingSubject ? 'Assunto atualizado com sucesso!' : 'Assunto criado com sucesso!', 'success')
      closeModal()
      router.refresh()
    } else {
      toast(result.error || 'Erro ao salvar', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const result = await deleteSubject(deleteId)
    setIsDeleting(false)

    if (result.success) {
      toast('Assunto excluído com sucesso!', 'success')
      setDeleteId(null)
      router.refresh()
    } else {
      toast(result.error || 'Erro ao excluir', 'error')
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Assuntos" 
        description="Cadastre os assuntos de cada disciplina"
        action={
          <button onClick={() => openModal()} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Novo Assunto
          </button>
        }
      />

      <div className="bg-white p-6 rounded-2xl border border-surface-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome do assunto..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-surface-900"
            />
          </div>
        </div>

        {subjects.length === 0 ? (
          <div className="text-center py-16 bg-surface-50 rounded-xl border border-surface-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-surface-400 shadow-sm">
              <BookmarkPlus className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 mb-1">Nenhum assunto</h3>
            <p className="text-surface-500">Nenhum assunto cadastrado ainda. Clique em Novo Assunto pra começar.</p>
          </div>
        ) : Object.keys(groupedSubjects).length === 0 ? (
          <div className="text-center py-12 text-surface-500">
            Nenhum resultado encontrado para a busca.
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(SUBJECT_LABELS).map(([key, label]) => {
              const discSubjects = groupedSubjects[key] || []
              if (discSubjects.length === 0 && !searchTerm) {
                 return (
                   <div key={key} className="border border-surface-200 rounded-xl overflow-hidden">
                     <div className="bg-surface-50 px-4 py-3 border-b border-surface-200">
                        <span className="font-bold text-surface-900 capitalize">{label}</span>
                     </div>
                     <div className="p-4 text-sm text-surface-500 text-center">
                       Nenhum assunto cadastrado
                     </div>
                   </div>
                 )
              }
              if (discSubjects.length === 0) return null

              return (
                <div key={key} className="border border-surface-200 rounded-xl overflow-hidden">
                  <div className="bg-surface-50 px-4 py-3 border-b border-surface-200">
                    <span className="font-bold text-surface-900 capitalize">{label}</span>
                  </div>
                  <div className="divide-y divide-surface-100">
                    {discSubjects.map(sub => (
                      <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-surface-50 transition-colors">
                        <span className="font-medium text-surface-900">{sub.name}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => openModal(sub)}
                            className="p-2 text-surface-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => setDeleteId(sub.id)}
                            className="p-2 text-surface-400 hover:text-danger hover:bg-danger-50 rounded-lg transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-surface-100">
              <h2 className="text-xl font-bold text-surface-900">
                {editingSubject ? 'Editar Assunto' : 'Novo Assunto'}
              </h2>
              <button onClick={closeModal} className="text-surface-400 hover:text-surface-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Disciplina</label>
                  <select 
                    value={formData.discipline}
                    onChange={e => setFormData({ ...formData, discipline: e.target.value })}
                    className="w-full px-4 py-2.5 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  >
                    {Object.entries(SUBJECT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Nome do Assunto</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-surface-900"
                    placeholder="Ex: Frações"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="btn-primary">
                  {isSaving ? 'Salvando...' : 'Salvar Assunto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!deleteId}
        title="Excluir Assunto"
        description="Tem certeza que deseja excluir este assunto? Essa ação não pode ser desfeita."
        confirmText="Excluir"
        onConfirm={handleDelete}
        onClose={() => setDeleteId(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
