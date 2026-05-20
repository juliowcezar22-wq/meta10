import type { Database } from '@/lib/supabase/types'

export type Subject = 
  | 'matematica'
  | 'portugues'
  | 'historia'
  | 'geografia'
  | 'ciencias'
  | 'ingles'
  | 'fisica'
  | 'quimica'
  | 'biologia'
  | 'outros'

export type DifficultyLevel = Database['public']['Enums']['difficulty_level']

export type QuestionList = Database['public']['Tables']['question_lists']['Row']

export type QuestionType = 'multipla_escolha' | 'verdadeiro_falso'
export type QuestionContext = 'simulado' | 'avulsa'

export interface Alternative {
  letra: string  // 'a', 'b', 'c', 'd', 'e'
  texto: string
}

export type Question = Omit<Database['public']['Tables']['questions']['Row'], 'alternativa_a' | 'alternativa_b' | 'alternativa_c' | 'alternativa_d' | 'alternativa_e' | 'list_id'> & {
  list_id: string | null
  question_type: QuestionType
  context: QuestionContext
  alternatives: any
}

export type QuestionListItem = Database['public']['Tables']['question_list_items']['Row']

export type Attempt = Database['public']['Tables']['attempts']['Row']
