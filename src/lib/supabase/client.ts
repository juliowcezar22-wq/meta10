import { createBrowserClient } from '@supabase/ssr'
import { Database } from './types'

/**
 * Cria e retorna um cliente Supabase configurado para Client Components.
 * Utiliza variáveis de ambiente públicas e armazena a sessão no browser.
 */
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
