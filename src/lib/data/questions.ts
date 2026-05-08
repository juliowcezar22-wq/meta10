import { mockQuestions } from '@/lib/mocks/questions'
import type { Question } from '@/lib/types/quiz'

export async function getQuestions(): Promise<Question[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('questions').select('*').order('created_at', { ascending: false })
  // return data
  
  return mockQuestions
}

export async function getQuestionById(id: string): Promise<Question | null> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('questions').select('*').eq('id', id).single()
  // return data
  
  return mockQuestions.find(q => q.id === id) ?? null
}
