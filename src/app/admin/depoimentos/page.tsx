import { requireAdmin } from '@/lib/auth/guards'
import { getTestimonials } from '@/lib/data/testimonials'
import { DepoimentosClient } from './depoimentos-client'

export default async function DepoimentosPage() {
  await requireAdmin()
  const testimonials = await getTestimonials()

  return <DepoimentosClient initialData={testimonials} />
}
