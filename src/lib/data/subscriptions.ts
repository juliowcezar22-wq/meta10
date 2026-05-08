import { mockSubscriptions } from '@/lib/mocks/subscriptions'
import type { Database } from '@/lib/supabase/types'

type Subscription = Database['public']['Tables']['subscriptions']['Row']

export async function getSubscriptionsByUser(userId: string): Promise<Subscription[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('subscriptions').select('*').eq('user_id', userId)
  // return data
  
  return mockSubscriptions.filter(s => s.user_id === userId)
}
