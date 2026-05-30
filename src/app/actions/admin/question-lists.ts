'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

const questionListSchema = z.object({
  name: z.string().min(1),
  subject: z.enum(['matematica', 'portugues', 'historia', 'geografia', 'ciencias', 'ingles', 'fisica', 'quimica', 'biologia', 'outros']),
  subject_id: z.string().uuid().optional().nullable(),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export async function createQuestionList(formData: FormData) {
  await requireAdminOrProfessor()
  const validation = questionListSchema.safeParse({
    name: formData.get('name'),
    subject: formData.get('subject'),
    subject_id: formData.get('subject_id') || null,
    description: formData.get('description') || undefined,
    is_active: formData.get('is_active') === 'true',
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('question_lists')
    .insert({
      ...validation.data,
      created_by: user?.id
    })
    .select()
    .single()
  
  if (error) {
    console.error('[createQuestionList]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath('/admin/questoes')
  revalidatePath('/aluno/questoes')
  return { success: true, message: 'Lista criada com sucesso', list: data }
}

export async function updateQuestionList(id: string, formData: FormData) {
  await requireAdminOrProfessor()
  const validation = questionListSchema.safeParse({
    name: formData.get('name'),
    subject: formData.get('subject'),
    subject_id: formData.get('subject_id') || null,
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
  await requireAdminOrProfessor()
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
  await requireAdminOrProfessor()
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

export async function duplicateQuestionList(listId: string) {
  await requireAdminOrProfessor()
  const supabase = createClient()
  
  // 1. Busca lista original
  const { data: originalList, error: fetchError } = await supabase
    .from('question_lists')
    .select('*')
    .eq('id', listId)
    .single()
  
  if (fetchError || !originalList) {
    return { success: false, errors: { _form: ['Lista não encontrada'] } }
  }
  
  // 2. Cria lista nova (inativa por padrão pra revisão)
  const { id, created_at, updated_at, ...rest } = originalList
  const { data: { user } } = await supabase.auth.getUser()

  const { data: newList, error: insertListError } = await supabase
    .from('question_lists')
    .insert({
      ...rest,
      name: `(Duplicada) ${originalList.name}`,
      is_active: false,
      created_by: user?.id
    })
    .select('id')
    .single()
  
  if (insertListError || !newList) {
    console.error('[duplicateQuestionList] insert list', insertListError)
    return { success: false, errors: { _form: [insertListError?.message ?? 'Erro ao duplicar lista'] } }
  }
  
  // 3. Busca questões da lista original
  const { data: originalQuestions, error: fetchQError } = await supabase
    .from('questions')
    .select('*')
    .eq('list_id', listId)
  
  if (fetchQError) {
    console.error('[duplicateQuestionList] fetch questions', fetchQError)
    // Não falha — lista foi criada, apenas sem questões
    revalidatePath('/admin/questoes')
    return { 
      success: true, 
      message: 'Lista duplicada (sem questões devido a erro)',
      newListId: newList.id,
    }
  }
  
  // 4. Duplica todas as questões com novo list_id
  if (originalQuestions && originalQuestions.length > 0) {
    const questionsToInsert = originalQuestions.map(q => {
      const { id: qid, created_at: qc, updated_at: qu, ...qRest } = q
      return { ...qRest, list_id: newList.id }
    })
    
    const { error: insertQError } = await supabase
      .from('questions')
      .insert(questionsToInsert)
    
    if (insertQError) {
      console.error('[duplicateQuestionList] insert questions', insertQError)
      return { 
        success: false, 
        errors: { _form: ['Lista criada mas questões falharam: ' + insertQError.message] } 
      }
    }
  }
  
  revalidatePath('/admin/questoes')
  return { 
    success: true, 
    newListId: newList.id,
    questionsCopied: originalQuestions?.length ?? 0,
  }
}
