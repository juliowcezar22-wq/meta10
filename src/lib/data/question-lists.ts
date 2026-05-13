import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type QuestionList = Database['public']['Tables']['question_lists']['Row']

export type QuestionListWithCount = QuestionList & { 
  question_count: number 
}

export async function getQuestionLists(): Promise<QuestionListWithCount[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('question_lists')
    .select(`
      *,
      questions(count)
    `)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getQuestionLists]', error)
    return []
  }
  
  return (data ?? []).map(list => {
    const countArr = list.questions as unknown as Array<{ count: number }>
    const count = countArr?.[0]?.count ?? 0
    const { questions: _questions, ...rest } = list
    return { ...rest, question_count: count } as QuestionListWithCount
  })
}

export async function getActiveQuestionLists(): Promise<QuestionListWithCount[]> {
  const lists = await getQuestionLists()
  return lists.filter(l => l.is_active)
}

export async function getQuestionListById(id: string): Promise<QuestionList | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('question_lists')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getQuestionListById]', error)
    return null
  }
  return data
}
