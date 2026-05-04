'use client'

import { useState } from 'react'
import { Mail, Phone, Instagram, Youtube, MessageCircle, Send, CheckCircle } from 'lucide-react'
import { INSTAGRAM_LINK, YOUTUBE_LINK, WHATSAPP_LINK, EMAIL_LINK } from '@/lib/constants'

const channels = [
  { icon: MessageCircle, label: 'WhatsApp', info: '(75) 98334-1771', href: WHATSAPP_LINK, color: 'bg-success-500 hover:bg-success-600', textColor: 'text-success-600' },
  { icon: Mail, label: 'E-mail', info: 'contato@meta10.com.br', href: EMAIL_LINK, color: 'bg-cyan-500 hover:bg-cyan-600', textColor: 'text-cyan-600' },
  { icon: Instagram, label: 'Instagram', info: '@meta10espacopedagogico', href: INSTAGRAM_LINK, color: 'bg-purple hover:bg-purple-600', textColor: 'text-purple' },
  { icon: Youtube, label: 'YouTube', info: 'META 10 Espaço Pedagógico', href: YOUTUBE_LINK, color: 'bg-danger-500 hover:bg-danger-600', textColor: 'text-danger-500' },
]

export default function ContatoPage() {
  const [formData, setFormData] = useState({ nome: '', email: '', mensagem: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.nome.trim()) e.nome = 'Nome é obrigatório'
    if (!formData.email.trim()) e.email = 'E-mail é obrigatório'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = 'E-mail inválido'
    if (!formData.mensagem.trim()) e.mensagem = 'Mensagem é obrigatória'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validate()) { setSubmitted(true); setFormData({ nome: '', email: '', mensagem: '' }); setTimeout(() => setSubmitted(false), 5000) }
  }

  return (
    <>
      <section className="relative py-20 md:py-28 bg-mesh overflow-hidden">
        <div className="container-custom text-center relative">
          <h1 className="text-4xl md:text-5xl font-extrabold text-surface-900 mb-4 tracking-tight">Entre em Contato</h1>
          <p className="text-lg text-surface-500 max-w-lg mx-auto">Tem dúvidas, sugestões ou quer saber mais? Fale conosco!</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            <div>
              <h2 className="text-xl font-extrabold text-surface-900 mb-6">Nossos Canais</h2>
              <div className="space-y-3">
                {channels.map(({ icon: Icon, label, info, href, color, textColor }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-4 p-4 rounded-2xl bg-surface-50 hover:bg-white hover:shadow-card-hover border border-transparent hover:border-surface-200 transition-all duration-200 group">
                    <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-surface-900 text-sm">{label}</p>
                      <p className={`text-sm ${textColor}`}>{info}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-surface-900 mb-6">Envie uma Mensagem</h2>
              {submitted && (
                <div className="mb-5 p-4 bg-success-50 border border-success-500/20 rounded-xl flex items-center gap-3 animate-fade-in" role="status">
                  <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                  <p className="text-success-700 text-sm font-medium">Mensagem enviada com sucesso!</p>
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {[
                  { id: 'nome', label: 'Nome completo', type: 'text', key: 'nome', placeholder: 'Seu nome completo', autoComplete: 'name' },
                  { id: 'ct-email', label: 'E-mail', type: 'email', key: 'email', placeholder: 'seu@email.com', autoComplete: 'email' },
                ].map(({ id, label, type, key, placeholder, autoComplete }) => (
                  <div key={key}>
                    <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1.5">{label}</label>
                    <input type={type} id={id} value={formData[key as keyof typeof formData]} onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      className={`input-base ${errors[key] ? '!border-danger-500' : ''}`} placeholder={placeholder} autoComplete={autoComplete} />
                    {errors[key] && <p className="text-danger text-xs mt-1.5 ml-1">{errors[key]}</p>}
                  </div>
                ))}
                <div>
                  <label htmlFor="msg" className="block text-sm font-medium text-surface-700 mb-1.5">Mensagem</label>
                  <textarea id="msg" rows={5} value={formData.mensagem} onChange={(e) => setFormData({ ...formData, mensagem: e.target.value })}
                    className={`input-base resize-none ${errors.mensagem ? '!border-danger-500' : ''}`} placeholder="Como podemos ajudar?" />
                  {errors.mensagem && <p className="text-danger text-xs mt-1.5 ml-1">{errors.mensagem}</p>}
                </div>
                <button type="submit" className="btn-primary w-full !py-3.5 justify-center">
                  <Send className="w-4 h-4" /> Enviar Mensagem
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
