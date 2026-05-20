'use server'

import { createClient } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/auth/guards'
import { revalidatePath } from 'next/cache'

export async function deleteSuggestion(suggestionId: string) {
  await requireAdmin()
  
  const supabase = createClient()
  const { error } = await supabase
    // TODO: remover as any após regen dos tipos
    .from('suggestions' as any)
    .delete()
    .eq('id', suggestionId)
  
  if (error) {
    console.error('[deleteSuggestion]', error)
    return { success: false, errors: { _form: [error.message] } }
  }
  
  revalidatePath('/admin/sugestoes')
  return { success: true }
}
