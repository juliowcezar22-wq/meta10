import { hasActiveSubscription } from '@/lib/data/subscriptions'
import PdfsClient from './pdfs-client'

export default async function PdfsPage() {
  const hasSub = await hasActiveSubscription()
  return <PdfsClient hasSubscription={hasSub} />
}
