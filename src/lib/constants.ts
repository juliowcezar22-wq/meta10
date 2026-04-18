export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5575983341771'
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
export const INSTAGRAM_LINK = process.env.NEXT_PUBLIC_INSTAGRAM_LINK || 'https://instagram.com/meta10espacopedagogico'
export const YOUTUBE_LINK = process.env.NEXT_PUBLIC_YOUTUBE_LINK || 'https://www.youtube.com/@meta10quiz'
export const EMAIL_LINK = process.env.NEXT_PUBLIC_EMAIL_LINK || 'mailto:contato@meta10.com.br'

export const HOTMART_LINKS = {
  gratuito: process.env.NEXT_PUBLIC_HOTMART_GRATUITO || '#',
  mensal: process.env.NEXT_PUBLIC_HOTMART_MENSAL || 'https://pay.hotmart.com/placeholder-mensal',
  semestral: process.env.NEXT_PUBLIC_HOTMART_SEMESTRAL || 'https://pay.hotmart.com/placeholder-semestral',
  anual: process.env.NEXT_PUBLIC_HOTMART_ANUAL || 'https://pay.hotmart.com/placeholder-anual',
  meta10: process.env.NEXT_PUBLIC_HOTMART_META10 || 'https://pay.hotmart.com/placeholder-meta10',
}

export const GOOGLE_MAPS_EMBED = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED || 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.0294502646957!2d-38.90761412330957!3d-12.246285188006322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71437bfdaeb5cd9%3A0xd18ae05b1b8014e2!2sMeta%2010%20Espa%C3%A7o%20Pedag%C3%B3gico%20Refor%C3%A7o%20Escolar!5e0!3m2!1spt-BR!2sbr!4v1775011916082!5m2!1spt-BR!2sbr'

export const YOUTUBE_VIDEO_ID = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || 'dQw4w9WgXcQ'
export const YOUTUBE_SHORTS = [
  'dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
]

export const PLANS = [
  {
    id: 'gratuito',
    name: 'Gratuito',
    price: 'R$ 0,00',
    period: '',
    features: [
      'Resolução de questões (limitado)',
      'Comentários de alunos (limitado)',
      'Download de apostilas (limitado)',
      'Download de provas anteriores (limitado)',
      'Estatísticas de desempenho (limitado)'
    ],
    highlighted: false,
    link: HOTMART_LINKS.gratuito,
  },
  {
    id: 'mensal',
    name: 'Mensal',
    price: 'R$ 22,90',
    period: '/mês',
    total: 'Cobrança a cada 30 dias',
    features: [
      'Resolução de questões',
      'Comentários de alunos',
      'Download de apostilas',
      'Download de provas anteriores',
      'Estatísticas de desempenho'
    ],
    highlighted: false,
    link: HOTMART_LINKS.mensal,
  },
  {
    id: 'semestral',
    name: 'Semestral',
    price: 'R$ 16,65',
    period: '/mês',
    total: 'R$ 99,90 a cada 180 dias',
    features: [
      'Resolução de questões',
      'Comentários de alunos',
      'Download de apostilas',
      'Download de provas anteriores',
      'Estatísticas de desempenho'
    ],
    highlighted: false,
    link: HOTMART_LINKS.semestral,
  },
  {
    id: 'anual',
    name: 'Anual',
    price: 'R$ 14,16',
    period: '/mês',
    total: 'R$ 169,90 a cada 365 dias',
    features: [
      'Resolução de questões',
      'Comentários de alunos',
      'Download de apostilas',
      'Download de provas anteriores',
      'Estatísticas de desempenho'
    ],
    highlighted: true,
    link: HOTMART_LINKS.anual,
  },
  {
    id: 'meta10',
    name: 'Meta10',
    price: 'R$ 15,83',
    period: '/mês',
    total: 'R$ 189,90 a cada 365 dias',
    features: [
      'Resolução de questões',
      'Comentários de alunos',
      'Download de apostilas',
      'Download de provas anteriores',
      'Estatísticas de desempenho',
      'Resumos de estudo',
      'Comentários de professores',
      'Resolução de simulados',
      'Download de mapas mentais',
      'Flashcards inteligentes',
      'Download de jogos pedagógicos'
    ],
    highlighted: false,
    link: HOTMART_LINKS.meta10,
  },
]

export const MATERIALS = [
  { id: 'questoes', title: 'Banco de Questões', description: 'Milhares de questões organizadas por disciplina e tema.', icon: 'ListChecks', slug: 'questoes' },
  { id: 'simulados', title: 'Simulados', description: 'Simulados completos com correção automática e comentários.', icon: 'ClipboardCheck', slug: 'simulados' },
  { id: 'pdfs', title: 'PDFs', description: 'Apostilas, listas de exercícios e materiais complementares.', icon: 'FileText', slug: 'pdfs' },
  { id: 'mapas', title: 'Mapas Mentais', description: 'Mapas visuais para organizar e fixar o conteúdo.', icon: 'Network', slug: 'mapas-mentais' },
  { id: 'resumos', title: 'Resumos', description: 'Resumos objetivos das matérias mais cobradas.', icon: 'BookOpen', slug: 'resumos' },
]

export const FREE_CONTENTS = [
  { title: 'Introdução à Física', type: 'PDF', pages: '12 páginas' },
  { title: 'Gramática Essencial', type: 'Resumo', pages: '8 páginas' },
  { title: 'Equações do 2º Grau', type: 'Mapa Mental', pages: '1 página' },
  { title: 'Simulado ENEM - Matemática', type: 'Simulado', pages: '45 questões' },
]

export const STORE_PRODUCTS = [
  { id: 1, name: 'Apostila Completa - Matemática', description: 'Todas as fórmulas e exercícios resolvidos.', price: 'R$ 49,90', category: 'PDF' },
  { id: 2, name: 'Kit Mapas Mentais - Ciências', description: '30 mapas mentais de Biologia, Química e Física.', price: 'R$ 39,90', category: 'PDF' },
  { id: 3, name: 'Jogo Pedagógico - Tabuada', description: 'Jogo interativo para fixar a tabuada.', price: 'R$ 29,90', category: 'Jogo' },
  { id: 4, name: 'Resumão ENEM 2026', description: 'Resumo completo de todas as áreas do ENEM.', price: 'R$ 59,90', category: 'PDF' },
  { id: 5, name: 'Apostila de Redação', description: 'Técnicas e modelos prontos para nota 1000.', price: 'R$ 34,90', category: 'PDF' },
  { id: 6, name: 'Flashcards - História do Brasil', description: '100 flashcards para revisar história.', price: 'R$ 19,90', category: 'Jogo' },
]
