'use server'

import { createDiscipline as dbCreateDiscipline, updateDiscipline as dbUpdateDiscipline, deleteDiscipline as dbDeleteDiscipline, Discipline } from '@/lib/data/disciplines'

export async function createDiscipline(data: Omit<Discipline, 'created_at'>) {
  await dbCreateDiscipline(data)
  return { success: true }
}

export async function updateDiscipline(slug: string, data: Partial<Discipline>) {
  await dbUpdateDiscipline(slug, data)
  return { success: true }
}

export async function deleteDiscipline(slug: string) {
  await dbDeleteDiscipline(slug)
  return { success: true }
}
