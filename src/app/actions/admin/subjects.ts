'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const subjectSchema = z.object({
  discipline: z.string().min(1, 'Disciplina é obrigatória'),
  name: z.string().min(1, 'Nome do assunto é obrigatório')
})

export async function createSubject(formData: FormData) {
  try {
    const supabase = createClient()
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado')

    const data = {
      discipline: formData.get('discipline') as string,
      name: formData.get('name') as string
    }

    const result = subjectSchema.safeParse(data)
    if (!result.success) {
      return { success: false, error: 'Dados inválidos', details: result.error.flatten() }
    }

    const { error } = await (supabase as any)
      .from('subjects')
      .insert({
        discipline: result.data.discipline,
        name: result.data.name,
        created_by: user.id
      })

    if (error) {
      console.error('[createSubject]', error)
      return { success: false, error: 'Erro ao cadastrar assunto' }
    }

    revalidatePath('/admin/assuntos')
    return { success: true }
  } catch (error: any) {
    console.error('[createSubject]', error)
    return { success: false, error: error.message || 'Erro interno' }
  }
}

export async function updateSubject(id: string, formData: FormData) {
  try {
    const supabase = createClient()
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado')

    const data = {
      discipline: formData.get('discipline') as string,
      name: formData.get('name') as string
    }

    const result = subjectSchema.safeParse(data)
    if (!result.success) {
      return { success: false, error: 'Dados inválidos', details: result.error.flatten() }
    }

    const { error } = await (supabase as any)
      .from('subjects')
      .update({
        discipline: result.data.discipline,
        name: result.data.name
      })
      .eq('id', id)

    if (error) {
      console.error('[updateSubject]', error)
      return { success: false, error: 'Erro ao atualizar assunto' }
    }

    revalidatePath('/admin/assuntos')
    return { success: true }
  } catch (error: any) {
    console.error('[updateSubject]', error)
    return { success: false, error: error.message || 'Erro interno' }
  }
}

export async function deleteSubject(id: string) {
  try {
    const supabase = createClient()
    
    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) throw new Error('Não autorizado')

    const { error } = await (supabase as any)
      .from('subjects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('[deleteSubject]', error)
      return { success: false, error: 'Erro ao excluir assunto. Pode estar em uso.' }
    }

    revalidatePath('/admin/assuntos')
    return { success: true }
  } catch (error: any) {
    console.error('[deleteSubject]', error)
    return { success: false, error: error.message || 'Erro interno' }
  }
}
