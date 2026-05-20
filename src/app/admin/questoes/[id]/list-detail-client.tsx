'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { Pencil, Trash2, ArrowLeft, X, Copy } from 'lucide-react'
import { createQuestion, updateQuestion, deleteQuestion, duplicateQuestion } from '@/app/actions/admin/questions'
import { useToast } from '@/components/admin/toast'
import type { QuestionList, Question } from '@/lib/types/quiz'

export function ListDetailClient({ list, initialQuestions }: { list: QuestionList, initialQuestions: Question[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDuplicating, setIsDuplicating] = useState<string | null>(null)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const shouldOpenNewQuestion = searchParams.get('addQuestion') === '1'

  useEffect(() => {
    if (shouldOpenNewQuestion) {
      openModal()
      router.replace(`/admin/questoes/${list.id}`, { scroll: false })
    }
  }, [shouldOpenNewQuestion, list.id, router])

  // Form state
  const [formData, setFormData] = useState({
    enunciado: '',
    alternativa_a: '',
    alternativa_b: '',
    alternativa_c: '',
    alternativa_d: '',
    alternativa_e: '',
    gabarito: 'a',
    comentario: '',
    difficulty: 'facil',
  })

  const openModal = (q?: Question) => {
    if (q) {
      setEditingQuestion(q)
      setFormData({
        enunciado: q.enunciado,
        alternativa_a: (q.alternatives as any)?.a || (q as any).alternativa_a || '',
        alternativa_b: (q.alternatives as any)?.b || (q as any).alternativa_b || '',
        alternativa_c: (q.alternatives as any)?.c || (q as any).alternativa_c || '',
        alternativa_d: (q.alternatives as any)?.d || (q as any).alternativa_d || '',
        alternativa_e: (q.alternatives as any)?.e || (q as any).alternativa_e || '',
        gabarito: q.gabarito,
        comentario: q.comentario || '',
        difficulty: q.difficulty,
      })
    } else {
      setEditingQuestion(null)
      setFormData({
        enunciado: '',
        alternativa_a: '',
        alternativa_b: '',
        alternativa_c: '',
        alternativa_d: '',
        alternativa_e: '',
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
    setIsSaving(true)
    
    const data = new FormData()
    data.append('list_id', list.id)
    data.append('subject', list.subject) // Inserir a disciplina da lista na questão
    Object.entries(formData).forEach(([key, val]) => {
      data.append(key, val)
    })

    let result
    if (editingQuestion) {
      result = await updateQuestion(editingQuestion.id, data)
    } else {
      result = await createQuestion(list.id, data)
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
    const result = await deleteQuestion(deleteId)
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
    const result = await duplicateQuestion(questionId)
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
    enunciadoNode: <span className="truncate max-w-[300px] block" title={q.enunciado}>{q.enunciado}</span>,
    difficultyNode: (
      <Badge variant={q.difficulty === 'facil' ? 'success' : q.difficulty === 'medio' ? 'warning' : 'danger'}>
        {q.difficulty}
      </Badge>
    ),
    gabaritoNode: <span className="uppercase font-bold">{q.gabarito}</span>,
    actionsNode: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => openModal(q)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar Questão"
        >
          <Pencil className="w-4 h-4" />
        </button>
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
          <Link href={`/admin/questoes/${list.id}/respostas`} className="btn-secondary">Ver Respostas</Link>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-surface-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-surface-900">Questões deste Simulado</h2>
          <button onClick={() => openModal()} className="btn-primary">Nova Questão</button>
        </div>

        {initialQuestions.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-100">
            <p className="text-surface-500 mb-4">Nenhuma questão neste simulado ainda. Clique em &apos;Nova Questão&apos; para começar.</p>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="bg-white rounded-2xl w-full max-w-2xl relative z-10 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-surface-100 shrink-0">
              <h2 className="text-xl font-bold text-surface-900">
                {editingQuestion ? 'Editar Questão' : 'Nova Questão'}
              </h2>
              <button type="button" onClick={closeModal} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Enunciado</label>
                <textarea 
                  value={formData.enunciado}
                  onChange={(e) => setFormData({ ...formData, enunciado: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa A</label>
                  <input type="text" required value={formData.alternativa_a} onChange={(e) => setFormData({ ...formData, alternativa_a: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa B</label>
                  <input type="text" required value={formData.alternativa_b} onChange={(e) => setFormData({ ...formData, alternativa_b: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa C</label>
                  <input type="text" required value={formData.alternativa_c} onChange={(e) => setFormData({ ...formData, alternativa_c: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa D</label>
                  <input type="text" required value={formData.alternativa_d} onChange={(e) => setFormData({ ...formData, alternativa_d: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Alternativa E</label>
                  <input type="text" required value={formData.alternativa_e} onChange={(e) => setFormData({ ...formData, alternativa_e: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Gabarito Correto</label>
                  <select value={formData.gabarito} onChange={(e) => setFormData({ ...formData, gabarito: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required>
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
                  <label className="block text-sm font-medium text-surface-700 mb-1">Dificuldade</label>
                  <select value={formData.difficulty} onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" required>
                    <option value="facil">Fácil</option>
                    <option value="medio">Médio</option>
                    <option value="dificil">Difícil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Comentário (opcional)</label>
                  <textarea value={formData.comentario} onChange={(e) => setFormData({ ...formData, comentario: e.target.value })} className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" rows={2} />
                </div>
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
    </>
  )
}
