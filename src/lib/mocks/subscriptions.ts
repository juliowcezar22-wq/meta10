import type { Database } from '@/lib/supabase/types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-1',
    user_id: 'user-2-aluno',
    plan_id: 'plan-3-anual',
    status: 'active',
    expires_at: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled_at: null,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sub-2',
    user_id: 'user-3-aluno',
    plan_id: 'plan-1-mensal',
    status: 'expired',
    expires_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled_at: null,
    created_at: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'sub-3',
    user_id: 'user-4-aluno',
    plan_id: 'plan-2-semestral',
    status: 'active',
    expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    cancelled_at: null,
    created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
]
