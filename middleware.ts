import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

/**
 * Middleware raiz do Next.js
 * Atualmente apenas gerencia o refresh de sessão do Supabase.
 */
export async function middleware(request: NextRequest) {
  return await updateSession(request)
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
