import { hasActiveSubscription } from '@/lib/data/subscriptions'
import ResumosClient from './resumos-client'

export default async function ResumosPage() {
  const hasSub = await hasActiveSubscription()
  return <ResumosClient hasSubscription={hasSub} />
}
