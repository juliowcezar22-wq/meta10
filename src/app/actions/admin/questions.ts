'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

const questionSchema = z.object({
  list_id: z.string().uuid(),
  enunciado: z.string().min(1),
  alternativa_a: z.string().min(1),
  alternativa_b: z.string().min(1),
  alternativa_c: z.string().min(1),
  alternativa_d: z.string().min(1),
  alternativa_e: z.string().min(1),
  gabarito: z.enum(['a', 'b', 'c', 'd', 'e']),
  comentario: z.string().optional(),
  subject: z.enum(['matematica', 'portugues', 'historia', 'geografia', 'ciencias', 'ingles', 'fisica', 'quimica', 'biologia', 'outros']),
  difficulty: z.enum(['facil', 'medio', 'dificil']),
})

export async function createQuestion(listId: string, formData: FormData) {
  await requireAdmin()
  const validation = questionSchema.safeParse({
    list_id: listId,
    enunciado: formData.get('enunciado'),
    alternativa_a: formData.get('alternativa_a'),
    alternativa_b: formData.get('alternativa_b'),
    alternativa_c: formData.get('alternativa_c'),
    alternativa_d: formData.get('alternativa_d'),
    alternativa_e: formData.get('alternativa_e'),
    gabarito: formData.get('gabarito'),
    comentario: formData.get('comentario') || undefined,
    subject: formData.get('subject'),
    difficulty: formData.get('difficulty'),
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const supabase = createClient()
  const { error } = await supabase
    .from('questions')
    .insert(validation.data)
  
  if (error) {
    console.error('[createQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes/${listId}`)
  revalidatePath(`/aluno/questoes/${listId}`)
  return { success: true, message: 'Questão criada com sucesso' }
}

export async function updateQuestion(id: string, formData: FormData) {
  await requireAdmin()
  const validation = questionSchema.safeParse({
    list_id: formData.get('list_id'),
    enunciado: formData.get('enunciado'),
    alternativa_a: formData.get('alternativa_a'),
    alternativa_b: formData.get('alternativa_b'),
    alternativa_c: formData.get('alternativa_c'),
    alternativa_d: formData.get('alternativa_d'),
    alternativa_e: formData.get('alternativa_e'),
    gabarito: formData.get('gabarito'),
    comentario: formData.get('comentario') || undefined,
    subject: formData.get('subject'),
    difficulty: formData.get('difficulty'),
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const supabase = createClient()
  const { error } = await supabase
    .from('questions')
    .update(validation.data)
    .eq('id', id)
  
  if (error) {
    console.error('[updateQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes/${validation.data.list_id}`)
  revalidatePath(`/aluno/questoes/${validation.data.list_id}`)
  return { success: true, message: 'Questão atualizada com sucesso' }
}

export async function deleteQuestion(id: string) {
  await requireAdmin()
  const supabase = createClient()
  
  const { data: question } = await supabase
    .from('questions')
    .select('list_id')
    .eq('id', id)
    .single()
    
  if (!question) return { success: false, errors: { _form: ['Questão não encontrada'] } }
  
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id)
    
  if (error) {
    console.error('[deleteQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes/${question.list_id}`)
  revalidatePath(`/aluno/questoes/${question.list_id}`)
  return { success: true, message: 'Questão deletada com sucesso' }
}
