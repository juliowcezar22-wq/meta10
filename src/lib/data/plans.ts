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
