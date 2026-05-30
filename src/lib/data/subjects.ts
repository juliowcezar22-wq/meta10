import { createClient } from '@/lib/supabase/server'

export interface Subject {
  id: string
  discipline: string
  name: string
  created_at: string
  created_by: string | null
}

export async function getAllSubjects(): Promise<Subject[]> {
  const supabase = createClient()
  // Utilizando any temporário até os tipos do DB serem gerados após a migração
  const { data, error } = await (supabase as any)
    .from('subjects')
    .select('*')
    .order('discipline')
    .order('name')
    
  if (error) {
    console.error('[getAllSubjects]', error)
    return []
  }
  
  return data as Subject[]
}

export async function getSubjectsByDiscipline(discipline: string): Promise<Subject[]> {
  if (!discipline) return []
  
  const supabase = createClient()
  const { data, error } = await (supabase as any)
    .from('subjects')
    .select('*')
    .eq('discipline', discipline)
    .order('name')
    
  if (error) {
    console.error('[getSubjectsByDiscipline]', error)
    return []
  }
  
  return data as Subject[]
}

export async function getSubject(id: string): Promise<Subject | null> {
  const supabase = createClient()
  const { data, error } = await (supabase as any)
    .from('subjects')
    .select('*')
    .eq('id', id)
    .single()
    
  if (error) {
    console.error('[getSubject]', error)
    return null
  }
  
  return data as Subject
}
