import { mockTestimonials } from '@/lib/mocks/testimonials'
import type { Database } from '@/lib/supabase/types'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export async function getTestimonials(): Promise<Testimonial[]> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
  // return data
  
  return mockTestimonials
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  // REAL: 
  // const supabase = createClient()
  // const { data } = await supabase.from('testimonials').select('*').eq('id', id).single()
  // return data
  
  return mockTestimonials.find(t => t.id === id) ?? null
}
