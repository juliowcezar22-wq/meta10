'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdminOrProfessor } from '@/lib/auth/guards'

const materialSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  type: z.string().min(1),
  subject: z.string().optional(),
  file_url: z.string().url(),
  is_free: z.boolean().default(false),
})

// Regra de negócio: estes tipos são vendidos avulsos na loja e
// nunca podem ser marcados como gratuitos nem liberados por plano.
const PAID_ONLY_TYPES = ['atividade_pdf', 'resumo', 'mapa_mental', 'jogo']

function enforcePaidOnly(data: z.infer<typeof materialSchema>) {
  return PAID_ONLY_TYPES.includes(data.type) ? { ...data, is_free: false } : data
}

export async function createMaterial(formData: FormData) {
  await requireAdminOrProfessor()
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
  
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const materialData = enforcePaidOnly(validation.data)

  const { error } = await supabase.from('materials').insert({
    title: materialData.title,
    description: materialData.description,
    type: materialData.type,
    subject: materialData.subject,
    file_url: materialData.file_url,
    is_free: materialData.is_free,
    created_by: user?.id,
  })
  
  if (error) {
    console.error('[createMaterial]', error)
    return { success: false, errors: { _form: [error.message || 'Erro ao criar material'] } }
  }
  
  revalidatePath('/admin/mapas-mentais')
  revalidatePath('/admin/resumos')
  revalidatePath('/admin/atividades-pdf')
  revalidatePath('/admin/jogos-pedagogicos')
  revalidatePath('/aluno/materiais')
  return { success: true, message: 'Material criado com sucesso' }
}

export async function updateMaterial(id: string, formData: FormData) {
  await requireAdminOrProfessor()
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
  
  const supabase = createClient()
  const materialData = enforcePaidOnly(validation.data)
  const { error } = await supabase
    .from('materials')
    .update({
      title: materialData.title,
      description: materialData.description,
      type: materialData.type,
      subject: materialData.subject,
      file_url: materialData.file_url,
      is_free: materialData.is_free,
    })
    .eq('id', id)
    
  if (error) {
    console.error('[updateMaterial]', error)
    return { success: false, errors: { _form: [error.message || 'Erro ao atualizar material'] } }
  }
  
  revalidatePath('/admin/mapas-mentais')
  revalidatePath('/admin/resumos')
  revalidatePath('/admin/atividades-pdf')
  revalidatePath('/admin/jogos-pedagogicos')
  revalidatePath('/aluno/materiais')
  return { success: true, message: 'Material atualizado' }
}

export async function deleteMaterial(id: string) {
  await requireAdminOrProfessor()
  const supabase = createClient()
  const { error } = await supabase.from('materials').delete().eq('id', id)
  
  if (error) {
    console.error('[deleteMaterial]', error)
    return { success: false, errors: { _form: [error.message || 'Erro ao deletar material'] } }
  }
  
  revalidatePath('/admin/mapas-mentais')
  revalidatePath('/admin/resumos')
  revalidatePath('/admin/atividades-pdf')
  revalidatePath('/admin/jogos-pedagogicos')
  revalidatePath('/aluno/materiais')
  return { success: true, message: 'Material deletado' }
}
