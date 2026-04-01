import React from 'react'

// Mock das constantes. No seu projeto real, descomente a linha abaixo:
// import { INSTAGRAM_LINK, YOUTUBE_LINK, WHATSAPP_LINK, EMAIL_LINK } from '@/lib/constants'
const INSTAGRAM_LINK = "#"
const YOUTUBE_LINK = "#"
const WHATSAPP_LINK = "#"
const EMAIL_LINK = "mailto:contato@meta10.com.br"

export default function SobrePage() {
  const metodos = [
    {
      title: 'Aprendizado Ativo',
      description: 'Estudante no centro do processo, resolvendo questões e simulados que reforçam o conteúdo de forma prática.',
      icon: 'fa-solid fa-brain',
      iconColor: 'text-[#F1781F]',
      bgLight: 'bg-[#F1781F]/10',
    },
    {
      title: 'Material Curado',
      description: 'Conteúdo selecionado e organizado por especialistas, eliminando a sobrecarga de informações e focando no essencial.',
      icon: 'fa-solid fa-book-open',
      iconColor: 'text-blue-600',
      bgLight: 'bg-blue-600/10',
    },
    {
      title: 'Acompanhamento',
      description: 'Indicadores de progresso e feedback constante para que o aluno saiba exatamente onde melhorar.',
      icon: 'fa-solid fa-chart-line',
      iconColor: 'text-purple-600',
      bgLight: 'bg-purple-600/10',
    },
  ]

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap');
      `}} />

      {/* Container principal forçando a fonte Poppins */}
      <div style={{ fontFamily: "'Poppins', sans-serif" }} className="antialiased text-gray-800">

        {/* Importando FontAwesome via CDN para funcionar nativamente com as tags <i> */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />

        {/* =======================================
            1. HERO SECTION (Mantida a humanizada)
            ======================================= */}
        <section className="relative bg-slate-900 py-24 lg:py-32 overflow-hidden">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#F1781F]/20 rounded-full blur-[120px] -z-0 transform translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -z-0 transform -translate-x-1/3 translate-y-1/3" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <span className="inline-block py-1 px-4 rounded-full bg-white/10 text-[#F1781F] text-sm font-semibold tracking-wider uppercase mb-6 border border-white/10 backdrop-blur-sm">
              Muito prazer!
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Somos a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F1781F] to-[#fabb84]">META 10</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed font-light">
              Um espaço criado para descomplicar os estudos, tirar o peso das costas e ajudar você a alcançar seus objetivos no seu ritmo.
            </p>
          </div>
        </section>

        {/* =======================================
            2. QUEM SOMOS (Sua Copy Original)
            ======================================= */}
        <section className="relative py-20 lg:py-28 bg-white overflow-hidden">

          {/* Fundo com Imagem */}
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.05] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/backgroundsobre.jpg')" }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

              <div className="order-2 lg:order-1">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 relative inline-block">
                  Quem Somos
                  <span className="absolute -bottom-2 left-0 w-12 h-1.5 bg-[#F1781F] rounded-full"></span>
                </h2>

                <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                  <p>
                    A META 10 nasceu da paixão por educação e da vontade de tornar o reforço escolar acessível a todos os estudantes.
                  </p>
                  <p>
                    Somos uma equipe de educadores, designers e tecnólogos comprometidos em criar materiais de estudo que realmente fazem a diferença na vida dos alunos.
                  </p>
                  <div className="p-6 bg-white border-l-4 border-[#F1781F] shadow-sm rounded-r-2xl text-gray-700">
                    <p className="italic">
                      Acreditamos que cada aluno tem potencial para alcançar nota 10 - e nosso papel é fornecer as ferramentas certas para essa jornada.
                    </p>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 relative group">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#F1781F]/20 to-slate-200 rounded-[2.5rem] transform translate-x-4 translate-y-4 -z-10 transition-transform duration-500 group-hover:translate-x-6 group-hover:translate-y-6"></div>
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-black/10 aspect-[4/3] sm:aspect-square bg-gray-100">
                  {/* Substitua no seu projeto por <Image src="/seçaosobre.jpeg" fill className="object-cover" /> */}
                  <img
                    src="/seçaosobre.jpeg"
                    alt="Equipe META 10"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =======================================
            3. NOSSO MÉTODO (Sua Copy Original)
            ======================================= */}
        <section className="relative py-20 lg:py-28 bg-gray-50 border-y border-gray-100 overflow-hidden">

          {/* Fundo com Imagem */}
          <div 
            className="absolute inset-0 pointer-events-none z-0 opacity-[0.05] bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/backgroundsobre.jpg')" }}
          />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Nosso Método
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
                Uma abordagem comprovada para maximizar o aprendizado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              {metodos.map((item) => (
                <div
                  key={item.title}
                  className="bg-white/90 backdrop-blur-sm p-10 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group flex flex-col items-center text-center"
                >
                  <div className={`w-16 h-16 ${item.bgLight} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <i className={`${item.icon} text-2xl ${item.iconColor}`}></i>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* =======================================
            4. LOCALIZAÇÃO (Mantida Original)
            ======================================= */}
        <section className="relative py-20 lg:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

            <div className="text-center mb-16 lg:mb-20">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Onde Estamos
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

              <div className="rounded-[2rem] overflow-hidden shadow-2xl shadow-black/10 border-4 border-white ring-1 ring-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3899.0294502646957!2d-38.90761412330957!3d-12.246285188006322!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x71437bfdaeb5cd9%3A0xd18ae05b1b8014e2!2sMeta%2010%20Espa%C3%A7o%20Pedag%C3%B3gico%20Refor%C3%A7o%20Escolar!5e0!3m2!1spt-BR!2sbr!4v1775011916082!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="480"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização META 10"
                  className="w-full grayscale-[10%] contrast-[1.05] hover:grayscale-0 transition-all duration-500"
                />
              </div>

              <div className="flex flex-col space-y-4">
                <div className="group flex items-center gap-5 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-[#F1781F]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#F1781F] transition-colors duration-300">
                    <i className="fa-solid fa-map-marker-alt text-2xl text-[#F1781F] group-hover:text-white transition-colors"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Endereço</h3>
                    <p className="text-gray-600 text-sm md:text-base">Endereço do espaço pedagógico<br />Cidade - Estado, CEP</p>
                  </div>
                </div>

                <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-[#25D366]/5 hover:border-[#25D366]/30 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-[#25D366]/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#25D366] transition-colors duration-300">
                    <i className="fa-brands fa-whatsapp text-3xl text-[#25D366] group-hover:text-white transition-colors"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">WhatsApp</h3>
                    <p className="text-gray-600 text-sm md:text-base group-hover:text-[#25D366] transition-colors">(00) 00000-0000</p>
                  </div>
                </a>

                <a href={EMAIL_LINK} className="group flex items-center gap-5 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-blue-50 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                  <div className="w-14 h-14 bg-blue-600/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 transition-colors duration-300">
                    <i className="fa-solid fa-envelope text-2xl text-blue-600 group-hover:text-white transition-colors"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">E-mail</h3>
                    <p className="text-gray-600 text-sm md:text-base group-hover:text-blue-600 transition-colors">contato@meta10.com.br</p>
                  </div>
                </a>

                <div className="flex gap-4 mt-2">
                  <a href={INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 group flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#bc1888] hover:shadow-lg transition-all duration-300">
                    <i className="fa-brands fa-instagram text-2xl text-gray-400 group-hover:text-white transition-colors"></i>
                    <span className="font-semibold text-gray-600 group-hover:text-white text-xs uppercase tracking-wide">Instagram</span>
                  </a>

                  <a href={YOUTUBE_LINK} target="_blank" rel="noopener noreferrer" className="flex-1 group flex flex-col items-center justify-center gap-2 p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-[#FF0000] hover:shadow-lg transition-all duration-300">
                    <i className="fa-brands fa-youtube text-2xl text-gray-400 group-hover:text-white transition-colors"></i>
                    <span className="font-semibold text-gray-600 group-hover:text-white text-xs uppercase tracking-wide">YouTube</span>
                  </a>
                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </>
  )
}