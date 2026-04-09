'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, User, Sparkles } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Materiais', href: '/materiais' },
    { label: 'Loja', href: '/loja' },
    { label: 'Contato', href: '/contato' },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(0,0,0,0.05)] py-2'
          : 'bg-transparent py-4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <Link href="/" className="relative z-10 flex items-center gap-2 group">
              <Image src="/logomarca-meta10.png" alt="META 10" width={140} height={36} className="h-7 w-auto object-contain transition-all duration-300 group-hover:scale-105" priority />
            </Link>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-surface-600 hover:text-primary transition-colors duration-200 rounded-xl hover:bg-primary-50/60"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-3">
              <Link href="/login" className="btn-ghost text-sm">
                <User className="w-4 h-4" />
                Entrar
              </Link>
              <Link href="/cadastro" className="btn-primary text-sm !py-2.5 !px-5">
                <Sparkles className="w-4 h-4" />
                Comece a Estudar
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(true)}
              className="md:hidden relative z-10 p-2 text-surface-700 hover:text-primary transition-colors rounded-xl hover:bg-surface-100"
              aria-label="Abrir menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      <div className={`fixed inset-0 z-50 md:hidden transition-all duration-500 ${
        isOpen ? 'visible opacity-100' : 'invisible opacity-0'
      }`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
        <div className={`absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white shadow-glass-xl transition-transform duration-500 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-5 border-b border-surface-100">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image src="/logomarca-meta10.png" alt="META 10" width={120} height={30} className="h-6 w-auto object-contain" />
            </Link>
            <button onClick={() => setIsOpen(false)} className="p-2 text-surface-500 hover:text-surface-800 rounded-xl hover:bg-surface-100 transition-colors" aria-label="Fechar menu">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="p-5 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-base font-medium text-surface-700 hover:text-primary hover:bg-primary-50 rounded-xl transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="p-5 border-t border-surface-100 space-y-3">
            <Link href="/login" onClick={() => setIsOpen(false)} className="block text-center py-3 text-sm font-medium text-surface-600 hover:text-primary rounded-xl transition-colors">
              Entrar na sua conta
            </Link>
            <Link href="/cadastro" onClick={() => setIsOpen(false)} className="btn-primary w-full text-sm justify-center">
              <Sparkles className="w-4 h-4" />
              Comece a Estudar
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
