import Link from 'next/link'
import Image from 'next/image'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInstagram, faYoutube, faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { INSTAGRAM_LINK, YOUTUBE_LINK, WHATSAPP_LINK } from '@/lib/constants'

export default function Footer() {
  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Materiais', href: '/materiais' },
    { label: 'Loja', href: '/loja' },
    { label: 'Contato', href: '/contato' },
  ]

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image src="/logomarca-meta10.png" alt="META 10 Espaço Pedagógico" width={150} height={40} className="w-auto h-10 object-contain filter brightness-0 invert" />
            </div>
            <p className="text-gray-400 text-sm">Espaço Pedagógico</p>
            <p className="text-gray-400 text-sm mt-2">
              Reforço escolar de qualidade para alunos do ensino fundamental e médio.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-3">Navegação</h3>
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-gray-400 hover:text-primary transition-colors text-sm">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold mb-3">Redes Sociais</h3>
            <div className="flex gap-4">
              <a
                href={INSTAGRAM_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} className="w-5 h-5" />
              </a>
              <a
                href={YOUTUBE_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-red transition-colors"
                aria-label="YouTube"
              >
                <FontAwesomeIcon icon={faYoutube} className="w-5 h-5" />
              </a>
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-green-500 transition-colors"
                aria-label="WhatsApp"
              >
                <FontAwesomeIcon icon={faWhatsapp} className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} META 10 Espaço Pedagógico. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  )
}
