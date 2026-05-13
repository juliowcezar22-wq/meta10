'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

const questionListSchema = z.object({
  name: z.string().min(1),
  subject: z.enum(['matematica', 'portugues', 'historia', 'geografia', 'ciencias', 'ingles', 'fisica', 'quimica', 'biologia', 'outros']),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export async function createQuestionList(formData: FormData) {
  await requireAdmin()
  const validation = questionListSchema.safeParse({
    name: formData.get('name'),
    subject: formData.get('subject'),
    description: formData.get('description') || undefined,
    is_active: formData.get('is_active') === 'true',
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const supabase = createClient()
  const { error } = await supabase
    .from('question_lists')
    .insert(validation.data)
  
  if (error) {
    console.error('[createQuestionList]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath('/admin/questoes')
  revalidatePath('/aluno/questoes')
  return { success: true, message: 'Lista criada com sucesso' }
}

export async function updateQuestionList(id: string, formData: FormData) {
  await requireAdmin()
  const validation = questionListSchema.safeParse({
    name: formData.get('name'),
    subject: formData.get('subject'),
    description: formData.get('description') || undefined,
    is_active: formData.get('is_active') === 'true',
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const supabase = createClient()
  const { error } = await supabase
    .from('question_lists')
    .update(validation.data)
    .eq('id', id)
  
  if (error) {
    console.error('[updateQuestionList]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath('/admin/questoes')
  revalidatePath(`/admin/questoes/${id}`)
  revalidatePath('/aluno/questoes')
  return { success: true, message: 'Lista atualizada com sucesso' }
}

export async function deleteQuestionList(id: string) {
  await requireAdmin()
  const supabase = createClient()
  const { error } = await supabase
    .from('question_lists')
    .delete()
    .eq('id', id)
    
  if (error) {
    console.error('[deleteQuestionList]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath('/admin/questoes')
  revalidatePath('/aluno/questoes')
  return { success: true, message: 'Lista deletada com sucesso' }
}

export async function toggleQuestionListActive(id: string) {
  await requireAdmin()
  const supabase = createClient()
  
  const { data: list } = await supabase
    .from('question_lists')
    .select('is_active')
    .eq('id', id)
    .single()
    
  if (!list) return { success: false, errors: { _form: ['Lista não encontrada'] } }
  
  const { error } = await supabase
    .from('question_lists')
    .update({ is_active: !list.is_active })
    .eq('id', id)
    
  if (error) {
    console.error('[toggleQuestionListActive]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath('/admin/questoes')
  revalidatePath(`/admin/questoes/${id}`)
  revalidatePath('/aluno/questoes')
  return { success: true, message: 'Status da lista alterado' }
}
