import { mockQuizAttempts } from '@/lib/mocks/quiz-attempts'
import type { QuizAttempt } from '@/lib/types/quiz'

export async function getAttempts(): Promise<QuizAttempt[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('quiz_attempts').select('*').order('created_at', { ascending: false })
  // return data
  
  return mockQuizAttempts
}

export async function getAttemptsByUser(userId: string): Promise<QuizAttempt[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('quiz_attempts').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  // return data
  
  return mockQuizAttempts.filter(a => a.user_id === userId)
}

export async function getAttemptById(id: string): Promise<QuizAttempt | null> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('quiz_attempts').select('*').eq('id', id).single()
  // return data
  
  return mockQuizAttempts.find(a => a.id === id) ?? null
}
