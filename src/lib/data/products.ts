import { mockProducts } from '@/lib/mocks/products'
import type { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']

export async function getProducts(): Promise<Product[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
  // return data
  
  return mockProducts
}

export async function getProductById(id: string): Promise<Product | null> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('products').select('*').eq('id', id).single()
  // return data
  
  return mockProducts.find(p => p.id === id) ?? null
}
