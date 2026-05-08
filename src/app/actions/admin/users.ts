'use server'

import { z } from 'zod'

const userRoleSchema = z.object({
  role: z.enum(['aluno', 'professor', 'admin'])
})

export async function updateRole(id: string, formData: FormData) {
  const validation = userRoleSchema.safeParse({
    role: formData.get('role'),
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }
  
  // MOCK: log + sucesso simulado
  console.log(`[MOCK] updateRole for user ${id}`, validation.data)
  return { success: true, message: 'Role atualizada (mock)' }
}

const assignPlanSchema = z.object({
  plan_id: z.string().min(1),
  duration_months: z.number().positive(),
})

export async function assignPlan(userId: string, formData: FormData) {
  const validation = assignPlanSchema.safeParse({
    plan_id: formData.get('plan_id'),
    duration_months: Number(formData.get('duration_months')),
  })
  
  if (!validation.success) {
    return { success: false, errors: validation.error.flatten().fieldErrors }
  }

  // MOCK
  console.log(`[MOCK] assignPlan to user ${userId}`, validation.data)
  return { success: true, message: 'Plano atribuído (mock)' }
}
