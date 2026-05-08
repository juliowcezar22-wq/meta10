import type { Database } from '@/lib/supabase/types'

type ProductBase = Omit<Database['public']['Tables']['products']['Row'], 'hotmart_link'>

export type Product = ProductBase & {
  hotmart_link: string | null
  tipo: 'gratuito' | 'pago'
  arquivo_url: string | null
}
