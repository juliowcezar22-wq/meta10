import { MessageCircle } from 'lucide-react'
import { WHATSAPP_LINK } from '@/lib/constants'

export default function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_LINK}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      aria-label="Contato via WhatsApp"
    >
      <div className="relative w-14 h-14 bg-[#25D366] hover:bg-[#20bd5a] rounded-2xl flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_28px_rgba(37,211,102,0.5)]">
        <MessageCircle className="w-7 h-7 text-white" />
        {/* Ping indicator */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white animate-ping opacity-75" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-white" />
      </div>
    </a>
  )
}
