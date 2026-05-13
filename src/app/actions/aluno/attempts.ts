'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function startAttempt(listId: string) {
  await requireAuth()
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, errors: { _form: ['Não autenticado'] } }
  
  // Verifica se já existe attempt não finalizada
  const { data: existing } = await supabase
    .from('attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('list_id', listId)
    .is('finished_at', null)
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (existing) {
    return { success: true, attemptId: existing.id }
  }
  
  // Cria attempt nova
  const { data, error } = await supabase
    .from('attempts')
    .insert({
      user_id: user.id,
      list_id: listId,
      answers: {},
    })
    .select('id')
    .single()
  
  if (error) {
    console.error('[startAttempt]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  return { success: true, attemptId: data.id }
}

const finishSchema = z.object({
  attemptId: z.string().uuid(),
  answers: z.record(z.string(), z.string()),
})

export async function finishAttempt(attemptId: string, answers: Record<string, string>) {
  await requireAuth()
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, errors: { _form: ['Não autenticado'] } }
  
  const validation = finishSchema.safeParse({ attemptId, answers })
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  // Busca attempt
  const { data: attempt } = await supabase
    .from('attempts')
    .select('*, list:question_lists(id)')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .single()
  
  if (!attempt) return { success: false, errors: { _form: ['Tentativa não encontrada'] } }
  
  // Busca questões da lista pra calcular score
  const { data: questions } = await supabase
    .from('questions')
    .select('id, gabarito')
    .eq('list_id', attempt.list_id)
  
  if (!questions) return { success: false, errors: { _form: ['Erro ao calcular nota'] } }
  
  // Calcula score
  let score = 0
  for (const q of questions) {
    if (answers[q.id]?.toLowerCase() === q.gabarito.toLowerCase()) {
      score++
    }
  }
  
  // Atualiza attempt
  const { error } = await supabase
    .from('attempts')
    .update({
      finished_at: new Date().toISOString(),
      answers,
      score,
      total_questions: questions.length,
    })
    .eq('id', attemptId)
  
  if (error) {
    console.error('[finishAttempt]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath(`/admin/questoes/${attempt.list_id}/respostas`)
  return { success: true, score, total: questions.length }
}
