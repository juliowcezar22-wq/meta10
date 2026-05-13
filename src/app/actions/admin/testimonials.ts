'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/guards'

const testimonialSchema = z.object({
  author_name: z.string().min(1),
  text: z.string().min(1),
  rating: z.number().min(1).max(5),
})

export async function createTestimonial(formData: FormData) {
  await requireAdmin()
  const validation = testimonialSchema.safeParse({
    author_name: formData.get('author_name'),
    text: formData.get('text'),
    rating: Number(formData.get('rating')),
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  const supabase = createClient()
  const { error } = await supabase.from('testimonials').insert({
    author_name: validation.data.author_name,
    text: validation.data.text,
    rating: validation.data.rating,
    is_active: true
  })
  
  if (error) {
    console.error('[createTestimonial]', error)
    return { success: false, errors: { _form: ['Erro ao criar depoimento'] } }
  }
  
  revalidatePath('/admin/depoimentos')
  revalidatePath('/')
  return { success: true, message: 'Depoimento criado com sucesso' }
}

export async function updateTestimonial(id: string, formData: FormData) {
  await requireAdmin()
  const validation = testimonialSchema.safeParse({
    author_name: formData.get('author_name'),
    text: formData.get('text'),
    rating: Number(formData.get('rating')),
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  const supabase = createClient()
  const { error } = await supabase
    .from('testimonials')
    .update({
      author_name: validation.data.author_name,
      text: validation.data.text,
      rating: validation.data.rating,
    })
    .eq('id', id)
    
  if (error) {
    console.error('[updateTestimonial]', error)
    return { success: false, errors: { _form: ['Erro ao atualizar depoimento'] } }
  }
  
  revalidatePath('/admin/depoimentos')
  revalidatePath('/')
  return { success: true, message: 'Depoimento atualizado' }
}

export async function deleteTestimonial(id: string) {
  await requireAdmin()
  const supabase = createClient()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  
  if (error) {
    console.error('[deleteTestimonial]', error)
    return { success: false, errors: { _form: ['Erro ao deletar depoimento'] } }
  }
  
  revalidatePath('/admin/depoimentos')
  revalidatePath('/')
  return { success: true, message: 'Depoimento deletado' }
}

export async function toggleTestimonialActive(id: string) {
  await requireAdmin()
  const supabase = createClient()
  
  const { data: testimonial } = await supabase.from('testimonials').select('is_active').eq('id', id).single()
  
  if (!testimonial) {
    return { success: false, errors: { _form: ['Depoimento não encontrado'] } }
  }
  
  const { error } = await supabase
    .from('testimonials')
    .update({ is_active: !testimonial.is_active })
    .eq('id', id)
    
  if (error) {
    console.error('[toggleTestimonialActive]', error)
    return { success: false, errors: { _form: ['Erro ao alterar status do depoimento'] } }
  }
  
  revalidatePath('/admin/depoimentos')
  revalidatePath('/')
  return { success: true, message: 'Status alterado com sucesso' }
}
