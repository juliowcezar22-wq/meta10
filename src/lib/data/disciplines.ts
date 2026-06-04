import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Discipline = {
  slug: string
  name: string
  icon: string | null
  color: string | null
  order_index: number
  created_at: string
}

export async function getDisciplines(): Promise<Discipline[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('disciplines')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.error('[getDisciplines]', error)
    return []
  }
  return data as Discipline[]
}

export async function getDisciplinesGrid() {
  const disciplines = await getDisciplines()
  return disciplines.map(d => ({
    id: d.slug,
    slug: d.slug,
    title: d.name,
    iconName: d.icon || 'BookOpen',
    color: d.color || 'blue-600'
  }))
}

export async function getDisciplineBySlug(slug: string): Promise<Discipline | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('disciplines')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('[getDisciplineBySlug]', error)
    return null
  }
  return data as Discipline
}

export async function createDiscipline(data: Omit<Discipline, 'created_at'>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('disciplines')
    .insert([data])

  if (error) {
    console.error('[createDiscipline]', error)
    throw new Error('Failed to create discipline')
  }

  revalidatePath('/admin/disciplinas')
  revalidatePath('/aluno/dashboard')
}

export async function updateDiscipline(slug: string, data: Partial<Discipline>) {
  const supabase = createClient()
  const { error } = await supabase
    .from('disciplines')
    .update(data)
    .eq('slug', slug)

  if (error) {
    console.error('[updateDiscipline]', error)
    throw new Error('Failed to update discipline')
  }

  revalidatePath('/admin/disciplinas')
  revalidatePath('/aluno/dashboard')
}

export async function deleteDiscipline(slug: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('disciplines')
    .delete()
    .eq('slug', slug)

  if (error) {
    console.error('[deleteDiscipline]', error)
    throw error
  }

  revalidatePath('/admin/disciplinas')
  revalidatePath('/aluno/dashboard')
}
