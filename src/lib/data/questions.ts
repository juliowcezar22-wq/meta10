import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import type { Question } from '@/lib/types/quiz'

export async function getQuestionsByListId(listId: string): Promise<Question[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('list_id', listId)
    .eq('context' as any, 'simulado')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('[getQuestionsByListId]', error)
    return []
  }
  return (data ?? []) as unknown as Question[]
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
  return data as unknown as Question
}

export async function getStandaloneQuestionsBySubject(subject: string): Promise<Question[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('context' as any, 'avulsa')
    .eq('subject', subject)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('[getStandaloneQuestionsBySubject]', error)
    return []
  }
  return (data ?? []) as unknown as Question[]
}

export async function getStandaloneQuestionById(id: string): Promise<Question | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .eq('context' as any, 'avulsa')
    .single()
  
  if (error) {
    console.error('[getStandaloneQuestionById]', error)
    return null
  }
  return data as unknown as Question
}
