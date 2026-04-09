import { Star, Quote } from 'lucide-react'
import { TESTIMONIALS } from '@/lib/mock-data'

export default function TestimonialsSection() {
  return (
    <section className="section-padding bg-surface-50 relative overflow-hidden">
      <div className="bg-mesh-warm absolute inset-0 pointer-events-none" />
      <div className="relative container-custom">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-surface-900 mb-4 tracking-tight">
            O que dizem sobre nós
          </h2>
          <p className="text-surface-500 text-lg max-w-xl mx-auto">
            Veja o que nossos alunos e responsáveis acham da plataforma.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={t.id}
              className={`relative bg-white rounded-2xl p-8 shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 border border-surface-100/80 ${i === 1 ? 'md:-mt-4 md:mb-4' : ''}`}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-primary/10" />
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-surface-600 leading-relaxed mb-6 text-[0.95rem]">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="flex items-center gap-3 pt-5 border-t border-surface-100">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-400 flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-sm">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <p className="font-semibold text-surface-900 text-sm">{t.name}</p>
                  <p className="text-xs text-surface-400">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
