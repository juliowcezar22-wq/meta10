import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Material = Database['public']['Tables']['materials']['Row']

export async function getMaterials(): Promise<Material[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getMaterials]', error)
    return []
  }
  return data ?? []
}

export async function getMaterialsByType(type: string): Promise<Material[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getMaterialsByType]', error)
    return []
  }
  return data ?? []
}

export async function getMaterialById(id: string): Promise<Material | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getMaterialById]', error)
    return null
  }
  return data
}
