'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAdminOrProfessor } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

const alternativeSchema = z.object({
  letra: z.string(),
  texto: z.string().min(1, 'Alternativa não pode ser vazia'),
})

const questionSchema = z.discriminatedUnion('question_type', [
  // Múltipla escolha
  z.object({
    question_type: z.literal('multipla_escolha'),
    list_id: z.string().uuid(),
    enunciado: z.string().min(3, 'Enunciado muito curto'),
    alternatives: z.array(alternativeSchema)
      .min(2, 'Mínimo 2 alternativas')
      .max(5, 'Máximo 5 alternativas'),
    gabarito: z.string().regex(/^[a-e]$/, 'Gabarito inválido'),
    comentario: z.string().optional().nullable(),
    difficulty: z.enum(['facil', 'medio', 'dificil']),
    subject: z.enum(['matematica','portugues','historia','geografia','ciencias','ingles','fisica','quimica','biologia','outros']),
  }),
  // Verdadeiro ou Falso
  z.object({
    question_type: z.literal('verdadeiro_falso'),
    list_id: z.string().uuid(),
    enunciado: z.string().min(3, 'Enunciado muito curto'),
    alternatives: z.null().optional(),  // V/F não tem alternativas
    gabarito: z.enum(['verdadeiro', 'falso']),
    comentario: z.string().optional().nullable(),
    difficulty: z.enum(['facil', 'medio', 'dificil']),
    subject: z.enum(['matematica','portugues','historia','geografia','ciencias','ingles','fisica','quimica','biologia','outros']),
  }),
])

function parseFormData(listId: string, formData: FormData) {
  const type = formData.get('question_type') as string
  const altString = formData.get('alternatives') as string
  let alternatives = null
  if (type === 'multipla_escolha' && altString) {
    try { alternatives = JSON.parse(altString) } catch (e) { alternatives = [] }
  }

  return {
    question_type: type,
    list_id: listId,
    enunciado: formData.get('enunciado'),
    alternatives,
    gabarito: formData.get('gabarito'),
    comentario: formData.get('comentario') || null,
    subject: formData.get('subject'),
    difficulty: formData.get('difficulty'),
  }
}

function validateGabarito(data: any) {
  if (data.question_type === 'multipla_escolha') {
    const exists = data.alternatives.some((a: any) => a.letra === data.gabarito)
    if (!exists) {
      return { success: false, errors: { _form: ['O gabarito aponta para uma alternativa que não existe'] } }
    }
  }
  return { success: true }
}

export async function createQuestion(listId: string, formData: FormData) {
  await requireAdminOrProfessor()
  const rawData = parseFormData(listId, formData)
  const validation = questionSchema.safeParse(rawData)
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const gabValidation = validateGabarito(validation.data)
  if (!gabValidation.success) return gabValidation
  
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch subject_id from question_lists to inherit
  const { data: listData } = await supabase
    .from('question_lists')
    .select('subject_id')
    .eq('id', listId)
    .single()

  const dbData = {
    ...validation.data,
    context: 'simulado',
    subject_id: listData?.subject_id || null,
    created_by: user?.id
  }
  const { error } = await supabase
    .from('questions')
    .insert(dbData as any)
  
  if (error) {
    console.error('[createQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes/${listId}`)
  revalidatePath(`/aluno/questoes/${listId}`)
  return { success: true, message: 'Questão criada com sucesso' }
}

export async function updateQuestion(id: string, formData: FormData) {
  await requireAdminOrProfessor()
  const listId = formData.get('list_id') as string
  const rawData = parseFormData(listId, formData)
  const validation = questionSchema.safeParse(rawData)
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const gabValidation = validateGabarito(validation.data)
  if (!gabValidation.success) return gabValidation
  
  const dbData = {
    ...validation.data,
    context: 'simulado',
  }

  const supabase = createClient()
  const { error } = await supabase
    .from('questions')
    .update(dbData as any)
    .eq('id', id)
  
  if (error) {
    console.error('[updateQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes/${listId}`)
  revalidatePath(`/aluno/questoes/${listId}`)
  return { success: true, message: 'Questão atualizada com sucesso' }
}

export async function deleteQuestion(id: string) {
  await requireAdminOrProfessor()
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

export async function duplicateQuestion(questionId: string) {
  await requireAdminOrProfessor()
  const supabase = createClient()
  
  const { data: original, error: fetchError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .single()
  
  if (fetchError || !original) {
    return { success: false, errors: { _form: ['Questão não encontrada'] } }
  }
  
  const { data: { user } } = await supabase.auth.getUser()

  const { id, created_at, updated_at, ...rest } = original
  const { error: insertError } = await supabase
    .from('questions')
    .insert({
      ...rest,
      enunciado: `(Duplicada) ${original.enunciado}`,
      created_by: user?.id
    } as any)
  
  if (insertError) {
    console.error('[duplicateQuestion]', insertError)
    return { success: false, errors: { _form: [insertError.message] } }
  }
  
  revalidatePath(`/admin/questoes/${original.list_id}`)
  return { success: true }
}
