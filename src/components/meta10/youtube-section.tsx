import { Youtube, ExternalLink } from 'lucide-react'
import { YOUTUBE_LINK } from '@/lib/constants'

export default function YouTubeSection() {
  return (
    <section className="section-padding bg-surface-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-danger/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative container-custom">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 badge bg-red-500/20 text-red-400 mb-4">
            <Youtube className="w-3.5 h-3.5" />
            Vídeos
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight">
            Aprenda com Nossos <span className="text-gradient-primary">Vídeos</span>
          </h2>
          <p className="text-surface-400 text-lg max-w-xl mx-auto">
            Aulas em vídeo para complementar seus estudos. Assista quando e onde quiser.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-14">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-glass-xl ring-1 ring-white/10">
            <iframe
              src="https://www.youtube.com/embed/t2prhcVyoYM?si=LqmVtlf12hYDp5zH"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>


        <div className="text-center">
          <a
            href={YOUTUBE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold border border-white/10 hover:border-white/20 transition-all duration-300"
          >
            <Youtube className="w-5 h-5" />
            Visite nosso canal
            <ExternalLink className="w-4 h-4 text-surface-400" />
          </a>
        </div>
      </div>
    </section>
  )
}
