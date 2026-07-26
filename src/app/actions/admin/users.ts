'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth/guards'

const userRoleSchema = z.object({
  role: z.enum(['aluno', 'professor', 'admin'])
})

export async function updateRole(id: string, formData: FormData) {
  await requireAdmin()
  const validation = userRoleSchema.safeParse({
    role: formData.get('role'),
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  const supabase = createClient()
  const { error } = await supabase
    .from('users')
    .update({ role: validation.data.role })
    .eq('id', id)
    
  if (error) {
    console.error('[updateRole]', error)
    return { success: false, errors: { _form: ['Erro ao atualizar role'] } }
  }
  
  revalidatePath('/admin/usuarios')
  return { success: true, message: 'Role atualizada' }
}

const assignPlanSchema = z.object({
  planId: z.string().uuid('ID do plano inválido'),
  status: z.enum(['active', 'cancelled', 'expired']),
  expiresAt: z.string().nullable()
})

export async function assignPlan(userId: string, formData: FormData) {
  const adminUser = await requireAdmin()

  const planIdRaw = formData.get('planId') || formData.get('plan_id')

  const validation = assignPlanSchema.safeParse({
    planId: planIdRaw,
    status: formData.get('status') || 'active',
    expiresAt: (formData.get('expiresAt') as string) || null
  })

  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }

  const supabase = createClient()
  const { planId, status } = validation.data

  const { data: plan } = await supabase
    .from('plans')
    .select('id, name, duration_months')
    .eq('id', planId)
    .single()

  if (!plan) {
    return { success: false, errors: { _form: ['Plano não encontrado'] } }
  }

  // Plano Gratuito: sem data de fim, sempre ativo
  const isFree = plan.duration_months === 0

  if (!isFree && !validation.data.expiresAt) {
    return { success: false, errors: { expiresAt: ['Data de expiração obrigatória para planos pagos'] } }
  }

  const expiresAt = isFree ? null : validation.data.expiresAt
  const finalStatus = isFree ? 'active' : status

  const { data: activeSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single()

  let previousExpiresAt = activeSub?.expires_at ?? null

  if (activeSub) {
    const { error: updateError } = await supabase
      .from('subscriptions')
      .update({
        status: finalStatus,
        expires_at: expiresAt,
        plan_id: planId
      })
      .eq('id', activeSub.id)

    if (updateError) {
      console.error('[assignPlan] update', updateError)
      return { success: false, errors: { _form: ['Erro ao atualizar assinatura'] } }
    }
  } else {
    const { error: insertError } = await supabase
      .from('subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: finalStatus,
        expires_at: expiresAt
      })

    if (insertError) {
      console.error('[assignPlan] insert', insertError)
      return { success: false, errors: { _form: ['Erro ao criar assinatura'] } }
    }
  }

  const { error: logError } = await supabase.from('subscription_logs').insert({
    user_id: userId,
    admin_id: adminUser.profile.id,
    plan_id: planId,
    action: activeSub ? 'updated' : 'created',
    previous_expires_at: previousExpiresAt,
    new_expires_at: expiresAt,
    notes: 'Plano atribuído manualmente pelo admin'
  })

  if (logError) {
    console.error('[assignPlan] log', logError)
  }

  revalidatePath('/admin/usuarios')
  revalidatePath('/aluno', 'layout')
  return { success: true }
}
