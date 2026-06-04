import { LockOpen, FileText, ClipboardList, Network, BookOpen, Download } from 'lucide-react'
import { FREE_CONTENTS } from '@/lib/constants'
import Link from 'next/link'

const iconMap: Record<string, React.ElementType> = {
  PDF: FileText, Resumo: BookOpen, 'Mapa Mental': Network, Simulado: ClipboardList,
}

const themeMap: Record<string, { badge: string, iconBg: string, iconColor: string, gradient: string, border: string }> = {
  PDF: { 
    badge: 'bg-primary-50 text-primary-700 ring-1 ring-primary-500/20', 
    iconBg: 'bg-primary-100', 
    iconColor: 'text-primary-600',
    gradient: 'from-primary-500/10 to-transparent',
    border: 'group-hover:border-primary-500/30'
  },
  Resumo: { 
    badge: 'bg-purple-50 text-purple-700 ring-1 ring-purple-500/20', 
    iconBg: 'bg-purple-100', 
    iconColor: 'text-purple-600',
    gradient: 'from-purple-500/10 to-transparent',
    border: 'group-hover:border-purple-500/30'
  },
}

export default function FreeContentSection() {
  return (
    <section className="section-padding bg-surface-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-surface-200 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative container-custom">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 text-success-700 text-sm font-semibold mb-6 ring-1 ring-success-500/20 animate-fade-in-up">
            <LockOpen className="w-4 h-4" />
            Acesso 100% Gratuito
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-6 tracking-tight animate-fade-in-up animation-delay-100">
            Conteúdos Gratuitos
          </h2>
          <p className="text-surface-500 text-lg max-w-2xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            Baixe amostras exclusivas do nosso método e descubra na prática como o META 10 pode acelerar a sua aprovação.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {FREE_CONTENTS.map((content, index) => {
            const Icon = iconMap[content.type] || FileText
            const theme = themeMap[content.type] || themeMap['PDF']
            
            return (
              <div 
                key={index} 
                className={`group relative bg-white rounded-[2.5rem] p-8 md:p-10 shadow-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-surface-200 overflow-hidden ${theme.border} animate-fade-in-up`}
                style={{ animationDelay: `${300 + (index * 100)}ms` }}
              >
                {/* Background Gradient */}
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${theme.gradient} rounded-bl-[4rem] opacity-50 group-hover:scale-125 transition-transform duration-700 ease-out`} />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-8">
                    <div className={`w-16 h-16 rounded-2xl ${theme.iconBg} flex items-center justify-center group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-500 ease-out`}>
                      <Icon className={`w-8 h-8 ${theme.iconColor}`} />
                    </div>
                    {content.type && (
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${theme.badge}`}>
                        {content.type}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-grow">
                    <h3 className="font-extrabold text-surface-900 text-2xl mb-8 group-hover:text-primary transition-colors duration-300">
                      {content.title}
                    </h3>
                  </div>
                  
                  <Link href="/cadastro" className="relative overflow-hidden w-full bg-surface-900 hover:bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors duration-300 group/btn mt-auto">
                    <span className="relative z-10 flex items-center gap-2">
                      Acessar Grátis Agora
                      <Download className="w-5 h-5 group-hover/btn:translate-y-0.5 transition-transform duration-300" />
                    </span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

