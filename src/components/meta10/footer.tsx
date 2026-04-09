import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Youtube, MessageCircle, Heart } from 'lucide-react'
import { INSTAGRAM_LINK, YOUTUBE_LINK, WHATSAPP_LINK } from '@/lib/constants'

const navLinks = [
  { label: 'Início', href: '/' }, { label: 'Sobre', href: '/sobre' },
  { label: 'Materiais', href: '/materiais' }, { label: 'Loja', href: '/loja' }, { label: 'Contato', href: '/contato' },
]

const socials = [
  { icon: Instagram, href: INSTAGRAM_LINK, label: 'Instagram' },
  { icon: Youtube, href: YOUTUBE_LINK, label: 'YouTube' },
  { icon: MessageCircle, href: WHATSAPP_LINK, label: 'WhatsApp' },
]

export default function Footer() {
  return (
    <footer className="bg-surface-900 text-surface-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <Image src="/logomarca-meta10.png" alt="META 10" width={120} height={30} className="w-auto h-8 object-contain brightness-0 invert" />
            </div>
            <p className="text-surface-500 text-sm leading-relaxed max-w-sm mb-6">
              Plataforma de reforço escolar de qualidade para alunos do ensino fundamental e médio. Material curado, simulados e muito mais.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-surface-800 hover:bg-primary flex items-center justify-center transition-all duration-200 hover:scale-105"
                  aria-label={label}>
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Navegação</h3>
            <ul className="space-y-2.5">
              {navLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-surface-500 hover:text-primary transition-colors text-sm">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-semibold text-white text-sm mb-4 uppercase tracking-wider">Contato</h3>
            <ul className="space-y-2.5 text-sm text-surface-500">
              <li><a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">WhatsApp</a></li>
              <li><a href="mailto:contato@meta10.com.br" className="hover:text-primary transition-colors">contato@meta10.com.br</a></li>
              <li><a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">@meta10espacopedagogico</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-surface-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-surface-600 text-xs">
            © {new Date().getFullYear()} META 10 Espaço Pedagógico. Todos os direitos reservados.
          </p>
          <p className="text-surface-600 text-xs flex items-center gap-1">
            Feito com <Heart className="w-3 h-3 text-danger fill-danger" /> para educação
          </p>
        </div>
      </div>
    </footer>
  )
}
