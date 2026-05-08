import { mockMessages } from '@/lib/mocks/messages'
import type { Database } from '@/lib/supabase/types'

type Message = Database['public']['Tables']['messages']['Row']

export async function getMessages(): Promise<Message[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
  // return data
  
  return mockMessages
}

export async function getMessageById(id: string): Promise<Message | null> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('messages').select('*').eq('id', id).single()
  // return data
  
  return mockMessages.find(m => m.id === id) ?? null
}
