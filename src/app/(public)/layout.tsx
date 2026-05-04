import Header from '@/components/meta10/header'
import Footer from '@/components/meta10/footer'
import WhatsAppFloat from '@/components/meta10/whatsapp-float'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
