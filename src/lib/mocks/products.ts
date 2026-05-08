import type { Database } from '@/lib/supabase/types'

type Product = Database['public']['Tables']['products']['Row']

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Combo Matemática ENEM',
    description: 'Apostilas completas + simulados de matemática.',
    price: 97.00,
    hotmart_link: 'https://pay.hotmart.com/1',
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-2',
    name: 'Redação Nota 1000',
    description: 'Guia definitivo para a redação do ENEM.',
    price: 47.90,
    hotmart_link: 'https://pay.hotmart.com/2',
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'prod-3',
    name: 'Mentoria Vip',
    description: 'Acompanhamento individual mensal.',
    price: 297.00,
    hotmart_link: 'https://pay.hotmart.com/3',
    image_url: null,
    is_active: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  ...Array.from({ length: 3 }).map((_, i) => ({
    id: `prod-${i+4}`,
    name: `Produto Mock ${i+4}`,
    description: `Descrição gerada para o produto ${i+4}`,
    price: 19.90 * (i+1),
    hotmart_link: `https://pay.hotmart.com/${i+4}`,
    image_url: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }))
]
