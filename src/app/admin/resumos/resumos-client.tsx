'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, X, Store } from 'lucide-react'
import { createMaterial, updateMaterial, deleteMaterial, migrateMaterialToProduct } from '@/app/actions/admin/materials'
import { useToast } from '@/components/admin/toast'
import type { Database } from '@/lib/supabase/types'

type Material = Database['public']['Tables']['materials']['Row']

export function ResumosClient({ initialData , disciplines }: { initialData: Material[] , disciplines: any[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [migrateId, setMigrateId] = useState<string | null>(null)
  const [isMigrating, setIsMigrating] = useState(false)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'resumo',
    subject: '',
    file_url: '',
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
      })
    } else {
      setEditingMaterial(null)
      setFormData({
        title: '',
        description: '',
        type: 'resumo',
        subject: '',
        file_url: '',
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
    data.append('is_free', 'false')

    let result
    if (editingMaterial) {
      result = await updateMaterial(editingMaterial.id, data)
    } else {
      result = await createMaterial(data)
    }

    setIsSaving(false)

    if (result.success) {
      toast('Resumo salvo com sucesso!', 'success')
      closeModal()
      router.refresh()
    } else {
      const errors = result.errors as any
      toast(errors?._form?.[0] || 'Erro ao salvar resumo', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteMaterial(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    toast('Resumo excluído com sucesso!', 'success')
    router.refresh()
  }

  const handleMigrate = async () => {
    if (!migrateId) return
    setIsMigrating(true)
    const result = await migrateMaterialToProduct(migrateId)
    setIsMigrating(false)
    setMigrateId(null)
    if (result.success) {
      toast(result.message || 'Enviado para a Loja', 'success')
      router.refresh()
    } else {
      toast((result.errors as any)?._form?.[0] || 'Erro ao enviar para a Loja', 'error')
    }
  }

  const formattedMaterials = initialData.map(material => ({
    ...material,
    subjectNode: <span className="capitalize">{material.subject ? (disciplines.find(d => d.slug === material.subject)?.name || material.subject) : '-'}</span>,
    actionsNode: (
      <div className="flex items-center gap-2">
        <button
          onClick={() => setMigrateId(material.id)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-primary bg-primary-50 hover:bg-primary-100 border border-primary-200 rounded-lg transition-colors" title="Enviar para a Loja"
        >
          <Store className="w-3.5 h-3.5" />
          Enviar para a Loja
        </button>
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
        title="Resumos" 
        description="Gerencie os resumos disponíveis para os alunos."
        action={
          <Link href="/admin/produtos" className="btn-primary">Cadastrar na Loja</Link>
        }
      />
      
      <div className="bg-white p-6 rounded-2xl border border-surface-200">
        {initialData.length === 0 ? (
          <div className="text-center py-12 bg-surface-50 rounded-xl border border-surface-100">
            <p className="text-surface-500">Nenhum resumo cadastrado ainda.</p>
          </div>
        ) : (
          <DataTable 
            data={formattedMaterials}
            searchKey="title"
            searchPlaceholder="Buscar por título..."
            columns={[
              { header: 'Título', accessor: 'title' },
              { header: 'Disciplina', accessor: 'subjectNode' },
              { header: 'Ações', accessor: 'actionsNode' }
            ]}
          />
        )}
      </div>

      <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <strong>Novos materiais são cadastrados na Loja.</strong> Esta tela serve para migrar aos poucos os itens abaixo:
        clique em <em>Enviar para a Loja</em> — o produto é criado inativo, você define o preço na Loja e ativa quando quiser.
      </div>

      <ConfirmDialog
        isOpen={!!migrateId}
        onClose={() => setMigrateId(null)}
        onConfirm={handleMigrate}
        title="Enviar para a Loja"
        description={`"${initialData.find(m => m.id === migrateId)?.title ?? ''}" será criado como produto INATIVO na Loja (com o mesmo título, disciplina e arquivo) e removido desta lista. Você define o preço na Loja antes de ativar.`}
        confirmText="Enviar"
        isLoading={isMigrating}
      />

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Resumo"
        description={`Tem certeza que deseja excluir o resumo "${deletingMaterial?.title}"? Esta ação não pode ser desfeita.`}
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
                {editingMaterial ? 'Editar Resumo' : 'Novo Resumo'}
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
                <label className="block text-sm font-medium text-surface-700 mb-1">Disciplina</label>
                <select 
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">Nenhuma / Geral</option>
                  {disciplines.map((d) => (
                    <option key={d.slug} value={d.slug}>{d.name}</option>
                  ))}
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
