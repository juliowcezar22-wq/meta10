'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, List, X, Plus, Copy } from 'lucide-react'
import { createQuestionList, updateQuestionList, deleteQuestionList, duplicateQuestionList, toggleQuestionListActive } from '@/app/actions/admin/question-lists'
import { createQuestion } from '@/app/actions/admin/questions'
import { useToast } from '@/components/admin/toast'
import type { QuestionList } from '@/lib/types/quiz'
import { QuestionFormFields, type QuestionFormData } from '@/components/admin/question-form-fields'
import { SUBJECT_LABELS } from '@/lib/constants'

const initialQuestionState: QuestionFormData = {
  question_type: 'multipla_escolha',
  enunciado: '',
  alternatives: [
    { letra: 'a', texto: '' },
    { letra: 'b', texto: '' }
  ],
  gabarito: 'a',
  comentario: '',
  difficulty: 'facil',
}

export function QuestionListsClient({ initialData, subjects }: { initialData: any[], subjects: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  const [duplicateId, setDuplicateId] = useState<string | null>(null)
  const [isDuplicating, setIsDuplicating] = useState(false)
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  
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
    subject_id: '',
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
        subject_id: (list as any).subject_id || '',
        description: list.description || '',
      })
    } else {
      setEditingList(null)
      setListMeta({
        name: '',
        subject: 'matematica',
        subject_id: '',
        description: '',
      })
    }
    setIsModalOpen(true)
  }

  const handleClose = () => {
    if (step === 2 && questionsAdded.length > 0) {
      toast('Simulado salvo como rascunho. Você pode finalizar depois na tela de edição.', 'info')
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
    if (listMeta.subject_id) data.append('subject_id', listMeta.subject_id)
    data.append('description', listMeta.description)
    data.append('is_active', String(editingList.is_active))

    const result = await updateQuestionList(editingList.id, data)
    setIsSaving(false)
    if (result.success) {
      toast('Simulado atualizado com sucesso!', 'success')
      setIsModalOpen(false)
      setEditingList(null)
      router.refresh()
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao editar simulado', 'error')
    }
  }

  // Handle Avançar (Create Mode: Step 1 -> 2)
  const handleAvancar = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    const data = new FormData()
    data.append('name', listMeta.name)
    data.append('subject', listMeta.subject)
    if (listMeta.subject_id) data.append('subject_id', listMeta.subject_id)
    data.append('description', listMeta.description)
    data.append('is_active', 'false') // Inativa até publicar

    const result = await createQuestionList(data)
    setIsSaving(false)
    
    if (result.success && result.list) {
      toast('Rascunho criado, adicione questões.', 'success')
      setListId(result.list.id)
      setStep(2)
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao criar simulado', 'error')
    }
  }

  // Helper to validate and save current question
  const saveCurrentQuestion = async () => {
    if (!listId) return false
    
    // Client-side validation
    if (!currentQuestion.enunciado.trim()) return false
    if (currentQuestion.question_type === 'multipla_escolha') {
      if (currentQuestion.alternatives.some(a => !a.texto.trim())) return false
    }
    if (!currentQuestion.gabarito) return false

    const data = new FormData()
    data.append('list_id', listId)
    data.append('subject', listMeta.subject)
    data.append('question_type', currentQuestion.question_type)
    data.append('enunciado', currentQuestion.enunciado)
    data.append('gabarito', currentQuestion.gabarito)
    data.append('difficulty', currentQuestion.difficulty)
    if (currentQuestion.comentario) data.append('comentario', currentQuestion.comentario)
    
    if (currentQuestion.question_type === 'multipla_escolha') {
      data.append('alternatives', JSON.stringify(currentQuestion.alternatives))
    }

    const result = await createQuestion(listId, data)
    if (result.success) {
      toast(`Questão adicionada (${questionsAdded.length + 1} no total)`, 'success')
      setQuestionsAdded([...questionsAdded, { id: Math.random().toString(), enunciado: currentQuestion.enunciado }])
      return true
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao criar questão', 'error')
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
      toast("Preencha todos os campos obrigatórios da questão atual.", 'error')
    }
  }

  const handleDuplicarParaProxima = async () => {
    setIsSaving(true)
    const saved = await saveCurrentQuestion()
    setIsSaving(false)
    if (saved) {
      toast("Questão salva, próxima já pré-preenchida", 'success')
      // Mantém os dados no formData para a próxima questão
    } else {
      toast("Preencha todos os campos obrigatórios da questão atual.", 'error')
    }
  }

  const handleFinalizar = async () => {
    if (!listId) return

    // Se formulário está preenchido
    if (currentQuestion.enunciado.trim()) {
      setIsSaving(true)
      const saved = await saveCurrentQuestion()
      setIsSaving(false)
      if (!saved) {
        toast("Preencha corretamente a questão atual ou limpe o enunciado para ignorar.", 'error')
        return
      }
    } else if (questionsAdded.length === 0) {
      toast("Adicione pelo menos uma questão antes de finalizar", 'error')
      return
    }

    toast(`Simulado criado com ${questionsAdded.length + (currentQuestion.enunciado.trim() ? 1 : 0)} questões`, 'success')
    setIsModalOpen(false)
    setListId(null)
    router.refresh()
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const result = await deleteQuestionList(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    
    if (result.success) {
      toast('Simulado excluído com sucesso!', 'success')
      router.refresh()
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao excluir simulado', 'error')
    }
  }

  const handleDuplicate = async () => {
    if (!duplicateId) return
    setIsDuplicating(true)
    const result = await duplicateQuestionList(duplicateId)
    setIsDuplicating(false)
    setDuplicateId(null)
    
    if (result.success) {
      toast(`Simulado duplicado com sucesso (${result.questionsCopied} questões copiadas)`, 'success')
      router.refresh()
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao duplicar simulado', 'error')
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setLoadingIds(prev => new Set(prev).add(id))
    try {
      const result = await toggleQuestionListActive(id)
      if (result.success) {
        toast(currentStatus ? 'Simulado desativado' : 'Simulado ativado', 'success')
        router.refresh()
      } else {
        toast((result.errors as any)?._form?.[0] ?? 'Erro ao alterar status', 'error')
      }
    } catch (err) {
      toast('Erro inesperado', 'error')
    } finally {
      setLoadingIds(prev => {
        const next = new Set(prev)
        next.delete(id)
        return next
      })
    }
  }

  const formattedLists = initialData.map(list => ({
    ...list,
    nameNode: (
      <Link 
        href={`/admin/questoes/${list.id}`}
        className="text-surface-900 font-medium hover:text-primary hover:underline transition-colors"
      >
        {list.name}
      </Link>
    ),
    subjectNode: <span className="capitalize">{SUBJECT_LABELS[list.subject] || list.subject}</span>,
    assuntoNode: <span className="text-surface-600 text-sm">{list.subject_id ? subjects.find(s => s.id === list.subject_id)?.name || 'Desconhecido' : 'Sem assunto'}</span>,
    statusNode: (
      <div className="flex items-center gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={list.is_active}
          onClick={() => handleToggle(list.id, list.is_active)}
          disabled={loadingIds.has(list.id)}
          className={`
            relative inline-flex h-6 w-11 shrink-0 items-center rounded-full 
            transition-colors duration-200 ease-in-out
            focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
            ${list.is_active ? 'bg-success-500' : 'bg-surface-300'}
            ${loadingIds.has(list.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          <span
            className={`
              inline-block h-4 w-4 transform rounded-full bg-white 
              transition-transform duration-200 ease-in-out
              ${list.is_active ? 'translate-x-6' : 'translate-x-1'}
            `}
          />
        </button>
        <span className={`text-sm font-medium ${list.is_active ? 'text-success-600' : 'text-surface-500'}`}>
          {list.is_active ? 'Ativa' : 'Inativa'}
        </span>
      </div>
    ),
    qtdNode: <span>{list.question_count || 0}</span>,
    actionsNode: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => openModal(list)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar Simulado"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setDuplicateId(list.id)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Duplicar Simulado"
        >
          <Copy className="w-4 h-4" />
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
        title="Simulados" 
        description="Gerencie os simulados para os alunos."
        action={
          <button onClick={() => openModal()} className="btn-primary">Novo Simulado</button>
        }
      />

      <DataTable 
        data={formattedLists}
        searchKey="name"
        searchPlaceholder="Buscar simulado..."
        columns={[
          { header: 'Nome', accessor: 'nameNode' },
          { header: 'Disciplina', accessor: 'subjectNode' },
          { header: 'Assunto', accessor: 'assuntoNode' },
          { header: 'Qtde Questões', accessor: 'qtdNode' },
          { header: 'Status', accessor: 'statusNode' },
          { header: 'Ações', accessor: 'actionsNode' }
        ]}
      />

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Simulado"
        description={`Tem certeza que deseja excluir o simulado "${deletingList?.name}"? Esta ação removerá o simulado e TODAS as questões dentro dele.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />

      <ConfirmDialog 
        isOpen={!!duplicateId}
        onClose={() => setDuplicateId(null)}
        onConfirm={handleDuplicate}
        title="Duplicar simulado?"
        description="Uma cópia do simulado e de todas as suas questões será criada como Inativa. Você pode revisar e ativar depois."
        confirmText="Duplicar"
        isLoading={isDuplicating}
      />

      {/* Modal Wizard */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
          <div className={`bg-white rounded-2xl w-full ${step === 2 ? 'max-w-2xl' : 'max-w-md'} relative z-10 shadow-xl overflow-hidden max-h-[90vh] flex flex-col`}>
            
            <div className="flex items-center justify-between p-6 border-b border-surface-100 shrink-0">
              <h2 className="text-xl font-bold text-surface-900">
                {editingList ? 'Editar Simulado' : (step === 1 ? 'Novo Simulado - Passo 1/2' : 'Novo Simulado - Passo 2/2')}
              </h2>
              <button type="button" onClick={handleClose} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {step === 1 ? (
              <form onSubmit={editingList ? handleEditSave : handleAvancar} className="p-6 space-y-4 overflow-y-auto">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Nome do Simulado</label>
                  <input 
                    type="text" 
                    value={listMeta.name}
                    onChange={(e) => setListMeta({ ...listMeta, name: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Disciplina</label>
                  <select 
                    value={listMeta.subject}
                    onChange={(e) => setListMeta({ ...listMeta, subject: e.target.value, subject_id: '' })}
                    className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  >
                    {Object.entries(SUBJECT_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Assunto (Opcional)</label>
                  <select 
                    value={listMeta.subject_id}
                    onChange={(e) => setListMeta({ ...listMeta, subject_id: e.target.value })}
                    className="w-full px-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Nenhum assunto selecionado</option>
                    {subjects.filter(s => s.discipline === listMeta.subject).map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                    {subjects.filter(s => s.discipline === listMeta.subject).length === 0 && (
                      <option value="" disabled>Nenhum assunto cadastrado para esta disciplina</option>
                    )}
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
                  
                  <QuestionFormFields formData={currentQuestion} setFormData={setCurrentQuestion} />
                </div>

                <div className="p-6 pt-4 border-t border-surface-100 flex flex-wrap items-center justify-between gap-4 shrink-0 bg-white">
                  <button type="button" onClick={handleClose} className="text-surface-500 hover:text-surface-900 font-medium text-sm transition-colors">
                    Salvar Rascunho & Sair
                  </button>
                  <div className="flex gap-3">
                    <button type="button" onClick={handleAdicionarOutra} disabled={isSaving} className="btn-secondary">
                      + Salvar e Adicionar Outra
                    </button>
                    <button type="button" onClick={handleDuplicarParaProxima} disabled={isSaving} className="btn-secondary">
                      Salvar e Duplicar pra Próxima
                    </button>
                    <button type="button" onClick={handleFinalizar} disabled={isSaving} className="btn-primary">
                      {isSaving ? 'Aguarde...' : 'Finalizar Simulado'}
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
