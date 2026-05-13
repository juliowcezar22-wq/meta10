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

export type Question = Database['public']['Tables']['questions']['Row']

export type QuestionListItem = Database['public']['Tables']['question_list_items']['Row']

export type Attempt = Database['public']['Tables']['attempts']['Row']
