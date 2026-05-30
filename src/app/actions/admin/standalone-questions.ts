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
    list_id: z.null().optional(),
    enunciado: z.string().min(3, 'Enunciado muito curto'),
    alternatives: z.array(alternativeSchema)
      .min(2, 'Mínimo 2 alternativas')
      .max(5, 'Máximo 5 alternativas'),
    gabarito: z.string().regex(/^[a-e]$/, 'Gabarito inválido'),
    comentario: z.string().optional().nullable(),
    difficulty: z.enum(['facil', 'medio', 'dificil']),
    subject: z.enum(['matematica','portugues','historia','geografia','ciencias','ingles','fisica','quimica','biologia','outros']),
    subject_id: z.string().uuid('ID de assunto inválido').optional().nullable(),
  }),
  // Verdadeiro ou Falso
  z.object({
    question_type: z.literal('verdadeiro_falso'),
    list_id: z.null().optional(),
    enunciado: z.string().min(3, 'Enunciado muito curto'),
    alternatives: z.null().optional(),  // V/F não tem alternativas
    gabarito: z.enum(['verdadeiro', 'falso']),
    comentario: z.string().optional().nullable(),
    difficulty: z.enum(['facil', 'medio', 'dificil']),
    subject: z.enum(['matematica','portugues','historia','geografia','ciencias','ingles','fisica','quimica','biologia','outros']),
    subject_id: z.string().uuid('ID de assunto inválido').optional().nullable(),
  }),
])

function parseFormData(formData: FormData) {
  const type = formData.get('question_type') as string
  const altString = formData.get('alternatives') as string
  let alternatives = null
  if (type === 'multipla_escolha' && altString) {
    try { alternatives = JSON.parse(altString) } catch (e) { alternatives = [] }
  }

  return {
    question_type: type,
    list_id: null,
    enunciado: formData.get('enunciado'),
    alternatives,
    gabarito: formData.get('gabarito'),
    comentario: formData.get('comentario') || null,
    subject: formData.get('subject'),
    subject_id: formData.get('subject_id') || null,
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

export async function createStandaloneQuestion(formData: FormData) {
  await requireAdminOrProfessor()
  const rawData = parseFormData(formData)
  const validation = questionSchema.safeParse(rawData)
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const gabValidation = validateGabarito(validation.data)
  if (!gabValidation.success) return gabValidation
  
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const dbData = {
    ...validation.data,
    context: 'avulsa',
    list_id: null,
    created_by: user?.id
  }

  const { error } = await supabase
    .from('questions')
    .insert(dbData as any)
  
  if (error) {
    console.error('[createStandaloneQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas/${dbData.subject}`)
  return { success: true, message: 'Questão criada com sucesso' }
}

export async function updateStandaloneQuestion(id: string, formData: FormData) {
  await requireAdminOrProfessor()
  const rawData = parseFormData(formData)
  const validation = questionSchema.safeParse(rawData)
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  const gabValidation = validateGabarito(validation.data)
  if (!gabValidation.success) return gabValidation
  
  const supabase = createClient()

  const dbData = {
    ...validation.data,
    context: 'avulsa',
    list_id: null
  }

  const { error } = await supabase
    .from('questions')
    .update(dbData as any)
    .eq('id', id)
    .eq('context', 'avulsa')
  
  if (error) {
    console.error('[updateStandaloneQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas/${dbData.subject}`)
  return { success: true, message: 'Questão atualizada com sucesso' }
}

export async function deleteStandaloneQuestion(id: string) {
  await requireAdminOrProfessor()
  const supabase = createClient()
  
  const { data: question } = await supabase
    .from('questions')
    .select('subject')
    .eq('id', id)
    .eq('context', 'avulsa')
    .single()
    
  if (!question) return { success: false, errors: { _form: ['Questão não encontrada'] } }
  
  const { error } = await supabase
    .from('questions')
    .delete()
    .eq('id', id)
    .eq('context', 'avulsa')
    
  if (error) {
    console.error('[deleteStandaloneQuestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas/${question.subject}`)
  return { success: true, message: 'Questão deletada com sucesso' }
}

export async function duplicateStandaloneQuestion(questionId: string) {
  await requireAdminOrProfessor()
  const supabase = createClient()
  
  const { data: original, error: fetchError } = await supabase
    .from('questions')
    .select('*')
    .eq('id', questionId)
    .eq('context', 'avulsa')
    .single()
  
  if (fetchError || !original) {
    return { success: false, errors: { _form: ['Questão não encontrada'] } }
  }
  
  const { id, created_at, updated_at, ...rest } = original
  const { error: insertError } = await supabase
    .from('questions')
    .insert({
      ...rest,
      enunciado: `(Duplicada) ${original.enunciado}`,
      context: 'avulsa',
      list_id: null
    } as any)
  
  if (insertError) {
    console.error('[duplicateStandaloneQuestion]', insertError)
    return { success: false, errors: { _form: [insertError.message] } }
  }
  
  revalidatePath(`/admin/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas/${original.subject}`)
  return { success: true }
}
