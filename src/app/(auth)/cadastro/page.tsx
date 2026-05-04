'use client'

import { useState } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, ArrowLeft } from 'lucide-react'
import { signUpAction } from '@/app/actions/auth'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} className="btn-primary w-full !py-3.5 !text-base justify-center disabled:opacity-70">
      {pending ? 'Criando Conta...' : 'Criar Conta'}
    </button>
  )
}

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', confirmPassword: '' })

  const [state, formAction] = useFormState(signUpAction, { success: false })

  const getStrength = (pass: string) => {
    if (pass.length === 0) return { level: 0, label: '', color: '' }
    if (pass.length < 6) return { level: 1, label: 'Fraca', color: 'bg-danger-500' }
    if (pass.length < 8) return { level: 2, label: 'Média', color: 'bg-amber-400' }
    return { level: 3, label: 'Forte', color: 'bg-success-500' }
  }

  const strength = getStrength(formData.password)

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
          <h1 className="text-2xl font-extrabold text-surface-900">Crie sua conta gratuita</h1>
          <p className="text-surface-400 mt-1 text-sm">Comece a estudar agora mesmo</p>
        </div>

        <div className="card p-8 !rounded-3xl">
          <form action={formAction} className="space-y-4" noValidate>
            {state.error && (
              <div className="p-3 bg-danger-50 border border-danger-200 text-danger-700 text-sm rounded-lg">
                {state.error}
              </div>
            )}
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-surface-700 mb-1.5">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type="text" id="nome" name="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className={`input-base !pl-11 ${state.errors?.nome ? '!border-danger-500' : ''}`} placeholder="Seu nome completo" autoComplete="name" />
              </div>
              {state.errors?.nome && <p className="text-danger text-xs mt-1.5 ml-1">{state.errors.nome}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type="email" id="email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input-base !pl-11 ${state.errors?.email ? '!border-danger-500' : ''}`} placeholder="seu@email.com" autoComplete="email" />
              </div>
              {state.errors?.email && <p className="text-danger text-xs mt-1.5 ml-1">{state.errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">Senha</label>
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
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 mb-1.5">Confirmar senha</label>
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
          <div className="mt-6 pt-6 border-t border-surface-100 text-center">
            <p className="text-sm text-surface-500">Já tem conta? <Link href="/login" className="text-primary font-semibold">Entrar</Link></p>
          </div>
        </div>
      </div>
    </section>
  )
}
