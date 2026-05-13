import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['messages']['Row']

export async function getMessages(): Promise<Message[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getMessages]', error)
    return []
  }
  return data ?? []
}

export async function getUnreadMessagesCount(): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false)
  
  if (error) {
    console.error('[getUnreadMessagesCount]', error)
    return 0
  }
  return count ?? 0
}

export async function getMessageById(id: string): Promise<Message | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getMessageById]', error)
    return null
  }
  return data
}
