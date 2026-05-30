import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'
import type { Question } from '@/lib/types/quiz'

export async function getQuestionsByListId(listId: string): Promise<Question[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('list_id', listId)
    .eq('context', 'simulado')
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

export async function getStandaloneQuestionsBySubject(subject: string, subjectId?: string): Promise<Question[]> {
  const supabase = createClient()
  let query = supabase
    .from('questions')
    .select('*')
    .eq('context', 'avulsa')
    .eq('subject', subject)
    
  if (subjectId) {
    query = query.eq('subject_id', subjectId)
  }

  const { data, error } = await query.order('created_at', { ascending: true })
  
  if (error) {
    console.error('[getStandaloneQuestionsBySubject]', error)
    return []
  }
  return data ?? []
}

export async function getStandaloneQuestionById(id: string): Promise<Question | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .eq('context', 'avulsa')
    .single()
  
  if (error) {
    console.error('[getStandaloneQuestionById]', error)
    return null
  }
  return data
}

export async function getAllStandaloneQuestions(): Promise<Question[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('context', 'avulsa')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getAllStandaloneQuestions]', error)
    return []
  }
  return data ?? []
}
