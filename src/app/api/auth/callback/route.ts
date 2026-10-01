import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Aceita apenas caminhos internos (evita open redirect via ?next=)
  const nextParam = searchParams.get('next') ?? ''
  const next = nextParam.startsWith('/') && !nextParam.startsWith('//') && !nextParam.includes(':') && !nextParam.includes('\\')
    ? nextParam
    : '/aluno/dashboard'
  
  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Se falhar, manda de volta para o login com aviso
  return NextResponse.redirect(`${origin}/login?error=Invalid_code`)
}
