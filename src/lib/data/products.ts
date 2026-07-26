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

export interface ProductFilters {
  materialType?: string
  subject?: string
}

export const STORE_PAGE_SIZE = 12

export interface StoreSearchParams {
  q?: string
  materialType?: string
  subject?: string
  subjectId?: string
  page?: number
}

export interface StoreSearchResult {
  products: Product[]
  count: number
  page: number
  totalPages: number
}

// Busca da loja: filtros combinados + texto parcial (ilike) + paginação,
// tudo resolvido no servidor pelo Supabase.
export async function searchProducts(params: StoreSearchParams): Promise<StoreSearchResult> {
  const supabase = createClient()
  const page = Math.max(1, params.page ?? 1)
  const from = (page - 1) * STORE_PAGE_SIZE

  let query = supabase
    .from('products')
    .select('*', { count: 'exact' })
    .eq('is_active', true)

  if (params.materialType) query = query.eq('material_type', params.materialType)
  if (params.subject) query = query.eq('subject', params.subject)
  if (params.subjectId) query = query.eq('subject_id', params.subjectId)
  if (params.q) {
    const sanitized = params.q.replace(/[%_,()]/g, ' ').trim()
    if (sanitized) {
      query = query.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`)
    }
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(from, from + STORE_PAGE_SIZE - 1)

  if (error) {
    console.error('[searchProducts]', error)
    return { products: [], count: 0, page: 1, totalPages: 1 }
  }

  const total = count ?? 0
  return {
    products: (data ?? []) as Product[],
    count: total,
    page,
    totalPages: Math.max(1, Math.ceil(total / STORE_PAGE_SIZE)),
  }
}

export async function getActiveProducts(filters?: ProductFilters): Promise<Product[]> {
  const supabase = createClient()
  let query = supabase
    .from('products')
    .select('*')
    .eq('is_active', true)

  if (filters?.materialType) {
    query = query.eq('material_type', filters.materialType)
  }
  if (filters?.subject) {
    query = query.eq('subject', filters.subject)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

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
