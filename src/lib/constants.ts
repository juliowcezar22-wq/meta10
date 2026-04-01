export const WHATSAPP_NUMBER = '5500000000000'
export const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}`
export const INSTAGRAM_LINK = 'https://instagram.com/meta10espacopedagogico'
export const YOUTUBE_LINK = 'https://youtube.com/@meta10espacopedagogico'
export const EMAIL_LINK = 'mailto:contato@meta10.com.br'

export const HOTMART_LINKS = {
  mensal: 'https://pay.hotmart.com/placeholder-mensal',
  semestral: 'https://pay.hotmart.com/placeholder-semestral',
  anual: 'https://pay.hotmart.com/placeholder-anual',
}

export const GOOGLE_MAPS_EMBED = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975!2d-46.6!3d-23.55!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAwLjAiUyA0NsKwMzYnMDAuMCJX!5e0!3m2!1spt-BR!2sbr!4v1234567890'

export const YOUTUBE_VIDEO_ID = 'dQw4w9WgXcQ'
export const YOUTUBE_SHORTS = ['dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'dQw4w9WgXcQ', 'dQw4w9WgXcQ']

export const PLANS = [
  {
    id: 'mensal',
    name: 'Mensal',
    price: 'R$ 29,90',
    period: '/mês',
    features: ['Acesso a todos os PDFs', 'Banco de questões ilimitado', 'Simulados mensais', 'Mapas mentais exclusivos', 'Resumos por disciplina'],
    highlighted: false,
    link: HOTMART_LINKS.mensal,
  },
  {
    id: 'semestral',
    name: 'Semestral',
    price: 'R$ 24,90',
    period: '/mês',
    total: 'R$ 149,40 a cada 6 meses',
    features: ['Tudo do plano Mensal', 'Simulados semanais', 'Acompanhamento de desempenho', 'Conteúdo prioritário', 'Suporte por WhatsApp'],
    highlighted: true,
    link: HOTMART_LINKS.semestral,
  },
  {
    id: 'anual',
    name: 'Anual',
    price: 'R$ 19,90',
    period: '/mês',
    total: 'R$ 238,80 por ano',
    features: ['Tudo do plano Semestral', 'Acesso vitalício ao material', 'Mentoria individual mensal', 'Certificados de conclusão', 'Grupo exclusivo de alunos'],
    highlighted: false,
    link: HOTMART_LINKS.anual,
  },
]

export const MATERIALS = [
  { id: 'questoes', title: 'Banco de Questões', description: 'Milhares de questões organizadas por disciplina e tema.', icon: 'ListChecks' },
  { id: 'simulados', title: 'Simulados', description: 'Simulados completos com correção automática e comentários.', icon: 'ClipboardCheck' },
  { id: 'pdfs', title: 'PDFs', description: 'Apostilas, listas de exercícios e materiais complementares.', icon: 'FileText' },
  { id: 'mapas', title: 'Mapas Mentais', description: 'Mapas visuais para organizar e fixar o conteúdo.', icon: 'Network' },
  { id: 'resumos', title: 'Resumos', description: 'Resumos objetivos das matérias mais cobradas.', icon: 'BookOpen' },
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

export const MOCK_QUESTIONS = [
  {
    id: 1,
    discipline: 'Matemática',
    question: 'Qual é o valor de x na equação 2x + 6 = 18?',
    options: ['x = 4', 'x = 6', 'x = 8', 'x = 10', 'x = 12'],
    correct: 1,
    comment: 'Para resolver: 2x + 6 = 18 → 2x = 12 → x = 6. Isolamos a variável subtraindo 6 de ambos os lados e depois dividimos por 2.',
  },
  {
    id: 2,
    discipline: 'Português',
    question: 'Na frase "Os alunos estudaram muito", o sujeito é:',
    options: ['muito', 'estudaram', 'Os alunos', 'Os alunos estudaram', 'Não há sujeito'],
    correct: 2,
    comment: '"Os alunos" é o sujeito simples da oração, pois é o termo que pratica a ação de estudar. "Estudaram" é o predicado.',
  },
  {
    id: 3,
    discipline: 'Ciências',
    question: 'Qual é a unidade de medida de força no Sistema Internacional?',
    options: ['Joule (J)', 'Watt (W)', 'Newton (N)', 'Pascal (Pa)', 'Metro (m)'],
    correct: 2,
    comment: 'A unidade de força no SI é o Newton (N), em homenagem a Isaac Newton. 1 N = 1 kg·m/s².',
  },
]

export const MOCK_PDFS = [
  { id: 1, title: 'Apostila de Matemática - Álgebra', discipline: 'Matemática', type: 'PDF', pages: 45, premium: false },
  { id: 2, title: 'Resumo - Revolução Francesa', discipline: 'História', type: 'PDF', pages: 12, premium: false },
  { id: 3, title: 'Lista de Exercícios - Trigonometria', discipline: 'Matemática', type: 'PDF', pages: 20, premium: true },
  { id: 4, title: 'Apostila de Física - Cinemática', discipline: 'Física', type: 'PDF', pages: 38, premium: true },
  { id: 5, title: 'Resumo - Tabela Periódica', discipline: 'Química', type: 'PDF', pages: 8, premium: true },
  { id: 6, title: 'Mapa Mental - Ecossistemas', discipline: 'Biologia', type: 'PDF', pages: 2, premium: false },
]

export const MOCK_MINDMAPS = [
  { id: 1, title: 'Mapa Mental - Equações', discipline: 'Matemática', premium: false },
  { id: 2, title: 'Mapa Mental - Era Vargas', discipline: 'História', premium: true },
  { id: 3, title: 'Mapa Mental - Leis de Newton', discipline: 'Física', premium: true },
  { id: 4, title: 'Mapa Mental - Cadeias Alimentares', discipline: 'Biologia', premium: false },
]

export const MOCK_SUMMARIES = [
  { id: 1, title: 'Resumo - Funções Orgânicas', discipline: 'Química', pages: 6, premium: false },
  { id: 2, title: 'Resumo - Literatura Modernista', discipline: 'Português', pages: 10, premium: true },
  { id: 3, title: 'Resumo - Genética Básica', discipline: 'Biologia', pages: 8, premium: true },
  { id: 4, title: 'Resumo - Geometria Analítica', discipline: 'Matemática', pages: 5, premium: false },
]

export const MOCK_STATS = {
  questionsSolved: 127,
  quizzesCompleted: 8,
  studyHours: 23,
  avgScore: 78,
}
