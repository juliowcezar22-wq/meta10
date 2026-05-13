import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

export async function getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getSubscriptionsByUser]', error)
    return []
  }
  return data ?? []
}

type Plan = Database['public']['Tables']['plans']['Row']

export type SubscriptionWithPlan = Subscription & { plan: Plan | null }

export async function getCurrentSubscription(): Promise<SubscriptionWithPlan | null> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  
  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      *,
      plan:plans(*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  
  if (error) {
    console.error('[getCurrentSubscription]', error)
    return null
  }
  
  return data as SubscriptionWithPlan | null
}

export async function hasActiveSubscription(): Promise<boolean> {
  const sub = await getCurrentSubscription()
  return sub !== null
}
