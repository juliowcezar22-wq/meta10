'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireAuth } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

const suggestionSchema = z.object({
  content: z.string()
    .min(10, 'A sugestão deve ter no mínimo 10 caracteres')
    .max(2000, 'A sugestão não pode ultrapassar 2000 caracteres'),
})

export async function createSuggestion(formData: FormData) {
  const session = await requireAuth()
  
  const validation = suggestionSchema.safeParse({
    content: formData.get('content'),
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  const supabase = createClient()
  const { error } = await supabase
    // TODO: remover as any após regen dos tipos
    .from('suggestions' as any)
    .insert({
      user_id: session.profile.id,
      content: validation.data.content,
    })
  
  if (error) {
    console.error('[createSuggestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath('/aluno/sugestoes')
  revalidatePath('/admin/sugestoes')
  return { success: true }
}
