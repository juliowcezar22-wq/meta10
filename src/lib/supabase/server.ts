import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { Database } from './types'

/**
 * Cria e retorna um cliente Supabase configurado para Server Components,
 * Route Handlers e Server Actions, gerenciando cookies corretamente.
 */
export function createClient() {
  const cookieStore = cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // O catch ocorre em Server Components porque não podem alterar cookies.
            // Ignorar é seguro, pois se tivermos que setar, ocorrerá em actions/handlers.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Ignorar pelos mesmos motivos do método set.
          }
        },
      },
    }
  )
}
