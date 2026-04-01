import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'
import { PLANS } from '@/lib/constants'

export default function PricingSection() {
  return (
    <section className="section-padding bg-gray-50" id="planos">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Invista no seu futuro com planos acessíveis e conteúdo ilimitado.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`card card-hover p-8 flex flex-col relative ${
                plan.highlighted
                  ? 'border-2 border-primary ring-4 ring-primary/10'
                  : ''
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-4 py-1 rounded-full">
                  Mais Vantajoso
                </span>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
                {plan.total && (
                  <p className="text-sm text-gray-500 mt-1">{plan.total}</p>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faCheck} className="w-5 h-5 text-green flex-shrink-0 mt-0.5" />
                    <span className="text-gray-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full text-center ${
                  plan.highlighted ? 'btn-primary' : 'btn-outline'
                }`}
              >
                Assinar Agora
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
