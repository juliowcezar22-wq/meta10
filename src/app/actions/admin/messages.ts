'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/guards'

export async function markAsRead(id: string) {
  await requireAdmin()
  const supabase = createClient()
  const { error } = await supabase.from('messages').update({ is_read: true }).eq('id', id)
  
  if (error) {
    console.error('[markAsRead]', error)
    return { success: false, errors: { _form: ['Erro ao marcar mensagem como lida'] } }
  }
  
  revalidatePath('/admin/mensagens')
  return { success: true, message: 'Mensagem marcada como lida' }
}

export async function markAllAsRead() {
  await requireAdmin()
  const supabase = createClient()
  const { error } = await supabase.from('messages').update({ is_read: true }).eq('is_read', false)
  
  if (error) {
    console.error('[markAllAsRead]', error)
    return { success: false, errors: { _form: ['Erro ao marcar todas as mensagens'] } }
  }
  
  revalidatePath('/admin/mensagens')
  return { success: true, message: 'Todas marcadas como lidas' }
}

export async function deleteMessage(id: string) {
  await requireAdmin()
  const supabase = createClient()
  const { error } = await supabase.from('messages').delete().eq('id', id)
  
  if (error) {
    console.error('[deleteMessage]', error)
    return { success: false, errors: { _form: ['Erro ao excluir mensagem'] } }
  }
  
  revalidatePath('/admin/mensagens')
  return { success: true, message: 'Mensagem excluída' }
}

const createMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string().optional(),
  message: z.string().min(1)
})

export async function createMessage(formData: FormData) {
  // This is used if admin creates a message? Or is this form used somewhere else?
  // We'll keep it as without requireAdmin just in case, but usually admins don't create messages.
  // Actually, wait, let's look at the old file, it didn't have requireAdmin. 
  // Let's add it only if it's admin. But wait, I'm creating a public contact action anyway.
  // We will leave this for admin just in case it's an admin replying or adding notes.
  
  const validation = createMessageSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject') || undefined,
    message: formData.get('message'),
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
    is_read: true // if admin creates it, maybe it's read
  })
  
  if (error) {
    console.error('[createMessage]', error)
    return { success: false, errors: { _form: ['Erro ao criar mensagem'] } }
  }
  
  revalidatePath('/admin/mensagens')
  return { success: true, message: 'Mensagem criada com sucesso!' }
}
