'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/guards'

const baseProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  material_type: z.enum(['questoes', 'atividade_pdf', 'resumo', 'mapa_mental', 'jogo']).nullable(),
  subject: z.string().nullable(),
  subject_id: z.string().uuid('ID de assunto inválido').nullable(),
  image_url: z.string().url('URL de imagem inválida').nullable(),
  promo_price: z.number().positive('Preço promocional deve ser positivo').nullable(),
})

const productSchema = z.discriminatedUnion('tipo', [
  baseProductSchema.extend({
    tipo: z.literal('pago'),
    price: z.number().positive(),
    hotmart_link: z.string().url(),
    arquivo_url: z.string().url().optional().or(z.literal('')),
  }),
  baseProductSchema.extend({
    tipo: z.literal('gratuito'),
    price: z.number().min(0),
    hotmart_link: z.string().url().optional().or(z.literal('')),
    arquivo_url: z.string().url(),
  })
]).refine(
  // Regra de negócio: materiais de estudo (PDF, resumo, mapa, jogo)
  // são sempre vendidos — nunca gratuitos
  (data) => data.material_type === null || data.tipo === 'pago',
  { message: 'Materiais de estudo não podem ser gratuitos', path: ['tipo'] }
).refine(
  (data) => data.promo_price === null || data.promo_price < data.price,
  { message: 'Preço promocional deve ser menor que o preço cheio', path: ['promo_price'] }
)

function parseProductForm(formData: FormData) {
  return {
    tipo: formData.get('tipo'),
    name: formData.get('name'),
    price: Number(formData.get('price')),
    hotmart_link: formData.get('hotmart_link') || '',
    arquivo_url: formData.get('arquivo_url') || '',
    description: formData.get('description') || undefined,
    material_type: formData.get('material_type') || null,
    subject: formData.get('subject') || null,
    subject_id: formData.get('subject_id') || null,
    image_url: formData.get('image_url') || null,
    promo_price: formData.get('promo_price') ? Number(formData.get('promo_price')) : null,
  }
}

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const validation = productSchema.safeParse(parseProductForm(formData))

  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }

  const supabase = createClient()
  const { error } = await supabase.from('products').insert({
    name: validation.data.name,
    description: validation.data.description,
    tipo: validation.data.tipo,
    price: validation.data.price,
    hotmart_link: validation.data.hotmart_link,
    arquivo_url: validation.data.arquivo_url,
    material_type: validation.data.material_type,
    subject: validation.data.subject,
    subject_id: validation.data.subject_id,
    image_url: validation.data.image_url,
    promo_price: validation.data.promo_price,
    is_active: true
  })
  
  if (error) {
    console.error('[createProduct]', error)
    return { success: false, errors: { _form: ['Erro ao criar produto'] } }
  }
  
  revalidatePath('/admin/produtos')
  revalidatePath('/aluno/loja')
  return { success: true, message: 'Produto criado com sucesso' }
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()
  const validation = productSchema.safeParse(parseProductForm(formData))

  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('products')
    .update({
      name: validation.data.name,
      description: validation.data.description,
      tipo: validation.data.tipo,
      price: validation.data.price,
      hotmart_link: validation.data.hotmart_link,
      arquivo_url: validation.data.arquivo_url,
      material_type: validation.data.material_type,
      subject: validation.data.subject,
      subject_id: validation.data.subject_id,
      image_url: validation.data.image_url,
      promo_price: validation.data.promo_price,
    })
    .eq('id', id)
    
  if (error) {
    console.error('[updateProduct]', error)
    return { success: false, errors: { _form: ['Erro ao atualizar produto'] } }
  }
  
  revalidatePath('/admin/produtos')
  revalidatePath('/aluno/loja')
  return { success: true, message: 'Produto atualizado' }
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const supabase = createClient()
  const { error } = await supabase.from('products').delete().eq('id', id)
  
  if (error) {
    console.error('[deleteProduct]', error)
    return { success: false, errors: { _form: ['Erro ao deletar produto'] } }
  }
  
  revalidatePath('/admin/produtos')
  revalidatePath('/aluno/loja')
  return { success: true, message: 'Produto deletado' }
}

export async function toggleProductActive(id: string) {
  await requireAdmin()
  const supabase = createClient()
  
  const { data: product } = await supabase.from('products').select('is_active').eq('id', id).single()
  
  if (!product) {
    return { success: false, errors: { _form: ['Produto não encontrado'] } }
  }
  
  const { error } = await supabase
    .from('products')
    .update({ is_active: !product.is_active })
    .eq('id', id)
    
  if (error) {
    console.error('[toggleProductActive]', error)
    return { success: false, errors: { _form: ['Erro ao alterar status do produto'] } }
  }
  
  revalidatePath('/admin/produtos')
  revalidatePath('/aluno/loja')
  return { success: true, message: 'Status do produto alterado' }
}
