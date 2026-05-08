'use server'

import { z } from 'zod'

const materialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  subject: z.string().optional(),
  file_url: z.string().url(),
  is_free: z.boolean().default(false),
})

export async function createMaterial(formData: FormData) {
  const validation = materialSchema.safeParse({
    title: formData.get('title'),
    description: formData.get('description') || undefined,
    type: formData.get('type'),
    subject: formData.get('subject') || undefined,
    file_url: formData.get('file_url'),
    is_free: formData.get('is_free') === 'true',
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  console.log('[MOCK] createMaterial', validation.data)
  return { success: true, message: 'Material criado (mock)' }
}

export async function updateMaterial(id: string, formData: FormData) {
  // Mesmo schema
  return { success: true, message: 'Material atualizado (mock)' }
}

export async function deleteMaterial(id: string) {
  console.log(`[MOCK] deleteMaterial ${id}`)
  return { success: true, message: 'Material deletado (mock)' }
}
