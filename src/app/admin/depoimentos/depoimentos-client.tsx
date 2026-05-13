'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, X, Eye, EyeOff } from 'lucide-react'
import { createTestimonial, updateTestimonial, deleteTestimonial, toggleTestimonialActive } from '@/app/actions/admin/testimonials'
import type { Database } from '@/lib/supabase/types'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export function DepoimentosClient({ initialData }: { initialData: Testimonial[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    author_name: '',
    text: '',
    rating: 5,
  })

  const openModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial)
      setFormData({
        author_name: testimonial.author_name,
        text: testimonial.text,
        rating: testimonial.rating,
      })
    } else {
      setEditingTestimonial(null)
      setFormData({
        author_name: '',
        text: '',
        rating: 5,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingTestimonial(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const data = new FormData()
    data.append('author_name', formData.author_name)
    data.append('text', formData.text)
    data.append('rating', formData.rating.toString())

    let result
    if (editingTestimonial) {
      result = await updateTestimonial(editingTestimonial.id, data)
    } else {
      result = await createTestimonial(data)
    }

    setIsSaving(false)

    if (result.success) {
      closeModal()
      router.refresh()
    } else {
      alert('Erro ao salvar depoimento')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteTestimonial(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    router.refresh()
  }

  const handleToggleActive = async (id: string) => {
    await toggleTestimonialActive(id)
    router.refresh()
  }

  const formattedTestimonials = initialData.map(t => ({
    ...t,
    textNode: <span className="truncate max-w-xs block" title={t.text}>{t.text}</span>,
    ratingFormatted: `${t.rating} estrelas`,
    statusNode: (
      <Badge variant={t.is_active ? 'success' : 'gray'}>
        {t.is_active ? 'Visível' : 'Oculto'}
      </Badge>
    ),
    actionsNode: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => handleToggleActive(t.id)}
          className="p-2 text-surface-400 hover:text-surface-900 transition-colors rounded-lg hover:bg-surface-100" title={t.is_active ? "Ocultar" : "Mostrar"}
        >
          {t.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => openModal(t)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setDeleteId(t.id)}
          className="p-2 text-surface-400 hover:text-danger-500 transition-colors rounded-lg hover:bg-surface-100" title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }))

  const deletingTestimonial = initialData.find(t => t.id === deleteId)

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Depoimentos" 
        description="Gerencie os depoimentos dos alunos aprovados."
        action={
          <button onClick={() => openModal()} className="btn-primary">Novo Depoimento</button>
        }
      />
      
      <DataTable 
        data={formattedTestimonials}
        searchKey="author_name"
        searchPlaceholder="Buscar por nome..."
        columns={[
          { header: 'Autor', accessor: 'author_name' },
          { header: 'Texto', accessor: 'textNode' },
          { header: 'Avaliação', accessor: 'ratingFormatted' },
          { header: 'Status', accessor: 'statusNode' },
          { header: 'Ações', accessor: 'actionsNode' }
        ]}
      />

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Depoimento"
        description={`Tem certeza que deseja excluir o depoimento de "${deletingTestimonial?.author_name}"? Esta ação não pode ser desfeita.`}
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
                {editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
              </h2>
              <button type="button" onClick={closeModal} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Autor</label>
                <input 
                  type="text" 
                  value={formData.author_name}
                  onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Texto</label>
                <textarea 
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  rows={4}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Avaliação (1 a 5)</label>
                <input 
                  type="number" 
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
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
