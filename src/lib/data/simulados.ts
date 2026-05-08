import { mockSimulados, mockSimuladoQuestions } from '@/lib/mocks/simulados'
import type { Simulado, SimuladoQuestion } from '@/lib/types/quiz'

export async function getSimulados(): Promise<Simulado[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('simulados').select('*').order('created_at', { ascending: false })
  // return data
  
  return mockSimulados
}

export async function getSimuladoById(id: string): Promise<Simulado | null> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('simulados').select('*').eq('id', id).single()
  // return data
  
  return mockSimulados.find(s => s.id === id) ?? null
}

export async function getSimuladoQuestions(simuladoId: string): Promise<SimuladoQuestion[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('simulado_questions').select('*, questions(*)').eq('simulado_id', simuladoId).order('ordem', { ascending: true })
  // return data
  
  return mockSimuladoQuestions.filter(sq => sq.simulado_id === simuladoId)
}
