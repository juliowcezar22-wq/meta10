export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '5575981122334'
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
export const INSTAGRAM_LINK = process.env.NEXT_PUBLIC_INSTAGRAM_LINK || 'https://instagram.com/meta10espacopedagogico'
export const YOUTUBE_LINK = process.env.NEXT_PUBLIC_YOUTUBE_LINK || 'https://www.youtube.com/@meta10quiz'
export const EMAIL_LINK = process.env.NEXT_PUBLIC_EMAIL_LINK || 'mailto:contato@meta10.com.br'

// Tipos de material vendidos avulsos na loja (nunca gratuitos, nunca por plano).
// 'questoes' = apostilas/listas de questões vendidas na loja — não confundir
// com o Banco de Questões, que é conteúdo de plano.
export const MATERIAL_TYPES = [
  { slug: 'questoes', label: 'Questões' },
  { slug: 'atividade_pdf', label: 'Atividades em PDF' },
  { slug: 'resumo', label: 'Resumos' },
  { slug: 'mapa_mental', label: 'Mapas Mentais' },
  { slug: 'jogo', label: 'Jogos Pedagógicos' },
] as const

export type MaterialTypeSlug = (typeof MATERIAL_TYPES)[number]['slug']

export const MATERIAL_TYPE_LABELS: Record<string, string> =
  Object.fromEntries(MATERIAL_TYPES.map(m => [m.slug, m.label]))

export const DIFFICULTY_LABELS: Record<string, string> = {
  facil: 'Fácil',
  medio: 'Médio',
  dificil: 'Difícil',
}

// Nomes de disciplinas vêm SEMPRE da tabela `disciplines` do banco
// (getDisciplines / getDisciplineBySlug) — nunca hardcode aqui.

export const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.0294500875407!2d-38.9050392!3d-12.246285199999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71437bfdaeb5cd9%3A0xd18ae05b1b8014e2!2sMeta%2010%20Espa%C3%A7o%20Pedag%C3%B3gico%20Refor%C3%A7o%20Escolar!5e0!3m2!1spt-BR!2sbr!4v1779921119710!5m2!1spt-BR!2sbr'

export const YOUTUBE_VIDEO_ID = process.env.NEXT_PUBLIC_YOUTUBE_VIDEO_ID || 'dQw4w9WgXcQ'
export const YOUTUBE_SHORTS = [
  'dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
  'dQw4w9WgXcQ',
]

// A definição dos planos vive em src/lib/plans.ts (fonte única tipada).

// href: Banco de Questões é conteúdo de plano (área do aluno);
// os demais são produtos avulsos e apontam para a loja filtrada.
export const MATERIALS = [
  { id: 'questoes', title: 'Banco de Questões', description: 'Milhares de questões organizadas por disciplina e tema.', icon: 'ListChecks', href: '/aluno/dashboard' },
  { id: 'pdfs', title: 'Atividades em PDF', description: 'Apostilas, listas de exercícios e materiais complementares.', icon: 'FileText', href: '/loja?tipo=atividade_pdf' },
  { id: 'mapas', title: 'Mapas Mentais', description: 'Mapas visuais para organizar e fixar o conteúdo.', icon: 'Network', href: '/loja?tipo=mapa_mental' },
  { id: 'resumos', title: 'Resumos', description: 'Resumos objetivos das matérias mais cobradas.', icon: 'BookOpen', href: '/loja?tipo=resumo' },
  { id: 'jogos', title: 'Jogos Pedagógicos', description: 'Aprenda brincando com nossos jogos educativos.', icon: 'Gamepad2', href: '/loja?tipo=jogo' },
]

export const STORE_PRODUCTS = [
  { id: 1, name: 'Apostila Completa - Matemática', description: 'Todas as fórmulas e exercícios resolvidos.', price: 'R$ 49,90', category: 'PDF' },
  { id: 2, name: 'Kit Mapas Mentais - Ciências', description: '30 mapas mentais de Biologia, Química e Física.', price: 'R$ 39,90', category: 'PDF' },
  { id: 3, name: 'Jogo Pedagógico - Tabuada', description: 'Jogo interativo para fixar a tabuada.', price: 'R$ 29,90', category: 'Jogo' },
  { id: 4, name: 'Resumão ENEM 2026', description: 'Resumo completo de todas as áreas do ENEM.', price: 'R$ 59,90', category: 'PDF' },
  { id: 5, name: 'Apostila de Redação', description: 'Técnicas e modelos prontos para nota 1000.', price: 'R$ 34,90', category: 'PDF' },
  { id: 6, name: 'Flashcards - História do Brasil', description: '100 flashcards para revisar história.', price: 'R$ 19,90', category: 'Jogo' },
]
