import type { Database } from '@/lib/supabase/types'

type Plan = Database['public']['Tables']['plans']['Row']

export const mockPlans: Plan[] = [
  {
    id: 'plan-1-mensal',
    name: 'Mensal',
    duration_months: 1,
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'plan-2-semestral',
    name: 'Semestral',
    duration_months: 6,
    created_at: new Date('2024-01-01').toISOString(),
  },
  {
    id: 'plan-3-anual',
    name: 'Anual',
    duration_months: 12,
    created_at: new Date('2024-01-01').toISOString(),
  }
]
