import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Middleware raiz do Next.js
 * Gerencia o refresh de sessão do Supabase e redirecionamento de usuários não autenticados.
 */
export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)

  const isProtectedRoute = request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/aluno')

  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas da aplicação, EXCETO:
     * - _next/static (arquivos estáticos e chunks)
     * - _next/image (arquivos otimizados de imagem)
     * - favicon.ico (ícone do site)
     * - extensões de imagem públicas (.svg, .png, .jpg, .jpeg, .gif, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
