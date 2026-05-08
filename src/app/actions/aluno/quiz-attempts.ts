'use server'

import { z } from 'zod'

export async function startAttempt(simuladoId: string) {
  console.log(`[MOCK] startAttempt simulado_id: ${simuladoId}`)
  // Return the ID of the new attempt
  return { success: true, attempt_id: 'new-attempt-mock', message: 'Simulado iniciado (mock)' }
}

const answerSchema = z.object({
  attempt_id: z.string().min(1),
  question_id: z.string().min(1),
  answer: z.enum(['a', 'b', 'c', 'd', 'e']),
})

export async function submitAnswer(formData: FormData) {
  const validation = answerSchema.safeParse({
    attempt_id: formData.get('attempt_id'),
    question_id: formData.get('question_id'),
    answer: formData.get('answer'),
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  console.log('[MOCK] submitAnswer', validation.data)
  return { success: true, message: 'Resposta salva (mock)' }
}

export async function finishAttempt(attemptId: string) {
  console.log(`[MOCK] finishAttempt attempt_id: ${attemptId}`)
  return { success: true, message: 'Simulado finalizado (mock)' }
}
