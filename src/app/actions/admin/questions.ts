'use server'

import { z } from 'zod'

const questionSchema = z.object({
  list_id: z.string().min(1),
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

export async function createQuestion(formData: FormData) {
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
  
  console.log('[MOCK] createQuestion', validation.data)
  return { success: true, message: 'Questão criada (mock)' }
}

export async function updateQuestion(id: string, formData: FormData) {
  return { success: true, message: 'Questão atualizada (mock)' }
}

export async function deleteQuestion(id: string) {
  console.log(`[MOCK] deleteQuestion ${id}`)
  return { success: true, message: 'Questão deletada (mock)' }
}
