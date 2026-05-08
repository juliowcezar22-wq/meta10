import type { Simulado, SimuladoQuestion } from '@/lib/types/quiz'
import { mockQuestions } from './questions'

export const mockSimulados: Simulado[] = [
  {
    id: 'sim-1',
    name: 'Simulado ENEM Dia 1',
    subject: 'outros',
    duration_minutes: 330, // 5h30
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sim-2',
    name: 'Simulado de Matemática Básica',
    subject: 'matematica',
    duration_minutes: 120, // 2h
    is_active: true,
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'sim-3',
    name: 'Simulado de Ciências da Natureza',
    subject: 'ciencias',
    duration_minutes: 180, // 3h
    is_active: false,
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
  }
]

export const mockSimuladoQuestions: SimuladoQuestion[] = []

// Gerar relações mockadas para os simulados ativos
mockSimulados.filter(s => s.is_active).forEach((simulado) => {
  // Pegar 10 questões para cada simulado
  const selectedQuestions = mockQuestions.slice(0, 10)
  selectedQuestions.forEach((q, index) => {
    mockSimuladoQuestions.push({
      id: `sq-${simulado.id}-${q.id}`,
      simulado_id: simulado.id,
      question_id: q.id,
      ordem: index + 1
    })
  })
})
