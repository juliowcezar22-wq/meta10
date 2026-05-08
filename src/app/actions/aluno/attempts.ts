'use server'

import { z } from 'zod'

export async function startAttempt(listId: string) {
  console.log(`[MOCK] startAttempt ${listId}`)
  return { success: true, attemptId: `new-attempt-${Date.now()}` }
}

export async function submitAnswer(attemptId: string, questionId: string, answer: string) {
  console.log(`[MOCK] submitAnswer ${attemptId} ${questionId} ${answer}`)
  return { success: true }
}

export async function finishAttempt(attemptId: string) {
  console.log(`[MOCK] finishAttempt ${attemptId}`)
  return { success: true, score: 3, total: 5 }
}
