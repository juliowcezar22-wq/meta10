import { mockPlans } from '@/lib/mocks/plans'
import type { Database } from '@/lib/supabase/types'

type Plan = Database['public']['Tables']['plans']['Row']

export async function getPlans(): Promise<Plan[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('plans').select('*')
  // return data
  
  return mockPlans
}
