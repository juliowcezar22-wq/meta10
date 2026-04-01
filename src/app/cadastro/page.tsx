'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, CheckCircle } from 'lucide-react'

export default function CadastroPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [formData, setFormData] = useState({ nome: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [registered, setRegistered] = useState(false)

  const getPasswordStrength = (pass: string): { level: number; label: string; color: string } => {
    if (pass.length === 0) return { level: 0, label: '', color: '' }
    if (pass.length < 6) return { level: 1, label: 'Fraca', color: 'bg-red' }
    if (pass.length < 8) return { level: 2, label: 'Média', color: 'bg-yellow-500' }
    return { level: 3, label: 'Forte', color: 'bg-green' }
  }

  const strength = getPasswordStrength(formData.password)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) newErrors.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'E-mail inválido'
    if (!formData.password) newErrors.password = 'Senha é obrigatória'
    else if (formData.password.length < 8) newErrors.password = 'Mínimo de 8 caracteres'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'As senhas não coincidem'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) {
      setRegistered(true)
      setTimeout(() => {
        window.location.href = '/aluno/dashboard'
      }, 2000)
    }
  }

  if (registered) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-cyan-50 px-4 py-16">
        <div className="card p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Conta criada com sucesso!</h2>
          <p className="text-gray-600">Redirecionando para o dashboard...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-cyan-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-1 mb-4">
              <div className="flex items-center gap-0.5">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <div className="w-3 h-3 rounded-full bg-cyan" />
                <div className="w-3 h-3 rounded-full bg-purple" />
                <div className="w-3 h-3 rounded-full bg-green" />
              </div>
              <span className="text-xl font-bold ml-1">
                <span className="text-gray-500">Meta</span>
                <span className="text-red"> 10</span>
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Crie sua conta gratuita</h1>
            <p className="text-gray-500 mt-1">Comece a estudar agora mesmo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" id="nome" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${errors.nome ? 'border-red' : 'border-gray-300'}`}
                  placeholder="Seu nome completo" />
              </div>
              {errors.nome && <p className="text-red text-sm mt-1">{errors.nome}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" id="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${errors.email ? 'border-red' : 'border-gray-300'}`}
                  placeholder="seu@email.com" />
              </div>
              {errors.email && <p className="text-red text-sm mt-1">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPassword ? 'text' : 'password'} id="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${errors.password ? 'border-red' : 'border-gray-300'}`}
                  placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${i <= strength.level ? strength.color : 'bg-gray-200'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500">Força: {strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-red text-sm mt-1">{errors.password}</p>}
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showConfirm ? 'text' : 'password'} id="confirmPassword" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none ${errors.confirmPassword ? 'border-red' : 'border-gray-300'}`}
                  placeholder="Confirme sua senha" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
            <button type="submit" className="btn-primary w-full">Criar Conta</button>
          </form>
          <p className="text-center text-gray-600 mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">Entrar</Link>
          </p>
        </div>
      </div>
    </section>
  )
}
