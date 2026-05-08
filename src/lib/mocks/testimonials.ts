import type { Database } from '@/lib/supabase/types'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export const mockTestimonials: Testimonial[] = [
  ...Array.from({ length: 8 }).map((_, i) => ({
    id: `test-${i+1}`,
    author_name: `Aluno Aprovado ${i+1}`,
    text: `A Meta 10 mudou minha forma de estudar! Consegui passar graças aos resumos. Muito obrigado equipe. (Depoimento ${i+1})`,
    rating: 5,
    avatar_url: null,
    is_active: i < 6, // 6 ativos, 2 inativos
    created_at: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }))
]
