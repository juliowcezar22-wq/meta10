import { mockMaterials } from '@/lib/mocks/materials'
import type { Database } from '@/lib/supabase/types'

type Material = Database['public']['Tables']['materials']['Row']

export async function getMaterials(): Promise<Material[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('materials').select('*').order('created_at', { ascending: false })
  // return data
  
  return mockMaterials
}

export async function getMaterialById(id: string): Promise<Material | null> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('materials').select('*').eq('id', id).single()
  // return data
  
  return mockMaterials.find(m => m.id === id) ?? null
}
