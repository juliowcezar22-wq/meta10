import { Youtube } from 'lucide-react'
import { YOUTUBE_VIDEO_ID, YOUTUBE_LINK } from '@/lib/constants'

export default function YouTubeSection() {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Aprenda com Nossos Vídeos
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Aulas em vídeo para complementar seus estudos. Assista quando e onde quiser.
          </p>
        </div>

        {/* Main Video */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}`}
              title="Vídeo principal META 10"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href={YOUTUBE_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2"
          >
            <Youtube className="w-5 h-5" />
            Visite nosso canal
          </a>
        </div>
      </div>
    </section>
  )
}