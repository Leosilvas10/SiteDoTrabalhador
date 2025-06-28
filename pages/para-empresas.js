import React, { useState } from 'react'
import Head from 'next/head'

const ParaEmpresas = () => {
  const [openFaq, setOpenFaq] = useState(null)

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const faqs = [
    {
      question: "Como faço para cadastrar uma vaga?",
      answer: "Basta clicar em 'Publique Sua Vaga Agora!', preencher o formulário com os detalhes da oportunidade e seguir as instruções. É um processo rápido e intuitivo."
    },
    {
      question: "É gratuito anunciar vagas?",
      answer: "Sim, o cadastro e a publicação de vagas são completamente gratuitos. Você pode começar a contratar imediatamente sem custos."
    },
    {
      question: "Como recebo os currículos dos candidatos?",
      answer: "As candidaturas são enviadas diretamente para o seu painel de controle na plataforma. Você será notificado por e-mail a cada nova candidatura."
    },
    {
      question: "Posso filtrar os candidatos?",
      answer: "Sim, você pode configurar filtros na sua vaga para receber apenas candidatos que atendam aos seus requisitos de experiência, localização, etc."
    },
    {
      question: "Vocês fazem a triagem dos candidatos?",
      answer: "Nossa plataforma atrai profissionais qualificados e incentivamos que você verifique as informações dos candidatos durante o processo de seleção."
    },
    {
      question: "Como entro em contato com os candidatos?",
      answer: "Após analisar os perfis, você pode entrar em contato diretamente com os candidatos selecionados através das informações de contato fornecidas por eles (e-mail ou telefone)."
    }
  ]

  return (
    <div className="page-white-bg min-h-screen">
      <Head>
        <title>Para Empresas: Encontre os Melhores Talentos para Sua Casa ou Empresa | Site do Trabalhador</title>
        <meta name="description" content="Contrate doméstica, porteiro, cuidador, limpeza e mais profissionais qualificados. Processo ágil e seguro para empresas e famílias em todo o Brasil." />
        <meta name="keywords" content="contratar doméstica, vagas para porteiro, recrutamento simples, contratar cuidador, serviços domésticos, empresas" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/site-do-trabalhador.ico" />
      </Head>

      {/* Hero Section */}
      <section className="bg-govblue-600 relative overflow-hidden border-b-4 border-govyellow-400">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Encontre os Melhores Talentos para Sua Casa ou Empresa. Contrate com Agilidade e Segurança!
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-blue-100 mb-8">
              Simplifique sua contratação e conecte-se a profissionais qualificados em todo o Brasil.
            </h2>
            
            <div className="max-w-4xl mx-auto space-y-6 text-lg text-blue-100">
              <p>
                Sabemos como pode ser desafiador encontrar o profissional certo para as suas necessidades. Seja você uma família buscando uma <strong>doméstica de confiança</strong>, uma <strong>cuidadora dedicada</strong>, ou uma empresa precisando de um <strong>porteiro atencioso</strong> ou uma <strong>equipe de limpeza eficiente</strong>, nosso portal foi feito para você.
              </p>
              <p>
                Chega de processos burocráticos e demorados! Oferecemos uma plataforma intuitiva e uma rede de talentos verificados, prontos para a sua vaga. <strong>Economize tempo, minimize riscos e faça a escolha certa.</strong>
              </p>
            </div>

            <div className="mt-10">
              <a 
                href="#cta-principal" 
                className="bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg inline-block"
              >
                📢 Publique sua Vaga
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Vantagens */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-govgray-800 mb-4">
            Vantagens de Anunciar Suas Vagas Conosco
          </h2>
          <p className="text-lg text-govgray-600 max-w-3xl mx-auto">
            Descubra por que empresas e famílias escolhem nossa plataforma para encontrar os melhores profissionais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Vantagem 1 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-govblue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Agilidade na Contratação</h3>
              <p className="text-govgray-600">
                Publique sua vaga em poucos minutos e comece a receber currículos de candidatos interessados rapidamente.
              </p>
            </div>
          </div>

          {/* Vantagem 2 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-govgreen-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Profissionais Qualificados</h3>
              <p className="text-govgray-600">
                Nossa base de dados conta com um grande número de candidatos com experiência e referências, prontos para atender suas expectativas.
              </p>
            </div>
          </div>

          {/* Vantagem 3 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-govyellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🇧🇷</span>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Cobertura Nacional</h3>
              <p className="text-govgray-600">
                Alcance talentos em todo o Brasil, ou foque em sua região para encontrar quem está perto de você.
              </p>
            </div>
          </div>

          {/* Vantagem 4 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-govblue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">💻</span>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Facilidade de Uso</h3>
              <p className="text-govgray-600">
                Nosso sistema é intuitivo e fácil de usar, tanto para publicar quanto para gerenciar suas vagas e candidatos.
              </p>
            </div>
          </div>

          {/* Vantagem 5 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-govgreen-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🔒</span>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Segurança e Confiança</h3>
              <p className="text-govgray-600">
                Priorizamos a segurança dos seus dados e dos candidatos. Informações claras e transparentes em todo o processo.
              </p>
            </div>
          </div>

          {/* Vantagem 6 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-govgray-200 hover:shadow-xl transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-govyellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">🤝</span>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Suporte Dedicado</h3>
              <p className="text-govgray-600">
                Conte com nossa equipe para tirar dúvidas e ajudar no que precisar durante sua busca.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Como Funciona */}
      <section className="bg-govgray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-govgray-800 mb-4">
              Contratar o Profissional Ideal é Fácil Assim
            </h2>
            <p className="text-lg text-govgray-600 max-w-3xl mx-auto">
              Em apenas 3 passos simples, você encontra e contrata o profissional perfeito para suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-govblue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl font-bold">1</span>
                </div>
                <div className="absolute top-10 left-1/2 transform translate-x-1/2 hidden md:block">
                  <div className="w-32 h-1 bg-govblue-300"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Cadastre sua Vaga</h3>
              <p className="text-govgray-600">
                Preencha um formulário simples com os detalhes da vaga, requisitos e benefícios. <strong>Leva menos de 5 minutos!</strong>
              </p>
            </div>

            {/* Passo 2 */}
            <div className="text-center">
              <div className="relative">
                <div className="w-20 h-20 bg-govgreen-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-3xl font-bold">2</span>
                </div>
                <div className="absolute top-10 left-1/2 transform translate-x-1/2 hidden md:block">
                  <div className="w-32 h-1 bg-govgreen-300"></div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Receba Candidaturas</h3>
              <p className="text-govgray-600">
                Candidatos interessados e com o perfil ideal se aplicarão à sua vaga. <strong>Acesse os currículos e perfis diretamente em seu painel.</strong>
              </p>
            </div>

            {/* Passo 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-govyellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold text-govgray-800 mb-3">Contrate com Sucesso</h3>
              <p className="text-govgray-600">
                Entre em contato com os candidatos que mais se destacam, realize entrevistas e <strong>faça a sua melhor escolha!</strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Principal */}
      <section id="cta-principal" className="bg-govblue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para Encontrar seu Próximo Colaborador?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Dê o primeiro passo para uma contratação eficiente e sem preocupações. Clique no botão abaixo e comece agora mesmo a publicar suas vagas.
          </p>
          
          <div className="space-y-4">
            <a 
              href="/publicar-vaga" 
              className="bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg inline-block mr-4"
            >
              📢 Publique sua Vaga
            </a>
            <br className="md:hidden" />
            <a 
              href="/cadastrar-empresa" 
              className="bg-white hover:bg-gray-100 text-govblue-600 font-bold py-4 px-8 rounded-lg text-xl transition-colors shadow-lg inline-block border-2 border-white"
            >
              🏢 CADASTRAR EMPRESA
            </a>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-govgray-800 mb-4">
            Perguntas Frequentes de Empresas e Famílias
          </h2>
          <p className="text-lg text-govgray-600">
            Tire suas dúvidas sobre como funciona nossa plataforma
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg border border-govgray-200">
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-govgray-50 rounded-lg transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="font-semibold text-govgray-800">{faq.question}</h3>
                <span className="text-govblue-600 text-xl">
                  {openFaq === index ? '−' : '+'}
                </span>
              </button>
              
              {openFaq === index && (
                <div className="px-6 pb-4">
                  <p className="text-govgray-600 leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contato Final */}
      <section className="bg-govgray-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-govgray-800 mb-4">
            Ainda com Dúvidas ou Precisa de Ajuda Personalizada?
          </h3>
          <p className="text-lg text-govgray-600 mb-8 max-w-2xl mx-auto">
            Nossa equipe está à disposição para te auxiliar em todas as etapas da sua busca por talentos. Fale conosco!
          </p>
          
          <div className="space-x-4">
            <a 
              href="/contato" 
              className="bg-govblue-600 hover:bg-govblue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg inline-block"
            >
              💬 FALE COM NOSSA EQUIPE COMERCIAL
            </a>
            <a 
              href="https://wa.me/5531999999999" 
              target="_blank"
              rel="noopener noreferrer"
              className="bg-govgreen-600 hover:bg-govgreen-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg inline-block"
            >
              📱 WHATSAPP
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ParaEmpresas
