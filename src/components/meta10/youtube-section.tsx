import { Youtube, Play, ExternalLink } from 'lucide-react'
import { YOUTUBE_VIDEO_ID, YOUTUBE_SHORTS, YOUTUBE_LINK } from '@/lib/constants'

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
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
              title="Vídeo principal META 10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="mb-12">
          <h3 className="text-lg font-bold text-center mb-6 text-surface-300">Shorts & Vídeos Rápidos</h3>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide justify-start lg:justify-center">
            {YOUTUBE_SHORTS.map((videoId, index) => (
              <a
                key={`${videoId}-${index}`}
                href={`https://www.youtube.com/shorts/${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 w-36 sm:w-44 snap-center group"
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-surface-700 ring-1 ring-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
                    alt={`Short vídeo ${index + 1} da META 10`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    width={176}
                    height={313}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 rounded-full bg-danger/90 flex items-center justify-center shadow-lg backdrop-blur-sm">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
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
