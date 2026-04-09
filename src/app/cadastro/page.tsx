'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, ArrowLeft } from 'lucide-react'

export default function CadastroPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [registered, setRegistered] = useState(false)

  const getStrength = (pass: string) => {
    if (pass.length === 0) return { level: 0, label: '', color: '' }
    if (pass.length < 6) return { level: 1, label: 'Fraca', color: 'bg-danger-500' }
    if (pass.length < 8) return { level: 2, label: 'Média', color: 'bg-amber-400' }
    return { level: 3, label: 'Forte', color: 'bg-success-500' }
  }

  const strength = getStrength(formData.password)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.nome.trim()) e.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) e.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'E-mail inválido'
    if (!formData.password) e.password = 'Senha é obrigatória'
    else if (formData.password.length < 8) e.password = 'Mínimo de 8 caracteres'
    if (formData.password !== formData.confirmPassword) e.confirmPassword = 'As senhas não coincidem'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setRegistered(true)
      setTimeout(() => router.push('/aluno/dashboard'), 2000)
    }
  }

  if (registered) {
    return (
      <section className="min-h-[100dvh] flex items-center justify-center bg-mesh px-4">
        <div className="card p-10 text-center max-w-sm !rounded-3xl animate-scale-in">
          <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-success-600" />
          </div>
          <h2 className="text-xl font-extrabold text-surface-900 mb-2">Conta criada com sucesso!</h2>
          <p className="text-surface-400 text-sm">Redirecionando para o dashboard...</p>
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
          <h1 className="text-2xl font-extrabold text-surface-900">Crie sua conta gratuita</h1>
          <p className="text-surface-400 mt-1 text-sm">Comece a estudar agora mesmo</p>
        </div>

        <div className="card p-8 !rounded-3xl">
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-surface-700 mb-1.5">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type="text" id="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className={`input-base !pl-11 ${errors.nome ? '!border-danger-500' : ''}`} placeholder="Seu nome completo" autoComplete="name" />
              </div>
              {errors.nome && <p className="text-danger text-xs mt-1.5 ml-1">{errors.nome}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-surface-700 mb-1.5">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`input-base !pl-11 ${errors.email ? '!border-danger-500' : ''}`} placeholder="seu@email.com" autoComplete="email" />
              </div>
              {errors.email && <p className="text-danger text-xs mt-1.5 ml-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-surface-700 mb-1.5">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type={showPassword ? 'text' : 'password'} id="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`input-base !pl-11 !pr-11 ${errors.password ? '!border-danger-500' : ''}`} placeholder="Mínimo 8 caracteres" autoComplete="new-password" />
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
              {errors.password && <p className="text-danger text-xs mt-1.5 ml-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-surface-700 mb-1.5">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-surface-400" />
                <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`input-base !pl-11 !pr-11 ${errors.confirmPassword ? '!border-danger-500' : ''}`} placeholder="Confirme sua senha" autoComplete="new-password" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600 transition-colors" aria-label="Mostrar senha">
                  {showConfirm ? <EyeOff className="w-[18px] h-[18px]" /> : <Eye className="w-[18px] h-[18px]" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-danger text-xs mt-1.5 ml-1">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="btn-primary w-full !py-3.5 !text-base justify-center">Criar Conta</button>
          </form>
          <div className="mt-6 pt-6 border-t border-surface-100 text-center">
            <p className="text-sm text-surface-500">Já tem conta? <Link href="/login" className="text-primary font-semibold">Entrar</Link></p>
          </div>
        </div>
      </div>
    </section>
  )
}
