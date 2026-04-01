import Link from 'next/link'

export default function FinalCTA() {
  return (
    <section className="section-padding bg-gradient-to-r from-primary to-primary-600 text-white">
      <div className="container-custom text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Pronto para transformar seus estudos?
        </h2>
        <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
          Junte-se a milhares de alunos que já estão conquistando melhores resultados com a META 10.
        </p>
        <Link href="/cadastro" className="bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-lg transition-colors duration-200 inline-flex items-center gap-2 text-lg">
          Comece a Estudar Agora
        </Link>
      </div>
    </section>
  )
}
