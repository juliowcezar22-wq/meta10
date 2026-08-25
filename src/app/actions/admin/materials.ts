'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdminOrProfessor, requireAdmin } from '@/lib/auth/guards'

const materialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  subject: z.string().optional(),
  file_url: z.string().url(),
  is_free: z.boolean().default(false),
})

// Regra de negócio: estes tipos são vendidos avulsos na loja e
// nunca podem ser marcados como gratuitos nem liberados por plano.
const PAID_ONLY_TYPES = ['atividade_pdf', 'resumo', 'mapa_mental', 'jogo']

function enforcePaidOnly(data: z.infer<typeof materialSchema>) {
  return PAID_ONLY_TYPES.includes(data.type) ? { ...data, is_free: false } : data
}

export async function createMaterial(formData: FormData) {
  await requireAdminOrProfessor()
  const validation = materialSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    type: formData.get('type'),
    subject: formData.get('subject') || undefined,
    file_url: formData.get('file_url'),
    is_free: formData.get('is_free') === 'true',
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const materialData = enforcePaidOnly(validation.data)

  const { error } = await supabase.from('materials').insert({
    title: materialData.title,
    description: materialData.description,
    type: materialData.type,
    subject: materialData.subject,
    file_url: materialData.file_url,
    is_free: materialData.is_free,
    created_by: user?.id,
  })
  
  if (error) {
    console.error('[createMaterial]', error)
    return { success: false, errors: { _form: [error.message || 'Erro ao criar material'] } }
  }
  
  revalidatePath('/admin/mapas-mentais')
  revalidatePath('/admin/resumos')
  revalidatePath('/admin/atividades-pdf')
  revalidatePath('/admin/jogos-pedagogicos')
  revalidatePath('/aluno/materiais')
  return { success: true, message: 'Material criado com sucesso' }
}

export async function updateMaterial(id: string, formData: FormData) {
  await requireAdminOrProfessor()
  const validation = materialSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    type: formData.get('type'),
    subject: formData.get('subject') || undefined,
    file_url: formData.get('file_url'),
    is_free: formData.get('is_free') === 'true',
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  const supabase = createClient()
  const materialData = enforcePaidOnly(validation.data)
  const { error } = await supabase
    .from('materials')
    .update({
      title: materialData.title,
      description: materialData.description,
      type: materialData.type,
      subject: materialData.subject,
      file_url: materialData.file_url,
      is_free: materialData.is_free,
    })
    .eq('id', id)
    
  if (error) {
    console.error('[updateMaterial]', error)
    return { success: false, errors: { _form: [error.message || 'Erro ao atualizar material'] } }
  }
  
  revalidatePath('/admin/mapas-mentais')
  revalidatePath('/admin/resumos')
  revalidatePath('/admin/atividades-pdf')
  revalidatePath('/admin/jogos-pedagogicos')
  revalidatePath('/aluno/materiais')
  return { success: true, message: 'Material atualizado' }
}

export async function deleteMaterial(id: string) {
  await requireAdminOrProfessor()
  const supabase = createClient()
  const { error } = await supabase.from('materials').delete().eq('id', id)
  
  if (error) {
    console.error('[deleteMaterial]', error)
    return { success: false, errors: { _form: [error.message || 'Erro ao deletar material'] } }
  }
  
  revalidatePath('/admin/mapas-mentais')
  revalidatePath('/admin/resumos')
  revalidatePath('/admin/atividades-pdf')
  revalidatePath('/admin/jogos-pedagogicos')
  revalidatePath('/aluno/materiais')
  return { success: true, message: 'Material deletado' }
}

/**
 * Migração item a item para a Loja (decisão da cliente: migrar aos poucos).
 * Cria o produto INATIVO com preço 0 — o admin define preço/link na Loja e
 * ativa — e remove o material de origem. Título, disciplina e arquivo são
 * preservados.
 */
export async function migrateMaterialToProduct(id: string) {
  await requireAdmin()
  const supabase = createClient()

  const { data: material, error: fetchError } = await supabase
    .from('materials')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !material) {
    return { success: false, errors: { _form: ['Material não encontrado'] } }
  }
  if (!PAID_ONLY_TYPES.includes(material.type)) {
    return { success: false, errors: { _form: ['Este tipo de material não é vendido na loja'] } }
  }

  const { error: insertError } = await supabase.from('products').insert({
    name: material.title,
    description: material.description,
    tipo: 'pago',
    price: 0,               // preço pendente — definir na Loja antes de ativar
    hotmart_link: null,
    arquivo_url: material.file_url,
    material_type: material.type,
    subject: material.subject,
    is_active: false,       // inativo até o admin revisar
  })

  if (insertError) {
    console.error('[migrateMaterialToProduct] insert', insertError)
    return { success: false, errors: { _form: [insertError.message || 'Erro ao criar produto na loja'] } }
  }

  const { error: deleteError } = await supabase.from('materials').delete().eq('id', id)
  if (deleteError) {
    console.error('[migrateMaterialToProduct] delete', deleteError)
    return { success: false, errors: { _form: ['Produto criado, mas o material de origem não pôde ser removido'] } }
  }

  revalidatePath('/admin/produtos')
  revalidatePath('/admin/mapas-mentais')
  revalidatePath('/admin/resumos')
  revalidatePath('/admin/atividades-pdf')
  revalidatePath('/admin/jogos-pedagogicos')
  return { success: true, message: 'Enviado para a Loja como produto inativo. Defina o preço e ative.' }
}
