import { mockAttempts } from '@/lib/mocks/attempts'
import type { Attempt } from '@/lib/types/quiz'

export async function getAttemptsByUserId(userId: string): Promise<Attempt[]> {
  return mockAttempts.filter(a => a.user_id === userId)
}

export async function createAttempt(userId: string, listId: string): Promise<string> {
  return `new-attempt-${Date.now()}`
}

export async function submitAttempt(attemptId: string, answers: Record<string, 'a' | 'b' | 'c' | 'd' | 'e'>): Promise<{ score: number, total: number }> {
  return { score: Math.floor(Math.random() * 5), total: 5 }
}
