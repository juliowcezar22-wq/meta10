import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/lib/supabase/types'

type Testimonial = Database['public']['Tables']['testimonials']['Row']

export async function getTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getTestimonials]', error)
    return []
  }
  return data ?? []
}

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('[getActiveTestimonials]', error)
    return []
  }
  return data ?? []
}

export async function getTestimonialById(id: string): Promise<Testimonial | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('[getTestimonialById]', error)
    return null
  }
  return data
}
