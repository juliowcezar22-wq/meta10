'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DataTable } from '@/components/admin/data-table'
import { Badge } from '@/components/admin/badge'
import { ConfirmDialog } from '@/components/admin/confirm-dialog'
import { PageHeader } from '@/components/admin/page-header'
import { Pencil, Trash2, X } from 'lucide-react'
import { createProduct, updateProduct, deleteProduct } from '@/app/actions/admin/products'
import { useToast } from '@/components/admin/toast'
import type { Product } from '@/lib/types/product'
import type { Discipline } from '@/lib/data/disciplines'
import type { Subject } from '@/lib/data/subjects'
import { MATERIAL_TYPES, MATERIAL_TYPE_LABELS } from '@/lib/constants'
import { ImageUploadField } from '@/components/admin/image-upload-field'
import { ShoppingBag } from 'lucide-react'

export function ProdutosClient({ initialData, disciplines, subjects }: { initialData: Product[], disciplines: Discipline[], subjects: Subject[] }) {
  const router = useRouter()
  const { toast } = useToast()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tipo: 'pago' as 'pago' | 'gratuito',
    price: '',
    hotmart_link: '',
    arquivo_url: '',
    description: '',
    material_type: '',
    subject: '',
    subject_id: '',
    promo_price: '',
    image_url: null as string | null,
  })

  // Materiais de estudo (PDF, resumo, mapa, jogo) são sempre pagos
  const isMaterial = formData.material_type !== ''

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setFormData({
        name: product.name,
        tipo: product.tipo,
        price: product.price.toString(),
        hotmart_link: product.hotmart_link || '',
        arquivo_url: product.arquivo_url || '',
        description: product.description || '',
        material_type: product.material_type || '',
        subject: product.subject || '',
        subject_id: product.subject_id || '',
        promo_price: product.promo_price != null ? product.promo_price.toString() : '',
        image_url: product.image_url || null,
      })
    } else {
      setEditingProduct(null)
      setFormData({
        name: '',
        tipo: 'pago',
        price: '',
        hotmart_link: '',
        arquivo_url: '',
        description: '',
        material_type: '',
        subject: '',
        subject_id: '',
        promo_price: '',
        image_url: null,
      })
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProduct(null)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    
    const data = new FormData()
    data.append('name', formData.name)
    data.append('tipo', isMaterial ? 'pago' : formData.tipo)
    data.append('description', formData.description)
    data.append('material_type', formData.material_type)
    data.append('subject', formData.subject)
    data.append('subject_id', formData.subject_id)
    if (formData.promo_price) data.append('promo_price', formData.promo_price)
    if (formData.image_url) data.append('image_url', formData.image_url)

    if (isMaterial || formData.tipo === 'pago') {
      data.append('price', formData.price)
      data.append('hotmart_link', formData.hotmart_link)
    } else {
      data.append('price', '0')
      data.append('arquivo_url', formData.arquivo_url)
    }

    let result
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, data)
    } else {
      result = await createProduct(data)
    }

    setIsSaving(false)

    if (result.success) {
      toast('Item salvo com sucesso!', 'success')
      closeModal()
      router.refresh()
    } else {
      toast('Erro ao salvar item', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    await deleteProduct(deleteId)
    setIsDeleting(false)
    setDeleteId(null)
    toast('Item excluído com sucesso!', 'success')
    router.refresh()
  }

  const formattedProducts = initialData.map(product => ({
    ...product,
    imageNode: product.image_url ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={product.image_url} alt={product.name} className="w-12 h-12 object-cover rounded-lg border border-surface-200" />
    ) : (
      <div className="w-12 h-12 rounded-lg bg-surface-100 border border-surface-200 flex items-center justify-center text-surface-300">
        <ShoppingBag className="w-5 h-5" />
      </div>
    ),
    materialNode: product.material_type ? (
      <span className="text-surface-700">{MATERIAL_TYPE_LABELS[product.material_type] || product.material_type}</span>
    ) : (
      <span className="text-surface-400">—</span>
    ),
    subjectNode: product.subject ? (
      <span className="capitalize">{disciplines.find(d => d.slug === product.subject)?.name || product.subject}</span>
    ) : (
      <span className="text-surface-400">—</span>
    ),
    priceFormatted: product.tipo === 'pago' ? `R$ ${product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : '-',
    tipoNode: (
      <Badge variant={product.tipo === 'gratuito' ? 'success' : 'primary'}>
        {product.tipo === 'gratuito' ? 'Gratuito' : 'Pago'}
      </Badge>
    ),
    linkNode: product.tipo === 'pago' ? (
      product.hotmart_link ? (
        <a href={product.hotmart_link} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate max-w-[200px] block">
          {product.hotmart_link}
        </a>
      ) : (
        <span className="text-xs text-surface-500">Venda pelo WhatsApp (sem link)</span>
      )
    ) : (
      <a href={product.arquivo_url!} target="_blank" rel="noreferrer" className="text-success-600 hover:underline truncate max-w-[200px] block">
        Download
      </a>
    ),
    statusNode: (
      <Badge variant={product.is_active ? 'success' : 'gray'}>
        {product.is_active ? 'Ativo' : 'Inativo'}
      </Badge>
    ),
    actionsNode: (
      <div className="flex items-center gap-2">
        <button 
          onClick={() => openModal(product)}
          className="p-2 text-surface-400 hover:text-primary transition-colors rounded-lg hover:bg-surface-100" title="Editar"
        >
          <Pencil className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setDeleteId(product.id)}
          className="p-2 text-surface-400 hover:text-danger-500 transition-colors rounded-lg hover:bg-surface-100" title="Excluir"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )
  }))

  const deletingProduct = initialData.find(p => p.id === deleteId)

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto w-full">
      <PageHeader 
        title="Loja" 
        description="Gerencie os itens vendidos na loja."
        action={
          <button onClick={() => openModal()} className="btn-primary">Novo Item da Loja</button>
        }
      />

      <DataTable 
        data={formattedProducts}
        searchKey="name"
        searchPlaceholder="Buscar por nome..."
        columns={[
          { header: 'Imagem', accessor: 'imageNode' },
          { header: 'Nome', accessor: 'name' },
          { header: 'Material', accessor: 'materialNode' },
          { header: 'Disciplina', accessor: 'subjectNode' },
          { header: 'Tipo', accessor: 'tipoNode' },
          { header: 'Preço', accessor: 'priceFormatted' },
          { header: 'Link', accessor: 'linkNode' },
          { header: 'Status', accessor: 'statusNode' },
          { header: 'Ações', accessor: 'actionsNode' }
        ]}
      />

      <ConfirmDialog 
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Excluir Item da Loja"
        description={`Tem certeza que deseja excluir o item "${deletingProduct?.name}"? Esta ação não pode ser desfeita.`}
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
                {editingProduct ? 'Editar Item da Loja' : 'Novo Item da Loja'}
              </h2>
              <button type="button" onClick={closeModal} className="text-surface-400 hover:text-surface-900 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Tipo de Material</label>
                <select
                  value={formData.material_type}
                  onChange={(e) => setFormData({ ...formData, material_type: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                >
                  <option value="">Produto geral (sem categoria)</option>
                  {MATERIAL_TYPES.map((m) => (
                    <option key={m.slug} value={m.slug}>{m.label}</option>
                  ))}
                </select>
                {isMaterial && (
                  <p className="text-xs text-surface-500 mt-1">Materiais de estudo são sempre vendidos (nunca gratuitos).</p>
                )}
              </div>

              {isMaterial && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Disciplina</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value, subject_id: '' })}
                    className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                  >
                    <option value="">Selecione uma disciplina</option>
                    {disciplines.map((d) => (
                      <option key={d.slug} value={d.slug}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {isMaterial && formData.subject && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Assunto (opcional)</label>
                  <select
                    value={formData.subject_id}
                    onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="">Sem assunto específico</option>
                    {subjects.filter(su => su.discipline === formData.subject).map(su => (
                      <option key={su.id} value={su.id}>{su.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {!isMaterial && (
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Tipo</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'pago' | 'gratuito' })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                >
                  <option value="pago">Pago</option>
                  <option value="gratuito">Gratuito</option>
                </select>
              </div>
              )}

              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1">Nome do Item</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  required
                />
              </div>

              <ImageUploadField
                bucket="product-images"
                label="Imagem do Produto"
                value={formData.image_url}
                onChange={(url) => setFormData({ ...formData, image_url: url })}
              />

              {(isMaterial || formData.tipo === 'pago') && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Preço (R$)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Preço Promocional (R$, opcional)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      min="0.01"
                      value={formData.promo_price}
                      onChange={(e) => setFormData({ ...formData, promo_price: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="Menor que o preço cheio"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 mb-1">Link Hotmart (opcional)</label>
                    <input 
                      type="url" 
                      value={formData.hotmart_link}
                      onChange={(e) => setFormData({ ...formData, hotmart_link: e.target.value })}
                      className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                      placeholder="https://pay.hotmart.com/..."
                    />
                    <p className="text-xs text-surface-500 mt-1">Sem link, o botão de compra leva o aluno ao WhatsApp da META 10.</p>
                  </div>
                </>
              )}

              {!isMaterial && formData.tipo === 'gratuito' && (
                <div>
                  <label className="block text-sm font-medium text-surface-700 mb-1">Link de Download (Google Drive, etc)</label>
                  <input 
                    type="url" 
                    value={formData.arquivo_url}
                    onChange={(e) => setFormData({ ...formData, arquivo_url: e.target.value })}
                    className="w-full px-3 py-2 bg-surface-50 border border-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    required
                    placeholder="https://drive.google.com/..."
                  />
                </div>
              )}

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
