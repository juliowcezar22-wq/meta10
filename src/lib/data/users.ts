import { mockUsers } from '@/lib/mocks/users'
import type { Database } from '@/lib/supabase/types'

type User = Database['public']['Tables']['users']['Row']
type UserWithSubscription = User & { plan_name?: string; plan_status?: string; expires_at?: string }

export async function getUsers(): Promise<UserWithSubscription[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('users').select(`
  //   *,
  //   subscriptions ( status, expires_at, plans ( name ) )
  // `)
  // return data
  
  return mockUsers.map(u => ({ ...u, plan_name: 'Anual', plan_status: 'active' }))
}

export async function getUserById(id: string): Promise<UserWithSubscription | null> {
  // REAL:
  // const supabase = createClient()
  // const { data } = await supabase.from('users').select('*').eq('id', id).single()
  // return data
  
  return mockUsers.find(u => u.id === id) ?? null
}
