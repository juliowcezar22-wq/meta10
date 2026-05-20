import { requireAuth } from '@/lib/auth/guards'
import { getMySuggestions } from '@/lib/data/suggestions'
import { SugestoesClient } from './sugestoes-client'

export const dynamic = 'force-dynamic'

export default async function SugestoesPage() {
  const session = await requireAuth()
  const suggestions = await getMySuggestions(session.profile.id)
  
  return <SugestoesClient suggestions={suggestions} />
}
