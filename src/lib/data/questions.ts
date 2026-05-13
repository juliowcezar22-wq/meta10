import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Question = Database['public']['Tables']['questions']['Row']

export async function getQuestionsByListId(listId: string): Promise<Question[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('list_id', listId)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('[getQuestionsByListId]', error)
    return []
  }
  return data ?? []
}

export async function getQuestionById(id: string): Promise<Question | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getQuestionById]', error)
    return null
  }
  return data
}
