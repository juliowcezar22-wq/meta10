import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Plan = Database['public']['Tables']['plans']['Row']

export async function getPlans(): Promise<Plan[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('duration_months', { ascending: true })

  if (error) {
    console.error('[getPlans]', error)
    return []
  }
  return data ?? []
}

// Apenas planos ofertáveis (exclui extintos como o Semestral)
export async function getActivePlans(): Promise<Plan[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .eq('is_active', true)
    .order('duration_months', { ascending: true })

  if (error) {
    console.error('[getActivePlans]', error)
    return []
  }
  return data ?? []
}
