'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/guards'

const baseProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
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
])

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const validation = productSchema.safeParse({
    tipo: formData.get('tipo'),
    name: formData.get('name'),
    price: Number(formData.get('price')),
    hotmart_link: formData.get('hotmart_link') || '',
    arquivo_url: formData.get('arquivo_url') || '',
    description: formData.get('description') || undefined,
  })
  
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
  const validation = productSchema.safeParse({
    tipo: formData.get('tipo'),
    name: formData.get('name'),
    price: Number(formData.get('price')),
    hotmart_link: formData.get('hotmart_link') || '',
    arquivo_url: formData.get('arquivo_url') || '',
    description: formData.get('description') || undefined,
  })
  
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
