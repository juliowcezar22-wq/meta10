import { Check, Zap } from 'lucide-react'
import { PLANS } from '@/lib/constants'

export default function PricingSection() {
  return (
    <section className="section-padding bg-white relative overflow-hidden" id="planos">
      <div className="bg-mesh absolute inset-0 pointer-events-none" />
      <div className="relative container-custom">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4 tracking-tight">
            Escolha Seu Plano
          </h2>
          <p className="text-surface-500 text-lg max-w-xl mx-auto">
            Invista no seu futuro com planos acessíveis e conteúdo ilimitado.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6 max-w-[1400px] mx-auto items-stretch">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 lg:p-5 xl:p-6 flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                plan.highlighted
                  ? 'bg-gradient-to-b from-primary to-primary-600 text-white shadow-[0_12px_48px_rgba(241,120,31,0.3)] ring-1 ring-primary/20 scale-[1.02] md:scale-105'
                  : 'bg-white border border-surface-200 shadow-card hover:shadow-card-hover'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                  <Zap className="w-3 h-3" />
                  Mais Vantajoso
                </div>
              )}
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-3 ${plan.highlighted ? 'text-white/90' : 'text-surface-900'}`}>
                  Plano {plan.name}
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl xl:text-4xl font-extrabold tracking-tight ${plan.highlighted ? 'text-white' : 'text-surface-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm ${plan.highlighted ? 'text-white/70' : 'text-surface-400'}`}>{plan.period}</span>
                </div>
                {plan.total && (
                  <p className={`text-sm mt-1 ${plan.highlighted ? 'text-white/60' : 'text-surface-400'}`}>
                    {plan.total}
                  </p>
                )}
              </div>
              <ul className="space-y-3 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      plan.highlighted ? 'bg-white/20' : 'bg-success-50'
                    }`}>
                      <Check className={`w-3 h-3 ${plan.highlighted ? 'text-white' : 'text-success-600'}`} />
                    </div>
                    <span className={`text-sm ${plan.highlighted ? 'text-white/80' : 'text-surface-600'}`}>{feature}</span>
                  </li>
                ))}
              </ul>
              <a
                href={plan.link}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full text-center font-semibold py-3.5 rounded-xl transition-all duration-300 ${
                  plan.highlighted
                    ? 'bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl'
                    : 'btn-primary'
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
