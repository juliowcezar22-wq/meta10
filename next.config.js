/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      // Imagens servidas pelo Supabase Storage (buckets públicos)
      { protocol: 'https', hostname: '**.supabase.co', pathname: '/storage/v1/object/public/**' },
    ],
  },
  async redirects() {
    return [
      // Rotas do antigo módulo de Simulados agora levam ao Banco de Questões
      { source: '/aluno/questoes', destination: '/aluno/questoes-avulsas', permanent: true },
      { source: '/aluno/questoes/:path*', destination: '/aluno/questoes-avulsas', permanent: true },
      { source: '/admin/questoes', destination: '/admin/questoes-avulsas', permanent: true },
      { source: '/admin/questoes/:path*', destination: '/admin/questoes-avulsas', permanent: true },
      // Antigas páginas de download por matéria agora caem na loja filtrada
      { source: '/aluno/atividades-pdf/:subject', destination: '/aluno/loja?tipo=atividade_pdf&disciplina=:subject', permanent: true },
      { source: '/aluno/mapas-mentais/:subject', destination: '/aluno/loja?tipo=mapa_mental&disciplina=:subject', permanent: true },
      { source: '/aluno/resumos/:subject', destination: '/aluno/loja?tipo=resumo&disciplina=:subject', permanent: true },
      { source: '/aluno/jogos-pedagogicos/:subject', destination: '/aluno/loja?tipo=jogo&disciplina=:subject', permanent: true },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com; frame-src https://www.youtube.com https://www.google.com; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://wa.me https://*.supabase.co;",
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
