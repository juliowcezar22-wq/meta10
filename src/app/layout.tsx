import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/components/meta10/header'
import Footer from '@/components/meta10/footer'
import WhatsAppFloat from '@/components/meta10/whatsapp-float'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  title: { default: 'META 10 - Espaço Pedagógico | Reforço Escolar Online', template: '%s | META 10' },
  description: 'Plataforma de reforço escolar com questões, simulados, PDFs, mapas mentais e resumos para alunos do ensino fundamental e médio.',
  keywords: 'reforço escolar, educação, simulados, questões, PDFs, mapas mentais, ENEM, vestibular, ensino fundamental, ensino médio',
  authors: [{ name: 'META 10 Espaço Pedagógico' }],
  openGraph: { title: 'META 10 - Espaço Pedagógico', description: 'Seu reforço escolar começa aqui.', type: 'website', locale: 'pt_BR', siteName: 'META 10' },
  robots: { index: true, follow: true },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.variable}>
      <body className={`${poppins.className} font-sans`}>
        <Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  )
}
