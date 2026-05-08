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

export type DifficultyLevel = 'facil' | 'medio' | 'dificil'

export interface Question {
  id: string
  enunciado: string
  alternativa_a: string
  alternativa_b: string
  alternativa_c: string
  alternativa_d: string
  alternativa_e: string
  gabarito: 'a' | 'b' | 'c' | 'd' | 'e'
  comentario: string | null
  subject: Subject
  difficulty: DifficultyLevel
  created_at: string
  updated_at: string
}

export interface Simulado {
  id: string
  name: string
  subject: Subject
  duration_minutes: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SimuladoQuestion {
  id: string
  simulado_id: string
  question_id: string
  ordem: number
}

export interface QuizAttempt {
  id: string
  user_id: string
  simulado_id: string
  started_at: string
  finished_at: string | null
  answers: Record<string, 'a' | 'b' | 'c' | 'd' | 'e'>
  score: number | null
  total_questions: number | null
  created_at: string
}
