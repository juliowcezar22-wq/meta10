'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const contactSchema = z.object({
  name: z.string().min(1, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  subject: z.string().min(1, 'Assunto obrigatório'),
  message: z.string().min(10, 'Mensagem muito curta')
})

export async function sendContactMessage(formData: FormData) {
  const validation = contactSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject'),
    message: formData.get('message')
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  const supabase = createClient()
  const { error } = await supabase.from('messages').insert({
    name: validation.data.name,
    email: validation.data.email,
    subject: validation.data.subject,
    message: validation.data.message,
    is_read: false
  })
  
  if (error) {
    console.error('[sendContactMessage]', error)
    return { success: false, errors: { _form: ['Erro ao enviar. Tente novamente.'] } }
  }
  
  revalidatePath('/admin/mensagens')
  return { success: true, message: 'Mensagem enviada com sucesso!' }
}
