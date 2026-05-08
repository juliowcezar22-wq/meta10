'use server'

import { z } from 'zod'

const simuladoSchema = z.object({
  name: z.string().min(1),
  subject: z.enum(['matematica', 'portugues', 'historia', 'geografia', 'ciencias', 'ingles', 'fisica', 'quimica', 'biologia', 'outros']),
  duration_minutes: z.number().positive(),
  is_active: z.boolean().default(true),
})

export async function createSimulado(formData: FormData) {
  const validation = simuladoSchema.safeParse({
    name: formData.get('name'),
    subject: formData.get('subject'),
    duration_minutes: Number(formData.get('duration_minutes')),
    is_active: formData.get('is_active') === 'true',
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  console.log('[MOCK] createSimulado', validation.data)
  return { success: true, message: 'Simulado criado (mock)' }
}

export async function updateSimulado(id: string, formData: FormData) {
  return { success: true, message: 'Simulado atualizado (mock)' }
}

export async function deleteSimulado(id: string) {
  console.log(`[MOCK] deleteSimulado ${id}`)
  return { success: true, message: 'Simulado deletado (mock)' }
}

export async function toggleSimuladoActive(id: string) {
  console.log(`[MOCK] toggleSimuladoActive ${id}`)
  return { success: true, message: 'Status do simulado alterado (mock)' }
}

const manageQuestionsSchema = z.object({
  simulado_id: z.string().min(1),
  question_ids: z.array(z.string()),
})

export async function updateSimuladoQuestions(formData: FormData) {
  // Recebe simulado_id e os ids em array no formData
  const validation = manageQuestionsSchema.safeParse({
    simulado_id: formData.get('simulado_id'),
    question_ids: JSON.parse(formData.get('question_ids') as string || '[]'),
  })

  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }

  console.log('[MOCK] updateSimuladoQuestions', validation.data)
  return { success: true, message: 'Questões do simulado atualizadas (mock)' }
}
