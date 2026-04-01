'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faXmark, faUser } from '@fortawesome/free-solid-svg-icons'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Materiais', href: '/materiais' },
    { label: 'Loja', href: '/loja' },
    { label: 'Contato', href: '/contato' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-1">
              <Image src="/logomarca-meta10.png" alt="META 10 Espaço Pedagógico" width={150} height={40} className="h-8 w-auto object-contain" />
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-900 hover:text-primary transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-gray-900 hover:text-primary transition-colors text-sm font-medium flex items-center gap-2">
              <FontAwesomeIcon icon={faUser} className="w-4 h-4" />
              Entrar
            </Link>
            <Link href="/cadastro" className="btn-primary text-sm">
              Comece a Estudar Agora
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-900 hover:text-primary"
            aria-label="Toggle menu"
          >
            <FontAwesomeIcon icon={isOpen ? faXmark : faBars} className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-4 py-4 space-y-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-gray-900 hover:text-primary font-medium py-2"
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100 space-y-3">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="block text-center text-gray-900 hover:text-primary font-medium py-2"
              >
                Entrar
              </Link>
              <Link
                href="/cadastro"
                onClick={() => setIsOpen(false)}
                className="btn-primary w-full"
              >
                Comece a Estudar Agora
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
