import { hasActiveSubscription } from '@/lib/data/subscriptions'
import MapasMentaisClient from './mapas-mentais-client'

export default async function MapasMentaisPage() {
  const hasSub = await hasActiveSubscription()
  return <MapasMentaisClient hasSubscription={hasSub} />
}
