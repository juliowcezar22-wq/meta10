'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function answerStandaloneQuestion(questionId: string, answer: string) {
  const user = await requireAuth()
  const supabase = createClient()

  // Buscar a questão
  const { data: question, error: qError } = await supabase
    .from('questions')
    .select('gabarito, question_type, comentario, subject')
    .eq('id', questionId)
    .eq('context', 'avulsa')
    .single()

  if (qError || !question) {
    return { success: false, error: 'Questão não encontrada' }
  }

  // Calcular is_correct
  const is_correct = answer === question.gabarito

  // Upsert em standalone_answers
  const { error: upsertError } = await supabase
    .from('standalone_answers')
    .upsert(
      {
        user_id: user.profile.id,
        question_id: questionId,
        answer: answer,
        is_correct: is_correct,
        answered_at: new Date().toISOString()
      },
      { onConflict: 'user_id,question_id' }
    )

  if (upsertError) {
    console.error('[answerStandaloneQuestion]', upsertError)
    return { success: false, error: 'Erro ao registrar resposta' }
  }

  revalidatePath(`/aluno/questoes-avulsas`)
  revalidatePath(`/aluno/questoes-avulsas/${question.subject}`)
  
  return { 
    success: true, 
    is_correct, 
    gabarito: question.gabarito, 
    comentario: question.comentario 
  }
}
