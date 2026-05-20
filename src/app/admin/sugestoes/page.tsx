import { requireAdmin } from '@/lib/auth/guards'
import { getAllSuggestions } from '@/lib/data/suggestions'
import { SugestoesAdminClient } from './sugestoes-admin-client'

export const dynamic = 'force-dynamic'

export default async function AdminSugestoesPage() {
  await requireAdmin()
  const suggestions = await getAllSuggestions()
  
  return <SugestoesAdminClient suggestions={suggestions} />
}
