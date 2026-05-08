'use client'

import { useState, useEffect, Suspense } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react'
import { loginAction, getRedirectTargetIfLoggedIn } from '@/app/actions/auth'
import { useSearchParams, useRouter } from 'next/navigation'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full !py-3.5 !text-base justify-center disabled:opacity-70">
      {pending ? 'Entrando...' : 'Entrar'}
    </button>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [redirectTo, setRedirectTo] = useState('')
  const [checking, setChecking] = useState(true)
  
  useEffect(() => {
    setRedirectTo(searchParams.get('redirect') ?? '')
  }, [searchParams])

  useEffect(() => {
    getRedirectTargetIfLoggedIn().then(({ path }) => {
      if (path) {
        router.push(path)
      } else {
        setChecking(false)
      }
    })
  }, [router])

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '' })
  
  const [state, formAction] = useFormState(loginAction, { success: false })
  if (checking) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center bg-mesh px-4">
        <div className="text-surface-400 font-medium animate-pulse text-lg">Carregando...</div>
      </section>
    )
  }

  return (
    <section className="min-h-[100dvh] flex items-center justify-center bg-mesh px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <div className="w-3 h-3 rounded-full bg-purple" />
              <div className="w-3 h-3 rounded-full bg-success-500" />
            </div>
            <span className="text-xl font-bold ml-1">
              <span className="text-surface-400">Meta</span>
              <span className="text-danger"> 10</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-surface-900">Entrar na sua conta</h1>
          <p className="text-surface-400 mt-1 text-sm">Acesse seus materiais de estudo</p>
        </div>

        <div className="card p-8 !rounded-3xl">
          <form action={formAction} className="space-y-5" noValidate>
            <input type="hidden" name="redirect" value={redirectTo} />
            {state.error && (
              <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg">
                {state.error}
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input
                  type="email" id="email" name="email" value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input-base !pl-11 ${state.errors?.email ? '!border-danger-500 !ring-danger-500/20' : ''}`}
                  placeholder="seu@email.com" autoComplete="email"
                />
              </div>
              {state.errors?.email && <p className="text-danger text-xs mt-1.5 ml-1">{state.errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input
                  type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`input-base !pl-11 !pr-11 ${state.errors?.password ? '!border-danger-500 !ring-danger-500/20' : ''}`}
                  placeholder="Sua senha" autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors" aria-label={showPassword ? 'Ocultar' : 'Mostrar'}>
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {state.errors?.password && <p className="text-danger text-xs mt-1.5 ml-1">{state.errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-surface-500 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-surface-300 text-primary focus:ring-primary/20" />
                Lembrar-me
              </label>
              <Link href="/recuperar-senha" className="text-sm text-primary hover:text-primary-600 font-medium">Esqueci minha senha</Link>
            </div>
            <SubmitButton />
          </form>

          <div className="mt-6 pt-6 border-t border-surface-100 text-center">
            <p className="text-sm text-surface-500">
              Não tem conta?{' '}
              <Link href="/cadastro" className="text-primary font-semibold hover:text-primary-600">Criar conta</Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[100dvh] flex items-center justify-center text-surface-400">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  )
}
