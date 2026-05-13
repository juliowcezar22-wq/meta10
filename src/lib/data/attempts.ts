import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Attempt = Database['public']['Tables']['attempts']['Row']
type User = Database['public']['Tables']['users']['Row']

export type AttemptWithUser = Attempt & {
  user: Pick<User, 'id' | 'nome' | 'email'> | null
}

export async function getAttemptsByListId(listId: string): Promise<AttemptWithUser[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attempts')
    .select(`
      *,
      user:users(id, nome, email)
    `)
    .eq('list_id', listId)
    .not('finished_at', 'is', null)
    .order('finished_at', { ascending: false })
  
  if (error) {
    console.error('[getAttemptsByListId]', error)
    return []
  }
  return (data ?? []) as AttemptWithUser[]
}

export async function getAttemptsByUserId(userId: string): Promise<Attempt[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getAttemptsByUserId]', error)
    return []
  }
  return data ?? []
}

export async function getAttemptById(id: string): Promise<Attempt | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('attempts')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getAttemptById]', error)
    return null
  }
  return data
}
