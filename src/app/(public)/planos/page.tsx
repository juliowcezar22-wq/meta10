import { Check } from 'lucide-react'
import Link from 'next/link'
import { PLANS } from '@/lib/constants'

export default function PlanosPage() {
  return (
    <>
      <section className="bg-gradient-to-br from-primary-50 to-white section-padding">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Planos de Assinatura
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o plano ideal para seus estudos e comece a evoluir hoje.
          </p>
        </div>
      </section>

      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 max-w-[1400px] mx-auto items-stretch">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card card-hover p-6 lg:p-5 xl:p-6 flex flex-col relative h-full ${
                  plan.highlighted ? 'border-2 border-primary ring-4 ring-primary/10' : ''
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                    Mais Vantajoso
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 flex-wrap">
                    <span className="text-3xl xl:text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                  {plan.total && <p className="text-sm text-gray-500 mt-1">{plan.total}</p>}
                </div>
                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={plan.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full text-center ${plan.highlighted ? 'btn-primary' : 'btn-outline'}`}
                >
                  Assinar Agora
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  )
}
