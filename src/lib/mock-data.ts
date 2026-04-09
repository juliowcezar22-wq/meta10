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

export const TESTIMONIALS = [
  {
    id: 1,
    name: 'Ana Silva',
    role: 'Aluna do 9º ano',
    text: 'A META 10 transformou minha forma de estudar. Os simulados me ajudaram muito na preparação para as provas!',
    rating: 5,
  },
  {
    id: 2,
    name: 'Carlos Oliveira',
    role: 'Aluno do 2º ano EM',
    text: 'Os mapas mentais são incríveis. Consigo revisar matéria em minutos e fixar o conteúdo de verdade.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dra. Maria Santos',
    role: 'Mãe de aluno',
    text: 'Como mãe, fico tranquila sabendo que meu filho tem acesso a material de qualidade. Recomendo!',
    rating: 5,
  },
]
