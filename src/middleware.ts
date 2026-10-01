import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Middleware do Next.js (precisa viver em src/ neste projeto).
 * Renova a sessão do Supabase e redireciona não autenticados.
 * Roda APENAS nas rotas que usam sessão: o site público não paga
 * uma chamada ao Supabase por request (e fica imune a lentidão/
 * timeout do Auth — causa do 504 MIDDLEWARE_INVOCATION_TIMEOUT).
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)

  if (!user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: ['/admin/:path*', '/aluno/:path*'],
}
