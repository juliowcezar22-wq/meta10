'use server'

import { z } from 'zod'

export async function markAsRead(id: string) {
  console.log(`[MOCK] markAsRead ${id}`)
  return { success: true, message: 'Mensagem marcada como lida (mock)' }
}

export async function markAllAsRead() {
  console.log(`[MOCK] markAllAsRead`)
  return { success: true, message: 'Todas marcadas como lidas (mock)' }
}

const createMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1)
})

export async function createMessage(formData: FormData) {
  const validation = createMessageSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject') || undefined,
    message: formData.get('message'),
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  console.log('[MOCK] createMessage', validation.data)
  return { success: true, message: 'Mensagem enviada com sucesso!' }
}
