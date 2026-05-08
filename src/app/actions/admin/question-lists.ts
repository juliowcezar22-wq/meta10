'use server'

import { z } from 'zod'

const questionListSchema = z.object({
  name: z.string().min(1),
  subject: z.enum(['matematica', 'portugues', 'historia', 'geografia', 'ciencias', 'ingles', 'fisica', 'quimica', 'biologia', 'outros']),
  description: z.string().optional(),
  is_active: z.boolean().default(true),
})

export async function createQuestionList(formData: FormData) {
  const validation = questionListSchema.safeParse({
    name: formData.get('name'),
    subject: formData.get('subject'),
    description: formData.get('description') || undefined,
    is_active: formData.get('is_active') === 'true',
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  console.log('[MOCK] createQuestionList', validation.data)
  return { success: true, message: 'Lista criada (mock)' }
}

export async function updateQuestionList(id: string, formData: FormData) {
  return { success: true, message: 'Lista atualizada (mock)' }
}

export async function deleteQuestionList(id: string) {
  console.log(`[MOCK] deleteQuestionList ${id}`)
  return { success: true, message: 'Lista deletada (mock)' }
}

export async function toggleQuestionListActive(id: string) {
  console.log(`[MOCK] toggleQuestionListActive ${id}`)
  return { success: true, message: 'Status da lista alterado (mock)' }
}

export async function addQuestionToList(listId: string, questionId: string, ordem: number) {
  console.log(`[MOCK] addQuestionToList ${listId} ${questionId} ${ordem}`)
  return { success: true, message: 'Questão adicionada à lista (mock)' }
}

export async function removeQuestionFromList(listId: string, questionId: string) {
  console.log(`[MOCK] removeQuestionFromList ${listId} ${questionId}`)
  return { success: true, message: 'Questão removida da lista (mock)' }
}
