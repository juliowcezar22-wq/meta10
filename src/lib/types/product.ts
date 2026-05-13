import type { Database } from '@/lib/supabase/types'

export type Product = Omit<Database['public']['Tables']['products']['Row'], 'tipo'> & {
  tipo: 'gratuito' | 'pago'
}
