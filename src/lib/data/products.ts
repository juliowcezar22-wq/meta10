import { createClient } from '@/lib/supabase/server'
import type { Product } from '@/lib/types/product'

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getProducts]', error)
    return []
  }
  return (data ?? []) as Product[]
}

export async function getActiveProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getActiveProducts]', error)
    return []
  }
  return (data ?? []) as Product[]
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getProductById]', error)
    return null
  }
  return data as Product
}
