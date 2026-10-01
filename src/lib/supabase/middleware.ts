import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Limites de rede do middleware: nenhuma chamada ao Supabase pode
// segurar a request além disso (o retry interno do auth-js, sem teto,
// já causou 504 MIDDLEWARE_INVOCATION_TIMEOUT em produção).
const FETCH_TIMEOUT_MS = 5000
const TOTAL_TIMEOUT_MS = 8000

/**
 * Atualiza a sessão e faz refresh de tokens expirados.
 * Em falha ou lentidão, degrada para "sem usuário" (a rota protegida
 * manda para /login e os guards das páginas revalidam) em vez de
 * derrubar a request.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: {
        fetch: (url, init) =>
          fetch(url, { ...init, signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) }),
      },
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  try {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('updateSession timeout')), TOTAL_TIMEOUT_MS)
    )
    const { data: { user } } = await Promise.race([supabase.auth.getUser(), timeout])
    return { response, user }
  } catch (error) {
    console.error('[middleware updateSession]', error instanceof Error ? error.message : error)
    return { response, user: null }
  }
}
