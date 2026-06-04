'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, Plus, X, Search, Library } from 'lucide-react'
import { Discipline } from '@/lib/data/disciplines'
import { createDiscipline, updateDiscipline, deleteDiscipline } from '@/app/actions/admin/disciplines'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { useToast } from '@/components/admin/toast'
import { DynamicIcon } from '@/components/ui/dynamic-icon'

const ICONS = [
  'BookOpen', 'Calculator', 'Globe', 'Atom', 'Binary', 'Languages', 'Milestone', 'Dna', 'FlaskConical', 'Library',
  'Beaker', 'Briefcase', 'Compass', 'Cpu', 'Database', 'Feather', 'Folder', 'Heart', 'Music', 'Palette', 'PenTool', 'PieChart', 'Shapes', 'Telescope'
]

const COLORS = [
  'bg-slate-500', 'bg-red-500', 'bg-orange-500', 'bg-amber-600', 'bg-green-600', 
  'bg-emerald-600', 'bg-teal-500', 'bg-cyan-600', 'bg-blue-500', 'bg-indigo-500', 
  'bg-violet-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
]

export function DisciplinasClient({ disciplines }: { disciplines: Discipline[] }) {
  const router = useRouter()
  const { toast } = useToast()
  
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const [formData, setFormData] = useState({
    slug: '',
    name: '',
    icon: 'BookOpen',
    color: 'bg-blue-500',
    order_index: 0
  })

  const filteredDisciplines = disciplines.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const openModal = (discipline?: Discipline) => {
    if (discipline) {
      setEditingSlug(discipline.slug)
      setFormData({ 
        slug: discipline.slug, 
        name: discipline.name,
        icon: discipline.icon || 'BookOpen',
        color: discipline.color || 'bg-blue-500',
        order_index: discipline.order_index
      })
    } else {
      setEditingSlug(null)
      setFormData({ slug: '', name: '', icon: 'BookOpen', color: 'bg-blue-500', order_index: disciplines.length + 1 })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSlug(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (editingSlug) {
        await updateDiscipline(editingSlug, formData)
        toast('Disciplina atualizada com sucesso!', 'success')
      } else {
        await createDiscipline(formData)
        toast('Disciplina criada com sucesso!', 'success')
      }
      closeModal()
      router.refresh()
    } catch (error: any) {
      toast(error.message || 'Erro ao salvar', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteSlug) return
    setIsDeleting(true)
    try {
      await deleteDiscipline(deleteSlug)
      toast('Disciplina excluída com sucesso!', 'success')
      setDeleteSlug(null)
      router.refresh()
    } catch (error: any) {
      toast('Não é possível excluir esta disciplina pois ela já possui conteúdos atrelados (ex: questões, materiais, assuntos).', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Disciplinas" 
        description="Cadastre e gerencie as matérias do sistema"
        action={
          <button onClick={() => openModal()} className="btn-primary">
            <Plus className="w-4 h-4 mr-2" />
            Nova Disciplina
          </button>
        }
      />

      <div className="bg-white p-6 rounded-2xl border border-surface-200">
        <div className="flex flex-col sm:flex-row gap-4 justify-between mb-6">
          <div className="relative max-w-md w-full">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
            <input 
              type="text" 
              placeholder="Buscar disciplina..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-surface-900"
            />
          </div>
        </div>

        {filteredDisciplines.length === 0 ? (
          <div className="text-center py-16 bg-surface-50 rounded-xl border border-surface-100">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-surface-400 shadow-sm">
              <Library className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 mb-1">Nenhuma disciplina</h3>
            <p className="text-surface-500">Nenhuma disciplina encontrada. Clique em Nova Disciplina para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDisciplines.map(d => (
              <div key={d.slug} className="p-4 flex items-center justify-between hover:bg-surface-50 transition-colors border border-surface-200 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${d.color || 'bg-blue-500'}`}>
                    <DynamicIcon name={d.icon || 'BookOpen'} className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-surface-900 block">{d.name}</span>
                    <span className="text-xs text-surface-500">Slug: {d.slug}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => openModal(d)}
                    className="p-2 text-surface-400 hover:text-primary hover:bg-primary-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setDeleteSlug(d.slug)}
                    className="p-2 text-surface-400 hover:text-danger hover:bg-danger-50 rounded-lg transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-surface-100 flex-shrink-0">
              <h2 className="text-xl font-bold text-surface-900">
                {editingSlug ? 'Editar Disciplina' : 'Nova Disciplina'}
              </h2>
              <button onClick={closeModal} className="text-surface-400 hover:text-surface-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                {!editingSlug && (
                  <div>
                    <label className="block text-sm font-medium text-surface-900 mb-1">Slug (URL)</label>
                    <input 
                      type="text" 
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                      className="w-full px-4 py-2.5 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-surface-900"
                      placeholder="Ex: matematica"
                      required
                    />
                    <p className="text-xs text-surface-500 mt-1">Apenas letras minúsculas, números e hífens. Não pode ser alterado depois.</p>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Nome da Disciplina</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-surface-900"
                    placeholder="Ex: Matemática"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Ícone</label>
                  <div className="grid grid-cols-6 gap-2">
                    {ICONS.map(iconName => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData({ ...formData, icon: iconName })}
                        className={`p-2 flex items-center justify-center rounded-lg border transition-all ${formData.icon === iconName ? 'border-primary bg-primary/10 text-primary' : 'border-surface-200 text-surface-500 hover:bg-surface-50'}`}
                        title={iconName}
                      >
                        <DynamicIcon name={iconName} className="w-5 h-5" />
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Cor</label>
                  <div className="grid grid-cols-7 gap-2">
                    {COLORS.map(colorClass => (
                      <button
                        key={colorClass}
                        type="button"
                        onClick={() => setFormData({ ...formData, color: colorClass })}
                        className={`w-8 h-8 rounded-full ${colorClass} ring-offset-2 transition-all ${formData.color === colorClass ? 'ring-2 ring-primary scale-110' : 'hover:scale-110'}`}
                        title={colorClass.replace('bg-', '')}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-900 mb-1">Ordem de Exibição</label>
                  <input 
                    type="number" 
                    value={formData.order_index}
                    onChange={e => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2.5 border border-surface-300 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-surface-900"
                    required
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="btn-secondary">
                  Cancelar
                </button>
                <button type="submit" disabled={isSaving} className="btn-primary">
                  {isSaving ? 'Salvando...' : 'Salvar Disciplina'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog 
        isOpen={!!deleteSlug}
        title="Excluir Disciplina"
        description="Tem certeza que deseja excluir esta disciplina? Essa ação será bloqueada caso haja questões, assuntos ou materiais vinculados a ela."
        confirmText="Tentar Excluir"
        onConfirm={handleDelete}
        onClose={() => setDeleteSlug(null)}
        isLoading={isDeleting}
      />
    </div>
  )
}
