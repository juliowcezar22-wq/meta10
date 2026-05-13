import { requireAdmin } from '@/lib/auth/guards'
import { getMessages } from '@/lib/data/messages'
import { MensagensClient } from './mensagens-client'

export default async function MensagensPage() {
  await requireAdmin()
  const messages = await getMessages()

  return <MensagensClient initialData={messages} />
}
