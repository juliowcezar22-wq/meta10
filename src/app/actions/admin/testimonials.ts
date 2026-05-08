'use server'

import { z } from 'zod'

const testimonialSchema = z.object({
  author_name: z.string().min(1),
  text: z.string().min(1),
  rating: z.number().min(1).max(5),
})

export async function createTestimonial(formData: FormData) {
  const validation = testimonialSchema.safeParse({
    author_name: formData.get('author_name'),
    text: formData.get('text'),
    rating: Number(formData.get('rating')),
  })
  
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  console.log('[MOCK] createTestimonial', validation.data)
  return { success: true, message: 'Depoimento criado (mock)' }
}

export async function updateTestimonial(id: string, formData: FormData) {
  return { success: true, message: 'Depoimento atualizado (mock)' }
}

export async function deleteTestimonial(id: string) {
  console.log(`[MOCK] deleteTestimonial ${id}`)
  return { success: true, message: 'Depoimento deletado (mock)' }
}

export async function toggleTestimonialActive(id: string) {
  console.log(`[MOCK] toggleTestimonialActive ${id}`)
  return { success: true, message: 'Status alterado (mock)' }
}
