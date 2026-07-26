'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'
import { hasActiveSubscription } from '@/lib/data/subscriptions'
import { FREE_PLAN_QUESTION_LIMIT } from '@/lib/plans'

export async function answerStandaloneQuestion(questionId: string, answer: string) {
  const user = await requireAuth()
  const supabase = createClient()

  // Plano Gratuito: limite de QUESTÕES DISTINTAS respondidas
  // (refazer uma questão já respondida não consome o limite)
  const isPaid = await hasActiveSubscription()
  if (!isPaid) {
    const [{ count: distinctCount }, { data: existing }] = await Promise.all([
      supabase.rpc('count_my_answered_questions').then(r => ({ count: r.data ?? 0 })),
      supabase
        .from('standalone_answers')
        .select('id')
        .eq('user_id', user.profile.id)
        .eq('question_id', questionId)
        .limit(1)
        .maybeSingle(),
    ])

    if (!existing && distinctCount >= FREE_PLAN_QUESTION_LIMIT) {
      return {
        success: false,
        limitReached: true,
        error: `Você atingiu o limite de ${FREE_PLAN_QUESTION_LIMIT} questões do plano Gratuito. Assine um plano para continuar respondendo.`,
      }
    }
  }

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

  // Cada tentativa é uma NOVA linha — refazer preserva o histórico
  const { error: insertError } = await supabase
    .from('standalone_answers')
    .insert({
      user_id: user.profile.id,
      question_id: questionId,
      answer: answer,
      is_correct: is_correct,
      answered_at: new Date().toISOString()
    })

  if (insertError) {
    console.error('[answerStandaloneQuestion]', insertError)
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
