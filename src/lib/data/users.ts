import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type User = Database['public']['Tables']['users']['Row']
type Subscription = Database['public']['Tables']['subscriptions']['Row']
type Plan = Database['public']['Tables']['plans']['Row']

export type UserWithSubscription = User & {
  subscription?: (Subscription & { plan?: Plan }) | null
}

export async function getUsers(): Promise<UserWithSubscription[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      subscription:subscriptions(
        *,
        plan:plans(*)
      )
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getUsers]', error)
    return []
  }
  
  // Cada user pode ter múltiplas subscriptions; pegar a ativa mais recente
  return (data ?? []).map(u => {
    const subs = (u.subscription as unknown as (Subscription & { plan: Plan })[]) ?? []
    const active = subs.find(s => s.status === 'active') ?? subs[0] ?? null
    return { ...u, subscription: active }
  })
}

export async function getUserById(id: string): Promise<UserWithSubscription | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('users')
    .select(`
      *,
      subscription:subscriptions(
        *,
        plan:plans(*)
      )
    `)
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getUserById]', error)
    return null
  }
  
  const subs = (data.subscription as unknown as (Subscription & { plan: Plan })[]) ?? []
  const active = subs.find(s => s.status === 'active') ?? subs[0] ?? null
  return { ...data, subscription: active }
}
