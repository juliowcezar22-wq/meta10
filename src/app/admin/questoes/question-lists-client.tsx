'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, List, X, Plus } from 'lucide-react'
import { createQuestionList, updateQuestionList, deleteQuestionList } from '@/app/actions/admin/question-lists'
import { createQuestion } from '@/app/actions/admin/questions'
import type { QuestionList } from '@/lib/types/quiz'

const initialQuestionState = {
  enunciado: '',
  alternativa_a: '',
  alternativa_b: '',
  alternativa_c: '',
  alternativa_d: '',
  alternativa_e: '',
  gabarito: 'a',
  comentario: '',
  difficulty: 'medio',
}

export function QuestionListsClient({ initialData }: { initialData: any[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Modal & Wizard state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingList, setEditingList] = useState<QuestionList | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [step, setStep] = useState<1 | 2>(1)
  const [listId, setListId] = useState<string | null>(null)
  
  // List Form State (Step 1)
  const [listMeta, setListMeta] = useState({
    name: '',
    subject: 'matematica',
    description: '',
  })

  // Questions State (Step 2)
  const [questionsAdded, setQuestionsAdded] = useState<{id: string, enunciado: string}[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(initialQuestionState)

  const openModal = (list?: QuestionList) => {
    setStep(1)
    setListId(null)
    setQuestionsAdded([])
    setCurrentQuestion(initialQuestionState)
    
    if (list) {
      setEditingList(list)
      setListMeta({
        name: list.name,
        subject: list.subject,
        description: list.description || '',
      })
    } else {
      setEditingList(null)
      setListMeta({
        name: '',
        subject: 'matematica',
        description: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleClose = () => {
    if (step === 2 && questionsAdded.length > 0) {
      alert('Lista salva como rascunho. Você pode finalizar depois em /admin/questoes/' + listId)
    }
    setIsModalOpen(false)
    setEditingList(null)
    router.refresh()
  }

  // Handle Edit Save (Only Step 1 is available for Edit Mode)
  const handleEditSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingList) return
    setIsSaving(true)
    const data = new FormData()
    data.append('name', listMeta.name)
    data.append('subject', listMeta.subject)
    data.append('description', listMeta.description)
    data.append('is_active', String(editingList.is_active))

    const result = await updateQuestionList(editingList.id, data)
    setIsSaving(false)
    if (result.success) {
      setIsModalOpen(false)
      setEditingList(null)
      router.refresh()
    } else {
      alert((result.errors as any)?._form?.[0] || 'Erro ao editar lista')
    }
  }

  // Handle Avançar (Create Mode: Step 1 -> 2)
  const handleAvancar = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const data = new FormData()
    data.append('name', listMeta.name)
    data.append('subject', listMeta.subject)
    data.append('description', listMeta.description)
    data.append('is_active', 'false') // Inativa até publicar

    const result = await createQuestionList(data)
    setIsSaving(false)
    
    if (result.success && result.list) {
      setListId(result.list.id)
      setStep(2)
    } else {
      alert((result.errors as any)?._form?.[0] || 'Erro ao criar lista')
    }
  }

  // Helper to validate and save current question
  const saveCurrentQuestion = async () => {
    if (!listId) return false
    if (!currentQuestion.enunciado.trim() || !currentQuestion.alternativa_a.trim() || !currentQuestion.alternativa_b.trim() || !currentQuestion.alternativa_c.trim() || !currentQuestion.alternativa_d.trim() || !currentQuestion.alternativa_e.trim()) {
      return false
    }
    
    const data = new FormData()
    data.append('list_id', listId)
    data.append('subject', listMeta.subject)
    Object.entries(currentQuestion).forEach(([key, val]) => {
      data.append(key, val)
    })

    const result = await createQuestion(listId, data)
    if (result.success) {
      setQuestionsAdded([...questionsAdded, { id: Math.random().toString(), enunciado: currentQuestion.enunciado }])
      return true
    } else {
      alert((result.errors as any)?._form?.[0] || 'Erro ao criar questão')
      return false
    }
  }

  const handleAdicionarOutra = async () => {
    setIsSaving(true)
    const saved = await saveCurrentQuestion()
    setIsSaving(false)
    if (saved) {
      setCurrentQuestion(initialQuestionState)
    } else {
      alert("Preencha todos os campos obrigatórios da questão atual.")
    }
  }

  const handlePublicar = async () => {
    if (!listId) return
    setIsSaving(true)
    
    // Save current question if it has at least some content
    if (currentQuestion.enunciado.trim()) {
      const saved = await saveCurrentQuestion()
      if (!saved) {
        setIsSaving(false)
        alert("Preencha corretamente a questão atual ou limpe o enunciado para ignorar.")
        return
      }
    }

    // Mark list as active
    const data = new FormData()
    data.append('name', listMeta.name)
    data.append('subject', listMeta.subject)
    data.append('description', listMeta.description)
    data.append('is_active', 'true')
    
    const result = await updateQuestionList(listId, data)
    setIsSaving(false)
    
    if (result.success) {
      setIsModalOpen(false)
      setListId(null)
      router.refresh()
    } else {
      alert((result.errors as any)?._form?.[0] || 'Erro ao publicar lista')
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
        <Link href={`/admin/questoes/${list.id}?addQuestion=1`} className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Adicionar questão">
          <Plus className="w-4 h-4" />
        </Link>
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

      {/* Modal Wizard */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <div className={`bg-white rounded-2xl w-full ${step === 2 ? 'max-w-2xl' : 'max-w-md'} relative z-10 shadow-xl overflow-hidden max-h-[90vh] flex flex-col`}>
            
            <div className="flex items-center justify-between p-6 border-b border-surface-100 shrink-0">
              <h2 className="text-xl font-bold text-surface-900">
                {editingList ? 'Editar Lista' : (step === 1 ? 'Nova Lista - Passo 1/2' : 'Nova Lista - Passo 2/2')}
              </h2>
              <button type="button" onClick={handleClose} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {step === 1 ? (
              <form onSubmit={editingList ? handleEditSave : handleAvancar} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Nome da Lista</label>
                  <input 
                    type="text" 
                    value={listMeta.name}
                    onChange={(e) => setListMeta({ ...listMeta, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Disciplina</label>
                  <select 
                    value={listMeta.subject}
                    onChange={(e) => setListMeta({ ...listMeta, subject: e.target.value })}
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
                    value={listMeta.description}
                    onChange={(e) => setListMeta({ ...listMeta, description: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    rows={3}
                  />
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-surface-100">
                  <button type="button" onClick={handleClose} className="px-4 py-2 text-sm font-medium text-surface-600 hover:text-surface-900 hover:bg-surface-100 rounded-lg transition-colors">
                    Cancelar
                  </button>
                  <button type="submit" disabled={isSaving} className="btn-primary">
                    {isSaving ? 'Aguarde...' : (editingList ? 'Salvar Alterações' : 'Próximo: Adicionar Questões')}
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-col flex-1 overflow-hidden">
                <div className="p-6 pb-2 border-b border-surface-100 shrink-0 bg-surface-50/50">
                  <div className="mb-4">
                    <p className="text-sm font-medium text-surface-500 uppercase tracking-wider">CONTEXTO DA LISTA</p>
                    <p className="font-semibold text-surface-900">{listMeta.name} <span className="text-surface-400 font-normal">| {listMeta.subject}</span></p>
                  </div>
                  
                  {questionsAdded.length > 0 && (
                    <div className="mb-2">
                      <p className="text-sm font-medium text-surface-700 mb-2">Questões adicionadas ({questionsAdded.length}):</p>
                      <div className="flex flex-wrap gap-2">
                        {questionsAdded.map((q, idx) => (
                          <div key={q.id} className="bg-surface-100 text-surface-700 text-xs px-3 py-1.5 rounded-full border border-surface-200 truncate max-w-[200px]" title={q.enunciado}>
                            {idx + 1}. {q.enunciado}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 overflow-y-auto space-y-4">
                  <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                    <Plus className="w-4 h-4 text-primary" />
                    Questão {questionsAdded.length + 1}
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Enunciado *</label>
                    <textarea 
                      value={currentQuestion.enunciado}
                      onChange={(e) => setCurrentQuestion({ ...currentQuestion, enunciado: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa A *</label>
                      <input type="text" required value={currentQuestion.alternativa_a} onChange={(e) => setCurrentQuestion({ ...currentQuestion, alternativa_a: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa B *</label>
                      <input type="text" required value={currentQuestion.alternativa_b} onChange={(e) => setCurrentQuestion({ ...currentQuestion, alternativa_b: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa C *</label>
                      <input type="text" required value={currentQuestion.alternativa_c} onChange={(e) => setCurrentQuestion({ ...currentQuestion, alternativa_c: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa D *</label>
                      <input type="text" required value={currentQuestion.alternativa_d} onChange={(e) => setCurrentQuestion({ ...currentQuestion, alternativa_d: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa E *</label>
                      <input type="text" required value={currentQuestion.alternativa_e} onChange={(e) => setCurrentQuestion({ ...currentQuestion, alternativa_e: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Gabarito Correto *</label>
                      <select value={currentQuestion.gabarito} onChange={(e) => setCurrentQuestion({ ...currentQuestion, gabarito: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required>
                        <option value="a">A</option>
                        <option value="b">B</option>
                        <option value="c">C</option>
                        <option value="d">D</option>
                        <option value="e">E</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Dificuldade *</label>
                      <select value={currentQuestion.difficulty} onChange={(e) => setCurrentQuestion({ ...currentQuestion, difficulty: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required>
                        <option value="facil">Fácil</option>
                        <option value="medio">Médio</option>
                        <option value="dificil">Difícil</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-surface-700 mb-1">Comentário (opcional)</label>
                      <textarea value={currentQuestion.comentario} onChange={(e) => setCurrentQuestion({ ...currentQuestion, comentario: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" rows={2} />
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-4 border-t border-surface-100 flex flex-wrap items-center justify-between gap-4 shrink-0 bg-white">
                  <button type="button" onClick={handleClose} className="text-surface-500 hover:text-surface-900 font-medium text-sm transition-colors">
                    Salvar Rascunho & Sair
                  </button>
                  <div className="flex gap-3">
                    <button type="button" onClick={handleAdicionarOutra} disabled={isSaving} className="btn-secondary">
                      Adicionar Outra Questão
                    </button>
                    <button type="button" onClick={handlePublicar} disabled={isSaving} className="btn-primary">
                      {isSaving ? 'Aguarde...' : 'Publicar Lista'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
