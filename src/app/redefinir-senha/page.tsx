'use client'

import { useState, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Eye, EyeOff, Lock, CheckCircle } from 'lucide-react'
import { updatePasswordAction } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full !py-3.5 !text-base justify-center disabled:opacity-70">
      {pending ? 'Redefinindo...' : 'Redefinir senha'}
    </button>
  )
}

export default function RedefinirSenhaPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [checking, setChecking] = useState(true)
  const [sessionError, setSessionError] = useState('')
  
  const [state, formAction] = useFormState(updatePasswordAction, { success: false })

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setSessionError('Sessão expirada. Solicite uma nova recuperação de senha.')
      }
      setChecking(false)
    }
    checkSession()
  }, [])

  const getStrength = (pass: string) => {
    if (pass.length === 0) return { level: 0, label: '', color: '' }
    if (pass.length < 6) return { level: 1, label: 'Fraca', color: 'bg-danger-500' }
    if (pass.length < 8) return { level: 2, label: 'Média', color: 'bg-amber-400' }
    return { level: 3, label: 'Forte', color: 'bg-success-500' }
  }

  const strength = getStrength(formData.password)

  if (checking) return null

  if (sessionError) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center bg-mesh px-4 py-16">
        <div className="card p-10 text-center max-w-sm mx-auto !rounded-3xl">
          <h2 className="text-xl font-bold text-danger mb-2">Erro</h2>
          <p className="text-surface-500 text-sm mb-6">{sessionError}</p>
          <Link href="/recuperar-senha" className="btn-primary w-full justify-center">Recuperar senha</Link>
        </div>
      </section>
    )
  }

  if (state.success) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center bg-mesh px-4 py-16">
        <div className="card p-10 text-center max-w-sm mx-auto !rounded-3xl animate-scale-in">
          <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-xl font-extrabold text-surface-900 mb-2">Senha alterada!</h2>
          <p className="text-surface-500 text-sm mb-6">
            Sua senha foi redefinida com sucesso. Você já pode acessar sua conta.
          </p>
          <Link href="/login" className="btn-primary w-full justify-center">
            Ir para o Login
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[100dvh] flex items-center justify-center bg-mesh px-4 py-16">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <div className="w-3 h-3 rounded-full bg-cyan-500" />
              <div className="w-3 h-3 rounded-full bg-purple" />
              <div className="w-3 h-3 rounded-full bg-success-500" />
            </div>
            <span className="text-xl font-bold ml-1"><span className="text-surface-400">Meta</span> <span className="text-danger">10</span></span>
          </Link>
          <h1 className="text-2xl font-extrabold text-surface-900">Nova senha</h1>
          <p className="text-surface-400 mt-1 text-sm">Crie uma nova senha para sua conta</p>
        </div>

        <div className="card p-8 !rounded-3xl">
          <form action={formAction} className="space-y-4" noValidate>
            {state.error && (
              <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg">
                {state.error}
              </div>
            )}
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">Nova senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`input-base !pl-11 !pr-11 ${state.errors?.password ? '!border-danger-500' : ''}`} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors" aria-label="Mostrar senha">
                  {showPassword ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex gap-1 flex-1">
                    {[1, 2, 3].map((i) => <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength.level ? strength.color : 'bg-surface-200'}`} />)}
                  </div>
                  <span className="text-xs text-surface-400 w-10 text-right">{strength.label}</span>
                </div>
              )}
              {state.errors?.password && <p className="text-danger text-xs mt-1.5 ml-1">{state.errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 mb-1.5">Confirmar nova senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`input-base !pl-11 !pr-11 ${state.errors?.confirmPassword ? '!border-danger-500' : ''}`} placeholder="Confirme sua senha" autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors" aria-label="Mostrar senha">
                  {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {state.errors?.confirmPassword && <p className="text-danger text-xs mt-1.5 ml-1">{state.errors.confirmPassword}</p>}
            </div>
            
            <SubmitButton />
          </form>
        </div>
      </div>
    </section>
  )
}
