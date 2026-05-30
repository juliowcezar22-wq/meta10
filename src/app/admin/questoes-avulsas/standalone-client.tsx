'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, X, Copy, Eye } from 'lucide-react'
import Link from 'next/link'
import { createStandaloneQuestion, updateStandaloneQuestion, deleteStandaloneQuestion, duplicateStandaloneQuestion } from '@/app/actions/admin/standalone-questions'
import { useToast } from '@/components/admin/toast'
import type { Question } from '@/lib/types/quiz'
import { QuestionFormFields, type QuestionFormData } from '@/components/admin/question-form-fields'
import { SUBJECT_LABELS } from '@/lib/constants'

export function StandaloneClient({ initialQuestions, subjects }: { initialQuestions: Question[], subjects: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState<QuestionFormData & { subject: string, subject_id: string }>({
    question_type: 'multipla_escolha',
    subject: 'matematica',
    subject_id: '',
    enunciado: '',
    alternatives: [
      { letra: 'a', texto: '' },
      { letra: 'b', texto: '' }
    ],
    gabarito: 'a',
    comentario: '',
    difficulty: 'facil',
  })

  const openModal = (q?: Question) => {
    if (q) {
      setEditingQuestion(q)
      let alts = q.alternatives as any[]
      if (!Array.isArray(alts) && alts) {
        alts = Object.entries(alts).map(([letra, texto]) => ({ letra, texto: texto as string }))
      }
      if (!alts || alts.length < 2) {
        alts = [{ letra: 'a', texto: '' }, { letra: 'b', texto: '' }]
      }
      setFormData({
        question_type: q.question_type || 'multipla_escolha',
        subject: q.subject || 'matematica',
        subject_id: (q as any).subject_id || '',
        enunciado: q.enunciado,
        alternatives: alts,
        gabarito: q.gabarito,
        comentario: q.comentario || '',
        difficulty: q.difficulty,
      })
    } else {
      setEditingQuestion(null)
      setFormData({
        question_type: 'multipla_escolha',
        subject: 'matematica',
        subject_id: '',
        enunciado: '',
        alternatives: [
          { letra: 'a', texto: '' },
          { letra: 'b', texto: '' }
        ],
        gabarito: 'a',
        comentario: '',
        difficulty: 'facil',
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingQuestion(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validation
    if (formData.question_type === 'multipla_escolha') {
      if (formData.alternatives.some(a => !a.texto.trim())) {
        toast('Todas as alternativas devem estar preenchidas', 'error')
        return
      }
    }
    if (!formData.gabarito) {
      toast('Selecione o gabarito correto', 'error')
      return
    }

    setIsSaving(true)
    
    const data = new FormData()
    data.append('subject', formData.subject)
    if (formData.subject_id) data.append('subject_id', formData.subject_id)
    data.append('question_type', formData.question_type)
    data.append('enunciado', formData.enunciado)
    data.append('gabarito', formData.gabarito)
    data.append('difficulty', formData.difficulty)
    if (formData.comentario) data.append('comentario', formData.comentario)
    
    if (formData.question_type === 'multipla_escolha') {
      data.append('alternatives', JSON.stringify(formData.alternatives))
    }

    let result
    if (editingQuestion) {
      result = await updateStandaloneQuestion(editingQuestion.id, data)
    } else {
      result = await createStandaloneQuestion(data)
    }

    setIsSaving(false)

    if (result.success) {
      toast('Questão salva com sucesso!', 'success')
      closeModal()
      router.refresh()
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao salvar questão', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    const result = await deleteStandaloneQuestion(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    if (result.success) {
      toast('Questão excluída com sucesso!', 'success')
      router.refresh()
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao excluir questão', 'error')
    }
  }

  const handleDuplicate = async (questionId: string) => {
    setIsDuplicating(questionId)
    const result = await duplicateStandaloneQuestion(questionId)
    setIsDuplicating(null)
    if (result.success) {
      toast('Questão duplicada com sucesso!', 'success')
      router.refresh()
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao duplicar questão', 'error')
    }
  }

  const formattedQuestions = initialQuestions.map(q => ({
    ...q,
    subjectNode: <span className="capitalize">{SUBJECT_LABELS[q.subject] || q.subject}</span>,
    assuntoNode: <span className="text-surface-600 text-sm">{(q as any).subject_id ? subjects.find(s => s.id === (q as any).subject_id)?.name || 'Desconhecido' : 'Sem assunto'}</span>,
    tipoNode: (
      <Badge variant={q.question_type === 'multipla_escolha' ? 'primary' : 'purple'}>
        {q.question_type === 'multipla_escolha' ? 'Múltipla Escolha' : 'V ou F'}
      </Badge>
    ),
    enunciadoNode: <span className="truncate max-w-[300px] block" title={q.enunciado}>{q.enunciado}</span>,
    actionsNode: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => openModal(q)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar Questão"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <Link 
          href={`/admin/questoes-avulsas/${q.id}/respostas`}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Ver Respostas"
        >
          <Eye className="w-4 h-4" />
        </Link>
        <button 
          onClick={() => handleDuplicate(q.id)}
          disabled={isDuplicating === q.id}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100 disabled:opacity-50" title="Duplicar questão"
        >
          <Copy className="w-4 h-4" />
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
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Questões Avulsas" 
        description="Gerencie as questões avulsas por matéria."
        action={
          <button onClick={() => openModal()} className="btn-primary">Nova Questão</button>
        }
      />

      <div className="bg-white p-6 rounded-2xl border border-surface-200 shadow-sm mt-6">
        {initialQuestions.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-100">
            <p className="text-surface-500 mb-4">Nenhuma questão avulsa cadastrada ainda. Clique em &apos;Nova Questão&apos; para começar.</p>
          </div>
        ) : (
          <DataTable 
            data={formattedQuestions}
            searchKey="enunciado"
            searchPlaceholder="Buscar no enunciado..."
            columns={[
              { header: 'Disciplina', accessor: 'subjectNode' },
              { header: 'Assunto', accessor: 'assuntoNode' },
              { header: 'Tipo', accessor: 'tipoNode' },
              { header: 'Enunciado', accessor: 'enunciadoNode' },
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
        description="Tem certeza que deseja excluir esta questão avulsa? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        isLoading={isDeleting}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-surface-100 shrink-0">
              <h2 className="text-xl font-bold text-surface-900">
                {editingQuestion ? 'Editar Questão Avulsa' : 'Nova Questão Avulsa'}
              </h2>
              <button type="button" onClick={closeModal} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-6">
              
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Disciplina</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value, subject_id: '' })}
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
                <label className="block text-sm font-medium text-surface-700 mb-1">Assunto (Opcional)</label>
                <select 
                  value={formData.subject_id}
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">Nenhum assunto selecionado</option>
                  {subjects.filter(s => s.discipline === formData.subject).map(sub => (
                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                  ))}
                  {subjects.filter(s => s.discipline === formData.subject).length === 0 && (
                    <option value="" disabled>Nenhum assunto cadastrado para esta disciplina</option>
                  )}
                </select>
              </div>

              <QuestionFormFields 
                formData={formData} 
                setFormData={(data) => setFormData({ ...data, subject: formData.subject, subject_id: formData.subject_id })} 
              />

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
