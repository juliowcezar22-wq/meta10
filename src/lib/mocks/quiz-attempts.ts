import type { QuizAttempt } from '@/lib/types/quiz'

export const mockQuizAttempts: QuizAttempt[] = [
  ...Array.from({ length: 20 }).map((_, i) => {
    const isFinished = i > 2 // as 3 primeiras estão em andamento
    return {
      id: `attempt-${i+1}`,
      user_id: 'user-2-aluno',
      simulado_id: i % 2 === 0 ? 'sim-1' : 'sim-2',
      started_at: new Date(Date.now() - (i+1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
      finished_at: isFinished ? new Date(Date.now() - (i+1) * 2 * 24 * 60 * 60 * 1000 + 120 * 60000).toISOString() : null,
      answers: (isFinished ? { 'q-1': 'a', 'q-2': 'c', 'q-3': 'e' } : { 'q-1': 'a' }) as Record<string, 'a'|'b'|'c'|'d'|'e'>,
      score: isFinished ? Math.floor(Math.random() * 10) + 1 : null,
      total_questions: 10,
      created_at: new Date(Date.now() - (i+1) * 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
  })
]
