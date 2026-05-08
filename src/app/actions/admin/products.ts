'use server'

import { z } from 'zod'

const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().positive(),
  hotmart_link: z.string().url(),
  description: z.string().optional(),
})

export async function createProduct(formData: FormData) {
  const validation = productSchema.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
    hotmart_link: formData.get('hotmart_link'),
    description: formData.get('description') || undefined,
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  // MOCK: log + sucesso simulado
  console.log('[MOCK] createProduct', validation.data)
  return { success: true, message: 'Produto criado (mock)' }
}

export async function updateProduct(id: string, formData: FormData) {
  const validation = productSchema.safeParse({
    name: formData.get('name'),
    price: Number(formData.get('price')),
    hotmart_link: formData.get('hotmart_link'),
    description: formData.get('description') || undefined,
  })
  if (!validation.success) return { success: false, errors: validation.error.flatten().fieldErrors }
  
  console.log(`[MOCK] updateProduct ${id}`, validation.data)
  return { success: true, message: 'Produto atualizado (mock)' }
}

export async function deleteProduct(id: string) {
  console.log(`[MOCK] deleteProduct ${id}`)
  return { success: true, message: 'Produto deletado (mock)' }
}

export async function toggleProductActive(id: string) {
  console.log(`[MOCK] toggleProductActive ${id}`)
  return { success: true, message: 'Status do produto alterado (mock)' }
}
