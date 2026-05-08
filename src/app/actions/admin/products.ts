'use server'

import { z } from 'zod'

const baseProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
})

const productSchema = z.discriminatedUnion('tipo', [
  baseProductSchema.extend({
    tipo: z.literal('pago'),
    price: z.number().positive(),
    hotmart_link: z.string().url(),
    arquivo_url: z.string().url().optional().or(z.literal('')),
  }),
  baseProductSchema.extend({
    tipo: z.literal('gratuito'),
    price: z.number().min(0),
    hotmart_link: z.string().url().optional().or(z.literal('')),
    arquivo_url: z.string().url(),
  })
])

export async function createProduct(formData: FormData) {
  const validation = productSchema.safeParse({
    tipo: formData.get('tipo'),
    name: formData.get('name'),
    price: Number(formData.get('price')),
    hotmart_link: formData.get('hotmart_link') || '',
    arquivo_url: formData.get('arquivo_url') || '',
    description: formData.get('description') || undefined,
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  console.log('[MOCK] createProduct', validation.data)
  return { success: true, message: 'Produto criado (mock)' }
}

export async function updateProduct(id: string, formData: FormData) {
  const validation = productSchema.safeParse({
    tipo: formData.get('tipo'),
    name: formData.get('name'),
    price: Number(formData.get('price')),
    hotmart_link: formData.get('hotmart_link') || '',
    arquivo_url: formData.get('arquivo_url') || '',
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
