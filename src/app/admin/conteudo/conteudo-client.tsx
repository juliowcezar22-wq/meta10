'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, X } from 'lucide-react'
import { createMaterial, updateMaterial, deleteMaterial } from '@/app/actions/admin/materials'
import type { Database } from '@/lib/supabase/types'

type Material = Database['public']['Tables']['materials']['Row']

export function ConteudoClient({ initialData }: { initialData: Material[] }) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'pdf',
    subject: '',
    file_url: '',
    is_free: false,
  })

  const openModal = (material?: Material) => {
    if (material) {
      setEditingMaterial(material)
      setFormData({
        title: material.title,
        description: material.description || '',
        type: material.type,
        subject: material.subject || '',
        file_url: material.file_url || '',
        is_free: material.is_free,
      })
    } else {
      setEditingMaterial(null)
      setFormData({
        title: '',
        description: '',
        type: 'pdf',
        subject: '',
        file_url: '',
        is_free: false,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingMaterial(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const data = new FormData()
    data.append('title', formData.title)
    data.append('description', formData.description)
    data.append('type', formData.type)
    data.append('subject', formData.subject)
    data.append('file_url', formData.file_url)
    data.append('is_free', formData.is_free.toString())

    let result
    if (editingMaterial) {
      result = await updateMaterial(editingMaterial.id, data)
    } else {
      result = await createMaterial(data)
    }

    setIsSaving(false)

    if (result.success) {
      closeModal()
      router.refresh()
    } else {
      const errors = result.errors as any
      alert(errors?._form?.[0] || 'Erro ao salvar material')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteMaterial(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    router.refresh()
  }

  const formattedMaterials = initialData.map(material => ({
    ...material,
    typeNode: (
      <Badge variant="cyan" className="uppercase text-[10px]">
        {material.type}
      </Badge>
    ),
    subjectNode: <span className="capitalize">{material.subject || '-'}</span>,
    accessNode: (
      <Badge variant={material.is_free ? 'success' : 'primary'}>
        {material.is_free ? 'Gratuito' : 'Premium'}
      </Badge>
    ),
    actionsNode: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => openModal(material)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setDeleteId(material.id)}
          className="p-2 text-surface-400 hover:text-danger-500 transition-colors rounded-lg hover:bg-surface-100" title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }))

  const deletingMaterial = initialData.find(m => m.id === deleteId)

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Conteúdo e Materiais" 
        description="Gerencie PDFs, mapas mentais e resumos."
        action={
          <button onClick={() => openModal()} className="btn-primary">Novo Material</button>
        }
      />
      
      <DataTable 
        data={formattedMaterials}
        searchKey="title"
        searchPlaceholder="Buscar por título..."
        columns={[
          { header: 'Título', accessor: 'title' },
          { header: 'Tipo', accessor: 'typeNode' },
          { header: 'Disciplina', accessor: 'subjectNode' },
          { header: 'Acesso', accessor: 'accessNode' },
          { header: 'Ações', accessor: 'actionsNode' }
        ]}
      />

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Material"
        description={`Tem certeza que deseja excluir o material "${deletingMaterial?.title}"? Esta ação não pode ser desfeita.`}
        confirmText="Excluir"
        isLoading={isDeleting}
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div className="bg-white rounded-2xl w-full max-w-md relative z-10 shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-surface-100 shrink-0">
              <h2 className="text-xl font-bold text-surface-900">
                {editingMaterial ? 'Editar Material' : 'Novo Material'}
              </h2>
              <button type="button" onClick={closeModal} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Título</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Tipo</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="pdf">PDF</option>
                  <option value="mapa_mental">Mapa Mental</option>
                  <option value="resumo">Resumo</option>
                  <option value="video">Vídeo</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Disciplina</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">Nenhuma / Geral</option>
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
                <label className="block text-sm font-medium text-surface-700 mb-1">URL do Arquivo</label>
                <input 
                  type="url" 
                  value={formData.file_url}
                  onChange={(e) => setFormData({ ...formData, file_url: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                  placeholder="https://..."
                />
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

              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="is_free"
                  checked={formData.is_free}
                  onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                  className="rounded border-surface-300 text-primary focus:ring-primary"
                />
                <label htmlFor="is_free" className="text-sm font-medium text-surface-700">
                  Material Gratuito
                </label>
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
