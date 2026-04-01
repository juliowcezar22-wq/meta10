import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import Header from '@/components/meta10/header'
import Footer from '@/components/meta10/footer'
import WhatsAppFloat from '@/components/meta10/whatsapp-float'

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '600', '700'] })

export const metadata: Metadata = {
  title: 'META 10 - Espaço Pedagógico | Reforço Escolar Online',
  description: 'Plataforma de reforço escolar com questões, simulados, PDFs, mapas mentais e resumos para alunos do ensino fundamental e médio.',
  keywords: 'reforço escolar, educação, simulados, questões, PDFs, mapas mentais, ensino fundamental, ensino médio',
  authors: [{ name: 'META 10 Espaço Pedagógico' }],
  openGraph: {
    title: 'META 10 - Espaço Pedagógico',
    description: 'Seu reforço escolar começa aqui. Questões, simulados, PDFs e muito mais.',
    type: 'website',
    locale: 'pt_BR',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={poppins.className}>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  )
}
